import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Agent, SecurityTest } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';
import { RiskBadge } from '../components/RiskBadge';
import { useToast } from '../contexts/ToastContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Bot,
  Shield,
  Crosshair,
  Bug,
  GitBranch,
  FileText,
  RefreshCw,
  Plus,
  Lock,
  CheckCircle,
  ArrowLeft,
  Calendar,
  Layers
} from 'lucide-react';

export const AgentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t, tDynamic } = useLanguage();

  const [agent, setAgent] = useState<Agent | null>(null);
  const [tests, setTests] = useState<SecurityTest[]>([]);
  const [loading, setLoading] = useState(true);

  // Policy modal state
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [polName, setPolName] = useState('');
  const [polResource, setPolResource] = useState('');
  const [polPermission, setPolPermission] = useState<'allow' | 'deny'>('deny');

  const fetchAgent = async () => {
    try {
      const data = await api.get<Agent>(`/agents/${id}`);
      setAgent(data);
      const testList = await api.get<SecurityTest[]>(`/tests?agent_id=${id}`);
      setTests(testList);
    } catch (err: any) {
      showToast(err.message || 'Failed to load agent details', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgent();
  }, [id]);

  const handleAddPolicy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!polName || !polResource) return;
    try {
      await api.post(`/agents/${id}/policies`, {
        policy_name: polName,
        resource: polResource,
        permission: polPermission
      });
      showToast(t('policyRuleAppended') || 'Policy rule appended', 'success');
      setShowPolicyModal(false);
      setPolName('');
      setPolResource('');
      fetchAgent();
    } catch (err: any) {
      showToast(err.message || 'Failed to add policy', 'error');
    }
  };

  if (loading) {
    return <div className="p-12 text-center text-slate-500 font-mono text-xs">{t('loadingAgentProfile')}</div>;
  }

  if (!agent) {
    return <div className="p-12 text-center text-rose-400 font-mono text-xs">{t('agentNotFound')}</div>;
  }

  return (
    <div className="space-y-8 font-mono">
      {/* Header and Back Link */}
      <div className="flex items-center gap-3">
        <Link
          to="/agents"
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bot className="w-6 h-6 text-cyan-400" />
            {tDynamic(agent.name)}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('versionLabel')} {agent.version} • {tDynamic(agent.provider)} ({tDynamic(agent.model)})
          </p>
        </div>
      </div>

      {/* Main Profile & Metrics Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Score & Risk Status */}
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center text-center">
          <ScoreGauge score={agent.security_score} size={140} strokeWidth={10} />
          <div className="mt-4">
            <span className="text-xs text-slate-400 block mb-1">{t('currentRiskStatus')}</span>
            <RiskBadge level={agent.risk_level} size="lg" />
          </div>
        </div>

        {/* Details & Specs */}
        <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 lg:col-span-2 space-y-4 text-xs">
          <h2 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
            {t('agentSpecsSummary')}
          </h2>
          <p className="text-slate-300 font-sans leading-relaxed text-sm">
            {tDynamic(agent.description) || t('noDescriptionConfigured')}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[11px]">{t('testExecutions')}</span>
              <span className="text-white font-bold text-base">{agent.total_tests || tests.length}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[11px]">{t('vulnerabilitiesHeading')}</span>
              <span className="text-rose-400 font-bold text-base">{agent.total_vulnerabilities || 0}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[11px]">{t('initialEnvLabel')}</span>
              <span className="text-cyan-300 font-bold text-base">{tDynamic(agent.environment)}</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-500 block text-[11px]">{t('statusLabel')}</span>
              <span className="text-emerald-400 font-bold text-xs truncate block mt-0.5">{tDynamic(agent.status)}</span>
            </div>
          </div>

          <div>
            <span className="text-slate-400 font-semibold block mb-1">{t('systemInstructionsBoundary')}</span>
            <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 text-[11px] whitespace-pre-wrap max-h-24 overflow-y-auto">
              {agent.system_prompt || t('noSystemPrompt')}
            </pre>
          </div>
        </div>
      </div>

      {/* Action Buttons Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center gap-3">
        <Link
          to={`/simulate?agentId=${agent.id}`}
          className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20"
        >
          <Crosshair className="w-4 h-4" />
          <span>{t('runTest')}</span>
        </Link>

        <Link
          to={`/vulnerabilities?agentId=${agent.id}`}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-rose-300 border border-rose-500/30 font-semibold text-xs flex items-center gap-2"
        >
          <Bug className="w-4 h-4" />
          <span>{t('vulnerabilitiesHeading')}</span>
        </Link>

        <Link
          to={`/attack-paths`}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 font-semibold text-xs flex items-center gap-2"
        >
          <GitBranch className="w-4 h-4" />
          <span>{t('attackPath')}</span>
        </Link>

        <Link
          to={tests.length > 0 ? `/reports/${tests[0].id}` : '/reports'}
          className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-blue-300 border border-blue-500/30 font-semibold text-xs flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          <span>{t('viewReport')}</span>
        </Link>

        <Link
          to="/retest"
          className="px-4 py-2 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{t('retestAndVerify')}</span>
        </Link>
      </div>

      {/* Active Security Policies Table */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-400" />
              {t('activePolicyRules')}
            </h2>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {t('accessBoundariesSubtitle')}
            </p>
          </div>
          <button
            onClick={() => setShowPolicyModal(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{t('addPolicyRule')}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-[11px]">
                <th className="pb-2.5 font-semibold">{t('policyNameCol')}</th>
                <th className="pb-2.5 font-semibold">{t('targetResourceCol')}</th>
                <th className="pb-2.5 font-semibold">{t('permissionCol')}</th>
                <th className="pb-2.5 font-semibold">{t('statusLabel')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {(!agent.policies || agent.policies.length === 0) ? (
                <tr>
                  <td colSpan={4} className="py-4 text-center text-slate-500">
                    {t('noCustomPoliciesDefined')}
                  </td>
                </tr>
              ) : (
                agent.policies.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-950/50">
                    <td className="py-3 font-semibold text-slate-200">{p.policy_name}</td>
                    <td className="py-3 text-cyan-300">{p.resource}</td>
                    <td className="py-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.permission === 'allow'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {tDynamic(p.permission)}
                      </span>
                    </td>
                    <td className="py-3 text-slate-400">{tDynamic(p.status)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Policy Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-white text-sm">{t('addPolicyModalTitle')}</h3>
              <button onClick={() => setShowPolicyModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleAddPolicy} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">{t('ruleNameLabel')}</label>
                <input
                  type="text"
                  value={polName}
                  onChange={(e) => setPolName(e.target.value)}
                  placeholder="e.g. Block Financial Records"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">{t('targetResourceLabel')}</label>
                <input
                  type="text"
                  value={polResource}
                  onChange={(e) => setPolResource(e.target.value)}
                  placeholder="e.g. financial_records or payment_gateway"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">{t('actionPermissionLabel')}</label>
                <select
                  value={polPermission}
                  onChange={(e) => setPolPermission(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="deny">{t('denyBlockAccess')}</option>
                  <option value="allow">{t('allowPermitExecution')}</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPolicyModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold"
                >
                  {t('addRuleBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
