import React, { useState } from 'react';
import {
  X,
  Trash2,
  Plus,
  FileText,
  Cpu,
  StickyNote,
  Cable,
  Sparkles,
  Users,
  Flag,
  Image as ImageIcon,
  GitBranch,
  MapPin,
  Palette,
} from 'lucide-react';
import {
  StoryBoardNode,
  StoryBoardEdge,
  StoryNodeData,
  LogicNodeData,
  StickyNodeData,
  StoryColorTag,
  StickyColor,
  WireColor,
  StateVariableMod,
  LogicBranch,
} from '../types/storyboard';

interface InspectorSidebarProps {
  selectedNode: StoryBoardNode | null;
  selectedEdge: StoryBoardEdge | null;
  onUpdateNode: (nodeId: string, updater: (data: any) => any) => void;
  onUpdateEdge: (edgeId: string, updater: (data: any) => any) => void;
  onDeleteNode: (nodeId: string) => void;
  onDeleteEdge: (edgeId: string) => void;
  onSetStartNode: (nodeId: string) => void;
  onClose: () => void;
}

const STORY_COLOR_TAGS: { id: StoryColorTag; label: string; dot: string }[] = [
  { id: 'crimson', label: 'Crimson', dot: 'bg-red-500' },
  { id: 'cyan', label: 'Cyan', dot: 'bg-cyan-400' },
  { id: 'amber', label: 'Amber', dot: 'bg-amber-400' },
  { id: 'emerald', label: 'Emerald', dot: 'bg-emerald-400' },
  { id: 'violet', label: 'Violet', dot: 'bg-violet-400' },
  { id: 'slate', label: 'Slate', dot: 'bg-slate-400' },
];

const STICKY_COLORS: { id: StickyColor; label: string; swatch: string }[] = [
  { id: 'rose', label: 'Rose', swatch: 'bg-rose-500' },
  { id: 'emerald', label: 'Emerald', swatch: 'bg-emerald-400' },
  { id: 'amber', label: 'Amber', swatch: 'bg-amber-400' },
  { id: 'violet', label: 'Violet', swatch: 'bg-violet-400' },
];

const WIRE_COLORS: {
  id: WireColor;
  label: string;
  desc: string;
  swatch: string;
  border: string;
}[] = [
  {
    id: 'red',
    label: 'Crimson Red',
    desc: 'Main Plot Thread',
    swatch: 'bg-red-500 shadow-[0_0_8px_#ef4444]',
    border: 'border-red-500/50',
  },
  {
    id: 'cyan',
    label: 'Electric Cyan',
    desc: 'Side Quest Branch',
    swatch: 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]',
    border: 'border-cyan-500/50',
  },
  {
    id: 'amber',
    label: 'Golden Amber',
    desc: 'Secret / Relic Path',
    swatch: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]',
    border: 'border-amber-500/50',
  },
];

export const InspectorSidebar: React.FC<InspectorSidebarProps> = ({
  selectedNode,
  selectedEdge,
  onUpdateNode,
  onUpdateEdge,
  onDeleteNode,
  onDeleteEdge,
  onSetStartNode,
  onClose,
}) => {
  const [newChar, setNewChar] = useState('');

  if (!selectedNode && !selectedEdge) {
    return null;
  }

  // Render Edge Inspector if an edge is selected
  if (selectedEdge) {
    const wireColor = selectedEdge.data?.wireColor || 'red';
    const label = selectedEdge.data?.label || '';

    return (
      <aside className="w-80 sm:w-96 h-full bg-[#11131c]/95 backdrop-blur-xl border-l border-slate-800/90 flex flex-col z-30 shadow-2xl animate-in slide-in-from-right duration-150">
        {/* Header */}
        <div className="px-4 py-3.5 border-b border-slate-800/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400">
              <Cable className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-200">
                Red String Wire Inspector
              </h2>
              <p className="font-mono text-[10px] text-slate-500">
                ID: {selectedEdge.id}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 transition-colors"
            title="Close Inspector"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-5 flex-1 overflow-y-auto">
          <div className="space-y-2">
            <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400">
              Wire Label (On Thread)
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) =>
                onUpdateEdge(selectedEdge.id, (prev) => ({
                  ...prev,
                  label: e.target.value,
                }))
              }
              placeholder="e.g. MAIN PLOT // STEALTH ENTRY"
              className="w-full px-3 py-2 rounded-lg bg-[#0b0c10] border border-slate-800 text-xs font-mono text-slate-100 focus:outline-none focus:border-red-500 transition-colors"
            />
            <p className="text-[11px] text-slate-500">
              Displayed directly on the glowing evidence string.
            </p>
          </div>

          <div className="space-y-2.5">
            <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400">
              Thread Color & Narrative Role
            </label>
            <div className="space-y-2">
              {WIRE_COLORS.map((wc) => {
                const active = wireColor === wc.id;
                return (
                  <button
                    key={wc.id}
                    type="button"
                    onClick={() =>
                      onUpdateEdge(selectedEdge.id, (prev) => ({
                        ...prev,
                        wireColor: wc.id,
                      }))
                    }
                    className={`w-full px-3 py-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                      active
                        ? `bg-slate-900 ${wc.border} ring-1 ring-white/15`
                        : 'bg-[#0b0c10]/70 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3 h-3 rounded-full ${wc.swatch}`} />
                      <div>
                        <div className="font-sans font-semibold text-xs text-slate-100">
                          {wc.label}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">
                          {wc.desc}
                        </div>
                      </div>
                    </div>
                    {active && (
                      <span className="font-mono text-[10px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                        ACTIVE
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800/90 bg-[#0d0f17]">
          <button
            type="button"
            onClick={() => onDeleteEdge(selectedEdge.id)}
            className="w-full py-2 px-3 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/35 text-rose-300 font-sans font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Cut Connection Wire
          </button>
        </div>
      </aside>
    );
  }

  // Otherwise render Node Inspector
  const node = selectedNode!;
  const data = node.data;

  const handleAddStateMod = () => {
    const current: StateVariableMod[] = (data as any).stateChanges || [];
    const nextMod: StateVariableMod = {
      id: `sc-${Date.now()}`,
      key: 'New_Flag',
      operator: '=',
      value: 'true',
    };
    onUpdateNode(node.id, (prev) => ({
      ...prev,
      stateChanges: [...current, nextMod],
    }));
  };

  const handleUpdateStateMod = (
    modId: string,
    field: keyof StateVariableMod,
    val: string
  ) => {
    const current: StateVariableMod[] = (data as any).stateChanges || [];
    onUpdateNode(node.id, (prev) => ({
      ...prev,
      stateChanges: current.map((item) =>
        item.id === modId ? { ...item, [field]: val } : item
      ),
    }));
  };

  const handleRemoveStateMod = (modId: string) => {
    const current: StateVariableMod[] = (data as any).stateChanges || [];
    onUpdateNode(node.id, (prev) => ({
      ...prev,
      stateChanges: current.filter((item) => item.id !== modId),
    }));
  };

  return (
    <aside className="w-80 sm:w-96 h-full bg-[#11131c]/95 backdrop-blur-xl border-l border-slate-800/90 flex flex-col z-30 shadow-2xl">
      {/* Drawer Header */}
      <div className="px-4 py-3.5 border-b border-slate-800/90 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1.5 rounded-lg bg-red-500/15 border border-red-500/30 text-red-400 shrink-0">
            {data.category === 'story' && <FileText className="w-4 h-4" />}
            {data.category === 'logic' && <Cpu className="w-4 h-4 text-amber-400" />}
            {data.category === 'sticky' && (
              <StickyNote className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-200 truncate">
              {data.category === 'story' && 'Story Page Inspector'}
              {data.category === 'logic' && 'Logic / Decision Inspector'}
              {data.category === 'sticky' && 'Beat Sticky Inspector'}
            </h2>
            <p className="font-mono text-[10px] text-slate-500 truncate">
              NODE // {node.id}
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 transition-colors"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Scrollable Inspector Form */}
      <div className="p-4 space-y-5 flex-1 overflow-y-auto custom-scrollbar">
        {/* Common Title Input */}
        <div className="space-y-1.5">
          <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400">
            Node Title
          </label>
          <input
            type="text"
            value={data.title || ''}
            onChange={(e) =>
              onUpdateNode(node.id, (prev) => ({
                ...prev,
                title: e.target.value,
              }))
            }
            placeholder="Scene or Logic Gate Title..."
            className="w-full px-3 py-2 rounded-lg bg-[#0b0c10] border border-slate-800 text-xs font-sans font-medium text-slate-100 focus:outline-none focus:border-red-500"
          />
        </div>

        {/* STORY NODE FIELDS */}
        {data.category === 'story' && (
          <>
            {/* Scene Code & Start Node Flag */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Scene Code
                </label>
                <input
                  type="text"
                  value={(data as StoryNodeData).sceneCode || ''}
                  onChange={(e) =>
                    onUpdateNode(node.id, (prev) => ({
                      ...prev,
                      sceneCode: e.target.value,
                    }))
                  }
                  placeholder="ACT1_SC01"
                  className="w-full px-2.5 py-1.5 rounded-lg bg-[#0b0c10] border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  Entry Point
                </label>
                <button
                  type="button"
                  onClick={() => onSetStartNode(node.id)}
                  className={`w-full py-1.5 px-2.5 rounded-lg border font-mono text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                    (data as StoryNodeData).isStartNode
                      ? 'bg-red-500/20 border-red-500/50 text-red-300 font-semibold'
                      : 'bg-[#0b0c10] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Flag className="w-3 h-3" />
                  {(data as StoryNodeData).isStartNode ? 'Start Scene' : 'Set as Start'}
                </button>
              </div>
            </div>

            {/* Location */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-400">
                <MapPin className="w-3 h-3 text-slate-500" /> Location Header
              </label>
              <input
                type="text"
                value={(data as StoryNodeData).location || ''}
                onChange={(e) =>
                  onUpdateNode(node.id, (prev) => ({
                    ...prev,
                    location: e.target.value,
                  }))
                }
                placeholder="e.g. Neo-Veridia Lower Conduit"
                className="w-full px-3 py-1.5 rounded-lg bg-[#0b0c10] border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-red-500"
              />
            </div>

            {/* Color Tag Selector */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-400">
                <Palette className="w-3 h-3 text-slate-500" /> Evidence Pin & Accent Tag
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {STORY_COLOR_TAGS.map((ct) => {
                  const active = (data as StoryNodeData).colorTag === ct.id;
                  return (
                    <button
                      key={ct.id}
                      type="button"
                      onClick={() =>
                        onUpdateNode(node.id, (prev) => ({
                          ...prev,
                          colorTag: ct.id,
                        }))
                      }
                      className={`px-2.5 py-1.5 rounded-lg border text-xs font-sans flex items-center gap-1.5 transition-all ${
                        active
                          ? 'bg-slate-800/90 border-white/40 text-white font-semibold'
                          : 'bg-[#0b0c10] border-slate-800/90 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-full ${ct.dot}`} />
                      <span>{ct.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Markdown Story Description */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-mono text-[11px] uppercase tracking-wider text-slate-400">
                  Scene Narrative (Markdown)
                </label>
                <span className="font-mono text-[10px] text-slate-500">
                  **bold** & `code`
                </span>
              </div>
              <textarea
                rows={4}
                value={(data as StoryNodeData).description || ''}
                onChange={(e) =>
                  onUpdateNode(node.id, (prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Write scene action, atmosphere, and visual cues..."
                className="w-full px-3 py-2 rounded-lg bg-[#0b0c10] border border-slate-800 text-xs font-sans text-slate-100 leading-relaxed focus:outline-none focus:border-red-500 resize-y"
              />
            </div>

            {/* Dialogue Speaker & Spoken Line */}
            <div className="space-y-2 p-3 rounded-xl bg-[#0c0e15] border border-slate-800/80">
              <label className="block font-mono text-[10px] uppercase tracking-wider text-red-300">
                Script Dialogue Box
              </label>
              <input
                type="text"
                value={(data as StoryNodeData).dialogueSpeaker || ''}
                onChange={(e) =>
                  onUpdateNode(node.id, (prev) => ({
                    ...prev,
                    dialogueSpeaker: e.target.value,
                  }))
                }
                placeholder="Speaker Name (e.g. DET. KALEB VANCE)"
                className="w-full px-2.5 py-1.5 rounded bg-[#08090d] border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-red-500"
              />
              <textarea
                rows={2}
                value={(data as StoryNodeData).dialogue || ''}
                onChange={(e) =>
                  onUpdateNode(node.id, (prev) => ({
                    ...prev,
                    dialogue: e.target.value,
                  }))
                }
                placeholder='"Spoken dialogue line..."'
                className="w-full px-2.5 py-1.5 rounded bg-[#08090d] border border-slate-800 text-xs font-sans italic text-slate-200 focus:outline-none focus:border-red-500 resize-y"
              />
            </div>

            {/* Character Tags */}
            <div className="space-y-2">
              <label className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-400">
                <Users className="w-3 h-3 text-slate-500" /> Character Tags
              </label>
              <div className="flex flex-wrap gap-1.5">
                {((data as StoryNodeData).characters || []).map((char, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-800/90 border border-slate-700 text-xs text-slate-200"
                  >
                    {char}
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateNode(node.id, (prev) => ({
                          ...prev,
                          characters: (prev.characters || []).filter(
                            (_: string, i: number) => i !== idx
                          ),
                        }))
                      }
                      className="text-slate-400 hover:text-rose-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1.5">
                <input
                  type="text"
                  value={newChar}
                  onChange={(e) => setNewChar(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newChar.trim()) {
                      e.preventDefault();
                      onUpdateNode(node.id, (prev) => ({
                        ...prev,
                        characters: [...(prev.characters || []), newChar.trim()],
                      }));
                      setNewChar('');
                    }
                  }}
                  placeholder="Add character tag..."
                  className="flex-1 px-2.5 py-1.5 rounded-lg bg-[#0b0c10] border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!newChar.trim()) return;
                    onUpdateNode(node.id, (prev) => ({
                      ...prev,
                      characters: [...(prev.characters || []), newChar.trim()],
                    }));
                    setNewChar('');
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </div>

            {/* Concept Art URL & Caption */}
            <div className="space-y-2 p-3 rounded-xl bg-[#0c0e15] border border-slate-800/80">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">
                  <ImageIcon className="w-3 h-3 text-slate-500" /> Concept Art Slot
                </label>
                {(data as StoryNodeData).imageUrl && (
                  <button
                    type="button"
                    onClick={() =>
                      onUpdateNode(node.id, (prev) => ({
                        ...prev,
                        imageUrl: '',
                      }))
                    }
                    className="text-[10px] font-mono text-rose-400 hover:underline"
                  >
                    Clear Image
                  </button>
                )}
              </div>
              <input
                type="text"
                value={(data as StoryNodeData).imageUrl || ''}
                onChange={(e) =>
                  onUpdateNode(node.id, (prev) => ({
                    ...prev,
                    imageUrl: e.target.value,
                  }))
                }
                placeholder="Paste image URL or data:image/svg..."
                className="w-full px-2.5 py-1.5 rounded bg-[#08090d] border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-red-500"
              />
              <input
                type="text"
                value={(data as StoryNodeData).imageCaption || ''}
                onChange={(e) =>
                  onUpdateNode(node.id, (prev) => ({
                    ...prev,
                    imageCaption: e.target.value,
                  }))
                }
                placeholder="Caption (e.g. EXT. OBSIDIAN ARCHIVE)"
                className="w-full px-2.5 py-1.5 rounded bg-[#08090d] border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none focus:border-red-500"
              />
            </div>
          </>
        )}

        {/* LOGIC / DECISION NODE FIELDS */}
        {data.category === 'logic' && (
          <>
            <div className="space-y-1.5">
              <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400">
                Logic Node Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateNode(node.id, (prev) => ({
                      ...prev,
                      logicType: 'condition',
                      branches:
                        prev.branches?.length === 2
                          ? [
                              {
                                id: 'true',
                                label: 'TRUE // Condition Met',
                                condition: prev.branches[0].condition || 'true',
                              },
                              {
                                id: 'false',
                                label: 'FALSE // Fallback',
                                condition: prev.branches[1].condition || 'false',
                              },
                            ]
                          : prev.branches,
                    }))
                  }
                  className={`py-2 px-3 rounded-lg border font-mono text-xs transition-all ${
                    (data as LogicNodeData).logicType === 'condition'
                      ? 'bg-amber-500/20 border-amber-500/50 text-amber-200 font-semibold'
                      : 'bg-[#0b0c10] border-slate-800 text-slate-400'
                  }`}
                >
                  IF / Condition
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateNode(node.id, (prev) => ({
                      ...prev,
                      logicType: 'choice',
                      branches:
                        prev.branches?.length === 2
                          ? [
                              {
                                id: 'branch-a',
                                label: 'Option A: Primary',
                                condition: 'Path A',
                              },
                              {
                                id: 'branch-b',
                                label: 'Option B: Alternate',
                                condition: 'Path B',
                              },
                            ]
                          : prev.branches,
                    }))
                  }
                  className={`py-2 px-3 rounded-lg border font-mono text-xs transition-all ${
                    (data as LogicNodeData).logicType === 'choice'
                      ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-200 font-semibold'
                      : 'bg-[#0b0c10] border-slate-800 text-slate-400'
                  }`}
                >
                  Player Choice
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400">
                Logic Expression (Monospace)
              </label>
              <input
                type="text"
                value={(data as LogicNodeData).expression || ''}
                onChange={(e) =>
                  onUpdateNode(node.id, (prev) => ({
                    ...prev,
                    expression: e.target.value,
                  }))
                }
                placeholder="IF Has_Relic == true"
                className="w-full px-3 py-2 rounded-lg bg-[#0b0c10] border border-amber-500/40 text-xs font-mono text-amber-200 focus:outline-none focus:border-amber-400"
              />
              <p className="text-[11px] text-slate-500">
                Supports automatic evaluation in Playtest Mode (e.g.{' '}
                <code className="text-amber-300">IF Has_Relic == true</code>).
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400">
                Designer Notes
              </label>
              <textarea
                rows={2}
                value={(data as LogicNodeData).description || ''}
                onChange={(e) =>
                  onUpdateNode(node.id, (prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Context on what this decision or condition controls..."
                className="w-full px-3 py-2 rounded-lg bg-[#0b0c10] border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Output Branches Editor */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-slate-400">
                  <GitBranch className="w-3 h-3 text-amber-400" /> Output Handles
                </label>
                <button
                  type="button"
                  onClick={() => {
                    const current: LogicBranch[] =
                      (data as LogicNodeData).branches || [];
                    const nextIdx = current.length + 1;
                    onUpdateNode(node.id, (prev) => ({
                      ...prev,
                      branches: [
                        ...current,
                        {
                          id: `branch-${Date.now()}`,
                          label: `Option ${nextIdx}`,
                          condition: '',
                        },
                      ],
                    }));
                  }}
                  className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Output
                </button>
              </div>

              <div className="space-y-2">
                {((data as LogicNodeData).branches || []).map((branch, idx) => (
                  <div
                    key={branch.id}
                    className="p-2.5 rounded-lg bg-[#0c0e15] border border-slate-800 space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] text-slate-400 uppercase">
                        Handle #{idx + 1} ({branch.id})
                      </span>
                      {((data as LogicNodeData).branches || []).length > 2 && (
                        <button
                          type="button"
                          onClick={() =>
                            onUpdateNode(node.id, (prev) => ({
                              ...prev,
                              branches: prev.branches.filter(
                                (b: LogicBranch) => b.id !== branch.id
                              ),
                            }))
                          }
                          className="text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={branch.label}
                      onChange={(e) =>
                        onUpdateNode(node.id, (prev) => ({
                          ...prev,
                          branches: prev.branches.map((b: LogicBranch) =>
                            b.id === branch.id
                              ? { ...b, label: e.target.value }
                              : b
                          ),
                        }))
                      }
                      placeholder="Branch Label (e.g. Option A / TRUE)"
                      className="w-full px-2 py-1 rounded bg-[#08090d] border border-slate-800 text-xs font-mono text-slate-200"
                    />
                    <input
                      type="text"
                      value={branch.condition || ''}
                      onChange={(e) =>
                        onUpdateNode(node.id, (prev) => ({
                          ...prev,
                          branches: prev.branches.map((b: LogicBranch) =>
                            b.id === branch.id
                              ? { ...b, condition: e.target.value }
                              : b
                          ),
                        }))
                      }
                      placeholder="Badge tag (e.g. Has_Relic == true)"
                      className="w-full px-2 py-1 rounded bg-[#08090d] border border-slate-800 text-[11px] font-mono text-slate-400"
                    />
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* STICKY NOTE FIELDS */}
        {data.category === 'sticky' && (
          <>
            <div className="space-y-1.5">
              <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400">
                Sticky Note Color
              </label>
              <div className="grid grid-cols-2 gap-2">
                {STICKY_COLORS.map((sc) => {
                  const active = (data as StickyNodeData).stickyColor === sc.id;
                  return (
                    <button
                      key={sc.id}
                      type="button"
                      onClick={() =>
                        onUpdateNode(node.id, (prev) => ({
                          ...prev,
                          stickyColor: sc.id,
                        }))
                      }
                      className={`px-3 py-2 rounded-lg border text-xs font-sans flex items-center gap-2 transition-all ${
                        active
                          ? 'bg-slate-800 border-white/40 text-white font-semibold'
                          : 'bg-[#0b0c10] border-slate-800 text-slate-400'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full ${sc.swatch}`} />
                      <span>{sc.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400">
                Category Header Tag
              </label>
              <input
                type="text"
                value={(data as StickyNodeData).tag || ''}
                onChange={(e) =>
                  onUpdateNode(node.id, (prev) => ({
                    ...prev,
                    tag: e.target.value,
                  }))
                }
                placeholder="e.g. LORE REMINDER // ACT I"
                className="w-full px-3 py-1.5 rounded-lg bg-[#0b0c10] border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-mono text-[11px] uppercase tracking-wider text-slate-400">
                Note Content (Markdown)
              </label>
              <textarea
                rows={5}
                value={(data as StickyNodeData).content || ''}
                onChange={(e) =>
                  onUpdateNode(node.id, (prev) => ({
                    ...prev,
                    content: e.target.value,
                  }))
                }
                placeholder="Pacing notes, character arcs, or secret triggers..."
                className="w-full px-3 py-2 rounded-lg bg-[#0b0c10] border border-slate-800 text-xs font-sans text-slate-100 leading-relaxed focus:outline-none focus:border-amber-400 resize-y"
              />
            </div>
          </>
        )}

        {/* STATE VARIABLES SECTION (Story & Logic Nodes) */}
        {(data.category === 'story' || data.category === 'logic') && (
          <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-amber-300">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> State Variable Mutations
              </label>
              <button
                type="button"
                onClick={handleAddStateMod}
                className="text-[10px] font-mono text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Variable
              </button>
            </div>

            {((data as any).stateChanges || []).length === 0 ? (
              <p className="text-[11px] text-slate-500 font-sans">
                No state variable changes triggered on this node.
              </p>
            ) : (
              <div className="space-y-2">
                {((data as any).stateChanges as StateVariableMod[]).map((mod) => (
                  <div
                    key={mod.id}
                    className="flex items-center gap-1.5 bg-[#0b0c10] p-1.5 rounded-lg border border-slate-800"
                  >
                    <input
                      type="text"
                      value={mod.key}
                      onChange={(e) =>
                        handleUpdateStateMod(mod.id, 'key', e.target.value)
                      }
                      placeholder="Var_Name"
                      className="w-28 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-amber-200"
                    />
                    <select
                      value={mod.operator}
                      onChange={(e) =>
                        handleUpdateStateMod(
                          mod.id,
                          'operator',
                          e.target.value as any
                        )
                      }
                      className="px-1.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-200"
                    >
                      <option value="=">=</option>
                      <option value="+=">+=</option>
                      <option value="-=">-=</option>
                    </select>
                    <input
                      type="text"
                      value={mod.value}
                      onChange={(e) =>
                        handleUpdateStateMod(mod.id, 'value', e.target.value)
                      }
                      placeholder="true / 1"
                      className="flex-1 min-w-0 px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-emerald-300"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveStateMod(mod.id)}
                      className="p-1 text-slate-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Drawer Footer */}
      <div className="p-4 border-t border-slate-800/90 bg-[#0d0f17]">
        <button
          type="button"
          onClick={() => onDeleteNode(node.id)}
          className="w-full py-2 px-3 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/35 text-rose-300 font-sans font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Remove Node from Board
        </button>
      </div>
    </aside>
  );
};
