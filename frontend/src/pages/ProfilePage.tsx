import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { User, Shield, Building, Mail, Calendar, Key } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="max-w-4xl space-y-8 font-mono">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <User className="w-6 h-6 text-cyan-400" />
          {t('profileTitle')}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {t('profileSubtitle')}
        </p>
      </div>

      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white text-2xl font-black">
            {user?.name.charAt(0) || 'U'}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">{user?.name}</h2>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>{user?.email}</span>
              <span>•</span>
              <span className="uppercase text-cyan-300 font-bold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30 text-[10px]">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 flex items-center gap-1.5 text-[11px]">
              <Building className="w-3.5 h-3.5" /> {t('organizationLabel')}
            </span>
            <span className="text-white font-bold text-sm block">
              {user?.organization || 'Demo Corp'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 flex items-center gap-1.5 text-[11px]">
              <Calendar className="w-3.5 h-3.5" /> {t('registeredDateLabel')}
            </span>
            <span className="text-white font-bold text-sm block">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Active Member'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 flex items-center gap-1.5 text-[11px]">
              <Shield className="w-3.5 h-3.5" /> {t('accessScopeLabel')}
            </span>
            <span className="text-emerald-400 font-bold text-sm block">
              Sandbox Auditor & Red-Team Tester
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 flex items-center gap-1.5 text-[11px]">
              <Key className="w-3.5 h-3.5" /> {t('apiKeyLabel')}
            </span>
            <span className="text-cyan-300 font-mono text-[11px] block truncate">
              tb_live_sec_99182390a8274d...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
