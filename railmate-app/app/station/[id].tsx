import React from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text, Linking } from 'react-native';
import { ArrowLeft, MapPin, Train, WifiHigh, CoffeeBean, Toilet, Wheelchair, CaretRight } from 'phosphor-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const C = { bg:'#080D17', bgCard:'#0F1929', bgElevated:'#162035', primary:'#00A859', accent:'#F5A623', textPri:'#F0F4FF', textSec:'#8FA3C0', textTer:'#4E6480', border:'#1E2E42' };

const STATION_DATA: Record<string, any> = {
  dhaka: { name:'Dhaka', namebn:'ঢাকা', code:'DAK', zone:'Dhaka', platforms:8, facilities:['WiFi','Food Court','Restroom','Accessibility'], trains:['Subarna Express','Turna Express','Mahanagar Exp','Parabat Express'] },
  chattogram: { name:'Chattogram', namebn:'চট্টগ্রাম', code:'CTG', zone:'Chattogram', platforms:6, facilities:['Food Court','Restroom','Accessibility'], trains:['Subarna Express','Sonar Bangla','Mahanagar Godhuli'] },
};

const FACILITY_ICONS: Record<string, any> = { 'WiFi':WifiHigh, 'Food Court':CoffeeBean, 'Restroom':Toilet, 'Accessibility':Wheelchair };

export default function StationDetailScreen() {
  const { id } = useLocalSearchParams<{ id:string }>();
  const router = useRouter();
  const station = STATION_DATA[id ?? ''] ?? { name:'Station', namebn:'স্টেশন', code:'???', zone:'N/A', platforms:0, facilities:[], trains:[] };

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()}><ArrowLeft size={20} color={C.textPri} weight="bold" /></Pressable>
        <View>
          <Text style={s.title}>{station.name}</Text>
          <Text style={s.titlebn}>{station.namebn}</Text>
        </View>
        <View style={s.codePill}><Text style={s.code}>{station.code}</Text></View>
      </View>

      <ScrollView contentContainerStyle={{ padding:20, paddingBottom:40 }} showsVerticalScrollIndicator={false}>

        {/* Meta */}
        <View style={s.metaRow}>
          <View style={s.metaCard}><Text style={s.metaVal}>{station.zone}</Text><Text style={s.metaLabel}>Zone</Text></View>
          <View style={s.metaCard}><Text style={s.metaVal}>{station.platforms}</Text><Text style={s.metaLabel}>Platforms</Text></View>
          <View style={s.metaCard}><Text style={s.metaVal}>{station.trains.length}+</Text><Text style={s.metaLabel}>Daily Trains</Text></View>
        </View>

        {/* Facilities */}
        <Text style={s.sectionTitle}>Facilities</Text>
        <View style={s.facilitiesRow}>
          {station.facilities.map((f: string) => {
            const Icon = FACILITY_ICONS[f] ?? MapPin;
            return (
              <View key={f} style={s.facilityChip}>
                <Icon size={16} color={C.primary} weight="duotone" />
                <Text style={s.facilityText}>{f}</Text>
              </View>
            );
          })}
        </View>

        {/* Popular Trains */}
        <Text style={s.sectionTitle}>Popular Trains</Text>
        {station.trains.map((t: string) => (
          <View key={t} style={s.trainRow}>
            <Train size={16} color={C.primary} weight="fill" />
            <Text style={s.trainName}>{t}</Text>
            <CaretRight size={16} color={C.textTer} />
          </View>
        ))}

        {/* Directions */}
        <Pressable style={s.directionsBtn} onPress={() => Linking.openURL(`https://maps.google.com/?q=${station.name}+railway+station+bangladesh`)}>
          <MapPin size={18} color="#fff" weight="fill" />
          <Text style={s.directionsText}>Get Directions</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  root:          { flex:1, backgroundColor:C.bg },
  header:        { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:20, paddingTop:56, paddingBottom:16 },
  backBtn:       { width:40, height:40, borderRadius:20, backgroundColor:C.bgCard, borderWidth:1, borderColor:C.border, alignItems:'center', justifyContent:'center' },
  title:         { fontFamily:'PlusJakartaSans_700Bold', fontSize:20, color:C.textPri },
  titlebn:       { fontFamily:'NotoSansBengali_400Regular', fontSize:14, color:C.textSec, marginTop:2 },
  codePill:      { backgroundColor:C.primary+'20', borderRadius:8, paddingHorizontal:10, paddingVertical:6, borderWidth:1, borderColor:C.primary+'40' },
  code:          { fontFamily:'JetBrainsMono_500Medium', fontSize:14, color:C.primary },
  metaRow:       { flexDirection:'row', gap:10, marginBottom:24 },
  metaCard:      { flex:1, backgroundColor:C.bgCard, borderRadius:14, borderWidth:1, borderColor:C.border, padding:14, alignItems:'center' },
  metaVal:       { fontFamily:'PlusJakartaSans_700Bold', fontSize:18, color:C.primary },
  metaLabel:     { fontFamily:'Inter_400Regular', fontSize:11, color:C.textSec, marginTop:4 },
  sectionTitle:  { fontFamily:'Inter_600SemiBold', fontSize:18, color:C.textPri, marginBottom:14 },
  facilitiesRow: { flexDirection:'row', flexWrap:'wrap', gap:10, marginBottom:28 },
  facilityChip:  { flexDirection:'row', alignItems:'center', gap:8, backgroundColor:C.bgCard, borderRadius:10, borderWidth:1, borderColor:C.border, paddingHorizontal:14, paddingVertical:10 },
  facilityText:  { fontFamily:'Inter_500Medium', fontSize:13, color:C.textSec },
  trainRow:      { flexDirection:'row', alignItems:'center', gap:12, backgroundColor:C.bgCard, borderRadius:12, borderWidth:1, borderColor:C.border, paddingHorizontal:16, paddingVertical:14, marginBottom:8 },
  trainName:     { flex:1, fontFamily:'Inter_500Medium', fontSize:14, color:C.textPri },
  directionsBtn: { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:10, backgroundColor:C.primary, borderRadius:14, paddingVertical:16, marginTop:24 },
  directionsText:{ fontFamily:'Inter_600SemiBold', fontSize:16, color:'#fff' },
});
