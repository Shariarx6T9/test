import React, { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text, Switch, StatusBar } from 'react-native';
import { BellSimple, Warning, Info, Shield, Plus, CheckCircle, Users, Clock } from 'phosphor-react-native';
import { ErrorBoundary } from '../../components/ErrorBoundary';

const C = {
  bg: '#080D17', bgCard: '#0F1929', bgElevated: '#162035',
  primary: '#00A859', accent: '#F5A623', danger: '#E8394B', info: '#4EA8E0',
  textPri: '#F0F4FF', textSec: '#8FA3C0', textTer: '#4E6480',
  border: '#1E2E42',
};

const FILTERS = ['All', 'Active', 'Past'] as const;
type Filter = typeof FILTERS[number];

const MOCK_UPDATES = [
  {
    id: '1', type: 'departure', trainName: 'Subarna Express', trainNum: '#721',
    label: 'Departure Reminder', labelColor: C.primary, accentColor: C.primary,
    msg: 'Leaves in 30 minutes', Icon: BellSimple, iconBg: C.primary + '20',
    date: '13 June, 06:40', time: '9:10 PM', active: true, filter: 'Active',
  },
  {
    id: '2', type: 'delay', trainName: 'Turna Express', trainNum: '#762',
    label: 'Delay Alert', labelColor: C.accent, accentColor: C.accent,
    msg: '25 min delay reported', Icon: Warning, iconBg: C.accent + '20',
    date: '13 June, 08:15', time: '8:20 PM', active: true, filter: 'Active',
    confirmations: 8,
  },
  {
    id: '3', type: 'schedule', trainName: 'Mahanagar Express', trainNum: '#236',
    label: 'Schedule Update', labelColor: C.info, accentColor: C.info,
    msg: 'Schedule updated', Icon: Info, iconBg: C.info + '20',
    date: '13 June, 12:30', time: '7:45 PM', active: true, filter: 'Active',
  },
];

function UpdatesContent() {
  const [filter, setFilter] = useState<Filter>('All');
  const [toggleStates, setToggleStates] = useState<Record<string, boolean>>({ '1': true, '2': true, '3': true });

  const filtered = MOCK_UPDATES.filter((u) => filter === 'All' || u.filter === filter);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />

      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.title}>My Alerts</Text>
          <Text style={s.sub}>RailMate watches over your journeys</Text>
        </View>
        <View style={s.bellWrap}>
          <BellSimple size={20} color={C.textSec} weight="regular" />
          <View style={s.badge}><Text style={s.badgeText}>{filtered.length}</Text></View>
        </View>
      </View>

      {/* Filters */}
      <View style={s.filters}>
        {FILTERS.map((f) => (
          <Pressable key={f} style={[s.filterChip, filter === f && s.filterChipActive]} onPress={() => setFilter(f)}>
            <Text style={[s.filterText, filter === f && s.filterTextActive]}>{f}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        {filtered.map((u) => (
          <View key={u.id} style={s.card}>
            <View style={[s.cardAccent, { backgroundColor: u.accentColor }]} />

            <View style={s.cardTop}>
              <View style={[s.iconWrap, { backgroundColor: u.iconBg }]}>
                <u.Icon size={22} color={u.accentColor} weight="fill" />
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={[s.cardLabel, { color: u.labelColor }]}>{u.label}</Text>
                <Text style={s.cardTrain}>{u.trainName}</Text>
              </View>
              <Switch
                value={toggleStates[u.id]}
                onValueChange={(v) => setToggleStates({ ...toggleStates, [u.id]: v })}
                trackColor={{ false: '#1E2E42', true: C.primary + '60' }}
                thumbColor={toggleStates[u.id] ? C.primary : '#4E6480'}
                style={{ transform: [{ scaleX: 0.85 }, { scaleY: 0.85 }] }}
              />
            </View>

            <View style={s.cardBody}>
              <View style={s.statusRow}>
                <View style={[s.statusDot, { backgroundColor: u.accentColor }]} />
                <Text style={[s.statusMsg, { color: u.accentColor }]}>{u.msg}</Text>
              </View>
              {u.confirmations && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <Users size={12} color={C.textTer} />
                  <Text style={s.confirm}>{u.confirmations} travelers confirmed</Text>
                </View>
              )}
            </View>

            <View style={s.cardFooter}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Clock size={12} color={C.textTer} />
                <Text style={s.footerDate}>{u.date}</Text>
              </View>
              <Text style={s.footerTime}>{u.time}</Text>
            </View>
          </View>
        ))}

        {/* Info card */}
        <View style={s.infoCard}>
          <Shield size={28} color={C.primary} weight="duotone" />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={s.infoTitle}>We'll keep you informed</Text>
            <Text style={s.infoSub}>Get real-time updates so you can travel with confidence.</Text>
          </View>
          <CheckCircle size={22} color={C.primary} weight="fill" />
        </View>
      </ScrollView>

      {/* FAB */}
      <Pressable style={s.fab}>
        <Plus size={20} color="#fff" weight="bold" />
        <Text style={s.fabText}>Create Alert</Text>
      </Pressable>
    </View>
  );
}

export default function UpdatesScreen() {
  return <ErrorBoundary name="Live Updates"><UpdatesContent /></ErrorBoundary>;
}

const s = StyleSheet.create({
  root:            { flex: 1, backgroundColor: C.bg },
  header:          { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  title:           { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 28, color: C.textPri },
  sub:             { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSec, marginTop: 3 },
  bellWrap:        { width: 44, height: 44, borderRadius: 22, backgroundColor: C.bgCard, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  badge:           { position: 'absolute', top: -4, right: -4, width: 18, height: 18, borderRadius: 9, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  badgeText:       { fontFamily: 'Inter_600SemiBold', fontSize: 10, color: '#fff' },
  filters:         { flexDirection: 'row', paddingHorizontal: 20, gap: 8, marginBottom: 4 },
  filterChip:      { borderWidth: 1, borderColor: C.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  filterChipActive:{ backgroundColor: C.primary, borderColor: C.primary },
  filterText:      { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.textSec },
  filterTextActive:{ color: '#fff' },
  card:            { backgroundColor: C.bgCard, borderRadius: 16, borderWidth: 1, borderColor: C.border, marginBottom: 14, overflow: 'hidden' },
  cardAccent:      { height: 3 },
  cardTop:         { flexDirection: 'row', alignItems: 'center', padding: 16, paddingBottom: 12 },
  iconWrap:        { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  cardLabel:       { fontFamily: 'Inter_500Medium', fontSize: 12, letterSpacing: 0.3, marginBottom: 3 },
  cardTrain:       { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: C.textPri },
  cardBody:        { paddingHorizontal: 16, paddingBottom: 12 },
  statusRow:       { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot:       { width: 8, height: 8, borderRadius: 4 },
  statusMsg:       { fontFamily: 'Inter_500Medium', fontSize: 13 },
  confirm:         { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.textTer },
  cardFooter:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: C.border },
  footerDate:      { fontFamily: 'JetBrainsMono_400Regular', fontSize: 12, color: C.textTer },
  footerTime:      { fontFamily: 'JetBrainsMono_400Regular', fontSize: 12, color: C.textTer },
  infoCard:        { flexDirection: 'row', alignItems: 'center', backgroundColor: C.bgCard, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 18, marginBottom: 14 },
  infoTitle:       { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: C.textPri, marginBottom: 4 },
  infoSub:         { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.textSec, lineHeight: 20 },
  fab:             { position: 'absolute', bottom: 90, right: 20, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.primary, borderRadius: 28, paddingHorizontal: 22, paddingVertical: 15, elevation: 8, shadowColor: C.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12 },
  fabText:         { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#fff' },
});
