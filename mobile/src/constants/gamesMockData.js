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
