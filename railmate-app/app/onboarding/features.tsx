import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Dimensions, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MagnifyingGlass, UsersThree, BellSimple, ArrowRight } from 'phosphor-react-native';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    Icon: MagnifyingGlass,
    color: '#00A859',
    bg: 'rgba(0,168,89,0.12)',
    title: 'Search & Plan',
    desc: 'Find trains, check schedules and plan your journey across Bangladesh. Real departure times, stops, fares — all in one place.',
  },
  {
    Icon: UsersThree,
    color: '#4EA8E0',
    bg: 'rgba(78,168,224,0.12)',
    title: 'Live Community Updates',
    desc: 'Real-time delay reports, crowding levels and coach conditions from fellow travelers. Crowd-sourced truth, not guesswork.',
  },
  {
    Icon: BellSimple,
    color: '#F5A623',
    bg: 'rgba(245,166,35,0.12)',
    title: 'Smart Alerts',
    desc: 'Get notified before departure, when delays are reported, and when schedule changes happen. Never miss your train again.',
  },
];

export default function FeaturesScreen() {
  const router = useRouter();
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (e: any) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setActiveIdx(idx);
  };

  const handleNext = () => {
    if (activeIdx < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: (activeIdx + 1) * width, animated: true });
    } else {
      router.push('/onboarding/permissions');
    }
  };

  return (
    <View style={s.root}>
      {/* Skip */}
      <Pressable style={s.skip} onPress={() => router.push('/onboarding/auth')}>
        <Text style={s.skipText}>Skip</Text>
      </Pressable>

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal pagingEnabled showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={{ flex: 1 }}
      >
        {SLIDES.map(({ Icon, color, bg, title, desc }, i) => (
          <View key={i} style={[s.slide, { width }]}>
            <View style={[s.iconWrap, { backgroundColor: bg }]}>
              <Icon size={64} color={color} weight="duotone" />
            </View>
            <Text style={s.title}>{title}</Text>
            <Text style={s.desc}>{desc}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Dots */}
      <View style={s.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[s.dot, i === activeIdx && s.dotActive]} />
        ))}
      </View>

      {/* Next */}
      <View style={s.footer}>
        <Pressable style={s.nextBtn} onPress={handleNext}>
          <Text style={s.nextText}>{activeIdx === SLIDES.length - 1 ? 'Continue' : 'Next'}</Text>
          <ArrowRight size={18} color="#fff" weight="bold" />
        </Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root:      { flex: 1, backgroundColor: '#080D17' },
  skip:      { position: 'absolute', top: 56, right: 24, zIndex: 10 },
  skipText:  { fontFamily: 'Inter_500Medium', fontSize: 14, color: '#4E6480' },
  slide:     { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, paddingTop: 80 },
  iconWrap:  { width: 140, height: 140, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 48 },
  title:     { fontFamily: 'PlusJakartaSans_800ExtraBold', fontSize: 28, color: '#F0F4FF', textAlign: 'center', lineHeight: 36, marginBottom: 20 },
  desc:      { fontFamily: 'Inter_400Regular', fontSize: 16, color: '#8FA3C0', textAlign: 'center', lineHeight: 26 },
  dots:      { flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 32 },
  dot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: '#1E2E42' },
  dotActive: { width: 24, backgroundColor: '#00A859' },
  footer:    { paddingHorizontal: 24, paddingBottom: 56 },
  nextBtn:   { backgroundColor: '#00A859', borderRadius: 16, paddingVertical: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 },
  nextText:  { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: '#fff' },
});
