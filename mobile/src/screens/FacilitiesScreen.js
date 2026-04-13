import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, RADIUS, FONT_SIZE } from '../constants/theme';

function FacilityDetail({ facility, onBack, onReserve }) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>{facility.short}</Text>
        <View style={{ width: 60 }} />
      </View>
      <ScrollView contentContainerStyle={styles.detailContent}>
        <Text style={styles.facilityName}>{facility.name}</Text>
        <Text style={styles.facilityAddress}>📍 {facility.address}</Text>
        <Text style={styles.facilityDesc}>{facility.description}</Text>

        <Text style={styles.subTitle}>Courts</Text>
        {facility.courts.map((court) => (
          <View key={court.id} style={styles.courtCard}>
            <Text style={styles.courtName}>{court.name}</Text>
            <View style={styles.sportBadges}>
              {court.sports.map((s) => (
                <View key={s} style={[styles.sportBadge, s === 'basketball' ? styles.badgeOrange : styles.badgeGreen]}>
                  <Text style={styles.sportBadgeText}>{s}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <Text style={styles.subTitle}>Hours</Text>
        <View style={styles.hoursCard}>
          {Object.entries(facility.hours).map(([day, hrs]) => (
            <View key={day} style={styles.hoursRow}>
              <Text style={styles.hoursDay}>{day}</Text>
              <Text style={styles.hoursTime}>{hrs}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.btnPrimary} onPress={onReserve}>
          <Text style={styles.btnPrimaryText}>Reserve a Court Here</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function FacilitiesScreen({ facilities = {}, setPage }) {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return (
      <FacilityDetail
        facility={selected}
        onBack={() => setSelected(null)}
        onReserve={() => setPage('reserve')}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Facilities</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        {Object.values(facilities || {}).map((f) => (
          <TouchableOpacity key={f.id} style={styles.facilityCard} onPress={() => setSelected(f)}>
            <View style={styles.facilityCardHeader}>
              <Text style={styles.facilityCardName}>{f.name}</Text>
              <View style={styles.courtCount}>
                <Text style={styles.courtCountText}>{f.courts.length} courts</Text>
              </View>
            </View>
            <Text style={styles.facilityCardDesc}>{f.description}</Text>
            <Text style={styles.facilityCardAddress}>📍 {f.address}</Text>
            <View style={styles.courtList}>
              {f.courts.map((c) => (
                <View key={c.id} style={styles.courtBadge}>
                  <Text style={styles.courtBadgeText}>{c.name}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.viewMore}>View details →</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    padding: 20,
    paddingTop: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  pageTitle: { fontSize: FONT_SIZE.xxl, fontWeight: '800', color: COLORS.text },
  content: { padding: 16, paddingBottom: 40 },

  facilityCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: 20,
    marginBottom: 14,
  },
  facilityCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  facilityCardName: { fontSize: FONT_SIZE.xl, fontWeight: '800', color: COLORS.text, flex: 1 },
  courtCount: {
    backgroundColor: 'rgba(57,217,138,0.12)',
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: COLORS.border2,
  },
  courtCountText: { fontSize: FONT_SIZE.xs, color: COLORS.green, fontWeight: '700' },
  facilityCardDesc: { fontSize: FONT_SIZE.sm, color: COLORS.text2, lineHeight: 20, marginBottom: 8 },
  facilityCardAddress: { fontSize: FONT_SIZE.xs, color: COLORS.text3, marginBottom: 12 },
  courtList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  courtBadge: {
    backgroundColor: COLORS.bg3,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  courtBadgeText: { fontSize: FONT_SIZE.xs, color: COLORS.text2, fontWeight: '600' },
  viewMore: { fontSize: FONT_SIZE.sm, color: COLORS.green, fontWeight: '600' },

  // Detail view
  detailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: { paddingVertical: 8, paddingHorizontal: 4, minWidth: 60 },
  backText: { color: COLORS.green, fontWeight: '700', fontSize: FONT_SIZE.md },
  detailContent: { padding: 20, paddingBottom: 60 },
  facilityName: { fontSize: 28, fontWeight: '900', color: COLORS.text, marginBottom: 6 },
  facilityAddress: { fontSize: FONT_SIZE.sm, color: COLORS.text3, marginBottom: 14 },
  facilityDesc: { fontSize: FONT_SIZE.md, color: COLORS.text2, lineHeight: 24, marginBottom: 28 },
  subTitle: { fontSize: FONT_SIZE.lg, fontWeight: '800', color: COLORS.text, marginBottom: 12 },
  courtCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courtName: { fontSize: FONT_SIZE.md, fontWeight: '600', color: COLORS.text, flex: 1 },
  sportBadges: { flexDirection: 'row', gap: 6 },
  sportBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 1,
  },
  badgeOrange: { backgroundColor: 'rgba(244,124,32,0.12)', borderColor: 'rgba(244,124,32,0.3)' },
  badgeGreen: { backgroundColor: 'rgba(57,217,138,0.12)', borderColor: COLORS.border2 },
  sportBadgeText: { fontSize: FONT_SIZE.xs, fontWeight: '700', color: COLORS.text2 },
  hoursCard: {
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.lg,
    padding: 16,
    marginBottom: 28,
    gap: 8,
  },
  hoursRow: { flexDirection: 'row', justifyContent: 'space-between' },
  hoursDay: { fontSize: FONT_SIZE.sm, color: COLORS.text2, fontWeight: '600', width: 100 },
  hoursTime: { fontSize: FONT_SIZE.sm, color: COLORS.text },
  btnPrimary: {
    backgroundColor: COLORS.orange,
    borderRadius: RADIUS.md,
    paddingVertical: 16,
    alignItems: 'center',
  },
  btnPrimaryText: { color: '#fff', fontSize: FONT_SIZE.lg, fontWeight: '800' },
});
