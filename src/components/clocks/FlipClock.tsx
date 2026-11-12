import React from 'react';
import { ClockSettings } from '../../types/clock';
import { getTimeParts } from '../../utils/helpers';

interface FlipClockProps {
  currentTime: Date;
  settings: ClockSettings;
  isLandscape?: boolean;
}

interface FlipCardProps {
  digit: string;
  label?: string;
  primaryColor: string;
}

const FlipCard: React.FC<FlipCardProps> = ({ digit, label, primaryColor }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-22 sm:w-24 sm:h-32 md:w-32 md:h-44 lg:w-36 lg:h-48 rounded-xl bg-neutral-900 shadow-2xl border border-neutral-800 flex flex-col overflow-hidden perspective-1000">
        {/* Top Half */}
        <div className="relative h-1/2 w-full bg-gradient-to-b from-neutral-800 to-neutral-900 border-b border-black flex items-end justify-center overflow-hidden">
          <span
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-outfit tabular-nums leading-none translate-y-1/2 drop-shadow-md"
            style={{ color: primaryColor }}
          >
            {digit}
          </span>
          {/* Subtle top reflection */}
          <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        </div>

        {/* Center Hinge & Shadow Seam */}
        <div className="relative h-0.5 w-full bg-black z-10 shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />

        {/* Bottom Half */}
        <div className="relative h-1/2 w-full bg-gradient-to-b from-neutral-900 to-neutral-950 flex items-start justify-center overflow-hidden">
          <span
            className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black font-outfit tabular-nums leading-none -translate-y-1/2 drop-shadow-md"
            style={{ color: primaryColor }}
          >
            {digit}
          </span>
          {/* Subtle bottom shadow */}
          <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
        </div>

        {/* Corner hinge pegs */}
        <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-2.5 rounded-sm bg-neutral-950 border border-neutral-700/60 z-20" />
        <div className="absolute right-1 top-1/2 -translate-y-1/2 w-1.5 h-2.5 rounded-sm bg-neutral-950 border border-neutral-700/60 z-20" />
      </div>

      {label && (
        <span className="text-[10px] sm:text-xs tracking-wider text-neutral-400 mt-2 font-medium uppercase">
          {label}
        </span>
      )}
    </div>
  );
};

export const FlipClock: React.FC<FlipClockProps> = ({ currentTime, settings }) => {
  const { hours, minutes, seconds, ampm } = getTimeParts(currentTime, settings.is24Hour);

  return (
    <div className="flex flex-col items-center justify-center select-none py-6">
      <div className="flex items-center justify-center gap-2 sm:gap-4 md:gap-6">
        {/* Hours */}
        <div className="flex gap-1.5 sm:gap-2">
          <FlipCard digit={hours[0]} primaryColor={settings.primaryColor} />
          <FlipCard digit={hours[1]} label="Hours" primaryColor={settings.primaryColor} />
        </div>

        {/* Colon Dots */}
        <div className="flex flex-col gap-3 sm:gap-5 pb-6">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-neutral-600 shadow-inner" />
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-neutral-600 shadow-inner" />
        </div>

        {/* Minutes */}
        <div className="flex gap-1.5 sm:gap-2">
          <FlipCard digit={minutes[0]} primaryColor={settings.primaryColor} />
          <FlipCard digit={minutes[1]} label="Minutes" primaryColor={settings.primaryColor} />
        </div>

        {/* Optional Seconds */}
        {settings.showSeconds && (
          <>
            <div className="flex flex-col gap-3 sm:gap-5 pb-6">
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-neutral-600 shadow-inner" />
              <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-neutral-600 shadow-inner" />
            </div>

            <div className="flex gap-1.5 sm:gap-2">
              <FlipCard digit={seconds[0]} primaryColor={settings.primaryColor} />
              <FlipCard digit={seconds[1]} label="Seconds" primaryColor={settings.primaryColor} />
            </div>
          </>
        )}

        {/* AM/PM Pill */}
        {settings.showAmPm && !settings.is24Hour && (
          <div className="self-start mt-2 px-2.5 py-1 rounded-lg bg-neutral-900 border border-neutral-800 text-xs sm:text-sm font-bold tracking-wider" style={{ color: settings.primaryColor }}>
            {ampm}
          </div>
        )}
      </div>
    </div>
  );
};
