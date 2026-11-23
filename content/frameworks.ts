/**
 * The three profiling frameworks plus the Unit 1 models, as data.
 * Field cards, flashcards, diagrams, the practice log, and the profile builder all read from here.
 */

export type Need = {
  id: "significance" | "acceptance" | "approval" | "intelligence" | "pity" | "strength";
  name: string;
  tier: "primary" | "secondary";
  hear: string;
  craves: string;
  fear: string;
  language: string;
  say: string;
  superpower: string;
  /** How this need completes "then people will ..." in a profile sentence. */
  clause: string;
};

export const needs: Need[] = [
  {
    id: "significance", name: "Significance", tier: "primary",
    hear: "“I was the youngest to ever...”",
    craves: "To be seen as exceptional",
    fear: "Being invisible or average",
    language: "Impact, achievement, exceptionality",
    say: "“At your level, most people wouldn't even get what you're doing.”",
    superpower: "Tunes out other people's judgment and stays on mission",
    clause: "see that I matter",
  },
  {
    id: "acceptance", name: "Acceptance", tier: "primary",
    hear: "“I just didn't feel part of the group.”",
    craves: "To belong",
    fear: "Being left out or rejected",
    language: "Inclusive, tribal, “we” language",
    say: "“You're exactly the kind of person people want around.”",
    superpower: "Fits in anywhere, and stays fiercely loyal to the tribe",
    clause: "keep me in the group",
  },
  {
    id: "approval", name: "Approval", tier: "primary",
    hear: "“I hope that's okay.” “I'm just trying to help.”",
    craves: "To be judged good and kind",
    fear: "Disapproval; letting someone down",
    language: "Specific praise for specific behaviors",
    say: "“You handled that beautifully. I trust your judgment.”",
    superpower: "Deep empathy",
    clause: "tell me I'm doing well",
  },
  {
    id: "intelligence", name: "Intelligence", tier: "secondary",
    hear: "“Actually, the way it works is...”",
    craves: "To be seen as smart",
    fear: "Looking stupid or uninformed",
    language: "Logic, strategy, insight (theirs)",
    say: "“You were the first person I thought of, because this one's complex.”",
    superpower: "Outstanding teacher",
    clause: "respect how I think",
  },
  {
    id: "pity", name: "Pity", tier: "secondary",
    hear: "“It's just been a lot lately.”",
    craves: "To have their hardship believed",
    fear: "Being alone, unloved, or not believed",
    language: "Empathy, safety, softness",
    say: "“I don't know how you do it. You carry more than anyone realizes.”",
    superpower: "None clearly named; possibly empathy",
    clause: "believe how hard it's been",
  },
  {
    id: "strength", name: "Strength", tier: "secondary",
    hear: "“I don't need anybody's help.”",
    craves: "Respect",
    fear: "Being seen as weak or dependent",
    language: "Respect, resilience, independence. Ask permission before complimenting",
    say: "“Mind if I say something? You're one of the most solid people I know.”",
    superpower: "Fearlessness",
    clause: "respect me",
  },
];

export type Pillar = {
  id: "deviance" | "novelty" | "social" | "conformity" | "investment" | "necessity";
  name: string;
  decides: string;
  hear: string;
  frame: string;
  avoid: string;
  /** How this pillar completes "If I ..." in a profile sentence. */
  clause: string;
};

export const pillars: Pillar[] = [
  {
    id: "deviance", name: "Deviance",
    decides: "By doing the opposite of what's expected",
    hear: "“Why do we even do it this way?”",
    frame: "Breaking the rules, going against the grain",
    avoid: "“Everyone's doing it,” tradition, groupthink",
    clause: "go my own way",
  },
  {
    id: "novelty", name: "Novelty",
    decides: "By what's new, exciting, different",
    hear: "“I've never tried that.”",
    frame: "Fresh, first, unlike anything before",
    avoid: "“Tried and true,” routine, heavy structure",
    clause: "keep chasing what's new",
  },
  {
    id: "social", name: "Social",
    decides: "By how it affects the people close to them",
    hear: "“Let's make sure everyone's okay with this.”",
    frame: "Good for the group, relationships protected",
    avoid: "Cold data dumps, every-man-for-himself framing, pushing",
    clause: "keep everyone around me happy",
  },
  {
    id: "conformity", name: "Conformity",
    decides: "By structure, rules, and what others do",
    hear: "“Technically we're supposed to...”",
    frame: "Standard, proven, what others like them do",
    avoid: "Disruptive language, change without structure",
    clause: "do things the right way",
  },
  {
    id: "investment", name: "Investment",
    decides: "By what they've already put in, and the return",
    hear: "“I've already put so much into this.”",
    frame: "Protecting and building on what they've invested",
    avoid: "“Starting over,” “walking away,” shrinking past effort",
    clause: "see this through",
  },
  {
    id: "necessity", name: "Necessity",
    decides: "By urgency: what has to happen now",
    hear: "“Okay, but what are we doing?”",
    frame: "Needed now; the cost of waiting",
    avoid: "Over-explaining, rambling, too many options",
    clause: "handle what has to be done",
  },
];

export type Value = {
  id: "connection" | "information" | "recognition" | "experiences" | "freedom" | "growth";
  name: string;
  goal: string;
  notice: string;
  hear: string;
  move: string;
  /** How this value completes "so I can finally ..." in a profile sentence. */
  clause: string;
};

export const values: Value[] = [
  {
    id: "connection", name: "Connection",
    goal: "Closeness, belonging",
    notice: "Asks “how are you really doing?” and means it",
    hear: "“I just want people to feel cared for.”",
    move: "Close the emotional distance. Real presence, not pressure",
    clause: "feel connected",
  },
  {
    id: "information", name: "Information",
    goal: "Understanding, being prepared",
    notice: "Researches everything before deciding; hates being caught unprepared",
    hear: "“I just want to know what I'm getting into.”",
    move: "Walk them through exactly how it works, then let them come to you",
    clause: "feel prepared",
  },
  {
    id: "recognition", name: "Recognition",
    goal: "Being seen and valued",
    notice: "Notices when effort or achievement goes unacknowledged",
    hear: "“I just want someone to see the effort.”",
    move: "Speak to their impact, not their intention",
    clause: "be seen",
  },
  {
    id: "experiences", name: "Experiences",
    goal: "A life that's felt and varied",
    notice: "Always proposing trips, new places, a story to tell; dreads routine",
    hear: "“I'm not after a perfect life. I want a full one.”",
    move: "Offer feelings and memories, not facts",
    clause: "feel alive",
  },
  {
    id: "freedom", name: "Freedom",
    goal: "Options and autonomy",
    notice: "Resists being boxed in or obligated",
    hear: "“I just want to live on my own terms.”",
    move: "Give space, ownership, flexibility. Make “no” clearly allowed",
    clause: "feel free",
  },
  {
    id: "growth", name: "Growth",
    goal: "Becoming more",
    notice: "Always in a course, a book, a new practice; drawn to progress, not comfort",
    hear: "“I need to know I'm not stuck.”",
    move: "Speak to their trajectory, not their status",
    clause: "become who I could be",
  },
];

export const stages = [
  { n: 1, name: "Separation and reactivity", sees: "Broken", sign: "Constant judging and comparing. Defend or attack. The world feels hostile." },
  { n: 2, name: "Comparison and judgment", sees: "Different", sign: "Notices nuance, but differences still irritate. Curiosity is starting." },
  { n: 3, name: "Observation and detachment", sees: "Facts", sign: "Steps back. People's situations are patterns and history, not personal." },
  { n: 4, name: "Empathy and understanding", sees: "Reasons", sign: "Every behavior has a reason. Compassion shows up on its own." },
  { n: 5, name: "Unity and reflection", sees: "Reflections", sign: "Others mirror our own inner world. Every interaction teaches us about ourselves." },
] as const;

export const wounds = [
  { id: "social", name: "Social", loss: "Loss of acceptance", forms: "Excluded, rejected, bullied, always the new kid", signs: "Echoes others' opinions, agrees early, avoids conflict, over-apologizes, fishes for reassurance" },
  { id: "authority", name: "Authority", loss: "Loss of control", forms: "Micromanaged, or left with no structure at all", signs: "Bristles at criticism from above, challenges rules, needs control, drifts into charge" },
  { id: "emotional", name: "Emotional", loss: "Abandonment or betrayal", forms: "Let down again and again; someone who left", signs: "Guarded, keeps things shallow, jokes when it gets deep. Theme: “don't hurt me”" },
  { id: "security", name: "Security", loss: "Loss of safety and stability", forms: "Unstable home, money trouble, frequent moves", signs: "Worst-case thinking, avoids risk, stressed by a broken routine" },
  { id: "validation", name: "Validation", loss: "Loss of recognition", forms: "Praised only for grades or performance", signs: "Brings up achievements unprompted, crushed by small criticism, uneasy out of the spotlight" },
  { id: "trust", name: "Trust", loss: "Fear of vulnerability", forms: "Caregivers who lied or broke promises", signs: "Shares little, tests loyalty, “they have to earn it.” Theme: “don't lie to me”" },
] as const;

export const listeningCues = [
  { cue: "Adjectives", reveals: "values", how: "What they admire or romanticize in other people" },
  { cue: "Justifications", reveals: "decision pillars", how: "What they explain or defend about a habit" },
  { cue: "Repetitions", reveals: "needs", how: "What they keep trying to get from the world, even when it doesn't work" },
] as const;

export const needById = (id: string) => needs.find((n) => n.id === id);
export const pillarById = (id: string) => pillars.find((p) => p.id === id);
export const valueById = (id: string) => values.find((v) => v.id === id);

/** Assemble "If I ..., then people will ..., so I can finally ...". */
export function profileSentence(parts: { pillar?: string; need?: string; value?: string }): string {
  const p = pillarById(parts.pillar ?? "")?.clause ?? "[decision pillar]";
  const n = needById(parts.need ?? "")?.clause ?? "[meet my need]";
  const v = valueById(parts.value ?? "")?.clause ?? "[value]";
  return `If I ${p}, then people will ${n}, so I can finally ${v}.`;
}
