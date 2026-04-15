import React, { useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, RADIUS, FONT_SIZE } from '../constants/theme';
import { MOCK_GAMES } from '../constants/gamesMockData';
import GameCard from '../components/GameCard';

export default function MyGamesScreen({ joinedGameIds = new Set(), setPage, showToast, navigateToGameDetails }) {
  const [tab, setTab] = useState('joined'); // 'joined', 'past', 'hosted'

  // Get joined games
  const joinedGames = MOCK_GAMES.filter((game) => joinedGameIds.has(game.id));

  // Simulate hosted games (games where user is the host)
  const hostedGames = MOCK_GAMES.filter((game) => game.host?.id === 'currentUser');

  // Simulate past games (games that already happened)
  const pastGames = MOCK_GAMES.slice(0, 2).map((game, idx) => ({
    ...game,
    id: `past-${idx}`,
    status: 'completed',
    date: '2026-04-10',
    joinedPlayers: game.joinedPlayers.slice(0, 3),
  }));

  const getTabs = () => [
    {
      id: 'joined',
      label: 'Joined',
      count: joinedGames.length,
      games: joinedGames,
    },
    {
      id: 'past',
      label: 'Completed',
      count: pastGames.length,
      games: pastGames,
    },
  ];

  const tabs = getTabs();
  const currentTab = tabs.find((t) => t.id === tab) || tabs[0];
  const displayGames = currentTab.games;

  const handleLeaveGame = (gameId) => {
    showToast('Left the game', 'success');
    // In a real app, this would update the state
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <TouchableOpacity onPress={() => setPage('join-game')}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>My Games</Text>
        <TouchableOpacity onPress={() => setPage('join-game')}>
          <Text style={styles.browseBtn}>Browse →</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {tabs.map((t) => (
          <TouchableOpacity
            key={t.id}
            style={[styles.tab, tab === t.id && styles.tabActive]}
            onPress={() => setTab(t.id)}
          >
            <Text style={[styles.tabText, tab === t.id && styles.tabTextActive]}>
              {t.label}
              {t.count > 0 && (
                <Text style={styles.tabCount}> ({t.count})</Text>
              )}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {displayGames.length === 0 ? (
          <View style={styles.emptyState}>
            <Image source={tab === 'joined' ? require('../assets/basketball.png') : require('../assets/tick.png')} style={{ width: 48, height: 48, opacity: 0.4, marginBottom: 16 }} resizeMode="contain" />
            <Text style={styles.emptyTitle}>
              {tab === 'joined' ? 'No Joined Games' : 'No Completed Games'}
            </Text>
            <Text style={styles.emptyText}>
              {tab === 'joined'
                ? 'Browse available games and join one to get started!'
                : 'Games you complete will appear here.'}
            </Text>
            {tab === 'joined' && (
              <TouchableOpacity
                style={styles.browseButton}
                onPress={() => setPage('join-game')}
              >
                <Text style={styles.browseButtonText}>Browse Games</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          displayGames.map((game) => (
            <View key={game.id} style={styles.gameContainer}>
              <GameCard
                game={game}
                hasJoined={true}
                onPress={() => navigateToGameDetails(game)}
                onJoin={() => handleLeaveGame(game.id)}
              />

              {/* Game Actions */}
              <View style={styles.gameActions}>
                {tab === 'joined' && (
                  <>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => setPage('leave-review')}
                    >
                      <Text style={styles.actionButtonText}>Leave Review</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.actionButtonSecondary]}
                      onPress={() => handleLeaveGame(game.id)}
                    >
                      <Text style={styles.actionButtonTextSecondary}>Leave Game</Text>
                    </TouchableOpacity>
                  </>
                )}
                {tab === 'past' && (
                  <>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => setPage('leave-review')}
                    >
                      <Text style={styles.actionButtonText}>Rate This Game</Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          ))
        )}

        {/* Create Game CTA */}
        {displayGames.length > 0 && (
          <TouchableOpacity
            style={styles.createGameCard}
            onPress={() => setPage('create-game')}
          >
            <View>
              <Image source={require('../assets/basketball.png')} style={{ width: 28, height: 28, marginBottom: 8 }} resizeMode="contain" />
              <Text style={styles.createGameTitle}>Create a Game</Text>
              <Text style={styles.createGameSubtitle}>Host your own pickup game</Text>
            </View>
            <Text style={styles.createGameArrow}>→</Text>
          </TouchableOpacity>
        )}
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
  browseBtn: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.green,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bg2,
  },
  tabActive: {
    backgroundColor: COLORS.green,
  },
  tabText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text2,
  },
  tabTextActive: {
    color: '#000',
  },
  tabCount: {
    color: COLORS.text3,
  },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text2,
    textAlign: 'center',
    marginBottom: 20,
  },
  browseButton: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: RADIUS.md,
  },
  browseButtonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
  gameContainer: {
    marginBottom: 20,
  },
  gameActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: COLORS.green,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
    alignItems: 'center',
  },
  actionButtonSecondary: {
    backgroundColor: COLORS.bg2,
    borderWidth: 1.5,
    borderColor: COLORS.border,
  },
  actionButtonText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: '#000',
  },
  actionButtonTextSecondary: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '700',
    color: COLORS.text2,
  },
  createGameCard: {
    backgroundColor: COLORS.orange,
    borderRadius: RADIUS.lg,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  createGameTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: '#fff',
  },
  createGameSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  createGameArrow: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: '#fff',
  },
});
