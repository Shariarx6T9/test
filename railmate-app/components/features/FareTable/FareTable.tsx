import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Fare } from '../../../types/fare.types';
import { useTranslation, TranslationKey } from '../../../i18n';
import { formatFare } from '../../../utils/formatFare';
import { Armchair, Bed, Snowflake } from 'phosphor-react-native';

const C = { primary:'#00A859', textPri:'#F0F4FF', textSec:'#8FA3C0', bgCard:'#162035', border:'#1E2E42', bgOverlay:'#1A2840' };

const CLASS_ICONS: Record<string, any> = {
  S_CHAIR: Armchair, SNIGDHA: Bed, AC_S: Snowflake, AC_B: Bed, F_SEAT: Armchair, F_BERTH: Bed,
};

interface FareTableProps { fares: Fare[]; isBengali?: boolean; }

export const FareTable: React.FC<FareTableProps> = ({ fares, isBengali = false }) => {
  const { t } = useTranslation();
  const fontFamily = isBengali ? 'NotoSansBengali_400Regular' : 'Inter_400Regular';

  if (!fares?.length) return (
    <View style={s.empty}>
      <Text style={[s.emptyText, { fontFamily }]}>No fare data available</Text>
    </View>
  );

  return (
    <View style={s.table}>
      {fares.map((fare, i) => {
        const Icon = CLASS_ICONS[fare.class] || Armchair;
        return (
          <View key={fare.id} style={[s.row, i !== fares.length - 1 && s.rowBorder]}>
            <View style={s.iconBox}><Icon size={18} color={C.primary} weight="duotone" /></View>
            <Text style={[s.className, { fontFamily }]}>{t(`fare.class.${fare.class}` as TranslationKey)}</Text>
            <Text style={s.price}>{formatFare(fare.price_bdt)}</Text>
          </View>
        );
      })}
    </View>
  );
};

const s = StyleSheet.create({
  table:     { backgroundColor: C.bgCard, borderRadius: 14, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  row:       { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  iconBox:   { width: 36, height: 36, borderRadius: 8, backgroundColor: C.bgOverlay, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  className: { flex: 1, fontSize: 14, color: C.textPri, lineHeight: 20 },
  price:     { fontFamily: 'JetBrainsMono_500Medium', fontSize: 16, color: C.primary, letterSpacing: -0.3 },
  empty:     { padding: 24, alignItems: 'center' },
  emptyText: { fontSize: 14, color: C.textSec },
});
