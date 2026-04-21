import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { COLORS, RADIUS, FONT_SIZE, LINE_HEIGHT } from '../constants/theme';
import { SportIcon } from '../constants/icons';

const REVIEW_TAGS = [
  'Friendly',
  'Reliable',
  'Good Teammate',
  'Competitive',
  'Skilled',
  'Respectful',
  'Great Organizer',
  'No-show',
];

/**
 * LeaveReviewScreen
 *
 * Props:
 *  - game: completed game object (used for context header)
 *  - player: the specific player being reviewed { id, name, initials, isHost, rating }
 *  - existingReview: if the user has already reviewed this player in this game, this holds
 *    { rating, text, tags, date } - the form will pre-fill and act as "edit".
 *  - onSubmitReview(gameId, playerId, review): persists the review in app state
 *  - onDone(): called after submit/cancel - navigates back to the right place
 *  - setPage: fallback nav
 *  - playerName: legacy prop (still honored if `player` not provided)
 */
export default function LeaveReviewScreen({
  setPage,
  showToast,
  game,
  player,
  playerName,
  existingReview,
  onSubmitReview,
  onDone,
}) {
  const resolvedPlayer = useMemo(() => {
    if (player) return player;
    if (playerName) {
      const initials = playerName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      return { id: null, name: playerName, initials };
    }
    return { id: null, name: 'Player', initials: 'P' };
  }, [player, playerName]);

  const isEditing = Boolean(existingReview);

  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [reviewText, setReviewText] = useState(existingReview?.text || '');
  const [selectedTags, setSelectedTags] = useState(existingReview?.tags || []);

  const handleRating = (rate) => {
    setRating(rating === rate ? rate - 1 : rate);
  };

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const goBack = () => {
    if (onDone) {
      onDone();
    } else {
      setPage?.('my-games');
    }
  };

  const handleSubmitReview = () => {
    if (rating === 0) {
      showToast?.('Please select a rating', 'error');
      return;
    }

    if (onSubmitReview && game?.id && resolvedPlayer?.id) {
      onSubmitReview(game.id, resolvedPlayer.id, {
        rating,
        text: reviewText.trim(),
        tags: selectedTags,
      });
    }

    showToast?.(
      isEditing ? 'Review updated' : 'Review submitted successfully!',
      'success'
    );
    goBack();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.pageHeader}>
        <TouchableOpacity onPress={goBack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>{isEditing ? 'Edit Review' : 'Leave a Review'}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Player Info */}
        <View style={styles.playerCard}>
          <View
            style={[
              styles.playerAvatar,
              resolvedPlayer.isHost && { backgroundColor: COLORS.green },
            ]}
          >
            <Text style={styles.playerInitials}>
              {resolvedPlayer.initials ||
                resolvedPlayer.name
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2) ||
                'P'}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.playerLabel}>
              {isEditing ? 'Editing your review for' : 'Reviewing'}
            </Text>
            <View style={styles.playerNameRow}>
              <Text style={styles.playerName}>{resolvedPlayer.name}</Text>
              {resolvedPlayer.isHost && (
                <View style={styles.hostTag}>
                  <Text style={styles.hostTagText}>Host</Text>
                </View>
              )}
            </View>
            {game?.courtName ? (
              <View style={styles.gameContextRow}>
                <SportIcon sport={game.sport} size={14} />
                <Text style={styles.gameContextText}>
                  {game.courtName}
                  {game.facilityName ? ` • ${game.facilityName}` : ''}
                </Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Rating Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How was your experience?</Text>
          <View style={styles.ratingSection}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity
                key={star}
                style={styles.starButton}
                onPress={() => handleRating(star)}
              >
                <Image
                  source={require('../assets/stats.png')}
                  style={{
                    width: 36,
                    height: 36,
                    tintColor: star <= rating ? '#F49C20' : '#555',
                    opacity: star <= rating ? 1 : 0.4,
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </View>
          {rating > 0 && (
            <Text style={styles.ratingLabel}>
              {rating === 1 && 'Needs Improvement'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Great'}
              {rating === 5 && 'Excellent!'}
            </Text>
          )}
        </View>

        {/* Tags Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Tags (optional)</Text>
          <Text style={styles.subsectionText}>Select up to 3 tags</Text>
          <View style={styles.tagsGrid}>
            {REVIEW_TAGS.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tagButton,
                  selectedTags.includes(tag) && styles.tagButtonSelected,
                ]}
                onPress={() => handleTagToggle(tag)}
                disabled={selectedTags.length >= 3 && !selectedTags.includes(tag)}
              >
                <Text
                  style={[
                    styles.tagButtonText,
                    selectedTags.includes(tag) && styles.tagButtonTextSelected,
                  ]}
                >
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Written Review */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Review (optional)</Text>
          <TextInput
            style={styles.reviewInput}
            placeholder="Share your experience... (max 200 characters)"
            placeholderTextColor={COLORS.text3}
            value={reviewText}
            onChangeText={(text) => setReviewText(text.slice(0, 200))}
            multiline
            numberOfLines={4}
          />
          <Text style={styles.charCount}>{reviewText.length}/200</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitReview}
            activeOpacity={0.85}
          >
            <Text style={styles.submitButtonText}>
              {isEditing ? 'Update Review' : 'Submit Review'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={goBack}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
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
  scroll: { flex: 1 },
  content: { padding: 22, paddingBottom: 40 },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border2,
  },
  playerAvatar: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerInitials: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    color: '#fff',
  },
  playerLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text3,
    letterSpacing: 0.2,
  },
  playerNameRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 },
  playerName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    color: COLORS.text,
    letterSpacing: -0.2,
  },
  hostTag: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.md,
  },
  hostTagText: { fontSize: 9, fontWeight: '800', color: '#000' },
  gameContextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  gameContextText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text2,
    lineHeight: LINE_HEIGHT?.xs || 17,
  },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 12,
    letterSpacing: -0.2,
  },
  subsectionText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text2,
    marginBottom: 12,
  },
  ratingSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  starButton: { padding: 8 },
  ratingLabel: {
    textAlign: 'center',
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.green,
    marginTop: 12,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagButton: {
    backgroundColor: COLORS.bg2,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tagButtonSelected: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },
  tagButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.text2,
  },
  tagButtonTextSelected: { color: '#000' },
  reviewInput: {
    backgroundColor: COLORS.bg2,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    padding: 14,
    fontSize: FONT_SIZE.md,
    textAlignVertical: 'top',
    minHeight: 110,
    lineHeight: LINE_HEIGHT?.md || 23,
  },
  charCount: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text3,
    marginTop: 8,
    textAlign: 'right',
  },
  actionButtons: {
    gap: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  submitButton: {
    backgroundColor: COLORS.green,
    borderRadius: RADIUS.lg,
    padding: 16,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '800',
    color: '#000',
    letterSpacing: 0.2,
  },
  cancelButton: {
    borderWidth: 1.5,
    borderColor: COLORS.text3,
    borderRadius: RADIUS.lg,
    padding: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text3,
  },
});
