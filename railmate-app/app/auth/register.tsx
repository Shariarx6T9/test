import React, { useState } from 'react';
import { View, ScrollView, Pressable, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Camera, User as UserIcon } from 'phosphor-react-native';
import ScreenWrapper from '../../components/layout/ScreenWrapper';
import { Typography } from '../../components/ui/Typography/Typography';
import { Button } from '../../components/ui/Button/Button';
import { Input } from '../../components/ui/Input/Input';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../hooks/useAuth';
import supabase from '../../lib/supabase';
import { useColorScheme } from 'nativewind';
import { Colors } from '../../constants/colors';

export default function RegisterScreen() {
  const { colorScheme } = useColorScheme();
  const currentColors = Colors[colorScheme === 'light' ? 'light' : 'dark'];
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';
  const router = useRouter();
  const { register, user } = useAuth();

  const [displayName, setDisplayName] = useState(
    user?.display_name ?? ''
  );
  const [email, setEmail] = useState(user?.email ?? '');
  const [avatarUri, setAvatarUri] = useState<string | null>(
    user?.avatar_url ?? null
  );
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        t('auth.permission_needed') || 'Permission needed',
        t('auth.permission_message') ||
          'Please allow photo access to set a profile picture.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setAvatarUri(result.assets[0].uri);
    }
  };

  const uploadAvatar = async (uri: string): Promise<string | null> => {
    if (!user?.id) return null;

    try {
      setUploading(true);

      const response = await fetch(uri);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      const path = `${user.id}/profile.jpg`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        setError(uploadError.message);
        return null;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      return data.publicUrl;
    } catch (e) {
      setError(String(e));
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleCreateAccount = async () => {
    setError(null);

    if (!displayName.trim()) {
      setError(t('auth.name_required') || 'Name is required');
      return;
    }

    setSubmitting(true);

    try {
      let avatarUrl: string | undefined;

      if (avatarUri && !avatarUri.startsWith('http')) {
        const uploadedUrl = await uploadAvatar(avatarUri);
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      } else if (avatarUri) {
        avatarUrl = avatarUri;
      }

      const { error: registerError } = await register(
        displayName.trim(),
        avatarUrl
      );

      if (registerError) {
        setError(registerError);
        setSubmitting(false);
        return;
      }

      router.replace('/(tabs)');
    } catch (e) {
      setError(String(e));
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    router.replace('/(tabs)');
  };

  return (
    <ScreenWrapper className="bg-bg-base">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-12 pb-8">
          <Typography
            variant="h1"
            className="text-text-primary mb-8 text-center"
            isBengali={isBengali}
          >
            {t('auth.register_title')}
          </Typography>

          {/* Avatar Upload */}
          <Pressable
            onPress={pickImage}
            className="self-center mb-8"
            disabled={uploading}
          >
            <View className="w-24 h-24 rounded-full bg-bg-card border border-border items-center justify-center overflow-hidden">
              {avatarUri ? (
                <Image
                  source={{ uri: avatarUri }}
                  className="w-24 h-24"
                  resizeMode="cover"
                />
              ) : (
                <Camera size={32} color={currentColors['text-secondary']} />
              )}
            </View>
            <Typography
              variant="caption"
              className="text-primary text-center mt-2"
              isBengali={isBengali}
            >
              {t('auth.add_photo')}
            </Typography>
          </Pressable>

          {/* Display Name */}
          <View className="mb-4">
            <Typography
              variant="label"
              className="text-text-secondary mb-2"
              isBengali={isBengali}
            >
              {t('auth.display_name')}
            </Typography>
            <Input
              value={displayName}
              onChangeText={setDisplayName}
              placeholder={t('auth.display_name_placeholder')}
              isBengali={isBengali}
            />
          </View>

          {/* Email (optional) */}
          {!user?.email && (
            <View className="mb-4">
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
                isBengali={isBengali}
              />
            </View>
          )}

          {error && (
            <Typography
              variant="caption"
              className="text-danger mb-2"
              isBengali={isBengali}
            >
              {error}
            </Typography>
          )}

          {/* Spacer */}
          <View className="flex-1" />

          {/* Create Account */}
          <Button
            label={t('auth.create_account')}
            onPress={handleCreateAccount}
            className="w-full mb-4"
            isBengali={isBengali}
            isLoading={submitting || uploading}
          />

          {/* Skip */}
          <Pressable onPress={handleSkip} className="self-center">
            <Typography
              variant="caption"
              className="text-text-secondary"
              isBengali={isBengali}
            >
              {t('auth.skip')}
            </Typography>
          </Pressable>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
}