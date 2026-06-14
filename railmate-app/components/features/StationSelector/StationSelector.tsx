import React, { useState, useMemo } from 'react';
import { View, FlatList, Pressable, ActivityIndicator } from 'react-native';
import { MagnifyingGlass, X, Train } from 'phosphor-react-native';
import { useStations } from '../../../hooks/useStations';
import { Station } from '../../../types/station.types';
import { useTranslation } from '../../../i18n';
import { Typography } from '../../ui/Typography/Typography';
import { Input } from '../../ui/Input/Input';

interface StationSelectorProps {
  onSelect: (station: Station) => void;
  onClose: () => void;
  isBengali?: boolean;
}

export const StationSelector: React.FC<StationSelectorProps> = ({
  onSelect,
  onClose,
  isBengali = false,
}) => {
  const { t } = useTranslation();
  const { data: stations } = useStations();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStations = useMemo(() => {
    if (!stations) return [];
    if (!searchQuery) return stations;

    const query = searchQuery.toLowerCase();
    return stations.filter(
      (s) =>
        s.name_en.toLowerCase().includes(query) ||
        s.name_bn.includes(query) ||
        s.code.toLowerCase().includes(query)
    );
  }, [stations, searchQuery]);

  const renderStationItem = ({ item }: { item: Station }) => (
    <Pressable
      onPress={() => onSelect(item)}
      className="flex-row items-center py-4 border-b border-border"
    >
      <View className="w-10 h-10 rounded-full bg-primary-subtle items-center justify-center mr-3">
        <Train size={20} color="#00A859" weight="bold" />
      </View>
      <View className="flex-1">
        <Typography variant="h4" className="text-text-primary" isBengali={isBengali}>
          {isBengali ? item.name_bn : item.name_en}
        </Typography>
        <Typography variant="caption" className="text-text-secondary" isBengali={isBengali}>
          {item.code} {item.division ? `• ${item.division}` : ''}
        </Typography>
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1 bg-bg-base">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-border">
        <View className="flex-1">
          <Input
            placeholder={t('station.search_placeholder')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
            isBengali={isBengali}
            className="h-10"
            // Adding search icon via container is tricky with current Input, 
            // but we can just use it as is for now.
          />
        </View>
        <Pressable onPress={onClose} className="ml-3 p-2">
          <X size={24} color="#8FA3C0" />
        </Pressable>
      </View>

      {/* List */}
      <View className="flex-1 px-4">
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#00A859" size="large" />
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center">
            <Typography variant="body" className="text-danger" isBengali={isBengali}>
              {t('error.generic')}
            </Typography>
          </View>
        ) : (
          <FlatList
            data={filteredStations}
            keyExtractor={(item) => item.id}
            renderItem={renderStationItem}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View className="py-10 items-center">
                <Typography variant="body" className="text-text-tertiary" isBengali={isBengali}>
                  No stations found
                </Typography>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
};
