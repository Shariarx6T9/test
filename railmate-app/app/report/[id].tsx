// app/report/[id].tsx
// Community report detail + comments screen.

import React, { useMemo, useState, useRef } from 'react';
import {
  View, ScrollView, Pressable, StyleSheet, Text, TextInput,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft, PaperPlaneTilt, CheckCircle, ThumbsUp, ChatCircle,
} from 'phosphor-react-native';
import { Avatar } from '../../components/ui/Avatar/Avatar';
import {
  useCommunityReports,
  useReportComments,
  useAddComment,
  useVoteReport,
} from '../../hooks/useCommunityReports';
import { useAuthStore } from '../../stores/authStore';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';
import { useTranslation, TranslationKey } from '../../i18n';
import { ErrorBoundary } from '../../components/ErrorBoundary';

const TYPE_COLORS: Record<string, string> = {
  DELAY:    '#F5A623',
  CROWD:    '#E8394B',
  PLATFORM: '#00A859',
  SCHEDULE: '#4EA8E0',
  GENERAL:  '#8FA3C0',
  ACCIDENT: '#A855F7',
};

function formatTime(iso?: string): string {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(iso).toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
}

function ReportDetailContent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => createStyles(colors), [colors]);

  const { user, isAuthenticated } = useAuthStore();
  const [commentText, setCommentText] = useState('');
  const inputRef = useRef<TextInput>(null);

  // Get the report from the community feed cache (no extra network call)
  const { data: allReports } = useCommunityReports(null);
  const report = allReports?.find((r) => r.id === id);

  const { data: comments, isLoading: commentsLoading } = useReportComments(id ?? '');
  const { mutate: addComment, isPending: submitting } = useAddComment(id ?? '', null);
  const { mutate: vote } = useVoteReport();

  const handleVote = () => {
    if (!isAuthenticated) { Alert.alert('', t('auth.sign_in')); return; }
    vote({
      reportId: id ?? '',
      voteType: 'CONFIRM',
      existingVote: report?.current_user_vote ?? null,
      activeFilter: null,
    });
  };

  const handleSend = () => {
    const trimmed = commentText.trim();
    if (!trimmed) return;
    if (!isAuthenticated) { Alert.alert('', t('auth.sign_in')); return; }
    addComment(trimmed, {
      onSuccess: () => setCommentText(''),
      onError: (err) => Alert.alert('Error', err.message),
    });
  };

  if (!report) {
    return (
      <View style={[s.root, s.center]}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const typeColor = TYPE_COLORS[report.report_type] ?? colors['text-secondary'];
  const typeLabel = t(('community.type_' + (report.report_type ?? '').toLowerCase()) as TranslationKey) || report.report_type;
  const hasVoted = report.current_user_vote === 'CONFIRM';

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <Pressable style={s.backBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors['text-primary']} weight="bold" />
        </Pressable>
        <Text style={s.headerTitle}>{t('community.report_detail')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Report card */}
        <View style={s.reportCard}>
          <View style={[s.cardAccent, { backgroundColor: typeColor }]} />

          <View style={s.userRow}>
            <Avatar name={report.user?.display_name ?? 'User'} size={44} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={s.userName}>{report.user?.display_name ?? 'Anonymous'}</Text>
                {report.user?.is_trusted && (
                  <View style={s.trustedBadge}>
                    <CheckCircle size={10} color={colors.primary} weight="fill" />
                    <Text style={s.trustedText}>{t('community.trusted')}</Text>
                  </View>
                )}
              </View>
              <Text style={s.trainName}>{report.train?.name_en ?? ''}</Text>
              <Text style={s.timeText}>{formatTime(report.created_at ?? report.reported_at)}</Text>
            </View>
            <View style={[s.typeBadge, { backgroundColor: typeColor + '20', borderColor: typeColor + '40' }]}>
              <Text style={[s.typeText, { color: typeColor }]}>{typeLabel}</Text>
            </View>
          </View>

          {!!report.description && (
            <Text style={s.body}>{report.description}</Text>
          )}

          {/* Delay info */}
          {report.report_type === 'DELAY' && report.delay_minutes && (
            <View style={[s.infoChip, { borderColor: typeColor + '40', backgroundColor: typeColor + '12' }]}>
              <Text style={[s.infoChipText, { color: typeColor }]}>
                {report.delay_minutes} min delay reported
              </Text>
            </View>
          )}

          {/* Crowd level */}
          {report.report_type === 'CROWD' && report.crowd_level && (
            <View style={[s.infoChip, { borderColor: typeColor + '40', backgroundColor: typeColor + '12' }]}>
              <Text style={[s.infoChipText, { color: typeColor }]}>
                Crowd level: {report.crowd_level}
              </Text>
            </View>
          )}

          {/* Stats + vote */}
          <View style={s.statsRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <CheckCircle size={14} color={colors.primary} weight="fill" />
              <Text style={s.stat}>{report.verification_count ?? 0} confirmed</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <ThumbsUp size={14} color={colors['text-tertiary']} />
              <Text style={s.stat}>{report.helpful_count ?? 0} helpful</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <ChatCircle size={14} color={colors['text-tertiary']} />
              <Text style={s.stat}>{comments?.length ?? report.comment_count ?? 0}</Text>
            </View>
          </View>

          <Pressable
            style={[s.confirmBtn, hasVoted && { backgroundColor: colors['primary-subtle'], borderColor: colors.primary }]}
            onPress={handleVote}
          >
            <ThumbsUp
              size={16}
              color={hasVoted ? colors.primary : colors['text-inverse']}
              weight={hasVoted ? 'fill' : 'regular'}
            />
            <Text style={[s.confirmBtnText, hasVoted && { color: colors.primary }]}>
              {hasVoted ? 'You confirmed this' : t('community.helpful')}
            </Text>
          </Pressable>
        </View>

        {/* Comments section */}
        <Text style={s.commentsTitle}>
          {t('community.comment')} ({comments?.length ?? 0})
        </Text>

        {commentsLoading ? (
          <ActivityIndicator color={colors.primary} style={{ marginTop: 24 }} />
        ) : (comments ?? []).length === 0 ? (
          <View style={s.emptyComments}>
            <ChatCircle size={36} color={colors['text-tertiary']} weight="thin" />
            <Text style={s.emptyText}>Be the first to comment</Text>
          </View>
        ) : (
          (comments ?? []).map((c) => (
            <View key={c.id} style={s.commentCard}>
              <Avatar name={c.user?.display_name ?? 'User'} size={36} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                  <Text style={s.commentUser}>{c.user?.display_name ?? 'Anonymous'}</Text>
                  {c.user?.is_trusted && (
                    <CheckCircle size={12} color={colors.primary} weight="fill" />
                  )}
                  <Text style={s.commentTime}>{formatTime(c.created_at)}</Text>
                </View>
                <Text style={s.commentBody}>{c.body}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Comment input */}
      <View style={[s.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Avatar name={user?.display_name ?? 'G'} size={36} />
        <TextInput
          ref={inputRef}
          style={s.textInput}
          value={commentText}
          onChangeText={setCommentText}
          placeholder={isAuthenticated ? 'Add a comment…' : 'Sign in to comment'}
          placeholderTextColor={colors['text-tertiary']}
          multiline
          maxLength={500}
          editable={isAuthenticated}
          onFocus={() => {
            if (!isAuthenticated) Alert.alert('', t('auth.sign_in'));
          }}
        />
        <Pressable
          style={[s.sendBtn, (!commentText.trim() || submitting) && { opacity: 0.4 }]}
          onPress={handleSend}
          disabled={!commentText.trim() || submitting}
        >
          {submitting
            ? <ActivityIndicator size="small" color={colors['text-inverse']} />
            : <PaperPlaneTilt size={18} color={colors['text-inverse']} weight="fill" />}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

export default function ReportDetailScreen() {
  return <ErrorBoundary name="Report Detail"><ReportDetailContent /></ErrorBoundary>;
}

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    root:          { flex: 1, backgroundColor: colors['bg-base'] },
    center:        { alignItems: 'center', justifyContent: 'center' },
    header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 12 },
    backBtn:       { width: 40, height: 40, borderRadius: 20, backgroundColor: colors['bg-card'], borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
    headerTitle:   { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: colors['text-primary'] },
    reportCard:    { backgroundColor: colors['bg-card'], borderRadius: 16, borderWidth: 1, borderColor: colors.border, marginBottom: 24, overflow: 'hidden' },
    cardAccent:    { height: 3 },
    userRow:       { flexDirection: 'row', alignItems: 'flex-start', padding: 16, paddingBottom: 12 },
    userName:      { fontFamily: 'Inter_600SemiBold', fontSize: 15, color: colors['text-primary'] },
    trustedBadge:  { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors['primary-subtle'], borderRadius: 20, paddingHorizontal: 6, paddingVertical: 2 },
    trustedText:   { fontFamily: 'Inter_500Medium', fontSize: 10, color: colors.primary },
    trainName:     { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors['text-secondary'], marginTop: 2 },
    timeText:      { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-tertiary'], marginTop: 2 },
    typeBadge:     { borderWidth: 1, borderRadius: 8, paddingHorizontal: 9, paddingVertical: 4 },
    typeText:      { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
    body:          { fontFamily: 'Inter_400Regular', fontSize: 15, color: colors['text-primary'], lineHeight: 24, paddingHorizontal: 16, paddingBottom: 12 },
    infoChip:      { marginHorizontal: 16, marginBottom: 12, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, alignSelf: 'flex-start' },
    infoChipText:  { fontFamily: 'Inter_600SemiBold', fontSize: 13 },
    statsRow:      { flexDirection: 'row', gap: 16, paddingHorizontal: 16, paddingBottom: 14 },
    stat:          { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors['text-tertiary'] },
    confirmBtn:    { margin: 16, marginTop: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 13, borderWidth: 1.5, borderColor: 'transparent' },
    confirmBtnText:{ fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors['text-inverse'] },
    commentsTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 17, color: colors['text-primary'], marginBottom: 16 },
    emptyComments: { alignItems: 'center', paddingVertical: 32, gap: 10 },
    emptyText:     { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-tertiary'] },
    commentCard:   { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
    commentUser:   { fontFamily: 'Inter_600SemiBold', fontSize: 13, color: colors['text-primary'] },
    commentTime:   { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-tertiary'], marginLeft: 'auto' },
    commentBody:   { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-secondary'], lineHeight: 21 },
    inputBar:      { flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors['bg-elevated'] },
    textInput:     { flex: 1, backgroundColor: colors['bg-card'], borderRadius: 20, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, paddingVertical: 10, fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-primary'], maxHeight: 100 },
    sendBtn:       { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
  });
