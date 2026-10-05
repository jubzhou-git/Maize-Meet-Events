import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Card, Text } from '@rneui/themed';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatEventDate, formatEventMonthDay, formatEventTime } from '../utils/date';
import { colors } from '../theme/theme';

export default function EventCard({ event, saved, compact = false, onPress, onToggleSaved }) {
  const date = formatEventDate(event.startsAt);
  const time = formatEventTime(event.startsAt, event.endsAt);

  function handleSavedPress() {
    onToggleSaved(event.id);
  }

  return (
    <View>
      <Pressable
        accessibilityHint="Opens event details"
        accessibilityLabel={`${event.title}. ${event.category}. ${date}, ${time}. ${event.location}`}
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => pressed && styles.pressed}
      >
        <Card containerStyle={[styles.card, compact && styles.compactCard]}>
          {compact ? <CompactContent date={event.startsAt} event={event} time={time} /> : (
            <>
              <Text style={styles.category}>{event.category.toUpperCase()}</Text>
              <Text h4 h4Style={styles.title} numberOfLines={2}>
                {event.title}
              </Text>
              <Text style={styles.date}>{date}</Text>
              <Text numberOfLines={1} style={styles.meta}>
                {time} · {event.location}
              </Text>
            </>
          )}
        </Card>
      </Pressable>
      <View pointerEvents="box-none" style={[styles.heartSlot, compact && styles.compactHeartSlot]}>
        <Pressable
          accessibilityLabel={saved ? `Remove ${event.title} from saved` : `Save ${event.title}`}
          accessibilityRole="button"
          accessibilityState={{ selected: saved }}
          onPress={handleSavedPress}
          style={styles.heartButton}
        >
          <MaterialCommunityIcons
            color={saved ? '#C6253D' : colors.muted}
            name={saved ? 'heart' : 'heart-outline'}
            size={22}
          />
        </Pressable>
      </View>
    </View>
  );
}

function CompactContent({ date, event, time }) {
  const { month, day } = formatEventMonthDay(date);

  return (
    <View style={styles.compactRow}>
      <View style={styles.dateBadge}>
        <Text style={styles.dateBadgeMonth}>{month.toUpperCase()}</Text>
        <Text style={styles.dateBadgeDay}>{day}</Text>
      </View>
      <View style={styles.compactText}>
        <Text numberOfLines={2} style={styles.compactTitle}>
          {event.title}
        </Text>
        <Text numberOfLines={1} style={styles.meta}>
          {time} · {event.location}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    elevation: 1,
    minHeight: 150,
    padding: 18,
    paddingRight: 56,
    shadowColor: '#102B44',
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  compactCard: { borderRadius: 12, minHeight: 0, paddingVertical: 12, paddingLeft: 12 },
  pressed: { opacity: 0.78 },
  category: { color: colors.blueLight, fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: colors.ink, fontSize: 20, fontWeight: '800', marginTop: 6 },
  date: { color: colors.blue, fontSize: 14, fontWeight: '700', marginTop: 8 },
  meta: { color: colors.muted, fontSize: 13, marginTop: 3 },
  heartSlot: { position: 'absolute', right: 6, top: 6 },
  compactHeartSlot: { bottom: 0, justifyContent: 'center', top: 0 },
  heartButton: { alignItems: 'center', height: 44, justifyContent: 'center', width: 44 },
  compactRow: { alignItems: 'center', flexDirection: 'row' },
  dateBadge: {
    alignItems: 'center',
    backgroundColor: '#EDF1F4',
    borderRadius: 10,
    marginRight: 12,
    minWidth: 48,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  dateBadgeMonth: { color: colors.blueLight, fontSize: 11, fontWeight: '800', letterSpacing: 0.8 },
  dateBadgeDay: { color: colors.blue, fontSize: 18, fontWeight: '900' },
  compactText: { flex: 1 },
  compactTitle: { color: colors.ink, fontSize: 16, fontWeight: '800' },
});
