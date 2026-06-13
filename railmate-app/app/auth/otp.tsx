import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  TextInput,
  Pressable,
  Keyboard,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'phosphor-react-native';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Typography } from '../../components/ui/Typography/Typography';
import { Button } from '../../components/ui/Button/Button';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../hooks/useAuth';
import { useColorScheme } from 'nativewind';
import { Colors } from '../../constants/colors';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function OtpScreen() {
  const { colorScheme } = useColorScheme();
  const currentColors = Colors[colorScheme === 'light' ? 'light' : 'dark'];
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';
  const router = useRouter();
  const params = useLocalSearchParams<{
    contact: string;
    type: 'phone' | 'email';
  }>();

  const contact = params.contact ?? '';
  const contactType = (params.type as 'phone' | 'email') ?? 'phone';

  const { verifyOTP, signInWithPhone, signInWithEmail } = useAuth();

  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);

  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  const maskedContact = (() => {
    if (contactType === 'phone') {
      // +8801XXXXXXXXX -> +8801XXXX••••
      if (contact.length >= 4) {
        return contact.slice(0, -4) + '••••';
      }
      return contact;
    }
    // email masking: ab••@domain.com
    const [name, domain] = contact.split('@');
    if (!domain) return contact;
    const visible = name.slice(0, 2);
    return `${visible}${'•'.repeat(Math.max(name.length - 2, 2))}@${domain}`;
  })();

  const handleVerify = useCallback(
    async (code?: string) => {
      const otp = code ?? digits.join('');
      if (otp.length !== OTP_LENGTH) return;

      setError(null);
      setVerifying(true);
      Keyboard.dismiss();

      try {
        const { error: verifyError, isNewUser } = await verifyOTP(
          contact,
          otp,
          contactType
        );

        if (verifyError) {
          setError(verifyError);
          setVerifying(false);
          // Clear inputs on error
          setDigits(Array(OTP_LENGTH).fill(''));
          inputRefs.current[0]?.focus();
          return;
        }

        if (isNewUser) {
          router.replace('/auth/register' as any);
        } else {
          router.replace('/(tabs)');
        }
      } catch (e) {
        setError(String(e));
        setVerifying(false);
      }
    },
    [digits, contact, contactType, verifyOTP, router]
  );

  const handleChangeDigit = (text: string, index: number) => {
    // Handle paste of full code
    if (text.length > 1) {
      const pasted = text.replace(/[^0-9]/g, '').slice(0, OTP_LENGTH);
      const newDigits = Array(OTP_LENGTH).fill('');
      for (let i = 0; i < pasted.length; i++) {
        newDigits[i] = pasted[i];
      }
      setDigits(newDigits);
      if (pasted.length === OTP_LENGTH) {
        handleVerify(pasted);
      } else {
        inputRefs.current[pasted.length]?.focus();
      }
      return;
    }

    const sanitized = text.replace(/[^0-9]/g, '');
    const newDigits = [...digits];
    newDigits[index] = sanitized;
    setDigits(newDigits);

    if (sanitized && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (sanitized && index === OTP_LENGTH - 1) {
      const fullCode = newDigits.join('');
      if (fullCode.length === OTP_LENGTH) {
        handleVerify(fullCode);
      }
    }
  };

  const handleKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ) => {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      const newDigits = [...digits];
      newDigits[index - 1] = '';
      setDigits(newDigits);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || resending) return;
    setResending(true);
    setError(null);

    try {
      const result =
        contactType === 'phone'
          ? await signInWithPhone(contact)
          : await signInWithEmail(contact);

      if (result.error) {
        setError(result.error);
      } else {
        setSecondsLeft(RESEND_SECONDS);
        setDigits(Array(OTP_LENGTH).fill(''));
        inputRefs.current[0]?.focus();
      }
    } catch (e) {
      setError(String(e));
    } finally {
      setResending(false);
    }
  };

  return (
    <ScreenWrapper className="bg-bg-base">
      <View className="flex-1 px-6 pt-6">
        {/* Back button */}
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-bg-elevated items-center justify-center mb-8 border border-border"
        >
          <ArrowLeft size={20} color={currentColors['text-primary']} />
        </Pressable>

        {/* Headline */}
        <Typography
          variant="h1"
          className="text-text-primary mb-2"
          isBengali={isBengali}
        >
          {t('auth.otp_title')}
        </Typography>
        <Typography
          variant="body"
          className="text-text-secondary mb-10"
          isBengali={isBengali}
        >
          {t('auth.otp_sent')} {maskedContact}
        </Typography>

        {/* OTP Boxes */}
        <View className="flex-row justify-between mb-6">
          {digits.map((digit, index) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              value={digit}
              onChangeText={(text) => handleChangeDigit(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              keyboardType="number-pad"
              maxLength={OTP_LENGTH} // allow paste detection
              className="w-12 h-12 rounded-md bg-bg-card border border-border text-text-primary text-center text-lg"
              style={{
                fontSize: 20,
                fontWeight: '600',
              }}
              autoFocus={index === 0}
              selectTextOnFocus
              editable={!verifying}
            />
          ))}
        </View>

        {error && (
          <Typography
            variant="caption"
            className="text-danger mb-4"
            isBengali={isBengali}
          >
            {error}
          </Typography>
        )}

        {/* Resend */}
        <Pressable
          onPress={handleResend}
          disabled={secondsLeft > 0 || resending}
          className="self-center mb-8"
        >
          <Typography
            variant="caption"
            className={
              secondsLeft > 0 ? 'text-text-tertiary' : 'text-primary'
            }
            isBengali={isBengali}
          >
            {secondsLeft > 0
              ? `${t('auth.otp_resend')} (${secondsLeft}s)`
              : t('auth.otp_resend')}
          </Typography>
        </Pressable>

        {/* Verify Button */}
        <Button
          label={t('auth.otp_verify')}
          onPress={() => handleVerify()}
          className="w-full"
          isBengali={isBengali}
          isLoading={verifying}
          disabled={digits.join('').length !== OTP_LENGTH}
        />
      </View>
    </ScreenWrapper>
  );
}