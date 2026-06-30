import React, { useMemo, useState, useRef } from 'react';
import {
  View, Text, StyleSheet, Pressable, Dimensions, ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MagnifyingGlass, UsersThree, BellSimple, ArrowRight } from 'phosphor-react-native';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';

const { width } = Dimensions.get('window');
const PRIMARY = '#00A859';

// Exactly matching the approved specification and Image 1:
// Slide 1: Search & Plan
// Slide 2: Community Intelligence
// Slide 3: Smart Alerts
const SLIDES = [
  {
    Icon: MagnifyingGlass,
    color: PRIMARY,
    bg: 'rgba(0,168,89,0.12)',
    title: 'Search & Plan',
    desc: 'Find trains, schedules and fares instantly.',
  },
  {
    Icon: UsersThree,
    color: '#4EA8E0',
    bg: 'rgba(78,168,224,0.12)',
    title: 'Community Intelligence',
    desc: 'Passengers helping passengers travel smarter.',
  },
  {
    Icon: BellSimple,
    color: '#F5A623',
    bg: 'rgba(245,166,35,0.12)',
    title: 'Smart Alerts',
    desc: 'Never miss important journey updates.',
  },
] as const;

const TOTAL_SLIDES = 5; // welcome(1) + features(3) + permissions(1)
const FEATURE_START_IDX = 1; // features occupy dots 1,2,3 (0-indexed)

export default function FeaturesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const s = useMemo(() => createStyles(colors), [colors]);
  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<ScrollView>(null);

  const handleScroll = (e: any) =>
    setActiveIdx(Math.round(e.nativeEvent.contentOffset.x / width));

  const handleNext = () => {
    if (activeIdx < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: (activeIdx + 1) * width, animated: true });
    } else {
      router.push('/onboarding/permissions' as any);
    }
  };

  // Current position in the global 5-dot row
  const globalDotIdx = FEATURE_START_IDX + activeIdx;

  return (
    <View style={s.root}>
      <Pressable
        style={[s.skip, { top: insets.top + 12 }]}
        onPress={() => router.push('/onboarding/auth' as any)}
      >
        <Text style={s.skipText}>Skip</Text>
      </Pressable>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        style={{ flex: 1 }}
      >
        {SLIDES.map(({ Icon, color, bg, title, desc }, i) => (
          <View key={i} style={[s.slide, { width }]}>
            <View style={[s.iconWrap, { backgroundColor: bg }]}>
              <Icon size={72} color={color} weight="duotone" />
            </View>
            <Text style={s.title}>{title}</Text>
            <Text style={s.desc}>{desc}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Global 5-dot pagination */}
      <View style={s.dots}>
        {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
          <View
            key={i}
            style={[
              s.dot,
              i === globalDotIdx && s.dotActive,
            ]}
          />
        ))}
      </View>

      <View style={[s.footer, { paddingBottom: insets.bottom + 24 }]}>
        <Pressable style={s.nextBtn} onPress={handleNext}>
          <Text style={s.nextText}>
            {activeIdx === SLIDES.length - 1 ? 'Continue' : 'Next'}
          </Text>
          <ArrowRight size={18} color="#fff" weight="bold" />
        </Pressable>
      </View>
    </View>
  );
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    root:    { flex: 1, backgroundColor: colors['bg-base'] },
    skip:    { position: 'absolute', right: 24, zIndex: 10 },
    skipText:{ fontFamily: 'Inter_500Medium', fontSize: 14, color: colors['text-tertiary'] },

    slide:   {
      flex: 1, alignItems: 'center', justifyContent: 'center',
      paddingHorizontal: 36, gap: 24,
    },
    iconWrap:{
      width: 130, height: 130, borderRadius: 40,
      alignItems: 'center', justifyContent: 'center',
      marginBottom: 8,
    },
    title:   {
      fontFamily: 'PlusJakartaSans_700Bold',
      fontSize: 28, color: colors['text-primary'],
      textAlign: 'center',
    },
    desc:    {
      fontFamily: 'Inter_400Regular',
      fontSize: 17, lineHeight: 28, color: colors['text-secondary'],
      textAlign: 'center',
    },

    // 5-dot global pagination
    dots:    { flexDirection: 'row', justifyContent: 'center', gap: 7, paddingVertical: 20 },
    dot:     { width: 7, height: 7, borderRadius: 3.5, backgroundColor: colors['border'] },
    dotActive:{ width: 22, backgroundColor: PRIMARY, borderRadius: 3.5 },

    footer:  { paddingHorizontal: 24 },
    nextBtn: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: 10, backgroundColor: PRIMARY, borderRadius: 56, paddingVertical: 17,
    },
    nextText:{ fontFamily: 'Inter_600SemiBold', fontSize: 16, color: '#fff' },
  });
