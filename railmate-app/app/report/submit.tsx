import React, { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text, TextInput, Alert } from 'react-native';
import { ArrowLeft, Warning, Users, Gauge, Train, MapPin, Camera, CheckCircle } from 'phosphor-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

const C = { bg:'#080D17', bgCard:'#0F1929', bgElevated:'#162035', primary:'#00A859', accent:'#F5A623', danger:'#E8394B', info:'#4EA8E0', purple:'#A855F7', textPri:'#F0F4FF', textSec:'#8FA3C0', textTer:'#4E6480', border:'#1E2E42' };

const TYPES = [
  { key:'DELAY',    label:'Delay',    icon:Warning,  color:C.accent },
  { key:'CROWD',    label:'Crowding', icon:Users,    color:C.danger },
  { key:'PLATFORM', label:'Platform', icon:Train,    color:C.primary },
  { key:'GENERAL',  label:'General',  icon:Gauge,    color:C.info   },
];

export default function SubmitReportScreen() {
  const router = useRouter();
  const [type, setType] = useState<string|null>(null);
  const [notes, setNotes] = useState('');
  const [location, setLocation] = useState<string|null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [delay, setDelay] = useState('');

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') { Alert.alert('Permission needed','Allow location access to tag your report.'); return; }
    const loc = await Location.getCurrentPositionAsync({});
    const [place] = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
    setLocation(place?.city ?? place?.district ?? 'Current location');
  };

  const addPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({ quality:0.8, selectionLimit:3-photos.length });
    if (!result.canceled) setPhotos([...photos, ...result.assets.map((a) => a.uri)].slice(0,3));
  };

  const submit = () => {
    if (!type) { Alert.alert('Select report type'); return; }
    Alert.alert('Report Submitted!','Thank you for helping travelers.', [{ text:'Done', onPress:() => router.back() }]);
  };

  const selectedType = TYPES.find((t) => t.key === type);

  return (
    <View style={s.root}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()}><ArrowLeft size={20} color={C.textPri} weight="bold" /></Pressable>
        <Text style={s.title}>Submit Report</Text>
        <View style={{ width:40 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding:20, paddingBottom:120 }} showsVerticalScrollIndicator={false}>

        {/* Type selector */}
        <Text style={s.label}>Report Type</Text>
        <View style={s.typeGrid}>
          {TYPES.map(({ key, label, icon:Icon, color }) => {
            const active = type === key;
            return (
              <Pressable key={key} style={[s.typeCard, active && { backgroundColor:color+'18', borderColor:color }]} onPress={() => setType(key)}>
                <View style={[s.typeIcon, { backgroundColor: active ? color+'25' : C.bgElevated }]}>
                  <Icon size={22} color={active ? color : C.textTer} weight={active ? 'fill' : 'duotone'} />
                </View>
                <Text style={[s.typeLabel, active && { color }]}>{label}</Text>
                {active && <CheckCircle size={16} color={color} weight="fill" style={{ position:'absolute', top:10, right:10 }} />}
              </Pressable>
            );
          })}
        </View>

        {/* Delay minutes if DELAY type */}
        {type === 'DELAY' && (
          <View style={s.field}>
            <Text style={s.label}>Delay Duration (minutes)</Text>
            <TextInput
              style={s.input} value={delay} onChangeText={setDelay}
              placeholder="e.g. 25" placeholderTextColor={C.textTer}
              keyboardType="numeric"
            />
          </View>
        )}

        {/* Notes */}
        <View style={s.field}>
          <Text style={s.label}>Notes</Text>
          <TextInput
            style={[s.input, s.textarea]} value={notes} onChangeText={setNotes}
            placeholder="Describe the situation in detail..." placeholderTextColor={C.textTer}
            multiline numberOfLines={4} textAlignVertical="top"
          />
        </View>

        {/* Location */}
        <Pressable style={s.locationRow} onPress={getLocation}>
          <MapPin size={18} color={location ? C.primary : C.textSec} weight={location ? 'fill' : 'regular'} />
          <Text style={[s.locationText, location && { color:C.primary }]}>{location ?? 'Tag current location'}</Text>
          {location && <CheckCircle size={16} color={C.primary} weight="fill" />}
        </Pressable>

        {/* Photos */}
        <Pressable style={s.photoBtn} onPress={addPhoto} disabled={photos.length >= 3}>
          <Camera size={18} color={C.primary} />
          <Text style={s.photoBtnText}>Add Photo {photos.length > 0 ? `(${photos.length}/3)` : '(optional)'}</Text>
        </Pressable>
      </ScrollView>

      <View style={s.footer}>
        <Pressable style={[s.submitBtn, !type && { opacity:0.5 }]} onPress={submit} disabled={!type}>
          <Text style={s.submitText}>Submit Report</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root:        { flex:1, backgroundColor:C.bg },
  header:      { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:20, paddingTop:56, paddingBottom:16 },
  backBtn:     { width:40, height:40, borderRadius:20, backgroundColor:C.bgCard, borderWidth:1, borderColor:C.border, alignItems:'center', justifyContent:'center' },
  title:       { fontFamily:'PlusJakartaSans_700Bold', fontSize:20, color:C.textPri },
  label:       { fontFamily:'Inter_500Medium', fontSize:13, color:C.textSec, marginBottom:10, marginTop:4 },
  typeGrid:    { flexDirection:'row', flexWrap:'wrap', gap:10, marginBottom:20 },
  typeCard:    { width:'47%', flexGrow:1, backgroundColor:C.bgCard, borderRadius:14, borderWidth:1.5, borderColor:C.border, padding:16, alignItems:'center', gap:10 },
  typeIcon:    { width:48, height:48, borderRadius:14, alignItems:'center', justifyContent:'center' },
  typeLabel:   { fontFamily:'Inter_600SemiBold', fontSize:14, color:C.textSec },
  field:       { marginBottom:16 },
  input:       { backgroundColor:C.bgCard, borderRadius:12, borderWidth:1, borderColor:C.border, padding:14, fontFamily:'Inter_400Regular', fontSize:14, color:C.textPri },
  textarea:    { minHeight:100, paddingTop:14 },
  locationRow: { flexDirection:'row', alignItems:'center', gap:12, backgroundColor:C.bgCard, borderRadius:12, borderWidth:1, borderColor:C.border, padding:16, marginBottom:14 },
  locationText:{ flex:1, fontFamily:'Inter_400Regular', fontSize:14, color:C.textSec },
  photoBtn:    { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:10, borderWidth:1.5, borderColor:C.primary, borderStyle:'dashed', borderRadius:12, paddingVertical:14, marginBottom:14 },
  photoBtnText:{ fontFamily:'Inter_500Medium', fontSize:14, color:C.primary },
  footer:      { position:'absolute', bottom:0, left:0, right:0, backgroundColor:C.bg, padding:20, paddingBottom:36, borderTopWidth:1, borderTopColor:C.border },
  submitBtn:   { backgroundColor:C.primary, borderRadius:14, paddingVertical:16, alignItems:'center' },
  submitText:  { fontFamily:'Inter_600SemiBold', fontSize:16, color:'#fff' },
});
