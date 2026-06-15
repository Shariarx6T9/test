import React, { useMemo } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Train, WifiHigh, CoffeeBean, Toilet, Wheelchair, CaretRight } from 'phosphor-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';
import { useTranslation } from '../../i18n';

// Mock station directory — placeholder pending live station data API
const STATION_DATA: Record<string, any> = {
  dhaka: { name: 'Dhaka', namebn: 'ঢাকা', code: 'DAK', zone: 'Dhaka', platforms: 8, facilities: ['wifi', 'food', 'restroom', 'accessibility'], trains: ['Subarna Express', 'Turna Express', 'Mahanagar Exp', 'Parabat Express'] },
  chattogram: { name: 'Chattogram', namebn: 'চট্টগ্রাম', code: 'CTG', zone: 'Chattogram', platforms: 6, facilities: ['food', 'restroom', 'accessibility'], trains: ['Subarna Express', 'Sonar Bangla', 'Mahanagar Godhuli'] },
};

const FACILITY_ICONS: Record<string, any> = { wifi: WifiHigh, food: CoffeeBean, restroom: Toilet, accessibility: Wheelchair };

export default function StationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => createStyles(colors), [colors]);

  const station = STATION_DATA[id ?? ''] ?? { name: t('station.unknown'), namebn: t('station.unknown'), code: '???', zone: '—', platforms: 0, facilities: [], trains: [] };

  const facilityLabel = (f: string) => t(`station.facility_${f}` as any);

  return (
    <View style={s.root}>
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <Pressable style={s.backBtn} onPress={() => router.back()}><ArrowLeft size={20} color={colors['text-primary']} weight="bold" /></Pressable>
        <View>
          <Text style={s.title}>{station.name}</Text>
          <Text style={s.titlebn}>{station.namebn}</Text>
        </View>
        <View style={s.codePill}><Text style={s.code}>{station.code}</Text></View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Meta */}
        <View style={s.metaRow}>
          <View style={s.metaCard}><Text style={s.metaVal}>{station.zone}</Text><Text style={s.metaLabel}>{t('station.zone')}</Text></View>
          <View style={s.metaCard}><Text style={s.metaVal}>{station.platforms}</Text><Text style={s.metaLabel}>{t('station.platforms')}</Text></View>
          <View style={s.metaCard}><Text style={s.metaVal}>{station.trains.length}+</Text><Text style={s.metaLabel}>{t('station.daily_trains')}</Text></View>
        </View>

        {/* Facilities */}
        <Text style={s.sectionTitle}>{t('station.facilities')}</Text>
        <View style={s.facilitiesRow}>
          {station.facilities.map((f: string) => {
            const Icon = FACILITY_ICONS[f] ?? MapPin;
            return (
              <View key={f} style={s.facilityChip}>
                <Icon size={16} color={colors.primary} weight="duotone" />
                <Text style={s.facilityText}>{facilityLabel(f)}</Text>
              </View>
            );
          })}
        </View>

        {/* Popular Trains */}
        <Text style={s.sectionTitle}>{t('station.popular_trains')}</Text>
        {station.trains.map((trainName: string) => (
          <View key={trainName} style={s.trainRow}>
            <Train size={16} color={colors.primary} weight="fill" />
            <Text style={s.trainName}>{trainName}</Text>
            <CaretRight size={16} color={colors['text-tertiary']} />
          </View>
        ))}

        {/* Directions */}
        <Pressable style={s.directionsBtn} onPress={() => Linking.openURL(`https://maps.google.com/?q=${station.name}+railway+station+bangladesh`)}>
          <MapPin size={18} color={colors['text-inverse']} weight="fill" />
          <Text style={s.directionsText}>{t('station.directions')}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  root:          { flex: 1, backgroundColor: colors['bg-base'] },
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 16 },
  backBtn:       { width: 40, height: 40, borderRadius: 20, backgroundColor: colors['bg-card'], borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  title:         { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 20, color: colors['text-primary'] },
  titlebn:       { fontFamily: 'NotoSansBengali_400Regular', fontSize: 14, color: colors['text-secondary'], marginTop: 2 },
  codePill:      { backgroundColor: colors.primary + '20', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: colors.primary + '40' },
  code:          { fontFamily: 'JetBrainsMono_500Medium', fontSize: 14, color: colors.primary },
  metaRow:       { flexDirection: 'row', gap: 10, marginBottom: 24 },
  metaCard:      { flex: 1, backgroundColor: colors['bg-card'], borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 14, alignItems: 'center' },
  metaVal:       { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 18, color: colors.primary },
  metaLabel:     { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors['text-secondary'], marginTop: 4 },
  sectionTitle:  { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: colors['text-primary'], marginBottom: 14 },
  facilitiesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 28 },
  facilityChip:  { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors['bg-card'], borderRadius: 10, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 10 },
  facilityText:  { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors['text-secondary'] },
  trainRow:      { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors['bg-card'], borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 8 },
  trainName:     { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 14, color: colors['text-primary'] },
  directionsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, marginTop: 24 },
  directionsText:{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors['text-inverse'] },
});
