import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ActionLog, SecurityTest } from '../types';
import { LiveActionStream } from '../components/LiveActionStream';
import { useLanguage } from '../contexts/LanguageContext';
import { Activity, Filter, RefreshCw, ShieldAlert, CheckCircle } from 'lucide-react';

export const ActionMonitorPage: React.FC = () => {
  const { t, tDynamic } = useLanguage();
  const [logs, setLogs] = useState<ActionLog[]>([]);
  const [tests, setTests] = useState<SecurityTest[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(null);
  const [riskFilter, setRiskFilter] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<SecurityTest[]>('/tests')
      .then((res) => {
        setTests(res);
        if (res.length > 0) {
          setSelectedTestId(res[0].id);
          return api.get<ActionLog[]>(`/tests/${res[0].id}/logs`);
        }
        return [];
      })
      .then((logData) => setLogs(logData || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleTestChange = async (testId: number) => {
    setSelectedTestId(testId);
    try {
      const data = await api.get<ActionLog[]>(`/tests/${testId}/logs`);
      setLogs(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefresh = async () => {
    if (selectedTestId) {
      const data = await api.get<ActionLog[]>(`/tests/${selectedTestId}/logs`);
      setLogs(data);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Activity className="w-6 h-6 text-emerald-400" />
            {t('actionMonitorTitle')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t('actionMonitorSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            title={t('refreshStream')}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Control filter bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-semibold">{t('activeTestSession')}:</span>
          <select
            value={selectedTestId || ''}
            onChange={(e) => handleTestChange(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 text-cyan-300 font-bold px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500"
          >
            {tests.map((tItem) => (
              <option key={tItem.id} value={tItem.id}>
                #{tItem.id} — {tDynamic(tItem.test_type)} ({tDynamic(tItem.result)})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">{t('filterByRisk')}:</span>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500"
          >
            <option value="">{t('allEvents')}</option>
            <option value="CRITICAL">{t('critical')}</option>
            <option value="BLOCKED">{t('blocked')}</option>
            <option value="WARNING">{t('warning')}</option>
            <option value="INFO">{t('info')}</option>
            <option value="SAFE">{t('safe')}</option>
          </select>
        </div>
      </div>

      {/* Terminal View */}
      <LiveActionStream logs={logs} filterLevel={riskFilter} />
    </div>
  );
};
