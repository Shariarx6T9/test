// app/submit-report.tsx
import React, { useState } from 'react';
import { ArrowLeft, Train as TrainIcon } from 'phosphor-react-native';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../theme';
import { useSubmitReport, useTrainSearch } from '../hooks/useCommunityReports';
import { useAuthStore } from '../stores/authStore';
import { useTranslation } from '../i18n';
import type { ReportType } from '../types/report.types';
import { supabase } from '../lib/supabase';

const STEPS = ['Train', 'Report Type', 'Details', 'Review', 'Submit'];

const REPORT_TYPES: { key: ReportType; label: string }[] = [
  { key: 'DELAY', label: 'Delay' },
  { key: 'CROWD', label: 'Crowding' },
  { key: 'GENERAL', label: 'General' },
  { key: 'PLATFORM', label: 'Platform' },
  { key: 'SCHEDULE', label: 'Schedule' },
];

export default function SubmitReportScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuthStore();
  const [step, setStep] = useState(0);
  const [trainQuery, setTrainQuery] = useState('');
  const [trainNumberQuery, setTrainNumberQuery] = useState('');
  const [selectedTrain, setSelectedTrain] = useState<{ id: string; name_en: string; number: string } | null>(null);
  const [reportType, setReportType] = useState<ReportType | null>(null);
  const [delayMinutes, setDelayMinutes] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedError, setSubmittedError] = useState('');

  // All hooks must be called before any conditional returns
  const { data: trainResults } = useTrainSearch(trainQuery);
  const { data: trainNumberResults } = useTrainSearch(trainNumberQuery);
  const submitReport = useSubmitReport();

  // Auth guard (after all hooks)
  if (!isAuthenticated) {
    return (
      <SafeAreaView style={sr.root}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: S.lg }}>
          <Text style={{ color: C.white, fontSize: T.md, fontWeight: '700' }}>
            {t('community.sign_in_required')}
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: C.green, borderRadius: R.md, padding: S.lg }}
            onPress={() => router.push('/auth/login' as any)}
          >
            <Text style={{ color: C.bg, fontWeight: '700' }}>{t('auth.sign_in')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const handleSubmit = async () => {
    if (!selectedTrain || !reportType || !user?.id) return;

    try {
      setSubmittedError('');

      // Ensure user exists in users table (create if missing)
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (checkError) {
        console.log('[SubmitReport] user check error:', JSON.stringify(checkError, null, 2));
      }

      if (!existingUser) {
        console.log('[SubmitReport] creating user row for:', user.id);
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            phone: user.phone,
            display_name: user.display_name || user.email?.split('@')[0] || 'Traveler',
          });

        if (insertError) {
          console.log('[SubmitReport] user insert error:', JSON.stringify(insertError, null, 2));
        }
      }

      // Now submit the report
      console.log('[SubmitReport] Submitting with data:', JSON.stringify({
        train_id: selectedTrain.id,
        train_number: selectedTrain.number,
        user_id: user.id,
        report_type: reportType,
        delay_minutes: reportType === 'DELAY' && delayMinutes ? parseInt(delayMinutes, 10) : null,
        journey_date: new Date().toISOString().split('T')[0],
      }, null, 2));

      await submitReport.mutateAsync({
        data: {
          train_id: selectedTrain.id,
          report_type: reportType,
          description: description.trim() || null,
          delay_minutes: reportType === 'DELAY' && delayMinutes ? parseInt(delayMinutes, 10) : null,
          journey_date: new Date().toISOString().split('T')[0],
        },
      });
      setSubmitted(true);
    } catch (err: any) {
      console.log('[SubmitReport] error:', JSON.stringify(err, null, 2));
      const msg = (err?.message || '').toLowerCase();
      if (err?.status === 429 || msg.includes('rate limit') || msg.includes('too many')) {
        setSubmittedError('অনেক বেশি রিপোর্ট করা হয়েছে। একটু পরে আবার চেষ্টা করুন।');
      } else if (msg.includes('foreign key') || msg.includes('violates') || msg.includes('fk_')) {
        setSubmittedError('প্রোফাইল সেটআপ প্রয়োজন। আবার চেষ্টা করুন।');
      } else if (msg.includes('schema') || msg.includes('column') || msg.includes('relation')) {
        setSubmittedError('রিপোর্ট জমা দেওয়া যায়নি। আবার চেষ্টা করুন।');
      } else if (msg.includes('network') || msg.includes('fetch')) {
        setSubmittedError('ইন্টারনেট সংযোগ নেই। আবার চেষ্টা করুন।');
      } else if (msg.includes('jwt') || msg.includes('unauthorized') || msg.includes('not authenticated')) {
        setSubmittedError('সেশন মেয়াদ উত্তীর্ণ। আবার লগইন করুন।');
      } else {
        setSubmittedError(`একটি সমস্যা হয়েছে: ${err?.message ?? 'অজানা ত্রুটি'}`);
      }
    }
  };

  if (submitted) {
    return (
      <SafeAreaView style={sr.root}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: S.lg, padding: S.xl }}>
          <View style={{ width: 64, height: 64, backgroundColor: C.greenTint, borderRadius: 32, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 28 }}>✓</Text>
          </View>
          <Text style={{ color: C.white, fontSize: T.lg, fontWeight: '800' }}>{t('community.success')}</Text>
          <Text style={{ color: C.text2, textAlign: 'center' }}>{t('community.success_thanks')}</Text>
          <TouchableOpacity
            style={{ backgroundColor: C.green, borderRadius: R.md, padding: S.lg, minWidth: 120, alignItems: 'center' }}
            onPress={() => {
              setSubmitted(false);
              setStep(0);
              setSelectedTrain(null);
              setReportType(null);
              setDelayMinutes('');
              setDescription('');
              router.back();
            }}
          >
            <Text style={{ color: C.bg, fontWeight: '700', fontSize: T.md }}>{t('community.done')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={sr.root}>
      <View style={sr.header}>
        <TouchableOpacity
          style={sr.backBtn}
          onPress={() => (step > 0 ? setStep(step - 1) : router.back())}
        ><ArrowLeft size={18} color={C.white} /></TouchableOpacity>
        <View>
          <Text style={sr.title}>Submit Report</Text>
          <Text style={sr.subtitle}>Help fellow travelers by sharing real-time updates</Text>
        </View>
      </View>

      {/* Stepper */}
      <View style={sr.stepper}>
        {STEPS.map((stepLabel, i) => (
          <View key={stepLabel} style={sr.stepItem}>
            {i > 0 && <View style={[sr.stepLine, i <= step && { backgroundColor: C.green }]} />}
            <View style={[sr.stepCircle, i === step ? sr.stepCircleActive : i < step ? sr.stepCircleDone : {}]}>
              <Text style={[sr.stepNum, i <= step && { color: i === step ? C.bg : C.green }]}>{i + 1}</Text>
            </View>
            <Text style={[sr.stepLabel, i === step && { color: C.green }]}>{stepLabel}</Text>
          </View>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={sr.scroll}>
        {/* Tip */}
        <View style={sr.tipCard}>
          <View style={sr.tipIcon} />
          <View style={{ flex: 1 }}>
            <Text style={sr.tipTitle}>Your report makes a difference!</Text>
            <Text style={sr.tipSub}>Verified reports help thousands of travelers every day.</Text>
          </View>
          <TouchableOpacity><Text style={{ color: C.text3, fontSize: 18 }}>×</Text></TouchableOpacity>
        </View>

        {/* Step 0: Train selection */}
        {step === 0 && (
          <>
            <View style={sr.card}>
              <View style={sr.stepHeader}>
                <View style={sr.stepIcon} />
                <View>
                  <Text style={sr.stepTitle}>{t('report.step1')}</Text>
                  <Text style={sr.stepDesc}>{t('report.step1_desc')}</Text>
                </View>
              </View>

              <TextInput
                style={[sr.searchField, { color: C.white }]}
                placeholder={t('community.train_label')}
                placeholderTextColor={C.text3}
                value={trainQuery}
                onChangeText={setTrainQuery}
                autoCapitalize="none"
              />

              <Text style={sr.popularLabel}>Popular Trains</Text>
              <View style={sr.popularRow}>
                {(trainResults ?? []).slice(0, 4).map((train) => (
                  <TouchableOpacity
                    key={train.id}
                    style={[sr.trainChip, selectedTrain?.id === train.id && sr.trainChipActive]}
                    onPress={() => setSelectedTrain({ id: train.id, name_en: train.name_en, number: train.number })}
                  >
                    <TrainIcon size={16} color={selectedTrain?.id === train.id ? C.green : C.text2} />
                    <Text style={[sr.trainChipNum, selectedTrain?.id === train.id && { color: C.green }]}>
                      {train.number}
                    </Text>
                    <Text style={sr.trainChipName}>{train.name_en}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={sr.orText}>OR</Text>
              <View style={[sr.numberField, { flexDirection: 'row', alignItems: 'center' }]}>
                <Text style={sr.numHash}>#</Text>
                <TextInput
                  style={{ flex: 1, color: C.white, fontSize: T.base, paddingVertical: S.sm }}
                  placeholder={t('community.train_number_placeholder')}
                  placeholderTextColor={C.text3}
                  keyboardType="number-pad"
                  value={trainNumberQuery}
                  onChangeText={(v) => {
                    const cleaned = v.replace(/[^0-9]/g, '');
                    setTrainNumberQuery(cleaned);
                    // Auto-select if exactly one match found
                    if (trainNumberResults?.length === 1) {
                      const match = trainNumberResults[0];
                      setSelectedTrain({ id: match.id, name_en: match.name_en, number: match.number });
                    }
                  }}
                />
              </View>
              {/* Show number-based search results */}
              {trainNumberQuery.length >= 2 && (trainNumberResults ?? []).length > 0 && (
                <View style={{ gap: 4, marginTop: S.sm }}>
                  {(trainNumberResults ?? []).slice(0, 3).map((train) => (
                    <TouchableOpacity
                      key={train.id}
                      style={[sr.numberField, selectedTrain?.id === train.id && { borderColor: C.green, backgroundColor: C.greenTint }]}
                      onPress={() => setSelectedTrain({ id: train.id, name_en: train.name_en, number: train.number })}
                    >
                      <TrainIcon size={16} color={selectedTrain?.id === train.id ? C.green : C.text2} />
                      <Text style={{ flex: 1, color: selectedTrain?.id === train.id ? C.green : C.white, fontSize: T.sm, marginLeft: S.sm }}>
                        #{train.number} — {train.name_en}
                      </Text>
                      {selectedTrain?.id === train.id && <Text style={{ color: C.green }}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {selectedTrain && (
              <View style={sr.selectedCard}>
                <View style={sr.selectedIconWrap}><TrainIcon size={20} color={C.green} /></View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={sr.selectedName}>{selectedTrain.name_en} ({selectedTrain.number})</Text>
                  <View style={sr.selectedMeta}>
                    <Text style={sr.selectedMetaText}>Train #{selectedTrain.number}</Text>
                  </View>
                </View>
                <Text style={sr.typeText}>Selected</Text>
              </View>
            )}

            <View style={sr.reportingTip}>
              <View style={sr.tipIconSmall} />
              <View style={{ flex: 1 }}>
                <Text style={sr.reportingTipTitle}>Reporting Tips</Text>
                <Text style={sr.reportingTipSub}>
                  Be accurate and specific. Include delay time, station name and other details in next steps.
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[sr.continueBtn, !selectedTrain && { opacity: 0.5 }]}
              disabled={!selectedTrain}
              onPress={() => setStep(1)}
            >
              <Text style={sr.continueBtnText}>Continue</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Step 1: Report type */}
        {step === 1 && (
          <>
            <View style={sr.card}>
              <View style={sr.stepHeader}>
                <View style={sr.stepIcon} />
                <View>
                  <Text style={sr.stepTitle}>{t('report.step2')}</Text>
                  <Text style={sr.stepDesc}>{t('report.step2_desc')}</Text>
                </View>
              </View>
              <View style={{ gap: S.sm }}>
                {REPORT_TYPES.map((rt) => (
                  <TouchableOpacity
                    key={rt.key}
                    style={[
                      sr.numberField,
                      reportType === rt.key && { borderColor: C.green, backgroundColor: C.greenTint },
                    ]}
                    onPress={() => setReportType(rt.key)}
                  >
                    <Text
                      style={{
                        fontSize: T.base,
                        fontWeight: '600',
                        color: reportType === rt.key ? C.green : C.white,
                        flex: 1,
                      }}
                    >
                      {rt.label}
                    </Text>
                    {reportType === rt.key && (
                      <Text style={{ color: C.green, fontWeight: '700' }}>✓</Text>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              style={[sr.continueBtn, !reportType && { opacity: 0.5 }]}
              disabled={!reportType}
              onPress={() => setStep(2)}
            >
              <Text style={sr.continueBtnText}>Continue</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <>
            <View style={sr.card}>
              <View style={sr.stepHeader}>
                <View style={sr.stepIcon} />
                <View>
                  <Text style={sr.stepTitle}>{t('report.step3')}</Text>
                  <Text style={sr.stepDesc}>{t('report.step3_desc')}</Text>
                </View>
              </View>

              {reportType === 'DELAY' && (
                <>
                  <Text style={sr.popularLabel}>{t('community.delay_label')}</Text>
                  <TextInput
                    style={[sr.numberField, { color: C.white }]}
                    placeholder="e.g. 15"
                    placeholderTextColor={C.text3}
                    keyboardType="numeric"
                    value={delayMinutes}
                    onChangeText={setDelayMinutes}
                  />
                </>
              )}

              <Text style={sr.popularLabel}>{t('community.note_label')}</Text>
              <TextInput
                style={[
                  sr.numberField,
                  { color: C.white, height: 100, textAlignVertical: 'top', paddingTop: S.md },
                ]}
                placeholder={t('community.note_placeholder')}
                placeholderTextColor={C.text3}
                multiline
                maxLength={500}
                value={description}
                onChangeText={setDescription}
              />
            </View>

            <TouchableOpacity style={sr.continueBtn} onPress={() => setStep(3)}>
              <Text style={sr.continueBtnText}>Continue</Text>
            </TouchableOpacity>
          </>
        )}

        {/* Step 3: Review & Submit */}
        {step === 3 && (
          <>
            <View style={sr.card}>
              <View style={sr.stepHeader}>
                <View style={sr.stepIcon} />
                <View>
                  <Text style={sr.stepTitle}>{t('report.step4')}</Text>
                  <Text style={sr.stepDesc}>{t('report.step4_desc')}</Text>
                </View>
              </View>

              <View style={sr.selectedCard}>
                <View style={sr.selectedIconWrap}><TrainIcon size={20} color={C.green} /></View>
                <View style={{ flex: 1, gap: 4 }}>
                  <Text style={sr.selectedName}>{selectedTrain?.name_en} ({selectedTrain?.number})</Text>
                  <Text style={sr.selectedRoute}>{reportType}</Text>
                  {description ? <Text style={sr.selectedRoute}>{description}</Text> : null}
                  {reportType === 'DELAY' && delayMinutes ? (
                    <Text style={sr.selectedRoute}>{delayMinutes} min delay</Text>
                  ) : null}
                  <View style={sr.selectedMeta}>
                    <Text style={sr.selectedMetaText}>
                      {new Date().toLocaleDateString()}
                    </Text>
                  </View>
                </View>
              </View>

              {submittedError ? (
                <Text style={{ color: C.red, fontSize: T.sm, marginTop: S.sm }}>{submittedError}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={[sr.continueBtn, submitReport.isPending && { opacity: 0.7 }]}
              disabled={submitReport.isPending}
              onPress={handleSubmit}
            >
              <Text style={sr.continueBtnText}>
                {submitReport.isPending ? 'Submitting...' : t('community.submit')}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const sr = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: S.xl, gap: S.lg, paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: S.md, paddingHorizontal: S.xl, paddingVertical: S.md },
  backBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: C.white },
  subtitle: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: S.xl, paddingVertical: S.md, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border },
  stepItem: { alignItems: 'center', gap: 4 },
  stepLine: { width: 24, height: 2, backgroundColor: C.border, position: 'absolute', right: '100%', top: 12 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' },
  stepCircleActive: { backgroundColor: C.green, borderColor: C.green },
  stepCircleDone: { borderColor: C.green },
  stepNum: { fontSize: T.base, fontWeight: '700', color: C.text2 },
  stepLabel: { fontSize: T.xs, color: C.text2, textAlign: 'center' },
  tipCard: { backgroundColor: C.greenTint, borderRadius: R.md, borderWidth: 1, borderColor: C.greenDark, padding: S.md, flexDirection: 'row', alignItems: 'center', gap: S.sm },
  tipIcon: { width: 32, height: 32, backgroundColor: C.greenDark, borderRadius: 16 },
  tipTitle: { fontSize: T.sm, fontWeight: '700', color: C.green },
  tipSub: { fontSize: T.xs, color: C.text2, marginTop: 2 },
  card: { backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.border, padding: S.xl, gap: S.md },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: S.md },
  stepIcon: { width: 28, height: 28, backgroundColor: C.greenTint, borderRadius: 14 },
  stepTitle: { fontSize: T.md, fontWeight: '700', color: C.white },
  stepDesc: { fontSize: T.sm, color: C.text2, marginTop: 2 },
  searchField: { flexDirection: 'row', alignItems: 'center', gap: S.sm, backgroundColor: C.surface2, borderRadius: R.md, padding: S.md, borderWidth: 1, borderColor: C.border },
  searchDot: { width: 20, height: 20, backgroundColor: C.border, borderRadius: 10 },
  searchPlaceholder: { fontSize: T.base, color: C.text3 },
  popularLabel: { fontSize: T.sm, fontWeight: '600', color: C.text2 },
  popularRow: { flexDirection: 'row', gap: S.sm },
  trainChip: { flex: 1, backgroundColor: C.surface2, borderRadius: R.md, borderWidth: 1, borderColor: C.border, padding: S.sm, alignItems: 'center', gap: 6 },
  trainChipActive: { backgroundColor: C.greenTint, borderColor: C.green },
  trainChipIcon: { width: 28, height: 28, backgroundColor: C.bg, borderRadius: 14 },
  trainChipNum: { fontSize: T.sm, fontWeight: '700', color: C.white },
  trainChipName: { fontSize: 8, color: C.text2, textAlign: 'center' },
  orText: { textAlign: 'center', fontSize: T.sm, color: C.text3 },
  numberField: { flexDirection: 'row', alignItems: 'center', gap: S.sm, backgroundColor: C.surface2, borderRadius: R.md, padding: S.md, borderWidth: 1, borderColor: C.border },
  numHash: { fontSize: 14, fontWeight: '700', color: C.text2 },
  numPlaceholder: { fontSize: T.base, color: C.text3 },
  selectedCard: { flexDirection: 'row', alignItems: 'center', gap: S.md, backgroundColor: C.surface, borderRadius: R.lg, borderWidth: 1, borderColor: C.green, padding: S.lg },
  selectedIcon: { width: 48, height: 48, backgroundColor: C.greenTint, borderRadius: 24 },
  selectedIconWrap: { width: 48, height: 48, backgroundColor: C.greenTint, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  selectedName: { fontSize: 14, fontWeight: '700', color: C.white },
  selectedRoute: { fontSize: T.sm, color: C.text2 },
  selectedMeta: { flexDirection: 'row', gap: S.md },
  selectedMetaText: { fontSize: T.xs, color: C.text3 },
  typeText: { fontSize: T.sm, fontWeight: '600', color: C.blue },
  reportingTip: { flexDirection: 'row', alignItems: 'center', gap: S.md, backgroundColor: C.surface, borderRadius: R.md, borderWidth: 1, borderColor: C.border, padding: S.md },
  tipIconSmall: { width: 28, height: 28, backgroundColor: C.blueTint, borderRadius: 14 },
  reportingTipTitle: { fontSize: T.sm, fontWeight: '700', color: C.blue },
  reportingTipSub: { fontSize: T.xs, color: C.text2, marginTop: 2 },
  continueBtn: { backgroundColor: C.green, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  continueBtnText: { fontSize: T.md, fontWeight: '700', color: C.bg },
});
