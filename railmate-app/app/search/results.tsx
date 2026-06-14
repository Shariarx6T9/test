import React from 'react';
import { View, FlatList, ActivityIndicator, Pressable, StyleSheet, Text, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Faders, Train, MagnifyingGlass } from 'phosphor-react-native';
import { TrainCard } from '../../components/features/TrainCard/TrainCard';
import { useSearchTrains } from '../../hooks/useTrains';
import { useStations } from '../../hooks/useStations';
import { useTranslation } from '../../i18n';
import { ErrorBoundary } from '../../components/ErrorBoundary';

const C = {
  bg: '#080D17', bgCard: '#0F1929', bgElevated: '#162035',
  primary: '#00A859', textPri: '#F0F4FF', textSec: '#8FA3C0', textTer: '#4E6480',
  border: '#1E2E42', danger: '#E8394B',
};

function ResultsScreen() {
  const router = useRouter();
  const { fromId, toId, date } = useLocalSearchParams<{ fromId: string; toId: string; date: string }>();
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';

  const { data: stations } = useStations();
  const { data: trains, isLoading, error } = useSearchTrains({ fromStationId: fromId, toStationId: toId, date });

  const fromStation = stations?.find((s) => s.id === fromId);
  const toStation   = stations?.find((s) => s.id === toId);

  const routeTitle = fromStation && toStation
    ? `${isBengali ? fromStation.name_bn : fromStation.name_en} → ${isBengali ? toStation.name_bn : toStation.name_en}`
    : 'Trains';

  const dateLabel = new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'long' });

  const ListHeader = () => (
    <View style={s.badge}>
      <Train size={14} color={C.primary} weight="fill" />
      <Text style={s.badgeText}>{trains?.length ?? 0} trains found</Text>
    </View>
  );

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* Header */}
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={C.textPri} weight="bold" />
        </Pressable>
        <View style={{ flex: 1, marginHorizontal: 14 }}>
          <Text style={s.headerTitle}>{routeTitle}</Text>
          <Text style={s.headerSub}>Today • All Classes</Text>
        </View>
        <Pressable style={s.filterBtn}>
          <Faders size={18} color={C.textSec} />
        </Pressable>
      </View>

      {isLoading ? (
        <View style={s.center}>
          <ActivityIndicator color={C.primary} size="large" />
          <Text style={[s.loadingText, { marginTop: 12 }]}>{t('loading')}</Text>
        </View>
      ) : error ? (
        <View style={s.center}>
          <Text style={s.errorText}>{t('error.generic')}</Text>
          <Pressable style={s.retryBtn} onPress={() => router.back()}>
            <Text style={s.retryText}>Go Back</Text>
          </Pressable>
        </View>
      ) : trains && trains.length > 0 ? (
        <FlatList
          data={trains}
          keyExtractor={(item) => item.train_id}
          renderItem={({ item }) => <TrainCard train={item} fromId={fromId} toId={toId} />}
          ListHeaderComponent={ListHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        />
      ) : (
        <View style={s.center}>
          <MagnifyingGlass size={48} color={C.textTer} weight="thin" />
          <Text style={s.noResultTitle}>{t('results.none')}</Text>
          <Text style={s.noResultHint}>{t('results.none_hint')}</Text>
          <Pressable style={s.retryBtn} onPress={() => router.back()}>
            <Text style={s.retryText}>Search Again</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default function SearchResultsScreen() {
  return <ErrorBoundary name="Search Results"><ResultsScreen /></ErrorBoundary>;
}

const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: C.bg },
  header:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  backBtn:       { width: 40, height: 40, borderRadius: 20, backgroundColor: C.bgCard, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  headerTitle:   { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: C.textPri },
  headerSub:     { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.textSec, marginTop: 2 },
  filterBtn:     { width: 40, height: 40, borderRadius: 10, backgroundColor: C.bgCard, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  badge:         { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#00A85920', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, alignSelf: 'flex-start', marginBottom: 16 },
  badgeText:     { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.primary },
  center:        { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  loadingText:   { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSec },
  errorText:     { fontFamily: 'Inter_500Medium', fontSize: 16, color: '#E8394B', textAlign: 'center' },
  noResultTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 20, color: C.textPri, marginTop: 12 },
  noResultHint:  { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSec, textAlign: 'center' },
  retryBtn:      { backgroundColor: C.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
  retryText:     { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#fff' },
});
