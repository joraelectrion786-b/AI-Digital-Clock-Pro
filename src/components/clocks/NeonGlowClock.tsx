import React from 'react';
import { ClockSettings } from '../../types/clock';
import { getTimeParts } from '../../utils/helpers';

interface NeonGlowClockProps {
  currentTime: Date;
  settings: ClockSettings;
  isLandscape?: boolean;
}

export const NeonGlowClock: React.FC<NeonGlowClockProps> = ({ currentTime, settings }) => {
  const { hours, minutes, seconds, ampm } = getTimeParts(currentTime, settings.is24Hour);
  const colonVisible = !settings.blinkColon || currentTime.getSeconds() % 2 === 0;

  const glowSpread = Math.max(15, settings.glowIntensity * 0.4);
  const neonShadow = `
    0 0 5px #ffffff,
    0 0 10px ${settings.primaryColor},
    0 0 ${glowSpread}px ${settings.glowColor},
    0 0 ${glowSpread * 2}px ${settings.glowColor},
    0 0 ${glowSpread * 3}px ${settings.glowColor}
  `;

  return (
    <div className="flex flex-col items-center justify-center select-none py-8">
      {/* Background ambient bloom circle */}
      <div
        className="absolute w-96 h-96 rounded-full blur-[100px] pointer-events-none opacity-25"
        style={{ backgroundColor: settings.glowColor }}
      />

      <div className="relative flex items-baseline justify-center gap-2 sm:gap-4 z-10">
        <span
          className="text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-bold font-chakra tracking-wider tabular-nums animate-neon-pulse"
          style={{
            color: '#ffffff',
            textShadow: neonShadow,
          }}
        >
          {hours}
        </span>

        <span
          className={`text-5xl sm:text-7xl md:text-8xl lg:text-[10rem] font-bold font-chakra transition-opacity duration-200 ${
            colonVisible ? 'opacity-100' : 'opacity-15'
          }`}
          style={{
            color: '#ffffff',
            textShadow: neonShadow,
          }}
        >
          :
        </span>

        <span
          className="text-6xl sm:text-8xl md:text-9xl lg:text-[11rem] font-bold font-chakra tracking-wider tabular-nums animate-neon-pulse"
          style={{
            color: '#ffffff',
            textShadow: neonShadow,
          }}
        >
          {minutes}
        </span>

        {/* Seconds & AM/PM */}
        <div className="flex flex-col items-start justify-end ml-2 sm:ml-4 pb-2 sm:pb-6 gap-2">
          {settings.showAmPm && !settings.is24Hour && (
            <span
              className="text-sm sm:text-lg md:text-xl font-bold font-chakra px-2 py-0.5 rounded border border-white/20"
              style={{
                color: '#ffffff',
                textShadow: neonShadow,
              }}
            >
              {ampm}
            </span>
          )}
          {settings.showSeconds && (
            <span
              className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-chakra tabular-nums"
              style={{
                color: '#ffffff',
                textShadow: neonShadow,
              }}
            >
              {seconds}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
