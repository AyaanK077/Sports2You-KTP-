const DEFAULT_BASE_URL = 'http://localhost:3001';

const trimSlash = (value) => value.replace(/\/$/, '');

export const API_BASE_URL = trimSlash(
  process.env.EXPO_PUBLIC_API_BASE_URL || DEFAULT_BASE_URL
);

const parseResponse = async (response) => {
  let payload = null;

  try {
    payload = await response.json();
  } catch (error) {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.error || payload?.message || 'Request failed';
    throw new Error(message);
  }

  return payload;
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  return parseResponse(response);
};

export const authApi = {
  login: (credentials) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),
  signup: (payload) =>
    request('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};

export const facilitiesApi = {
  list: () => request('/api/facilities'),
};

export const bookingsApi = {
  list: (userId) => request(`/api/bookings?userId=${encodeURIComponent(userId)}`),
  create: (bookingPayload) =>
    request('/api/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingPayload),
    }),
  cancel: (bookingId) =>
    request(`/api/bookings/${bookingId}`, {
      method: 'DELETE',
    }),
};
