import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { SafetyBanner } from '../components/SafetyBanner';
import { useLanguage } from '../contexts/LanguageContext';

export const PublicLayout: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar />
      <SafetyBanner />
      <div className="flex-1 flex flex-col">
        <Outlet />
      </div>
      <footer className="py-8 px-6 border-t border-slate-900 bg-slate-950/80 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">TRUSTBREAK AI</span>
            <span>—</span>
            <span className="text-cyan-400">“{t('tagline')}”</span>
          </div>
          <div>
            {t('safetyNotice')}
          </div>
        </div>
      </footer>
    </div>
  );
};
