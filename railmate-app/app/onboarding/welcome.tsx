import React from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground, StatusBar, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Train } from 'phosphor-react-native';

const { width, height } = Dimensions.get('window');
const BG = 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80&auto=format&fit=crop';

export default function WelcomeScreen() {
  const router = useRouter();
  return (
    <View style={s.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground source={{ uri: BG }} style={s.bg} imageStyle={{ opacity: 0.6 }}>
        <View style={s.overlay} />

        {/* Logo */}
        <View style={s.logoWrap}>
          <View style={s.logoBg}><Train size={40} color="#fff" weight="fill" /></View>
          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            <Text style={[s.brand, { color: '#F0F4FF' }]}>Rail</Text>
            <Text style={[s.brand, { color: '#00A859' }]}>Mate</Text>
          </View>
          <Text style={s.brandSub}>Bangladesh</Text>
        </View>

        {/* Hero text */}
        <View style={s.hero}>
          <Text style={s.headline}>Travel Smart.{'\n'}Travel RailMate.</Text>
          <Text style={s.sub}>Your all-in-one railway companion{'\n'}for Bangladesh.</Text>
        </View>

        {/* CTAs */}
        <View style={s.ctas}>
          <Pressable style={s.primaryBtn} onPress={() => router.push('/onboarding/features')}>
            <Text style={s.primaryBtnText}>Get Started</Text>
          </Pressable>
          <Pressable style={s.secondaryBtn} onPress={() => router.push('/onboarding/features')}>
            <Text style={s.secondaryBtnText}>বাংলায় চালু করুন</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </View>
  );
}

const s = StyleSheet.create({
  root:           { flex: 1, backgroundColor: '#080D17' },
  bg:             { flex: 1, justifyContent: 'space-between', paddingTop: 80, paddingBottom: 56, paddingHorizontal: 24 },
  overlay:        { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8,13,23,0.6)' },
  logoWrap:       { alignItems: 'center' },
  logoBg:         { width: 72, height: 72, borderRadius: 20, backgroundColor: 'rgba(0,168,89,0.25)', borderWidth: 1, borderColor: 'rgba(0,168,89,0.4)', alignItems: 'center', justifyContent: 'center' },
  brand:          { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 28 },
  brandSub:       { fontFamily: 'Inter_400Regular', fontSize: 13, color: '#4E6480', marginTop: 2 },
  hero:           { alignItems: 'center' },
  headline:       { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 36, color: '#F0F4FF', textAlign: 'center', lineHeight: 44, letterSpacing: -0.5 },
  sub:            { fontFamily: 'Inter_400Regular', fontSize: 16, color: '#8FA3C0', textAlign: 'center', marginTop: 14, lineHeight: 26 },
  ctas:           { gap: 12 },
  primaryBtn:     { backgroundColor: '#00A859', borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  primaryBtnText: { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: '#fff' },
  secondaryBtn:   { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16, paddingVertical: 18, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  secondaryBtnText:{ fontFamily: 'NotoSansBengali_600SemiBold', fontSize: 16, color: '#F0F4FF' },
});
