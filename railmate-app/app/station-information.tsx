// app/station-information.tsx
import React, { useCallback } from 'react';
import { ArrowLeft } from 'phosphor-react-native';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Radius, Spacing, Typography } from '../constants';
import { supabase } from '../lib/supabase';
import { useQuery } from '@tanstack/react-query';
import { Station } from '../types/station.types';
import { useTranslation } from '../i18n';

const FACILITIES = ['Waiting Room', 'Ticket Counter', 'Washroom', 'Food Court', 'Drinking Water', 'Parking'];

export default function StationInformationScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { t } = useTranslation();

  const { data: station, isLoading: stationLoading, error: stationError, refetch } = useQuery<Station | null>({
    queryKey: ['station', id],
    queryFn: async () => {
      if (!id) return null;
      const { data, error } = await supabase
        .from('stations')
        .select('id, code, name_en, name_bn, division, zone, is_major')
        .eq('id', id)
        .maybeSingle();
      if (error) throw error;
      return data as Station | null;
    },
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });

  const { data: popularTrains } = useQuery<any[]>({
    queryKey: ['station_trains', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('trains')
        .select('id, number, name_en, name_bn, type, origin_id, destination_id')
        .or(`origin_id.eq.${id},destination_id.eq.${id}`)
        .eq('is_active', true)
        .limit(10);
      if (error) return [];
      return data ?? [];
    },
    enabled: !!id,
    staleTime: 30 * 60 * 1000,
  });

  const openMaps = useCallback(() => {
    const query = encodeURIComponent(`${station?.name_en} Railway Station Bangladesh`);
    Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`);
  }, [station?.name_en]);

  // Loading state
  if (stationLoading) {
    return (
      <SafeAreaView style={si.root} edges={['top']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing['space-4'], padding: Spacing['space-5'] }}>
          {[0, 1, 2].map(i => (
            <View key={i} style={{ width: '100%', height: 120, backgroundColor: Colors.dark['bg-card'], borderRadius: Radius['radius-lg'], opacity: 0.6 }} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (stationError) {
    return (
      <SafeAreaView style={si.root} edges={['top']}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing['space-4'] }}>
          <Text style={{ color: Colors.dark['text-secondary'], ...Typography.body }}>{t('common.error')}</Text>
          <TouchableOpacity onPress={() => refetch()} style={{ backgroundColor: Colors.dark.primary, borderRadius: Radius['radius-md'], paddingHorizontal: Spacing['space-5'], paddingVertical: Spacing['space-3'] }}>
            <Text style={{ color: Colors.dark['bg-base'], fontWeight: '700', ...Typography.body }}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Not found state
  if (!station && !stationLoading) {
    return (
      <SafeAreaView style={si.root} edges={['top']}>
        <View style={si.header}>
          <TouchableOpacity style={si.backBtn} onPress={() => router.back()}>
            <ArrowLeft size={18} color={Colors.dark['text-primary']} />
          </TouchableOpacity>
          <Text style={si.title}>Station Information</Text>
          <View style={{ width: 32 }} />
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: Spacing['space-4'], padding: Spacing['space-5'] }}>
          <View style={{ width: 80, height: 80, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 40, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 40, color: Colors.dark['text-tertiary'] }}>🚉</Text>
          </View>
          <Text style={{ color: Colors.dark['text-primary'], ...Typography.h3, fontWeight: '700', textAlign: 'center' }}>Station Not Found</Text>
          <Text style={{ color: Colors.dark['text-secondary'], ...Typography.body, textAlign: 'center' }}>
            The station you&#39;re looking for doesn&#39;t exist or has been removed.
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: Colors.dark.primary, borderRadius: Radius['radius-md'], paddingHorizontal: Spacing['space-5'], paddingVertical: Spacing['space-3'] }}
            onPress={() => router.back()}
          >
            <Text style={{ color: Colors.dark['bg-base'], fontWeight: '700', ...Typography.body }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={si.root} edges={['top']}>
      <View style={si.header}>
        <TouchableOpacity style={si.backBtn} onPress={() => router.back()}><ArrowLeft size={18} color={Colors.dark['text-primary']} /></TouchableOpacity>
        <View style={si.headerTitle}>
          <View style={si.headerIcon} />
          <Text style={si.title}>Station Information</Text>
        </View>
        <TouchableOpacity style={si.shareBtn} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={si.scroll}>
        {/* Station name */}
        <View style={si.nameRow}>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing['space-2'] }}>
              <Text style={si.stationName} numberOfLines={1} ellipsizeMode="tail">{station!.name_en}</Text>
              {station!.is_major && (
                <View style={{ backgroundColor: Colors.dark['primary-subtle'], borderRadius: 6, paddingHorizontal: Spacing['space-2'], paddingVertical: 2, borderWidth: 1, borderColor: Colors.dark.primary }}>
                  <Text style={{ ...Typography.caption, fontWeight: '700', color: Colors.dark.primary }}>Major Station</Text>
                </View>
              )}
            </View>
            <Text style={si.stationBn} numberOfLines={1} ellipsizeMode="tail">{station!.name_bn}</Text>
            {station!.code ? (
              <Text style={{ ...Typography.caption, color: Colors.dark['text-tertiary'], marginTop: 2 }}>Code: {station!.code}</Text>
            ) : null}
          </View>
          <View style={si.ratingBox}>
            {station!.division ? (
              <>
                <Text style={si.ratingNum} numberOfLines={1} ellipsizeMode="tail">{station!.division}</Text>
                <Text style={si.ratingCount}>Division</Text>
              </>
            ) : null}
            {station!.zone ? (
              <Text style={[si.ratingCount, { marginTop: 4 }]}>{station!.zone} Zone</Text>
            ) : null}
          </View>
        </View>
        {/* Photo */}
        <View style={si.stationPhoto} />
        {/* Facilities */}
        <View style={si.card}>
          <View style={si.sectionHeader}>
            <Text style={si.sectionTitle}>Facilities</Text>
            <TouchableOpacity><Text style={si.viewAll}>View All</Text></TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={si.facilitiesRow}>
              {FACILITIES.map(f => (
                <View key={f} style={si.facilityItem}>
                  <View style={si.facilityIcon} />
                  <Text style={si.facilityLabel}>{f}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
        {/* Directions */}
        <View style={si.card}>
          <View style={si.dirRow}>
            <View style={{ flex: 1 }}>
              <View style={si.dirTitleRow}>
                <View style={si.dirIcon} />
                <Text style={si.dirTitle}>Directions</Text>
              </View>
              <Text style={si.dirAddress}>{station!.name_en} Railway Station{'\n'}{station!.division ? station!.division + ', ' : ''}Bangladesh</Text>
            </View>
            <View style={si.mapPreview} />
          </View>
          <TouchableOpacity style={si.openMapBtn} onPress={openMaps}>
            <Text style={si.openMapText}>Open in Maps ↗</Text>
          </TouchableOpacity>
        </View>
        {/* Popular trains */}
        <View style={si.card}>
          <View style={si.sectionHeader}>
            <Text style={[si.sectionTitle, { flex: 1 }]} numberOfLines={1} ellipsizeMode="tail">Popular Trains from {station!.name_en}</Text>
            <TouchableOpacity><Text style={si.viewAll}>View All</Text></TouchableOpacity>
          </View>
          {(popularTrains ?? []).length === 0 ? (
            <Text style={{ color: Colors.dark['text-secondary'], ...Typography['body-sm'], textAlign: 'center', paddingVertical: Spacing['space-3'] }}>No trains found</Text>
          ) : (
            (popularTrains ?? []).map((train, i) => (
              <View key={train.id}>
                <TouchableOpacity
                  style={si.trainRow}
                  onPress={() => router.push({ pathname: '/train-detail' as any, params: { id: train.number } })}
                >
                  <View style={si.trainNumBadge}>
                    <Text style={si.trainNumText}>#{train.number}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={si.trainName} numberOfLines={1} ellipsizeMode="tail">{train.name_en}</Text>
                    <Text style={si.trainRoute}>{train.name_bn}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={si.trainTime}>{train.type}</Text>
                    <Text style={si.trainFreq}>Active</Text>
                  </View>
                  <View style={si.chevron} />
                </TouchableOpacity>
                {i < (popularTrains ?? []).length - 1 && <View style={si.divider} />}
              </View>
            ))
          )}
        </View>
        {/* Contact */}
        <View style={si.card}>
          <Text style={si.sectionTitle}>Contact</Text>
          {[['Station Master Office', ''], ['Bangladesh Railway', '']].map(([l, v], i, arr) => (
            <View key={l}>
              <View style={si.contactRow}>
                <View style={si.contactIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={si.contactLabel}>{l}</Text>
                  {v ? <Text style={si.contactVal}>{v}</Text> : null}
                </View>
                <View style={si.extIcon} />
              </View>
              {i < arr.length - 1 && <View style={si.divider} />}
            </View>
          ))}
        </View>
        <View style={si.noteCard}>
          <Text style={si.noteText}>ℹ Information is community verified. Please help keep it up to date.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const si = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dark['bg-base'] },
  scroll: { padding: Spacing['space-5'], gap: Spacing['space-4'], paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing['space-5'], paddingVertical: Spacing['space-3'] },
  backBtn: { width: 32, height: 32, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-2'] },
  headerIcon: { width: 32, height: 32, backgroundColor: Colors.dark['primary-subtle'], borderRadius: 8 },
  title: { fontSize: 17, fontWeight: '700', color: Colors.dark['text-primary'] },
  shareBtn: { width: 32, height: 32, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 16 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  stationName: { fontSize: 17, fontWeight: '700', color: Colors.dark['text-primary'], flexShrink: 1 },
  stationBn: { ...Typography['body-sm'], color: Colors.dark['text-secondary'], marginTop: 2 },
  ratingBox: { alignItems: 'center', flexShrink: 0, marginLeft: Spacing['space-3'] },
  ratingStar: { fontSize: 16 },
  ratingNum: { fontSize: 14, fontWeight: '700', color: Colors.dark['text-primary'], maxWidth: 100 },
  ratingCount: { ...Typography.caption, color: Colors.dark['text-secondary'], marginTop: 2 },
  stationPhoto: { width: '100%', height: 180, backgroundColor: Colors.dark['bg-overlay'], borderRadius: Radius['radius-lg'] },
  card: { backgroundColor: Colors.dark['bg-card'], borderRadius: Radius['radius-lg'], borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing['space-4'], gap: Spacing['space-3'] },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { ...Typography.h4, fontWeight: '700', color: Colors.dark['text-primary'] },
  viewAll: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark.primary },
  facilitiesRow: { flexDirection: 'row', gap: Spacing['space-2'] },
  facilityItem: { alignItems: 'center', gap: Spacing['space-1'], width: 70 },
  facilityIcon: { width: 48, height: 48, backgroundColor: Colors.dark['bg-overlay'], borderRadius: Radius['radius-md'] },
  facilityLabel: { ...Typography.caption, color: Colors.dark['text-secondary'], textAlign: 'center' },
  dirRow: { flexDirection: 'row', gap: Spacing['space-3'] },
  dirTitleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-2'], marginBottom: Spacing['space-2'] },
  dirIcon: { width: 20, height: 20, backgroundColor: Colors.dark['primary-subtle'], borderRadius: 10 },
  dirTitle: { ...Typography.h4, fontWeight: '700', color: Colors.dark['text-primary'] },
  dirAddress: { ...Typography['body-sm'], color: Colors.dark['text-secondary'], lineHeight: 20 },
  mapPreview: { width: 80, height: 72, backgroundColor: Colors.dark['info-subtle'], borderRadius: 10 },
  openMapBtn: { backgroundColor: Colors.dark['bg-overlay'], borderRadius: 10, paddingVertical: Spacing['space-3'], alignItems: 'center', borderWidth: 1, borderColor: Colors.dark.border },
  openMapText: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark['text-primary'] },
  trainRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-3'], paddingVertical: Spacing['space-2'] },
  trainNumBadge: { width: 28, height: 28, backgroundColor: Colors.dark['primary-subtle'], borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  trainNumText: { ...Typography['body-sm'], fontWeight: '700', color: Colors.dark.primary },
  trainName: { ...Typography.body, fontWeight: '600', color: Colors.dark['text-primary'] },
  trainRoute: { ...Typography['body-sm'], color: Colors.dark['text-secondary'], marginTop: 1 },
  trainTime: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark['text-primary'] },
  trainFreq: { ...Typography.caption, color: Colors.dark['text-secondary'], marginTop: 1 },
  chevron: { width: 16, height: 16, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 4 },
  divider: { height: 1, backgroundColor: Colors.dark.border },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-3'], paddingVertical: Spacing['space-2'] },
  contactIcon: { width: 28, height: 28, backgroundColor: Colors.dark['primary-subtle'], borderRadius: 14 },
  contactLabel: { ...Typography.body, fontWeight: '600', color: Colors.dark['text-primary'] },
  contactVal: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark.primary, marginTop: 2 },
  extIcon: { width: 20, height: 20, backgroundColor: Colors.dark['primary-subtle'], borderRadius: 10 },
  noteCard: { backgroundColor: Colors.dark['bg-card'], borderRadius: Radius['radius-md'], borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing['space-3'] },
  noteText: { ...Typography['body-sm'], color: Colors.dark['text-secondary'], textAlign: 'center' },
});
