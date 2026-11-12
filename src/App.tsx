import React, { useState, useEffect, useRef } from 'react';
import {
  ClockSettings,
  AlarmItem,
  WorldClockCity,
  ThemePreset,
  WeatherData,
} from './types/clock';
import {
  DEFAULT_SETTINGS,
  INITIAL_WORLD_CLOCKS,
  THEME_PRESETS,
} from './utils/constants';
import { soundManager } from './utils/audio';
import { wakeLockService } from './utils/wakeLock';
import { MainClockView } from './components/MainClockView';
import { ClockStylesTab } from './components/tabs/ClockStylesTab';
import { AlarmsTab } from './components/tabs/AlarmsTab';
import { StopwatchTimerTab } from './components/tabs/StopwatchTimerTab';
import { WorldClockTab } from './components/tabs/WorldClockTab';
import { AIAssistantTab } from './components/tabs/AIAssistantTab';
import { SettingsTab } from './components/tabs/SettingsTab';
import { BottomNavBar } from './components/navigation/BottomNavBar';
import { AlarmRingingModal } from './components/modals/AlarmRingingModal';

export default function App() {
  // Current Time State
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  // Clock Settings State with Persistence
  const [settings, setSettings] = useState<ClockSettings>(() => {
    try {
      const saved = localStorage.getItem('ai_digital_clock_settings');
      if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {}
    return DEFAULT_SETTINGS;
  });

  // Alarms State with Persistence
  const [alarms, setAlarms] = useState<AlarmItem[]>(() => {
    try {
      const saved = localStorage.getItem('ai_digital_clock_alarms');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'alarm-default-1',
        time: '07:00',
        label: 'Morning Wakeup',
        enabled: true,
        repeatDays: [1, 2, 3, 4, 5],
        sound: 'chime',
      },
    ];
  });

  // World Clocks State with Persistence
  const [worldClocks, setWorldClocks] = useState<WorldClockCity[]>(() => {
    try {
      const saved = localStorage.getItem('ai_digital_clock_world');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_WORLD_CLOCKS;
  });

  // Navigation Tab: 'clock' | 'styles' | 'alarms' | 'timer' | 'world' | 'ai' | 'settings'
  const [activeTab, setActiveTab] = useState<string>('clock');

  // Ringing Alarm Modal State
  const [ringingAlarm, setRingingAlarm] = useState<AlarmItem | null>(null);

  // Device & Environment States
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLandscape, setIsLandscape] = useState<boolean>(
    typeof window !== 'undefined' ? window.innerWidth > window.innerHeight : true
  );
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean>(false);
  const [weather, setWeather] = useState<WeatherData | null>(null);

  // Persistence Effects
  useEffect(() => {
    localStorage.setItem('ai_digital_clock_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('ai_digital_clock_alarms', JSON.stringify(alarms));
  }, [alarms]);

  useEffect(() => {
    localStorage.setItem('ai_digital_clock_world', JSON.stringify(worldClocks));
  }, [worldClocks]);

  // Clock Ticker Engine (Precise tick with interval)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 100); // 100ms for smooth analog second hand and responsive displays
    return () => clearInterval(interval);
  }, []);

  // Orientation & Fullscreen Detection
  useEffect(() => {
    const handleResize = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Battery API Integration
  useEffect(() => {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(battery.level);
        setIsCharging(battery.charging);

        battery.addEventListener('levelchange', () => {
          setBatteryLevel(battery.level);
        });
        battery.addEventListener('chargingchange', () => {
          setIsCharging(battery.charging);
        });
      }).catch(() => {});
    }
  }, []);

  // Weather Fetching
  useEffect(() => {
    const fetchWeather = async (lat?: number, lon?: number) => {
      try {
        const url = lat && lon ? `/api/weather?lat=${lat}&lon=${lon}` : '/api/weather';
        const res = await fetch(url);
        const json = await res.json();
        if (json.success && json.data) {
          setWeather({
            temp: json.data.temperature_2m,
            condition: 'Clear Sky',
            humidity: json.data.relative_humidity_2m,
            windSpeed: json.data.wind_speed_10m,
            city: 'Local Area',
            icon: 'Sun',
          });
        }
      } catch (e) {
        // Fallback default weather
        setWeather({
          temp: 22,
          condition: 'Mainly Clear',
          humidity: 48,
          windSpeed: 7,
          city: 'Local Area',
          icon: 'Sun',
        });
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          fetchWeather(pos.coords.latitude, pos.coords.longitude);
        },
        () => {
          fetchWeather(); // Default location fallback
        },
        { timeout: 6000 }
      );
    } else {
      fetchWeather();
    }
  }, []);

  // Alarm Checker Engine (Runs every second)
  const lastTriggeredMinuteRef = useRef<string>('');
  useEffect(() => {
    const now = currentTime;
    const currentH = now.getHours() < 10 ? `0${now.getHours()}` : `${now.getHours()}`;
    const currentM = now.getMinutes() < 10 ? `0${now.getMinutes()}` : `${now.getMinutes()}`;
    const currentTimeStr = `${currentH}:${currentM}`;
    const currentDay = now.getDay();
    const currentSecond = now.getSeconds();

    // Check once per minute when seconds are 0 or 1
    if (currentTimeStr !== lastTriggeredMinuteRef.current && currentSecond <= 2) {
      alarms.forEach((alarm) => {
        if (!alarm.enabled) return;

        // Check if snooze is active
        if (alarm.snoozedUntil && Date.now() < alarm.snoozedUntil) {
          return;
        }

        const isToday =
          alarm.repeatDays.length === 0 || alarm.repeatDays.includes(currentDay);

        if (alarm.time === currentTimeStr && isToday) {
          lastTriggeredMinuteRef.current = currentTimeStr;
          setRingingAlarm(alarm);
          soundManager.startAlarm(alarm.sound, settings.volume, settings.customAlarmAudio);
        }
      });
    }
  }, [currentTime, alarms, settings.volume, settings.customAlarmAudio]);

  // Fullscreen Handler
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Alarm Handlers
  const handleStopRinging = () => {
    soundManager.stopAlarm();
    setRingingAlarm(null);
  };

  const handleSnooze = (minutes: number) => {
    soundManager.stopAlarm();
    if (ringingAlarm) {
      const snoozedTime = Date.now() + minutes * 60 * 1000;
      setAlarms((prev) =>
        prev.map((a) => (a.id === ringingAlarm.id ? { ...a, snoozedUntil: snoozedTime } : a))
      );
    }
    setRingingAlarm(null);
  };

  const handleAddAlarm = (newAlarm: AlarmItem) => {
    setAlarms((prev) => [...prev, newAlarm]);
  };

  const handleToggleAlarm = (id: string) => {
    setAlarms((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const handleDeleteAlarm = (id: string) => {
    setAlarms((prev) => prev.filter((a) => a.id !== id));
  };

  // Settings Updates
  const handleUpdateSettings = (newSettings: Partial<ClockSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const handleApplyTheme = (theme: ThemePreset) => {
    setSettings((prev) => ({
      ...prev,
      themeId: theme.id,
      primaryColor: theme.primaryColor,
      glowColor: theme.glowColor,
      backgroundColor: theme.backgroundColor,
      backgroundType: theme.bgType,
      activeWallpaper: theme.wallpaperUrl || prev.activeWallpaper,
      fontFamily: theme.fontStyle,
      clockStyle: theme.clockStyle,
      nightMode: theme.clockStyle === 'nightstand',
    }));
  };

  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    wakeLockService.setEnabled(DEFAULT_SETTINGS.wakeLockEnabled);
  };

  // World Clocks Handlers
  const handleAddWorldCity = (city: WorldClockCity) => {
    setWorldClocks((prev) => [...prev, city]);
  };

  const handleRemoveWorldCity = (id: string) => {
    setWorldClocks((prev) => prev.filter((w) => w.id !== id));
  };

  // Find next upcoming alarm for nightstand
  const nextAlarm = alarms.find((a) => a.enabled) || null;

  // Background Styling Resolver
  const resolveBackgroundStyle = () => {
    if (settings.nightMode || settings.clockStyle === 'nightstand') {
      return { backgroundColor: '#000000' };
    }
    if (settings.backgroundType === 'custom' && settings.customWallpaper) {
      return {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.75)), url(${settings.customWallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    if (settings.backgroundType === 'wallpaper' && settings.activeWallpaper) {
      return {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url(${settings.activeWallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    }
    if (settings.backgroundType === 'gradient') {
      return {
        background: `radial-gradient(circle at 50% 30%, #1e1b4b 0%, ${settings.backgroundColor} 100%)`,
      };
    }
    return { backgroundColor: settings.backgroundColor || '#000000' };
  };

  return (
    <div
      className="relative w-screen h-screen overflow-hidden flex flex-col font-sans transition-colors duration-500"
      style={resolveBackgroundStyle()}
    >
      {/* Background Animated Glow Mesh for extra luxury feel */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 transition-opacity duration-700"
        style={{
          background: `radial-gradient(600px circle at 50% 40%, ${settings.glowColor}, transparent 60%)`,
        }}
      />

      {/* Main Content Area */}
      <div className="relative flex-1 w-full h-full overflow-y-auto pb-20 select-none">
        {activeTab === 'clock' && (
          <MainClockView
            currentTime={currentTime}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            nextAlarm={nextAlarm}
            batteryLevel={batteryLevel}
            isCharging={isCharging}
            weather={weather}
            isLandscape={isLandscape}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
            onNavigateToTab={(tab) => setActiveTab(tab)}
          />
        )}

        {activeTab === 'styles' && (
          <ClockStylesTab
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onApplyTheme={handleApplyTheme}
          />
        )}

        {activeTab === 'alarms' && (
          <AlarmsTab
            alarms={alarms}
            onAddAlarm={handleAddAlarm}
            onToggleAlarm={handleToggleAlarm}
            onDeleteAlarm={handleDeleteAlarm}
            volume={settings.volume}
          />
        )}

        {activeTab === 'timer' && (
          <StopwatchTimerTab volume={settings.volume} />
        )}

        {activeTab === 'world' && (
          <WorldClockTab
            worldClocks={worldClocks}
            onAddCity={handleAddWorldCity}
            onRemoveCity={handleRemoveWorldCity}
            is24Hour={settings.is24Hour}
            currentTime={currentTime}
          />
        )}

        {activeTab === 'ai' && (
          <AIAssistantTab
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onApplyTheme={handleApplyTheme}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onResetDefaults={handleResetDefaults}
          />
        )}
      </div>

      {/* iOS-Inspired Bottom Navigation Bar (Hidden in Fullscreen or Night Stand mode if desired) */}
      {!isFullscreen && (
        <BottomNavBar
          activeTab={activeTab}
          onSelectTab={(tabId) => setActiveTab(tabId)}
          alarmsCount={alarms.filter((a) => a.enabled).length}
        />
      )}

      {/* Active Ringing Alarm Alert Modal */}
      {ringingAlarm && (
        <AlarmRingingModal
          alarm={ringingAlarm}
          onDismiss={handleStopRinging}
          onSnooze={handleSnooze}
        />
      )}
    </div>
  );
}
