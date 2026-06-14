import React, { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { Train, Phone, EnvelopeSimple, ArrowRight } from 'phosphor-react-native';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Input } from '../../components/ui/Input/Input';
import { Button } from '../../components/ui/Button/Button';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../hooks/useAuth';
import { useAuthStore } from '../../stores/authStore';

const C = {
  bgBase:    '#080D17',
  bgCard:    '#162035',
  primary:   '#00A859',
  textPri:   '#F0F4FF',
  textSec:   '#8FA3C0',
  textTer:   '#4E6480',
  border:    '#1E2E42',
  danger:    '#E8394B',
  inverse:   '#080D17',
};

type Mode = 'phone' | 'email';

export default function LoginScreen() {
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';
  const router = useRouter();
  const { signInWithPhone, signInWithEmail } = useAuth();
  const { setGuest } = useAuthStore();

  const [mode, setMode]               = useState<Mode>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail]             = useState('');
  const [error, setError]             = useState<string | null>(null);
  const [submitting, setSubmitting]   = useState(false);

  const handlePhoneChange = (val: string) =>
    setPhoneNumber(val.replace(/[^0-9]/g, '').slice(0, 10));

  const handleContinue = async () => {
    setError(null);

    // Detect unconfigured backend
    const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
    const isConfigured = supabaseUrl && supabaseUrl !== 'https://placeholder.supabase.co' && supabaseUrl.trim() !== '';
    if (!isConfigured) {
      setError('Backend not configured. Please continue as guest for now.');
      return;
    }

    setSubmitting(true);
    try {
      if (mode === 'phone') {
        if (phoneNumber.length < 9) { setError(t('auth.invalid_phone') || 'Invalid phone'); setSubmitting(false); return; }
        const full = `+880${phoneNumber}`;
        const { error: e } = await signInWithPhone(full);
        if (e) { setError(e); setSubmitting(false); return; }
        router.push({ pathname: '/auth/otp' as any, params: { contact: full, type: 'phone' } });
      } else {
        if (!email.includes('@')) { setError(t('auth.invalid_email') || 'Invalid email'); setSubmitting(false); return; }
        const { error: e } = await signInWithEmail(email);
        if (e) { setError(e); setSubmitting(false); return; }
        router.push({ pathname: '/auth/otp' as any, params: { contact: email, type: 'email' } });
      }
    } catch (ex) {
      const msg = ex instanceof Error ? ex.message : String(ex);
      if (msg.includes('Network') || msg.includes('fetch')) {
        setError('Network error. Check your connection or continue as guest.');
      } else {
        setError(msg);
      }
    }
    finally { setSubmitting(false); }
  };

  const handleGuest = () => { setGuest(true); router.replace('/(tabs)'); };

  const F = isBengali
    ? { regular: 'NotoSansBengali_400Regular', semi: 'NotoSansBengali_600SemiBold' }
    : { regular: 'Inter_400Regular', semi: 'Inter_600SemiBold' };

  return (
    <ScreenWrapper withPadding={false}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        <View style={s.page}>

          {/* Logo */}
          <View style={s.logoWrap}>
            <View style={s.logoBox}>
              <Train size={40} color={C.primary} weight="fill" />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', marginTop: 10 }}>
              <Text style={[s.brand, { color: C.textPri, fontFamily: 'PlusJakartaSans_700Bold' }]}>Rail</Text>
              <Text style={[s.brand, { color: C.primary,  fontFamily: 'PlusJakartaSans_700Bold' }]}>Mate</Text>
            </View>
            <Text style={[s.brandSub, { fontFamily: F.regular }]}>Bangladesh</Text>
          </View>

          {/* Headline */}
          <View style={{ marginBottom: 28 }}>
            <Text style={[s.h1, { color: C.textPri, textAlign: 'center', fontFamily: 'PlusJakartaSans_700Bold' }]}>
              {t('auth.welcome')}
            </Text>
            <Text style={[s.sub, { color: C.textSec, textAlign: 'center', marginTop: 8, fontFamily: F.regular }]}>
              {t('auth.welcome_sub')}
            </Text>
          </View>

          {/* Mode toggle */}
          <View style={s.tabRow}>
            {(['phone', 'email'] as Mode[]).map((m) => {
              const active = mode === m;
              return (
                <Pressable key={m} onPress={() => setMode(m)} style={[s.tab, active && s.tabActive]}>
                  {m === 'phone'
                    ? <Phone size={16} color={active ? C.inverse : C.textSec} weight={active ? 'fill' : 'regular'} />
                    : <EnvelopeSimple size={16} color={active ? C.inverse : C.textSec} weight={active ? 'fill' : 'regular'} />}
                  <Text style={[s.tabLabel, { color: active ? C.inverse : C.textSec, fontFamily: 'Inter_500Medium' }]}>
                    {m === 'phone' ? t('auth.phone_tab') : t('auth.email_tab')}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* Input */}
          {mode === 'phone' ? (
            <View style={{ marginBottom: 8 }}>
              <Text style={[s.inputLabel, { color: C.textSec, fontFamily: 'Inter_500Medium' }]}>{t('auth.phone_label')}</Text>
              <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                <View style={s.countryCode}>
                  <Text style={[s.countryText, { fontFamily: 'Inter_400Regular', color: C.textPri }]}>🇧🇩 +880</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Input
                    value={phoneNumber}
                    onChangeText={handlePhoneChange}
                    placeholder={t('auth.phone_placeholder')}
                    keyboardType="number-pad"
                    maxLength={10}
                    isBengali={isBengali}
                  />
                </View>
              </View>
            </View>
          ) : (
            <View style={{ marginBottom: 8 }}>
              <Text style={[s.inputLabel, { color: C.textSec, fontFamily: 'Inter_500Medium' }]}>{t('auth.email_optional')}</Text>
              <Input
                value={email}
                onChangeText={setEmail}
                placeholder={t('auth.email_placeholder')}
                keyboardType="email-address"
                autoCapitalize="none"
                isBengali={isBengali}
              />
            </View>
          )}

          {!!error && (
            <View style={{ marginTop: 8 }}>
              <Text style={[s.errorText, { fontFamily: 'Inter_400Regular' }]}>{error}</Text>
              {(error.includes('Network') || error.includes('Backend not configured')) && (
                <Pressable
                  onPress={handleGuest}
                  style={{ marginTop: 12, backgroundColor: '#00A859', borderRadius: 12, paddingVertical: 14, alignItems: 'center' }}
                >
                  <Text style={{ fontFamily: 'Inter_600SemiBold', fontSize: 15, color: '#fff' }}>
                    Continue as Guest →
                  </Text>
                </Pressable>
              )}
            </View>
          )}

          {/* Actions */}
          <View style={s.actions}>
            <Button label={t('auth.continue')} onPress={handleContinue} isLoading={submitting} icon={ArrowRight} iconPosition="right" size="lg" isBengali={isBengali} style={{ width: '100%' }} />

            <View style={s.divider}>
              <View style={s.dividerLine} />
              <Text style={[s.orText, { fontFamily: 'Inter_400Regular' }]}>{t('common.or') || 'or'}</Text>
              <View style={s.dividerLine} />
            </View>

            <Button label={t('auth.guest')} onPress={handleGuest} variant="ghost" size="lg" isBengali={isBengali} style={{ width: '100%' }} />

            <View style={s.signupRow}>
              <Text style={[s.signupText, { fontFamily: 'Inter_400Regular', color: C.textSec }]}>{t('auth.new_here')}</Text>
              <Pressable onPress={() => router.push('/auth/register' as any)}>
                <Text style={[s.signupLink, { fontFamily: 'Inter_500Medium', color: C.primary }]}>{t('auth.create_account')}</Text>
              </Pressable>
            </View>
          </View>

        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  page:        { flex: 1, paddingHorizontal: 24, paddingTop: 56, paddingBottom: 40 },
  logoWrap:    { alignItems: 'center', marginBottom: 36 },
  logoBox:     { width: 72, height: 72, borderRadius: 20, backgroundColor: '#162035', borderWidth: 1, borderColor: '#1E2E42', alignItems: 'center', justifyContent: 'center' },
  brand:       { fontSize: 28, lineHeight: 36 },
  brandSub:    { fontSize: 13, color: '#4E6480', marginTop: 2 },
  h1:          { fontSize: 26, lineHeight: 34 },
  sub:         { fontSize: 14, lineHeight: 22 },
  tabRow:      { flexDirection: 'row', backgroundColor: '#162035', borderRadius: 12, padding: 4, marginBottom: 20, borderWidth: 1, borderColor: '#1E2E42' },
  tab:         { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10, gap: 6 },
  tabActive:   { backgroundColor: '#00A859' },
  tabLabel:    { fontSize: 13 },
  inputLabel:  { fontSize: 12, marginBottom: 8, marginLeft: 2 },
  countryCode: { height: 48, paddingHorizontal: 14, borderRadius: 10, backgroundColor: '#162035', borderWidth: 1.5, borderColor: '#1E2E42', alignItems: 'center', justifyContent: 'center' },
  countryText: { fontSize: 14 },
  errorText:   { color: '#E8394B', fontSize: 12, marginTop: 6, marginLeft: 2 },
  actions:     { marginTop: 28 },
  divider:     { flexDirection: 'row', alignItems: 'center', marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#1E2E42' },
  orText:      { color: '#4E6480', fontSize: 12, paddingHorizontal: 12 },
  signupRow:   { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 24, gap: 4 },
  signupText:  { fontSize: 13 },
  signupLink:  { fontSize: 13 },
});
