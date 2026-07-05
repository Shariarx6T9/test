import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Rocket } from 'phosphor-react-native';
import { Colors } from '../constants/colors';

const C = Colors.dark;

export default function ComingSoonScreen() {
  const router = useRouter();
  const { feature } = useLocalSearchParams<{ feature?: string }>();
  const featureName = feature ?? 'This feature';

  return (
    <SafeAreaView style={s.root} edges={['top']}>
      <View style={s.header}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={C['text-primary']} />
        </Pressable>
        <Text style={s.headerTitle}>{featureName}</Text>
        <View style={{ width: 36 }} />
      </View>
      <View style={s.body}>
        <View style={s.iconWrap}>
          <Rocket size={48} color={C.primary} weight="fill" />
        </View>
        <Text style={s.title}>Coming Soon</Text>
        <Text style={s.sub}>
          {featureName} is under development and will be available in an upcoming update.
        </Text>
        <Pressable style={s.btn} onPress={() => router.back()}>
          <Text style={s.btnText}>Go Back</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root:      { flex: 1, backgroundColor: C['bg-base'] },
  header:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  backBtn:   { width: 36, height: 36, backgroundColor: C['bg-card'], borderRadius: 10, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  headerTitle:{ fontSize: 16, fontWeight: '700', color: C['text-primary'] },
  body:      { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 16 },
  iconWrap:  { width: 88, height: 88, backgroundColor: 'rgba(0,168,89,0.1)', borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  title:     { fontSize: 26, fontWeight: '700', color: C['text-primary'] },
  sub:       { fontSize: 15, color: C['text-secondary'], textAlign: 'center', lineHeight: 24 },
  btn:       { marginTop: 8, backgroundColor: C.primary, borderRadius: 12, paddingVertical: 14, paddingHorizontal: 32 },
  btnText:   { fontSize: 15, fontWeight: '700', color: C['text-inverse'] },
});
