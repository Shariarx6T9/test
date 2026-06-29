// app/badges-reputation.tsx
import React from 'react';
import { ArrowLeft, Flag, ShieldCheck, Clock, Diamond, Lightning, Star } from 'phosphor-react-native';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../theme';
import { supabase } from '../lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { useTranslation } from '../i18n';

const LEVELS = [
  { num: 1, name: 'Rookie Reporter', range: '0 - 99', done: true, color: C.text2 },
  { num: 2, name: 'Active Reporter', range: '100 - 299', done: true, color: C.green },
  { num: 3, name: 'Reliable Reporter', range: '300 - 599', done: true, color: C.blue },
  { num: 4, name: 'Trusted Reporter', range: '600 - 999', current: true, color: C.purple },
  { num: 5, name: 'Expert Reporter', range: '1000+', color: C.gold },
];

export default function BadgesReputationScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const { data: userBadges, isLoading } = useQuery({
    queryKey: ['user_badges', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('user_badges')
        .select('*')
        .eq('user_id', user.id);
      if (error) return [];
      return data ?? [];
    },
    enabled: !!user?.id,
  });

  // Badge definitions (all possible badges)
  const ALL_BADGES = [
    { key: 'CONTRIBUTOR',    label: t('badges.bronze'), desc: t('badges.desc_bronze'), color: C.orange, Icon: Flag },
    { key: 'VERIFIED',       label: t('badges.silver'), desc: t('badges.desc_silver'), color: C.text2,  Icon: ShieldCheck },
    { key: 'REPORTER',       label: t('badges.gold'),   desc: t('badges.desc_gold'),   color: C.gold,   Icon: Star },
    { key: 'ELITE_REPORTER', label: t('badges.diamond'),desc: t('badges.desc_diamond'),color: C.blue,   Icon: Diamond },
    { key: 'TRUSTED_REPORTER',label: t('badges.green'), desc: t('badges.desc_green'),  color: C.green,  Icon: ShieldCheck },
    { key: 'DELAY_MASTER',   label: t('badges.amber'),  desc: t('badges.desc_amber'),  color: C.orange, Icon: Clock },
    { key: 'SPEED_REPORTER', label: t('badges.speed'),  desc: t('badges.desc_speed'),  color: C.purple, Icon: Lightning },
  ];

  const earnedKeys = new Set((userBadges ?? []).map((b: any) => b.badge_type));
  const reportCount = user?.report_count ?? 0;
  const trustScore = user?.trust_score ?? 0;

  // Progress bar calc
  const nextThreshold = reportCount < 1 ? 1 : reportCount < 10 ? 10 : reportCount < 50 ? 50 : reportCount < 100 ? 100 : 500;
  const prevThreshold = reportCount < 1 ? 0 : reportCount < 10 ? 1 : reportCount < 50 ? 10 : reportCount < 100 ? 50 : 100;
  const progress = Math.min((reportCount - prevThreshold) / (nextThreshold - prevThreshold), 1);

  const earnedCount = ALL_BADGES.filter(b => earnedKeys.has(b.key)).length;
  const inProgressCount = ALL_BADGES.filter(b => !earnedKeys.has(b.key)).length;

  return (
    <SafeAreaView style={br.root}>
      <View style={br.header}>
        <TouchableOpacity style={br.backBtn} onPress={() => router.back()}><ArrowLeft size={18} color={C.white} /></TouchableOpacity>
        <View>
          <Text style={br.title}>{t('badges.title')}</Text>
          <Text style={br.subtitle}>Track your progress and unlock badges</Text>
        </View>
        <TouchableOpacity style={br.infoBtn} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={br.scroll}>
        {/* Trust Score */}
        <View style={br.card}>
          <View style={br.tsRow}>
            <View style={br.tsLeft}>
              <View style={br.tsTitleRow}>
                <Text style={br.tsTitle}>Trust Score</Text>
                <View style={br.tsVerified} />
              </View>
              <View style={br.tsNumRow}>
                <Text style={br.tsNum}>{trustScore}</Text>
                <Text style={br.tsMax}> / 1000</Text>
              </View>
              <Text style={br.tsLevel}>
                {trustScore >= 1000 ? 'Level 5  •  Expert Reporter'
                  : trustScore >= 600 ? 'Level 4  •  Trusted Reporter'
                  : trustScore >= 300 ? 'Level 3  •  Reliable Reporter'
                  : trustScore >= 100 ? 'Level 2  •  Active Reporter'
                  : 'Level 1  •  Rookie Reporter'}
              </Text>
              <View style={br.tsBarBg}>
                <View style={[br.tsBarFill, { width: `${Math.min((trustScore / 1000) * 100, 100)}%` }]} />
              </View>
              <Text style={br.tsProgress}>{Math.max(0, 1000 - trustScore)} points to reach Level 5</Text>
            </View>
            <View style={br.tsStats}>
              {[
                ['Reports', String(reportCount), C.blueTint],
                ['Verifications', String(user?.helpful_vote_count ?? 0), C.greenTint],
                ['Trust Score', String(trustScore), C.purpleTint],
              ].map(([l, v, bg]) => (
                <View key={l} style={br.tsStat}>
                  <View style={[br.tsStatIcon, { backgroundColor: bg as string }]} />
                  <View>
                    <Text style={br.tsStatLabel}>{l}</Text>
                    <Text style={br.tsStatVal}>{v}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Progress bar toward next badge */}
        <View style={br.card}>
          <Text style={br.sectionTitle}>Progress to Next Level</Text>
          <View style={br.tsBarBg}>
            <View style={[br.tsBarFill, { width: `${Math.round(progress * 100)}%` }]} />
          </View>
          <Text style={br.tsProgress}>
            {reportCount} / {nextThreshold} reports
          </Text>
        </View>

        {/* Progress levels */}
        <View style={br.card}>
          <View style={br.sectionHeader}>
            <Text style={br.sectionTitle}>Your Progress</Text>
            <TouchableOpacity><Text style={br.viewAll}>How it works?  ›</Text></TouchableOpacity>
          </View>
          <View style={br.levelsRow}>
            {LEVELS.map(lv => (
              <View key={lv.num} style={br.levelItem}>
                {lv.current && <View style={br.currentBadge}><Text style={br.currentText}>Current</Text></View>}
                <View style={[br.levelBadge, { borderColor: lv.color, backgroundColor: lv.current ? C.purpleTint : lv.done ? C.greenTint : C.surface2 }]}>
                  <Star size={20} color={lv.color} weight={lv.done || lv.current ? 'fill' : 'regular'} />
                </View>
                <Text style={br.levelNum}>Level {lv.num}</Text>
                <Text style={[br.levelName, lv.current && { color: lv.color }]}>{lv.name}</Text>
                <Text style={br.levelRange}>{lv.range}</Text>
                {lv.done && <View style={br.doneCheck} />}
              </View>
            ))}
          </View>
        </View>

        {/* Badges */}
        <View style={br.card}>
          <View style={br.sectionHeader}>
            <Text style={br.sectionTitle}>{t('badges.your_badges')}</Text>
            <Text style={br.earnedCount}>{earnedCount} / {ALL_BADGES.length} Badges Earned</Text>
          </View>
          {isLoading ? (
            <ActivityIndicator color={C.green} />
          ) : (
            <View style={br.badgesGrid}>
              {ALL_BADGES.map((badge) => {
                const locked = !earnedKeys.has(badge.key);
                const iconBg = locked ? C.surface2 : badge.color + '22';
                const iconColor = locked ? C.text3 : badge.color;
                const { Icon } = badge;
                return (
                  <View key={badge.key} style={[br.badgeCard, { borderColor: locked ? C.border : badge.color }]}>
                    {!locked && <View style={br.checkMark} />}
                    <View style={[br.badgeIcon, { backgroundColor: iconBg, borderColor: locked ? C.border : badge.color }]}>
                      <Icon size={28} color={iconColor} weight={locked ? 'regular' : 'fill'} />
                    </View>
                    <Text style={[br.badgeName, locked && { color: C.text2 }]}>{badge.label}</Text>
                    <Text style={br.badgeDesc}>{badge.desc}</Text>
                    <Text style={[br.badgeEarned, locked && { color: C.text3 }]}>
                      {locked ? '🔒 Locked' : 'Earned'}
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Stats summary */}
        <View style={br.card}>
          <View style={br.sectionHeader}>
            <Text style={br.sectionTitle}>{t('badges.stat_earned')}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: T.xxl, fontWeight: '800', color: C.green }}>{earnedCount}</Text>
              <Text style={{ fontSize: T.sm, color: C.text2 }}>{t('badges.stat_earned')}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: T.xxl, fontWeight: '800', color: C.orange }}>{inProgressCount}</Text>
              <Text style={{ fontSize: T.sm, color: C.text2 }}>{t('badges.stat_in_progress')}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: T.xxl, fontWeight: '800', color: C.white }}>{ALL_BADGES.length}</Text>
              <Text style={{ fontSize: T.sm, color: C.text2 }}>{t('badges.stat_total')}</Text>
            </View>
          </View>
        </View>

        {/* CTA */}
        <View style={br.cta}>
          <View style={br.ctaIcon} />
          <View style={{ flex: 1 }}>
            <Text style={br.ctaText}>Your contributions help thousands of travelers make better journey decisions every day.</Text>
          </View>
          <TouchableOpacity style={br.ctaBtn} onPress={() => router.push('/submit-report')}>
            <Text style={br.ctaBtnText}>Keep Contributing!  ›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const br = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.lg, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.xl, paddingVertical: S.md },
  backBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: C.white },
  subtitle: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  infoBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
  card: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.lg, gap: S.md },
  tsRow: { flexDirection: 'row', gap: S.lg },
  tsLeft: { flex: 1, gap: S.sm },
  tsTitleRow: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  tsTitle: { fontSize: 14, fontWeight: '600', color: C.white },
  tsVerified: { width: 20, height: 20, backgroundColor: C.greenTint, borderRadius: 10 },
  tsNumRow: { flexDirection: 'row', alignItems: 'baseline' },
  tsNum: { fontSize: 38, fontWeight: '800', color: C.green },
  tsMax: { fontSize: 16, color: C.text2 },
  tsLevel: { fontSize: T.sm, fontWeight: '600', color: C.green },
  tsBarBg: { width: '100%', height: 8, backgroundColor: C.surface2, borderRadius: 4 },
  tsBarFill: { width: '81%', height: 8, backgroundColor: C.green, borderRadius: 4 },
  tsProgress: { fontSize: T.sm, color: C.text2 },
  tsStats: { gap: S.md },
  tsStat: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  tsStatIcon: { width: 24, height: 24, borderRadius: 12 },
  tsStatLabel: { fontSize: T.xs, color: C.text2 },
  tsStatVal: { fontSize: T.md, fontWeight: '700', color: C.white },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: T.md, fontWeight: '700', color: C.white },
  viewAll: { fontSize: T.sm, fontWeight: '600', color: C.green },
  earnedCount: { fontSize: T.sm, fontWeight: '600', color: C.green },
  levelsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  levelItem: { alignItems: 'center', gap: 6, width: 64 },
  currentBadge: { backgroundColor: C.purple, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  currentText: { fontSize: 8, fontWeight: '700', color: C.white },
  levelBadge: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  levelNum: { fontSize: T.xs, fontWeight: '700', color: C.white, textAlign: 'center' },
  levelName: { fontSize: 8, color: C.text2, textAlign: 'center' },
  levelRange: { fontSize: 8, color: C.text3, textAlign: 'center' },
  doneCheck: { width: 14, height: 14, backgroundColor: C.greenTint, borderRadius: 7, borderWidth: 1, borderColor: C.green },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm },
  badgeCard: { width: '31%', backgroundColor: C.surface2, borderRadius: 14, borderWidth: 1, padding: S.md, alignItems: 'center', gap: S.xs },
  checkMark: { width: 20, height: 20, backgroundColor: C.green, borderRadius: 10, alignSelf: 'flex-end' },
  badgeIcon: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  badgeName: { fontSize: T.xs, fontWeight: '700', color: C.white, textAlign: 'center' },
  badgeDesc: { fontSize: 8, color: C.text2, textAlign: 'center' },
  badgeEarned: { fontSize: 8, fontWeight: '600', color: C.green, textAlign: 'center' },
  cta: { backgroundColor: C.greenTint, borderRadius: R.lg, borderWidth: 1, borderColor: C.greenDark, padding: S.lg, flexDirection: 'row', alignItems: 'center', gap: S.md },
  ctaIcon: { width: 44, height: 44, backgroundColor: C.greenDark, borderRadius: 22 },
  ctaText: { fontSize: T.sm, color: C.text2 },
  ctaBtn: { backgroundColor: C.greenDark, borderRadius: 10, paddingHorizontal: S.md, paddingVertical: S.sm },
  ctaBtnText: { fontSize: T.sm, fontWeight: '600', color: C.green },
});
