import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, RADIUS, FONT_SIZE } from '../constants/theme';
import BookingCard from '../components/BookingCard';

export default function ReservationsScreen({ user, bookings, facilities = {}, onCancelBooking, showToast, setPage }) {
  const [tab, setTab] = useState('upcoming');

  const myBookings = bookings.filter((b) => b.owner === user?.id);
  const upcoming = myBookings.filter((b) => b.status === 'upcoming');
  const past = myBookings.filter((b) => b.status === 'completed');
  const displayed = tab === 'upcoming' ? upcoming : past;

  const handleCancel = (id) => {
    onCancelBooking(id);
    showToast('Reservation cancelled', 'success');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.pageHeader}>
        <TouchableOpacity
          onPress={() => setPage('home')}
          style={styles.headerBack}
          hitSlop={{ top: 8, bottom: 8, left: 0, right: 8 }}
          accessibilityLabel="Back to home"
        >
          <Text style={styles.backToHome}>← Home</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle} numberOfLines={1}>My Reservations</Text>
        <View style={styles.pageHeaderRight}>
          <TouchableOpacity style={styles.reserveBtn} onPress={() => setPage('reserve')}>
            <Text style={styles.reserveBtnText}>+ New</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['upcoming', 'past'].map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
              {t === 'upcoming' && upcoming.length > 0 && (
                <Text style={styles.tabCount}> ({upcoming.length})</Text>
              )}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {displayed.length === 0 ? (
          <View style={styles.empty}>
            <Image source={tab === 'upcoming' ? require('../assets/calendar.png') : require('../assets/tick.png')} style={{ width: 48, height: 48, opacity: 0.5, marginBottom: 4 }} resizeMode="contain" />
            <Text style={styles.emptyTitle}>
              {tab === 'upcoming' ? 'No upcoming reservations' : 'No past reservations'}
            </Text>
            {tab === 'upcoming' && (
              <TouchableOpacity style={styles.btnPrimary} onPress={() => setPage('reserve')}>
                <Text style={styles.btnPrimaryText}>Make a Reservation</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          displayed.map((b) => (
            <BookingCard
              key={b.id}
              booking={b}
              facilities={facilities}
              showCancel={tab === 'upcoming'}
              onCancel={handleCancel}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 6,
  },
  headerBack: { minWidth: 76 },
  backToHome: { color: COLORS.green, fontWeight: '700', fontSize: FONT_SIZE.sm },
  pageTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  pageHeaderRight: { minWidth: 72, alignItems: 'flex-end' },
  reserveBtn: {
    backgroundColor: COLORS.orange,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  reserveBtnText: { color: '#fff', fontWeight: '700', fontSize: FONT_SIZE.sm },

  tabs: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: 'rgba(57,217,138,0.12)',
    borderColor: COLORS.border2,
  },
  tabText: { fontSize: FONT_SIZE.sm, fontWeight: '600', color: COLORS.text2 },
  tabTextActive: { color: COLORS.green },
  tabCount: { color: COLORS.green },

  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 40 },

  empty: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: FONT_SIZE.lg, color: COLORS.text2, fontWeight: '600' },
  btnPrimary: {
    backgroundColor: COLORS.orange,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
    marginTop: 8,
  },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: FONT_SIZE.sm },
});
