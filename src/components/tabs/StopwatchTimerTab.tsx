import React, { useState, useEffect, useRef } from 'react';
import { StopwatchLap } from '../../types/clock';
import { soundManager } from '../../utils/audio';
import { Play, Pause, RotateCcw, Flag, Clock, Timer, CheckCircle2 } from 'lucide-react';

interface StopwatchTimerTabProps {
  volume: number;
}

export const StopwatchTimerTab: React.FC<StopwatchTimerTabProps> = ({ volume }) => {
  const [activeSubTab, setActiveSubTab] = useState<'stopwatch' | 'timer'>('stopwatch');

  // --- STOPWATCH STATE ---
  const [swTime, setSwTime] = useState<number>(0);
  const [swRunning, setSwRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<StopwatchLap[]>([]);
  const swStartTimeRef = useRef<number>(0);
  const swAccumulatedRef = useRef<number>(0);
  const swAnimRef = useRef<number | null>(null);

  useEffect(() => {
    if (swRunning) {
      swStartTimeRef.current = performance.now();
      const update = () => {
        const now = performance.now();
        setSwTime(swAccumulatedRef.current + (now - swStartTimeRef.current));
        swAnimRef.current = requestAnimationFrame(update);
      };
      swAnimRef.current = requestAnimationFrame(update);
    } else {
      if (swAnimRef.current) {
        cancelAnimationFrame(swAnimRef.current);
      }
    }
    return () => {
      if (swAnimRef.current) cancelAnimationFrame(swAnimRef.current);
    };
  }, [swRunning]);

  const handleSwStart = () => {
    setSwRunning(true);
  };

  const handleSwPause = () => {
    setSwRunning(false);
    swAccumulatedRef.current = swTime;
  };

  const handleSwReset = () => {
    setSwRunning(false);
    setSwTime(0);
    swAccumulatedRef.current = 0;
    setLaps([]);
  };

  const handleSwLap = () => {
    const total = swTime;
    const previousTotal = laps.length > 0 ? laps[0].totalTime : 0;
    const split = total - previousTotal;

    const newLap: StopwatchLap = {
      lapNumber: laps.length + 1,
      splitTime: split,
      totalTime: total,
    };
    setLaps([newLap, ...laps]);
  };

  // Format Stopwatch Time: HH:mm:ss.ms
  const formatSwTime = (msTotal: number) => {
    const ms = Math.floor((msTotal % 1000) / 10);
    const totalSeconds = Math.floor(msTotal / 1000);
    const seconds = totalSeconds % 60;
    const totalMinutes = Math.floor(totalSeconds / 60);
    const minutes = totalMinutes % 60;
    const hours = Math.floor(totalMinutes / 60);

    const fH = hours > 0 ? `${hours < 10 ? '0' : ''}${hours}:` : '';
    const fM = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const fS = seconds < 10 ? `0${seconds}` : `${seconds}`;
    const fMs = ms < 10 ? `0${ms}` : `${ms}`;

    return { fH, fM, fS, fMs };
  };

  const { fH, fM, fS, fMs } = formatSwTime(swTime);

  // Determine fastest and slowest laps
  let fastestLapIndex = -1;
  let slowestLapIndex = -1;
  if (laps.length > 1) {
    let minTime = Infinity;
    let maxTime = -Infinity;
    laps.forEach((l, idx) => {
      if (l.splitTime < minTime) {
        minTime = l.splitTime;
        fastestLapIndex = idx;
      }
      if (l.splitTime > maxTime) {
        maxTime = l.splitTime;
        slowestLapIndex = idx;
      }
    });
  }

  // --- COUNTDOWN TIMER STATE ---
  const [timerHours, setTimerHours] = useState<number>(0);
  const [timerMinutes, setTimerMinutes] = useState<number>(5);
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [timerTotalSec, setTimerTotalSec] = useState<number>(300);
  const [timerRemainingSec, setTimerRemainingSec] = useState<number>(300);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerLabel, setTimerLabel] = useState<string>('Quick Focus');
  const timerIntervalRef = useRef<any>(null);

  useEffect(() => {
    if (timerRunning) {
      timerIntervalRef.current = setInterval(() => {
        setTimerRemainingSec((prev) => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setTimerRunning(false);
            // Play completion chime
            soundManager.playAlarmSequence('bell', volume);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [timerRunning, volume]);

  const setTimerPreset = (h: number, m: number, s: number, labelText: string) => {
    setTimerRunning(false);
    setTimerHours(h);
    setTimerMinutes(m);
    setTimerSeconds(s);
    const total = h * 3600 + m * 60 + s;
    setTimerTotalSec(total);
    setTimerRemainingSec(total);
    setTimerLabel(labelText);
  };

  const handleTimerStart = () => {
    if (timerRemainingSec === 0) {
      const total = timerHours * 3600 + timerMinutes * 60 + timerSeconds;
      if (total <= 0) return;
      setTimerTotalSec(total);
      setTimerRemainingSec(total);
    }
    setTimerRunning(true);
  };

  const handleTimerPause = () => {
    setTimerRunning(false);
  };

  const handleTimerReset = () => {
    setTimerRunning(false);
    const total = timerHours * 3600 + timerMinutes * 60 + timerSeconds;
    setTimerRemainingSec(total);
  };

  const formatTimerDigits = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return {
      h: h < 10 ? `0${h}` : `${h}`,
      m: m < 10 ? `0${m}` : `${m}`,
      s: s < 10 ? `0${s}` : `${s}`,
    };
  };

  const remaining = formatTimerDigits(timerRemainingSec);
  const progressRatio = timerTotalSec > 0 ? (timerRemainingSec / timerTotalSec) : 0;
  const strokeDashoffset = 565.48 * (1 - progressRatio);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Sub-tab Pill Switcher */}
      <div className="flex items-center justify-center">
        <div className="p-1 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center gap-1">
          <button
            onClick={() => setActiveSubTab('stopwatch')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'stopwatch'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Stopwatch</span>
          </button>
          <button
            onClick={() => setActiveSubTab('timer')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold transition-all ${
              activeSubTab === 'timer'
                ? 'bg-rose-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Timer className="w-4 h-4" />
            <span>Countdown Timer</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'stopwatch' ? (
        /* --- STOPWATCH VIEW --- */
        <div className="space-y-8 flex flex-col items-center">
          {/* Main Stopwatch Readout */}
          <div className="relative p-8 rounded-3xl bg-neutral-900/60 border border-neutral-800 flex flex-col items-center justify-center w-full max-w-xl shadow-2xl">
            <div className="flex items-baseline justify-center font-digital tabular-nums">
              {fH && <span className="text-5xl sm:text-7xl font-bold text-white">{fH}</span>}
              <span className="text-6xl sm:text-8xl font-bold text-white">{fM}</span>
              <span className="text-4xl sm:text-6xl font-light text-rose-500 mx-1">:</span>
              <span className="text-6xl sm:text-8xl font-bold text-white">{fS}</span>
              <span className="text-3xl sm:text-5xl font-semibold text-rose-400 ml-2">.{fMs}</span>
            </div>

            <span className="text-xs font-mono text-neutral-400 mt-2">MILLISECONDS PRECISION</span>
          </div>

          {/* Stopwatch Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleSwReset}
              disabled={swTime === 0}
              className="w-14 h-14 rounded-full bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:pointer-events-none text-neutral-300 flex items-center justify-center transition-all shadow cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {swRunning ? (
              <button
                onClick={handleSwPause}
                className="w-20 h-20 rounded-full bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-bold flex items-center justify-center shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
              >
                <Pause className="w-8 h-8 fill-current" />
              </button>
            ) : (
              <button
                onClick={handleSwStart}
                className="w-20 h-20 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black font-bold flex items-center justify-center shadow-lg shadow-emerald-500/30 transition-all cursor-pointer"
              >
                <Play className="w-8 h-8 fill-current ml-1" />
              </button>
            )}

            <button
              onClick={handleSwLap}
              disabled={!swRunning}
              className="w-14 h-14 rounded-full bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:pointer-events-none text-neutral-300 flex items-center justify-center transition-all shadow cursor-pointer"
              title="Lap Split"
            >
              <Flag className="w-5 h-5 text-rose-400" />
            </button>
          </div>

          {/* Laps Table */}
          {laps.length > 0 && (
            <div className="w-full max-w-xl rounded-2xl bg-neutral-900/60 border border-neutral-800 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-3 border-b border-neutral-800 text-xs font-semibold text-neutral-400">
                <span>LAP</span>
                <span>SPLIT TIME</span>
                <span>TOTAL TIME</span>
              </div>
              <div className="divide-y divide-neutral-800/60 max-h-64 overflow-y-auto">
                {laps.map((lap, idx) => {
                  const isFastest = idx === fastestLapIndex;
                  const isSlowest = idx === slowestLapIndex;
                  const splitFormatted = formatSwTime(lap.splitTime);
                  const totalFormatted = formatSwTime(lap.totalTime);

                  return (
                    <div
                      key={lap.lapNumber}
                      className={`flex items-center justify-between px-6 py-3.5 text-xs font-mono tabular-nums ${
                        isFastest ? 'text-emerald-400 bg-emerald-500/5' : isSlowest ? 'text-rose-400 bg-rose-500/5' : 'text-neutral-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Lap {lap.lapNumber}</span>
                        {isFastest && <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-sans">Fastest</span>}
                        {isSlowest && <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-sans">Slowest</span>}
                      </div>
                      <span>
                        +{splitFormatted.fM}:{splitFormatted.fS}.{splitFormatted.fMs}
                      </span>
                      <span className="font-semibold">
                        {totalFormatted.fH}{totalFormatted.fM}:{totalFormatted.fS}.{totalFormatted.fMs}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* --- COUNTDOWN TIMER VIEW --- */
        <div className="space-y-8 flex flex-col items-center">
          {/* Circular Countdown Progress Ring */}
          <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 200 200">
              {/* Background ring */}
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="#262626"
                strokeWidth="8"
                fill="transparent"
              />
              {/* Animated Progress ring */}
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke={timerRemainingSec === 0 ? '#10b981' : '#f43f5e'}
                strokeWidth="8"
                strokeDasharray="565.48"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
                className="transition-all duration-500 ease-linear"
              />
            </svg>

            {/* Inner Readout */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1">
                {timerLabel}
              </span>
              <div className="text-4xl sm:text-6xl font-bold font-outfit text-white tabular-nums tracking-tight">
                {parseInt(remaining.h, 10) > 0 && <span>{remaining.h}:</span>}
                <span>{remaining.m}:{remaining.s}</span>
              </div>
              {timerRemainingSec === 0 && (
                <div className="flex items-center gap-1 text-emerald-400 text-xs font-bold mt-2 animate-bounce">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Timer Complete!</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="space-y-2 text-center w-full max-w-xl">
            <span className="text-xs text-neutral-400 font-medium">Quick Presets</span>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { h: 0, m: 1, s: 0, label: '1 Min', desc: '1m' },
                { h: 0, m: 3, s: 0, label: '3 Min', desc: '3m' },
                { h: 0, m: 5, s: 0, label: '5 Min Break', desc: '5m' },
                { h: 0, m: 10, s: 0, label: '10 Min Rest', desc: '10m' },
                { h: 0, m: 15, s: 0, label: '15 Min Nap', desc: '15m' },
                { h: 0, m: 25, s: 0, label: '25m Pomodoro', desc: '25m' },
                { h: 0, m: 45, s: 0, label: '45m Session', desc: '45m' },
                { h: 1, m: 0, s: 0, label: '1 Hour', desc: '1h' },
              ].map((p) => (
                <button
                  key={p.label}
                  onClick={() => setTimerPreset(p.h, p.m, p.s, p.label)}
                  className="px-3.5 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs font-medium text-neutral-200 transition-colors cursor-pointer"
                >
                  {p.desc}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Time Selector (when paused or reset) */}
          {!timerRunning && (
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
              <div className="flex flex-col items-center">
                <label className="text-[10px] text-neutral-400">Hours</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={timerHours}
                  onChange={(e) => {
                    const h = Math.max(0, parseInt(e.target.value || '0', 10));
                    setTimerPreset(h, timerMinutes, timerSeconds, timerLabel);
                  }}
                  className="w-16 p-2 rounded-lg bg-black border border-neutral-700 text-center text-sm font-bold text-white"
                />
              </div>

              <span className="text-xl font-bold text-neutral-500 pt-3">:</span>

              <div className="flex flex-col items-center">
                <label className="text-[10px] text-neutral-400">Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={timerMinutes}
                  onChange={(e) => {
                    const m = Math.max(0, Math.min(59, parseInt(e.target.value || '0', 10)));
                    setTimerPreset(timerHours, m, timerSeconds, timerLabel);
                  }}
                  className="w-16 p-2 rounded-lg bg-black border border-neutral-700 text-center text-sm font-bold text-white"
                />
              </div>

              <span className="text-xl font-bold text-neutral-500 pt-3">:</span>

              <div className="flex flex-col items-center">
                <label className="text-[10px] text-neutral-400">Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={timerSeconds}
                  onChange={(e) => {
                    const s = Math.max(0, Math.min(59, parseInt(e.target.value || '0', 10)));
                    setTimerPreset(timerHours, timerMinutes, s, timerLabel);
                  }}
                  className="w-16 p-2 rounded-lg bg-black border border-neutral-700 text-center text-sm font-bold text-white"
                />
              </div>
            </div>
          )}

          {/* Timer Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleTimerReset}
              className="w-14 h-14 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center justify-center transition-all shadow cursor-pointer"
              title="Reset"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            {timerRunning ? (
              <button
                onClick={handleTimerPause}
                className="w-20 h-20 rounded-full bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-bold flex items-center justify-center shadow-lg shadow-amber-500/30 transition-all cursor-pointer"
              >
                <Pause className="w-8 h-8 fill-current" />
              </button>
            ) : (
              <button
                onClick={handleTimerStart}
                disabled={timerRemainingSec === 0 && (timerHours + timerMinutes + timerSeconds === 0)}
                className="w-20 h-20 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold flex items-center justify-center shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                <Play className="w-8 h-8 fill-current ml-1" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
