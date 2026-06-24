// app/search-trains.tsx — Search Trains Screen

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../../theme';

interface RecentSearch {
  id: string;
  from: string;
  to: string;
  date: string;
  classType: string;
}

const RECENT_SEARCHES: RecentSearch[] = [
  { id: '1', from: 'Dhaka', to: 'Chattogram', date: 'Today, 18 June 2026', classType: 'All Classes' },
  { id: '2', from: 'Dhaka', to: 'Sylhet', date: '17 June 2026', classType: 'All Classes' },
  { id: '3', from: 'Dhaka', to: 'Rajshahi', date: '15 June 2026', classType: 'Shovon Chair' },
  { id: '4', from: 'Chattogram', to: 'Dhaka', date: '14 June 2026', classType: 'All Classes' },
];

const CLASS_OPTIONS = ['All Classes', 'Shovon Chair', 'Snigdha', 'AC Seat', 'AC Berth', 'First Berth'];
const QUOTA_OPTIONS = ['General', 'Freedom Fighter', 'Disabled', 'Govt. Pass'];

export default function SearchTrainsScreen() {
  const router = useRouter();
  const [from, setFrom] = useState('Dhaka');
  const [to, setTo] = useState('Chattogram');
  const [date, setDate] = useState('Today, 18 June 2026');
  const [classType, setClassType] = useState('All Classes');
  const [quota, setQuota] = useState('General');

  const swapLocations = () => { setFrom(to); setTo(from); };

  const handleSearch = () => {
    router.push({
      pathname: '/search-results',
      params: { from, to, date, classType, quota },
    });
  };

  return (
    <SafeAreaView style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity style={s.backBtn} onPress={() => router.back()} />
        <Text style={s.title}>Search Trains</Text>
        <TouchableOpacity style={s.recentBtn}>
          <Text style={s.recentBtnText}>Recent</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Search Form */}
        <View style={s.formCard}>

          {/* From */}
          <TouchableOpacity style={s.fieldRow}>
            <View style={[s.fieldDot, { backgroundColor: C.green }]} />
            <View style={s.fieldContent}>
              <Text style={s.fieldLabel}>From</Text>
              <Text style={s.fieldValue}>{from}</Text>
              <Text style={s.fieldSub}>Kamlapur Railway Station</Text>
            </View>
            <TouchableOpacity style={s.clearBtn} onPress={() => setFrom('')}>
              <View style={s.clearDot} />
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Swap button */}
          <View style={s.swapWrapper}>
            <View style={s.swapLine} />
            <TouchableOpacity style={s.swapBtn} onPress={swapLocations}>
              <Text style={s.swapIcon}>⇅</Text>
            </TouchableOpacity>
          </View>

          {/* To */}
          <TouchableOpacity style={s.fieldRow}>
            <View style={[s.fieldDot, { backgroundColor: C.text2 }]} />
            <View style={s.fieldContent}>
              <Text style={s.fieldLabel}>To</Text>
              <Text style={s.fieldValue}>{to}</Text>
              <Text style={s.fieldSub}>Chattogram Railway Station</Text>
            </View>
            <TouchableOpacity style={s.clearBtn} onPress={() => setTo('')}>
              <View style={s.clearDot} />
            </TouchableOpacity>
          </TouchableOpacity>

          <View style={s.divider} />

          {/* Date */}
          <TouchableOpacity style={s.fieldRow}>
            <View style={[s.fieldIcon, { backgroundColor: C.surface2 }]} />
            <View style={s.fieldContent}>
              <Text style={s.fieldLabel}>Date of Journey</Text>
              <Text style={s.fieldValue}>{date}</Text>
            </View>
            <View style={s.chevron} />
          </TouchableOpacity>

          <View style={s.divider} />

          {/* Class */}
          <TouchableOpacity style={s.fieldRow}>
            <View style={[s.fieldIcon, { backgroundColor: C.surface2 }]} />
            <View style={s.fieldContent}>
              <Text style={s.fieldLabel}>Class (Optional)</Text>
              <Text style={s.fieldValue}>{classType}</Text>
              <Text style={s.fieldSub}>All Available Classes</Text>
            </View>
            <View style={s.chevron} />
          </TouchableOpacity>

          <View style={s.divider} />

          {/* Quota */}
          <TouchableOpacity style={s.fieldRow}>
            <View style={[s.fieldIcon, { backgroundColor: C.surface2 }]} />
            <View style={s.fieldContent}>
              <Text style={s.fieldLabel}>Quota (Optional)</Text>
              <Text style={s.fieldValue}>{quota}</Text>
              <Text style={s.fieldSub}>General Quota</Text>
            </View>
            <View style={s.chevron} />
          </TouchableOpacity>
        </View>

        {/* Search Button */}
        <TouchableOpacity style={s.searchBtn} onPress={handleSearch}>
          <Text style={s.searchBtnText}>Search Trains</Text>
        </TouchableOpacity>

        {/* Recent Searches */}
        <View style={s.recentSection}>
          <View style={s.recentHeader}>
            <Text style={s.recentTitle}>Recent Searches</Text>
            <TouchableOpacity><Text style={s.clearAll}>Clear All</Text></TouchableOpacity>
          </View>
          {RECENT_SEARCHES.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={s.recentItem}
              onPress={() => {
                setFrom(item.from); setTo(item.to); setDate(item.date); setClassType(item.classType);
              }}
            >
              <View style={s.recentIcon} />
              <View style={{ flex: 1 }}>
                <Text style={s.recentRoute}>{item.from} → {item.to}</Text>
                <Text style={s.recentMeta}>{item.date} • {item.classType}</Text>
              </View>
              <View style={s.bookmarkIcon} />
              <View style={s.chevron} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Explore Banner */}
        <View style={s.exploreBanner}>
          <View style={s.exploreImg} />
          <View style={{ flex: 1 }}>
            <Text style={s.exploreTitleBn}>ট্রেন খুঁজতে সহায়তা লাগছে?</Text>
            <Text style={s.exploreSub}>Use our Station Guide or Route Map to plan your journey better.</Text>
          </View>
          <TouchableOpacity style={s.exploreBtn}>
            <Text style={s.exploreBtnText}>Explore</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.xl, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.xl, paddingVertical: S.md },
  backBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
  title: { fontSize: 18, fontWeight: '700', color: C.white },
  recentBtn: { backgroundColor: C.greenTint, borderRadius: 16, paddingHorizontal: S.md, paddingVertical: 6, borderWidth: 1, borderColor: C.green },
  recentBtnText: { fontSize: T.sm, fontWeight: '600', color: C.green },
  formCard: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border },
  fieldRow: { flexDirection: 'row', alignItems: 'center', padding: S.xl, gap: S.md },
  fieldDot: { width: 20, height: 20, borderRadius: 10 },
  fieldIcon: { width: 20, height: 20, borderRadius: 6 },
  fieldContent: { flex: 1, gap: 2 },
  fieldLabel: { fontSize: T.xs, color: C.text2 },
  fieldValue: { fontSize: T.md, fontWeight: '600', color: C.white },
  fieldSub: { fontSize: T.sm, color: C.green },
  clearBtn: { width: 24, height: 24, backgroundColor: C.surface2, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  clearDot: { width: 8, height: 8, backgroundColor: C.text2, borderRadius: 4 },
  swapWrapper: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: S.xl },
  swapLine: { flex: 1, height: 1, backgroundColor: C.border },
  swapBtn: { width: 36, height: 36, backgroundColor: C.surface2, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: C.border },
  swapIcon: { fontSize: 16, color: C.green },
  divider: { height: 1, backgroundColor: C.border, marginHorizontal: S.xl },
  chevron: { width: 20, height: 20, backgroundColor: C.surface2, borderRadius: 4 },
  searchBtn: { backgroundColor: C.green, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  searchBtnText: { fontSize: T.md, fontWeight: '700', color: C.bg },
  recentSection: { gap: S.md },
  recentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  recentTitle: { fontSize: T.md, fontWeight: '700', color: C.white },
  clearAll: { fontSize: T.sm, fontWeight: '600', color: C.green },
  recentItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: R.md, borderWidth: 1, borderColor: C.border, padding: S.lg, gap: S.md },
  recentIcon: { width: 20, height: 20, backgroundColor: C.surface2, borderRadius: 10 },
  recentRoute: { fontSize: T.base, fontWeight: '600', color: C.white },
  recentMeta: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  bookmarkIcon: { width: 20, height: 20, backgroundColor: C.greenTint, borderRadius: 4 },
  exploreBanner: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.lg, flexDirection: 'row', alignItems: 'center', gap: S.md },
  exploreImg: { width: 56, height: 56, backgroundColor: C.surface2, borderRadius: 10 },
  exploreTitleBn: { fontSize: T.sm, fontWeight: '600', color: C.green },
  exploreSub: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  exploreBtn: { backgroundColor: C.greenTint, borderRadius: 10, paddingHorizontal: S.md, paddingVertical: S.sm, borderWidth: 1, borderColor: C.green },
  exploreBtnText: { fontSize: T.sm, fontWeight: '600', color: C.green },
});
