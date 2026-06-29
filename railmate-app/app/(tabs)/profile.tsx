// app/(tabs)/profile.tsx — Profile Screen

import React, { useCallback } from 'react';
import { Bell, Gear, PencilSimple, CaretRight, Shield, Train, MapPin, BookmarkSimple, UsersThree, Trophy, CheckCircle } from 'phosphor-react-native';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../../theme';
import { useAuthStore } from '../../stores/authStore';
import { useAuth } from '../../hooks/useAuth';
import { useCommunityReports } from '../../hooks/useCommunityReports';
import { useTranslation } from '../../i18n';
import { Avatar } from '../../components/ui/Avatar/Avatar';

interface MenuItem {
  id: string;
  label: string;
  sub: string;
  route: string;
  icon: React.ReactElement;
}

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, isAuthenticated, isGuest } = useAuthStore();
  const { signOut } = useAuth();
  const { data: myReports } = useCommunityReports(user?.id ? { userId: user.id } : null);

  // XP / Level calculation
  const reportCount = user?.report_count ?? myReports?.length ?? 0;
  const trustScore = user?.trust_score ?? 0;
  const xpTotal = reportCount * 20 + (user?.helpful_vote_count ?? 0) * 5;
  const level = xpTotal < 500 ? 1 : xpTotal < 2000 ? 2 : xpTotal < 5000 ? 3 : xpTotal < 10000 ? 4 : 5;
  const levelNames = ['', 'Explorer', 'Contributor', 'Verified Traveler', 'Station Expert', 'Ambassador'];
  const nextLevelXP = [500, 2000, 5000, 10000, 20000][level - 1] ?? 20000;
  const prevLevelXP = [0, 500, 2000, 5000, 10000][level - 1] ?? 0;
  const progress = Math.min((xpTotal - prevLevelXP) / (nextLevelXP - prevLevelXP), 1);

  const ACTIVITY_STATS = [
    { icon: C.greenTint, val: String(reportCount), label: t('profile.reports') },
    { icon: C.blueTint, val: String(user?.helpful_vote_count ?? 0), label: t('profile.helpful') },
    { icon: C.orangeTint, val: String(trustScore), label: t('profile.trust_score') },
    { icon: C.purpleTint, val: '—', label: t('profile.badges') },
  ];

  const MENU_ITEMS: MenuItem[] = [
    { id: 'trips', label: t('journey.title'), sub: t('profile.menu_trips_sub'), route: '/journey-tools', icon: <Train size={18} color={C.green} weight="fill" /> },
    { id: 'routes', label: t('profile.saved_routes'), sub: t('profile.menu_routes_sub'), route: '/journey-tools', icon: <BookmarkSimple size={18} color={C.green} weight="fill" /> },
    { id: 'reminders', label: t('profile.notifications'), sub: t('profile.menu_notif_sub'), route: '/notifications', icon: <Bell size={18} color={C.green} weight="fill" /> },
    { id: 'leaderboard', label: t('leaderboard.title'), sub: t('profile.menu_leaderboard_sub'), route: '/leaderboard', icon: <Trophy size={18} color={C.green} weight="fill" /> },
    { id: 'badges', label: t('profile.badges'), sub: t('profile.menu_badges_sub'), route: '/badges-reputation', icon: <CheckCircle size={18} color={C.green} weight="fill" /> },
    { id: 'settings', label: t('profile.settings'), sub: t('profile.menu_settings_sub'), route: '/settings', icon: <Gear size={18} color={C.green} weight="fill" /> },
  ];

  const handleSignOut = useCallback(() => {
    Alert.alert(
      t('auth.sign_out'),
      t('profile.sign_out_confirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.sign_out'),
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/auth/login' as any);
          },
        },
      ],
    );
  }, [t, signOut, router]);

  const renderProfileCardContent = () => {
    if (!isAuthenticated && !isGuest) {
      return (
        <View style={s.profileRow}>
          <View style={s.avatarWrap}>
            <Avatar uri={undefined} name="অতিথি" size={72} />
          </View>
          <View style={{ flex: 1, gap: S.sm, justifyContent: 'center' }}>
            <Text style={s.profileName}>{t('profile.guest_user')}</Text>
            <Text style={s.profileEmail}>{t('profile.guest_hint')}</Text>
            <TouchableOpacity
              style={s.travellerBadge}
              onPress={() => router.push('/auth/login' as any)}
            >
              <Text style={s.travellerBadgeText}>{t('auth.sign_in')}  →</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={s.profileRow}>
        {/* Avatar */}
        <TouchableOpacity style={s.avatarWrap} onPress={() => router.push('/profile-edit' as any)}>
          <Avatar uri={user?.avatar_url} name={user?.display_name ?? 'অতিথি'} size={72} />
          <View style={s.editBadge}><PencilSimple size={12} color={C.bg} /></View>
        </TouchableOpacity>
        {/* Info */}
        <View style={s.profileInfo}>
          <View style={s.verifiedRow}>
            <Text style={s.profileName}>{user?.display_name ?? t('profile.guest_user')}</Text>
            <View style={s.verifiedDot} />
          </View>
          <Text style={s.profileEmail}>{user?.email ?? ''}</Text>
          <Text style={s.profilePhone}>{user?.phone ?? ''}</Text>
          {isAuthenticated || isGuest ? (
            <TouchableOpacity style={s.travellerBadge} onPress={() => router.push('/badges-reputation' as any)}>
              <Text style={s.travellerBadgeText}>{t('profile.trusted_traveler')}  →</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={s.travellerBadge} onPress={() => router.push('/auth/login' as any)}>
              <Text style={s.travellerBadgeText}>{t('auth.sign_in')}  →</Text>
            </TouchableOpacity>
          )}
        </View>
        <View style={s.xpBox}>
          <Text style={s.xpTitle}>{levelNames[level]}</Text>
        {/* XP box */}
          <Text style={s.xpLevel}>Level {level}</Text>
          <View style={s.xpBarBg}>
            <View style={[s.xpBarFill, { width: `${Math.round(progress * 100)}%` as any }]} />
          </View>
          <Text style={s.xpProgress}>{xpTotal} / {nextLevelXP} XP</Text>
        </View>
      </View>
    );
  };

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
          <TouchableOpacity style={s.iconBtn} onPress={() => router.push('/notifications' as any)}><Bell size={18} color={C.text2} /></TouchableOpacity>
          <TouchableOpacity style={s.iconBtn} onPress={() => router.push('/settings' as any)}><Gear size={18} color={C.text2} /></TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>

        {/* Profile card */}
        <View style={s.profileCard}>
          {renderProfileCardContent()}
        </View>

        {/* Privacy banner */}
        <View style={s.privacyBanner}>
          <View style={[s.privacyIcon, { alignItems: 'center', justifyContent: 'center' }]}>
            <Shield size={18} color={C.green} weight="fill" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.privacyTitle}>{t('profile.privacy_title')}</Text>
            <Text style={s.privacySub}>{t('profile.privacy_sub')}</Text>
          </View>
          <TouchableOpacity style={s.privacyBtn} onPress={() => router.push('/settings' as any)}>
            <Text style={s.privacyBtnText}>{t('profile.privacy_btn')}</Text>
          </TouchableOpacity>
        </View>

        {/* Activity */}
        <View style={s.card}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>{t('profile.my_activity')}</Text>
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
                <View style={s.menuIcon}>{item.icon}</View>
                <View style={{ flex: 1 }}>
                  <Text style={s.menuLabel}>{item.label}</Text>
                  <Text style={s.menuSub}>{item.sub}</Text>
                </View>
                <CaretRight size={16} color={C.text3} />
              </TouchableOpacity>
              {i < MENU_ITEMS.length - 1 && <View style={s.divider} />}
            </View>
          ))}
        </View>

        {/* Sign Out button */}
        <TouchableOpacity
          style={s.logoutBtn}
          onPress={handleSignOut}
          activeOpacity={0.8}
        >
          <Text style={s.logoutText}>{t('profile.sign_out')}</Text>
        </TouchableOpacity>

        {/* Community CTA */}
        <View style={s.communityBanner}>
          <View style={[s.communityIcon, { alignItems: 'center', justifyContent: 'center' }]}>
            <UsersThree size={22} color={C.green} weight="fill" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.communityTitle}>{t('profile.community_cta_title')}</Text>
            <Text style={s.communitySub}>{t('profile.community_cta_sub')}</Text>
          </View>
          <TouchableOpacity
            style={s.communityBtn}
            onPress={() => router.push('/(tabs)/community')}
          >
            <Text style={s.communityBtnText}>{t('profile.community_cta_btn')}</Text>
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
  iconBtn: { width: 36, height: 36, backgroundColor: C.surface2, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  profileCard: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.xl },
  profileRow: { flexDirection: 'row', gap: S.md, alignItems: 'flex-start' },
  avatarWrap: { position: 'relative', width: 72, height: 72 },
  avatar: { width: 72, height: 72, backgroundColor: C.surface2, borderRadius: 36 },
  editBadge: { position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, backgroundColor: C.green, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
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
  menuIcon: { width: 36, height: 36, backgroundColor: C.greenTint, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  menuLabel: { fontSize: 14, fontWeight: '600', color: C.white },
  menuSub: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  menuChevron: { width: 16, height: 16, backgroundColor: C.surface2, borderRadius: 4 },
  divider: { height: 1, backgroundColor: C.border, marginHorizontal: S.lg },
  logoutBtn: { backgroundColor: C.redTint, borderRadius: R.lg, borderWidth: 1, borderColor: C.red, padding: S.lg, alignItems: 'center' },
  logoutText: { fontSize: T.md, fontWeight: '700', color: C.red },
  communityBanner: { backgroundColor: C.greenTint, borderRadius: R.lg, borderWidth: 1, borderColor: C.greenDark, padding: S.lg, flexDirection: 'row', alignItems: 'center', gap: S.md },
  communityIcon: { width: 44, height: 44, backgroundColor: C.greenDark, borderRadius: 22 },
  communityTitle: { fontSize: T.base, fontWeight: '700', color: C.green },
  communitySub: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  communityBtn: { backgroundColor: C.greenDark, borderRadius: 10, paddingHorizontal: S.md, paddingVertical: S.sm },
  communityBtnText: { fontSize: T.sm, fontWeight: '600', color: C.green },
});
