// app/badges-reputation.tsx
import React from 'react';
import { ArrowLeft, Flag, ShieldCheck, Clock, Diamond, Lightning, Star } from 'phosphor-react-native';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radius, Spacing, Typography } from '../constants';
import { supabase } from '../lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../stores/authStore';
import { useTranslation } from '../i18n';

const LEVELS = [
  { num: 1, name: 'Rookie Reporter', range: '0 - 99', done: true, color: Colors.dark['text-secondary'] },
  { num: 2, name: 'Active Reporter', range: '100 - 299', done: true, color: Colors.dark.primary },
  { num: 3, name: 'Reliable Reporter', range: '300 - 599', done: true, color: Colors.dark.info },
  { num: 4, name: 'Trusted Reporter', range: '600 - 999', current: true, color: Colors.dark.info },
  { num: 5, name: 'Expert Reporter', range: '1000+', color: Colors.dark.accent },
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
    { key: 'CONTRIBUTOR',    label: t('badges.bronze'), desc: t('badges.desc_bronze'), color: Colors.dark.accent, Icon: Flag },
    { key: 'VERIFIED',       label: t('badges.silver'), desc: t('badges.desc_silver'), color: Colors.dark['text-secondary'],  Icon: ShieldCheck },
    { key: 'REPORTER',       label: t('badges.gold'),   desc: t('badges.desc_gold'),   color: Colors.dark.accent,   Icon: Star },
    { key: 'ELITE_REPORTER', label: t('badges.diamond'),desc: t('badges.desc_diamond'),color: Colors.dark.info,   Icon: Diamond },
    { key: 'TRUSTED_REPORTER',label: t('badges.green'), desc: t('badges.desc_green'),  color: Colors.dark.primary,  Icon: ShieldCheck },
    { key: 'DELAY_MASTER',   label: t('badges.amber'),  desc: t('badges.desc_amber'),  color: Colors.dark.accent, Icon: Clock },
    { key: 'SPEED_REPORTER', label: t('badges.speed'),  desc: t('badges.desc_speed'),  color: Colors.dark.info, Icon: Lightning },
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
        <TouchableOpacity style={br.backBtn} onPress={() => router.back()}><ArrowLeft size={18} color={Colors.dark['text-primary']} /></TouchableOpacity>
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
                ['Reports', String(reportCount), Colors.dark['info-subtle']],
                ['Verifications', String(user?.helpful_vote_count ?? 0), Colors.dark['primary-subtle']],
                ['Trust Score', String(trustScore), Colors.dark['info-subtle']],
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
                <View style={[br.levelBadge, {
                  backgroundColor: lv.current ? Colors.dark.info : lv.done ? Colors.dark.primary : '#1A1F2E',
                  borderColor: lv.current ? Colors.dark.info : lv.done ? Colors.dark.primary : '#1A1F2E'
                }]}>
                  <Star size={20} color={lv.current || lv.done ? Colors.dark['text-primary'] : '#4E6480'} weight="fill" />
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
            <ActivityIndicator color={Colors.dark.primary} />
          ) : (
            <View style={br.badgesGrid}>
              {ALL_BADGES.map((badge) => {
                const locked = !earnedKeys.has(badge.key);
                const iconBg = locked ? '#1A1F2E' : badge.color;
                const iconColor = locked ? '#4E6480' : Colors.dark['text-primary'];
                const { Icon } = badge;
                return (
                  <View key={badge.key} style={[br.badgeCard, { borderColor: locked ? Colors.dark.border : badge.color }]}>
                    {!locked && <View style={br.checkMark} />}
                    <View style={[br.badgeIcon, { backgroundColor: iconBg, borderWidth: 0 }]}>
                      <Icon size={28} color={iconColor} weight="fill" />
                    </View>
                    <Text style={[br.badgeName, locked && { color: Colors.dark['text-secondary'] }]}>{badge.label}</Text>
                    <Text style={br.badgeDesc}>{badge.desc}</Text>
                    <Text style={[br.badgeEarned, locked && { color: Colors.dark['text-tertiary'] }]}>
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
              <Text style={{ ...Typography.h1, fontWeight: '800', color: Colors.dark.primary }}>{earnedCount}</Text>
              <Text style={{ ...Typography['body-sm'], color: Colors.dark['text-secondary'] }}>{t('badges.stat_earned')}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ ...Typography.h1, fontWeight: '800', color: Colors.dark.accent }}>{inProgressCount}</Text>
              <Text style={{ ...Typography['body-sm'], color: Colors.dark['text-secondary'] }}>{t('badges.stat_in_progress')}</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ ...Typography.h1, fontWeight: '800', color: Colors.dark['text-primary'] }}>{ALL_BADGES.length}</Text>
              <Text style={{ ...Typography['body-sm'], color: Colors.dark['text-secondary'] }}>{t('badges.stat_total')}</Text>
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
  root: { flex: 1, backgroundColor: Colors.dark['bg-base'] },
  scroll: { padding: Spacing['space-5'], gap: Spacing['space-4'], paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing['space-5'], paddingVertical: Spacing['space-3'] },
  backBtn: { width: 32, height: 32, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: Colors.dark['text-primary'] },
  subtitle: { ...Typography['body-sm'], color: Colors.dark['text-secondary'], marginTop: 2 },
  infoBtn: { width: 32, height: 32, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 16 },
  card: { backgroundColor: Colors.dark['bg-card'], borderRadius: Radius['radius-lg'], borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing['space-4'], gap: Spacing['space-3'] },
  tsRow: { flexDirection: 'row', gap: Spacing['space-4'] },
  tsLeft: { flex: 1, gap: Spacing['space-2'] },
  tsTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-2'] },
  tsTitle: { fontSize: 14, fontWeight: '600', color: Colors.dark['text-primary'] },
  tsVerified: { width: 20, height: 20, backgroundColor: Colors.dark['primary-subtle'], borderRadius: 10 },
  tsNumRow: { flexDirection: 'row', alignItems: 'baseline' },
  tsNum: { fontSize: 38, fontWeight: '800', color: Colors.dark.primary },
  tsMax: { fontSize: 16, color: Colors.dark['text-secondary'] },
  tsLevel: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark.primary },
  tsBarBg: { width: '100%', height: 8, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 4 },
  tsBarFill: { width: '81%', height: 8, backgroundColor: Colors.dark.primary, borderRadius: 4 },
  tsProgress: { ...Typography['body-sm'], color: Colors.dark['text-secondary'] },
  tsStats: { gap: Spacing['space-3'] },
  tsStat: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-2'] },
  tsStatIcon: { width: 24, height: 24, borderRadius: 12 },
  tsStatLabel: { ...Typography.caption, color: Colors.dark['text-secondary'] },
  tsStatVal: { ...Typography.h4, fontWeight: '700', color: Colors.dark['text-primary'] },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { ...Typography.h4, fontWeight: '700', color: Colors.dark['text-primary'] },
  viewAll: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark.primary },
  earnedCount: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark.primary },
  levelsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  levelItem: { alignItems: 'center', gap: 6, width: 64 },
  currentBadge: { backgroundColor: Colors.dark.info, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
  currentText: { fontSize: 8, fontWeight: '700', color: Colors.dark['text-primary'] },
  levelBadge: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  levelNum: { ...Typography.caption, fontWeight: '700', color: Colors.dark['text-primary'], textAlign: 'center' },
  levelName: { fontSize: 8, color: Colors.dark['text-secondary'], textAlign: 'center' },
  levelRange: { fontSize: 8, color: Colors.dark['text-tertiary'], textAlign: 'center' },
  doneCheck: { width: 14, height: 14, backgroundColor: Colors.dark['primary-subtle'], borderRadius: 7, borderWidth: 1, borderColor: Colors.dark.primary },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing['space-2'] },
  badgeCard: { width: '31%', backgroundColor: Colors.dark['bg-overlay'], borderRadius: 14, borderWidth: 1, padding: Spacing['space-3'], alignItems: 'center', gap: Spacing['space-1'] },
  checkMark: { width: 20, height: 20, backgroundColor: Colors.dark.primary, borderRadius: 10, alignSelf: 'flex-end' },
  badgeIcon: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  badgeName: { ...Typography.caption, fontWeight: '700', color: Colors.dark['text-primary'], textAlign: 'center' },
  badgeDesc: { fontSize: 8, color: Colors.dark['text-secondary'], textAlign: 'center' },
  badgeEarned: { fontSize: 8, fontWeight: '600', color: Colors.dark.primary, textAlign: 'center' },
  cta: { backgroundColor: Colors.dark['primary-subtle'], borderRadius: Radius['radius-lg'], borderWidth: 1, borderColor: Colors.dark['primary-dim'], padding: Spacing['space-4'], flexDirection: 'row', alignItems: 'center', gap: Spacing['space-3'] },
  ctaIcon: { width: 44, height: 44, backgroundColor: Colors.dark['primary-dim'], borderRadius: 22 },
  ctaText: { ...Typography['body-sm'], color: Colors.dark['text-secondary'] },
  ctaBtn: { backgroundColor: Colors.dark['primary-dim'], borderRadius: 10, paddingHorizontal: Spacing['space-3'], paddingVertical: Spacing['space-2'] },
  ctaBtnText: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark.primary },
});
