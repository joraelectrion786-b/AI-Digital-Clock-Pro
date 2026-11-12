import React from 'react';
import { ClockSettings, AlarmItem } from '../../types/clock';
import { getTimeParts, getFormattedDate } from '../../utils/helpers';
import { Bell, BatteryCharging, Battery, Moon } from 'lucide-react';

interface NightStandClockProps {
  currentTime: Date;
  settings: ClockSettings;
  isLandscape?: boolean;
  nextAlarm?: AlarmItem | null;
  batteryLevel?: number | null;
  isCharging?: boolean;
  onExitNightStand?: () => void;
}

export const NightStandClock: React.FC<NightStandClockProps> = ({
  currentTime,
  settings,
  isLandscape,
  nextAlarm,
  batteryLevel,
  isCharging,
  onExitNightStand,
}) => {
  const { hours, minutes, seconds, ampm } = getTimeParts(currentTime, settings.is24Hour);
  const colonVisible = !settings.blinkColon || currentTime.getSeconds() % 2 === 0;

  // Deep crimson nightstand red with zero blue-light emission
  const redColor = '#ff2a3b';
  const redGlow = 'rgba(255, 42, 59, 0.5)';

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black select-none px-4 py-8">
      {/* Top Ambient Status Bar in Night Stand */}
      <div className="w-full max-w-4xl flex items-center justify-between px-6 py-2 text-red-600/70 text-xs sm:text-sm font-digital tracking-widest">
        <div className="flex items-center gap-2">
          <Moon className="w-4 h-4 text-red-500 animate-pulse" />
          <span>NIGHT STAND · BEDROOM MODE</span>
        </div>

        <div className="flex items-center gap-4">
          {nextAlarm && (
            <div className="flex items-center gap-1.5 text-red-500">
              <Bell className="w-3.5 h-3.5" />
              <span>{nextAlarm.time} {nextAlarm.label ? `(${nextAlarm.label})` : ''}</span>
            </div>
          )}
          {batteryLevel !== null && batteryLevel !== undefined && (
            <div className="flex items-center gap-1">
              {isCharging ? <BatteryCharging className="w-3.5 h-3.5" /> : <Battery className="w-3.5 h-3.5" />}
              <span>{Math.round(batteryLevel * 100)}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Massive Crimson Clock Display */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto">
        <div className="flex items-baseline justify-center tracking-wider">
          {/* Hours */}
          <span
            className="text-8xl sm:text-[12rem] md:text-[14rem] lg:text-[17rem] font-bold font-digital tabular-nums leading-none"
            style={{
              color: redColor,
              textShadow: `0 0 25px ${redGlow}, 0 0 60px ${redGlow}`,
            }}
          >
            {hours}
          </span>

          {/* Colon */}
          <span
            className={`text-6xl sm:text-[9rem] md:text-[11rem] lg:text-[13rem] font-bold font-digital leading-none mx-1 sm:mx-3 transition-opacity ${
              colonVisible ? 'opacity-100' : 'opacity-20'
            }`}
            style={{
              color: redColor,
              textShadow: `0 0 25px ${redGlow}`,
            }}
          >
            :
          </span>

          {/* Minutes */}
          <span
            className="text-8xl sm:text-[12rem] md:text-[14rem] lg:text-[17rem] font-bold font-digital tabular-nums leading-none"
            style={{
              color: redColor,
              textShadow: `0 0 25px ${redGlow}, 0 0 60px ${redGlow}`,
            }}
          >
            {minutes}
          </span>

          {/* Seconds & AM/PM Column */}
          <div className="flex flex-col justify-end ml-3 sm:ml-6 pb-4 sm:pb-12 gap-2">
            {!settings.is24Hour && (
              <span
                className="text-sm sm:text-2xl md:text-3xl font-digital font-bold tracking-widest text-red-500/80"
                style={{ textShadow: `0 0 15px ${redGlow}` }}
              >
                {ampm}
              </span>
            )}
            {settings.showSeconds && (
              <span
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-digital font-bold tabular-nums text-red-500/90"
                style={{ textShadow: `0 0 15px ${redGlow}` }}
              >
                {seconds}
              </span>
            )}
          </div>
        </div>

        {/* Date Display */}
        <div
          className="text-sm sm:text-xl md:text-2xl font-digital tracking-widest uppercase mt-4 text-red-500/80 text-center"
          style={{ textShadow: `0 0 12px ${redGlow}` }}
        >
          {getFormattedDate(currentTime, settings.language, settings.dateFormat)}
        </div>
      </div>

      {/* Discreet bottom advice */}
      <div className="text-[11px] text-red-900/60 font-digital tracking-wider">
        SCREEN WAKE LOCK ACTIVE · TAP TO ADJUST OR EXIT
      </div>
    </div>
  );
};
