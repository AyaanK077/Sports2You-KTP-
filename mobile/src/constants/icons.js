import React from 'react';
import { Image } from 'react-native';

const basketball = require('../assets/basketball.png');
const soccer = require('../assets/soccer.png');
const tennis = require('../assets/tennis.png');
const volleyball = require('../assets/volleyball.png');
const calendar = require('../assets/calendar.png');
const clock = require('../assets/clock.png');
const stats = require('../assets/stats.png');
const activity = require('../assets/activity.png');
const tick = require('../assets/tick.png');

export const SPORT_ICONS = {
  basketball,
  'indoor-soccer': soccer,
  tennis,
  'indoor-volleyball': volleyball,
  'sand-volleyball': volleyball,
};

export function SportIcon({ sport, size = 24, style }) {
  const source = SPORT_ICONS[sport] || basketball;
  return <Image source={source} style={[{ width: size, height: size }, style]} resizeMode="contain" />;
}

export function CalendarIcon({ size = 14, style }) {
  return <Image source={calendar} style={[{ width: size, height: size }, style]} resizeMode="contain" />;
}

export function ClockIcon({ size = 14, style }) {
  return <Image source={clock} style={[{ width: size, height: size }, style]} resizeMode="contain" />;
}

export function StatsIcon({ size = 14, style }) {
  return <Image source={stats} style={[{ width: size, height: size }, style]} resizeMode="contain" />;
}

export function ActivityIcon({ size = 14, style }) {
  return <Image source={activity} style={[{ width: size, height: size }, style]} resizeMode="contain" />;
}

export function TickIcon({ size = 14, style }) {
  return <Image source={tick} style={[{ width: size, height: size }, style]} resizeMode="contain" />;
}

export function LocationIcon({ size = 14, style }) {
  return <Image source={activity} style={[{ width: size, height: size }, style]} resizeMode="contain" />;
}

export function StarRating({ rating, size = 20, filled = '#F49C20', empty = '#555' }) {
  const stars = [];
  const full = Math.floor(rating);
  for (let i = 0; i < 5; i++) {
    stars.push(
      <Image
        key={i}
        source={stats}
        style={{
          width: size,
          height: size,
          tintColor: i < full ? filled : empty,
          opacity: i < full ? 1 : 0.4,
        }}
        resizeMode="contain"
      />
    );
  }
  return stars;
}
