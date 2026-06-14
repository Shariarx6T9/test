import React from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import { router } from 'expo-router';
import { Clock, Warning, CheckCircle, Users } from 'phosphor-react-native';
import { TrainSearchResult } from '../../../types/train.types';
import { formatTime } from '../../../utils/formatTime';
import { formatDuration } from '../../../utils/formatDuration';
import { useTranslation } from '../../../i18n';
import { Chip } from '../../ui/Chip/Chip';

const C = { primary:'#00A859', accent:'#F5A623', danger:'#E8394B', success:'#00C977', textPri:'#F0F4FF', textSec:'#8FA3C0', textTer:'#4E6480', bgCard:'#162035', border:'#1E2E42' };

interface TrainCardProps { train: TrainSearchResult; fromId?: string; toId?: string; }

export const TrainCard: React.FC<TrainCardProps> = ({ train, fromId, toId }) => {
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';

  const handlePress = () => router.push({ pathname: '/train/[id]', params: { id: train.train_id, fromId, toId } });

  return (
    <Pressable onPress={handlePress} style={({ pressed }) => [s.card, pressed && s.pressed]}>
      <View style={s.accent} />

      {/* Train name */}
      <View style={s.nameRow}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={s.trainName}>{train.train_name_en}</Text>
          <Text style={s.trainNameBn}>{train.train_name_bn}</Text>
        </View>
        <Text style={s.trainNum}>#{train.train_number}</Text>
      </View>

      {/* Time row */}
      <View style={s.timeRow}>
        <Text style={s.time}>{formatTime(train.departure_time)}</Text>
        <View style={s.durationPill}>
          <Clock size={11} color={C.textTer} />
          <Text style={s.durationText}>{formatDuration(train.duration_minutes)}</Text>
        </View>
        <Text style={s.time}>{formatTime(train.arrival_time)}</Text>
      </View>

      {/* Class chips */}
      <View style={s.chips}>
        {train.available_classes.map((cls) => (
          <Chip key={cls} label={t(`fare.class.${cls}` as any)} isBengali={isBengali} />
        ))}
      </View>
    </Pressable>
  );
};

const s = StyleSheet.create({
  card:        { backgroundColor: C.bgCard, borderRadius: 14, padding: 16, paddingLeft: 20, borderWidth: 1, borderColor: C.border, marginBottom: 12, overflow: 'hidden', position: 'relative' },
  accent:      { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: C.primary, borderTopLeftRadius: 14, borderBottomLeftRadius: 14 },
  pressed:     { opacity: 0.9, transform: [{ scale: 0.985 }] },
  nameRow:     { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
  trainName:   { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: C.textPri, lineHeight: 24 },
  trainNameBn: { fontFamily: 'NotoSansBengali_400Regular', fontSize: 13, color: C.textSec, marginTop: 2 },
  trainNum:    { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.textTer },
  timeRow:     { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  time:        { fontFamily: 'JetBrainsMono_500Medium', fontSize: 22, color: C.textPri, letterSpacing: -0.5 },
  durationPill:{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, backgroundColor: '#1A2840', borderRadius: 20, paddingVertical: 4, paddingHorizontal: 8, marginHorizontal: 12 },
  durationText:{ fontFamily: 'JetBrainsMono_400Regular', fontSize: 11, color: C.textSec },
  chips:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
