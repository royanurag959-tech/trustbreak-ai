import React, { useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface AttackPathGraphProps {
  nodesJson?: string;
  edgesJson?: string;
  height?: string;
}

export const AttackPathGraph: React.FC<AttackPathGraphProps> = ({
  nodesJson,
  edgesJson,
  height = '500px'
}) => {
  const { t, tDynamic } = useLanguage();
  const initialNodes: Node[] = useMemo(() => {
    if (nodesJson) {
      try {
        const raw = JSON.parse(nodesJson);
        return raw.map((n: any) => {
          const isCritical = n.data?.risk === 'CRITICAL';
          const isSafe = n.data?.risk === 'SAFE';
          const isBlocked = n.data?.risk === 'BLOCKED';

          return {
            ...n,
            data: {
              ...n.data,
              label: tDynamic(n.data?.label)
            },
            style: {
              background: isCritical
                ? 'linear-gradient(135deg, #1c0a10 0%, #090204 100%)'
                : isSafe
                ? 'linear-gradient(135deg, #061c14 0%, #020b08 100%)'
                : isBlocked
                ? 'linear-gradient(135deg, #190924 0%, #0a020f 100%)'
                : 'linear-gradient(135deg, #091322 0%, #030712 100%)',
              color: '#f8fafc',
              border: `1px solid ${
                isCritical
                  ? '#f43f5e'
                  : isSafe
                  ? '#10b981'
                  : isBlocked
                  ? '#a855f7'
                  : '#0ea5e9'
              }`,
              borderRadius: '12px',
              padding: '12px 18px',
              fontSize: '12px',
              fontWeight: 700,
              fontFamily: 'monospace',
              boxShadow: isCritical
                ? '0 0 20px -2px rgba(244, 63, 94, 0.4), inset 0 0 12px rgba(244, 63, 94, 0.15)'
                : isSafe
                ? '0 0 20px -2px rgba(168, 185, 129, 0.4), inset 0 0 12px rgba(16, 185, 129, 0.15)'
                : isBlocked
                ? '0 0 20px -2px rgba(168, 85, 247, 0.4), inset 0 0 12px rgba(168, 85, 247, 0.15)'
                : '0 0 15px -2px rgba(14, 165, 233, 0.3)',
              minWidth: '220px',
              textAlign: 'center'
            }
          };
        });
      } catch (e) {
        console.error("Failed to parse nodes JSON:", e);
      }
    }

    return [
      { id: '1', data: { label: tDynamic('1. User Input (Injection Payload)'), risk: 'WARNING' }, position: { x: 250, y: 0 }, style: { background: '#091322', border: '1px solid #38bdf8', color: '#fff', borderRadius: '12px', padding: '12px', fontSize: '12px', fontFamily: 'monospace' } },
      { id: '2', data: { label: tDynamic('2. Prompt Injection Override'), risk: 'CRITICAL' }, position: { x: 250, y: 90 }, style: { background: '#1c0a10', border: '1px solid #f43f5e', color: '#fff', borderRadius: '12px', padding: '12px', fontSize: '12px', fontFamily: 'monospace' } },
      { id: '3', data: { label: tDynamic('3. Agent Instruction Override'), risk: 'CRITICAL' }, position: { x: 250, y: 180 }, style: { background: '#1c0a10', border: '1px solid #f43f5e', color: '#fff', borderRadius: '12px', padding: '12px', fontSize: '12px', fontFamily: 'monospace' } },
      { id: '4', data: { label: tDynamic('4. Tool Request: search_database'), risk: 'CRITICAL' }, position: { x: 250, y: 270 }, style: { background: '#091322', border: '1px solid #3b82f6', color: '#fff', borderRadius: '12px', padding: '12px', fontSize: '12px', fontFamily: 'monospace' } },
      { id: '5', data: { label: tDynamic('5. Policy Engine Check'), risk: 'WARNING' }, position: { x: 250, y: 360 }, style: { background: '#241a0b', border: '1px solid #f59e0b', color: '#fff', borderRadius: '12px', padding: '12px', fontSize: '12px', fontFamily: 'monospace' } },
      { id: '6', data: { label: tDynamic('6. Action Sandboxed & Logged'), risk: 'BLOCKED' }, position: { x: 250, y: 450 }, style: { background: '#190924', border: '1px solid #a855f7', color: '#fff', borderRadius: '12px', padding: '12px', fontSize: '12px', fontFamily: 'monospace' } }
    ];
  }, [nodesJson]);

  const initialEdges: Edge[] = useMemo(() => {
    if (edgesJson) {
      try {
        const raw = JSON.parse(edgesJson);
        return raw.map((e: any) => ({
          ...e,
          animated: true,
          style: {
            ...e.style,
            strokeWidth: 2.5
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: e.style?.stroke || '#f43f5e',
            width: 16,
            height: 16
          }
        }));
      } catch (e) {
        console.error("Failed to parse edges JSON:", e);
      }
    }

    return [
      { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#f43f5e', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f43f5e' } },
      { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#f43f5e', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f43f5e' } },
      { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#f43f5e', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f43f5e' } },
      { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: '#f59e0b', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#f59e0b' } },
      { id: 'e5-6', source: '5', target: '6', animated: true, style: { stroke: '#a855f7', strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: '#a855f7' } }
    ];
  }, [edgesJson]);

  return (
    <div style={{ height, width: '100%' }} className="relative bg-slate-950 rounded-2xl border border-slate-800/90 overflow-hidden shadow-2xl">
      {/* Top Status Indicators */}
      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-center gap-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono shadow-lg">
        <span className="flex items-center gap-1.5 text-rose-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          {t('criticalVector')}
        </span>
        <span className="text-slate-700">|</span>
        <span className="flex items-center gap-1.5 text-amber-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-amber-500" />
          {t('policyBoundary')}
        </span>
        <span className="text-slate-700">|</span>
        <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          {t('hardenedDefense')}
        </span>
      </div>

      <ReactFlow
        nodes={initialNodes}
        edges={initialEdges}
        fitView
        className="bg-slate-950"
      >
        <Background color="#1e293b" gap={20} size={1} />
        <Controls className="!bg-slate-900 !border-slate-800 !text-slate-300 rounded-xl overflow-hidden shadow-xl" />
        <MiniMap
          nodeColor={(n) => {
            const risk = (n.data as any)?.risk;
            return risk === 'CRITICAL' ? '#f43f5e' : risk === 'SAFE' ? '#10b981' : '#38bdf8';
          }}
          className="!bg-slate-950 !border-slate-800 rounded-xl"
        />
      </ReactFlow>
    </div>
  );
};
