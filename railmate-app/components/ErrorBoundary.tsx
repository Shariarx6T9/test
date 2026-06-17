import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface Props {
  children: React.ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
}

/**
 * Class-based error boundary — must stay a class component because React
 * doesn't support getDerivedStateFromError / componentDidCatch in hooks yet.
 *
 * Uses static color tokens directly (not via useThemeColors hook, which
 * can't be called inside a class) so that the fallback UI looks correct in
 * both dark and light themes.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production Sentry will capture this automatically via Sentry.wrap().
    // The console log keeps it visible during development.
    console.error(`[ErrorBoundary:${this.props.name ?? 'unknown'}]`, error, info);
  }

  render() {
    if (this.state.hasError) {
      // Pull colors from both palettes so we render correctly regardless of
      // system theme. We default to dark since it's the app's primary theme.
      const dark = Colors.dark;
      return (
        <View style={[styles.root, { backgroundColor: dark['bg-base'] }]}>
          <View style={[styles.iconBox, { backgroundColor: dark['danger-subtle'] }]}>
            <Text style={styles.iconText}>⚠️</Text>
          </View>
          <Text style={[styles.title, { color: dark['text-primary'] }]}>
            Something went wrong
          </Text>
          <Text style={[styles.body, { color: dark['text-secondary'] }]}>
            {this.props.name
              ? `The ${this.props.name} screen encountered an unexpected error.`
              : 'An unexpected error occurred. Please try again.'}
          </Text>
          <Pressable
            onPress={() => this.setState({ hasError: false })}
            style={[styles.btn, { backgroundColor: dark['primary'] }]}
          >
            <Text style={[styles.btnText, { color: dark['text-inverse'] }]}>
              Try Again
            </Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  root:    { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  iconBox: { width: 64, height: 64, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  iconText:{ fontSize: 28 },
  title:   { fontFamily: 'Inter_600SemiBold', fontSize: 18, marginBottom: 10, textAlign: 'center' },
  body:    { fontFamily: 'Inter_400Regular', fontSize: 14, lineHeight: 22, textAlign: 'center', marginBottom: 28 },
  btn:     { paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14 },
  btnText: { fontFamily: 'Inter_600SemiBold', fontSize: 15 },
});
