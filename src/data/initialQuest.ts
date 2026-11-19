import { StoryBoardNode, StoryBoardEdge } from '../types/storyboard';

// Embedded atmospheric SVG data URLs so concept art loads instantaneously offline and online
const NEON_ALLEY_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" width="600" height="300">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#090a10"/>
      <stop offset="60%" stop-color="#151828"/>
      <stop offset="100%" stop-color="#1e152a"/>
    </linearGradient>
    <linearGradient id="neonRed" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ff2a54"/>
      <stop offset="100%" stop-color="#990022"/>
    </linearGradient>
    <linearGradient id="neonCyan" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#00f2fe"/>
      <stop offset="100%" stop-color="#4facfe"/>
    </linearGradient>
  </defs>
  <rect width="600" height="300" fill="url(#bg)"/>
  <!-- Distant skyline -->
  <rect x="40" y="50" width="70" height="250" fill="#0d0f18"/>
  <rect x="130" y="20" width="95" height="280" fill="#0b0d14"/>
  <rect x="370" y="35" width="85" height="265" fill="#0d0f18"/>
  <rect x="470" y="15" width="110" height="285" fill="#08090f"/>
  <!-- Glowing Neon Signs -->
  <rect x="145" y="70" width="65" height="22" rx="3" fill="none" stroke="#ff2a54" stroke-width="2.5" opacity="0.9"/>
  <text x="155" y="85" fill="#ff2a54" font-family="monospace" font-size="11" font-weight="bold">ARCHIVE</text>
  <rect x="385" y="95" width="55" height="90" rx="2" fill="none" stroke="#00f2fe" stroke-width="2" opacity="0.8"/>
  <circle cx="412" cy="125" r="14" fill="none" stroke="#00f2fe" stroke-width="2"/>
  <line x1="395" y1="155" x2="430" y2="155" stroke="#00f2fe" stroke-width="2"/>
  <line x1="395" y1="168" x2="422" y2="168" stroke="#00f2fe" stroke-width="2"/>
  <!-- Alley bridge & cables -->
  <path d="M 110 90 Q 250 130 370 85" stroke="#ff2a54" stroke-width="1.5" fill="none" opacity="0.6"/>
  <path d="M 225 55 Q 300 110 470 65" stroke="#00f2fe" stroke-width="1.2" fill="none" opacity="0.5"/>
  <!-- Wet pavement reflection -->
  <ellipse cx="300" cy="275" rx="220" ry="20" fill="url(#neonRed)" opacity="0.22"/>
  <ellipse cx="390" cy="285" rx="110" ry="12" fill="url(#neonCyan)" opacity="0.2"/>
  <!-- Silhouette Detective Figure -->
  <path d="M 285 265 L 292 205 L 308 205 L 315 265 Z" fill="#050608"/>
  <circle cx="300" cy="194" r="8" fill="#050608"/>
  <path d="M 286 195 L 314 195 L 307 188 L 293 188 Z" fill="#ff2a54" opacity="0.85"/>
  <!-- Rain streaks -->
  <g stroke="#94a3b8" stroke-width="0.7" opacity="0.35">
    <line x1="80" y1="20" x2="65" y2="90"/>
    <line x1="190" y1="40" x2="175" y2="110"/>
    <line x1="260" y1="10" x2="245" y2="80"/>
    <line x1="340" y1="60" x2="325" y2="130"/>
    <line x1="450" y1="30" x2="435" y2="100"/>
    <line x1="530" y1="70" x2="515" y2="140"/>
    <line x1="150" y1="160" x2="135" y2="230"/>
    <line x1="410" y1="180" x2="395" y2="250"/>
  </g>
</svg>
`)}`;

const VAULT_CORE_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" width="600" height="300">
  <defs>
    <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ef4444" stop-opacity="0.55"/>
      <stop offset="55%" stop-color="#7f1d1d" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="#090a0f" stop-opacity="1"/>
    </radialGradient>
  </defs>
  <rect width="600" height="300" fill="#090a0f"/>
  <rect width="600" height="300" fill="url(#coreGlow)"/>
  <!-- Concentric Vault Rings -->
  <circle cx="300" cy="150" r="110" fill="none" stroke="#334155" stroke-width="2" stroke-dasharray="14 8"/>
  <circle cx="300" cy="150" r="82" fill="none" stroke="#ef4444" stroke-width="2" stroke-dasharray="30 12" opacity="0.8"/>
  <circle cx="300" cy="150" r="54" fill="none" stroke="#f59e0b" stroke-width="1.5" opacity="0.85"/>
  <!-- Floating Relic Octahedron -->
  <polygon points="300,105 335,150 300,195 265,150" fill="#ef4444" fill-opacity="0.25" stroke="#fca5a5" stroke-width="2"/>
  <line x1="265" y1="150" x2="335" y2="150" stroke="#fca5a5" stroke-width="1.5" opacity="0.7"/>
  <line x1="300" y1="105" x2="300" y2="195" stroke="#fca5a5" stroke-width="1.5" opacity="0.7"/>
  <!-- Data Beams -->
  <line x1="40" y1="150" x2="190" y2="150" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4 4"/>
  <line x1="410" y1="150" x2="560" y2="150" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4 4"/>
  <text x="242" y="275" fill="#fca5a5" font-family="monospace" font-size="11" letter-spacing="2">CHRONO-RELIC // S9</text>
</svg>
`)}`;

const ROOFTOP_EXTRACTION_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 300" width="600" height="300">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#060814"/>
      <stop offset="50%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#1e1b4b"/>
    </linearGradient>
  </defs>
  <rect width="600" height="300" fill="url(#sky)"/>
  <!-- Searchlight beams -->
  <polygon points="120,300 210,0 295,0 160,300" fill="#22d3ee" opacity="0.1"/>
  <polygon points="450,300 340,0 420,0 490,300" fill="#f43f5e" opacity="0.12"/>
  <!-- Helipad platform -->
  <polygon points="120,245 480,245 550,300 50,300" fill="#0f172a" stroke="#38bdf8" stroke-width="1.5"/>
  <ellipse cx="300" cy="272" rx="120" ry="14" fill="none" stroke="#f59e0b" stroke-width="2" stroke-dasharray="12 6"/>
  <!-- Gunship silhouette -->
  <path d="M 230 115 L 350 115 L 385 135 L 340 150 L 245 150 L 195 130 Z" fill="#090d16" stroke="#38bdf8" stroke-width="1.5"/>
  <line x1="170" y1="102" x2="415" y2="102" stroke="#94a3b8" stroke-width="2" opacity="0.7"/>
  <circle cx="360" cy="135" r="5" fill="#ef4444"/>
  <text x="225" y="220" fill="#38bdf8" font-family="monospace" font-size="11" letter-spacing="2">LZ // VALKYRIE-04</text>
</svg>
`)}`;

export const INITIAL_NODES: StoryBoardNode[] = [
  {
    id: 'story-arrival',
    type: 'storyPage',
    position: { x: 60, y: 180 },
    style: { width: 350 },
    data: {
      category: 'story',
      title: 'Scene 01: Rain Over Sector 9',
      sceneCode: 'ACT1_SC01',
      location: 'Neo-Veridia Lower Conduit',
      description:
        'Acid rain hisses against the neon signage outside **The Obsidian Archive**. Detective Vance checks his encrypted dossier—someone inside the syndicate vault has been tampering with the **Chrono-Relic** timeline logs.',
      dialogue:
        '"Three couriers vanished carrying the same biometric cipher. Either the Director is covering a breach, or the vault is already open."',
      dialogueSpeaker: 'DET. KALEB VANCE',
      characters: ['Det. Vance', 'Aria-7 (AI)', 'Watchman'],
      imageUrl: NEON_ALLEY_SVG,
      imageCaption: 'EXT. OBSIDIAN ARCHIVE - 02:14 AM',
      colorTag: 'crimson',
      isStartNode: true,
      stateChanges: [
        { id: 'sc-1', key: 'Alert_Level', operator: '=', value: '1' },
        { id: 'sc-2', key: 'Has_Relic', operator: '=', value: 'false' },
      ],
    },
  },
  {
    id: 'sticky-lore',
    type: 'beatSticky',
    position: { x: 85, y: -35 },
    style: { width: 280 },
    data: {
      category: 'sticky',
      title: 'Pacing & Investigation Clue',
      content:
        'Remind the player that **Syndicate Keycards** can be lifted from the Neon Market broker before approaching the vault doors. Keep noir tension high.',
      stickyColor: 'amber',
      tag: 'DESIGN NOTE // ACT I',
    },
  },
  {
    id: 'logic-approach',
    type: 'logicNode',
    position: { x: 520, y: 215 },
    style: { width: 310 },
    data: {
      category: 'logic',
      logicType: 'choice',
      title: 'Infiltration Vector',
      expression: 'CHOICE: Ghost Entry vs. Bribe Broker',
      description:
        'How does Vance breach the outer perimeter of the Obsidian Archive?',
      colorTag: 'crimson',
      branches: [
        {
          id: 'branch-a',
          label: 'Option A: Slice Service Vent (Stealth)',
          condition: 'Path: Main Plot',
        },
        {
          id: 'branch-b',
          label: 'Option B: Meet Nyx at Neon Market',
          condition: 'Path: Side Quest',
        },
      ],
      stateChanges: [],
    },
  },
  {
    id: 'story-market',
    type: 'storyPage',
    position: { x: 930, y: 500 },
    style: { width: 350 },
    data: {
      category: 'story',
      title: 'Scene 02B: The Black-Market Broker',
      sceneCode: 'ACT1_SC02B',
      location: 'Sub-Level Bazaar // Booth 14',
      description:
        'Beneath a canopy of holographic koi, information broker **Nyx** slides a crimson resonance key across the counter. It hums at the exact frequency of the Archive core.',
      dialogue:
        '"Take the Resonance Relic, detective. When you reach the inner sanctum, don\'t trust the security AI—override the terminal directly."',
      dialogueSpeaker: 'NYX (BROKER)',
      characters: ['Det. Vance', 'Nyx'],
      colorTag: 'cyan',
      stateChanges: [
        { id: 'sc-3', key: 'Has_Relic', operator: '=', value: 'true' },
        { id: 'sc-4', key: 'Credits', operator: '-=', value: '500' },
      ],
    },
  },
  {
    id: 'story-vault',
    type: 'storyPage',
    position: { x: 930, y: 40 },
    style: { width: 360 },
    data: {
      category: 'story',
      title: 'Scene 02A: The Resonance Vault',
      sceneCode: 'ACT1_SC02A',
      location: 'Archive Sub-Vault // Chamber 0',
      description:
        'Laser tripwires lattice the circular chamber. In the center floats the **Chrono-Relic**, suspended in a crimson containment field while automated drones sweep the catwalk.',
      dialogue:
        '"Warning: Biometric anomaly detected in Sector 0. Containment lock engaging in thirty seconds."',
      dialogueSpeaker: 'ARCHIVE MAINFRAME',
      characters: ['Det. Vance', 'Aria-7 (AI)', 'Vault Drone'],
      imageUrl: VAULT_CORE_SVG,
      imageCaption: 'INT. RESONANCE CORE - CONTAINMENT RING',
      colorTag: 'crimson',
      stateChanges: [
        { id: 'sc-5', key: 'Alert_Level', operator: '+=', value: '1' },
      ],
    },
  },
  {
    id: 'sticky-secret',
    type: 'beatSticky',
    position: { x: 1380, y: -60 },
    style: { width: 270 },
    data: {
      category: 'sticky',
      title: 'Secret Ending Trigger',
      content:
        'If `Has_Relic == true` when Vance reaches the Vault Gate, he can unlock the **amber secret timeline** instead of triggering the alarm firefight.',
      stickyColor: 'rose',
      tag: 'SECRET CONDITION',
    },
  },
  {
    id: 'logic-relic-check',
    type: 'logicNode',
    position: { x: 1400, y: 195 },
    style: { width: 315 },
    data: {
      category: 'logic',
      logicType: 'condition',
      title: 'Relic Resonance Check',
      expression: 'IF Has_Relic == true',
      description:
        'Checks whether Vance acquired the Resonance Relic key from Nyx before accessing the central pedestal.',
      colorTag: 'amber',
      branches: [
        {
          id: 'true',
          label: 'TRUE // Harmonize Relic Cipher',
          condition: 'Has_Relic == true',
        },
        {
          id: 'false',
          label: 'FALSE // Force Brute-Breach',
          condition: 'Has_Relic == false',
        },
      ],
      stateChanges: [],
    },
  },
  {
    id: 'story-secret-ending',
    type: 'storyPage',
    position: { x: 1840, y: 30 },
    style: { width: 350 },
    data: {
      category: 'story',
      title: 'Scene 03A: Ghost in the Timeline',
      sceneCode: 'ACT1_END_SECRET',
      location: 'Sanctum Observation Deck',
      description:
        'The crimson containment ring folds open silently. Inside the holographic memory stream, Vance discovers his own badge serial number stamped on the original heist order from twenty years in the future.',
      dialogue:
        '"My God... I didn\'t come here to stop the theft. I\'m the one who authorized it."',
      dialogueSpeaker: 'DET. KALEB VANCE',
      characters: ['Det. Vance', 'Future Echo'],
      colorTag: 'amber',
      stateChanges: [
        { id: 'sc-6', key: 'Timeline_Unlocked', operator: '=', value: 'true' },
      ],
    },
  },
  {
    id: 'story-showdown',
    type: 'storyPage',
    position: { x: 1840, y: 420 },
    style: { width: 350 },
    data: {
      category: 'story',
      title: 'Scene 03B: Rooftop Extraction',
      sceneCode: 'ACT1_END_MAIN',
      location: 'Archive Helipad // Stormfront',
      description:
        'Klaxons blare across the spire as Vance blasts through the skylight onto the rain-lashed helipad. An unmarked gunship hovers through the searchlights with the stolen memory core.',
      dialogue:
        '"Aria, lock grapple cable to the landing skid! We\'re riding this storm all the way to the upper spire!"',
      dialogueSpeaker: 'DET. KALEB VANCE',
      characters: ['Det. Vance', 'Aria-7 (AI)', 'Syndicate Enforcer'],
      imageUrl: ROOFTOP_EXTRACTION_SVG,
      imageCaption: 'EXT. SPIRE HELIPAD - EXTRACTION UNDER FIRE',
      colorTag: 'crimson',
      stateChanges: [
        { id: 'sc-7', key: 'Alert_Level', operator: '=', value: '5' },
      ],
    },
  },
];

export const INITIAL_EDGES: StoryBoardEdge[] = [
  {
    id: 'edge-arrival-approach',
    source: 'story-arrival',
    target: 'logic-approach',
    sourceHandle: 'out',
    targetHandle: 'in',
    type: 'redString',
    data: {
      wireColor: 'red',
      label: 'MAIN PLOT // ENTER ARCHIVE',
    },
  },
  {
    id: 'edge-sticky-arrival',
    source: 'sticky-lore',
    target: 'story-arrival',
    sourceHandle: 'out',
    targetHandle: 'in',
    type: 'redString',
    data: {
      wireColor: 'amber',
      label: 'CLUE PIN',
    },
  },
  {
    id: 'edge-approach-vault',
    source: 'logic-approach',
    target: 'story-vault',
    sourceHandle: 'branch-a',
    targetHandle: 'in',
    type: 'redString',
    data: {
      wireColor: 'red',
      label: 'STEALTH VENT',
    },
  },
  {
    id: 'edge-approach-market',
    source: 'logic-approach',
    target: 'story-market',
    sourceHandle: 'branch-b',
    targetHandle: 'in',
    type: 'redString',
    data: {
      wireColor: 'cyan',
      label: 'SIDE QUEST // BROKER',
    },
  },
  {
    id: 'edge-market-vault',
    source: 'story-market',
    target: 'story-vault',
    sourceHandle: 'out',
    targetHandle: 'in',
    type: 'redString',
    data: {
      wireColor: 'cyan',
      label: 'RELIC ACQUIRED',
    },
  },
  {
    id: 'edge-vault-check',
    source: 'story-vault',
    target: 'logic-relic-check',
    sourceHandle: 'out',
    targetHandle: 'in',
    type: 'redString',
    data: {
      wireColor: 'red',
      label: 'ACCESS CORE',
    },
  },
  {
    id: 'edge-check-secret',
    source: 'logic-relic-check',
    target: 'story-secret-ending',
    sourceHandle: 'true',
    targetHandle: 'in',
    type: 'redString',
    data: {
      wireColor: 'amber',
      label: 'SECRET PATH // TRUE',
    },
  },
  {
    id: 'edge-check-showdown',
    source: 'logic-relic-check',
    target: 'story-showdown',
    sourceHandle: 'false',
    targetHandle: 'in',
    type: 'redString',
    data: {
      wireColor: 'red',
      label: 'ALARM TRIGGERED // FALSE',
    },
  },
];
