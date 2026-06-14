import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { CaretRight, Train, ShieldCheck, BellRinging } from 'phosphor-react-native';
import { ScreenWrapper } from '../components/layout/ScreenWrapper';
import { Button } from '../components/ui/Button/Button';
import { usePrefsStore } from '../stores/prefsStore';
import { useTranslation } from '../i18n';

const FEATURES = [
  { Icon: Train,       color:'#00A859', titleKey:'onboarding.feature_1_title', descKey:'onboarding.feature_1_desc' },
  { Icon: ShieldCheck, color:'#4EA8E0', titleKey:'onboarding.feature_2_title', descKey:'onboarding.feature_2_desc' },
  { Icon: BellRinging, color:'#F5A623', titleKey:'onboarding.feature_3_title', descKey:'onboarding.feature_3_desc' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { finishOnboarding } = usePrefsStore();
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';
  const F = isBengali ? { r:'NotoSansBengali_400Regular', s:'NotoSansBengali_600SemiBold', b:'NotoSansBengali_600SemiBold' } : { r:'Inter_400Regular', s:'Inter_600SemiBold', b:'PlusJakartaSans_700Bold' };
  const handleFinish = () => { finishOnboarding(); router.replace('/(tabs)'); };

  return (
    <ScreenWrapper withPadding={false}>
      <View style={s.page}>
        <View style={s.logoWrap}>
          <View style={s.logoBox}><Train size={56} color="#FFFFFF" weight="fill" /></View>
        </View>
        <View style={s.headline}>
          <View style={{flexDirection:'row', justifyContent:'center'}}>
            <Text style={[s.appName,{fontFamily:F.b,color:'#F0F4FF'}]}>Rail</Text>
            <Text style={[s.appName,{fontFamily:F.b,color:'#00A859'}]}>Mate</Text>
          </View>
          <Text style={[s.tagline,{fontFamily:F.r}]}>{t('app.tagline')}</Text>
        </View>
        <View style={s.features}>
          {FEATURES.map(({Icon,color,titleKey,descKey},i) => (
            <View key={i} style={s.featureRow}>
              <View style={s.featureIcon}><Icon size={24} color={color} weight="duotone" /></View>
              <View style={{flex:1}}>
                <Text style={[s.featureTitle,{fontFamily:F.s}]}>{t(titleKey as any)}</Text>
                <Text style={[s.featureDesc, {fontFamily:F.r}]}>{t(descKey as any)}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      <View style={s.cta}>
        <View style={{width:'100%'}}>
          <Button label={t('onboarding.get_started')} onPress={handleFinish} size="lg" isBengali={isBengali} icon={CaretRight} iconPosition="right" style={{width:'100%'}} />
        </View>
        <Text style={[s.byline,{fontFamily:F.r}]}>Travel Smarter. Travel RailMate.</Text>
      </View>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  page:        {flex:1,paddingHorizontal:24,paddingTop:48,justifyContent:'center'},
  logoWrap:    {alignItems:'center',marginBottom:24},
  logoBox:     {width:96,height:96,borderRadius:24,backgroundColor:'#00A859',alignItems:'center',justifyContent:'center'},
  headline:    {alignItems:'center',marginBottom:48},
  appName:     {fontSize:36,lineHeight:44},
  tagline:     {fontSize:15,lineHeight:22,textAlign:'center',marginTop:8,color:'#8FA3C0',paddingHorizontal:16},
  features:    {gap:24},
  featureRow:  {flexDirection:'row',alignItems:'center',gap:16},
  featureIcon: {width:48,height:48,borderRadius:12,backgroundColor:'#162035',borderWidth:1,borderColor:'#1E2E42',alignItems:'center',justifyContent:'center'},
  featureTitle:{fontSize:16,color:'#F0F4FF',lineHeight:22,marginBottom:2},
  featureDesc: {fontSize:13,color:'#8FA3C0',lineHeight:19},
  cta:         {paddingHorizontal:24,paddingBottom:48,alignItems:'center'},
  byline:      {fontSize:12,color:'#4E6480',marginTop:20,textAlign:'center'},
});
