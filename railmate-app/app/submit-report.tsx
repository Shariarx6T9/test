// app/submit-report.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { colors as C, spacing as S, radius as R, typography as T } from '../theme';
import { useSubmitReport, useTrainSearch } from '../hooks/useCommunityReports';
import { useAuthStore } from '../stores/authStore';
import { useTranslation } from '../i18n';
import type { ReportType } from '../types/report.types';

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
  const [selectedTrain, setSelectedTrain] = useState<{ id: string; name_en: string; number: string } | null>(null);
  const [reportType, setReportType] = useState<ReportType | null>(null);
  const [delayMinutes, setDelayMinutes] = useState('');
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedError, setSubmittedError] = useState('');

  // All hooks must be called before any conditional returns
  const { data: trainResults } = useTrainSearch(trainQuery);
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
    if (!selectedTrain || !reportType) return;
    try {
      setSubmittedError('');
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
      if (err?.status === 429) {
        setSubmittedError("You've submitted too many reports. Please wait before submitting again.");
      } else {
        setSubmittedError(err?.message ?? t('common.error'));
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
        />
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
                  <Text style={sr.stepTitle}>Step 1: Select Train</Text>
                  <Text style={sr.stepDesc}>Choose the train you want to report on</Text>
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
                    <View style={sr.trainChipIcon} />
                    <Text style={[sr.trainChipNum, selectedTrain?.id === train.id && { color: C.green }]}>
                      {train.number}
                    </Text>
                    <Text style={sr.trainChipName}>{train.name_en}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={sr.orText}>OR</Text>
              <View style={sr.numberField}>
                <Text style={sr.numHash}>#</Text>
                <Text style={sr.numPlaceholder}>e.g., 701</Text>
              </View>
            </View>

            {selectedTrain && (
              <View style={sr.selectedCard}>
                <View style={sr.selectedIcon} />
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
                  <Text style={sr.stepTitle}>Step 2: Report Type</Text>
                  <Text style={sr.stepDesc}>What would you like to report?</Text>
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
                  <Text style={sr.stepTitle}>Step 3: Details</Text>
                  <Text style={sr.stepDesc}>Add more information about the report</Text>
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
                  <Text style={sr.stepTitle}>Step 4: Review</Text>
                  <Text style={sr.stepDesc}>Confirm your report before submitting</Text>
                </View>
              </View>

              <View style={sr.selectedCard}>
                <View style={sr.selectedIcon} />
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
  backBtn: { width: 32, height: 32, backgroundColor: C.surface2, borderRadius: 16 },
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
