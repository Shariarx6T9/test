import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { BellSimple, MapPin, CheckCircle, Circle } from 'phosphor-react-native';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';

export default function PermissionsScreen() {
  const router = useRouter();
  const [notifGranted, setNotifGranted] = useState(false);
  const [locationGranted, setLocationGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    setNotifGranted(status === 'granted');
  };

  const handleContinue = async () => {
    setLoading(true);
    if (!notifGranted) await handleNotifications();
    setLoading(false);
    router.push('/onboarding/auth');
  };

  return (
    <View style={s.root}>
      <View style={s.content}>
        <View style={s.topIcon}>
          <BellSimple size={48} color="#00A859" weight="duotone" />
        </View>
        <Text style={s.title}>Stay Informed</Text>
        <Text style={s.sub}>Enable these to get the most out of RailMate.</Text>

        {/* Notification */}
        <Pressable style={s.permCard} onPress={handleNotifications}>
          <View style={[s.permIcon, { backgroundColor: 'rgba(0,168,89,0.12)' }]}>
            <BellSimple size={24} color="#00A859" weight="duotone" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.permTitle}>Journey Alerts & Delays</Text>
            <Text style={s.permDesc}>Get notified before departure and when delays are reported.</Text>
          </View>
          {notifGranted
            ? <CheckCircle size={24} color="#00A859" weight="fill" />
            : <Circle size={24} color="#2A3F57" />}
        </Pressable>

        {/* Location */}
        <Pressable style={s.permCard} onPress={async () => {
          const { status } = await Location.requestForegroundPermissionsAsync();
          setLocationGranted(status === 'granted');
        }}>
          <View style={[s.permIcon, { backgroundColor: 'rgba(78,168,224,0.12)' }]}>
            <MapPin size={24} color="#4EA8E0" weight="duotone" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.permTitle}>Nearby Stations</Text>
            <Text style={s.permDesc}>Optional — find stations near you instantly.</Text>
          </View>
          {locationGranted
            ? <CheckCircle size={24} color="#00A859" weight="fill" />
            : <View style={s.optionalBadge}><Text style={s.optionalText}>Optional</Text></View>}
        </Pressable>
      </View>

      <View style={s.footer}>
        <Pressable style={s.allowBtn} onPress={handleContinue}>
          <Text style={s.allowText}>{notifGranted ? 'Continue' : 'Allow Notifications'}</Text>
        </Pressable>
        <Pressable style={s.laterBtn} onPress={() => router.push('/onboarding/auth')}>
          <Text style={s.laterText}>Maybe Later</Text>
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root:         { flex: 1, backgroundColor: '#080D17', padding: 24 },
  content:      { flex: 1, paddingTop: 80 },
  topIcon:      { width: 80, height: 80, borderRadius: 24, backgroundColor: 'rgba(0,168,89,0.12)', alignItems: 'center', justifyContent: 'center', marginBottom: 32 },
  title:        { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 28, color: '#F0F4FF', marginBottom: 12 },
  sub:          { fontFamily: 'Inter_400Regular', fontSize: 16, color: '#8FA3C0', marginBottom: 40, lineHeight: 26 },
  permCard:     { flexDirection: 'row', alignItems: 'center', backgroundColor: '#162035', borderRadius: 16, borderWidth: 1, borderColor: '#1E2E42', padding: 18, marginBottom: 14, gap: 16 },
  permIcon:     { width: 48, height: 48, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  permTitle:    { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#F0F4FF', marginBottom: 4 },
  permDesc:     { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#8FA3C0', lineHeight: 20 },
  optionalBadge:{ backgroundColor: '#1E2E42', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  optionalText: { fontFamily: 'Inter_400Regular', fontSize: 11, color: '#4E6480' },
  footer:       { paddingBottom: 40, gap: 12 },
  allowBtn:     { backgroundColor: '#00A859', borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  allowText:    { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: '#fff' },
  laterBtn:     { alignItems: 'center', paddingVertical: 14 },
  laterText:    { fontFamily: 'Inter_500Medium', fontSize: 15, color: '#4E6480' },
});
