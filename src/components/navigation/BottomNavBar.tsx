import React from 'react';
import {
  Clock,
  Palette,
  Bell,
  Timer,
  Globe,
  Sparkles,
  Settings,
} from 'lucide-react';

interface BottomNavBarProps {
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  alarmsCount?: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  alarmsCount = 0,
}) => {
  const NAV_ITEMS = [
    { id: 'clock', label: 'Clock', icon: Clock },
    { id: 'styles', label: 'Styles', icon: Palette },
    { id: 'alarms', label: 'Alarms', icon: Bell, badge: alarmsCount > 0 ? alarmsCount : undefined },
    { id: 'timer', label: 'Timer & Lap', icon: Timer },
    { id: 'world', label: 'World', icon: Globe },
    { id: 'ai', label: 'AI Stylist', icon: Sparkles, isAi: true },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav
      aria-label="App Navigation"
      className="fixed bottom-0 inset-x-0 z-40 bg-neutral-950/85 backdrop-blur-2xl border-t border-white/10 select-none pb-safe"
    >
      <div className="max-w-xl mx-auto flex items-center justify-around px-2 h-16">
        {NAV_ITEMS.map((item) => {
          const isActive = activeTab === item.id;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`relative min-h-[48px] min-w-[44px] flex-1 flex flex-col items-center justify-center transition-all duration-200 cursor-pointer ${
                isActive ? 'text-rose-500 scale-105' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${item.isAi && isActive ? 'animate-pulse' : ''}`} />
                {item.badge && (
                  <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-rose-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] font-medium tracking-tight mt-1 whitespace-nowrap ${isActive ? 'font-bold text-rose-400' : ''}`}>
                {item.label}
              </span>

              {isActive && (
                <div className="absolute -bottom-1 w-6 h-0.5 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
