import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Agent } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { RiskBadge } from '../components/RiskBadge';
import {
  ShieldAlert,
  Crosshair,
  Bot,
  Zap,
  Lock,
  FileCode,
  AlertTriangle,
  Play,
  ArrowRight,
  ShieldCheck,
  CheckCircle
} from 'lucide-react';

export const SecurityTestCenterPage: React.FC = () => {
  const { t, tDynamic } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<Agent[]>('/agents')
      .then((res) => {
        setAgents(res);
        if (res.length > 0) {
          setSelectedAgentId(res[0].id);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const testSuites = [
    {
      type: "Prompt Injection",
      name: tDynamic("Prompt Injection"),
      desc: t('suitePromptInjectionDesc'),
      severity: "CRITICAL",
      count: 42,
      status: "Ready"
    },
    {
      type: "Unauthorized Access",
      name: tDynamic("Unauthorized Access"),
      desc: t('suiteUnauthorizedAccessDesc'),
      severity: "HIGH",
      count: 28,
      status: "Ready"
    },
    {
      type: "Tool Misuse",
      name: tDynamic("Tool Misuse"),
      desc: t('suiteToolMisuseDesc'),
      severity: "CRITICAL",
      count: 35,
      status: "Ready"
    },
    {
      type: "Sensitive Data Exposure",
      name: tDynamic("Sensitive Data Exposure"),
      desc: t('suiteSensitiveDataDesc'),
      severity: "HIGH",
      count: 19,
      status: "Ready"
    },
    {
      type: "Malicious Instructions",
      name: tDynamic("Malicious Instructions"),
      desc: t('suiteMaliciousInstructionsDesc'),
      severity: "MODERATE",
      count: 15,
      status: "Ready"
    },
    {
      type: "Instruction Override",
      name: tDynamic("Instruction Override"),
      desc: t('suiteInstructionOverrideDesc'),
      severity: "MODERATE",
      count: 22,
      status: "Ready"
    }
  ];

  const handleLaunch = (testType: string) => {
    if (!selectedAgentId) {
      showToast('Please select an agent to test', 'warning');
      return;
    }
    navigate(`/simulate?agentId=${selectedAgentId}&testType=${encodeURIComponent(testType)}`);
  };

  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-cyan-400" />
            {t('testCenterTitle')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t('testCenterSubtitle')}
          </p>
        </div>

        {/* Target Agent Selector */}
        <div className="flex items-center gap-2.5 bg-slate-900 border border-slate-800 p-2 rounded-xl">
          <Bot className="w-4 h-4 text-cyan-400 shrink-0 ml-1" />
          <span className="text-xs text-slate-400 font-semibold">{t('targetAgent')}:</span>
          <select
            value={selectedAgentId || ''}
            onChange={(e) => setSelectedAgentId(Number(e.target.value))}
            className="bg-slate-950 border border-slate-800 text-xs text-cyan-300 font-bold px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500"
          >
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {tDynamic(a.name)} ({t('securityScore')}: {a.security_score}/100)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Test Suites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testSuites.map((suite, idx) => (
          <div
            key={idx}
            className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-500 font-bold">
                  {t('suite')} 0{idx + 1}
                </span>
                <RiskBadge level={suite.severity} size="sm" />
              </div>

              <h2 className="text-base font-bold text-white mb-2">
                {suite.name}
              </h2>

              <p className="text-xs text-slate-400 leading-relaxed font-sans mb-6">
                {suite.desc}
              </p>

              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-950/70 border border-slate-800/80 text-[11px] mb-6">
                <div>
                  <span className="text-slate-500 block">{t('testExecutions')}</span>
                  <span className="text-slate-200 font-bold">{suite.count} {t('completedStatus')}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">{t('statusLabel')}</span>
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> {tDynamic(suite.status)}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => handleLaunch(suite.type)}
              className="w-full py-2.5 px-4 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20 transition-all"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{t('startTest')}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
