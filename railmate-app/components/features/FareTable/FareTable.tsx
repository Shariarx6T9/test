import React from 'react';
import { View } from 'react-native';
import { Fare } from '../../../types/fare.types';
import { useTranslation, TranslationKey } from '../../../i18n';
import { formatFare } from '../../../utils/formatFare';
import { Typography } from '../../ui/Typography/Typography';
import { Card } from '../../ui/Card/Card';

interface FareTableProps {
  fares: Fare[];
  isBengali?: boolean;
}

export const FareTable: React.FC<FareTableProps> = ({ fares, isBengali = false }) => {
  const { t } = useTranslation();

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
      {fares.map((fare, index) => (
        <View 
          key={fare.id}
          className={`flex-row justify-between items-center p-4 ${
            index !== fares.length - 1 ? 'border-b border-border' : ''
          }`}
        >
          <Typography variant="h4" className="text-text-primary" isBengali={isBengali}>
            {t(`fare.class.${fare.class}` as TranslationKey)}
          </Typography>
          <Typography variant="h3" className="text-primary" isBengali={isBengali}>
            {formatFare(fare.price_bdt)}
          </Typography>
        </View>
      ))}
    </Card>
  );
};
