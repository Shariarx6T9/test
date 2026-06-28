// app/report-detail.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../theme';
import { supabase } from '../lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { useReportVerifiers, useVoteReport, useReportComments } from '../hooks/useCommunityReports';
import { useAuthStore } from '../stores/authStore';
import { useTranslation } from '../i18n';
import type { CommunityReport } from '../types/report.types';

export default function ReportDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();
  const { user } = useAuthStore();

  const { data: report, isLoading, error, refetch } = useQuery<CommunityReport | null>({
    queryKey: ['report', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('community_reports')
        .select(`id, user_id, train_id, station_id, report_type, description, delay_minutes, crowd_level, coach_number, condition_rating, photo_url, reported_at, journey_date, status, verification_count, dispute_count, helpful_count, comment_count, user:users!community_reports_user_id_fkey(id, display_name, avatar_url, is_trusted, trust_score), train:trains!community_reports_train_id_fkey(name_en, name_bn, number), station:stations!community_reports_station_id_fkey(name_en, name_bn)`)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as unknown as CommunityReport;
    },
    enabled: !!id,
  });

  const { data: verifiers } = useReportVerifiers(id ?? '');
  const { data: comments } = useReportComments(id ?? '');
  const voteReport = useVoteReport();

  const handleVote = (voteType: 'CONFIRM' | 'DISPUTE') => {
    if (!id || !user) return;
    voteReport.mutate({
      reportId: id,
      voteType,
      existingVote: report?.current_user_vote ?? null,
      activeFilter: null,
    });
  };

  if (isLoading) {
    return (
      <SafeAreaView style={rd.root}>
        <View style={rd.header}>
          <TouchableOpacity style={rd.backBtn} onPress={() => router.back()} />
          <Text style={rd.title}>Report Detail</Text>
          <View style={rd.shareBtn} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={C.green} />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={rd.root}>
        <View style={rd.header}>
          <TouchableOpacity style={rd.backBtn} onPress={() => router.back()} />
          <Text style={rd.title}>Report Detail</Text>
          <View style={rd.shareBtn} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: S.md }}>
          <Text style={{ color: C.text2, fontSize: T.base }}>{t('common.error')}</Text>
          <TouchableOpacity style={rd.retryBtn} onPress={() => refetch()}>
            <Text style={rd.retryBtnText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  if (!report) {
    return (
      <SafeAreaView style={rd.root}>
        <View style={rd.header}>
          <TouchableOpacity style={rd.backBtn} onPress={() => router.back()} />
          <Text style={rd.title}>Report Detail</Text>
          <View style={rd.shareBtn} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: C.text2, fontSize: T.base }}>Report not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const reportedAt = report.reported_at
    ? new Date(report.reported_at).toLocaleString('en', { dateStyle: 'medium', timeStyle: 'short' })
    : '';

  const badgeColor = report.report_type === 'DELAY' ? C.red
    : report.report_type === 'CROWD' ? C.orange
    : C.blue;
  const badgeBg = report.report_type === 'DELAY' ? C.redTint
    : report.report_type === 'CROWD' ? C.orangeTint
    : C.blueTint;

  const badgeLabel = report.report_type === 'DELAY' ? 'Delay Report'
    : report.report_type === 'CROWD' ? 'Crowding Report'
    : report.report_type === 'GENERAL' ? 'General Report'
    : report.report_type;

  const top3Verifiers = (verifiers ?? []).slice(0, 3);
  const top3Comments = (comments ?? []).slice(0, 3);

  return (
    <SafeAreaView style={rd.root}>
      <View style={rd.header}>
        <TouchableOpacity style={rd.backBtn} onPress={() => router.back()} />
        <Text style={rd.title}>Report Detail</Text>
        <TouchableOpacity style={rd.shareBtn} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={rd.scroll}>
        {/* Badge + ref */}
        <View style={rd.topRow}>
          <View style={[rd.delayBadge, { backgroundColor: badgeBg }]}>
            <Text style={[rd.delayBadgeText, { color: badgeColor }]}>{badgeLabel}</Text>
          </View>
          <Text style={rd.refNum}>#{report.id.slice(0, 8).toUpperCase()}</Text>
        </View>

        {/* Train info */}
        <View style={rd.card}>
          <View style={rd.trainRow}>
            <View style={rd.trainIcon} />
            <View style={{ flex: 1 }}>
              <Text style={rd.trainName}>
                {report.train?.name_en ?? 'Unknown Train'}
                {report.train ? ` (${report.train.number})` : ''}
              </Text>
              <Text style={rd.trainRoute}>{report.station?.name_en ?? 'Unknown Station'}</Text>
            </View>
            {report.status === 'VERIFIED' && (
              <View style={rd.verifiedBadge}><Text style={rd.verifiedText}>Verified ✓</Text></View>
            )}
          </View>
          <View style={rd.divider} />
          <View style={rd.metaRow}>
            <View>
              <Text style={rd.metaLabel}>Reported{'\n'}
                <Text style={rd.metaValue}>{reportedAt}</Text>
              </Text>
            </View>
            {report.station && (
              <View>
                <Text style={rd.metaLabel}>At Station{'\n'}
                  <Text style={rd.metaValue}>{report.station.name_en}</Text>
                </Text>
              </View>
            )}
            {report.report_type === 'DELAY' && report.delay_minutes != null && (
              <View>
                <Text style={rd.metaLabel}>Delay{'\n'}
                  <Text style={[rd.metaValue, { color: C.red }]}>{report.delay_minutes} min</Text>
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Delay / Crowd info */}
        {(report.report_type === 'DELAY' || report.report_type === 'CROWD') && (
          <View style={rd.card}>
            <Text style={rd.sectionTitle}>
              {report.report_type === 'DELAY' ? 'Delay Information' : 'Crowding Information'}
            </Text>
            <View style={rd.delayRow}>
              {report.report_type === 'DELAY' && (
                <>
                  <View>
                    <Text style={rd.delayLabel}>Reported Delay</Text>
                    <Text style={[rd.delayNum, { color: C.red }]}>{report.delay_minutes ?? '?'} min</Text>
                  </View>
                  {report.coach_number && (
                    <View>
                      <Text style={rd.delayLabel}>Coach</Text>
                      <Text style={[rd.delayNum, { color: C.orange }]}>{report.coach_number}</Text>
                    </View>
                  )}
                </>
              )}
              {report.report_type === 'CROWD' && (
                <View>
                  <Text style={rd.delayLabel}>Crowd Level</Text>
                  <Text style={[rd.delayNum, { color: C.orange }]}>{report.crowd_level ?? 'N/A'}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Description */}
        {report.description ? (
          <View style={rd.card}>
            <Text style={rd.sectionTitle}>Report Description</Text>
            <Text style={rd.description}>{report.description}</Text>
          </View>
        ) : null}

        {/* Verification */}
        <View style={rd.card}>
          <View style={rd.verifyRow}>
            <View>
              <Text style={rd.sectionTitle}>Verification</Text>
              <Text style={rd.verifyCount}>{report.verification_count}</Text>
              <Text style={rd.verifyLabel}>Total Verifications</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: S.sm }}>
              <Text style={rd.verifiedByLabel}>Verified by</Text>
              <View style={{ flexDirection: 'row', gap: 4 }}>
                {top3Verifiers.map((v, i) => (
                  <View key={v.user_id + i} style={rd.verifierAvatar} />
                ))}
                {(verifiers?.length ?? 0) > 3 && (
                  <Text style={{ color: C.text2, fontSize: T.sm }}>+{(verifiers?.length ?? 0) - 3}</Text>
                )}
              </View>
              <View style={{ flexDirection: 'row', gap: 4 }}>
                {[0, 1, 2, 3, 4].map(i => <View key={i} style={rd.checkCircle} />)}
                <Text style={{ color: C.text2, fontSize: T.sm }}>
                  {report.dispute_count > 0 ? `${report.dispute_count} disputes` : ''}
                </Text>
              </View>
              <Text style={{ color: C.white, fontSize: T.sm }}>👍 {report.helpful_count} Helpful Votes</Text>
            </View>
          </View>
        </View>

        {/* Vote buttons */}
        {user && (
          <View style={rd.voteRow}>
            <TouchableOpacity
              style={[rd.voteBtn, { backgroundColor: C.greenTint, borderColor: C.green }]}
              onPress={() => handleVote('CONFIRM')}
            >
              <Text style={[rd.voteBtnText, { color: C.green }]}>✓ Confirm ({report.verification_count})</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[rd.voteBtn, { backgroundColor: C.redTint, borderColor: C.red }]}
              onPress={() => handleVote('DISPUTE')}
            >
              <Text style={[rd.voteBtnText, { color: C.red }]}>✕ Dispute ({report.dispute_count})</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Comments preview */}
        <View style={rd.card}>
          <View style={rd.cardHeader}>
            <Text style={rd.sectionTitle}>Comments Preview</Text>
            <TouchableOpacity
              onPress={() => router.push({ pathname: '/comments-discussion', params: { report_id: id } })}
            >
              <Text style={rd.viewAll}>View All ({report.comment_count})</Text>
            </TouchableOpacity>
          </View>
          {top3Comments.length === 0 ? (
            <Text style={{ color: C.text2, fontSize: T.sm }}>No comments yet.</Text>
          ) : (
            top3Comments.map((c: any, i: number) => (
              <View key={c.id ?? i}>
                <View style={rd.commentRow}>
                  <View style={rd.commentAvatar} />
                  <View style={{ flex: 1, gap: 4 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: S.sm }}>
                      <Text style={rd.commentUser}>{c.user?.display_name ?? 'Anonymous'}</Text>
                      {c.user?.is_trusted && (
                        <View style={[rd.commentBadge, { backgroundColor: C.greenTint }]}>
                          <Text style={[rd.commentBadgeText, { color: C.green }]}>Trusted Reporter</Text>
                        </View>
                      )}
                    </View>
                    <Text style={rd.commentText}>{c.body ?? c.comment ?? ''}</Text>
                    <View style={{ flexDirection: 'row', gap: S.md }}>
                      <Text style={rd.commentTime}>
                        {c.created_at ? new Date(c.created_at).toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </Text>
                    </View>
                  </View>
                </View>
                {i < top3Comments.length - 1 && <View style={rd.divider} />}
              </View>
            ))
          )}
        </View>

        <View style={rd.footerNote}>
          <Text style={rd.footerText}>ℹ Thank you! Your report helps thousands of travelers.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const rd = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.lg, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.xl, paddingVertical: S.md },
  backBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
  title: { fontSize: 17, fontWeight: '700', color: C.white },
  shareBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  delayBadge: { backgroundColor: C.redTint, borderRadius: 20, paddingHorizontal: S.md, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: S.xs },
  delayBadgeText: { fontSize: T.sm, fontWeight: '700', color: C.red },
  refNum: { fontSize: T.sm, color: C.text3 },
  card: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.lg, gap: S.md },
  trainRow: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  trainIcon: { width: 40, height: 40, backgroundColor: C.greenTint, borderRadius: 20 },
  trainName: { fontSize: T.md, fontWeight: '700', color: C.white },
  trainRoute: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  verifiedBadge: { backgroundColor: C.greenTint, borderRadius: 8, paddingHorizontal: S.sm, paddingVertical: 4 },
  verifiedText: { fontSize: T.xs, fontWeight: '700', color: C.green },
  divider: { height: 1, backgroundColor: C.border },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metaLabel: { fontSize: T.sm, color: C.text2, lineHeight: 20 },
  metaValue: { fontSize: T.base, fontWeight: '700', color: C.white },
  sectionTitle: { fontSize: T.md, fontWeight: '700', color: C.white },
  delayRow: { flexDirection: 'row', gap: S.xxxl },
  delayLabel: { fontSize: T.sm, color: C.text2 },
  delayNum: { fontSize: 24, fontWeight: '800', marginTop: 4 },
  verifyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  verifyCount: { fontSize: 28, fontWeight: '800', color: C.white, marginTop: S.sm },
  verifyLabel: { fontSize: T.sm, color: C.text2 },
  verifiedByLabel: { fontSize: T.sm, color: C.text2 },
  verifierAvatar: { width: 28, height: 28, backgroundColor: C.surface2, borderRadius: 14 },
  checkCircle: { width: 22, height: 22, backgroundColor: C.greenTint, borderRadius: 11, borderWidth: 1, borderColor: C.green },
  description: { fontSize: T.sm, color: C.text2, lineHeight: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAll: { fontSize: T.sm, fontWeight: '600', color: C.green },
  commentRow: { flexDirection: 'row', gap: S.md, paddingVertical: S.sm },
  commentAvatar: { width: 36, height: 36, backgroundColor: C.surface2, borderRadius: 18 },
  commentUser: { fontSize: T.sm, fontWeight: '700', color: C.white },
  commentBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  commentBadgeText: { fontSize: T.xs, fontWeight: '600' },
  commentText: { fontSize: T.sm, color: C.text2, lineHeight: 18 },
  commentTime: { fontSize: T.xs, color: C.text3 },
  commentLikes: { fontSize: T.xs, color: C.text2 },
  footerNote: { backgroundColor: C.surface, borderRadius: R.md, borderWidth: 1, borderColor: C.border, padding: S.lg },
  footerText: { fontSize: T.sm, color: C.text2 },
  retryBtn: { backgroundColor: C.green, borderRadius: R.md, paddingHorizontal: S.xl, paddingVertical: S.md },
  retryBtnText: { fontSize: T.base, fontWeight: '700', color: C.bg },
  voteRow: { flexDirection: 'row', gap: S.md },
  voteBtn: { flex: 1, borderRadius: R.md, borderWidth: 1, padding: S.md, alignItems: 'center' },
  voteBtnText: { fontSize: T.base, fontWeight: '700' },
});
