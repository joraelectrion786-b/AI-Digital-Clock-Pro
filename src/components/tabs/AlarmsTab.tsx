import React, { useState, useRef } from 'react';
import { AlarmItem, AlarmSoundId } from '../../types/clock';
import { soundManager } from '../../utils/audio';
import { Plus, Bell, Trash2, Volume2, Upload, AlertCircle, Play, Square } from 'lucide-react';

interface AlarmsTabProps {
  alarms: AlarmItem[];
  onAddAlarm: (alarm: AlarmItem) => void;
  onToggleAlarm: (id: string) => void;
  onDeleteAlarm: (id: string) => void;
  volume: number;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SOUND_OPTIONS: { id: AlarmSoundId; label: string }[] = [
  { id: 'chime', label: 'Morning Chime' },
  { id: 'bell', label: 'Zen Temple Bell' },
  { id: 'beep', label: 'Retro Watch Beep' },
  { id: 'radar', label: 'Pulsing Radar' },
  { id: 'harp', label: 'Soothing Harp' },
];

export const AlarmsTab: React.FC<AlarmsTabProps> = ({
  alarms,
  onAddAlarm,
  onToggleAlarm,
  onDeleteAlarm,
  volume,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [time, setTime] = useState('07:00');
  const [label, setLabel] = useState('Morning Wakeup');
  const [repeatDays, setRepeatDays] = useState<number[]>([1, 2, 3, 4, 5]); // Mon-Fri
  const [sound, setSound] = useState<AlarmSoundId>('chime');
  const [customAudio, setCustomAudio] = useState<string | null>(null);
  const [previewingSound, setPreviewingSound] = useState<AlarmSoundId | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleDay = (dayIndex: number) => {
    if (repeatDays.includes(dayIndex)) {
      setRepeatDays(repeatDays.filter((d) => d !== dayIndex));
    } else {
      setRepeatDays([...repeatDays, dayIndex].sort());
    }
  };

  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCustomAudio(reader.result as string);
      setSound('custom');
    };
    reader.readAsDataURL(file);
  };

  const handlePreviewSound = (soundId: AlarmSoundId) => {
    if (previewingSound === soundId) {
      soundManager.stopAlarm();
      setPreviewingSound(null);
    } else {
      soundManager.stopAlarm();
      soundManager.playAlarmSequence(soundId, volume, customAudio);
      setPreviewingSound(soundId);
      setTimeout(() => {
        setPreviewingSound(null);
      }, 3500);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const newAlarm: AlarmItem = {
      id: `alarm-${Date.now()}`,
      time,
      label: label.trim() || 'Alarm',
      enabled: true,
      repeatDays,
      sound,
    };
    onAddAlarm(newAlarm);
    setIsAdding(false);
    setTime('07:00');
    setLabel('Morning Wakeup');
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-outfit text-white">Alarms & Wake Schedules</h2>
          <p className="text-xs sm:text-sm text-neutral-400">Set precision alarms with Web Audio chimes</p>
        </div>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Alarm</span>
          </button>
        )}
      </div>

      {/* Browser Sandbox Disclaimer Banner */}
      <div className="flex items-start gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs leading-relaxed">
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-amber-300">Browser Audio Notice: </strong>
          Keep this browser tab open to ensure your alarms ring promptly. For nightstand use, enable Screen Wake Lock so your device stays awake.
        </div>
      </div>

      {/* Add Alarm Form Modal / Card */}
      {isAdding && (
        <form onSubmit={handleSave} className="p-6 rounded-2xl bg-neutral-900 border border-neutral-700 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
            <h3 className="text-base font-bold text-white">Configure New Alarm</h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-neutral-400 hover:text-white text-xs"
            >
              Cancel
            </button>
          </div>

          {/* Time Picker */}
          <div className="flex flex-col items-center justify-center py-2">
            <label className="text-xs text-neutral-400 mb-2">Alarm Time</label>
            <input
              type="time"
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="text-4xl sm:text-5xl font-bold font-outfit px-4 py-2 rounded-xl bg-black border border-neutral-700 text-white focus:outline-none focus:border-rose-500 text-center cursor-pointer"
            />
          </div>

          {/* Label Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-neutral-300">Alarm Name / Label</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Work, Workout, Medication"
              className="w-full px-3.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white text-sm focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Repeat Days Selection */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-300">Repeat Days</label>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map((day, idx) => {
                const isSelected = repeatDays.includes(idx);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(idx)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                      isSelected
                        ? 'bg-rose-500 text-white border-rose-500 shadow-sm'
                        : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-neutral-400">
              {repeatDays.length === 0
                ? 'Ring Once'
                : repeatDays.length === 7
                ? 'Every Day'
                : repeatDays.length === 5 && !repeatDays.includes(0) && !repeatDays.includes(6)
                ? 'Weekdays (Mon-Fri)'
                : `${repeatDays.length} days selected`}
            </p>
          </div>

          {/* Sound Selection */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-neutral-300">Alarm Tone</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SOUND_OPTIONS.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => setSound(opt.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                    sound === opt.id
                      ? 'bg-rose-500/10 border-rose-500 text-white'
                      : 'bg-neutral-950 border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span className="text-xs font-medium">{opt.label}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreviewSound(opt.id);
                    }}
                    className="p-1 rounded-md bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                    title="Preview sound"
                  >
                    {previewingSound === opt.id ? (
                      <Square className="w-3.5 h-3.5 text-rose-400" />
                    ) : (
                      <Play className="w-3.5 h-3.5 text-neutral-300" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Custom sound upload */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 transition-colors"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{customAudio ? 'Change Custom Audio File' : 'Upload Custom MP3 / WAV'}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                className="hidden"
                onChange={handleCustomAudioUpload}
              />
              {customAudio && (
                <button
                  type="button"
                  onClick={() => handlePreviewSound('custom')}
                  className="text-xs text-neutral-400 hover:text-white"
                >
                  Test Custom Audio
                </button>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-800">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20"
            >
              Save Alarm
            </button>
          </div>
        </form>
      )}

      {/* Alarms List */}
      <div className="space-y-3">
        {alarms.length === 0 ? (
          <div className="p-10 rounded-2xl bg-neutral-900/40 border border-neutral-800 flex flex-col items-center justify-center text-center space-y-2">
            <Bell className="w-8 h-8 text-neutral-600" />
            <h3 className="text-sm font-semibold text-neutral-300">No alarms set</h3>
            <p className="text-xs text-neutral-500 max-w-xs">
              Tap the "+ Add Alarm" button above to set wake schedules and reminders.
            </p>
          </div>
        ) : (
          alarms.map((alarm) => {
            const [hStr, mStr] = alarm.time.split(':');
            const hNum = parseInt(hStr, 10);
            const isPm = hNum >= 12;
            const displayH = hNum % 12 || 12;
            const displayTime12 = `${displayH}:${mStr} ${isPm ? 'PM' : 'AM'}`;

            return (
              <div
                key={alarm.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between ${
                  alarm.enabled
                    ? 'bg-neutral-900/90 border-neutral-800 shadow-md'
                    : 'bg-neutral-950/60 border-neutral-900 opacity-60'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2.5 rounded-xl ${alarm.enabled ? 'bg-rose-500/10 text-rose-400' : 'bg-neutral-800 text-neutral-500'}`}>
                    <Bell className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-bold font-outfit text-white tracking-tight">
                        {displayTime12}
                      </span>
                      <span className="text-xs text-neutral-400 font-mono">({alarm.time})</span>
                    </div>

                    <div className="flex items-center gap-2 mt-0.5 text-xs text-neutral-400">
                      <span className="text-neutral-200 font-medium">{alarm.label}</span>
                      <span>·</span>
                      <span>
                        {alarm.repeatDays.length === 0
                          ? 'Once'
                          : alarm.repeatDays.length === 7
                          ? 'Daily'
                          : alarm.repeatDays.map((d) => WEEKDAYS[d]).join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Enable / Disable toggle switch */}
                  <button
                    type="button"
                    onClick={() => onToggleAlarm(alarm.id)}
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                      alarm.enabled ? 'bg-rose-500' : 'bg-neutral-800'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        alarm.enabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>

                  {/* Delete button */}
                  <button
                    type="button"
                    onClick={() => onDeleteAlarm(alarm.id)}
                    className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                    title="Delete alarm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
