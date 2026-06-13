import React, { useState } from 'react';
import { View, ScrollView, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Train,
  Phone,
  EnvelopeSimple,
  ArrowRight,
} from 'phosphor-react-native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import { Typography } from '../../components/ui/Typography/Typography';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { Card } from '../../components/ui/Card/Card';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../hooks/useAuth';
import { useColorScheme } from 'nativewind';
import { Colors } from '../../constants/colors'; // adjust path if colors live elsewhere

type Mode = 'phone' | 'email';

export default function LoginScreen() {
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';
  const router = useRouter();
  const { signInWithPhone, signInWithEmail } = useAuth();

  const [mode, setMode] = useState<Mode>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handlePhoneChange = (val: string) => {
    const digitsOnly = val.replace(/[^0-9]/g, '').slice(0, 10);
    setPhoneNumber(digitsOnly);
  };

  const handleContinue = async () => {
    setError(null);
    setSubmitting(true);

    try {
      if (mode === 'phone') {
        if (phoneNumber.length < 9) {
          setError(t('auth.invalid_phone') || 'Invalid phone number');
          setSubmitting(false);
          return;
        }
        const fullPhone = `+880${phoneNumber}`;
        const { error: signError } = await signInWithPhone(fullPhone);
        if (signError) {
          setError(signError);
          setSubmitting(false);
          return;
        }
        router.push({
          pathname: '/auth/otp',
          params: { contact: fullPhone, type: 'phone' },
        });
      } else {
        if (!email.includes('@')) {
          setError(t('auth.invalid_email') || 'Invalid email');
          setSubmitting(false);
          return;
        }
        const { error: signError } = await signInWithEmail(email);
        if (signError) {
          setError(signError);
          setSubmitting(false);
          return;
        }
        router.push({
          pathname: '/auth/otp',
          params: { contact: email, type: 'email' },
        });
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuest = () => {
    router.replace('/(tabs)');
  };

  return (
    <ScreenWrapper className="bg-bg-base">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-16 pb-8 justify-between">
          {/* Top: Logo + App Name */}
          <View>
            <View className="items-center mb-10">
              <View className="w-16 h-16 rounded-2xl bg-bg-elevated items-center justify-center mb-3 border border-border">
                <Train size={48} color={currentColors['primary']} weight="fill" />
              </View>
              <Typography variant="h3" className="text-text-primary">
                RailMate
              </Typography>
            </View>

            {/* Headline */}
            <Typography
              variant="h1"
              className="text-text-primary mb-2 text-center"
              isBengali={isBengali}
            >
              {t('auth.welcome')}
            </Typography>
            <Typography
              variant="body"
              className="text-text-secondary mb-8 text-center"
              isBengali={isBengali}
            >
              {t('auth.welcome_sub')}
            </Typography>

            {/* Tab Toggle */}
            <View className="flex-row bg-bg-card rounded-md p-1 mb-5 border border-border">
              <Pressable
                onPress={() => setMode('phone')}
                className={`flex-1 flex-row items-center justify-center gap-2 py-2.5 rounded-md ${
                  mode === 'phone' ? 'bg-primary' : ''
                }`}
              >
                <Phone
                  size={16}
                  color={
                    mode === 'phone'
                      ? currentColors['text-inverse']
                      : currentColors['text-secondary']
                  }
                  weight={mode === 'phone' ? 'fill' : 'regular'}
                />
                <Typography
                  variant="label"
                  className={
                    mode === 'phone'
                      ? 'text-text-inverse'
                      : 'text-text-secondary'
                  }
                  isBengali={isBengali}
                >
                  {t('auth.phone_tab')}
                </Typography>
              </Pressable>

              <Pressable
                onPress={() => setMode('email')}
                className={`flex-1 flex-row items-center justify-center gap-2 py-2.5 rounded-md ${
                  mode === 'email' ? 'bg-primary' : ''
                }`}
              >
                <EnvelopeSimple
                  size={16}
                  color={
                    mode === 'email'
                      ? currentColors['text-inverse']
                      : currentColors['text-secondary']
                  }
                  weight={mode === 'email' ? 'fill' : 'regular'}
                />
                <Typography
                  variant="label"
                  className={
                    mode === 'email'
                      ? 'text-text-inverse'
                      : 'text-text-secondary'
                  }
                  isBengali={isBengali}
                >
                  {t('auth.email_tab')}
                </Typography>
              </Pressable>
            </View>

            {/* Input Section */}
            {mode === 'phone' ? (
              <View className="mb-2">
                <Typography
                  variant="label"
                  className="text-text-secondary mb-2"
                  isBengali={isBengali}
                >
                  {t('auth.phone_label')}
                </Typography>
                <View className="flex-row items-center gap-2">
                  <View className="h-12 px-4 rounded-md bg-bg-card border border-border items-center justify-center flex-row">
                    <Typography variant="body" className="text-text-primary">
                      🇧🇩 +880
                    </Typography>
                  </View>
                  <View className="flex-1">
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
              <View className="mb-2">
                <Typography
                  variant="label"
                  className="text-text-secondary mb-2"
                  isBengali={isBengali}
                >
                  {t('auth.email_optional')}
                </Typography>
                <Input
                  value={email}
                  onChangeText={setEmail}
                  placeholder={t('auth.email_placeholder')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon={
                    <EnvelopeSimple
                      size={20}
                      color={currentColors['text-secondary']}
                    />
                  }
                  isBengali={isBengali}
                />
              </View>
            )}

            {error && (
              <Typography
                variant="caption"
                className="text-danger mt-2"
                isBengali={isBengali}
              >
                {error}
              </Typography>
            )}
          </View>

          {/* Bottom Actions */}
          <View className="mt-8">
            <Button
              label={t('auth.continue')}
              onPress={handleContinue}
              className="w-full"
              isBengali={isBengali}
              isLoading={submitting}
              icon={<ArrowRight size={18} color={currentColors['text-inverse']} />}
            />

            {/* Divider */}
            <View className="flex-row items-center my-5">
              <View className="flex-1 h-px bg-border" />
              <Typography
                variant="caption"
                className="text-text-tertiary px-3"
                isBengali={isBengali}
              >
                {t('common.or') || 'or'}
              </Typography>
              <View className="flex-1 h-px bg-border" />
            </View>

            <Button
              label={t('auth.guest')}
              onPress={handleGuest}
              variant="ghost"
              className="w-full"
              isBengali={isBengali}
            />

            <View className="flex-row justify-center mt-6 gap-1">
              <Typography
                variant="caption"
                className="text-text-secondary"
                isBengali={isBengali}
              >
                {t('auth.new_here')}
              </Typography>
              <Pressable onPress={() => router.push('/auth/register')}>
                <Typography
                  variant="caption"
                  className="text-primary"
                  isBengali={isBengali}
                >
                  {t('auth.create_account')}
                </Typography>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}