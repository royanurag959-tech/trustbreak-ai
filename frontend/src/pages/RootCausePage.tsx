import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Vulnerability } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { useLanguage } from '../contexts/LanguageContext';
import { Search, ShieldAlert, AlertTriangle, Wrench, CheckCircle, ArrowRight, HelpCircle } from 'lucide-react';

export const RootCausePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const vulnIdParam = searchParams.get('vulnId');
  const { t, tDynamic } = useLanguage();

  const [vulns, setVulns] = useState<Vulnerability[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(vulnIdParam ? Number(vulnIdParam) : null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Vulnerability[]>('/vulnerabilities')
      .then((res) => {
        setVulns(res);
        if (!selectedId && res.length > 0) {
          setSelectedId(res[0].id);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const current = vulns.find((v) => v.id === selectedId) || (vulns.length > 0 ? vulns[0] : null);

  return (
    <div className="space-y-6 font-mono">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Search className="w-6 h-6 text-cyan-400" />
            {t('rootCauseTitle')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t('rootCauseSubtitle')}
          </p>
        </div>

        {/* Vulnerability Selector */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs">
          <span className="text-slate-400">{t('selectFlaw')}:</span>
          <select
            value={selectedId || ''}
            onChange={(e) => setSelectedId(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 text-cyan-300 font-bold px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500 max-w-xs truncate"
          >
            {vulns.map((v) => (
              <option key={v.id} value={v.id}>
                VULN-00{v.id}: {tDynamic(v.title)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-xs">{t('loadingAnalysis')}</div>
      ) : !current ? (
        <div className="p-12 text-center text-slate-500 rounded-xl bg-slate-900 border border-slate-800">
          {t('noVulnsFound')}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="text-xs text-slate-400 font-bold">VULN-00{current.id}</span>
                <RiskBadge level={current.severity} size="sm" />
                <span className="text-xs text-rose-400 font-bold">{t('riskLevel')}: {current.risk_score}/100</span>
              </div>
              <span className="text-xs text-slate-400">{t('targetAgent')}: <strong className="text-white">{tDynamic(current.agent_name)}</strong></span>
            </div>
            <h2 className="text-xl font-bold text-white">{tDynamic(current.title)}</h2>
          </div>

          {/* 5 Core RCA Questions Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. What happened? */}
            <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm">
                <HelpCircle className="w-4 h-4" />
                <span>{t('q1WhatHappened')}</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {tDynamic(current.description)}
              </p>
              {current.evidence && (
                <div className="mt-3 p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                  <span className="text-slate-300 font-bold block mb-1">{t('simulatedEvidence')}:</span>
                  <pre className="whitespace-pre-wrap font-mono text-cyan-200/90">{tDynamic(current.evidence)}</pre>
                </div>
              )}
            </div>

            {/* 2. Why did it happen? */}
            <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>{t('q2WhyDidItHappen')}</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {tDynamic(current.root_cause) ||
                  tDynamic('The agent accepted an untrusted instruction without validating whether it conflicted with system policies or tool authorization boundaries.')}
              </p>
            </div>

            {/* 3. What was affected? */}
            <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>{t('q3WhatWasAffected')}</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {tDynamic('Simulated Sandbox Tools and Internal Databases (Mock Credentials, User Catalog, or Restricted Admin APIs).')}
              </p>
            </div>

            {/* 4. What is the impact? */}
            <div className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>{t('q4WhatIsImpact')}</span>
              </div>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                {tDynamic(current.impact) ||
                  tDynamic('If deployed to production, an external adversary could exploit this vulnerability to exfiltrate private user records, corrupt databases, or trigger unauthorized transactions.')}
              </p>
            </div>
          </div>

          {/* 5. How can it be fixed? */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/20 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Wrench className="w-4 h-4" />
                <span>{t('q5HowToFix')}</span>
              </div>
              <span className="text-[10px] text-emerald-300 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                {t('recommendedDefense')}
              </span>
            </div>

            <p className="text-xs text-slate-200 font-sans leading-relaxed">
              {tDynamic(current.recommendation) ||
                tDynamic('Add instruction hierarchy validation and enforce strict tool authorization checks prior to dispatching sensitive actions.')}
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to={`/fixes`}
                className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-emerald-500/20"
              >
                <span>{t('fixRecommendations')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to={`/retest?testId=${current.test_id}`}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 font-semibold text-xs flex items-center gap-2"
              >
                <span>{t('retest')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
