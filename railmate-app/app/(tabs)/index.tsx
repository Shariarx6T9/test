// app/(tabs)/index.tsx
// Home screen — matches the approved Home screenshot exactly.
//
// Sections (top to bottom): Header, Greeting Hero, Search Card, Quick Actions,
// Saved Routes, Live Updates, Today's Community Activity banner.

import React, { useMemo, useState } from 'react';
import {
  View, ScrollView, Pressable, Modal, StyleSheet, Text, StatusBar,
  Image, ActivityIndicator, Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowsDownUp, CalendarBlank, MagnifyingGlass, CaretRight, CaretDown,
  BookmarkSimple, MapPin, BellSimple, Train, Suitcase, Buildings, Bus,
  Calculator, Warning, Users, CheckCircle, Clock,
} from 'phosphor-react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { StationSelector } from '../../components/features/StationSelector/StationSelector';
import { useSearchStore } from '../../stores/searchStore';
import { useAuthStore } from '../../stores/authStore';
import { useSavedRoutes, SavedRoute } from '../../hooks/useSavedRoutes';
import { useCommunityReports } from '../../hooks/useCommunityReports';
import { useThemeColors, useResolvedTheme, ThemeColors } from '../../hooks/useThemeColors';
import { useTranslation } from '../../i18n';
import { Station } from '../../types/database.types';
import type { CommunityReport } from '../../types/report.types';

// ─── Quick action target type ──────────────────────────────────────────────────

type QuickAction = {
  key: string;
  label: string;
  Icon: typeof Train;
  onPress: () => void;
};

// ─── Helpers ────────────────────────────────────────────────────────────────────

function formatMinsAgo(iso: string, t: (k: any, p?: any) => string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.max(1, Math.floor(diffMs / 60000));
  if (mins < 60) return t('home.min_ago', { mins });
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}

function formatLastViewed(savedAt: string, t: (k: any, p?: any) => string): string {
  const saved = new Date(savedAt);
  const now = new Date();
  if (isSameDay(saved, now)) {
    const time = saved.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    return t('home.last_viewed_today', { time });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(saved, yesterday)) {
    return t('home.last_viewed_yesterday');
  }
  const days = Math.max(1, Math.floor((now.getTime() - saved.getTime()) / 86400000));
  return t('home.last_viewed_days_ago', { days });
}

// Maps a live community report to a status row's icon/color/body text.
function getReportPresentation(
  report: CommunityReport,
  colors: ThemeColors,
  t: (k: any, p?: any) => string,
) {
  if (report.report_type === 'DELAY' && report.delay_minutes) {
    return {
      Icon: Warning,
      color: colors.danger,
      bg: colors['danger-subtle'],
      body: t('home.delay_reported', { mins: report.delay_minutes }),
    };
  }
  if (report.report_type === 'CROWD') {
    const coachSuffix = report.coach_number ? ` (Coach ${report.coach_number})` : '';
    return {
      Icon: Users,
      color: colors.accent,
      bg: colors['accent-subtle'],
      body: `${t('home.crowding_high')}${coachSuffix}`,
    };
  }
  if (report.report_type === 'ACCIDENT') {
    return {
      Icon: Warning,
      color: colors.danger,
      bg: colors['danger-subtle'],
      body: report.description ?? t('home.crowding_high'),
    };
  }
  return {
    Icon: CheckCircle,
    color: colors.success,
    bg: colors['success-subtle'],
    body: report.description ?? t('home.on_time'),
  };
}

export default function HomeScreen() {
  const router = useRouter();
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';

  const colors = useThemeColors();
  const theme = useResolvedTheme();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => createStyles(colors), [colors]);

  const { user } = useAuthStore();
  const { fromStation, toStation, date, setFromStation, setToStation, setDate, swapStations } = useSearchStore();
  const { savedRoutes, loading: savedRoutesLoading } = useSavedRoutes();
  const { data: liveReports, isLoading: reportsLoading } = useCommunityReports(null);

  const [selectorConfig, setSelectorConfig] = useState<{ visible: boolean; type: 'from' | 'to' }>({ visible: false, type: 'from' });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleStationSelect = (station: Station) => {
    if (selectorConfig.type === 'from') setFromStation(station);
    else setToStation(station);
    setSelectorConfig({ ...selectorConfig, visible: false });
  };

  const handleDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDate(selectedDate.toISOString().split('T')[0]);
  };

  const handleSearch = () => {
    if (fromStation && toStation) {
      router.push({ pathname: '/search/results', params: { fromId: fromStation.id, toId: toStation.id, date } });
    }
  };

  const handleSavedRoutePress = (route: SavedRoute) => {
    setFromStation(route.fromStation as any);
    setToStation(route.toStation as any);
    router.push({ pathname: '/search/results', params: { fromId: route.fromStation.id, toId: route.toStation.id, date } });
  };

  const handleReportPress = (report: CommunityReport) => {
    router.push({ pathname: '/report/[id]' as any, params: { id: report.id } });
  };

  const showComingSoon = (label: string) => {
    Alert.alert(t('home.coming_soon_title'), `${label} — ${t('home.coming_soon_body')}`);
  };

  // ── Derived display values ──────────────────────────────────────────────────

  const todayDateLabel = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString(isBengali ? 'bn-BD' : 'en-US', {
      weekday: 'long', day: 'numeric', month: 'long',
    });
  }, [isBengali]);

  const searchDateLabel = useMemo(() => {
    const d = new Date(date);
    const today = new Date();
    const isToday = d.toDateString() === today.toDateString();
    if (isToday) return `Today, ${d.toLocaleDateString('en-US', { day: 'numeric', month: 'long' })}`;
    return d.toLocaleDateString(isBengali ? 'bn-BD' : 'en-US', { weekday: 'short', day: 'numeric', month: 'long' });
  }, [date, isBengali]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 5) return t('home.greeting_night');
    if (hour < 12) return t('home.greeting_morning');
    if (hour < 18) return t('home.greeting_afternoon');
    return t('home.greeting_evening');
  }, [t]);

  const firstName = useMemo(() => {
    const name = user?.display_name?.trim();
    if (!name) return t('profile.guest_user');
    return name.split(' ')[0];
  }, [user?.display_name, t]);

  const fromLabel = fromStation
    ? { bn: fromStation.name_bn, en: fromStation.name_en }
    : { bn: 'ঢাকা', en: 'Dhaka' };
  const toLabel = toStation
    ? { bn: toStation.name_bn, en: toStation.name_en }
    : { bn: 'চট্টগ্রাম', en: 'Chattogram' };

  // Real, derived (not mock) "today's community activity" numbers, computed
  // from the same live report feed already fetched for the Live Updates list.
  const todayStats = useMemo(() => {
    if (!liveReports) return null;
    const now = new Date();
    const reportsToday = liveReports.filter((r) => isSameDay(new Date(r.created_at), now)).length;
    const verifiedReports = liveReports.filter((r) => r.status === 'VERIFIED').length;
    return { reportsToday, verifiedReports };
  }, [liveReports]);

  // Real-time badge count on the bell — number of ACTIVE reports from the
  // last 2 hours, a genuine live signal rather than a fabricated number.
  const notificationCount = useMemo(() => {
    if (!liveReports) return 0;
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000;
    return liveReports.filter((r) => new Date(r.created_at).getTime() >= twoHoursAgo).length;
  }, [liveReports]);

  const topLiveReports = (liveReports ?? []).slice(0, 3);

  const QUICK_ACTIONS: QuickAction[] = [
    { key: 'live', label: t('home.action_live'), Icon: Train, onPress: () => router.push('/(tabs)/live-updates' as any) },
    { key: 'trips', label: t('home.action_trips'), Icon: Suitcase, onPress: () => router.push('/journey' as any) },
    { key: 'alert', label: t('home.action_alerts'), Icon: BellSimple, onPress: () => router.push('/notifications' as any) },
    { key: 'station', label: t('home.action_station'), Icon: Buildings, onPress: () => router.push('/(tabs)/search' as any) },
    { key: 'coach', label: t('home.action_coach'), Icon: Bus, onPress: () => showComingSoon(t('home.action_coach')) },
    { key: 'fare', label: t('home.action_fare'), Icon: Calculator, onPress: () => showComingSoon(t('home.action_fare')) },
  ];

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={s.heroPanel.backgroundColor as string} translucent />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* ── Hero panel: header + greeting (full-bleed, no horizontal padding) ── */}
        <View style={[s.heroPanel, { paddingTop: insets.top + 12 }]}>
          {/* Decorative skyline + glow — no external/photographic asset used */}
          <View style={s.heroGlow} pointerEvents="none" />
          <View style={s.heroSkyline} pointerEvents="none">
            {[18, 28, 14, 34, 20, 30, 16].map((h, i) => (
              <View key={i} style={[s.skylineBar, { height: h }]} />
            ))}
          </View>

          {/* Header */}
          <View style={s.header}>
            <View style={s.headerLeft}>
              <View style={s.logoPill}>
                <Image source={require('../../assets/images/logo.png')} style={s.logoImage} resizeMode="contain" />
              </View>
              <View style={{ marginLeft: 10 }}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={s.brandRail}>Rail</Text>
                  <Text style={s.brandMate}>Mate</Text>
                </View>
                <Text style={s.brandSub}>Bangladesh</Text>
              </View>
            </View>

            <Pressable
              style={s.bellBtn}
              onPress={() => router.push('/notifications' as any)}
              accessibilityLabel={t('home.notifications_label')}
            >
              <BellSimple size={20} color="#FFFFFF" weight="bold" />
              {notificationCount > 0 && (
                <View style={s.bellBadge}>
                  <Text style={s.bellBadgeText}>{notificationCount > 9 ? '9+' : notificationCount}</Text>
                </View>
              )}
            </Pressable>
          </View>

          {/* Greeting */}
          <View style={s.greetingBlock}>
            <Text style={s.greetingText}>{greeting},</Text>
            <Text style={s.greetingName}>{firstName} 👋</Text>
            <Text style={s.greetingDate}>{todayDateLabel}</Text>
          </View>
        </View>

        {/* ── Search Card (overlaps hero panel) ── */}
        <View style={s.contentPad}>
          <View style={s.searchCard}>
            {/* From / Swap / To — side by side */}
            <View style={s.fromToRow}>
              <Pressable style={s.fromToCol} onPress={() => setSelectorConfig({ visible: true, type: 'from' })}>
                <Text style={s.fromToLabel}>{t('search.from')}</Text>
                <View style={s.fromToValueRow}>
                  <MapPin size={16} color={colors.primary} weight="fill" />
                  <Text style={s.fromToValue} numberOfLines={1}>{isBengali ? fromLabel.bn : fromLabel.en}</Text>
                </View>
                <Text style={s.fromToSub} numberOfLines={1}>{isBengali ? fromLabel.en : fromLabel.bn}</Text>
              </Pressable>

              <Pressable style={s.swapBtn} onPress={swapStations}>
                <ArrowsDownUp size={18} color={colors.primary} weight="bold" />
              </Pressable>

              <Pressable style={[s.fromToCol, { alignItems: 'flex-end' }]} onPress={() => setSelectorConfig({ visible: true, type: 'to' })}>
                <Text style={s.fromToLabel}>{t('search.to')}</Text>
                <View style={[s.fromToValueRow, { justifyContent: 'flex-end' }]}>
                  <MapPin size={16} color={colors.primary} weight="fill" />
                  <Text style={s.fromToValue} numberOfLines={1}>{isBengali ? toLabel.bn : toLabel.en}</Text>
                </View>
                <Text style={[s.fromToSub, { textAlign: 'right' }]} numberOfLines={1}>{isBengali ? toLabel.en : toLabel.bn}</Text>
              </Pressable>
            </View>

            {/* Date row */}
            <Pressable style={s.dateRow} onPress={() => setShowDatePicker(true)}>
              <CalendarBlank size={18} color={colors.primary} weight="fill" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={s.dateLabel}>{t('search.date')}</Text>
                <Text style={s.dateValue}>{searchDateLabel}</Text>
              </View>
              <CaretDown size={16} color={colors['text-tertiary']} />
            </Pressable>

            {/* Search button */}
            <Pressable
              style={[s.searchBtn, (!fromStation || !toStation) && { opacity: 0.6 }]}
              onPress={handleSearch}
            >
              <MagnifyingGlass size={20} color={colors['text-inverse']} weight="bold" />
              <Text style={s.searchBtnText}>{t('search.button')}</Text>
            </Pressable>
          </View>

          {/* ── Quick Actions ── */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>{t('home.quick_actions')}</Text>
              <Pressable onPress={() => router.push('/journey/tools' as any)} style={s.viewAllRow}>
                <Text style={s.seeAll}>{t('home.see_all')}</Text>
                <CaretRight size={13} color={colors.primary} />
              </Pressable>
            </View>

            <View style={s.actionsGrid}>
              {QUICK_ACTIONS.map(({ key, label, Icon, onPress }) => (
                <Pressable key={key} style={s.actionCard} onPress={onPress}>
                  <View style={s.actionIconWrap}>
                    <Icon size={22} color={colors.primary} weight="fill" />
                  </View>
                  <Text style={s.actionLabel} numberOfLines={1}>{label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* ── Saved Routes ── */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>{t('home.saved_routes')}</Text>
              {savedRoutes.length > 0 && (
                <Pressable onPress={() => router.push('/journey' as any)} style={s.viewAllRow}>
                  <Text style={s.seeAll}>{t('home.see_all')}</Text>
                  <CaretRight size={13} color={colors.primary} />
                </Pressable>
              )}
            </View>

            {savedRoutesLoading ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: 12 }} />
            ) : savedRoutes.length > 0 ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 12, paddingRight: 4 }}
              >
                {savedRoutes.slice(0, 5).map((route) => (
                  <Pressable key={route.id} style={s.routeCard} onPress={() => handleSavedRoutePress(route)}>
                    <View style={s.routeCardTop}>
                      <View style={{ flex: 1 }}>
                        <Text style={s.routeCardTitle} numberOfLines={1}>
                          {route.fromStation.name_en} → {route.toStation.name_en}
                        </Text>
                        <Text style={s.routeCardSub} numberOfLines={1}>
                          {route.fromStation.name_bn} → {route.toStation.name_bn}
                        </Text>
                      </View>
                      <BookmarkSimple size={18} color={colors.primary} weight="fill" />
                    </View>
                    <View style={s.routeCardFooter}>
                      <Clock size={12} color={colors['text-tertiary']} />
                      <Text style={s.routeCardTime} numberOfLines={1}>{formatLastViewed(route.savedAt, t)}</Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            ) : (
              <View style={s.emptyRoutes}>
                <Text style={s.emptyText}>{t('home.no_saved_routes')}</Text>
                <Text style={s.emptyHint}>{t('home.no_saved_routes_hint')}</Text>
              </View>
            )}
          </View>

          {/* ── Live Updates ── */}
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>{t('home.live_updates')}</Text>
              <Pressable onPress={() => router.push('/(tabs)/live-updates' as any)} style={s.viewAllRow}>
                <Text style={s.seeAll}>{t('home.see_all')}</Text>
                <CaretRight size={13} color={colors.primary} />
              </Pressable>
            </View>

            {reportsLoading ? (
              <ActivityIndicator color={colors.primary} style={{ marginVertical: 12 }} />
            ) : topLiveReports.length > 0 ? (
              <View style={s.liveCard}>
                {topLiveReports.map((report, idx) => {
                  const { Icon, color, bg, body } = getReportPresentation(report, colors, t);
                  const trainName = report.train?.name_en ?? t('home.live_updates');
                  return (
                    <Pressable
                      key={report.id}
                      style={[s.liveRow, idx < topLiveReports.length - 1 && s.liveRowBorder]}
                      onPress={() => handleReportPress(report)}
                    >
                      <View style={[s.liveIconWrap, { backgroundColor: bg }]}>
                        <Icon size={18} color={color} weight="fill" />
                      </View>
                      <View style={{ flex: 1, marginLeft: 12 }}>
                        <Text style={s.liveTrain} numberOfLines={1}>{trainName}</Text>
                        <Text style={[s.liveBody, { color }]} numberOfLines={1}>{body}</Text>
                      </View>
                      <View style={s.liveRight}>
                        <View style={s.liveTravelersRow}>
                          <Users size={11} color={colors['text-tertiary']} />
                          <Text style={s.liveTravelers} numberOfLines={1}>
                            {t('home.travelers_confirmed', { count: report.verification_count })}
                          </Text>
                        </View>
                        <Text style={s.liveTime}>{formatMinsAgo(report.created_at, t)}</Text>
                      </View>
                      <CaretRight size={14} color={colors['text-tertiary']} style={{ marginLeft: 8 }} />
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <View style={s.emptyRoutes}>
                <Text style={s.emptyText}>{t('home.no_live_updates')}</Text>
              </View>
            )}
          </View>

          {/* ── Today's Community Activity ── */}
          <Pressable
            style={s.communityBanner}
            onPress={() => router.push('/(tabs)/community' as any)}
          >
            <View style={s.communityIconWrap}>
              <Users size={22} color={colors.primary} weight="fill" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={s.communityLabel}>{t('home.today_activity')}</Text>
              <View style={s.communityStatsRow}>
                <View>
                  <Text style={s.communityStatNum}>{todayStats ? todayStats.reportsToday : '—'}</Text>
                  <Text style={s.communityStatLabel}>{t('home.reports_today')}</Text>
                </View>
                <View>
                  <Text style={s.communityStatNum}>{todayStats ? todayStats.verifiedReports : '—'}</Text>
                  <Text style={s.communityStatLabel}>{t('home.verified_reports')}</Text>
                </View>
              </View>
            </View>
            <Pressable style={s.communityBtn} onPress={() => router.push('/(tabs)/community' as any)}>
              <Text style={s.communityBtnText}>{t('home.view_community')}</Text>
            </Pressable>
          </Pressable>
        </View>
      </ScrollView>

      {/* Station Selector Modal */}
      <Modal visible={selectorConfig.visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setSelectorConfig({ ...selectorConfig, visible: false })}>
        <StationSelector
          onSelect={handleStationSelect}
          onClose={() => setSelectorConfig({ ...selectorConfig, visible: false })}
          isBengali={isBengali}
        />
      </Modal>

      {showDatePicker && (
        <DateTimePicker value={new Date(date)} mode="date" display="default" onChange={handleDateChange} minimumDate={new Date()} />
      )}
    </View>
  );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  root:               { flex: 1, backgroundColor: colors['bg-base'] },
  contentPad:         { paddingHorizontal: 20 },

  // Hero panel — full bleed, dark, with decorative skyline + glow (no photo asset)
  heroPanel:          { backgroundColor: '#0A1220', paddingHorizontal: 20, paddingBottom: 28, overflow: 'hidden', borderBottomLeftRadius: 28, borderBottomRightRadius: 28 },
  heroGlow:           { position: 'absolute', top: -60, right: -40, width: 220, height: 220, borderRadius: 110, backgroundColor: colors.primary, opacity: 0.12 },
  heroSkyline:        { position: 'absolute', bottom: 0, right: 16, flexDirection: 'row', alignItems: 'flex-end', gap: 6, opacity: 0.18 },
  skylineBar:         { width: 14, backgroundColor: colors.primary, borderTopLeftRadius: 2, borderTopRightRadius: 2 },

  header:             { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  headerLeft:         { flexDirection: 'row', alignItems: 'center' },
  logoPill:           { width: 40, height: 40, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  logoImage:          { width: 28, height: 28 },
  brandRail:          { fontFamily: 'Inter_700Bold', fontSize: 18, color: '#FFFFFF' },
  brandMate:          { fontFamily: 'Inter_700Bold', fontSize: 18, color: colors.primary },
  brandSub:           { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#8FA3C0' },
  bellBtn:            { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' },
  bellBadge:          { position: 'absolute', top: -3, right: -3, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: colors.danger, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3, borderWidth: 2, borderColor: '#0A1220' },
  bellBadgeText:      { fontFamily: 'Inter_700Bold', fontSize: 10, color: '#FFFFFF' },

  greetingBlock:      {},
  greetingText:       { fontFamily: 'Inter_400Regular', fontSize: 15, color: '#8FA3C0' },
  greetingName:       { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 28, color: '#FFFFFF', marginTop: 2, marginBottom: 4 },
  greetingDate:       { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#6B7F9C' },

  // Search card — overlaps the hero panel
  searchCard:         { backgroundColor: colors['bg-card'], borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 20, marginTop: -24, marginBottom: 28 },
  fromToRow:          { flexDirection: 'row', alignItems: 'center' },
  fromToCol:          { flex: 1 },
  fromToLabel:        { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-tertiary'], marginBottom: 4 },
  fromToValueRow:      { flexDirection: 'row', alignItems: 'center', gap: 6 },
  fromToValue:        { fontFamily: 'Inter_700Bold', fontSize: 17, color: colors['text-primary'], flexShrink: 1 },
  fromToSub:          { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-tertiary'], marginTop: 2 },
  swapBtn:            { width: 36, height: 36, borderRadius: 18, backgroundColor: colors['bg-overlay'], borderWidth: 1, borderColor: colors['border-strong'], alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 },

  dateRow:            { flexDirection: 'row', alignItems: 'center', backgroundColor: colors['bg-overlay'], borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, paddingVertical: 12, marginTop: 18 },
  dateLabel:          { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors['text-tertiary'] },
  dateValue:          { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors['text-primary'], marginTop: 1 },

  searchBtn:          { marginTop: 16, backgroundColor: colors.primary, borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  searchBtnText:      { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: colors['text-inverse'] },

  section:            { marginBottom: 24 },
  sectionHeader:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle:       { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: colors['text-primary'] },
  viewAllRow:         { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAll:             { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors.primary },

  // Quick actions
  actionsGrid:        { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  actionCard:         { width: '31%', backgroundColor: colors['bg-card'], borderRadius: 14, borderWidth: 1, borderColor: colors.border, paddingVertical: 16, alignItems: 'center', gap: 10 },
  actionIconWrap:     { width: 44, height: 44, borderRadius: 22, backgroundColor: colors['primary-subtle'], alignItems: 'center', justifyContent: 'center' },
  actionLabel:        { fontFamily: 'Inter_500Medium', fontSize: 12, color: colors['text-secondary'], textAlign: 'center', paddingHorizontal: 4 },

  // Saved routes
  routeCard:          { width: 200, backgroundColor: colors['bg-card'], borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 14 },
  routeCardTop:       { flexDirection: 'row', alignItems: 'flex-start' },
  routeCardTitle:     { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors['text-primary'] },
  routeCardSub:       { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-tertiary'], marginTop: 2 },
  routeCardFooter:    { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 12 },
  routeCardTime:      { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors['text-tertiary'], flexShrink: 1 },

  emptyRoutes:        { backgroundColor: colors['bg-card'], borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 24, alignItems: 'center' },
  emptyText:          { fontFamily: 'Inter_500Medium', fontSize: 15, color: colors['text-primary'], marginBottom: 6 },
  emptyHint:          { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors['text-secondary'], textAlign: 'center' },

  // Live updates
  liveCard:           { backgroundColor: colors['bg-card'], borderRadius: 16, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  liveRow:            { flexDirection: 'row', alignItems: 'center', padding: 14 },
  liveRowBorder:      { borderBottomWidth: 1, borderBottomColor: colors.border },
  liveIconWrap:       { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  liveTrain:          { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors['text-primary'] },
  liveBody:           { fontFamily: 'Inter_500Medium', fontSize: 12, marginTop: 2 },
  liveRight:          { alignItems: 'flex-end' },
  liveTravelersRow:   { flexDirection: 'row', alignItems: 'center', gap: 4 },
  liveTravelers:      { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors['text-tertiary'], maxWidth: 90, textAlign: 'right' },
  liveTime:           { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors['text-tertiary'], marginTop: 3 },

  // Community banner
  communityBanner:    { flexDirection: 'row', alignItems: 'center', backgroundColor: colors['primary-subtle'], borderRadius: 16, borderWidth: 1, borderColor: colors.primary, padding: 16 },
  communityIconWrap:  { width: 40, height: 40, borderRadius: 20, backgroundColor: colors['bg-card'], alignItems: 'center', justifyContent: 'center' },
  communityLabel:     { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: colors.primary, marginBottom: 6 },
  communityStatsRow:  { flexDirection: 'row', gap: 20 },
  communityStatNum:   { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 20, color: colors['text-primary'] },
  communityStatLabel: { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors['text-secondary'], marginTop: 1 },
  communityBtn:       { backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, marginLeft: 8 },
  communityBtnText:   { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: colors['text-inverse'] },
});
