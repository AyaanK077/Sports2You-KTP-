export const FACILITIES = {
  aci: {
    id: 'aci',
    name: 'Activity Center (Indoor)',
    short: 'AC Indoor',
    address: '800 W Campbell Rd, Richardson, TX 75080',
    description: "UTD's main indoor athletic facility featuring 3 full-size basketball courts and the Auxiliary Gym for basketball and indoor soccer.",
    courts: [
      { id: 'aci-main-left', name: 'Main Gym – Left Court', gym: 'Main Gym', sports: ['basketball'], type: 'basketball-only' },
      { id: 'aci-main-mid', name: 'Main Gym – Middle Court', gym: 'Main Gym', sports: ['basketball'], type: 'basketball-only' },
      { id: 'aci-main-right', name: 'Main Gym – Right Court', gym: 'Main Gym', sports: ['basketball'], type: 'basketball-only' },
      { id: 'aci-aux', name: 'Auxiliary Gym', gym: 'Auxiliary Gym', sports: ['basketball', 'indoor-soccer'], type: 'multi-use' },
    ],
    hours: {
      Sunday: '12:00 PM – 1:00 AM', Monday: '7:00 AM – 1:00 AM', Tuesday: '7:00 AM – 1:00 AM',
      Wednesday: '7:00 AM – 1:00 AM', Thursday: '7:00 AM – 1:00 AM', Friday: '7:00 AM – 10:00 PM', Saturday: '8:00 AM – 10:00 PM',
    },
    openHour: { Sun: 12, Mon: 7, Tue: 7, Wed: 7, Thu: 7, Fri: 7, Sat: 8 },
    closeHour: { Sun: 25, Mon: 25, Tue: 25, Wed: 25, Thu: 25, Fri: 22, Sat: 22 },
  },
  recwest: {
    id: 'recwest',
    name: 'Recreation Center West',
    short: 'Rec West',
    address: '2050 Waterview Pkwy, Richardson, TX 75080',
    description: 'A modern recreation facility on the west side of campus with courts for basketball and indoor volleyball.',
    courts: [
      { id: 'rw-main', name: 'Main Court', gym: 'Main Hall', sports: ['basketball', 'indoor-volleyball'], type: 'multi-use' },
    ],
    hours: {
      Sunday: '12:00 PM – 1:00 AM', Monday: '7:00 AM – 1:00 AM', Tuesday: '7:00 AM – 1:00 AM',
      Wednesday: '7:00 AM – 1:00 AM', Thursday: '7:00 AM – 1:00 AM', Friday: '7:00 AM – 10:00 PM', Saturday: '8:00 AM – 10:00 PM',
    },
    openHour: { Sun: 12, Mon: 7, Tue: 7, Wed: 7, Thu: 7, Fri: 7, Sat: 8 },
    closeHour: { Sun: 25, Mon: 25, Tue: 25, Wed: 25, Thu: 25, Fri: 22, Sat: 22 },
  },
  aco: {
    id: 'aco',
    name: 'Activity Center (Outdoor)',
    short: 'AC Outdoor',
    address: '800 W Campbell Rd, Richardson, TX 75080',
    description: "UTD's outdoor facility featuring 3 basketball courts, 2 sand volleyball courts, and 10 tennis courts.",
    courts: [
      { id: 'aco-bball-1', name: 'Outdoor Court 1', gym: 'Basketball', sports: ['basketball'], type: 'basketball-only' },
      { id: 'aco-bball-2', name: 'Outdoor Court 2', gym: 'Basketball', sports: ['basketball'], type: 'basketball-only' },
      { id: 'aco-bball-3', name: 'Outdoor Court 3', gym: 'Basketball', sports: ['basketball'], type: 'basketball-only' },
      { id: 'aco-svb-1', name: 'Sand Volleyball Court 1', gym: 'Sand Volleyball', sports: ['sand-volleyball'], type: 'sand-volleyball-only' },
      { id: 'aco-svb-2', name: 'Sand Volleyball Court 2', gym: 'Sand Volleyball', sports: ['sand-volleyball'], type: 'sand-volleyball-only' },
      { id: 'aco-ten-1', name: 'Tennis Court 1', gym: 'Tennis', sports: ['tennis'], type: 'tennis-only' },
      { id: 'aco-ten-2', name: 'Tennis Court 2', gym: 'Tennis', sports: ['tennis'], type: 'tennis-only' },
      { id: 'aco-ten-3', name: 'Tennis Court 3', gym: 'Tennis', sports: ['tennis'], type: 'tennis-only' },
      { id: 'aco-ten-4', name: 'Tennis Court 4', gym: 'Tennis', sports: ['tennis'], type: 'tennis-only' },
      { id: 'aco-ten-5', name: 'Tennis Court 5', gym: 'Tennis', sports: ['tennis'], type: 'tennis-only' },
      { id: 'aco-ten-6', name: 'Tennis Court 6', gym: 'Tennis', sports: ['tennis'], type: 'tennis-only' },
      { id: 'aco-ten-7', name: 'Tennis Court 7', gym: 'Tennis', sports: ['tennis'], type: 'tennis-only' },
      { id: 'aco-ten-8', name: 'Tennis Court 8', gym: 'Tennis', sports: ['tennis'], type: 'tennis-only' },
      { id: 'aco-ten-9', name: 'Tennis Court 9', gym: 'Tennis', sports: ['tennis'], type: 'tennis-only' },
      { id: 'aco-ten-10', name: 'Tennis Court 10', gym: 'Tennis', sports: ['tennis'], type: 'tennis-only' },
    ],
    hours: {
      Sunday: '12:00 PM – 1:00 AM', Monday: '7:00 AM – 1:00 AM', Tuesday: '7:00 AM – 1:00 AM',
      Wednesday: '7:00 AM – 1:00 AM', Thursday: '7:00 AM – 1:00 AM', Friday: '7:00 AM – 10:00 PM', Saturday: '8:00 AM – 10:00 PM',
    },
    openHour: { Sun: 12, Mon: 7, Tue: 7, Wed: 7, Thu: 7, Fri: 7, Sat: 8 },
    closeHour: { Sun: 25, Mon: 25, Tue: 25, Wed: 25, Thu: 25, Fri: 22, Sat: 22 },
  },
};

export const DAY_MAP = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const INITIAL_BOOKINGS = [];

// ─── UTILITIES ────────────────────────────────────────────────────────────────
export function formatHour(h) {
  const actual = h % 24;
  const period = actual >= 12 ? 'PM' : 'AM';
  const disp = actual === 0 ? 12 : actual > 12 ? actual - 12 : actual;
  return `${disp}:00 ${period}`;
}

export function getDateStr(d) {
  return d.toISOString().split('T')[0];
}

export function getTodayStr() {
  return getDateStr(new Date());
}

export function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + n);
  return getDateStr(d);
}

export function getDayOfWeek(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return DAY_MAP[d.getDay()];
}

export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function getCourtById(id, facilitiesMap = {}) {
  for (const f of Object.values(facilitiesMap || {})) {
    const c = (f.courts || []).find((court) => court.id === id);
    if (c) return { ...c, facility: f };
  }
  return null;
}

export function getSlotsForCourt(courtId, dateStr, bookings, facilitiesMap = {}) {
  const dow = getDayOfWeek(dateStr);
  const courtInfo = getCourtById(courtId, facilitiesMap);
  if (!courtInfo) return [];
  const fac = courtInfo.facility;
  const open = fac.openHour?.[dow] ?? fac.openHour?.get?.(dow);
  const close = fac.closeHour?.[dow] ?? fac.closeHour?.get?.(dow);
  if (open === undefined || close === undefined) return [];
  const slots = [];
  for (let h = open; h < close; h++) {
    const booked = bookings.some(
      (b) => b.status !== 'cancelled' && b.courtId === courtId && b.date === dateStr && h >= b.startHour && h < b.endHour
    );
    slots.push({ hour: h, booked });
  }
  return slots;
}

export function genId() {
  return 'r' + Math.random().toString(36).slice(2, 9);
}

export function getFirstName(fullName) {
  return String(fullName || '').trim().split(' ')[0] || 'Player';
}

export function getInitials(fullName) {
  const parts = String(fullName || '').trim().split(' ').filter(Boolean);
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : (parts[0] || 'P').substring(0, 2).toUpperCase();
}
