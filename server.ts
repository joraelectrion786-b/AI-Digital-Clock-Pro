import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side with telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// AI Theme Generator Endpoint
app.post('/api/gemini/suggest-theme', async (req, res) => {
  try {
    const { mood = 'modern and sleek', currentStyle = 'Digital LED' } = req.body || {};

    const hasValidKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';

    if (!hasValidKey) {
      // Instant intelligent fallback theme based on mood
      const isNight = mood.toLowerCase().includes('night') || mood.toLowerCase().includes('sleep');
      const isCyber = mood.toLowerCase().includes('cyber') || mood.toLowerCase().includes('game');
      const isZen = mood.toLowerCase().includes('zen') || mood.toLowerCase().includes('minimal');

      const fallbackTheme = isNight
        ? {
            name: 'Crimson Abyss',
            description: 'Ultra-low glare crimson red crafted for zero blue-light melatonin preservation.',
            primaryColor: '#ff2d55',
            glowColor: '#dc2626',
            backgroundColor: '#000000',
            bgType: 'solid',
            fontStyle: 'digital',
            clockStyle: 'nightstand',
          }
        : isCyber
        ? {
            name: 'Neon Cyberpunk',
            description: 'Vivid electric cyan and hot magenta neon tubes for high focus.',
            primaryColor: '#00f0ff',
            glowColor: '#ff003c',
            backgroundColor: '#050508',
            bgType: 'solid',
            fontStyle: 'chakra',
            clockStyle: 'neon',
          }
        : isZen
        ? {
            name: 'Nordic Mist',
            description: 'Muted slate and warm bone minimal typography with generous spacing.',
            primaryColor: '#e2e8f0',
            glowColor: '#94a3b8',
            backgroundColor: '#090d16',
            bgType: 'solid',
            fontStyle: 'outfit',
            clockStyle: 'minimal',
          }
        : {
            name: 'Amber Glow',
            description: 'Warm retro amber segments reminiscent of vintage hi-fi clocks.',
            primaryColor: '#f59e0b',
            glowColor: '#b45309',
            backgroundColor: '#0c0a09',
            bgType: 'solid',
            fontStyle: 'chakra',
            clockStyle: 'digital_led',
          };

      return res.status(200).json({
        success: true,
        theme: fallbackTheme,
      });
    }

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Generate a gorgeous, high-contrast clock visual theme for AI Digital Clock Pro based on the mood: "${mood}". Current clock preference: "${currentStyle}". Choose aesthetic colors that have high visibility on dark/AMOLED backgrounds.`,
      config: {
        systemInstruction: `You are an expert luxury digital clock and UI designer. Design high-contrast visual themes that look spectacular on smartphones, OLED tablets, and nightstands. Always output pure valid JSON matching the schema.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: 'Creative theme title like "Crimson Abyss" or "Nordic Frost"' },
            description: { type: Type.STRING, description: 'A short sentence explaining why this aesthetic works.' },
            primaryColor: { type: Type.STRING, description: 'Hex color code for numbers e.g. #ef4444 or #38bdf8' },
            glowColor: { type: Type.STRING, description: 'Hex color code for text-shadow glow e.g. #dc2626 or #0284c7' },
            backgroundColor: { type: Type.STRING, description: 'Hex color code for background e.g. #000000 or #0a0a0f' },
            bgType: { type: Type.STRING, description: 'solid, gradient, or amoled' },
            fontStyle: { type: Type.STRING, description: 'digital, chakra, outfit, jakarta, retro, or luxury' },
            clockStyle: { type: Type.STRING, description: 'digital_led, flip, minimal, neon, retro, nightstand, gradient, amoled, bignumber, analog' },
          },
          required: ['name', 'description', 'primaryColor', 'glowColor', 'backgroundColor', 'bgType', 'fontStyle', 'clockStyle'],
        },
      },
    });
    const response = await generatePromise;

    const parsed = JSON.parse(response.text || '{}');
    return res.json({ success: true, theme: parsed });
  } catch (error: any) {
    console.error('Error generating AI theme:', error);
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to generate theme',
      fallbackTheme: {
        name: 'Electric Violet',
        description: 'Vibrant neon purple with deep velvet blacks.',
        primaryColor: '#c084fc',
        glowColor: '#9333ea',
        backgroundColor: '#05020c',
        bgType: 'solid',
        fontStyle: 'outfit',
        clockStyle: 'neon',
      },
    });
  }
});

// AI Clock Assistant Chat Endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, history = [], currentClockState = {} } = req.body || {};

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const hasValidKey = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY';

    if (!hasValidKey) {
      return res.status(200).json({
        reply: `AI Assistant connected! You can customize your clock styles, switch to Night Stand mode for zero blue-light sleep, set precise multi-tone alarms, or use the stopwatch and world clock tools from the bottom bar. Feel free to ask me for color palettes, sleep cycle advice, or time management routines!`,
      });
    }

    const stateContext = `Current User Clock Context:
- Clock Style: ${currentClockState.clockStyle || 'Digital LED'}
- Primary Color: ${currentClockState.primaryColor || '#ef4444'}
- Background: ${currentClockState.backgroundMode || 'AMOLED Black'}
- Time Format: ${currentClockState.is24Hour ? '24-hour' : '12-hour'}
- Night Stand Mode: ${currentClockState.isNightStand ? 'Active' : 'Inactive'}
- Active Alarms: ${currentClockState.alarmsCount || 0}`;

    const prompt = `User question: "${message}"\n\n${stateContext}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: `You are the AI Assistant inside "AI Digital Clock Pro", an ultra-premium digital clock and time studio web application.
You are warm, knowledgeable, concise, and helpful. You advise users on:
1. Optimal clock aesthetics, color combinations for night vision (e.g. low-frequency red/amber for circadian health), and theme selection.
2. Sleep hygiene, circadian rhythms, Pomodoro work-rest cycles (25/5), timezones, and world clock differences.
3. How to use features of this app: 10 clock styles (Digital LED, Flip Clock, Minimal, Neon Glow, Retro Casio, Night Stand, Gradient, AMOLED, Big Number, Analog), Alarms with Web Audio synthesis, Stopwatch with lap splits, Countdown Timers with presets, World Clocks, and Background Wallpapers.
Keep your responses succinct, stylish, formatted with crisp markdown, and under 150 words unless the user asks for a comprehensive explanation.`,
      },
    });

    return res.json({ reply: response.text || 'I am here to assist with your clock experience!' });
  } catch (error: any) {
    console.error('Error in AI chat:', error);
    return res.status(500).json({
      reply: 'I encountered an error connecting to the AI service. You can still customize your clock using the manual styles, themes, and settings tabs!',
      error: error?.message,
    });
  }
});

// Live Weather Proxy using Open-Meteo (No API key needed, high reliability)
app.get('/api/weather', async (req, res) => {
  try {
    const lat = req.query.lat ? parseFloat(req.query.lat as string) : 40.7128; // default NYC
    const lon = req.query.lon ? parseFloat(req.query.lon as string) : -74.006;
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=celsius`;

    const weatherRes = await fetch(url);
    if (!weatherRes.ok) {
      throw new Error(`Weather API error: ${weatherRes.statusText}`);
    }
    const data = await weatherRes.json();
    return res.json({ success: true, data: data.current });
  } catch (err: any) {
    return res.json({
      success: false,
      data: {
        temperature_2m: 21,
        relative_humidity_2m: 52,
        weather_code: 1, // Mainly clear
        wind_speed_10m: 8.5,
      },
    });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
