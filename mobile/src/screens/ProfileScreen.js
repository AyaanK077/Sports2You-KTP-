import React, { useMemo } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { COLORS, RADIUS, FONT_SIZE, LINE_HEIGHT } from '../constants/theme';
import { clearUser } from '../utils/storage';
import {
  MOCK_GAMES,
  MOCK_COMPLETED_GAMES,
  getReviewablePlayers,
  countReviewedForGame,
  countTotalPendingReviews,
  getPlayersPlayedWith,
} from '../constants/gamesMockData';
import { SportIcon, StatsIcon, CalendarIcon } from '../constants/icons';

export default function ProfileScreen({
  user,
  bookings,
  onLogout,
  showToast,
  setPage,
  reviews = {},
  navigateToCompletedGame,
  navigateToPlayerReview,
}) {
  const myBookings = bookings.filter((b) => b.owner === user?.id);
  const upcoming = myBookings.filter((b) => b.status === 'upcoming').length;
  const completedBookingCount = myBookings.filter((b) => b.status === 'completed').length;

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
    {
      label: 'Preferred Sport',
      value: user?.preferredSport
        ? user.preferredSport.charAt(0).toUpperCase() + user.preferredSport.slice(1)
        : '—',
    },
  ];

  // Mock: user has joined game1
  const joinedGameIds = new Set(['game1']);
  const joinedGames = MOCK_GAMES.filter((g) => joinedGameIds.has(g.id));

  // Completed games + derived review metrics
  const completedGames = MOCK_COMPLETED_GAMES;
  const pendingReviewCount = useMemo(
    () => countTotalPendingReviews(completedGames, reviews),
    [completedGames, reviews]
  );
  const playersPlayedWith = useMemo(
    () => getPlayersPlayedWith(completedGames, reviews),
    [completedGames, reviews]
  );

  const handlePlayerReview = (player) => {
    // Pick the earliest unreviewed game with this player, or fall back to their latest.
    const targetGameId = player.pendingGameId || player.latestGameId;
    const targetGame = completedGames.find((g) => g.id === targetGameId);
    if (targetGame && navigateToPlayerReview) {
      navigateToPlayerReview(targetGame, player);
    } else if (setPage) {
      setPage('leave-review');
    }
  };

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
            { label: 'Completed', value: completedBookingCount, color: COLORS.teal },
          ].map((s) => (
            <View key={s.label} style={styles.statCard}>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Pending Reviews banner — only shown when there is work to do */}
        {pendingReviewCount > 0 && (
          <View style={styles.pendingBanner}>
            <View style={styles.pendingBannerTextWrap}>
              <Text style={styles.pendingBannerTitle}>Pending Reviews</Text>
              <Text style={styles.pendingBannerSub}>
                You have {pendingReviewCount} player{pendingReviewCount === 1 ? '' : 's'} left to review from your completed games.
              </Text>
            </View>
            <View style={styles.pendingCountBadge}>
              <Text style={styles.pendingCountText}>{pendingReviewCount}</Text>
            </View>
          </View>
        )}

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

        {/* Completed Games */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Image
              source={require('../assets/tick.png')}
              style={{ width: 18, height: 18 }}
              resizeMode="contain"
            />
            <Text style={styles.cardTitle}>Completed Games ({completedGames.length})</Text>
          </View>

          {completedGames.length === 0 ? (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <Text style={styles.emptyText}>No completed games yet</Text>
            </View>
          ) : (
            completedGames.map((game) => {
              const totalReviewable = getReviewablePlayers(game).length;
              const reviewed = countReviewedForGame(game, reviews);
              const isAllDone = totalReviewable > 0 && reviewed === totalReviewable;
              const statusColor = isAllDone ? COLORS.green : COLORS.orange;

              return (
                <TouchableOpacity
                  key={game.id}
                  style={styles.completedGameRow}
                  activeOpacity={0.85}
                  onPress={() => navigateToCompletedGame?.(game)}
                >
                  <SportIcon sport={game.sport} size={26} />
                  <View style={{ flex: 1, marginLeft: 2 }}>
                    <Text style={styles.completedGameName}>{game.courtName}</Text>
                    <View style={styles.completedGameMetaRow}>
                      <CalendarIcon size={11} />
                      <Text style={styles.completedGameMeta}>
                        {formatShortDate(game.date)} • {game.facilityName}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.progressChip,
                      {
                        borderColor: isAllDone
                          ? 'rgba(57,217,138,0.35)'
                          : 'rgba(244,124,32,0.35)',
                        backgroundColor: isAllDone
                          ? 'rgba(57,217,138,0.08)'
                          : 'rgba(244,124,32,0.08)',
                      },
                    ]}
                  >
                    <Text style={[styles.progressChipText, { color: statusColor }]}>
                      {isAllDone ? 'All Reviewed' : `${reviewed}/${totalReviewable} reviewed`}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Joined (Upcoming) Games */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Image
              source={require('../assets/basketball.png')}
              style={{ width: 18, height: 18 }}
              resizeMode="contain"
            />
            <Text style={styles.cardTitle}>Joined Games ({joinedGames.length})</Text>
          </View>
          {joinedGames.length === 0 ? (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <Text style={styles.emptyText}>No joined games yet</Text>
              <TouchableOpacity
                style={styles.btnSmall}
                onPress={() => setPage && setPage('join-game')}
              >
                <Text style={styles.btnSmallText}>Browse Games →</Text>
              </TouchableOpacity>
            </View>
          ) : (
            joinedGames.slice(0, 3).map((game) => (
              <View key={game.id} style={styles.gameItem}>
                <SportIcon sport={game.sport} size={24} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.gameName}>{game.courtName}</Text>
                  <Text style={styles.gameDetail}>
                    {game.facilityName} • {game.date} {game.time}
                  </Text>
                </View>
                <Text style={styles.skillBadge}>{game.skillLevel}</Text>
              </View>
            ))
          )}
        </View>

        {/* Players You've Played With (derived from completed games) */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Image
              source={require('../assets/stats.png')}
              style={{ width: 18, height: 18 }}
              resizeMode="contain"
            />
            <Text style={styles.cardTitle}>Players You've Played With</Text>
          </View>

          {playersPlayedWith.length === 0 ? (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <Text style={styles.emptyText}>
                You'll see players here after completing a game.
              </Text>
            </View>
          ) : (
            playersPlayedWith.map((player) => {
              const allReviewed = player.reviewedCount >= player.gamesPlayed;
              return (
                <View key={player.id} style={styles.playerItem}>
                  <View
                    style={[
                      styles.playerAvatar,
                      player.isHost && { backgroundColor: COLORS.green },
                    ]}
                  >
                    <Text style={styles.playerInitials}>{player.initials}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    {player.rating ? (
                      <View style={styles.playerRatingRow}>
                        <StatsIcon size={12} />
                        <Text style={styles.playerRating}>
                          {player.rating.toFixed(1)}
                        </Text>
                        <Text style={styles.playerDot}>•</Text>
                        <Text style={styles.playerRating}>
                          {player.gamesPlayed} game{player.gamesPlayed === 1 ? '' : 's'} together
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.playerRating}>
                        {player.gamesPlayed} game{player.gamesPlayed === 1 ? '' : 's'} together
                      </Text>
                    )}
                    <Text style={styles.playerSports}>
                      {player.sportsTogether.join(', ')}
                    </Text>
                    <Text
                      style={[
                        styles.reviewProgress,
                        allReviewed
                          ? { color: COLORS.green }
                          : { color: COLORS.orange },
                      ]}
                    >
                      {allReviewed
                        ? 'All reviews complete'
                        : `${player.reviewedCount}/${player.gamesPlayed} reviewed`}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={allReviewed ? styles.reviewedBadge : styles.reviewBtn}
                    onPress={() => handlePlayerReview(player)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={
                        allReviewed ? styles.reviewedText : styles.reviewBtnText
                      }
                    >
                      {allReviewed ? '✓ Reviewed' : 'Review'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </View>

        {/* Sign out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatShortDate(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch (_e) {
    return iso;
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    padding: 20,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pageTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  content: { padding: 22, paddingBottom: 60 },

  avatarSection: { alignItems: 'center', paddingVertical: 32 },
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
  userName: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  userEmail: { fontSize: FONT_SIZE.sm, color: COLORS.text2, lineHeight: 20 },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 22 },
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
  statLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text3,
    marginTop: 4,
    lineHeight: 17,
  },

  // Pending Reviews banner
  pendingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: 'rgba(244,124,32,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(244,124,32,0.3)',
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 22,
  },
  pendingBannerTextWrap: { flex: 1 },
  pendingBannerTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    color: COLORS.orange,
    letterSpacing: -0.2,
    marginBottom: 4,
  },
  pendingBannerSub: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text2,
    lineHeight: LINE_HEIGHT?.xs || 17,
  },
  pendingCountBadge: {
    minWidth: 36,
    height: 36,
    paddingHorizontal: 8,
    borderRadius: 18,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pendingCountText: { color: '#000', fontWeight: '900', fontSize: FONT_SIZE.md },

  card: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: 22,
    marginBottom: 22,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 18,
  },
  cardTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabel: { fontSize: FONT_SIZE.sm, color: COLORS.text3, fontWeight: '600' },
  infoValue: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },

  // Completed games rows
  completedGameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  completedGameName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.1,
  },
  completedGameMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  completedGameMeta: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text3,
    lineHeight: LINE_HEIGHT?.xs || 17,
  },
  progressChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: RADIUS.md,
    borderWidth: 1,
  },
  progressChipText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },

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
  btnSmall: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.green,
    borderRadius: RADIUS.md,
  },
  btnSmallText: { color: '#000', fontWeight: '700', fontSize: FONT_SIZE.xs },

  gameItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
  },
  playerRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  playerDot: { color: COLORS.text3, fontSize: FONT_SIZE.xs, marginHorizontal: 2 },
  gameName: { fontWeight: '700', fontSize: FONT_SIZE.sm, color: COLORS.text },
  gameDetail: { fontSize: FONT_SIZE.xs, color: COLORS.text3, marginTop: 2 },
  skillBadge: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text3,
    fontWeight: '600',
    backgroundColor: COLORS.bg2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
  },

  playerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  playerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerInitials: { color: '#fff', fontWeight: '700', fontSize: FONT_SIZE.sm },
  playerName: { fontWeight: '800', fontSize: FONT_SIZE.sm, color: COLORS.text },
  playerRating: { fontSize: FONT_SIZE.xs, color: COLORS.text3 },
  playerSports: { fontSize: FONT_SIZE.xs, color: COLORS.text3, marginTop: 4 },
  reviewProgress: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    marginTop: 4,
  },
  reviewBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: COLORS.green,
    borderRadius: RADIUS.md,
  },
  reviewBtnText: { color: '#000', fontWeight: '800', fontSize: FONT_SIZE.xs },
  reviewedBadge: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border2,
    borderRadius: RADIUS.md,
  },
  reviewedText: { color: COLORS.text2, fontWeight: '700', fontSize: FONT_SIZE.xs },
});
