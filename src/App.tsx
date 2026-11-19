import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  useReactFlow,
  NodeTypes,
  EdgeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import {
  StoryBoardNode,
  StoryBoardEdge,
  WireColor,
  StickyColor,
  StoryNodeData,
} from './types/storyboard';
import { INITIAL_NODES, INITIAL_EDGES } from './data/initialQuest';
import { StoryPageNode } from './components/nodes/StoryPageNode';
import { LogicNode } from './components/nodes/LogicNode';
import { BeatStickyNode } from './components/nodes/BeatStickyNode';
import { RedStringEdge } from './components/edges/RedStringEdge';
import { TopToolbar } from './components/TopToolbar';
import { InspectorSidebar } from './components/InspectorSidebar';
import { PlaytestModal } from './components/PlaytestModal';

const STORAGE_KEY = 'crimson_thread_storyboard_v1';

const nodeTypes: NodeTypes = {
  storyPage: StoryPageNode as any,
  logicNode: LogicNode as any,
  beatSticky: BeatStickyNode as any,
};

const edgeTypes: EdgeTypes = {
  redString: RedStringEdge as any,
};

const loadInitialBoard = (): {
  nodes: StoryBoardNode[];
  edges: StoryBoardEdge[];
} => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges) && parsed.nodes.length > 0) {
        return { nodes: parsed.nodes, edges: parsed.edges };
      }
    }
  } catch (err) {
    console.warn('Could not load saved storyboard from localStorage:', err);
  }
  return { nodes: INITIAL_NODES, edges: INITIAL_EDGES };
};

const StoryBoardWorkspace: React.FC = () => {
  const initialBoard = useMemo(() => loadInitialBoard(), []);
  const [nodes, setNodes, onNodesChange] = useNodesState<StoryBoardNode>(
    initialBoard.nodes
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState<StoryBoardEdge>(
    initialBoard.edges
  );

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [activeWireColor, setActiveWireColor] = useState<WireColor>('red');
  const [snapToGrid, setSnapToGrid] = useState<boolean>(false);
  const [isPlaytestOpen, setIsPlaytestOpen] = useState<boolean>(false);
  const [lastSavedText, setLastSavedText] = useState<string>('Auto-saved');

  const { fitView, screenToFlowPosition, setCenter } = useReactFlow();

  // Auto-save board state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ nodes, edges, updatedAt: Date.now() })
      );
      setLastSavedText('Auto-saved');
    } catch (e) {
      console.warn('Auto-save failed:', e);
    }
  }, [nodes, edges]);

  // Connect nodes with the active wire spool color
  const onConnect = useCallback(
    (connection: Connection) => {
      const defaultLabels: Record<WireColor, string> = {
        red: 'MAIN PLOT',
        cyan: 'SIDE QUEST',
        amber: 'SECRET PATH',
      };
      const newEdge: StoryBoardEdge = {
        ...connection,
        id: `edge-${Date.now()}`,
        type: 'redString',
        data: {
          wireColor: activeWireColor,
          label: defaultLabels[activeWireColor],
        },
      };
      setEdges((eds) => addEdge(newEdge, eds));
      setSelectedEdgeId(newEdge.id);
      setSelectedNodeId(null);
    },
    [activeWireColor, setEdges]
  );

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || null,
    [nodes, selectedNodeId]
  );

  const selectedEdge = useMemo(
    () => edges.find((e) => e.id === selectedEdgeId) || null,
    [edges, selectedEdgeId]
  );

  const handleUpdateNode = useCallback(
    (nodeId: string, updater: (prevData: any) => any) => {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === nodeId ? { ...n, data: updater(n.data) } : n
        )
      );
    },
    [setNodes]
  );

  const handleUpdateEdge = useCallback(
    (edgeId: string, updater: (prevData: any) => any) => {
      setEdges((eds) =>
        eds.map((e) =>
          e.id === edgeId ? { ...e, data: updater(e.data || {}) } : e
        )
      );
    },
    [setEdges]
  );

  const handleDeleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) =>
        eds.filter((e) => e.source !== nodeId && e.target !== nodeId)
      );
      if (selectedNodeId === nodeId) setSelectedNodeId(null);
    },
    [selectedNodeId, setNodes, setEdges]
  );

  const handleDeleteEdge = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((e) => e.id !== edgeId));
      if (selectedEdgeId === edgeId) setSelectedEdgeId(null);
    },
    [selectedEdgeId, setEdges]
  );

  const handleSetStartNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.data.category !== 'story') return n;
          return {
            ...n,
            data: {
              ...n.data,
              isStartNode: n.id === nodeId,
            } as StoryNodeData,
          };
        })
      );
    },
    [setNodes]
  );

  const getViewportCenterPosition = useCallback(() => {
    const centerScreen = {
      x: window.innerWidth / 2 - 140 + Math.round((Math.random() - 0.5) * 80),
      y: window.innerHeight / 2 - 100 + Math.round((Math.random() - 0.5) * 80),
    };
    return screenToFlowPosition(centerScreen);
  }, [screenToFlowPosition]);

  const handleAddStoryNode = useCallback(() => {
    const pos = getViewportCenterPosition();
    const id = `story-${Date.now()}`;
    const newNode: StoryBoardNode = {
      id,
      type: 'storyPage',
      position: pos,
      style: { width: 340 },
      data: {
        category: 'story',
        title: 'New Story Scene',
        sceneCode: `ACT1_SC0${nodes.filter((n) => n.data.category === 'story').length + 1}`,
        location: 'Undisclosed Sector',
        description:
          'Describe the key narrative beat, environmental details, and player clues here...',
        dialogue: '"Every thread on this board leads back to the same syndicate vault."',
        dialogueSpeaker: 'DET. KALEB VANCE',
        characters: ['Det. Vance'],
        colorTag:
          activeWireColor === 'cyan'
            ? 'cyan'
            : activeWireColor === 'amber'
            ? 'amber'
            : 'crimson',
        stateChanges: [],
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
  }, [getViewportCenterPosition, nodes, activeWireColor, setNodes]);

  const handleAddLogicNode = useCallback(() => {
    const pos = getViewportCenterPosition();
    const id = `logic-${Date.now()}`;
    const newNode: StoryBoardNode = {
      id,
      type: 'logicNode',
      position: pos,
      style: { width: 310 },
      data: {
        category: 'logic',
        logicType: 'choice',
        title: 'Branching Decision',
        expression: 'CHOICE: Infiltrate vs. Negotiate',
        description: 'Player decision or game state branch check.',
        colorTag: 'amber',
        branches: [
          {
            id: 'branch-a',
            label: 'Option A: Primary Action',
            condition: 'Main Path',
          },
          {
            id: 'branch-b',
            label: 'Option B: Alternate Route',
            condition: 'Side Path',
          },
        ],
        stateChanges: [],
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setSelectedNodeId(id);
    setSelectedEdgeId(null);
  }, [getViewportCenterPosition, setNodes]);

  const handleAddStickyNode = useCallback(
    (color: StickyColor = 'amber') => {
      const pos = getViewportCenterPosition();
      const id = `sticky-${Date.now()}`;
      const paletteCycle: StickyColor[] = ['rose', 'emerald', 'amber', 'violet'];
      const stickyCount = nodes.filter((n) => n.data.category === 'sticky').length;
      const chosenColor = paletteCycle[stickyCount % paletteCycle.length] || color;

      const newNode: StoryBoardNode = {
        id,
        type: 'beatSticky',
        position: pos,
        style: { width: 255 },
        data: {
          category: 'sticky',
          title: 'Narrative Beat Note',
          content:
            'Add a pacing reminder, character arc note, or lore clue for the narrative team.',
          stickyColor: chosenColor,
          tag: 'BEAT NOTE',
        },
      };
      setNodes((nds) => [...nds, newNode]);
      setSelectedNodeId(id);
      setSelectedEdgeId(null);
    },
    [getViewportCenterPosition, nodes, setNodes]
  );

  const handleExportJson = useCallback(() => {
    const payload = {
      app: 'CrimsonThread Storyboard',
      version: '1.0',
      exportedAt: new Date().toISOString(),
      nodes,
      edges,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `crimson-thread-quest-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  const handleImportJson = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(String(event.target?.result || '{}'));
          if (Array.isArray(parsed.nodes) && Array.isArray(parsed.edges)) {
            setNodes(parsed.nodes);
            setEdges(parsed.edges);
            setSelectedNodeId(null);
            setSelectedEdgeId(null);
            setLastSavedText('Imported JSON');
            setTimeout(() => fitView({ padding: 0.18, duration: 400 }), 80);
          } else {
            alert('Invalid story graph JSON: missing nodes or edges array.');
          }
        } catch (err) {
          alert('Failed to parse JSON file.');
        }
      };
      reader.readAsText(file);
    },
    [setNodes, setEdges, fitView]
  );

  const handleResetSample = useCallback(() => {
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);
    setSelectedNodeId(null);
    setSelectedEdgeId(null);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ nodes: INITIAL_NODES, edges: INITIAL_EDGES })
    );
    setLastSavedText('Sample Restored');
    setTimeout(() => fitView({ padding: 0.16, duration: 450 }), 60);
  }, [setNodes, setEdges, fitView]);

  const handleFocusNode = useCallback(
    (nodeId: string) => {
      const target = nodes.find((n) => n.id === nodeId);
      if (target) {
        setCenter(target.position.x + 170, target.position.y + 120, {
          zoom: 0.95,
          duration: 400,
        });
      }
    },
    [nodes, setCenter]
  );

  return (
    <div className="relative w-screen h-screen bg-[#0b0c10] overflow-hidden flex select-none">
      {/* Top Floating Glassmorphism Toolbar */}
      <TopToolbar
        activeWireColor={activeWireColor}
        onChangeWireColor={setActiveWireColor}
        snapToGrid={snapToGrid}
        onToggleSnapToGrid={() => setSnapToGrid((s) => !s)}
        onAddStoryNode={handleAddStoryNode}
        onAddLogicNode={handleAddLogicNode}
        onAddStickyNode={handleAddStickyNode}
        onOpenPlaytest={() => setIsPlaytestOpen(true)}
        onExportJson={handleExportJson}
        onImportJson={handleImportJson}
        onResetSample={handleResetSample}
        onFitView={() => fitView({ padding: 0.16, duration: 400 })}
        lastSavedText={lastSavedText}
        nodeCount={nodes.length}
        edgeCount={edges.length}
      />

      {/* Main Infinite Dot-Grid Canvas */}
      <div className="flex-1 h-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={{
            type: 'redString',
          }}
          snapToGrid={snapToGrid}
          snapGrid={[24, 24]}
          onNodeClick={(_, node) => {
            setSelectedNodeId(node.id);
            setSelectedEdgeId(null);
          }}
          onEdgeClick={(_, edge) => {
            setSelectedEdgeId(edge.id);
            setSelectedNodeId(null);
          }}
          onPaneClick={() => {
            setSelectedNodeId(null);
            setSelectedEdgeId(null);
          }}
          fitView
          fitViewOptions={{ padding: 0.18 }}
          minZoom={0.2}
          maxZoom={2.2}
          proOptions={{ hideAttribution: true }}
          connectionLineStyle={{
            stroke:
              activeWireColor === 'cyan'
                ? '#06b6d4'
                : activeWireColor === 'amber'
                ? '#f59e0b'
                : '#ef4444',
            strokeWidth: 3,
          }}
        >
          <Background
            variant={BackgroundVariant.Dots}
            gap={24}
            size={1.6}
            color="#262b3d"
          />

          <Controls
            position="bottom-left"
            className="!bg-[#11131c]/90 !backdrop-blur-xl !border !border-slate-800 !rounded-xl !shadow-2xl overflow-hidden"
          />

          <MiniMap
            position="bottom-right"
            pannable
            zoomable
            className="!bg-[#11131c]/90 !backdrop-blur-xl !border !border-slate-800 !rounded-xl !shadow-2xl"
            maskColor="rgba(7, 8, 13, 0.72)"
            nodeColor={(n) => {
              if (n.type === 'storyPage') return '#ef4444';
              if (n.type === 'logicNode') return '#f59e0b';
              return '#10b981';
            }}
          />
        </ReactFlow>

        {/* Bottom-Left Subtle Legend Pill */}
        <div className="pointer-events-none absolute bottom-4 left-16 z-10 hidden md:flex items-center gap-4 px-3.5 py-2 rounded-xl bg-[#11131c]/85 backdrop-blur-md border border-slate-800/80 text-[11px] font-mono text-slate-400 shadow-lg">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#ef4444]" />
            <span>Red: Main Plot</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#06b6d4]" />
            <span>Cyan: Side Quest</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#f59e0b]" />
            <span>Amber: Secret Path</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">
            Click any node or wire to inspect & edit
          </span>
        </div>
      </div>

      {/* Right-Hand Inspector Drawer */}
      <InspectorSidebar
        selectedNode={selectedNode}
        selectedEdge={selectedEdge}
        onUpdateNode={handleUpdateNode}
        onUpdateEdge={handleUpdateEdge}
        onDeleteNode={handleDeleteNode}
        onDeleteEdge={handleDeleteEdge}
        onSetStartNode={handleSetStartNode}
        onClose={() => {
          setSelectedNodeId(null);
          setSelectedEdgeId(null);
        }}
      />

      {/* Interactive Narrative Playtest Modal */}
      <PlaytestModal
        isOpen={isPlaytestOpen}
        nodes={nodes}
        edges={edges}
        onClose={() => setIsPlaytestOpen(false)}
        onFocusNode={handleFocusNode}
      />
    </div>
  );
};

export default function App() {
  return (
    <ReactFlowProvider>
      <StoryBoardWorkspace />
    </ReactFlowProvider>
  );
}
