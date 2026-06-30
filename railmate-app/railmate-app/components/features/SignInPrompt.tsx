import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { UserCircle } from 'phosphor-react-native';
import { AppText } from '../ui/AppText';
import { Button } from '../ui/Button/Button';
import { Colors } from '../../constants/colors';

interface SignInPromptProps {
  message: string;
  compact?: boolean;
}

/**
 * SignInPrompt - Reusable component for guest gates
 * Shows when user needs to sign in to access a feature
 */
export function SignInPrompt({ message, compact = false }: SignInPromptProps) {
  const router = useRouter();

  const handleSignIn = () => {
    router.push('/auth' as any);
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <AppText variant="body" color={Colors.dark['text-secondary']} style={styles.compactText}>
          {message}
        </AppText>
        <Button
          variant="secondary"
          size="sm"
          label="Sign In"
          onPress={handleSignIn}
        />
      </View>
    );
  }

  return (
    <View style={styles.fullContainer}>
      <View style={styles.iconContainer}>
        <UserCircle size={64} color={Colors.dark['text-tertiary']} weight="thin" />
      </View>
      <AppText variant="h3" style={styles.title}>
        {message}
      </AppText>
      <AppText variant="body" color={Colors.dark['text-secondary']} style={styles.subtitle}>
        Sign in to unlock all features
      </AppText>
      <Button
        variant="primary"
        size="lg"
        label="Sign In"
        onPress={handleSignIn}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  fullContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    backgroundColor: Colors.dark['bg-base'],
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
  },
  button: {
    minWidth: 200,
  },
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: Colors.dark['bg-card'],
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.dark.border,
  },
  compactText: {
    flex: 1,
    marginRight: 16,
  },
});
