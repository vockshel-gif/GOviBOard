import React from 'react';
import {
  Handle,
  Position,
  NodeProps,
  NodeResizer,
} from '@xyflow/react';
import { GitBranch, Cpu, Split, CheckCircle2, XCircle, ArrowRightCircle } from 'lucide-react';
import { StoryBoardNode, LogicNodeData } from '../../types/storyboard';

export const LogicNode: React.FC<NodeProps<StoryBoardNode>> = ({
  data,
  selected,
}) => {
  const logic = data as LogicNodeData;
  const isCondition = logic.logicType === 'condition';
  const branches =
    logic.branches && logic.branches.length > 0
      ? logic.branches
      : isCondition
      ? [
          { id: 'true', label: 'TRUE' },
          { id: 'false', label: 'FALSE' },
        ]
      : [
          { id: 'branch-a', label: 'Option A' },
          { id: 'branch-b', label: 'Option B' },
        ];

  return (
    <div
      className={`relative w-full h-full min-w-[270px] min-h-[160px] rounded-2xl bg-[#10131d]/95 backdrop-blur-md border transition-all duration-150 flex flex-col justify-between ${
        selected
          ? 'border-amber-400 ring-2 ring-amber-500/30 shadow-[0_0_32px_rgba(245,158,11,0.3)]'
          : isCondition
          ? 'border-amber-500/45 shadow-[0_12px_32px_-8px_rgba(245,158,11,0.22)]'
          : 'border-cyan-500/45 shadow-[0_12px_32px_-8px_rgba(6,182,212,0.22)]'
      }`}
    >
      <NodeResizer
        minWidth={270}
        minHeight={160}
        isVisible={selected}
        lineClassName="!border-amber-500/60"
        handleClassName="!w-2.5 !h-2.5 !bg-amber-400 !border-slate-950 !rounded-sm"
      />

      {/* Top Diamond / Logic Emblem Badge */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-700/90 shadow-md">
        <div
          className={`w-2.5 h-2.5 rotate-45 rounded-[2px] ${
            isCondition
              ? 'bg-amber-400 shadow-[0_0_8px_#f59e0b]'
              : 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]'
          }`}
        />
        <span className="font-mono text-[9px] font-bold tracking-widest uppercase text-slate-300">
          {isCondition ? 'LOGIC // CONDITION' : 'BRANCH // CHOICE'}
        </span>
      </div>

      {/* Main Header & Expression Block */}
      <div className="p-3.5 pt-4 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            {isCondition ? (
              <Cpu className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            ) : (
              <Split className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            )}
            <h4 className="font-sans font-bold text-xs text-slate-100 truncate">
              {logic.title || 'Logic Gate'}
            </h4>
          </div>
          <GitBranch className="w-3.5 h-3.5 text-slate-500 shrink-0" />
        </div>

        {/* Monospace Game Logic Pill Box */}
        <div
          className={`px-3 py-2 rounded-xl border font-mono text-xs font-semibold tracking-tight break-words ${
            isCondition
              ? 'bg-amber-950/35 border-amber-500/40 text-amber-200'
              : 'bg-cyan-950/35 border-cyan-500/40 text-cyan-200'
          }`}
        >
          {logic.expression || (isCondition ? 'IF Has_Relic == true' : 'CHOICE: Option A vs. B')}
        </div>

        {logic.description && (
          <p className="font-sans text-[11px] text-slate-400 leading-snug">
            {logic.description}
          </p>
        )}
      </div>

      {/* Distinct Output Branch Rows with Dedicated Output Handles */}
      <div className="border-t border-slate-800/80 bg-[#0b0d14]/80 rounded-b-2xl divide-y divide-slate-800/60">
        {branches.map((branch, index) => {
          const isTrueBranch =
            branch.id === 'true' ||
            branch.label.toUpperCase().startsWith('TRUE') ||
            index === 0;

          return (
            <div
              key={branch.id}
              className="relative px-3.5 py-2 flex items-center justify-between gap-2 group"
            >
              <div className="flex items-center gap-1.5 min-w-0 pr-3">
                {isCondition ? (
                  isTrueBranch ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  )
                ) : (
                  <ArrowRightCircle
                    className={`w-3.5 h-3.5 shrink-0 ${
                      index === 0 ? 'text-red-400' : 'text-cyan-400'
                    }`}
                  />
                )}
                <span className="font-mono text-[11px] font-medium text-slate-200 truncate">
                  {branch.label}
                </span>
              </div>

              {branch.condition && (
                <span className="font-mono text-[9px] text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800 shrink-0 mr-2">
                  {branch.condition}
                </span>
              )}

              <Handle
                type="source"
                position={Position.Right}
                id={branch.id}
                style={{ top: '50%', transform: 'translateY(-50%)' }}
                className={`!w-3.5 !h-3.5 !border-2 !border-slate-950 hover:!scale-125 transition-transform ${
                  isCondition
                    ? isTrueBranch
                      ? '!bg-emerald-400 shadow-[0_0_8px_#10b981]'
                      : '!bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                    : index === 0
                    ? '!bg-red-500 shadow-[0_0_8px_#ef4444]'
                    : '!bg-cyan-400 shadow-[0_0_8px_#06b6d4]'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Left Input Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        className="!w-3.5 !h-3.5 !bg-amber-400 !border-2 !border-slate-950 hover:!scale-125 transition-transform shadow-[0_0_8px_#f59e0b]"
      />
    </div>
  );
};
