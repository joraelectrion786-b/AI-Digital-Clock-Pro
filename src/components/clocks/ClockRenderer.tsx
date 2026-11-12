import React from 'react';
import { ClockSettings, AlarmItem } from '../../types/clock';
import { DigitalLedClock } from './DigitalLedClock';
import { FlipClock } from './FlipClock';
import { MinimalClock } from './MinimalClock';
import { NeonGlowClock } from './NeonGlowClock';
import { RetroClock } from './RetroClock';
import { NightStandClock } from './NightStandClock';
import { GradientClock } from './GradientClock';
import { AmoledClock } from './AmoledClock';
import { BigNumberClock } from './BigNumberClock';
import { AnalogClock } from './AnalogClock';

interface ClockRendererProps {
  currentTime: Date;
  settings: ClockSettings;
  isLandscape?: boolean;
  nextAlarm?: AlarmItem | null;
  batteryLevel?: number | null;
  isCharging?: boolean;
  onExitNightStand?: () => void;
}

export const ClockRenderer: React.FC<ClockRendererProps> = (props) => {
  const { settings } = props;

  // If Night Stand mode is active via toggle or clock style
  if (settings.nightMode || settings.clockStyle === 'nightstand') {
    return <NightStandClock {...props} />;
  }

  switch (settings.clockStyle) {
    case 'digital_led':
      return <DigitalLedClock {...props} />;
    case 'flip':
      return <FlipClock {...props} />;
    case 'minimal':
      return <MinimalClock {...props} />;
    case 'neon':
      return <NeonGlowClock {...props} />;
    case 'retro':
      return <RetroClock {...props} />;
    case 'gradient':
      return <GradientClock {...props} />;
    case 'amoled':
      return <AmoledClock {...props} />;
    case 'bignumber':
      return <BigNumberClock {...props} />;
    case 'analog':
      return <AnalogClock {...props} />;
    default:
      return <DigitalLedClock {...props} />;
  }
};
