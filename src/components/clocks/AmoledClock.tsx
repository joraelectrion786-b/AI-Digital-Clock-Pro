import React from 'react';
import { ClockSettings } from '../../types/clock';
import { getTimeParts } from '../../utils/helpers';

interface AmoledClockProps {
  currentTime: Date;
  settings: ClockSettings;
  isLandscape?: boolean;
}

export const AmoledClock: React.FC<AmoledClockProps> = ({ currentTime, settings }) => {
  const { hours, minutes, seconds, ampm } = getTimeParts(currentTime, settings.is24Hour);
  const colonVisible = !settings.blinkColon || currentTime.getSeconds() % 2 === 0;

  return (
    <div className="flex flex-col items-center justify-center select-none py-8">
      {/* Pure black backdrop card with ultra-subtle border */}
      <div className="flex flex-col items-center px-8 py-6 rounded-3xl bg-black border border-neutral-900 shadow-2xl">
        <div className="flex items-baseline justify-center">
          <span
            className="text-7xl sm:text-9xl md:text-[11rem] lg:text-[14rem] font-extrabold font-outfit tabular-nums leading-none tracking-tight text-white"
          >
            {hours}
          </span>

          <span
            className={`text-6xl sm:text-8xl md:text-[9rem] lg:text-[12rem] font-light font-outfit leading-none mx-2 text-white/40 transition-opacity ${
              colonVisible ? 'opacity-100' : 'opacity-10'
            }`}
          >
            :
          </span>

          <span
            className="text-7xl sm:text-9xl md:text-[11rem] lg:text-[14rem] font-extrabold font-outfit tabular-nums leading-none tracking-tight text-white"
          >
            {minutes}
          </span>

          {/* Seconds & AM/PM */}
          <div className="flex flex-col justify-end ml-3 sm:ml-6 pb-2 sm:pb-8 gap-2">
            {settings.showAmPm && !settings.is24Hour && (
              <span className="text-sm sm:text-xl md:text-2xl font-bold tracking-widest text-cyan-400">
                {ampm}
              </span>
            )}
            {settings.showSeconds && (
              <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-light font-digital tabular-nums text-cyan-400">
                {seconds}
              </span>
            )}
          </div>
        </div>

        {/* Minimal indicator pill */}
        <div className="flex items-center gap-2 mt-4 text-xs font-mono text-neutral-500">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          <span>AMOLED OPTIMIZED · ZERO BACKLIGHT BLEED</span>
        </div>
      </div>
    </div>
  );
};
