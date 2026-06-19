/**
 * community.tsx — RailMate Community Tab
 *
 * Master Reference v2.1:
 *  Part 04  — canonical 5-tab nav, Community is tab 4
 *  Part 11  — trust/reputation/badge/tier system
 *  Part 03  — design tokens (colors, typography, icons)
 *
 * Design intent: railway intelligence network, NOT a social feed.
 * Zero comments · zero followers · zero likes.
 * Every element reinforces: Trust · Accuracy · Verification · Railway usefulness.
 */

import React, { useMemo, useState, useCallback } from 'react';
import {
  View, ScrollView, Pressable, StyleSheet, Text,
  FlatList, ActivityIndicator, Alert, Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Plus, Info, CheckCircle, WarningCircle, SealCheck,
  Users, Flag, Crown, Star, Train, MedalMilitary,
  ShieldCheck, ChartBar, ArrowRight,
} from 'phosphor-react-native';
import { ErrorBoundary } from '../../components/ErrorBoundary';
import { Avatar } from '../../components/ui/Avatar/Avatar';
import { useCommunityReports, useVoteReport } from '../../hooks/useCommunityReports';
import { useAuthStore } from '../../stores/authStore';
import { useThemeColors, ThemeColors } from '../../hooks/useThemeColors';
import { useTranslation, TranslationKey } from '../../i18n';
import type { ReportFilter, ReportType } from '../../types/report.types';

// ─── Constants ────────────────────────────────────────────────────────────────

// Report type accent colors — Part 03.5 Community Report Card spec
// Delay → danger  |  Crowding → accent  |  Platform/other → info
const TYPE_COLORS: Record<string, string> = {
  DELAY:    '#E8394B',
  CROWD:    '#F5A623',
  PLATFORM: '#4EA8E0',
  GENERAL:  '#8FA3C0',
};

// Tier ladder — Part 11.5
const TIERS = [
  { id: 'explorer',          labelEn: 'Explorer',             labelBn: 'এক্সপ্লোরার',           requirementEn: 'Start reporting',      requirementBn: 'রিপোর্ট শুরু করুন',     minReports: 0,   maxReports: 9,        icon: Train,         color: '#8FA3C0' },
  { id: 'contributor',       labelEn: 'Contributor',          labelBn: 'অবদানকারী',              requirementEn: '10+ reports',          requirementBn: '১০+ রিপোর্ট',            minReports: 10,  maxReports: 49,       icon: Flag,          color: '#F5A623' },
  { id: 'verified_traveler', labelEn: 'Verified Traveler',    labelBn: 'যাচাইকৃত যাত্রী',        requirementEn: '50+ accepted reports', requirementBn: '৫০+ গৃহীত রিপোর্ট',     minReports: 50,  maxReports: 99,       icon: SealCheck,     color: '#00A859' },
  { id: 'station_expert',    labelEn: 'Station Expert',       labelBn: 'স্টেশন বিশেষজ্ঞ',         requirementEn: '100+ reports',         requirementBn: '১০০+ রিপোর্ট',           minReports: 100, maxReports: 199,      icon: Star,          color: '#4EA8E0' },
  { id: 'ambassador',        labelEn: 'RailMate Ambassador',  labelBn: 'রেলমেট অ্যাম্বাসেডর',     requirementEn: '200+ reports',         requirementBn: '২০০+ রিপোর্ট',           minReports: 200, maxReports: Infinity, icon: Crown,         color: '#F5A623' },
] as const;

// Achievement milestones — Part 11.5
const ACHIEVEMENTS = [
  { id: 'first_report',     labelEn: 'First Report',     labelBn: 'প্রথম রিপোর্ট',      icon: Flag,           threshold: 1,  field: 'report_count'       as const },
  { id: 'ten_reports',      labelEn: '10 Reports',       labelBn: '১০ রিপোর্ট',          icon: ChartBar,       threshold: 10, field: 'report_count'       as const },
  { id: 'fifty_reports',    labelEn: '50 Reports',       labelBn: '৫০ রিপোর্ট',          icon: MedalMilitary,  threshold: 50, field: 'report_count'       as const },
  { id: 'trusted_reporter', labelEn: 'Trusted Reporter', labelBn: 'বিশ্বস্ত রিপোর্টার',  icon: ShieldCheck,    threshold: 1,  field: 'is_trusted'         as const },
  { id: 'delay_master',     labelEn: 'Delay Master',     labelBn: 'বিলম্ব মাস্টার',       icon: WarningCircle,  threshold: 20, field: 'report_count'       as const },
  { id: 'helpful_traveler', labelEn: 'Helpful Traveler', labelBn: 'সহায়ক যাত্রী',        icon: Users,          threshold: 50, field: 'helpful_vote_count' as const },
] as const;

// MVP feed tabs — "Following" omitted; social graph doesn't exist yet (Part 11 + spec recommendation)
const FEED_FILTERS = ['all', 'verified', 'mine'] as const;
type FeedFilter = typeof FEED_FILTERS[number];

// ─── Pure helpers ─────────────────────────────────────────────────────────────

function formatTime(iso?: string): string {
  if (!iso) return '';
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getTier(reportCount: number) {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (reportCount >= TIERS[i].minReports) return TIERS[i];
  }
  return TIERS[0];
}

function railPoints(reportCount: number, helpfulVotes: number) {
  return reportCount * 10 + helpfulVotes * 5;
}

// ─── TrustModal ───────────────────────────────────────────────────────────────

function TrustModal({ visible, onClose, colors }: {
  visible: boolean; onClose: () => void; colors: ThemeColors;
}) {
  const s = useMemo(() => StyleSheet.create({
    overlay:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.72)', justifyContent: 'flex-end' },
    sheet:    { backgroundColor: colors['bg-elevated'], borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 44 },
    handle:   { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginBottom: 22 },
    title:    { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 20, color: colors['text-primary'], marginBottom: 20 },
    row:      { flexDirection: 'row', gap: 14, marginBottom: 18, alignItems: 'flex-start' },
    iconWrap: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors['primary-subtle'], alignItems: 'center', justifyContent: 'center', marginTop: 2 },
    iTitle:   { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors['text-primary'], marginBottom: 3 },
    iBody:    { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors['text-secondary'], lineHeight: 20 },
    closeBtn: { marginTop: 6, paddingVertical: 14, backgroundColor: colors['bg-card'], borderRadius: 12, alignItems: 'center' },
    closeTxt: { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors['text-primary'] },
  }), [colors]);

  const ITEMS = [
    { icon: Star,          title: 'RailPoints',    body: 'Earned for every accepted report (+10 pts) and helpful vote (+5 pts). More points unlock higher tiers.' },
    { icon: ShieldCheck,   title: 'Trust Score',   body: 'A 0–5 score reflecting report accuracy. Rises when others confirm your reports; drops when disputed.' },
    { icon: SealCheck,     title: 'Verification',  body: 'Reports confirmed by 5+ travelers earn a Verified badge and rise to the top of the feed.' },
    { icon: MedalMilitary, title: 'Badges',        body: 'Awarded at milestones: First Report, 10 Reports, 50 Reports, Trusted Reporter, Delay Master, and more.' },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={s.overlay} onPress={onClose}>
        <Pressable onPress={(e) => e.stopPropagation()}>
          <View style={s.sheet}>
            <View style={s.handle} />
            <Text style={s.title}>How Trust Works</Text>
            {ITEMS.map((item) => {
              const IconComp = item.icon;
              return (
                <View key={item.title} style={s.row}>
                  <View style={s.iconWrap}>
                    <IconComp size={18} color={colors.primary} weight="bold" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.iTitle}>{item.title}</Text>
                    <Text style={s.iBody}>{item.body}</Text>
                  </View>
                </View>
              );
            })}
            <Pressable style={s.closeBtn} onPress={onClose}>
              <Text style={s.closeTxt}>Got it</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── ReputationCard ───────────────────────────────────────────────────────────

function ReputationCard({ colors, isBengali, s }: { colors: ThemeColors; isBengali: boolean; s: ReturnType<typeof createStyles> }) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <View style={[s.repCard, { borderColor: colors.border }]}>
        <View style={[s.repGlowBar, { backgroundColor: colors.border }]} />
        <View style={{ padding: 20 }}>
          <Text style={s.repGuestTitle}>
            {isBengali ? 'আপনার রেল যাত্রা এখান থেকেই শুরু।' : 'Your railway journey starts here.'}
          </Text>
          <Text style={s.repGuestSub}>
            {isBengali ? 'প্রথম রিপোর্ট জমা দিন এবং অন্য যাত্রীদের সহায়তা করুন।' : 'Submit your first report and help fellow travelers.'}
          </Text>
        </View>
      </View>
    );
  }

  const reportCount  = user?.report_count ?? 0;
  const helpfulVotes = user?.helpful_vote_count ?? 0;
  const trustScore   = user?.trust_score ?? 1.0;
  const tier         = getTier(reportCount);
  const nextIdx      = TIERS.findIndex((t) => t.id === tier.id) + 1;
  const nextTier     = nextIdx < TIERS.length ? TIERS[nextIdx] : null;
  const pts          = railPoints(reportCount, helpfulVotes);
  const accuracy     = Math.round(Math.min((trustScore / 5) * 100, 100));
  const progressPct  = nextTier
    ? Math.min((reportCount - tier.minReports) / (nextTier.minReports - tier.minReports), 1)
    : 1;

  const TierIcon = tier.icon;

  return (
    <View style={[s.repCard, { borderColor: tier.color + '55' }]}>
      <View style={[s.repGlowBar, { backgroundColor: tier.color }]} />
      <View style={s.repTopRow}>
        <Avatar name={user?.display_name ?? 'U'} size={52} />
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={s.repName}>{user?.display_name ?? 'Traveler'}</Text>
          <View style={[s.tierPill, { backgroundColor: tier.color + '22', borderColor: tier.color + '55' }]}>
            <TierIcon size={11} color={tier.color} weight="fill" />
            <Text style={[s.tierPillTxt, { color: tier.color }]}>
              {isBengali ? tier.labelBn : tier.labelEn}
            </Text>
          </View>
        </View>
        <View style={s.trustBox}>
          <Text style={s.trustNum}>{trustScore.toFixed(1)}</Text>
          <Text style={s.trustLabel}>Trust</Text>
        </View>
      </View>

      <View style={s.repStatsRow}>
        {[
          { val: pts.toLocaleString(),  label: isBengali ? 'রেলপয়েন্ট' : 'RailPoints' },
          { val: String(reportCount),   label: isBengali ? 'রিপোর্ট' : 'Reports'     },
          { val: `${accuracy}%`,        label: isBengali ? 'নির্ভুলতা' : 'Accuracy'  },
        ].map((stat, i) => (
          <View key={i} style={[s.repStat, i > 0 && { borderLeftWidth: 1, borderLeftColor: colors.border }]}>
            <Text style={s.repStatVal}>{stat.val}</Text>
            <Text style={s.repStatLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {nextTier && (
        <View style={s.progressWrap}>
          <View style={s.progressBg}>
            <View style={[s.progressFill, { width: `${progressPct * 100}%` as any, backgroundColor: tier.color }]} />
          </View>
          <Text style={s.progressTxt}>
            {reportCount} / {nextTier.minReports}{'  ·  '}
            {isBengali ? `পরের: ${nextTier.labelBn}` : `Next: ${nextTier.labelEn}`}
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── TierCarousel ─────────────────────────────────────────────────────────────

function TierCarousel({ colors, isBengali, s }: { colors: ThemeColors; isBengali: boolean; s: ReturnType<typeof createStyles> }) {
  const { user } = useAuthStore();
  const reportCount = user?.report_count ?? 0;
  const current     = getTier(reportCount);

  return (
    <View>
      <Text style={s.sectionTitle}>{isBengali ? 'টায়ার' : 'Tiers'}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 20, paddingBottom: 4 }}>
        {TIERS.map((tier) => {
          const isActive = tier.id === current.id;
          const isLocked = reportCount < tier.minReports;
          const IconComp = tier.icon;
          return (
            <View key={tier.id} style={[s.tierCard, isActive && { borderColor: tier.color, backgroundColor: tier.color + '14' }, isLocked && { opacity: 0.38 }]}>
              <View style={[s.tierIconWrap, { backgroundColor: tier.color + '28' }]}>
                <IconComp size={20} color={isLocked ? colors['text-tertiary'] : tier.color} weight={isActive ? 'fill' : 'regular'} />
              </View>
              <Text style={[s.tierCardTitle, isActive && { color: tier.color }]} numberOfLines={2}>
                {isBengali ? tier.labelBn : tier.labelEn}
              </Text>
              <Text style={s.tierCardReq} numberOfLines={2}>
                {isBengali ? tier.requirementBn : tier.requirementEn}
              </Text>
              {isActive && <View style={[s.activeDot, { backgroundColor: tier.color }]} />}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ─── ReportCard ───────────────────────────────────────────────────────────────
// Actions: Confirm + Dispute only. No comments. No share. No likes.

function ReportCard({ item, colors, isBengali, s, onConfirm, onFlag }: {
  item: any; colors: ThemeColors; isBengali: boolean; s: ReturnType<typeof createStyles>;
  onConfirm: (id: string, current: any) => void;
  onFlag: (id: string) => void;
}) {
  const typeColor   = TYPE_COLORS[item.report_type] ?? colors['text-tertiary'];
  const isVerified  = item.status === 'VERIFIED';
  const hasConfirmed = item.current_user_vote === 'CONFIRM';
  const hasDisputed  = item.current_user_vote === 'DISPUTE';

  const TYPE_LABEL: Record<string, [string, string]> = {
    DELAY:    ['Delay',    'বিলম্ব'],
    CROWD:    ['Crowding', 'ভিড়'],
    PLATFORM: ['Platform', 'প্ল্যাটফর্ম'],
    GENERAL:  ['General',  'সাধারণ'],
  };
  const [labelEn, labelBn] = TYPE_LABEL[item.report_type] ?? [item.report_type, item.report_type];

  return (
    <View style={s.card}>
      <View style={[s.cardAccent, { backgroundColor: typeColor }]} />
      <View style={s.cardInner}>

        {/* Reporter */}
        <View style={s.reporterRow}>
          <Avatar name={item.user?.display_name ?? 'U'} size={36} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={s.reporterName}>{item.user?.display_name ?? 'Traveler'}</Text>
              {item.user?.is_trusted && (
                <View style={s.trustedBadge}>
                  <SealCheck size={10} color={colors.primary} weight="fill" />
                  <Text style={s.trustedTxt}>Trusted</Text>
                </View>
              )}
            </View>
            {item.user?.trust_score != null && (
              <Text style={s.reporterTrust}>Trust {Number(item.user.trust_score).toFixed(1)}</Text>
            )}
          </View>
          <View style={[s.typePill, { backgroundColor: typeColor + '18', borderColor: typeColor + '44' }]}>
            <Text style={[s.typePillTxt, { color: typeColor }]}>{isBengali ? labelBn : labelEn}</Text>
          </View>
        </View>

        {/* Train name */}
        {item.train && (
          <View style={s.trainRow}>
            <Train size={13} color={colors['text-tertiary']} />
            <Text style={s.trainTxt} numberOfLines={1}>
              {isBengali ? item.train.name_bn : item.train.name_en}
              {item.train.number ? ` #${item.train.number}` : ''}
            </Text>
            <Text style={s.timeTxt}>{formatTime(item.created_at ?? item.reported_at)}</Text>
          </View>
        )}

        {/* Report body */}
        {!!item.description && (
          <Text style={s.descTxt}>{item.description}</Text>
        )}

        {/* Delay specifics */}
        {item.report_type === 'DELAY' && item.delay_minutes != null && (
          <View style={s.delayChip}>
            <WarningCircle size={13} color={colors.danger} weight="fill" />
            <Text style={[s.delayChipTxt, { color: colors.danger }]}>{item.delay_minutes} min late</Text>
          </View>
        )}

        {/* Verification status */}
        <View style={s.verifyRow}>
          {isVerified && (
            <View style={s.verifiedPill}>
              <CheckCircle size={13} color={colors.success} weight="fill" />
              <Text style={s.verifiedTxt}>Verified</Text>
            </View>
          )}
          <Text style={s.confirmCount}>✓ Confirmed by {item.verification_count ?? 0} travelers</Text>
        </View>

        {/* Actions — Confirm and Dispute only */}
        <View style={s.actionRow}>
          <Pressable
            style={[s.actionBtn, hasConfirmed && { backgroundColor: colors['primary-subtle'], borderColor: colors.primary }]}
            onPress={() => onConfirm(item.id, item.current_user_vote)}
          >
            <CheckCircle size={15} color={hasConfirmed ? colors.primary : colors['text-secondary']} weight={hasConfirmed ? 'fill' : 'regular'} />
            <Text style={[s.actionTxt, hasConfirmed && { color: colors.primary }]}>Confirm</Text>
          </Pressable>

          <Pressable
            style={[s.actionBtn, hasDisputed && { backgroundColor: colors['danger-subtle'], borderColor: colors.danger }]}
            onPress={() => {/* TODO: wire dispute mutation */}}
          >
            <WarningCircle size={15} color={hasDisputed ? colors.danger : colors['text-secondary']} weight={hasDisputed ? 'fill' : 'regular'} />
            <Text style={[s.actionTxt, hasDisputed && { color: colors.danger }]}>Dispute</Text>
          </Pressable>

          <Pressable style={s.flagBtn} onPress={() => onFlag(item.id)}>
            <Flag size={15} color={colors['text-tertiary']} />
          </Pressable>
        </View>

      </View>
    </View>
  );
}

// ─── StatsGrid ────────────────────────────────────────────────────────────────

function StatsGrid({ reports, colors, isBengali, s }: { reports: any[]; colors: ThemeColors; isBengali: boolean; s: ReturnType<typeof createStyles> }) {
  const today      = new Date().toDateString();
  const todayCount = reports.filter((r) => new Date(r.created_at ?? r.reported_at).toDateString() === today).length;
  const verified   = reports.filter((r) => r.status === 'VERIFIED').length;
  const unique     = new Set(reports.map((r) => r.user_id)).size;
  const topTrain   = (() => {
    const m: Record<string, number> = {};
    reports.forEach((r) => { if (r.train?.name_en) m[r.train.name_en] = (m[r.train.name_en] ?? 0) + 1; });
    const t = Object.entries(m).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';
    return t.length > 14 ? t.slice(0, 13) + '…' : t;
  })();

  const STATS = [
    { val: String(todayCount), label: isBengali ? 'আজকের রিপোর্ট' : 'Reports Today', Icon: Flag        },
    { val: String(verified),   label: isBengali ? 'যাচাইকৃত' : 'Verified',            Icon: SealCheck   },
    { val: String(unique),     label: isBengali ? 'সক্রিয় সদস্য' : 'Contributors',    Icon: Users       },
    { val: topTrain,           label: isBengali ? 'সর্বাধিক রিপোর্ট' : 'Most Reported', Icon: Train      },
  ];

  return (
    <View>
      <Text style={s.sectionTitle}>{isBengali ? 'কমিউনিটি পরিসংখ্যান' : 'Community Stats'}</Text>
      <View style={s.statsGrid}>
        {STATS.map(({ val, label, Icon }, i) => (
          <View key={i} style={s.statCard}>
            <Icon size={18} color={colors.primary} weight="bold" />
            <Text style={s.statVal}>{val}</Text>
            <Text style={s.statLabel}>{label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── AchievementsSection ──────────────────────────────────────────────────────

function AchievementsSection({ colors, isBengali, s }: { colors: ThemeColors; isBengali: boolean; s: ReturnType<typeof createStyles> }) {
  const { user } = useAuthStore();
  const reportCount  = user?.report_count ?? 0;
  const helpfulVotes = user?.helpful_vote_count ?? 0;
  const isTrusted    = user?.is_trusted ?? false;

  const unlocked = (a: typeof ACHIEVEMENTS[number]) => {
    if (a.field === 'report_count')       return reportCount  >= a.threshold;
    if (a.field === 'helpful_vote_count') return helpfulVotes >= a.threshold;
    if (a.field === 'is_trusted')         return isTrusted;
    return false;
  };

  return (
    <View>
      <Text style={s.sectionTitle}>{isBengali ? 'অর্জন' : 'Achievements'}</Text>
      <View style={s.achieveGrid}>
        {ACHIEVEMENTS.map((ach) => {
          const done     = unlocked(ach);
          const IconComp = ach.icon;
          return (
            <View key={ach.id} style={[s.achieveCard, !done && { opacity: 0.35 }]}>
              <View style={[s.achieveIconWrap, done && { backgroundColor: colors['primary-subtle'] }]}>
                <IconComp size={22} color={done ? colors.primary : colors['text-tertiary']} weight={done ? 'fill' : 'regular'} />
              </View>
              <Text style={[s.achieveLabel, done && { color: colors['text-primary'] }]} numberOfLines={2}>
                {isBengali ? ach.labelBn : ach.labelEn}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ─── ComingSoon ───────────────────────────────────────────────────────────────

function ComingSoon({ colors, isBengali, s }: { colors: ThemeColors; isBengali: boolean; s: ReturnType<typeof createStyles> }) {
  const items = isBengali
    ? ['রুট বিশেষজ্ঞ', 'রেলমেট অ্যাম্বাসেডর', 'কমিউনিটি স্বীকৃতি', 'বেটা অ্যাক্সেস পুরস্কার']
    : ['Route Specialists', 'RailMate Ambassadors', 'Community Recognition', 'Beta Access Rewards'];

  return (
    <View style={s.comingCard}>
      <View style={s.comingHeader}>
        <Crown size={18} color={colors.accent} weight="fill" />
        <Text style={s.comingTitle}>{isBengali ? 'শীঘ্রই আসছে' : 'Coming Soon'}</Text>
      </View>
      {items.map((item) => (
        <View key={item} style={s.comingRow}>
          <ArrowRight size={13} color={colors['text-tertiary']} />
          <Text style={s.comingItem}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────

function CommunityContent() {
  const { t }                       = useTranslation();
  const router                      = useRouter();
  const colors                      = useThemeColors();
  const insets                      = useSafeAreaInsets();
  const s                           = useMemo(() => createStyles(colors), [colors]);
  const { user, isAuthenticated }   = useAuthStore();
  const [feedFilter, setFeedFilter] = useState<FeedFilter>('verified');
  const [showTrust, setShowTrust]   = useState(false);
  const isBengali                   = false; // hook into useTranslation locale when ready

  const apiFilter: ReportFilter = useMemo(() => {
    if (feedFilter === 'verified') return { type: 'VERIFIED' as ReportType };
    if (feedFilter === 'mine' && user?.id) return { userId: user.id };
    return null;
  }, [feedFilter, user?.id]);

  const { data: reports = [], isLoading, refetch, isRefetching } = useCommunityReports(apiFilter);
  const { mutate: vote } = useVoteReport();

  const handleConfirm = useCallback((reportId: string, currentVote: any) => {
    if (!isAuthenticated) { Alert.alert('', t('auth.sign_in')); return; }
    vote({ reportId, voteType: 'CONFIRM', existingVote: currentVote, activeFilter: apiFilter });
  }, [isAuthenticated, apiFilter, vote, t]);

  const handleFlag = useCallback((reportId: string) => {
    if (!isAuthenticated) { Alert.alert('', t('auth.sign_in')); return; }
    Alert.alert('Flag Report', 'This report will be reviewed by our team.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Flag', style: 'destructive', onPress: () => {} },
    ]);
  }, [isAuthenticated, t]);

  const FILTER_LABELS: Record<FeedFilter, string> = {
    all:      isBengali ? 'সব' : 'All',
    verified: isBengali ? 'যাচাইকৃত' : 'Verified',
    mine:     isBengali ? 'আমার রিপোর্ট' : 'My Reports',
  };

  const renderReport = useCallback(({ item }: { item: any }) => (
    <ReportCard item={item} colors={colors} isBengali={isBengali} s={s} onConfirm={handleConfirm} onFlag={handleFlag} />
  ), [colors, isBengali, s, handleConfirm, handleFlag]);

  return (
    <View style={[s.root, { paddingTop: insets.top }]}>

      {/* Header */}
      <View style={s.header}>
        <View style={{ flex: 1 }}>
          <Text style={s.headerTitle}>{isBengali ? 'কমিউনিটি' : 'Community'}</Text>
          <Text style={s.headerSub} numberOfLines={2}>
            {isBengali
              ? 'যাত্রীদের তথ্যেই তৈরি নির্ভরযোগ্য রেলওয়ে কমিউনিটি'
              : 'Trusted railway intelligence powered by travelers'}
          </Text>
        </View>
        <Pressable style={s.infoBtn} onPress={() => setShowTrust(true)}>
          <Info size={20} color={colors['text-secondary']} />
        </Pressable>
      </View>

      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={renderReport}
        onRefresh={refetch}
        refreshing={isRefetching}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        ListHeaderComponent={
          <>
            {/* S1 — Reputation card */}
            <View style={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 }}>
              <ReputationCard colors={colors} isBengali={isBengali} s={s} />
            </View>

            {/* S2 — Tier carousel */}
            <View style={{ marginTop: 8 }}>
              <TierCarousel colors={colors} isBengali={isBengali} s={s} />
            </View>

            {/* S3 — Feed header + filter chips */}
            <View style={s.feedHeaderWrap}>
              <Text style={s.sectionTitle}>{isBengali ? 'কমিউনিটি রিপোর্ট' : 'Community Reports'}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 20, paddingBottom: 12 }}>
                {FEED_FILTERS.map((f) => (
                  <Pressable key={f} style={[s.chip, feedFilter === f && s.chipActive]} onPress={() => setFeedFilter(f)}>
                    <Text style={[s.chipTxt, feedFilter === f && s.chipTxtActive]}>{FILTER_LABELS[f]}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {isLoading && (
              <View style={{ paddingVertical: 40, alignItems: 'center' }}>
                <ActivityIndicator color={colors.primary} size="large" />
              </View>
            )}
          </>
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={s.emptyState}>
              <Train size={40} color={colors['text-tertiary']} weight="thin" />
              <Text style={s.emptyTitle}>
                {feedFilter === 'mine'
                  ? (isBengali ? 'আপনার রেল যাত্রা এখান থেকেই শুরু।' : 'Your railway journey starts here.')
                  : (isBengali ? 'এখনো কোনো রিপোর্ট নেই' : 'No reports yet')}
              </Text>
              <Text style={s.emptySub}>
                {feedFilter === 'mine'
                  ? (isBengali ? 'প্রথম রিপোর্ট জমা দিন এবং অন্য যাত্রীদের সহায়তা করুন।' : 'Submit your first report and help fellow travelers.')
                  : (isBengali ? 'প্রথম রিপোর্ট করুন' : 'Be the first to report on this route.')}
              </Text>
              {feedFilter === 'mine' && (
                <Pressable
                  style={s.emptyBtn}
                  onPress={() => {
                    if (!isAuthenticated) { Alert.alert('', t('auth.sign_in')); return; }
                    router.push('/report/submit' as any);
                  }}
                >
                  <Text style={s.emptyBtnTxt}>
                    {isBengali ? 'প্রথম রিপোর্ট জমা দিন' : 'Submit First Report'}
                  </Text>
                </Pressable>
              )}
            </View>
          ) : null
        }
        ListFooterComponent={
          reports.length > 0 ? (
            <>
              {/* S4 — Stats */}
              <View style={{ marginTop: 8 }}>
                <StatsGrid reports={reports} colors={colors} isBengali={isBengali} s={s} />
              </View>
              {/* S5 — Achievements */}
              <View style={{ marginTop: 8 }}>
                <AchievementsSection colors={colors} isBengali={isBengali} s={s} />
              </View>
              {/* S6 — Coming soon */}
              <View style={{ paddingHorizontal: 20, marginTop: 8, marginBottom: 8 }}>
                <ComingSoon colors={colors} isBengali={isBengali} s={s} />
              </View>
            </>
          ) : null
        }
      />

      {/* FAB */}
      <Pressable
        style={s.fab}
        onPress={() => {
          if (!isAuthenticated) { Alert.alert('', t('auth.sign_in')); return; }
          router.push('/report/submit' as any);
        }}
      >
        <Plus size={18} color={colors['text-inverse']} weight="bold" />
        <Text style={s.fabTxt}>{isBengali ? '+ রিপোর্ট জমা দিন' : '+ Submit Report'}</Text>
      </Pressable>

      <TrustModal visible={showTrust} onClose={() => setShowTrust(false)} colors={colors} />
    </View>
  );
}

export default function CommunityScreen() {
  return <ErrorBoundary name="Community"><CommunityContent /></ErrorBoundary>;
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  root:          { flex: 1, backgroundColor: colors['bg-base'] },

  // Header
  header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  headerTitle:   { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 26, color: colors['text-primary'] },
  headerSub:     { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors['text-secondary'], marginTop: 3, lineHeight: 19 },
  infoBtn:       { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginTop: 2 },

  // Reputation card
  repCard:       { borderRadius: 16, borderWidth: 1.5, overflow: 'hidden', backgroundColor: colors['bg-card'] },
  repGlowBar:    { height: 3 },
  repGuestTitle: { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 17, color: colors['text-primary'], marginBottom: 8 },
  repGuestSub:   { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors['text-secondary'], lineHeight: 20 },
  repTopRow:     { flexDirection: 'row', alignItems: 'center', padding: 16, paddingBottom: 12 },
  repName:       { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 17, color: colors['text-primary'] },
  tierPill:      { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3, marginTop: 5, alignSelf: 'flex-start' },
  tierPillTxt:   { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  trustBox:      { alignItems: 'center', backgroundColor: colors['bg-elevated'], borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, borderColor: colors.border },
  trustNum:      { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 20, color: colors['text-primary'] },
  trustLabel:    { fontFamily: 'Inter_400Regular', fontSize: 10, color: colors['text-secondary'], marginTop: 2 },
  repStatsRow:   { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border },
  repStat:       { flex: 1, alignItems: 'center', paddingVertical: 12 },
  repStatVal:    { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 18, color: colors['text-primary'] },
  repStatLabel:  { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors['text-secondary'], marginTop: 3 },
  progressWrap:  { paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border },
  progressBg:    { height: 6, backgroundColor: colors['bg-elevated'], borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  progressFill:  { height: 6, borderRadius: 3 },
  progressTxt:   { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-secondary'] },

  // Tier carousel
  sectionTitle:  { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 16, color: colors['text-primary'], paddingHorizontal: 20, marginBottom: 12, marginTop: 20 },
  tierCard:      { width: 122, backgroundColor: colors['bg-card'], borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 14 },
  tierIconWrap:  { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  tierCardTitle: { fontFamily: 'Inter_600SemiBold', fontSize: 12, color: colors['text-primary'], marginBottom: 4 },
  tierCardReq:   { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors['text-tertiary'], lineHeight: 16 },
  activeDot:     { width: 6, height: 6, borderRadius: 3, marginTop: 8 },

  // Feed
  feedHeaderWrap:{ marginTop: 8 },
  chip:          { borderWidth: 1, borderColor: colors.border, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  chipActive:    { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTxt:       { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors['text-secondary'] },
  chipTxtActive: { color: colors['text-inverse'] },

  // Report card
  card:          { marginHorizontal: 20, marginTop: 12, backgroundColor: colors['bg-card'], borderRadius: 14, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  cardAccent:    { height: 3 },
  cardInner:     { padding: 14 },
  reporterRow:   { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10 },
  reporterName:  { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors['text-primary'] },
  trustedBadge:  { flexDirection: 'row', alignItems: 'center', gap: 3, backgroundColor: colors['primary-subtle'], borderRadius: 20, paddingHorizontal: 6, paddingVertical: 2 },
  trustedTxt:    { fontFamily: 'Inter_500Medium', fontSize: 10, color: colors.primary },
  reporterTrust: { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors['text-tertiary'], marginTop: 2 },
  typePill:      { borderWidth: 1, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  typePillTxt:   { fontFamily: 'Inter_600SemiBold', fontSize: 11 },
  trainRow:      { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8 },
  trainTxt:      { fontFamily: 'Inter_500Medium', fontSize: 12, color: colors['text-secondary'], flex: 1 },
  timeTxt:       { fontFamily: 'Inter_400Regular', fontSize: 11, color: colors['text-tertiary'] },
  descTxt:       { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-primary'], lineHeight: 22, marginBottom: 10 },
  delayChip:     { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: colors['danger-subtle'], borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, alignSelf: 'flex-start', marginBottom: 10 },
  delayChipTxt:  { fontFamily: 'Inter_600SemiBold', fontSize: 12 },
  verifyRow:     { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
  verifiedPill:  { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors['success-subtle'], borderRadius: 20, paddingHorizontal: 8, paddingVertical: 3 },
  verifiedTxt:   { fontFamily: 'Inter_600SemiBold', fontSize: 11, color: colors.success },
  confirmCount:  { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-tertiary'] },
  actionRow:     { flexDirection: 'row', gap: 8, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10 },
  actionBtn:     { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  actionTxt:     { fontFamily: 'Inter_500Medium', fontSize: 13, color: colors['text-secondary'] },
  flagBtn:       { marginLeft: 'auto', width: 34, height: 34, alignItems: 'center', justifyContent: 'center' },

  // Stats grid
  statsGrid:     { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 10 },
  statCard:      { flex: 1, minWidth: '44%', backgroundColor: colors['bg-card'], borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 16, gap: 6 },
  statVal:       { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 22, color: colors['text-primary'] },
  statLabel:     { fontFamily: 'Inter_400Regular', fontSize: 12, color: colors['text-secondary'] },

  // Achievements
  achieveGrid:   { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 12 },
  achieveCard:   { alignItems: 'center', width: '30%', flex: 1 },
  achieveIconWrap:{ width: 48, height: 48, borderRadius: 24, backgroundColor: colors['bg-card'], borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center', marginBottom: 7 },
  achieveLabel:  { fontFamily: 'Inter_500Medium', fontSize: 11, color: colors['text-secondary'], textAlign: 'center', lineHeight: 16 },

  // Coming soon
  comingCard:    { backgroundColor: colors['bg-card'], borderRadius: 14, borderWidth: 1, borderColor: colors.border, padding: 18, marginBottom: 4 },
  comingHeader:  { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  comingTitle:   { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 15, color: colors['text-primary'] },
  comingRow:     { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  comingItem:    { fontFamily: 'Inter_400Regular', fontSize: 13, color: colors['text-secondary'] },

  // Empty state
  emptyState:    { alignItems: 'center', paddingHorizontal: 40, paddingVertical: 40 },
  emptyTitle:    { fontFamily: 'PlusJakartaSans_700Bold', fontSize: 17, color: colors['text-primary'], textAlign: 'center', marginTop: 16, marginBottom: 8 },
  emptySub:      { fontFamily: 'Inter_400Regular', fontSize: 14, color: colors['text-secondary'], textAlign: 'center', lineHeight: 22 },
  emptyBtn:      { marginTop: 20, backgroundColor: colors.primary, paddingHorizontal: 24, paddingVertical: 13, borderRadius: 12 },
  emptyBtnTxt:   { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors['text-inverse'] },

  // FAB
  fab:           { position: 'absolute', bottom: 90, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.primary, borderRadius: 28, paddingHorizontal: 22, paddingVertical: 14, elevation: 8, shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 12 },
  fabTxt:        { fontFamily: 'Inter_600SemiBold', fontSize: 14, color: colors['text-inverse'] },
});
