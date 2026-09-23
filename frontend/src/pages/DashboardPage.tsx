import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { useLanguage } from '../contexts/LanguageContext';
import { DashboardStats, VulnerabilityDistribution } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';
import { RiskBadge } from '../components/RiskBadge';
import {
  Bot,
  ShieldAlert,
  Bug,
  AlertTriangle,
  CheckCircle,
  Crosshair,
  TrendingUp,
  Activity,
  ArrowRight,
  ShieldCheck,
  Zap,
  Lock,
  Layers,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid
} from 'recharts';

export const DashboardPage: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [dist, setDist] = useState<VulnerabilityDistribution | null>(null);
  const [activity, setActivity] = useState<any[]>([]);
  const [riskTrend, setRiskTrend] = useState<any[]>([]);
  const [results, setResults] = useState<{ passed: number; failed: number; blocked: number }>({ passed: 6, failed: 4, blocked: 2 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [sData, dData, aData, rData, resData] = await Promise.all([
          api.get<DashboardStats>('/dashboard/stats'),
          api.get<VulnerabilityDistribution>('/dashboard/distribution'),
          api.get<any[]>('/dashboard/activity'),
          api.get<any[]>('/dashboard/risk-trend'),
          api.get<any>('/dashboard/results')
        ]);
        setStats(sData);
        setDist(dData);
        setActivity(aData);
        setRiskTrend(rData);
        setResults(resData);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const pieData = dist ? [
    { name: t('critical'), value: dist.critical, color: '#f43f5e' },
    { name: t('high'), value: dist.high, color: '#f97316' },
    { name: t('moderate'), value: dist.medium, color: '#f59e0b' },
    { name: t('low'), value: dist.low, color: '#38bdf8' }
  ] : [];

  return (
    <div className="space-y-8 font-mono">
      {/* Top Futuristic Command Header */}
      <div className="relative p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/40 border border-cyan-500/30 shadow-[0_0_40px_rgba(6,182,212,0.12)] overflow-hidden">
        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 text-xs text-cyan-400 font-bold uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              {t('socCommandPost')}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-wide">
              {t('securityIntelligenceDashboard')}
            </h1>
            <p className="text-xs text-slate-400 font-sans max-w-xl">
              {t('securityIntelligenceSubtitle')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/simulate"
              className="px-5 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/25 transition-all"
            >
              <Crosshair className="w-4 h-4" />
              <span>{t('launchSimulation')}</span>
            </Link>

            <Link
              to="/retest"
              className="px-5 py-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center gap-2 transition-all"
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>{t('retest')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Stat Cards with Glowing Borders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Agents */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-slate-400 mb-1 font-semibold">{t('totalAgents')}</div>
            <div className="text-3xl font-black text-white">
              {stats ? stats.total_agents : 4}
            </div>
            <div className="text-[11px] text-cyan-400 mt-1 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5" /> {t('readyInSandbox')}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-inner">
            <Bot className="w-6 h-6" />
          </div>
        </div>

        {/* Tests Executed */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-slate-400 mb-1 font-semibold">{t('testsExecuted')}</div>
            <div className="text-3xl font-black text-white">
              {stats ? stats.tests_executed : 18}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> {stats?.tests_passed || 12} {t('verifiedPassed')}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>

        {/* Vulnerabilities Found */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 transition-all flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-slate-400 mb-1 font-semibold">{t('vulnerabilitiesFound')}</div>
            <div className="text-3xl font-black text-rose-400">
              {stats ? stats.vulnerabilities_found : 4}
            </div>
            <div className="text-[11px] text-rose-400 mt-1 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> {stats?.critical_vulnerabilities || 1} {t('criticalFlaws')}
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-inner">
            <Bug className="w-6 h-6" />
          </div>
        </div>

        {/* Security Score Gauge */}
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-center justify-around shadow-lg">
          <ScoreGauge
            score={stats?.average_security_score || 72}
            size={90}
            strokeWidth={8}
            label=""
            showRiskLabel={false}
          />
          <div>
            <div className="text-xs text-slate-400 mb-1 font-semibold">{t('averagePosture')}</div>
            <div className="text-xl font-bold text-white">
              {stats?.average_security_score || 72}/100
            </div>
            <div className="mt-1">
              <RiskBadge level={stats?.risk_level || 'MODERATE'} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vulnerability Distribution */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <Bug className="w-4 h-4 text-rose-400" />
              {t('vulnerabilityDistribution')}
            </h2>
            <Link to="/vulnerabilities" className="text-[11px] text-cyan-400 hover:underline">
              {t('viewResults')} →
            </Link>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={78}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#030712', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', fontFamily: 'monospace' }} />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Security Test Activity Trend */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl lg:col-span-2 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-xs text-white uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              {t('testActivityTrend')}
            </h2>
            <span className="text-[11px] text-slate-500">{t('liveExecutions')}</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                <Tooltip contentStyle={{ backgroundColor: '#030712', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', fontFamily: 'monospace' }} />
                <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
                <Line type="monotone" dataKey="tests" stroke="#38bdf8" strokeWidth={3} name={t('totalTests')} dot={{ r: 4, fill: '#38bdf8' }} />
                <Line type="monotone" dataKey="vulnerabilities" stroke="#f43f5e" strokeWidth={3} name={t('flawsFlagged')} dot={{ r: 4, fill: '#f43f5e' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Signature Retest Risk Trend: Before vs After */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-sm text-white flex items-center gap-2 tracking-wide">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              {t('retestTrendTitle')}
            </h2>
            <p className="text-xs text-slate-400 mt-1 font-sans">
              {t('retestTrendSubtitle')}
            </p>
          </div>
          <Link
            to="/retest"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 self-start sm:self-auto bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/30"
          >
            {t('launchRetestSuite')} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={riskTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="test_name" stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
              <YAxis domain={[0, 100]} stroke="#64748b" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
              <Tooltip contentStyle={{ backgroundColor: '#030712', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', fontFamily: 'monospace' }} />
              <Legend wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Bar dataKey="before_score" fill="#f43f5e" name={t('beforeScoreLabel')} radius={[6, 6, 0, 0]} />
              <Bar dataKey="after_score" fill="#10b981" name={t('afterScoreLabel')} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cyber Quick-Access Ops Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <Link
          to="/sandbox"
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:shadow-lg hover:shadow-indigo-500/10 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">{t('sandbox')}</div>
              <div className="text-slate-400 text-[11px]">{t('inspectMockDb')}</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500" />
        </Link>

        <Link
          to="/monitor"
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">{t('actionMonitor')}</div>
              <div className="text-slate-400 text-[11px]">{t('realTimePolicyChecks')}</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500" />
        </Link>

        <Link
          to="/regression"
          className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10 transition-all flex items-center justify-between"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">{t('regressionTesting')}</div>
              <div className="text-slate-400 text-[11px]">{t('compareVersions')}</div>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-500" />
        </Link>
      </div>
    </div>
  );
};
