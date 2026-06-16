import React, { useMemo, useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text, TextInput, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Warning, Users, Gauge, Train, MapPin, Camera, CheckCircle } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';
import { useTranslation } from '../../i18n';

export default function SubmitReportScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => createStyles(colors), [colors]);

  const TYPES = useMemo(() => [
    { key: 'DELAY',    label: t('report.type_delay'),    icon: Warning, color: colors.accent },
    { key: 'CROWD',    label: t('report.type_crowd'),    icon: Users,   color: colors.danger },
    { key: 'PLATFORM', label: t('report.type_platform'), icon: Train,   color: colors.primary },
    { key: 'GENERAL',  label: t('report.type_general'),  icon: Gauge,   color: colors.info },
  ], [t, colors]);

  const [type, setType] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [delay, setDelay] = useState('');

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('', t('report.location_permission'));
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    const [place] = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    setLocation(place?.city ?? place?.district ?? t('report.tag_location'));
  };

  const addPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8, selectionLimit: 3 - photos.length });
    if (!result.canceled) setPhotos([...photos, ...result.assets.map((a) => a.uri)].slice(0, 3));
  };

  const submit = () => {
    if (!type) { Alert.alert('', t('report.select_type_error')); return; }
    Alert.alert(t('report.submit_success'), t('report.submit_thanks'), [{ text: t('report.done'), onPress: () => router.back() }]);
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

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 140 }} showsVerticalScrollIndicator={false}>

        {/* Type selector */}
        <Text style={s.label}>{t('report.type_label')}</Text>
        <View style={s.typeGrid}>
          {TYPES.map(({ key, label, icon: Icon, color }) => {
            const active = type === key;
            return (
              <Pressable key={key} style={[s.typeCard, active && { backgroundColor: color + '18', borderColor: color }]} onPress={() => setType(key)}>
                <View style={[s.typeIcon, { backgroundColor: active ? color + '25' : colors['bg-elevated'] }]}>
                  <Icon size={22} color={active ? color : colors['text-tertiary']} weight={active ? 'fill' : 'duotone'} />
                </View>
                <Text style={[s.typeLabel, active && { color }]}>{label}</Text>
                {active && <CheckCircle size={16} color={color} weight="fill" style={{ position: 'absolute', top: 10, right: 10 }} />}
              </Pressable>
            );
          })}
        </View>

        {/* Delay minutes if DELAY type */}
        {type === 'DELAY' && (
          <View style={s.field}>
            <Text style={s.label}>{t('report.delay_label')}</Text>
            <TextInput
              style={s.input} value={delay} onChangeText={setDelay}
              placeholder={t('report.delay_placeholder')} placeholderTextColor={colors['text-tertiary']}
              keyboardType="numeric"
            />
          </View>
        )}

        {/* Notes */}
        <View style={s.field}>
          <Text style={s.label}>{t('report.notes_label')}</Text>
          <TextInput
            style={[s.input, s.textarea]} value={notes} onChangeText={setNotes}
            placeholder={t('report.notes_placeholder')} placeholderTextColor={colors['text-tertiary']}
            multiline numberOfLines={4} textAlignVertical="top"
          />
        </View>

        {/* Location */}
        <Pressable style={s.locationRow} onPress={getLocation}>
          <MapPin size={18} color={location ? colors.primary : colors['text-secondary']} weight={location ? 'fill' : 'regular'} />
          <Text style={[s.locationText, location && { color: colors.primary }]}>{location ?? t('report.tag_location')}</Text>
          {location && <CheckCircle size={16} color={colors.primary} weight="fill" />}
        </Pressable>

        {/* Photos */}
        <Pressable style={s.photoBtn} onPress={addPhoto} disabled={photos.length >= 3}>
          <Camera size={18} color={colors.primary} />
          <Text style={s.photoBtnText}>
            {photos.length > 0 ? t('report.add_photo_count', { count: photos.length }) : t('report.add_photo')}
          </Text>
        </Pressable>
      </ScrollView>

      <View style={s.footer}>
        <Pressable style={[s.submitBtn, !type && { opacity: 0.5 }]} onPress={submit} disabled={!type}>
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
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors['bg-card'], borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 14 },
  locationText:{ flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-secondary'] },
  photoBtn:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: 1.5, borderColor: colors.primary, borderStyle: 'dashed', borderRadius: 12, paddingVertical: 14, marginBottom: 14 },
  photoBtnText:{ fontFamily: 'Inter_500Medium', fontSize: 14, color: colors.primary },
  footer:      { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: colors['bg-base'], padding: 20, paddingBottom: 36, borderTopWidth: 1, borderTopColor: colors.border },
  submitBtn:   { backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  submitText:  { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors['text-inverse'] },
});
