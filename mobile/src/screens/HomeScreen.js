import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, RADIUS, FONT_SIZE } from '../constants/theme';
import { getFirstName, formatDate, formatHour } from '../constants/data';
import BookingCard from '../components/BookingCard';

export default function HomeScreen({ user, bookings, facilities = {}, setPage, onCancelBooking, showToast, onJoinGame }) {
  const myBookings = bookings.filter((b) => b.owner === user?.id);
  const upcoming = myBookings.filter((b) => b.status === 'upcoming').slice(0, 3);
  const publicGames = bookings.filter(
    (b) => b.isPublic && b.status === 'upcoming' && b.owner !== user?.id &&
    !b.teammates?.includes(user?.name)
  ).slice(0, 3);
  const totalBooked = myBookings.length;
  const sportsPlayed = [...new Set(myBookings.map((b) => b.sport))].length;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hey, {getFirstName(user?.name || 'Player')} 👋</Text>
            <Text style={styles.subGreeting}>Ready to hit the court?</Text>
          </View>
          <TouchableOpacity style={styles.avatar} onPress={() => setPage('profile')}>
            <Text style={styles.avatarText}>
              {user?.name ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : '?'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Quick Reserve CTA */}
        <TouchableOpacity style={styles.ctaCard} onPress={() => setPage('reserve')}>
          <View>
            <Text style={styles.ctaLabel}>Quick Reserve</Text>
            <Text style={styles.ctaTitle}>Book a Court Now</Text>
            <Text style={styles.ctaSub}>Choose a facility, sport, and time slot</Text>
          </View>
          <Text style={styles.ctaArrow}>→</Text>
        </TouchableOpacity>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Total Bookings', value: totalBooked, color: COLORS.orange },
            { label: 'Sports Played', value: sportsPlayed, color: COLORS.green },
            { label: 'Upcoming', value: upcoming.length, color: COLORS.teal },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Upcoming Bookings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Upcoming Reservations</Text>
            <TouchableOpacity onPress={() => setPage('reservations')}>
              <Text style={styles.seeAll}>See all →</Text>
            </TouchableOpacity>
          </View>

          {upcoming.length === 0 ? (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No upcoming reservations</Text>
              <TouchableOpacity style={styles.btnPrimary} onPress={() => setPage('reserve')}>
                <Text style={styles.btnPrimaryText}>Make a Reservation</Text>
              </TouchableOpacity>
            </View>
          ) : (
            upcoming.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                facilities={facilities}
                showCancel
                onCancel={(id) => {
                  onCancelBooking(id);
                  showToast('Reservation cancelled', 'success');
                }}
              />
            ))
          )}
        </View>

        {/* Join a Public Game */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🌐 Open Games</Text>
            <View style={styles.publicBadge}>
              <Text style={styles.publicBadgeText}>{publicGames.length} available</Text>
            </View>
          </View>
          {publicGames.length === 0 ? (
            <View style={styles.emptyPublic}>
              <Text style={styles.emptyText}>No open games right now</Text>
              <Text style={styles.emptyHint}>Create a public game so others can join you!</Text>
            </View>
          ) : (
            publicGames.map((b) => {
              const facility = facilities[b.facilityId] || {};
              const court = (facility.courts || []).find((c) => c.id === b.courtId);
              const sportLabels = {
                'basketball': 'Basketball', 'indoor-soccer': 'Indoor Soccer',
                'indoor-volleyball': 'Indoor Volleyball', 'sand-volleyball': 'Sand Volleyball', 'tennis': 'Tennis',
              };
              return (
                <View key={b.id} style={styles.publicGameCard}>
                  <View style={styles.publicGameHeader}>
                    <Text style={styles.publicGameSport}>{sportLabels[b.sport] || b.sport}</Text>
                    <Text style={styles.publicGameTime}>{formatHour(b.startHour)} – {formatHour(b.endHour)}</Text>
                  </View>
                  <Text style={styles.publicGameCourt}>{court?.name || b.courtId}</Text>
                  <Text style={styles.publicGameFacility}>{facility.name || b.facilityId}</Text>
                  <Text style={styles.publicGameDate}>{formatDate(b.date)}</Text>
                  <View style={styles.publicGameFooter}>
                    <Text style={styles.publicGamePlayers}>👥 {b.players} players</Text>
                    <TouchableOpacity
                      style={styles.joinBtn}
                      onPress={() => {
                        onJoinGame && onJoinGame(b.id);
                        showToast('You joined the game!', 'success');
                      }}
                    >
                      <Text style={styles.joinBtnText}>Join Game</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </View>

        {/* Quick links */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore</Text>
          <View style={styles.quickLinks}>
            {[
              { label: 'All Facilities', icon: '◈', page: 'facilities' },
              { label: 'My Reservations', icon: '◉', page: 'reservations' },
            ].map((l) => (
              <TouchableOpacity key={l.label} style={styles.quickLink} onPress={() => setPage(l.page)}>
                <Text style={styles.quickLinkIcon}>{l.icon}</Text>
                <Text style={styles.quickLinkLabel}>{l.label}</Text>
                <Text style={styles.quickLinkArrow}>→</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  content: { padding: 22, paddingBottom: 44 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
    paddingTop: 10,
  },
  greeting: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.text, letterSpacing: -0.3 },
  subGreeting: { fontSize: FONT_SIZE.md, color: COLORS.text2, marginTop: 4, lineHeight: 23 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontWeight: '700', fontSize: FONT_SIZE.md },

  ctaCard: {
    backgroundColor: COLORS.orange,
    borderRadius: RADIUS.lg,
    padding: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  ctaLabel: { fontSize: FONT_SIZE.xs, fontWeight: '800', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 6 },
  ctaTitle: { fontSize: FONT_SIZE.xl, fontWeight: '900', color: '#fff', marginBottom: 5, letterSpacing: -0.3 },
  ctaSub: { fontSize: FONT_SIZE.sm, color: 'rgba(255,255,255,0.75)', lineHeight: 20 },
  ctaArrow: { fontSize: 28, color: '#fff', fontWeight: '300' },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 28 },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: 16,
    alignItems: 'center',
  },
  statValue: { fontSize: FONT_SIZE.xxl, fontWeight: '900' },
  statLabel: { fontSize: FONT_SIZE.xs, color: COLORS.text3, marginTop: 4, textAlign: 'center', lineHeight: 17 },

  section: { marginBottom: 28 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: COLORS.text, letterSpacing: -0.2 },
  seeAll: { fontSize: FONT_SIZE.sm, color: COLORS.green, fontWeight: '600' },

  empty: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: 32,
    alignItems: 'center',
  },
  emptyText: { fontSize: FONT_SIZE.md, color: COLORS.text2, marginBottom: 20, lineHeight: 23, textAlign: 'center' },
  btnPrimary: {
    backgroundColor: COLORS.orange,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
  },
  btnPrimaryText: { color: '#fff', fontWeight: '700', fontSize: FONT_SIZE.sm },

  quickLinks: { gap: 12 },
  quickLink: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  quickLinkIcon: { fontSize: 20, color: COLORS.green },
  quickLinkLabel: { flex: 1, fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.text },
  quickLinkArrow: { fontSize: FONT_SIZE.md, color: COLORS.text3 },

  publicBadge: {
    backgroundColor: 'rgba(57,217,138,0.12)', borderWidth: 1,
    borderColor: COLORS.border2, borderRadius: RADIUS.full,
    paddingHorizontal: 10, paddingVertical: 3,
  },
  publicBadgeText: { fontSize: FONT_SIZE.xs, color: COLORS.green, fontWeight: '700' },
  emptyPublic: {
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: RADIUS.lg, padding: 20, alignItems: 'center', gap: 6,
  },
  emptyHint: { fontSize: FONT_SIZE.xs, color: COLORS.text3, textAlign: 'center' },
  publicGameCard: {
    backgroundColor: COLORS.card, borderWidth: 1, borderColor: 'rgba(57,217,138,0.25)',
    borderRadius: RADIUS.lg, padding: 16, marginBottom: 10,
  },
  publicGameHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  publicGameSport: { fontSize: FONT_SIZE.md, fontWeight: '800', color: COLORS.green },
  publicGameTime: { fontSize: FONT_SIZE.sm, color: COLORS.text2, fontWeight: '600' },
  publicGameCourt: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  publicGameFacility: { fontSize: FONT_SIZE.sm, color: COLORS.text3, marginBottom: 2 },
  publicGameDate: { fontSize: FONT_SIZE.sm, color: COLORS.text2, marginBottom: 12 },
  publicGameFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  publicGamePlayers: { fontSize: FONT_SIZE.sm, color: COLORS.text2, fontWeight: '600' },
  joinBtn: {
    backgroundColor: COLORS.green, paddingHorizontal: 18,
    paddingVertical: 8, borderRadius: RADIUS.md,
  },
  joinBtnText: { color: '#0a1a12', fontWeight: '800', fontSize: FONT_SIZE.sm },
});
