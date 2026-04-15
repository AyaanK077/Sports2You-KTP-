import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, RADIUS, FONT_SIZE } from '../constants/theme';

export default function LandingScreen({ setPage, facilities = {} }) {
  const facilityList = Object.values(facilities || {});
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.logo}>SPORTS2YOU</Text>
          <View style={styles.eyebrow}>
            <Text style={styles.eyebrowText}>◉  UTD Campus Recreation</Text>
          </View>
          <Text style={styles.heroTitle}>
            Book Courts.{'\n'}
            <Text style={styles.heroOrange}>Skip the</Text>
            {'\n'}Conflicts.
          </Text>
          <Text style={styles.heroSub}>
            Reserve basketball and soccer courts at the AC and Rec West — no more showing up to a taken court.
          </Text>
          <View style={styles.ctaRow}>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => setPage('signup')}>
              <Text style={styles.btnPrimaryText}>Get Started Free</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnGhost} onPress={() => setPage('login')}>
              <Text style={styles.btnGhostText}>Sign In</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.statsRow}>
            {[
              { num: '5', label: 'Courts', color: COLORS.orange },
              { num: '2', label: 'Facilities', color: COLORS.green },
              { num: '18h', label: 'Daily Availability', color: COLORS.orange },
            ].map((s) => (
              <View key={s.label} style={styles.statItem}>
                <Text style={[styles.statNum, { color: s.color }]}>{s.num}</Text>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* How it works */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>How it works</Text>
          <Text style={styles.sectionTitle}>Three steps to your court</Text>
          {[
            { iconSrc: require('../assets/calendar.png'), title: 'Pick your slot', desc: 'Choose a facility, court, and time slot from real-time availability. No phone calls, no waiting.' },
            { iconSrc: require('../assets/basketball.png'), title: 'Set your sport', desc: 'Reserve for basketball (half or full court) or soccer. Player minimums are enforced automatically.' },
            { iconSrc: require('../assets/tick.png'), title: 'Confirm & play', desc: 'Add your teammates, confirm your booking, and walk in with confidence.' },
          ].map((f) => (
            <View key={f.title} style={styles.featureCard}>
              <Image source={f.iconSrc} style={{ width: 28, height: 28, marginBottom: 10 }} resizeMode="contain" />
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          ))}
        </View>

        {/* Facilities */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Our Facilities</Text>
          <Text style={styles.sectionTitle}>Two locations, five courts</Text>
            {facilityList.map((f) => (
            <TouchableOpacity key={f.id} style={styles.venueCard} onPress={() => setPage('signup')}>
              <Text style={styles.venueName}>{f.name}</Text>
              <Text style={styles.venueDesc}>{f.description}</Text>
              <View style={styles.courtBadges}>
                {f.courts.map((c) => (
                  <View key={c.id} style={styles.courtBadge}>
                    <Text style={styles.courtBadgeText}>{c.name}</Text>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  content: { paddingBottom: 60 },

  hero: {
    padding: 28,
    paddingTop: 40,
    alignItems: 'flex-start',
  },
  logo: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.orange,
    marginBottom: 24,
    letterSpacing: 2,
  },
  eyebrow: {
    backgroundColor: 'rgba(57,217,138,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(57,217,138,0.3)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 28,
  },
  eyebrowText: {
    color: COLORS.green,
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.text,
    lineHeight: 46,
    marginBottom: 20,
  },
  heroOrange: { color: COLORS.orange },
  heroSub: {
    fontSize: FONT_SIZE.md,
    color: COLORS.text2,
    lineHeight: 26,
    marginBottom: 32,
  },
  ctaRow: { flexDirection: 'row', gap: 12, marginBottom: 40 },
  btnPrimary: {
    backgroundColor: COLORS.orange,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
  },
  btnPrimaryText: { color: '#fff', fontWeight: '800', fontSize: FONT_SIZE.md },
  btnGhost: {
    borderWidth: 1,
    borderColor: COLORS.border2,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: RADIUS.md,
    backgroundColor: 'rgba(57,217,138,0.08)',
  },
  btnGhostText: { color: COLORS.text2, fontWeight: '700', fontSize: FONT_SIZE.md },

  statsRow: { flexDirection: 'row', gap: 32 },
  statItem: { alignItems: 'flex-start' },
  statNum: { fontSize: 28, fontWeight: '900' },
  statLabel: { fontSize: FONT_SIZE.xs, color: COLORS.text2 },

  section: { padding: 28, borderTopWidth: 1, borderTopColor: COLORS.border },
  sectionLabel: {
    fontSize: FONT_SIZE.xs,
    fontWeight: '800',
    color: COLORS.green,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.xxl,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: 20,
  },

  featureCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: 20,
    marginBottom: 12,
  },
  featureIcon: { fontSize: 28, marginBottom: 10 },
  featureTitle: { fontSize: FONT_SIZE.lg, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  featureDesc: { fontSize: FONT_SIZE.sm, color: COLORS.text2, lineHeight: 20 },

  venueCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: 20,
    marginBottom: 12,
  },
  venueName: { fontSize: FONT_SIZE.xl, fontWeight: '700', color: COLORS.text, marginBottom: 6 },
  venueDesc: { fontSize: FONT_SIZE.sm, color: COLORS.text2, marginBottom: 12, lineHeight: 20 },
  courtBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  courtBadge: {
    backgroundColor: 'rgba(57,217,138,0.08)',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  courtBadgeText: { fontSize: FONT_SIZE.xs, color: COLORS.text2, fontWeight: '600' },
});
