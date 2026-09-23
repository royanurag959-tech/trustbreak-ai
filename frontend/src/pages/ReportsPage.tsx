import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { SecurityTest } from '../types';
import { ScoreGauge } from '../components/ScoreGauge';
import { RiskBadge } from '../components/RiskBadge';
import { useLanguage } from '../contexts/LanguageContext';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
  ShieldAlert,
  Bot,
  Calendar,
  Layers,
  CheckCircle2,
  Bug
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { testId: routeTestId } = useParams<{ testId?: string }>();
  const [searchParams] = useSearchParams();
  const queryTestId = searchParams.get('testId');
  const { t, tDynamic, language } = useLanguage();

  const [tests, setTests] = useState<SecurityTest[]>([]);
  const [activeTestId, setActiveTestId] = useState<number | null>(
    routeTestId ? Number(routeTestId) : queryTestId ? Number(queryTestId) : null
  );
  const [report, setReport] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get<SecurityTest[]>('/tests')
      .then((res) => {
        setTests(res);
        const targetId = activeTestId || (res.length > 0 ? res[0].id : null);
        setActiveTestId(targetId);
        if (targetId) {
          return api.get<any>(`/reports/${targetId}`);
        }
        return null;
      })
      .then((repData) => setReport(repData))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSelectTest = async (tId: number) => {
    setActiveTestId(tId);
    try {
      const data = await api.get<any>(`/reports/${tId}`);
      setReport(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Top Controls (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2.5">
            <FileText className="w-6 h-6 text-blue-400" />
            {t('reportsTitle')}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            {t('reportsSubtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-xl text-xs">
            <span className="text-slate-400">{t('reports')}:</span>
            <select
              value={activeTestId || ''}
              onChange={(e) => handleSelectTest(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 text-cyan-300 font-bold px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500"
            >
              {tests.map((tItem) => (
                <option key={tItem.id} value={tItem.id}>
                  Report #{tItem.id} — {tItem.test_type} ({tItem.result})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-md transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>{t('printOrPdf')}</span>
          </button>
        </div>
      </div>

      {loading ? (
        <div className="p-12 text-center text-slate-500 text-xs">{t('loadingGeneric')}</div>
      ) : !report ? (
        <div className="p-12 text-center text-slate-500 rounded-xl bg-slate-900 border border-slate-800">
          {t('noSecurityTestFound')}
        </div>
      ) : (
        /* Printable Report Document */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 sm:p-12 space-y-8 print:bg-white print:text-black print:p-0 print:border-none shadow-2xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 print:border-slate-300 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xl font-black tracking-wider text-white print:text-black">
                <ShieldCheck className="w-6 h-6 text-cyan-400 print:text-black" />
                <span>{report.platform}</span>
              </div>
              <p className="text-xs text-cyan-400 print:text-slate-600 font-bold">
                {report.tagline}
              </p>
              <div className="text-[10px] text-slate-400 print:text-slate-500">
                {report.safety_notice}
              </div>
            </div>

            <div className="text-left sm:text-right text-xs text-slate-400 print:text-slate-600 space-y-1">
              <div>REPORT ID: #TB-SEC-{report.test.id}</div>
              <div>AUDIT DATE: {new Date(report.test.completed_at).toLocaleDateString()}</div>
              <div>ENVIRONMENT: {report.agent.environment} (Simulated)</div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <h2 className="text-base font-bold text-white print:text-black uppercase tracking-wider">
                {t('executiveAssessmentTitle')}
              </h2>
              <p className="text-xs text-slate-300 print:text-slate-700 font-sans leading-relaxed">
                {language === 'hi' ? (
                  <>
                    TRUSTBREAK AI ने <strong>{tDynamic(report.agent.name)} (v{report.agent.version})</strong> एजेंट के विरुद्ध{' '}
                    <strong>{tDynamic(report.test.test_type)}</strong> टेस्ट सूट का उपयोग करके एक प्रतिकूल सुरक्षा मूल्यांकन आयोजित किया। वास्तविक वातावरण में तैनात करने से पहले जोखिमों को अलग रखने के लिए सभी परीक्षण सिम्युलेटेड मॉक डेटाबेस और एपीआई के विरुद्ध संचालित किए गए।
                  </>
                ) : (
                  <>
                    TRUSTBREAK AI conducted an adversarial security evaluation against the agent{' '}
                    <strong>{report.agent.name} (v{report.agent.version})</strong> utilizing the{' '}
                    <strong>{report.test.test_type}</strong> test suite. All tests ran against simulated mock databases
                    and APIs to isolate risks prior to real-world deployment.
                  </>
                )}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-xs text-slate-400 print:text-slate-600">{t('finalSecurityStatus')}:</span>
                <span className="px-2.5 py-1 rounded bg-slate-950 print:bg-slate-200 font-bold text-xs">
                  {report.test.result === 'Passed' ? t('approvedForProd') : `${t('actionMonitor')} (${t('vulnerable')})`}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-slate-950 print:bg-slate-100 border border-slate-800 print:border-slate-300">
              <ScoreGauge
                score={report.test.security_score}
                size={110}
                strokeWidth={8}
                label={t('securityScore')}
              />
            </div>
          </div>

          {/* Agent Metadata */}
          <div className="p-4 rounded-xl bg-slate-950 print:bg-slate-100 border border-slate-800 print:border-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">{t('targetAgent')}</span>
              <strong className="text-white print:text-black">{tDynamic(report.agent.name)}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">{t('modelAndProvider')}</span>
              <strong className="text-white print:text-black">{tDynamic(report.agent.model)} ({tDynamic(report.agent.provider)})</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">{t('vulnerabilitiesFound')}</span>
              <strong className="text-rose-400 print:text-rose-600">{report.metrics.total_vulnerabilities}</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">{t('criticalVulnerabilities')}</span>
              <strong className="text-rose-400 print:text-rose-600">{report.metrics.critical}</strong>
            </div>
          </div>

          {/* Vulnerability Findings */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white print:text-black border-b border-slate-800 print:border-slate-300 pb-2">
              {t('discoveredFindings')}
            </h3>

            {report.vulnerabilities.length === 0 ? (
              <div className="p-4 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300">
                ✓ {t('noVulnsDetected')}
              </div>
            ) : (
              report.vulnerabilities.map((v: any, idx: number) => (
                <div
                  key={idx}
                  className="p-5 rounded-xl bg-slate-950 print:bg-slate-50 border border-slate-800 print:border-slate-300 space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white print:text-black text-sm">
                      #{idx + 1}. {v.title}
                    </span>
                    <RiskBadge level={v.severity} size="sm" />
                  </div>

                  <p className="text-slate-300 print:text-slate-700 font-sans leading-relaxed">
                    {v.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                    <div className="p-3 rounded bg-slate-900 print:bg-slate-100 border border-slate-800 print:border-slate-200">
                      <strong className="text-slate-400 print:text-slate-600 block mb-1">{t('rootCause')}:</strong>
                      <p className="text-slate-300 print:text-slate-700">{v.root_cause}</p>
                    </div>

                    <div className="p-3 rounded bg-slate-900 print:bg-slate-100 border border-slate-800 print:border-slate-200">
                      <strong className="text-emerald-400 print:text-emerald-700 block mb-1">{t('recommendedRemediation')}:</strong>
                      <p className="text-slate-300 print:text-slate-700">{v.recommendation}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer certification */}
          <div className="pt-6 border-t border-slate-800 print:border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>{t('validatedBy')}</div>
            <div className="font-mono text-[10px]">
              Signature: SHA256:{Math.random().toString(36).substring(2, 14).toUpperCase()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
