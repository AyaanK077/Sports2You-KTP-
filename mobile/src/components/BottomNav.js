import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'reserve', label: 'Reserve', icon: '+' },
  { id: 'reservations', label: 'Bookings', icon: '◉' },
  { id: 'facilities', label: 'Venues', icon: '◈' },
  { id: 'profile', label: 'Profile', icon: '◎' },
];

export default function BottomNav({ page, setPage }) {
  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => {
        const active = page === item.id;
        return (
          <TouchableOpacity key={item.id} style={styles.item} onPress={() => setPage(item.id)}>
            <Text style={[styles.icon, active && styles.iconActive]}>{item.icon}</Text>
            <Text style={[styles.label, active && styles.labelActive]}>{item.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.bg2,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingBottom: 20,
    paddingTop: 10,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  icon: {
    fontSize: 20,
    color: COLORS.text3,
  },
  iconActive: {
    color: COLORS.green,
  },
  label: {
    fontSize: 10,
    color: COLORS.text3,
    fontWeight: '600',
  },
  labelActive: {
    color: COLORS.green,
  },
});
