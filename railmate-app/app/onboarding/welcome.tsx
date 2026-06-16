import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Train } from 'phosphor-react-native';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';

// On-image text — always light regardless of app theme since the hero
// always sits on a dark gradient overlay.
const OI = { text: '#F0F4FF', sub: '#8FA3C0', tertiary: '#4E6480' };
const BG = 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=800&q=80&auto=format&fit=crop';
const PRIMARY_GREEN = '#00A859';

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const s = useMemo(() => createStyles(colors), [colors]);

  return (
    <View style={s.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground source={{ uri: BG }} style={s.bg} imageStyle={{ opacity: 0.6 }}>
        <View style={s.overlay} />

        {/* Logo */}
        <View style={[s.logoWrap, { paddingTop: insets.top + 16 }]}>
          <View style={s.logoBg}><Train size={40} color={OI.text} weight="fill" /></View>
          <View style={{ flexDirection: 'row', marginTop: 12 }}>
            <Text style={[s.brand, { color: OI.text }]}>Rail</Text>
            <Text style={[s.brand, { color: PRIMARY_GREEN }]}>Mate</Text>
          </View>
          <Text style={s.brandSub}>Bangladesh</Text>
        </View>

        {/* Hero text */}
        <View style={s.hero}>
          <Text style={s.headline}>Travel Smart.{'\n'}Travel RailMate.</Text>
          <Text style={s.sub}>Your all-in-one railway companion{'\n'}for Bangladesh.</Text>
        </View>

        {/* CTAs */}
        <View style={[s.ctas, { paddingBottom: insets.bottom + 24 }]}>
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

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  root:            { flex: 1, backgroundColor: colors['bg-base'] },
  bg:              { flex: 1, justifyContent: 'space-between', paddingHorizontal: 24 },
  overlay:         { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8,13,23,0.6)' },
  logoWrap:        { alignItems: 'center' },
  logoBg:          { width: 72, height: 72, borderRadius: 20, backgroundColor: 'rgba(0,168,89,0.25)', borderWidth: 1, borderColor: 'rgba(0,168,89,0.4)', alignItems: 'center', justifyContent: 'center' },
  brand:           { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 28 },
  brandSub:        { fontFamily: 'Inter_400Regular', fontSize: 13, color: OI.tertiary, marginTop: 2 },
  hero:            { alignItems: 'center' },
  headline:        { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 36, color: OI.text, textAlign: 'center', lineHeight: 44, letterSpacing: -0.5 },
  sub:             { fontFamily: 'Inter_400Regular', fontSize: 16, color: OI.sub, textAlign: 'center', marginTop: 14, lineHeight: 26 },
  ctas:            { gap: 12 },
  primaryBtn:      { backgroundColor: PRIMARY_GREEN, borderRadius: 16, paddingVertical: 18, alignItems: 'center' },
  primaryBtnText:  { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: '#fff' },
  secondaryBtn:    { backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 16, paddingVertical: 18, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)' },
  secondaryBtnText:{ fontFamily: 'NotoSansBengali_600SemiBold', fontSize: 16, color: OI.text },
});
