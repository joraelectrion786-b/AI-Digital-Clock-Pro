import React from 'react';
import { ClockSettings } from '../../types/clock';
import { getTimeParts } from '../../utils/helpers';

interface RetroClockProps {
  currentTime: Date;
  settings: ClockSettings;
  isLandscape?: boolean;
}

const DAYS = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

export const RetroClock: React.FC<RetroClockProps> = ({ currentTime, settings }) => {
  const { hours, minutes, seconds, ampm } = getTimeParts(currentTime, settings.is24Hour);
  const currentDayIndex = currentTime.getDay();
  const colonVisible = !settings.blinkColon || currentTime.getSeconds() % 2 === 0;

  return (
    <div className="flex flex-col items-center justify-center select-none py-6">
      {/* Vintage Digital Watch Screen Case */}
      <div className="relative px-6 py-6 sm:px-10 sm:py-8 rounded-2xl bg-neutral-900 border-4 border-neutral-700 shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),0_12px_24px_rgba(0,0,0,0.6)] flex flex-col items-center max-w-2xl w-full">
        {/* Watch Face Brand Header */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-neutral-800 text-[10px] sm:text-xs font-mono tracking-widest text-neutral-400">
          <span className="font-bold text-amber-500">CHRONO-PRO</span>
          <span className="text-neutral-500">WATER 50M RESIST</span>
          <span className="font-bold">{settings.is24Hour ? '24HR' : '12HR'}</span>
        </div>

        {/* Days of Week Row */}
        <div className="w-full flex justify-between px-2 py-2 text-[10px] sm:text-xs font-mono font-bold">
          {DAYS.map((day, idx) => (
            <span
              key={day}
              className={`px-1.5 py-0.5 rounded ${
                idx === currentDayIndex
                  ? 'bg-amber-500 text-black shadow-sm'
                  : 'text-neutral-600'
              }`}
            >
              {day}
            </span>
          ))}
        </div>

        {/* LCD Panel Background Frame */}
        <div className="relative w-full my-2 px-4 py-6 rounded-lg bg-[#16201a] border-2 border-neutral-800 shadow-inner flex flex-col items-center justify-center">
          {/* LCD pixel pattern */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(rgba(0,255,100,0.4) 1px, transparent 1px)',
              backgroundSize: '4px 4px',
            }}
          />

          <div className="relative flex items-baseline justify-center gap-1 sm:gap-3">
            {/* AM/PM Tag on LCD */}
            {!settings.is24Hour && settings.showAmPm && (
              <span className="text-xs sm:text-base font-retro font-bold text-emerald-400 mr-1 self-start mt-2">
                {ampm}
              </span>
            )}

            {/* Hours */}
            <span className="text-6xl sm:text-8xl md:text-9xl font-retro font-bold text-emerald-400 tabular-nums tracking-widest drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
              {hours}
            </span>

            {/* Colon */}
            <span
              className={`text-5xl sm:text-7xl md:text-8xl font-retro font-bold text-emerald-400 transition-opacity ${
                colonVisible ? 'opacity-100' : 'opacity-20'
              }`}
            >
              :
            </span>

            {/* Minutes */}
            <span className="text-6xl sm:text-8xl md:text-9xl font-retro font-bold text-emerald-400 tabular-nums tracking-widest drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]">
              {minutes}
            </span>

            {/* Seconds */}
            {settings.showSeconds && (
              <span className="text-3xl sm:text-5xl md:text-6xl font-retro font-bold text-emerald-400/80 tabular-nums ml-2">
                {seconds}
              </span>
            )}
          </div>
        </div>

        {/* Watch Bottom Labels */}
        <div className="w-full flex items-center justify-between pt-2 text-[9px] sm:text-[11px] font-mono text-neutral-500">
          <span>MODE</span>
          <span className="text-amber-400/80 font-bold">LITHIUM / DUAL TIME</span>
          <span>LIGHT / SET</span>
        </div>
      </div>
    </div>
  );
};
