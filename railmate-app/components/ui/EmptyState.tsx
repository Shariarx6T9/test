import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import * as PhosphorIcons from 'phosphor-react-native';
import { AppText } from './AppText';
import { Button } from './Button/Button';
import { Colors } from '../../constants/colors';

const EMPTY_IMAGES: Record<string, any> = {
  'empty-search':       require('../../assets/images/empty-search.png'),
  'empty-saved-routes': require('../../assets/images/empty-saved-routes.png'),
  'empty-reports':      require('../../assets/images/empty-reports.png'),
};

interface EmptyStateProps {
  iconName: keyof typeof PhosphorIcons;
  title: string;
  description: string;
  ctaLabel?: string;
  onCta?: () => void;
  imageKey?: keyof typeof EMPTY_IMAGES;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  iconName,
  title,
  description,
  ctaLabel,
  onCta,
  imageKey,
}) => {
   
  const Icon = (PhosphorIcons as any)[iconName];
  const emptyImage = imageKey ? EMPTY_IMAGES[imageKey] : null;

  return (
    <View style={styles.container}>
      {emptyImage
        ? <Image source={emptyImage} style={styles.image} resizeMode="contain" />
        : Icon && <Icon size={48} color={Colors.dark['text-tertiary']} weight="regular" />
      }

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
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 8,
    opacity: 0.9,
  },
  title: {
    marginTop: 16,
  },
  description: {
    marginTop: 8,
    marginBottom: 24,
  },
});
