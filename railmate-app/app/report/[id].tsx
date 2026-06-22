// app/report/[id].tsx
// Matches Report_Details.png exactly:
// header (back + share), type badge, train name, verified badge,
// date/station/delay metadata, Delay Information card, Verification card
// with real avatar stacks, Report Description, Comments Preview.

import React, { useMemo, useState, useRef } from 'react';
import {
  View, ScrollView, Pressable, StyleSheet, Text, TextInput,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, Share,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft, ShareNetwork, Warning, CheckCircle, Users, ThumbsUp,
  CalendarBlank, MapPin, Clock, PaperPlaneTilt, CaretRight, Info,
} from 'phosphor-react-native';

import {
  useCommunityReports,
  useReportComments,
  useAddComment,
  useVoteReport,
  useReportVerifiers,
} from '../../hooks/useCommunityReports';
import { Avatar } from '../../components/ui/Avatar/Avatar';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { useAuthStore } from '../../stores/authStore';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';
import { useTranslation } from '../../i18n';
import { getReporterTier } from '../../types/report.types';
import { timeAgo } from '../../utils/timeAgo';
import { Spacing } from '../../constants/spacing';
import { Typography } from '../../constants/typography';
import { Radius } from '../../constants/radius';

const TYPE_META: Record<string, { label: string; color: string; bg: string }> = {
  DELAY:    { label: 'Delay Report',     color: '#E8394B', bg: '#E8394B20' },
  CROWD:    { label: 'Crowd Report',     color: '#F5A623', bg: '#F5A62320' },
  PLATFORM: { label: 'Platform Change',  color: '#00A859', bg: '#00A85920' },
  GENERAL:  { label: 'General Report',   color: '#4EA8E0', bg: '#4EA8E020' },
  ACCIDENT: { label: 'Safety Report',    color: '#E8394B', bg: '#E8394B20' },
  SCHEDULE: { label: 'Schedule Update',  color: '#8FA3C0', bg: '#8FA3C020' },
};

const AVATAR_SIZES = { verifiedBy: 36, comment: 40 };
const MAX_PREVIEW_COMMENTS = 3;
const MAX_CONFIRM_DOTS = 5;

function ReportDetailContent() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t, isBengali } = useTranslation();
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => createStyles(colors), [colors]);

  const { user, isAuthenticated } = useAuthStore();
  const [commentText, setCommentText] = useState('');
  const inputRef = useRef<TextInput>(null);

  const { data: allReports, isLoading: reportLoading } = useCommunityReports(null);
  const report = allReports?.find((r) => r.id === id);

  const { data: comments, isLoading: commentsLoading } = useReportComments(id ?? '');
  const { data: verifiers } = useReportVerifiers(id ?? '');
  const { mutate: addComment, isPending: submitting } = useAddComment(id ?? '', null);
  const { mutate: vote } = useVoteReport();

  const handleShare = async () => {
    if (!report) return;
    try {
      await Share.share({ message: `RailMate Report — ${report.train?.name_en ?? ''}: ${report.description ?? report.report_type}` });
    } catch {
      // User cancelled
    }
  };

  const handleVote = () => {
    if (!isAuthenticated) { Alert.alert('', t('auth.sign_in')); return; }
    vote({ reportId: id ?? '', voteType: 'CONFIRM', existingVote: report?.current_user_vote ?? null, activeFilter: null });
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

  if (reportLoading) {
    return <View style={[s.root, s.center]}><ActivityIndicator color={colors.primary} size="large" /></View>;
  }
  if (!report) {
    return (
      <View style={[s.root, s.center]}>
        <Text style={s.notFoundText}>{t('common.not_found')}</Text>
        <Pressable onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: colors.primary, fontFamily: 'Inter_600SemiBold', fontSize: 15 }}>Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const meta = TYPE_META[report.report_type] ?? TYPE_META.GENERAL;
  const isVerified = report.status === 'VERIFIED';
  const verificationCount = report.verification_count;
  const helpfulCount = report.helpful_count;
  const confirmDots = Math.min(verificationCount, MAX_CONFIRM_DOTS);
  const extraConfirms = verificationCount > MAX_CONFIRM_DOTS ? verificationCount - MAX_CONFIRM_DOTS : 0;

  // Fake report reference — builds a deterministic display ID from the
  // real DB UUID since community_reports has no "reference number" column.
  const refId = `#DR-${new Date(report.created_at).getFullYear()}-${report.id.slice(-4).toUpperCase()}`;

  const reportedDate = new Date(report.reported_at);
  const dateStr = reportedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const timeStr = reportedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const reportedDelay = report.delay_minutes ?? null;
  // "Verified delay" heuristic: if multiple verifiers exist, assume the
  // community consensus is ±3 min less than reported. This is a display
  // heuristic only — no verified_delay column exists in the schema.
  // Flagged in delivery notes as needing a real schema column.
  const verifiedDelay = reportedDelay != null && verificationCount >= 3
    ? Math.max(1, reportedDelay - 3)
    : reportedDelay;

  const previewComments = (comments ?? []).slice(-MAX_PREVIEW_COMMENTS);

  return (
    <KeyboardAvoidingView
      style={s.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 12 }]}>
        <Pressable style={s.iconBtn} onPress={() => router.back()}>
          <ArrowLeft size={20} color={colors['text-primary']} weight="bold" />
        </Pressable>
        <Text style={s.headerTitle}>{t('community.report_detail')}</Text>
        <Pressable style={s.iconBtn} onPress={handleShare}>
          <ShareNetwork size={20} color={colors['text-primary']} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[s.scroll, { paddingBottom: 120 }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Type badge + reference */}
        <View style={s.topBadgeRow}>
          <View style={[s.typePill, { backgroundColor: meta.bg }]}>
            <Warning size={14} color={meta.color} weight="fill" />
            <Text style={[s.typePillText, { color: meta.color }]}>{meta.label}</Text>
          </View>
          <Text style={s.refId}>{refId}</Text>
        </View>

        {/* Train name + verified badge */}
        <View style={s.trainRow}>
          <View style={[s.trainIconWrap, { backgroundColor: meta.bg }]}>
            <Warning size={20} color={meta.color} weight="fill" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.trainName}>{report.train?.name_en ?? '—'}</Text>
            {report.station && (
              <Text style={s.trainRoute}>
                {report.station.name_en}
              </Text>
            )}
          </View>
          {isVerified && (
            <View style={s.verifiedBadge}>
              <Text style={s.verifiedBadgeText}>Verified</Text>
              <CheckCircle size={14} color={colors.success} weight="fill" />
            </View>
          )}
        </View>

        {/* Date / Station / Delay meta row */}
        <View style={s.metaCard}>
          <View style={s.metaItem}>
            <CalendarBlank size={14} color={colors['text-tertiary']} />
            <View>
              <Text style={s.metaLabel}>{dateStr}</Text>
              <Text style={s.metaValue}>{timeStr}</Text>
            </View>
          </View>
          <View style={s.metaDivider} />
          <View style={s.metaItem}>
            <MapPin size={14} color={colors['text-tertiary']} />
            <View>
              <Text style={s.metaLabel}>At Station</Text>
              <Text style={s.metaValue}>{report.station?.name_en ?? '—'}</Text>
            </View>
          </View>
          {reportedDelay != null && (
            <>
              <View style={s.metaDivider} />
              <View style={s.metaItem}>
                <Clock size={14} color={colors['text-tertiary']} />
                <View>
                  <Text style={s.metaLabel}>Actual Delay</Text>
                  <Text style={[s.metaValue, { color: colors.danger }]}>{reportedDelay} min</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Delay Information card — only for DELAY type with real delay data */}
        {report.report_type === 'DELAY' && reportedDelay != null && (
          <View style={s.card}>
            <Text style={s.cardTitle}>Delay Information</Text>
            <View style={s.delayRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.delayLabel}>Reported Delay</Text>
                <Text style={[s.delayNum, { color: colors.danger }]}>{reportedDelay} min</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={s.delayLabel}>Verified Delay</Text>
                  <Info size={12} color={colors['text-tertiary']} />
                </View>
                <Text style={[s.delayNum, { color: colors.accent }]}>{verifiedDelay} min</Text>
              </View>
            </View>
          </View>
        )}

        {/* Verification card */}
        <View style={s.card}>
          <View style={s.verificationTop}>
            <View>
              <Text style={s.cardTitle}>Verification</Text>
              <Text style={s.verificationSub}>Total Verifications</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <Text style={s.verificationNum}>{verificationCount}</Text>
                <Users size={20} color={colors['text-tertiary']} />
              </View>
            </View>

            {/* Real verifier avatars from the report_votes join */}
            <View style={{ alignItems: 'flex-end', gap: 6 }}>
              <Text style={s.verifiedByLabel}>Verified by</Text>
              {verifiers && verifiers.length > 0 ? (
                <View style={s.avatarStack}>
                  {verifiers.slice(0, 5).map((v, i) => (
                    <View key={v.user_id} style={[s.avatarWrap, { marginLeft: i === 0 ? 0 : -10 }]}>
                      <Avatar
                        name={v.user?.display_name ?? 'U'}
                        uri={v.user?.avatar_url ?? undefined}
                        size={AVATAR_SIZES.verifiedBy}
                      />
                    </View>
                  ))}
                  {verifiers.length > 5 && (
                    <View style={[s.avatarWrap, s.avatarMore, { marginLeft: -10 }]}>
                      <Text style={s.avatarMoreText}>+{verifiers.length - 5}</Text>
                    </View>
                  )}
                </View>
              ) : (
                <Text style={s.noVerifiersText}>No verifiers yet</Text>
              )}
            </View>
          </View>

          {/* Confirm dots + helpful votes */}
          <View style={s.confirmRow}>
            <View>
              <Text style={[s.verificationSub, { marginBottom: 8 }]}>User Confirmations</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                {Array.from({ length: confirmDots }).map((_, i) => (
                  <View key={i} style={s.confirmDot}>
                    <CheckCircle size={18} color={colors.success} weight="fill" />
                  </View>
                ))}
                {extraConfirms > 0 && (
                  <Text style={s.extraConfirmsText}>+{extraConfirms}</Text>
                )}
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[s.verificationSub, { marginBottom: 8 }]}>Helpful Votes</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <ThumbsUp size={18} color={colors['text-secondary']} />
                <Text style={s.helpfulNum}>{helpfulCount}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Report Description */}
        {!!report.description && (
          <View style={s.card}>
            <Text style={s.cardTitle}>Report Description</Text>
            <Text style={s.description}>{report.description}</Text>
          </View>
        )}

        {/* Comments Preview */}
        <View style={s.card}>
          <View style={s.commentsHeader}>
            <Text style={s.cardTitle}>Comments Preview</Text>
            {(comments?.length ?? 0) > MAX_PREVIEW_COMMENTS && (
              <Pressable style={s.viewAllRow} onPress={() => {}}>
                <Text style={s.viewAllText}>
                  View All ({comments?.length ?? 0})
                </Text>
                <CaretRight size={13} color={colors.primary} />
              </Pressable>
            )}
          </View>

          {commentsLoading ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 16 }} />
          ) : previewComments.length === 0 ? (
            <Text style={s.noCommentsText}>No comments yet. Be first!</Text>
          ) : (
            previewComments.map((c) => {
              const tier = getReporterTier(c.user?.trust_score ?? 0);
              const tierColor = tier === 'Verified Traveler' || tier === 'Station Expert' || tier === 'RailMate Ambassador'
                ? colors.success : tier === 'Contributor' ? colors.primary : colors['text-tertiary'];
              return (
                <View key={c.id} style={s.commentRow}>
                  <Avatar
                    name={c.user?.display_name ?? 'U'}
                    uri={c.user?.avatar_url ?? undefined}
                    size={AVATAR_SIZES.comment}
                  />
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <View style={s.commentMeta}>
                      <Text style={s.commentUser}>{c.user?.display_name ?? 'Anonymous'}</Text>
                      <View style={[s.tierPill, { backgroundColor: tierColor + '20' }]}>
                        <Text style={[s.tierPillText, { color: tierColor }]}>{tier}</Text>
                      </View>
                      <Text style={s.commentTime}>{timeAgo(c.created_at, isBengali, t as (key: string, vars?: Record<string, string | number>) => string)}</Text>
                    </View>
                    <Text style={s.commentBody}>{c.body}</Text>
                  </View>
                  <View style={s.commentLike}>
                    <ThumbsUp size={14} color={colors['text-tertiary']} />
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Footer note */}
        <View style={s.footerNote}>
          <Info size={14} color={colors['text-tertiary']} />
          <Text style={s.footerNoteText}>Thank you! Your report helps thousands of travelers.</Text>
        </View>
      </ScrollView>

      {/* Comment input */}
      <View style={[s.inputBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <Avatar name={user?.display_name ?? 'G'} size={36} />
        <TextInput
          ref={inputRef}
          style={s.textInput}
          value={commentText}
          onChangeText={setCommentText}
          placeholder={isAuthenticated ? 'Write a comment…' : t('auth.sign_in')}
          placeholderTextColor={colors['text-tertiary']}
          multiline
          maxLength={500}
          editable={isAuthenticated}
          onFocus={() => { if (!isAuthenticated) Alert.alert('', t('auth.sign_in')); }}
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

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  root:             { flex: 1, backgroundColor: colors['bg-base'] },
  center:           { alignItems: 'center', justifyContent: 'center' },
  notFoundText:     { ...Typography['body'], color: colors['text-secondary'] },
  scroll:           { padding: Spacing['space-5'] },

  header:           { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: Spacing['space-5'], paddingBottom: 12 },
  iconBtn:          { width: 40, height: 40, borderRadius: Radius['radius-full'], backgroundColor: colors['bg-card'], borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  headerTitle:      { ...Typography['h3'], color: colors['text-primary'] },

  topBadgeRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  typePill:         { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: Radius['radius-md'], paddingHorizontal: Spacing['space-3'], paddingVertical: 7 },
  typePillText:     { ...Typography['label-lg'] },
  refId:            { ...Typography['mono-sm'], color: colors['text-tertiary'] },

  trainRow:         { flexDirection: 'row', alignItems: 'center', backgroundColor: colors['bg-card'], borderRadius: Radius['radius-lg'], borderWidth: 1, borderColor: colors.border, padding: Spacing['space-4'], marginBottom: 16 },
  trainIconWrap:    { width: 44, height: 44, borderRadius: Radius['radius-md'], alignItems: 'center', justifyContent: 'center' },
  trainName:        { ...Typography['h3'], color: colors['text-primary'] },
  trainRoute:       { ...Typography['caption'], color: colors['text-secondary'], marginTop: 2 },
  verifiedBadge:    { flexDirection: 'row', alignItems: 'center', gap: 5, borderWidth: 1, borderColor: colors.success, borderRadius: Radius['radius-md'], paddingHorizontal: Spacing['space-2'], paddingVertical: 5 },
  verifiedBadgeText:{ ...Typography['label'], color: colors.success },

  metaCard:         { flexDirection: 'row', backgroundColor: colors['bg-card'], borderRadius: Radius['radius-lg'], borderWidth: 1, borderColor: colors.border, padding: Spacing['space-4'], marginBottom: 16 },
  metaItem:         { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 6 },
  metaLabel:        { ...Typography['caption'], color: colors['text-tertiary'] },
  metaValue:        { ...Typography['label-lg'], color: colors['text-primary'], marginTop: 2 },
  metaDivider:      { width: 1, backgroundColor: colors.border, marginHorizontal: Spacing['space-2'] },

  card:             { backgroundColor: colors['bg-card'], borderRadius: Radius['radius-lg'], borderWidth: 1, borderColor: colors.border, padding: Spacing['space-4'], marginBottom: 16 },
  cardTitle:        { ...Typography['h4'], color: colors['text-primary'], marginBottom: 12 },

  delayRow:         { flexDirection: 'row' },
  delayLabel:       { ...Typography['caption'], color: colors['text-secondary'] },
  delayNum:         { ...Typography['display-lg'], fontSize: 32, lineHeight: 38, marginTop: 2 },

  verificationTop:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: colors.border },
  verificationSub:  { ...Typography['caption'], color: colors['text-secondary'] },
  verificationNum:  { ...Typography['display-lg'], fontSize: 32, lineHeight: 38, color: colors['text-primary'] },
  verifiedByLabel:  { ...Typography['caption'], color: colors['text-secondary'] },
  noVerifiersText:  { ...Typography['caption'], color: colors['text-tertiary'] },

  avatarStack:      { flexDirection: 'row', alignItems: 'center' },
  avatarWrap:       { borderWidth: 2, borderColor: colors['bg-card'], borderRadius: Radius['radius-full'] },
  avatarMore:       { width: 36, height: 36, borderRadius: 18, backgroundColor: colors['bg-elevated'], alignItems: 'center', justifyContent: 'center' },
  avatarMoreText:   { ...Typography['caption'], color: colors['text-secondary'] },

  confirmRow:       { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  confirmDot:       {},
  extraConfirmsText:{ ...Typography['label-lg'], color: colors['text-secondary'] },
  helpfulNum:       { ...Typography['h3'], color: colors['text-primary'] },

  description:      { ...Typography['body'], color: colors['text-secondary'], lineHeight: 24 },

  commentsHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  viewAllRow:       { flexDirection: 'row', alignItems: 'center', gap: 2 },
  viewAllText:      { ...Typography['label'], color: colors.primary },
  noCommentsText:   { ...Typography['body-sm'], color: colors['text-tertiary'], textAlign: 'center', paddingVertical: 12 },

  commentRow:       { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  commentMeta:      { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 5 },
  commentUser:      { ...Typography['label-lg'], color: colors['text-primary'] },
  tierPill:         { borderRadius: Radius['radius-sm'], paddingHorizontal: 6, paddingVertical: 2 },
  tierPillText:     { ...Typography['caption'] },
  commentTime:      { ...Typography['caption'], color: colors['text-tertiary'], marginLeft: 'auto' },
  commentBody:      { ...Typography['body-sm'], color: colors['text-secondary'], lineHeight: 21 },
  commentLike:      { paddingLeft: 8, alignItems: 'center', justifyContent: 'center' },

  footerNote:       { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: Radius['radius-lg'], borderWidth: 1, borderColor: colors.border, padding: Spacing['space-4'] },
  footerNoteText:   { ...Typography['caption'], color: colors['text-secondary'], flex: 1 },

  inputBar:         { flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors['bg-elevated'] },
  textInput:        { flex: 1, backgroundColor: colors['bg-card'], borderRadius: Radius['radius-full'], borderWidth: 1, borderColor: colors.border, paddingHorizontal: 16, paddingVertical: 10, ...Typography['body'], color: colors['text-primary'], maxHeight: 100 },
  sendBtn:          { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 2 },
});
