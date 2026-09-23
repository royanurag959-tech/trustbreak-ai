import React from 'react';
import { LineChart as LineChartIcon, ShieldAlert, Bug, CheckCircle, ArrowUpRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  Legend
} from 'recharts';

export const AdminAnalyticsPage: React.FC = () => {
  const { t, tDynamic, language } = useLanguage();

  const telemetryData = [
    { suite: tDynamic("Prompt Injection"), attempts: 184, blocked: 162, bypasses: 22 },
    { suite: tDynamic("Unauthorized Access"), attempts: 120, blocked: 108, bypasses: 12 },
    { suite: tDynamic("Tool Misuse"), attempts: 145, blocked: 119, bypasses: 26 },
    { suite: tDynamic("Sensitive Data Exposure"), attempts: 96, blocked: 82, bypasses: 14 },
    { suite: tDynamic("Malicious Instructions"), attempts: 75, blocked: 67, bypasses: 8 },
    { suite: tDynamic("Instruction Override"), attempts: 110, blocked: 94, bypasses: 16 }
  ];

  return (
    <div className="space-y-8 font-mono">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <LineChartIcon className="w-6 h-6 text-purple-400" />
          {t('globalAttackTelemetry')}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {t('globalAttackTelemetryDesc')}
        </p>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">
            {t('attackVectorDistTitle')}
          </h2>
          <span className="text-xs text-slate-400">{t('allSandboxSessions')}</span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={telemetryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="suite" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
              <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace' }} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Bar dataKey="blocked" fill="#10b981" name={t('blockedByPolicyEngine')} radius={[4, 4, 0, 0]} />
              <Bar dataKey="bypasses" fill="#f43f5e" name={t('vulnFlaggedBypass')} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
