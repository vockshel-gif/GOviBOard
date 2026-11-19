import React, { useRef } from 'react';
import {
  FileText,
  Cpu,
  StickyNote,
  Magnet,
  Play,
  Download,
  Upload,
  RotateCcw,
  Maximize2,
  CheckCircle2,
  Network,
} from 'lucide-react';
import { WireColor, StickyColor } from '../types/storyboard';

interface TopToolbarProps {
  activeWireColor: WireColor;
  onChangeWireColor: (color: WireColor) => void;
  snapToGrid: boolean;
  onToggleSnapToGrid: () => void;
  onAddStoryNode: () => void;
  onAddLogicNode: () => void;
  onAddStickyNode: (color?: StickyColor) => void;
  onOpenPlaytest: () => void;
  onExportJson: () => void;
  onImportJson: (file: File) => void;
  onResetSample: () => void;
  onFitView: () => void;
  lastSavedText: string;
  nodeCount: number;
  edgeCount: number;
}

const WIRE_PRESETS: {
  id: WireColor;
  label: string;
  sub: string;
  dot: string;
  activeClass: string;
}[] = [
  {
    id: 'red',
    label: 'Main Plot',
    sub: 'Red Yarn',
    dot: 'bg-red-500 shadow-[0_0_8px_#ef4444]',
    activeClass: 'bg-red-500/20 border-red-500/60 text-red-200',
  },
  {
    id: 'cyan',
    label: 'Side Quest',
    sub: 'Cyan Wire',
    dot: 'bg-cyan-400 shadow-[0_0_8px_#06b6d4]',
    activeClass: 'bg-cyan-500/20 border-cyan-500/60 text-cyan-200',
  },
  {
    id: 'amber',
    label: 'Secret Path',
    sub: 'Amber Thread',
    dot: 'bg-amber-400 shadow-[0_0_8px_#f59e0b]',
    activeClass: 'bg-amber-500/20 border-amber-500/60 text-amber-200',
  },
];

export const TopToolbar: React.FC<TopToolbarProps> = ({
  activeWireColor,
  onChangeWireColor,
  snapToGrid,
  onToggleSnapToGrid,
  onAddStoryNode,
  onAddLogicNode,
  onAddStickyNode,
  onOpenPlaytest,
  onExportJson,
  onImportJson,
  onResetSample,
  onFitView,
  lastSavedText,
  nodeCount,
  edgeCount,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <>
      {/* Top Floating Glassmorphism Bar */}
      <header className="absolute top-3 left-3 right-3 z-20 pointer-events-none flex items-center justify-between gap-3 flex-wrap">
        {/* Brand Identity & Stats Pill */}
        <div className="pointer-events-auto flex items-center gap-3 px-3.5 py-2 rounded-2xl bg-[#11131c]/85 backdrop-blur-xl border border-slate-800/90 shadow-[0_12px_35px_rgba(0,0,0,0.65)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500 to-rose-700 flex items-center justify-center shadow-[0_0_16px_rgba(239,68,68,0.45)] border border-red-400/40">
              <Network className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-sans font-bold text-sm text-white tracking-tight">
                  CRIMSON<span className="text-red-500">THREAD</span>
                </h1>
                <span className="px-1.5 py-0.5 rounded bg-red-500/15 border border-red-500/30 font-mono text-[9px] text-red-300 uppercase">
                  STUDIO v2.4
                </span>
                <a
                  href="/govi_thena_studio.html"
                  className="px-2 py-0.5 rounded-md bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 font-mono text-[10px] text-amber-300 transition-colors"
                  title="Open Govi Thena Story Board Studio (Separate App)"
                >
                  Govi Thena Board →
                </a>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                <span>{nodeCount} Nodes</span>
                <span>•</span>
                <span>{edgeCount} Threads</span>
                <span>•</span>
                <span className="inline-flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  {lastSavedText}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Floating Node Creation & Wire Color Palette Dock */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#11131c]/85 backdrop-blur-xl border border-slate-800/90 shadow-[0_12px_35px_rgba(0,0,0,0.65)] flex-wrap">
          {/* Add Node Buttons */}
          <div className="flex items-center gap-1.5 pr-2 border-r border-slate-800">
            <button
              type="button"
              onClick={onAddStoryNode}
              className="px-2.5 py-1.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/35 text-red-200 font-sans font-semibold text-xs flex items-center gap-1.5 transition-all hover:scale-[1.02]"
              title="Add a new Story Page Card"
            >
              <FileText className="w-3.5 h-3.5 text-red-400" />
              <span>+ Story Page</span>
            </button>

            <button
              type="button"
              onClick={onAddLogicNode}
              className="px-2.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/35 text-amber-200 font-sans font-semibold text-xs flex items-center gap-1.5 transition-all hover:scale-[1.02]"
              title="Add a Logic Condition or Decision Node"
            >
              <Cpu className="w-3.5 h-3.5 text-amber-400" />
              <span>+ Logic / Choice</span>
            </button>

            <button
              type="button"
              onClick={() => onAddStickyNode('amber')}
              className="px-2.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/35 text-emerald-200 font-sans font-semibold text-xs flex items-center gap-1.5 transition-all hover:scale-[1.02]"
              title="Add a Beat Sticky Note"
            >
              <StickyNote className="w-3.5 h-3.5 text-emerald-400" />
              <span>+ Beat Sticky</span>
            </button>
          </div>

          {/* Active Wire Spool Color Switcher */}
          <div className="flex items-center gap-1.5 pl-1">
            <span className="font-mono text-[10px] uppercase tracking-wider text-slate-400 mr-1 hidden xl:inline">
              Spool:
            </span>
            {WIRE_PRESETS.map((preset) => {
              const isActive = activeWireColor === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => onChangeWireColor(preset.id)}
                  className={`px-2.5 py-1.5 rounded-xl border text-xs font-mono flex items-center gap-1.5 transition-all ${
                    isActive
                      ? preset.activeClass
                      : 'bg-[#0b0d14]/80 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                  title={`New connections use ${preset.label} (${preset.sub})`}
                >
                  <span className={`w-2 h-2 rounded-full ${preset.dot}`} />
                  <span>{preset.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Action Controls: Snap-to-Grid, Playtest, Export/Import */}
        <div className="pointer-events-auto flex items-center gap-2 px-3 py-2 rounded-2xl bg-[#11131c]/85 backdrop-blur-xl border border-slate-800/90 shadow-[0_12px_35px_rgba(0,0,0,0.65)]">
          {/* Toggle Snap-to-Grid */}
          <button
            type="button"
            onClick={onToggleSnapToGrid}
            className={`px-2.5 py-1.5 rounded-xl border font-mono text-xs flex items-center gap-1.5 transition-all ${
              snapToGrid
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-200'
                : 'bg-[#0b0d14] border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Snap-to-Grid (20px)"
          >
            <Magnet className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Snap</span>
          </button>

          {/* Fit View */}
          <button
            type="button"
            onClick={onFitView}
            className="p-1.5 rounded-xl bg-[#0b0d14] hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            title="Center & Fit Evidence Board"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>

          {/* Export JSON */}
          <button
            type="button"
            onClick={onExportJson}
            className="px-2.5 py-1.5 rounded-xl bg-[#0b0d14] hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-xs flex items-center gap-1.5 transition-colors"
            title="Export Story Graph as JSON"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Export</span>
          </button>

          {/* Import JSON */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                onImportJson(file);
                e.target.value = '';
              }
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-2.5 py-1.5 rounded-xl bg-[#0b0d14] hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-xs flex items-center gap-1.5 transition-colors"
            title="Import Story Graph from JSON"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline">Import</span>
          </button>

          {/* Reset Demo Quest */}
          <button
            type="button"
            onClick={onResetSample}
            className="p-1.5 rounded-xl bg-[#0b0d14] hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
            title="Restore Sample Quest ('The Obsidian Archive')"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Playtest Story Mode CTA */}
          <button
            type="button"
            onClick={onOpenPlaytest}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-sans font-bold text-xs flex items-center gap-1.5 shadow-[0_0_20px_rgba(239,68,68,0.45)] border border-red-400/40 transition-all hover:scale-[1.03]"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            <span>Playtest Story</span>
          </button>
        </div>
      </header>
    </>
  );
};
