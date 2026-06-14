import React from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { BellSimple, Warning, Info, Shield, Plus, CheckCircle } from 'phosphor-react-native';

import { ScreenWrapper } from '../../components/layout/ScreenWrapper';
import { Typography } from '../../components/ui/Typography/Typography';
import { Button } from '../../components/ui/Button/Button';
import { useTranslation } from '../../i18n';
import { Colors } from '../../constants/colors';

// Mock alert data matching the mockup
const MOCK_ALERTS = [
  {
    id: '1',
    type: 'departure',
    trainName: 'Subarna Express',
    message: 'Leaves in 30 minutes',
    date: '13 June, 06:40',
    time: '9:10 PM',
    active: true,
    accentColor: '#00A859',
    IconComponent: BellSimple,
    iconBg: '#00A85920',
    label: 'Departure Reminder',
    labelColor: '#00A859',
  },
  {
    id: '2',
    type: 'delay',
    trainName: 'Turna Express',
    message: '25 min delay reported',
    date: '13 June, 08:15',
    time: '8:20 PM',
    active: true,
    accentColor: '#F5A623',
    IconComponent: Warning,
    iconBg: '#F5A62320',
    label: 'Delay Alert',
    labelColor: '#F5A623',
  },
  {
    id: '3',
    type: 'schedule',
    trainName: 'Mahanagar Express',
    message: 'Schedule updated',
    date: '13 June, 12:30',
    time: '7:45 PM',
    active: true,
    accentColor: '#4EA8E0',
    IconComponent: Info,
    iconBg: '#4EA8E020',
    label: 'Schedule Update',
    labelColor: '#4EA8E0',
  },
];

export default function AlertsScreen() {
  const { t, locale } = useTranslation();
  const isBengali = locale === 'bn';
  const c = Colors.dark;

  return (
    <ScreenWrapper>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="flex-row justify-between items-start pt-2 pb-6">
          <View>
            <Typography variant="display-lg" className="text-text-primary">
              My Alerts
            </Typography>
            <Typography variant="body" className="text-text-secondary mt-1" isBengali={isBengali}>
              RailMate watches over your journeys
            </Typography>
          </View>
          <View className="relative mt-1">
            <View className="w-12 h-12 rounded-full bg-bg-card border border-border items-center justify-center">
              <BellSimple size={24} color={c['text-secondary']} weight="duotone" />
            </View>
            <View
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 20,
                height: 20,
                borderRadius: 10,
                backgroundColor: c.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography style={{ fontSize: 11, fontFamily: 'Inter_600SemiBold', color: '#fff' }}>
                {MOCK_ALERTS.length}
              </Typography>
            </View>
          </View>
        </View>

        {/* Alert Cards */}
        <View className="gap-3 mb-6">
          {MOCK_ALERTS.map((alert) => {
            const Icon = alert.IconComponent;
            return (
              <View
                key={alert.id}
                className="bg-bg-card border border-border rounded-xl overflow-hidden"
                style={{ borderLeftWidth: 3, borderLeftColor: alert.accentColor }}
              >
                <View className="p-4">
                  <View className="flex-row items-start justify-between mb-2">
                    <View className="flex-row items-center gap-3 flex-1">
                      <View
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 22,
                          backgroundColor: alert.iconBg,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Icon size={22} color={alert.accentColor} weight="duotone" />
                      </View>
                      <View className="flex-1">
                        <Typography variant="label" style={{ color: alert.labelColor, marginBottom: 2 }}>
                          {alert.label}
                        </Typography>
                        <Typography variant="h4" className="text-text-primary">
                          {alert.trainName}
                        </Typography>
                      </View>
                    </View>
                    {/* Toggle */}
                    <View
                      style={{
                        width: 44,
                        height: 26,
                        borderRadius: 13,
                        backgroundColor: alert.active ? c.primary : c['border-strong'],
                        padding: 3,
                        alignItems: alert.active ? 'flex-end' : 'flex-start',
                        justifyContent: 'center',
                      }}
                    >
                      <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff' }} />
                    </View>
                  </View>

                  {/* Message */}
                  <View className="flex-row items-center gap-1.5 mb-3 ml-14">
                    <View style={{ width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: alert.accentColor, alignItems: 'center', justifyContent: 'center' }}>
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: alert.accentColor }} />
                    </View>
                    <Typography variant="body-sm" style={{ color: alert.accentColor }}>
                      {alert.message}
                    </Typography>
                  </View>

                  {/* Meta row */}
                  <View className="flex-row justify-between items-center ml-14">
                    <View className="flex-row items-center gap-1.5">
                      <Info size={13} color={c['text-tertiary']} />
                      <Typography variant="caption" className="text-text-tertiary">
                        {alert.date}
                      </Typography>
                    </View>
                    <Typography variant="caption" className="text-text-tertiary">
                      {alert.time}
                    </Typography>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Info Card */}
        <View className="bg-bg-elevated border border-border rounded-xl p-4 flex-row items-center justify-between mb-8">
          <View className="flex-row items-center gap-3 flex-1">
            <View className="w-10 h-10 rounded-xl bg-primary/10 items-center justify-center">
              <Shield size={20} color={c.primary} weight="duotone" />
            </View>
            <View className="flex-1">
              <Typography variant="h4" className="text-text-primary mb-0.5">
                We'll keep you informed
              </Typography>
              <Typography variant="caption" className="text-text-secondary">
                Get real-time updates so you can travel with confidence.
              </Typography>
            </View>
          </View>
          <CheckCircle size={20} color={c.primary} weight="fill" />
        </View>

        {/* Create Alert CTA */}
        <Button
          label="+ Create Alert"
          onPress={() => {}}
          className="w-full mb-4"
          size="lg"
          isBengali={isBengali}
        />
      </ScrollView>
    </ScreenWrapper>
  );
}
