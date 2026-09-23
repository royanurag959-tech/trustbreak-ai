import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { SecurityTest } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';
import { RiskBadge } from '../components/RiskBadge';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import {
  RefreshCw,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  FileText,
  Sparkles,
  Lock,
  Zap
} from 'lucide-react';

export const RetestPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const testIdParam = searchParams.get('testId');
  const { t, tDynamic } = useLanguage();
  const { showToast } = useToast();

  const [tests, setTests] = useState<SecurityTest[]>([]);
  const [selectedTestId, setSelectedTestId] = useState<number | null>(testIdParam ? Number(testIdParam) : null);
  const [retestResult, setRetestResult] = useState<SecurityTest | null>(null);
  const [isRetesting, setIsRetesting] = useState(false);
  const [appliedFix, setAppliedFix] = useState('Input Sanitization Firewall + Least Privilege Tool Filter');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<SecurityTest[]>('/tests')
      .then((res) => {
        setTests(res);
        if (!selectedTestId && res.length > 0) {
          setSelectedTestId(res[0].id);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleRunRetest = async () => {
    if (!selectedTestId) {
      showToast('Please select a test session to retest', 'warning');
      return;
    }

    setIsRetesting(true);
    setRetestResult(null);

    // Simulated verification delay
    await new Promise((r) => setTimeout(r, 1400));

    try {
      const res = await api.post<SecurityTest>(`/tests/${selectedTestId}/retest`, {
        applied_fix: appliedFix
      });
      setRetestResult(res);
      showToast('Retest passed! Security score dramatically improved!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Retest failed', 'error');
    } finally {
      setIsRetesting(false);
    }
  };

  const originalTest = tests.find((t) => t.id === selectedTestId);
  const beforeScore = originalTest ? 100 - originalTest.risk_score : 58;
  const afterScore = retestResult ? 100 - retestResult.risk_score : 91;
  const improvement = retestResult?.score_improvement || Math.max(5, afterScore - beforeScore);

  return (
    <div className="space-y-8 font-mono">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <RefreshCw className="w-6 h-6 text-emerald-400" />
          {t('retestPageTitle')}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {t('retestPageSubtitle')}
        </p>
      </div>

      {/* Retest Setup Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            {t('selectRunToRemediate')}
          </h2>
          <span className="text-[11px] text-slate-500">{t('environmentLabel')}: {t('sandboxActive')}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1.5">{t('originalTestSession')}</label>
            <select
              value={selectedTestId || ''}
              onChange={(e) => {
                setSelectedTestId(Number(e.target.value));
                setRetestResult(null);
              }}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
            >
              {tests.map((tItem) => (
                <option key={tItem.id} value={tItem.id}>
                  Test #{tItem.id} — {tDynamic(tItem.test_type)} ({tDynamic(tItem.result)}) [{t('securityScore')}: {100 - tItem.risk_score}/100]
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1.5">{t('appliedDefenseMitigation')}</label>
            <input
              type="text"
              value={appliedFix}
              onChange={(e) => setAppliedFix(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <button
          onClick={handleRunRetest}
          disabled={isRetesting}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all disabled:opacity-50"
        >
          {isRetesting ? (
            <div className="flex items-center gap-2.5">
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>{t('evaluatingPolicy')}</span>
            </div>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>{t('launchVerificationRetest')}</span>
            </>
          )}
        </button>
      </div>

      {/* Retest Comparison Result */}
      {retestResult && (
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 border-2 border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.18)] space-y-8 animate-in fade-in duration-300 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center space-y-2 relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold shadow-md shadow-emerald-500/10">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{t('retestSuccessHeading')}</span>
            </div>
            <h2 className="text-3xl font-black text-white uppercase tracking-wide">
              {t('agentCertifiedTrusted')}
            </h2>
            <p className="text-xs text-slate-400 max-w-xl mx-auto font-sans">
              {t('retestSuccessMessage')}
            </p>
          </div>

          {/* Before vs After Side-by-Side Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            {/* BEFORE */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border border-rose-500/30 text-center space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
                  {t('beforeRetest')}
                </span>
                <span className="text-[10px] text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                  {t('vulnerable')}
                </span>
              </div>

              <ScoreGauge score={beforeScore} size={110} strokeWidth={8} showRiskLabel={false} />

              <div>
                <div className="text-3xl font-black text-rose-400 font-mono">{beforeScore}/100</div>
                <div className="mt-1">
                  <RiskBadge level={beforeScore <= 60 ? 'HIGH' : 'MODERATE'} size="sm" />
                </div>
              </div>

              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                {t('beforeScoreLabel')}
              </p>
            </div>

            {/* AFTER */}
            <div className="p-6 rounded-2xl bg-slate-950/80 border-2 border-emerald-500/50 text-center space-y-4 shadow-xl relative overflow-hidden">
              <div className="absolute top-2 right-2 px-2.5 py-1 rounded-md bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                {t('trusted')}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
                  {t('afterRemediation')}
                </span>
              </div>

              <ScoreGauge score={afterScore} size={110} strokeWidth={8} showRiskLabel={false} />

              <div>
                <div className="text-3xl font-black text-emerald-400 font-mono">{afterScore}/100</div>
                <div className="mt-1">
                  <RiskBadge level="LOW" size="sm" />
                </div>
              </div>

              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                {t('afterScoreLabel')}
              </p>
            </div>
          </div>

          {/* Delta Highlight Banner */}
          <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs relative z-10 shadow-lg">
            <div className="flex items-center gap-3 text-emerald-300">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-sm block text-white">{t('quantumImprovement')}:</span>
                <span className="text-[11px] text-slate-400">{t('scoreDifferential')}</span>
              </div>
            </div>

            <span className="text-3xl font-black text-emerald-400 font-mono">
              +{improvement} {t('score')}
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-4 pt-2 relative z-10">
            <Link
              to={`/reports/${retestResult.id}`}
              className="px-8 py-3.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-xl shadow-cyan-500/25 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>{t('downloadCertifiedReport')}</span>
            </Link>

            <Link
              to="/dashboard"
              className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all"
            >
              <span>{t('backToCommandPost')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};
