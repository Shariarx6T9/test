import React, { useState } from 'react';
import {
  View, ScrollView, Pressable, StyleSheet, Text, Image, Alert,
  ActivityIndicator, FlatList,
} from 'react-native';
import {
  ClipboardText, Plus, Camera, MapPin, X, CheckCircle, Warning,
} from 'phosphor-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useTranslation } from '../../i18n';
import { useCommunityReports } from '../../hooks/useCommunityReports';

const C = {
  bg: '#080D17', bgCard: '#0F1929', bgElevated: '#162035',
  primary: '#00A859', accent: '#F5A623', danger: '#E8394B', info: '#4EA8E0',
  textPri: '#F0F4FF', textSec: '#8FA3C0', textTer: '#4E6480',
  border: '#1E2E42',
};

const REPORT_TYPES = [
  { key: 'DELAY',    label: 'Delay',    color: C.accent },
  { key: 'CROWD',    label: 'Crowding', color: C.danger },
  { key: 'GENERAL',  label: 'General',  color: C.info   },
  { key: 'ACCIDENT', label: 'Incident', color: '#A855F7'},
];

function ReportsScreenInner() {
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';
  const { data: reports, isLoading } = useCommunityReports();

  const [showCompose, setShowCompose] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [locationLabel, setLocationLabel] = useState<string | null>(null);
  const [fetchingLocation, setFetchingLocation] = useState(false);

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo access to upload report photos.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      selectionLimit: 3,
      quality: 0.8,
    });
    if (!result.canceled) {
      setPhotos((prev) => [...prev, ...result.assets.map((a) => a.uri)].slice(0, 3));
    }
  };

  const handleTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow camera access to take report photos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8 });
    if (!result.canceled) {
      setPhotos((prev) => [...prev, result.assets[0].uri].slice(0, 3));
    }
  };

  const handleGetLocation = async () => {
    setFetchingLocation(true);
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow location access to tag your report.');
      setFetchingLocation(false);
      return;
    }
    try {
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const [place] = await Location.reverseGeocodeAsync({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      setLocationLabel(place?.city || place?.district || 'Current location');
    } catch {
      setLocationLabel('Location found');
    }
    setFetchingLocation(false);
  };

  return (
    <View style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <Text style={s.headerTitle}>Community Reports</Text>
          <Text style={s.headerSub}>Real-time traveler updates</Text>
        </View>
        <Pressable style={s.addBtn} onPress={() => setShowCompose(true)}>
          <Plus size={20} color="#fff" weight="bold" />
        </Pressable>
      </View>

      {/* Report type filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>
        {REPORT_TYPES.map((rt) => (
          <Pressable
            key={rt.key}
            style={[s.filterChip, selectedType === rt.key && { backgroundColor: rt.color + '25', borderColor: rt.color }]}
            onPress={() => setSelectedType(selectedType === rt.key ? null : rt.key)}
          >
            <Text style={[s.filterChipText, selectedType === rt.key && { color: rt.color }]}>{rt.label}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Reports list */}
      {isLoading ? (
        <View style={s.center}>
          <ActivityIndicator color={C.primary} />
        </View>
      ) : reports && reports.length > 0 ? (
        <FlatList
          data={reports.filter((r: any) => !selectedType || r.report_type === selectedType)}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }: any) => (
            <View style={s.reportCard}>
              <View style={[s.reportAccent, { backgroundColor: REPORT_TYPES.find((t) => t.key === item.report_type)?.color ?? C.primary }]} />
              <View style={{ flex: 1 }}>
                <Text style={s.reportType}>{item.report_type}</Text>
                <Text style={s.reportBody}>{item.description}</Text>
                <Text style={s.reportMeta}>{new Date(item.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={<View style={s.center}><Text style={s.emptyText}>No reports for this type</Text></View>}
        />
      ) : (
        <View style={s.center}>
          <ClipboardText size={48} color={C.textTer} weight="thin" />
          <Text style={s.emptyTitle}>No reports yet</Text>
          <Text style={s.emptyText}>Be the first to report a delay or issue</Text>
          <Pressable style={s.emptyBtn} onPress={() => setShowCompose(true)}>
            <Text style={s.emptyBtnText}>+ Submit Report</Text>
          </Pressable>
        </View>
      )}

      {/* Compose sheet */}
      {showCompose && (
        <View style={s.sheet}>
          <View style={s.sheetHandle} />
          <View style={s.sheetHeader}>
            <Text style={s.sheetTitle}>Submit Report</Text>
            <Pressable onPress={() => { setShowCompose(false); setPhotos([]); setLocationLabel(null); }}>
              <X size={22} color={C.textSec} />
            </Pressable>
          </View>

          {/* Type selector */}
          <View style={s.typeRow}>
            {REPORT_TYPES.map((rt) => {
              const active = selectedType === rt.key;
              return (
                <Pressable
                  key={rt.key}
                  onPress={() => setSelectedType(rt.key)}
                  style={[s.typeChip, { borderColor: rt.color }, active && { backgroundColor: rt.color }]}
                >
                  <Text style={[s.typeChipText, { color: active ? '#fff' : rt.color }]}>{rt.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {/* Photo row */}
          <View style={s.photoRow}>
            {photos.map((uri, i) => (
              <View key={i} style={s.photoThumb}>
                <Image source={{ uri }} style={{ width: '100%', height: '100%', borderRadius: 10 }} />
                <Pressable style={s.photoRemove} onPress={() => setPhotos(photos.filter((_, idx) => idx !== i))}>
                  <X size={12} color="#fff" />
                </Pressable>
              </View>
            ))}
            {photos.length < 3 && (
              <View style={{ gap: 8 }}>
                <Pressable style={s.photoAdd} onPress={handlePickPhoto}>
                  <Camera size={20} color={C.primary} />
                  <Text style={s.photoAddText}>Gallery</Text>
                </Pressable>
                <Pressable style={s.photoAdd} onPress={handleTakePhoto}>
                  <Camera size={20} color={C.accent} />
                  <Text style={[s.photoAddText, { color: C.accent }]}>Camera</Text>
                </Pressable>
              </View>
            )}
          </View>

          {/* Location */}
          <Pressable style={s.locationRow} onPress={handleGetLocation} disabled={fetchingLocation}>
            {fetchingLocation
              ? <ActivityIndicator color={C.primary} size="small" />
              : <MapPin size={18} color={locationLabel ? C.primary : C.textSec} weight={locationLabel ? 'fill' : 'regular'} />}
            <Text style={[s.locationText, locationLabel && { color: C.primary }]}>
              {locationLabel ?? 'Tag current location'}
            </Text>
            {locationLabel && <CheckCircle size={16} color={C.primary} weight="fill" />}
          </Pressable>

          <Pressable
            style={[s.submitBtn, !selectedType && { opacity: 0.5 }]}
            onPress={() => {
              if (!selectedType) return;
              Alert.alert('Report submitted', 'Thank you for keeping others informed!');
              setShowCompose(false);
              setPhotos([]);
              setLocationLabel(null);
              setSelectedType(null);
            }}
            disabled={!selectedType}
          >
            <Text style={s.submitBtnText}>Submit Report</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

export default function ReportsScreen() {
  return <ErrorBoundary name="Reports"><ReportsScreenInner /></ErrorBoundary>;
}

const s = StyleSheet.create({
  root:          { flex: 1, backgroundColor: C.bg },
  header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16 },
  headerTitle:   { fontFamily: 'Inter_700Bold', fontSize: 28, color: C.textPri },
  headerSub:     { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSec, marginTop: 2 },
  addBtn:        { width: 44, height: 44, borderRadius: 22, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' },
  filterRow:     { paddingHorizontal: 20, gap: 8, paddingBottom: 16 },
  filterChip:    { borderWidth: 1, borderColor: C.border, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7 },
  filterChipText:{ fontFamily: 'Inter_500Medium', fontSize: 13, color: C.textSec },
  center:        { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10, padding: 24 },
  emptyTitle:    { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: C.textPri },
  emptyText:     { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSec, textAlign: 'center' },
  emptyBtn:      { marginTop: 8, backgroundColor: C.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 },
  emptyBtnText:  { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: '#fff' },
  reportCard:    { backgroundColor: C.bgCard, borderRadius: 14, borderWidth: 1, borderColor: C.border, flexDirection: 'row', marginBottom: 12, overflow: 'hidden' },
  reportAccent:  { width: 4 },
  reportType:    { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: C.accent, textTransform: 'uppercase', letterSpacing: 0.5, padding: 14, paddingBottom: 4 },
  reportBody:    { fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textPri, paddingHorizontal: 14, paddingBottom: 6 },
  reportMeta:    { fontFamily: 'Inter_400Regular', fontSize: 12, color: C.textTer, paddingHorizontal: 14, paddingBottom: 14 },
  sheet:         { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: C.bgCard, borderTopLeftRadius: 24, borderTopRightRadius: 24, borderTopWidth: 1, borderColor: C.border, padding: 20, paddingBottom: 40 },
  sheetHandle:   { width: 40, height: 4, backgroundColor: C.border, borderRadius: 2, alignSelf: 'center', marginBottom: 20 },
  sheetHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  sheetTitle:    { fontFamily: 'Inter_600SemiBold', fontSize: 18, color: C.textPri },
  typeRow:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 },
  typeChip:      { borderWidth: 1.5, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 8 },
  typeChipText:  { fontFamily: 'Inter_500Medium', fontSize: 13 },
  photoRow:      { flexDirection: 'row', gap: 10, marginBottom: 20 },
  photoThumb:    { width: 80, height: 80, borderRadius: 10, backgroundColor: C.bgElevated, overflow: 'visible' },
  photoRemove:   { position: 'absolute', top: -6, right: -6, width: 20, height: 20, borderRadius: 10, backgroundColor: C.danger, alignItems: 'center', justifyContent: 'center' },
  photoAdd:      { width: 80, height: 36, borderRadius: 10, borderWidth: 1, borderColor: C.border, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4 },
  photoAddText:  { fontFamily: 'Inter_400Regular', fontSize: 11, color: C.primary },
  locationRow:   { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.bgElevated, borderRadius: 12, padding: 14, marginBottom: 20 },
  locationText:  { flex: 1, fontFamily: 'Inter_400Regular', fontSize: 14, color: C.textSec },
  submitBtn:     { backgroundColor: C.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  submitBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#fff' },
});
