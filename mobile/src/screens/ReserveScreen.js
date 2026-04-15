import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { COLORS, RADIUS, FONT_SIZE } from '../constants/theme';
import {
  getTodayStr, addDays, getDayOfWeek,
  formatDate, formatHour, getSlotsForCourt, getCourtById,
} from '../constants/data';

const STEPS = ['Location', 'Court', 'Sport', 'Date & Time', 'Players', 'Review'];

export default function ReserveScreen({ bookings, facilities = {}, onAddBooking, showToast, setPage, user }) {
  const [step, setStep] = useState(0);
  const [facilityId, setFacilityId] = useState(null);
  const [courtId, setCourtId] = useState(null);
  const [sport, setSport] = useState(null);
  const [courtType, setCourtType] = useState(null);
  const [date, setDate] = useState(getTodayStr());
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [players, setPlayers] = useState('');
  const [teammates, setTeammates] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const facility = facilityId ? facilities[facilityId] : null;
  const court = courtId ? getCourtById(courtId, facilities) : null;

  const canNext = () => {
    if (step === 0) return !!facilityId;
    if (step === 1) return !!courtId;
    if (step === 2) return !!sport && (sport !== 'basketball' || !!courtType);
    if (step === 3) return selectedSlots.length > 0;
    if (step === 4) {
      const p = parseInt(players);
      if (sport === 'basketball') {
        if (courtType === 'half') return p >= 6;
        if (courtType === 'full') return p >= 2 && p <= 10;
      }
      if (sport === 'indoor-soccer') return p >= 8;
      if (sport === 'indoor-volleyball') return p >= 6;
      if (sport === 'sand-volleyball') return p >= 6;
      if (sport === 'tennis') return p >= 2;
      return p > 0;
    }
    return true;
  };

  const handleConfirm = () => {
    const sortedSlots = [...selectedSlots].sort((a, b) => a - b);
    const bookingPayload = {
      userId: user?.id,
      facilityId,
      courtId,
      date,
      startHour: sortedSlots[0],
      endHour: sortedSlots[sortedSlots.length - 1] + 1,
      sport,
      courtType: sport === 'basketball' ? courtType : null,
      players: parseInt(players),
      owner: user?.id,
      teammates: teammates.split(',').map((t) => t.trim()).filter(Boolean),
      isPublic,
      status: 'upcoming',
    };
    onAddBooking(bookingPayload)
      .then(() => {
        setConfirmed(true);
        showToast('Court reserved successfully!', 'success');
      })
      .catch((error) => {
        showToast(error.message || 'Reservation failed', 'error');
      });
  };

  if (confirmed) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.confirmPage}>
          <Text style={styles.confirmIcon}>🎉</Text>
          <Text style={styles.confirmTitle}>You're booked!</Text>
          <Text style={styles.confirmSub}>
            {court?.name} · {formatDate(date)}
          </Text>
          <TouchableOpacity style={styles.btnPrimary} onPress={() => setPage('reservations')}>
            <Text style={styles.btnPrimaryText}>View My Reservations</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnGhost} onPress={() => {
            setStep(0); setFacilityId(null); setCourtId(null); setSport(null);
            setCourtType(null); setDate(getTodayStr()); setSelectedSlots([]);
            setPlayers(''); setTeammates(''); setIsPublic(false); setConfirmed(false);
          }}>
            <Text style={styles.btnGhostText}>Reserve Another</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const slots = courtId ? getSlotsForCourt(courtId, date, bookings, facilities) : [];

  const toggleSlot = (hour) => {
    setSelectedSlots((prev) => {
      if (prev.includes(hour)) return prev.filter((h) => h !== hour);
      return [...prev, hour].sort((a, b) => a - b);
    });
  };

  const days = Array.from({ length: 14 }, (_, i) => addDays(getTodayStr(), i));

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step > 0 ? setStep(step - 1) : setPage('home')}>
          <Text style={styles.backText}>← {step === 0 ? 'Home' : 'Back'}</Text>
        </TouchableOpacity>
        <Text style={styles.stepLabel}>Step {step + 1} of {STEPS.length}</Text>
      </View>

      {/* Progress */}
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${((step + 1) / STEPS.length) * 100}%` }]} />
      </View>

      <Text style={styles.stepTitle}>{STEPS[step]}</Text>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Step 0: Location */}
        {step === 0 && (
          <View style={styles.options}>
            {Object.values(facilities).map((f) => (
              <TouchableOpacity
                key={f.id}
                style={[styles.optionCard, facilityId === f.id && styles.optionCardActive]}
                onPress={() => { setFacilityId(f.id); setCourtId(null); }}
              >
                <Text style={styles.optionTitle}>{f.name}</Text>
                <Text style={styles.optionSub}>{f.address}</Text>
                <Text style={styles.optionMeta}>{f.courts.length} courts available</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Step 1: Court */}
        {step === 1 && facility && (
          <View style={styles.options}>
            {facility.courts.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[styles.optionCard, courtId === c.id && styles.optionCardActive]}
                onPress={() => setCourtId(c.id)}
              >
                <Text style={styles.optionTitle}>{c.name}</Text>
                <View style={styles.sportBadges}>
                  {c.sports.map((s) => (
                    <View key={s} style={styles.sportBadge}>
                      <Text style={styles.sportBadgeText}>{s}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Step 2: Sport */}
        {step === 2 && court && (
          <View style={styles.options}>
            {court.sports.map((s) => {
              const sportMeta = {
                'basketball':       { icon: '🏀', label: 'Basketball',       hint: 'Half court (min 6) or Full court (max 10)' },
                'indoor-soccer':    { icon: '⚽', label: 'Indoor Soccer',    hint: 'Minimum 8 players' },
                'indoor-volleyball':{ icon: '🏐', label: 'Indoor Volleyball', hint: 'Minimum 6 players' },
                'sand-volleyball':  { icon: '🏐', label: 'Sand Volleyball',  hint: 'Minimum 6 players' },
                'tennis':           { icon: '🎾', label: 'Tennis',           hint: 'Minimum 2 players' },
              };
              const meta = sportMeta[s] || { icon: '🏅', label: s, hint: '' };
              return (
              <TouchableOpacity
                key={s}
                style={[styles.optionCard, sport === s && styles.optionCardActive]}
                onPress={() => { setSport(s); setCourtType(null); }}
              >
                <Text style={styles.optionIcon}>{meta.icon}</Text>
                <Text style={styles.optionTitle}>{meta.label}</Text>
                <Text style={styles.optionSub}>{meta.hint}</Text>
              </TouchableOpacity>
              );
            })}
            {sport === 'basketball' && (
              <View style={{ marginTop: 16 }}>
                <Text style={styles.subSectionTitle}>Court Type</Text>
                {['half', 'full'].map((t) => (
                  <TouchableOpacity
                    key={t}
                    style={[styles.optionCard, courtType === t && styles.optionCardActive]}
                    onPress={() => setCourtType(t)}
                  >
                    <Text style={styles.optionTitle}>{t.charAt(0).toUpperCase() + t.slice(1)} Court</Text>
                    <Text style={styles.optionSub}>{t === 'half' ? 'Min 6 players' : 'Max 10 players'}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <View>
            <Text style={styles.subSectionTitle}>Select Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateScroll}>
              {days.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[styles.dateChip, date === d && styles.dateChipActive]}
                  onPress={() => { setDate(d); setSelectedSlots([]); }}
                >
                  <Text style={[styles.dateChipDay, date === d && styles.dateChipTextActive]}>
                    {getDayOfWeek(d)}
                  </Text>
                  <Text style={[styles.dateChipNum, date === d && styles.dateChipTextActive]}>
                    {new Date(d + 'T12:00:00').getDate()}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[styles.subSectionTitle, { marginTop: 20 }]}>Select Time Slots</Text>
            {slots.length === 0 ? (
              <Text style={styles.noSlots}>No slots available this day</Text>
            ) : (
              <View style={styles.slotsGrid}>
                {slots.map((s) => (
                  <TouchableOpacity
                    key={s.hour}
                    disabled={s.booked}
                    style={[
                      styles.slotChip,
                      s.booked && styles.slotBooked,
                      selectedSlots.includes(s.hour) && styles.slotSelected,
                    ]}
                    onPress={() => toggleSlot(s.hour)}
                  >
                    <Text style={[
                      styles.slotText,
                      s.booked && styles.slotTextBooked,
                      selectedSlots.includes(s.hour) && styles.slotTextSelected,
                    ]}>
                      {formatHour(s.hour)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {selectedSlots.length > 0 && (
              <Text style={styles.slotSummary}>
                Selected: {formatHour(selectedSlots[0])} – {formatHour(selectedSlots[selectedSlots.length - 1] + 1)}
              </Text>
            )}
          </View>
        )}

        {/* Step 4: Players */}
        {step === 4 && (
          <View>
            <Text style={styles.label}>Number of Players</Text>
            {sport === 'basketball' && courtType === 'half' && <Text style={styles.hint}>Minimum 6 players required</Text>}
            {sport === 'basketball' && courtType === 'full' && <Text style={styles.hint}>Maximum 10 players allowed</Text>}
            {sport === 'indoor-soccer' && <Text style={styles.hint}>Minimum 8 players required</Text>}
            {sport === 'indoor-volleyball' && <Text style={styles.hint}>Minimum 6 players required</Text>}
            {sport === 'sand-volleyball' && <Text style={styles.hint}>Minimum 6 players required</Text>}
            {sport === 'tennis' && <Text style={styles.hint}>Minimum 2 players required</Text>}
            <TextInput
              style={styles.input}
              placeholder="e.g. 8"
              placeholderTextColor={COLORS.text3}
              value={players}
              onChangeText={setPlayers}
              keyboardType="number-pad"
            />
            <Text style={[styles.label, { marginTop: 20 }]}>Teammates (optional)</Text>
            <Text style={styles.hint}>Comma-separated names, e.g. John D., Jane S.</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
              placeholder="John D., Jane S., ..."
              placeholderTextColor={COLORS.text3}
              value={teammates}
              onChangeText={setTeammates}
              multiline
            />

            {/* Public / Private toggle */}
            <Text style={[styles.label, { marginTop: 24 }]}>Game Visibility</Text>
            <Text style={styles.hint}>Public games let other players find and join your game.</Text>
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[styles.toggleBtn, !isPublic && styles.toggleBtnActive]}
                onPress={() => setIsPublic(false)}
              >
                <Text style={[styles.toggleText, !isPublic && styles.toggleTextActive]}>🔒  Private</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, isPublic && styles.toggleBtnActiveGreen]}
                onPress={() => setIsPublic(true)}
              >
                <Text style={[styles.toggleText, isPublic && styles.toggleTextActive]}>🌐  Public</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <View style={styles.reviewCard}>
            <Text style={styles.reviewTitle}>Booking Summary</Text>
            {[
              { label: 'Facility', value: facility?.name },
              { label: 'Court', value: court?.name },
              { label: 'Sport', value: sport ? sport.charAt(0).toUpperCase() + sport.slice(1) : '—' },
              { label: 'Court Type', value: courtType ? courtType.charAt(0).toUpperCase() + courtType.slice(1) + ' Court' : 'N/A' },
              { label: 'Date', value: formatDate(date) },
              {
                label: 'Time',
                value: selectedSlots.length > 0
                  ? `${formatHour(selectedSlots[0])} – ${formatHour(selectedSlots[selectedSlots.length - 1] + 1)}`
                  : '—',
              },
              { label: 'Players', value: players || '—' },
              { label: 'Visibility', value: isPublic ? '🌐 Public — others can join' : '🔒 Private' },
            ].map((r) => (
              <View key={r.label} style={styles.reviewRow}>
                <Text style={styles.reviewLabel}>{r.label}</Text>
                <Text style={styles.reviewValue}>{r.value}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom action */}
      <View style={styles.footer}>
        {step < STEPS.length - 1 ? (
          <TouchableOpacity
            style={[styles.btnPrimary, !canNext() && styles.btnDisabled]}
            disabled={!canNext()}
            onPress={() => setStep(step + 1)}
          >
            <Text style={styles.btnPrimaryText}>Continue →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.btnGreen} onPress={handleConfirm}>
            <Text style={styles.btnGreenText}>Confirm Reservation</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backText: { color: COLORS.green, fontWeight: '700', fontSize: FONT_SIZE.md },
  stepLabel: { fontSize: FONT_SIZE.sm, color: COLORS.text3, fontWeight: '600' },
  progressBar: { height: 3, backgroundColor: COLORS.bg3 },
  progressFill: { height: 3, backgroundColor: COLORS.orange },
  stepTitle: { fontSize: FONT_SIZE.xxl, fontWeight: '900', color: COLORS.text, padding: 20, paddingBottom: 8 },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },

  options: { gap: 12 },
  optionCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: 18,
  },
  optionCardActive: {
    borderColor: COLORS.green,
    backgroundColor: 'rgba(57,217,138,0.08)',
  },
  optionIcon: { fontSize: 28, marginBottom: 8 },
  optionTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.text, marginBottom: 4 },
  optionSub: { fontSize: FONT_SIZE.sm, color: COLORS.text2 },
  optionMeta: { fontSize: FONT_SIZE.sm, color: COLORS.green, fontWeight: '600', marginTop: 4 },
  sportBadges: { flexDirection: 'row', gap: 6, marginTop: 6 },
  sportBadge: {
    backgroundColor: COLORS.bg3,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  sportBadgeText: { fontSize: FONT_SIZE.xs, color: COLORS.text2, fontWeight: '600' },
  subSectionTitle: { fontSize: FONT_SIZE.md, fontWeight: '800', color: COLORS.text, marginBottom: 12 },

  dateScroll: { marginBottom: 8 },
  dateChip: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    marginRight: 8,
    minWidth: 56,
  },
  dateChipActive: { backgroundColor: COLORS.orange, borderColor: COLORS.orange },
  dateChipDay: { fontSize: FONT_SIZE.xs, color: COLORS.text3, fontWeight: '700', textTransform: 'uppercase' },
  dateChipNum: { fontSize: FONT_SIZE.lg, fontWeight: '900', color: COLORS.text },
  dateChipTextActive: { color: '#fff' },

  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slotChip: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  slotBooked: { backgroundColor: COLORS.bg3, opacity: 0.4 },
  slotSelected: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  slotText: { fontSize: FONT_SIZE.sm, color: COLORS.text, fontWeight: '600' },
  slotTextBooked: { color: COLORS.text3 },
  slotTextSelected: { color: '#0a1a12', fontWeight: '800' },
  slotSummary: { marginTop: 14, fontSize: FONT_SIZE.sm, color: COLORS.green, fontWeight: '700' },
  noSlots: { fontSize: FONT_SIZE.md, color: COLORS.text2, textAlign: 'center', marginVertical: 40 },

  label: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  hint: { fontSize: FONT_SIZE.sm, color: COLORS.text3, marginBottom: 10 },
  input: {
    backgroundColor: COLORS.bg3,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 14,
    fontSize: FONT_SIZE.md,
    color: COLORS.text,
  },

  reviewCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border2,
    borderRadius: RADIUS.lg,
    padding: 20,
    gap: 12,
  },
  reviewTitle: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: COLORS.text, marginBottom: 8 },
  reviewRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  reviewLabel: { fontSize: FONT_SIZE.sm, color: COLORS.text3, fontWeight: '600' },
  reviewValue: { fontSize: FONT_SIZE.sm, color: COLORS.text, fontWeight: '700', maxWidth: '55%', textAlign: 'right' },

  footer: { padding: 16, borderTopWidth: 1, borderTopColor: COLORS.border },
  btnPrimary: {
    backgroundColor: COLORS.orange,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.4 },
  btnPrimaryText: { color: '#fff', fontSize: FONT_SIZE.lg, fontWeight: '800' },
  btnGreen: {
    backgroundColor: COLORS.green,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnGreenText: { color: '#0a1a12', fontSize: FONT_SIZE.lg, fontWeight: '900' },
  btnGhost: {
    borderWidth: 1,
    borderColor: COLORS.border2,
    borderRadius: RADIUS.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  btnGhostText: { color: COLORS.text2, fontWeight: '700', fontSize: FONT_SIZE.md },

  toggleRow: { flexDirection: 'row', gap: 10, marginTop: 8 },
  toggleBtn: {
    flex: 1, paddingVertical: 12, borderRadius: RADIUS.md, borderWidth: 1,
    borderColor: COLORS.border, backgroundColor: COLORS.bg3, alignItems: 'center',
  },
  toggleBtnActive: { borderColor: COLORS.orange, backgroundColor: 'rgba(244,124,32,0.1)' },
  toggleBtnActiveGreen: { borderColor: COLORS.green, backgroundColor: 'rgba(57,217,138,0.1)' },
  toggleText: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text2 },
  toggleTextActive: { color: COLORS.text },

  confirmPage: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 16 },
  confirmIcon: { fontSize: 64 },
  confirmTitle: { fontSize: 32, fontWeight: '900', color: COLORS.text },
  confirmSub: { fontSize: FONT_SIZE.md, color: COLORS.text2, textAlign: 'center' },
});
