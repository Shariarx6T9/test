// app/journey/index.tsx
// "My Trips" / Journey tools — connected to real useSavedRoutes hook.

import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  MapPin, ArrowRight, Train, BookmarkSimple, Trash, Ticket,
} from 'phosphor-react-native';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';
import { useTranslation } from '../../i18n';
import { useSavedRoutes } from '../../hooks/useSavedRoutes';
import { useAuthStore } from '../../stores/authStore';

function JourneyContent() {
  const { t } = useTranslation();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const s = useMemo(() => createStyles(colors), [colors]);

  const { isAuthenticated } = useAuthStore();
  const { savedRoutes, loading, deleteRoute } = useSavedRoutes();

  const handleSearch = (fromId: string, toId: string, fromName: string, toName: string) => {
    router.push({
      pathname: '/search/results' as any,
      params: { fromId, toId, date: new Date().toISOString().split('T')[0] },
    });
  };

  const handleDelete = (id: string, routeLabel: string) => {
    Alert.alert(
      t('journey.remove_route'),
      `Remove "${routeLabel}"?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('common.remove'), style: 'destructive', onPress: () => deleteRoute(id) },
      ]
    );
  };

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <Text style={s.title}>{t('journey.title')}</Text>
        <Text style={s.sub}>{t('journey.sub')}</Text>
      </View>

      {/* Saved Routes section */}
      <View style={s.sectionHeader}>
        <BookmarkSimple size={16} color={colors.primary} weight="fill" />
        <Text style={s.sectionTitle}>{t('journey.saved_routes')}</Text>
        {savedRoutes.length > 0 && (
          <Text style={s.sectionCount}>{savedRoutes.length}</Text>
        )}
      </View>

      {loading ? (
        <ActivityIndicator color={colors.primary} style={{ marginTop: 32 }} />
      ) : savedRoutes.length === 0 ? (
        <View style={s.emptyState}>
          <BookmarkSimple size={44} color={colors['text-tertiary']} weight="thin" />
          <Text style={s.emptyTitle}>{t('journey.no_saved_routes')}</Text>
          <Text style={s.emptySub}>{t('journey.no_saved_routes_sub')}</Text>
          <Pressable
            style={s.emptyBtn}
            onPress={() => router.push('/(tabs)/search' as any)}
          >
            <Train size={16} color={colors['text-inverse']} />
            <Text style={s.emptyBtnText}>{t('search.button')}</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={savedRoutes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const fromName = item.fromStation.name_en;
            const toName = item.toStation.name_en;
            const label = `${fromName} → ${toName}`;
            return (
              <View style={s.routeCard}>
                <Pressable
                  style={s.routeMain}
                  onPress={() =>
                    handleSearch(item.fromStation.id, item.toStation.id, fromName, toName)
                  }
                >
                  <View style={s.stationRow}>
                    <View style={[s.dot, { backgroundColor: colors.danger }]} />
                    <Text style={s.stationName}>{fromName}</Text>
                    <Text style={s.stationCode}>{item.fromStation.code}</Text>
                  </View>
                  <View style={s.lineRow}>
                    <View style={s.vertLine} />
                    <ArrowRight size={14} color={colors['text-tertiary']} />
                  </View>
                  <View style={s.stationRow}>
                    <View style={[s.dot, { backgroundColor: colors.primary }]} />
                    <Text style={s.stationName}>{toName}</Text>
                    <Text style={s.stationCode}>{item.toStation.code}</Text>
                  </View>
                </Pressable>

                <View style={s.routeActions}>
                  <Pressable
                    style={s.actionBtn}
                    onPress={() =>
                      handleSearch(item.fromStation.id, item.toStation.id, fromName, toName)
                    }
                  >
                    <Train size={14} color={colors.primary} />
                    <Text style={[s.actionText, { color: colors.primary }]}>
                      {t('search.button')}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={s.actionBtn}
                    onPress={() => handleDelete(item.id, label)}
                  >
                    <Trash size={14} color={colors.danger} />
                    <Text style={[s.actionText, { color: colors.danger }]}>
                      {t('common.remove')}
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* Ticket stub section */}
      <View style={[s.ticketStub, { bottom: insets.bottom + 20 }]}>
        <Ticket size={20} color={colors['text-tertiary']} weight="duotone" />
        <Text style={s.ticketText}>{t('journey.ticket_stub')}</Text>
      </View>
    </View>
  );
}

export default function JourneyScreen() {
  return <ErrorBoundary name="Journey"><JourneyContent /></ErrorBoundary>;
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    root:          { flex: 1, backgroundColor: colors['bg-base'] },
    header:        { paddingHorizontal: 20, paddingVertical: 20 },
    title:         { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 28, color: colors['text-primary'] },
    sub:           { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-secondary'], marginTop: 4 },
    sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, marginBottom: 12 },
    sectionTitle:  { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors['text-primary'], flex: 1 },
    sectionCount:  { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: colors.primary, backgroundColor: colors['primary-subtle'], paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
    emptyState:    { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80, gap: 10 },
    emptyTitle:    { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: colors['text-primary'] },
    emptySub:      { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-secondary'], textAlign: 'center', paddingHorizontal: 40 },
    emptyBtn:      { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.primary, borderRadius: 14, paddingHorizontal: 22, paddingVertical: 13, marginTop: 8 },
    emptyBtnText:  { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors['text-inverse'] },
    routeCard:     { backgroundColor: colors['bg-card'], borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 14, overflow: 'hidden' },
    routeMain:     { padding: 18 },
    stationRow:    { flexDirection: 'row', alignItems: 'center', gap: 10 },
    dot:           { width: 10, height: 10, borderRadius: 5 },
    stationName:   { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: colors['text-primary'], flex: 1 },
    stationCode:   { fontFamily: 'JetBrainsMono_400Regular', fontSize: 12, color: colors['text-tertiary'], backgroundColor: colors['bg-elevated'], borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
    lineRow:       { flexDirection: 'row', alignItems: 'center', marginLeft: 4, marginVertical: 2 },
    vertLine:      { width: 1, height: 18, backgroundColor: colors.border, marginLeft: 4, marginRight: 16 },
    routeActions:  { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border },
    actionBtn:     { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 12 },
    actionText:    { fontFamily: 'Inter_500Medium', fontSize: 13 },
    ticketStub:    { position: 'absolute', left: 20, right: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors['bg-card'], borderRadius: 12, borderWidth: 1, borderColor: colors.border, paddingVertical: 14 },
    ticketText:    { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors['text-tertiary'] },
  });
