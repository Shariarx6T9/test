// hooks/useCommunityReports.ts
//
// TanStack Query v5 hooks for community reports.
// Handles fetching, voting (with optimistic updates), and submission.

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  getCommunityReports,
  getUserVotesForReports,
  searchStations,
  searchTrains,
  submitReport,
  uploadReportPhoto,
  voteOnReport,
} from '../api/community';
import { useAuthStore } from '../stores/authStore';
import type {
  CommunityReport,
  ReportFilter,
  ReportSubmitData,
  VoteType,
} from '../types/report.types';

// ─── Query key factory ────────────────────────────────────────────────────────

export const communityKeys = {
  all: ['community_reports'] as const,
  filtered: (filter: ReportFilter) =>
    [...communityKeys.all, filter] as const,
  trains: (query: string) => ['trains_search', query] as const,
  stations: (query: string) => ['stations_search', query] as const,
};

// ─── Feed query ───────────────────────────────────────────────────────────────

/**
 * Fetches reports + merges the current user's own votes into each report
 * so vote buttons can render their active state immediately.
 */
export function useCommunityReports(filter?: ReportFilter) {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: communityKeys.filtered(filter ?? null),
    queryFn: async (): Promise<CommunityReport[]> => {
      const reports = await getCommunityReports(filter);

      // If the user is authenticated, hydrate current_user_vote on each report
      if (user?.id && reports.length > 0) {
        const ids = reports.map((r) => r.id);
        const votesMap = await getUserVotesForReports(user.id, ids);
        return reports.map((r) => ({
          ...r,
          current_user_vote: votesMap[r.id] ?? null,
        }));
      }

      return reports;
    },
    staleTime: 30_000,
  });
}

// ─── Vote mutation (with optimistic update) ───────────────────────────────────

interface VoteVariables {
  reportId: string;
  voteType: VoteType;
  existingVote: VoteType | null;
  activeFilter: ReportFilter;
}

export function useVoteReport() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: ({ reportId, voteType, existingVote }: VoteVariables) => {
      if (!user?.id) throw new Error('Not authenticated');
      return voteOnReport(reportId, user.id, voteType, existingVote);
    },

    // ── Optimistic update ──────────────────────────────────────────────────
    onMutate: async ({ reportId, voteType, existingVote, activeFilter }) => {
      const queryKey = communityKeys.filtered(activeFilter);

      // Cancel in-flight fetches so they don't overwrite our optimistic state
      await queryClient.cancelQueries({ queryKey });

      // Snapshot previous data for rollback
      const previousData =
        queryClient.getQueryData<CommunityReport[]>(queryKey);

      queryClient.setQueryData<CommunityReport[]>(queryKey, (old) => {
        if (!old) return old;
        return old.map((report) => {
          if (report.id !== reportId) return report;

          const isToggleOff = existingVote === voteType;
          const wasConfirm = existingVote === 'CONFIRM';
          const wasDispute = existingVote === 'DISPUTE';

          let verificationCount = report.verification_count;
          let disputeCount = report.dispute_count;

          if (isToggleOff) {
            // Remove the vote
            if (voteType === 'CONFIRM') verificationCount -= 1;
            else disputeCount -= 1;
          } else {
            // Add new vote, remove old one if switching
            if (voteType === 'CONFIRM') {
              verificationCount += 1;
              if (wasDispute) disputeCount -= 1;
            } else {
              disputeCount += 1;
              if (wasConfirm) verificationCount -= 1;
            }
          }

          return {
            ...report,
            verification_count: Math.max(0, verificationCount),
            dispute_count: Math.max(0, disputeCount),
            current_user_vote: isToggleOff ? null : voteType,
          };
        });
      });

      return { previousData, queryKey };
    },

    // ── Rollback on error ──────────────────────────────────────────────────
    onError: (_err, _vars, context) => {
      if (context?.previousData !== undefined) {
        queryClient.setQueryData(context.queryKey, context.previousData);
      }
    },

    // ── Always refetch after settle to stay in sync ────────────────────────
    onSettled: (_data, _err, { activeFilter }) => {
      queryClient.invalidateQueries({
        queryKey: communityKeys.filtered(activeFilter),
      });
    },
  });
}

// ─── Submit report mutation ───────────────────────────────────────────────────

interface SubmitReportVariables {
  data: ReportSubmitData;
  photoUri?: string; // local file URI from expo-image-picker
}

export function useSubmitReport() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  return useMutation({
    mutationFn: async ({ data, photoUri }: SubmitReportVariables) => {
      if (!user?.id) throw new Error('Not authenticated');

      let photo_url: string | undefined;

      if (photoUri) {
        photo_url = await uploadReportPhoto(user.id, photoUri);
      }

      return submitReport({ ...data, user_id: user.id, photo_url });
    },

    onSuccess: () => {
      // Invalidate all filter variants so every tab refreshes
      queryClient.invalidateQueries({ queryKey: communityKeys.all });
    },
  });
}

// ─── Train / Station search hooks (for submit sheet selectors) ────────────────

export function useTrainSearch(query: string) {
  return useQuery({
    queryKey: communityKeys.trains(query),
    queryFn: () => searchTrains(query),
    enabled: query.length >= 1,
    staleTime: 60_000,
  });
}

export function useStationSearch(query: string) {
  return useQuery({
    queryKey: communityKeys.stations(query),
    queryFn: () => searchStations(query),
    enabled: query.length >= 1,
    staleTime: 60_000,
  });
}
