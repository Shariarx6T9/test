// app/comments-discussion.tsx
import React, { useState, useRef } from 'react';
import { ArrowLeft } from 'phosphor-react-native';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Radius, Spacing, Typography } from '../constants';
import { useReportComments, useAddComment } from '../hooks/useCommunityReports';
import { useAuthStore } from '../stores/authStore';
import type { ReportComment } from '../hooks/useCommunityReports';

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(iso).toLocaleDateString();
}

function CommentItem({ comment }: { comment: ReportComment }) {
  const isTrusted = comment.user?.is_trusted ?? false;
  const bgColor = isTrusted ? Colors.dark['primary-subtle'] : Colors.dark['info-subtle'];
  const textColor = isTrusted ? Colors.dark.primary : Colors.dark.info;

  return (
    <View style={cd.commentCard}>
      <View style={cd.commentTop}>
        <View style={cd.avatar} />
        <View style={{ flex: 1 }}>
          <View style={cd.nameRow}>
            <Text style={cd.userName}>{comment.user?.display_name ?? 'Anonymous'}</Text>
            {isTrusted && (
              <View style={[cd.badge, { backgroundColor: bgColor }]}>
                <Text style={[cd.badgeText, { color: textColor }]}>Trusted Reporter</Text>
              </View>
            )}
            {isTrusted && <View style={cd.verifiedDot} />}
          </View>
          <Text style={cd.time}>{timeAgo(comment.created_at)}</Text>
        </View>
        <TouchableOpacity style={cd.moreBtn} />
      </View>
      <Text style={cd.commentText}>{comment.body}</Text>
      <View style={cd.commentActions}>
        <TouchableOpacity style={cd.actionRow}>
          <View style={cd.likeIcon} />
          <Text style={cd.likeCount}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity style={cd.actionRow}>
          <View style={cd.heartIcon} />
          <Text style={cd.heartCount}>0</Text>
        </TouchableOpacity>
        <TouchableOpacity><Text style={cd.replyBtn}>Reply</Text></TouchableOpacity>
      </View>
    </View>
  );
}

export default function CommentsDiscussionScreen() {
  const router = useRouter();
  const { report_id } = useLocalSearchParams<{ report_id: string }>();
  const { isAuthenticated } = useAuthStore();
  const [commentText, setCommentText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const { data: comments, isLoading } = useReportComments(report_id ?? '');
  const addComment = useAddComment(report_id ?? '', null);

  const handleSend = async () => {
    if (!commentText.trim()) return;
    if (!isAuthenticated) {
      router.push('/auth/login' as any);
      return;
    }
    try {
      await addComment.mutateAsync(commentText.trim());
      setCommentText('');
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch {}
  };

  return (
    <SafeAreaView style={cd.root}>
      <View style={cd.header}>
        <TouchableOpacity style={cd.backBtn} onPress={() => router.back()}><ArrowLeft size={18} color={Colors.dark['text-primary']} /></TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={cd.title}>Comments & Discussion</Text>
          <Text style={cd.subtitle}>Discussion</Text>
        </View>
        <TouchableOpacity style={cd.moreHeaderBtn} />
      </View>

      {/* Report ref */}
      <View style={cd.reportRef}>
        <View style={cd.reportTag}><Text style={cd.reportTagText}>Report</Text></View>
        <View style={{ flex: 1, paddingLeft: Spacing['space-2'] }}>
          <Text style={cd.refTitle}>Report Discussion</Text>
          <Text style={cd.refMeta}>Report ID: {report_id ?? '—'}</Text>
        </View>
        <Text style={cd.refNum}>{report_id ? `#${report_id.slice(0, 8)}` : ''}</Text>
      </View>

      {/* Filter tabs */}
      <View style={cd.tabsRow}>
        {['All Comments', 'Latest', 'Verified Only'].map((tab, i) => (
          <TouchableOpacity key={tab} style={[cd.tab, i === 0 && cd.tabActive]}>
            <Text style={[cd.tabText, i === 0 && cd.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={cd.sortRow}>
        <Text style={cd.sortText}>Oldest first</Text>
        <Text style={cd.countText}>{comments?.length ?? 0} comments</Text>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          ref={scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={cd.scroll}
        >
          {isLoading && (
            <View style={{ alignItems: 'center', paddingVertical: Spacing['space-5'] }}>
              <ActivityIndicator color={Colors.dark.primary} size="large" />
            </View>
          )}

          {!isLoading && (comments ?? []).length === 0 && (
            <View style={{ alignItems: 'center', paddingVertical: Spacing['space-8'] }}>
              <Text style={{ color: Colors.dark['text-secondary'], ...Typography.body }}>Start the discussion</Text>
            </View>
          )}

          {!isLoading &&
            (comments ?? []).map((c) => (
              <CommentItem key={c.id} comment={c} />
            ))}

          <View style={cd.footerNote}>
            <Text style={cd.footerText}>🔒 Be respectful. Helpful comments improve everyone&#39;s journey.</Text>
          </View>
        </ScrollView>

        {/* Comment input */}
        <View style={cd.inputBar}>
          <View style={cd.inputAvatar} />
          <View style={cd.inputField}>
            <TextInput
              style={cd.input}
              placeholder="Write a comment..."
              placeholderTextColor={Colors.dark['text-tertiary']}
              value={commentText}
              onChangeText={setCommentText}
            />
            <View style={cd.inputActions}>
              <TouchableOpacity style={cd.inputIcon} />
              <TouchableOpacity style={cd.inputIcon} />
            </View>
          </View>
          <TouchableOpacity
            style={[cd.sendBtn, commentText.trim() === '' && { opacity: 0.4 }]}
            disabled={commentText.trim() === '' || addComment.isPending}
            onPress={handleSend}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const cd = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.dark['bg-base'] },
  scroll: { padding: Spacing['space-5'], gap: Spacing['space-3'], paddingBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-2'], paddingHorizontal: Spacing['space-5'], paddingVertical: Spacing['space-3'] },
  backBtn: { width: 32, height: 32, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '700', color: Colors.dark['text-primary'] },
  subtitle: { ...Typography['body-sm'], color: Colors.dark['text-secondary'], marginTop: 1 },
  moreHeaderBtn: { width: 24, height: 24, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 12 },
  reportRef: { flexDirection: 'row', alignItems: 'center', marginHorizontal: Spacing['space-5'], backgroundColor: Colors.dark['bg-card'], borderRadius: Radius['radius-md'], borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing['space-3'], gap: Spacing['space-2'] },
  reportTag: { backgroundColor: Colors.dark['danger-subtle'], borderRadius: 20, paddingHorizontal: Spacing['space-2'], paddingVertical: 4 },
  reportTagText: { ...Typography.caption, fontWeight: '700', color: Colors.dark.danger },
  refTitle: { ...Typography.body, fontWeight: '700', color: Colors.dark['text-primary'] },
  refMeta: { ...Typography.caption, color: Colors.dark['text-secondary'], marginTop: 2 },
  refNum: { ...Typography.caption, color: Colors.dark['text-tertiary'] },
  tabsRow: { flexDirection: 'row', marginHorizontal: Spacing['space-5'], marginTop: Spacing['space-3'], backgroundColor: Colors.dark['bg-card'], borderRadius: Radius['radius-md'], borderWidth: 1, borderColor: Colors.dark.border },
  tab: { flex: 1, paddingVertical: Spacing['space-3'], alignItems: 'center', borderRadius: Radius['radius-md'] },
  tabActive: { backgroundColor: Colors.dark.primary },
  tabText: { ...Typography['body-sm'], color: Colors.dark['text-secondary'] },
  tabTextActive: { fontWeight: '700', color: Colors.dark['bg-base'] },
  sortRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: Spacing['space-5'], paddingVertical: Spacing['space-2'] },
  sortText: { ...Typography['body-sm'], color: Colors.dark['text-secondary'] },
  countText: { ...Typography['body-sm'], color: Colors.dark['text-tertiary'] },
  commentCard: { backgroundColor: Colors.dark['bg-card'], borderRadius: 14, borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing['space-4'], gap: Spacing['space-2'] },
  replyCard: { marginLeft: Spacing['space-6'], backgroundColor: Colors.dark['bg-overlay'] },
  commentTop: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-2'] },
  avatar: { width: 38, height: 38, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 19 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-1'] },
  userName: { ...Typography['body-sm'], fontWeight: '700', color: Colors.dark['text-primary'] },
  badge: { borderRadius: 20, paddingHorizontal: Spacing['space-2'], paddingVertical: 2 },
  badgeText: { ...Typography.caption, fontWeight: '600' },
  verifiedDot: { width: 16, height: 16, backgroundColor: Colors.dark.primary, borderRadius: 8 },
  time: { ...Typography.caption, color: Colors.dark['text-tertiary'], marginTop: 2 },
  moreBtn: { width: 20, height: 20, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 10 },
  commentText: { ...Typography['body-sm'], color: Colors.dark['text-primary'], lineHeight: 20 },
  commentActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-4'] },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-1'] },
  likeIcon: { width: 18, height: 18, backgroundColor: Colors.dark['primary-subtle'], borderRadius: 9 },
  likeCount: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark['text-secondary'] },
  heartIcon: { width: 18, height: 18, backgroundColor: Colors.dark['danger-subtle'], borderRadius: 9 },
  heartCount: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark['text-secondary'] },
  replyBtn: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark['text-secondary'] },
  translateBtn: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark.primary },
  footerNote: { backgroundColor: Colors.dark['bg-card'], borderRadius: Radius['radius-md'], borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing['space-3'] },
  footerText: { ...Typography['body-sm'], color: Colors.dark['text-secondary'], textAlign: 'center' },
  inputBar: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-2'], padding: Spacing['space-3'], backgroundColor: Colors.dark['bg-card'], borderTopWidth: 1, borderTopColor: Colors.dark.border },
  inputAvatar: { width: 36, height: 36, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 18 },
  inputField: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.dark['bg-overlay'], borderRadius: 20, paddingHorizontal: Spacing['space-3'] },
  input: { flex: 1, paddingVertical: Spacing['space-2'], color: Colors.dark['text-primary'], ...Typography.body },
  inputActions: { flexDirection: 'row', gap: Spacing['space-2'] },
  inputIcon: { width: 24, height: 24, backgroundColor: Colors.dark.border, borderRadius: 12 },
  sendBtn: { width: 36, height: 36, backgroundColor: Colors.dark.primary, borderRadius: 18 },
});
