import React, { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text } from 'react-native';
import { ArrowLeft, Trophy, Medal, Star } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import { Avatar } from '../../components/ui/Avatar/Avatar';

const C = { bg:'#080D17', bgCard:'#0F1929', bgElevated:'#162035', primary:'#00A859', accent:'#F5A623', danger:'#E8394B', textPri:'#F0F4FF', textSec:'#8FA3C0', textTer:'#4E6480', border:'#1E2E42' };

const TABS = ['Weekly','Monthly','All Time'] as const;
type Tab = typeof TABS[number];

const DATA = [
  { rank:1, name:'Rahim U.',    points:2840, reports:42, badge:'🥇', isYou:false },
  { rank:2, name:'Fatema B.',   points:2210, reports:35, badge:'🥈', isYou:false },
  { rank:3, name:'Karim H.',    points:1980, reports:31, badge:'🥉', isYou:false },
  { rank:4, name:'Sumaiya R.',  points:1540, reports:24, badge:'',   isYou:false },
  { rank:5, name:'Noor Islam',  points:1320, reports:20, badge:'',   isYou:false },
  { rank:6, name:'You',         points:980,  reports:15, badge:'',   isYou:true  },
  { rank:7, name:'Anwar S.',    points:870,  reports:13, badge:'',   isYou:false },
  { rank:8, name:'Rubina K.',   points:750,  reports:11, badge:'',   isYou:false },
];

const PODIUM_COLORS = ['#F5A623','#8FA3C0','#C87941'];

export default function LeaderboardScreen() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('Weekly');
  const top3 = DATA.slice(0,3);
  const rest = DATA.slice(3);

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()}><ArrowLeft size={20} color={C.textPri} weight="bold" /></Pressable>
        <Text style={s.title}>Leaderboard</Text>
        <View style={{ width:40 }} />
      </View>

      <View style={s.tabs}>
        {TABS.map((t) => (
          <Pressable key={t} style={[s.tab, tab===t && s.tabActive]} onPress={() => setTab(t)}>
            <Text style={[s.tabText, tab===t && s.tabTextActive]}>{t}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Podium */}
        <View style={s.podium}>
          {[top3[1], top3[0], top3[2]].map((u, i) => {
            const realRank = i===0?2:i===1?1:3;
            const h = realRank===1?110:realRank===2?80:70;
            return (
              <View key={u.rank} style={[s.podiumCol, { marginTop: realRank===1?0:30 }]}>
                <Text style={s.podiumBadge}>{u.badge}</Text>
                <Avatar name={u.name} size={realRank===1?56:44} />
                <Text style={s.podiumName} numberOfLines={1}>{u.name}</Text>
                <Text style={s.podiumPts}>{u.points}</Text>
                <View style={[s.podiumBar, { height: h, backgroundColor: PODIUM_COLORS[realRank-1]+'30', borderColor: PODIUM_COLORS[realRank-1]+'60' }]}>
                  <Text style={[s.podiumRank, { color: PODIUM_COLORS[realRank-1] }]}>#{realRank}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Rest */}
        <View style={{ paddingHorizontal: 20 }}>
          {rest.map((u) => (
            <View key={u.rank} style={[s.row, u.isYou && s.rowYou]}>
              <Text style={[s.rankNum, u.isYou && { color: C.primary }]}>#{u.rank}</Text>
              <Avatar name={u.name} size={36} />
              <View style={{ flex:1, marginLeft:12 }}>
                <Text style={[s.rowName, u.isYou && { color: C.primary }]}>{u.name}{u.isYou ? ' (You)':''}</Text>
                <Text style={s.rowReports}>{u.reports} reports</Text>
              </View>
              <View style={s.ptsBadge}>
                <Star size={11} color={C.accent} weight="fill" />
                <Text style={s.pts}>{u.points}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:          { flex:1, backgroundColor:C.bg },
  header:        { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:20, paddingTop:56, paddingBottom:16 },
  backBtn:       { width:40, height:40, borderRadius:20, backgroundColor:C.bgCard, borderWidth:1, borderColor:C.border, alignItems:'center', justifyContent:'center' },
  title:         { fontFamily:'PlusJakartaSans_700Bold', fontSize:20, color:C.textPri },
  tabs:          { flexDirection:'row', marginHorizontal:20, backgroundColor:C.bgCard, borderRadius:12, borderWidth:1, borderColor:C.border, padding:4, marginBottom:24 },
  tab:           { flex:1, alignItems:'center', paddingVertical:10, borderRadius:10 },
  tabActive:     { backgroundColor:C.primary },
  tabText:       { fontFamily:'Inter_500Medium', fontSize:13, color:C.textSec },
  tabTextActive: { color:'#fff', fontFamily:'Inter_600SemiBold' },
  podium:        { flexDirection:'row', justifyContent:'center', alignItems:'flex-end', paddingHorizontal:20, marginBottom:28, gap:8 },
  podiumCol:     { flex:1, alignItems:'center' },
  podiumBadge:   { fontSize:22, marginBottom:6 },
  podiumName:    { fontFamily:'Inter_600SemiBold', fontSize:12, color:C.textPri, marginTop:6, marginBottom:2, textAlign:'center' },
  podiumPts:     { fontFamily:'JetBrainsMono_500Medium', fontSize:13, color:C.accent, marginBottom:8 },
  podiumBar:     { width:'100%', borderRadius:12, borderWidth:1, alignItems:'center', justifyContent:'flex-end', paddingBottom:10 },
  podiumRank:    { fontFamily:'PlusJakartaSans_800ExtraBold', fontSize:18 },
  row:           { flexDirection:'row', alignItems:'center', backgroundColor:C.bgCard, borderRadius:12, borderWidth:1, borderColor:C.border, padding:14, marginBottom:8 },
  rowYou:        { borderColor:C.primary, backgroundColor:'rgba(0,168,89,0.06)' },
  rankNum:       { fontFamily:'JetBrainsMono_500Medium', fontSize:14, color:C.textTer, width:32 },
  rowName:       { fontFamily:'Inter_600SemiBold', fontSize:14, color:C.textPri },
  rowReports:    { fontFamily:'Inter_400Regular', fontSize:12, color:C.textTer, marginTop:1 },
  ptsBadge:      { flexDirection:'row', alignItems:'center', gap:4, backgroundColor:C.accent+'18', borderRadius:20, paddingHorizontal:10, paddingVertical:5 },
  pts:           { fontFamily:'JetBrainsMono_500Medium', fontSize:13, color:C.accent },
});
