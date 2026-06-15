import React from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';

interface AvatarProps {
  uri?: string | null;
  name?: string;
  size?: number;
  badge?: string; // emoji or color dot
}

export const Avatar: React.FC<AvatarProps> = ({ uri, name, size = 40, badge }) => {
  const initials = name
    ? name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
    : '?';
  const bg = stringToColor(name ?? '?');

  return (
    <View style={{ width: size, height: size }}>
      {uri ? (
        <Image source={{ uri }} style={[s.img, { width: size, height: size, borderRadius: size / 2 }]} />
      ) : (
        <View style={[s.placeholder, { width: size, height: size, borderRadius: size / 2, backgroundColor: bg }]}>
          <Text style={[s.initials, { fontSize: size * 0.36 }]}>{initials}</Text>
        </View>
      )}
      {badge && (
        <View style={[s.badge, { width: size * 0.32, height: size * 0.32, borderRadius: size * 0.16, bottom: -2, right: -2 }]}>
          <Text style={{ fontSize: size * 0.2 }}>{badge}</Text>
        </View>
      )}
    </View>
  );
};

function stringToColor(s: string): string {
  const colors = ['#1A5C3A','#1A3A5C','#5C1A3A','#3A1A5C','#5C3A1A','#1A4A5C','#3A5C1A'];
  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = s.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

const s = StyleSheet.create({
  img:         { },
  placeholder: { alignItems: 'center', justifyContent: 'center' },
  initials:    { fontFamily: 'Inter_600SemiBold', color: '#fff' },
  badge:       { position: 'absolute', backgroundColor: '#0F1929', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#1E2E42' },
});
