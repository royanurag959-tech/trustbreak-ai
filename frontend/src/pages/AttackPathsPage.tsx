import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { SecurityTest, AttackPath } from '../types';
import { AttackPathGraph } from '../components/AttackPathGraph';
import { useLanguage } from '../contexts/LanguageContext';
import { GitBranch, Shield, Filter, Info } from 'lucide-react';

export const AttackPathsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const testIdParam = searchParams.get('testId');
  const { t, tDynamic } = useLanguage();

  const [tests, setTests] = useState<SecurityTest[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(testIdParam ? Number(testIdParam) : null);
  const [attackPaths, setAttackPaths] = useState<AttackPath[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<SecurityTest[]>('/tests')
      .then((res) => {
        setTests(res);
        const activeId = selectedTestId || (res.length > 0 ? res[0].id : null);
        setSelectedTestId(activeId);
        if (activeId) {
          return api.get<AttackPath[]>(`/tests/${activeId}/attack-path`);
        }
        return [];
      })
      .then((paths) => setAttackPaths(paths || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleTestChange = async (testId: number) => {
    setSelectedTestId(testId);
    try {
      const data = await api.get<AttackPath[]>(`/tests/${testId}/attack-path`);
      setAttackPaths(data);
    } catch (err) {
      console.error(err);
    }
  };

  const currentPath = attackPaths.length > 0 ? attackPaths[0] : null;

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <GitBranch className="w-6 h-6 text-purple-400" />
            {t('attackGraphTitle')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t('attackGraphSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs">
          <span className="text-slate-400">{t('simulationSession')}:</span>
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
      </div>

      {/* Explanatory Banner */}
      <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-start gap-3 text-xs text-purple-200">
        <Info className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          {t('interactiveGraphControls')}
        </div>
      </div>

      {/* React Flow Graph */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-2xl">
        <div className="mb-3 flex items-center justify-between text-xs text-slate-400 px-2">
          <span className="font-bold text-white">
            {tDynamic(currentPath?.title) || t('attackPaths')}
          </span>
          <span>{t('environmentLabel')}: {t('sandboxActive')}</span>
        </div>

        <AttackPathGraph
          nodesJson={currentPath?.nodes_json}
          edgesJson={currentPath?.edges_json}
          height="520px"
        />
      </div>
    </div>
  );
};
