// app/station/[id].tsx
// Station Info — matches Image 4 (station info screen)
// Live Supabase data replacing the previous 2-station hardcoded mock.

import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft, Phone, MapPin, Train, WifiHigh, Coffee,
  ParkingSign, Toilet, Ticket, Clock, CaretRight,
} from 'phosphor-react-native';
import { supabase } from '../../lib/supabase';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';
import { ErrorBoundary } from '../../components/ErrorBoundary';

interface Station {
  id: string;
  name_en: string;
  name_bn: string;
  code: string;
  division: string | null;
  district: string | null;
  latitude: number | null;
  longitude: number | null;
  address: string | null;
  phone: string | null;
  photo_url: string | null;
  has_wifi: boolean;
  has_waiting_room: boolean;
  has_food: boolean;
  has_parking: boolean;
  has_toilet: boolean;
  has_ticket_counter: boolean;
}

interface PopularTrain {
  id: string;
  name_en: string;
  name_bn: string;
  number: string;
}

async function fetchStation(id: string): Promise<Station | null> {
  const { data, error } = await supabase
    .from('stations')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data as Station | null;
}

async function fetchPopularTrains(stationId: string): Promise<PopularTrain[]> {
  // Get trains that stop at this station via train_stops join
  const { data, error } = await supabase
    .from('train_stops')
    .select('train:trains!train_stops_train_id_fkey(id, name_en, name_bn, number)')
    .eq('station_id', stationId)
    .limit(5);

  if (error) return [];
  return ((data ?? []).map((r: any) => r.train).filter(Boolean)) as PopularTrain[];
}

const FACILITY_DEFS = [
  { key: 'has_wifi',           Icon: WifiHigh,     label: 'Wi-Fi' },
  { key: 'has_waiting_room',   Icon: Clock,        label: 'Waiting Room' },
  { key: 'has_food',           Icon: Coffee,       label: 'Food & Drinks' },
  { key: 'has_parking',        Icon: ParkingSign,  label: 'Parking' },
  { key: 'has_toilet',         Icon: Toilet,       label: 'Toilets' },
  { key: 'has_ticket_counter', Icon: Ticket,       label: 'Ticket Counter' },
] as const;

function StationContent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const s = useMemo(() => createStyles(colors), [colors]);

  const { data: station, isLoading } = useQuery({
    queryKey: ['station', id],
    queryFn: () => fetchStation(id ?? ''),
    enabled: !!id,
  });

  const { data: trains } = useQuery({
    queryKey: ['station_trains', id],
    queryFn: () => fetchPopularTrains(id ?? ''),
    enabled: !!id,
    staleTime: 300_000,
  });

  const handleCall = () => {
    if (station?.phone) Linking.openURL(`tel:${station.phone}`);
  };

  const handleDirections = () => {
    if (station?.latitude && station?.longitude) {
      Linking.openURL(
        `https://maps.google.com/?q=${station.latitude},${station.longitude}`
      );
    }
  };

  if (isLoading) {
    return (
      <View style={[s.root, { alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!station) {
    return (
      <View style={[s.root, { alignItems: 'center', justifyContent: 'center', padding: 32 }]}>
        <Text style={{ fontFamily: 'Inter_500Medium', fontSize: 16, color: colors['text-secondary'], textAlign: 'center' }}>
          Station not found.
        </Text>
        <Pressable style={{ marginTop: 16 }} onPress={() => router.back()}>
          <Text style={{ color: colors.primary, fontFamily: 'Inter_600SemiBold', fontSize: 15 }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const facilities = FACILITY_DEFS.filter(f => (station as any)[f.key]);

  return (
    <View style={s.root}>
      {/* Header with photo placeholder */}
      <View style={[s.hero, { paddingTop: insets.top }]}>
        <View style={s.heroOverlay} />
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color="#fff" weight="bold" />
        </Pressable>
        <View style={s.heroText}>
          <View style={s.codePill}>
            <Text style={s.codeText}>{station.code}</Text>
          </View>
          <Text style={s.heroName}>{station.name_en}</Text>
          <Text style={s.heroBn}>{station.name_bn}</Text>
          {station.district && (
            <View style={s.locationRow}>
              <MapPin size={14} color="rgba(255,255,255,0.7)" />
              <Text style={s.locationText}>
                {station.district}{station.division ? `, ${station.division}` : ''}
              </Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      >
        {/* Quick actions */}
        <View style={s.actionRow}>
          {station.latitude && station.longitude && (
            <Pressable style={s.actionBtn} onPress={handleDirections}>
              <MapPin size={18} color={colors.primary} weight="fill" />
              <Text style={s.actionText}>Directions</Text>
            </Pressable>
          )}
          {station.phone && (
            <Pressable style={s.actionBtn} onPress={handleCall}>
              <Phone size={18} color={colors.primary} weight="fill" />
              <Text style={s.actionText}>Call Station</Text>
            </Pressable>
          )}
        </View>

        {/* Facilities */}
        {facilities.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Facilities</Text>
            <View style={s.facilitiesGrid}>
              {facilities.map(({ Icon, label, key }) => (
                <View key={key} style={s.facilityChip}>
                  <Icon size={18} color={colors.primary} weight="duotone" />
                  <Text style={s.facilityLabel}>{label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Popular Trains */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Popular Trains</Text>
          {(trains ?? []).length === 0 ? (
            <Text style={s.emptyText}>No train data available.</Text>
          ) : (
            (trains ?? []).map(train => (
              <Pressable
                key={train.id}
                style={s.trainRow}
                onPress={() => router.push({ pathname: '/train/[id]' as any, params: { id: train.id } })}
              >
                <View style={s.trainIconWrap}>
                  <Train size={18} color={colors.primary} weight="duotone" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={s.trainName}>{train.name_en}</Text>
                  <Text style={s.trainNum}>#{train.number}</Text>
                </View>
                <CaretRight size={16} color={colors['text-tertiary']} />
              </Pressable>
            ))
          )}
        </View>

        {/* Address */}
        {station.address && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Address</Text>
            <View style={s.infoCard}>
              <MapPin size={16} color={colors['text-secondary']} />
              <Text style={s.infoText}>{station.address}</Text>
            </View>
          </View>
        )}

        {/* Contact */}
        {station.phone && (
          <View style={s.section}>
            <Text style={s.sectionTitle}>Contact</Text>
            <Pressable style={s.infoCard} onPress={handleCall}>
              <Phone size={16} color={colors.primary} />
              <Text style={[s.infoText, { color: colors.primary }]}>{station.phone}</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default function StationScreen() {
  return <ErrorBoundary name="Station Info"><StationContent /></ErrorBoundary>;
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    root:           { flex: 1, backgroundColor: colors['bg-base'] },

    hero:           { height: 220, backgroundColor: '#0A1628', justifyContent: 'space-between', padding: 20 },
    heroOverlay:    { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,168,89,0.15)' },
    backBtn:        { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
    heroText:       { gap: 4 },
    codePill:       { alignSelf: 'flex-start', backgroundColor: 'rgba(0,168,89,0.25)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4, borderWidth: 1, borderColor: 'rgba(0,168,89,0.4)' },
    codeText:       { fontFamily: 'JetBrainsMono_400Regular', fontSize: 12, color: '#00A859' },
    heroName:       { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 24, color: '#fff' },
    heroBn:         { fontFamily: 'Inter_400Regular', fontSize: 16, color: 'rgba(255,255,255,0.7)' },
    locationRow:    { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
    locationText:   { fontFamily: 'Inter_400Regular', fontSize: 13, color: 'rgba(255,255,255,0.7)' },

    actionRow:      { flexDirection: 'row', gap: 12, marginBottom: 24 },
    actionBtn:      { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors['bg-card'], borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingVertical: 14 },
    actionText:     { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors.primary },

    section:        { marginBottom: 24 },
    sectionTitle:   { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors['text-primary'], marginBottom: 12 },

    facilitiesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
    facilityChip:   { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors['bg-card'], borderWidth: 1, borderColor: colors.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10 },
    facilityLabel:  { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors['text-primary'] },

    trainRow:       { flexDirection: 'row', alignItems: 'center', backgroundColor: colors['bg-card'], borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 14, marginBottom: 10 },
    trainIconWrap:  { width: 38, height: 38, borderRadius: 19, backgroundColor: colors['primary-subtle'], alignItems: 'center', justifyContent: 'center' },
    trainName:      { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors['text-primary'] },
    trainNum:       { fontFamily: 'JetBrainsMono_400Regular', fontSize: 12, color: colors['text-secondary'], marginTop: 2 },
    emptyText:      { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-tertiary'] },

    infoCard:       { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors['bg-card'], borderWidth: 1, borderColor: colors.border, borderRadius: 14, padding: 16 },
    infoText:       { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-secondary'], flex: 1, lineHeight: 22 },
  });
