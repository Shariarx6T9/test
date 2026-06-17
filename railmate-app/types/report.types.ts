// types/report.types.ts
// Source-of-truth types for the Community / Reports feature.

export type VoteType = 'CONFIRM' | 'DISPUTE';

export type ReportType =
  | 'DELAY'
  | 'CROWD'
  | 'PLATFORM'
  | 'SCHEDULE'
  | 'GENERAL'
  | 'ACCIDENT';

/**
 * Discriminated filter union passed to getCommunityReports / useQuery.
 *   null              → no filter (all active reports)
 *   { type }          → filter by report_type column
 *   { userId }        → filter by user_id column (My Reports tab)
 */
export type ReportFilter =
  | null
  | { type: ReportType }
  | { userId: string };

export interface CommunityReport {
  id: string;
  user_id: string;
  train_id: string | null;
  station_id: string | null;
  report_type: ReportType;
  description: string | null;
  delay_minutes: number | null;
  crowd_level: string | null;
  coach_number: string | null;
  condition_rating: number | null;
  condition_note: string | null;
  photo_url: string | null;
  reported_at: string;
  created_at: string;
  journey_date: string | null;
  status: 'ACTIVE' | 'VERIFIED' | 'DISPUTED' | 'ARCHIVED';
  verification_count: number;
  dispute_count: number;
  helpful_count: number;
  comment_count: number;
  // Injected client-side by useCommunityReports after fetching user votes
  current_user_vote?: VoteType | null;
  // Joined relations
  user: {
    id: string;
    display_name: string | null;
    avatar_url: string | null;
    is_trusted: boolean;
    trust_score?: number;
  } | null;
  train: {
    name_en: string;
    name_bn: string;
    number: string;
  } | null;
  station: {
    name_en: string;
    name_bn: string;
  } | null;
}

export interface ReportSubmitData {
  train_id?: string | null;
  station_id?: string | null;
  report_type: ReportType;
  description?: string | null;
  delay_minutes?: number | null;
  crowd_level?: string | null;
  journey_date?: string | null;
}

export interface TrainOption {
  id: string;
  name_en: string;
  name_bn: string;
  number: string;
}

export interface StationOption {
  id: string;
  name_en: string;
  name_bn: string;
  code: string;
}
