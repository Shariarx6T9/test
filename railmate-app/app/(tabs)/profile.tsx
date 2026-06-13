import React from 'react';
import { View, ScrollView, Pressable, Image } from 'react-native';
import { useRouter } from 'expo-router';
import {
  User as UserIcon,
  CaretRight,
  Globe,
  Moon,
  SignOut,
  PencilSimple,
} from 'phosphor-react-native';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Typography } from '../../components/ui/Typography/Typography';
import { Button } from '../../components/ui/Button/Button';
import { Card } from '../../components/ui/Card/Card';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../hooks/useAuth';
import { useColorScheme } from 'nativewind';
import { Colors } from '../../constants/colors';

function getInitials(name?: string | null): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function ProfileScreen() {
  const { colorScheme } = useColorScheme();
  const currentColors = Colors[colorScheme === 'light' ? 'light' : 'dark'];
  const { t, locale, setLocale } = useTranslation();
  const isBengali = locale === 'bn';
  const router = useRouter();
  const { user, isAuthenticated, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/auth/login');
  };

  const toggleLanguage = () => {
    setLocale?.(locale === 'bn' ? 'en' : 'bn');
  };

  // ───────────────────────────────────────
  // GUEST VIEW
  // ───────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <ScreenWrapper className="bg-bg-base">
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-6 pt-16 items-center">
            <View className="w-24 h-24 rounded-full bg-bg-elevated border border-border items-center justify-center mb-4">
              <UserIcon size={40} color={currentColors['text-tertiary']} />
            </View>

            <Typography
              variant="h3"
              className="text-text-primary mb-1"
              isBengali={isBengali}
            >
              {t('auth.guest_user') || 'Guest User'}
            </Typography>

            <Typography
              variant="body"
              className="text-text-secondary mb-8 text-center"
              isBengali={isBengali}
            >
              {t('auth.guest_subtitle') ||
                'Sign in to save routes and get personalized alerts'}
            </Typography>

            <Button
              label={t('auth.create_account')}
              onPress={() => router.push('/auth/login')}
              className="w-full mb-3"
              isBengali={isBengali}
            />

            <Button
              label={t('auth.sign_in')}
              onPress={() => router.push('/auth/login')}
              variant="ghost"
              className="w-full"
              isBengali={isBengali}
            />
          </View>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  // ───────────────────────────────────────
  // AUTHENTICATED VIEW
  // ───────────────────────────────────────
  const displayName = user?.display_name || t('auth.guest_user') || 'User';
  const contactLine = user?.phone || user?.email || '';

  return (
    <ScreenWrapper className="bg-bg-base">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-6 pt-12">
          {/* Avatar + Name */}
          <View className="items-center mb-8">
            <View className="w-24 h-24 rounded-full bg-bg-elevated border border-border items-center justify-center overflow-hidden mb-3">
              {user?.avatar_url ? (
                <Image
                  source={{ uri: user.avatar_url }}
                  className="w-24 h-24"
                  resizeMode="cover"
                />
              ) : (
                <Typography variant="h1" className="text-text-primary">
                  {getInitials(user?.display_name)}
                </Typography>
              )}
            </View>
            <Typography
              variant="h3"
              className="text-text-primary"
              isBengali={isBengali}
            >
              {displayName}
            </Typography>
            {contactLine && (
              <Typography variant="caption" className="text-text-secondary mt-1">
                {contactLine}
              </Typography>
            )}
          </View>

          {/* Settings Section */}
          <Typography
            variant="label"
            className="text-text-tertiary mb-2 ml-1"
            isBengali={isBengali}
          >
            {t('profile.settings') || 'Settings'}
          </Typography>

          <Card className="mb-6 overflow-hidden p-0">
            <Pressable
              onPress={toggleLanguage}
              className="flex-row items-center justify-between px-4 py-4 border-b border-border"
            >
              <View className="flex-row items-center gap-3">
                <Globe size={20} color={currentColors['text-secondary']} />
                <Typography
                  variant="body"
                  className="text-text-primary"
                  isBengali={isBengali}
                >
                  {t('profile.language') || 'Language'}
                </Typography>
              </View>
              <View className="flex-row items-center gap-2">
                <Typography
                  variant="caption"
                  className="text-text-secondary"
                  isBengali={isBengali}
                >
                  {locale === 'bn' ? 'বাংলা' : 'English'}
                </Typography>
                <CaretRight size={16} color={currentColors['text-tertiary']} />
              </View>
            </Pressable>

            <Pressable className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-row items-center gap-3">
                <Moon size={20} color={currentColors['text-secondary']} />
                <Typography
                  variant="body"
                  className="text-text-primary"
                  isBengali={isBengali}
                >
                  {t('profile.theme') || 'Theme'}
                </Typography>
              </View>
              <View className="flex-row items-center gap-2">
                <Typography
                  variant="caption"
                  className="text-text-secondary"
                  isBengali={isBengali}
                >
                  {user?.theme_pref === 'light'
                    ? t('profile.light') || 'Light'
                    : user?.theme_pref === 'system'
                    ? t('profile.system') || 'System'
                    : t('profile.dark') || 'Dark'}
                </Typography>
                <CaretRight size={16} color={currentColors['text-tertiary']} />
              </View>
            </Pressable>
          </Card>

          {/* Account Section */}
          <Typography
            variant="label"
            className="text-text-tertiary mb-2 ml-1"
            isBengali={isBengali}
          >
            {t('profile.account') || 'Account'}
          </Typography>

          <Card className="overflow-hidden p-0">
            <Pressable
              onPress={() => router.push('/auth/register')}
              className="flex-row items-center justify-between px-4 py-4 border-b border-border"
            >
              <View className="flex-row items-center gap-3">
                <PencilSimple size={20} color={currentColors['text-secondary']} />
                <Typography
                  variant="body"
                  className="text-text-primary"
                  isBengali={isBengali}
                >
                  {t('auth.edit_profile')}
                </Typography>
              </View>
              <CaretRight size={16} color={currentColors['text-tertiary']} />
            </Pressable>

            <Pressable
              onPress={handleSignOut}
              className="flex-row items-center justify-between px-4 py-4"
            >
              <View className="flex-row items-center gap-3">
                <SignOut size={20} color={currentColors['danger']} />
                <Typography
                  variant="body"
                  className="text-danger"
                  isBengali={isBengali}
                >
                  {t('auth.sign_out')}
                </Typography>
              </View>
            </Pressable>
          </Card>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}