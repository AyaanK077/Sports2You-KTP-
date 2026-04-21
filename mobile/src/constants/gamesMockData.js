export const SKILL_LEVELS = {
  beginner: { id: 'beginner', label: 'Beginner / Fun', color: '#39d98a' },
  intermediate: { id: 'intermediate', label: 'Intermediate / Slightly Competitive', color: '#f7c948' },
  advanced: { id: 'advanced', label: 'Advanced / Competitive', color: '#f47c20' },
  highlevel: { id: 'highlevel', label: 'High-Level / D1 Style', color: '#f75f5f' },
};

export const PLAYER_REVIEWS = {
  player1: {
    rating: 4.8,
    count: 24,
    tags: ['Friendly', 'Reliable', 'Good Teammate'],
    recentReviews: [
      { author: 'Alex Chen', rating: 5, text: 'Great player, very supportive!', date: '2 days ago' },
      { author: 'Jordan Lee', rating: 5, text: 'Reliable and fun to play with', date: '5 days ago' },
      { author: 'Sam Park', rating: 4, text: 'Solid fundamentals', date: '1 week ago' },
    ],
  },
  player2: {
    rating: 4.5,
    count: 18,
    tags: ['Competitive', 'Skilled', 'Respectful'],
    recentReviews: [
      { author: 'Casey Mitchell', rating: 5, text: 'Excellent player with great court awareness', date: '3 days ago' },
      { author: 'Taylor Kim', rating: 4, text: 'Very competitive, fun to play against', date: '1 week ago' },
    ],
  },
  player3: {
    rating: 4.9,
    count: 32,
    tags: ['Great Organizer', 'Reliable', 'Friendly'],
    recentReviews: [
      { author: 'Morgan Davis', rating: 5, text: 'Amazing host! Always organized and welcoming', date: '2 days ago' },
      { author: 'Alex Chen', rating: 5, text: 'Best games I\'ve played in months', date: '4 days ago' },
    ],
  },
  player4: {
    rating: 4.6,
    count: 15,
    tags: ['Reliable', 'Friendly', 'Good Teammate'],
    recentReviews: [
      { author: 'Jordan Lee', rating: 5, text: 'Always shows up on time and ready to play', date: '6 days ago' },
      { author: 'Riley Thompson', rating: 4, text: 'Fun and respectful player', date: '2 weeks ago' },
    ],
  },
};

export const MOCK_GAMES = [
  {
    id: 'game1',
    sport: 'basketball',
    facility: 'aci',
    courtId: 'aci-main-left',
    courtName: 'Main Gym – Left Court',
    facilityName: 'AC Indoor',
    date: '2026-04-15',
    time: '6:00 PM',
    startHour: 18,
    duration: 2,
    maxPlayers: 10,
    skillLevel: 'intermediate',
    isPublic: true,
    status: 'upcoming',
    host: {
      id: 'player3',
      name: 'Morgan Davis',
      initials: 'MD',
      rating: 4.9,
      reviews: PLAYER_REVIEWS.player3,
    },
    joinedPlayers: [
      { id: 'player3', name: 'Morgan Davis', initials: 'MD', isHost: true, rating: 4.9 },
      { id: 'player1', name: 'Alex Chen', initials: 'AC', rating: 4.8 },
      { id: 'player2', name: 'Jordan Lee', initials: 'JL', rating: 4.5 },
    ],
    description: 'Casual game, all skill levels welcome! Let\'s have some fun and get exercise.',
    spotsRemaining: 7,
  },
  {
    id: 'game2',
    sport: 'basketball',
    facility: 'aco',
    courtId: 'aco-bball-1',
    courtName: 'Outdoor Court 1',
    facilityName: 'AC Outdoor',
    date: '2026-04-15',
    time: '7:00 PM',
    startHour: 19,
    duration: 2,
    maxPlayers: 8,
    skillLevel: 'advanced',
    isPublic: true,
    status: 'upcoming',
    host: {
      id: 'player4',
      name: 'Casey Mitchell',
      initials: 'CM',
      rating: 4.6,
      reviews: PLAYER_REVIEWS.player4,
    },
    joinedPlayers: [
      { id: 'player4', name: 'Casey Mitchell', initials: 'CM', isHost: true, rating: 4.6 },
      { id: 'player2', name: 'Jordan Lee', initials: 'JL', rating: 4.5 },
    ],
    description: 'Competitive game. Looking for skilled players. Serious players only.',
    spotsRemaining: 6,
  },
  {
    id: 'game3',
    sport: 'indoor-volleyball',
    facility: 'recwest',
    courtId: 'rw-main',
    courtName: 'Main Court',
    facilityName: 'Rec West',
    date: '2026-04-16',
    time: '5:30 PM',
    startHour: 17,
    duration: 1.5,
    maxPlayers: 12,
    skillLevel: 'beginner',
    isPublic: true,
    status: 'upcoming',
    host: {
      id: 'player1',
      name: 'Alex Chen',
      initials: 'AC',
      rating: 4.8,
      reviews: PLAYER_REVIEWS.player1,
    },
    joinedPlayers: [
      { id: 'player1', name: 'Alex Chen', initials: 'AC', isHost: true, rating: 4.8 },
      { id: 'player3', name: 'Morgan Davis', initials: 'MD', rating: 4.9 },
      { id: 'player4', name: 'Casey Mitchell', initials: 'CM', rating: 4.6 },
      { id: 'player5', name: 'Riley Thompson', initials: 'RT', rating: 4.3 },
    ],
    description: 'Fun and inclusive volleyball game. Great for beginners and experienced players!',
    spotsRemaining: 8,
  },
  {
    id: 'game4',
    sport: 'indoor-soccer',
    facility: 'aci',
    courtId: 'aci-aux',
    courtName: 'Auxiliary Gym',
    facilityName: 'AC Indoor',
    date: '2026-04-16',
    time: '8:00 PM',
    startHour: 20,
    duration: 2,
    maxPlayers: 10,
    skillLevel: 'intermediate',
    isPublic: false,
    status: 'upcoming',
    host: {
      id: 'player2',
      name: 'Jordan Lee',
      initials: 'JL',
      rating: 4.5,
      reviews: PLAYER_REVIEWS.player2,
    },
    joinedPlayers: [
      { id: 'player2', name: 'Jordan Lee', initials: 'JL', isHost: true, rating: 4.5 },
      { id: 'player1', name: 'Alex Chen', initials: 'AC', rating: 4.8 },
    ],
    description: 'Private indoor soccer with friends. Mix of recreational and competitive players.',
    spotsRemaining: 8,
  },
  {
    id: 'game5',
    sport: 'basketball',
    facility: 'aci',
    courtId: 'aci-main-mid',
    courtName: 'Main Gym – Middle Court',
    facilityName: 'AC Indoor',
    date: '2026-04-17',
    time: '9:00 PM',
    startHour: 21,
    duration: 2,
    maxPlayers: 10,
    skillLevel: 'highlevel',
    isPublic: true,
    status: 'upcoming',
    host: {
      id: 'player6',
      name: 'Taylor Kim',
      initials: 'TK',
      rating: 4.7,
      reviews: {
        rating: 4.7,
        count: 28,
        tags: ['Highly Skilled', 'Competitive', 'Professional'],
        recentReviews: [
          { author: 'Morgan Davis', rating: 5, text: 'Elite level player, amazing to watch', date: '1 day ago' },
        ],
      },
    },
    joinedPlayers: [
      { id: 'player6', name: 'Taylor Kim', initials: 'TK', isHost: true, rating: 4.7 },
      { id: 'player2', name: 'Jordan Lee', initials: 'JL', rating: 4.5 },
    ],
    description: 'High-level tournament-style pickup. D1 experience preferred. Fast-paced and intense!',
    spotsRemaining: 8,
  },
];

// ─── Players You've Played With ──────────────────────────────────────────────
export const MOCK_PLAYERS_PLAYED_WITH = [
  {
    id: 'player1',
    name: 'Alex Chen',
    initials: 'AC',
    sportsTogether: ['basketball', 'indoor-soccer'],
    lastGameDate: '2026-03-15',
    averageRating: 4.8,
    reviewCount: 24,
    userReviewedThem: false,
    reviews: [
      { rating: 5, tag: 'Good Teammate', date: '2026-03-15' },
      { rating: 5, tag: 'Reliable', date: '2026-03-08' },
    ],
  },
  {
    id: 'player2',
    name: 'Jordan Lee',
    initials: 'JL',
    sportsTogether: ['basketball', 'indoor-volleyball'],
    lastGameDate: '2026-03-20',
    averageRating: 4.5,
    reviewCount: 18,
    userReviewedThem: false,
    reviews: [
      { rating: 4, tag: 'Competitive', date: '2026-03-20' },
      { rating: 5, tag: 'Friendly', date: '2026-03-12' },
    ],
  },
  {
    id: 'player3',
    name: 'Morgan Davis',
    initials: 'MD',
    sportsTogether: ['basketball'],
    lastGameDate: '2026-04-01',
    averageRating: 4.9,
    reviewCount: 30,
    userReviewedThem: true,
    userReview: { rating: 5, text: 'Great player, awesome energy!', tags: ['Friendly', 'Great Teammate'] },
    reviews: [
      { rating: 5, tag: 'Friendly', date: '2026-04-01' },
      { rating: 5, tag: 'Great Teammate', date: '2026-03-25' },
    ],
  },
];

export function getGameById(gameId) {
  return MOCK_GAMES.find((g) => g.id === gameId) || null;
}

export function getGamesBySkillLevel(skillLevel) {
  if (!skillLevel) return MOCK_GAMES;
  return MOCK_GAMES.filter((g) => g.skillLevel === skillLevel);
}

export function getGamesBySport(sport) {
  if (!sport) return MOCK_GAMES;
  return MOCK_GAMES.filter((g) => g.sport === sport);
}

// ─── Completed Games (games the current user has played in) ──────────────────
// The "current user" marker used across completed-game rosters
export const CURRENT_USER_ID = 'currentUser';

export const MOCK_COMPLETED_GAMES = [
  {
    id: 'cgame1',
    sport: 'basketball',
    courtName: 'Main Gym – Left Court',
    facilityName: 'AC Indoor',
    date: '2026-04-05',
    time: '6:00 PM',
    duration: 2,
    skillLevel: 'intermediate',
    status: 'completed',
    isPublic: true,
    description: 'Great evening pickup. Competitive but friendly crowd.',
    host: { id: 'player3', name: 'Morgan Davis', initials: 'MD', rating: 4.9 },
    joinedPlayers: [
      { id: 'player3', name: 'Morgan Davis', initials: 'MD', isHost: true, rating: 4.9 },
      { id: 'player1', name: 'Alex Chen', initials: 'AC', rating: 4.8 },
      { id: 'player2', name: 'Jordan Lee', initials: 'JL', rating: 4.5 },
      { id: 'player4', name: 'Casey Mitchell', initials: 'CM', rating: 4.6 },
      { id: CURRENT_USER_ID, name: 'You', initials: 'YO' },
    ],
  },
  {
    id: 'cgame2',
    sport: 'indoor-volleyball',
    courtName: 'Main Court',
    facilityName: 'Rec West',
    date: '2026-03-28',
    time: '5:30 PM',
    duration: 1.5,
    skillLevel: 'beginner',
    status: 'completed',
    isPublic: true,
    description: 'Fun and inclusive volleyball. Rotated teams every set.',
    host: { id: 'player1', name: 'Alex Chen', initials: 'AC', rating: 4.8 },
    joinedPlayers: [
      { id: 'player1', name: 'Alex Chen', initials: 'AC', isHost: true, rating: 4.8 },
      { id: 'player3', name: 'Morgan Davis', initials: 'MD', rating: 4.9 },
      { id: 'player5', name: 'Riley Thompson', initials: 'RT', rating: 4.3 },
      { id: 'player6', name: 'Taylor Kim', initials: 'TK', rating: 4.7 },
      { id: CURRENT_USER_ID, name: 'You', initials: 'YO' },
    ],
  },
  {
    id: 'cgame3',
    sport: 'indoor-soccer',
    courtName: 'Auxiliary Gym',
    facilityName: 'AC Indoor',
    date: '2026-03-20',
    time: '8:00 PM',
    duration: 2,
    skillLevel: 'intermediate',
    status: 'completed',
    isPublic: false,
    description: 'Private 5-a-side with friends. Solid pace all night.',
    host: { id: 'player2', name: 'Jordan Lee', initials: 'JL', rating: 4.5 },
    joinedPlayers: [
      { id: 'player2', name: 'Jordan Lee', initials: 'JL', isHost: true, rating: 4.5 },
      { id: 'player1', name: 'Alex Chen', initials: 'AC', rating: 4.8 },
      { id: 'player4', name: 'Casey Mitchell', initials: 'CM', rating: 4.6 },
      { id: CURRENT_USER_ID, name: 'You', initials: 'YO' },
    ],
  },
];

// Return players in the game that the current user can review (everyone except themselves)
export function getReviewablePlayers(game) {
  if (!game || !Array.isArray(game.joinedPlayers)) return [];
  return game.joinedPlayers.filter((p) => p.id !== CURRENT_USER_ID);
}

// How many players the user has already reviewed in this game
export function countReviewedForGame(game, reviews) {
  const players = getReviewablePlayers(game);
  const gameReviews = reviews?.[game.id] || {};
  return players.filter((p) => gameReviews[p.id]).length;
}

// Is this single player reviewed for this game?
export function isPlayerReviewed(gameId, playerId, reviews) {
  return Boolean(reviews?.[gameId]?.[playerId]);
}

// Total pending reviews across all completed games
export function countTotalPendingReviews(completedGames, reviews) {
  return completedGames.reduce((sum, g) => {
    const reviewable = getReviewablePlayers(g).length;
    const reviewed = countReviewedForGame(g, reviews);
    return sum + (reviewable - reviewed);
  }, 0);
}

// Build a unique list of players from completed games, with per-player
// game-count + review-progress metadata derived from live review state.
export function getPlayersPlayedWith(completedGames, reviews) {
  const map = new Map();
  completedGames.forEach((game) => {
    getReviewablePlayers(game).forEach((player) => {
      const existing = map.get(player.id);
      const reviewedHere = isPlayerReviewed(game.id, player.id, reviews);
      if (existing) {
        existing.gamesPlayed += 1;
        if (reviewedHere) existing.reviewedCount += 1;
        if (!existing.sportsTogether.includes(game.sport)) {
          existing.sportsTogether.push(game.sport);
        }
        if (game.date > existing.lastGameDate) {
          existing.lastGameDate = game.date;
          existing.latestGameId = game.id;
        }
        if (!reviewedHere && !existing.pendingGameId) {
          existing.pendingGameId = game.id;
        }
      } else {
        map.set(player.id, {
          ...player,
          sportsTogether: [game.sport],
          gamesPlayed: 1,
          reviewedCount: reviewedHere ? 1 : 0,
          lastGameDate: game.date,
          latestGameId: game.id,
          pendingGameId: reviewedHere ? null : game.id,
        });
      }
    });
  });
  // Most recently played first
  return Array.from(map.values()).sort((a, b) =>
    (b.lastGameDate || '').localeCompare(a.lastGameDate || '')
  );
}
