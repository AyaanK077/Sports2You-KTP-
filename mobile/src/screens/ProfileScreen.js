import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { COLORS, RADIUS, FONT_SIZE } from '../constants/theme';
import { clearUser } from '../utils/storage';
import { MOCK_GAMES, MOCK_PLAYERS_PLAYED_WITH } from '../constants/gamesMockData';
import { SportIcon, StatsIcon } from '../constants/icons';

export default function ProfileScreen({ user, bookings, onLogout, showToast, setPage }) {
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

  // Mock: User has joined game1
  const joinedGameIds = new Set(['game1']);
  const joinedGames = MOCK_GAMES.filter(g => joinedGameIds.has(g.id));

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

        {/* Joined Games */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}><Image source={require('../assets/basketball.png')} style={{ width: 18, height: 18 }} resizeMode="contain" /><Text style={styles.cardTitle}>Joined Games ({joinedGames.length})</Text></View>
          {joinedGames.length === 0 ? (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <Text style={styles.emptyText}>No joined games yet</Text>
              <TouchableOpacity style={styles.btnSmall} onPress={() => setPage && setPage('join-game')}>
                <Text style={styles.btnSmallText}>Browse Games →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            joinedGames.slice(0, 3).map(game => (
              <View key={game.id} style={styles.gameItem}>
                <SportIcon sport={game.sport} size={24} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.gameName}>{game.courtName}</Text>
                  <Text style={styles.gameDetail}>{game.facilityName} • {game.date} {game.time}</Text>
                </View>
                <Text style={styles.skillBadge}>{game.skillLevel}</Text>
              </View>
            ))
          )}
        </View>

        {/* Players You've Played With */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}><Image source={require('../assets/stats.png')} style={{ width: 18, height: 18 }} resizeMode="contain" /><Text style={styles.cardTitle}>Players You've Played With</Text></View>
          {MOCK_PLAYERS_PLAYED_WITH.map((player) => (
            <View key={player.id} style={styles.playerItem}>
              <View style={styles.playerAvatar}>
                <Text style={styles.playerInitials}>{player.initials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.playerName}>{player.name}</Text>
                <View style={styles.playerRatingRow}><StatsIcon size={12} /><Text style={styles.playerRating}>{player.averageRating} ({player.reviewCount} reviews)</Text></View>
                <Text style={styles.playerSports}>{player.sportsTogether.join(', ')}</Text>
              </View>
              <TouchableOpacity style={player.userReviewedThem ? styles.reviewedBadge : styles.reviewBtn}>
                <Text style={player.userReviewedThem ? styles.reviewedText : styles.reviewBtnText}>
                  {player.userReviewedThem ? '✓ Reviewed' : 'Review'}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout}>
          <Text style={styles.signOutText}>Sign Out</Text>
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
  cardTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  cardTitle: { fontSize: FONT_SIZE.md, fontWeight: '800', color: COLORS.text },
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

  emptyText: { fontSize: FONT_SIZE.sm, color: COLORS.text3, marginBottom: 12 },
  btnSmall: { paddingVertical: 8, paddingHorizontal: 12, backgroundColor: COLORS.green, borderRadius: RADIUS.md },
  btnSmallText: { color: '#000', fontWeight: '700', fontSize: FONT_SIZE.xs },

  gameItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  playerRatingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  gameName: { fontWeight: '700', fontSize: FONT_SIZE.sm, color: COLORS.text },
  gameDetail: { fontSize: FONT_SIZE.xs, color: COLORS.text3, marginTop: 2 },
  skillBadge: { fontSize: FONT_SIZE.xs, color: COLORS.text3, fontWeight: '600', backgroundColor: COLORS.bg2, paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.md },

  playerItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, gap: 12 },
  playerAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.orange, alignItems: 'center', justifyContent: 'center' },
  playerInitials: { color: '#fff', fontWeight: '700', fontSize: FONT_SIZE.sm },
  playerName: { fontWeight: '700', fontSize: FONT_SIZE.sm, color: COLORS.text },
  playerRating: { fontSize: FONT_SIZE.xs, color: COLORS.text3, marginTop: 2 },
  playerSports: { fontSize: FONT_SIZE.xs, color: COLORS.text3, marginTop: 2 },
  reviewBtn: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: COLORS.green, borderRadius: RADIUS.md },
  reviewBtnText: { color: '#000', fontWeight: '700', fontSize: FONT_SIZE.xs },
  reviewedBadge: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: COLORS.text3, borderRadius: RADIUS.md },
  reviewedText: { color: COLORS.text, fontWeight: '700', fontSize: FONT_SIZE.xs },
});
