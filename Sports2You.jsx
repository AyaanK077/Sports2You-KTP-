import { useState, useEffect, useCallback } from "react";
import recWestMainCourtImage from "./recwest.jpg";
import aciMainGymPreviewImage from "./activitycentre.jpg";
import aciAuxiliaryPreviewImage from "./auxiliary.jpg";
import acoOutdoorBasketPreviewImage from "./outdoorbasket.jpg";
import acoSandVolleyballPreviewImage from "./volleycourts.jpg";
import acoTennisCourtsPreviewImage from "./tenniscourts.jpg";
import facilityIndoorHoverImage from "./activitycentre.jpg";
import facilityOutdoorHoverImage from "./outdoorcentre.jpg";
import facilityRecWestHoverImage from "./recwest.jpg";

// ─── AUTH UTILITIES ───────────────────────────────────────────────────────────
const initAuthFromStorage = () => {
  const stored = localStorage.getItem("sports2you_user");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  }
  return null;
};

const saveUserToStorage = (user) => {
  localStorage.setItem("sports2you_user", JSON.stringify(user));
};

const clearAuthStorage = () => {
  localStorage.removeItem("sports2you_user");
};

const getFirstName = (fullName) => fullName.split(" ")[0];

const getInitials = (fullName) => {
  const parts = fullName.trim().split(" ");
  return parts.length >= 2 
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0].substring(0, 2).toUpperCase();
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const FACILITIES = {
  aci: {
    id: "aci",
    name: "Activity Center Indoor",
    short: "ACI",
    address: "800 W Campbell Rd, Richardson, TX 75080",
    image: "activity.png",
    description: "UTD's main indoor athletic facility featuring 3 full-size basketball courts and the Auxiliary Gym for basketball and indoor soccer.",
    courts: [
      { id: "aci-main-left", name: "Main Gym – Left Court", gym: "Main Gym", sports: ["basketball"], type: "basketball-only", image: aciMainGymPreviewImage, previewSubtitle: "Full-size indoor basketball court" },
      { id: "aci-main-mid", name: "Main Gym – Middle Court", gym: "Main Gym", sports: ["basketball"], type: "basketball-only", image: aciMainGymPreviewImage, previewSubtitle: "Full-size indoor basketball court" },
      { id: "aci-main-right", name: "Main Gym – Right Court", gym: "Main Gym", sports: ["basketball"], type: "basketball-only", image: aciMainGymPreviewImage, previewSubtitle: "Full-size indoor basketball court" },
      { id: "aci-aux", name: "Auxiliary Gym", gym: "Auxiliary Gym", sports: ["basketball", "indoor-soccer"], type: "multi-use", image: aciAuxiliaryPreviewImage, previewSubtitle: "Basketball & indoor soccer" },
    ],
    hours: {
      Sunday: "12:00 PM – 1:00 AM", Monday: "7:00 AM – 1:00 AM", Tuesday: "7:00 AM – 1:00 AM",
      Wednesday: "7:00 AM – 1:00 AM", Thursday: "7:00 AM – 1:00 AM", Friday: "7:00 AM – 10:00 PM", Saturday: "8:00 AM – 10:00 PM",
    },
    openHour: { Sun: 12, Mon: 7, Tue: 7, Wed: 7, Thu: 7, Fri: 7, Sat: 8 },
    closeHour: { Sun: 25, Mon: 25, Tue: 25, Wed: 25, Thu: 25, Fri: 22, Sat: 22 },
  },
  recwest: {
    id: "recwest",
    name: "Recreation Center West",
    short: "Rec West",
    address: "2050 Waterview Pkwy, Richardson, TX 75080",
    image: "hoop.png",
    description: "A modern recreation facility on the west side of campus with courts for basketball and indoor volleyball.",
    courts: [
      {
        id: "rw-main",
        name: "Main Court",
        gym: "Main Hall",
        sports: ["basketball", "indoor-volleyball"],
        type: "multi-use",
        image: recWestMainCourtImage,
        previewSubtitle: "Indoor multi-sport court",
      },
    ],
    hours: {
      Sunday: "12:00 PM – 1:00 AM", Monday: "7:00 AM – 1:00 AM", Tuesday: "7:00 AM – 1:00 AM",
      Wednesday: "7:00 AM – 1:00 AM", Thursday: "7:00 AM – 1:00 AM", Friday: "7:00 AM – 10:00 PM", Saturday: "8:00 AM – 10:00 PM",
    },
    openHour: { Sun: 12, Mon: 7, Tue: 7, Wed: 7, Thu: 7, Fri: 7, Sat: 8 },
    closeHour: { Sun: 25, Mon: 25, Tue: 25, Wed: 25, Thu: 25, Fri: 22, Sat: 22 },
  },
  aco: {
    id: "aco",
    name: "Activity Center Outdoor",
    short: "ACO",
    address: "800 W Campbell Rd, Richardson, TX 75080",
    image: "activity.png",
    description: "UTD's outdoor facility featuring 3 basketball courts, 2 sand volleyball courts, and 10 tennis courts.",
    courts: [
      { id: "aco-bball-1", name: "Outdoor Court 1", gym: "Basketball", sports: ["basketball"], type: "basketball-only", image: acoOutdoorBasketPreviewImage, previewSubtitle: "Outdoor basketball court" },
      { id: "aco-bball-2", name: "Outdoor Court 2", gym: "Basketball", sports: ["basketball"], type: "basketball-only", image: acoOutdoorBasketPreviewImage, previewSubtitle: "Outdoor basketball court" },
      { id: "aco-bball-3", name: "Outdoor Court 3", gym: "Basketball", sports: ["basketball"], type: "basketball-only", image: acoOutdoorBasketPreviewImage, previewSubtitle: "Outdoor basketball court" },
      { id: "aco-svb-1", name: "Sand Volleyball Court 1", gym: "Sand Volleyball", sports: ["sand-volleyball"], type: "sand-volleyball-only", image: acoSandVolleyballPreviewImage, previewSubtitle: "Outdoor sand volleyball court", previewObjectPosition: "center 80%" },
      { id: "aco-svb-2", name: "Sand Volleyball Court 2", gym: "Sand Volleyball", sports: ["sand-volleyball"], type: "sand-volleyball-only", image: acoSandVolleyballPreviewImage, previewSubtitle: "Outdoor sand volleyball court", previewObjectPosition: "center 80%" },
      { id: "aco-ten-1", name: "Tennis Court 1", gym: "Tennis", sports: ["tennis"], type: "tennis-only", image: acoTennisCourtsPreviewImage, previewSubtitle: "Outdoor tennis court", previewObjectPosition: "center 56%" },
      { id: "aco-ten-2", name: "Tennis Court 2", gym: "Tennis", sports: ["tennis"], type: "tennis-only", image: acoTennisCourtsPreviewImage, previewSubtitle: "Outdoor tennis court", previewObjectPosition: "center 56%" },
      { id: "aco-ten-3", name: "Tennis Court 3", gym: "Tennis", sports: ["tennis"], type: "tennis-only", image: acoTennisCourtsPreviewImage, previewSubtitle: "Outdoor tennis court", previewObjectPosition: "center 56%" },
      { id: "aco-ten-4", name: "Tennis Court 4", gym: "Tennis", sports: ["tennis"], type: "tennis-only", image: acoTennisCourtsPreviewImage, previewSubtitle: "Outdoor tennis court", previewObjectPosition: "center 56%" },
      { id: "aco-ten-5", name: "Tennis Court 5", gym: "Tennis", sports: ["tennis"], type: "tennis-only", image: acoTennisCourtsPreviewImage, previewSubtitle: "Outdoor tennis court", previewObjectPosition: "center 56%" },
      { id: "aco-ten-6", name: "Tennis Court 6", gym: "Tennis", sports: ["tennis"], type: "tennis-only", image: acoTennisCourtsPreviewImage, previewSubtitle: "Outdoor tennis court", previewObjectPosition: "center 56%" },
      { id: "aco-ten-7", name: "Tennis Court 7", gym: "Tennis", sports: ["tennis"], type: "tennis-only", image: acoTennisCourtsPreviewImage, previewSubtitle: "Outdoor tennis court", previewObjectPosition: "center 56%" },
      { id: "aco-ten-8", name: "Tennis Court 8", gym: "Tennis", sports: ["tennis"], type: "tennis-only", image: acoTennisCourtsPreviewImage, previewSubtitle: "Outdoor tennis court", previewObjectPosition: "center 56%" },
      { id: "aco-ten-9", name: "Tennis Court 9", gym: "Tennis", sports: ["tennis"], type: "tennis-only", image: acoTennisCourtsPreviewImage, previewSubtitle: "Outdoor tennis court", previewObjectPosition: "center 56%" },
      { id: "aco-ten-10", name: "Tennis Court 10", gym: "Tennis", sports: ["tennis"], type: "tennis-only", image: acoTennisCourtsPreviewImage, previewSubtitle: "Outdoor tennis court", previewObjectPosition: "center 56%" },
    ],
    hours: {
      Sunday: "12:00 PM – 1:00 AM", Monday: "7:00 AM – 1:00 AM", Tuesday: "7:00 AM – 1:00 AM",
      Wednesday: "7:00 AM – 1:00 AM", Thursday: "7:00 AM – 1:00 AM", Friday: "7:00 AM – 10:00 PM", Saturday: "8:00 AM – 10:00 PM",
    },
    openHour: { Sun: 12, Mon: 7, Tue: 7, Wed: 7, Thu: 7, Fri: 7, Sat: 8 },
    closeHour: { Sun: 25, Mon: 25, Tue: 25, Wed: 25, Thu: 25, Fri: 22, Sat: 22 },
  },
};

const DAY_MAP = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// seed some pre-booked slots
const INITIAL_BOOKINGS = [
  { id: "b1", courtId: "aci-main-left", date: "2025-07-14", startHour: 10, endHour: 11, sport: "basketball", courtType: "half", players: 6, owner: "u1", teammates: ["Sam P.", "Chris L.", "Jordan M.", "Riley K.", "Morgan T."], status: "upcoming" },
  { id: "b2", courtId: "rw-main", date: "2025-07-16", startHour: 18, endHour: 19, sport: "indoor-volleyball", courtType: null, players: 8, owner: "u1", teammates: ["Alex C.", "Sam D.", "Chris W.", "Jordan B.", "Riley G.", "Morgan S.", "Taylor F."], status: "upcoming" },
  { id: "b3", courtId: "aci-aux", date: "2025-07-10", startHour: 14, endHour: 15, sport: "basketball", courtType: "full", players: 10, owner: "u1", teammates: ["Sam P.", "Chris L.", "Jordan M.", "Riley K.", "Morgan T.", "Alex C.", "Sam D.", "Chris W.", "Jordan B."], status: "completed" },
  { id: "b4", courtId: "aci-aux", date: "2025-07-18", startHour: 19, endHour: 21, sport: "indoor-soccer", courtType: null, players: 8, owner: "u1", teammates: ["Alex C.", "Sam D.", "Chris W.", "Jordan B.", "Riley G.", "Morgan S.", "Taylor F."], status: "upcoming" },
  { id: "bx1", courtId: "aci-main-mid", date: "2025-07-14", startHour: 9, endHour: 11, sport: "basketball", courtType: "full", players: 8, owner: "other", status: "upcoming" },
  { id: "bx2", courtId: "aci-main-right", date: "2025-07-14", startHour: 11, endHour: 13, sport: "basketball", courtType: "half", players: 6, owner: "other", status: "upcoming" },
  { id: "bx3", courtId: "rw-main", date: "2025-07-15", startHour: 16, endHour: 18, sport: "basketball", courtType: "full", players: 10, owner: "other", status: "upcoming" },
  { id: "bx4", courtId: "aco-bball-1", date: "2025-07-12", startHour: 15, endHour: 16, sport: "basketball", courtType: "full", players: 8, owner: "other", status: "upcoming" },
];

// ─── UTILITIES ────────────────────────────────────────────────────────────────
function formatHour(h) {
  const actual = h % 24;
  const period = actual >= 12 ? "PM" : "AM";
  const disp = actual === 0 ? 12 : actual > 12 ? actual - 12 : actual;
  return `${disp}:00 ${period}`;
}

function getDateStr(d) {
  return d.toISOString().split("T")[0];
}

function getTodayStr() {
  return getDateStr(new Date());
}

function addDays(dateStr, n) {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + n);
  return getDateStr(d);
}

function getDayOfWeek(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return DAY_MAP[d.getDay()];
}

function formatDate(dateStr) {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function getCourtById(id) {
  for (const f of Object.values(FACILITIES)) {
    const c = f.courts.find(c => c.id === id);
    if (c) return { ...c, facility: f };
  }
  return null;
}

function getSlotsForCourt(courtId, dateStr, bookings) {
  const dow = getDayOfWeek(dateStr);
  const courtInfo = getCourtById(courtId);
  if (!courtInfo) return [];
  const fac = courtInfo.facility;
  const open = fac.openHour[dow];
  const close = fac.closeHour[dow];
  if (open === undefined) return [];
  const slots = [];
  for (let h = open; h < close; h++) {
    const booked = bookings.some(b => b.courtId === courtId && b.date === dateStr && h >= b.startHour && h < b.endHour);
    slots.push({ hour: h, booked });
  }
  return slots;
}

function genId() {
  return "r" + Math.random().toString(36).slice(2, 9);
}

// ─── THEME / STYLES ───────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Barlow+Condensed:wght@500;600;700;800;900&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #09090d;
    --bg2: #0f1015;
    --bg3: #16191f;
    --bg4: #1c2230;
    --card: #131620;
    --border: rgba(57,217,138,0.08);
    --border2: rgba(57,217,138,0.12);
    --orange: #f47c20;
    --orange-glow: rgba(244,124,32,0.4);
    --orange-light: #ffb366;
    --green: #39d98a;
    --green-glow: rgba(57,217,138,0.25);
    --green-accent: rgba(57,217,138,0.15);
    --teal: #00d4cc;
    --teal-glow: rgba(0,212,204,0.25);
    --yellow: #f7c948;
    --red: #f75f5f;
    --text: #f0f2f5;
    --text2: #8a94a6;
    --text3: #5a6478;
    --radius: 10px;
    --radius-lg: 16px;
    --font: 'Barlow', sans-serif;
    --font-cond: 'Barlow Condensed', sans-serif;
  }

  html, body, #root {
    margin: 0;
    padding: 0;
    height: 100%;
    width: 100%;
  }

  html {
    scroll-behavior: smooth;
    background: linear-gradient(135deg, #0a0a0f 0%, #10101a 50%, #0f1820 100%);
    background-attachment: fixed;
  }

  body { 
    background: linear-gradient(135deg, #0a0a0f 0%, #10101a 50%, #0f1820 100%);
    background-attachment: fixed;
    color: var(--text); 
    font-family: var(--font); 
    font-size: 18px; 
    line-height: 1.6; 
    position: relative;
    overflow-x: hidden;
  }

  #root {
    display: flex;
    flex-direction: column;
    background: linear-gradient(135deg, #0a0a0f 0%, #10101a 50%, #0f1820 100%);
    background-attachment: fixed;
  }

  @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
  @keyframes glow-breathe { 0%, 100% { opacity: 0.25; filter: drop-shadow(0 0 20px rgba(244,124,32,0.5)); } 50% { opacity: 0.45; filter: drop-shadow(0 0 30px rgba(244,124,32,0.8)); } }
  @keyframes temoc-float { 0%, 100% { transform: translateY(0) rotate(0deg) scale(1); } 25% { transform: translateY(-18px) rotate(1deg) scale(1.02); } 75% { transform: translateY(-12px) rotate(-1deg) scale(0.98); } }
  @keyframes temoc-glow-pulse { 0%, 100% { filter: blur(4px) drop-shadow(0 0 20px rgba(244,124,32,0.3)); } 50% { filter: blur(4px) drop-shadow(0 0 40px rgba(244,124,32,0.6)); } }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes bg-pulse { 0%, 100% { opacity: 0.08; } 50% { opacity: 0.12; } }
  @keyframes grid-glow { 0%, 100% { opacity: 0.02; } 50% { opacity: 0.05; } }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 8px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 6px; }

  /* Layout */
  .app { display: flex; flex-direction: column; min-height: 100vh; }
  .nav { 
    position: sticky; 
    top: 0; 
    z-index: 100; 
    background: linear-gradient(180deg, rgba(10,10,15,0.95) 0%, rgba(10,10,15,0.85) 100%);
    backdrop-filter: blur(20px); 
    border-bottom: 1px solid rgba(57,217,138,0.15);
    box-shadow: 0 8px 32px rgba(0,0,0,0.4);
  }
  .nav-inner { max-width: 1400px; margin: 0 auto; padding: 0 32px; display: flex; align-items: center; gap: 16px; height: 80px; }
  .logo { font-family: var(--font-cond); font-weight: 900; font-size: 38px; color: var(--orange); cursor: pointer; white-space: nowrap; flex-shrink: 0; }
  .nav-links { display: flex; align-items: center; gap: 8px; flex: 1; justify-content: center; }
  .nav-link { padding: 10px 20px; border-radius: 10px; font-size: 16px; font-weight: 600; color: var(--text2); cursor: pointer; transition: all 0.18s; border: none; background: none; }
  .nav-link:hover { color: var(--text); background: rgba(57,217,138,0.08); border-color: rgba(57,217,138,0.15); }
  .nav-link.active { color: var(--green); background: rgba(57,217,138,0.12); border: 1px solid rgba(57,217,138,0.25); }
  .nav-actions { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--orange), var(--yellow)); display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; color: #fff; cursor: pointer; flex-shrink: 0; }

  .page { 
    flex: 1; 
    position: relative;
    background: 
      linear-gradient(135deg, transparent 0%, rgba(244,124,32,0.06) 25%, transparent 50%, rgba(57,217,138,0.05) 75%, transparent 100%),
      radial-gradient(ellipse 120% 100% at 50% 0%, rgba(244,124,32,0.04) 0%, transparent 40%),
      radial-gradient(ellipse 100% 140% at 100% 100%, rgba(57,217,138,0.03) 0%, transparent 50%),
      linear-gradient(90deg, rgba(57,217,138,0.005) 1px, transparent 1px),
      linear-gradient(rgba(57,217,138,0.005) 1px, transparent 1px);
    background-size: 100% 100%, 100% 100%, 100% 100%, 60px 60px, 60px 60px;
    background-attachment: fixed, fixed, fixed, scroll, scroll;
    background-position: 0 0, 0 0, 0 0, 0 0, 0 0;
  }
  .container { max-width: 1400px; margin: 0 auto; padding: 0 32px; }
  .container-sm { max-width: 900px; margin: 0 auto; padding: 0 32px; }

  /* Buttons */
  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 14px 28px; border-radius: var(--radius); font-family: var(--font); font-size: 16px; font-weight: 700; cursor: pointer; transition: all 0.25s; border: none; text-decoration: none; white-space: nowrap; }
  .btn-primary { background: linear-gradient(135deg, var(--orange), #ff9040); color: #fff; }
  .btn-primary:hover { background: linear-gradient(135deg, #ff8f30, #ffaa50); transform: translateY(-2px); }
  .btn-ghost { background: rgba(57,217,138,0.08); color: var(--text2); border: 1px solid rgba(57,217,138,0.2); }
  .btn-ghost:hover { color: var(--text); border-color: rgba(57,217,138,0.4); background: rgba(57,217,138,0.15); }
  .btn-danger { background: rgba(247,95,95,0.15); color: var(--red); border: 1px solid rgba(247,95,95,0.25); }
  .btn-danger:hover { background: rgba(247,95,95,0.25); box-shadow: 0 0 16px rgba(247,95,95,0.15); }
  .btn-green { background: linear-gradient(135deg, var(--green), #4ee992); color: #0a1a12; box-shadow: 0 0 24px var(--green-glow); font-weight: 800; }
  .btn-green:hover { box-shadow: 0 0 32px var(--green-glow); transform: translateY(-2px); }
  .btn-sm { padding: 10px 18px; font-size: 14px; }
  .btn-lg { padding: 18px 36px; font-size: 18px; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none !important; }

  /* Cards */
  .card { 
    background: linear-gradient(135deg, rgba(20,24,41,0.8), rgba(26,31,53,0.6));
    border: 1px solid rgba(57,217,138,0.15); 
    border-radius: var(--radius-lg); 
    padding: 32px; 
    box-shadow: 0 8px 32px rgba(0,0,0,0.3), 0 0 20px rgba(57,217,138,0.05);
    backdrop-filter: blur(10px);
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }
  
  .card:hover { 
    border-color: rgba(57,217,138,0.25); 
    box-shadow: 0 12px 40px rgba(0,0,0,0.4), 0 0 32px rgba(57,217,138,0.1);
    transform: translateY(-4px);
  }
  
  .card-glow { 
    border-color: rgba(57,217,138,0.3); 
    box-shadow: 0 0 40px rgba(57,217,138,0.15), inset 0 0 40px rgba(57,217,138,0.04), 0 8px 32px rgba(0,0,0,0.3);
  }
  .glass { background: rgba(19,22,32,0.85); backdrop-filter: blur(12px); border: 1px solid rgba(57,217,138,0.15); border-radius: var(--radius-lg); }

  /* Badges */
  .badge { display: inline-flex; align-items: center; gap: 5px; padding: 6px 14px; border-radius: 24px; font-size: 14px; font-weight: 700; letter-spacing: 0.5px; transition: all 0.25s; }
  .badge-green { background: rgba(57,217,138,0.2); color: var(--green); border: 1px solid rgba(57,217,138,0.4); box-shadow: 0 0 16px rgba(57,217,138,0.15); }
  .badge-orange { background: rgba(244,124,32,0.15); color: var(--orange); border: 1px solid rgba(244,124,32,0.3); box-shadow: 0 0 12px rgba(244,124,32,0.1); }
  .badge-red { background: rgba(247,95,95,0.12); color: var(--red); border: 1px solid rgba(247,95,95,0.2); }
  .badge-gray { background: rgba(57,217,138,0.06); color: var(--text2); border: 1px solid rgba(57,217,138,0.12); }
  .badge-teal { background: rgba(0,212,204,0.1); color: var(--teal); border: 1px solid rgba(0,212,204,0.25); box-shadow: 0 0 12px rgba(0,212,204,0.12); }

  /* Forms */
  input, select, textarea { background: linear-gradient(135deg, rgba(22,23,42,0.8), rgba(31,34,64,0.6)); border: 1px solid rgba(57,217,138,0.15); border-radius: var(--radius); padding: 14px 18px; font-family: var(--font); font-size: 16px; color: var(--text); width: 100%; outline: none; transition: all 0.3s; }
  input:focus, select:focus, textarea:focus { border-color: rgba(57,217,138,0.4); background: linear-gradient(135deg, rgba(22,23,42,0.95), rgba(31,34,64,0.85)); box-shadow: 0 0 24px rgba(57,217,138,0.2), inset 0 0 16px rgba(57,217,138,0.08); }
  input::placeholder, textarea::placeholder { color: var(--text3); }
  select option { background: var(--bg3); }
  label { font-size: 15px; font-weight: 700; color: var(--text2); display: block; margin-bottom: 8px; letter-spacing: 0.3px; text-transform: uppercase; }

  /* Misc */
  .divider { height: 1px; background: var(--border); margin: 32px 0; }
  .section-label { font-family: var(--font-cond); font-size: 13px; font-weight: 800; letter-spacing: 2.5px; text-transform: uppercase; color: var(--orange); margin-bottom: 16px; }
  .heading-xl { font-family: var(--font-cond); font-size: clamp(48px, 6vw, 80px); font-weight: 900; line-height: 1; letter-spacing: -0.8px; }
  .heading-lg { font-family: var(--font-cond); font-size: clamp(32px, 4vw, 48px); font-weight: 850; letter-spacing: -0.5px; }
  .heading-md { font-family: var(--font-cond); font-size: 28px; font-weight: 800; letter-spacing: -0.3px; }
  .text-orange { color: var(--orange); }
  .text-green { color: var(--green); }
  .text-teal { color: var(--teal); }
  .text-muted { color: var(--text2); }
  .text-xs { font-size: 14px; }

  /* Grid */
  .grid-2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

  /* Toast */
  .toast { position: fixed; bottom: 32px; right: 32px; z-index: 9999; padding: 18px 28px; border-radius: var(--radius); font-size: 16px; font-weight: 600; max-width: 360px; animation: slideUp 0.3s ease; }
  .toast-success { background: rgba(57,217,138,0.15); border: 1px solid rgba(57,217,138,0.3); color: var(--green); }
  .toast-error { background: rgba(247,95,95,0.15); border: 1px solid rgba(247,95,95,0.3); color: var(--red); }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  /* Slot grid */
  .slot-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; }
  .slot { padding: 12px 6px; border-radius: 10px; text-align: center; font-size: 14px; font-weight: 700; cursor: pointer; border: 1px solid rgba(57,217,138,0.15); transition: all 0.2s; background: var(--bg3); }
  .slot-available { color: var(--text2); }
  .slot-available:hover { color: var(--green); border-color: rgba(57,217,138,0.35); background: rgba(57,217,138,0.08); box-shadow: 0 0 16px rgba(57,217,138,0.12); }
  .slot-selected { color: var(--orange); border-color: var(--orange); background: rgba(244,124,32,0.15); box-shadow: 0 0 12px rgba(244,124,32,0.2); }
  .slot-booked { color: var(--text3); background: var(--bg2); border-color: transparent; cursor: not-allowed; opacity: 0.5; text-decoration: line-through; }

  /* Stepper */
  .stepper { display: flex; align-items: center; gap: 0; margin-bottom: 48px; }
  .step { display: flex; align-items: center; gap: 12px; }
  .step-dot { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 800; flex-shrink: 0; border: 2px solid rgba(57,217,138,0.15); transition: all 0.3s; }
  .step-dot-done { background: linear-gradient(135deg, var(--green), #4ee992); color: #0a1a12; border-color: var(--green); box-shadow: 0 0 20px rgba(57,217,138,0.3); }
  .step-dot-active { background: linear-gradient(135deg, var(--orange), #ff9040); color: #fff; box-shadow: 0 0 24px var(--orange-glow); border-color: var(--orange); animation: glow-breathe 2s ease-in-out infinite; }
  .step-dot-pending { background: rgba(57,217,138,0.1); color: var(--text3); border-color: rgba(57,217,138,0.15); }
  .step-dot-inactive { background: var(--bg3); color: var(--text3); border: 2px solid var(--border); }
  .step-label { font-size: 14px; font-weight: 700; color: var(--text2); white-space: nowrap; }
  .step-label.active { color: var(--orange); }
  .step-connector { flex: 1; height: 2px; background: var(--border); margin: 0 12px; min-width: 24px; }

  /* Mobile nav */
  .mobile-nav { display: none; position: fixed; bottom: 0; left: 0; right: 0; background: rgba(10,11,13,0.96); backdrop-filter: blur(20px); border-top: 1px solid var(--border); padding: 12px 0 max(12px, env(safe-area-inset-bottom)); z-index: 100; }
  .mobile-nav-inner { display: flex; justify-content: space-around; }
  .mobile-nav-item { display: flex; flex-direction: column; align-items: center; gap: 4px; padding: 8px 14px; cursor: pointer; color: var(--text3); font-size: 12px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; border: none; background: none; transition: color 0.15s; }
  .mobile-nav-item.active { color: var(--orange); }
  .mobile-nav-icon { font-size: 20px; }

  @media (max-width: 768px) {
    .nav-links { display: none; }
    .mobile-nav { display: block; }
    .page { padding-bottom: 100px; }
    .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
    .hide-mobile { display: none !important; }
  }
  @media (max-width: 480px) {
    .container, .container-sm { padding: 0 20px; }
  }

  /* Masked Icons */
  .mask-tennis {
    -webkit-mask-image: url('/tennis.png');
    mask-image: url('/tennis.png');
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-position: center;
    mask-position: center;
    background-color: var(--orange);
    display: inline-block;
    flex-shrink: 0;
  }

  .mask-volleyball {
    -webkit-mask-image: url('/volleyball.png');
    mask-image: url('/volleyball.png');
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-position: center;
    mask-position: center;
    background-color: var(--orange);
    display: inline-block;
    flex-shrink: 0;
    vertical-align: middle;
  }
`;

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3500);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div className={`toast toast-${type}`}>{type === "success" ? <><img src="/tick.png" alt="success" style={{ width: 14, height: 14, verticalAlign: "middle" }} /> </> : "✕ "}{message}</div>;
}

// ─── NAV ──────────────────────────────────────────────────────────────────────
function Nav({ page, setPage, user, isLoggedIn, onLogout }) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const links = [
    { id: "home", label: "Home" },
    { id: "reserve", label: "Reserve" },
    { id: "reservations", label: "My Reservations" },
    { id: "facilities", label: "Facilities" },
  ];
  
  const handleProfileClick = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };
  
  const handleLogout = () => {
    setProfileDropdownOpen(false);
    onLogout();
  };
  
  const goToProfile = () => {
    setProfileDropdownOpen(false);
    setPage("profile");
  };

  return (
    <nav className="nav">
      <style>{`
        .profile-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          background: linear-gradient(135deg, rgba(20,24,41,0.98), rgba(26,31,53,0.95));
          border: 1px solid rgba(57,217,138,0.2);
          border-radius: var(--radius-lg);
          padding: 12px 0;
          min-width: 220px;
          margin-top: 8px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.5);
          backdrop-filter: blur(12px);
          z-index: 1000;
          animation: slideUp 0.2s ease;
        }
        .profile-dropdown-item {
          padding: 12px 20px;
          cursor: pointer;
          color: var(--text2);
          font-size: 15px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 12px;
          border: none;
          background: none;
          width: 100%;
          text-align: left;
          transition: all 0.2s;
          border-left: 3px solid transparent;
        }
        .profile-dropdown-item:hover {
          background: rgba(57,217,138,0.08);
          color: var(--text);
          border-left-color: var(--green);
        }
        .profile-dropdown-divider {
          height: 1px;
          background: rgba(57,217,138,0.1);
          margin: 8px 0;
        }
      `}</style>
      <div className="nav-inner">
        <div className="logo" onClick={() => setPage(isLoggedIn ? "home" : "landing")}>
          SPORTS2YOU
        </div>
        {isLoggedIn && (
          <div className="nav-links">
            {links.map(l => (
              <button key={l.id} className={`nav-link${page === l.id ? " active" : ""}`} onClick={() => setPage(l.id)}>{l.label}</button>
            ))}
          </div>
        )}
        <div className="nav-actions">
          {!isLoggedIn ? (
            <>
              <button className="btn btn-ghost btn-sm" onClick={() => setPage("login")}>Sign In</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setPage("signup")}>Sign Up</button>
            </>
          ) : (
            <div style={{ position: "relative" }}>
              <div className="avatar" onClick={handleProfileClick} title={user?.name} style={{ cursor: "pointer" }}>
                {user ? getInitials(user.name) : "?"}
              </div>
              {profileDropdownOpen && (
                <div className="profile-dropdown">
                  <div style={{ padding: "12px 20px", borderBottom: "1px solid rgba(57,217,138,0.1)", marginBottom: 4 }}>
                    <div style={{ fontWeight: 700, color: "var(--text)", fontSize: 15 }}>{user?.name}</div>
                    <div style={{ fontSize: 13, color: "var(--text3)", marginTop: 2 }}>{user?.email}</div>
                  </div>
                  <button className="profile-dropdown-item" onClick={goToProfile}>
                    <span>👤</span> My Profile
                  </button>
                  <button className="profile-dropdown-item" onClick={() => { setProfileDropdownOpen(false); setPage("reservations"); }}>
                    <span><img src="/list.png" alt="reservations" style={{ width: 16, height: 16, verticalAlign: "middle" }} /></span> My Reservations
                  </button>
                  <button className="profile-dropdown-item" onClick={() => { setProfileDropdownOpen(false); setPage("facilities"); }}>
                    <span><img src="/activity.png" alt="facilities" style={{ width: 16, height: 16, verticalAlign: "middle" }} /></span> Facilities
                  </button>
                  <div className="profile-dropdown-divider"></div>
                  <button className="profile-dropdown-item" onClick={handleLogout} style={{ color: "var(--red)" }}>
                    <span>🚪</span> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function MobileNav({ page, setPage }) {
  const items = [
    { id: "home", icon: "⌂", label: "Home" },
    { id: "reserve", icon: "＋", label: "Reserve" },
    { id: "reservations", icon: "◉", label: "Bookings" },
    { id: "facilities", icon: "◈", label: "Venues" },
    { id: "profile", icon: "◎", label: "Profile" },
  ];
  return (
    <div className="mobile-nav">
      <div className="mobile-nav-inner">
        {items.map(i => (
          <button key={i.id} className={`mobile-nav-item${page === i.id ? " active" : ""}`} onClick={() => setPage(i.id)}>
            <span className="mobile-nav-icon">{i.icon}</span>
            {i.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ setPage }) {
  return (
    <div className="page">
      <style>{`
        .hero { min-height: calc(100vh - 80px); display: flex; align-items: center; position: relative; overflow: hidden; }
        .hero::before { content: ""; position: absolute; inset: 0; background: radial-gradient(ellipse 120% 80% at 40% 20%, rgba(244,124,32,0.08) 0%, rgba(57,217,138,0.04) 40%, transparent 70%), radial-gradient(ellipse 100% 100% at 70% 60%, rgba(57,217,138,0.05) 0%, transparent 60%); pointer-events: none; z-index: 0; }
        .hero::after { content: ""; position: absolute; right: -200px; top: 50%; transform: translateY(-50%); width: 1000px; height: 1000px; background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bodyGrad2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23f47c20;stop-opacity:0.8"/><stop offset="100%" style="stop-color:%23ff9040;stop-opacity:0.6"/></linearGradient></defs><g transform="translate(600, 600) scale(0.7)" opacity="0.18"><ellipse cx="0" cy="0" rx="180" ry="200" fill="url(%23bodyGrad2)"/><ellipse cx="50" cy="80" rx="140" ry="130" fill="%23ffa855" opacity="0.6"/></g></svg>'); background-size: contain; background-repeat: no-repeat; background-position: center; opacity: 0.55; filter: blur(5px); z-index: 1; animation: temoc-float 14s ease-in-out infinite, temoc-glow-pulse 6s ease-in-out infinite; }
        .hero-bg { position: absolute; inset: 0; background: radial-gradient(ellipse 80% 60% at 60% 40%, rgba(244,124,32,0.05) 0%, transparent 60%), radial-gradient(ellipse 60% 80% at 20% 80%, rgba(57,217,138,0.04) 0%, transparent 50%); }
        .hero-grid { position: absolute; inset: 0; background-image: linear-gradient(rgba(57,217,138,0.01) 1px, transparent 1px), linear-gradient(90deg, rgba(57,217,138,0.01) 1px, transparent 1px); background-size: 80px 80px; }
        .hero-content { position: relative; z-index: 2; max-width: 800px; }
        .hero-eyebrow { display: inline-flex; align-items: center; gap: 10px; background: rgba(57,217,138,0.12); border: 1px solid rgba(57,217,138,0.3); border-radius: 24px; padding: 10px 20px; font-size: 14px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: var(--green); margin-bottom: 48px; margin-top: 12px; box-shadow: 0 0 20px rgba(57,217,138,0.15); }
        .hero-title { margin-bottom: 32px; line-height: 0.95; }
        .hero-sub { font-size: 22px; color: var(--text2); max-width: 560px; line-height: 1.8; margin-bottom: 44px; }
        .hero-ctas { display: flex; gap: 16px; flex-wrap: wrap; }
        .hero-stats { display: flex; gap: 60px; margin-top: 72px; flex-wrap: wrap; }
        .hero-stat-num { font-family: var(--font-cond); font-size: 36px; font-weight: 900; background: linear-gradient(135deg, var(--orange), var(--yellow)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
        .hero-stat-label { font-size: 14px; color: var(--text2); }
        .feature-section { padding: 120px 0; border-top: 1px solid rgba(57,217,138,0.1); }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; }
        .feature-card { background: var(--card); border: 1px solid rgba(57,217,138,0.12); border-radius: var(--radius-lg); padding: 36px; transition: all 0.3s; position: relative; overflow: hidden; }
        .feature-card::before { content: ""; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(57,217,138,0.05) 0%, transparent 100%); opacity: 0; transition: opacity 0.3s; }
        .feature-card:hover { border-color: rgba(57,217,138,0.25); box-shadow: 0 0 32px rgba(57,217,138,0.1), inset 0 0 24px rgba(57,217,138,0.03); transform: translateY(-4px); }
        .feature-card:hover::before { opacity: 1; }
        .feature-icon { width: 56px; height: 56px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 28px; margin-bottom: 20px; }
        .venue-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px; }
        .venue-card { background: var(--card); border: 1px solid rgba(57,217,138,0.12); border-radius: var(--radius-lg); padding: 36px; cursor: pointer; transition: all 0.3s; position: relative; overflow: hidden; }
        .venue-card::before { content: ""; position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, rgba(57,217,138,0), rgba(57,217,138,0.3), rgba(57,217,138,0)); opacity: 0; transition: opacity 0.3s; }
        .venue-card:hover { border-color: rgba(57,217,138,0.3); box-shadow: 0 0 40px rgba(57,217,138,0.12), inset 0 0 40px rgba(57,217,138,0.04); }
        .venue-card:hover::before { opacity: 1; }
        .venue-card-image-layer {
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0;
          transform: scale(1);
          transition: opacity 380ms ease-out, transform 520ms ease-out;
          pointer-events: none;
        }
        .venue-card-image-layer img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }
        .venue-card-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(150deg, rgba(6,9,14,0.62) 0%, rgba(6,9,14,0.42) 45%, rgba(6,9,14,0.68) 100%);
        }
        .venue-card-content {
          position: relative;
          z-index: 2;
        }
        .venue-card:hover .venue-card-image-layer {
          opacity: 1 !important;
          transform: scale(1.03);
        }
        @media (max-width: 768px) { 
          .features-grid { grid-template-columns: 1fr; } 
          .venue-grid { grid-template-columns: 1fr; } 
          .hero { min-height: auto; padding: 80px 0; }
          .hero::after { font-size: 400px; right: -80px; opacity: 0.06; }
        }
      `}</style>

      <div className="hero">
        <div className="hero-bg" /><div className="hero-grid" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span>◉</span> UTD Campus Recreation
            </div>
            <h1 className="heading-xl hero-title">
              Book Courts.<br />
              <span className="text-orange">Skip the</span><br />
              Conflicts.
            </h1>
            <p className="hero-sub">Sports2You is the smart reservation system for UTD student athletes. Reserve basketball, volleyball, and tennis courts across three facilities — no more showing up to a taken court.</p>
            <div className="hero-ctas">
              <button className="btn btn-primary btn-lg" onClick={() => setPage("signup")}>Get Started Free</button>
              <button className="btn btn-ghost btn-lg" onClick={() => setPage("login")}>Sign In</button>
            </div>
            <div className="hero-stats">
              <div><div className="hero-stat-num text-orange">18</div><div className="hero-stat-label">Reservable Courts</div></div>
              <div><div className="hero-stat-num text-green">3</div><div className="hero-stat-label">Facilities</div></div>
              <div><div className="hero-stat-num text-orange">18h</div><div className="hero-stat-label">Daily Availability</div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="feature-section">
        <div className="container">
          <div className="section-label" style={{ textAlign: "center", marginBottom: 16 }}>How it works</div>
          <h2 className="heading-lg" style={{ textAlign: "center", marginBottom: 40 }}>Three steps to your court</h2>
          <div className="features-grid">
            {[
              { icon: <img src="/calendar.png" alt="calendar" style={{ width: 48, height: 48 }} />, color: "transparent", title: "Pick your slot", desc: "Choose a facility, court, and time slot from real-time availability. No phone calls, no waiting." },
              { icon: <img src="/basketball.png" alt="basketball" style={{ width: 48, height: 48 }} />, color: "transparent", title: "Set your sport", desc: "Reserve for basketball, soccer, volleyball, tennis, indoor soccer, and more. Player minimums are enforced automatically." },
              { icon: <img src="/tick.png" alt="confirm" style={{ width: 48, height: 48 }} />, color: "transparent", title: "Confirm & play", desc: "Add your teammates, confirm your booking, and walk in with confidence. Court is yours." },
            ].map(f => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon" style={{ background: f.color }}>{f.icon}</div>
                <div className="heading-md" style={{ marginBottom: 10 }}>{f.title}</div>
                <p className="text-muted" style={{ fontSize: 14 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: "60px 0 100px" }}>
        <div className="container">
          <div className="section-label" style={{ marginBottom: 16 }}>Our Facilities</div>
          <h2 className="heading-lg" style={{ marginBottom: 32 }}>Three locations, eighteen courts</h2>
          <div className="venue-grid">
            {Object.values(FACILITIES).map(f => (
              <div key={f.id} className="venue-card" onClick={() => setPage("signup")}>
                {f.id === "aci" || f.id === "aco" || f.id === "recwest" ? (
                  <div className="venue-card-image-layer" aria-hidden>
                    <img
                      src={f.id === "aci" ? facilityIndoorHoverImage : f.id === "aco" ? facilityOutdoorHoverImage : facilityRecWestHoverImage}
                      alt=""
                      loading="lazy"
                    />
                    <div className="venue-card-image-overlay" />
                  </div>
                ) : null}
                <div className="venue-card-content">
                  <div style={{ marginBottom: 16 }}><img src={`/${f.image}`} alt={f.name} style={{ width: 40, height: 40 }} /></div>
                  <div className="heading-md" style={{ marginBottom: 8 }}>{f.name}</div>
                  <p className="text-muted" style={{ fontSize: 14, marginBottom: 16 }}>{f.description}</p>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {f.courts.map(c => (
                      <span key={c.id} className="badge badge-gray">{c.name}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── LOGIN PAGE ───────────────────────────────────────────────────────────────
function LoginPage({ setPage, setCurrentUser, onLogin, showToast }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const validateField = (id, value) => {
    if (id === "email" && !value.includes("@")) return "Enter a valid email";
    if (id === "password" && value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleBlur = (id) => {
    setTouched(t => ({ ...t, [id]: true }));
    const error = validateField(id, form[id]);
    setErrors(e => ({ ...e, [id]: error }));
  };

  const validate = () => {
    const e = {};
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "Password must be at least 6 characters";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setTouched({ email: true, password: true });
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      
      // Try to load user from storage
      const stored = initAuthFromStorage();
      if (stored && stored.email === form.email) {
        // Returning user
        setCurrentUser(stored);
        onLogin();
        setPage("home");
        showToast(`Welcome back, ${getFirstName(stored.name)}!`, "success");
      } else {
        // User not found - demo mode
        showToast("Demo mode: Login accepted. Create account for persistence.", "success");
        const tempUser = {
          id: "u1",
          name: "Demo User",
          email: form.email,
          studentId: "",
          phone: "",
          joinedDate: new Date().toISOString().split("T")[0],
          preferredSport: "basketball",
          favoriteLocations: ["ac"],
        };
        setCurrentUser(tempUser);
        onLogin();
        setPage("home");
      }
    }, 900);
  };

  return (
    <div className="page-auth" style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 80px)", padding: "40px 20px", overflowY: "auto" }}>
      <style>{`
        .page-auth { position: relative; }
        .page-auth::before { 
          content: ""; 
          position: absolute; 
          inset: 0; 
          background: radial-gradient(ellipse 150% 120% at 50% 0%, rgba(244,124,32,0.1) 0%, transparent 50%),
                      radial-gradient(ellipse 100% 150% at 100% 50%, rgba(57,217,138,0.08) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }
        .page-auth::after { 
          content: ""; 
          position: absolute; 
          right: -280px; 
          top: 50%; 
          transform: translateY(-50%); 
          width: 900px; 
          height: 900px; 
          background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="temocGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23f47c20;stop-opacity:0.7"/><stop offset="100%" style="stop-color:%23ff9040;stop-opacity:0.55"/></linearGradient></defs><g transform="translate(600, 600) scale(0.75)" opacity="0.22"><ellipse cx="0" cy="0" rx="180" ry="200" fill="url(%23temocGrad)"/><circle cx="-70" cy="-90" r="22" fill="%23ffa855" opacity="0.7"/><circle cx="50" cy="-110" r="28" fill="%23ffa855" opacity="0.65"/></g></svg>');
          background-size: contain; 
          background-repeat: no-repeat; 
          background-position: center;
          opacity: 0.58;
          filter: blur(5px);
          z-index: 1;
          animation: temoc-float 14s ease-in-out infinite, temoc-glow-pulse 6s ease-in-out infinite;
        }
        .auth-form { position: relative; z-index: 2; width: 100%; max-width: 620px; my: auto; }
      `}</style>

      <div className="auth-form" style={{ width: "100%", maxWidth: 620, margin: "auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="text-orange" style={{ fontSize: 48, display: "block", marginBottom: 24, fontFamily: "var(--font-cond)", fontWeight: 900 }}>SPORTS2YOU</div>
          <p className="text-muted" style={{ fontSize: 18, fontWeight: 500 }}>Sign in to your UTD student account</p>
        </div>
        <div className="card card-glow" style={{ padding: 48, background: "linear-gradient(135deg, rgba(57,217,138,0.06) 0%, rgba(20,24,32,1) 60%)" }}>
          <div style={{ marginBottom: 36 }}>
            <label style={{ fontSize: 16, marginBottom: 12, fontWeight: 700, display: "block" }}>UTD Email</label>
            <input type="email" placeholder="netid@utdallas.edu" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} onBlur={() => handleBlur("email")} style={{ fontSize: 18, padding: "16px 20px", width: "100%", borderColor: touched.email ? (errors.email ? "var(--red)" : "var(--green)") : "var(--border)" }} />
            {touched.email && errors.email && <p style={{ color: "var(--red)", fontSize: 14, marginTop: 8, fontWeight: 600 }}>✕ {errors.email}</p>}
          </div>
          <div style={{ marginBottom: 44 }}>
            <label style={{ fontSize: 16, marginBottom: 12, fontWeight: 700, display: "block" }}>Password</label>
            <input type="password" placeholder="••••••••" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} onBlur={() => handleBlur("password")} style={{ fontSize: 18, padding: "16px 20px", width: "100%", borderColor: touched.password ? (errors.password ? "var(--red)" : "var(--green)") : "var(--border)" }} />
            {touched.password && errors.password && <p style={{ color: "var(--red)", fontSize: 14, marginTop: 8, fontWeight: 600 }}>✕ {errors.password}</p>}
          </div>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginBottom: 28, fontSize: 18, padding: "18px 32px", fontWeight: 800 }} onClick={handleSubmit} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
          <div style={{ textAlign: "center", fontSize: 14, color: "var(--text3)", fontWeight: 500, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border2)" }} />
            <span>New to Sports2You?</span>
            <div style={{ flex: 1, height: 1, background: "var(--border2)" }} />
          </div>
          <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", fontSize: 16, padding: "16px 24px", fontWeight: 700 }} onClick={() => setPage("signup")}>
            Create Account
          </button>
        </div>
        <p style={{ textAlign: "center", fontSize: 14, color: "var(--text3)", marginTop: 40, fontWeight: 500 }}>Demo: any email + 6+ char password</p>
      </div>
    </div>
  );
}

// ─── SIGNUP PAGE ──────────────────────────────────────────────────────────────
function SignupPage({ setPage, setCurrentUser, onLogin, showToast }) {
  const [form, setForm] = useState({ name: "", email: "", studentId: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  const validateField = (id, value) => {
    if (id === "name" && !value.trim()) return "Name is required";
    if (id === "email" && !value.includes("@")) return "Enter a valid email";
    if (id === "password" && value.length < 6) return "Minimum 6 characters";
    if (id === "confirm" && value !== form.password) return "Passwords don't match";
    return "";
  };

  const handleBlur = (id) => {
    setTouched(t => ({ ...t, [id]: true }));
    const error = validateField(id, form[id]);
    setErrors(e => ({ ...e, [id]: error }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (form.password !== form.confirm) e.confirm = "Passwords don't match";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setTouched({ name: true, email: true, studentId: true, password: true, confirm: true });
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      
      // Create new user
      const newUser = {
        id: "u1",
        name: form.name,
        email: form.email,
        studentId: form.studentId || "",
        phone: "",
        joinedDate: new Date().toISOString().split("T")[0],
        preferredSport: "basketball",
        favoriteLocations: ["ac"],
      };
      
      // Save to localStorage
      saveUserToStorage(newUser);
      setCurrentUser(newUser);
      onLogin();
      setPage("home");
      showToast(`Welcome, ${getFirstName(form.name)}!`, "success");
    }, 900);
  };

  return (
    <div className="page-auth" style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 80px)", padding: "40px 20px", overflowY: "auto" }}>
      <style>{`
        .page-auth::before { 
          content: ""; 
          position: absolute; 
          inset: 0; 
          background: radial-gradient(ellipse 150% 120% at 50% 0%, rgba(244,124,32,0.1) 0%, transparent 50%),
                      radial-gradient(ellipse 100% 150% at 100% 50%, rgba(57,217,138,0.08) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }
        .page-auth::after { 
          content: ""; 
          position: absolute; 
          left: -280px; 
          bottom: -100px; 
          width: 900px; 
          height: 900px; 
          background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="temocGrad2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23f47c20;stop-opacity:0.7"/><stop offset="100%" style="stop-color:%23ff9040;stop-opacity:0.55"/></linearGradient></defs><g transform="translate(600, 600) scale(0.75) scaleX(-1)" opacity="0.22"><ellipse cx="0" cy="0" rx="180" ry="200" fill="url(%23temocGrad2)"/><circle cx="-70" cy="-90" r="22" fill="%23ffa855" opacity="0.7"/><circle cx="50" cy="-110" r="28" fill="%23ffa855" opacity="0.65"/></g></svg>'); 
          background-size: contain; 
          background-repeat: no-repeat; 
          background-position: center;
          opacity: 0.58;
          filter: blur(5px);
          z-index: 1;
          animation: temoc-float 14s ease-in-out infinite, temoc-glow-pulse 6s ease-in-out infinite;
        }
        .auth-form { position: relative; z-index: 2; width: 100%; max-width: 660px; margin: auto; }
      `}</style>

      <div className="auth-form" style={{ width: "100%", maxWidth: 660, margin: "auto" }}>
        <div style={{ textAlign: "center", marginBottom: 60 }}>
          <div className="text-orange" style={{ fontSize: 48, display: "block", marginBottom: 24, fontFamily: "var(--font-cond)", fontWeight: 900 }}>SPORTS2YOU</div>
          <p className="text-muted" style={{ fontSize: 18, fontWeight: 500 }}>Create your UTD recreation account</p>
        </div>
        <div className="card card-glow" style={{ padding: 48, background: "linear-gradient(135deg, rgba(57,217,138,0.06) 0%, rgba(20,24,32,1) 60%)" }}>
          <div className="grid-2" style={{ gap: "24px 24px", marginBottom: 20 }}>
            <div style={{ marginBottom: 0 }}>
              <label style={{ fontSize: 16, marginBottom: 12, fontWeight: 700, display: "block" }}>Full Name</label>
              <input placeholder="Your full name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} onBlur={() => handleBlur("name")} style={{ fontSize: 16, padding: "14px 18px", width: "100%", borderColor: touched.name ? (errors.name ? "var(--red)" : "var(--green)") : "var(--border)" }} />
              {touched.name && errors.name && <p style={{ color: "var(--red)", fontSize: 13, marginTop: 6, fontWeight: 600 }}>✕ {errors.name}</p>}
            </div>
            <div style={{ marginBottom: 0 }}>
              <label style={{ fontSize: 16, marginBottom: 12, fontWeight: 700, display: "block" }}>Student ID (optional)</label>
              <input placeholder="2xxxxxxx" value={form.studentId} onChange={e => setForm(f => ({ ...f, studentId: e.target.value }))} style={{ fontSize: 16, padding: "14px 18px", width: "100%" }} />
            </div>
          </div>
          <div style={{ marginTop: 32 }}>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 16, marginBottom: 12, fontWeight: 700, display: "block" }}>UTD Email</label>
              <input type="email" placeholder="netid@utdallas.edu" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} onBlur={() => handleBlur("email")} style={{ fontSize: 16, padding: "14px 18px", width: "100%", borderColor: touched.email ? (errors.email ? "var(--red)" : "var(--green)") : "var(--border)" }} />
              {touched.email && errors.email && <p style={{ color: "var(--red)", fontSize: 13, marginTop: 6, fontWeight: 600 }}>✕ {errors.email}</p>}
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ fontSize: 16, marginBottom: 12, fontWeight: 700, display: "block" }}>Password</label>
              <input type="password" placeholder="Minimum 6 characters" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} onBlur={() => handleBlur("password")} style={{ fontSize: 16, padding: "14px 18px", width: "100%", borderColor: touched.password ? (errors.password ? "var(--red)" : "var(--green)") : "var(--border)" }} />
              {touched.password && errors.password && <p style={{ color: "var(--red)", fontSize: 13, marginTop: 6, fontWeight: 600 }}>✕ {errors.password}</p>}
            </div>
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 16, marginBottom: 12, fontWeight: 700, display: "block" }}>Confirm Password</label>
              <input type="password" placeholder="Repeat password" value={form.confirm} onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))} onBlur={() => handleBlur("confirm")} style={{ fontSize: 16, padding: "14px 18px", width: "100%", borderColor: touched.confirm ? (errors.confirm ? "var(--red)" : "var(--green)") : "var(--border)" }} />
              {touched.confirm && errors.confirm && <p style={{ color: "var(--red)", fontSize: 13, marginTop: 6, fontWeight: 600 }}>✕ {errors.confirm}</p>}
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginBottom: 28, fontSize: 18, padding: "18px 32px", fontWeight: 800 }} onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
          <div style={{ textAlign: "center", fontSize: 14, color: "var(--text3)", fontWeight: 500, marginBottom: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: "var(--border2)" }} />
            <span>Already a member?</span>
            <div style={{ flex: 1, height: 1, background: "var(--border2)" }} />
          </div>
          <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", fontSize: 16, padding: "16px 24px", fontWeight: 700 }} onClick={() => setPage("login")}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD / HOME ─────────────────────────────────────────────────────────
function HomePage({ setPage, setReserveDefaults, bookings, user, isFirstLogin }) {
  const today = getTodayStr();
  const upcoming = bookings.filter(b => b.owner === "u1" && b.status === "upcoming").slice(0, 3);

  const quickStats = [
    { label: "Upcoming", value: bookings.filter(b => b.owner === "u1" && b.status === "upcoming").length, color: "var(--orange)", icon: <img src="/calendar.png" alt="calendar" style={{ width: 40, height: 40 }} /> },
    { label: "Total Booked", value: bookings.filter(b => b.owner === "u1").length, color: "var(--green)", icon: <img src="/basketball.png" alt="basketball" style={{ width: 40, height: 40 }} /> },
    { label: "Available Courts", value: Object.values(FACILITIES).flatMap(f => f.courts).length, color: "var(--orange)", icon: <img src="/activity.png" alt="courts" style={{ width: 40, height: 40 }} /> },
  ];

  const getFacilityHoverImage = (f) =>
    f.id === "aci"
      ? facilityIndoorHoverImage
      : f.id === "aco"
        ? facilityOutdoorHoverImage
        : f.id === "recwest"
          ? facilityRecWestHoverImage
          : null;

  return (
    <div className="page" style={{ position: "relative" }}>
      <style>{`
        .home-hero { min-height: 500px; position: relative; overflow: hidden; padding: 80px 0; display: flex; align-items: center; }
        .home-hero::before { 
          content: ""; 
          position: absolute; 
          inset: 0; 
          background: radial-gradient(ellipse 100% 80% at 50% 0%, rgba(244,124,32,0.12) 0%, transparent 50%), 
                      radial-gradient(ellipse 60% 100% at 100% 100%, rgba(57,217,138,0.08) 0%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }
        .home-hero::after { 
          content: ""; 
          position: absolute; 
          right: -150px; 
          top: 50%; 
          transform: translateY(-50%); 
          width: 800px; 
          height: 800px; 
          background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23f47c20;stop-opacity:0.8"/><stop offset="100%" style="stop-color:%23ff9040;stop-opacity:0.6"/></linearGradient></defs><g transform="translate(600, 600) scale(0.7)" opacity="0.18"><ellipse cx="0" cy="0" rx="180" ry="200" fill="url(%23bodyGrad)"/><ellipse cx="50" cy="80" rx="140" ry="130" fill="%23ffa855" opacity="0.6"/></g></svg>'); 
          background-size: contain; 
          background-repeat: no-repeat; 
          background-position: center;
          opacity: 0.55;
          filter: blur(5px);
          z-index: 1;
          animation: temoc-float 14s ease-in-out infinite, temoc-glow-pulse 6s ease-in-out infinite;
        }
        .home-hero-content { position: relative; z-index: 1; }
        .stat-card { !important }
        .home-facility-card {
          position: relative;
          overflow: hidden;
        }
        .home-facility-card-image-layer {
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0;
          transform: scale(1);
          transition: opacity 320ms ease-out, transform 420ms ease-out;
          pointer-events: none;
        }
        .home-facility-card-image-layer img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }
        .home-facility-card-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(150deg, rgba(6,9,14,0.85) 0%, rgba(6,9,14,0.6) 40%, rgba(6,9,14,0.9) 100%);
        }
        .home-facility-card-content {
          position: relative;
          z-index: 1;
        }
        .home-facility-card:hover .home-facility-card-image-layer {
          opacity: 1;
          transform: scale(1.02);
        }
      `}</style>

      <div className="home-hero">
        <div className="container" style={{ position: "relative", zIndex: 2 }}>
          <div style={{ marginBottom: 48 }}>
            <p className="text-muted" style={{ marginBottom: 8, fontSize: 15 }}>
              {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
            </p>
            <h1 className="heading-xl" style={{ marginBottom: 12 }}>
              {isFirstLogin ? "Welcome" : "Welcome back"}, <span className="text-orange">{user ? getFirstName(user.name) : "there"}.</span>
            </h1>
            <p className="text-muted" style={{ fontSize: 18, maxWidth: 600 }}>
              Check your upcoming reservations or reserve a new court instantly.
            </p>
          </div>

          {/* Quick Reserve CTA */}
          <div className="card card-glow" style={{ background: "linear-gradient(135deg, rgba(244,124,32,0.1), rgba(57,217,138,0.05))", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 24, flexWrap: "wrap", maxWidth: 700 }}>
            <div>
              <div className="heading-md" style={{ marginBottom: 4 }}>Ready to play?</div>
              <p className="text-muted" style={{ fontSize: 15 }}>Find an open court and book instantly</p>
            </div>
            <button className="btn btn-primary btn-lg" onClick={() => setPage("reserve")}>Reserve Court →</button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div className="grid-3" style={{ gap: 24, marginBottom: 60 }}>
          {quickStats.map(s => (
            <div key={s.label} className="card" style={{ textAlign: "center" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: 44, fontFamily: "var(--font-cond)", fontWeight: 900, color: s.color, marginBottom: 6 }}>
                {s.value}
              </div>
              <div className="text-muted" style={{ fontSize: 15 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div className="grid-2" style={{ gap: 32 }}>
          {/* Upcoming reservations */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div className="heading-md"><img src="/calendar.png" alt="calendar" style={{ width: 28, height: 28, verticalAlign: "middle" }} /> Upcoming Bookings</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setPage("reservations")}>See all →</button>
            </div>
            {upcoming.length === 0 ? (
              <div className="card" style={{ textAlign: "center", padding: 40 }}>
                <p className="text-muted" style={{ fontSize: 16, marginBottom: 12 }}>No upcoming reservations</p>
                <button className="btn btn-primary btn-sm" onClick={() => setPage("reserve")}>Book a court</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {upcoming.map(b => <BookingCard key={b.id} booking={b} compact />)}
              </div>
            )}
          </div>

          {/* Facility overview */}
          <div>
            <div className="heading-md" style={{ marginBottom: 24 }}><img src="/activity.png" alt="facilities" style={{ width: 28, height: 28, verticalAlign: "middle" }} /> Facilities</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {Object.values(FACILITIES).map(f => (
                <div 
                  key={f.id} 
                  className="card home-facility-card" 
                  style={{ cursor: "pointer", transition: "all 0.25s" }}
                  onClick={() => { setPage("facility"); setReserveDefaults(d => ({ ...d, facilityId: f.id })); }}
                >
                  {getFacilityHoverImage(f) ? (
                    <div className="home-facility-card-image-layer" aria-hidden>
                      <img src={getFacilityHoverImage(f)} alt="" loading="lazy" />
                      <div className="home-facility-card-image-overlay" />
                    </div>
                  ) : null}
                  <div className="home-facility-card-content">
                    <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 16, flex: 1 }}>
                        <div><img src={`/${f.image}`} alt={f.name} style={{ width: 44, height: 44 }} /></div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 4 }}>{f.name}</div>
                          <div className="text-muted" style={{ fontSize: 14 }}>
                            {f.courts.length} courts • Basketball & Soccer
                          </div>
                        </div>
                      </div>
                      <span className="badge badge-green" style={{ whiteSpace: "nowrap" }}>Open</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── BOOKING CARD ─────────────────────────────────────────────────────────────
function BookingCard({ booking, compact, onCancel }) {
  const court = getCourtById(booking.courtId);
  if (!court) return null;
  const isUpcoming = booking.status === "upcoming";

  return (
    <div className="card" style={{ position: "relative", background: isUpcoming ? "linear-gradient(135deg, rgba(57,217,138,0.06), rgba(0,212,204,0.03))" : "linear-gradient(135deg, rgba(100,110,120,0.06), rgba(50,60,70,0.03))", borderColor: isUpcoming ? "rgba(57,217,138,0.2)" : "var(--border)", transition: "all 0.25s" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
            <div style={{ fontSize: 28, color: "var(--orange)" }}>
              {booking.sport === "basketball" ? <img src="/basketball.png" alt="basketball" style={{ width: 28, height: 28 }} /> : 
               booking.sport === "soccer" ? <img src="/soccer.png" alt="soccer" style={{ width: 28, height: 28 }} /> :
               booking.sport === "indoor-soccer" ? <img src="/soccer.png" alt="indoor-soccer" style={{ width: 28, height: 28 }} /> :
               booking.sport === "indoor-volleyball" ? <div className="mask-volleyball" style={{ width: 28, height: 28 }} /> : 
               booking.sport === "sand-volleyball" ? <div className="mask-volleyball" style={{ width: 28, height: 28 }} /> :
               booking.sport === "tennis" ? <div className="mask-tennis" style={{ width: 28, height: 28 }} /> : <span>⚽</span>}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 2 }}>{court.name}</div>
              <div className="text-muted" style={{ fontSize: 13 }}>
                {court.facility.short} · {formatDate(booking.date)}
              </div>
            </div>
            <span className={`badge ${isUpcoming ? "badge-green" : "badge-gray"}`} style={{ marginLeft: "auto" }}>
              {isUpcoming ? <><img src="/tick.png" alt="confirmed" style={{ width: 14, height: 14, verticalAlign: "middle" }} /> Confirmed</> : <><img src="/tick.png" alt="played" style={{ width: 14, height: 14, verticalAlign: "middle" }} /> Played</>}
            </span>
          </div>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border2)" }}>
            <div>
              <div className="text-muted" style={{ fontSize: 12, marginBottom: 4 }}>TIME</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{formatHour(booking.startHour)} – {formatHour(booking.endHour)}</div>
            </div>
            <div>
              <div className="text-muted" style={{ fontSize: 12, marginBottom: 4 }}>PLAYERS</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>
                {booking.courtType ? `${booking.courtType === "full" ? "Full" : "Half"} Court · ` : ""}{booking.players} athlete{booking.players !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>

        {!compact && isUpcoming && onCancel && (
          <button className="btn btn-ghost btn-md" onClick={() => onCancel(booking.id)} style={{ color: "var(--red)", borderColor: "rgba(255,100,110,0.3)", padding: "12px 16px", fontSize: 14 }}>
            × Cancel
          </button>
        )}
      </div>
    </div>
  );
}

// ─── MY RESERVATIONS ──────────────────────────────────────────────────────────
function ReservationsPage({ bookings, onCancel }) {
  const [tab, setTab] = useState("upcoming");
  const myBookings = bookings.filter(b => b.owner === "u1");
  const shown = myBookings.filter(b => b.status === tab);
  const upcoming = myBookings.filter(b => b.status === "upcoming").length;
  const completed = myBookings.filter(b => b.status === "completed").length;

  return (
    <div className="page" style={{ position: "relative", padding: "60px 0" }}>
      <style>{`
        .reservations-hero { position: relative; padding: 40px 0 50px 0; overflow: hidden; }
        .reservations-hero::before { 
          content: ""; 
          position: absolute; 
          inset: 0; 
          background: radial-gradient(ellipse 150% 120% at 50% 0%, rgba(57,217,138,0.08) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }
        .reservations-hero::after {
          content: "";
          position: absolute;
          left: -180px;
          bottom: -100px;
          width: 650px;
          height: 650px;
          background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="temocReserv" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23f47c20;stop-opacity:0.6"/><stop offset="100%" style="stop-color:%23ff9040;stop-opacity:0.45"/></linearGradient></defs><g transform="translate(600, 600) scale(0.5) scaleX(-1)" opacity="0.2"><ellipse cx="0" cy="0" rx="180" ry="200" fill="url(%23temocReserv)"/><ellipse cx="50" cy="80" rx="140" ry="130" fill="%23ffa855" opacity="0.4"/></g></svg>');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          opacity: 0.52;
          filter: blur(5px);
          z-index: 1;
          animation: temoc-float 14s ease-in-out infinite, temoc-glow-pulse 6s ease-in-out infinite;
          pointer-events: none;
        }
        .tab-bar { display: flex; gap: 8; background: linear-gradient(135deg, rgba(244,124,32,0.03), rgba(57,217,138,0.03)); border: 1px solid var(--border2); border-radius: 12px; padding: 8px; margin-bottom: 32px; }
        .tab-button { flex: 1; padding: 14px 20px; border-radius: 10px; font-size: 16; font-weight: 700; cursor: pointer; border: 2px solid transparent; background: transparent; color: var(--text2); transition: all 0.2s; }
        .tab-button.active { background: linear-gradient(135deg, rgba(57,217,138,0.15), rgba(0,212,204,0.1)); border-color: var(--green); color: var(--text); }
        .empty-state { text-align: center; padding: 80px 40px; }
      `}</style>

      <div className="reservations-hero">
        <div className="container-sm" style={{ position: "relative", zIndex: 1 }}>
          <h1 className="heading-lg" style={{ marginBottom: 8 }}><img src="/calendar.png" alt="calendar" style={{ width: 40, height: 40, verticalAlign: "middle" }} /> My Reservations</h1>
          <p className="text-muted" style={{ marginBottom: 0, fontSize: 16 }}>Manage your court bookings and cancel if needed.</p>
        </div>
      </div>

      <div className="container-sm">
        <div className="tab-bar">
          {["upcoming", "completed"].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`tab-button ${tab === t ? "active" : ""}`}>
              {t === "upcoming" ? <img src="/list.png" alt="upcoming" style={{ width: 14, height: 14, verticalAlign: "middle" }} /> : <img src="/tick.png" alt="completed" style={{ width: 14, height: 14, verticalAlign: "middle" }} />} {t.charAt(0).toUpperCase() + t.slice(1)} ({t === "upcoming" ? upcoming : completed})
            </button>
          ))}
        </div>

        {shown.length === 0 ? (
          <div className="card empty-state">
            <div style={{ fontSize: 64, marginBottom: 16 }}>{tab === "upcoming" ? "📭" : "🏆"}</div>
            <p className="text-muted" style={{ marginBottom: 20, fontSize: 18 }}>
              {tab === "upcoming" ? "No upcoming reservations yet" : "No completed reservations yet"}
            </p>
            <p className="text-muted" style={{ fontSize: 15, marginBottom: 24 }}>
              {tab === "upcoming" ? "Reserve your next court and start booking!" : "Your completed games will appear here"}
            </p>
            {tab === "upcoming" && (
              <button className="btn btn-primary">Reserve a Court</button>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {shown.map(b => <BookingCard key={b.id} booking={b} onCancel={tab === "upcoming" ? onCancel : null} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── FACILITIES PAGE ──────────────────────────────────────────────────────────
function FacilitiesPage({ setPage, setReserveDefaults }) {
  return (
    <div className="page" style={{ position: "relative", padding: "60px 0" }}>
      <style>{`
        .facilities-hero { position: relative; padding: 40px 0 50px 0; background: radial-gradient(ellipse 150% 100% at 50% 0%, rgba(244,124,32,0.08) 0%, transparent 50%); overflow: hidden; }
        .facilities-hero::after {
          content: "";
          position: absolute;
          right: -150px;
          bottom: -100px;
          width: 600px;
          height: 600px;
          background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="temocFacil" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23f47c20;stop-opacity:0.6"/><stop offset="100%" style="stop-color:%23ff9040;stop-opacity:0.45"/></linearGradient></defs><g transform="translate(600, 600) scale(0.5)" opacity="0.2"><ellipse cx="0" cy="0" rx="180" ry="200" fill="url(%23temocFacil)"/><ellipse cx="50" cy="80" rx="140" ry="130" fill="%23ffa855" opacity="0.4"/></g></svg>');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          opacity: 0.50;
          filter: blur(5px);
          z-index: 1;
          animation: temoc-float 14s ease-in-out infinite, temoc-glow-pulse 6s ease-in-out infinite;
          pointer-events: none;
        }
        .facility-card-image-layer {
          position: absolute;
          inset: 0;
          z-index: 0;
          opacity: 0;
          transform: scale(1);
          transition: opacity 360ms ease-out, transform 420ms ease-out;
          pointer-events: none;
        }
        .facility-card-image-layer img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }
        .facility-card-image-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(160deg, rgba(8,10,14,0.7) 0%, rgba(8,10,14,0.5) 45%, rgba(8,10,14,0.75) 100%);
        }
        .facility-card-content-layer {
          position: relative;
          z-index: 1;
        }
        .facility-card-hover:hover .facility-card-image-layer {
          opacity: 1;
          transform: scale(1.02);
        }
      `}</style>

      <div className="facilities-hero">
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <h1 className="heading-lg" style={{ marginBottom: 8 }}><img src="/activity.png" alt="facilities" style={{ width: 40, height: 40, verticalAlign: "middle" }} /> UTD Facilities</h1>
          <p className="text-muted" style={{ marginBottom: 0, fontSize: 16 }}>Explore all courts and find your next game.</p>
        </div>
      </div>

      <div className="container">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 32 }}>
          {Object.values(FACILITIES).map(f => (
            <FacilityCard key={f.id} facility={f} onView={() => { setReserveDefaults(d => ({ ...d, facilityId: f.id })); setPage("facility"); }} onReserve={() => { setReserveDefaults(d => ({ ...d, facilityId: f.id })); setPage("reserve"); }} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FacilityCard({ facility: f, onView, onReserve }) {
  const hoverImage = f.id === "aci"
    ? facilityIndoorHoverImage
    : f.id === "aco"
      ? facilityOutdoorHoverImage
      : f.id === "recwest"
        ? facilityRecWestHoverImage
        : null;

  return (
    <div className="card facility-card-hover" style={{ display: "flex", flexDirection: "column", gap: 0, background: "linear-gradient(135deg, rgba(244,124,32,0.04), rgba(57,217,138,0.04))" }}>
      {hoverImage ? (
        <div className="facility-card-image-layer" aria-hidden>
          <img src={hoverImage} alt="" loading="lazy" />
          <div className="facility-card-image-overlay" />
        </div>
      ) : null}
      <div className="facility-card-content-layer">
      <div style={{ display: "flex", alignItems: "center", gap: 18, marginBottom: 24 }}>
        <div><img src={`/${f.image}`} alt={f.name} style={{ width: 56, height: 56 }} /></div>
        <div style={{ flex: 1 }}>
          <div className="heading-md" style={{ marginBottom: 4 }}>{f.name}</div>
          <div className="text-muted" style={{ fontSize: 14, marginBottom: 8 }}>📍 {f.address}</div>
          <div style={{ display: "flex", gap: 6 }}>
            <span className="badge badge-green" style={{ fontSize: 11 }}>Open</span>
            <span className="badge badge-orange" style={{ fontSize: 11 }}><img src="/clock.png" alt="courts" style={{ width: 11, height: 11, verticalAlign: "middle" }} /> {f.courts.length} courts</span>
          </div>
        </div>
      </div>
      <p className="text-muted" style={{ fontSize: 15, marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid var(--border2)" }}>{f.description}</p>
      
      <div style={{ marginBottom: 24 }}>
        <div className="section-label" style={{ marginBottom: 12 }}>Courts</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {f.courts.map(c => (
            <div key={c.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: "rgba(244,124,32,0.03)", borderRadius: "8px", borderLeft: "3px solid var(--green)" }}>
              <span style={{ fontSize: 15, fontWeight: 600 }}>{c.name}</span>
              <div style={{ display: "flex", gap: 6 }}>
                {c.sports.map(s => (
                  <span key={s} className="badge badge-orange" style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--orange)" }}>
                    {s === "basketball" ? <img src="/basketball.png" alt="basketball" style={{ width: 14, height: 14, verticalAlign: "middle" }} /> : 
                     s === "soccer" ? <img src="/soccer.png" alt="soccer" style={{ width: 14, height: 14, verticalAlign: "middle" }} /> :
                     s === "indoor-soccer" ? <img src="/soccer.png" alt="indoor-soccer" style={{ width: 14, height: 14, verticalAlign: "middle" }} /> :
                     s === "indoor-volleyball" ? <div className="mask-volleyball" style={{ width: 14, height: 14, display: "inline-block", verticalAlign: "middle" }} /> : 
                     s === "sand-volleyball" ? <div className="mask-volleyball" style={{ width: 14, height: 14, display: "inline-block", verticalAlign: "middle" }} /> :
                     s === "tennis" ? <div className="mask-tennis" style={{ width: 14, height: 14, display: "inline-block", verticalAlign: "middle" }} /> : "⚽"}
                    {s.length > 12 ? s.substring(0, 10) + ".." : s}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div className="section-label" style={{ marginBottom: 12 }}>Hours Today</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--green)" }}><img src="/clock.png" alt="clock" style={{ width: 15, height: 15, verticalAlign: "middle" }} /> {f.hours[new Date().toLocaleDateString("en-US", { weekday: "long" })]}</div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: "auto" }}>
        <button className="btn btn-ghost" style={{ flex: 1, justifyContent: "center", fontSize: 15 }} onClick={onView}><img src="/list.png" alt="details" style={{ width: 15, height: 15, verticalAlign: "middle" }} /> Details</button>
        <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center", fontSize: 15 }} onClick={onReserve}><img src="/clock.png" alt="reserve" style={{ width: 15, height: 15, verticalAlign: "middle" }} /> Reserve</button>
      </div>
      </div>
    </div>
  );
}

// ─── FACILITY DETAIL PAGE ─────────────────────────────────────────────────────
function FacilityDetailPage({ facilityId, setPage, setReserveDefaults }) {
  const f = FACILITIES[facilityId] || FACILITIES.aci;
  return (
    <div className="page" style={{ padding: "60px 0" }}>
      <div className="container-sm">
        <button className="btn btn-ghost btn-sm" style={{ marginBottom: 32 }} onClick={() => setPage("facilities")}>← Back to Facilities</button>
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 40 }}>
          <div><img src={`/${f.image}`} alt={f.name} style={{ width: 80, height: 80 }} /></div>
          <div>
            <h1 className="heading-lg" style={{ marginBottom: 8 }}>{f.name}</h1>
            <p className="text-muted" style={{ fontSize: 18 }}>{f.address}</p>
          </div>
        </div>
        <p style={{ marginBottom: 40, lineHeight: 1.8, fontSize: 18 }}>{f.description}</p>

        <div className="card" style={{ marginBottom: 28 }}>
          <div className="section-label" style={{ marginBottom: 20 }}>Operating Hours</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {Object.entries(f.hours).map(([day, hours]) => (
              <div key={day} style={{ display: "flex", justifyContent: "space-between", fontSize: 16 }}>
                <span style={{ fontWeight: 700 }}>{day}</span>
                <span className="text-muted">{hours}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ marginBottom: 28 }}>
          <div className="section-label" style={{ marginBottom: 20 }}>Courts & Sports</div>
          {f.courts.map(c => (
            <div key={c.id} style={{ padding: "18px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontWeight: 800, marginBottom: 10, fontSize: 18 }}>{c.name}</div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {c.sports.includes("basketball") && (
                  <div>
                    <span className="badge badge-orange"><img src="/basketball.png" alt="basketball" style={{ width: 14, height: 14, verticalAlign: "middle" }} /> Basketball</span>
                    <p style={{ fontSize: 14, color: "var(--text2)", marginTop: 8 }}>Half Court (min 6 players) · Full Court (max 10 players)</p>
                  </div>
                )}
                {c.sports.includes("soccer") && (
                  <div>
                    <span className="badge badge-orange"><img src="/soccer.png" alt="soccer" style={{ width: 14, height: 14, verticalAlign: "middle" }} /> Soccer</span>
                    <p style={{ fontSize: 14, color: "var(--text2)", marginTop: 8 }}>Minimum 8 players (4v4)</p>
                  </div>
                )}
                {c.sports.includes("indoor-volleyball") && (
                  <div>
                    <span className="badge badge-orange" style={{ color: "var(--orange)", display: "inline-flex", alignItems: "center", gap: 6 }}><div className="mask-volleyball" style={{ width: 14, height: 14 }} /> Indoor Volleyball</span>
                    <p style={{ fontSize: 14, color: "var(--text2)", marginTop: 8 }}>Minimum 6 players (3v3)</p>
                  </div>
                )}
                {c.sports.includes("sand-volleyball") && (
                  <div>
                    <span className="badge badge-orange" style={{ color: "var(--orange)", display: "inline-flex", alignItems: "center", gap: 6 }}><div className="mask-volleyball" style={{ width: 14, height: 14 }} /> Sand Volleyball</span>
                    <p style={{ fontSize: 14, color: "var(--text2)", marginTop: 8 }}>Minimum 4 players (2v2)</p>
                  </div>
                )}
                {c.sports.includes("tennis") && (
                  <div>
                    <span className="badge badge-orange" style={{ color: "var(--orange)", display: "inline-flex", alignItems: "center", gap: 6 }}><div className="mask-tennis" style={{ width: 14, height: 14 }} /> Tennis</span>
                    <p style={{ fontSize: 14, color: "var(--text2)", marginTop: 8 }}>2-4 players allowed</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button className="btn btn-primary btn-lg" style={{ width: "100%", justifyContent: "center" }}
          onClick={() => { setReserveDefaults(d => ({ ...d, facilityId: f.id })); setPage("reserve"); }}>
          Reserve at {f.short} →
        </button>
      </div>
    </div>
  );
}

// ─── RESERVATION FLOW ─────────────────────────────────────────────────────────
const STEPS = ["Location", "Court", "Sport", "Date & Time", "Players", "Review"];

function ReservePage({ bookings, onBook, defaults, showToast }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    facilityId: defaults?.facilityId || "",
    courtId: "",
    sport: "",
    courtType: "",
    date: getTodayStr(),
    startHour: null,
    duration: 1,
    playerName: "",
    email: "",
    phone: "",
    teammates: [""],
  });
  const [confirmed, setConfirmed] = useState(false);
  const [confirmedId, setConfirmedId] = useState(null);

  const totalPlayers = 1 + data.teammates.filter(t => t.trim()).length;

  const update = (key, val) => setData(d => ({ ...d, [key]: val }));

  const getValidationError = () => {
    if (data.sport === "basketball" && data.courtType === "half" && totalPlayers < 6)
      return "Half court bookings require at least 6 players total.";
    if (data.sport === "basketball" && data.courtType === "full" && totalPlayers > 10)
      return "Full court basketball supports up to 10 players.";
    if (data.sport === "soccer" && totalPlayers < 8)
      return "Soccer reservations require at least 8 players for 4v4 play.";
    if (data.sport === "indoor-soccer" && totalPlayers < 8)
      return "Indoor soccer requires at least 8 total players to reserve this court.";
    if (data.sport === "indoor-volleyball" && totalPlayers < 6)
      return "Indoor volleyball requires at least 6 players (3v3).";
    if (data.sport === "sand-volleyball" && totalPlayers < 4)
      return "Sand volleyball requires at least 4 players (2v2).";
    if (data.sport === "tennis" && totalPlayers < 2)
      return "Tennis reservations require at least 2 players.";
    if (data.sport === "tennis" && totalPlayers > 4)
      return "Tennis reservations support up to 4 players.";
    return null;
  };

  const canProceed = () => {
    if (step === 0) return !!data.facilityId;
    if (step === 1) return !!data.courtId;
    if (step === 2) {
      if (!data.sport) return false;
      if (data.sport === "basketball" && !data.courtType) return false;
      return true;
    }
    if (step === 3) return data.startHour !== null;
    if (step === 4) return !getValidationError() && totalPlayers >= 1;
    return true;
  };

  const handleBook = () => {
    const id = genId();
    const booking = {
      id, courtId: data.courtId, date: data.date, startHour: data.startHour,
      endHour: data.startHour + data.duration, sport: data.sport,
      courtType: data.courtType || null, players: totalPlayers,
      owner: "u1", teammates: data.teammates.filter(t => t.trim()),
      status: "upcoming",
    };
    onBook(booking);
    setConfirmedId(id);
    setConfirmed(true);
    showToast("Reservation confirmed!", "success");
  };

  if (confirmed) {
    return <ConfirmationPage bookingId={confirmedId} data={data} totalPlayers={totalPlayers} />;
  }

  const facility = data.facilityId ? FACILITIES[data.facilityId] : null;
  const court = data.courtId ? getCourtById(data.courtId) : null;

  return (
    <div className="page" style={{ position: "relative", padding: "60px 0" }}>
      <style>{`
        .reserve-hero { position: relative; padding: 40px 0 60px 0; overflow: hidden; z-index: 1; }
        .reserve-hero::before { 
          content: ""; 
          position: absolute; 
          inset: 0; 
          background: radial-gradient(ellipse 120% 100% at 50% 0%, rgba(57,217,138,0.08) 0%, transparent 50%);
          pointer-events: none;
          z-index: 0;
        }
        .reserve-hero::after {
          content: "";
          position: absolute;
          left: -200px;
          top: 20%;
          width: 600px;
          height: 600px;
          background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="temocReserve" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23f47c20;stop-opacity:0.6"/><stop offset="100%" style="stop-color:%23ff9040;stop-opacity:0.45"/></linearGradient></defs><g transform="translate(600, 600) scale(0.5) scaleX(-1)" opacity="0.2"><ellipse cx="0" cy="0" rx="180" ry="200" fill="url(%23temocReserve)"/><ellipse cx="50" cy="80" rx="140" ry="130" fill="%23ffa855" opacity="0.4"/></g></svg>');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          opacity: 0.50;
          filter: blur(5px);
          z-index: 1;
          animation: temoc-float 14s ease-in-out infinite, temoc-glow-pulse 6s ease-in-out infinite;
          pointer-events: none;
        }
        .reserve-hero-content { position: relative; z-index: 1; }
        .reserve-stepper { background: linear-gradient(135deg, rgba(244,124,32,0.03), rgba(57,217,138,0.03)); border: 1px solid var(--border2); border-radius: 12px; padding: 24px; margin-bottom: 28px; }
        @keyframes court-preview-enter {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .court-preview-card {
          margin-bottom: 24px;
          border-radius: var(--radius-lg);
          overflow: hidden;
          border: 1px solid rgba(244,124,32,0.28);
          box-shadow: 0 0 28px rgba(244,124,32,0.14), 0 0 22px rgba(57,217,138,0.1);
          background: linear-gradient(145deg, rgba(22,26,36,0.98) 0%, rgba(14,16,22,0.99) 50%, rgba(19,22,32,1) 100%);
          animation: court-preview-enter 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .court-preview-media {
          position: relative;
          width: 100%;
          height: clamp(180px, 36vw, 220px);
          background: linear-gradient(135deg, rgba(244,124,32,0.18), rgba(57,217,138,0.12), rgba(10,11,13,0.5));
        }
        .court-preview-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .court-preview-media-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: linear-gradient(to top, rgba(10,11,13,0.55) 0%, rgba(10,11,13,0.15) 35%, transparent 70%);
        }
        .court-preview-fallback { width: 100%; height: 100%; min-height: 180px; }
        .court-preview-copy { padding: 18px 22px 22px; }
        .court-preview-title { font-family: var(--font-cond); font-size: 22px; font-weight: 800; color: var(--text); margin: 0 0 6px 0; letter-spacing: -0.3px; }
        .court-preview-sub { margin: 0; font-size: 14px; font-weight: 600; color: var(--text2); }
      `}</style>

      <div className="reserve-hero">
        <div className="reserve-hero-content container-sm">
          <h1 className="heading-lg" style={{ marginBottom: 8 }}><img src="/clock.png" alt="reserve" style={{ width: 40, height: 40, verticalAlign: "middle" }} /> Reserve a Court</h1>
          <p className="text-muted" style={{ marginBottom: 0, fontSize: 16 }}>Select facility, court, sport, and time. Secure your spot in seconds.</p>
        </div>
      </div>

      <div className="container-sm">
        {/* Stepper */}
        <div className="reserve-stepper stepper">
          {STEPS.map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", flex: i < STEPS.length - 1 ? 1 : "initial" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, cursor: i < step ? "pointer" : "default" }} onClick={() => i < step && setStep(i)}>
                <div className={`step-dot ${i < step ? "step-dot-done" : i === step ? "step-dot-active" : "step-dot-inactive"}`}>
                  {i < step ? <img src="/tick.png" alt="done" style={{ width: 16, height: 16 }} /> : i + 1}
                </div>
                <span className={`step-label hide-mobile ${i === step ? "active" : ""}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className="step-connector" />}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="card" style={{ marginBottom: 28 }}>
          {step === 0 && (
            <StepLocation data={data} update={update} />
          )}
          {step === 1 && facility && (
            <StepCourt data={data} update={update} facility={facility} />
          )}
          {step === 2 && court && (
            <StepSport data={data} update={update} court={court} />
          )}
          {step === 3 && (
            <StepDateTime data={data} update={update} bookings={bookings} />
          )}
          {step === 4 && (
            <StepPlayers data={data} update={update} totalPlayers={totalPlayers} validationError={getValidationError()} />
          )}
          {step === 5 && court && facility && (
            <StepReview data={data} court={court} facility={facility} totalPlayers={totalPlayers} />
          )}
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          {step > 0 && <button className="btn btn-ghost" onClick={() => setStep(s => s - 1)}>← Back</button>}
          {step < STEPS.length - 1 ? (
            <button className="btn btn-primary" style={{ flex: 1, justifyContent: "center" }} disabled={!canProceed()} onClick={() => setStep(s => s + 1)}>
              Continue →
            </button>
          ) : (
            <button className="btn btn-green" style={{ flex: 1, justifyContent: "center" }} onClick={handleBook}>
              <img src="/tick.png" alt="confirm" style={{ width: 16, height: 16, verticalAlign: "middle" }} /> Confirm Reservation
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function StepLocation({ data, update }) {
  return (
    <div>
      <div className="section-label" style={{ marginBottom: 20, display: "flex", alignItems: "center", gap: 8 }}><img src="/activity.png" alt="facilities" style={{ width: 16, height: 16 }} /> Choose Facility</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {Object.values(FACILITIES).map(f => (
          <div key={f.id} onClick={() => { update("facilityId", f.id); update("courtId", ""); update("sport", ""); update("courtType", ""); }}
            style={{ padding: "20px 24px", borderRadius: "12px", border: `2px solid ${data.facilityId === f.id ? "var(--green)" : "var(--border2)"}`, background: data.facilityId === f.id ? "rgba(57,217,138,0.08)" : "linear-gradient(135deg, rgba(244,124,32,0.02), rgba(57,217,138,0.02))", cursor: "pointer", transition: "all 0.2s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <div><img src={`/${f.image}`} alt={f.name} style={{ width: 44, height: 44 }} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, marginBottom: 4, fontSize: 18 }}>{f.name}</div>
                <div className="text-muted" style={{ fontSize: 15 }}>{f.courts.length} courts · {f.address}</div>
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  <span className="badge badge-green" style={{ fontSize: 12 }}>Open Now</span>
                </div>
              </div>
              {data.facilityId === f.id && <div style={{ marginLeft: "auto" }}><img src="/tick.png" alt="selected" style={{ width: 24, height: 24 }} /></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepCourt({ data, update, facility }) {
  return (
    <div>
      <div className="section-label" style={{ marginBottom: 20 }}>Choose Court</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {facility.courts.map(c => (
          <div key={c.id} onClick={() => { update("courtId", c.id); update("sport", ""); update("courtType", ""); }}
            style={{ padding: "20px 24px", borderRadius: "var(--radius)", border: `2px solid ${data.courtId === c.id ? "var(--orange)" : "var(--border2)"}`, background: data.courtId === c.id ? "rgba(244,124,32,0.1)" : "var(--bg3)", cursor: "pointer", transition: "all 0.15s" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontWeight: 800, marginBottom: 6, fontSize: 18 }}>{c.name}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {c.sports.map(s => (
                    <span key={s} className="badge badge-orange" style={{ fontSize: 13, display: "inline-flex", alignItems: "center", gap: 4, color: "var(--orange)" }}>
                      {s === "basketball" ? <><img src="/basketball.png" alt="basketball" style={{ width: 13, height: 13, verticalAlign: "middle" }} /> Basketball</> : 
                       s === "soccer" ? <><img src="/soccer.png" alt="soccer" style={{ width: 13, height: 13, verticalAlign: "middle" }} /> Soccer</> :
                       s === "indoor-soccer" ? <><img src="/soccer.png" alt="indoor-soccer" style={{ width: 13, height: 13, verticalAlign: "middle" }} /> In-Soccer</> :
                       s === "indoor-volleyball" ? <><div className="mask-volleyball" style={{ width: 13, height: 13, display: "inline-block", verticalAlign: "middle" }} /> Volleyball</> : 
                       s === "sand-volleyball" ? <><div className="mask-volleyball" style={{ width: 13, height: 13, display: "inline-block", verticalAlign: "middle" }} /> Sand VB</> :
                       s === "tennis" ? <><div className="mask-tennis" style={{ width: 13, height: 13, display: "inline-block", verticalAlign: "middle" }} /> Tennis</> : s}
                    </span>
                  ))}
                </div>
              </div>
              {data.courtId === c.id && <div><img src="/tick.png" alt="selected" style={{ width: 20, height: 20 }} /></div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CourtSportStepPreview({ court }) {
  const [imgFailed, setImgFailed] = useState(false);
  if (!court.image) return null;

  const title = `${court.facility.name} – ${court.name}`;
  const subtitle = court.previewSubtitle ?? null;

  return (
    <div className="court-preview-card">
      <div className="court-preview-media">
        {!imgFailed ? (
          <img
            src={court.image}
            alt=""
            onError={() => setImgFailed(true)}
            loading="lazy"
            style={court.previewObjectPosition ? { objectPosition: court.previewObjectPosition } : undefined}
          />
        ) : null}
        {imgFailed ? <div className="court-preview-fallback" aria-hidden /> : null}
        <div className="court-preview-media-overlay" aria-hidden />
      </div>
      <div className="court-preview-copy">
        <h3 className="court-preview-title">{title}</h3>
        {subtitle ? <p className="court-preview-sub">{subtitle}</p> : null}
      </div>
    </div>
  );
}

function StepSport({ data, update, court }) {
  return (
    <div>
      <CourtSportStepPreview court={court} />
      <div className="section-label" style={{ marginBottom: 20 }}>Choose Sport</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
        {court.sports.map(s => (
          <div key={s} onClick={() => { update("sport", s); update("courtType", s === "basketball" ? data.courtType : ""); }}
            style={{ padding: "20px 24px", borderRadius: "var(--radius)", border: `2px solid ${data.sport === s ? "var(--orange)" : "var(--border2)"}`, background: data.sport === s ? "rgba(244,124,32,0.1)" : "var(--bg3)", cursor: "pointer", transition: "all 0.15s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <span style={{ fontSize: 40, color: "var(--orange)" }}>
                {s === "basketball" ? <img src="/basketball.png" alt="basketball" style={{ width: 40, height: 40 }} /> : 
                 s === "soccer" ? <img src="/soccer.png" alt="soccer" style={{ width: 40, height: 40 }} /> :
                 s === "indoor-soccer" ? <img src="/soccer.png" alt="indoor-soccer" style={{ width: 40, height: 40 }} /> :
                 s === "indoor-volleyball" ? <div className="mask-volleyball" style={{ width: 40, height: 40 }} /> : 
                 s === "sand-volleyball" ? <div className="mask-volleyball" style={{ width: 40, height: 40 }} /> :
                 s === "tennis" ? <div className="mask-tennis" style={{ width: 40, height: 40 }} /> : "⚽"}
              </span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 18 }}>
                  {s === "basketball" ? "Basketball" : 
                   s === "soccer" ? "Soccer" :
                   s === "indoor-soccer" ? "Indoor Soccer" :
                   s === "indoor-volleyball" ? "Indoor Volleyball" : 
                   s === "sand-volleyball" ? "Sand Volleyball" :
                   s === "tennis" ? "Tennis" : s.charAt(0).toUpperCase() + s.slice(1)}
                </div>
                <div className="text-muted" style={{ fontSize: 15 }}>
                  {s === "basketball" ? "Half court (min 6) or Full court (max 10)" : 
                   s === "soccer" ? "Minimum 8 players for 4v4" :
                   s === "indoor-soccer" ? "Minimum 8 players (4v4) - Auxiliary Gym only" :
                   s === "indoor-volleyball" ? "Minimum 6 players (3v3)" : 
                   s === "sand-volleyball" ? "Minimum 4 players (2v2)" :
                  s === "tennis" ? "2-4 players allowed" : "Maximum 10 players"}
                </div>
              </div>
              {data.sport === s && <div><img src="/tick.png" alt="selected" style={{ width: 20, height: 20 }} /></div>}
            </div>
          </div>
        ))}
      </div>

      {data.sport === "basketball" && (
        <div>
          <div className="section-label" style={{ marginBottom: 16 }}>Court Type</div>
          <div style={{ display: "flex", gap: 16 }}>
            {[{ id: "half", label: "Half Court", desc: "Min 6 players" }, { id: "full", label: "Full Court", desc: "Max 10 players" }].map(ct => (
              <div key={ct.id} onClick={() => update("courtType", ct.id)}
                style={{ flex: 1, padding: "18px 20px", borderRadius: "var(--radius)", border: `2px solid ${data.courtType === ct.id ? "var(--orange)" : "var(--border2)"}`, background: data.courtType === ct.id ? "rgba(244,124,32,0.1)" : "var(--bg3)", cursor: "pointer", textAlign: "center" }}>
                <div style={{ fontWeight: 800, marginBottom: 6, fontSize: 17 }}>{ct.label}</div>
                <div className="text-muted" style={{ fontSize: 15 }}>{ct.desc}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StepDateTime({ data, update, bookings }) {
  const today = getTodayStr();
  const [weekOffset, setWeekOffset] = useState(0);

  const dates = Array.from({ length: 7 }, (_, i) => addDays(today, i + weekOffset * 7));

  const slots = data.courtId ? getSlotsForCourt(data.courtId, data.date, bookings) : [];
  const availableCount = slots.filter(s => !s.booked).length;

  return (
    <div>
      <div className="section-label" style={{ marginBottom: 16 }}><img src="/calendar.png" alt="calendar" style={{ width: 16, height: 16, verticalAlign: "middle" }} /> Select Date</div>
      <div style={{ display: "flex", gap: 10, marginBottom: 32, overflowX: "auto", paddingBottom: 6 }}>
        {dates.map(d => {
          const dow = getDayOfWeek(d);
          const dayNum = new Date(d + "T12:00:00").getDate();
          const monthStr = new Date(d + "T12:00:00").toLocaleDateString("en-US", { month: "short" });
          const isSelected = data.date === d;
          return (
            <div key={d} onClick={() => { update("date", d); update("startHour", null); }}
              style={{ flexShrink: 0, width: 80, padding: "14px 12px", borderRadius: "var(--radius)", border: `2px solid ${isSelected ? "var(--green)" : "var(--border)"}`, background: isSelected ? "rgba(57,217,138,0.1)" : "var(--bg3)", cursor: "pointer", textAlign: "center", transition: "all 0.2s" }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: isSelected ? "var(--green)" : "var(--text2)", textTransform: "uppercase", letterSpacing: 1 }}>{dow}</div>
              <div style={{ fontSize: 24, fontWeight: 900, fontFamily: "var(--font-cond)", color: isSelected ? "var(--green)" : "var(--text)" }}>{dayNum}</div>
              <div style={{ fontSize: 12, color: "var(--text3)" }}>{monthStr}</div>
            </div>
          );
        })}
      </div>

      {data.courtId ? (
        <>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div className="section-label" style={{ marginBottom: 0 }}><img src="/clock.png" alt="clock" style={{ width: 13, height: 13, verticalAlign: "middle" }} /> Select Start Time</div>
            <span className="badge badge-green" style={{ fontSize: 12 }}>◆ {availableCount} slots available</span>
          </div>
          {slots.length === 0 ? (
            <p className="text-muted" style={{ fontSize: 16 }}>No available slots for this date.</p>
          ) : (
            <div className="slot-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(80px, 1fr))", gap: 12, marginBottom: 28 }}>
              {slots.map(s => (
                <div key={s.hour} className={`slot ${s.booked ? "slot-booked" : data.startHour === s.hour ? "slot-selected" : "slot-available"}`}
                  onClick={() => !s.booked && update("startHour", s.hour)}
                  style={{ 
                    padding: "16px 12px", 
                    borderRadius: "8px", 
                    border: `2px solid ${s.booked ? "var(--border)" : data.startHour === s.hour ? "var(--green)" : "var(--border2)"}`,
                    background: s.booked ? "var(--bg3)" : data.startHour === s.hour ? "rgba(57,217,138,0.1)" : "linear-gradient(135deg, rgba(244,124,32,0.03), rgba(57,217,138,0.03))",
                    cursor: s.booked ? "not-allowed" : "pointer",
                    textAlign: "center",
                    fontWeight: 700,
                    fontSize: 14,
                    transition: "all 0.2s",
                    opacity: s.booked ? 0.5 : 1,
                  }}>
                  {formatHour(s.hour)}
                  {s.booked && <div style={{ fontSize: 11, marginTop: 4, color: "var(--text3)" }}>booked</div>}
                </div>
              ))}
            </div>
          )}
          {data.startHour !== null && (
            <div style={{ marginTop: 28, padding: 20, background: "linear-gradient(135deg, rgba(244,124,32,0.06), rgba(57,217,138,0.04))", borderRadius: 12, border: "1px solid var(--border2)" }}>
              <div className="section-label" style={{ marginBottom: 16 }}><img src="/clock.png" alt="clock" style={{ width: 13, height: 13, verticalAlign: "middle" }} /> Duration</div>
              <div style={{ display: "flex", gap: 12 }}>
                {[1, 2].map(d => (
                  <div key={d} onClick={() => update("duration", d)}
                    style={{ padding: "14px 24px", borderRadius: "var(--radius)", border: `2px solid ${data.duration === d ? "var(--green)" : "var(--border2)"}`, background: data.duration === d ? "rgba(57,217,138,0.1)" : "var(--bg3)", cursor: "pointer", fontWeight: 700, fontSize: 16, transition: "all 0.2s" }}>
                    {d} hour{d > 1 ? "s" : ""}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <p className="text-muted" style={{ fontSize: 16, textAlign: "center", paddingY: 24 }}>Select a court first to see availability.</p>
      )}
    </div>
  );
}

function StepPlayers({ data, update, totalPlayers, validationError }) {
  const addTeammate = () => update("teammates", [...data.teammates, ""]);
  const removeTeammate = (i) => update("teammates", data.teammates.filter((_, idx) => idx !== i));
  const updateTeammate = (i, val) => update("teammates", data.teammates.map((t, idx) => idx === i ? val : t));

  return (
    <div>
      <div className="section-label" style={{ marginBottom: 20 }}>Your Info</div>
      <div className="grid-2" style={{ marginBottom: 28 }}>
        <div>
          <label>Full Name</label>
          <input value={data.playerName} onChange={e => update("playerName", e.target.value)} placeholder="Your name" />
        </div>
        <div>
          <label>Email</label>
          <input value={data.email} onChange={e => update("email", e.target.value)} placeholder="your@email.com" />
        </div>
        <div>
          <label>Phone (optional)</label>
          <input value={data.phone} onChange={e => update("phone", e.target.value)} placeholder="214-555-0000" />
        </div>
      </div>

      <div className="divider" />
      <div className="section-label" style={{ marginBottom: 16 }}>Teammates</div>
      <p className="text-muted" style={{ fontSize: 15, marginBottom: 20 }}>
        {data.sport === "basketball" && data.courtType === "half" && "Half court bookings require at least 6 players total."}
        {data.sport === "basketball" && data.courtType === "full" && "Full court basketball supports up to 10 players."}
        {data.sport === "soccer" && "Soccer reservations require at least 8 players for 4v4 play."}
        {data.sport === "indoor-soccer" && "Indoor soccer requires at least 8 total players to reserve this court."}
        {data.sport === "indoor-volleyball" && "Indoor volleyball requires at least 6 players (3v3)."}
        {data.sport === "sand-volleyball" && "Sand volleyball requires at least 4 players (2v2)."}
        {data.sport === "tennis" && "Tennis reservations require 2-4 players."}
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
        {data.teammates.map((t, i) => (
          <div key={i} style={{ display: "flex", gap: 10 }}>
            <input value={t} onChange={e => updateTeammate(i, e.target.value)} placeholder={`Teammate ${i + 1} name`} />
            <button className="btn btn-ghost btn-sm" onClick={() => removeTeammate(i)} style={{ flexShrink: 0 }}>✕</button>
          </div>
        ))}
      </div>

      <button className="btn btn-ghost btn-sm" onClick={addTeammate} style={{ marginBottom: 28 }}>+ Add Teammate</button>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", background: "var(--bg3)", borderRadius: "var(--radius)", marginBottom: validationError ? 16 : 0 }}>
        <span style={{ fontSize: 16, fontWeight: 700 }}>Total Players</span>
        <span style={{ fontSize: 28, fontWeight: 900, fontFamily: "var(--font-cond)", color: validationError ? "var(--red)" : "var(--green)" }}>{totalPlayers}</span>
      </div>
      {validationError && (
        <div style={{ padding: "14px 18px", background: "rgba(247,95,95,0.12)", border: "1px solid rgba(247,95,95,0.3)", borderRadius: "var(--radius)", color: "var(--red)", fontSize: 15, fontWeight: 600 }}>
          ⚠ {validationError}
        </div>
      )}
    </div>
  );
}

function StepReview({ data, court, facility, totalPlayers }) {
  const rows = [
    ["Facility", facility.name],
    ["Court", court.name],
    ["Sport", data.sport.charAt(0).toUpperCase() + data.sport.slice(1)],
    data.courtType ? ["Court Type", data.courtType === "full" ? "Full Court" : "Half Court"] : null,
    ["Date", formatDate(data.date)],
    ["Time", `${formatHour(data.startHour)} – ${formatHour(data.startHour + data.duration)}`],
    ["Duration", `${data.duration} hour${data.duration > 1 ? "s" : ""}`],
    ["Players", `${totalPlayers} (you + ${totalPlayers - 1} teammates)`],
    ["Name", data.playerName],
    ["Email", data.email],
  ].filter(Boolean);

  return (
    <div>
      <div className="section-label" style={{ marginBottom: 20 }}>Review Booking</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {rows.map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderBottom: "1px solid var(--border)", fontSize: 16 }}>
            <span className="text-muted">{k}</span>
            <span style={{ fontWeight: 700, textAlign: "right", maxWidth: "60%" }}>{v}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 28, padding: "18px 20px", background: "rgba(57,217,138,0.1)", border: "1px solid rgba(57,217,138,0.25)", borderRadius: "var(--radius)", fontSize: 15, color: "var(--green)", fontWeight: 600, lineHeight: 1.6 }}>
        <img src="/tick.png" alt="info" style={{ width: 15, height: 15, verticalAlign: "middle" }} /> Your court will be confirmed immediately. You can cancel up to 2 hours before your reservation.
      </div>
    </div>
  );
}

function ConfirmationPage({ data, totalPlayers }) {
  const court = getCourtById(data.courtId);
  return (
    <div className="page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 80px)", padding: "60px 0" }}>
      <div className="container-sm" style={{ maxWidth: 600, textAlign: "center" }}>
        <div style={{ width: 100, height: 100, borderRadius: "50%", background: "rgba(57,217,138,0.15)", border: "3px solid var(--green)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 36px" }}><img src="/tick.png" alt="success" style={{ width: 48, height: 48 }} /></div>
        <h1 className="heading-lg" style={{ marginBottom: 16 }}>Court Reserved!</h1>
        <p className="text-muted" style={{ marginBottom: 40, fontSize: 18 }}>Your reservation is confirmed. See you on the court!</p>
        <div className="card" style={{ textAlign: "left", marginBottom: 28 }}>
          {[
            ["Court", court?.name],
            ["Date", formatDate(data.date)],
            ["Time", `${formatHour(data.startHour)} – ${formatHour(data.startHour + data.duration)}`],
            ["Players", totalPlayers],
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid var(--border)", fontSize: 16 }}>
              <span className="text-muted">{k}</span>
              <span style={{ fontWeight: 700 }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
function ProfilePage({ user, bookings, onLogout, setPage }) {
  const stats = {
    total: bookings.filter(b => b.owner === "u1").length,
    upcoming: bookings.filter(b => b.owner === "u1" && b.status === "upcoming").length,
    completed: bookings.filter(b => b.owner === "u1" && b.status === "completed").length,
  };
  
  const upcomingBookings = bookings.filter(b => b.owner === "u1" && b.status === "upcoming").slice(0, 3);
  const pastBookings = bookings.filter(b => b.owner === "u1" && b.status === "completed").slice(0, 3);

  return (
    <div className="page" style={{ position: "relative", padding: "60px 0" }}>
      <style>{`
        .profile-hero { position: relative; padding: 40px 0 50px 0; background: linear-gradient(135deg, rgba(57,217,138,0.08) 0%, rgba(244,124,32,0.04) 100%); margin-bottom: 40px; overflow: hidden; }
        .profile-hero::before {
          content: "";
          position: absolute;
          right: -200px;
          top: 50%;
          transform: translateY(-50%);
          width: 700px;
          height: 700px;
          background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 1200 1200" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="temocProfile" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:%23f47c20;stop-opacity:0.7"/><stop offset="100%" style="stop-color:%23ff9040;stop-opacity:0.55"/></linearGradient></defs><g transform="translate(600, 600) scale(0.6)" opacity="0.2"><ellipse cx="0" cy="0" rx="180" ry="200" fill="url(%23temocProfile)"/><ellipse cx="50" cy="80" rx="140" ry="130" fill="%23ffa855" opacity="0.5"/></g></svg>');
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
          opacity: 0.55;
          filter: blur(5px);
          z-index: 1;
          animation: temoc-float 14s ease-in-out infinite, temoc-glow-pulse 6s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>

      <div className="profile-hero">
        <div className="container-sm" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 28 }}>
            <div className="avatar" style={{ width: 96, height: 96, fontSize: 40, background: "linear-gradient(135deg, rgba(57,217,138,0.2), rgba(0,212,204,0.1))", flexShrink: 0 }}>
              {user ? getInitials(user.name) : "?"}
            </div>
            <div style={{ flex: 1 }}>
              <h1 className="heading-lg" style={{ marginBottom: 8 }}>
                <span className="text-orange">{user ? user.name : "User"}</span>
              </h1>
              <p className="text-muted" style={{ fontSize: 16, marginBottom: 12 }}>
                Member since {user?.joinedDate ? new Date(user.joinedDate + "T12:00:00").toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "today"}
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <span className="badge badge-green" style={{ fontSize: 12 }}>🎓 UTD Student</span>
                <span className="badge badge-orange" style={{ fontSize: 12 }}><img src="/clock.png" alt="active" style={{ width: 12, height: 12, verticalAlign: "middle" }} /> Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-sm">
        {/* Stats Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 40 }}>
          {[
            { icon: <img src="/stats.png" alt="stats" style={{ width: 36, height: 36 }} />, label: "Total Bookings", value: stats.total, color: "var(--text)" },
            { icon: <img src="/list.png" alt="upcoming" style={{ width: 36, height: 36 }} />, label: "Upcoming", value: stats.upcoming, color: "var(--green)" },
            { icon: <img src="/tick.png" alt="completed" style={{ width: 36, height: 36 }} />, label: "Completed", value: stats.completed, color: "var(--text2)" },
          ].map(s => (
            <div key={s.label} className="card" style={{ background: "linear-gradient(135deg, rgba(244,124,32,0.04), rgba(57,217,138,0.04))", textAlign: "center" }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontFamily: "var(--font-cond)", fontSize: 40, fontWeight: 900, color: s.color, marginBottom: 8 }}>{s.value}</div>
              <div className="text-muted" style={{ fontSize: 14 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Account Info */}
        <div className="card" style={{ marginBottom: 28 }}>
          <div className="section-label" style={{ marginBottom: 24 }}>👤 Account Information</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            {[
              { label: "Name", value: user?.name || "N/A" },
              { label: "Email", value: user?.email || "N/A" },
              { label: "Student ID", value: user?.studentId || "Not provided" },
              { label: "Preferred Sport", value: user?.preferredSport === "basketball" ? "Basketball" : "Soccer" },
            ].map(({ label, value }) => (
              <div key={label}>
                <div className="text-muted" style={{ fontSize: 12, marginBottom: 6 }}>{label.toUpperCase()}</div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Reservations Preview */}
        {upcomingBookings.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div className="heading-md"><img src="/calendar.png" alt="calendar" style={{ width: 28, height: 28, verticalAlign: "middle" }} /> Upcoming Bookings</div>
              <button className="btn btn-ghost btn-sm" onClick={() => setPage("reservations")}>View all →</button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {upcomingBookings.map(b => (
                <BookingCard key={b.id} booking={b} compact />
              ))}
            </div>
          </div>
        )}

        {/* Past Reservations Preview */}
        {pastBookings.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div className="heading-md" style={{ marginBottom: 20 }}><img src="/tick.png" alt="completed" style={{ width: 28, height: 28, verticalAlign: "middle" }} /> Completed Bookings</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {pastBookings.map(b => (
                <BookingCard key={b.id} booking={b} compact />
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button className="btn btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: 16 }} onClick={() => setPage("reservations")}>
            <img src="/list.png" alt="reservations" style={{ width: 16, height: 16, verticalAlign: "middle" }} /> View All Reservations
          </button>
          <button className="btn btn-ghost" style={{ width: "100%", justifyContent: "center", fontSize: 16 }} onClick={onLogout}>
            🚪 Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── ADMIN PAGE ───────────────────────────────────────────────────────────────
function AdminPage({ bookings }) {
  const today = getTodayStr();
  const todayBookings = bookings.filter(b => b.date === today);
  const courts = Object.values(FACILITIES).flatMap(f => f.courts);
  const occupancyRate = Math.round((todayBookings.length / (courts.length * 8)) * 100);

  return (
    <div className="page" style={{ position: "relative", padding: "60px 0" }}>
      <style>{`
        .admin-hero { position: relative; padding: 40px 0 50px 0; background: linear-gradient(135deg, rgba(244,124,32,0.1) 0%, rgba(57,217,138,0.06) 100%); }
      `}</style>

      <div className="admin-hero">
        <div className="container" style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <span className="badge badge-orange" style={{ fontSize: 12 }}>🔧 Admin</span>
            <h1 className="heading-lg" style={{ marginBottom: 0 }}>Court Management</h1>
          </div>
          <p className="text-muted" style={{ fontSize: 16 }}>Monitor court usage and manage bookings</p>
        </div>
      </div>

      <div className="container">
        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 24, marginBottom: 48 }}>
          {[
            { label: "Total Reservations", value: bookings.length, color: "var(--orange)", icon: <img src="/calendar.png" alt="calendar" style={{ width: 24, height: 24 }} /> },
            { label: "Today's Bookings", value: todayBookings.length, color: "var(--green)", icon: <img src="/clock.png" alt="today" style={{ width: 24, height: 24 }} /> },
            { label: "Active Courts", value: courts.length, color: "var(--orange)", icon: <img src="/activity.png" alt="facilities" style={{ width: 24, height: 24 }} /> },
            { label: "Occupancy Rate", value: `${occupancyRate}%`, color: "var(--text)", icon: <img src="/stats.png" alt="stats" style={{ width: 24, height: 24 }} /> },
          ].map(s => (
            <div key={s.label} className="card" style={{ background: "linear-gradient(135deg, rgba(244,124,32,0.04), rgba(57,217,138,0.04))" }}>
              <div style={{ fontSize: 24, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontFamily: "var(--font-cond)", fontSize: 42, fontWeight: 900, color: s.color, marginBottom: 8 }}>{s.value}</div>
              <div className="text-muted" style={{ fontSize: 14 }}>{s.label.replace(/^[^a-zA-Z]+/, "")}</div>
            </div>
          ))}
        </div>

        {/* Court Occupancy */}
        <h2 className="heading-md" style={{ marginBottom: 32 }}><img src="/clock.png" alt="clock" style={{ width: 28, height: 28, verticalAlign: "middle" }} /> Today's Court Occupancy</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 20 }}>
          {courts.map(c => {
            const courtBookings = todayBookings.filter(b => b.courtId === c.id);
            const facility = getCourtById(c.id)?.facility;
            const isBooked = courtBookings.length > 0;
            return (
              <div key={c.id} className="card" style={{ background: isBooked ? "linear-gradient(135deg, rgba(244,124,32,0.06), rgba(0,212,204,0.03))" : "linear-gradient(135deg, rgba(57,217,138,0.06), rgba(0,212,204,0.03))", borderColor: isBooked ? "rgba(244,124,32,0.2)" : "rgba(57,217,138,0.2)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <div>
                    <div style={{ fontWeight: 800, marginBottom: 4, fontSize: 18 }}>{c.name}</div>
                    <div className="text-muted" style={{ fontSize: 14 }}>{facility?.short}</div>
                  </div>
                  <span className={`badge ${isBooked ? "badge-orange" : "badge-green"}`}>
                    {isBooked ? "🔴 In Use" : "Available"}
                  </span>
                </div>
                
                {courtBookings.length === 0 ? (
                  <div style={{ padding: "16px 14px", background: "rgba(57,217,138,0.1)", borderRadius: 8, textAlign: "center", color: "var(--green)", fontWeight: 600, fontSize: 14 }}>
                    <img src="/tick.png" alt="available" style={{ width: 14, height: 14, verticalAlign: "middle" }} /> Available all day
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {courtBookings.map(b => (
                      <div key={b.id} style={{ padding: "12px 14px", background: "rgba(244,124,32,0.1)", borderRadius: 8, fontSize: 13, fontWeight: 600, borderLeft: "3px solid var(--orange)" }}>
                        <div>{formatHour(b.startHour)} – {formatHour(b.endHour)}</div>
                        <div className="text-muted" style={{ fontSize: 12, marginTop: 4 }}>👥 {b.players} players</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("landing");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [toast, setToast] = useState(null);
  const [reserveDefaults, setReserveDefaults] = useState({});

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = initAuthFromStorage();
    if (storedUser) {
      setCurrentUser(storedUser);
      setIsLoggedIn(true);
    }
  }, []);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type, key: Date.now() });
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    clearAuthStorage();
    setPage("landing");
    showToast("Signed out successfully.", "success");
  };

  const handleSignup = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
    setIsFirstLogin(true);
    setTimeout(() => setIsFirstLogin(false), 2000); // Clear after greeting
  };

  const handleBook = (booking) => {
    setBookings(prev => [...prev, booking]);
  };

  const handleCancel = (id) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "completed" } : b));
    showToast("Reservation cancelled.", "success");
  };

  const navToPage = (p) => {
    if (!isLoggedIn && ["home", "reserve", "reservations", "facilities", "facility", "profile", "admin"].includes(p)) {
      setPage("login");
      return;
    }
    setPage(p);
  };

  const facilityId = reserveDefaults?.facilityId;

  return (
    <>
      <style>{CSS}</style>
      <div className="app">
        <Nav page={page} setPage={navToPage} user={currentUser} isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        {(() => {
          switch (page) {
            case "landing": return <LandingPage setPage={navToPage} />;
            case "login": return <LoginPage setPage={setPage} setCurrentUser={setCurrentUser} onLogin={handleLogin} showToast={showToast} />;
            case "signup": return <SignupPage setPage={setPage} setCurrentUser={handleSignup} onLogin={handleLogin} showToast={showToast} />;
            case "home": return <HomePage setPage={navToPage} setReserveDefaults={setReserveDefaults} bookings={bookings} user={currentUser} isFirstLogin={isFirstLogin} />;
            case "reserve": return <ReservePage bookings={bookings} onBook={handleBook} defaults={reserveDefaults} showToast={showToast} />;
            case "reservations": return <ReservationsPage bookings={bookings} onCancel={handleCancel} />;
            case "facilities": return <FacilitiesPage setPage={navToPage} setReserveDefaults={setReserveDefaults} />;
            case "facility": return <FacilityDetailPage facilityId={facilityId} setPage={navToPage} setReserveDefaults={setReserveDefaults} />;
            case "profile": return <ProfilePage user={currentUser} bookings={bookings} onLogout={handleLogout} setPage={navToPage} />;
            case "admin": return <AdminPage bookings={bookings} />;
            default: return <LandingPage setPage={navToPage} />;
          }
        })()}
        {isLoggedIn && <MobileNav page={page} setPage={navToPage} />}
        {toast && <Toast key={toast.key} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </>
  );
}
