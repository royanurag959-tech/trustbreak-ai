import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Agent } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { RiskBadge } from '../components/RiskBadge';
import {
  Bot,
  Plus,
  Crosshair,
  Shield,
  Trash2,
  ExternalLink,
  Search,
  Filter,
  Layers
} from 'lucide-react';

export const AgentsPage: React.FC = () => {
  const { t, tDynamic } = useLanguage();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [provider, setProvider] = useState('Demo LLM');
  const [model, setModel] = useState('AgentSafe-v1');
  const [version, setVersion] = useState('1.0');
  const [environment, setEnvironment] = useState('Sandbox');
  const [systemPrompt, setSystemPrompt] = useState(
    'You are a support assistant. Help users answer questions regarding orders and policies.'
  );

  const fetchAgents = async () => {
    try {
      const data = await api.get<Agent[]>('/agents');
      setAgents(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch agents', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      await api.post('/agents', {
        name,
        description,
        provider,
        model,
        version,
        environment,
        system_prompt: systemPrompt
      });
      showToast(`Agent '${name}' registered successfully!`, 'success');
      setShowModal(false);
      setName('');
      setDescription('');
      fetchAgents();
    } catch (err: any) {
      showToast(err.message || 'Failed to create agent', 'error');
    }
  };

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this agent?')) return;

    try {
      await api.delete(`/agents/${id}`);
      showToast('Agent deleted successfully', 'info');
      setAgents((prev) => prev.filter((a) => a.id !== id));
    } catch (err: any) {
      showToast(err.message || 'Failed to delete agent', 'error');
    }
  };

  const filtered = agents.filter((a) =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.model.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 font-mono">
      {/* Top action header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <Bot className="w-6 h-6 text-cyan-400" />
            {t('agentRegistryTitle')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t('agentRegistrySubtitle')}
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addAgent')}</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
        <Search className="w-4 h-4 text-slate-500 ml-1" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t('searchAgentsPlaceholder')}
          className="w-full bg-transparent border-none text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none"
        />
      </div>

      {/* Agent Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-slate-500">{t('loadingAgents')}</div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center text-slate-500 rounded-xl bg-slate-900/40 border border-slate-800">
          {t('noAgentsFound')}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((agent) => (
            <div
              key={agent.id}
              onClick={() => navigate(`/agents/${agent.id}`)}
              className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-500/10 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm hover:text-cyan-300 transition-colors">
                        {tDynamic(agent.name)}
                      </h3>
                      <span className="text-[10px] text-slate-400">
                        v{agent.version} • {tDynamic(agent.provider)}
                      </span>
                    </div>
                  </div>

                  <RiskBadge level={agent.risk_level} size="sm" />
                </div>

                <p className="text-xs text-slate-400 line-clamp-2 mb-4 font-sans">
                  {tDynamic(agent.description) || t('noDescriptionProvided')}
                </p>

                <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-slate-950/80 border border-slate-800/80 text-[11px] mb-4">
                  <div>
                    <span className="text-slate-500 block">{t('securityScore')}</span>
                    <span className="font-bold text-white text-sm">
                      {agent.security_score}/100
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">{t('environmentLabel')}</span>
                    <span className="text-cyan-300 font-semibold">{tDynamic(agent.environment)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-800/80">
                <Link
                  to={`/simulate?agentId=${agent.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Crosshair className="w-3.5 h-3.5" />
                  <span>{t('runTest')}</span>
                </Link>

                <button
                  onClick={(e) => handleDelete(agent.id, e)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                  title={t('deleteAgent')}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Agent Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Bot className="w-5 h-5 text-cyan-400" />
                {t('registerAgentModalTitle')}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 mb-1 font-semibold">{t('agentNameLabel')} *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sales Inbound Agent"
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">{t('problemAndRootCause')}</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize the agent's simulated responsibility..."
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">{t('providerLabel')}</label>
                  <input
                    type="text"
                    value={provider}
                    onChange={(e) => setProvider(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">{t('modelArchLabel')}</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">{t('versionLabel')}</label>
                  <input
                    type="text"
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 mb-1 font-semibold">{t('initialEnvLabel')}</label>
                  <select
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Sandbox">{tDynamic("Sandbox")}</option>
                    <option value="Staging">{tDynamic("Staging")}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 mb-1 font-semibold">{t('systemPromptLabel')}</label>
                <textarea
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs"
                >
                  {t('registerAgentBtn')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
