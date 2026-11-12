import React from 'react';
import { ClockSettings } from '../../types/clock';
import { getTimeParts } from '../../utils/helpers';

interface BigNumberClockProps {
  currentTime: Date;
  settings: ClockSettings;
  isLandscape?: boolean;
}

export const BigNumberClock: React.FC<BigNumberClockProps> = ({ currentTime, settings, isLandscape }) => {
  const { hours, minutes, seconds, ampm } = getTimeParts(currentTime, settings.is24Hour);

  return (
    <div className="w-full flex flex-col items-center justify-center select-none py-4">
      {isLandscape ? (
        // Side-by-side in landscape
        <div className="flex items-center justify-center gap-4 sm:gap-8">
          <div className="text-center">
            <span
              className="text-8xl sm:text-[13rem] md:text-[16rem] lg:text-[20rem] font-black font-outfit tabular-nums leading-none tracking-tighter"
              style={{ color: settings.primaryColor }}
            >
              {hours}
            </span>
          </div>

          <div
            className="w-3 h-20 sm:w-4 sm:h-36 rounded-full opacity-30"
            style={{ backgroundColor: settings.primaryColor }}
          />

          <div className="text-center">
            <span
              className="text-8xl sm:text-[13rem] md:text-[16rem] lg:text-[20rem] font-black font-outfit tabular-nums leading-none tracking-tighter"
              style={{ color: settings.primaryColor }}
            >
              {minutes}
            </span>
          </div>

          {settings.showSeconds && (
            <div className="flex flex-col items-start justify-end pb-8">
              <span
                className="text-3xl sm:text-6xl md:text-7xl font-bold font-digital tabular-nums opacity-60"
                style={{ color: settings.primaryColor }}
              >
                {seconds}
              </span>
              {settings.showAmPm && !settings.is24Hour && (
                <span
                  className="text-xl sm:text-3xl font-black uppercase opacity-70"
                  style={{ color: settings.primaryColor }}
                >
                  {ampm}
                </span>
              )}
            </div>
          )}
        </div>
      ) : (
        // Stacked in portrait for huge impact
        <div className="flex flex-col items-center justify-center leading-none">
          <span
            className="text-8xl sm:text-[11rem] md:text-[14rem] font-black font-outfit tabular-nums leading-[0.85] tracking-tighter"
            style={{ color: settings.primaryColor }}
          >
            {hours}
          </span>
          <span
            className="text-8xl sm:text-[11rem] md:text-[14rem] font-black font-outfit tabular-nums leading-[0.85] tracking-tighter opacity-80"
            style={{ color: settings.primaryColor }}
          >
            {minutes}
          </span>
          <div className="flex items-center gap-3 mt-4">
            {settings.showSeconds && (
              <span
                className="text-2xl sm:text-4xl font-bold font-digital tabular-nums"
                style={{ color: settings.primaryColor }}
              >
                :{seconds}
              </span>
            )}
            {settings.showAmPm && !settings.is24Hour && (
              <span
                className="text-lg sm:text-2xl font-bold tracking-widest uppercase opacity-80"
                style={{ color: settings.primaryColor }}
              >
                {ampm}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
