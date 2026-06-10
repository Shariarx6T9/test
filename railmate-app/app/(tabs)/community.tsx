import React from 'react';
import { View } from 'react-native';
import { UsersThree } from 'phosphor-react-native';

import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Header } from '../../components/layout/Header';
import { Typography } from '../../components/ui/Typography/Typography';
import { useTranslation } from '../../i18n';

export default function CommunityScreen() {
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';

  return (
    <ScreenWrapper>
      <Header title={t('community.title')} showBack={false} isBengali={isBengali} />
      <View className="flex-1 items-center justify-center p-6">
        <View className="w-20 h-20 rounded-full bg-bg-card items-center justify-center mb-6">
          <UsersThree size={48} color="#4E6480" weight="thin" />
        </View>
        <Typography variant="h3" className="text-text-primary text-center mb-2" isBengali={isBengali}>
          {t('community.title')}
        </Typography>
        <Typography variant="body" className="text-text-secondary text-center" isBengali={isBengali}>
          {t('community.coming_soon')}
        </Typography>
      </View>
    </ScreenWrapper>
  );
}
