import React, { useState, useMemo } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, RADIUS, FONT_SIZE } from '../constants/theme';
import { MOCK_GAMES, SKILL_LEVELS } from '../constants/gamesMockData';
import GameCard from '../components/GameCard';
import { SportIcon } from '../constants/icons';

export default function JoinGameScreen({ setPage, showToast, user, navigateToGameDetails }) {
  const [selectedSkillLevel, setSelectedSkillLevel] = useState(null);
  const [selectedSport, setSelectedSport] = useState(null);
  const [joinedGameIds, setJoinedGameIds] = useState(new Set());
  const [selectedGameForDetails, setSelectedGameForDetails] = useState(null);

  const sports = [
    { id: 'basketball', label: 'Basketball' },
    { id: 'indoor-soccer', label: 'Soccer' },
    { id: 'tennis', label: 'Tennis' },
    { id: 'indoor-volleyball', label: 'Volleyball' },
  ];

  const filteredGames = useMemo(() => {
    return MOCK_GAMES.filter((game) => {
      if (!game.isPublic) return false; // Only show public games
      const matchSkill = selectedSkillLevel ? game.skillLevel === selectedSkillLevel : true;
      const matchSport = selectedSport ? game.sport === selectedSport : true;
      return matchSkill && matchSport;
    });
  }, [selectedSkillLevel, selectedSport]);

  const handleJoinGame = (gameId) => {
    setJoinedGameIds((prev) => {
      const updated = new Set(prev);
      if (updated.has(gameId)) {
        updated.delete(gameId);
        showToast('Left the game', 'success');
      } else {
        updated.add(gameId);
        showToast('Successfully joined!', 'success');
      }
      return updated;
    });
  };

  const handleViewDetails = (game) => {
    navigateToGameDetails(game);
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <View>
          <Text style={styles.pageTitle}>Join a Game</Text>
          <Text style={styles.pageSubtitle}>Find and join pickup games</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Skill Level Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Filter by Skill Level</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            <TouchableOpacity
              style={[styles.filterChip, !selectedSkillLevel && styles.filterChipActive]}
              onPress={() => setSelectedSkillLevel(null)}
            >
              <Text style={[styles.filterChipText, !selectedSkillLevel && styles.filterChipTextActive]}>
                All Levels
              </Text>
            </TouchableOpacity>
            {Object.values(SKILL_LEVELS).map((skill) => (
              <TouchableOpacity
                key={skill.id}
                style={[styles.filterChip, selectedSkillLevel === skill.id && styles.filterChipActive]}
                onPress={() => setSelectedSkillLevel(skill.id)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedSkillLevel === skill.id && styles.filterChipTextActive,
                  ]}
                >
                  {skill.label.split(' / ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sport Filter */}
        <View style={styles.filterSection}>
          <Text style={styles.filterLabel}>Filter by Sport</Text>
          <View style={styles.sportGrid}>
            {sports.map((sport) => (
              <TouchableOpacity
                key={sport.id}
                style={[styles.sportButton, selectedSport === sport.id && styles.sportButtonActive]}
                onPress={() => setSelectedSport(selectedSport === sport.id ? null : sport.id)}
              >
                <SportIcon sport={sport.id} size={28} />
                <Text style={[styles.sportLabel, selectedSport === sport.id && styles.sportLabelActive]}>
                  {sport.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Results Count */}
        <View style={styles.resultsHeader}>
          <Text style={styles.resultsCount}>
            {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''} available
          </Text>
          {(selectedSkillLevel || selectedSport) && (
            <TouchableOpacity onPress={() => {
              setSelectedSkillLevel(null);
              setSelectedSport(null);
            }}>
              <Text style={styles.clearFilters}>Clear filters</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Games List */}
        {filteredGames.length === 0 ? (
          <View style={styles.emptyState}>
            <Image source={require('../assets/basketball.png')} style={[styles.emptyIcon, { opacity: 0.4 }]} resizeMode="contain" />
            <Text style={styles.emptyTitle}>No Games Found</Text>
            <Text style={styles.emptyText}>Try adjusting your filters to find more games</Text>
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => {
                setSelectedSkillLevel(null);
                setSelectedSport(null);
              }}
            >
              <Text style={styles.resetBtnText}>Reset Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredGames.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              hasJoined={joinedGameIds.has(game.id)}
              onPress={() => {
                setSelectedGameForDetails(game);
                setPage('game-details');
              }}
              onJoin={() => handleJoinGame(game.id)}
            />
          ))
        )}

        {/* My Joined Games Link */}
        {joinedGameIds.size > 0 && (
          <TouchableOpacity
            style={styles.myGamesCard}
            onPress={() => setPage('my-games')}
          >
            <View style={styles.myGamesContent}>
              <Image source={require('../assets/tick.png')} style={{ width: 28, height: 28 }} resizeMode="contain" />
              <View style={styles.myGamesText}>
                <Text style={styles.myGamesTitle}>My Joined Games</Text>
                <Text style={styles.myGamesDesc}>{joinedGameIds.size} game{joinedGameIds.size !== 1 ? 's' : ''} joined</Text>
              </View>
            </View>
            <Text style={styles.myGamesArrow}>→</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Pass state to other screens via page data */}
      {selectedGameForDetails && setPage('game-details')}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  pageHeader: {
    padding: 20,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pageTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 4,
  },
  pageSubtitle: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.text2,
  },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  filterSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 10,
  },
  filterRow: {
    paddingRight: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bg2,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterChipActive: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },
  filterChipText: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text2,
  },
  filterChipTextActive: {
    color: '#000',
  },
  sportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sportButton: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: COLORS.bg2,
    borderRadius: RADIUS.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sportButtonActive: {
    backgroundColor: COLORS.orange,
    borderColor: COLORS.orange,
  },
  emptyIcon: {
    width: 48,
    height: 48,
    marginBottom: 16,
  },
  sportLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text2,
    textAlign: 'center',
  },
  sportLabelActive: {
    color: '#fff',
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  resultsCount: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text,
  },
  clearFilters: {
    fontSize: FONT_SIZE.sm,
    color: COLORS.green,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
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
    marginBottom: 16,
  },
  resetBtn: {
    backgroundColor: COLORS.green,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: RADIUS.md,
  },
  resetBtnText: {
    color: '#000',
    fontWeight: '700',
    fontSize: FONT_SIZE.sm,
  },
  myGamesCard: {
    backgroundColor: COLORS.green,
    borderRadius: RADIUS.lg,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  myGamesContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  myGamesEmoji: {
    fontSize: 28,
    fontWeight: '700',
  },
  myGamesText: {},
  myGamesTitle: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: '#000',
  },
  myGamesDesc: {
    fontSize: FONT_SIZE.sm,
    color: '#333',
    marginTop: 2,
  },
  myGamesArrow: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: '#000',
  },
});
