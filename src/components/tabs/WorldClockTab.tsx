import React, { useState } from 'react';
import { WorldClockCity } from '../../types/clock';
import { getWorldTime } from '../../utils/helpers';
import { POPULAR_TIMEZONES } from '../../utils/constants';
import { Plus, Trash2, Globe, Sun, Moon, Search } from 'lucide-react';

interface WorldClockTabProps {
  worldClocks: WorldClockCity[];
  onAddCity: (city: WorldClockCity) => void;
  onRemoveCity: (id: string) => void;
  is24Hour: boolean;
  currentTime: Date;
}

export const WorldClockTab: React.FC<WorldClockTabProps> = ({
  worldClocks,
  onAddCity,
  onRemoveCity,
  is24Hour,
  currentTime,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPopular = POPULAR_TIMEZONES.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      c.city.toLowerCase().includes(q) ||
      c.country.toLowerCase().includes(q) ||
      c.timezone.toLowerCase().includes(q)
    );
  }).filter((c) => !worldClocks.some((w) => w.city === c.city));

  const handleSelectCity = (c: typeof POPULAR_TIMEZONES[0]) => {
    const newCity: WorldClockCity = {
      id: `wc-${Date.now()}-${c.city.toLowerCase()}`,
      city: c.city,
      country: c.country,
      timezone: c.timezone,
      flag: c.flag,
    };
    onAddCity(newCity);
    setIsAdding(false);
    setSearchQuery('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-outfit text-white">World Clock & Timezones</h2>
          <p className="text-xs sm:text-sm text-neutral-400">Accurate live international time with automatic DST</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/20 transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add City</span>
        </button>
      </div>

      {/* Add City Modal / Dropdown */}
      {isAdding && (
        <div className="p-5 rounded-2xl bg-neutral-900 border border-neutral-700 space-y-4 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-rose-400" />
              <span>Select City or Timezone</span>
            </h3>
            <button
              onClick={() => setIsAdding(false)}
              className="text-xs text-neutral-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search by city, country or timezone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pt-1">
            {filteredPopular.length === 0 ? (
              <p className="text-xs text-neutral-500 py-3 text-center col-span-2">No unadded cities found matching query.</p>
            ) : (
              filteredPopular.map((c) => (
                <button
                  key={`${c.city}-${c.country}`}
                  onClick={() => handleSelectCity(c)}
                  className="flex items-center justify-between p-3 rounded-xl bg-neutral-950/80 hover:bg-neutral-800 border border-neutral-800/80 text-left transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{c.flag}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{c.city}</h4>
                      <p className="text-[11px] text-neutral-400">{c.country}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-neutral-500 truncate max-w-[100px]">{c.timezone}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* World Clocks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {worldClocks.map((city) => {
          const { timeStr, secondsStr, ampm, dateStr, diffText, isDay } = getWorldTime(city.timezone, is24Hour);

          return (
            <div
              key={city.id}
              className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 shadow-md flex items-center justify-between hover:border-neutral-700 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{city.flag}</span>
                  <div>
                    <h3 className="text-base font-bold text-white leading-tight">{city.city}</h3>
                    <p className="text-xs text-neutral-400">{city.country}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[11px] text-neutral-500 pt-1">
                  <span>{dateStr}</span>
                  <span>·</span>
                  <span className="text-neutral-400 font-medium">{diffText}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="flex items-baseline justify-end gap-1">
                    <span className="text-3xl font-bold font-outfit text-white tabular-nums tracking-tight">
                      {timeStr}
                    </span>
                    <span className="text-xs font-mono text-neutral-400 tabular-nums">
                      :{secondsStr}
                    </span>
                    {!is24Hour && (
                      <span className="text-xs font-bold text-rose-400 ml-1">
                        {ampm}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-1.5 mt-0.5 text-[10px] text-neutral-400">
                    {isDay ? (
                      <span className="flex items-center gap-1 text-amber-400">
                        <Sun className="w-3 h-3" /> Day
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-indigo-400">
                        <Moon className="w-3 h-3" /> Night
                      </span>
                    )}
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => onRemoveCity(city.id)}
                  className="p-1.5 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-neutral-800 transition-colors"
                  title="Remove city"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
