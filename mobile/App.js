import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, RADIUS, FONT_SIZE } from './src/constants/theme';
import { authApi, bookingsApi, facilitiesApi } from './src/utils/api';
import { clearUser, loadUser, loadToken, saveToken, saveUser } from './src/utils/storage';
import { FACILITIES as LOCAL_FACILITIES } from './src/constants/data';

import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import ReserveScreen from './src/screens/ReserveScreen';
import ReservationsScreen from './src/screens/ReservationsScreen';
import FacilitiesScreen from './src/screens/FacilitiesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import JoinGameScreen from './src/screens/JoinGameScreen';
import GameDetailsScreen from './src/screens/GameDetailsScreen';
import LeaveReviewScreen from './src/screens/LeaveReviewScreen';
import MyGamesScreen from './src/screens/MyGamesScreen';
import CreateGameScreen from './src/screens/CreateGameScreen';
import CompletedGameReviewScreen from './src/screens/CompletedGameReviewScreen';
import BottomNav from './src/components/BottomNav';

function Toast({ message, type }) {
  const isSuccess = type === 'success';
  return (
    <View style={[styles.toast, isSuccess ? styles.toastSuccess : styles.toastError]}>
      <Text style={styles.toastText}>{isSuccess ? '✓ ' : '✕ '}{message}</Text>
    </View>
  );
}

export default function App() {
  const [page, setPage] = useState('landing');
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [facilities, setFacilities] = useState({});
  const [toast, setToast] = useState(null);
  const [selectedGame, setSelectedGame] = useState(null);
  const [joinedGameIds, setJoinedGameIds] = useState(new Set());
  // Review state: { [gameId]: { [playerId]: { rating, text, tags, date } } }
  const [reviews, setReviews] = useState({});
  const [selectedCompletedGame, setSelectedCompletedGame] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const submitReview = useCallback((gameId, playerId, review) => {
    setReviews((prev) => ({
      ...prev,
      [gameId]: {
        ...(prev[gameId] || {}),
        [playerId]: { ...review, date: new Date().toISOString() },
      },
    }));
  }, []);

  const navigateToCompletedGame = useCallback((game) => {
    setSelectedCompletedGame(game);
    setPage('completed-game-review');
  }, []);

  const navigateToPlayerReview = useCallback((game, player) => {
    setSelectedCompletedGame(game);
    setSelectedPlayer(player);
    setPage('leave-review');
  }, []);

  const normalizeBooking = useCallback((booking) => ({
    id: booking._id || booking.id,
    owner: String(booking.userId || booking.owner || ''),
    userId: String(booking.userId || booking.owner || ''),
    facilityId: booking.facilityId,
    courtId: booking.courtId,
    date: typeof booking.date === 'string' ? booking.date : new Date(booking.date).toISOString().split('T')[0],
    startHour: booking.startHour ?? Number(String(booking.time || '0:00').split(':')[0]),
    endHour: booking.endHour ?? (booking.startHour ?? Number(String(booking.time || '0:00').split(':')[0])) + (booking.duration || 1),
    duration: booking.duration || 1,
    sport: booking.sport || 'basketball',
    courtType: booking.courtType || null,
    players: booking.players || 1,
    teammates: booking.teammates || [],
    status: booking.status === 'cancelled' ? 'cancelled' : booking.status === 'completed' ? 'completed' : 'upcoming',
  }), []);

  const loadFacilities = useCallback(async () => {
    try {
      const result = await facilitiesApi.list();
      const normalized = Array.isArray(result) && result.length > 0
        ? result.reduce((acc, facility) => {
            acc[facility.id] = {
              ...facility,
              courts: facility.courts || [],
            };
            return acc;
          }, {})
        : LOCAL_FACILITIES;
      setFacilities(normalized);
    } catch (error) {
      setFacilities(LOCAL_FACILITIES);
    }
  }, []);

  const loadBookings = useCallback(async (userId) => {
    if (!userId) {
      setBookings([]);
      return;
    }

    try {
      const result = await bookingsApi.list(userId);
      setBookings(Array.isArray(result) ? result.map(normalizeBooking) : []);
    } catch (error) {
      setBookings([]);
    }
  }, [normalizeBooking]);

  // Load persisted user, token, facilities, and bookings on startup
  useEffect(() => {
    (async () => {
      const storedUser = await loadUser();
      const storedToken = await loadToken();
      await loadFacilities();
      if (storedUser) {
        setUser(storedUser);
        setIsLoggedIn(true);
        setToken(storedToken);
        setPage('home');
        await loadBookings(storedUser.id);
      }
    })();
  }, [loadBookings, loadFacilities]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const navigateToGameDetails = (game) => {
    setSelectedGame(game);
    setPage('game-details');
  };

  const handleAuthSuccess = async ({ user: nextUser, token: nextToken }) => {
    setUser(nextUser);
    setToken(nextToken);
    setIsLoggedIn(true);
    setPage('home');
    await saveUser(nextUser);
    await saveToken(nextToken);
    await loadBookings(nextUser.id);
  };

  const handleLogout = async () => {
    setUser(null);
    setIsLoggedIn(false);
    setToken(null);
    setBookings([]);
    setPage('landing');
    await clearUser();
  };

  const handleAddBooking = async (bookingPayload) => {
    const created = await bookingsApi.create(bookingPayload);
    const normalized = normalizeBooking(created);
    setBookings((prev) => [normalized, ...prev]);
    return normalized;
  };

  const handleCancelBooking = async (id) => {
    await bookingsApi.cancel(id);
    setBookings((prev) => prev.map((booking) => (booking.id === id ? { ...booking, status: 'cancelled' } : booking)));
  };

  const LOGGED_IN_PAGES = ['home', 'reserve', 'reservations', 'facilities', 'profile', 'join-game', 'game-details', 'leave-review', 'my-games', 'create-game', 'completed-game-review'];
  const showBottomNav = isLoggedIn && LOGGED_IN_PAGES.includes(page);

  const renderPage = () => {
    const commonProps = { setPage, showToast };

    if (!isLoggedIn) {
      switch (page) {
        case 'login':
          return <LoginScreen {...commonProps} onAuthSuccess={handleAuthSuccess} />;
        case 'signup':
          return <SignupScreen {...commonProps} onAuthSuccess={handleAuthSuccess} />;
        default:
          return <LandingScreen {...commonProps} facilities={facilities} />;
      }
    }

    switch (page) {
      case 'reserve':
        return (
          <ReserveScreen
            {...commonProps}
            bookings={bookings}
            facilities={facilities}
            onAddBooking={handleAddBooking}
            user={user}
          />
        );
      case 'reservations':
        return (
          <ReservationsScreen
            {...commonProps}
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            facilities={facilities}
            user={user}
          />
        );
      case 'facilities':
        return <FacilitiesScreen {...commonProps} facilities={facilities} />;
      case 'profile':
        return (
          <ProfileScreen
            {...commonProps}
            user={user}
            bookings={bookings}
            onLogout={handleLogout}
            facilities={facilities}
            reviews={reviews}
            navigateToCompletedGame={navigateToCompletedGame}
            navigateToPlayerReview={navigateToPlayerReview}
          />
        );
      case 'join-game':
        return <JoinGameScreen {...commonProps} user={user} navigateToGameDetails={navigateToGameDetails} />;
      case 'game-details':
        return (
          <GameDetailsScreen
            {...commonProps}
            game={selectedGame}
            hasJoined={selectedGame ? joinedGameIds.has(selectedGame.id) : false}
            onJoined={(gameId, joined) => {
              if (joined) {
                setJoinedGameIds((prev) => new Set([...prev, gameId]));
              } else {
                setJoinedGameIds((prev) => {
                  const updated = new Set(prev);
                  updated.delete(gameId);
                  return updated;
                });
              }
            }}
          />
        );
      case 'leave-review':
        return (
          <LeaveReviewScreen
            {...commonProps}
            game={selectedCompletedGame || selectedGame}
            player={selectedPlayer || (selectedGame?.host ? selectedGame.host : null)}
            existingReview={
              selectedCompletedGame && selectedPlayer
                ? reviews?.[selectedCompletedGame.id]?.[selectedPlayer.id] || null
                : null
            }
            onSubmitReview={submitReview}
            onDone={() => {
              if (selectedCompletedGame) {
                setSelectedPlayer(null);
                setPage('completed-game-review');
              } else {
                setPage('my-games');
              }
            }}
          />
        );
      case 'completed-game-review':
        return (
          <CompletedGameReviewScreen
            {...commonProps}
            game={selectedCompletedGame}
            reviews={reviews}
            onReviewPlayer={(player) => navigateToPlayerReview(selectedCompletedGame, player)}
            onBack={() => setPage('profile')}
          />
        );
      case 'my-games':
        return (
          <MyGamesScreen
            {...commonProps}
            joinedGameIds={joinedGameIds}
            navigateToGameDetails={navigateToGameDetails}
          />
        );
      case 'create-game':
        return <CreateGameScreen {...commonProps} />;
      default:
        return (
          <HomeScreen
            {...commonProps}
            user={user}
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
            facilities={facilities}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.pageContainer}>{renderPage()}</View>
      {showBottomNav && <BottomNav page={page} setPage={setPage} />}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  pageContainer: { flex: 1 },
  toast: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    borderRadius: RADIUS.md,
    padding: 14,
    alignItems: 'center',
    zIndex: 999,
  },
  toastSuccess: { backgroundColor: 'rgba(57,217,138,0.15)', borderWidth: 1, borderColor: 'rgba(57,217,138,0.4)' },
  toastError: { backgroundColor: 'rgba(247,95,95,0.15)', borderWidth: 1, borderColor: 'rgba(247,95,95,0.4)' },
  toastText: { color: COLORS.text, fontWeight: '700', fontSize: FONT_SIZE.sm },
});
