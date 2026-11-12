import React, { useState, useEffect } from 'react';
import { ClockSettings, AlarmItem, WeatherData } from '../types/clock';
import { ClockRenderer } from './clocks/ClockRenderer';
import { getFormattedDate } from '../utils/helpers';
import {
  Maximize,
  Minimize,
  Moon,
  Sun,
  Battery,
  BatteryCharging,
  CloudSun,
  CloudRain,
  SunMedium,
  Cloud,
  Volume2,
  VolumeX,
  Sliders,
  Sparkles,
} from 'lucide-react';

interface MainClockViewProps {
  currentTime: Date;
  settings: ClockSettings;
  onUpdateSettings: (newSettings: Partial<ClockSettings>) => void;
  nextAlarm: AlarmItem | null;
  batteryLevel: number | null;
  isCharging: boolean;
  weather: WeatherData | null;
  isLandscape: boolean;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onNavigateToTab: (tabId: string) => void;
}

export const MainClockView: React.FC<MainClockViewProps> = ({
  currentTime,
  settings,
  onUpdateSettings,
  nextAlarm,
  batteryLevel,
  isCharging,
  weather,
  isLandscape,
  isFullscreen,
  onToggleFullscreen,
  onNavigateToTab,
}) => {
  const [controlsVisible, setControlsVisible] = useState(true);
  const [showDimmerSlider, setShowDimmerSlider] = useState(false);

  // Auto-hide controls in fullscreen or night mode after inactivity
  useEffect(() => {
    let timer: any;
    const handleActivity = () => {
      setControlsVisible(true);
      clearTimeout(timer);
      if (isFullscreen || settings.nightMode) {
        timer = setTimeout(() => {
          setControlsVisible(false);
          setShowDimmerSlider(false);
        }, 3500);
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('click', handleActivity);

    if (isFullscreen || settings.nightMode) {
      timer = setTimeout(() => {
        setControlsVisible(false);
        setShowDimmerSlider(false);
      }, 3500);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [isFullscreen, settings.nightMode]);

  const toggleNightMode = () => {
    onUpdateSettings({ nightMode: !settings.nightMode });
  };

  const formattedDate = getFormattedDate(currentTime, settings.language, settings.dateFormat);

  return (
    <div
      className={`relative w-full h-full flex flex-col justify-between overflow-hidden transition-opacity duration-300 ${
        settings.nightMode ? 'cursor-pointer' : ''
      }`}
      style={{
        opacity: settings.brightness,
      }}
    >
      {/* Top Header Floating Controls (3-Zone iOS Inspired Ergonomics) */}
      <header
        className={`w-full max-w-7xl mx-auto px-4 sm:px-8 pt-4 pb-2 flex items-center justify-between transition-opacity duration-300 z-30 ${
          controlsVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Left Zone: Weather & Battery pill */}
        <div className="flex items-center gap-3">
          {weather && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-medium text-neutral-200 shadow-sm">
              <CloudSun className="w-3.5 h-3.5 text-amber-400" />
              <span>{Math.round(weather.temp)}°C</span>
              <span className="hidden sm:inline text-neutral-400">· {weather.condition}</span>
            </div>
          )}

          {batteryLevel !== null && batteryLevel !== undefined && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-mono text-neutral-200 shadow-sm">
              {isCharging ? (
                <BatteryCharging className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              ) : (
                <Battery className="w-3.5 h-3.5 text-neutral-300" />
              )}
              <span>{Math.round(batteryLevel * 100)}%</span>
            </div>
          )}
        </div>

        {/* Right Zone: Night Mode, Brightness, Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Night Mode Toggle */}
          <button
            onClick={toggleNightMode}
            className={`min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full transition-all shadow-sm ${
              settings.nightMode
                ? 'bg-red-500/20 text-red-400 border border-red-500/40 shadow-red-500/20'
                : 'bg-black/40 hover:bg-black/60 text-neutral-300 border border-white/10 backdrop-blur-md'
            }`}
            title={settings.nightMode ? 'Exit Night Stand Mode' : 'Enter Night Stand Mode'}
          >
            <Moon className="w-4 h-4" />
          </button>

          {/* Quick Brightness Dimmer */}
          <div className="relative">
            <button
              onClick={() => setShowDimmerSlider(!showDimmerSlider)}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-neutral-300 border border-white/10 backdrop-blur-md transition-all shadow-sm"
              title="Adjust brightness"
            >
              <SunMedium className="w-4 h-4" />
            </button>

            {showDimmerSlider && (
              <div className="absolute right-0 top-12 p-3 rounded-2xl bg-neutral-900 border border-neutral-700 shadow-2xl flex flex-col items-center gap-2 w-48 z-40">
                <div className="flex justify-between w-full text-[11px] text-neutral-300 font-semibold">
                  <span>Brightness</span>
                  <span>{Math.round(settings.brightness * 100)}%</span>
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
              </div>
            )}
          </div>

          {/* Fullscreen Toggle */}
          <button
            onClick={onToggleFullscreen}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full bg-black/40 hover:bg-black/60 text-neutral-300 border border-white/10 backdrop-blur-md transition-all shadow-sm"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* Center Zone: The Live Clock Face */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 my-auto relative z-10">
        <ClockRenderer
          currentTime={currentTime}
          settings={settings}
          isLandscape={isLandscape}
          nextAlarm={nextAlarm}
          batteryLevel={batteryLevel}
          isCharging={isCharging}
          onExitNightStand={() => onUpdateSettings({ nightMode: false })}
        />

        {/* Live Date display (when enabled and not already rendered by the clock) */}
        {settings.showDate && settings.clockStyle !== 'nightstand' && (
          <div
            className={`text-sm sm:text-lg md:text-xl font-medium tracking-wider text-center mt-2 transition-opacity duration-300 ${
              controlsVisible ? 'opacity-90' : 'opacity-70'
            }`}
            style={{ color: settings.primaryColor }}
          >
            {formattedDate}
          </div>
        )}
      </main>

      {/* Bottom Hint / Info Bar in Main View (Visible when not hidden) */}
      <footer
        className={`w-full max-w-3xl mx-auto px-4 pb-4 pt-2 flex items-center justify-center text-center transition-opacity duration-300 z-20 ${
          controlsVisible && !isFullscreen ? 'opacity-80' : 'opacity-0 pointer-events-none'
        }`}
      >
        <button
          onClick={() => onNavigateToTab('styles')}
          className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/10 text-[11px] font-medium text-neutral-300 hover:text-white transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-rose-400" />
          <span>Tap to Switch Styles ({settings.clockStyle.toUpperCase()})</span>
        </button>
      </footer>
    </div>
  );
};
