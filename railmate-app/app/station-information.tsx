// app/station-information.tsx
import React, { useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../theme';
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
      <SafeAreaView style={si.root}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: S.lg, padding: S.xl }}>
          {[0, 1, 2].map(i => (
            <View key={i} style={{ width: '100%', height: 120, backgroundColor: C.surface, borderRadius: R.lg, opacity: 0.6 }} />
          ))}
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (stationError) {
    return (
      <SafeAreaView style={si.root}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: S.lg }}>
          <Text style={{ color: C.text2, fontSize: T.base }}>{t('common.error')}</Text>
          <TouchableOpacity onPress={() => refetch()} style={{ backgroundColor: C.green, borderRadius: R.md, paddingHorizontal: S.xl, paddingVertical: S.md }}>
            <Text style={{ color: C.bg, fontWeight: '700', fontSize: T.base }}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Not found state
  if (!station && !stationLoading) {
    return (
      <SafeAreaView style={si.root}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: C.text2, fontSize: T.base }}>Station not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={si.root}>
      <View style={si.header}>
        <TouchableOpacity style={si.backBtn} onPress={() => router.back()} />
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
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: S.sm, flexWrap: 'wrap' }}>
              <Text style={si.stationName}>{station!.name_en}</Text>
              {station!.is_major && (
                <View style={{ backgroundColor: C.greenTint, borderRadius: 6, paddingHorizontal: S.sm, paddingVertical: 2, borderWidth: 1, borderColor: C.green }}>
                  <Text style={{ fontSize: T.xs, fontWeight: '700', color: C.green }}>Major Station</Text>
                </View>
              )}
            </View>
            <Text style={si.stationBn}>{station!.name_bn}</Text>
            {station!.code ? (
              <Text style={{ fontSize: T.xs, color: C.text3, marginTop: 2 }}>Code: {station!.code}</Text>
            ) : null}
          </View>
          <View style={si.ratingBox}>
            {station!.division ? (
              <>
                <Text style={si.ratingNum}>{station!.division}</Text>
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
            <Text style={si.sectionTitle}>Popular Trains from {station!.name_en}</Text>
            <TouchableOpacity><Text style={si.viewAll}>View All</Text></TouchableOpacity>
          </View>
          {(popularTrains ?? []).length === 0 ? (
            <Text style={{ color: C.text2, fontSize: T.sm, textAlign: 'center', paddingVertical: S.md }}>No trains found</Text>
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
                    <Text style={si.trainName}>{train.name_en}</Text>
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
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.lg, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.xl, paddingVertical: S.md },
  backBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
  headerTitle: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  headerIcon: { width: 32, height: 32, backgroundColor: C.greenTint, borderRadius: 8 },
  title: { fontSize: 17, fontWeight: '700', color: C.white },
  shareBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  stationName: { fontSize: 17, fontWeight: '700', color: C.white },
  stationBn: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  ratingBox: { alignItems: 'center' },
  ratingStar: { fontSize: 16 },
  ratingNum: { fontSize: 14, fontWeight: '700', color: C.white },
  ratingCount: { fontSize: T.xs, color: C.text2 },
  stationPhoto: { width: '100%', height: 180, backgroundColor: C.surface2, borderRadius: R.lg },
  card: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.lg, gap: S.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: T.md, fontWeight: '700', color: C.white },
  viewAll: { fontSize: T.sm, fontWeight: '600', color: C.green },
  facilitiesRow: { flexDirection: 'row', gap: S.sm },
  facilityItem: { alignItems: 'center', gap: S.xs, width: 70 },
  facilityIcon: { width: 48, height: 48, backgroundColor: C.surface2, borderRadius: R.md },
  facilityLabel: { fontSize: T.xs, color: C.text2, textAlign: 'center' },
  dirRow: { flexDirection: 'row', gap: S.md },
  dirTitleRow: { flexDirection: 'row', alignItems: 'center', gap: S.sm, marginBottom: S.sm },
  dirIcon: { width: 20, height: 20, backgroundColor: C.greenTint, borderRadius: 10 },
  dirTitle: { fontSize: T.md, fontWeight: '700', color: C.white },
  dirAddress: { fontSize: T.sm, color: C.text2, lineHeight: 20 },
  mapPreview: { width: 80, height: 72, backgroundColor: C.blueTint, borderRadius: 10 },
  openMapBtn: { backgroundColor: C.surface2, borderRadius: 10, paddingVertical: S.md, alignItems: 'center', borderWidth: 1, borderColor: C.border },
  openMapText: { fontSize: T.sm, fontWeight: '600', color: C.white },
  trainRow: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: S.sm },
  trainNumBadge: { width: 28, height: 28, backgroundColor: C.greenTint, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  trainNumText: { fontSize: T.sm, fontWeight: '700', color: C.green },
  trainName: { fontSize: T.base, fontWeight: '600', color: C.white },
  trainRoute: { fontSize: T.sm, color: C.text2, marginTop: 1 },
  trainTime: { fontSize: T.sm, fontWeight: '600', color: C.white },
  trainFreq: { fontSize: T.xs, color: C.text2, marginTop: 1 },
  chevron: { width: 16, height: 16, backgroundColor: C.surface2, borderRadius: 4 },
  divider: { height: 1, backgroundColor: C.border },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingVertical: S.sm },
  contactIcon: { width: 28, height: 28, backgroundColor: C.greenTint, borderRadius: 14 },
  contactLabel: { fontSize: T.base, fontWeight: '600', color: C.white },
  contactVal: { fontSize: T.sm, fontWeight: '600', color: C.green, marginTop: 2 },
  extIcon: { width: 20, height: 20, backgroundColor: C.greenTint, borderRadius: 10 },
  noteCard: { backgroundColor: C.surface, borderRadius: R.md, borderWidth: 1, borderColor: C.border, padding: S.md },
  noteText: { fontSize: T.sm, color: C.text2, textAlign: 'center' },
});
