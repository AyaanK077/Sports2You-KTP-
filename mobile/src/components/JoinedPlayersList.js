import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, FONT_SIZE } from '../constants/theme';
import { StatsIcon } from '../constants/icons';

export default function JoinedPlayersList({ players = [] }) {
  const displayLimit = 4;
  const shouldTruncate = players.length > displayLimit;
  const displayPlayers = shouldTruncate ? players.slice(0, displayLimit - 1) : players;
  const moreCount = shouldTruncate ? players.length - (displayLimit - 1) : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Joined Players ({players.length})</Text>
      <View style={styles.avatarRow}>
        {displayPlayers.map((player, idx) => (
          <View key={player.id || idx} style={[styles.avatar, player.isHost && styles.avatarHost]}>
            <Text style={styles.avatarText}>{player.initials}</Text>
            {player.isHost && <View style={styles.hostBadge} />}
          </View>
        ))}
        {shouldTruncate && (
          <View style={styles.moreAvatar}>
            <Text style={styles.moreText}>+{moreCount}</Text>
          </View>
        )}
      </View>
      <View style={styles.playerNamesList}>
        {players.slice(0, 3).map((player, idx) => (
          <View key={player.id || idx} style={styles.playerNameRow}>
            {player.isHost && <View style={styles.hostTag}><Text style={styles.hostTagText}>Host</Text></View>}
            <Text style={styles.playerName}>{player.name}</Text>
            {player.rating && <View style={styles.ratingRow}><StatsIcon size={11} /><Text style={styles.ratingText}>{player.rating}</Text></View>}
          </View>
        ))}
        {players.length > 3 && (
          <Text style={styles.moreNames}>+{players.length - 3} more...</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text2,
    marginBottom: 8,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.orange,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: COLORS.border2,
  },
  avatarHost: {
    backgroundColor: COLORS.green,
    borderWidth: 2,
    borderColor: COLORS.green,
  },
  avatarText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: '#fff',
  },
  hostBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 14,
    height: 14,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.yellow,
    borderWidth: 2,
    borderColor: COLORS.bg,
  },
  moreAvatar: {
    width: 40,
    height: 40,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bg2,
    borderWidth: 1.5,
    borderColor: COLORS.border2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreText: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '600',
    color: COLORS.text2,
  },
  playerNamesList: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  playerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  playerName: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text,
  },
  hostTag: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.md,
  },
  hostTagText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#000',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text2,
  },
  moreNames: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text2,
    fontStyle: 'italic',
  },
});
