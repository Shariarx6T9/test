// app/profile-edit.tsx
import React, { useState } from 'react';
import { ArrowLeft } from 'phosphor-react-native';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Radius, Spacing, Typography } from '../constants';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { useTranslation } from '../i18n';
import { Avatar } from '../components/ui/Avatar/Avatar';

export default function ProfileEditScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, setUser } = useAuthStore();
  const [displayName, setDisplayName] = useState(user?.display_name ?? '');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url ?? '');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleSave = async () => {
    if (!user?.id) return;
    if (!displayName.trim()) {
      Alert.alert('Error', 'Display name is required');
      return;
    }

    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('users')
        .upsert({
          id: user.id,
          display_name: displayName.trim(),
          phone: phone.trim() || null,
          avatar_url: avatarUrl || null,
          email: user.email || null,
        })
        .select()
        .single();

      if (error) throw error;

      setUser(data);
      Alert.alert('Success', 'Profile updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Please allow access to your photo library');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (result.canceled) return;

    const imageUri = result.assets[0].uri;
    setIsUploadingImage(true);

    try {
      // FIX: path must be "{user.id}/avatar.jpg" — this is what every RLS
      // policy on this bucket actually checks via storage.foldername(name).
      // The previous flat filename ("avatar-{id}-{timestamp}.jpg") had no
      // folder component at all, so every policy's ownership check silently
      // evaluated to NULL and every upload was rejected.
      //
      // Fixed (non-timestamped) filename is intentional: each new photo
      // overwrites the previous one via upsert:true instead of leaving old
      // avatars orphaned in storage forever.
      const filePath = `${user?.id}/avatar.jpg`;
      const fileObject = { uri: imageUri, type: 'image/jpeg', name: 'avatar.jpg' } as any;

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, fileObject, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (error) throw error;

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      // Cache-bust: since the path is now fixed (not timestamped), the
      // public URL is identical on every upload. Without this, RN's Image
      // cache (and any CDN in front of Supabase Storage) will keep showing
      // the OLD photo after a successful re-upload, because from the
      // client's perspective it's "the same URL it already has cached."
      const freshUrl = `${urlData.publicUrl}?t=${Date.now()}`;
      setAvatarUrl(freshUrl);

      // Persist immediately — don't make the photo's fate depend on the
      // user also remembering to tap "Save Changes" afterward. The success
      // message below promises the photo is saved; this makes that true.
      const { data: savedUser, error: saveError } = await supabase
        .from('users')
        .upsert({ id: user?.id, avatar_url: freshUrl })
        .select()
        .single();

      if (saveError) throw saveError;
      if (savedUser) setUser(savedUser);

      Alert.alert('Success', 'Photo uploaded successfully');
    } catch (err: any) {
      Alert.alert('Error', err?.message ?? 'Failed to upload photo');
    } finally {
      setIsUploadingImage(false);
    }
  };

  return (
    <SafeAreaView style={pe.root}>
      <View style={pe.header}>
        <TouchableOpacity style={pe.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={18} color={Colors.dark['text-primary']} />
        </TouchableOpacity>
        <View>
          <Text style={pe.title}>Edit Profile</Text>
          <Text style={pe.subtitle}>Update your personal information</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={pe.scroll}>
        <View style={pe.avatarSection}>
          <Avatar uri={avatarUrl} name={displayName || 'User'} size={100} />
          <TouchableOpacity
            style={pe.changePhotoBtn}
            onPress={handlePickImage}
            disabled={isUploadingImage}
          >
            {isUploadingImage ? (
              <ActivityIndicator color={Colors.dark.primary} size="small" />
            ) : (
              <Text style={pe.changePhotoText}>Change Photo</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={pe.card}>
          <Text style={pe.label}>Display Name *</Text>
          <TextInput
            style={pe.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Enter your name"
            placeholderTextColor={Colors.dark['text-tertiary']}
            maxLength={50}
          />
        </View>

        <View style={pe.card}>
          <Text style={pe.label}>Phone Number</Text>
          <View style={pe.phoneRow}>
            <Text style={pe.phonePrefix}>+880</Text>
            <TextInput
              style={[pe.input, { flex: 1 }]}
              value={phone.replace('+880', '')}
              onChangeText={(text) => {
                const cleaned = text.replace(/\D/g, '');
                setPhone(cleaned ? `+880${cleaned}` : '');
              }}
              placeholder="1712345678"
              placeholderTextColor={Colors.dark['text-tertiary']}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>

        <View style={pe.card}>
          <Text style={pe.label}>Email</Text>
          <Text style={pe.readonlyText}>{user?.email ?? 'Not set'}</Text>
          <Text style={pe.hint}>Email cannot be changed</Text>
        </View>

        <TouchableOpacity
          style={[pe.saveBtn, isSaving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color={Colors.dark['bg-base']} />
          ) : (
            <Text style={pe.saveBtnText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const pe = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dark['bg-base'] },
  scroll: { padding: Spacing['space-5'], gap: Spacing['space-4'], paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing['space-5'], paddingVertical: Spacing['space-3'] },
  backBtn: { width: 32, height: 32, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: Colors.dark['text-primary'] },
  subtitle: { ...Typography['body-sm'], color: Colors.dark['text-secondary'], marginTop: 2 },
  avatarSection: { alignItems: 'center', gap: Spacing['space-3'], paddingVertical: Spacing['space-4'] },
  changePhotoBtn: { backgroundColor: Colors.dark['primary-subtle'], borderRadius: Radius['radius-md'], paddingHorizontal: Spacing['space-4'], paddingVertical: Spacing['space-2'], borderWidth: 1, borderColor: Colors.dark.primary, minWidth: 120, alignItems: 'center' },
  changePhotoText: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark.primary },
  card: { backgroundColor: Colors.dark['bg-card'], borderRadius: Radius['radius-lg'], borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing['space-4'], gap: Spacing['space-2'] },
  label: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark['text-secondary'] },
  input: { backgroundColor: Colors.dark['bg-overlay'], borderRadius: Radius['radius-md'], borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing['space-3'], ...Typography.body, color: Colors.dark['text-primary'] },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-2'] },
  phonePrefix: { ...Typography.body, fontWeight: '600', color: Colors.dark['text-primary'], paddingHorizontal: Spacing['space-3'] },
  readonlyText: { ...Typography.body, color: Colors.dark['text-secondary'], paddingVertical: Spacing['space-2'] },
  hint: { ...Typography.caption, color: Colors.dark['text-tertiary'], marginTop: 2 },
  saveBtn: { backgroundColor: Colors.dark.primary, borderRadius: Radius['radius-lg'], paddingVertical: 16, alignItems: 'center' },
  saveBtnText: { ...Typography.h4, fontWeight: '700', color: Colors.dark['bg-base'] },
});