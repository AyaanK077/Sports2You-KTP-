import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../constants/theme';

const NAV_ITEMS = [
  { id: 'home', label: 'Home', icon: '⌂' },
  { id: 'reserve', label: 'Reserve', icon: '+' },
  { id: 'join-game', label: 'Games', iconImage: require('../assets/basketball.png') },
  { id: 'reservations', label: 'Bookings', icon: '◉' },
  { id: 'profile', label: 'Profile', icon: '◎' },
];

export default function BottomNav({ page, setPage }) {
  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => {
        const active = page === item.id;
        return (
          <TouchableOpacity key={item.id} style={styles.item} onPress={() => setPage(item.id)}>
            {item.iconImage ? (
              <Image source={item.iconImage} style={[styles.iconImage, { tintColor: active ? COLORS.green : COLORS.text3 }]} resizeMode="contain" />
            ) : (
              <Text style={[styles.icon, active && styles.iconActive]}>{item.icon}</Text>
            )}
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
  iconImage: {
    width: 20,
    height: 20,
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
