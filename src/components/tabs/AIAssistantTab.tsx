import React, { useState } from 'react';
import { ClockSettings, ThemePreset } from '../../types/clock';
import { Sparkles, Send, Bot, User, RefreshCw, Palette, Moon, Zap, Coffee, Check } from 'lucide-react';

interface AIAssistantTabProps {
  settings: ClockSettings;
  onUpdateSettings: (newSettings: Partial<ClockSettings>) => void;
  onApplyTheme: (theme: ThemePreset) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: Date;
  suggestedTheme?: any;
}

export const AIAssistantTab: React.FC<AIAssistantTabProps> = ({
  settings,
  onUpdateSettings,
  onApplyTheme,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello! I am your AI Clock Stylist powered by Gemini.
I can design personalized visual clock themes, recommend circadian-friendly color schemes for your bedroom, explain optimal productivity timers (like Pomodoro), or fine-tune your display for OLED screens.
Try tapping one of the quick suggestions below or tell me what mood you want!`,
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [themeGenerating, setThemeGenerating] = useState(false);
  const [generatedTheme, setGeneratedTheme] = useState<any>(null);
  const [appliedThemeId, setAppliedThemeId] = useState<string | null>(null);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          currentClockState: {
            clockStyle: settings.clockStyle,
            primaryColor: settings.primaryColor,
            backgroundMode: settings.backgroundType,
            is24Hour: settings.is24Hour,
            isNightStand: settings.nightMode,
          },
        }),
      });

      const data = await res.json();
      const aiReply = data.reply || 'Here is what I recommend for your clock!';

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'I could not connect to the AI service. You can still customize your clock styles and themes using the Styles tab!',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const generateThemeForMood = async (mood: string) => {
    setThemeGenerating(true);
    setGeneratedTheme(null);
    setAppliedThemeId(null);

    try {
      const res = await fetch('/api/gemini/suggest-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood,
          currentStyle: settings.clockStyle,
        }),
      });

      const data = await res.json();
      if (data.theme) {
        setGeneratedTheme(data.theme);
      } else if (data.fallbackTheme) {
        setGeneratedTheme(data.fallbackTheme);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setThemeGenerating(false);
    }
  };

  const applyGeneratedTheme = (theme: any) => {
    onUpdateSettings({
      primaryColor: theme.primaryColor,
      glowColor: theme.glowColor,
      backgroundColor: theme.backgroundColor,
      backgroundType: 'solid',
      fontFamily: theme.fontStyle || 'outfit',
      clockStyle: theme.clockStyle || 'neon',
    });
    setAppliedThemeId(theme.name);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-outfit text-white">Gemini AI Clock Stylist</h2>
            <p className="text-xs sm:text-sm text-neutral-400">Intelligent theme generation & time ergonomics advice</p>
          </div>
        </div>
      </div>

      {/* Instant AI Theme Generator Studio Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-950 border border-neutral-700/80 shadow-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Palette className="w-4 h-4 text-rose-400" />
            <span>Generate Instant Theme with Gemini</span>
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">
            One-Click Apply
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { label: 'Deep Sleep Bedside', icon: Moon, mood: 'deep red zero blue light relaxing bedroom clock' },
            { label: 'Cyberpunk Arcade', icon: Zap, mood: 'electric cyan neon high energy gaming room' },
            { label: 'Nordic Zen Minimal', icon: Coffee, mood: 'clean warm minimalist monochrome calm daylight aesthetic' },
            { label: 'Sunset Twilight', icon: Sparkles, mood: 'warm amber violet dusk sky colors' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => generateThemeForMood(item.mood)}
                disabled={themeGenerating}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700/90 border border-neutral-700 text-xs font-semibold text-neutral-200 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Icon className="w-3.5 h-3.5 text-rose-400" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {themeGenerating && (
          <div className="flex items-center justify-center gap-3 py-4 text-xs font-medium text-rose-400 animate-pulse">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Gemini is harmonizing colors and generating clock styling...</span>
          </div>
        )}

        {/* Generated Theme Preview Box */}
        {generatedTheme && (
          <div className="p-4 rounded-xl bg-black/60 border border-neutral-700 space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-bold text-white">{generatedTheme.name}</h4>
                <p className="text-xs text-neutral-400">{generatedTheme.description}</p>
              </div>

              <button
                onClick={() => applyGeneratedTheme(generatedTheme)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                {appliedThemeId === generatedTheme.name ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Applied to Clock!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Apply to Clock</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs font-mono text-neutral-400">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: generatedTheme.primaryColor }} />
                <span>Digit: {generatedTheme.primaryColor}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: generatedTheme.glowColor }} />
                <span>Glow: {generatedTheme.glowColor}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: generatedTheme.backgroundColor }} />
                <span>Backdrop: {generatedTheme.backgroundColor}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Chat Messages Section */}
      <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col h-[420px] overflow-hidden">
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.sender === 'user'
                    ? 'bg-rose-600 text-white'
                    : 'bg-gradient-to-tr from-neutral-800 to-neutral-700 text-rose-400 border border-neutral-700'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-rose-600 text-white rounded-tr-none'
                    : 'bg-neutral-950 text-neutral-200 border border-neutral-800 rounded-tl-none whitespace-pre-wrap'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-neutral-400 italic">
              <Bot className="w-4 h-4 text-rose-400 animate-pulse" />
              <span>Thinking...</span>
            </div>
          )}
        </div>

        {/* Chat Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="p-3 border-t border-neutral-800 bg-neutral-950/80 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask AI for clock advice, sleep science, or theme ideas..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs sm:text-sm text-white focus:outline-none focus:border-rose-500 placeholder:text-neutral-500"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="w-10 h-10 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-30 disabled:pointer-events-none text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
