/**
 * Chat component types, constants, and helper utilities.
 */

export type PillMode = 'reasoning' | 'lesson' | 'research' | 'rubric';

export interface ActionPill {
  mode: PillMode;
  label: string;
  iconColor: string;
  prompt: string;
  iconPath: string;
}

export interface NavItem {
  href: string;
  label: string;
  active: boolean;
  icon: string;
}

export interface RubricTier {
  strand: string;
  ee: string; // Exceeding Expectations (4)
  me: string; // Meeting Expectations (3)
  ae: string; // Approaching Expectations (2)
  be: string; // Below Expectations (1)
}

export interface Message {
  id: string;
  sender: 'user' | 'darasa';
  senderName: string;
  timestamp: string;
  text: string;
  strandTag?: string;
  materials?: string[];
  rubric?: RubricTier;
  followUps?: string[];
}

export interface ChatUIProps {
  /** Optional initial prompt to display or prefill */
  initialPrompt?: string;
  /** Callback to navigate back to the landing page */
  onBack: () => void;
}

let messageCounter = 100;
export function nextMsgId(): string {
  messageCounter += 1;
  return `msg-${messageCounter}`;
}

export const SIDEBAR_NAV: NavItem[] = [
  {
    href: '#home',
    label: 'Home',
    active: true,
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    href: '#curriculum',
    label: 'Curriculum',
    active: false,
    icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253',
  },
  {
    href: '#library',
    label: 'Library & Schemes',
    active: false,
    icon: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
  },
  {
    href: '#history',
    label: 'History',
    active: false,
    icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
  },
];

export const ACTION_PILLS: ActionPill[] = [
  {
    mode: 'reasoning',
    label: 'Reasoning',
    iconColor: 'text-amber-500',
    prompt: 'Explain plant transpiration with step-by-step CBC reasoning',
    iconPath:
      'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
  },
  {
    mode: 'lesson',
    label: 'Create Project',
    iconColor: 'text-purple-600',
    prompt: 'Design a practical science project using locally available household materials',
    iconPath:
      'M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z',
  },
  {
    mode: 'rubric',
    label: 'Formative Rubric',
    iconColor: 'text-emerald-600',
    prompt: 'Generate an official 4-tier formative assessment rubric calibrated for Grade 7 CBC',
    iconPath:
      'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    mode: 'research',
    label: 'Deep Research',
    iconColor: 'text-blue-600',
    prompt: 'Ground this inquiry strictly in KICD curriculum designs and assessment rubrics',
    iconPath:
      'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
];

export const RECENT_LESSONS = [
  'Grade 7 plant transpiration lab...',
  'Soil conservation project...',
  'CBC formative rubric...',
  'Grade 7 Integrated Science...',
  'Indigenous crafts & culture...',
  'Fractions practical activity...',
  'Water cycle model design...',
  'Kenyan flora classification...',
  'Energy transformation kit...',
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    sender: 'user',
    senderName: 'Mwalimu Jane (Educator)',
    timestamp: '9:15 AM',
    text: 'How can my Grade 7 learners demonstrate plant transpiration using locally available household materials instead of expensive glassware, and how should I evaluate them using an official CBC 4-tier rubric?',
    strandTag: 'Grade 7 • Integrated Science • Strand 2.3',
  },
  {
    id: 'msg-2',
    sender: 'darasa',
    senderName: 'Darasa CBC Assistant',
    timestamp: '9:16 AM',
    text: 'Jambo Mwalimu Jane! In the official KICD Grade 7 Integrated Science curriculum design, inquiry-based investigations using locally available materials foster critical thinking and self-efficacy without requiring expensive laboratory apparatus.',
    materials: [
      'Clean transparent polythene shopping bag (dry inside)',
      'Healthy leafy branch on school compound or potted plant',
      'Sisal string, banana fiber, or rubber band',
      'Direct morning sunlight for 30–45 minutes',
    ],
    rubric: {
      strand: 'Strand 2.3: Plant Physiology & Transpiration',
      ee: 'Exceeding Expectations (4): Sets up apparatus independently, formulates hypothesis on stomata, and tests sun vs. shade conditions.',
      me: 'Meeting Expectations (3): Correctly constructs chamber and identifies collected water droplets as transpired water vapor.',
      ae: 'Approaching Expectations (2): Assembles enclosure with peer assistance; requires prompting to explain condensation origin.',
      be: 'Below Expectations (1): Needs guided step-by-step assistance to enclose leaf and record observations.',
    },
    followUps: [
      'Draft a full 40-minute lesson plan for this strand',
      'What guiding Socratic questions should I ask during observation?',
      'How do I explain this practical task to parents for home reinforcement?',
    ],
  },
];
