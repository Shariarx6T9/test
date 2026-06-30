import React, { useState } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';
import { AppText } from '../../components/ui/AppText';
import { Button } from '../../components/ui/Button/Button';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

export default function AuthScreen() {
  const router = useRouter();
  const { signInWithPhone, signInWithEmail } = useAuth();
  const [mode, setMode] = useState<'phone' | 'email'>('phone');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleContinue = async () => {
    setError(null);
    setLoading(true);

    try {
      if (mode === 'phone') {
        const { error: phoneError } = await signInWithPhone(input);
        if (phoneError) {
          setError(phoneError);
        } else {
          router.push({ pathname: '/auth/verify', params: { contact: input, type: 'phone' } } as any);
        }
      } else {
        const { error: emailError } = await signInWithEmail(input);
        if (emailError) {
          setError(emailError);
        } else {
          setError(null);
          // Show success message for email
          alert('Check your email for the sign-in link');
        }
      }
    } catch (e) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuest = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <View style={styles.header}>
          <AppText variant="displayMd" style={styles.title}>Welcome</AppText>
          <AppText variant="body" color={Colors.dark['text-secondary']} style={styles.subtitle}>
            Sign in to access all features
          </AppText>
        </View>

        <View style={styles.form}>
          <AppText variant="label" style={styles.label}>
            {mode === 'phone' ? 'Phone Number' : 'Email Address'}
          </AppText>
          <TextInput
            style={styles.input}
            placeholder={mode === 'phone' ? '+880 1712345678' : 'your@email.com'}
            placeholderTextColor={Colors.dark['text-tertiary']}
            value={input}
            onChangeText={setInput}
            keyboardType={mode === 'phone' ? 'phone-pad' : 'email-address'}
            autoCapitalize="none"
            autoCorrect={false}
          />

          {error && (
            <AppText variant="caption" color={Colors.dark.danger} style={styles.error}>
              {error}
            </AppText>
          )}

          <Button
            variant="primary"
            size="lg"
            label={loading ? 'Sending...' : 'Continue'}
            onPress={handleContinue}
            loading={loading}
            disabled={!input || loading}
            fullWidth
            style={styles.button}
          />

          <Button
            variant="ghost"
            size="md"
            label={mode === 'phone' ? 'Continue with Email' : 'Continue with Phone'}
            onPress={() => {
              setMode(mode === 'phone' ? 'email' : 'phone');
              setInput('');
              setError(null);
            }}
            fullWidth
          />

          <Button
            variant="ghost"
            size="md"
            label="Continue as Guest"
            onPress={handleGuest}
            fullWidth
            style={styles.guestButton}
          />
        </View>
      </KeyboardAvoidingView>
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
  label: {
    marginBottom: Spacing.sm,
  },
  input: {
    backgroundColor: Colors.dark['bg-card'],
    borderWidth: 1.5,
    borderColor: Colors.dark.border,
    borderRadius: 10,
    padding: Spacing.base,
    color: Colors.dark['text-primary'],
    fontSize: 16,
    marginBottom: Spacing.md,
  },
  error: {
    marginBottom: Spacing.md,
  },
  button: {
    marginBottom: Spacing.md,
  },
  guestButton: {
    marginTop: Spacing.lg,
  },
});
