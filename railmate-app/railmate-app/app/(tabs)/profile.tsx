import React from 'react';
import { View, ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SignOut, Crown, BookmarkSimple, Bell, Gear, Question, Info } from 'phosphor-react-native';
import { useAuth } from '../../hooks/useAuth';
import { useUserProfile } from '../../hooks/useUserProfile';
import { AppText } from '../../components/ui/AppText';
import { Avatar } from '../../components/ui/Avatar/Avatar';
import { Card } from '../../components/ui/Card/Card';
import { Badge } from '../../components/ui/Badge/Badge';
import { SignInPrompt } from '../../components/features';
import { Colors } from '../../constants/colors';
import { Spacing } from '../../constants/spacing';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isGuest, isPremium, signOut, displayName, avatarUrl } = useAuth();
  const { data: profile } = useUserProfile();

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
            router.replace('/(tabs)' as any);
          },
        },
      ]
    );
  };

  // Guest users see sign-in prompt
  if (isGuest) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <AppText variant="h1">Profile</AppText>
        </View>
        <View style={styles.guestContainer}>
          <SignInPrompt message="Sign in to track your activity and unlock all features" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* Header */}
        <View style={styles.profileHeader}>
          <Avatar
            uri={avatarUrl || undefined}
            name={displayName}
            size={80}
          />
          <AppText variant="h2" style={styles.displayName}>{displayName}</AppText>

          {/* Premium Badge or Upgrade CTA */}
          {isPremium ? (
            <Badge
              label="Pro Member"
              variant="success"
            />
          ) : (
            <Pressable onPress={() => router.push('/premium/upgrade' as any)}>
              <Card style={styles.upgradeCard}>
                <Crown size={24} color={Colors.dark.accent} weight="fill" />
                <View style={styles.upgradeText}>
                  <AppText variant="labelLg" color={Colors.dark['text-primary']}>
                    Upgrade to Pro
                  </AppText>
                  <AppText variant="caption" color={Colors.dark['text-secondary']}>
                    Unlock unlimited features
                  </AppText>
                </View>
              </Card>
            </Pressable>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <AppText variant="h3">{profile?.report_count || 0}</AppText>
            <AppText variant="caption" color={Colors.dark['text-secondary']}>Reports</AppText>
          </View>
          <View style={styles.stat}>
            <AppText variant="h3">{profile?.helpful_vote_count || 0}</AppText>
            <AppText variant="caption" color={Colors.dark['text-secondary']}>Helpful</AppText>
          </View>
          <View style={styles.stat}>
            <AppText variant="h3">{profile?.trust_score?.toFixed(1) || '0.0'}</AppText>
            <AppText variant="caption" color={Colors.dark['text-secondary']}>Trust Score</AppText>
          </View>
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          <MenuItem
            icon={<BookmarkSimple size={24} color={Colors.dark.primary} />}
            label="Saved Routes"
            onPress={() => {
              // TODO: Navigate to saved routes screen
            }}
          />
          <MenuItem
            icon={<Bell size={24} color={Colors.dark.primary} />}
            label="Alerts & Reminders"
            onPress={() => router.push('/notifications' as any)}
          />
          <MenuItem
            icon={<Gear size={24} color={Colors.dark.primary} />}
            label="Settings"
            onPress={() => router.push('/settings' as any)}
          />
          <MenuItem
            icon={<Question size={24} color={Colors.dark.primary} />}
            label="Help & Support"
            onPress={() => {
              // TODO: Navigate to help screen
            }}
          />
          <MenuItem
            icon={<Info size={24} color={Colors.dark.primary} />}
            label="About"
            onPress={() => {
              // TODO: Navigate to about screen
            }}
          />
          <MenuItem
            icon={<SignOut size={24} color={Colors.dark.danger} />}
            label="Sign Out"
            onPress={handleSignOut}
            danger
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  danger?: boolean;
}

function MenuItem({ icon, label, onPress, danger }: MenuItemProps) {
  return (
    <Pressable style={styles.menuItem} onPress={onPress}>
      {icon}
      <AppText
        variant="body"
        color={danger ? Colors.dark.danger : Colors.dark['text-primary']}
        style={styles.menuLabel}
      >
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark['bg-base'],
  },
  header: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.base,
    paddingBottom: Spacing.md,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.base,
  },
  scroll: {
    paddingBottom: Spacing['3xl'],
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: Spacing['2xl'],
  },
  displayName: {
    marginTop: Spacing.base,
    marginBottom: Spacing.sm,
  },
  upgradeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    marginTop: Spacing.md,
  },
  upgradeText: {
    marginLeft: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.base,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.dark.border,
  },
  stat: {
    alignItems: 'center',
  },
  menu: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.lg,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.border,
  },
  menuLabel: {
    marginLeft: Spacing.base,
    flex: 1,
  },
});
