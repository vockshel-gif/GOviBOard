import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Play,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Cpu,
  Split,
  MapPin,
  MessageSquareQuote,
  Users,
  CheckCircle2,
  Compass,
  History,
} from 'lucide-react';
import {
  StoryBoardNode,
  StoryBoardEdge,
  StoryNodeData,
  LogicNodeData,
  StateVariableMod,
} from '../types/storyboard';

interface PlaytestModalProps {
  isOpen: boolean;
  nodes: StoryBoardNode[];
  edges: StoryBoardEdge[];
  onClose: () => void;
  onFocusNode?: (nodeId: string) => void;
}

const applyStateMods = (
  currentVars: Record<string, string | number | boolean>,
  mods?: StateVariableMod[]
) => {
  if (!mods || mods.length === 0) return currentVars;
  const next = { ...currentVars };
  for (const mod of mods) {
    if (!mod.key.trim()) continue;
    const rawVal = mod.value.trim();
    let parsedVal: string | number | boolean = rawVal;
    if (rawVal.toLowerCase() === 'true') parsedVal = true;
    else if (rawVal.toLowerCase() === 'false') parsedVal = false;
    else if (!isNaN(Number(rawVal)) && rawVal !== '') parsedVal = Number(rawVal);

    if (mod.operator === '=') {
      next[mod.key] = parsedVal;
    } else if (mod.operator === '+=') {
      const prevNum = Number(next[mod.key] ?? 0);
      const addNum = Number(parsedVal);
      next[mod.key] = isNaN(prevNum) || isNaN(addNum) ? parsedVal : prevNum + addNum;
    } else if (mod.operator === '-=') {
      const prevNum = Number(next[mod.key] ?? 0);
      const subNum = Number(parsedVal);
      next[mod.key] = isNaN(prevNum) || isNaN(subNum) ? parsedVal : prevNum - subNum;
    }
  }
  return next;
};

const evaluateLogicExpression = (
  expression: string,
  vars: Record<string, string | number | boolean>
): boolean | null => {
  // Parse simple "IF Key == Value" or "Key != Value" or "Key >= Value"
  const cleaned = expression.replace(/^IF\s+/i, '').trim();
  const match = cleaned.match(/^([A-Za-z0-9_]+)\s*(==|!=|>=|<=|>|<)\s*(.+)$/);
  if (!match) return null;
  const [, varName, op, rhsRaw] = match;
  const lhs = vars[varName];
  const rhsClean = rhsRaw.trim().replace(/^['"]|['"]$/g, '');

  let rhs: string | number | boolean = rhsClean;
  if (rhsClean.toLowerCase() === 'true') rhs = true;
  else if (rhsClean.toLowerCase() === 'false') rhs = false;
  else if (!isNaN(Number(rhsClean)) && rhsClean !== '') rhs = Number(rhsClean);

  const normalizedLhs =
    lhs === undefined ? false : lhs;

  switch (op) {
    case '==':
      return String(normalizedLhs).toLowerCase() === String(rhs).toLowerCase();
    case '!=':
      return String(normalizedLhs).toLowerCase() !== String(rhs).toLowerCase();
    case '>=':
      return Number(normalizedLhs) >= Number(rhs);
    case '<=':
      return Number(normalizedLhs) <= Number(rhs);
    case '>':
      return Number(normalizedLhs) > Number(rhs);
    case '<':
      return Number(normalizedLhs) < Number(rhs);
    default:
      return null;
  }
};

export const PlaytestModal: React.FC<PlaytestModalProps> = ({
  isOpen,
  nodes,
  edges,
  onClose,
  onFocusNode,
}) => {
  const startNode = useMemo(() => {
    const explicitStart = nodes.find(
      (n) => n.data.category === 'story' && (n.data as StoryNodeData).isStartNode
    );
    if (explicitStart) return explicitStart;
    return nodes.find((n) => n.data.category === 'story') || nodes[0] || null;
  }, [nodes]);

  const [currentNodeId, setCurrentNodeId] = useState<string | null>(null);
  const [historyIds, setHistoryIds] = useState<string[]>([]);
  const [runtimeVars, setRuntimeVars] = useState<
    Record<string, string | number | boolean>
  >({
    Alert_Level: 1,
    Has_Relic: false,
    Credits: 1000,
  });

  // Reset playtest session on open
  useEffect(() => {
    if (isOpen && startNode) {
      const initialVars = applyStateMods(
        { Alert_Level: 1, Has_Relic: false, Credits: 1000 },
        (startNode.data as any).stateChanges
      );
      setCurrentNodeId(startNode.id);
      setHistoryIds([startNode.id]);
      setRuntimeVars(initialVars);
    }
  }, [isOpen, startNode]);

  if (!isOpen) return null;

  const currentNode = nodes.find((n) => n.id === currentNodeId) || null;

  const outgoingEdges = edges.filter((e) => e.source === currentNodeId);

  const handleRestart = () => {
    if (!startNode) return;
    const initialVars = applyStateMods(
      { Alert_Level: 1, Has_Relic: false, Credits: 1000 },
      (startNode.data as any).stateChanges
    );
    setCurrentNodeId(startNode.id);
    setHistoryIds([startNode.id]);
    setRuntimeVars(initialVars);
  };

  const handleStepToNode = (targetId: string) => {
    const targetNode = nodes.find((n) => n.id === targetId);
    if (!targetNode) return;
    const updatedVars = applyStateMods(
      runtimeVars,
      (targetNode.data as any).stateChanges
    );
    setRuntimeVars(updatedVars);
    setCurrentNodeId(targetId);
    setHistoryIds((prev) => [...prev, targetId]);
    if (onFocusNode) {
      onFocusNode(targetId);
    }
  };

  const handleToggleVariable = (key: string) => {
    setRuntimeVars((prev) => {
      const val = prev[key];
      if (typeof val === 'boolean') {
        return { ...prev, [key]: !val };
      }
      if (typeof val === 'number') {
        return { ...prev, [key]: val + 1 };
      }
      if (val === 'true') return { ...prev, [key]: false };
      if (val === 'false') return { ...prev, [key]: true };
      return prev;
    });
  };

  const evaluatedCondition =
    currentNode?.data.category === 'logic' &&
    (currentNode.data as LogicNodeData).logicType === 'condition'
      ? evaluateLogicExpression(
          (currentNode.data as LogicNodeData).expression || '',
          runtimeVars
        )
      : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#10121b] border border-slate-800 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col max-h-[88vh]">
        {/* Top Bar */}
        <div className="px-6 py-4 bg-[#0b0d14] border-b border-slate-800/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <Play className="w-4 h-4 fill-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-sans font-bold text-sm text-slate-100 tracking-tight">
                  Interactive Narrative Playtest Simulator
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 font-mono text-[10px] text-red-300 uppercase">
                  Live Runtime
                </span>
              </div>
              <p className="font-mono text-[11px] text-slate-400">
                Step through red-string connections and test branching game logic
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRestart}
              className="px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-xs font-mono text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restart Quest
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Simulator Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-800/90">
          {/* Left 2 Columns: Active Story / Logic Scene Card */}
          <div className="lg:col-span-2 p-6 space-y-6 flex flex-col justify-between">
            {currentNode ? (
              <div className="space-y-5">
                {/* Node Breadcrumb Header */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-red-500/15 border border-red-500/35 font-mono text-[11px] font-semibold text-red-300 uppercase">
                      {currentNode.data.category === 'story'
                        ? (currentNode.data as StoryNodeData).sceneCode || 'STORY SCENE'
                        : currentNode.data.category === 'logic'
                        ? 'LOGIC GATE'
                        : 'BEAT NOTE'}
                    </span>
                    {currentNode.data.category === 'story' &&
                      (currentNode.data as StoryNodeData).location && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300">
                          <MapPin className="w-3 h-3 text-red-400" />
                          {(currentNode.data as StoryNodeData).location}
                        </span>
                      )}
                  </div>
                  <span className="font-mono text-[11px] text-slate-500">
                    Step #{historyIds.length}
                  </span>
                </div>

                {/* Scene Title */}
                <h3 className="font-sans font-bold text-2xl text-white tracking-tight">
                  {currentNode.data.title}
                </h3>

                {/* Story Node Presentation */}
                {currentNode.data.category === 'story' && (
                  <>
                    {(currentNode.data as StoryNodeData).imageUrl && (
                      <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-lg">
                        <img
                          src={(currentNode.data as StoryNodeData).imageUrl}
                          alt={currentNode.data.title}
                          className="w-full h-48 object-cover"
                        />
                        {(currentNode.data as StoryNodeData).imageCaption && (
                          <div className="px-3 py-1.5 bg-slate-950/90 border-t border-slate-800 font-mono text-[10px] text-slate-400 uppercase tracking-wider">
                            {(currentNode.data as StoryNodeData).imageCaption}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-4 rounded-xl bg-[#151824] border border-slate-800/90 font-sans text-sm text-slate-200 leading-relaxed">
                      {(currentNode.data as StoryNodeData).description}
                    </div>

                    {(currentNode.data as StoryNodeData).dialogue && (
                      <div className="p-4 rounded-xl bg-[#0b0d14] border-l-4 border-l-red-500 border border-slate-800/90 space-y-1.5">
                        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-red-400 uppercase tracking-wider">
                          <MessageSquareQuote className="w-4 h-4" />
                          {(currentNode.data as StoryNodeData).dialogueSpeaker ||
                            'SPEAKER'}
                        </div>
                        <p className="font-sans text-sm italic text-slate-100 leading-relaxed">
                          {(currentNode.data as StoryNodeData).dialogue}
                        </p>
                      </div>
                    )}

                    {((currentNode.data as StoryNodeData).characters || []).length >
                      0 && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <Users className="w-3.5 h-3.5 text-slate-500" />
                        {(currentNode.data as StoryNodeData).characters.map(
                          (c, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-0.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs text-slate-300"
                            >
                              {c}
                            </span>
                          )
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Logic Node Presentation */}
                {currentNode.data.category === 'logic' && (
                  <div className="p-5 rounded-xl bg-[#131622] border border-amber-500/40 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                        {(currentNode.data as LogicNodeData).logicType ===
                        'condition' ? (
                          <Cpu className="w-4 h-4 text-amber-400" />
                        ) : (
                          <Split className="w-4 h-4 text-cyan-400" />
                        )}
                        {(currentNode.data as LogicNodeData).logicType ===
                        'condition'
                          ? 'Automated State Condition Check'
                          : 'Interactive Player Decision Point'}
                      </span>
                      {evaluatedCondition !== null && (
                        <span
                          className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-bold ${
                            evaluatedCondition
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          }`}
                        >
                          EVALUATES TO: {evaluatedCondition ? 'TRUE' : 'FALSE'}
                        </span>
                      )}
                    </div>

                    <div className="p-3 rounded-lg bg-[#090b10] border border-slate-800 font-mono text-sm text-amber-200">
                      {(currentNode.data as LogicNodeData).expression}
                    </div>

                    {(currentNode.data as LogicNodeData).description && (
                      <p className="font-sans text-xs text-slate-300">
                        {(currentNode.data as LogicNodeData).description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500">
                No active story node found on board.
              </div>
            )}

            {/* Next Branch Choices / Outgoing Wires */}
            <div className="pt-5 border-t border-slate-800/90 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Compass className="w-3.5 h-3.5 text-red-400" />
                  Connected Red-String Paths ({outgoingEdges.length})
                </span>
              </div>

              {outgoingEdges.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-950/25 border border-emerald-500/35 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <div className="font-sans font-bold text-xs text-emerald-200">
                        Narrative Branch Complete
                      </div>
                      <div className="font-mono text-[11px] text-emerald-300/80">
                        You have reached a terminal ending node on the evidence board.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 font-mono text-xs"
                  >
                    Play Again
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2.5">
                  {outgoingEdges.map((edge) => {
                    const targetNode = nodes.find((n) => n.id === edge.target);
                    if (!targetNode) return null;

                    // Check if this edge matches a specific branch on a LogicNode
                    let branchLabel = edge.data?.label || '';
                    let isRecommendedBranch = false;

                    if (currentNode?.data.category === 'logic') {
                      const logicData = currentNode.data as LogicNodeData;
                      const matchedBranch = (logicData.branches || []).find(
                        (b) => b.id === edge.sourceHandle
                      );
                      if (matchedBranch) {
                        branchLabel = matchedBranch.label;
                        if (
                          evaluatedCondition === true &&
                          matchedBranch.id === 'true'
                        ) {
                          isRecommendedBranch = true;
                        } else if (
                          evaluatedCondition === false &&
                          matchedBranch.id === 'false'
                        ) {
                          isRecommendedBranch = true;
                        }
                      }
                    }

                    const wireColor = edge.data?.wireColor || 'red';
                    const wireBadgeClass =
                      wireColor === 'cyan'
                        ? 'border-cyan-500/45 hover:border-cyan-400 bg-cyan-950/20'
                        : wireColor === 'amber'
                        ? 'border-amber-500/45 hover:border-amber-400 bg-amber-950/20'
                        : 'border-red-500/45 hover:border-red-400 bg-red-950/20';

                    return (
                      <button
                        key={edge.id}
                        type="button"
                        onClick={() => handleStepToNode(targetNode.id)}
                        className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center justify-between group ${wireBadgeClass} ${
                          isRecommendedBranch
                            ? 'ring-2 ring-emerald-400/70'
                            : ''
                        }`}
                      >
                        <div className="space-y-1 pr-3">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                wireColor === 'cyan'
                                  ? 'bg-cyan-400'
                                  : wireColor === 'amber'
                                  ? 'bg-amber-400'
                                  : 'bg-red-500'
                              }`}
                            />
                            <span className="font-mono text-xs font-bold text-slate-200 uppercase">
                              {branchLabel || 'CONTINUE THREAD'}
                            </span>
                            {isRecommendedBranch && (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 font-mono text-[10px] text-emerald-300">
                                MATCHES CURRENT STATE
                              </span>
                            )}
                          </div>
                          <div className="font-sans text-xs text-slate-300 pl-4">
                            Next: <strong className="text-white">{targetNode.data.title}</strong>
                          </div>
                        </div>

                        <div className="w-7 h-7 rounded-lg bg-slate-900/90 border border-slate-700 flex items-center justify-center text-slate-300 group-hover:translate-x-1 transition-transform shrink-0">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Live Game State Variables & Breadcrumb Trail */}
          <div className="p-5 bg-[#0c0e16] space-y-6 flex flex-col justify-between">
            <div className="space-y-5">
              {/* Live World State Variables */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-mono text-xs uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    Game State Memory
                  </h4>
                  <span className="font-mono text-[10px] text-slate-500">
                    Click to toggle
                  </span>
                </div>

                <div className="space-y-1.5">
                  {Object.entries(runtimeVars).map(([key, val]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleToggleVariable(key)}
                      className="w-full px-3 py-2 rounded-lg bg-[#121521] hover:bg-slate-800/80 border border-slate-800 flex items-center justify-between text-left transition-colors"
                      title="Click to toggle or increment state variable for testing branches"
                    >
                      <span className="font-mono text-xs text-slate-300">
                        {key}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-mono text-xs font-semibold ${
                          String(val) === 'true'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : String(val) === 'false'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {String(val)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Breadcrumb Investigation Trail */}
              <div className="space-y-2.5 pt-4 border-t border-slate-800/80">
                <h4 className="font-mono text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5 text-red-400" />
                  Investigation Path Log
                </h4>
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {historyIds.map((id, index) => {
                    const itemNode = nodes.find((n) => n.id === id);
                    if (!itemNode) return null;
                    const isCurrent = index === historyIds.length - 1;
                    return (
                      <button
                        key={`${id}-${index}`}
                        type="button"
                        onClick={() => {
                          setCurrentNodeId(id);
                          setHistoryIds((prev) => prev.slice(0, index + 1));
                        }}
                        className={`w-full px-2.5 py-1.5 rounded-lg border text-left flex items-center gap-2 transition-colors ${
                          isCurrent
                            ? 'bg-red-500/15 border-red-500/40 text-red-200'
                            : 'bg-[#11131d] border-slate-800/80 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="font-mono text-[10px] text-slate-500">
                          0{index + 1}
                        </span>
                        <span className="font-sans text-xs font-medium truncate">
                          {itemNode.data.title}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/70 border border-slate-800/90 text-[11px] font-sans text-slate-400 leading-relaxed">
              Tip: You can click any state variable above (like{' '}
              <code className="text-amber-300 font-mono">Has_Relic</code>) to
              live-toggle its value and test alternate secret branches.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
