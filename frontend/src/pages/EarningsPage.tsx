import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { EarningsStats } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { DollarSign, TrendingUp, Users, CreditCard, ArrowUpRight, BarChart2 } from 'lucide-react';
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

export const EarningsPage: React.FC = () => {
  const { t, language } = useLanguage();
  const [earnings, setEarnings] = useState<EarningsStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<EarningsStats>('/dashboard/earnings')
      .then((data) => setEarnings(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const monthlyHistory = [
    { month: language === 'hi' ? "अप्रैल" : "Apr", revenue: 1420 },
    { month: language === 'hi' ? "मई" : "May", revenue: 1890 },
    { month: language === 'hi' ? "जून" : "Jun", revenue: 2340 },
    { month: language === 'hi' ? "जुलाई" : "Jul", revenue: 2950 },
    { month: language === 'hi' ? "अगस्त" : "Aug", revenue: 3680 },
    { month: language === 'hi' ? "सितंबर" : "Sep", revenue: 4210 }
  ];

  const planBreakdown = earnings ? [
    { name: language === 'hi' ? 'निःशुल्क' : 'Free Tier', value: earnings.free_users, color: '#64748b' },
    { name: language === 'hi' ? 'प्रो ($49)' : 'Pro Tier ($49)', value: earnings.pro_users, color: '#38bdf8' },
    { name: language === 'hi' ? 'बिज़नेस ($149)' : 'Business ($149)', value: earnings.business_users, color: '#a855f7' },
    { name: language === 'hi' ? 'एंटरप्राइज ($499)' : 'Enterprise ($499)', value: earnings.enterprise_users, color: '#10b981' }
  ] : [];

  return (
    <div className="space-y-8 font-mono">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <DollarSign className="w-6 h-6 text-emerald-400" />
          {t('earningsTitle')}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {t('earningsSubtitle')}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">{t('monthlyRecurringMRR')}</div>
          <div className="text-3xl font-black text-emerald-400">
            ${earnings?.monthly_revenue.toLocaleString() || '4,210'}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +18.4% {t('thisMonthTrend')}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">{t('totalCumulativeARR')}</div>
          <div className="text-3xl font-black text-white">
            ${earnings?.total_revenue.toLocaleString() || '27,365'}
          </div>
          <div className="text-[11px] text-cyan-400 mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> {t('highRetention')}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">{t('payingSubscribers')}</div>
          <div className="text-3xl font-black text-cyan-300">
            {earnings?.active_subscribers || 52}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {t('acrossTiers')}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-xs text-slate-400 mb-1">{t('freeSandboxUsers')}</div>
          <div className="text-3xl font-black text-slate-300">
            {earnings?.free_users || 110}
          </div>
          <div className="text-[11px] text-cyan-400 mt-1">
            {t('conversionRate')}: ~8.2%
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              {t('simulatedMrrTrajectory')}
            </h2>
            <span className="text-xs text-slate-500">{t('trailing6Months')}</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace' }} />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} name={language === 'hi' ? "राजस्व ($)" : "Revenue ($)"} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-cyan-400" />
              {t('subscriptionTierShare')}
            </h2>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={planBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {planBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', fontFamily: 'monospace' }} />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
