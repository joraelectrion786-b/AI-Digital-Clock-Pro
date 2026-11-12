import React from 'react';
import { ClockSettings } from '../../types/clock';
import { getTimeParts, getFormattedDate } from '../../utils/helpers';

interface AnalogClockProps {
  currentTime: Date;
  settings: ClockSettings;
  isLandscape?: boolean;
}

export const AnalogClock: React.FC<AnalogClockProps> = ({ currentTime, settings }) => {
  const { rawHours, rawMinutes, rawSeconds, milliseconds, ampm } = getTimeParts(currentTime, settings.is24Hour);

  // Exact angles
  const secondDeg = settings.analogSmoothHand
    ? (rawSeconds + milliseconds / 1000) * 6
    : rawSeconds * 6;
  const minuteDeg = (rawMinutes + rawSeconds / 60) * 6;
  const hourDeg = ((rawHours % 12) + rawMinutes / 60) * 30;

  const clockSize = 340; // SVG viewBox 0 0 340 340
  const center = clockSize / 2;
  const radius = 150;

  // 12 hours markers
  const hourMarks = Array.from({ length: 12 }, (_, i) => i + 1);
  // 60 minutes ticks
  const minuteTicks = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center justify-center select-none py-4">
      <div className="relative w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full p-2 bg-gradient-to-b from-neutral-800 to-neutral-950 shadow-[0_20px_50px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.2)] border border-neutral-700/60 flex items-center justify-center">
        {/* Clock Dial SVG */}
        <svg
          viewBox={`0 0 ${clockSize} ${clockSize}`}
          className="w-full h-full rounded-full overflow-visible"
        >
          <defs>
            {/* Dial gradient */}
            <radialGradient id="dialGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#171717" />
              <stop offset="85%" stopColor="#0a0a0a" />
              <stop offset="100%" stopColor="#050505" />
            </radialGradient>
            {/* Hand shadow */}
            <filter id="handShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.7" />
            </filter>
          </defs>

          {/* Dial Background */}
          <circle cx={center} cy={center} r={radius} fill="url(#dialGrad)" stroke="#262626" strokeWidth="2" />

          {/* Minute Ticks */}
          {settings.analogShowTicks &&
            minuteTicks.map((i) => {
              if (i % 5 === 0) return null; // skip hour tick spots
              const angle = i * 6 * (Math.PI / 180);
              const x1 = center + (radius - 8) * Math.sin(angle);
              const y1 = center - (radius - 8) * Math.cos(angle);
              const x2 = center + radius * Math.sin(angle);
              const y2 = center - radius * Math.cos(angle);
              return (
                <line
                  key={`min-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="#525252"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                />
              );
            })}

          {/* Hour Markers & Numerals */}
          {hourMarks.map((hour) => {
            const angle = hour * 30 * (Math.PI / 180);
            const tickX1 = center + (radius - 16) * Math.sin(angle);
            const tickY1 = center - (radius - 16) * Math.cos(angle);
            const tickX2 = center + radius * Math.sin(angle);
            const tickY2 = center - radius * Math.cos(angle);

            const numX = center + (radius - 32) * Math.sin(angle);
            const numY = center - (radius - 32) * Math.cos(angle) + 5;

            return (
              <g key={`hour-${hour}`}>
                <line
                  x1={tickX1}
                  y1={tickY1}
                  x2={tickX2}
                  y2={tickY2}
                  stroke={settings.primaryColor}
                  strokeWidth={hour % 3 === 0 ? '3.5' : '2'}
                  strokeLinecap="round"
                />
                <text
                  x={numX}
                  y={numY}
                  textAnchor="middle"
                  fill="#d4d4d4"
                  fontSize="15"
                  fontWeight="600"
                  fontFamily="'Outfit', sans-serif"
                >
                  {hour}
                </text>
              </g>
            );
          })}

          {/* Date complication window */}
          {settings.showDate && (
            <g transform={`translate(${center + 42}, ${center - 11})`}>
              <rect
                x="0"
                y="0"
                width="34"
                height="22"
                rx="4"
                fill="#1f1f1f"
                stroke="#383838"
                strokeWidth="1"
              />
              <text
                x="17"
                y="15"
                textAnchor="middle"
                fill="#ffffff"
                fontSize="12"
                fontWeight="700"
                fontFamily="'Outfit', sans-serif"
              >
                {currentTime.getDate()}
              </text>
            </g>
          )}

          {/* Brand Wordmark inside dial */}
          <text
            x={center}
            y={center - 45}
            textAnchor="middle"
            fill="#a3a3a3"
            fontSize="10"
            fontWeight="700"
            letterSpacing="2.5"
            fontFamily="'Outfit', sans-serif"
          >
            CHRONO PRO
          </text>
          <text
            x={center}
            y={center - 33}
            textAnchor="middle"
            fill="#737373"
            fontSize="7"
            letterSpacing="1.5"
            fontFamily="'Outfit', sans-serif"
          >
            PRECISION QUARTZ
          </text>

          {/* Hour Hand */}
          <g
            transform={`rotate(${hourDeg} ${center} ${center})`}
            filter="url(#handShadow)"
          >
            <rect
              x={center - 3.5}
              y={center - 85}
              width="7"
              height="95"
              rx="3.5"
              fill="#f5f5f5"
            />
            {/* Luminescent inner stripe */}
            <rect
              x={center - 1.5}
              y={center - 75}
              width="3"
              height="55"
              rx="1.5"
              fill={settings.primaryColor}
            />
          </g>

          {/* Minute Hand */}
          <g
            transform={`rotate(${minuteDeg} ${center} ${center})`}
            filter="url(#handShadow)"
          >
            <rect
              x={center - 2.5}
              y={center - 120}
              width="5"
              height="135"
              rx="2.5"
              fill="#ffffff"
            />
            {/* Luminescent inner stripe */}
            <rect
              x={center - 1}
              y={center - 110}
              width="2"
              height="80"
              rx="1"
              fill={settings.primaryColor}
            />
          </g>

          {/* Second Hand */}
          {settings.showSeconds && (
            <g
              transform={`rotate(${secondDeg} ${center} ${center})`}
              filter="url(#handShadow)"
            >
              {/* Tail counterweight */}
              <rect
                x={center - 1}
                y={center}
                width="2"
                height="28"
                rx="1"
                fill={settings.primaryColor}
              />
              <circle cx={center} cy={center + 18} r="4" fill={settings.primaryColor} />
              {/* Pointed second pointer */}
              <line
                x1={center}
                y1={center}
                x2={center}
                y2={center - 135}
                stroke={settings.primaryColor}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </g>
          )}

          {/* Center Pin & Cap */}
          <circle cx={center} cy={center} r="6" fill="#0a0a0a" stroke={settings.primaryColor} strokeWidth="2" />
          <circle cx={center} cy={center} r="2.5" fill="#ffffff" />
        </svg>
      </div>

      {/* AM/PM and digital readout below analog dial */}
      <div className="flex items-center gap-3 mt-4 text-xs font-mono text-neutral-400">
        <span className="font-bold text-neutral-200">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </span>
        <span>·</span>
        <span>{ampm || (settings.is24Hour ? '24H' : '')}</span>
      </div>
    </div>
  );
};
