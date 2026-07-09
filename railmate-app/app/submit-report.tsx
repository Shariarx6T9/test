// app/submit-report.tsx
import React, { useState } from 'react';
import { ArrowLeft, Train as TrainIcon } from 'phosphor-react-native';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radius, Spacing, Typography } from '../constants';
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
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing['space-4'] }}>
          <Text style={{ color: Colors.dark['text-primary'], ...Typography.h4, fontWeight: '700' }}>
            {t('community.sign_in_required')}
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: Colors.dark.primary, borderRadius: Radius['radius-md'], padding: Spacing['space-4'] }}
            onPress={() => router.push('/auth/login' as any)}
          >
            <Text style={{ color: Colors.dark['bg-base'], fontWeight: '700' }}>{t('auth.sign_in')}</Text>
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
        console.warn('[SubmitReport] user check error:', JSON.stringify(checkError, null, 2));
      }

      if (!existingUser) {
        console.warn('[SubmitReport] creating user row for:', user.id);
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: user.id,
            email: user.email,
            phone: user.phone,
            display_name: user.display_name || user.email?.split('@')[0] || 'Traveler',
          });

        if (insertError) {
          console.warn('[SubmitReport] user insert error:', JSON.stringify(insertError, null, 2));
        }
      }

      // Now submit the report
      console.warn('[SubmitReport] Submitting with data:', JSON.stringify({
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
      console.warn('[SubmitReport] error:', JSON.stringify(err, null, 2));
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
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: Spacing['space-4'], padding: Spacing['space-5'] }}>
          <View style={{ width: 64, height: 64, backgroundColor: Colors.dark['primary-subtle'], borderRadius: 32, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 28 }}>✓</Text>
          </View>
          <Text style={{ color: Colors.dark['text-primary'], ...Typography.h3, fontWeight: '800' }}>{t('community.success')}</Text>
          <Text style={{ color: Colors.dark['text-secondary'], textAlign: 'center' }}>{t('community.success_thanks')}</Text>
          <TouchableOpacity
            style={{ backgroundColor: Colors.dark.primary, borderRadius: Radius['radius-md'], padding: Spacing['space-4'], minWidth: 120, alignItems: 'center' }}
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
            <Text style={{ color: Colors.dark['bg-base'], fontWeight: '700', ...Typography.h4 }}>{t('community.done')}</Text>
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
        ><ArrowLeft size={18} color={Colors.dark['text-primary']} /></TouchableOpacity>
        <View>
          <Text style={sr.title}>Submit Report</Text>
          <Text style={sr.subtitle}>Help fellow travelers by sharing real-time updates</Text>
        </View>
      </View>

      {/* Stepper */}
      <View style={sr.stepper}>
        {STEPS.map((stepLabel, i) => (
          <View key={stepLabel} style={sr.stepItem}>
            {i > 0 && <View style={[sr.stepLine, i <= step && { backgroundColor: Colors.dark.primary }]} />}
            <View style={[sr.stepCircle, i === step ? sr.stepCircleActive : i < step ? sr.stepCircleDone : {}]}>
              <Text style={[sr.stepNum, i <= step && { color: i === step ? Colors.dark['bg-base'] : Colors.dark.primary }]}>{i + 1}</Text>
            </View>
            <Text style={[sr.stepLabel, i === step && { color: Colors.dark.primary }]}>{stepLabel}</Text>
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
          <TouchableOpacity><Text style={{ color: Colors.dark['text-tertiary'], fontSize: 18 }}>×</Text></TouchableOpacity>
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
                style={[sr.searchField, { color: Colors.dark['text-primary'] }]}
                placeholder={t('community.train_label')}
                placeholderTextColor={Colors.dark['text-tertiary']}
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
                    <TrainIcon size={16} color={selectedTrain?.id === train.id ? Colors.dark.primary : Colors.dark['text-secondary']} />
                    <Text style={[sr.trainChipNum, selectedTrain?.id === train.id && { color: Colors.dark.primary }]}>
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
                  style={{ flex: 1, color: Colors.dark['text-primary'], ...Typography.body, paddingVertical: Spacing['space-2'] }}
                  placeholder={t('community.train_number_placeholder')}
                  placeholderTextColor={Colors.dark['text-tertiary']}
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
                <View style={{ gap: 4, marginTop: Spacing['space-2'] }}>
                  {(trainNumberResults ?? []).slice(0, 3).map((train) => (
                    <TouchableOpacity
                      key={train.id}
                      style={[sr.numberField, selectedTrain?.id === train.id && { borderColor: Colors.dark.primary, backgroundColor: Colors.dark['primary-subtle'] }]}
                      onPress={() => setSelectedTrain({ id: train.id, name_en: train.name_en, number: train.number })}
                    >
                      <TrainIcon size={16} color={selectedTrain?.id === train.id ? Colors.dark.primary : Colors.dark['text-secondary']} />
                      <Text style={{ flex: 1, color: selectedTrain?.id === train.id ? Colors.dark.primary : Colors.dark['text-primary'], ...Typography['body-sm'], marginLeft: Spacing['space-2'] }}>
                        #{train.number} — {train.name_en}
                      </Text>
                      {selectedTrain?.id === train.id && <Text style={{ color: Colors.dark.primary }}>✓</Text>}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {selectedTrain && (
              <View style={sr.selectedCard}>
                <View style={sr.selectedIconWrap}><TrainIcon size={20} color={Colors.dark.primary} /></View>
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
              <View style={{ gap: Spacing['space-2'] }}>
                {REPORT_TYPES.map((rt) => (
                  <TouchableOpacity
                    key={rt.key}
                    style={[
                      sr.numberField,
                      reportType === rt.key && { borderColor: Colors.dark.primary, backgroundColor: Colors.dark['primary-subtle'] },
                    ]}
                    onPress={() => setReportType(rt.key)}
                  >
                    <Text
                      style={{
                        ...Typography.body,
                        fontWeight: '600',
                        color: reportType === rt.key ? Colors.dark.primary : Colors.dark['text-primary'],
                        flex: 1,
                      }}
                    >
                      {rt.label}
                    </Text>
                    {reportType === rt.key && (
                      <Text style={{ color: Colors.dark.primary, fontWeight: '700' }}>✓</Text>
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
                    style={[sr.numberField, { color: Colors.dark['text-primary'] }]}
                    placeholder="e.g. 15"
                    placeholderTextColor={Colors.dark['text-tertiary']}
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
                  { color: Colors.dark['text-primary'], height: 100, textAlignVertical: 'top', paddingTop: Spacing['space-3'] },
                ]}
                placeholder={t('community.note_placeholder')}
                placeholderTextColor={Colors.dark['text-tertiary']}
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
                <View style={sr.selectedIconWrap}><TrainIcon size={20} color={Colors.dark.primary} /></View>
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
                <Text style={{ color: Colors.dark.danger, ...Typography['body-sm'], marginTop: Spacing['space-2'] }}>{submittedError}</Text>
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
  root: { flex: 1, backgroundColor: Colors.dark['bg-base'] },
  scroll: { padding: Spacing['space-5'], gap: Spacing['space-4'], paddingBottom: 40 },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-3'], paddingHorizontal: Spacing['space-5'], paddingVertical: Spacing['space-3'] },
  backBtn: { width: 32, height: 32, backgroundColor: Colors.dark['bg-overlay'], borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 17, fontWeight: '700', color: Colors.dark['text-primary'] },
  subtitle: { ...Typography['body-sm'], color: Colors.dark['text-secondary'], marginTop: 2 },
  stepper: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing['space-5'], paddingVertical: Spacing['space-3'], backgroundColor: Colors.dark['bg-card'], borderBottomWidth: 1, borderBottomColor: Colors.dark.border },
  stepItem: { alignItems: 'center', gap: 4 },
  stepLine: { width: 24, height: 2, backgroundColor: Colors.dark.border, position: 'absolute', right: '100%', top: 12 },
  stepCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: Colors.dark['bg-overlay'], borderWidth: 1, borderColor: Colors.dark.border, alignItems: 'center', justifyContent: 'center' },
  stepCircleActive: { backgroundColor: Colors.dark.primary, borderColor: Colors.dark.primary },
  stepCircleDone: { borderColor: Colors.dark.primary },
  stepNum: { ...Typography.body, fontWeight: '700', color: Colors.dark['text-secondary'] },
  stepLabel: { ...Typography.caption, color: Colors.dark['text-secondary'], textAlign: 'center' },
  tipCard: { backgroundColor: Colors.dark['primary-subtle'], borderRadius: Radius['radius-md'], borderWidth: 1, borderColor: Colors.dark['primary-dim'], padding: Spacing['space-3'], flexDirection: 'row', alignItems: 'center', gap: Spacing['space-2'] },
  tipIcon: { width: 32, height: 32, backgroundColor: Colors.dark['primary-dim'], borderRadius: 16 },
  tipTitle: { ...Typography['body-sm'], fontWeight: '700', color: Colors.dark.primary },
  tipSub: { ...Typography.caption, color: Colors.dark['text-secondary'], marginTop: 2 },
  card: { backgroundColor: Colors.dark['bg-card'], borderRadius: Radius['radius-lg'], borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing['space-5'], gap: Spacing['space-3'] },
  stepHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-3'] },
  stepIcon: { width: 28, height: 28, backgroundColor: Colors.dark['primary-subtle'], borderRadius: 14 },
  stepTitle: { ...Typography.h4, fontWeight: '700', color: Colors.dark['text-primary'] },
  stepDesc: { ...Typography['body-sm'], color: Colors.dark['text-secondary'], marginTop: 2 },
  searchField: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-2'], backgroundColor: Colors.dark['bg-overlay'], borderRadius: Radius['radius-md'], padding: Spacing['space-3'], borderWidth: 1, borderColor: Colors.dark.border },
  searchDot: { width: 20, height: 20, backgroundColor: Colors.dark.border, borderRadius: 10 },
  searchPlaceholder: { ...Typography.body, color: Colors.dark['text-tertiary'] },
  popularLabel: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark['text-secondary'] },
  popularRow: { flexDirection: 'row', gap: Spacing['space-2'] },
  trainChip: { flex: 1, backgroundColor: Colors.dark['bg-overlay'], borderRadius: Radius['radius-md'], borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing['space-2'], alignItems: 'center', gap: 6 },
  trainChipActive: { backgroundColor: Colors.dark['primary-subtle'], borderColor: Colors.dark.primary },
  trainChipIcon: { width: 28, height: 28, backgroundColor: Colors.dark['bg-base'], borderRadius: 14 },
  trainChipNum: { ...Typography['body-sm'], fontWeight: '700', color: Colors.dark['text-primary'] },
  trainChipName: { fontSize: 8, color: Colors.dark['text-secondary'], textAlign: 'center' },
  orText: { textAlign: 'center', ...Typography['body-sm'], color: Colors.dark['text-tertiary'] },
  numberField: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-2'], backgroundColor: Colors.dark['bg-overlay'], borderRadius: Radius['radius-md'], padding: Spacing['space-3'], borderWidth: 1, borderColor: Colors.dark.border },
  numHash: { fontSize: 14, fontWeight: '700', color: Colors.dark['text-secondary'] },
  numPlaceholder: { ...Typography.body, color: Colors.dark['text-tertiary'] },
  selectedCard: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-3'], backgroundColor: Colors.dark['bg-card'], borderRadius: Radius['radius-lg'], borderWidth: 1, borderColor: Colors.dark.primary, padding: Spacing['space-4'] },
  selectedIcon: { width: 48, height: 48, backgroundColor: Colors.dark['primary-subtle'], borderRadius: 24 },
  selectedIconWrap: { width: 48, height: 48, backgroundColor: Colors.dark['primary-subtle'], borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  selectedName: { fontSize: 14, fontWeight: '700', color: Colors.dark['text-primary'] },
  selectedRoute: { ...Typography['body-sm'], color: Colors.dark['text-secondary'] },
  selectedMeta: { flexDirection: 'row', gap: Spacing['space-3'] },
  selectedMetaText: { ...Typography.caption, color: Colors.dark['text-tertiary'] },
  typeText: { ...Typography['body-sm'], fontWeight: '600', color: Colors.dark.info },
  reportingTip: { flexDirection: 'row', alignItems: 'center', gap: Spacing['space-3'], backgroundColor: Colors.dark['bg-card'], borderRadius: Radius['radius-md'], borderWidth: 1, borderColor: Colors.dark.border, padding: Spacing['space-3'] },
  tipIconSmall: { width: 28, height: 28, backgroundColor: Colors.dark['info-subtle'], borderRadius: 14 },
  reportingTipTitle: { ...Typography['body-sm'], fontWeight: '700', color: Colors.dark.info },
  reportingTipSub: { ...Typography.caption, color: Colors.dark['text-secondary'], marginTop: 2 },
  continueBtn: { backgroundColor: Colors.dark.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  continueBtnText: { ...Typography.h4, fontWeight: '700', color: Colors.dark['bg-base'] },
});
