// app/(tabs)/community.tsx — Community Screen

import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, RefreshControl, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../../theme';
import { useCommunityReports, useVoteReport } from '../../hooks/useCommunityReports';
import { useAuthStore } from '../../stores/authStore';
import { useTranslation } from '../../i18n';
import type { CommunityReport, ReportFilter } from '../../types/report.types';

const formatReportedAt = (iso: string, t: (key: any, params?: any) => string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t('community.just_now');
  if (mins < 60) return t('community.min_ago', { n: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t('community.hour_ago', { n: hours });
  return new Date(iso).toLocaleDateString();
};

function PostCard({
  post,
  onPress,
  onVote,
  onComment,
  onShare,
}: {
  post: CommunityReport;
  onPress: () => void;
  onVote: () => void;
  onComment: () => void;
  onShare: () => void;
}) {
  const { t } = useTranslation();

  let reportLabel: string = post.report_type;
  let reportColor: string = C.blue;
  let reportBg: string = C.blueTint;

  if (post.report_type === 'DELAY') {
    reportLabel = `${post.delay_minutes ?? '?'} min delay`;
    reportColor = C.red;
    reportBg = C.redTint;
  } else if (post.report_type === 'CROWD') {
    reportLabel = `Crowding: ${post.crowd_level ?? 'High'}`;
    reportColor = C.orange;
    reportBg = C.orangeTint;
  }

  const isTrusted = post.user?.is_trusted ?? false;

  return (
    <TouchableOpacity style={s.postCard} onPress={onPress} activeOpacity={0.9}>
      {/* User row */}
      <View style={s.userRow}>
        <View style={s.avatar} />
        <View style={{ flex: 1 }}>
          <View style={s.userNameRow}>
            <Text style={s.userName}>{post.user?.display_name ?? 'Anonymous'}</Text>
            {isTrusted && (
              <View style={[s.badge, { backgroundColor: C.greenTint }]}>
                <Text style={[s.badgeText, { color: C.green }]}>{t('community.trusted_reporter')}</Text>
              </View>
            )}
          </View>
          <Text style={s.trainRef}>{post.train?.name_en ?? ''} {post.train ? '#' + post.train.number : ''}</Text>
          <Text style={s.routeRef}>{post.station?.name_en ?? ''}  •  {formatReportedAt(post.reported_at, t)}</Text>
        </View>
        <Text style={[s.postTime, { color: C.text2 }]}>{formatReportedAt(post.reported_at, t)}</Text>
      </View>

      <View style={s.divider} />

      {/* Report type */}
      <View style={[s.reportTag, { backgroundColor: reportBg }]}>
        <View style={[s.reportDot, { backgroundColor: reportColor }]} />
        <Text style={[s.reportLabel, { color: reportColor }]}>{reportLabel}</Text>
      </View>

      <Text style={s.postDesc}>{post.description ?? ''}</Text>
      {post.photo_url ? <View style={s.postPhoto} /> : null}
      <Text style={s.confirmedText}>{post.verification_count} travelers confirmed</Text>
      <Text style={s.commentCountText}>{post.comment_count} comments</Text>

      <View style={s.divider} />

      {/* Actions */}
      <View style={s.postActions}>
        <TouchableOpacity style={s.voteRow} onPress={onVote}>
          <View style={[s.voteUp, post.current_user_vote === 'CONFIRM' ? { backgroundColor: C.green } : {}]} />
          <Text style={s.voteCount}>{post.helpful_count}</Text>
          <View style={s.voteDown} />
        </TouchableOpacity>
        <TouchableOpacity style={s.actionBtn} onPress={onComment}>
          <Text style={s.actionBtnText}>Comment</Text>
        </TouchableOpacity>
        <TouchableOpacity style={s.actionBtn} onPress={onShare}>
          <Text style={s.actionBtnText}>Share</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function CommunityScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, isAuthenticated, isGuest } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'All' | 'Following' | 'My Posts'>('All');
  const [refreshing, setRefreshing] = useState(false);
  const tabs: Array<'All' | 'Following' | 'My Posts'> = ['All', 'Following', 'My Posts'];

  const filter: ReportFilter =
    activeTab === 'My Posts' && user?.id
      ? { userId: user.id }
      : activeTab === 'Following'
      ? { status: 'VERIFIED' }
      : null;

  const { data: reports, isLoading, refetch } = useCommunityReports(filter);
  const voteReport = useVoteReport();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleVote = (
    reportId: string,
    voteType: 'CONFIRM' | 'DISPUTE',
    existingVote: 'CONFIRM' | 'DISPUTE' | null | undefined,
  ) => {
    if (!isAuthenticated && !isGuest) {
      router.push('/auth/login' as any);
      return;
    }
    voteReport.mutate({ reportId, voteType, existingVote: existingVote ?? null, activeFilter: filter });
  };

  const handleShare = async (report: CommunityReport) => {
    const trainName = report.train?.name_en ?? 'Train';
    const message = `${trainName}: ${report.description ?? report.report_type}`;
    await Share.share({ message });
  };

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.headerIcon} />
          <View>
            <Text style={s.title}>Community</Text>
            <Text style={s.subtitle}>Share updates, help fellow travelers</Text>
          </View>
        </View>
        <View style={s.headerRight}>
          <TouchableOpacity style={s.iconBtn} />
          <TouchableOpacity
            style={[s.iconBtn, { backgroundColor: C.green }]}
            onPress={() => router.push('/submit-report' as any)}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={s.tabsRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[s.tab, activeTab === tab && s.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.green} />
        }
      >
        {isLoading && (
          <>
            <View style={{ height: 180, backgroundColor: C.surface, borderRadius: R.lg, opacity: 0.6 }} />
            <View style={{ height: 180, backgroundColor: C.surface, borderRadius: R.lg, opacity: 0.6 }} />
            <View style={{ height: 180, backgroundColor: C.surface, borderRadius: R.lg, opacity: 0.6 }} />
          </>
        )}

        {reports?.length === 0 && !isLoading && (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: S.xxxl }}>
            <Text style={{ color: C.white, fontSize: T.lg, fontWeight: '700', marginBottom: S.sm }}>
              {t('community.empty_title')}
            </Text>
            <Text style={{ color: C.text2, fontSize: T.base, textAlign: 'center' }}>
              {t('community.empty_body')}
            </Text>
          </View>
        )}

        {!isLoading &&
          (reports ?? []).map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPress={() =>
                router.push({ pathname: '/report-detail' as any, params: { id: post.id } })
              }
              onVote={() => handleVote(post.id, 'CONFIRM', post.current_user_vote)}
              onComment={() =>
                router.push({ pathname: '/comments-discussion' as any, params: { report_id: post.id } })
              }
              onShare={() => handleShare(post)}
            />
          ))}

        <View style={s.heroBanner}>
          <View style={s.heroIcon} />
          <View style={{ flex: 1 }}>
            <Text style={s.heroTitle}>Be a Community Hero!</Text>
            <Text style={s.heroSub}>Your updates help thousands of travelers make better journey decisions.</Text>
          </View>
          <TouchableOpacity style={s.heroBtn} onPress={() => router.push('/submit-report' as any)}>
            <Text style={s.heroBtnText}>Submit Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.lg, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: S.xl, paddingVertical: S.md },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  headerIcon: { width: 28, height: 28, backgroundColor: C.greenTint, borderRadius: 14 },
  title: { fontSize: T.lg, fontWeight: '700', color: C.white },
  subtitle: { fontSize: T.sm, color: C.text2, marginTop: 1 },
  headerRight: { flexDirection: 'row', gap: S.sm },
  iconBtn: { width: 36, height: 36, backgroundColor: C.surface2, borderRadius: 18 },
  tabsRow: { flexDirection: 'row', marginHorizontal: S.xl, backgroundColor: C.surface, borderRadius: R.md, borderWidth: 1, borderColor: C.border },
  tab: { flex: 1, paddingVertical: S.md, alignItems: 'center', borderRadius: R.md },
  tabActive: { backgroundColor: C.green },
  tabText: { fontSize: T.base, fontWeight: '500', color: C.text2 },
  tabTextActive: { fontWeight: '700', color: C.bg },
  postCard: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.lg, gap: S.md },
  userRow: { flexDirection: 'row', alignItems: 'flex-start', gap: S.sm },
  avatar: { width: 40, height: 40, backgroundColor: C.surface2, borderRadius: 20 },
  userNameRow: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  userName: { fontSize: T.base, fontWeight: '700', color: C.white },
  badge: { borderRadius: 20, paddingHorizontal: S.sm, paddingVertical: 3 },
  badgeText: { fontSize: T.xs, fontWeight: '600' },
  trainRef: { fontSize: T.sm, fontWeight: '600', color: C.text2, marginTop: 2 },
  routeRef: { fontSize: T.xs, color: C.text3, marginTop: 1 },
  postTime: { fontSize: T.sm, fontWeight: '600' },
  divider: { height: 1, backgroundColor: C.border },
  reportTag: { flexDirection: 'row', alignItems: 'center', gap: S.sm, borderRadius: 8, paddingHorizontal: S.sm, paddingVertical: 6, alignSelf: 'flex-start' },
  reportDot: { width: 16, height: 16, borderRadius: 8 },
  reportLabel: { fontSize: T.base, fontWeight: '700' },
  postDesc: { fontSize: T.sm, color: C.text2, lineHeight: 20 },
  postPhoto: { width: '100%', height: 100, backgroundColor: C.surface2, borderRadius: R.md },
  confirmedText: { fontSize: T.sm, color: C.green },
  commentCountText: { fontSize: T.sm, color: C.text3 },
  postActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  voteRow: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  voteUp: { width: 20, height: 20, backgroundColor: C.greenTint, borderRadius: 10 },
  voteCount: { fontSize: T.sm, fontWeight: '600', color: C.green },
  voteDown: { width: 20, height: 20, backgroundColor: C.surface2, borderRadius: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: S.xs },
  actionBtnText: { fontSize: T.sm, color: C.text2 },
  heroBanner: { backgroundColor: C.greenTint, borderRadius: R.lg, borderWidth: 1, borderColor: C.greenDark, padding: S.lg, flexDirection: 'row', alignItems: 'center', gap: S.md },
  heroIcon: { width: 44, height: 44, backgroundColor: C.greenDark, borderRadius: 22 },
  heroTitle: { fontSize: T.base, fontWeight: '700', color: C.green },
  heroSub: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  heroBtn: { backgroundColor: C.green, borderRadius: 10, paddingHorizontal: S.md, paddingVertical: S.sm },
  heroBtnText: { fontSize: T.sm, fontWeight: '700', color: C.bg },
});
