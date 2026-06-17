// app/report/submit.tsx
// Community report submission — connected to live Supabase via useSubmitReport.

import React, { useMemo, useState } from 'react';
import {
  View, ScrollView, Pressable, StyleSheet, Text, TextInput,
  Alert, ActivityIndicator, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Warning, Users, Gauge, Train, MapPin, Camera, CheckCircle } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';
import { useTranslation } from '../../i18n';
import { useSubmitReport } from '../../hooks/useCommunityReports';
import { useAuthStore } from '../../stores/authStore';
import type { ReportType } from '../../types/report.types';

export default function SubmitReportScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => createStyles(colors), [colors]);
  const { user, isAuthenticated } = useAuthStore();

  const TYPES = useMemo(
    () => [
      { key: 'DELAY' as ReportType,    label: t('report.type_delay'),    icon: Warning, color: colors.accent },
      { key: 'CROWD' as ReportType,    label: t('report.type_crowd'),    icon: Users,   color: colors.danger },
      { key: 'PLATFORM' as ReportType, label: t('report.type_platform'), icon: Train,   color: colors.primary },
      { key: 'GENERAL' as ReportType,  label: t('report.type_general'),  icon: Gauge,   color: colors.info },
    ],
    [t, colors]
  );

  const [reportType, setReportType] = useState<ReportType | null>(null);
  const [description, setDescription] = useState('');
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [delayMinutes, setDelayMinutes] = useState('');

  const { mutate: submitReport, isPending: submitting } = useSubmitReport();

  // Guard: redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <View style={[s.root, { alignItems: 'center', justifyContent: 'center', padding: 32 }]}>
        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 16, color: colors['text-primary'], textAlign: 'center', marginBottom: 20 }}>
          {t('auth.sign_in')}
        </Text>
        <Pressable style={s.submitBtn} onPress={() => router.push('/auth/login' as any)}>
          <Text style={s.submitText}>{t('auth.sign_in')}</Text>
        </Pressable>
      </View>
    );
  }

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('', t('report.location_permission'));
      return;
    }
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const [place] = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
      setLocationLabel(place?.city ?? place?.district ?? place?.region ?? t('report.tag_location'));
    } catch {
      Alert.alert('', 'Could not get your location. Please try again.');
    }
  };

  const addPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('', t('auth.permission_message'));
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });
    if (!result.canceled && result.assets?.[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleSubmit = () => {
    if (!reportType) {
      Alert.alert('', t('report.select_type_error'));
      return;
    }
    if (!description.trim() && reportType === 'GENERAL') {
      Alert.alert('', 'Please add a description for general reports.');
      return;
    }

    const delay = reportType === 'DELAY' ? parseInt(delayMinutes, 10) : undefined;

    submitReport(
      {
        data: {
          report_type: reportType,
          description: description.trim() || null,
          delay_minutes: !isNaN(delay ?? NaN) ? delay : null,
          journey_date: new Date().toISOString().split('T')[0],
        },
        photoUri: photoUri ?? undefined,
      },
      {
        onSuccess: () => {
          Alert.alert(t('report.submit_success'), t('report.submit_thanks'), [
            { text: t('report.done'), onPress: () => router.back() },
          ]);
        },
        onError: (err) => {
          Alert.alert('Submission failed', err.message);
        },
      }
    );
  };

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
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
        keyboardShouldPersistTaps="handled"
      >
        {/* Type selector */}
        <Text style={s.label}>{t('report.type_label')}</Text>
        <View style={s.typeGrid}>
          {TYPES.map(({ key, label, icon: Icon, color }) => {
            const active = reportType === key;
            return (
              <Pressable
                key={key}
                style={[s.typeCard, active && { backgroundColor: color + '18', borderColor: color }]}
                onPress={() => setReportType(key)}
              >
                <View style={[s.typeIcon, { backgroundColor: active ? color + '25' : colors['bg-elevated'] }]}>
                  <Icon size={22} color={active ? color : colors['text-tertiary']} weight={active ? 'fill' : 'duotone'} />
                </View>
                <Text style={[s.typeLabel, active && { color }]}>{label}</Text>
                {active && (
                  <CheckCircle
                    size={16}
                    color={color}
                    weight="fill"
                    style={{ position: 'absolute', top: 10, right: 10 }}
                  />
                )}
              </Pressable>
            );
          })}
        </View>

        {/* Delay minutes — only for DELAY type */}
        {reportType === 'DELAY' && (
          <View style={s.field}>
            <Text style={s.label}>{t('report.delay_label')}</Text>
            <TextInput
              style={s.input}
              value={delayMinutes}
              onChangeText={(v) => setDelayMinutes(v.replace(/[^0-9]/g, ''))}
              placeholder={t('report.delay_placeholder')}
              placeholderTextColor={colors['text-tertiary']}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
        )}

        {/* Description */}
        <View style={s.field}>
          <Text style={s.label}>{t('report.notes_label')}</Text>
          <TextInput
            style={[s.input, s.textarea]}
            value={description}
            onChangeText={setDescription}
            placeholder={t('report.notes_placeholder')}
            placeholderTextColor={colors['text-tertiary']}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={s.charCount}>{description.length}/500</Text>
        </View>

        {/* Location tag */}
        <Pressable style={s.locationRow} onPress={getLocation}>
          <MapPin
            size={18}
            color={locationLabel ? colors.primary : colors['text-secondary']}
            weight={locationLabel ? 'fill' : 'regular'}
          />
          <Text style={[s.locationText, locationLabel && { color: colors.primary }]}>
            {locationLabel ?? t('report.tag_location')}
          </Text>
          {locationLabel && <CheckCircle size={16} color={colors.primary} weight="fill" />}
        </Pressable>

        {/* Photo */}
        <Pressable style={[s.photoBtn, !!photoUri && { borderColor: colors.primary }]} onPress={addPhoto}>
          <Camera size={18} color={photoUri ? colors.primary : colors.primary} />
          <Text style={s.photoBtnText}>
            {photoUri ? 'Photo added ✓' : t('report.add_photo')}
          </Text>
        </Pressable>
      </ScrollView>

      <View style={s.footer}>
        <Pressable
          style={[s.submitBtn, (!reportType || submitting) && { opacity: 0.5 }]}
          onPress={handleSubmit}
          disabled={!reportType || submitting}
        >
          {submitting
            ? <ActivityIndicator color={colors['text-inverse']} />
            : <Text style={s.submitText}>{t('report.submit')}</Text>}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    root:         { flex: 1, backgroundColor: colors['bg-base'] },
    header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16 },
    backBtn:      { width: 40, height: 40, borderRadius: 20, backgroundColor: colors['bg-card'], borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
    title:        { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 20, color: colors['text-primary'] },
    label:        { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors['text-secondary'], marginBottom: 10, marginTop: 4 },
    typeGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 },
    typeCard:     { width: '47%', flexGrow: 1, backgroundColor: colors['bg-card'], borderRadius: 14, borderWidth: 1.5, borderColor: colors.border, padding: 16, alignItems: 'center', gap: 10 },
    typeIcon:     { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    typeLabel:    { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors['text-secondary'] },
    field:        { marginBottom: 16 },
    input:        { backgroundColor: colors['bg-card'], borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 14, fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-primary'] },
    textarea:     { minHeight: 100, paddingTop: 14 },
    charCount:    { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors['text-tertiary'], textAlign: 'right', marginTop: 4 },
    locationRow:  { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors['bg-card'], borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 14 },
    locationText: { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-secondary'] },
    photoBtn:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: 1.5, borderColor: colors.primary, borderStyle: 'dashed', borderRadius: 12, paddingVertical: 14, marginBottom: 14 },
    photoBtnText: { fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.primary },
    footer:       { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors['bg-base'], padding: 20, paddingBottom: 36, borderTopWidth: 1, borderTopColor: colors.border },
    submitBtn:    { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
    submitText:   { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors['text-inverse'] },
  });
