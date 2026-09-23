import React from 'react';
import { ShieldCheck, Lock, Activity } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export const SafetyBanner: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const { t } = useLanguage();

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded-full text-xs font-mono shadow-sm shadow-cyan-500/10">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
        <span className="truncate">{t('sandboxIsolationEnforced')}</span>
      </div>
    );
  }

  return (
    <div className="w-full bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-y border-cyan-500/20 py-2 px-4 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-mono">
        <div className="flex items-center gap-2 text-cyan-300">
          <div className="flex items-center justify-center w-5 h-5 rounded-md bg-cyan-500/15 border border-cyan-500/40 text-cyan-400">
            <Lock className="w-3 h-3" />
          </div>
          <span className="font-bold tracking-wide">
            {t('safetyBanner')}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <strong className="text-emerald-400 font-semibold">{t('mockEnvironmentNotice')}</strong>
          </span>
          <span className="hidden md:inline text-slate-700">|</span>
          <span className="hidden md:inline text-slate-400">
            {t('zeroThirdParty')}
          </span>
        </div>
      </div>
    </div>
  );
};
