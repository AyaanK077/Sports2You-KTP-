import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { COLORS, RADIUS, FONT_SIZE } from '../constants/theme';
import { clearUser } from '../utils/storage';

export default function ProfileScreen({ user, bookings, onLogout, showToast }) {
  const myBookings = bookings.filter((b) => b.owner === user?.id);
  const upcoming = myBookings.filter((b) => b.status === 'upcoming').length;
  const completed = myBookings.filter((b) => b.status === 'completed').length;

  const initials = user?.name
    ? user.name.trim().split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await clearUser();
          onLogout();
        },
      },
    ]);
  };

  const infoRows = [
    { label: 'Email', value: user?.email || '—' },
    { label: 'Student ID', value: user?.studentId || '—' },
    { label: 'Phone', value: user?.phone || '—' },
    { label: 'Member Since', value: user?.joinedDate || '—' },
    { label: 'Preferred Sport', value: user?.preferredSport ? user.preferredSport.charAt(0).toUpperCase() + user.preferredSport.slice(1) : '—' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Profile</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'Player'}</Text>
          <Text style={styles.userEmail}>{user?.email || ''}</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Total', value: myBookings.length, color: COLORS.orange },
            { label: 'Upcoming', value: upcoming, color: COLORS.green },
            { label: 'Completed', value: completed, color: COLORS.teal },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Info */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Account Info</Text>
          {infoRows.map((row) => (
            <View key={row.label} style={styles.infoRow}>
              <Text style={styles.infoLabel}>{row.label}</Text>
              <Text style={styles.infoValue}>{row.value}</Text>
            </View>
          ))}
        </View>

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout}>
          <Text style={styles.signOutText}>🚪  Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    padding: 20,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pageTitle: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.text },
  content: { padding: 20, paddingBottom: 60 },

  avatarSection: { alignItems: 'center', paddingVertical: 28 },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#fff', fontSize: 28, fontWeight: '900' },
  userName: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.text, marginBottom: 4 },
  userEmail: { fontSize: FONT_SIZE.sm, color: COLORS.text2 },

  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: 14,
    alignItems: 'center',
  },
  statValue: { fontSize: FONT_SIZE.xxl, fontWeight: '900' },
  statLabel: { fontSize: FONT_SIZE.xs, color: COLORS.text3, marginTop: 2 },

  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: 20,
    marginBottom: 20,
  },
  cardTitle: { fontSize: FONT_SIZE.md, fontWeight: '800', color: COLORS.text, marginBottom: 16 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: { fontSize: FONT_SIZE.sm, color: COLORS.text3, fontWeight: '600' },
  infoValue: { fontSize: FONT_SIZE.sm, color: COLORS.text, fontWeight: '600', maxWidth: '60%', textAlign: 'right' },

  signOutBtn: {
    borderWidth: 1,
    borderColor: 'rgba(247,95,95,0.3)',
    backgroundColor: 'rgba(247,95,95,0.08)',
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  signOutText: { color: COLORS.red, fontWeight: '700', fontSize: FONT_SIZE.md },
});
