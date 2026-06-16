import React, { useMemo } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Shield, Star, Lightning, Crown, CheckCircle, Clock } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';
import { useTranslation, TranslationKey } from '../../i18n';

// Tier metadata — earned/progress values are mock placeholders pending
// a live user-progress API. Names/descriptions come from i18n badges.*.
const BADGE_DEFS = [
  { id: '1', tierKey: 'bronze',  descKey: 'desc_bronze',  icon: Shield,      color: '#C87941', earned: true,  progress: 100, target: 1 },
  { id: '2', tierKey: 'silver',  descKey: 'desc_silver',  icon: CheckCircle, color: '#8FA3C0', earned: true,  progress: 100, target: 10 },
  { id: '3', tierKey: 'gold',    descKey: 'desc_gold',    icon: Star,        color: '#F5A623', earned: false, progress: 62,  target: 50 },
  { id: '4', tierKey: 'diamond', descKey: 'desc_diamond', icon: Crown,       color: '#A855F7', earned: false, progress: 31,  target: 100 },
  { id: '5', tierKey: 'green',   descKey: 'desc_green',   icon: Shield,      color: '#00A859', earned: true,  progress: 100, target: 1 },
  { id: '6', tierKey: 'amber',   descKey: 'desc_amber',   icon: Clock,       color: '#F5A623', earned: false, progress: 75,  target: 20 },
  { id: '7', tierKey: 'speed',   descKey: 'desc_speed',   icon: Lightning,   color: '#4EA8E0', earned: false, progress: 40,  target: 5 },
] as const;

export default function BadgesScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => createStyles(colors), [colors]);

  const earned = BADGE_DEFS.filter((b) => b.earned);
  const inProgress = BADGE_DEFS.filter((b) => !b.earned);

  return (
    <View style={s.root}>
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <Pressable style={s.backBtn} onPress={() => router.back()}><ArrowLeft size={20} color={colors['text-primary']} weight="bold" /></Pressable>
        <Text style={s.title}>{t('badges.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Stats row */}
        <View style={s.statsRow}>
          <View style={s.stat}><Text style={s.statVal}>{earned.length}</Text><Text style={s.statLabel}>{t('badges.stat_earned')}</Text></View>
          <View style={s.statDivider} />
          <View style={s.stat}><Text style={s.statVal}>{inProgress.length}</Text><Text style={s.statLabel}>{t('badges.stat_in_progress')}</Text></View>
          <View style={s.statDivider} />
          <View style={s.stat}><Text style={s.statVal}>{BADGE_DEFS.length}</Text><Text style={s.statLabel}>{t('badges.stat_total')}</Text></View>
        </View>

        {/* Earned */}
        <Text style={s.sectionTitle}>{t('badges.your_badges')}</Text>
        <View style={s.grid}>
          {earned.map((b) => (
            <View key={b.id} style={[s.badgeCard, s.earnedCard]}>
              <View style={[s.badgeIcon, { backgroundColor: b.color + '20' }]}>
                <b.icon size={32} color={b.color} weight="fill" />
              </View>
              <Text style={s.badgeName}>{t(`badges.${b.tierKey}` as TranslationKey)}</Text>
              <Text style={s.badgeDesc}>{t(`badges.${b.descKey}` as TranslationKey)}</Text>
              <View style={s.earnedTag}>
                <CheckCircle size={12} color={colors.primary} weight="fill" />
                <Text style={s.earnedText}>{t('badges.stat_earned')}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* In Progress */}
        <Text style={[s.sectionTitle, { marginTop: 28 }]}>{t('badges.stat_in_progress')}</Text>
        {inProgress.map((b) => (
          <View key={b.id} style={s.progressCard}>
            <View style={[s.progressIcon, { backgroundColor: b.color + '18' }]}>
              <b.icon size={24} color={b.color + '80'} weight="duotone" />
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                <Text style={s.progressName}>{t(`badges.${b.tierKey}` as TranslationKey)}</Text>
                <Text style={[s.progressPct, { color: b.color }]}>{b.progress}%</Text>
              </View>
              <Text style={s.progressDesc}>{t(`badges.${b.descKey}` as TranslationKey)}</Text>
              <View style={s.bar}>
                <View style={[s.barFill, { width: `${b.progress}%` as any, backgroundColor: b.color }]} />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  root:         { flex: 1, backgroundColor: colors['bg-base'] },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16 },
  backBtn:      { width: 40, height: 40, borderRadius: 20, backgroundColor: colors['bg-card'], borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  title:        { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 20, color: colors['text-primary'] },
  statsRow:     { flexDirection: 'row', backgroundColor: colors['bg-card'], borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 28 },
  stat:         { flex: 1, alignItems: 'center', paddingVertical: 20 },
  statVal:      { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 24, color: colors.primary },
  statLabel:    { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-secondary'], marginTop: 4 },
  statDivider:  { width: 1, backgroundColor: colors.border, marginVertical: 16 },
  sectionTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: colors['text-primary'], marginBottom: 16 },
  grid:         { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  badgeCard:    { width: '47%', flexGrow: 1, alignItems: 'center', borderRadius: 16, borderWidth: 1, borderColor: colors.border, padding: 18, gap: 8 },
  earnedCard:   { backgroundColor: colors['bg-card'] },
  badgeIcon:    { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  badgeName:    { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors['text-primary'], textAlign: 'center' },
  badgeDesc:    { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors['text-secondary'], textAlign: 'center', lineHeight: 16 },
  earnedTag:    { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors['primary-subtle'], borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  earnedText:   { fontFamily: 'Inter_500Medium', fontSize: 11, color: colors.primary },
  progressCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors['bg-card'], borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 10 },
  progressIcon: { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  progressName: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors['text-primary'] },
  progressPct:  { fontFamily: 'JetBrainsMono_500Medium', fontSize: 13 },
  progressDesc: { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-secondary'], marginBottom: 10 },
  bar:          { height: 6, backgroundColor: colors.border, borderRadius: 3, overflow: 'hidden' },
  barFill:      { height: '100%', borderRadius: 3 },
});
