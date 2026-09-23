import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Agent, SecurityTest } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { ScoreGauge } from '../components/ScoreGauge';
import { RiskBadge } from '../components/RiskBadge';
import {
  Crosshair,
  Bot,
  Play,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Shield,
  GitBranch,
  Search,
  Wrench,
  RefreshCw,
  FileText
} from 'lucide-react';

export const AttackSimulationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { t, tDynamic } = useLanguage();
  const { showToast } = useToast();

  const preselectedAgentId = searchParams.get('agentId');
  const preselectedTestType = searchParams.get('testType');

  const [agents, setAgents] = useState<Agent[]>([]);
  const [agentId, setAgentId] = useState<number | null>(preselectedAgentId ? Number(preselectedAgentId) : null);
  const [testType, setTestType] = useState<string>(preselectedTestType || 'Prompt Injection');

  // Simulation execution state
  const [isSimulating, setIsSimulating] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [completedTest, setCompletedTest] = useState<SecurityTest | null>(null);

  const simulationSteps = [
    { title: t('simStep1Title'), subtitle: t('simStep1Sub') },
    { title: `${t('simStep2Title')} (${tDynamic(testType)})`, subtitle: t('simStep2Sub') },
    { title: t('simStep3Title'), subtitle: t('simStep3Sub') },
    { title: t('simStep4Title'), subtitle: t('simStep4Sub') },
    { title: t('simStep5Title'), subtitle: t('simStep5Sub') },
    { title: t('simStep6Title'), subtitle: t('simStep6Sub') },
    { title: t('simStep7Title'), subtitle: t('simStep7Sub') },
    { title: t('simStep8Title'), subtitle: t('simStep8Sub') }
  ];

  useEffect(() => {
    api.get<Agent[]>('/agents')
      .then((res) => {
        setAgents(res);
        if (!agentId && res.length > 0) {
          setAgentId(res[0].id);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  const handleStartSimulation = async () => {
    if (!agentId) {
      showToast('Please select an agent', 'warning');
      return;
    }

    setIsSimulating(true);
    setCompletedTest(null);
    setStepIndex(0);

    // Progressive visual steps
    for (let i = 0; i < simulationSteps.length; i++) {
      setStepIndex(i);
      await new Promise((r) => setTimeout(r, 650));
    }

    try {
      const result = await api.post<SecurityTest>('/tests/start', {
        agent_id: agentId,
        test_type: testType
      });
      setCompletedTest(result);
      showToast(`Simulation complete! Flaw detected in ${testType}`, 'warning');
    } catch (err: any) {
      showToast(err.message || 'Simulation execution failed', 'error');
    } finally {
      setIsSimulating(false);
    }
  };

  const selectedAgent = agents.find((a) => a.id === agentId);

  return (
    <div className="space-y-8 font-mono">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <Crosshair className="w-6 h-6 text-rose-400" />
          {t('attackSimTitle')}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {t('attackSimSubtitle')}
        </p>
      </div>

      {/* Control Panel Card */}
      {!completedTest && !isSimulating && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('targetAiAgent')}
              </label>
              <select
                value={agentId || ''}
                onChange={(e) => setAgentId(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-bold focus:outline-none focus:border-cyan-500"
              >
                {agents.map((a) => (
                  <option key={a.id} value={a.id}>
                    {tDynamic(a.name)} ({t('securityScore')}: {a.security_score}/100)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                {t('securityTestSuite')}
              </label>
              <select
                value={testType}
                onChange={(e) => setTestType(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="Prompt Injection">{tDynamic("Prompt Injection (Override Instructions)")}</option>
                <option value="Unauthorized Access">{tDynamic("Unauthorized Access (Admin APIs)")}</option>
                <option value="Tool Misuse">{tDynamic("Tool Misuse (SQL Injection in Tool)")}</option>
                <option value="Sensitive Data Exposure">{tDynamic("Sensitive Data Exposure (Credentials Leak)")}</option>
                <option value="Malicious Instructions">{tDynamic("Malicious Instructions (Social Engineering)")}</option>
                <option value="Instruction Override">{tDynamic("Instruction Override (Context Hijacking)")}</option>
              </select>
            </div>
          </div>

          {selectedAgent && (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white">{tDynamic(selectedAgent.name)}</div>
                  <div className="text-slate-400 text-[11px]">
                    v{selectedAgent.version} • {selectedAgent.provider}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-xs">{t('baselineSecurity')}</span>
                <span className="font-bold text-white text-sm">{selectedAgent.security_score}/100</span>
                <RiskBadge level={selectedAgent.risk_level} size="sm" />
              </div>
            </div>
          )}

          <button
            onClick={handleStartSimulation}
            className="w-full py-3 px-6 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{t('runSecurityTest')}</span>
          </button>
        </div>
      )}

      {/* Progressive Execution Terminal */}
      {isSimulating && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                {t('simulationInProgress')} {tDynamic(testType)}
              </span>
            </div>
            <span className="text-xs text-cyan-400">{t('stepOf')} {stepIndex + 1} {t('ofStep')} {simulationSteps.length}</span>
          </div>

          <div className="space-y-3">
            {simulationSteps.map((step, idx) => {
              const isPast = idx < stepIndex;
              const isCurrent = idx === stepIndex;

              return (
                <div
                  key={idx}
                  className={`p-3 rounded-lg border text-xs transition-all ${
                    isPast
                      ? 'bg-slate-950 border-slate-800 text-slate-300'
                      : isCurrent
                      ? 'bg-cyan-950/30 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950/30 border-slate-900 text-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold">{step.title}</span>
                    {isPast && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                    {isCurrent && (
                      <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin shrink-0" />
                    )}
                  </div>
                  {(isPast || isCurrent) && (
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {step.subtitle}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Section 36: Security Test Complete Result Page */}
      {completedTest && (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-1">
                {t('securityAssessmentComplete')}
              </span>
              <h2 className="text-xl font-bold text-white">
                {t('agentCandidate')}: {tDynamic(completedTest.agent_name || selectedAgent?.name || 'Customer Support Agent')}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {t('testSuiteCol')}: {tDynamic(completedTest.test_type)} • ID #{completedTest.id}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <ScoreGauge
                score={100 - completedTest.risk_score}
                size={100}
                strokeWidth={8}
                label=""
                showRiskLabel={false}
              />
              <div>
                <div className="text-xs text-slate-400">{t('securityScore')}</div>
                <div className="text-2xl font-bold text-white">
                  {100 - completedTest.risk_score}/100
                </div>
                <div className="mt-1">
                  <RiskBadge level={completedTest.risk_score >= 81 ? 'CRITICAL' : completedTest.risk_score >= 61 ? 'HIGH' : 'MODERATE'} size="sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Vulnerability Count summary */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <span className="text-xs font-bold text-slate-300 block">
              {t('detectedVulnsBreakdown')}
            </span>
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 font-bold">
                {t('criticalVulnCount')}
              </span>
              <span className="px-2.5 py-1 rounded bg-orange-500/10 border border-orange-500/30 text-orange-300 font-bold">
                {t('highSeverityCount')}
              </span>
              <span className="px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold">
                {t('mediumSeverityCount')}
              </span>
            </div>
          </div>

          {/* Signature Action Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            <Link
              to={`/attack-paths?testId=${completedTest.id}`}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 text-center font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-colors"
            >
              <GitBranch className="w-4 h-4" />
              <span>{t('viewAttackPath')}</span>
            </Link>

            <Link
              to={`/root-cause`}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 text-center font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>{t('explainVulnerability')}</span>
            </Link>

            <Link
              to={`/fixes`}
              className="p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-center font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-colors"
            >
              <Wrench className="w-4 h-4" />
              <span>{t('viewFix')}</span>
            </Link>

            <Link
              to={`/retest?testId=${completedTest.id}`}
              className="p-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-center font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{t('retestAgent')}</span>
            </Link>

            <Link
              to={`/reports/${completedTest.id}`}
              className="p-3 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 text-blue-300 border border-blue-500/40 text-center font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>{t('downloadReport')}</span>
            </Link>
          </div>

          <div className="pt-3 flex justify-end">
            <button
              onClick={() => {
                setCompletedTest(null);
                setIsSimulating(false);
              }}
              className="text-xs text-slate-400 hover:text-white"
            >
              ← {t('runAnotherTest')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
