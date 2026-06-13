// api/community.ts
//
// All Supabase interactions for the Community feature.
// No business logic here — only data access.

import * as FileSystem from 'expo-file-system';
import supabase from '../../lib/supabase';
import type {
  CommunityReport,
  ReportFilter,
  ReportSubmitData,
  StationOption,
  TrainOption,
  VoteType,
} from '../types/report.types';

// ─── Reports ─────────────────────────────────────────────────────────────────

/**
 * Fetch the latest 30 ACTIVE reports, optionally filtered by type.
 * Joins users, trains, and stations for display.
 */
export async function getCommunityReports(
  filter?: ReportFilter,
): Promise<CommunityReport[]> {
  let query = supabase
    .from('community_reports')
    .select(
      `
      id,
      user_id,
      train_id,
      station_id,
      report_type,
      delay_minutes,
      crowd_level,
      coach_number,
      condition_rating,
      condition_note,
      photo_url,
      reported_at,
      journey_date,
      status,
      verification_count,
      dispute_count,
      user:users!community_reports_user_id_fkey (
        display_name,
        avatar_url
      ),
      train:trains!community_reports_train_id_fkey (
        name_en,
        name_bn,
        number
      ),
      station:stations!community_reports_station_id_fkey (
        name_en,
        name_bn
      )
      `,
    )
    .in('status', ['ACTIVE', 'VERIFIED'])
    .order('reported_at', { ascending: false })
    .limit(30);

  if (filter) {
    query = query.eq('report_type', filter);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`getCommunityReports: ${error.message}`);
  }

  // Supabase returns joined relations as nested objects.
  // Cast through unknown because the Supabase inferred type doesn't know
  // our exact join aliases — our CommunityReport type is the source of truth.
  return (data ?? []) as unknown as CommunityReport[];
}

/**
 * Fetch the current user's votes for a list of report IDs.
 * Used to hydrate `current_user_vote` on each report client-side.
 */
export async function getUserVotesForReports(
  userId: string,
  reportIds: string[],
): Promise<Record<string, VoteType>> {
  if (reportIds.length === 0) return {};

  const { data, error } = await supabase
    .from('report_votes')
    .select('report_id, vote_type')
    .eq('user_id', userId)
    .in('report_id', reportIds);

  if (error) {
    throw new Error(`getUserVotesForReports: ${error.message}`);
  }

  return Object.fromEntries(
    (data ?? []).map((row) => [row.report_id, row.vote_type as VoteType]),
  );
}

/**
 * Insert a new community report.
 * Caller must be authenticated — enforced by RLS.
 */
export async function submitReport(
  data: ReportSubmitData & { user_id: string },
): Promise<CommunityReport> {
  const { data: inserted, error } = await supabase
    .from('community_reports')
    .insert({
      user_id: data.user_id,
      train_id: data.train_id,
      station_id: data.station_id,
      report_type: data.report_type,
      journey_date: data.journey_date,
      ...(data.delay_minutes != null && { delay_minutes: data.delay_minutes }),
      ...(data.crowd_level && { crowd_level: data.crowd_level }),
      ...(data.coach_number && { coach_number: data.coach_number }),
      ...(data.condition_rating != null && {
        condition_rating: data.condition_rating,
      }),
      ...(data.condition_note && { condition_note: data.condition_note }),
      ...(data.photo_url && { photo_url: data.photo_url }),
    })
    .select()
    .single();

  if (error) {
    throw new Error(`submitReport: ${error.message}`);
  }

  return inserted as unknown as CommunityReport;
}

// ─── Votes ────────────────────────────────────────────────────────────────────

/**
 * Upsert a vote on a report.
 * If the user votes the same type again → the vote is removed (toggle).
 * If the user votes a different type → the vote_type is updated.
 * Caller must be authenticated — enforced by RLS.
 */
export async function voteOnReport(
  reportId: string,
  userId: string,
  voteType: VoteType,
  existingVote: VoteType | null,
): Promise<void> {
  if (existingVote === voteType) {
    // Toggle off: remove the vote
    const { error } = await supabase
      .from('report_votes')
      .delete()
      .eq('report_id', reportId)
      .eq('user_id', userId);

    if (error) throw new Error(`removeVote: ${error.message}`);
    return;
  }

  // Insert or update to new vote type
  const { error } = await supabase.from('report_votes').upsert(
    { report_id: reportId, user_id: userId, vote_type: voteType },
    { onConflict: 'report_id,user_id' },
  );

  if (error) throw new Error(`voteOnReport: ${error.message}`);
}

// ─── Photo Upload ─────────────────────────────────────────────────────────────

/**
 * Upload an image from a local URI to Supabase Storage.
 * Returns the public URL of the uploaded file.
 *
 * expo-image-picker already handles quality compression (quality: 0.8)
 * before we receive the URI, so no additional compression needed here.
 */
export async function uploadReportPhoto(
  userId: string,
  uri: string,
): Promise<string> {
  const timestamp = Date.now();
  const path = `${userId}/${timestamp}.jpg`;

  // Read the file as base64 from the local filesystem
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  // Convert base64 string to a Uint8Array for the Supabase upload
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  const { error } = await supabase.storage
    .from('community-photos')
    .upload(path, bytes, {
      contentType: 'image/jpeg',
      upsert: false,
    });

  if (error) {
    throw new Error(`uploadReportPhoto: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from('community-photos')
    .getPublicUrl(path);

  return urlData.publicUrl;
}

// ─── Train / Station search (for submit sheet selectors) ─────────────────────

export async function searchTrains(query: string): Promise<TrainOption[]> {
  const { data, error } = await supabase
    .from('trains')
    .select('id, name_en, name_bn, number')
    .or(
      `name_en.ilike.%${query}%,name_bn.ilike.%${query}%,number.ilike.%${query}%`,
    )
    .limit(20);

  if (error) throw new Error(`searchTrains: ${error.message}`);
  return (data ?? []) as TrainOption[];
}

export async function searchStations(query: string): Promise<StationOption[]> {
  const { data, error } = await supabase
    .from('stations')
    .select('id, name_en, name_bn')
    .or(`name_en.ilike.%${query}%,name_bn.ilike.%${query}%`)
    .limit(30);

  if (error) throw new Error(`searchStations: ${error.message}`);
  return (data ?? []) as StationOption[];
}
