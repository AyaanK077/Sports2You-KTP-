export const FACILITIES = {
  ac: {
    id: 'ac',
    name: 'Activity Center',
    short: 'AC',
    address: '800 W Campbell Rd, Richardson, TX 75080',
    description: "UTD's main athletic facility featuring 3 full-size basketball courts and a flexible side gym.",
    courts: [
      { id: 'ac-main-left', name: 'Main Gym – Left Court', gym: 'Main Gym', sports: ['basketball'], type: 'basketball-only' },
      { id: 'ac-main-mid', name: 'Main Gym – Middle Court', gym: 'Main Gym', sports: ['basketball'], type: 'basketball-only' },
      { id: 'ac-main-right', name: 'Main Gym – Right Court', gym: 'Main Gym', sports: ['basketball'], type: 'basketball-only' },
      { id: 'ac-side', name: 'Side Gym', gym: 'Side Gym', sports: ['basketball', 'soccer'], type: 'multi-use' },
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
    description: 'A modern recreation facility on the west side of campus with a large multi-sport court.',
    courts: [
      { id: 'rw-main', name: 'Main Court', gym: 'Main Hall', sports: ['basketball', 'soccer'], type: 'multi-use' },
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

export const INITIAL_BOOKINGS = [
  { id: 'b1', courtId: 'ac-main-left', date: '2025-07-14', startHour: 10, endHour: 11, sport: 'basketball', courtType: 'half', players: 6, owner: 'u1', teammates: ['Sam P.', 'Chris L.', 'Jordan M.', 'Riley K.', 'Morgan T.'], status: 'upcoming' },
  { id: 'b2', courtId: 'rw-main', date: '2025-07-16', startHour: 18, endHour: 19, sport: 'soccer', courtType: null, players: 8, owner: 'u1', teammates: ['Alex C.', 'Sam D.', 'Chris W.', 'Jordan B.', 'Riley G.', 'Morgan S.', 'Taylor F.'], status: 'upcoming' },
  { id: 'b3', courtId: 'ac-side', date: '2025-07-10', startHour: 14, endHour: 15, sport: 'basketball', courtType: 'full', players: 10, owner: 'u1', teammates: [], status: 'completed' },
  { id: 'bx1', courtId: 'ac-main-mid', date: '2025-07-14', startHour: 9, endHour: 11, sport: 'basketball', courtType: 'full', players: 8, owner: 'other', status: 'upcoming' },
  { id: 'bx2', courtId: 'ac-main-right', date: '2025-07-14', startHour: 11, endHour: 13, sport: 'basketball', courtType: 'half', players: 6, owner: 'other', status: 'upcoming' },
  { id: 'bx3', courtId: 'rw-main', date: '2025-07-15', startHour: 16, endHour: 18, sport: 'basketball', courtType: 'full', players: 10, owner: 'other', status: 'upcoming' },
];

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

export function getCourtById(id) {
  for (const f of Object.values(FACILITIES)) {
    const c = f.courts.find((c) => c.id === id);
    if (c) return { ...c, facility: f };
  }
  return null;
}

export function getSlotsForCourt(courtId, dateStr, bookings) {
  const dow = getDayOfWeek(dateStr);
  const courtInfo = getCourtById(courtId);
  if (!courtInfo) return [];
  const fac = courtInfo.facility;
  const open = fac.openHour[dow];
  const close = fac.closeHour[dow];
  if (open === undefined) return [];
  const slots = [];
  for (let h = open; h < close; h++) {
    const booked = bookings.some(
      (b) => b.courtId === courtId && b.date === dateStr && h >= b.startHour && h < b.endHour
    );
    slots.push({ hour: h, booked });
  }
  return slots;
}

export function genId() {
  return 'r' + Math.random().toString(36).slice(2, 9);
}

export function getFirstName(fullName) {
  return fullName.split(' ')[0];
}

export function getInitials(fullName) {
  const parts = fullName.trim().split(' ');
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0].substring(0, 2).toUpperCase();
}
