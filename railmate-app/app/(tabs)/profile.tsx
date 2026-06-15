import React from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import {
  User as UserIcon, BookmarkSimple, CreditCard, BellSimple,
  Question, CaretRight, SignOut, Globe, Moon, Sun, DeviceMobile,
  Shield, Star, Trophy, ChartBar, CheckCircle,
} from 'phosphor-react-native';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../stores/authStore';
import { usePrefsStore } from '../../stores/prefsStore';
import { useTranslation } from '../../i18n';
import { Avatar } from '../../components/ui/Avatar/Avatar';
import { ErrorBoundary } from '../../components/ErrorBoundary';

const C = {
  bg: '#080D17', bgCard: '#0F1929', bgElevated: '#162035',
  primary: '#00A859', accent: '#F5A623', danger: '#E8394B',
  textPri: '#F0F4FF', textSec: '#8FA3C0', textTer: '#4E6480',
  border: '#1E2E42',
};

const STATS = [
  { key: 'reports',  label: 'Reports',  val: '15' },
  { key: 'helpful',  label: 'Helpful',  val: '48' },
  { key: 'journeys', label: 'Journeys', val: '23' },
];

const BADGES_PREVIEW = ['🟢','🔵','🟡'];

function ProfileContent() {
  const router = useRouter();
  const { signOut, user, isAuthenticated } = useAuth();
  const { setGuest } = useAuthStore();
  const { theme, setTheme, locale, setLocale } = usePrefsStore();
  const { t } = useTranslation();

  const toggleLanguage = () => setLocale(locale === 'bn' ? 'en' : 'bn');

  const MENU_ITEMS = [
    { icon: BookmarkSimple, label: 'Saved Routes',          color: C.accent,   route: '/journey/tools' },
    { icon: Trophy,          label: 'Leaderboard',           color: '#F5A623',  route: '/leaderboard' },
    { icon: Shield,          label: 'Badges & Tiers',        color: '#A855F7',  route: '/badges' },
    { icon: CreditCard,      label: 'Payment & Subscription',color: '#4EA8E0',  route: null },
    { icon: BellSimple,      label: 'Notification Settings', color: C.primary,  route: '/notifications' },
    { icon: Question,        label: 'Help & Support',        color: C.textSec,  route: null },
  ];

  if (!isAuthenticated) {
    return (
      <View style={s.root}>
        <ScrollView contentContainerStyle={{ padding: 24, paddingTop: 72, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
          <View style={s.guestHero}>
            <View style={s.guestAvatarWrap}>
              <UserIcon size={40} color={C.textTer} />
            </View>
            <Text style={s.guestTitle}>Guest User</Text>
            <Text style={s.guestSub}>Sign in to save routes and get personalized alerts</Text>
            <Pressable style={s.signInBtn} onPress={() => router.push('/auth/login' as any)}>
              <Text style={s.signInBtnText}>Sign In / Create Account</Text>
            </Pressable>
          </View>

          {/* Theme */}
          <View style={s.settingsCard}>
            <Text style={s.settingsCardTitle}>Appearance</Text>
            <View style={s.themeRow}>
              {(['light','dark','system'] as const).map((opt) => {
                const active = theme === opt;
                const Icon = opt==='light' ? Sun : opt==='dark' ? Moon : DeviceMobile;
                return (
                  <Pressable key={opt} style={[s.themeOption, active && s.themeOptionActive]} onPress={() => setTheme(opt)}>
                    <Icon size={16} color={active ? '#fff' : C.textSec} />
                    <Text style={[s.themeText, active && s.themeTextActive]}>{opt.charAt(0).toUpperCase()+opt.slice(1)}</Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={s.divider} />
            <Pressable style={s.menuRow} onPress={toggleLanguage}>
              <View style={[s.menuIcon, { backgroundColor: C.primary+'18' }]}><Globe size={18} color={C.primary} /></View>
              <Text style={s.menuLabel}>Language</Text>
              <Text style={s.menuValue}>{locale === 'bn' ? 'বাংলা' : 'English'}</Text>
              <CaretRight size={16} color={C.textTer} />
            </Pressable>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={s.hero}>
          <View style={s.heroOverlay} />
          <View style={s.heroContent}>
            <Avatar name={user?.name ?? 'User'} uri={user?.avatar_url} size={72} />
            <View style={{ marginTop: 14 }}>
              <Text style={s.userName}>{user?.name ?? 'Traveler'}</Text>
              <View style={s.trustedRow}>
                <CheckCircle size={14} color={C.primary} weight="fill" />
                <Text style={s.trustedText}>Trusted Reporter</Text>
              </View>
            </View>
            {/* Trust score */}
            <View style={s.trustRow}>
              {[1,2,3,4,5].map((i) => (
                <Star key={i} size={16} color={i <= 4 ? C.accent : C.border} weight={i<=4 ? 'fill':'regular'} />
              ))}
              <Text style={s.trustScore}>4.8 / 5</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          {STATS.map(({ key, label, val }) => (
            <View key={key} style={s.stat}>
              <Text style={s.statVal}>{val}</Text>
              <Text style={s.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Badges preview */}
        <Pressable style={s.badgesRow} onPress={() => router.push('/badges' as any)}>
          <Text style={s.badgesTitle}>My Badges</Text>
          <View style={{ flexDirection:'row', gap:8, flex:1 }}>
            {BADGES_PREVIEW.map((b,i) => <Text key={i} style={{ fontSize:22 }}>{b}</Text>)}
          </View>
          <CaretRight size={16} color={C.textTer} />
        </Pressable>

        {/* Menu */}
        <View style={s.section}>
          {MENU_ITEMS.map(({ icon:Icon, label, color, route }) => (
            <Pressable key={label} style={s.menuRow} onPress={() => route && router.push(route as any)}>
              <View style={[s.menuIcon, { backgroundColor: color+'18' }]}>
                <Icon size={18} color={color} weight="duotone" />
              </View>
              <Text style={s.menuLabel}>{label}</Text>
              <CaretRight size={16} color={C.textTer} />
            </Pressable>
          ))}
        </View>

        {/* Settings */}
        <View style={s.section}>
          <Text style={s.settingsCardTitle}>Appearance</Text>
          <View style={s.themeRow}>
            {(['light','dark','system'] as const).map((opt) => {
              const active = theme === opt;
              const Icon = opt==='light' ? Sun : opt==='dark' ? Moon : DeviceMobile;
              return (
                <Pressable key={opt} style={[s.themeOption, active && s.themeOptionActive]} onPress={() => setTheme(opt)}>
                  <Icon size={16} color={active ? '#fff' : C.textSec} />
                  <Text style={[s.themeText, active && s.themeTextActive]}>{opt.charAt(0).toUpperCase()+opt.slice(1)}</Text>
                </Pressable>
              );
            })}
          </View>
          <View style={s.divider} />
          <Pressable style={s.menuRow} onPress={toggleLanguage}>
            <View style={[s.menuIcon, { backgroundColor: C.primary+'18' }]}><Globe size={18} color={C.primary} /></View>
            <Text style={s.menuLabel}>Language</Text>
            <Text style={s.menuValue}>{locale === 'bn' ? 'বাংলা' : 'English'}</Text>
            <CaretRight size={16} color={C.textTer} />
          </Pressable>
        </View>

        <Pressable style={s.signOutBtn} onPress={async () => { await signOut(); }}>
          <SignOut size={18} color={C.danger} />
          <Text style={s.signOutText}>Sign Out</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

export default function ProfileScreen() {
  return <ErrorBoundary name="Profile"><ProfileContent /></ErrorBoundary>;
}

const s = StyleSheet.create({
  root:           { flex:1, backgroundColor:C.bg },
  hero:           { backgroundColor:C.bgCard, borderBottomWidth:1, borderBottomColor:C.border, marginBottom:0 },
  heroOverlay:    { position:'absolute', inset:0, backgroundColor:'rgba(0,168,89,0.04)' },
  heroContent:    { alignItems:'center', paddingTop:64, paddingBottom:28, paddingHorizontal:20 },
  userName:       { fontFamily:'PlusJakartaSans_700Bold', fontSize:22, color:C.textPri, marginBottom:6 },
  trustedRow:     { flexDirection:'row', alignItems:'center', gap:6, marginBottom:12 },
  trustedText:    { fontFamily:'Inter_500Medium', fontSize:13, color:C.primary },
  trustRow:       { flexDirection:'row', alignItems:'center', gap:4 },
  trustScore:     { fontFamily:'JetBrainsMono_500Medium', fontSize:14, color:C.accent, marginLeft:8 },
  statsRow:       { flexDirection:'row', backgroundColor:C.bgCard, borderBottomWidth:1, borderBottomColor:C.border },
  stat:           { flex:1, alignItems:'center', paddingVertical:18 },
  statVal:        { fontFamily:'PlusJakartaSans_800ExtraBold', fontSize:22, color:C.primary },
  statLabel:      { fontFamily:'Inter_400Regular', fontSize:11, color:C.textSec, marginTop:3 },
  badgesRow:      { flexDirection:'row', alignItems:'center', backgroundColor:C.bgCard, borderTopWidth:1, borderBottomWidth:1, borderColor:C.border, paddingHorizontal:20, paddingVertical:16, marginTop:20, gap:12 },
  badgesTitle:    { fontFamily:'Inter_600SemiBold', fontSize:15, color:C.textPri, marginRight:4 },
  section:        { backgroundColor:C.bgCard, borderTopWidth:1, borderBottomWidth:1, borderColor:C.border, marginTop:12, paddingHorizontal:20, paddingVertical:8 },
  settingsCard:   { backgroundColor:C.bgCard, borderRadius:16, borderWidth:1, borderColor:C.border, padding:20, marginBottom:16 },
  settingsCardTitle:{ fontFamily:'Inter_600SemiBold', fontSize:16, color:C.textPri, marginBottom:14 },
  themeRow:       { flexDirection:'row', gap:8, marginBottom:4 },
  themeOption:    { flex:1, flexDirection:'row', alignItems:'center', justifyContent:'center', gap:6, borderWidth:1.5, borderColor:C.border, borderRadius:20, paddingVertical:10 },
  themeOptionActive:{ backgroundColor:C.primary, borderColor:C.primary },
  themeText:      { fontFamily:'Inter_500Medium', fontSize:13, color:C.textSec },
  themeTextActive:{ color:'#fff' },
  divider:        { height:1, backgroundColor:C.border, marginVertical:12 },
  menuRow:        { flexDirection:'row', alignItems:'center', paddingVertical:14, gap:14 },
  menuIcon:       { width:38, height:38, borderRadius:10, alignItems:'center', justifyContent:'center' },
  menuLabel:      { flex:1, fontFamily:'Inter_400Regular', fontSize:15, color:C.textPri },
  menuValue:      { fontFamily:'Inter_400Regular', fontSize:13, color:C.textSec, marginRight:4 },
  guestHero:      { alignItems:'center', paddingVertical:32, marginBottom:24 },
  guestAvatarWrap:{ width:80, height:80, borderRadius:40, backgroundColor:C.bgCard, borderWidth:1.5, borderColor:C.border, alignItems:'center', justifyContent:'center', marginBottom:16 },
  guestTitle:     { fontFamily:'PlusJakartaSans_700Bold', fontSize:22, color:C.textPri, marginBottom:8 },
  guestSub:       { fontFamily:'Inter_400Regular', fontSize:14, color:C.textSec, textAlign:'center', lineHeight:22, marginBottom:24 },
  signInBtn:      { backgroundColor:C.primary, borderRadius:14, paddingHorizontal:32, paddingVertical:15 },
  signInBtnText:  { fontFamily:'Inter_600SemiBold', fontSize:15, color:'#fff' },
  signOutBtn:     { flexDirection:'row', alignItems:'center', justifyContent:'center', gap:10, margin:20, borderWidth:1.5, borderColor:C.danger+'40', borderRadius:14, paddingVertical:15 },
  signOutText:    { fontFamily:'Inter_600SemiBold', fontSize:15, color:C.danger },
});
