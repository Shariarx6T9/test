// app/route-map.tsx
import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../theme';

type MapView = 'Route Map' | 'Timeline';

interface Stop {
  time: string;
  station: string;
  stationBn: string;
  tag?: 'Start' | 'End';
  extra?: string;
  active?: boolean;
}

const STOPS: Stop[] = [
  { time: '06:40', station: 'Dhaka', extra: undefined, tag: 'Start', active: true },
  { time: '06:58', station: 'Narayanganj', extra: '+ 18 min', active: false },
  { time: '07:22', station: 'Munshiganj', extra: '+ 24 min', active: false },
  { time: '08:16', station: 'Comilla', extra: '+ 54 min', active: true },
  { time: '09:32', station: 'Feni', extra: '+ 1h 16m', active: false },
  { time: '12:25', station: 'Chattogram', extra: undefined, tag: 'End', active: true },
];

export default function RouteMapScreen() {
  const router = useRouter();
  const [view, setView] = useState<MapView>('Route Map');

  return (
    <SafeAreaView style={rm.root}>
      {/* Header */}
      <View style={rm.header}>
        <TouchableOpacity style={rm.backBtn} onPress={() => router.back()} />
        <View style={rm.headerCenter}>
          <View style={rm.trainIcon} />
          <View>
            <Text style={rm.title}>Route Map</Text>
            <Text style={rm.subtitle}>Dhaka → Chattogram</Text>
            <View style={rm.trainSelector}>
              <Text style={rm.trainSelectorText}>Subarna Express (701)  ▾</Text>
            </View>
          </View>
        </View>
        <View style={rm.headerActions}>
          <TouchableOpacity style={rm.starBtn}>
            <Text style={rm.starBtnText}>⭐</Text>
          </TouchableOpacity>
          <TouchableOpacity style={rm.shareBtn} />
        </View>
      </View>

      {/* View toggle */}
      <View style={rm.viewToggle}>
        {(['Route Map', 'Timeline'] as MapView[]).map(v => (
          <TouchableOpacity
            key={v}
            style={[rm.viewTab, view === v && rm.viewTabActive]}
            onPress={() => setView(v)}
          >
            <Text style={[rm.viewTabText, view === v && rm.viewTabTextActive]}>
              {v === 'Route Map' ? '📍 ' : '⏱ '}{v}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={rm.scroll}>

        {view === 'Route Map' ? (
          /* ── MAP VIEW ── */
          <View style={rm.mapSection}>
            {/* Map placeholder */}
            <View style={rm.mapContainer}>
              <View style={rm.mapPlaceholder}>
                <Text style={rm.mapEmoji}>🗺️</Text>
                <Text style={rm.mapLabel}>Route Map</Text>
                <Text style={rm.mapSub}>Dhaka to Chattogram</Text>
              </View>
              {/* Map controls */}
              <View style={rm.mapControls}>
                <TouchableOpacity style={rm.mapBtn}><Text style={rm.mapBtnText}>⊕</Text></TouchableOpacity>
                <TouchableOpacity style={rm.mapBtn}><Text style={rm.mapBtnText}>⊖</Text></TouchableOpacity>
                <TouchableOpacity style={rm.mapBtn}><Text style={rm.mapBtnText}>◎</Text></TouchableOpacity>
              </View>
            </View>

            {/* Stops list alongside map */}
            <View style={rm.stopsPanel}>
              <View style={rm.stopsPanelHeader}>
                <Text style={rm.stopsPanelTitle}>Major Stations</Text>
                <View style={rm.stopsBadge}><Text style={rm.stopsBadgeText}>6 Stops</Text></View>
              </View>
              {STOPS.map((stop, i) => (
                <View key={stop.station}>
                  <View style={rm.stopRow}>
                    <View style={rm.stopIndicator}>
                      <View style={[rm.stopDot, { backgroundColor: stop.active ? C.green : C.text3 }]} />
                      {i < STOPS.length - 1 && <View style={rm.stopLine} />}
                    </View>
                    <View style={rm.stopContent}>
                      <View style={rm.stopTimeRow}>
                        <Text style={rm.stopTime}>{stop.time}</Text>
                        <Text style={rm.stopStation}>{stop.station}</Text>
                        {stop.tag && (
                          <View style={[rm.stopTag, stop.tag === 'End' && rm.stopTagEnd]}>
                            <Text style={[rm.stopTagText, stop.tag === 'End' && rm.stopTagTextEnd]}>{stop.tag}</Text>
                          </View>
                        )}
                      </View>
                      {stop.extra && <Text style={rm.stopExtra}>{stop.extra}</Text>}
                    </View>
                    <TouchableOpacity style={rm.locationBtn} />
                    <View style={rm.stopChevron} />
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : (
          /* ── TIMELINE VIEW ── */
          <View style={rm.timelineSection}>
            {STOPS.map((stop, i) => (
              <View key={stop.station} style={rm.timelineRow}>
                <View style={rm.timelineLeft}>
                  <Text style={rm.timelineTime}>{stop.time}</Text>
                </View>
                <View style={rm.timelineIndicator}>
                  <View style={[rm.timelineDot, { backgroundColor: stop.active ? C.green : C.text3 }]} />
                  {i < STOPS.length - 1 && <View style={rm.timelineLine} />}
                </View>
                <View style={rm.timelineContent}>
                  <Text style={[rm.timelineStation, stop.active && { color: C.green }]}>{stop.station}</Text>
                  {stop.extra && <Text style={rm.timelineExtra}>{stop.extra}</Text>}
                  {stop.tag && (
                    <View style={[rm.stopTag, stop.tag === 'End' && rm.stopTagEnd]}>
                      <Text style={[rm.stopTagText, stop.tag === 'End' && rm.stopTagTextEnd]}>{stop.tag}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Journey stats */}
        <View style={rm.statsCard}>
          {[
            { icon: '📍', label: 'Total Distance', val: '248 km', sub: 'Approx.' },
            { icon: '⏱', label: 'Travel Duration', val: '5h 45m', sub: 'Approx.' },
            { icon: '⚡', label: 'Avg. Speed', val: '43 km/h', sub: 'Est.' },
          ].map(stat => (
            <View key={stat.label} style={rm.statItem}>
              <Text style={rm.statIcon}>{stat.icon}</Text>
              <Text style={rm.statLabel}>{stat.label}</Text>
              <Text style={rm.statVal}>{stat.val}</Text>
              <Text style={rm.statSub}>{stat.sub}</Text>
            </View>
          ))}
        </View>

        {/* Train info */}
        <View style={rm.trainInfoCard}>
          <View style={rm.trainInfoLeft}>
            <View style={rm.trainInfoIcon} />
            <View>
              <Text style={rm.trainInfoName}>Subarna Express (701)</Text>
              <Text style={rm.trainInfoRoute}>Dhaka → Chattogram</Text>
              <View style={rm.dailyBadge}><Text style={rm.dailyBadgeText}>Daily Service</Text></View>
            </View>
          </View>
          <View style={rm.trainInfoRight}>
            <Text style={rm.trainInfoLabel}>Departure</Text>
            <Text style={rm.trainInfoDep}>06:40 AM</Text>
            <Text style={rm.trainInfoLabel}>Arrival</Text>
            <Text style={rm.trainInfoArr}>12:25 PM</Text>
          </View>
          <TouchableOpacity style={rm.trainInfoChevron} />
        </View>

        {/* Action rows */}
        {[
          { label: 'Next Departure', value: 'Tomorrow, 06:40 AM' },
          { label: 'Save Route', value: 'Saved to My Routes', saved: true },
          { label: 'Delay Alerts', value: 'Get real-time updates', toggle: true },
        ].map(action => (
          <View key={action.label} style={rm.actionRow}>
            <View style={rm.actionIcon} />
            <View style={{ flex: 1 }}>
              <Text style={rm.actionLabel}>{action.label}</Text>
              <Text style={rm.actionValue}>{action.value}</Text>
            </View>
            {action.saved ? (
              <View style={rm.savedCheck}><Text style={rm.savedCheckText}>✓</Text></View>
            ) : action.toggle ? (
              <View style={rm.toggleOn} />
            ) : (
              <View style={rm.actionChevron} />
            )}
          </View>
        ))}

        {/* Route overview */}
        <View style={rm.overviewCard}>
          <View style={rm.overviewLeft}>
            <View style={rm.overviewIcon} />
            <View style={rm.overviewStats}>
              {[['Stops', '6'], ['Distance', '248km'], ['Duration', '5h 45m'], ['Service', 'Daily']].map(([l, v]) => (
                <View key={l} style={rm.overviewItem}>
                  <Text style={rm.overviewLabel}>{l}</Text>
                  <Text style={rm.overviewVal}>{v}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={rm.crowdBox}>
            <Text style={rm.crowdLabel}>Crowd Level</Text>
            <View style={rm.crowdIcons}>
              <Text style={rm.crowdIcon}>🟢</Text>
              <Text style={rm.crowdIcon}>🟡</Text>
              <Text style={rm.crowdIcon}>🔴</Text>
            </View>
            <Text style={rm.crowdVal}>Medium</Text>
          </View>
          <View style={rm.overviewChevron} />
        </View>

        <View style={rm.tapHint}>
          <Text style={rm.tapHintText}>💡 Tap on any station to see platform info, facilities & live updates</Text>
          <View style={rm.tapHintChevron} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const rm = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.lg, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.xl, paddingVertical: S.md },
  backBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
  headerCenter: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  trainIcon: { width: 40, height: 40, backgroundColor: C.greenTint, borderRadius: 10 },
  title: { fontSize: 17, fontWeight: '700', color: C.white },
  subtitle: { fontSize: T.sm, color: C.text2 },
  trainSelector: { marginTop: 2 },
  trainSelectorText: { fontSize: T.sm, fontWeight: '600', color: C.green },
  headerActions: { flexDirection: 'row', gap: S.sm },
  starBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  starBtnText: { fontSize: T.base },
  shareBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
  viewToggle: { flexDirection: 'row', marginHorizontal: S.xl, backgroundColor: C.surface, borderRadius: R.md, borderWidth: 1, borderColor: C.border, padding: 4, gap: 4 },
  viewTab: { flex: 1, paddingVertical: S.sm, alignItems: 'center', borderRadius: 10 },
  viewTabActive: { backgroundColor: C.green },
  viewTabText: { fontSize: T.sm, fontWeight: '500', color: C.text2 },
  viewTabTextActive: { fontWeight: '700', color: C.bg },
  mapSection: { flexDirection: 'row', gap: S.md },
  mapContainer: { flex: 1, position: 'relative' },
  mapPlaceholder: { height: 320, backgroundColor: C.blueTint, borderRadius: R.lg, alignItems: 'center', justifyContent: 'center', gap: S.sm, borderWidth: 1, borderColor: C.blue },
  mapEmoji: { fontSize: 40 },
  mapLabel: { fontSize: T.md, fontWeight: '700', color: C.white },
  mapSub: { fontSize: T.sm, color: C.text2 },
  mapControls: { position: 'absolute', left: S.md, bottom: S.md, gap: S.sm },
  mapBtn: { width: 32, height: 32, backgroundColor: C.bg, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  mapBtnText: { fontSize: 16, color: C.white },
  stopsPanel: { flex: 1, gap: S.xs },
  stopsPanelHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: S.xs },
  stopsPanelTitle: { fontSize: T.sm, fontWeight: '700', color: C.white },
  stopsBadge: { backgroundColor: C.greenTint, borderRadius: 8, paddingHorizontal: S.xs, paddingVertical: 2 },
  stopsBadgeText: { fontSize: T.xs, fontWeight: '600', color: C.green },
  stopRow: { flexDirection: 'row', alignItems: 'flex-start', gap: S.xs },
  stopIndicator: { alignItems: 'center', width: 14 },
  stopDot: { width: 10, height: 10, borderRadius: 5 },
  stopLine: { width: 2, flex: 1, minHeight: 20, backgroundColor: C.border, marginTop: 2 },
  stopContent: { flex: 1, paddingBottom: S.sm },
  stopTimeRow: { flexDirection: 'row', alignItems: 'center', gap: S.xs, flexWrap: 'wrap' },
  stopTime: { fontSize: T.sm, fontWeight: '700', color: C.white },
  stopStation: { fontSize: T.sm, fontWeight: '600', color: C.white },
  stopTag: { backgroundColor: C.greenTint, borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1 },
  stopTagEnd: { backgroundColor: C.surface2 },
  stopTagText: { fontSize: 8, fontWeight: '700', color: C.green },
  stopTagTextEnd: { color: C.text2 },
  stopExtra: { fontSize: T.xs, color: C.text2, marginTop: 2 },
  locationBtn: { width: 16, height: 16, backgroundColor: C.blueTint, borderRadius: 8 },
  stopChevron: { width: 12, height: 12, backgroundColor: C.surface2, borderRadius: 3 },
  timelineSection: { gap: S.sm },
  timelineRow: { flexDirection: 'row', gap: S.md },
  timelineLeft: { width: 48, alignItems: 'flex-end' },
  timelineTime: { fontSize: T.sm, fontWeight: '700', color: C.white },
  timelineIndicator: { alignItems: 'center', width: 16 },
  timelineDot: { width: 12, height: 12, borderRadius: 6 },
  timelineLine: { width: 2, flex: 1, minHeight: 28, backgroundColor: C.border, marginTop: 4 },
  timelineContent: { flex: 1, paddingBottom: S.md, gap: 4 },
  timelineStation: { fontSize: T.base, fontWeight: '600', color: C.white },
  timelineExtra: { fontSize: T.sm, color: C.text2 },
  statsCard: { flexDirection: 'row', backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.lg, justifyContent: 'space-between' },
  statItem: { alignItems: 'center', gap: 4 },
  statIcon: { fontSize: 18 },
  statLabel: { fontSize: T.xs, color: C.text2, textAlign: 'center' },
  statVal: { fontSize: 14, fontWeight: '700', color: C.white },
  statSub: { fontSize: T.xs, color: C.text3 },
  trainInfoCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.lg, gap: S.md },
  trainInfoLeft: { flex: 1, flexDirection: 'row', gap: S.md, alignItems: 'center' },
  trainInfoIcon: { width: 40, height: 40, backgroundColor: C.greenTint, borderRadius: 20 },
  trainInfoName: { fontSize: T.base, fontWeight: '700', color: C.white },
  trainInfoRoute: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  dailyBadge: { backgroundColor: C.surface2, borderRadius: 6, paddingHorizontal: S.xs, paddingVertical: 2, alignSelf: 'flex-start', marginTop: 4 },
  dailyBadgeText: { fontSize: T.xs, color: C.text2 },
  trainInfoRight: { gap: 2 },
  trainInfoLabel: { fontSize: T.xs, color: C.text2 },
  trainInfoDep: { fontSize: T.base, fontWeight: '700', color: C.green },
  trainInfoArr: { fontSize: T.base, fontWeight: '700', color: C.blue },
  trainInfoChevron: { width: 16, height: 16, backgroundColor: C.surface2, borderRadius: 4 },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: S.md, backgroundColor: C.surface, borderRadius: R.md, borderWidth: 1, borderColor: C.border, padding: S.lg },
  actionIcon: { width: 28, height: 28, backgroundColor: C.surface2, borderRadius: 14 },
  actionLabel: { fontSize: T.sm, fontWeight: '600', color: C.white },
  actionValue: { fontSize: T.xs, color: C.text2, marginTop: 2 },
  savedCheck: { width: 24, height: 24, backgroundColor: C.green, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  savedCheckText: { fontSize: T.sm, color: C.bg, fontWeight: '700' },
  toggleOn: { width: 44, height: 26, backgroundColor: C.green, borderRadius: 13 },
  actionChevron: { width: 16, height: 16, backgroundColor: C.surface2, borderRadius: 4 },
  overviewCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.lg, gap: S.md },
  overviewLeft: { flex: 1, flexDirection: 'row', gap: S.md, alignItems: 'center' },
  overviewIcon: { width: 36, height: 36, backgroundColor: C.greenTint, borderRadius: 18 },
  overviewStats: { flexDirection: 'row', flexWrap: 'wrap', gap: S.sm },
  overviewItem: { minWidth: 56 },
  overviewLabel: { fontSize: T.xs, color: C.text2 },
  overviewVal: { fontSize: T.sm, fontWeight: '700', color: C.white },
  crowdBox: { alignItems: 'center', gap: 4 },
  crowdLabel: { fontSize: T.xs, color: C.text2 },
  crowdIcons: { flexDirection: 'row', gap: 2 },
  crowdIcon: { fontSize: 12 },
  crowdVal: { fontSize: T.sm, fontWeight: '700', color: C.orange },
  overviewChevron: { width: 16, height: 16, backgroundColor: C.surface2, borderRadius: 4 },
  tapHint: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: R.md, borderWidth: 1, borderColor: C.border, padding: S.md, gap: S.sm },
  tapHintText: { flex: 1, fontSize: T.sm, color: C.text2, lineHeight: 18 },
  tapHintChevron: { width: 16, height: 16, backgroundColor: C.surface2, borderRadius: 4 },
});
