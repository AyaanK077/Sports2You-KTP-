import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, RADIUS, FONT_SIZE } from '../constants/theme';
import { StarRating } from '../constants/icons';

const REVIEW_TAGS = [
  'Friendly', 'Reliable', 'Good Teammate', 'Competitive',
  'Skilled', 'Respectful', 'Great Organizer', 'No-show'
];

export default function LeaveReviewScreen({ setPage, showToast, game, playerName = 'Player' }) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const handleRating = (rate) => {
    setRating(rating === rate ? rate - 1 : rate);
  };

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSubmitReview = () => {
    if (rating === 0) {
      showToast('Please select a rating', 'error');
      return;
    }

    showToast('Review submitted successfully!', 'success');
    setPage('my-games');
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <TouchableOpacity onPress={() => setPage('my-games')}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Leave a Review</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Player Info */}
        <View style={styles.playerCard}>
          <View style={styles.playerAvatar}>
            <Text style={styles.playerInitials}>
              {playerName?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'P'}
            </Text>
          </View>
          <View>
            <Text style={styles.playerLabel}>Reviewing</Text>
            <Text style={styles.playerName}>{playerName}</Text>
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
          <Text style={styles.charCount}>
            {reviewText.length}/200
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitReview}
          >
            <Text style={styles.submitButtonText}>Submit Review</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setPage('my-games')}
          >
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
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border2,
  },
  playerAvatar: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerInitials: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: '#fff',
  },
  playerLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text3,
  },
  playerName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 2,
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
  starButton: {
    padding: 8,
  },
  star: {
    fontSize: 36,
  },
  ratingLabel: {
    textAlign: 'center',
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
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
    paddingVertical: 8,
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
    fontWeight: '600',
    color: COLORS.text2,
  },
  tagButtonTextSelected: {
    color: '#000',
  },
  reviewInput: {
    backgroundColor: COLORS.bg2,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    padding: 12,
    fontSize: FONT_SIZE.md,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text3,
    marginTop: 8,
    textAlign: 'right',
  },
  actionButtons: {
    gap: 12,
    marginBottom: 32,
  },
  submitButton: {
    backgroundColor: COLORS.green,
    borderRadius: RADIUS.lg,
    padding: 14,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: '#000',
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: COLORS.text3,
    borderRadius: RADIUS.lg,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text3,
  },
});
