import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierPath,
} from '@xyflow/react';
import { StoryBoardEdge, WireColor } from '../../types/storyboard';

const WIRE_PALETTE: Record<
  WireColor,
  {
    stroke: string;
    glow: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    pinColor: string;
    name: string;
  }
> = {
  red: {
    stroke: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.55)',
    badgeBg: 'rgba(24, 13, 18, 0.92)',
    badgeBorder: 'rgba(239, 68, 68, 0.6)',
    badgeText: '#fecaca',
    pinColor: '#ef4444',
    name: 'Main Plot',
  },
  cyan: {
    stroke: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.55)',
    badgeBg: 'rgba(11, 23, 29, 0.92)',
    badgeBorder: 'rgba(6, 182, 212, 0.6)',
    badgeText: '#a5f3fc',
    pinColor: '#06b6d4',
    name: 'Side Quest',
  },
  amber: {
    stroke: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.55)',
    badgeBg: 'rgba(26, 20, 11, 0.92)',
    badgeBorder: 'rgba(245, 158, 11, 0.6)',
    badgeText: '#fde68a',
    pinColor: '#f59e0b',
    name: 'Secret Path',
  },
};

export const RedStringEdge: React.FC<EdgeProps<StoryBoardEdge>> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
}) => {
  const wireColor: WireColor = data?.wireColor || 'red';
  const palette = WIRE_PALETTE[wireColor] || WIRE_PALETTE.red;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.32,
  });

  return (
    <>
      {/* Outer Soft Glow Yarn Layer */}
      <path
        d={edgePath}
        fill="none"
        stroke={palette.stroke}
        strokeWidth={selected ? 10 : 7}
        strokeOpacity={selected ? 0.35 : 0.18}
        strokeLinecap="round"
        style={{
          filter: `drop-shadow(0 0 8px ${palette.glow})`,
          transition: 'stroke-width 150ms ease, stroke-opacity 150ms ease',
        }}
      />

      {/* Primary Curved Crimson / Colored Yarn Strand */}
      <BaseEdge
        id={id}
        path={edgePath}
        style={{
          stroke: palette.stroke,
          strokeWidth: selected ? 3.4 : 2.5,
          strokeLinecap: 'round',
          filter: `drop-shadow(0 0 6px ${palette.glow})`,
        }}
      />

      {/* Subtle inner highlight thread for tactile yarn look */}
      <path
        d={edgePath}
        fill="none"
        stroke="#ffffff"
        strokeWidth={0.8}
        strokeOpacity={selected ? 0.55 : 0.25}
        strokeDasharray="10 6"
        strokeLinecap="round"
        className="pointer-events-none"
      />

      {/* Detective Brass/Crimson Push-Pin Caps at Anchor Ends */}
      <circle
        cx={sourceX}
        cy={sourceY}
        r={4.5}
        fill={palette.pinColor}
        stroke="#0b0c10"
        strokeWidth={1.5}
        style={{ filter: `drop-shadow(0 0 4px ${palette.glow})` }}
      />
      <circle
        cx={targetX}
        cy={targetY}
        r={4.5}
        fill={palette.pinColor}
        stroke="#0b0c10"
        strokeWidth={1.5}
        style={{ filter: `drop-shadow(0 0 4px ${palette.glow})` }}
      />

      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan group"
        >
          {data?.label ? (
            <div
              style={{
                backgroundColor: palette.badgeBg,
                borderColor: selected ? '#ffffff' : palette.badgeBorder,
                color: palette.badgeText,
                boxShadow: selected
                  ? `0 0 16px ${palette.glow}, 0 4px 12px rgba(0,0,0,0.6)`
                  : `0 4px 12px rgba(0,0,0,0.55)`,
              }}
              className="px-2.5 py-1 rounded-full border text-[10px] font-mono font-semibold tracking-wider uppercase flex items-center gap-1.5 backdrop-blur-md transition-transform duration-150 hover:scale-105 cursor-pointer"
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: palette.stroke }}
              />
              <span>{data.label}</span>
            </div>
          ) : selected ? (
            <div
              style={{
                backgroundColor: palette.badgeBg,
                borderColor: palette.badgeBorder,
                color: palette.badgeText,
              }}
              className="px-2 py-0.5 rounded-full border text-[10px] font-mono opacity-85"
            >
              + Add Wire Label
            </div>
          ) : null}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};
