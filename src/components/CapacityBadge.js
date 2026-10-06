import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from '@rneui/themed';
import { useAppColors } from '../context/AppContext';

export default function CapacityBadge({ capacity, registeredCount = 0 }) {
  const palette = useAppColors();
  const styles = createStyles(palette);
  const label = capacity === null ? 'Drop-in event' : `${registeredCount} / ${capacity}`;

  return (
    <View style={styles.badge}>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const createStyles = (palette) => StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: palette.badge,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  label: { color: palette.badgeText, fontSize: 12, fontWeight: '700' },
});
