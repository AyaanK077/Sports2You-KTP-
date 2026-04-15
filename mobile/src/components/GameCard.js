import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS, RADIUS, FONT_SIZE } from '../constants/theme';
import SkillLevelChip from './SkillLevelChip';
import JoinedPlayersList from './JoinedPlayersList';
import { SportIcon, CalendarIcon, ClockIcon, StatsIcon } from '../constants/icons';

export default function GameCard({ game, onPress, onJoin, hasJoined = false }) {
  const timeStr = `${game.time} • ${game.duration}h`;
  const spotsStr = `${game.spotsRemaining} spots left`;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <View style={styles.sportRow}>
            <SportIcon sport={game.sport} size={24} />
            <Text style={styles.courtInfo}>{game.courtName}</Text>
          </View>
          <Text style={styles.facilityName}>{game.facilityName}</Text>
        </View>
        <SkillLevelChip skillLevel={game.skillLevel} size="sm" />
      </View>

      {/* Date and Time */}
      <View style={styles.dateTime}>
        <View style={styles.dateRow}><CalendarIcon size={14} /><Text style={styles.date}>{game.date}</Text></View>
        <View style={styles.dateRow}><ClockIcon size={14} /><Text style={styles.time}>{timeStr}</Text></View>
      </View>

      {/* Host Info */}
      <View style={styles.hostSection}>
        <View style={styles.hostAvatar}>
          <Text style={styles.hostInitials}>{game.host.initials}</Text>
        </View>
        <View style={styles.hostInfo}>
          <Text style={styles.hostLabel}>Hosted by</Text>
          <Text style={styles.hostName}>{game.host.name}</Text>
          <View style={styles.dateRow}><StatsIcon size={12} /><Text style={styles.hostRating}>{game.host.rating} ({game.host.reviews?.count || 0} reviews)</Text></View>
        </View>
      </View>

      {/* Players Count */}
      <View style={styles.playersCount}>
        <Text style={styles.playersNumber}>{game.joinedPlayers.length}/{game.maxPlayers}</Text>
        <Text style={styles.playersLabel}>Players</Text>
      </View>

      {/* Player Avatars */}
      <View style={styles.playerAvatarsRow}>
        {game.joinedPlayers.slice(0, 5).map((player, idx) => (
          <View key={player.id || idx} style={[styles.playerAvatar, player.isHost && styles.playerAvatarHost]}>
            <Text style={styles.playerInitials}>{player.initials}</Text>
          </View>
        ))}
        {game.joinedPlayers.length > 5 && (
          <View style={styles.playerAvatarMore}>
            <Text style={styles.moreCount}>+{game.joinedPlayers.length - 5}</Text>
          </View>
        )}
      </View>

      {/* Description */}
      <Text style={styles.description} numberOfLines={2}>
        {game.description}
      </Text>

      {/* Footer - Spots and Join Button */}
      <View style={styles.footer}>
        <Text style={styles.spots}>{spotsStr}</Text>
        <TouchableOpacity
          style={[styles.joinBtn, hasJoined && styles.joinBtnJoined]}
          onPress={(e) => {
            e.stopPropagation();
            onJoin && onJoin();
          }}
        >
          <Text style={[styles.joinBtnText, hasJoined && styles.joinBtnTextJoined]}>
            {hasJoined ? '✓ Joined' : 'Join Game'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  sportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  courtInfo: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
    flex: 1,
  },
  facilityName: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text2,
    marginLeft: 28,
  },
  dateTime: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  date: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text2,
  },
  time: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text2,
  },
  hostSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  hostAvatar: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hostInitials: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: '#fff',
  },
  hostInfo: {
    flex: 1,
  },
  hostLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text3,
    marginBottom: 2,
  },
  hostName: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  hostRating: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text2,
    marginTop: 2,
  },
  playersCount: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  playersNumber: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.green,
  },
  playersLabel: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text2,
  },
  playerAvatarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  playerAvatar: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.border2,
  },
  playerAvatarHost: {
    backgroundColor: COLORS.green,
    borderWidth: 1.5,
    borderColor: COLORS.green,
  },
  playerInitials: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: '#fff',
  },
  playerAvatarMore: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bg2,
    borderWidth: 1,
    borderColor: COLORS.border2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreCount: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.text2,
  },
  description: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
    marginBottom: 12,
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spots: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.green,
    fontWeight: '600',
  },
  joinBtn: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: RADIUS.md,
  },
  joinBtnJoined: {
    backgroundColor: COLORS.text3,
  },
  joinBtnText: {
    color: '#000',
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
  joinBtnTextJoined: {
    color: COLORS.text3,
  },
});
