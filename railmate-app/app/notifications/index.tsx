// app/notifications.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../../theme';

type NotifFilter = 'All' | 'Alerts' | 'Community' | 'Updates' | 'System';
interface NotifItem { id: string; icon: string; iconBg: string; title: string; desc: string; time: string; read: boolean; sub?: string; }

const FILTERS: { label: NotifFilter; color: string; bg: string }[] = [
  { label: 'All', color: C.green, bg: C.greenTint },
  { label: 'Alerts', color: C.red, bg: C.redTint },
  { label: 'Community', color: C.purple, bg: C.purpleTint },
  { label: 'Updates', color: C.blue, bg: C.blueTint },
  { label: 'System', color: C.orange, bg: C.orangeTint },
];

const GROUPS = [
  { label: 'Today', markAll: true, items: [
    { id: '1', icon: '⚠', iconBg: C.redTint, title: 'Delay Alert', desc: 'Subarna Express (721) is delayed by 20 minutes at Tongi station.', time: '9:25 AM', read: false, sub: 'Dhaka → Chattogram' },
    { id: '2', icon: '✓', iconBg: C.purpleTint, title: 'Community Verification', desc: 'Your delay report for Mohanagar Express has been verified by 6 travelers.', time: '8:48 AM', read: false, sub: 'Sylhet → Dhaka' },
    { id: '3', icon: '📅', iconBg: C.blueTint, title: 'Schedule Update', desc: 'New timetable published for Silk City Express (775). Check the updated schedule now.', time: '7:30 AM', read: false },
  ]},
  { label: 'Yesterday', markAll: false, items: [
    { id: '4', icon: '★', iconBg: C.orangeTint, title: 'Badge Earned', desc: 'Congratulations! You earned the "Helpful Traveler" badge for 25 helpful votes.', time: 'Yesterday, 9:12 PM', read: true },
    { id: '5', icon: '🔔', iconBg: C.greenTint, title: 'Reminder', desc: "Don't forget! You have a trip tomorrow.", time: 'Yesterday, 6:00 PM', read: true, sub: 'Intercity 710  •  Dhaka → Rajshahi  •  7:45 AM' },
  ]},
];

export default function NotificationsScreen() {
  const router = useRouter();
  const [active, setActive] = useState<NotifFilter>('All');
  return (
    <SafeAreaView style={ns.root}>
      <View style={ns.header}>
        <TouchableOpacity style={ns.backBtn} onPress={() => router.back()} />
        <View>
          <Text style={ns.title}>Notifications</Text>
          <Text style={ns.subtitle}>Stay informed, travel better</Text>
        </View>
        <View style={ns.headerRight}>
          <TouchableOpacity style={ns.iconBtn} />
          <TouchableOpacity style={ns.iconBtn} />
        </View>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={ns.filterRow} contentContainerStyle={{ paddingHorizontal: S.xl, gap: S.sm }}>
        {FILTERS.map(f => (
          <TouchableOpacity key={f.label} style={[ns.chip, active === f.label && { backgroundColor: f.bg, borderColor: f.color }]} onPress={() => setActive(f.label)}>
            <Text style={[ns.chipText, active === f.label && { color: f.color, fontWeight: '700' }]}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={ns.scroll}>
        {GROUPS.map(group => (
          <View key={group.label} style={ns.group}>
            <View style={ns.groupHeader}>
              <Text style={ns.groupLabel}>{group.label}</Text>
              {group.markAll && <TouchableOpacity><Text style={ns.markAll}>Mark all as read</Text></TouchableOpacity>}
            </View>
            {group.items.map((item, i) => (
              <TouchableOpacity key={item.id} style={ns.notifCard} activeOpacity={0.8}>
                <View style={[ns.notifIcon, { backgroundColor: item.iconBg }]} />
                <View style={{ flex: 1, gap: 4 }}>
                  <View style={ns.notifTop}>
                    <Text style={ns.notifTitle}>{item.title}</Text>
                    <View style={ns.notifMeta}>
                      <Text style={ns.notifTime}>{item.time}</Text>
                      <View style={[ns.readDot, { backgroundColor: item.read ? C.text3 : C.green }]} />
                    </View>
                  </View>
                  <Text style={ns.notifDesc}>{item.desc}</Text>
                  {item.sub && <Text style={ns.notifSub}>{item.sub}</Text>}
                </View>
                <View style={ns.chevron} />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
const ns = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.sm, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.xl, paddingVertical: S.md },
  backBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
  title: { fontSize: 18, fontWeight: '700', color: C.white },
  subtitle: { fontSize: T.sm, fontWeight: '600', color: C.green, marginTop: 2 },
  headerRight: { flexDirection: 'row', gap: S.sm },
  iconBtn: { width: 36, height: 36, backgroundColor: C.surface2, borderRadius: 18 },
  filterRow: { marginBottom: S.md },
  chip: { backgroundColor: C.surface, borderRadius: 20, paddingHorizontal: S.md, paddingVertical: 8, borderWidth: 1, borderColor: C.border },
  chipText: { fontSize: T.sm, color: C.text2 },
  group: { gap: S.sm },
  groupHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: S.sm },
  groupLabel: { fontSize: T.base, fontWeight: '700', color: C.text2 },
  markAll: { fontSize: T.sm, fontWeight: '600', color: C.green },
  notifCard: { backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: S.lg, flexDirection: 'row', alignItems: 'flex-start', gap: S.md },
  notifIcon: { width: 44, height: 44, borderRadius: 22 },
  notifTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  notifTitle: { fontSize: T.base, fontWeight: '700', color: C.white },
  notifMeta: { flexDirection: 'row', alignItems: 'center', gap: S.xs },
  notifTime: { fontSize: T.xs, color: C.text3 },
  readDot: { width: 8, height: 8, borderRadius: 4 },
  notifDesc: { fontSize: T.sm, color: C.text2, lineHeight: 18 },
  notifSub: { fontSize: T.xs, color: C.text3 },
  chevron: { width: 16, height: 16, backgroundColor: C.surface2, borderRadius: 4 },
});
