import { ClockSettings } from '../types/clock';

export function formatTimeDigits(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

export function getFormattedDate(date: Date, lang: string = 'en', format: 'full' | 'short' | 'iso' = 'full'): string {
  if (format === 'iso') {
    return date.toISOString().split('T')[0];
  }

  const localeMap: Record<string, string> = {
    en: 'en-US',
    es: 'es-ES',
    fr: 'fr-FR',
    de: 'de-DE',
    ar: 'ar-SA',
    ur: 'ur-PK',
    ja: 'ja-JP',
    zh: 'zh-CN',
  };

  const locale = localeMap[lang] || 'en-US';

  if (format === 'short') {
    return new Intl.DateTimeFormat(locale, {
      month: 'short',
      day: 'numeric',
      weekday: 'short',
    }).format(date);
  }

  return new Intl.DateTimeFormat(locale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

export function getTimeParts(date: Date, is24Hour: boolean) {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const milliseconds = date.getMilliseconds();
  let ampm = '';

  if (!is24Hour) {
    ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 hour should be 12
  }

  return {
    hours: formatTimeDigits(hours),
    rawHours: hours,
    minutes: formatTimeDigits(minutes),
    rawMinutes: minutes,
    seconds: formatTimeDigits(seconds),
    rawSeconds: seconds,
    milliseconds,
    ampm,
  };
}

export function getWorldTime(timezone: string, is24Hour: boolean) {
  try {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: !is24Hour,
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });

    const parts = formatter.formatToParts(now);
    let hour = '';
    let minute = '';
    let second = '';
    let dayPeriod = '';
    let weekday = '';
    let month = '';
    let day = '';

    parts.forEach((p) => {
      if (p.type === 'hour') hour = p.value.padStart(2, '0');
      if (p.type === 'minute') minute = p.value.padStart(2, '0');
      if (p.type === 'second') second = p.value.padStart(2, '0');
      if (p.type === 'dayPeriod') dayPeriod = p.value;
      if (p.type === 'weekday') weekday = p.value;
      if (p.type === 'month') month = p.value;
      if (p.type === 'day') day = p.value;
    });

    // Calculate time difference relative to local time
    const localNow = new Date();
    const targetDateStr = now.toLocaleString('en-US', { timeZone: timezone });
    const targetDate = new Date(targetDateStr);
    const diffHours = Math.round((targetDate.getTime() - localNow.getTime()) / (1000 * 60 * 60));

    let diffText = 'Same time';
    if (diffHours > 0) {
      diffText = `+${diffHours} hrs ahead`;
    } else if (diffHours < 0) {
      diffText = `${Math.abs(diffHours)} hrs behind`;
    }

    // Check if day or night (rough 6am to 6pm)
    const rawHour = targetDate.getHours();
    const isDay = rawHour >= 6 && rawHour < 18;

    return {
      timeStr: `${hour}:${minute}`,
      secondsStr: second,
      ampm: dayPeriod,
      dateStr: `${weekday}, ${month} ${day}`,
      diffText,
      isDay,
    };
  } catch (e) {
    return {
      timeStr: '--:--',
      secondsStr: '--',
      ampm: '',
      dateStr: '',
      diffText: '',
      isDay: true,
    };
  }
}

export function getWeatherConditionName(code: number): { label: string; icon: string } {
  // WMO Weather interpretation codes (WW)
  if (code === 0) return { label: 'Clear Sky', icon: 'Sun' };
  if (code === 1) return { label: 'Mainly Clear', icon: 'SunMedium' };
  if (code === 2) return { label: 'Partly Cloudy', icon: 'CloudSun' };
  if (code === 3) return { label: 'Overcast', icon: 'Cloud' };
  if ([45, 48].includes(code)) return { label: 'Foggy', icon: 'CloudFog' };
  if ([51, 53, 55, 56, 57].includes(code)) return { label: 'Drizzle', icon: 'CloudDrizzle' };
  if ([61, 63, 65, 80, 81, 82].includes(code)) return { label: 'Rain', icon: 'CloudRain' };
  if ([71, 73, 75, 77, 85, 86].includes(code)) return { label: 'Snow', icon: 'Snowflake' };
  if ([95, 96, 99].includes(code)) return { label: 'Thunderstorm', icon: 'CloudLightning' };
  return { label: 'Fair', icon: 'Sun' };
}
