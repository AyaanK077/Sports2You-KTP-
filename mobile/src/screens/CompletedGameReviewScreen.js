import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { COLORS, RADIUS, FONT_SIZE, LINE_HEIGHT } from '../constants/theme';
import { SportIcon, CalendarIcon, ClockIcon, ActivityIcon, StatsIcon } from '../constants/icons';
import {
  getReviewablePlayers,
  countReviewedForGame,
  isPlayerReviewed,
} from '../constants/gamesMockData';

export default function CompletedGameReviewScreen({
  game,
  reviews,
  onReviewPlayer,
  onBack,
}) {
  if (!game) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No game selected</Text>
          <TouchableOpacity style={styles.backBtnSmall} onPress={onBack}>
            <Text style={styles.backBtnSmallText}>← Back to Profile</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const reviewablePlayers = getReviewablePlayers(game);
  const reviewedCount = countReviewedForGame(game, reviews);
  const totalCount = reviewablePlayers.length;
  const allDone = totalCount > 0 && reviewedCount === totalCount;

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <TouchableOpacity onPress={onBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Game Review</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Game summary card */}
        <View style={styles.gameCard}>
          <View style={styles.gameCardHeader}>
            <SportIcon sport={game.sport} size={36} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.courtName}>{game.courtName}</Text>
              <Text style={styles.facilityName}>{game.facilityName}</Text>
            </View>
            <View style={styles.completedBadge}>
              <Text style={styles.completedBadgeText}>Completed</Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <CalendarIcon size={14} />
              <Text style={styles.metaText}>{formatDate(game.date)}</Text>
            </View>
            <View style={styles.metaItem}>
              <ClockIcon size={14} />
              <Text style={styles.metaText}>{game.time}</Text>
            </View>
            {game.duration ? (
              <View style={styles.metaItem}>
                <ActivityIcon size={14} />
                <Text style={styles.metaText}>{game.duration}h</Text>
              </View>
            ) : null}
          </View>

          {game.description ? (
            <Text style={styles.description}>{game.description}</Text>
          ) : null}

          {/* Review progress bar */}
          <View style={styles.progressRow}>
            <View style={styles.progressBarTrack}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: totalCount
                      ? `${(reviewedCount / totalCount) * 100}%`
                      : '0%',
                    backgroundColor: allDone ? COLORS.green : COLORS.orange,
                  },
                ]}
              />
            </View>
            <Text
              style={[
                styles.progressText,
                { color: allDone ? COLORS.green : COLORS.orange },
              ]}
            >
              {reviewedCount}/{totalCount} reviewed
            </Text>
          </View>
        </View>

        {/* Section heading */}
        <Text style={styles.sectionLabel}>Players in this game</Text>
        <Text style={styles.sectionHint}>
          Leave a review for each person you played with.
        </Text>

        {/* Reviewable players */}
        {reviewablePlayers.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyCardText}>
              No other players in this game.
            </Text>
          </View>
        ) : (
          reviewablePlayers.map((player) => {
            const reviewed = isPlayerReviewed(game.id, player.id, reviews);
            return (
              <View key={player.id} style={styles.playerCard}>
                <View
                  style={[
                    styles.playerAvatar,
                    player.isHost && styles.playerAvatarHost,
                  ]}
                >
                  <Text style={styles.playerInitials}>{player.initials}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.playerNameRow}>
                    <Text style={styles.playerName}>{player.name}</Text>
                    {player.isHost && (
                      <View style={styles.hostTag}>
                        <Text style={styles.hostTagText}>Host</Text>
                      </View>
                    )}
                  </View>
                  {player.rating ? (
                    <View style={styles.ratingRow}>
                      <StatsIcon size={12} />
                      <Text style={styles.ratingText}>
                        {player.rating.toFixed(1)}
                      </Text>
                    </View>
                  ) : null}
                </View>

                <TouchableOpacity
                  style={reviewed ? styles.reviewedBtn : styles.reviewBtn}
                  onPress={() => onReviewPlayer(player)}
                  activeOpacity={0.8}
                >
                  <Text
                    style={reviewed ? styles.reviewedBtnText : styles.reviewBtnText}
                  >
                    {reviewed ? '✓ Reviewed' : 'Leave Review'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })
        )}

        {allDone && (
          <View style={styles.allDoneCard}>
            <Text style={styles.allDoneTitle}>All reviews complete</Text>
            <Text style={styles.allDoneSub}>
              Thanks for helping keep the community accurate.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function formatDate(iso) {
  if (!iso) return '';
  try {
    const d = new Date(iso + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  } catch (_e) {
    return iso;
  }
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.green,
  },
  pageTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.3,
  },
  content: { padding: 22, paddingBottom: 60 },

  gameCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: 20,
    marginBottom: 24,
  },
  gameCardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  courtName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  facilityName: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text3,
    marginTop: 4,
    lineHeight: LINE_HEIGHT?.xs || 17,
  },
  completedBadge: {
    backgroundColor: 'rgba(57,217,138,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(57,217,138,0.3)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
  },
  completedBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: COLORS.green,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginBottom: 12 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: FONT_SIZE.xs, color: COLORS.text2, fontWeight: '600' },
  description: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text2,
    lineHeight: LINE_HEIGHT?.sm || 20,
    marginTop: 4,
    marginBottom: 14,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 6,
  },
  progressBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: COLORS.bg2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: { height: '100%', borderRadius: 4 },
  progressText: { fontSize: FONT_SIZE.xs, fontWeight: '800' },

  sectionLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  sectionHint: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text3,
    marginBottom: 14,
    lineHeight: LINE_HEIGHT?.xs || 17,
  },

  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 10,
  },
  playerAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerAvatarHost: { backgroundColor: COLORS.green },
  playerInitials: { color: '#fff', fontWeight: '800', fontSize: FONT_SIZE.sm },
  playerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  playerName: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.1,
  },
  hostTag: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.md,
  },
  hostTagText: { fontSize: 9, fontWeight: '800', color: '#000' },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  ratingText: { fontSize: FONT_SIZE.xs, color: COLORS.text2, fontWeight: '600' },

  reviewBtn: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
  },
  reviewBtnText: { color: '#000', fontWeight: '800', fontSize: FONT_SIZE.xs },
  reviewedBtn: {
    backgroundColor: 'transparent',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border2,
  },
  reviewedBtnText: {
    color: COLORS.text3,
    fontWeight: '700',
    fontSize: FONT_SIZE.xs,
  },

  emptyCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: 20,
    alignItems: 'center',
  },
  emptyCardText: { color: COLORS.text3, fontSize: FONT_SIZE.sm },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    gap: 14,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    color: COLORS.text,
  },
  backBtnSmall: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border2,
  },
  backBtnSmallText: { color: COLORS.text, fontWeight: '700' },

  allDoneCard: {
    marginTop: 20,
    padding: 18,
    borderRadius: RADIUS.lg,
    backgroundColor: 'rgba(57,217,138,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(57,217,138,0.3)',
    alignItems: 'center',
  },
  allDoneTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    color: COLORS.green,
    marginBottom: 4,
  },
  allDoneSub: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text2,
    lineHeight: LINE_HEIGHT?.xs || 17,
    textAlign: 'center',
  },
});
