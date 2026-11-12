import React from 'react';
import { ClockSettings, ClockStyleId } from '../../types/clock';
import { DEFAULT_SETTINGS } from '../../utils/constants';
import { soundManager } from '../../utils/audio';
import { wakeLockService } from '../../utils/wakeLock';
import {
  Settings,
  Volume2,
  Globe,
  Sliders,
  SunMedium,
  RotateCcw,
  Sparkles,
  Lock,
  Eye,
  Check,
} from 'lucide-react';

interface SettingsTabProps {
  settings: ClockSettings;
  onUpdateSettings: (newSettings: Partial<ClockSettings>) => void;
  onResetDefaults: () => void;
}

const LANGUAGES = [
  { code: 'en', label: 'English (US)' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ar', label: 'العربية (Arabic)' },
  { code: 'ur', label: 'اردو (Urdu)' },
  { code: 'ja', label: '日本語 (Japanese)' },
  { code: 'zh', label: '中文 (Chinese)' },
];

export const SettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  onUpdateSettings,
  onResetDefaults,
}) => {
  const handleTestVolume = () => {
    soundManager.playAlarmSequence(settings.alarmSound, settings.volume, settings.customAlarmAudio);
  };

  const handleWakeLockToggle = (val: boolean) => {
    onUpdateSettings({ wakeLockEnabled: val });
    wakeLockService.setEnabled(val);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-rose-500" />
          <h2 className="text-xl sm:text-2xl font-bold font-outfit text-white">App Settings</h2>
        </div>
        <button
          onClick={onResetDefaults}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:bg-neutral-800 text-xs font-medium text-neutral-300 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {/* Time & Date Format Settings */}
      <section className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-5">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Globe className="w-4 h-4 text-rose-400" />
          <span>Time & Language Preferences</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Time Format */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">Time Format</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdateSettings({ is24Hour: false })}
                className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  !settings.is24Hour
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                12-Hour (AM/PM)
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ is24Hour: true })}
                className={`py-2 rounded-xl text-xs font-semibold border transition-colors ${
                  settings.is24Hour
                    ? 'bg-rose-500 text-white border-rose-500'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                24-Hour (Military)
              </button>
            </div>
          </div>

          {/* Date Format */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">Date Display Style</label>
            <select
              value={settings.dateFormat}
              onChange={(e) => onUpdateSettings({ dateFormat: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-semibold text-white focus:outline-none focus:border-rose-500"
            >
              <option value="full">Full (Thursday, November 12, 2026)</option>
              <option value="short">Short (Thu, Nov 12)</option>
              <option value="iso">Standard ISO (2026-11-12)</option>
            </select>
          </div>

          {/* Language Selection */}
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-neutral-300">App & Date Language</label>
            <select
              value={settings.language}
              onChange={(e) => onUpdateSettings({ language: e.target.value as any })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-semibold text-white focus:outline-none focus:border-rose-500"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Display & Elements Visibility */}
      <section className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Eye className="w-4 h-4 text-rose-400" />
          <span>Clock Elements Visibility</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            {
              title: 'Show Seconds',
              desc: 'Display precision second digits or sweeping hand',
              checked: settings.showSeconds,
              toggle: () => onUpdateSettings({ showSeconds: !settings.showSeconds }),
            },
            {
              title: 'Show Date',
              desc: 'Display current day, month, and year',
              checked: settings.showDate,
              toggle: () => onUpdateSettings({ showDate: !settings.showDate }),
            },
            {
              title: 'Show AM / PM',
              desc: 'Display 12-hour meridiem indicator',
              checked: settings.showAmPm,
              toggle: () => onUpdateSettings({ showAmPm: !settings.showAmPm }),
            },
            {
              title: 'Blinking Colon',
              desc: 'Blink separator dots every second',
              checked: settings.blinkColon,
              toggle: () => onUpdateSettings({ blinkColon: !settings.blinkColon }),
            },
          ].map((item) => (
            <div
              key={item.title}
              onClick={item.toggle}
              className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 cursor-pointer hover:border-neutral-700 transition-colors"
            >
              <div>
                <h4 className="text-xs font-bold text-white">{item.title}</h4>
                <p className="text-[11px] text-neutral-400">{item.desc}</p>
              </div>

              <div
                className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                  item.checked ? 'bg-rose-500' : 'bg-neutral-800'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform ${
                    item.checked ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Screen Brightness & Power */}
      <section className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <SunMedium className="w-4 h-4 text-rose-400" />
          <span>Screen Brightness & Wake Lock</span>
        </h3>

        <div className="space-y-4">
          {/* Dimmer Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-neutral-300">
              <span>Display Brightness Dimmer</span>
              <span className="font-mono text-rose-400">{Math.round(settings.brightness * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1.0"
              step="0.05"
              value={settings.brightness}
              onChange={(e) => onUpdateSettings({ brightness: parseFloat(e.target.value) })}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <p className="text-[11px] text-neutral-500">
              Lowers visual glare in dark bedrooms or OLED displays.
            </p>
          </div>

          {/* Screen Wake Lock */}
          <div
            onClick={() => handleWakeLockToggle(!settings.wakeLockEnabled)}
            className="flex items-center justify-between p-3.5 rounded-xl bg-neutral-950 border border-neutral-800/80 cursor-pointer hover:border-neutral-700 transition-colors"
          >
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>Keep Screen Awake (Wake Lock API)</span>
              </h4>
              <p className="text-[11px] text-neutral-400">
                Prevents your smartphone or computer screen from dimming or going to sleep.
              </p>
            </div>

            <div
              className={`w-10 h-5 rounded-full transition-colors relative p-0.5 ${
                settings.wakeLockEnabled ? 'bg-rose-500' : 'bg-neutral-800'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  settings.wakeLockEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Audio Volume & Sound Test */}
      <section className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-rose-400" />
          <span>Sound & Volume Controls</span>
        </h3>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold text-neutral-300">
              <span>Master Alarm Volume</span>
              <span className="font-mono text-rose-400">{settings.volume}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.volume}
              onChange={(e) => onUpdateSettings({ volume: parseInt(e.target.value, 10) })}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          <button
            type="button"
            onClick={handleTestVolume}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors"
          >
            Test Current Tone
          </button>
        </div>
      </section>
    </div>
  );
};
