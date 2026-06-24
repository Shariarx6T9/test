// app/(tabs)/community.tsx — Community Screen

import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../../theme';

type CommunityTab = 'All' | 'Following' | 'My Posts';
type ReportType = 'delay' | 'crowding' | 'ontime';

interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  userBadge: string;
  badgeColor: string;
  trainName: string;
  trainNumber: string;
  route: string;
  time: string;
  timeColor: string;
  reportType: ReportType;
  reportLabel: string;
  reportColor: string;
  reportBg: string;
  description: string;
  photo?: boolean;
  confirmedCount: number;
  commentCount: number;
  votes: number;
  verified: boolean;
}

const POSTS: CommunityPost[] = [
  {
    id: '1', userId: 'u1', userName: 'Najmul Hasan', userBadge: 'Trusted Reporter', badgeColor: C.green,
    trainName: 'Subarna Express', trainNumber: '#721', route: 'Today, 8:35 PM  •  Dhaka → Chattogram',
    time: '15m ago', timeColor: C.red, reportType: 'delay', reportLabel: '15 min delay reported',
    reportColor: C.red, reportBg: C.redTint,
    description: 'Delay confirmed between Kamalapur & Narayanganj. Train expected to reach Ctg around 11:30 PM.',
    photo: true, confirmedCount: 8, commentCount: 4, votes: 23, verified: true,
  },
  {
    id: '2', userId: 'u2', userName: 'Fahim Ahmed', userBadge: 'Helpful Traveler', badgeColor: C.gold,
    trainName: 'Mahanagar Express', trainNumber: '#236', route: 'Today, 7:50 PM  •  Dhaka → Chattogram',
    time: '45m ago', timeColor: C.orange, reportType: 'crowding', reportLabel: 'Crowding High',
    reportColor: C.orange, reportBg: C.orangeTint,
    description: 'High passenger pressure in Coach 3-5. Consider other coaches for comfortable journey.',
    photo: true, confirmedCount: 12, commentCount: 6, votes: 31, verified: true,
  },
  {
    id: '3', userId: 'u3', userName: 'Ayesha Akter', userBadge: 'Helpful Traveler', badgeColor: C.gold,
    trainName: 'Sonar Bangla Express', trainNumber: '#787', route: 'Today, 6:40 PM  •  Dhaka → Rajshahi',
    time: '1h ago', timeColor: C.green, reportType: 'ontime', reportLabel: 'Running On Time',
    reportColor: C.green, reportBg: C.greenTint,
    description: 'Train is running as per schedule. Departure: 06:00 PM (On Time)\nNext stop: Ishwardi Bypass',
    photo: true, confirmedCount: 6, commentCount: 2, votes: 18, verified: true,
  },
];

function PostCard({ post, onPress }: { post: CommunityPost; onPress: () => void }) {
  return (
    <TouchableOpacity style={s.postCard} onPress={onPress} activeOpacity={0.9}>
      {/* User row */}
      <View style={s.userRow}>
        <View style={s.avatar} />
        <View style={{ flex: 1 }}>
          <View style={s.userNameRow}>
            <Text style={s.userName}>{post.userName}</Text>
            <View style={[s.badge, { backgroundColor: post.badgeColor === C.green ? C.greenTint : C.orangeTint }]}>
              <Text style={[s.badgeText, { color: post.badgeColor }]}>{post.userBadge}</Text>
            </View>
          </View>
          <Text style={s.trainRef}>{post.trainName} {post.trainNumber}</Text>
          <Text style={s.routeRef}>{post.route}</Text>
        </View>
        <Text style={[s.postTime, { color: post.timeColor }]}>{post.time}</Text>
      </View>

      <View style={s.divider} />

      {/* Report type */}
      <View style={[s.reportTag, { backgroundColor: post.reportBg }]}>
        <View style={[s.reportDot, { backgroundColor: post.reportColor }]} />
        <Text style={[s.reportLabel, { color: post.reportColor }]}>{post.reportLabel}</Text>
      </View>

      <Text style={s.postDesc}>{post.description}</Text>
      {post.photo && <View style={s.postPhoto} />}
      <Text style={s.confirmedText}>{post.confirmedCount} travelers confirmed</Text>
      <Text style={s.commentCountText}>{post.commentCount} comments</Text>

      <View style={s.divider} />

      {/* Actions */}
      <View style={s.postActions}>
        <TouchableOpacity style={s.voteRow}>
          <View style={s.voteUp} />
          <Text style={s.voteCount}>{post.votes}</Text>
          <View style={s.voteDown} />
        </TouchableOpacity>
        <TouchableOpacity style={s.actionBtn}><Text style={s.actionBtnText}>Comment</Text></TouchableOpacity>
        <TouchableOpacity style={s.actionBtn}><Text style={s.actionBtnText}>Share</Text></TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

export default function CommunityScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<CommunityTab>('All');
  const tabs: CommunityTab[] = ['All', 'Following', 'My Posts'];

  return (
    <SafeAreaView style={s.root}>
      <View style={s.header}>
        <View style={s.headerLeft}>
          <View style={s.headerIcon} />
          <View>
            <Text style={s.title}>Community</Text>
            <Text style={s.subtitle}>Share updates, help fellow travelers</Text>
          </View>
        </View>
        <View style={s.headerRight}>
          <TouchableOpacity style={s.iconBtn} />
          <TouchableOpacity style={[s.iconBtn, { backgroundColor: C.green }]} onPress={() => router.push('/submit-report')} />
        </View>
      </View>

      {/* Tabs */}
      <View style={s.tabsRow}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[s.tab, activeTab === tab && s.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
        {POSTS.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            onPress={() => router.push({ pathname: '/comments-discussion', params: { postId: post.id } })}
          />
        ))}

        <View style={s.heroBanner}>
          <View style={s.heroIcon} />
          <View style={{ flex: 1 }}>
            <Text style={s.heroTitle}>Be a Community Hero!</Text>
            <Text style={s.heroSub}>Your updates help thousands of travelers make better journey decisions.</Text>
          </View>
          <TouchableOpacity style={s.heroBtn} onPress={() => router.push('/submit-report')}>
            <Text style={s.heroBtnText}>Submit Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.lg, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: S.xl, paddingVertical: S.md },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  headerIcon: { width: 28, height: 28, backgroundColor: C.greenTint, borderRadius: 14 },
  title: { fontSize: T.lg, fontWeight: '700', color: C.white },
  subtitle: { fontSize: T.sm, color: C.text2, marginTop: 1 },
  headerRight: { flexDirection: 'row', gap: S.sm },
  iconBtn: { width: 36, height: 36, backgroundColor: C.surface2, borderRadius: 18 },
  tabsRow: { flexDirection: 'row', marginHorizontal: S.xl, backgroundColor: C.surface, borderRadius: R.md, borderWidth: 1, borderColor: C.border },
  tab: { flex: 1, paddingVertical: S.md, alignItems: 'center', borderRadius: R.md },
  tabActive: { backgroundColor: C.green },
  tabText: { fontSize: T.base, fontWeight: '500', color: C.text2 },
  tabTextActive: { fontWeight: '700', color: C.bg },
  postCard: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.lg, gap: S.md },
  userRow: { flexDirection: 'row', alignItems: 'flex-start', gap: S.sm },
  avatar: { width: 40, height: 40, backgroundColor: C.surface2, borderRadius: 20 },
  userNameRow: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  userName: { fontSize: T.base, fontWeight: '700', color: C.white },
  badge: { borderRadius: 20, paddingHorizontal: S.sm, paddingVertical: 3 },
  badgeText: { fontSize: T.xs, fontWeight: '600' },
  trainRef: { fontSize: T.sm, fontWeight: '600', color: C.text2, marginTop: 2 },
  routeRef: { fontSize: T.xs, color: C.text3, marginTop: 1 },
  postTime: { fontSize: T.sm, fontWeight: '600' },
  divider: { height: 1, backgroundColor: C.border },
  reportTag: { flexDirection: 'row', alignItems: 'center', gap: S.sm, borderRadius: 8, paddingHorizontal: S.sm, paddingVertical: 6, alignSelf: 'flex-start' },
  reportDot: { width: 16, height: 16, borderRadius: 8 },
  reportLabel: { fontSize: T.base, fontWeight: '700' },
  postDesc: { fontSize: T.sm, color: C.text2, lineHeight: 20 },
  postPhoto: { width: '100%', height: 100, backgroundColor: C.surface2, borderRadius: R.md },
  confirmedText: { fontSize: T.sm, color: C.green },
  commentCountText: { fontSize: T.sm, color: C.text3 },
  postActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  voteRow: { flexDirection: 'row', alignItems: 'center', gap: S.sm },
  voteUp: { width: 20, height: 20, backgroundColor: C.greenTint, borderRadius: 10 },
  voteCount: { fontSize: T.sm, fontWeight: '600', color: C.green },
  voteDown: { width: 20, height: 20, backgroundColor: C.surface2, borderRadius: 10 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: S.xs },
  actionBtnText: { fontSize: T.sm, color: C.text2 },
  heroBanner: { backgroundColor: C.greenTint, borderRadius: R.lg, borderWidth: 1, borderColor: C.greenDark, padding: S.lg, flexDirection: 'row', alignItems: 'center', gap: S.md },
  heroIcon: { width: 44, height: 44, backgroundColor: C.greenDark, borderRadius: 22 },
  heroTitle: { fontSize: T.base, fontWeight: '700', color: C.green },
  heroSub: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  heroBtn: { backgroundColor: C.green, borderRadius: 10, paddingHorizontal: S.md, paddingVertical: S.sm },
  heroBtnText: { fontSize: T.sm, fontWeight: '700', color: C.bg },
});
