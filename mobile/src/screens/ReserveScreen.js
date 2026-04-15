import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, SafeAreaView,
} from 'react-native';
import { COLORS, RADIUS, FONT_SIZE } from '../constants/theme';
import {
  FACILITIES, getTodayStr, addDays, getDayOfWeek,
  formatDate, formatHour, getSlotsForCourt, getCourtById, genId,
} from '../constants/data';
import { SportIcon, CalendarIcon, ClockIcon, ActivityIcon, TickIcon } from '../constants/icons';

const STEPS = ['Location', 'Court', 'Sport', 'Date & Time', 'Visibility', 'Players', 'Review'];

const SPORT_META = {
  basketball: { label: 'Basketball', hint: 'Half court (min 6) or Full court (max 10)' },
  'indoor-soccer': { label: 'Indoor Soccer', hint: 'Minimum 8 players (4v4) — Auxiliary Gym only' },
  'indoor-volleyball': { label: 'Indoor Volleyball', hint: 'Minimum 6 players (3v3)' },
  'sand-volleyball': { label: 'Sand Volleyball', hint: 'Minimum 4 players (2v2)' },
  tennis: { label: 'Tennis', hint: '2–4 players allowed' },
};

const SKILL_LEVELS = [
  { value: 'beginner', label: 'Beginner', desc: 'Playing for Fun' },
  { value: 'intermediate', label: 'Intermediate', desc: 'Slightly Competitive' },
  { value: 'advanced', label: 'Advanced', desc: 'Competitive' },
  { value: 'highlevel', label: 'High-Level', desc: 'D1 Style' },
];

export default function ReserveScreen({ bookings, facilities: propFacilities, onAddBooking, showToast, setPage, user }) {
  const facilities = propFacilities && Object.keys(propFacilities).length > 0 ? propFacilities : FACILITIES;

  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    facilityId: '',
    courtId: '',
    sport: '',
    courtType: '',
    date: getTodayStr(),
    startHour: null,
    duration: 1,
    playerName: user?.name || '',
    email: user?.email || '',
    phone: '',
    teammates: [''],
    isPublic: true,
    skillLevel: 'intermediate',
    gameDescription: '',
  });
  const [confirmed, setConfirmed] = useState(false);

  const update = (key, val) => setData(prev => ({ ...prev, [key]: val }));

  const facility = data.facilityId ? facilities[data.facilityId] : null;
  const court = data.courtId ? getCourtById(data.courtId, facilities) : null;
  const totalPlayers = 1 + data.teammates.filter(t => t.trim()).length;

  const getPrivateValidationError = () => {
    const { sport, courtType } = data;
    if (sport === 'basketball' && courtType === 'half' && totalPlayers < 6) return 'Half court bookings require at least 6 players.';
    if (sport === 'basketball' && courtType === 'full' && totalPlayers > 10) return 'Full court supports up to 10 players.';
    if ((sport === 'soccer' || sport === 'indoor-soccer') && totalPlayers < 8) return 'Soccer requires at least 8 players.';
    if (sport === 'indoor-volleyball' && totalPlayers < 6) return 'Indoor volleyball requires at least 6 players (3v3).';
    if (sport === 'sand-volleyball' && totalPlayers < 4) return 'Sand volleyball requires at least 4 players (2v2).';
    if (sport === 'tennis' && totalPlayers < 2) return 'Tennis requires at least 2 players.';
    if (sport === 'tennis' && totalPlayers > 4) return 'Tennis supports up to 4 players.';
    return null;
  };
  const getPublicValidationError = () => {
    if (totalPlayers < 3) return 'Public games require at least 3 starting players.';
    return null;
  };
  const getValidationError = () => data.isPublic ? getPublicValidationError() : getPrivateValidationError();

  const canProceed = () => {
    if (step === 0) return !!data.facilityId;
    if (step === 1) return !!data.courtId;
    if (step === 2) return !!data.sport && (data.sport !== 'basketball' || !!data.courtType);
    if (step === 3) return data.startHour !== null;
    if (step === 4) return true;
    if (step === 5) return !getValidationError() && totalPlayers >= 1;
    return true;
  };

  const handleConfirm = () => {
    const payload = {
      id: genId(),
      courtId: data.courtId,
      date: data.date,
      startHour: data.startHour,
      endHour: data.startHour + data.duration,
      sport: data.sport,
      courtType: data.courtType || null,
      players: totalPlayers,
      owner: user?.id,
      teammates: data.teammates.filter(t => t.trim()),
      status: 'upcoming',
      isPublic: data.isPublic,
      skillLevel: data.skillLevel,
      gameDescription: data.gameDescription,
    };
    onAddBooking(payload)
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
      <SafeAreaView style={s.safe}>
        <View style={s.confirmPage}>
          <TickIcon size={64} />
          <Text style={s.confirmTitle}>You're booked!</Text>
          <Text style={s.confirmSub}>{court?.name} · {formatDate(data.date)}</Text>
          <TouchableOpacity style={s.btnPrimary} onPress={() => setPage('reservations')}>
            <Text style={s.btnPrimaryText}>View My Reservations</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.btnGhost} onPress={() => {
            setStep(0);
            setData({ facilityId: '', courtId: '', sport: '', courtType: '', date: getTodayStr(), startHour: null, duration: 1, playerName: user?.name || '', email: user?.email || '', phone: '', teammates: [''], isPublic: true, skillLevel: 'intermediate', gameDescription: '' });
            setConfirmed(false);
          }}>
            <Text style={s.btnGhostText}>Reserve Another</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const slots = data.courtId ? getSlotsForCourt(data.courtId, data.date, bookings, facilities) : [];
  const days = Array.from({ length: 14 }, (_, i) => addDays(getTodayStr(), i));

  const toggleSlot = (hour) => {
    update('startHour', data.startHour === hour ? null : hour);
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => step > 0 ? setStep(step - 1) : setPage('home')}>
          <Text style={s.backText}>← {step === 0 ? 'Home' : 'Back'}</Text>
        </TouchableOpacity>
        <Text style={s.stepLabel}>Step {step + 1} of {STEPS.length}</Text>
      </View>

      {/* Progress */}
      <View style={s.progressBar}>
        <View style={[s.progressFill, { width: `${((step + 1) / STEPS.length) * 100}%` }]} />
      </View>

      <Text style={s.stepTitle}>{STEPS[step]}</Text>

      <ScrollView style={s.scroll} contentContainerStyle={s.content}>
        {/* Step 0: Location */}
        {step === 0 && (
          <View style={s.options}>
            {Object.values(facilities).map((f) => (
              <TouchableOpacity
                key={f.id}
                style={[s.optionCard, data.facilityId === f.id && s.optionCardActive]}
                onPress={() => { update('facilityId', f.id); update('courtId', ''); update('sport', ''); update('courtType', ''); }}
              >
                <View style={s.facilityHeader}>
                  <ActivityIcon size={24} />
                  <View style={{ flex: 1 }}>
                    <Text style={s.optionTitle}>{f.name}</Text>
                    <Text style={s.optionSub}>{f.short}</Text>
                  </View>
                  {data.facilityId === f.id && <View style={s.checkDot}><Text style={s.checkDotText}>✓</Text></View>}
                </View>
                <Text style={s.optionDesc}>{f.description}</Text>
                <View style={s.facilityMeta}>
                  <Text style={s.metaText}>{f.courts.length} court{f.courts.length !== 1 ? 's' : ''}</Text>
                  <Text style={s.metaDot}>·</Text>
                  <Text style={s.metaText}>{[...new Set(f.courts.flatMap(c => c.sports))].length} sport{[...new Set(f.courts.flatMap(c => c.sports))].length !== 1 ? 's' : ''}</Text>
                </View>
                <Text style={s.optionAddress}>{f.address}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Step 1: Court */}
        {step === 1 && facility && (
          <View style={s.options}>
            {facility.courts.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[s.optionCard, data.courtId === c.id && s.optionCardActive]}
                onPress={() => { update('courtId', c.id); update('sport', ''); update('courtType', ''); }}
              >
                <View style={s.courtHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.optionTitle}>{c.name}</Text>
                    <Text style={s.optionSub}>{c.gym}</Text>
                  </View>
                  {data.courtId === c.id && <View style={s.checkDot}><Text style={s.checkDotText}>✓</Text></View>}
                </View>
                <View style={s.sportBadges}>
                  {c.sports.map((sp) => (
                    <View key={sp} style={s.sportBadge}>
                      <Text style={s.sportBadgeText}>{(SPORT_META[sp] || { label: sp }).label}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Step 2: Sport */}
        {step === 2 && court && (
          <View style={s.options}>
            {court.sports.map((sp) => {
              const meta = SPORT_META[sp] || { label: sp, hint: '' };
              return (
                <TouchableOpacity
                  key={sp}
                  style={[s.optionCard, data.sport === sp && s.optionCardActive]}
                  onPress={() => { update('sport', sp); if (sp !== 'basketball') update('courtType', ''); }}
                >
                  <View style={s.sportOptionRow}>
                    <SportIcon sport={sp} size={32} />
                    <View style={{ flex: 1 }}>
                      <Text style={s.optionTitle}>{meta.label}</Text>
                      <Text style={s.optionSub}>{meta.hint}</Text>
                    </View>
                    {data.sport === sp && <View style={s.checkDot}><Text style={s.checkDotText}>✓</Text></View>}
                  </View>
                </TouchableOpacity>
              );
            })}
            {data.sport === 'basketball' && (
              <View style={{ marginTop: 16 }}>
                <Text style={s.subSectionTitle}>Court Type</Text>
                {[
                  { id: 'half', label: 'Half Court', desc: 'Min 6 players' },
                  { id: 'full', label: 'Full Court', desc: 'Max 10 players' },
                ].map((t) => (
                  <TouchableOpacity
                    key={t.id}
                    style={[s.optionCard, data.courtType === t.id && s.optionCardActive, { marginBottom: 10 }]}
                    onPress={() => update('courtType', t.id)}
                  >
                    <Text style={s.optionTitle}>{t.label}</Text>
                    <Text style={s.optionSub}>{t.desc}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}

        {/* Step 3: Date & Time */}
        {step === 3 && (
          <View>
            <Text style={s.subSectionTitle}>Select Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.dateScroll}>
              {days.map((d) => (
                <TouchableOpacity
                  key={d}
                  style={[s.dateChip, data.date === d && s.dateChipActive]}
                  onPress={() => { update('date', d); update('startHour', null); }}
                >
                  <Text style={[s.dateChipDay, data.date === d && s.dateChipTextActive]}>{getDayOfWeek(d)}</Text>
                  <Text style={[s.dateChipNum, data.date === d && s.dateChipTextActive]}>{new Date(d + 'T12:00:00').getDate()}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={[s.subSectionTitle, { marginTop: 20 }]}>Select Time</Text>
            {slots.length === 0 ? (
              <Text style={s.noSlots}>No slots available this day</Text>
            ) : (
              <View style={s.slotsGrid}>
                {slots.map((sl) => (
                  <TouchableOpacity
                    key={sl.hour}
                    disabled={sl.booked}
                    style={[s.slotChip, sl.booked && s.slotBooked, data.startHour === sl.hour && s.slotSelected]}
                    onPress={() => toggleSlot(sl.hour)}
                  >
                    <Text style={[s.slotText, sl.booked && s.slotTextBooked, data.startHour === sl.hour && s.slotTextSelected]}>
                      {formatHour(sl.hour)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {data.startHour !== null && (
              <View style={{ marginTop: 20 }}>
                <Text style={s.subSectionTitle}>Duration</Text>
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  {[1, 2].map((d) => (
                    <TouchableOpacity
                      key={d}
                      style={[s.durationChip, data.duration === d && s.durationChipActive]}
                      onPress={() => update('duration', d)}
                    >
                      <Text style={[s.durationText, data.duration === d && s.durationTextActive]}>{d}h</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={s.slotSummary}>
                  {formatHour(data.startHour)} – {formatHour(data.startHour + data.duration)}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Step 4: Visibility */}
        {step === 4 && (
          <View>
            <Text style={s.label}>Game Visibility</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
              {[
                { key: true, label: 'Public', desc: 'Other players can join' },
                { key: false, label: 'Private', desc: 'Invite only' },
              ].map(opt => (
                <TouchableOpacity
                  key={String(opt.key)}
                  onPress={() => update('isPublic', opt.key)}
                  style={[s.visibilityCard, data.isPublic === opt.key && s.visibilityCardActive]}
                >
                  <Text style={[s.visibilityLabel, data.isPublic === opt.key && { color: COLORS.green }]}>{opt.label}</Text>
                  <Text style={s.visibilityDesc}>{opt.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={s.infoCard}>
              <Text style={s.infoCardText}>
                {data.isPublic
                  ? 'This game will be visible to other players. They can join until capacity is reached.'
                  : 'This reservation is private. Only players you add will be included.'}
              </Text>
            </View>

            <Text style={[s.label, { marginTop: 24 }]}>Skill Level</Text>
            <View style={{ gap: 8 }}>
              {SKILL_LEVELS.map(level => (
                <TouchableOpacity
                  key={level.value}
                  onPress={() => update('skillLevel', level.value)}
                  style={[s.skillChip, data.skillLevel === level.value && s.skillChipActive]}
                >
                  <Text style={[s.skillLabel, data.skillLevel === level.value && { color: COLORS.orange }]}>{level.label}</Text>
                  <Text style={s.skillDesc}>{level.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 5: Players */}
        {step === 5 && (
          <View>
            {data.isPublic ? (
              <>
                <Text style={s.sectionHeading}>Public Game Setup</Text>
                <View style={s.fieldGroup}>
                  <Text style={s.label}>Game Description (optional)</Text>
                  <TextInput
                    style={[s.input, { height: 80, textAlignVertical: 'top' }]}
                    placeholder="Describe your game, e.g. 'Casual full-court run, all welcome'"
                    placeholderTextColor={COLORS.text3}
                    value={data.gameDescription}
                    onChangeText={(v) => update('gameDescription', v.slice(0, 300))}
                    multiline
                    maxLength={300}
                  />
                  <Text style={s.charCount}>{data.gameDescription.length}/300</Text>
                </View>
                <View style={s.fieldGroup}>
                  <Text style={s.label}>Your Name</Text>
                  <TextInput style={s.input} value={data.playerName} onChangeText={v => update('playerName', v)} placeholder="Your name" placeholderTextColor={COLORS.text3} />
                </View>
                <View style={s.fieldGroup}>
                  <Text style={s.label}>Email</Text>
                  <TextInput style={s.input} value={data.email} onChangeText={v => update('email', v)} placeholder="you@utdallas.edu" placeholderTextColor={COLORS.text3} keyboardType="email-address" autoCapitalize="none" />
                </View>
                <Text style={[s.label, { marginTop: 16 }]}>Starting Players (min 3)</Text>
                <Text style={s.hint}>Add at least 2 teammates. Others can join via "Join a Game" later.</Text>
                {data.teammates.map((t, i) => (
                  <View key={i} style={s.teammateRow}>
                    <TextInput
                      style={[s.input, { flex: 1 }]}
                      placeholder={`Teammate ${i + 1}`}
                      placeholderTextColor={COLORS.text3}
                      value={t}
                      onChangeText={(v) => {
                        const next = [...data.teammates];
                        next[i] = v;
                        update('teammates', next);
                      }}
                    />
                    {data.teammates.length > 1 && (
                      <TouchableOpacity onPress={() => update('teammates', data.teammates.filter((_, j) => j !== i))} style={s.removeBtn}>
                        <Text style={s.removeBtnText}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity onPress={() => update('teammates', [...data.teammates, ''])} style={s.addTeammateBtn}>
                  <Text style={s.addTeammateBtnText}>+ Add Teammate</Text>
                </TouchableOpacity>
                <View style={s.playerSummary}>
                  <Text style={s.playerSummaryText}>Starting Players: {totalPlayers} (you + {totalPlayers - 1} teammate{totalPlayers - 1 !== 1 ? 's' : ''})</Text>
                </View>
              </>
            ) : (
              <>
                <Text style={s.sectionHeading}>Private Reservation</Text>
                <View style={[s.infoCard, { borderColor: 'rgba(244,124,32,0.3)', backgroundColor: 'rgba(244,124,32,0.06)' }]}>
                  <Text style={[s.infoCardText, { color: COLORS.orange }]}>Only the players you add below will be included in this reservation.</Text>
                </View>
                <View style={s.fieldGroup}>
                  <Text style={s.label}>Your Name</Text>
                  <TextInput style={s.input} value={data.playerName} onChangeText={v => update('playerName', v)} placeholder="Your name" placeholderTextColor={COLORS.text3} />
                </View>
                <View style={s.fieldGroup}>
                  <Text style={s.label}>Email</Text>
                  <TextInput style={s.input} value={data.email} onChangeText={v => update('email', v)} placeholder="you@utdallas.edu" placeholderTextColor={COLORS.text3} keyboardType="email-address" autoCapitalize="none" />
                </View>
                <View style={s.fieldGroup}>
                  <Text style={s.label}>Phone (optional)</Text>
                  <TextInput style={s.input} value={data.phone} onChangeText={v => update('phone', v)} placeholder="(123) 456-7890" placeholderTextColor={COLORS.text3} keyboardType="phone-pad" />
                </View>
                <Text style={[s.label, { marginTop: 16 }]}>Teammates</Text>
                {data.sport === 'basketball' && data.courtType === 'half' && <Text style={s.hint}>Minimum 6 players required for half court</Text>}
                {data.sport === 'basketball' && data.courtType === 'full' && <Text style={s.hint}>Maximum 10 players for full court</Text>}
                {data.sport === 'indoor-soccer' && <Text style={s.hint}>Minimum 8 players required</Text>}
                {data.sport === 'indoor-volleyball' && <Text style={s.hint}>Minimum 6 players required (3v3)</Text>}
                {data.sport === 'sand-volleyball' && <Text style={s.hint}>Minimum 4 players required (2v2)</Text>}
                {data.sport === 'tennis' && <Text style={s.hint}>2–4 players allowed</Text>}
                {data.teammates.map((t, i) => (
                  <View key={i} style={s.teammateRow}>
                    <TextInput
                      style={[s.input, { flex: 1 }]}
                      placeholder={`Teammate ${i + 1}`}
                      placeholderTextColor={COLORS.text3}
                      value={t}
                      onChangeText={(v) => {
                        const next = [...data.teammates];
                        next[i] = v;
                        update('teammates', next);
                      }}
                    />
                    {data.teammates.length > 1 && (
                      <TouchableOpacity onPress={() => update('teammates', data.teammates.filter((_, j) => j !== i))} style={s.removeBtn}>
                        <Text style={s.removeBtnText}>✕</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                <TouchableOpacity onPress={() => update('teammates', [...data.teammates, ''])} style={s.addTeammateBtn}>
                  <Text style={s.addTeammateBtnText}>+ Add Teammate</Text>
                </TouchableOpacity>
                <View style={s.playerSummary}>
                  <Text style={s.playerSummaryText}>Total Players: {totalPlayers} (you + {totalPlayers - 1} teammate{totalPlayers - 1 !== 1 ? 's' : ''})</Text>
                </View>
              </>
            )}
            {getValidationError() && <Text style={s.validationError}>{getValidationError()}</Text>}
          </View>
        )}

        {/* Step 6: Review */}
        {step === 6 && court && facility && (
          <View style={s.reviewCard}>
            <Text style={s.reviewTitle}>Booking Summary</Text>
            <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              <View style={[s.badge, { backgroundColor: data.isPublic ? 'rgba(57,217,138,0.15)' : 'rgba(244,124,32,0.15)' }]}>
                <Text style={[s.badgeText, { color: data.isPublic ? COLORS.green : COLORS.orange }]}>{data.isPublic ? 'Public Game' : 'Private Reservation'}</Text>
              </View>
              <View style={[s.badge, { backgroundColor: 'rgba(244,124,32,0.15)' }]}>
                <Text style={[s.badgeText, { color: COLORS.orange }]}>{SKILL_LEVELS.find(l => l.value === data.skillLevel)?.label || data.skillLevel}</Text>
              </View>
            </View>
            {[
              { label: 'Facility', value: facility.name },
              { label: 'Court', value: court.name },
              { label: 'Sport', value: data.sport.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') },
              data.courtType ? { label: 'Court Type', value: data.courtType === 'full' ? 'Full Court' : 'Half Court' } : null,
              { label: 'Date', value: formatDate(data.date) },
              { label: 'Time', value: data.startHour !== null ? `${formatHour(data.startHour)} – ${formatHour(data.startHour + data.duration)}` : '—' },
              { label: 'Duration', value: `${data.duration} hour${data.duration > 1 ? 's' : ''}` },
              { label: data.isPublic ? 'Starting Players' : 'Players', value: `${totalPlayers}${data.isPublic ? ' (open spots filled via Join a Game)' : ` (you + ${totalPlayers - 1} teammate${totalPlayers - 1 !== 1 ? 's' : ''})`}` },
              data.playerName ? { label: 'Name', value: data.playerName } : null,
              data.email ? { label: 'Email', value: data.email } : null,
            ].filter(Boolean).map((r) => (
              <View key={r.label} style={s.reviewRow}>
                <Text style={s.reviewLabel}>{r.label}</Text>
                <Text style={s.reviewValue}>{r.value}</Text>
              </View>
            ))}
            {data.isPublic && data.gameDescription ? (
              <View style={s.reviewDescBlock}>
                <Text style={s.reviewDescLabel}>Game Description</Text>
                <Text style={s.reviewDescText}>{data.gameDescription}</Text>
              </View>
            ) : null}
            <View style={[s.infoCard, { marginTop: 16 }]}>
              <Text style={s.infoCardText}>
                {data.isPublic
                  ? 'Your reservation will be created and visible in "Join a Game" for others to join until capacity is reached.'
                  : 'Your reservation is confirmed for your group. You can cancel up to 2 hours before the start time.'}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom action */}
      <View style={s.footer}>
        {step < STEPS.length - 1 ? (
          <TouchableOpacity
            style={[s.btnPrimary, !canProceed() && s.btnDisabled]}
            disabled={!canProceed()}
            onPress={() => setStep(step + 1)}
          >
            <Text style={s.btnPrimaryText}>Continue →</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={s.btnGreen} onPress={handleConfirm}>
            <Text style={s.btnGreenText}>Confirm Reservation</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  backText: { color: COLORS.green, fontWeight: '700', fontSize: FONT_SIZE.md },
  stepLabel: { fontSize: FONT_SIZE.sm, color: COLORS.text3, fontWeight: '600' },
  progressBar: { height: 3, backgroundColor: COLORS.bg3 },
  progressFill: { height: 3, backgroundColor: COLORS.orange },
  stepTitle: { fontSize: FONT_SIZE.xxl, fontWeight: '900', color: COLORS.text, padding: 20, paddingBottom: 8 },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 40 },

  options: { gap: 12 },
  optionCard: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.lg, padding: 18 },
  optionCardActive: { borderColor: COLORS.green, backgroundColor: 'rgba(57,217,138,0.08)' },
  optionTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.text, marginBottom: 2 },
  optionSub: { fontSize: FONT_SIZE.sm, color: COLORS.text2, marginTop: 2 },
  optionDesc: { fontSize: FONT_SIZE.sm, color: COLORS.text2, lineHeight: 20, marginTop: 10 },
  optionAddress: { fontSize: FONT_SIZE.xs, color: COLORS.text3, marginTop: 8 },

  facilityHeader: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  facilityMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  metaText: { fontSize: FONT_SIZE.xs, color: COLORS.green, fontWeight: '700' },
  metaDot: { color: COLORS.text3 },

  courtHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  sportBadges: { flexDirection: 'row', gap: 6, marginTop: 4, flexWrap: 'wrap' },
  sportBadge: { backgroundColor: COLORS.bg3, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.full, paddingHorizontal: 8, paddingVertical: 3 },
  sportBadgeText: { fontSize: FONT_SIZE.xs, color: COLORS.text2, fontWeight: '600' },

  sportOptionRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },

  checkDot: { width: 24, height: 24, borderRadius: 12, backgroundColor: COLORS.green, alignItems: 'center', justifyContent: 'center' },
  checkDotText: { color: '#000', fontWeight: '800', fontSize: 12 },

  subSectionTitle: { fontSize: FONT_SIZE.md, fontWeight: '800', color: COLORS.text, marginBottom: 12 },

  dateScroll: { marginBottom: 8 },
  dateChip: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingHorizontal: 14, paddingVertical: 10, alignItems: 'center', marginRight: 8, minWidth: 56 },
  dateChipActive: { backgroundColor: COLORS.orange, borderColor: COLORS.orange },
  dateChipDay: { fontSize: FONT_SIZE.xs, color: COLORS.text3, fontWeight: '700', textTransform: 'uppercase' },
  dateChipNum: { fontSize: FONT_SIZE.lg, fontWeight: '900', color: COLORS.text },
  dateChipTextActive: { color: '#fff' },

  slotsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  slotChip: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingHorizontal: 12, paddingVertical: 8 },
  slotBooked: { backgroundColor: COLORS.bg3, opacity: 0.4 },
  slotSelected: { backgroundColor: COLORS.green, borderColor: COLORS.green },
  slotText: { fontSize: FONT_SIZE.sm, color: COLORS.text, fontWeight: '600' },
  slotTextBooked: { color: COLORS.text3 },
  slotTextSelected: { color: '#0a1a12', fontWeight: '800' },
  slotSummary: { marginTop: 14, fontSize: FONT_SIZE.sm, color: COLORS.green, fontWeight: '700' },
  noSlots: { fontSize: FONT_SIZE.md, color: COLORS.text2, textAlign: 'center', marginVertical: 40 },

  durationChip: { flex: 1, backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, paddingVertical: 12, alignItems: 'center' },
  durationChipActive: { backgroundColor: COLORS.orange, borderColor: COLORS.orange },
  durationText: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text2 },
  durationTextActive: { color: '#fff' },

  label: { fontSize: FONT_SIZE.md, fontWeight: '700', color: COLORS.text, marginBottom: 8 },
  hint: { fontSize: FONT_SIZE.sm, color: COLORS.text3, marginBottom: 10 },
  input: { backgroundColor: COLORS.bg3, borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, padding: 14, fontSize: FONT_SIZE.md, color: COLORS.text },
  charCount: { fontSize: FONT_SIZE.xs, color: COLORS.text3, marginTop: 6, textAlign: 'right' },
  fieldGroup: { marginBottom: 16 },
  sectionHeading: { fontSize: FONT_SIZE.xl, fontWeight: '800', color: COLORS.text, marginBottom: 16 },

  visibilityCard: { flex: 1, padding: 16, borderRadius: RADIUS.md, borderWidth: 2, borderColor: COLORS.border, backgroundColor: COLORS.bg2 },
  visibilityCardActive: { borderColor: COLORS.green, backgroundColor: 'rgba(57,217,138,0.08)' },
  visibilityLabel: { fontWeight: '700', color: COLORS.text, marginBottom: 4, fontSize: FONT_SIZE.md },
  visibilityDesc: { fontSize: FONT_SIZE.xs, color: COLORS.text3 },

  skillChip: { paddingHorizontal: 14, paddingVertical: 12, borderRadius: RADIUS.md, borderWidth: 2, borderColor: COLORS.border, backgroundColor: COLORS.bg2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  skillChipActive: { borderColor: COLORS.orange, backgroundColor: 'rgba(244,124,32,0.08)' },
  skillLabel: { fontWeight: '700', color: COLORS.text2, fontSize: FONT_SIZE.md },
  skillDesc: { fontSize: FONT_SIZE.sm, color: COLORS.text3 },

  infoCard: { backgroundColor: 'rgba(57,217,138,0.06)', borderWidth: 1, borderColor: 'rgba(57,217,138,0.2)', borderRadius: RADIUS.md, padding: 14 },
  infoCardText: { fontSize: FONT_SIZE.sm, color: COLORS.text2, lineHeight: 20 },

  teammateRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  removeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(247,95,95,0.15)', alignItems: 'center', justifyContent: 'center' },
  removeBtnText: { color: COLORS.red, fontWeight: '700', fontSize: 14 },
  addTeammateBtn: { paddingVertical: 10, alignItems: 'center', borderWidth: 1, borderColor: COLORS.border, borderRadius: RADIUS.md, borderStyle: 'dashed', marginTop: 4, marginBottom: 16 },
  addTeammateBtnText: { color: COLORS.green, fontWeight: '700', fontSize: FONT_SIZE.sm },
  playerSummary: { backgroundColor: COLORS.bg2, borderRadius: RADIUS.md, padding: 12, alignItems: 'center' },
  playerSummaryText: { color: COLORS.text2, fontWeight: '600', fontSize: FONT_SIZE.sm },
  validationError: { color: COLORS.red, fontWeight: '700', fontSize: FONT_SIZE.sm, marginTop: 12, textAlign: 'center' },

  reviewCard: { backgroundColor: COLORS.card, borderWidth: 1, borderColor: COLORS.border2, borderRadius: RADIUS.lg, padding: 20, gap: 4 },
  reviewTitle: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: RADIUS.full },
  badgeText: { fontSize: FONT_SIZE.xs, fontWeight: '700' },
  reviewRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  reviewLabel: { fontSize: FONT_SIZE.sm, color: COLORS.text3, fontWeight: '600' },
  reviewValue: { fontSize: FONT_SIZE.sm, color: COLORS.text, fontWeight: '700', maxWidth: '55%', textAlign: 'right' },
  reviewDescBlock: { marginTop: 12, padding: 12, backgroundColor: COLORS.bg2, borderRadius: RADIUS.md },
  reviewDescLabel: { fontSize: FONT_SIZE.xs, color: COLORS.text3, fontWeight: '700', marginBottom: 6 },
  reviewDescText: { fontSize: FONT_SIZE.sm, color: COLORS.text, lineHeight: 20 },

  footer: { padding: 16, borderTopWidth: 1, borderTopColor: COLORS.border },
  btnPrimary: { backgroundColor: COLORS.orange, borderRadius: RADIUS.md, paddingVertical: 16, alignItems: 'center' },
  btnDisabled: { opacity: 0.4 },
  btnPrimaryText: { color: '#fff', fontSize: FONT_SIZE.lg, fontWeight: '800' },
  btnGreen: { backgroundColor: COLORS.green, borderRadius: RADIUS.md, paddingVertical: 16, alignItems: 'center' },
  btnGreenText: { color: '#0a1a12', fontSize: FONT_SIZE.lg, fontWeight: '900' },
  btnGhost: { borderWidth: 1, borderColor: COLORS.border2, borderRadius: RADIUS.md, paddingVertical: 14, alignItems: 'center', marginTop: 10 },
  btnGhostText: { color: COLORS.text2, fontWeight: '700', fontSize: FONT_SIZE.md },

  confirmPage: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40, gap: 16 },
  confirmTitle: { fontSize: 32, fontWeight: '900', color: COLORS.text },
  confirmSub: { fontSize: FONT_SIZE.md, color: COLORS.text2, textAlign: 'center' },
});
