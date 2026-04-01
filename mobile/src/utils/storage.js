import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = 'sports2you_user';
const BOOKINGS_KEY = 'sports2you_bookings';

export async function loadUser() {
  try {
    const json = await AsyncStorage.getItem(USER_KEY);
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

export async function saveUser(user) {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {}
}

export async function clearUser() {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch {}
}

export async function loadBookings() {
  try {
    const json = await AsyncStorage.getItem(BOOKINGS_KEY);
    return json ? JSON.parse(json) : null;
  } catch {
    return null;
  }
}

export async function saveBookings(bookings) {
  try {
    await AsyncStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  } catch {}
}
