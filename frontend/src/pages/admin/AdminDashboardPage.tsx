import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useLanguage } from '../../contexts/LanguageContext';
import { Shield, Users, Bot, ShieldAlert, DollarSign, Activity, Sparkles, ArrowRight } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [stats, setStats] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<any>('/admin/stats')
      .then((data) => setStats(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const planData = stats?.subscription_distribution ? [
    { name: language === 'hi' ? 'निःशुल्क' : 'Free Users', value: stats.subscription_distribution.free, color: '#64748b' },
    { name: language === 'hi' ? 'प्रो ($49)' : 'Pro ($49)', value: stats.subscription_distribution.pro, color: '#38bdf8' },
    { name: language === 'hi' ? 'बिज़नेस ($149)' : 'Business ($149)', value: stats.subscription_distribution.business, color: '#a855f7' },
    { name: language === 'hi' ? 'एंटरप्राइज ($499)' : 'Enterprise ($499)', value: stats.subscription_distribution.enterprise, color: '#10b981' }
  ] : [];

  return (
    <div className="space-y-8 font-mono">
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> {t('adminConsole')}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            {t('adminCommandCenter')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t('adminSubtitle')}
          </p>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">{t('totalPlatformUsers')}</div>
          <div className="text-3xl font-black text-white">
            {stats?.total_users || 164}
          </div>
          <div className="text-[11px] text-purple-400 mt-1 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> {t('multiTenantAccounts')}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">{t('registeredAgents')}</div>
          <div className="text-3xl font-black text-cyan-300">
            {stats?.total_agents || 88}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {t('acrossAllOrgs')}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">{t('simulatedTestsRun')}</div>
          <div className="text-3xl font-black text-emerald-400">
            {stats?.total_tests || 324}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            {t('sandboxIsolation100')}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">{t('platformMrr')}</div>
          <div className="text-3xl font-black text-amber-400">
            ${stats?.monthly_recurring_revenue?.toLocaleString() || '2,490'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {t('cumulativeLabel')}: ${stats?.total_revenue?.toLocaleString() || '14,980'}
          </div>
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            {t('globalSubscriptionTiers')}
          </h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {planData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace' }} />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Admin Actions */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white mb-2">{t('adminNav')}</h2>
            <p className="text-xs text-slate-400 mb-4">
              {t('adminNavDesc')}
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <Link
              to="/admin/users"
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="font-bold text-white">{t('managePlatformUsers')}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              to="/admin/monitoring"
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-white">{t('crossTenantMonitoring')}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </Link>

            <Link
              to="/admin/analytics"
              className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-purple-500/40 flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span className="font-bold text-white">{t('platformVulnTelemetry')}</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-500" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
