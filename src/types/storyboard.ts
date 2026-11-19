import { Node, Edge } from '@xyflow/react';

export type NodeCategory = 'story' | 'logic' | 'sticky';

export type StickyColor = 'rose' | 'emerald' | 'amber' | 'violet';

export type StoryColorTag = 'crimson' | 'cyan' | 'amber' | 'emerald' | 'violet' | 'slate';

export type WireColor = 'red' | 'cyan' | 'amber';

export interface StateVariableMod {
  id: string;
  key: string;
  operator: '=' | '+=' | '-=';
  value: string;
}

export interface DialogueLine {
  id: string;
  speaker: string;
  line: string;
}

export interface StoryNodeData extends Record<string, unknown> {
  category: 'story';
  title: string;
  sceneCode?: string;
  location?: string;
  description: string; // Markdown story/scene description
  dialogue: string;
  dialogueSpeaker?: string;
  characters: string[];
  imageUrl?: string;
  imageCaption?: string;
  colorTag: StoryColorTag;
  isStartNode?: boolean;
  stateChanges: StateVariableMod[];
}

export interface LogicBranch {
  id: string; // handle id: 'branch-a', 'branch-b', etc. or 'true', 'false'
  label: string;
  condition?: string;
}

export interface LogicNodeData extends Record<string, unknown> {
  category: 'logic';
  logicType: 'condition' | 'choice';
  title: string;
  expression: string; // e.g. "IF Has_Relic == true" or "CHOICE: Sneak vs. Fight"
  description: string;
  colorTag: StoryColorTag;
  branches: LogicBranch[];
  stateChanges: StateVariableMod[];
}

export interface StickyNodeData extends Record<string, unknown> {
  category: 'sticky';
  title: string;
  content: string;
  stickyColor: StickyColor;
  tag?: string;
  stateChanges?: StateVariableMod[];
}

export type CustomNodeData = StoryNodeData | LogicNodeData | StickyNodeData;

export type StoryBoardNode = Node<CustomNodeData>;

export interface RedStringEdgeData extends Record<string, unknown> {
  wireColor: WireColor;
  label?: string;
  conditionTag?: string;
}

export type StoryBoardEdge = Edge<RedStringEdgeData>;
