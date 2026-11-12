import React, { useRef } from 'react';
import { ClockSettings, ClockStyleId, ThemePreset } from '../../types/clock';
import { THEME_PRESETS, WALLPAPERS } from '../../utils/constants';
import { Check, Sparkles, Upload, Trash2, Sliders, Palette, Image as ImageIcon } from 'lucide-react';

interface ClockStylesTabProps {
  settings: ClockSettings;
  onUpdateSettings: (newSettings: Partial<ClockSettings>) => void;
  onApplyTheme: (theme: ThemePreset) => void;
}

const CLOCK_STYLES: { id: ClockStyleId; title: string; subtitle: string; icon: string }[] = [
  { id: 'digital_led', title: 'Digital LED', subtitle: 'Segmented matrix with ambient LED glow', icon: '12:45' },
  { id: 'flip', title: 'Flip Clock', subtitle: 'Realistic 3D split mechanical cards', icon: 'FLIP' },
  { id: 'minimal', title: 'Minimal Digital', subtitle: 'Ultra-crisp typography & negative space', icon: '12:45' },
  { id: 'neon', title: 'Neon Glow', subtitle: 'Cyberpunk tubular glow with layered aura', icon: 'NEON' },
  { id: 'retro', title: 'Retro Casio', subtitle: '80s vintage wristwatch LCD screen', icon: 'CASIO' },
  { id: 'nightstand', title: 'Night Stand Pro', subtitle: 'Deep crimson zero blue-light bedside mode', icon: 'BED' },
  { id: 'gradient', title: 'Gradient Wave', subtitle: 'Multi-stop vibrant iridescent color blend', icon: 'GRAD' },
  { id: 'amoled', title: 'AMOLED Black', subtitle: 'Pitch black #000000 battery saver', icon: 'OLED' },
  { id: 'bignumber', title: 'Big Number', subtitle: 'Massive edge-to-edge typography', icon: 'BIG' },
  { id: 'analog', title: 'Analog Quartz', subtitle: 'Luxury dial with smooth sweeping hands', icon: '🧭' },
];

export const ClockStylesTab: React.FC<ClockStylesTabProps> = ({
  settings,
  onUpdateSettings,
  onApplyTheme,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCustomWallpaperUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      onUpdateSettings({
        customWallpaper: base64,
        backgroundType: 'custom',
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 space-y-10">
      {/* Section 1: Clock Display Modes */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-outfit text-white">Clock Display Modes</h2>
            <p className="text-xs sm:text-sm text-neutral-400">Choose from 10 live rendered display styles</p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-white/10 text-neutral-300">
            {CLOCK_STYLES.length} Styles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CLOCK_STYLES.map((style) => {
            const isSelected = settings.clockStyle === style.id;
            return (
              <button
                key={style.id}
                onClick={() => onUpdateSettings({ clockStyle: style.id, nightMode: style.id === 'nightstand' })}
                className={`relative p-5 rounded-2xl text-left transition-all duration-200 border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-neutral-800/90 border-rose-500 shadow-lg shadow-rose-500/20 ring-1 ring-rose-500'
                    : 'bg-neutral-900/60 border-neutral-800 hover:bg-neutral-800/60 hover:border-neutral-700'
                }`}
              >
                <div className="flex items-start justify-between w-full">
                  <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-black/50 border border-white/10 text-rose-400">
                    {style.icon}
                  </span>
                  {isSelected && (
                    <span className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center text-white">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  )}
                </div>

                <div className="mt-4">
                  <h3 className="text-base font-bold text-white">{style.title}</h3>
                  <p className="text-xs text-neutral-400 mt-0.5 leading-relaxed">{style.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 2: Preset Themes */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-5 h-5 text-rose-400" />
          <h2 className="text-xl sm:text-2xl font-bold font-outfit text-white">Curated Preset Themes</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {THEME_PRESETS.map((theme) => {
            const isSelected = settings.themeId === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => onApplyTheme(theme)}
                className={`group relative p-3.5 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                  isSelected
                    ? 'bg-neutral-800 border-white/40 ring-1 ring-white/40'
                    : 'bg-neutral-900/80 border-neutral-800 hover:bg-neutral-800/60'
                }`}
              >
                {/* Color swatches strip */}
                <div className="flex items-center gap-1.5 h-5 w-full rounded-md overflow-hidden bg-black/40 p-0.5">
                  <span className="h-full flex-1 rounded-sm" style={{ backgroundColor: theme.primaryColor }} />
                  <span className="h-full flex-1 rounded-sm" style={{ backgroundColor: theme.glowColor }} />
                  <span className="h-full w-4 rounded-sm border border-white/20" style={{ backgroundColor: theme.backgroundColor }} />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-200 truncate">{theme.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-rose-400 shrink-0" />}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 3: Wallpapers & Backgrounds Gallery */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-rose-400" />
            <h2 className="text-xl sm:text-2xl font-bold font-outfit text-white">Wallpapers & Ambient Backdrops</h2>
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-medium text-white transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Photo</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCustomWallpaperUpload}
          />
        </div>

        {/* Wallpaper Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Solid AMOLED option */}
          <button
            onClick={() => onUpdateSettings({ backgroundType: 'solid', backgroundColor: '#000000' })}
            className={`relative aspect-video rounded-xl border overflow-hidden flex flex-col items-center justify-center p-3 transition-all ${
              settings.backgroundType === 'solid'
                ? 'border-rose-500 ring-2 ring-rose-500/50'
                : 'border-neutral-800 hover:border-neutral-700'
            } bg-black`}
          >
            <span className="text-xs font-bold text-neutral-300">Pure AMOLED</span>
            <span className="text-[10px] text-neutral-500">Solid Black</span>
            {settings.backgroundType === 'solid' && (
              <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center text-white">
                <Check className="w-3 h-3" />
              </span>
            )}
          </button>

          {/* Generated Wallpapers */}
          {WALLPAPERS.map((wp) => {
            const isSelected = settings.backgroundType === 'wallpaper' && settings.activeWallpaper === wp.url;
            return (
              <button
                key={wp.id}
                onClick={() => onUpdateSettings({ backgroundType: 'wallpaper', activeWallpaper: wp.url })}
                className={`group relative aspect-video rounded-xl border overflow-hidden transition-all text-left ${
                  isSelected
                    ? 'border-rose-500 ring-2 ring-rose-500/50'
                    : 'border-neutral-800 hover:border-neutral-700'
                }`}
              >
                <img
                  src={wp.thumbnail}
                  alt={wp.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-2.5">
                  <span className="text-xs font-bold text-white truncate">{wp.name}</span>
                  <span className="text-[10px] text-neutral-300">{wp.category}</span>
                </div>
                {isSelected && (
                  <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-rose-500 flex items-center justify-center text-white shadow">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </button>
            );
          })}

          {/* Custom Uploaded Wallpaper */}
          {settings.customWallpaper && (
            <div
              className={`group relative aspect-video rounded-xl border overflow-hidden transition-all text-left ${
                settings.backgroundType === 'custom'
                  ? 'border-rose-500 ring-2 ring-rose-500/50'
                  : 'border-neutral-800'
              }`}
            >
              <img
                src={settings.customWallpaper}
                alt="Custom uploaded background"
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => onUpdateSettings({ backgroundType: 'custom' })}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-2.5">
                <span className="text-xs font-bold text-white">Your Photo</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateSettings({ customWallpaper: null, backgroundType: 'solid' });
                  }}
                  className="p-1 rounded bg-red-600/80 hover:bg-red-600 text-white"
                  title="Remove custom photo"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Section 4: Deep Customization (Colors, Fonts, Glow) */}
      <section className="space-y-6 p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5 text-rose-400" />
          <h2 className="text-xl font-bold font-outfit text-white">Fine-Tune Color & Glow</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Primary Color Picker */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 block">Digit Primary Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.primaryColor}
                onChange={(e) => onUpdateSettings({ primaryColor: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <span className="text-xs font-mono text-neutral-400">{settings.primaryColor}</span>
            </div>
          </div>

          {/* Glow Color Picker */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-neutral-300 block">Glow Aura Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={settings.glowColor}
                onChange={(e) => onUpdateSettings({ glowColor: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <span className="text-xs font-mono text-neutral-400">{settings.glowColor}</span>
            </div>
          </div>

          {/* Glow Intensity Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold text-neutral-300">
              <span>Glow Intensity</span>
              <span className="font-mono text-rose-400">{settings.glowIntensity}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={settings.glowIntensity}
              onChange={(e) => onUpdateSettings({ glowIntensity: parseInt(e.target.value, 10) })}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>
        </div>

        {/* Font Family selector */}
        <div className="space-y-3 pt-4 border-t border-neutral-800">
          <label className="text-xs font-semibold text-neutral-300 block">Clock Typography Font</label>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'digital', label: 'Tech Monospace', sample: '12:45' },
              { id: 'chakra', label: 'Chakra Petch', sample: '12:45' },
              { id: 'outfit', label: 'Outfit Modern', sample: '12:45' },
              { id: 'jakarta', label: 'Jakarta Clean', sample: '12:45' },
              { id: 'retro', label: 'VT323 Casio', sample: '12:45' },
              { id: 'luxury', label: 'Cinzel Roman', sample: 'XII' },
            ].map((font) => (
              <button
                key={font.id}
                onClick={() => onUpdateSettings({ fontFamily: font.id as any })}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-colors ${
                  settings.fontFamily === font.id
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                    : 'bg-neutral-800/60 border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                }`}
              >
                {font.label} ({font.sample})
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
