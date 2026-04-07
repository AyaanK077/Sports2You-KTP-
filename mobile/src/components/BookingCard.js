import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, RADIUS, FONT_SIZE } from '../constants/theme';
import { getCourtById, formatDate, formatHour } from '../constants/data';

export default function BookingCard({ booking, onCancel, showCancel, facilities = {} }) {
  const court = getCourtById(booking.courtId, facilities || {});
  const facilityName = court?.facility?.short || '';
  const courtName = court?.name || '';
  const sportLabels = {
    'basketball': 'Basketball', 'indoor-soccer': 'Indoor Soccer',
    'indoor-volleyball': 'Indoor Volleyball', 'sand-volleyball': 'Sand Volleyball', 'tennis': 'Tennis',
  };
  const sportLabel = sportLabels[booking.sport] || booking.sport;
  const isUpcoming = booking.status === 'upcoming';

  return (
    <View style={[styles.card, isUpcoming ? styles.cardUpcoming : styles.cardPast]}>
      <View style={styles.header}>
        <View style={[styles.badge, isUpcoming ? styles.badgeGreen : styles.badgeGray]}>
          <Text style={[styles.badgeText, isUpcoming ? styles.badgeTextGreen : styles.badgeTextGray]}>
            {isUpcoming ? 'Upcoming' : 'Completed'}
          </Text>
        </View>
        <Text style={styles.sport}>{sportLabel}</Text>
      </View>

      <Text style={styles.courtName}>{courtName}</Text>
      <Text style={styles.facilityName}>{facilityName}</Text>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Date</Text>
          <Text style={styles.detailValue}>{formatDate(booking.date)}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Time</Text>
          <Text style={styles.detailValue}>
            {formatHour(booking.startHour)} – {formatHour(booking.endHour)}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Players</Text>
          <Text style={styles.detailValue}>{booking.players}</Text>
        </View>
        {booking.courtType && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Court</Text>
            <Text style={styles.detailValue}>
              {booking.courtType.charAt(0).toUpperCase() + booking.courtType.slice(1)} Court
            </Text>
          </View>
        )}
      </View>

      {showCancel && isUpcoming && (
        <TouchableOpacity style={styles.cancelBtn} onPress={() => onCancel(booking.id)}>
          <Text style={styles.cancelText}>Cancel Reservation</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.lg,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardUpcoming: {
    backgroundColor: COLORS.card,
    borderColor: COLORS.border2,
  },
  cardPast: {
    backgroundColor: COLORS.bg2,
    borderColor: COLORS.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  badgeGreen: {
    backgroundColor: 'rgba(57,217,138,0.12)',
    borderColor: 'rgba(57,217,138,0.3)',
  },
  badgeGray: {
    backgroundColor: 'rgba(90,100,120,0.15)',
    borderColor: 'rgba(90,100,120,0.3)',
  },
  badgeText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '700',
  },
  badgeTextGreen: { color: COLORS.green },
  badgeTextGray: { color: COLORS.text3 },
  sport: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.orange,
  },
  courtName: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 2,
  },
  facilityName: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text2,
    marginBottom: 14,
  },
  details: {
    gap: 6,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailLabel: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text3,
  },
  detailValue: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    fontWeight: '600',
  },
  cancelBtn: {
    marginTop: 16,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: 'rgba(247,95,95,0.3)',
    backgroundColor: 'rgba(247,95,95,0.1)',
    alignItems: 'center',
  },
  cancelText: {
    color: COLORS.red,
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
  },
});
