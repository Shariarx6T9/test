import React from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text } from 'react-native';
import { ArrowLeft, Shield, Star, Lightning, Crown, CheckCircle, Clock } from 'phosphor-react-native';
import { useRouter } from 'expo-router';

const C = { bg:'#080D17', bgCard:'#0F1929', bgElevated:'#162035', primary:'#00A859', accent:'#F5A623', textPri:'#F0F4FF', textSec:'#8FA3C0', textTer:'#4E6480', border:'#1E2E42' };

const BADGES = [
  { id:'1', name:'Contributor',     desc:'Submit your first report',         icon:Shield,  color:'#C87941', earned:true,  progress:100, target:1   },
  { id:'2', name:'Verified',        desc:'Get 10 reports confirmed',         icon:CheckCircle, color:'#8FA3C0', earned:true,  progress:100, target:10  },
  { id:'3', name:'Reporter',        desc:'Submit 50 verified reports',       icon:Star,    color:'#F5A623', earned:false, progress:62,  target:50  },
  { id:'4', name:'Elite Reporter',  desc:'Submit 100 verified reports',      icon:Crown,   color:'#A855F7', earned:false, progress:31,  target:100 },
  { id:'5', name:'Trusted Reporter',desc:'Maintain 4.5+ trust score',        icon:Shield,  color:'#00A859', earned:true,  progress:100, target:1   },
  { id:'6', name:'Delay Master',    desc:'Report 20 confirmed delays',       icon:Clock,   color:'#F5A623', earned:false, progress:75,  target:20  },
  { id:'7', name:'Speed Reporter',  desc:'First to report on 5 incidents',   icon:Lightning,color:'#4EA8E0',earned:false, progress:40,  target:5   },
];

export default function BadgesScreen() {
  const router = useRouter();
  const earned = BADGES.filter((b) => b.earned);
  const inProgress = BADGES.filter((b) => !b.earned);

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()}><ArrowLeft size={20} color={C.textPri} weight="bold" /></Pressable>
        <Text style={s.title}>Badges & Tiers</Text>
        <View style={{ width:40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding:20, paddingBottom:40 }} showsVerticalScrollIndicator={false}>

        {/* Stats row */}
        <View style={s.statsRow}>
          <View style={s.stat}><Text style={s.statVal}>{earned.length}</Text><Text style={s.statLabel}>Earned</Text></View>
          <View style={s.statDivider} />
          <View style={s.stat}><Text style={s.statVal}>{inProgress.length}</Text><Text style={s.statLabel}>In Progress</Text></View>
          <View style={s.statDivider} />
          <View style={s.stat}><Text style={s.statVal}>{BADGES.length}</Text><Text style={s.statLabel}>Total</Text></View>
        </View>

        {/* Earned */}
        <Text style={s.sectionTitle}>Your Badges</Text>
        <View style={s.grid}>
          {earned.map((b) => (
            <View key={b.id} style={[s.badgeCard, s.earnedCard]}>
              <View style={[s.badgeIcon, { backgroundColor: b.color+'20' }]}>
                <b.icon size={32} color={b.color} weight="fill" />
              </View>
              <Text style={s.badgeName}>{b.name}</Text>
              <Text style={s.badgeDesc}>{b.desc}</Text>
              <View style={s.earnedTag}>
                <CheckCircle size={12} color={C.primary} weight="fill" />
                <Text style={s.earnedText}>Earned</Text>
              </View>
            </View>
          ))}
        </View>

        {/* In Progress */}
        <Text style={[s.sectionTitle, { marginTop:28 }]}>In Progress</Text>
        {inProgress.map((b) => (
          <View key={b.id} style={s.progressCard}>
            <View style={[s.progressIcon, { backgroundColor: b.color+'18' }]}>
              <b.icon size={24} color={b.color+'80'} weight="duotone" />
            </View>
            <View style={{ flex:1, marginLeft:14 }}>
              <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:6 }}>
                <Text style={s.progressName}>{b.name}</Text>
                <Text style={[s.progressPct, { color: b.color }]}>{b.progress}%</Text>
              </View>
              <Text style={s.progressDesc}>{b.desc}</Text>
              <View style={s.bar}>
                <View style={[s.barFill, { width:`${b.progress}%` as any, backgroundColor: b.color }]} />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:         { flex:1, backgroundColor:C.bg },
  header:       { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:20, paddingTop:56, paddingBottom:16 },
  backBtn:      { width:40, height:40, borderRadius:20, backgroundColor:C.bgCard, borderWidth:1, borderColor:C.border, alignItems:'center', justifyContent:'center' },
  title:        { fontFamily:'PlusJakartaSans_700Bold', fontSize:20, color:C.textPri },
  statsRow:     { flexDirection:'row', backgroundColor:C.bgCard, borderRadius:16, borderWidth:1, borderColor:C.border, marginBottom:28 },
  stat:         { flex:1, alignItems:'center', paddingVertical:20 },
  statVal:      { fontFamily:'PlusJakartaSans_800ExtraBold', fontSize:24, color:C.primary },
  statLabel:    { fontFamily:'Inter_400Regular', fontSize:12, color:C.textSec, marginTop:4 },
  statDivider:  { width:1, backgroundColor:C.border, marginVertical:16 },
  sectionTitle: { fontFamily:'Inter_600SemiBold', fontSize:18, color:C.textPri, marginBottom:16 },
  grid:         { flexDirection:'row', flexWrap:'wrap', gap:12 },
  badgeCard:    { width:'47%', flexGrow:1, alignItems:'center', borderRadius:16, borderWidth:1, borderColor:C.border, padding:18, gap:8 },
  earnedCard:   { backgroundColor:C.bgCard },
  badgeIcon:    { width:64, height:64, borderRadius:20, alignItems:'center', justifyContent:'center' },
  badgeName:    { fontFamily:'Inter_600SemiBold', fontSize:14, color:C.textPri, textAlign:'center' },
  badgeDesc:    { fontFamily:'Inter_400Regular', fontSize:11, color:C.textSec, textAlign:'center', lineHeight:16 },
  earnedTag:    { flexDirection:'row', alignItems:'center', gap:4, backgroundColor:'rgba(0,168,89,0.12)', borderRadius:20, paddingHorizontal:10, paddingVertical:4 },
  earnedText:   { fontFamily:'Inter_500Medium', fontSize:11, color:C.primary },
  progressCard: { flexDirection:'row', alignItems:'center', backgroundColor:C.bgCard, borderRadius:14, borderWidth:1, borderColor:C.border, padding:16, marginBottom:10 },
  progressIcon: { width:48, height:48, borderRadius:14, alignItems:'center', justifyContent:'center' },
  progressName: { fontFamily:'Inter_600SemiBold', fontSize:14, color:C.textPri },
  progressPct:  { fontFamily:'JetBrainsMono_500Medium', fontSize:13 },
  progressDesc: { fontFamily:'Inter_400Regular', fontSize:12, color:C.textSec, marginBottom:10 },
  bar:          { height:6, backgroundColor:C.border, borderRadius:3, overflow:'hidden' },
  barFill:      { height:'100%', borderRadius:3 },
});
