// app/badges-reputation.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../../theme';

const LEVELS = [
  { num: 1, name: 'Rookie Reporter', range: '0 - 99', done: true, color: C.text2 },
  { num: 2, name: 'Active Reporter', range: '100 - 299', done: true, color: C.green },
  { num: 3, name: 'Reliable Reporter', range: '300 - 599', done: true, color: C.blue },
  { num: 4, name: 'Trusted Reporter', range: '600 - 999', current: true, color: C.purple },
  { num: 5, name: 'Expert Reporter', range: '1000+', color: C.gold },
];

const BADGES = [
  { name: 'First Reporter', desc: 'Submit your first verified report', earned: 'Earned on May 10, 2025', color: C.green, bg: C.greenTint, locked: false },
  { name: 'Trusted Reporter', desc: 'Reach Level 4 Trust Score', earned: 'Earned on May 21, 2025', color: C.purple, bg: C.purpleTint, locked: false },
  { name: 'Delay Master', desc: 'Report delays 20 times', earned: 'Earned on Jun 02, 2025', color: C.red, bg: C.redTint, locked: false },
  { name: 'Helpful Traveler', desc: 'Receive 50 helpful votes', earned: 'Earned on Jun 05, 2025', color: C.blue, bg: C.blueTint, locked: false },
  { name: 'Diamond Contributor', desc: 'Reach Level 5 Trust Score', earned: 'Locked', color: C.gold, bg: `${C.gold}20`, locked: true },
  { name: 'Community Voice', desc: 'Add 100 comments or replies', earned: 'Locked', color: C.text2, bg: C.surface2, locked: true },
];

export default function BadgesReputationScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={br.root}>
      <View style={br.header}>
        <TouchableOpacity style={br.backBtn} onPress={() => router.back()} />
        <View>
          <Text style={br.title}>Badges & Reputation</Text>
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
                <Text style={br.tsNum}>810</Text>
                <Text style={br.tsMax}> / 1000</Text>
              </View>
              <Text style={br.tsLevel}>Level 4  •  Trusted Reporter</Text>
              <View style={br.tsBarBg}><View style={br.tsBarFill} /></View>
              <Text style={br.tsProgress}>190 points to reach Level 5</Text>
            </View>
            <View style={br.tsStats}>
              {[['Reports', '63', C.blueTint], ['Verifications', '159', C.greenTint], ['Helpful Votes', '278', C.purpleTint]].map(([l, v, bg]) => (
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
                  <Text style={[br.levelStar, { color: lv.color }]}>★</Text>
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
            <Text style={br.sectionTitle}>Your Badges</Text>
            <Text style={br.earnedCount}>6 / 12 Badges Earned</Text>
          </View>
          <View style={br.badgesGrid}>
            {BADGES.map((badge, i) => (
              <View key={badge.name} style={[br.badgeCard, { borderColor: badge.locked ? C.border : badge.color }]}>
                {!badge.locked && <View style={br.checkMark} />}
                <View style={[br.badgeIcon, { backgroundColor: badge.bg, borderColor: badge.color }]}>
                  <Text style={[br.badgeStar, { color: badge.color }]}>★</Text>
                </View>
                <Text style={[br.badgeName, badge.locked && { color: C.text2 }]}>{badge.name}</Text>
                <Text style={br.badgeDesc}>{badge.desc}</Text>
                <Text style={[br.badgeEarned, badge.locked && { color: C.text3 }]}>
                  {badge.locked ? '🔒 Locked' : badge.earned}
                </Text>
              </View>
            ))}
          </View>
        </View>
        {/* CTA */}
        <View style={br.cta}>
          <View style={br.ctaIcon} />
          <View style={{ flex: 1 }}>
            <Text style={br.ctaText}>Your contributions help thousands of travelers make better journey decisions every day.</Text>
          </View>
          <TouchableOpacity style={br.ctaBtn}><Text style={br.ctaBtnText}>Keep Contributing!  ›</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const br = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.lg, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.xl, paddingVertical: S.md },
  backBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
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
  levelStar: { fontSize: 20 },
  levelNum: { fontSize: T.xs, fontWeight: '700', color: C.white, textAlign: 'center' },
  levelName: { fontSize: 8, color: C.text2, textAlign: 'center' },
  levelRange: { fontSize: 8, color: C.text3, textAlign: 'center' },
  doneCheck: { width: 14, height: 14, backgroundColor: C.greenTint, borderRadius: 7, borderWidth: 1, borderColor: C.green },
  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm },
  badgeCard: { width: '31%', backgroundColor: C.surface2, borderRadius: 14, borderWidth: 1, padding: S.md, alignItems: 'center', gap: S.xs },
  checkMark: { width: 20, height: 20, backgroundColor: C.green, borderRadius: 10, alignSelf: 'flex-end' },
  badgeIcon: { width: 60, height: 60, borderRadius: 30, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  badgeStar: { fontSize: 24 },
  badgeName: { fontSize: T.xs, fontWeight: '700', color: C.white, textAlign: 'center' },
  badgeDesc: { fontSize: 8, color: C.text2, textAlign: 'center' },
  badgeEarned: { fontSize: 8, fontWeight: '600', color: C.green, textAlign: 'center' },
  cta: { backgroundColor: C.greenTint, borderRadius: R.lg, borderWidth: 1, borderColor: C.greenDark, padding: S.lg, flexDirection: 'row', alignItems: 'center', gap: S.md },
  ctaIcon: { width: 44, height: 44, backgroundColor: C.greenDark, borderRadius: 22 },
  ctaText: { fontSize: T.sm, color: C.text2 },
  ctaBtn: { backgroundColor: C.greenDark, borderRadius: 10, paddingHorizontal: S.md, paddingVertical: S.sm },
  ctaBtnText: { fontSize: T.sm, fontWeight: '600', color: C.green },
});
