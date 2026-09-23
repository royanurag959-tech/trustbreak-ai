import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { SecurityTest } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { useLanguage } from '../contexts/LanguageContext';
import { History, Play, FileText, Filter, Search, RotateCcw } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, tDynamic } = useLanguage();

  const [tests, setTests] = useState<SecurityTest[]>([]);
  const [testTypeFilter, setTestTypeFilter] = useState('');
  const [resultFilter, setResultFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<SecurityTest[]>('/tests')
      .then((res) => setTests(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleReplay = async (testId: number) => {
    try {
      const res = await api.post<SecurityTest>(`/tests/${testId}/replay`);
      navigate(`/simulate?agentId=${res.agent_id}&testType=${res.test_type}`);
    } catch (err) {
      console.error(err);
    }
  };

  const filtered = tests.filter((t) => {
    const matchesType = !testTypeFilter || t.test_type === testTypeFilter;
    const matchesRes = !resultFilter || t.result === resultFilter;
    return matchesType && matchesRes;
  });

  return (
    <div className="space-y-6 font-mono">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <History className="w-6 h-6 text-cyan-400" />
          {t('historyTitle')}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {t('historySubtitle')}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">{t('testTypeFilterLabel')}</span>
          <select
            value={testTypeFilter}
            onChange={(e) => setTestTypeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500"
          >
            <option value="">{t('allTypes')}</option>
            <option value="Prompt Injection">{tDynamic("Prompt Injection")}</option>
            <option value="Unauthorized Access">{tDynamic("Unauthorized Access")}</option>
            <option value="Tool Misuse">{tDynamic("Tool Misuse")}</option>
            <option value="Sensitive Data Exposure">{tDynamic("Sensitive Data Exposure")}</option>
            <option value="Malicious Instructions">{tDynamic("Malicious Instructions")}</option>
            <option value="Instruction Override">{tDynamic("Instruction Override")}</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">{t('resultFilterLabel')}</span>
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500"
          >
            <option value="">{t('allResults')}</option>
            <option value="Passed">{tDynamic("Passed")}</option>
            <option value="Vulnerable">{tDynamic("Vulnerable")}</option>
            <option value="Blocked">{tDynamic("Blocked")}</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500 text-[11px]">
              <th className="pb-3 font-semibold">{t('testSessionCol')}</th>
              <th className="pb-3 font-semibold">{t('dateTimeCol')}</th>
              <th className="pb-3 font-semibold">{t('testSuiteCol')}</th>
              <th className="pb-3 font-semibold">{t('riskScoreCol')}</th>
              <th className="pb-3 font-semibold">{t('resultCol')}</th>
              <th className="pb-3 font-semibold">{t('statusCol')}</th>
              <th className="pb-3 font-semibold text-right">{t('actionsCol')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-500">
                  {t('noHistoryRecorded')}
                </td>
              </tr>
            ) : (
              filtered.map((tItem) => (
                <tr key={tItem.id} className="hover:bg-slate-950/50">
                  <td className="py-3.5 font-bold text-white">#TB-{tItem.id}</td>
                  <td className="py-3.5 text-slate-400">
                    {new Date(tItem.started_at).toLocaleDateString()} {new Date(tItem.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3.5 text-cyan-300 font-semibold">{tDynamic(tItem.test_type)}</td>
                  <td className="py-3.5 font-bold text-slate-200">
                    {tItem.risk_score}/100
                  </td>
                  <td className="py-3.5">
                    <RiskBadge level={tItem.result} size="sm" />
                  </td>
                  <td className="py-3.5 text-slate-400">{tDynamic(tItem.status)}</td>
                  <td className="py-3.5 text-right space-x-2">
                    <button
                      onClick={() => handleReplay(tItem.id)}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold inline-flex items-center gap-1"
                      title={t('replayTest')}
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{t('replayTest')}</span>
                    </button>
                    <Link
                      to={`/reports/${tItem.id}`}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-blue-300 text-[11px] font-semibold inline-flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      <span>{t('viewReport')}</span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
