import React from 'react';
import {
  Handle,
  Position,
  NodeProps,
  NodeResizer,
} from '@xyflow/react';
import { StickyNote, Pin } from 'lucide-react';
import { StoryBoardNode, StickyNodeData, StickyColor } from '../../types/storyboard';

const STICKY_THEMES: Record<
  StickyColor,
  {
    bg: string;
    border: string;
    selectedBorder: string;
    headerText: string;
    bodyText: string;
    pin: string;
    tagBg: string;
    glow: string;
  }
> = {
  rose: {
    bg: 'bg-gradient-to-br from-rose-950/90 via-[#1f1019]/95 to-[#170c13]/95',
    border: 'border-rose-500/45',
    selectedBorder: 'border-rose-400 ring-2 ring-rose-500/35',
    headerText: 'text-rose-200',
    bodyText: 'text-rose-100/90',
    pin: 'bg-rose-500 shadow-[0_0_10px_#f43f5e]',
    tagBg: 'bg-rose-500/20 text-rose-300 border-rose-500/35',
    glow: 'shadow-[0_10px_28px_-8px_rgba(244,63,94,0.3)]',
  },
  emerald: {
    bg: 'bg-gradient-to-br from-emerald-950/90 via-[#0e1f1a]/95 to-[#0a1713]/95',
    border: 'border-emerald-500/45',
    selectedBorder: 'border-emerald-400 ring-2 ring-emerald-500/35',
    headerText: 'text-emerald-200',
    bodyText: 'text-emerald-100/90',
    pin: 'bg-emerald-400 shadow-[0_0_10px_#10b981]',
    tagBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/35',
    glow: 'shadow-[0_10px_28px_-8px_rgba(16,185,129,0.3)]',
  },
  amber: {
    bg: 'bg-gradient-to-br from-amber-950/90 via-[#21180d]/95 to-[#171109]/95',
    border: 'border-amber-500/45',
    selectedBorder: 'border-amber-400 ring-2 ring-amber-500/35',
    headerText: 'text-amber-200',
    bodyText: 'text-amber-100/90',
    pin: 'bg-amber-400 shadow-[0_0_10px_#f59e0b]',
    tagBg: 'bg-amber-500/20 text-amber-300 border-amber-500/35',
    glow: 'shadow-[0_10px_28px_-8px_rgba(245,158,11,0.3)]',
  },
  violet: {
    bg: 'bg-gradient-to-br from-violet-950/90 via-[#191126]/95 to-[#120c1c]/95',
    border: 'border-violet-500/45',
    selectedBorder: 'border-violet-400 ring-2 ring-violet-500/35',
    headerText: 'text-violet-200',
    bodyText: 'text-violet-100/90',
    pin: 'bg-violet-400 shadow-[0_0_10px_#8b5cf6]',
    tagBg: 'bg-violet-500/20 text-violet-300 border-violet-500/35',
    glow: 'shadow-[0_10px_28px_-8px_rgba(139,92,246,0.3)]',
  },
};

const renderInline = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={idx}
          className="px-1 py-0.5 rounded bg-black/40 font-mono text-[10px] text-amber-300"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <span key={idx}>{part}</span>;
  });
};

export const BeatStickyNode: React.FC<NodeProps<StoryBoardNode>> = ({
  data,
  selected,
}) => {
  const sticky = data as StickyNodeData;
  const theme = STICKY_THEMES[sticky.stickyColor || 'amber'] || STICKY_THEMES.amber;

  return (
    <div
      className={`relative w-full h-full min-w-[210px] min-h-[125px] rounded-xl ${theme.bg} backdrop-blur-md border p-3.5 flex flex-col justify-between transition-all duration-150 ${
        selected ? theme.selectedBorder : `${theme.border} ${theme.glow}`
      }`}
    >
      <NodeResizer
        minWidth={210}
        minHeight={125}
        isVisible={selected}
        lineClassName="!border-amber-400/60"
        handleClassName="!w-2.5 !h-2.5 !bg-amber-400 !border-slate-950 !rounded-sm"
      />

      {/* Top Tack Pin */}
      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <div
          className={`w-3.5 h-3.5 rounded-full border-2 border-slate-950 ${theme.pin}`}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <span
            className={`px-2 py-0.5 rounded text-[9px] font-mono font-semibold uppercase tracking-wider border ${theme.tagBg}`}
          >
            {sticky.tag || 'BEAT NOTE'}
          </span>
          <Pin className="w-3 h-3 text-slate-400/70 rotate-12 shrink-0" />
        </div>

        <div className="flex items-center gap-1.5">
          <StickyNote className={`w-3.5 h-3.5 shrink-0 ${theme.headerText}`} />
          <h4 className={`font-sans font-bold text-xs ${theme.headerText} leading-snug`}>
            {sticky.title || 'Story Beat'}
          </h4>
        </div>

        <p className={`font-sans text-xs leading-relaxed ${theme.bodyText}`}>
          {renderInline(sticky.content || 'Jot down lore reminders, pacing notes, or clues...')}
        </p>
      </div>

      {/* Left & Right Connection Pins so Sticky Notes can be pinned with red string if desired */}
      <Handle
        type="target"
        position={Position.Left}
        id="in"
        className="!w-2.5 !h-2.5 !bg-amber-400 !border-2 !border-slate-950 opacity-75 hover:opacity-100"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="out"
        className="!w-2.5 !h-2.5 !bg-amber-400 !border-2 !border-slate-950 opacity-75 hover:opacity-100"
      />
    </div>
  );
};
