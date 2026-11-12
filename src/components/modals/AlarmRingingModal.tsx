import React from 'react';
import { AlarmItem } from '../../types/clock';
import { Bell, Clock, Square } from 'lucide-react';

interface AlarmRingingModalProps {
  alarm: AlarmItem;
  onDismiss: () => void;
  onSnooze: (minutes: number) => void;
}

export const AlarmRingingModal: React.FC<AlarmRingingModalProps> = ({
  alarm,
  onDismiss,
  onSnooze,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="w-full max-w-md p-8 rounded-3xl bg-neutral-950 border border-red-500/50 shadow-[0_0_80px_rgba(239,68,68,0.4)] flex flex-col items-center text-center space-y-6">
        {/* Pulsing Bell Icon */}
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-red-500 blur-xl opacity-60 animate-ping" />
          <div className="relative w-20 h-20 rounded-full bg-red-600 flex items-center justify-center text-white shadow-2xl">
            <Bell className="w-10 h-10 animate-bounce" />
          </div>
        </div>

        <div>
          <span className="text-xs font-mono font-bold tracking-widest text-red-400 uppercase">
            Alarm Alert
          </span>
          <h2 className="text-5xl font-black font-outfit text-white mt-1 tabular-nums">
            {alarm.time}
          </h2>
          <p className="text-lg font-medium text-neutral-300 mt-2">{alarm.label}</p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-3 pt-4">
          {/* Dismiss / Stop Alarm */}
          <button
            onClick={onDismiss}
            className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 active:scale-[0.98] text-white font-bold text-base shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Square className="w-5 h-5 fill-current" />
            <span>Stop Alarm</span>
          </button>

          {/* Snooze options */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onSnooze(5)}
              className="py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Snooze (5m)</span>
            </button>
            <button
              onClick={() => onSnooze(10)}
              className="py-3 px-4 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Snooze (10m)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
