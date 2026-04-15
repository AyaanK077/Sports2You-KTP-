import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet, SafeAreaView } from 'react-native';
import { COLORS, RADIUS, FONT_SIZE } from '../constants/theme';
import SkillLevelChip from '../components/SkillLevelChip';
import { SKILL_LEVELS } from '../constants/gamesMockData';
import { SportIcon } from '../constants/icons';

export default function CreateGameScreen({ setPage, showToast }) {
  const [sport, setSport] = useState('basketball');
  const [skillLevel, setSkillLevel] = useState('intermediate');
  const [date, setDate] = useState('2026-04-15');
  const [time, setTime] = useState('18:00');
  const [maxPlayers, setMaxPlayers] = useState('10');
  const [description, setDescription] = useState('');

  const sports = [
    { id: 'basketball', label: 'Basketball' },
    { id: 'indoor-soccer', label: 'Soccer' },
    { id: 'tennis', label: 'Tennis' },
    { id: 'indoor-volleyball', label: 'Volleyball' },
  ];

  const handleCreateGame = () => {
    if (!sport || !skillLevel || !date || !time || !maxPlayers) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    showToast('Game created successfully!', 'success');
    setPage('my-games');
  };

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.pageHeader}>
        <TouchableOpacity onPress={() => setPage('join-game')}>
          <Text style={styles.backBtn}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.pageTitle}>Create a Game</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        {/* Sport Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choose Sport</Text>
          <View style={styles.sportGrid}>
            {sports.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.sportButton,
                  sport === s.id && styles.sportButtonSelected,
                ]}
                onPress={() => setSport(s.id)}
              >
                <SportIcon sport={s.id} size={32} />
                <Text style={[
                  styles.sportLabel,
                  sport === s.id && styles.sportLabelSelected,
                ]}>
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Skill Level */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skill Level</Text>
          <View style={styles.skillLevelGrid}>
            {Object.values(SKILL_LEVELS).map((skill) => (
              <TouchableOpacity
                key={skill.id}
                style={[
                  styles.skillButton,
                  skillLevel === skill.id && styles.skillButtonSelected,
                ]}
                onPress={() => setSkillLevel(skill.id)}
              >
                <Text style={[
                  styles.skillButtonText,
                  skillLevel === skill.id && styles.skillButtonTextSelected,
                ]}>
                  {skill.label.split(' / ')[0]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date and Time */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date & Time</Text>
          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Date</Text>
              <TextInput
                style={styles.input}
                value={date}
                onChangeText={setDate}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={COLORS.text3}
              />
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Time</Text>
              <TextInput
                style={styles.input}
                value={time}
                onChangeText={setTime}
                placeholder="HH:MM"
                placeholderTextColor={COLORS.text3}
              />
            </View>
          </View>
        </View>

        {/* Max Players */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Max Players</Text>
          <View style={styles.inputGroup}>
            <TextInput
              style={styles.input}
              value={maxPlayers}
              onChangeText={setMaxPlayers}
              keyboardType="number-pad"
              placeholder="How many players?"
              placeholderTextColor={COLORS.text3}
            />
          </View>
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About Your Game</Text>
          <TextInput
            style={[styles.input, styles.descriptionInput]}
            value={description}
            onChangeText={(text) => setDescription(text.slice(0, 200))}
            placeholder="Describe your game (e.g., casual, competitive, etc.)"
            placeholderTextColor={COLORS.text3}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>
            {description.length}/200
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateGame}
          >
            <Text style={styles.createButtonText}>Create Game</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setPage('join-game')}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.green,
  },
  pageTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
  },
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32 },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: FONT_SIZE.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 12,
  },
  sportGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  sportButton: {
    flex: 1,
    minWidth: '48%',
    backgroundColor: COLORS.bg2,
    borderRadius: RADIUS.md,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sportButtonSelected: {
    backgroundColor: COLORS.orange,
    borderColor: COLORS.orange,
  },
  sportIcon: {
    marginBottom: 8,
  },
  sportLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text2,
    textAlign: 'center',
  },
  sportLabelSelected: {
    color: '#fff',
  },
  skillLevelGrid: {
    gap: 10,
  },
  skillButton: {
    backgroundColor: COLORS.bg2,
    borderRadius: RADIUS.md,
    padding: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  skillButtonSelected: {
    backgroundColor: COLORS.green,
    borderColor: COLORS.green,
  },
  skillButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '600',
    color: COLORS.text2,
  },
  skillButtonTextSelected: {
    color: '#000',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: FONT_SIZE.sm,
    fontWeight: '600',
    color: COLORS.text2,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.bg2,
    borderRadius: RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    color: COLORS.text,
    padding: 12,
    fontSize: FONT_SIZE.md,
  },
  descriptionInput: {
    textAlignVertical: 'top',
    minHeight: 100,
  },
  charCount: {
    fontSize: FONT_SIZE.xs,
    color: COLORS.text3,
    marginTop: 8,
    textAlign: 'right',
  },
  actionButtons: {
    gap: 12,
    marginBottom: 32,
  },
  createButton: {
    backgroundColor: COLORS.green,
    borderRadius: RADIUS.lg,
    padding: 14,
    alignItems: 'center',
  },
  createButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: '#000',
  },
  cancelButton: {
    borderWidth: 2,
    borderColor: COLORS.text3,
    borderRadius: RADIUS.lg,
    padding: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: FONT_SIZE.md,
    fontWeight: '700',
    color: COLORS.text3,
  },
});
