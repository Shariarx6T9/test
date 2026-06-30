import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { AppText } from '../../components/ui/AppText';
import { Button } from '../../components/ui/Button/Button';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

export default function VerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { verifyOTP } = useAuth();

  const contact = params.contact as string;
  const type = (params.type as 'phone' | 'email') || 'phone';

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(30);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { error: verifyError } = await verifyOTP(contact, otp, type);
      if (verifyError) {
        setError(verifyError);
      } else {
        // Success - redirect to home or back to previous screen
        const redirect = params.redirect as string;
        if (redirect) {
          router.replace(redirect as any);
        } else {
          router.replace('/(tabs)' as any);
        }
      }
    } catch (e) {
      setError('Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    // TODO: Implement resend OTP
    setResendCooldown(30);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <View style={styles.header}>
          <AppText variant="displayMd" style={styles.title}>
            Verify {type === 'phone' ? 'Phone' : 'Email'}
          </AppText>
          <AppText variant="body" color={Colors.dark['text-secondary']} style={styles.subtitle}>
            Enter the 6-digit code sent to
          </AppText>
          <AppText variant="body" color={Colors.dark.primary}>
            {contact}
          </AppText>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="000000"
            placeholderTextColor={Colors.dark['text-tertiary']}
            value={otp}
            onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, '').slice(0, 6))}
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
          />

          {error && (
            <AppText variant="caption" color={Colors.dark.danger} style={styles.error}>
              {error}
            </AppText>
          )}

          <Button
            variant="primary"
            size="lg"
            label={loading ? 'Verifying...' : 'Verify'}
            onPress={handleVerify}
            loading={loading}
            disabled={otp.length !== 6 || loading}
            fullWidth
            style={styles.button}
          />

          <Button
            variant="ghost"
            size="md"
            label={
              resendCooldown > 0
                ? `Resend code in ${resendCooldown}s`
                : 'Resend code'
            }
            onPress={handleResend}
            disabled={resendCooldown > 0}
            fullWidth
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark['bg-base'],
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing['2xl'],
    justifyContent: 'center',
  },
  header: {
    marginBottom: Spacing['3xl'],
  },
  title: {
    marginBottom: Spacing.sm,
  },
  subtitle: {
    marginBottom: Spacing.xs,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: Colors.dark['bg-card'],
    borderWidth: 1.5,
    borderColor: Colors.dark.border,
    borderRadius: 10,
    padding: Spacing.lg,
    color: Colors.dark['text-primary'],
    fontSize: 32,
    fontFamily: 'JetBrainsMono_500Medium',
    textAlign: 'center',
    letterSpacing: 8,
    marginBottom: Spacing.md,
  },
  error: {
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  button: {
    marginBottom: Spacing.md,
  },
});
