import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { Text } from '@rneui/themed';
import { useAppColors } from '../context/AppContext';

export default function LoadingOverlay({ label = 'Loading events...' }) {
  const palette = useAppColors();
  const styles = createStyles(palette);
  return (
    <View style={styles.container}>
      <ActivityIndicator color={palette.blue} size="large" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const createStyles = (palette) => StyleSheet.create({
  container: { alignItems: 'center', backgroundColor: palette.cream, flex: 1, justifyContent: 'center' },
  label: { color: palette.muted, marginTop: 12 },
});
