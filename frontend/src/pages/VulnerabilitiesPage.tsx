import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Vulnerability } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { useLanguage } from '../contexts/LanguageContext';
import { useToast } from '../contexts/ToastContext';
import { Bug, Search, Filter, ArrowRight, ShieldAlert, CheckCircle, Wrench } from 'lucide-react';

export const VulnerabilitiesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const agentFilterParam = searchParams.get('agentId');
  const { t, tDynamic } = useLanguage();
  const { showToast } = useToast();

  const [vulnerabilities, setVulnerabilities] = useState<Vulnerability[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchVulns = async () => {
    try {
      let endpoint = '/vulnerabilities';
      if (agentFilterParam) {
        endpoint += `?agent_id=${agentFilterParam}`;
      }
      const data = await api.get<Vulnerability[]>(endpoint);
      setVulnerabilities(data);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch vulnerabilities', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVulns();
  }, [agentFilterParam]);

  const handleApplyFix = async (id: number) => {
    try {
      await api.put(`/vulnerabilities/${id}`, {
        remediation_status: 'Applied'
      });
      showToast('Remediation fix marked as Applied! Ready for Retest.', 'success');
      fetchVulns();
    } catch (err: any) {
      showToast(err.message || 'Failed to update vulnerability', 'error');
    }
  };

  const filtered = vulnerabilities.filter((v) => {
    const matchesSearch =
      v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSev = !severityFilter || v.severity.toLowerCase() === severityFilter.toLowerCase();
    const matchesStat = !statusFilter || v.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesSev && matchesStat;
  });

  return (
    <div className="space-y-6 font-mono">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
          <Bug className="w-6 h-6 text-rose-400" />
          {t('vulnerabilitiesRegistryTitle')}
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          {t('vulnerabilitiesRegistrySubtitle')}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchVulnsPlaceholder')}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">{t('riskLevel')}:</span>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-cyan-500"
          >
            <option value="">{t('allSeverities')}</option>
            <option value="Critical">{t('critical')}</option>
            <option value="High">{t('high')}</option>
            <option value="Medium">{t('moderate')}</option>
            <option value="Low">{t('low')}</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">{t('statusLabel')}:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 px-3 py-2 rounded-lg focus:outline-none focus:border-cyan-500"
          >
            <option value="">{t('allStatuses')}</option>
            <option value="Open">{t('open')}</option>
            <option value="Mitigated">{t('mitigated')}</option>
          </select>
        </div>
      </div>

      {/* Vulnerabilities List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 rounded-xl bg-slate-900 border border-slate-800">
            {t('noVulnsFound')}
          </div>
        ) : (
          filtered.map((vuln) => (
            <div
              key={vuln.id}
              className="p-6 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-500 font-bold">VULN-00{vuln.id}</span>
                  <RiskBadge level={vuln.severity} size="sm" />
                  <span className="text-xs text-slate-400 font-bold">
                    {t('riskLevel')}: {vuln.risk_score}/100
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      vuln.status === 'Mitigated'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {tDynamic(vuln.status)}
                  </span>
                  <span className="text-[10px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {t('remediationStatus')}: {tDynamic(vuln.remediation_status)}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-white mb-1.5">{tDynamic(vuln.title)}</h3>
                <p className="text-xs text-slate-300 font-sans leading-relaxed">{tDynamic(vuln.description)}</p>
              </div>

              {vuln.evidence && (
                <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                  <span className="text-slate-300 font-semibold block mb-1">{t('simulatedEvidence')}:</span>
                  <pre className="whitespace-pre-wrap font-mono text-cyan-200/90">{tDynamic(vuln.evidence)}</pre>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-800/80 text-xs">
                <span className="text-slate-400">
                  {t('targetAgent')}: <strong className="text-slate-200">{tDynamic(vuln.agent_name)}</strong>
                </span>

                <div className="flex items-center gap-2">
                  {vuln.remediation_status !== 'Applied' && vuln.remediation_status !== 'Verified' && (
                    <button
                      onClick={() => handleApplyFix(vuln.id)}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>{t('applyFix')}</span>
                    </button>
                  )}

                  <Link
                    to={`/root-cause?vulnId=${vuln.id}`}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold flex items-center gap-1"
                  >
                    <span>{t('rootCause')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <Link
                    to={`/retest?testId=${vuln.test_id}`}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center gap-1"
                  >
                    <span>{t('retest')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
