import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, RADIUS, FONT_SIZE } from '../constants/theme';
import { StarRating } from '../constants/icons';

export default function ReviewCard({ review, compact = false }) {
  const renderStars = (rating) => {
    return <View style={styles.starsRow}>{StarRating({ rating, size: 14 })}</View>;
  };

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <View style={styles.compactHeader}>
          <View>
            <Text style={styles.author}>{review.author}</Text>
            <Text style={styles.date}>{review.date}</Text>
          </View>
          {renderStars(review.rating)}
        </View>
        <Text style={styles.textCompact}>{review.text}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarSmall}>
          <Text style={styles.avatarText}>
            {review.author?.split(' ').map((n) => n[0]).join('').toUpperCase()}
          </Text>
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.author}>{review.author}</Text>
          <Text style={styles.date}>{review.date}</Text>
        </View>
        {renderStars(review.rating)}
      </View>
      <Text style={styles.text}>{review.text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.bg2,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 10,
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: '#fff',
  },
  headerContent: {
    flex: 1,
  },
  author: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text,
  },
  date: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text3,
    marginTop: 2,
  },
  stars: {
    fontSize: FONT_SIZE.md,
  },
  starsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  text: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    lineHeight: 21,
  },
  compactContainer: {
    paddingBottom: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  compactHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  starsCompact: {
    fontSize: FONT_SIZE.sm,
  },
  textCompact: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    lineHeight: 16,
  },
});
