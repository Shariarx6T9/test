// types/report.types.ts

export type ReportType = 'DELAY' | 'CROWDING' | 'COACH_CONDITION';

export type CrowdLevel = 'EMPTY' | 'MODERATE' | 'FULL' | 'OVERCROWDED';

export type ReportStatus = 'ACTIVE' | 'VERIFIED' | 'DISPUTED' | 'REMOVED';

export type VoteType = 'CONFIRM' | 'DISPUTE';

// ─── Joined shape returned from getCommunityReports ─────────────────────────

export interface ReportUser {
  display_name: string;
  avatar_url: string | null;
}

export interface ReportTrain {
  name_en: string;
  name_bn: string;
  number: string;
}

export interface ReportStation {
  name_en: string;
  name_bn: string;
}

export interface CommunityReport {
  id: string;
  user_id: string | null;        // null if user was deleted (ON DELETE SET NULL)
  train_id: string;
  station_id: string;
  report_type: ReportType;

  // DELAY fields
  delay_minutes?: number | null;

  // CROWDING fields
  crowd_level?: CrowdLevel | null;

  // COACH_CONDITION fields
  condition_rating?: number | null; // 1–5
  condition_note?: string | null;

  // Shared optional fields
  coach_number?: string | null;
  photo_url?: string | null;

  reported_at: string;           // ISO timestamp from Supabase
  journey_date: string;          // YYYY-MM-DD
  status: ReportStatus;
  verification_count: number;
  dispute_count: number;

  // Joined relations
  user: ReportUser | null;
  train: ReportTrain;
  station: ReportStation;

  // Current user's vote — injected client-side after fetching report_votes
  current_user_vote?: VoteType | null;
}

// ─── Payload for submitting a new report ────────────────────────────────────

export interface ReportSubmitData {
  train_id: string;
  station_id: string;
  report_type: ReportType;
  journey_date: string;          // YYYY-MM-DD

  // DELAY
  delay_minutes?: number;

  // CROWDING
  crowd_level?: CrowdLevel;

  // COACH_CONDITION
  condition_rating?: number;
  condition_note?: string;

  // Shared optional
  coach_number?: string;
  photo_url?: string;
}

// ─── Filter alias used by hooks / UI ────────────────────────────────────────

export type ReportFilter = ReportType | null;

// ─── Train / Station search shapes (for selectors in submit sheet) ──────────

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
}
