import React from 'react';
import {
  Handle,
  Position,
  NodeProps,
  NodeResizer,
} from '@xyflow/react';
import {
  FileText,
  MapPin,
  MessageSquareQuote,
  Users,
  Sparkles,
  Flag,
  Image as ImageIcon,
} from 'lucide-react';
import { StoryBoardNode, StoryNodeData, StoryColorTag } from '../../types/storyboard';

const ACCENT_STYLES: Record<
  StoryColorTag,
  {
    border: string;
    topBar: string;
    badge: string;
    pin: string;
    glow: string;
  }
> = {
  crimson: {
    border: 'border-red-500/45',
    topBar: 'from-red-600/90 via-rose-600/80 to-red-900/60',
    badge: 'bg-red-500/15 text-red-300 border-red-500/30',
    pin: 'bg-red-500 shadow-[0_0_10px_#ef4444]',
    glow: 'shadow-[0_12px_35px_-10px_rgba(239,68,68,0.28)]',
  },
  cyan: {
    border: 'border-cyan-500/45',
    topBar: 'from-cyan-500/90 via-sky-600/80 to-cyan-900/60',
    badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    pin: 'bg-cyan-400 shadow-[0_0_10px_#06b6d4]',
    glow: 'shadow-[0_12px_35px_-10px_rgba(6,182,212,0.28)]',
  },
  amber: {
    border: 'border-amber-500/45',
    topBar: 'from-amber-500/90 via-orange-600/80 to-amber-900/60',
    badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    pin: 'bg-amber-400 shadow-[0_0_10px_#f59e0b]',
    glow: 'shadow-[0_12px_35px_-10px_rgba(245,158,11,0.28)]',
  },
  emerald: {
    border: 'border-emerald-500/45',
    topBar: 'from-emerald-500/90 via-teal-600/80 to-emerald-900/60',
    badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    pin: 'bg-emerald-400 shadow-[0_0_10px_#10b981]',
    glow: 'shadow-[0_12px_35px_-10px_rgba(16,185,129,0.28)]',
  },
  violet: {
    border: 'border-violet-500/45',
    topBar: 'from-violet-500/90 via-purple-600/80 to-violet-900/60',
    badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30',
    pin: 'bg-violet-400 shadow-[0_0_10px_#8b5cf6]',
    glow: 'shadow-[0_12px_35px_-10px_rgba(139,92,246,0.28)]',
  },
  slate: {
    border: 'border-slate-500/45',
    topBar: 'from-slate-600/90 via-slate-700/80 to-slate-900/60',
    badge: 'bg-slate-500/15 text-slate-300 border-slate-500/30',
    pin: 'bg-slate-400 shadow-[0_0_10px_#94a3b8]',
    glow: 'shadow-[0_12px_35px_-10px_rgba(148,163,184,0.2)]',
  },
};

const formatInlineMarkdown = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="text-slate-100 font-semibold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={idx}
          className="px-1 py-0.5 rounded bg-slate-800 text-red-300 font-mono text-[11px]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={idx}>{part}</span>;
  });
};

export const StoryPageNode: React.FC<NodeProps<StoryBoardNode>> = ({
  data,
  selected,
}) => {
  const story = data as StoryNodeData;
  const accent = ACCENT_STYLES[story.colorTag || 'crimson'] || ACCENT_STYLES.crimson;

  return (
    <div
      className={`relative w-full h-full min-w-[290px] min-h-[220px] rounded-xl bg-[#131620]/95 backdrop-blur-md border transition-all duration-150 flex flex-col ${
        selected
          ? 'border-red-400 ring-2 ring-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.25)]'
          : `${accent.border} ${accent.glow}`
      }`}
    >
      <NodeResizer
        minWidth={290}
        minHeight={220}
        isVisible={selected}
        lineClassName="!border-red-500/60"
        handleClassName="!w-2.5 !h-2.5 !bg-red-500 !border-slate-950 !rounded-sm"
      />

      {/* Detective Evidence Board Push-Pin at Top Center */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20 flex items-center justify-center pointer-events-none">
        <div
          className={`w-4 h-4 rounded-full border-2 border-slate-950 ${accent.pin} flex items-center justify-center`}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-white/75" />
        </div>
      </div>

      {/* Top Gradient Script Header Bar */}
      <div
        className={`h-1.5 w-full rounded-t-xl bg-gradient-to-r ${accent.topBar}`}
      />

      {/* Header Metadata Row */}
      <div className="px-3.5 pt-3 pb-2 border-b border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <FileText className="w-3.5 h-3.5 text-red-400 shrink-0" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 truncate">
            {story.sceneCode || 'SCENE_PAGE'}
          </span>
          {story.isStartNode && (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-500/20 border border-red-500/40 text-red-300 font-mono text-[9px] font-semibold tracking-wider uppercase">
              <Flag className="w-2.5 h-2.5 fill-red-400" /> START
            </span>
          )}
        </div>

        {story.location && (
          <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded border border-slate-800 truncate max-w-[155px]">
            <MapPin className="w-2.5 h-2.5 text-slate-500 shrink-0" />
            <span className="truncate">{story.location}</span>
          </div>
        )}
      </div>

      {/* Main Content Body */}
      <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2.5">
          {/* Script Page Title */}
          <h3 className="font-sans font-bold text-sm text-slate-100 leading-snug tracking-tight">
            {story.title || 'Untitled Story Page'}
          </h3>

          {/* Optional Concept Art Slot */}
          {story.imageUrl ? (
            <div className="relative rounded-lg overflow-hidden border border-slate-800/90 bg-slate-950 group">
              <img
                src={story.imageUrl}
                alt={story.title}
                className="w-full h-28 object-cover object-center"
              />
              {story.imageCaption && (
                <div className="px-2 py-1 bg-slate-950/85 backdrop-blur-xs border-t border-slate-800/80 flex items-center justify-between">
                  <span className="font-mono text-[9px] text-slate-400 tracking-wider uppercase truncate">
                    {story.imageCaption}
                  </span>
                  <ImageIcon className="w-2.5 h-2.5 text-slate-500 shrink-0" />
                </div>
              )}
            </div>
          ) : null}

          {/* Scene Description */}
          <p className="font-sans text-xs text-slate-300/95 leading-relaxed">
            {formatInlineMarkdown(
              story.description || 'Click to write scene description and narrative action...'
            )}
          </p>

          {/* Script Dialogue Box */}
          {story.dialogue && (
            <div className="rounded-lg bg-[#0b0d13]/90 border-l-2 border-l-red-500 border border-slate-800/80 p-2.5 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-red-300 flex items-center gap-1">
                  <MessageSquareQuote className="w-3 h-3 text-red-400" />
                  {story.dialogueSpeaker || 'CHARACTER'}
                </span>
                <span className="font-mono text-[9px] text-slate-500">VO // DIALOGUE</span>
              </div>
              <p className="font-sans text-xs italic text-slate-200 leading-relaxed">
                {story.dialogue}
              </p>
            </div>
          )}
        </div>

        {/* Footer: Character Tags & State Mutations */}
        <div className="pt-2 border-t border-slate-800/70 space-y-2">
          {story.characters && story.characters.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Users className="w-3 h-3 text-slate-500 shrink-0 mr-0.5" />
              {story.characters.map((char, idx) => (
                <span
                  key={idx}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-sans font-medium border ${accent.badge}`}
                >
                  {char}
                </span>
              ))}
            </div>
          )}

          {story.stateChanges && story.stateChanges.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0 mr-0.5" />
              {story.stateChanges.map((sc) => (
                <span
                  key={sc.id}
                  className="px-1.5 py-0.5 rounded bg-slate-900/95 border border-slate-800 text-[10px] font-mono text-amber-300"
                >
                  {sc.key} {sc.operator} {sc.value}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Left Input Pin Handle */}
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        className="!w-3.5 !h-3.5 !bg-red-500 !border-2 !border-slate-950 hover:!scale-125 transition-transform shadow-[0_0_8px_#ef4444]"
      />

      {/* Right Output Pin Handle */}
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="!w-3.5 !h-3.5 !bg-red-500 !border-2 !border-slate-950 hover:!scale-125 transition-transform shadow-[0_0_8px_#ef4444]"
      />
    </div>
  );
};
