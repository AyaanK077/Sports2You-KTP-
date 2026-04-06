import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { COLORS, RADIUS, FONT_SIZE } from './src/constants/theme';
import { INITIAL_BOOKINGS } from './src/constants/data';
import { loadUser, loadBookings, saveBookings } from './src/utils/storage';

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
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [toast, setToast] = useState(null);

  // Load persisted user and bookings on startup
  useEffect(() => {
    (async () => {
      const storedUser = await loadUser();
      const storedBookings = await loadBookings();
      if (storedUser) {
        setUser(storedUser);
        setIsLoggedIn(true);
        setPage('home');
      }
      if (storedBookings) {
        setBookings(storedBookings);
      }
    })();
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setPage('landing');
  };

  const handleAddBooking = async (booking) => {
    const updated = [...bookings, booking];
    setBookings(updated);
    await saveBookings(updated);
  };

  const handleCancelBooking = async (id) => {
    const updated = bookings.map((b) =>
      b.id === id ? { ...b, status: 'cancelled' } : b
    );
    setBookings(updated);
    await saveBookings(updated);
  };

  const LOGGED_IN_PAGES = ['home', 'reserve', 'reservations', 'facilities', 'profile'];
  const showBottomNav = isLoggedIn && LOGGED_IN_PAGES.includes(page);

  const renderPage = () => {
    const commonProps = { setPage, showToast };

    if (!isLoggedIn) {
      switch (page) {
        case 'login':
          return <LoginScreen {...commonProps} setCurrentUser={setUser} onLogin={handleLogin} />;
        case 'signup':
          return <SignupScreen {...commonProps} setCurrentUser={setUser} onLogin={handleLogin} />;
        default:
          return <LandingScreen {...commonProps} />;
      }
    }

    switch (page) {
      case 'reserve':
        return (
          <ReserveScreen
            {...commonProps}
            bookings={bookings}
            onAddBooking={handleAddBooking}
          />
        );
      case 'reservations':
        return (
          <ReservationsScreen
            {...commonProps}
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
          />
        );
      case 'facilities':
        return <FacilitiesScreen {...commonProps} />;
      case 'profile':
        return (
          <ProfileScreen
            {...commonProps}
            user={user}
            bookings={bookings}
            onLogout={handleLogout}
          />
        );
      default:
        return (
          <HomeScreen
            {...commonProps}
            user={user}
            bookings={bookings}
            onCancelBooking={handleCancelBooking}
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
