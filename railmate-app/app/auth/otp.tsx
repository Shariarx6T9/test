import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, TextInput, Pressable, Keyboard, NativeSyntheticEvent, TextInputKeyPressEventData, StyleSheet, Text } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft } from 'phosphor-react-native';
import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Button } from '../../components/ui/Button/Button';
import { useTranslation } from '../../i18n';
import { useAuth } from '../../hooks/useAuth';

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

export default function OtpScreen() {
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';
  const router = useRouter();
  const params = useLocalSearchParams<{ contact: string; type: 'phone' | 'email' }>();
  const contact = params.contact ?? '';
  const contactType = (params.type as 'phone' | 'email') ?? 'phone';
  const { verifyOTP, signInWithPhone, signInWithEmail } = useAuth();
  const [digits, setDigits]       = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const [verifying, setVerifying] = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [secondsLeft, setSecs]    = useState(RESEND_SECONDS);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const F = isBengali ? 'NotoSansBengali_400Regular' : 'Inter_400Regular';

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecs(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const maskedContact = (() => {
    if (contactType === 'phone') return contact.length >= 4 ? contact.slice(0, -4) + '••••' : contact;
    const [name, domain] = contact.split('@');
    if (!domain) return contact;
    return `${name.slice(0,2)}${'•'.repeat(Math.max(name.length-2,2))}@${domain}`;
  })();

  const handleVerify = useCallback(async (code?: string) => {
    const otp = code ?? digits.join('');
    if (otp.length !== OTP_LENGTH) return;
    setError(null); setVerifying(true); Keyboard.dismiss();
    try {
      const { error: e, isNewUser } = await verifyOTP(contact, otp, contactType);
      if (e) { setError(e); setVerifying(false); setDigits(Array(OTP_LENGTH).fill('')); inputRefs.current[0]?.focus(); return; }
      router.replace(isNewUser ? '/auth/register' as any : '/(tabs)');
    } catch (ex) { setError(String(ex)); setVerifying(false); }
  }, [digits, contact, contactType, verifyOTP, router]);

  const handleChange = (text: string, i: number) => {
    if (text.length > 1) {
      const p = text.replace(/[^0-9]/g,'').slice(0, OTP_LENGTH);
      const nd = Array(OTP_LENGTH).fill('');
      for (let j=0;j<p.length;j++) nd[j]=p[j];
      setDigits(nd);
      if (p.length === OTP_LENGTH) handleVerify(p); else inputRefs.current[p.length]?.focus();
      return;
    }
    const s2 = text.replace(/[^0-9]/g,'');
    const nd = [...digits]; nd[i] = s2; setDigits(nd);
    if (s2 && i < OTP_LENGTH-1) inputRefs.current[i+1]?.focus();
    if (s2 && i === OTP_LENGTH-1) { const full=nd.join(''); if (full.length===OTP_LENGTH) handleVerify(full); }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, i: number) => {
    if (e.nativeEvent.key==='Backspace' && !digits[i] && i>0) {
      inputRefs.current[i-1]?.focus();
      const nd=[...digits]; nd[i-1]=''; setDigits(nd);
    }
  };

  const handleResend = async () => {
    if (secondsLeft > 0 || resending) return;
    setResending(true); setError(null);
    try {
      const res = contactType==='phone' ? await signInWithPhone(contact) : await signInWithEmail(contact);
      if (res.error) setError(res.error);
      else { setSecs(RESEND_SECONDS); setDigits(Array(OTP_LENGTH).fill('')); inputRefs.current[0]?.focus(); }
    } catch (ex) { setError(String(ex)); }
    finally { setResending(false); }
  };

  return (
    <ScreenWrapper withPadding={false}>
      <View style={s.page}>
        <Pressable onPress={() => router.back()} style={({ pressed }) => [s.backBtn, pressed && {opacity:0.7}]}>
          <ArrowLeft size={20} color="#F0F4FF" />
        </Pressable>
        <Text style={[s.title,{ fontFamily:'PlusJakartaSans_700Bold' }]}>{t('auth.otp_title')}</Text>
        <Text style={[s.sub,{ fontFamily:F }]}>{t('auth.otp_sent')} <Text style={{color:'#00A859'}}>{maskedContact}</Text></Text>
        <View style={s.boxRow}>
          {digits.map((digit, i) => (
            <TextInput key={i} ref={r=>(inputRefs.current[i]=r)} value={digit}
              onChangeText={t2=>handleChange(t2,i)} onKeyPress={e=>handleKeyPress(e,i)}
              keyboardType="number-pad" maxLength={OTP_LENGTH}
              style={[s.box, digit ? s.boxFilled : s.boxEmpty]}
              autoFocus={i===0} selectTextOnFocus editable={!verifying}
            />
          ))}
        </View>
        {!!error && <Text style={[s.error,{fontFamily:F}]}>{error}</Text>}
        <Pressable onPress={handleResend} disabled={secondsLeft>0||resending} style={{alignSelf:'center',marginBottom:32,padding:8}}>
          <Text style={[s.resend,{fontFamily:F,color:secondsLeft>0?'#4E6480':'#00A859'}]}>
            {secondsLeft>0 ? `${t('auth.otp_resend')} (${secondsLeft}s)` : t('auth.otp_resend')}
          </Text>
        </Pressable>
        <View style={{width:'100%'}}>
          <Button label={t('auth.otp_verify')} onPress={()=>handleVerify()} isLoading={verifying} disabled={digits.join('').length!==OTP_LENGTH} isBengali={isBengali} style={{width:'100%'}} />
        </View>
      </View>
    </ScreenWrapper>
  );
}

const s = StyleSheet.create({
  page:      { flex:1, paddingHorizontal:24, paddingTop:24, paddingBottom:40 },
  backBtn:   { width:40, height:40, borderRadius:20, backgroundColor:'#0F1929', borderWidth:1, borderColor:'#1E2E42', alignItems:'center', justifyContent:'center', marginBottom:32 },
  title:     { fontSize:28, color:'#F0F4FF', lineHeight:36, marginBottom:8 },
  sub:       { fontSize:14, color:'#8FA3C0', lineHeight:22, marginBottom:40 },
  boxRow:    { flexDirection:'row', justifyContent:'space-between', marginBottom:24, gap:8 },
  box:       { flex:1, height:52, borderRadius:10, fontSize:22, fontFamily:'JetBrainsMono_500Medium', textAlign:'center', color:'#F0F4FF' },
  boxEmpty:  { backgroundColor:'#162035', borderWidth:1.5, borderColor:'#1E2E42' },
  boxFilled: { backgroundColor:'#162035', borderWidth:1.5, borderColor:'#00A859' },
  error:     { color:'#E8394B', fontSize:12, marginBottom:16 },
  resend:    { fontSize:13 },
});
