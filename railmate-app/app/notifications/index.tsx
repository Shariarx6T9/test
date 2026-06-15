import React, { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text } from 'react-native';
import { ArrowLeft, BellSimple, Warning, Users, CheckCircle, Calendar, Trash } from 'phosphor-react-native';
import { useRouter } from 'expo-router';

const C = { bg:'#080D17', bgCard:'#0F1929', primary:'#00A859', accent:'#F5A623', danger:'#E8394B', info:'#4EA8E0', textPri:'#F0F4FF', textSec:'#8FA3C0', textTer:'#4E6480', border:'#1E2E42' };

const NOTIFICATIONS = [
  { id:'1', group:'Delays',    icon:Warning,      color:C.accent,  title:'Subarna Express delayed',       body:'25 min delay reported by 8 travelers on the Dhaka–Chattogram route.', time:'5m ago',  read:false },
  { id:'2', group:'Crowding',  icon:Users,        color:C.danger,  title:'High crowding — Turna Express', body:'S-Chair coaches full. Consider AC coach if available.',             time:'18m ago', read:false },
  { id:'3', group:'Verified',  icon:CheckCircle,  color:C.primary, title:'Your report was verified',      body:'Your delay report for Mahanagar Express was confirmed by 5 travelers.',time:'1h ago',  read:true  },
  { id:'4', group:'Schedule',  icon:Calendar,     color:C.info,    title:'Schedule change — Parabat Exp', body:'Departure time changed from 10:30 to 11:00 for tomorrow.',           time:'3h ago',  read:true  },
  { id:'5', group:'Delays',    icon:Warning,      color:C.accent,  title:'Egarosindhur Express — 40 min', body:'Long delay due to signal failure near Narsingdi.',                  time:'5h ago',  read:true  },
];

const GROUPS = ['All', 'Delays', 'Crowding', 'Verified', 'Schedule'] as const;
type Group = typeof GROUPS[number];

export default function NotificationsScreen() {
  const router = useRouter();
  const [filter, setFilter] = useState<Group>('All');
  const filtered = NOTIFICATIONS.filter((n) => filter==='All' || n.group===filter);
  const unread = NOTIFICATIONS.filter((n) => !n.read).length;

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()}><ArrowLeft size={20} color={C.textPri} weight="bold" /></Pressable>
        <View>
          <Text style={s.title}>Notifications</Text>
          {unread > 0 && <Text style={s.unreadCount}>{unread} unread</Text>}
        </View>
        <Pressable><Trash size={20} color={C.textTer} /></Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filters}>
        {GROUPS.map((g) => (
          <Pressable key={g} style={[s.filterChip, filter===g && s.filterActive]} onPress={() => setFilter(g)}>
            <Text style={[s.filterText, filter===g && s.filterActiveText]}>{g}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView contentContainerStyle={{ padding:20, paddingBottom:40 }} showsVerticalScrollIndicator={false}>
        {filtered.map((n) => (
          <View key={n.id} style={[s.card, !n.read && s.cardUnread]}>
            <View style={[s.iconWrap, { backgroundColor: n.color+'18' }]}>
              <n.icon size={20} color={n.color} weight="fill" />
            </View>
            <View style={{ flex:1, marginLeft:14 }}>
              <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:4 }}>
                <Text style={[s.cardTitle, !n.read && { color: C.textPri }]} numberOfLines={1}>{n.title}</Text>
                {!n.read && <View style={s.dot} />}
              </View>
              <Text style={s.cardBody} numberOfLines={2}>{n.body}</Text>
              <Text style={s.time}>{n.time}</Text>
            </View>
          </View>
        ))}
        {filtered.length === 0 && (
          <View style={s.empty}>
            <BellSimple size={48} color={C.textTer} weight="thin" />
            <Text style={s.emptyText}>No notifications</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:            { flex:1, backgroundColor:C.bg },
  header:          { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:20, paddingTop:56, paddingBottom:16 },
  backBtn:         { width:40, height:40, borderRadius:20, backgroundColor:C.bgCard, borderWidth:1, borderColor:C.border, alignItems:'center', justifyContent:'center' },
  title:           { fontFamily:'PlusJakartaSans_700Bold', fontSize:20, color:C.textPri },
  unreadCount:     { fontFamily:'Inter_400Regular', fontSize:12, color:C.primary, marginTop:2 },
  filters:         { paddingHorizontal:20, gap:8, paddingBottom:16 },
  filterChip:      { borderWidth:1, borderColor:C.border, borderRadius:20, paddingHorizontal:16, paddingVertical:8 },
  filterActive:    { backgroundColor:C.primary, borderColor:C.primary },
  filterText:      { fontFamily:'Inter_500Medium', fontSize:13, color:C.textSec },
  filterActiveText:{ color:'#fff' },
  card:            { flexDirection:'row', alignItems:'flex-start', backgroundColor:C.bgCard, borderRadius:14, borderWidth:1, borderColor:C.border, padding:16, marginBottom:10 },
  cardUnread:      { borderColor:'rgba(0,168,89,0.3)', backgroundColor:'rgba(0,168,89,0.04)' },
  iconWrap:        { width:44, height:44, borderRadius:12, alignItems:'center', justifyContent:'center' },
  cardTitle:       { fontFamily:'Inter_600SemiBold', fontSize:14, color:C.textSec, flex:1, marginRight:8 },
  cardBody:        { fontFamily:'Inter_400Regular', fontSize:13, color:C.textSec, lineHeight:20, marginBottom:6 },
  time:            { fontFamily:'Inter_400Regular', fontSize:12, color:C.textTer },
  dot:             { width:8, height:8, borderRadius:4, backgroundColor:C.primary, marginTop:3 },
  empty:           { alignItems:'center', justifyContent:'center', paddingTop:80, gap:12 },
  emptyText:       { fontFamily:'Inter_400Regular', fontSize:15, color:C.textTer },
});
