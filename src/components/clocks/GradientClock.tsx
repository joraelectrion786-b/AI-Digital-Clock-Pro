import React from 'react';
import { ClockSettings } from '../../types/clock';
import { getTimeParts } from '../../utils/helpers';

interface GradientClockProps {
  currentTime: Date;
  settings: ClockSettings;
  isLandscape?: boolean;
}

export const GradientClock: React.FC<GradientClockProps> = ({ currentTime, settings }) => {
  const { hours, minutes, seconds, ampm } = getTimeParts(currentTime, settings.is24Hour);
  const colonVisible = !settings.blinkColon || currentTime.getSeconds() % 2 === 0;

  return (
    <div className="flex flex-col items-center justify-center select-none py-8">
      <div className="flex items-baseline justify-center">
        {/* Hours */}
        <span className="text-7xl sm:text-9xl md:text-[11rem] lg:text-[13rem] font-black font-outfit tabular-nums leading-none bg-gradient-to-br from-amber-400 via-rose-500 to-purple-600 bg-clip-text text-transparent drop-shadow-sm">
          {hours}
        </span>

        {/* Colon */}
        <span
          className={`text-6xl sm:text-8xl md:text-[9rem] lg:text-[11rem] font-black font-outfit leading-none mx-1 sm:mx-3 bg-gradient-to-br from-rose-500 to-purple-600 bg-clip-text text-transparent transition-opacity ${
            colonVisible ? 'opacity-100' : 'opacity-25'
          }`}
        >
          :
        </span>

        {/* Minutes */}
        <span className="text-7xl sm:text-9xl md:text-[11rem] lg:text-[13rem] font-black font-outfit tabular-nums leading-none bg-gradient-to-br from-rose-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-sm">
          {minutes}
        </span>

        {/* Seconds & AM/PM */}
        <div className="flex flex-col justify-end ml-2 sm:ml-5 pb-2 sm:pb-8 gap-2">
          {settings.showAmPm && !settings.is24Hour && (
            <span className="text-sm sm:text-xl md:text-2xl font-black font-outfit uppercase bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              {ampm}
            </span>
          )}
          {settings.showSeconds && (
            <span className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-outfit tabular-nums bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              {seconds}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
