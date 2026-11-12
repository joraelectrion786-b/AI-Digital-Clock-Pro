import React from 'react';
import { ClockSettings } from '../../types/clock';
import { getTimeParts } from '../../utils/helpers';

interface MinimalClockProps {
  currentTime: Date;
  settings: ClockSettings;
  isLandscape?: boolean;
}

export const MinimalClock: React.FC<MinimalClockProps> = ({ currentTime, settings }) => {
  const { hours, minutes, seconds, ampm } = getTimeParts(currentTime, settings.is24Hour);

  return (
    <div className="flex flex-col items-center justify-center select-none py-8">
      <div className="flex flex-col items-center">
        {/* Massive clean numbers */}
        <div className="flex items-baseline justify-center tracking-tight">
          <span
            className="text-7xl sm:text-9xl md:text-[11rem] lg:text-[13rem] font-light font-outfit tabular-nums leading-none transition-colors duration-300"
            style={{ color: settings.primaryColor }}
          >
            {hours}
          </span>
          <span
            className="text-5xl sm:text-7xl md:text-9xl font-thin opacity-30 mx-1 sm:mx-3 leading-none"
            style={{ color: settings.primaryColor }}
          >
            :
          </span>
          <span
            className="text-7xl sm:text-9xl md:text-[11rem] lg:text-[13rem] font-bold font-outfit tabular-nums leading-none transition-colors duration-300"
            style={{ color: settings.primaryColor }}
          >
            {minutes}
          </span>

          {/* Seconds & AM/PM tag */}
          <div className="flex flex-col justify-end ml-2 sm:ml-4 pb-2 sm:pb-6">
            {settings.showAmPm && !settings.is24Hour && (
              <span
                className="text-sm sm:text-lg md:text-xl font-medium tracking-widest uppercase opacity-70"
                style={{ color: settings.primaryColor }}
              >
                {ampm}
              </span>
            )}
            {settings.showSeconds && (
              <span
                className="text-2xl sm:text-4xl md:text-5xl font-light tabular-nums opacity-60"
                style={{ color: settings.primaryColor }}
              >
                {seconds}
              </span>
            )}
          </div>
        </div>

        {/* Minimal thin divider line */}
        <div
          className="w-24 sm:w-40 h-[1px] my-4 opacity-25"
          style={{ backgroundColor: settings.primaryColor }}
        />
      </div>
    </div>
  );
};
