import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Phone, User, GoogleLogo } from 'phosphor-react-native';
import { useAuthStore } from '../../stores/authStore';
import { usePrefsStore } from '../../stores/prefsStore';

export default function OnboardingAuthScreen() {
  const router = useRouter();
  const { setGuest } = useAuthStore();
  const { finishOnboarding } = usePrefsStore();

  const handleGuest = () => {
    setGuest(true);
    finishOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <View style={s.root}>
      <View style={s.content}>
        <Text style={s.title}>Get Started</Text>
        <Text style={s.sub}>Join thousands of smart travelers.</Text>

        {/* Stats */}
        <View style={s.statsRow}>
          {[['50K+', 'Travelers'], ['98%', 'Accuracy'], ['4.8★', 'Rating']].map(([val, label]) => (
            <View key={label} style={s.stat}>
              <Text style={s.statVal}>{val}</Text>
              <Text style={s.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Auth options */}
        <Pressable style={s.googleBtn} onPress={() => router.push('/auth/login')}>
          <GoogleLogo size={20} color="#F0F4FF" weight="bold" />
          <Text style={s.googleText}>Continue with Google</Text>
        </Pressable>

        <Pressable style={s.phoneBtn} onPress={() => router.push('/auth/login')}>
          <Phone size={20} color="#F0F4FF" weight="fill" />
          <Text style={s.phoneText}>Continue with Phone</Text>
        </Pressable>

        <View style={s.divider}>
          <View style={s.dividerLine} />
          <Text style={s.dividerText}>or</Text>
          <View style={s.dividerLine} />
        </View>

        <Pressable style={s.guestBtn} onPress={handleGuest}>
          <User size={18} color="#8FA3C0" />
          <Text style={s.guestText}>Browse as Guest</Text>
        </Pressable>
      </View>

      <Text style={s.terms}>
        By continuing you agree to our{' '}
        <Text style={{ color: '#00A859' }}>Terms of Service</Text>
        {' '}and{' '}
        <Text style={{ color: '#00A859' }}>Privacy Policy</Text>
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  root:       { flex: 1, backgroundColor: '#080D17', paddingHorizontal: 24, paddingTop: 80, paddingBottom: 40 },
  content:    { flex: 1 },
  title:      { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 32, color: '#F0F4FF', marginBottom: 12 },
  sub:        { fontFamily: 'Inter_400Regular', fontSize: 16, color: '#8FA3C0', marginBottom: 40 },
  statsRow:   { flexDirection: 'row', backgroundColor: '#162035', borderRadius: 16, borderWidth: 1, borderColor: '#1E2E42', marginBottom: 40 },
  stat:       { flex: 1, alignItems: 'center', paddingVertical: 20 },
  statVal:    { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 20, color: '#00A859' },
  statLabel:  { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#8FA3C0', marginTop: 4 },
  googleBtn:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: '#162035', borderRadius: 16, borderWidth: 1, borderColor: '#1E2E42', paddingVertical: 18, marginBottom: 12 },
  googleText: { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#F0F4FF' },
  phoneBtn:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, backgroundColor: '#00A859', borderRadius: 16, paddingVertical: 18, marginBottom: 24 },
  phoneText:  { fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#fff' },
  divider:    { flexDirection: 'row', alignItems: 'center', marginBottom: 24 },
  dividerLine:{ flex: 1, height: 1, backgroundColor: '#1E2E42' },
  dividerText:{ fontFamily: 'Inter_400Regular', fontSize: 13, color: '#4E6480', paddingHorizontal: 16 },
  guestBtn:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 16, borderRadius: 16, borderWidth: 1, borderColor: '#1E2E42' },
  guestText:  { fontFamily: 'Inter_500Medium', fontSize: 15, color: '#8FA3C0' },
  terms:      { fontFamily: 'Inter_400Regular', fontSize: 12, color: '#4E6480', textAlign: 'center', lineHeight: 20 },
});
