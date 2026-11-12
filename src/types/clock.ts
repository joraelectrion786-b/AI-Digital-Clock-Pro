export type ClockStyleId =
  | 'digital_led'
  | 'flip'
  | 'minimal'
  | 'neon'
  | 'retro'
  | 'nightstand'
  | 'gradient'
  | 'amoled'
  | 'bignumber'
  | 'analog';

export type FontStyleId =
  | 'digital'
  | 'chakra'
  | 'outfit'
  | 'jakarta'
  | 'retro'
  | 'luxury';

export type BackgroundTypeId = 'solid' | 'gradient' | 'wallpaper' | 'custom';

export type AlarmSoundId = 'chime' | 'bell' | 'beep' | 'radar' | 'harp' | 'custom';

export interface ThemePreset {
  id: string;
  name: string;
  primaryColor: string;
  glowColor: string;
  backgroundColor: string;
  bgType: BackgroundTypeId;
  fontStyle: FontStyleId;
  clockStyle: ClockStyleId;
  wallpaperUrl?: string;
  gradient?: string;
  isDark: boolean;
}

export interface ClockSettings {
  clockStyle: ClockStyleId;
  themeId: string;
  primaryColor: string;
  glowColor: string;
  glowIntensity: number; // 0 - 100
  backgroundColor: string;
  backgroundType: BackgroundTypeId;
  activeWallpaper: string;
  customWallpaper: string | null;
  fontFamily: FontStyleId;
  fontSizeScale: number; // 0.8 to 1.5
  is24Hour: boolean;
  showSeconds: boolean;
  showDate: boolean;
  showAmPm: boolean;
  blinkColon: boolean;
  clockAnimation: 'none' | 'pulse' | 'breathe';
  nightMode: boolean;
  brightness: number; // 0.2 to 1.0
  dateFormat: 'full' | 'short' | 'iso';
  language: 'en' | 'es' | 'fr' | 'de' | 'ar' | 'ur' | 'ja' | 'zh';
  volume: number; // 0 - 100
  alarmSound: AlarmSoundId;
  customAlarmAudio: string | null;
  wakeLockEnabled: boolean;
  analogShowTicks: boolean;
  analogSmoothHand: boolean;
}

export interface AlarmItem {
  id: string;
  time: string; // "07:30" (24h internal format)
  label: string;
  enabled: boolean;
  repeatDays: number[]; // 0 = Sun, 1 = Mon ... 6 = Sat. Empty = Once
  sound: AlarmSoundId;
  snoozedUntil?: number | null;
}

export interface WorldClockCity {
  id: string;
  city: string;
  country: string;
  timezone: string;
  flag: string;
}

export interface StopwatchLap {
  lapNumber: number;
  splitTime: number; // ms
  totalTime: number; // ms
}

export interface WeatherData {
  temp: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  city: string;
  icon: string;
}
