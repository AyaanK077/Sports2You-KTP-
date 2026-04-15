import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, FONT_SIZE } from '../constants/theme';

export default function SkillLevelChip({ skillLevel, size = 'md', style }) {
  const skillLabels = {
    beginner: { label: 'Beginner', color: COLORS.green },
    intermediate: { label: 'Intermediate', color: COLORS.yellow },
    advanced: { label: 'Advanced', color: COLORS.orange },
    highlevel: { label: 'High-Level', color: COLORS.red },
  };

  const skill = skillLabels[skillLevel] || { label: 'Unknown', color: COLORS.text3 };
  const isSm = size === 'sm';

  return (
    <View style={[styles.chip, isSm ? styles.chipSm : styles.chipMd, { borderColor: skill.color }, style]}>
      <Text style={[styles.text, isSm ? styles.textSm : styles.textMd, { color: skill.color }]}>
        {skill.label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1.2,
    borderRadius: RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSm: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipMd: {
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  text: {
    fontWeight: '600',
  },
  textSm: {
    fontSize: FONT_SIZE.xs,
  },
  textMd: {
    fontSize: FONT_SIZE.sm,
  },
});
