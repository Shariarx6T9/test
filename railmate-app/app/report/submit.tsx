import React, { useMemo, useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Warning, Users, Star, CheckCircle } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';
import { useTranslation } from '../../i18n';

// Report types match Part 07 DB schema exactly:
// community_reports.report_type: "DELAY" | "CROWDING" | "COACH_CONDITION"
const CROWD_LEVELS = ['EMPTY', 'MODERATE', 'FULL', 'OVERCROWDED'] as const;
type CrowdLevel = typeof CROWD_LEVELS[number];

export default function SubmitReportScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => createStyles(colors), [colors]);

  const TYPES = useMemo(() => [
    { key: 'DELAY',          label: t('report.type_delay'),     icon: Warning, color: colors.danger  },
    { key: 'CROWDING',       label: t('report.type_crowd'),     icon: Users,   color: colors.accent  },
    { key: 'COACH_CONDITION',label: t('report.type_condition'), icon: Star,    color: colors.info    },
  ], [t, colors]);

  const [type,       setType]       = useState<string | null>(null);
  const [notes,      setNotes]      = useState('');
  const [delay,      setDelay]      = useState('');
  const [crowdLevel, setCrowdLevel] = useState<CrowdLevel | null>(null);
  const [rating,     setRating]     = useState<number | null>(null);

  const canSubmit = () => {
    if (!type) return false;
    if (type === 'DELAY' && (!delay || isNaN(Number(delay)))) return false;
    if (type === 'CROWDING' && !crowdLevel) return false;
    if (type === 'COACH_CONDITION' && !rating) return false;
    return true;
  };

  const submit = () => {
    if (!canSubmit()) {
      Alert.alert('', t('report.select_type_error'));
      return;
    }
    // TODO: wire to Supabase Edge Function /functions/v1/submit-report (Part 08 Section 8.3)
    Alert.alert(
      t('report.submit_success'),
      t('report.submit_thanks'),
      [{ text: t('report.done'), onPress: () => router.back() }]
    );
  };

  return (
    <View style={s.root}>
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors['text-primary']} weight="bold" />
        </Pressable>
        <Text style={s.title}>{t('report.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Report type selector */}
        <Text style={s.label}>{t('report.type_label')}</Text>
        <View style={s.typeGrid}>
          {TYPES.map(({ key, label, icon: Icon, color }) => {
            const active = type === key;
            return (
              <Pressable
                key={key}
                style={[s.typeCard, active && { backgroundColor: color + '18', borderColor: color }]}
                onPress={() => { setType(key); setCrowdLevel(null); setRating(null); }}
              >
                <View style={[s.typeIcon, { backgroundColor: active ? color + '25' : colors['bg-elevated'] }]}>
                  <Icon size={22} color={active ? color : colors['text-tertiary']} weight={active ? 'fill' : 'regular'} />
                </View>
                <Text style={[s.typeLabel, active && { color }]}>{label}</Text>
                {active && <CheckCircle size={16} color={color} weight="fill" style={{ position: 'absolute', top: 10, right: 10 }} />}
              </Pressable>
            );
          })}
        </View>

        {/* DELAY — minutes input */}
        {type === 'DELAY' && (
          <View style={s.field}>
            <Text style={s.label}>{t('report.delay_label')}</Text>
            <TextInput
              style={s.input}
              value={delay}
              onChangeText={setDelay}
              placeholder={t('report.delay_placeholder')}
              placeholderTextColor={colors['text-tertiary']}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
        )}

        {/* CROWDING — level selector */}
        {type === 'CROWDING' && (
          <View style={s.field}>
            <Text style={s.label}>{t('report.crowd_level_label')}</Text>
            <View style={s.levelRow}>
              {CROWD_LEVELS.map((level) => {
                const active = crowdLevel === level;
                const levelKey = `report.crowd_level_${level.toLowerCase()}` as any;
                return (
                  <Pressable
                    key={level}
                    style={[s.levelChip, active && { backgroundColor: colors.accent + '18', borderColor: colors.accent }]}
                    onPress={() => setCrowdLevel(level)}
                  >
                    <Text style={[s.levelText, active && { color: colors.accent }]}>
                      {t(levelKey)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* COACH_CONDITION — 1–5 star rating */}
        {type === 'COACH_CONDITION' && (
          <View style={s.field}>
            <Text style={s.label}>{t('report.condition_rating_label')}</Text>
            <View style={s.starRow}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Pressable key={n} onPress={() => setRating(n)} hitSlop={8}>
                  <Star
                    size={36}
                    color={colors.accent}
                    weight={rating !== null && n <= rating ? 'fill' : 'regular'}
                  />
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Notes — optional for all types */}
        <View style={s.field}>
          <Text style={s.label}>{t('report.notes_label')}</Text>
          <TextInput
            style={[s.input, s.textarea]}
            value={notes}
            onChangeText={setNotes}
            placeholder={t('report.notes_placeholder')}
            placeholderTextColor={colors['text-tertiary']}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={120}
          />
        </View>
      </ScrollView>

      <View style={s.footer}>
        <Pressable
          style={[s.submitBtn, !canSubmit() && { opacity: 0.5 }]}
          onPress={submit}
          disabled={!canSubmit()}
        >
          <Text style={s.submitText}>{t('report.submit')}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  root:        { flex: 1, backgroundColor: colors['bg-base'] },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16 },
  backBtn:     { width: 40, height: 40, borderRadius: 20, backgroundColor: colors['bg-card'], borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  title:       { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 20, color: colors['text-primary'] },
  label:       { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors['text-secondary'], marginBottom: 10, marginTop: 4 },
  typeGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
  typeCard:    { width: '47%', flexGrow: 1, backgroundColor: colors['bg-card'], borderRadius: 14, borderWidth: 1.5, borderColor: colors.border, padding: 16, alignItems: 'center', gap: 10 },
  typeIcon:    { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  typeLabel:   { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors['text-secondary'] },
  field:       { marginBottom: 16 },
  input:       { backgroundColor: colors['bg-card'], borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 14, fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-primary'] },
  textarea:    { minHeight: 100, paddingTop: 14 },
  levelRow:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  levelChip:   { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors['bg-card'] },
  levelText:   { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors['text-secondary'] },
  starRow:     { flexDirection: 'row', gap: 12, paddingVertical: 8 },
  footer:      { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors['bg-base'], padding: 20, paddingBottom: 36, borderTopWidth: 1, borderTopColor: colors.border },
  submitBtn:   { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  submitText:  { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors['text-inverse'] },
});
