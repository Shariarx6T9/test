// app/profile-edit.tsx
import React, { useState } from 'react';
import { ArrowLeft } from 'phosphor-react-native';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { colors as C, spacing as S, radius as R, typography as T } from '../theme';
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
        .update({
          display_name: displayName.trim(),
          phone: phone.trim() || null,
          avatar_url: avatarUrl || null,
        })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      // Update local store
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
      // Upload to Supabase Storage
      const fileName = `avatar-${user?.id}-${Date.now()}.jpg`;
      const formData = new FormData();
      formData.append('file', {
        uri: imageUri,
        name: fileName,
        type: 'image/jpeg',
      } as any);

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, formData, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(data.path);

      setAvatarUrl(urlData.publicUrl);
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
          <ArrowLeft size={18} color={C.white} />
        </TouchableOpacity>
        <View>
          <Text style={pe.title}>Edit Profile</Text>
          <Text style={pe.subtitle}>Update your personal information</Text>
        </View>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={pe.scroll}>
        {/* Avatar */}
        <View style={pe.avatarSection}>
          <Avatar uri={avatarUrl} name={displayName || 'User'} size={100} />
          <TouchableOpacity
            style={pe.changePhotoBtn}
            onPress={handlePickImage}
            disabled={isUploadingImage}
          >
            {isUploadingImage ? (
              <ActivityIndicator color={C.green} size="small" />
            ) : (
              <Text style={pe.changePhotoText}>Change Photo</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Display Name */}
        <View style={pe.card}>
          <Text style={pe.label}>Display Name *</Text>
          <TextInput
            style={pe.input}
            value={displayName}
            onChangeText={setDisplayName}
            placeholder="Enter your name"
            placeholderTextColor={C.text3}
            maxLength={50}
          />
        </View>

        {/* Phone Number */}
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
              placeholderTextColor={C.text3}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>

        {/* Email (read-only) */}
        <View style={pe.card}>
          <Text style={pe.label}>Email</Text>
          <Text style={pe.readonlyText}>{user?.email ?? 'Not set'}</Text>
          <Text style={pe.hint}>Email cannot be changed</Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[pe.saveBtn, isSaving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator color={C.bg} />
          ) : (
            <Text style={pe.saveBtnText}>Save Changes</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const pe = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.lg, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.xl, paddingVertical: S.md },
  backBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 18, fontWeight: '700', color: C.white },
  subtitle: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  avatarSection: { alignItems: 'center', gap: S.md, paddingVertical: S.lg },
  changePhotoBtn: { backgroundColor: C.greenTint, borderRadius: R.md, paddingHorizontal: S.lg, paddingVertical: S.sm, borderWidth: 1, borderColor: C.green, minWidth: 120, alignItems: 'center' },
  changePhotoText: { fontSize: T.sm, fontWeight: '600', color: C.green },
  card: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.lg, gap: S.sm },
  label: { fontSize: T.sm, fontWeight: '600', color: C.text2 },
  input: { backgroundColor: C.surface2, borderRadius: R.md, borderWidth: 1, borderColor: C.border, padding: S.md, fontSize: T.base, color: C.white },
  phoneRow: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  phonePrefix: { fontSize: T.base, fontWeight: '600', color: C.white, paddingHorizontal: S.md },
  readonlyText: { fontSize: T.base, color: C.text2, paddingVertical: S.sm },
  hint: { fontSize: T.xs, color: C.text3, marginTop: 2 },
  saveBtn: { backgroundColor: C.green, borderRadius: R.lg, paddingVertical: 16, alignItems: 'center' },
  saveBtnText: { fontSize: T.md, fontWeight: '700', color: C.bg },
});
