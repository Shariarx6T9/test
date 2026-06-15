import React, { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text } from 'react-native';
import { ArrowLeft, Suitcase, BookmarkSimple, BellSimple, ChartBar, Plus, Train, CaretRight } from 'phosphor-react-native';
import { useRouter } from 'expo-router';

const C = { bg: '#080D17', bgCard: '#0F1929', bgElevated: '#162035', primary: '#00A859', accent: '#F5A623', textPri: '#F0F4FF', textSec: '#8FA3C0', textTer: '#4E6480', border: '#1E2E42' };

const UPCOMING = [
  { id:'1', train:'Subarna Express', from:'Dhaka', to:'Chattogram', date:'15 Jun', time:'06:40', class:'S Chair' },
  { id:'2', train:'Turna Express',   from:'Sylhet', to:'Dhaka',    date:'20 Jun', time:'08:00', class:'AC Berth' },
];
const SAVED = [
  { id:'1', from:'Dhaka', to:'Chattogram', alerts: true },
  { id:'2', from:'Dhaka', to:'Sylhet',     alerts: false },
  { id:'3', from:'Rajshahi', to:'Dhaka',   alerts: true },
];
const STATS = [['42', 'Journeys'], ['1,240 km', 'Distance'], ['8h 20m', 'Saved'], ['৳12,400', 'Spent']];

export default function JourneyToolsScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<'upcoming'|'completed'>('upcoming');
  return (
    <View style={s.root}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()}><ArrowLeft size={20} color={C.textPri} weight="bold" /></Pressable>
        <Text style={s.title}>Journey Tools</Text>
        <View style={{ width: 40 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>

        {/* My Trips */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Suitcase size={18} color={C.primary} weight="duotone" />
            <Text style={s.sectionTitle}>My Trips</Text>
          </View>
          <View style={s.tabRow}>
            {(['upcoming','completed'] as const).map((t) => (
              <Pressable key={t} style={[s.tabChip, tab===t && s.tabChipActive]} onPress={() => setTab(t)}>
                <Text style={[s.tabText, tab===t && s.tabTextActive]}>{t.charAt(0).toUpperCase()+t.slice(1)}</Text>
              </Pressable>
            ))}
          </View>
          {UPCOMING.map((trip) => (
            <View key={trip.id} style={s.tripCard}>
              <View style={s.tripAccent} />
              <View style={{ flex: 1 }}>
                <Text style={s.tripTrain}>{trip.train}</Text>
                <Text style={s.tripRoute}>{trip.from} → {trip.to}</Text>
                <Text style={s.tripMeta}>{trip.date} · {trip.time} · {trip.class}</Text>
              </View>
              <Train size={20} color={C.primary} weight="duotone" />
            </View>
          ))}
        </View>

        {/* Saved Routes */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <BookmarkSimple size={18} color={C.accent} weight="fill" />
            <Text style={s.sectionTitle}>Saved Routes</Text>
          </View>
          {SAVED.map((r) => (
            <View key={r.id} style={s.savedRow}>
              <View style={s.savedDots}><View style={s.dot}/><View style={s.dotLine}/><View style={s.dot}/></View>
              <Text style={s.savedText}>{r.from} → {r.to}</Text>
              <Text style={[s.alertLabel, { color: r.alerts ? C.primary : C.textTer }]}>{r.alerts ? '🔔' : '🔕'}</Text>
              <CaretRight size={16} color={C.textTer} />
            </View>
          ))}
          <Pressable style={s.addBtn}><Plus size={16} color={C.primary} /><Text style={s.addBtnText}>Add Route</Text></Pressable>
        </View>

        {/* Travel Stats */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <ChartBar size={18} color={C.info} weight="duotone" />
            <Text style={s.sectionTitle}>Travel Stats</Text>
          </View>
          <View style={s.statsGrid}>
            {STATS.map(([val, label]) => (
              <View key={label} style={s.statCard}>
                <Text style={s.statVal}>{val}</Text>
                <Text style={s.statLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
const C2 = { info: '#4EA8E0' };
const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: C.bg },
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  backBtn:       { width: 40, height: 40, borderRadius: 20, backgroundColor: C.bgCard, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  title:         { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 20, color: C.textPri },
  section:       { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 16 },
  sectionTitle:  { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: C.textPri },
  tabRow:        { flexDirection: 'row', gap: 8, marginBottom: 14 },
  tabChip:       { borderWidth: 1, borderColor: C.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  tabChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  tabText:       { fontFamily: 'Inter_500Medium', fontSize: 13, color: C.textSec },
  tabTextActive: { color: '#fff' },
  tripCard:      { flexDirection: 'row', alignItems: 'center', backgroundColor: C.bgCard, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 16, marginBottom: 10, overflow: 'hidden' },
  tripAccent:    { position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, backgroundColor: C.primary },
  tripTrain:     { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: C.textPri },
  tripRoute:     { fontFamily: 'Inter_400Regular', fontSize: 13, color: C.textSec, marginTop: 2 },
  tripMeta:      { fontFamily: 'JetBrainsMono_400Regular', fontSize: 12, color: C.textTer, marginTop: 4 },
  savedRow:      { flexDirection: 'row', alignItems: 'center', backgroundColor: C.bgCard, borderRadius: 12, borderWidth: 1, borderColor: C.border, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 8, gap: 12 },
  savedDots:     { alignItems: 'center' },
  dot:           { width: 7, height: 7, borderRadius: 4, backgroundColor: C.primary },
  dotLine:       { width: 2, height: 12, backgroundColor: C.border, marginVertical: 2 },
  savedText:     { flex: 1, fontFamily: 'Inter_500Medium', fontSize: 14, color: C.textPri },
  alertLabel:    { fontSize: 16 },
  addBtn:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderColor: C.primary, borderStyle: 'dashed', borderRadius: 12, paddingVertical: 13, marginTop: 4 },
  addBtnText:    { fontFamily: 'Inter_500Medium', fontSize: 14, color: C.primary },
  statsGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  statCard:      { flex: 1, minWidth: '44%', backgroundColor: C.bgCard, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 18, alignItems: 'center' },
  statVal:       { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 22, color: C.primary, marginBottom: 4 },
  statLabel:     { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.textSec },
});
