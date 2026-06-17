// app/badges/index.tsx
// Badges & Achievements screen — matches Image 2 exactly.
// Core Badges: Explorer, Contributor, Verified Traveler, Station Expert, RailMate Ambassador
// Achievement Badges: First Report, 10 Reports, 50 Reports, 100 Reports,
//                     Delay Master, Helpful Traveler, Diamond Contributor

import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, CheckCircle, Star } from 'phosphor-react-native';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';
import { useAuthStore } from '../../stores/authStore';
import { ErrorBoundary } from '../../components/ErrorBoundary';

// ─── Badge Definitions ────────────────────────────────────────────────────────
// Exactly matching Image 2

const CORE_BADGES = [
  {
    id: 'explorer',
    label: 'Explorer',
    emoji: '🗺️',
    color: '#4EA8E0',
    desc: 'Started your RailMate journey',
    shape: 'shield' as const,
  },
  {
    id: 'contributor',
    label: 'Contributor',
    emoji: '🤝',
    color: '#00A859',
    desc: 'Helped fellow travelers with reports',
    shape: 'shield' as const,
  },
  {
    id: 'verified_traveler',
    label: 'Verified Traveler',
    emoji: '✅',
    color: '#00A859',
    desc: 'Reached high accuracy on reports',
    shape: 'shield' as const,
  },
  {
    id: 'station_expert',
    label: 'Station Expert',
    emoji: '🏛️',
    color: '#F5A623',
    desc: 'Top contributor at a specific station',
    shape: 'shield' as const,
  },
  {
    id: 'ambassador',
    label: 'RailMate Ambassador',
    emoji: '👑',
    color: '#A855F7',
    desc: 'Elite community leader',
    shape: 'shield' as const,
  },
] as const;

const ACHIEVEMENT_BADGES = [
  {
    id: 'first_report',
    label: 'First Report',
    emoji: '📝',
    color: '#00A859',
    desc: 'Submitted your first report',
    threshold: 1,
    field: 'report_count' as const,
  },
  {
    id: 'reports_10',
    label: '10 Reports',
    emoji: '🥈',
    color: '#8FA3C0',
    desc: 'Submitted 10 reports',
    threshold: 10,
    field: 'report_count' as const,
  },
  {
    id: 'reports_50',
    label: '50 Reports',
    emoji: '🥇',
    color: '#F5A623',
    desc: 'Submitted 50 reports',
    threshold: 50,
    field: 'report_count' as const,
  },
  {
    id: 'reports_100',
    label: '100 Reports',
    emoji: '💎',
    color: '#F5A623',
    desc: 'Submitted 100 reports',
    threshold: 100,
    field: 'report_count' as const,
  },
  {
    id: 'delay_master',
    label: 'Delay Master',
    emoji: '⏱️',
    color: '#E8394B',
    desc: 'Accurate delay reporter',
    threshold: 10,
    field: 'report_count' as const,
  },
  {
    id: 'helpful_traveler',
    label: 'Helpful Traveler',
    emoji: '👍',
    color: '#00A859',
    desc: 'Received helpful votes from travelers',
    threshold: 10,
    field: 'helpful_vote_count' as const,
  },
  {
    id: 'diamond_contributor',
    label: 'Diamond Contributor',
    emoji: '💠',
    color: '#A855F7',
    desc: 'Elite community member',
    threshold: 100,
    field: 'helpful_vote_count' as const,
  },
] as const;

// Determine which core badge the user holds based on trust score
function getCoreBadgeId(trustScore: number): string {
  if (trustScore >= 90) return 'ambassador';
  if (trustScore >= 75) return 'station_expert';
  if (trustScore >= 50) return 'verified_traveler';
  if (trustScore >= 20) return 'contributor';
  return 'explorer';
}

function BadgesContent() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const s = useMemo(() => createStyles(colors), [colors]);
  const { user } = useAuthStore();

  const trustScore = user?.trust_score ?? 0;
  const reportCount = user?.report_count ?? 0;
  const helpfulCount = user?.helpful_vote_count ?? 0;
  const currentCoreBadgeId = getCoreBadgeId(trustScore);

  const isAchievementUnlocked = (badge: typeof ACHIEVEMENT_BADGES[number]) => {
    const val = badge.field === 'report_count' ? reportCount : helpfulCount;
    return val >= badge.threshold;
  };

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors['text-primary']} weight="bold" />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={s.title}>Badges & Achievements</Text>
          <Text style={s.sub}>Every journey. Every report. Every impact.</Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      >
        {/* Current tier card */}
        {(() => {
          const current = CORE_BADGES.find(b => b.id === currentCoreBadgeId)!;
          return (
            <View style={[s.tierCard, { borderColor: current.color + '40', backgroundColor: current.color + '10' }]}>
              <Text style={s.tierEmoji}>{current.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[s.tierLabel, { color: current.color }]}>{current.label}</Text>
                <Text style={s.tierDesc}>Your current tier — keep contributing!</Text>
              </View>
              <View style={[s.trustPill, { backgroundColor: current.color + '20' }]}>
                <Star size={12} color={current.color} weight="fill" />
                <Text style={[s.trustPillText, { color: current.color }]}>{trustScore}/100</Text>
              </View>
            </View>
          );
        })()}

        {/* ── Core Badges ── */}
        <Text style={s.sectionLabel}>CORE BADGES</Text>
        <View style={s.coreGrid}>
          {CORE_BADGES.map((badge) => {
            const earned = getCoreBadgeId(trustScore) === badge.id ||
              CORE_BADGES.findIndex(b => b.id === currentCoreBadgeId) >=
              CORE_BADGES.findIndex(b => b.id === badge.id);
            return (
              <View
                key={badge.id}
                style={[
                  s.coreBadge,
                  { borderColor: earned ? badge.color + '50' : colors.border },
                  !earned && s.coreBadgeLocked,
                ]}
              >
                {/* Shield shape top bar */}
                <View style={[s.shieldAccent, { backgroundColor: earned ? badge.color : colors['text-tertiary'] }]} />
                <Text style={[s.badgeEmoji, !earned && { opacity: 0.3 }]}>{badge.emoji}</Text>
                <Text style={[s.badgeName, { color: earned ? badge.color : colors['text-tertiary'] }]}>
                  {badge.label}
                </Text>
                {earned && (
                  <View style={s.earnedDot}>
                    <CheckCircle size={14} color={badge.color} weight="fill" />
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* ── Achievement Badges ── */}
        <Text style={[s.sectionLabel, { marginTop: 24 }]}>ACHIEVEMENT BADGES</Text>
        <View style={s.achievementGrid}>
          {ACHIEVEMENT_BADGES.map((badge) => {
            const unlocked = isAchievementUnlocked(badge);
            return (
              <View
                key={badge.id}
                style={[
                  s.achieveBadge,
                  { borderColor: unlocked ? badge.color + '50' : colors.border },
                  !unlocked && s.coreBadgeLocked,
                ]}
              >
                <View style={[
                  s.achieveCircle,
                  { borderColor: unlocked ? badge.color : colors['text-tertiary'] + '40',
                    backgroundColor: unlocked ? badge.color + '15' : colors['bg-elevated'] },
                ]}>
                  <Text style={[s.achieveEmoji, !unlocked && { opacity: 0.3 }]}>{badge.emoji}</Text>
                </View>
                <Text style={[s.badgeName, { color: unlocked ? badge.color : colors['text-tertiary'] }]}>
                  {badge.label}
                </Text>
                <Text style={s.badgeDesc}>{badge.desc}</Text>
                {unlocked && (
                  <View style={[s.unlockedPill, { backgroundColor: badge.color + '20' }]}>
                    <Text style={[s.unlockedText, { color: badge.color }]}>Earned</Text>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Progress hint */}
        <View style={s.progressHint}>
          <Text style={s.progressHintText}>
            Submit reports and help travelers to unlock more badges.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default function BadgesScreen() {
  return <ErrorBoundary name="Badges"><BadgesContent /></ErrorBoundary>;
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    root:           { flex: 1, backgroundColor: colors['bg-base'] },
    header:         { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: 20, paddingBottom: 16 },
    backBtn:        { width: 40, height: 40, borderRadius: 20, backgroundColor: colors['bg-card'], borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
    title:          { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 22, color: colors['text-primary'] },
    sub:            { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors['text-secondary'], marginTop: 2 },

    tierCard:       { flexDirection: 'row', alignItems: 'center', gap: 14, borderWidth: 1.5, borderRadius: 16, padding: 18, marginBottom: 24 },
    tierEmoji:      { fontSize: 36 },
    tierLabel:      { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 18 },
    tierDesc:       { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors['text-secondary'], marginTop: 2 },
    trustPill:      { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6 },
    trustPillText:  { fontFamily: 'Inter_600SemiBold', fontSize: 13 },

    sectionLabel:   { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: colors['text-tertiary'], letterSpacing: 1.2, marginBottom: 12, textAlign: 'center' },

    // Core badge grid — 5 across
    coreGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
    coreBadge:      {
      width: '18%', minWidth: 56, alignItems: 'center', gap: 6,
      borderWidth: 1.5, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 4,
      backgroundColor: colors['bg-card'], overflow: 'hidden',
    },
    coreBadgeLocked:{ opacity: 0.45 },
    shieldAccent:   { position: 'absolute', top: 0, left: 0, right: 0, height: 3, borderRadius: 2 },
    badgeEmoji:     { fontSize: 26 },
    badgeName:      { fontFamily: 'Inter_600SemiBold', fontSize: 10, textAlign: 'center', lineHeight: 14 },
    earnedDot:      { position: 'absolute', top: 6, right: 6 },

    // Achievement badge grid — 3–4 across
    achievementGrid:{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    achieveBadge:   {
      width: '30%', flexGrow: 1, alignItems: 'center', gap: 6,
      borderWidth: 1.5, borderRadius: 14, paddingVertical: 14, paddingHorizontal: 8,
      backgroundColor: colors['bg-card'],
    },
    achieveCircle:  { width: 58, height: 58, borderRadius: 29, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
    achieveEmoji:   { fontSize: 28 },
    badgeDesc:      { fontFamily: 'Inter_400Regular', fontSize: 10, color: colors['text-tertiary'], textAlign: 'center', lineHeight: 14 },
    unlockedPill:   { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, marginTop: 2 },
    unlockedText:   { fontFamily: 'Inter_600SemiBold', fontSize: 10 },

    progressHint:   { marginTop: 24, padding: 16, backgroundColor: colors['bg-card'], borderRadius: 14, borderWidth: 1, borderColor: colors.border },
    progressHintText:{ fontFamily: 'Inter_400Regular', fontSize: 13, color: colors['text-secondary'], textAlign: 'center', lineHeight: 20 },
  });
