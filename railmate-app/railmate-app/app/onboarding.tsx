// app/onboarding.tsx
import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, SafeAreaView,
  Dimensions, FlatList, NativeSyntheticEvent, NativeScrollEvent,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../theme';

const { width: W } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  title: string;
  titleHighlight?: string;
  subtitle: string;
  illustration: string;
}

const SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Welcome to ',
    titleHighlight: 'RailMate Bangladesh',
    subtitle: 'Your all-in-one companion for smarter, safer and easier train journeys across Bangladesh.',
    illustration: 'hero',
  },
  {
    id: '2',
    title: 'Real-time Train\nUpdates',
    subtitle: 'Get live running status, delays, platform changes and station updates in real-time.',
    illustration: 'live',
  },
  {
    id: '3',
    title: 'Power of\nCommunity',
    subtitle: 'Share and discover real experiences from fellow travelers. Together, we make every journey better.',
    illustration: 'community',
  },
  {
    id: '4',
    title: 'Everything You Need,\nAll in One Place',
    subtitle: "From seat availability to station info, we've got all the essential features to plan your perfect journey.",
    illustration: 'features',
  },
  {
    id: '5',
    title: 'Safe. Reliable.\nMade for Bangladesh.',
    subtitle: 'Built for Bangladeshi travelers, by people who care about better train journeys.',
    illustration: 'safe',
  },
];

function SlideIllustration({ type }: { type: string }) {
  // In production: replace with actual Lottie animations or SVG illustrations
  const configs: Record<string, { bg: string; icon: string }> = {
    hero:      { bg: C.greenTint, icon: '🚂' },
    live:      { bg: C.blueTint,  icon: '📡' },
    community: { bg: C.purpleTint, icon: '👥' },
    features:  { bg: C.orangeTint, icon: '⚡' },
    safe:      { bg: C.greenTint, icon: '🛡️' },
  };
  const cfg = configs[type] ?? { bg: C.surface2, icon: '🚆' };
  return (
    <View style={[il.container, { backgroundColor: cfg.bg }]}>
      <Text style={il.emoji}>{cfg.icon}</Text>
    </View>
  );
}
const il = StyleSheet.create({
  container: { width: '100%', height: 280, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: S.xl },
  emoji: { fontSize: 80 },
});

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatRef = useRef<FlatList>(null);
  const isLast = currentIndex === SLIDES.length - 1;

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / W);
    setCurrentIndex(idx);
  };

  const handleNext = () => {
    if (isLast) {
      router.replace('/(tabs)');
    } else {
      flatRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    }
  };

  const handleSkip = () => router.replace('/(tabs)');

  const renderSlide = ({ item }: { item: OnboardingSlide }) => (
    <View style={ob.slide}>
      <SlideIllustration type={item.illustration} />
      <View style={ob.textBlock}>
        <Text style={ob.slideTitle}>
          {item.title}
          {item.titleHighlight && <Text style={ob.highlight}>{item.titleHighlight}</Text>}
        </Text>
        <Text style={ob.slideSubtitle}>{item.subtitle}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={ob.root}>
      {/* Header: Logo + Skip */}
      <View style={ob.header}>
        <View style={ob.logoRow}>
          <View style={ob.logoIcon} />
          <View>
            <View style={ob.brandRow}>
              <Text style={ob.brandWhite}>Rail</Text>
              <Text style={ob.brandGreen}>Mate</Text>
            </View>
            <Text style={ob.brandSub}>Bangladesh</Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={ob.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Slides */}
      <FlatList
        ref={flatRef}
        data={SLIDES}
        keyExtractor={item => item.id}
        renderItem={renderSlide}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      />

      {/* Footer: dots + button */}
      <View style={ob.footer}>
        {/* Dot indicators */}
        <View style={ob.dotsRow}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[ob.dot, i === currentIndex && ob.dotActive]} />
          ))}
        </View>

        {/* Next / Get Started button */}
        <TouchableOpacity style={ob.nextBtn} onPress={handleNext}>
          <Text style={ob.nextBtnText}>{isLast ? 'Get Started' : 'Next  ›'}</Text>
        </TouchableOpacity>

        {/* Log in link on last slide */}
        {isLast && (
          <View style={ob.loginRow}>
            <Text style={ob.loginText}>Already have an account?  </Text>
            <TouchableOpacity onPress={() => router.push('/auth/login' as any)}>
              <Text style={ob.loginLink}>Log in</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const ob = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#070B12' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: S.xxl, paddingVertical: S.lg },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  logoIcon: { width: 44, height: 44, backgroundColor: C.green, borderRadius: 12 },
  brandRow: { flexDirection: 'row' },
  brandWhite: { fontSize: 20, fontWeight: '800', color: C.white },
  brandGreen: { fontSize: 20, fontWeight: '800', color: C.green },
  brandSub: { fontSize: T.sm, color: C.text2, marginTop: 1 },
  skipText: { fontSize: T.base, fontWeight: '600', color: C.text2 },
  slide: { width: W, paddingHorizontal: S.xxl, paddingTop: S.md },
  textBlock: { gap: S.md, paddingTop: S.lg },
  slideTitle: { fontSize: 26, fontWeight: '800', color: C.white, lineHeight: 34 },
  highlight: { color: C.green },
  slideSubtitle: { fontSize: T.base, color: C.text2, lineHeight: 22 },
  footer: { paddingHorizontal: S.xxl, paddingBottom: S.xxxl, gap: S.xl },
  dotsRow: { flexDirection: 'row', justifyContent: 'center', gap: S.sm },
  dot: { width: 8, height: 8, backgroundColor: C.surface2, borderRadius: 4 },
  dotActive: { width: 24, backgroundColor: C.green, borderRadius: 4 },
  nextBtn: { backgroundColor: C.green, borderRadius: 14, paddingVertical: 18, alignItems: 'center' },
  nextBtnText: { fontSize: T.md, fontWeight: '700', color: C.bg },
  loginRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginText: { fontSize: T.base, color: C.text2 },
  loginLink: { fontSize: T.base, fontWeight: '700', color: C.green },
});
