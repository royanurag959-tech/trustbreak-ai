import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { Settings, Globe, Moon, Bell, ShieldCheck, Check } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { showToast } = useToast();

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [failClosed, setFailClosed] = useState(true);
  const [autoSanitize, setAutoSanitize] = useState(true);

  const handleSave = () => {
    showToast(t('savePreferences'), 'success');
  };

  return (
    <div className="max-w-4xl space-y-8 font-mono">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-slate-400" />
          {t('settingsTitle')}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {t('settingsSubtitle')}
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        {/* Language setting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-cyan-400" />
              {t('interfaceLanguage')}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('languageDesc')}
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                language === 'en'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-4 py-2 rounded-lg font-bold transition-colors ${
                language === 'hi'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              हिंदी
            </button>
          </div>
        </div>

        {/* Visual Theme */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Moon className="w-4 h-4 text-indigo-400" />
              {t('themeAppearance')}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {t('themeDesc')}
            </p>
          </div>

          <span className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300 font-semibold">
            {t('darkFirstTheme')}
          </span>
        </div>

        {/* Security sandbox preferences */}
        <div className="space-y-4 border-b border-slate-800 pb-6">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {t('sandboxGuardrailsTitle')}
          </h2>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <div>
                <span className="font-bold text-white block">{t('failClosedTitle')}</span>
                <span className="text-slate-400 text-[11px]">
                  {t('failClosedDesc')}
                </span>
              </div>
              <input
                type="checkbox"
                checked={failClosed}
                onChange={(e) => setFailClosed(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-400 focus:ring-0 bg-slate-900 border-slate-700"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer">
              <div>
                <span className="font-bold text-white block">{t('autoRedactTitle')}</span>
                <span className="text-slate-400 text-[11px]">
                  {t('autoRedactDesc')}
                </span>
              </div>
              <input
                type="checkbox"
                checked={autoSanitize}
                onChange={(e) => setAutoSanitize(e.target.checked)}
                className="w-4 h-4 rounded text-cyan-400 focus:ring-0 bg-slate-900 border-slate-700"
              />
            </label>
          </div>
        </div>

        {/* Notification preferences */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-400" />
            {t('alertsTitle')}
          </h2>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer text-xs">
            <div>
              <span className="font-bold text-white block">{t('criticalAlertsTitle')}</span>
              <span className="text-slate-400 text-[11px]">
                {t('criticalAlertsDesc')}
              </span>
            </div>
            <input
              type="checkbox"
              checked={emailAlerts}
              onChange={(e) => setEmailAlerts(e.target.checked)}
              className="w-4 h-4 rounded text-cyan-400 focus:ring-0 bg-slate-900 border-slate-700"
            />
          </label>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-md transition-colors"
          >
            {t('savePreferences')}
          </button>
        </div>
      </div>
    </div>
  );
};
