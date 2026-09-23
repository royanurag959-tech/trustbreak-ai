import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ScoreGaugeProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  showRiskLabel?: boolean;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  size = 140,
  strokeWidth = 10,
  label,
  showRiskLabel = true
}) => {
  const { t } = useLanguage();
  const clamped = Math.max(0, Math.min(100, score));
  const radius = (size - strokeWidth - 6) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (clamped / 100) * circumference;

  let strokeColor = '#f43f5e'; // Rose (Critical)
  let glowColor = 'rgba(244, 63, 94, 0.4)';
  let riskText = t('criticalRisk');
  let textColor = 'text-rose-400';

  if (clamped >= 80) {
    strokeColor = '#10b981'; // Emerald (Safe)
    glowColor = 'rgba(16, 185, 129, 0.4)';
    riskText = t('lowRisk');
    textColor = 'text-emerald-400';
  } else if (clamped >= 60) {
    strokeColor = '#38bdf8'; // Cyan/Blue (Moderate)
    glowColor = 'rgba(56, 189, 248, 0.4)';
    riskText = t('moderateRisk');
    textColor = 'text-cyan-400';
  } else if (clamped >= 40) {
    strokeColor = '#f59e0b'; // Amber (High)
    glowColor = 'rgba(245, 158, 11, 0.4)';
    riskText = t('highRisk');
    textColor = 'text-amber-400';
  }

  const displayLabel = label !== undefined ? label : t('securityScore');

  return (
    <div className="flex flex-col items-center justify-center font-mono">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        {/* Outer subtle glowing ring */}
        <div
          className="absolute inset-0 rounded-full border border-slate-800/80 transition-all duration-700"
          style={{ boxShadow: `0 0 20px ${glowColor}` }}
        />

        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#0f172a"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated score arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 6px ${strokeColor})`
            }}
          />
        </svg>

        {/* Center HUD Information */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-3xl font-black tracking-tight text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]">
            {clamped}
          </span>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-widest -mt-1">
            {t('score')}
          </span>
        </div>
      </div>

      {displayLabel && (
        <span className="mt-3 text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
          {displayLabel}
        </span>
      )}
      {showRiskLabel && (
        <span className={`text-[10px] font-bold tracking-wider mt-0.5 px-2 py-0.5 rounded-full border border-current/20 bg-current/5 ${textColor}`}>
          {riskText}
        </span>
      )}
    </div>
  );
};
