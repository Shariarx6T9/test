import React, { useMemo } from 'react';
import {
  View, Text, StyleSheet, Pressable, ImageBackground, StatusBar, Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePrefsStore } from '../../stores/prefsStore';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';

const { width } = Dimensions.get('window');

// On-image text — always white since it sits on a dark gradient overlay.
const OI = { headline: '#FFFFFF', sub: '#B0C4D8' };
const PRIMARY = '#00A859';
const TOTAL_SLIDES = 5; // welcome + 3 features + permissions

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const { setLanguage } = usePrefsStore();
  const s = useMemo(() => createStyles(colors), [colors]);

  const handleGetStarted = () => {
    setLanguage('en');
    router.push('/onboarding/features' as any);
  };

  const handleBengali = () => {
    setLanguage('bn');
    router.push('/onboarding/features' as any);
  };

  return (
    <View style={s.root}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      <ImageBackground
        source={require('../../assets/images/splash.png')}
        style={s.bg}
        resizeMode="cover"
      >
        {/* Dark gradient overlay for text legibility */}
        <View style={s.overlay} />

        {/* Logo — green map pin with train icon */}
        <View style={[s.logoWrap, { paddingTop: insets.top + 32 }]}>
          <View style={s.pin}>
            {/* Pin shape */}
            <View style={s.pinCircle}>
              {/* Train icon inside pin */}
              <View style={s.trainIconWrap}>
                {/* Simple train SVG-style via Views */}
                <View style={s.trainBody} />
                <View style={s.trainFront} />
                <View style={s.trainWindowRow}>
                  <View style={s.trainWindow} />
                  <View style={s.trainWindow} />
                </View>
                <View style={s.trainWheelRow}>
                  <View style={s.trainWheel} />
                  <View style={s.trainWheel} />
                </View>
              </View>
              {/* Red dot */}
              <View style={s.redDot} />
            </View>
            <View style={s.pinTail} />
          </View>
        </View>

        {/* Hero text */}
        <View style={s.hero}>
          <Text style={s.headline}>
            {'Travel Smarter.\nTravel '}
            <Text style={{ color: PRIMARY }}>RailMate.</Text>
          </Text>
          <Text style={s.sub}>
            Your all-in-one railway companion{'\n'}for Bangladesh.
          </Text>
        </View>

        {/* CTAs */}
        <View style={[s.ctas, { paddingBottom: insets.bottom + 20 }]}>
          <Pressable style={s.primaryBtn} onPress={handleGetStarted}>
            <Text style={s.primaryBtnText}>Get Started  →</Text>
          </Pressable>
          <Pressable style={s.secondaryBtn} onPress={handleBengali}>
            <Text style={s.secondaryBtnText}>Continue in বাংলা</Text>
          </Pressable>

          {/* Pagination dots — slide 1 of 5 */}
          <View style={s.dots}>
            {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
              <View key={i} style={[s.dot, i === 0 && s.dotActive]} />
            ))}
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    root:    { flex: 1, backgroundColor: '#080D17' },
    bg:      { flex: 1, justifyContent: 'space-between' },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(8,13,23,0.72)' },

    // Logo
    logoWrap:     { alignItems: 'center' },
    pin:          { alignItems: 'center' },
    pinCircle:    {
      width: 80, height: 80, borderRadius: 40,
      backgroundColor: PRIMARY,
      alignItems: 'center', justifyContent: 'center',
      shadowColor: PRIMARY, shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.6, shadowRadius: 16, elevation: 10,
    },
    pinTail: {
      width: 0, height: 0,
      borderLeftWidth: 14, borderRightWidth: 14, borderTopWidth: 22,
      borderLeftColor: 'transparent', borderRightColor: 'transparent',
      borderTopColor: PRIMARY,
      marginTop: -2,
    },
    // Simple train icon inside pin
    trainIconWrap: { alignItems: 'center', justifyContent: 'center' },
    trainBody:    { width: 30, height: 22, backgroundColor: '#fff', borderRadius: 5, marginBottom: 2 },
    trainFront:   { width: 30, height: 6, backgroundColor: '#fff', borderRadius: 3, marginBottom: 1 },
    trainWindowRow:{ flexDirection: 'row', gap: 6, position: 'absolute', top: 4 },
    trainWindow:  { width: 8, height: 8, backgroundColor: '#00A859', borderRadius: 2 },
    trainWheelRow:{ flexDirection: 'row', gap: 12, position: 'absolute', bottom: 6 },
    trainWheel:   { width: 10, height: 10, borderRadius: 5, backgroundColor: '#333' },
    redDot:       { width: 10, height: 10, borderRadius: 5, backgroundColor: '#E8394B', position: 'absolute', top: 18, right: 18 },

    // Hero
    hero:      { paddingHorizontal: 28 },
    headline:  {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: 36, lineHeight: 46, color: OI.headline,
      textAlign: 'center', marginBottom: 14,
    },
    sub:       {
      fontFamily: 'Inter_400Regular',
      fontSize: 16, lineHeight: 26, color: OI.sub,
      textAlign: 'center',
    },

    // CTAs
    ctas:       { paddingHorizontal: 24, gap: 12 },
    primaryBtn: {
      backgroundColor: PRIMARY, borderRadius: 56,
      paddingVertical: 17, alignItems: 'center',
      shadowColor: PRIMARY, shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5, shadowRadius: 12, elevation: 8,
    },
    primaryBtnText: {
      fontFamily: 'Inter_700Bold', fontSize: 17, color: '#FFFFFF',
    },
    secondaryBtn: {
      borderWidth: 1.5, borderColor: PRIMARY,
      borderRadius: 56, paddingVertical: 16, alignItems: 'center',
    },
    secondaryBtnText: {
      fontFamily: 'Inter_600SemiBold', fontSize: 16, color: PRIMARY,
    },

    // Dots
    dots:     { flexDirection: 'row', justifyContent: 'center', gap: 7, marginTop: 8 },
    dot:      { width: 7, height: 7, borderRadius: 3.5, backgroundColor: 'rgba(255,255,255,0.25)' },
    dotActive:{ width: 22, backgroundColor: PRIMARY },
  });
