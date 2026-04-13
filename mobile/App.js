import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, RADIUS, FONT_SIZE } from './src/constants/theme';
import { authApi, bookingsApi, facilitiesApi } from './src/utils/api';
import { clearUser, loadUser, loadToken, saveToken, saveUser } from './src/utils/storage';

import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';
import HomeScreen from './src/screens/HomeScreen';
import ReserveScreen from './src/screens/ReserveScreen';
import ReservationsScreen from './src/screens/ReservationsScreen';
import FacilitiesScreen from './src/screens/FacilitiesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
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
      const normalized = Array.isArray(result)
        ? result.reduce((acc, facility) => {
            acc[facility.id] = {
              ...facility,
              courts: facility.courts || [],
            };
            return acc;
          }, {})
        : {};
      setFacilities(normalized);
    } catch (error) {
      setFacilities({});
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

  const LOGGED_IN_PAGES = ['home', 'reserve', 'reservations', 'facilities', 'profile'];
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
          />
        );
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
