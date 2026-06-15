import React, { useMemo } from 'react';
import {
  View, ScrollView, ActivityIndicator, Pressable,
  StyleSheet, Text, ImageBackground, StatusBar,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft, BookmarkSimple, Bookmark, Train,
  Warning, Users, ChatCircleDots, Bell, Ticket,
  Armchair, Bed, Snowflake,
} from 'phosphor-react-native';
import { useTrainDetail, useTrainFares } from '../../hooks/useTrainDetail';
import { useSearchStore } from '../../stores/searchStore';
import { useSavedRoutes } from '../../hooks/useSavedRoutes';
import { useThemeColors, useResolvedTheme, ThemeColors } from '../../hooks/useThemeColors';
import { useTranslation } from '../../i18n';
import { formatTime } from '../../utils/formatTime';
import { formatFare } from '../../utils/formatFare';
import { ErrorBoundary } from '../../components/ErrorBoundary';

// Train hero image - night moody Bangladesh train
const TRAIN_IMAGE = 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80&auto=format&fit=crop';

// Text/icon color for content overlaid on the photographic hero image.
// Fixed (theme-independent) since the hero always sits on a dark gradient
// overlay regardless of light/dark app theme.
const ON_IMAGE_TEXT = '#F0F4FF';
const ON_IMAGE_TEXT_SECONDARY = '#8FA3C0';
const ON_IMAGE_TEXT_TERTIARY = '#4E6480';

const FARE_ICONS: Record<string, any> = {
  SHOVON: Armchair, SHOVON_CHAIR: Armchair, SNIGDHA: Bed,
  AC_BERTH: Bed, AC_SEAT: Snowflake, FIRST_BERTH: Bed,
  FIRST_SEAT: Armchair, AC_S_CHAIR: Snowflake,
};

function TrainDetailContent() {
  const router = useRouter();
  const { id, fromId, toId } = useLocalSearchParams<{ id: string; fromId?: string; toId?: string }>();
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';

  const colors = useThemeColors();
  const theme = useResolvedTheme();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => createStyles(colors), [colors]);

  const { date } = useSearchStore();
  const { savedRoutes, saveRoute, deleteRoute, isRouteSaved } = useSavedRoutes();

  const { data: train, isLoading } = useTrainDetail(id);
  const { data: fares, isLoading: faresLoading } = useTrainFares({
    trainId: id, fromStationId: fromId || '', toStationId: toId || '',
  });

  const isBookmarked = fromId && toId ? isRouteSaved(fromId, toId) : false;

  const handleBookmark = async () => {
    if (!fromId || !toId || !train) return;
    if (isBookmarked) {
      const r = savedRoutes.find((r) => r.fromStation.id === fromId && r.toStation.id === toId);
      if (r) await deleteRoute(r.id);
    } else {
      const origin = train.stops.find((s) => s.station_id === fromId)?.station;
      const dest   = train.stops.find((s) => s.station_id === toId)?.station;
      if (origin && dest) {
        await saveRoute(
          { id: origin.id, name_en: origin.name_en, name_bn: origin.name_bn, code: origin.code },
          { id: dest.id,   name_en: dest.name_en,   name_bn: dest.name_bn,   code: dest.code },
        );
      }
    }
  };

  const handleJoinDiscussion = () => router.push('/(tabs)/community' as any);

  if (isLoading) {
    return (
      <View style={[s.root, s.center]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  if (!train) {
    return (
      <View style={[s.root, s.center]}>
        <StatusBar barStyle={theme === 'dark' ? 'light-content' : 'dark-content'} backgroundColor={colors['bg-base']} />
        <Text style={s.errorText}>{t('train.not_found')}</Text>
        <Pressable style={s.backBtnFull} onPress={() => router.back()}>
          <Text style={s.backBtnText}>{t('common.go_back')}</Text>
        </Pressable>
      </View>
    );
  }

  const trainTitle = `${isBengali ? train.name_bn : train.name_en} #${train.number}`;
  const originName = train.origin
    ? (isBengali ? train.origin.name_bn : train.origin.name_en)
    : '';
  const destName = train.destination
    ? (isBengali ? train.destination.name_bn : train.destination.name_en)
    : '';
  const routeStr = `${originName} → ${destName}`;

  const dayStr = new Date(date).toLocaleDateString(isBengali ? 'bn-BD' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* ── Hero Image ─────────────── */}
      <ImageBackground
        source={{ uri: TRAIN_IMAGE }}
        style={s.hero}
        imageStyle={{ opacity: 0.75 }}
      >
        {/* Gradient overlay */}
        <View style={s.heroOverlay} />

        {/* Top bar */}
        <View style={[s.heroTop, { paddingTop: insets.top + 8 }]}>
          <Pressable style={s.circleBtn} onPress={() => router.back()}>
            <ArrowLeft size={20} color={ON_IMAGE_TEXT} weight="bold" />
          </Pressable>

          <View style={{ flex: 1, marginHorizontal: 12 }}>
            <Text style={s.heroTitle}>{trainTitle}</Text>
            <Text style={s.heroRoute}>{routeStr}</Text>
            <Text style={s.heroDate}>{dayStr}</Text>
          </View>

          <Pressable style={s.circleBtn} onPress={handleBookmark}>
            {isBookmarked
              ? <Bookmark size={20} color={colors.primary} weight="fill" />
              : <BookmarkSimple size={20} color={ON_IMAGE_TEXT} />}
          </Pressable>
        </View>
      </ImageBackground>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 32 }}>

        {/* ── Journey Timeline ─────────── */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Train size={18} color={colors.primary} weight="fill" />
            <Text style={s.cardTitle}>{t('train.journey_timeline')}</Text>
          </View>

          {train.stops.map((stop, index) => {
            const isFirst = index === 0;
            const isLast  = index === train.stops.length - 1;
            const isMid   = !isFirst && !isLast;
            const time = isFirst ? formatTime(stop.departure_time) : formatTime(stop.arrival_time);
            const stationName = isBengali ? stop.station.name_bn : stop.station.name_en;

            return (
              <View key={stop.id} style={s.stopRow}>
                {/* Time */}
                <Text style={[s.stopTime, (isFirst || isLast) && s.stopTimeEnd]}>{time}</Text>

                {/* Line + dot */}
                <View style={s.stopLine}>
                  <View style={{ width: 2, flex: isFirst ? 0 : 1, backgroundColor: isFirst ? 'transparent' : colors.primary, opacity: 0.4 }} />
                  <View style={[s.stopDot, isFirst && s.stopDotFirst, isLast && s.stopDotLast]} />
                  {!isLast && <View style={{ width: 2, flex: 1, minHeight: 32, backgroundColor: colors.primary, opacity: 0.4 }} />}
                </View>

                {/* Station info */}
                <View style={s.stopInfo}>
                  <Text style={[s.stopName, (isFirst || isLast) && s.stopNameEnd]}>{stationName}</Text>
                  {isFirst && <Text style={s.stopRole}>{t('train.departure')}</Text>}
                  {isLast  && <Text style={s.stopRole}>{t('train.arrival')}</Text>}
                  {isMid && stop.halt_minutes > 0 && (
                    <Text style={s.stopHalt}>{formatTime(stop.arrival_time)} • {t('train.halt', { minutes: stop.halt_minutes })}</Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>

        {/* ── Fares ────────────────────── */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Ticket size={18} color={colors.accent} weight="fill" />
            <Text style={s.cardTitle}>{t('train.fares')}</Text>
          </View>

          {faresLoading ? (
            <ActivityIndicator color={colors.primary} />
          ) : fares && fares.length > 0 ? (
            fares.map((fare, i) => {
              const Icon = FARE_ICONS[fare.class] || Armchair;
              return (
                <View key={fare.id} style={[s.fareRow, i < fares.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                  <View style={s.fareIconBox}>
                    <Icon size={18} color={colors['text-secondary']} weight="duotone" />
                  </View>
                  <Text style={s.fareClass}>{t(`fare.class.${fare.class}` as any)}</Text>
                  <Text style={s.farePrice}>৳{formatFare(fare.price_bdt)}</Text>
                </View>
              );
            })
          ) : (
            <Text style={s.noFare}>{t('train.no_fares')}</Text>
          )}
        </View>

        {/* ── Community Insights ────────── */}
        <View style={s.card}>
          <View style={s.cardHeader}>
            <Users size={18} color={colors.info} weight="fill" />
            <Text style={s.cardTitle}>{t('train.community_insights')}</Text>
          </View>
          <View style={s.insightsRow}>
            <View style={s.insightChip}>
              <Warning size={16} color={colors.accent} weight="fill" />
              <Text style={[s.insightMain, { color: colors.accent }]}>{t('train.delay_reported', { minutes: 15 })}</Text>
              <Text style={s.insightSub}>{t('train.reported')}</Text>
            </View>
            <View style={s.insightChip}>
              <Users size={16} color={colors.danger} weight="fill" />
              <Text style={[s.insightMain, { color: colors.danger }]}>{t('train.high_crowding')}</Text>
              <Text style={s.insightSub}>{t('train.expected')}</Text>
            </View>
            <View style={s.insightChip}>
              <ChatCircleDots size={16} color={colors.info} weight="fill" />
              <Text style={[s.insightMain, { color: colors.info }]}>{t('train.traveler_reports', { count: 8 })}</Text>
              <Text style={s.insightSub}>{t('train.today')}</Text>
            </View>
          </View>
        </View>

        {/* ── Action Buttons ────────────── */}
        <View style={s.actionRow}>
          <Pressable style={s.alertBtn}>
            <Bell size={18} color={colors.primary} weight="duotone" />
            <Text style={s.alertBtnText}>{t('train.set_alert')}</Text>
          </Pressable>
          <Pressable style={s.buyBtn}>
            <Ticket size={18} color={colors['text-inverse']} weight="fill" />
            <Text style={s.buyBtnText}>{t('train.buy_ticket')}</Text>
          </Pressable>
        </View>
        <Pressable style={s.discussionBtn} onPress={handleJoinDiscussion}>
          <ChatCircleDots size={18} color={colors['text-secondary']} weight="bold" />
          <Text style={s.discussionBtnText}>{t('train.join_discussion')}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

export default function TrainDetailScreen() {
  return <ErrorBoundary name="Train Detail"><TrainDetailContent /></ErrorBoundary>;
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  root:          { flex: 1, backgroundColor: colors['bg-base'] },
  center:        { alignItems: 'center', justifyContent: 'center' },
  hero:          { height: 240, justifyContent: 'flex-end' },
  heroOverlay:   { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8,13,23,0.55)' },
  heroTop:       { flexDirection: 'row', alignItems: 'flex-start', padding: 20 },
  circleBtn:     { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(15,25,41,0.7)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  heroTitle:     { fontFamily: 'Inter_700Bold', fontSize: 18, color: ON_IMAGE_TEXT, lineHeight: 24 },
  heroRoute:     { fontFamily: 'Inter_400Regular', fontSize: 14, color: ON_IMAGE_TEXT_SECONDARY, marginTop: 3 },
  heroDate:      { fontFamily: 'Inter_400Regular', fontSize: 12, color: ON_IMAGE_TEXT_TERTIARY, marginTop: 2 },
  card:          { backgroundColor: colors['bg-card'], borderRadius: 16, borderWidth: 1, borderColor: colors['border'], padding: 18, marginBottom: 16 },
  cardHeader:    { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 18 },
  cardTitle:     { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: colors['text-primary'] },
  stopRow:       { flexDirection: 'row', alignItems: 'stretch', marginBottom: 0 },
  stopTime:      { fontFamily: 'JetBrainsMono_400Regular', fontSize: 13, color: colors['text-secondary'], width: 48, paddingTop: 2 },
  stopTimeEnd:   { fontFamily: 'JetBrainsMono_500Medium', fontSize: 14, color: colors['text-primary'] },
  stopLine:      { width: 28, alignItems: 'center', marginHorizontal: 12 },
  stopDot:       { width: 12, height: 12, borderRadius: 6, borderWidth: 2, borderColor: colors['border-strong'], backgroundColor: 'transparent', zIndex: 1 },
  stopDotFirst:  { width: 16, height: 16, borderRadius: 8, backgroundColor: colors.primary, borderColor: colors.primary },
  stopDotLast:   { width: 16, height: 16, borderRadius: 8, borderColor: colors.primary, backgroundColor: 'transparent', borderWidth: 2.5 },
  stopInfo:      { flex: 1, paddingBottom: 20 },
  stopName:      { fontFamily: 'Inter_400Regular', fontSize: 15, color: colors['text-secondary'] },
  stopNameEnd:   { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors['text-primary'] },
  stopRole:      { fontFamily: 'Inter_500Medium', fontSize: 12, color: colors.primary, marginTop: 2 },
  stopHalt:      { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-tertiary'], marginTop: 2 },
  fareRow:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 13 },
  fareIconBox:   { width: 36, height: 36, borderRadius: 8, backgroundColor: colors['bg-elevated'], alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  fareClass:     { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 15, color: colors['text-primary'] },
  farePrice:     { fontFamily: 'JetBrainsMono_500Medium', fontSize: 17, color: colors.primary },
  noFare:        { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-secondary'], textAlign: 'center', paddingVertical: 12 },
  insightsRow:   { flexDirection: 'row', gap: 10 },
  insightChip:   { flex: 1, backgroundColor: colors['bg-elevated'], borderRadius: 12, borderWidth: 1, borderColor: colors['border'], padding: 12, alignItems: 'center', gap: 4 },
  insightMain:   { fontFamily: 'Inter_600SemiBold', fontSize: 12, textAlign: 'center' },
  insightSub:    { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors['text-tertiary'] },
  actionRow:     { flexDirection: 'row', gap: 12, marginTop: 4, marginBottom: 12 },
  alertBtn:      { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderColor: colors.primary, borderRadius: 14, paddingVertical: 16 },
  alertBtnText:  { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors.primary },
  buyBtn:        { flex: 1.4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16 },
  buyBtnText:    { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors['text-inverse'] },
  discussionBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: colors.border, borderRadius: 14, paddingVertical: 14, backgroundColor: colors['bg-card'] },
  discussionBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors['text-secondary'] },
  errorText:     { fontFamily: 'Inter_500Medium', fontSize: 16, color: colors.danger, marginBottom: 16 },
  backBtnFull:   { backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  backBtnText:   { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors['text-inverse'] },
});
