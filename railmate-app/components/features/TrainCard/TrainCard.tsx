import React, { useMemo } from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { Clock, Warning, CheckCircle, Users, Star } from 'phosphor-react-native';
import { TrainSearchResult } from '../../../types/train.types';
import { formatTime } from '../../../utils/formatTime';
import { formatDuration } from '../../../utils/formatDuration';
import { useThemeColors, ThemeColors } from '../../../hooks/useThemeColors';
import { useTranslation } from '../../../i18n';

// Generate a stable accent color from train name (used for the emblem only —
// independent of light/dark theme so emblems stay legible on both).
const EMBLEM_COLORS = ['#1A5C3A', '#1A3A5C', '#5C1A3A', '#3A1A5C', '#5C3A1A'];
function emblemColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return EMBLEM_COLORS[Math.abs(hash) % EMBLEM_COLORS.length];
}

interface TrainCardProps { train: TrainSearchResult; fromId?: string; toId?: string; }

export const TrainCard: React.FC<TrainCardProps> = ({ train, fromId, toId }) => {
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';
  const colors = useThemeColors();
  const s = useMemo(() => createStyles(colors), [colors]);

  const handlePress = () =>
    router.push({ pathname: '/train/[id]', params: { id: train.train_id, fromId, toId } });

  const initials = train.train_name_en
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('');

  const emblemBg = emblemColor(train.train_name_en);

  // Status
  const hasDelay = (train as any).delay_minutes > 0;
  const hasCrowding = (train as any).crowd_level === 'HIGH' || (train as any).crowd_level === 'OVERCROWDED';

  const fromName = isBengali ? (train as any).from_station_name_bn : (train as any).from_station_name_en;
  const toName   = isBengali ? (train as any).to_station_name_bn   : (train as any).to_station_name_en;

  const crowdLevel = (train as any).crowd_level === 'OVERCROWDED'
    ? t('community.crowd_overcrowded')
    : t('community.crowd_high');

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [s.card, pressed && s.pressed]}>
      {/* Green left accent border */}
      <View style={s.accent} />

      {/* Header row: emblem + name + number + star */}
      <View style={s.headerRow}>
        <View style={[s.emblem, { backgroundColor: emblemBg }]}>
          <Text style={s.emblemText}>{initials}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={s.trainName}>{train.train_name_en}</Text>
          {isBengali && <Text style={s.trainNameBn}>{train.train_name_bn}</Text>}
        </View>
        <Text style={s.trainNum}>#{train.train_number}</Text>
        <Star size={18} color={colors.accent} weight="regular" style={{ marginLeft: 10 }} />
      </View>

      {/* Time row */}
      <View style={s.timeRow}>
        <View style={{ alignItems: 'flex-start' }}>
          <Text style={s.time}>{formatTime(train.departure_time)}</Text>
          {!!fromName && <Text style={s.stationSmall}>{fromName}</Text>}
        </View>
        <View style={s.arrow}>
          <Text style={s.arrowText}>→</Text>
        </View>
        <View style={s.durationBadge}>
          <Clock size={12} color={colors['text-tertiary']} />
          <Text style={s.durationText}>{formatDuration(train.duration_minutes)}</Text>
        </View>
        <View style={s.arrow}>
          <Text style={s.arrowText}>→</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={s.time}>{formatTime(train.arrival_time)}</Text>
          {!!toName && <Text style={s.stationSmall}>{toName}</Text>}
        </View>
      </View>

      {/* Status */}
      {hasDelay ? (
        <View style={s.statusRow}>
          <Warning size={14} color={colors.accent} weight="fill" />
          <Text style={[s.statusText, { color: colors.accent }]}>
            {t('community.delay_report', { minutes: (train as any).delay_minutes })}
          </Text>
        </View>
      ) : hasCrowding ? (
        <View style={s.statusRow}>
          <Users size={14} color={colors.danger} weight="fill" />
          <Text style={[s.statusText, { color: colors.danger }]}>
            {t('community.crowding_report', { level: crowdLevel })}
          </Text>
        </View>
      ) : (
        <View style={s.statusRow}>
          <CheckCircle size={14} color={colors.primary} weight="fill" />
          <Text style={[s.statusText, { color: colors.primary }]}>{t('results.on_time')}</Text>
        </View>
      )}

      {/* Class chips */}
      <View style={s.chips}>
        {train.available_classes.map((cls) => (
          <View key={cls} style={s.chip}>
            <Text style={s.chipText}>{t(`fare.class.${cls}` as any)}</Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  card:        { backgroundColor: colors['bg-card'], borderRadius: 16, borderWidth: 1, borderColor: colors['border'], marginBottom: 14, overflow: 'hidden', paddingHorizontal: 18, paddingVertical: 16, paddingLeft: 22 },
  accent:      { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: colors.primary },
  pressed:     { opacity: 0.88, transform: [{ scale: 0.985 }] },
  headerRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  emblem:      { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  emblemText:  { fontFamily: 'Inter_700Bold', fontSize: 14, color: colors['text-inverse'] },
  trainName:   { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors['text-primary'] },
  trainNameBn: { fontFamily: 'NotoSansBengali_400Regular', fontSize: 12, color: colors['text-secondary'], marginTop: 1 },
  trainNum:    { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors['text-tertiary'] },
  timeRow:     { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  time:        { fontFamily: 'JetBrainsMono_500Medium', fontSize: 24, color: colors['text-primary'], letterSpacing: -1 },
  stationSmall:{ fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-secondary'], marginTop: 2 },
  arrow:       { flex: 1, alignItems: 'center' },
  arrowText:   { fontSize: 20, color: colors.primary },
  durationBadge:{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors['bg-elevated'], borderRadius: 20, paddingVertical: 5, paddingHorizontal: 10 },
  durationText:{ fontFamily: 'JetBrainsMono_400Regular', fontSize: 11, color: colors['text-secondary'] },
  statusRow:   { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  statusText:  { fontFamily: 'Inter_500Medium', fontSize: 13 },
  chips:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip:        { backgroundColor: colors['bg-elevated'], borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, borderWidth: 1, borderColor: colors['border'] },
  chipText:    { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-secondary'] },
});
