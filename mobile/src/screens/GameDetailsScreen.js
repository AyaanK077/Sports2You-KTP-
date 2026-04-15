import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, RADIUS, FONT_SIZE } from '../constants/theme';
import SkillLevelChip from '../components/SkillLevelChip';
import JoinedPlayersList from '../components/JoinedPlayersList';
import ReviewCard from '../components/ReviewCard';
import { SportIcon, CalendarIcon, ClockIcon, StatsIcon, ActivityIcon } from '../constants/icons';

export default function GameDetailsScreen({ game, setPage, showToast, onJoined, hasJoined = false }) {
  const [localHasJoined, setLocalHasJoined] = useState(hasJoined);

  if (!game) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Game not found</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => setPage('join-game')}>
            <Text style={styles.backBtnText}>← Back to Games</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const sportLabels = {
    basketball: 'Basketball Game',
    'indoor-soccer': 'Indoor Soccer Game',
    tennis: 'Tennis Match',
    'indoor-volleyball': 'Volleyball Game',
    'sand-volleyball': 'Sand Volleyball Game',
  };


  const handleJoinToggle = () => {
    setLocalHasJoined(!localHasJoined);
    showToast(
      !localHasJoined ? 'Successfully joined!' : 'Left the game',
      'success'
    );
    onJoined && onJoined(game.id, !localHasJoined);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <TouchableOpacity onPress={() => setPage('join-game')}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Game Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Sport & Title */}
        <View style={styles.heroSection}>
          <SportIcon sport={game.sport} size={56} />
          <Text style={styles.sportTitle}>{sportLabels[game.sport] || 'Game'}</Text>
          <SkillLevelChip skillLevel={game.skillLevel} style={{ marginTop: 12 }} />
        </View>

        {/* Location & Time Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoLabelRow}><ActivityIcon size={16} /><Text style={styles.infoLabel}>Facility</Text></View>
            <View>
              <Text style={styles.infoValue}>{game.facilityName}</Text>
              <Text style={styles.infoSubvalue}>{game.courtName}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.infoLabelRow}><CalendarIcon size={16} /><Text style={styles.infoLabel}>Date</Text></View>
            <Text style={styles.infoValue}>{game.date}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.infoLabelRow}><ClockIcon size={16} /><Text style={styles.infoLabel}>Time</Text></View>
            <Text style={styles.infoValue}>
              {game.time} • {game.duration}h session
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.infoLabelRow}><Image source={require('../assets/stats.png')} style={{ width: 16, height: 16 }} resizeMode="contain" /><Text style={styles.infoLabel}>Players</Text></View>
            <Text style={styles.infoValue}>
              {game.joinedPlayers.length}/{game.maxPlayers}
            </Text>
          </View>
        </View>

        {/* Host Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Game Host</Text>
          <View style={styles.hostCard}>
            <View style={styles.hostAvatar}>
              <Text style={styles.hostInitials}>{game.host.initials}</Text>
            </View>
            <View style={styles.hostDetails}>
              <Text style={styles.hostName}>{game.host.name}</Text>
              <View style={styles.hostRatingRow}>
                <StatsIcon size={13} />
                <Text style={styles.hostRating}>{game.host.rating} • {game.host.reviews?.count || 0} reviews</Text>
              </View>
              <View style={styles.hostTags}>
                {game.host.reviews?.tags?.slice(0, 3).map((tag, idx) => (
                  <View key={idx} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>

          {/* Host Reviews */}
          {game.host.reviews?.recentReviews?.length > 0 && (
            <View style={styles.reviewsContainer}>
              <Text style={styles.reviewsLabel}>Host Reviews</Text>
              {game.host.reviews.recentReviews.slice(0, 2).map((review, idx) => (
                <ReviewCard key={idx} review={review} compact />
              ))}
            </View>
          )}
        </View>

        {/* Joined Players Section */}
        <View style={styles.section}>
          <JoinedPlayersList players={game.joinedPlayers} />
        </View>

        {/* Game Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About this Game</Text>
          <Text style={styles.description}>{game.description}</Text>
        </View>

        {/* Spots Available */}
        <View style={styles.spotsSection}>
          <Text style={styles.spotsTitle}>{game.spotsRemaining} Spots Available</Text>
          <Text style={styles.spotsSubtitle}>
            {game.spotsRemaining} of {game.maxPlayers} spots left
          </Text>
        </View>

        {/* Join Button Section */}
        <View style={styles.actionSection}>
          <TouchableOpacity
            style={[styles.joinButton, localHasJoined && styles.joinButtonJoined]}
            onPress={handleJoinToggle}
          >
            <Text style={[styles.joinButtonText, localHasJoined && styles.joinButtonTextJoined]}>
              {localHasJoined ? '✓ Joined! Share with Friends' : 'Join this Game'}
            </Text>
          </TouchableOpacity>

          {localHasJoined && (
            <TouchableOpacity
              style={styles.reviewButton}
              onPress={() => setPage('leave-review')}
            >
              <Text style={styles.reviewButtonText}>Leave a Review →</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.green,
  },
  pageTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: FONT_SIZE.lg,
    color: COLORS.text2,
    fontWeight: '600',
  },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 24,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  infoLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  hostRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  sportTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },
  infoCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: COLORS.border2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text2,
  },
  infoValue: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'right',
  },
  infoSubvalue: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text2,
    marginTop: 4,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  hostCard: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.border2,
    marginBottom: 12,
  },
  hostAvatar: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hostInitials: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '600',
    color: '#fff',
  },
  hostDetails: {
    flex: 1,
  },
  hostName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
  },
  hostRating: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text2,
    marginTop: 4,
  },
  hostTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  tag: {
    backgroundColor: COLORS.bg2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.md,
    borderWidth: 0.5,
    borderColor: COLORS.border,
  },
  tagText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.yellow,
    fontWeight: '500',
  },
  reviewsContainer: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  reviewsLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  description: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
    lineHeight: 24,
  },
  spotsSection: {
    backgroundColor: COLORS.green,
    borderRadius: RADIUS.lg,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  spotsTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: '#000',
  },
  spotsSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: '#333',
    marginTop: 4,
  },
  actionSection: {
    gap: 12,
    marginBottom: 32,
  },
  joinButton: {
    backgroundColor: COLORS.orange,
    borderRadius: RADIUS.lg,
    padding: 16,
    alignItems: 'center',
  },
  joinButtonJoined: {
    backgroundColor: COLORS.text3,
  },
  joinButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: '#fff',
  },
  joinButtonTextJoined: {
    color: COLORS.text3,
  },
  reviewButton: {
    borderWidth: 2,
    borderColor: COLORS.green,
    borderRadius: RADIUS.lg,
    padding: 14,
    alignItems: 'center',
  },
  reviewButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.green,
  },
});
