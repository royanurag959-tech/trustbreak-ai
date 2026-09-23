import React, { useState } from 'react';
import { ActionLog } from '../types';
import { RiskBadge } from './RiskBadge';
import { useLanguage } from '../contexts/LanguageContext';
import { Terminal, Shield, ChevronDown, ChevronRight, Activity, Copy, Check, Filter } from 'lucide-react';

interface LiveActionStreamProps {
  logs: ActionLog[];
  filterLevel?: string;
  autoScroll?: boolean;
}

export const LiveActionStream: React.FC<LiveActionStreamProps> = ({ logs, filterLevel }) => {
  const { t, tDynamic } = useLanguage();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const filtered = filterLevel
    ? logs.filter((l) => l.risk_level.toUpperCase() === filterLevel.toUpperCase())
    : logs;

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCopy = (id: number, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTime = (ts: string) => {
    try {
      const d = new Date(ts);
      return d.toTimeString().split(' ')[0];
    } catch {
      return '10:32:01';
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800/90 rounded-2xl overflow-hidden font-mono text-xs shadow-2xl relative">
      {/* Terminal Top Window Bar */}
      <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/90 shadow-sm shadow-rose-500/50" />
            <span className="w-3 h-3 rounded-full bg-amber-500/90 shadow-sm shadow-amber-500/50" />
            <span className="w-3 h-3 rounded-full bg-emerald-500/90 shadow-sm shadow-emerald-500/50" />
          </div>
          <span className="text-slate-300 font-bold ml-2 flex items-center gap-2 tracking-wider">
            <Terminal className="w-4 h-4 text-cyan-400" />
            {t('liveActionStreamTitle')}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1.5 font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            {t('liveTelemetry')}
          </span>
        </div>
      </div>

      {/* Terminal Stream Rows */}
      <div className="divide-y divide-slate-800/40 max-h-[500px] overflow-y-auto terminal-scroll bg-[#030712]/90">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-3">
            <Activity className="w-8 h-8 text-slate-700 animate-pulse" />
            <span className="text-slate-400">{t('waitingEvents')}</span>
          </div>
        ) : (
          filtered.map((log, idx) => {
            const isExpanded = expandedId === log.id;
            const pseudoHex = `0x${(4096 + idx * 16).toString(16).toUpperCase()}`;

            return (
              <div
                key={log.id}
                onClick={() => toggleExpand(log.id)}
                className="group hover:bg-slate-900/60 transition-all p-3.5 cursor-pointer border-l-2 border-transparent hover:border-cyan-400"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-slate-600 text-[11px] shrink-0 select-none hidden sm:inline">
                      {pseudoHex}
                    </span>
                    <span className="text-slate-400 text-xs shrink-0 select-none">
                      {formatTime(log.timestamp)}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-900 text-cyan-300 border border-slate-700 shrink-0">
                      {tDynamic(log.event_type)}
                    </span>
                    <span className="text-slate-200 font-semibold truncate group-hover:text-cyan-200 transition-colors">
                      {tDynamic(log.action)}
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    {log.target && (
                      <span className="hidden md:inline-block text-[11px] text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                        {tDynamic(log.target)}
                      </span>
                    )}
                    <RiskBadge level={log.risk_level} size="sm" />
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {isExpanded && log.details && (
                  <div className="mt-3 p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-xs animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-slate-400 font-bold">
                      <span className="flex items-center gap-1.5 text-cyan-300">
                        <Shield className="w-3.5 h-3.5 text-cyan-400" />
                        {t('payloadInspection')}:
                      </span>
                      <button
                        onClick={(e) => handleCopy(log.id, log.details || '', e)}
                        className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 bg-slate-900 px-2 py-1 rounded border border-slate-800 transition-colors"
                      >
                        {copiedId === log.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">{t('copied')}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{t('copy')}</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-3 rounded-lg bg-black border border-slate-900 text-cyan-200 font-mono text-[11px] whitespace-pre-wrap break-all leading-relaxed">
                      {tDynamic(log.details)}
                    </pre>

                    {log.result && (
                      <div className="flex items-center gap-2 pt-1 text-[11px]">
                        <span className="text-slate-400">{t('policyEvaluationResult')}:</span>
                        <strong className="text-emerald-400">{tDynamic(log.result)}</strong>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
