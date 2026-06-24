// app/(tabs)/profile.tsx — Profile Screen

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../../theme';

interface MenuItem {
  id: string;
  label: string;
  sub: string;
  route: string;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'trips', label: 'My Trips', sub: 'View and manage your trips', route: '/journey-tools' },
  { id: 'routes', label: 'Saved Routes', sub: 'Your frequently used routes', route: '/saved-routes' },
  { id: 'reminders', label: 'Reminders & Alerts', sub: 'Manage your journey alerts', route: '/reminders' },
  { id: 'payments', label: 'Payments & Tickets', sub: 'Manage payments and e-tickets', route: '/payments' },
  { id: 'bookmarks', label: 'Bookmarks', sub: 'Saved trains, stations and info', route: '/bookmarks' },
  { id: 'settings', label: 'Settings', sub: 'App preferences and notifications', route: '/settings' },
  { id: 'help', label: 'Help & Support', sub: 'FAQs, guides and contact support', route: '/help' },
  { id: 'about', label: 'About RailMate', sub: 'Version 1.0.0', route: '/about' },
];

const ACTIVITY_STATS = [
  { icon: C.greenTint, val: '24', label: 'Trips Completed' },
  { icon: C.blueTint, val: '127', label: 'Reports Submitted' },
  { icon: C.orangeTint, val: '42', label: 'Helpful Votes' },
  { icon: C.purpleTint, val: '8', label: 'Badges Earned' },
];

export default function ProfileScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.root}>
      {/* Header */}
      <View style={s.header}>
        <View>
          <View style={s.brandRow}>
            <Text style={s.brandWhite}>RailMate</Text>
            <Text style={s.brandGreen}> Bangladesh</Text>
          </View>
        </View>
        <View style={s.headerRight}>
          <TouchableOpacity style={s.iconBtn} />
          <TouchableOpacity style={s.iconBtn} onPress={() => router.push('/settings')} />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Profile card */}
        <View style={s.profileCard}>
          <View style={s.profileRow}>
            {/* Avatar */}
            <View style={s.avatarWrap}>
              <View style={s.avatar} />
              <View style={s.editBadge} />
            </View>
            {/* Info */}
            <View style={s.profileInfo}>
              <View style={s.verifiedRow}>
                <Text style={s.profileName}>Najmul Hasan</Text>
                <View style={s.verifiedDot} />
              </View>
              <Text style={s.profileEmail}>najmul.hasan@gmail.com</Text>
              <Text style={s.profilePhone}>+880 1712-345678</Text>
              <TouchableOpacity style={s.travellerBadge} onPress={() => router.push('/badges-reputation')}>
                <Text style={s.travellerBadgeText}>Trusted Traveler  →</Text>
              </TouchableOpacity>
            </View>
            {/* XP box */}
            <View style={s.xpBox}>
              <Text style={s.xpTitle}>Explorer</Text>
              <Text style={s.xpLevel}>Level 3</Text>
              <View style={s.xpBarBg}><View style={s.xpBarFill} /></View>
              <Text style={s.xpProgress}>2,450 / 5,000 XP</Text>
            </View>
          </View>
        </View>

        {/* Privacy banner */}
        <View style={s.privacyBanner}>
          <View style={s.privacyIcon} />
          <View style={{ flex: 1 }}>
            <Text style={s.privacyTitle}>Your data is safe and private</Text>
            <Text style={s.privacySub}>RailMate never shares your personal information.</Text>
          </View>
          <TouchableOpacity style={s.privacyBtn}>
            <Text style={s.privacyBtnText}>View Privacy</Text>
          </TouchableOpacity>
        </View>

        {/* Activity */}
        <View style={s.card}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>My Activity</Text>
            <TouchableOpacity><Text style={s.viewAll}>View All</Text></TouchableOpacity>
          </View>
          <View style={s.activityRow}>
            {ACTIVITY_STATS.map((stat) => (
              <View key={stat.label} style={s.activityItem}>
                <View style={[s.activityIcon, { backgroundColor: stat.icon }]} />
                <Text style={s.activityVal}>{stat.val}</Text>
                <Text style={s.activityLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Menu */}
        <View style={s.menuCard}>
          {MENU_ITEMS.map((item, i) => (
            <View key={item.id}>
              <TouchableOpacity
                style={s.menuRow}
                onPress={() => router.push(item.route as any)}
                activeOpacity={0.7}
              >
                <View style={s.menuIcon} />
                <View style={{ flex: 1 }}>
                  <Text style={s.menuLabel}>{item.label}</Text>
                  <Text style={s.menuSub}>{item.sub}</Text>
                </View>
                <View style={s.menuChevron} />
              </TouchableOpacity>
              {i < MENU_ITEMS.length - 1 && <View style={s.divider} />}
            </View>
          ))}
        </View>

        {/* Community CTA */}
        <View style={s.communityBanner}>
          <View style={s.communityIcon} />
          <View style={{ flex: 1 }}>
            <Text style={s.communityTitle}>Together, We Travel Better</Text>
            <Text style={s.communitySub}>Your updates help thousands of travelers every day.</Text>
          </View>
          <TouchableOpacity
            style={s.communityBtn}
            onPress={() => router.push('/(tabs)/community')}
          >
            <Text style={s.communityBtnText}>Go to Community</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.lg, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: S.xl, paddingVertical: S.md },
  brandRow: { flexDirection: 'row' },
  brandWhite: { fontSize: 17, fontWeight: '800', color: C.white },
  brandGreen: { fontSize: 17, fontWeight: '800', color: C.green },
  headerRight: { flexDirection: 'row', gap: S.sm },
  iconBtn: { width: 36, height: 36, backgroundColor: C.surface2, borderRadius: 18 },
  profileCard: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.xl },
  profileRow: { flexDirection: 'row', gap: S.md, alignItems: 'flex-start' },
  avatarWrap: { position: 'relative', width: 72, height: 72 },
  avatar: { width: 72, height: 72, backgroundColor: C.surface2, borderRadius: 36 },
  editBadge: { position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, backgroundColor: C.green, borderRadius: 11 },
  profileInfo: { flex: 1, gap: S.xs },
  verifiedRow: { flexDirection: 'row', alignItems: 'center', gap: S.xs },
  profileName: { fontSize: 18, fontWeight: '700', color: C.white },
  verifiedDot: { width: 16, height: 16, backgroundColor: C.green, borderRadius: 8 },
  profileEmail: { fontSize: T.sm, color: C.text2 },
  profilePhone: { fontSize: T.sm, color: C.text2 },
  travellerBadge: { backgroundColor: C.greenTint, borderRadius: 20, paddingHorizontal: S.md, paddingVertical: 6, alignSelf: 'flex-start', borderWidth: 1, borderColor: C.green },
  travellerBadgeText: { fontSize: T.sm, fontWeight: '600', color: C.green },
  xpBox: { backgroundColor: C.surface2, borderRadius: R.md, padding: S.md, alignItems: 'center', gap: 4, minWidth: 88 },
  xpTitle: { fontSize: T.base, fontWeight: '700', color: C.gold },
  xpLevel: { fontSize: T.sm, color: C.text2 },
  xpBarBg: { width: 80, height: 6, backgroundColor: C.border, borderRadius: 3 },
  xpBarFill: { width: 48, height: 6, backgroundColor: C.green, borderRadius: 3 },
  xpProgress: { fontSize: T.xs, color: C.text2 },
  privacyBanner: { backgroundColor: C.greenTint, borderRadius: R.lg, borderWidth: 1, borderColor: C.greenDark, padding: S.lg, flexDirection: 'row', alignItems: 'center', gap: S.md },
  privacyIcon: { width: 36, height: 36, backgroundColor: C.greenDark, borderRadius: 18 },
  privacyTitle: { fontSize: T.base, fontWeight: '700', color: C.white },
  privacySub: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  privacyBtn: { backgroundColor: C.greenDark, borderRadius: 8, paddingHorizontal: S.md, paddingVertical: S.sm },
  privacyBtnText: { fontSize: T.sm, fontWeight: '600', color: C.green },
  card: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.lg, gap: S.md },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sectionTitle: { fontSize: T.md, fontWeight: '700', color: C.white },
  viewAll: { fontSize: T.sm, fontWeight: '600', color: C.green },
  activityRow: { flexDirection: 'row', justifyContent: 'space-between' },
  activityItem: { alignItems: 'center', gap: S.xs },
  activityIcon: { width: 36, height: 36, borderRadius: 10 },
  activityVal: { fontSize: 20, fontWeight: '700', color: C.white },
  activityLabel: { fontSize: T.xs, color: C.text2, textAlign: 'center' },
  menuCard: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border },
  menuRow: { flexDirection: 'row', alignItems: 'center', gap: S.md, padding: S.lg },
  menuIcon: { width: 36, height: 36, backgroundColor: C.greenTint, borderRadius: 10 },
  menuLabel: { fontSize: 14, fontWeight: '600', color: C.white },
  menuSub: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  menuChevron: { width: 16, height: 16, backgroundColor: C.surface2, borderRadius: 4 },
  divider: { height: 1, backgroundColor: C.border, marginHorizontal: S.lg },
  communityBanner: { backgroundColor: C.greenTint, borderRadius: R.lg, borderWidth: 1, borderColor: C.greenDark, padding: S.lg, flexDirection: 'row', alignItems: 'center', gap: S.md },
  communityIcon: { width: 44, height: 44, backgroundColor: C.greenDark, borderRadius: 22 },
  communityTitle: { fontSize: T.base, fontWeight: '700', color: C.green },
  communitySub: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  communityBtn: { backgroundColor: C.greenDark, borderRadius: 10, paddingHorizontal: S.md, paddingVertical: S.sm },
  communityBtnText: { fontSize: T.sm, fontWeight: '600', color: C.green },
});
