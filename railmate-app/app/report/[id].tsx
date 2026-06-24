// app/report-detail.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../../theme';

const COMMENTS_PREVIEW = [
  { user: 'Rahat Uddin', badge: 'Trusted Reporter', badgeColor: C.green, comment: 'This delay was due to signal issue at Cumilla Yard. Train was held for crossing.', time: '2h ago', likes: 5 },
  { user: 'Mehedi Hasan', badge: 'Level 3 Reporter', badgeColor: C.blue, comment: 'Same here, train was delayed by 25 minutes.', time: '1h ago', likes: 3 },
  { user: 'Arif Hossain', badge: 'Level 2 Reporter', badgeColor: C.purple, comment: 'Track maintenance caused speed reduction.', time: '45m ago', likes: 2 },
];

export default function ReportDetailScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={rd.root}>
      <View style={rd.header}>
        <TouchableOpacity style={rd.backBtn} onPress={() => router.back()} />
        <Text style={rd.title}>Report Detail</Text>
        <TouchableOpacity style={rd.shareBtn} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={rd.scroll}>
        {/* Badge + ref */}
        <View style={rd.topRow}>
          <View style={rd.delayBadge}><Text style={rd.delayBadgeText}>Delay Report</Text></View>
          <Text style={rd.refNum}>#DR-2025-05-1762</Text>
        </View>
        {/* Train info */}
        <View style={rd.card}>
          <View style={rd.trainRow}>
            <View style={rd.trainIcon} />
            <View style={{ flex: 1 }}>
              <Text style={rd.trainName}>Subarna Express (701)</Text>
              <Text style={rd.trainRoute}>Dhaka → Chattogram</Text>
            </View>
            <View style={rd.verifiedBadge}><Text style={rd.verifiedText}>Verified ✓</Text></View>
          </View>
          <View style={rd.divider} />
          <View style={rd.metaRow}>
            <View><Text style={rd.metaLabel}>May 21, 2025{'\n'}08:16 AM</Text></View>
            <View><Text style={rd.metaLabel}>At Station{'\n'}<Text style={rd.metaValue}>Cumilla</Text></Text></View>
            <View><Text style={rd.metaLabel}>Actual Delay{'\n'}<Text style={[rd.metaValue, { color: C.red }]}>22 min</Text></Text></View>
          </View>
        </View>
        {/* Delay info */}
        <View style={rd.card}>
          <Text style={rd.sectionTitle}>Delay Information</Text>
          <View style={rd.delayRow}>
            <View><Text style={rd.delayLabel}>Reported Delay</Text><Text style={[rd.delayNum, { color: C.red }]}>25 min</Text></View>
            <View><Text style={rd.delayLabel}>Verified Delay</Text><Text style={[rd.delayNum, { color: C.orange }]}>22 min</Text></View>
          </View>
        </View>
        {/* Verification */}
        <View style={rd.card}>
          <View style={rd.verifyRow}>
            <View>
              <Text style={rd.sectionTitle}>Verification</Text>
              <Text style={rd.verifyCount}>14</Text>
              <Text style={rd.verifyLabel}>Total Verifications</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: S.sm }}>
              <Text style={rd.verifiedByLabel}>Verified by</Text>
              <View style={{ flexDirection: 'row', gap: 4 }}>
                {[0,1,2,3,4].map(i => <View key={i} style={rd.verifierAvatar} />)}
                <Text style={{ color: C.text2, fontSize: T.sm }}>+9</Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 4 }}>
                {[0,1,2,3,4].map(i => <View key={i} style={rd.checkCircle} />)}
                <Text style={{ color: C.text2, fontSize: T.sm }}>+7</Text>
              </View>
              <Text style={{ color: C.white, fontSize: T.sm }}>👍 27 Helpful Votes</Text>
            </View>
          </View>
        </View>
        {/* Description */}
        <View style={rd.card}>
          <Text style={rd.sectionTitle}>Report Description</Text>
          <Text style={rd.description}>Train departed Dhaka on time. Reached Cumilla at 08:16 AM. Approximately 22 minutes delayed due to signal issue near Cumilla Yard.</Text>
        </View>
        {/* Comments preview */}
        <View style={rd.card}>
          <View style={rd.cardHeader}>
            <Text style={rd.sectionTitle}>Comments Preview</Text>
            <TouchableOpacity onPress={() => router.push('/comments-discussion')}><Text style={rd.viewAll}>View All (8)</Text></TouchableOpacity>
          </View>
          {COMMENTS_PREVIEW.map((c, i) => (
            <View key={c.user}>
              <View style={rd.commentRow}>
                <View style={rd.commentAvatar} />
                <View style={{ flex: 1, gap: 4 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: S.sm }}>
                    <Text style={rd.commentUser}>{c.user}</Text>
                    <View style={[rd.commentBadge, { backgroundColor: c.badgeColor === C.green ? C.greenTint : c.badgeColor === C.blue ? C.blueTint : C.purpleTint }]}>
                      <Text style={[rd.commentBadgeText, { color: c.badgeColor }]}>{c.badge}</Text>
                    </View>
                  </View>
                  <Text style={rd.commentText}>{c.comment}</Text>
                  <View style={{ flexDirection: 'row', gap: S.md }}>
                    <Text style={rd.commentTime}>{c.time}</Text>
                    <Text style={rd.commentLikes}>👍 {c.likes}</Text>
                  </View>
                </View>
              </View>
              {i < COMMENTS_PREVIEW.length - 1 && <View style={rd.divider} />}
            </View>
          ))}
        </View>
        <View style={rd.footerNote}>
          <Text style={rd.footerText}>ℹ Thank you! Your report helps thousands of travelers.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const rd = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.lg, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: S.xl, paddingVertical: S.md },
  backBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
  title: { fontSize: 17, fontWeight: '700', color: C.white },
  shareBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  delayBadge: { backgroundColor: C.redTint, borderRadius: 20, paddingHorizontal: S.md, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: S.xs },
  delayBadgeText: { fontSize: T.sm, fontWeight: '700', color: C.red },
  refNum: { fontSize: T.sm, color: C.text3 },
  card: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.lg, gap: S.md },
  trainRow: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  trainIcon: { width: 40, height: 40, backgroundColor: C.greenTint, borderRadius: 20 },
  trainName: { fontSize: T.md, fontWeight: '700', color: C.white },
  trainRoute: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  verifiedBadge: { backgroundColor: C.greenTint, borderRadius: 8, paddingHorizontal: S.sm, paddingVertical: 4 },
  verifiedText: { fontSize: T.xs, fontWeight: '700', color: C.green },
  divider: { height: 1, backgroundColor: C.border },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metaLabel: { fontSize: T.sm, color: C.text2, lineHeight: 20 },
  metaValue: { fontSize: T.base, fontWeight: '700', color: C.white },
  sectionTitle: { fontSize: T.md, fontWeight: '700', color: C.white },
  delayRow: { flexDirection: 'row', gap: S.xxxl },
  delayLabel: { fontSize: T.sm, color: C.text2 },
  delayNum: { fontSize: 24, fontWeight: '800', marginTop: 4 },
  verifyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  verifyCount: { fontSize: 28, fontWeight: '800', color: C.white, marginTop: S.sm },
  verifyLabel: { fontSize: T.sm, color: C.text2 },
  verifiedByLabel: { fontSize: T.sm, color: C.text2 },
  verifierAvatar: { width: 28, height: 28, backgroundColor: C.surface2, borderRadius: 14 },
  checkCircle: { width: 22, height: 22, backgroundColor: C.greenTint, borderRadius: 11, borderWidth: 1, borderColor: C.green },
  description: { fontSize: T.sm, color: C.text2, lineHeight: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  viewAll: { fontSize: T.sm, fontWeight: '600', color: C.green },
  commentRow: { flexDirection: 'row', gap: S.md, paddingVertical: S.sm },
  commentAvatar: { width: 36, height: 36, backgroundColor: C.surface2, borderRadius: 18 },
  commentUser: { fontSize: T.sm, fontWeight: '700', color: C.white },
  commentBadge: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  commentBadgeText: { fontSize: T.xs, fontWeight: '600' },
  commentText: { fontSize: T.sm, color: C.text2, lineHeight: 18 },
  commentTime: { fontSize: T.xs, color: C.text3 },
  commentLikes: { fontSize: T.xs, color: C.text2 },
  footerNote: { backgroundColor: C.surface, borderRadius: R.md, borderWidth: 1, borderColor: C.border, padding: S.lg },
  footerText: { fontSize: T.sm, color: C.text2 },
});
