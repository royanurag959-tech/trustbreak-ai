import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface RiskBadgeProps {
  level: string;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md' }) => {
  const { t } = useLanguage();
  const normalized = (level || '').toUpperCase();

  let styles = 'bg-slate-800 text-slate-300 border-slate-700';

  if (normalized === 'CRITICAL') {
    styles = 'bg-rose-500/15 text-rose-400 border-rose-500/30';
  } else if (normalized === 'HIGH') {
    styles = 'bg-orange-500/15 text-orange-400 border-orange-500/30';
  } else if (normalized === 'MODERATE' || normalized === 'MEDIUM') {
    styles = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  } else if (normalized === 'LOW') {
    styles = 'bg-blue-500/15 text-blue-400 border-blue-500/30';
  } else if (normalized === 'SAFE' || normalized === 'PASSED' || normalized === 'TRUSTED') {
    styles = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  } else if (normalized === 'BLOCKED') {
    styles = 'bg-purple-500/15 text-purple-400 border-purple-500/30';
  } else if (normalized === 'WARNING') {
    styles = 'bg-amber-500/15 text-amber-400 border-amber-500/30';
  } else if (normalized === 'INFO') {
    styles = 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
  }

  const getTranslatedLabel = () => {
    switch (normalized) {
      case 'CRITICAL':
        return t('critical');
      case 'HIGH':
        return t('high');
      case 'MODERATE':
      case 'MEDIUM':
        return t('moderate');
      case 'LOW':
        return t('low');
      case 'SAFE':
        return t('safe');
      case 'PASSED':
        return t('passed');
      case 'TRUSTED':
        return t('trusted');
      case 'BLOCKED':
        return t('blocked');
      case 'WARNING':
        return t('warning');
      case 'INFO':
        return t('info');
      case 'VULNERABLE':
        return t('vulnerable');
      case 'OPEN':
        return t('open');
      case 'MITIGATED':
        return t('mitigated');
      case 'PENDING':
        return t('pending');
      case 'APPLIED':
        return t('applied');
      case 'VERIFIED':
        return t('verified');
      default:
        return level;
    }
  };

  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5'
  }[size];

  return (
    <span className={`inline-flex items-center font-mono font-medium rounded-full border ${styles} ${sizeStyles}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-80" />
      {getTranslatedLabel()}
    </span>
  );
};
