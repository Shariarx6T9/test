import React from 'react';
import { View } from 'react-native';
import { Fare } from '../../../types/fare.types';
import { useTranslation, TranslationKey } from '../../../i18n';
import { formatFare } from '../../../utils/formatFare';
import { Typography } from '../../ui/Typography/Typography';
import { Card } from '../../ui/Card/Card';
import { Armchair, Bed, Snowflake, SeatBelt } from 'phosphor-react-native';
import { Colors } from '../../../constants/colors';

interface FareTableProps {
  fares: Fare[];
  isBengali?: boolean;
}

const CLASS_ICONS: Record<string, any> = {
  S_CHAIR: Armchair,
  SNIGDHA: Bed,
  AC_S: Snowflake,
  AC_B: Bed,
  F_SEAT: SeatBelt,
  F_BERTH: Bed,
};

export const FareTable: React.FC<FareTableProps> = ({ fares, isBengali = false }) => {
  const { t } = useTranslation();
  const c = Colors.dark;

  if (!fares || fares.length === 0) {
    return (
      <View className="py-4 items-center">
        <Typography variant="body" className="text-text-secondary" isBengali={isBengali}>
          {t('train.no_fares')}
        </Typography>
      </View>
    );
  }

  return (
    <Card className="p-0 overflow-hidden">
      {fares.map((fare, index) => {
        const IconComponent = CLASS_ICONS[fare.class] || Armchair;
        return (
          <View
            key={fare.id}
            className={`flex-row items-center px-4 py-3.5 ${
              index !== fares.length - 1 ? 'border-b border-border' : ''
            }`}
          >
            <View className="w-9 h-9 rounded-lg bg-primary-subtle items-center justify-center mr-3">
              <IconComponent size={18} color={c.primary} weight="duotone" />
            </View>
            <Typography variant="body-lg" className="text-text-primary flex-1" isBengali={isBengali}>
              {t(`fare.class.${fare.class}` as TranslationKey)}
            </Typography>
            <Typography
              style={{
                fontFamily: 'JetBrainsMono_500Medium',
                fontSize: 16,
                color: c.primary,
                letterSpacing: -0.3,
              }}
              isBengali={isBengali}
            >
              {formatFare(fare.price_bdt)}
            </Typography>
          </View>
        );
      })}
    </Card>
  );
};
