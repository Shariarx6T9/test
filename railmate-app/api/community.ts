// api/community.ts
//
// All Supabase interactions for the Community feature.
// No business logic here — only data access.

import * as FileSystem from 'expo-file-system';
import { supabase } from '../lib/supabase';
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
 * Fetch the latest 30 ACTIVE/VERIFIED reports, with optional filters.
 * ReportFilter is a discriminated object to keep the API extensible:
 *   { type: 'DELAY' }         — filter by report_type
 *   { userId: 'abc-123' }     — filter by author
 *   null                      — no filter (return all)
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
      description,
      delay_minutes,
      crowd_level,
      coach_number,
      condition_rating,
      condition_note,
      photo_url,
      reported_at,
      created_at,
      journey_date,
      status,
      verification_count,
      dispute_count,
      helpful_count,
      comment_count,
      user:users!community_reports_user_id_fkey (
        id,
        display_name,
        avatar_url,
        is_trusted,
        trust_score
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

  // Apply discriminated filter
  if (filter && 'type' in filter) {
    query = query.eq('report_type', filter.type);
  } else if (filter && 'userId' in filter) {
    query = query.eq('user_id', filter.userId);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`getCommunityReports: ${error.message}`);
  }

  return (data ?? []) as unknown as CommunityReport[];
}

// ─── User votes ───────────────────────────────────────────────────────────────

/**
 * Returns a map of reportId → VoteType for the given user + report IDs.
 * Used to hydrate current_user_vote after fetching the feed.
 */
export async function getUserVotesForReports(
  userId: string,
  reportIds: string[],
): Promise<Record<string, VoteType>> {
  const { data, error } = await supabase
    .from('report_votes')
    .select('report_id, vote_type')
    .eq('user_id', userId)
    .in('report_id', reportIds);

  if (error) {
    console.error('getUserVotesForReports:', error.message);
    return {};
  }

  const map: Record<string, VoteType> = {};
  (data ?? []).forEach((row: { report_id: string; vote_type: VoteType }) => {
    map[row.report_id] = row.vote_type;
  });
  return map;
}

// ─── Voting ───────────────────────────────────────────────────────────────────

export async function voteOnReport(
  reportId: string,
  userId: string,
  voteType: VoteType,
  existingVote: VoteType | null,
): Promise<void> {
  if (existingVote === voteType) {
    // Toggle off — delete the existing vote
    const { error } = await supabase
      .from('report_votes')
      .delete()
      .match({ report_id: reportId, user_id: userId });
    if (error) throw new Error(`voteOnReport (delete): ${error.message}`);
  } else {
    // Upsert new vote
    const { error } = await supabase
      .from('report_votes')
      .upsert(
        { report_id: reportId, user_id: userId, vote_type: voteType },
        { onConflict: 'report_id,user_id' },
      );
    if (error) throw new Error(`voteOnReport (upsert): ${error.message}`);
  }
}

// ─── Submit report ───────────────────────────────────────────────────────────

export async function submitReport(
  data: ReportSubmitData & { user_id: string; photo_url?: string },
): Promise<void> {
  const { error } = await supabase.from('community_reports').insert({
    user_id: data.user_id,
    train_id: data.train_id ?? null,
    station_id: data.station_id ?? null,
    report_type: data.report_type,
    description: data.description ?? null,
    delay_minutes: data.delay_minutes ?? null,
    crowd_level: data.crowd_level ?? null,
    photo_url: data.photo_url ?? null,
    journey_date: data.journey_date ?? new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
  });

  if (error) throw new Error(`submitReport: ${error.message}`);
}

// ─── Photo upload ─────────────────────────────────────────────────────────────

export async function uploadReportPhoto(
  userId: string,
  localUri: string,
): Promise<string> {
  const filename = `${userId}/${Date.now()}.jpg`;

  const fileInfo = await FileSystem.getInfoAsync(localUri);
  if (!fileInfo.exists) throw new Error('Photo file not found');

  const base64 = await FileSystem.readAsStringAsync(localUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  const { error } = await supabase.storage
    .from('report-photos')
    .upload(filename, byteArray, { contentType: 'image/jpeg', upsert: true });

  if (error) throw new Error(`uploadReportPhoto: ${error.message}`);

  return supabase.storage.from('report-photos').getPublicUrl(filename).data
    .publicUrl;
}

// ─── Train / station search (for submit sheet selectors) ─────────────────────

export async function searchTrains(query: string): Promise<TrainOption[]> {
  const { data, error } = await supabase
    .from('trains')
    .select('id, name_en, name_bn, number')
    .or(`name_en.ilike.%${query}%,name_bn.ilike.%${query}%,number.ilike.%${query}%`)
    .limit(20);

  if (error) throw new Error(`searchTrains: ${error.message}`);
  return (data ?? []) as TrainOption[];
}

export async function searchStations(query: string): Promise<StationOption[]> {
  const { data, error } = await supabase
    .from('stations')
    .select('id, name_en, name_bn, code')
    .or(`name_en.ilike.%${query}%,name_bn.ilike.%${query}%,code.ilike.%${query}%`)
    .limit(20);

  if (error) throw new Error(`searchStations: ${error.message}`);
  return (data ?? []) as StationOption[];
}

// ─── Comments ─────────────────────────────────────────────────────────────────

export interface ReportComment {
  id: string;
  report_id: string;
  user_id: string;
  body: string;
  created_at: string;
  user: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
    is_trusted: boolean;
  };
}

export async function getReportComments(
  reportId: string,
): Promise<ReportComment[]> {
  const { data, error } = await supabase
    .from('report_comments')
    .select(
      `
      id,
      report_id,
      user_id,
      body,
      created_at,
      user:users!report_comments_user_id_fkey (
        id,
        display_name,
        avatar_url,
        is_trusted
      )
      `,
    )
    .eq('report_id', reportId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(`getReportComments: ${error.message}`);
  return (data ?? []) as unknown as ReportComment[];
}

export async function addReportComment(
  reportId: string,
  userId: string,
  body: string,
): Promise<void> {
  const { error } = await supabase.from('report_comments').insert({
    report_id: reportId,
    user_id: userId,
    body: body.trim(),
  });
  if (error) throw new Error(`addReportComment: ${error.message}`);
}
