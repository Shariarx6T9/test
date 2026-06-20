import React, { useMemo } from 'react';
import { View, FlatList, ActivityIndicator, Pressable, StyleSheet, Text, StatusBar } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Faders, Train, MagnifyingGlass } from 'phosphor-react-native';
import { TrainCard } from '../../components/features/TrainCard/TrainCard';
import { useSearchTrains } from '../../hooks/useTrains';
import { useStations } from '../../hooks/useStations';
import { useThemeColors, useResolvedTheme, ThemeColors } from '../../hooks/useThemeColors';
import { useTranslation } from '../../i18n';
import { ErrorBoundary } from '../../components/ErrorBoundary';

function ResultsScreen() {
  const router = useRouter();
  const { fromId, toId, date } = useLocalSearchParams<{ fromId: string; toId: string; date: string }>();
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';

  const colors = useThemeColors();
  const theme = useResolvedTheme();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => createStyles(colors), [colors]);

  // Route params are always strings in Expo Router; station ids are UUID
  // strings in the canonical schema too, so use them directly.
  const fromStationId = fromId || undefined;
  const toStationId   = toId   || undefined;

  const { data: stations } = useStations();
  const { data: trains, isLoading, error } = useSearchTrains({ fromStationId, toStationId, date });

  const fromStation = stations?.find((s) => s.id === fromStationId);
  const toStation   = stations?.find((s) => s.id === toStationId);

  const routeTitle = fromStation && toStation
    ? `${isBengali ? fromStation.name_bn : fromStation.name_en} → ${isBengali ? toStation.name_bn : toStation.name_en}`
    : t('results.title');

  const ListHeader = () => (
    <View style={s.badge}>
      <Train size={14} color={colors.primary} weight="fill" />
      <Text style={s.badgeText}>{t('results.found', { count: trains?.length ?? 0 })}</Text>
    </View>
  );

  return (
    <View style={s.root}>
      <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors['bg-base']} />

      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors['text-primary']} weight="bold" />
        </Pressable>
        <View style={{ flex: 1, marginHorizontal: 14 }}>
          <Text style={s.headerTitle}>{routeTitle}</Text>
          <Text style={s.headerSub}>{t('results.today_all_classes')}</Text>
        </View>
        <Pressable style={s.filterBtn}>
          <Faders size={18} color={colors['text-secondary']} />
        </Pressable>
      </View>

      {isLoading ? (
        <View style={s.center}>
          <ActivityIndicator color={colors.primary} size="large" />
          <Text style={[s.loadingText, { marginTop: 12 }]}>{t('loading')}</Text>
        </View>
      ) : error ? (
        <View style={s.center}>
          <Text style={s.errorText}>{t('error.generic')}</Text>
          <Pressable style={s.retryBtn} onPress={() => router.back()}>
            <Text style={s.retryText}>{t('common.go_back')}</Text>
          </Pressable>
        </View>
      ) : trains && trains.length > 0 ? (
        <FlatList
          data={trains}
          keyExtractor={(item) => String(item.train_id)}
          renderItem={({ item }) => <TrainCard train={item} fromId={fromId} toId={toId} />}
          ListHeaderComponent={ListHeader}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        />
      ) : (
        <View style={s.center}>
          <MagnifyingGlass size={48} color={colors['text-tertiary']} weight="thin" />
          <Text style={s.noResultTitle}>{t('results.none')}</Text>
          <Text style={s.noResultHint}>{t('results.none_hint')}</Text>
          <Pressable style={s.retryBtn} onPress={() => router.back()}>
            <Text style={s.retryText}>{t('results.search_again')}</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default function SearchResultsScreen() {
  return <ErrorBoundary name="Search Results"><ResultsScreen /></ErrorBoundary>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  root:          { flex: 1, backgroundColor: colors['bg-base'] },
  header:        { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16 },
  backBtn:       { width: 40, height: 40, borderRadius: 20, backgroundColor: colors['bg-card'], borderWidth: 1, borderColor: colors['border'], alignItems: 'center', justifyContent: 'center' },
  headerTitle:   { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: colors['text-primary'] },
  headerSub:     { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors['text-secondary'], marginTop: 2 },
  filterBtn:     { width: 40, height: 40, borderRadius: 10, backgroundColor: colors['bg-card'], borderWidth: 1, borderColor: colors['border'], alignItems: 'center', justifyContent: 'center' },
  badge:         { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors['primary-subtle'], borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, alignSelf: 'flex-start', marginBottom: 16 },
  badgeText:     { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.primary },
  center:        { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  loadingText:   { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-secondary'] },
  errorText:     { fontFamily: 'Inter_500Medium', fontSize: 16, color: colors.danger, textAlign: 'center' },
  noResultTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 20, color: colors['text-primary'], marginTop: 12 },
  noResultHint:  { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-secondary'], textAlign: 'center' },
  retryBtn:      { backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12, marginTop: 8 },
  retryText:     { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors['text-inverse'] },
});
