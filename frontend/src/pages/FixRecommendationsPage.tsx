import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Vulnerability } from '../types';
import { useToast } from '../contexts/ToastContext';
import { useLanguage } from '../contexts/LanguageContext';
import { RiskBadge } from '../components/RiskBadge';
import { Wrench, CheckCircle, RefreshCw, ArrowRight, ShieldCheck, Lock, Cpu } from 'lucide-react';

export const FixRecommendationsPage: React.FC = () => {
  const { showToast } = useToast();
  const { t, tDynamic } = useLanguage();
  const navigate = useNavigate();

  const [vulns, setVulns] = useState<Vulnerability[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVulns = async () => {
    try {
      const data = await api.get<Vulnerability[]>('/vulnerabilities');
      setVulns(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to load recommendations', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVulns();
  }, []);

  const handleApplyAndRetest = async (vuln: Vulnerability) => {
    try {
      await api.put(`/vulnerabilities/${vuln.id}`, {
        remediation_status: 'Applied'
      });
      showToast(`Defense applied for ${vuln.title}! Forwarding to retest...`, 'success');
      navigate(`/retest?testId=${vuln.test_id || 1}`);
    } catch (err: any) {
      showToast(err.message || 'Failed to apply fix', 'error');
    }
  };

  const securityControls = [
    t('ctrlSystemEnvelopes'),
    t('ctrlValidateSchema'),
    t('ctrlAuthChecks'),
    t('ctrlLeastPrivilege'),
    t('ctrlPromptDelimiters'),
    t('ctrlOutboundDataFilter'),
    t('ctrlHumanApproval'),
    t('ctrlImmutableAudit')
  ];

  return (
    <div className="space-y-8 font-mono">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <Wrench className="w-6 h-6 text-amber-400" />
          {t('fixCenterTitle')}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {t('fixCenterSubtitle')}
        </p>
      </div>

      {/* Available Security Controls Overview */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <h2 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          {t('controlsMatrixTitle')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1 text-xs">
          {securityControls.map((ctrl, idx) => (
            <div key={idx} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-slate-300 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
              <span className="truncate">{ctrl}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Vulnerability Fixes List */}
      <div className="space-y-6">
        {loading ? (
          <div className="p-12 text-center text-slate-500">{t('loadingRecommendations')}</div>
        ) : vulns.length === 0 ? (
          <div className="p-12 text-center text-slate-500 rounded-xl bg-slate-900 border border-slate-800">
            {t('noPendingVulns')}
          </div>
        ) : (
          vulns.map((v) => (
            <div
              key={v.id}
              className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="text-xs text-slate-500 font-bold">VULN-00{v.id}</span>
                  <RiskBadge level={v.severity} size="sm" />
                  <span className="text-xs text-slate-300 font-semibold">{tDynamic(v.title)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30">
                    {t('priorityLabel')}: {v.severity === 'Critical' ? t('priorityUrgent') : v.severity === 'High' ? t('priorityHigh') : t('priorityStandard')}
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {t('statusLabel')}: {tDynamic(v.remediation_status)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                  <span className="text-rose-400 font-bold block">{t('problemRootCause')}</span>
                  <p className="text-slate-300 font-sans leading-relaxed">
                    {tDynamic(v.root_cause) || tDynamic(v.description)}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 space-y-2">
                  <span className="text-emerald-400 font-bold block">{t('recommendedFix')}</span>
                  <p className="text-emerald-200/90 font-sans leading-relaxed">
                    {tDynamic(v.recommendation) || tDynamic('Implement input boundary encapsulation and enforce role verification before executing tool dispatch.')}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800/80">
                <span className="text-xs text-slate-400">
                  {t('targetAgentLabel')}: <strong className="text-white">{tDynamic(v.agent_name)}</strong>
                </span>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleApplyAndRetest(v)}
                    className="px-4 py-2 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md shadow-cyan-500/20 transition-all"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    <span>{t('applyFixAndRetest')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
