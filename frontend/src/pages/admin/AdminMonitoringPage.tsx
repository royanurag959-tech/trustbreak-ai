import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { RiskBadge } from '../../components/RiskBadge';
import { useLanguage } from '../../contexts/LanguageContext';
import { Activity, Shield, RefreshCw } from 'lucide-react';

export const AdminMonitoringPage: React.FC = () => {
  const { t, tDynamic } = useLanguage();
  const [monitoringTests, setMonitoringTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMonitoring = async () => {
    try {
      const data = await api.get<any[]>('/admin/monitoring');
      setMonitoringTests(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMonitoring();
  }, []);

  return (
    <div className="space-y-6 font-mono">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-cyan-400" />
            {t('crossTenantMonitoringTitle')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t('crossTenantMonitoringSubtitle')}
          </p>
        </div>

        <button
          onClick={fetchMonitoring}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500 text-[11px]">
              <th className="pb-3 font-semibold">{t('testIdCol')}</th>
              <th className="pb-3 font-semibold">{t('agentCandidate')}</th>
              <th className="pb-3 font-semibold">{t('testSuiteCol')}</th>
              <th className="pb-3 font-semibold">{t('userTenantCol')}</th>
              <th className="pb-3 font-semibold">{t('riskScoreCol')}</th>
              <th className="pb-3 font-semibold">{t('evaluationCol')}</th>
              <th className="pb-3 font-semibold">{t('timestampCol')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {monitoringTests.map((t) => (
              <tr key={t.id} className="hover:bg-slate-950/50">
                <td className="py-3.5 font-bold text-slate-300">#TB-{t.id}</td>
                <td className="py-3.5 font-bold text-white">{t.agent_name}</td>
                <td className="py-3.5 text-cyan-300 font-semibold">{tDynamic(t.test_type)}</td>
                <td className="py-3.5 text-slate-400">{t.user_email}</td>
                <td className="py-3.5 font-bold text-slate-200">{t.risk_score}/100</td>
                <td className="py-3.5">
                  <RiskBadge level={t.result} size="sm" />
                </td>
                <td className="py-3.5 text-slate-500 text-[11px]">
                  {new Date(t.started_at).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
