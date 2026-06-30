import React from 'react';
import { View, StyleSheet } from 'react-native';
import * as PhosphorIcons from 'phosphor-react-native';
import { AppText } from './AppText';
import { Button } from './Button/Button';
import { Colors } from '../../constants/colors';

interface EmptyStateProps {
  iconName: keyof typeof PhosphorIcons;
  title: string;
  description: string;
  ctaLabel?: string;
  onCta?: () => void;
}

/**
 * EmptyState - Centered empty state display
 * Shows icon, title, description, and optional CTA button
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  iconName,
  title,
  description,
  ctaLabel,
  onCta,
}) => {
  const Icon = PhosphorIcons[iconName] as any;

  return (
    <View style={styles.container}>
      {Icon && <Icon size={48} color={Colors.dark['text-tertiary']} weight="regular" />}

      <AppText variant="h3" align="center" style={styles.title}>
        {title}
      </AppText>

      <AppText
        variant="body"
        color={Colors.dark['text-secondary']}
        align="center"
        style={styles.description}
      >
        {description}
      </AppText>

      {ctaLabel && onCta && (
        <Button
          variant="primary"
          size="md"
          label={ctaLabel}
          onPress={onCta}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  title: {
    marginTop: 16,
  },
  description: {
    marginTop: 8,
    marginBottom: 24,
  },
});
