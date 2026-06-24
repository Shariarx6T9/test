// app/comments-discussion.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../../theme';

interface Comment {
  id: string;
  user: string;
  badge: string;
  badgeColor: string;
  time: string;
  text: string;
  likes: number;
  hearts: number;
  verified: boolean;
  replies?: Comment[];
}

const COMMENTS: Comment[] = [
  {
    id: '1', user: 'Farhan Ahmed', badge: 'Trusted Reporter', badgeColor: C.green,
    time: '2h ago', likes: 12, hearts: 3, verified: true,
    text: 'Signal issue was near Cumilla Yard. Train was stopped for crossing up line.',
    replies: [
      { id: '1a', user: 'Ayesha Akter', badge: 'Level 3 Reporter', badgeColor: C.orange, time: '1h ago', likes: 4, hearts: 0, verified: true, text: 'Thanks for the info! How long was the stop?' },
      { id: '1b', user: 'Raihan Uddin', badge: 'Level 2 Reporter', badgeColor: C.blue, time: '1h ago', likes: 3, hearts: 0, verified: true, text: 'Around 15-20 mins. I was in S3 coach.' },
    ],
  },
  { id: '2', user: 'Mehedi Hasan', badge: 'Level 4 Reporter', badgeColor: C.purple, time: '55m ago', likes: 5, hearts: 1, verified: true, text: 'Train was 25 minutes late. Now it is fine.' },
  { id: '3', user: 'Arif Hossain', badge: 'Level 1 Reporter', badgeColor: C.blue, time: '30m ago', likes: 2, hearts: 0, verified: true, text: 'Track maintenance reduced the speed.' },
];

function CommentCard({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) {
  const bgColor = comment.badgeColor === C.green ? C.greenTint : comment.badgeColor === C.purple ? C.purpleTint : comment.badgeColor === C.orange ? C.orangeTint : C.blueTint;
  return (
    <View style={[cd.commentCard, isReply && cd.replyCard]}>
      <View style={cd.commentTop}>
        <View style={cd.avatar} />
        <View style={{ flex: 1 }}>
          <View style={cd.nameRow}>
            <Text style={cd.userName}>{comment.user}</Text>
            <View style={[cd.badge, { backgroundColor: bgColor }]}>
              <Text style={[cd.badgeText, { color: comment.badgeColor }]}>{comment.badge}</Text>
            </View>
            {comment.verified && <View style={cd.verifiedDot} />}
          </View>
          <Text style={cd.time}>{comment.time}</Text>
        </View>
        <TouchableOpacity style={cd.moreBtn} />
      </View>
      <Text style={cd.commentText}>{comment.text}</Text>
      <View style={cd.commentActions}>
        <TouchableOpacity style={cd.actionRow}>
          <View style={cd.likeIcon} />
          <Text style={cd.likeCount}>{comment.likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={cd.actionRow}>
          <View style={cd.heartIcon} />
          <Text style={cd.heartCount}>{comment.hearts}</Text>
        </TouchableOpacity>
        <TouchableOpacity><Text style={cd.replyBtn}>Reply</Text></TouchableOpacity>
        {comment.id === '2' && <TouchableOpacity><Text style={cd.translateBtn}>See translation</Text></TouchableOpacity>}
      </View>
      {comment.replies?.map(reply => <CommentCard key={reply.id} comment={reply} isReply />)}
    </View>
  );
}

export default function CommentsDiscussionScreen() {
  const router = useRouter();
  const [comment, setComment] = useState('');
  return (
    <SafeAreaView style={cd.root}>
      <View style={cd.header}>
        <TouchableOpacity style={cd.backBtn} onPress={() => router.back()} />
        <View style={{ flex: 1 }}>
          <Text style={cd.title}>Comments & Discussion</Text>
          <Text style={cd.subtitle}>Subarna Express (701)  •  Dhaka → Chattogram</Text>
        </View>
        <TouchableOpacity style={cd.moreHeaderBtn} />
      </View>
      {/* Report ref */}
      <View style={cd.reportRef}>
        <View style={cd.reportTag}><Text style={cd.reportTagText}>Delay Report</Text></View>
        <View style={{ flex: 1, paddingLeft: S.sm }}>
          <Text style={cd.refTitle}>Delay at Cumilla</Text>
          <Text style={cd.refMeta}>May 21, 2025  •  08:16 AM  •  <Text style={{ color: C.orange }}>22 min delay (verified)</Text></Text>
        </View>
        <Text style={cd.refNum}>#DR-2025-05-1762</Text>
      </View>
      {/* Filter tabs */}
      <View style={cd.tabsRow}>
        {['All Comments (6)', 'Latest', 'Verified Only'].map((tab, i) => (
          <TouchableOpacity key={tab} style={[cd.tab, i === 0 && cd.tabActive]}>
            <Text style={[cd.tabText, i === 0 && cd.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={cd.sortRow}>
        <Text style={cd.sortText}>Oldest first</Text>
        <Text style={cd.countText}>6 comments</Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={cd.scroll}>
        {COMMENTS.map(c => <CommentCard key={c.id} comment={c} />)}
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
            value={comment}
            onChangeText={setComment}
          />
          <View style={cd.inputActions}>
            <TouchableOpacity style={cd.inputIcon} />
            <TouchableOpacity style={cd.inputIcon} />
          </View>
        </View>
        <TouchableOpacity style={cd.sendBtn} />
      </View>
    </SafeAreaView>
  );
}

const cd = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.md, paddingBottom: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: S.sm, paddingHorizontal: S.xl, paddingVertical: S.md },
  backBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
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
