// app/comments-discussion.tsx
import React, { useState, useRef } from 'react';
import { ArrowLeft } from 'phosphor-react-native';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, SafeAreaView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../theme';
import { useReportComments, useAddComment } from '../hooks/useCommunityReports';
import { useAuthStore } from '../stores/authStore';
import { useTranslation } from '../i18n';
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
  const bgColor = isTrusted ? C.greenTint : C.blueTint;
  const textColor = isTrusted ? C.green : C.blue;

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
  const { t } = useTranslation();
  const { user, isAuthenticated, isGuest } = useAuthStore();
  const [commentText, setCommentText] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  const { data: comments, isLoading, refetch } = useReportComments(report_id ?? '');
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
        <TouchableOpacity style={cd.backBtn} onPress={() => router.back()}><ArrowLeft size={18} color={C.white} /></TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={cd.title}>Comments & Discussion</Text>
          <Text style={cd.subtitle}>Discussion</Text>
        </View>
        <TouchableOpacity style={cd.moreHeaderBtn} />
      </View>

      {/* Report ref */}
      <View style={cd.reportRef}>
        <View style={cd.reportTag}><Text style={cd.reportTagText}>Report</Text></View>
        <View style={{ flex: 1, paddingLeft: S.sm }}>
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
            <View style={{ alignItems: 'center', paddingVertical: S.xl }}>
              <ActivityIndicator color={C.green} size="large" />
            </View>
          )}

          {!isLoading && (comments ?? []).length === 0 && (
            <View style={{ alignItems: 'center', paddingVertical: S.xxxl }}>
              <Text style={{ color: C.text2, fontSize: T.base }}>Start the discussion</Text>
            </View>
          )}

          {!isLoading &&
            (comments ?? []).map((c) => (
              <CommentItem key={c.id} comment={c} />
            ))}

          <View style={cd.footerNote}>
            <Text style={cd.footerText}>🔒 Be respectful. Helpful comments improve everyone's journey.</Text>
          </View>
        </ScrollView>

        {/* Comment input */}
        <View style={cd.inputBar}>
          <View style={cd.inputAvatar} />
          <View style={cd.inputField}>
            <TextInput
              style={cd.input}
              placeholder="Write a comment..."
              placeholderTextColor={C.text3}
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
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.md, paddingBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: S.sm, paddingHorizontal: S.xl, paddingVertical: S.md },
  backBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: '700', color: C.white },
  subtitle: { fontSize: T.sm, color: C.text2, marginTop: 1 },
  moreHeaderBtn: { width: 24, height: 24, backgroundColor: C.surface2, borderRadius: 12 },
  reportRef: { flexDirection: 'row', alignItems: 'center', marginHorizontal: S.xl, backgroundColor: C.surface, borderRadius: R.md, borderWidth: 1, borderColor: C.border, padding: S.md, gap: S.sm },
  reportTag: { backgroundColor: C.redTint, borderRadius: 20, paddingHorizontal: S.sm, paddingVertical: 4 },
  reportTagText: { fontSize: T.xs, fontWeight: '700', color: C.red },
  refTitle: { fontSize: T.base, fontWeight: '700', color: C.white },
  refMeta: { fontSize: T.xs, color: C.text2, marginTop: 2 },
  refNum: { fontSize: T.xs, color: C.text3 },
  tabsRow: { flexDirection: 'row', marginHorizontal: S.xl, marginTop: S.md, backgroundColor: C.surface, borderRadius: R.md, borderWidth: 1, borderColor: C.border },
  tab: { flex: 1, paddingVertical: S.md, alignItems: 'center', borderRadius: R.md },
  tabActive: { backgroundColor: C.green },
  tabText: { fontSize: T.sm, color: C.text2 },
  tabTextActive: { fontWeight: '700', color: C.bg },
  sortRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: S.xl, paddingVertical: S.sm },
  sortText: { fontSize: T.sm, color: C.text2 },
  countText: { fontSize: T.sm, color: C.text3 },
  commentCard: { backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: S.lg, gap: S.sm },
  replyCard: { marginLeft: S.xxl, backgroundColor: C.surface2 },
  commentTop: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  avatar: { width: 38, height: 38, backgroundColor: C.surface2, borderRadius: 19 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: S.xs },
  userName: { fontSize: T.sm, fontWeight: '700', color: C.white },
  badge: { borderRadius: 20, paddingHorizontal: S.sm, paddingVertical: 2 },
  badgeText: { fontSize: T.xs, fontWeight: '600' },
  verifiedDot: { width: 16, height: 16, backgroundColor: C.green, borderRadius: 8 },
  time: { fontSize: T.xs, color: C.text3, marginTop: 2 },
  moreBtn: { width: 20, height: 20, backgroundColor: C.surface2, borderRadius: 10 },
  commentText: { fontSize: T.sm, color: C.white, lineHeight: 20 },
  commentActions: { flexDirection: 'row', alignItems: 'center', gap: S.lg },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: S.xs },
  likeIcon: { width: 18, height: 18, backgroundColor: C.greenTint, borderRadius: 9 },
  likeCount: { fontSize: T.sm, fontWeight: '600', color: C.text2 },
  heartIcon: { width: 18, height: 18, backgroundColor: C.redTint, borderRadius: 9 },
  heartCount: { fontSize: T.sm, fontWeight: '600', color: C.text2 },
  replyBtn: { fontSize: T.sm, fontWeight: '600', color: C.text2 },
  translateBtn: { fontSize: T.sm, fontWeight: '600', color: C.green },
  footerNote: { backgroundColor: C.surface, borderRadius: R.md, borderWidth: 1, borderColor: C.border, padding: S.md },
  footerText: { fontSize: T.sm, color: C.text2, textAlign: 'center' },
  inputBar: { flexDirection: 'row', alignItems: 'center', gap: S.sm, padding: S.md, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.border },
  inputAvatar: { width: 36, height: 36, backgroundColor: C.surface2, borderRadius: 18 },
  inputField: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface2, borderRadius: 20, paddingHorizontal: S.md },
  input: { flex: 1, paddingVertical: S.sm, color: C.white, fontSize: T.base },
  inputActions: { flexDirection: 'row', gap: S.sm },
  inputIcon: { width: 24, height: 24, backgroundColor: C.border, borderRadius: 12 },
  sendBtn: { width: 36, height: 36, backgroundColor: C.green, borderRadius: 18 },
});
