import React from 'react';
import { ClockSettings } from '../../types/clock';
import { getTimeParts } from '../../utils/helpers';

interface ClockProps {
  currentTime: Date;
  settings: ClockSettings;
  isLandscape?: boolean;
}

export const DigitalLedClock: React.FC<ClockProps> = ({ currentTime, settings, isLandscape }) => {
  const { hours, minutes, seconds, ampm } = getTimeParts(currentTime, settings.is24Hour);
  const colonVisible = !settings.blinkColon || currentTime.getSeconds() % 2 === 0;

  const fontClass =
    settings.fontFamily === 'digital'
      ? 'font-digital'
      : settings.fontFamily === 'chakra'
      ? 'font-chakra'
      : settings.fontFamily === 'outfit'
      ? 'font-outfit'
      : 'font-digital';

  const glowStyle = {
    color: settings.primaryColor,
    textShadow: `0 0 ${settings.glowIntensity * 0.25}px ${settings.glowColor}, 0 0 ${settings.glowIntensity * 0.5}px ${settings.glowColor}`,
  };

  const dimGlow = {
    color: 'rgba(255, 255, 255, 0.06)',
  };

  return (
    <div className="flex flex-col items-center justify-center select-none py-6">
      {/* LED Chassis Frame */}
      <div className="relative px-6 py-6 sm:px-10 sm:py-8 rounded-3xl bg-neutral-950/80 border border-white/10 shadow-2xl backdrop-blur-xl flex flex-col items-center">
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none opacity-15"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.2) 1px, transparent 1px)',
            backgroundSize: '12px 12px',
          }}
        />

        <div className="relative flex items-baseline justify-center gap-1 sm:gap-3">
          {/* Hours */}
          <div className="relative flex">
            <span
              className={`text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold tracking-wider tabular-nums ${fontClass}`}
              style={glowStyle}
            >
              {hours}
            </span>
          </div>

          {/* Blinking Colon */}
          <div
            className={`text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-bold pb-2 transition-opacity duration-150 ${
              colonVisible ? 'opacity-100' : 'opacity-20'
            }`}
            style={glowStyle}
          >
            :
          </div>

          {/* Minutes */}
          <div className="relative flex">
            <span
              className={`text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] font-bold tracking-wider tabular-nums ${fontClass}`}
              style={glowStyle}
            >
              {minutes}
            </span>
          </div>

          {/* Seconds & AM/PM Column */}
          <div className="flex flex-col items-start justify-end ml-1 sm:ml-4 pb-2 sm:pb-4 gap-1">
            {settings.showAmPm && !settings.is24Hour && (
              <span
                className="text-xs sm:text-base md:text-lg font-bold tracking-wider px-2 py-0.5 rounded bg-black/40 border border-white/10"
                style={glowStyle}
              >
                {ampm}
              </span>
            )}
            {settings.showSeconds && (
              <div className="flex items-center">
                <span className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tabular-nums" style={glowStyle}>
                  {seconds}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
