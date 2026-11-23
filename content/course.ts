/**
 * Course structure. Mirrors docs/syllabus.md: five units across eight weeks.
 * Lessons themselves live in content/lessons/*.mdx and attach here by `unit` and `week`.
 */

export const ETHICS_LINE =
  "A ground rule before we start: these skills are for understanding and helping people, never for manipulating them.";

export type Unit = {
  number: 1 | 2 | 3 | 4 | 5;
  slug: string;
  title: string;
  weeks: number[];
  focus: string;
  overview: string[];
  takeaway: string;
  hasCheck: boolean;
};

export const units: Unit[] = [
  {
    number: 1,
    slug: "foundations",
    title: "Foundations",
    weeks: [1, 2],
    focus: "How people see the world, and where behavior comes from",
    overview: [
      "Before we learn to read anyone, we need the lens that makes reading possible. Unit 1 builds it: behavior is a strategy people learned as children, and we can only see it clearly once we stop judging it.",
      "We'll walk through the five stages of perception, the six wound types, two triangles that explain most of what goes right and wrong between people, and four laws that hold for everyone we'll ever meet.",
    ],
    takeaway: "Behavior is patterned, not personal. Judgment ends our ability to read and influence someone.",
    hasCheck: true,
  },
  {
    number: 2,
    slug: "human-needs",
    title: "Human Needs",
    weeks: [3, 4],
    focus: "The six social needs and how they shift by context",
    overview: [
      "Every person we talk to is chasing something from the people around them right now. Unit 2 teaches the six social needs: the emotional fuel behind everyday behavior.",
      "For each need we'll learn what it sounds like, what the person craves and fears, and the kind of language that lands. Then we'll see why the same person can show a different need at work, with friends, and at home.",
    ],
    takeaway: "Read the moment, not the life story. Identify the need, test it, use it, move on.",
    hasCheck: true,
  },
  {
    number: 3,
    slug: "decision-pillars",
    title: "Decision Pillars",
    weeks: [5],
    focus: "The six filters people use to justify choices",
    overview: [
      "Needs are what someone wants from other people. Decision pillars are how they choose their next move. Two people with the same need can decide in completely different ways.",
      "Unit 3 covers the six pillars. Frame a good idea through the wrong one and it gets turned down; frame it through the right one and the same idea feels obvious.",
    ],
    takeaway: "Pillars show up in justifications. When someone explains or defends a habit, we're hearing their decision filter.",
    hasCheck: true,
  },
  {
    number: 4,
    slug: "values-and-integration",
    title: "Values and Integration",
    weeks: [6, 7],
    focus: "The six end-goal values, and building one combined profile",
    overview: [
      "Values are the third layer: the deeper end goal a person keeps pursuing, often because it went unmet early on. Week 6 covers the six values one at a time.",
      "Week 7 puts all three layers together into a single working sentence: If I... then people will... so I can finally...",
    ],
    takeaway: "Adjectives reveal values, justifications reveal pillars, repetitions reveal needs.",
    hasCheck: true,
  },
  {
    number: 5,
    slug: "authority-and-self-development",
    title: "Authority and Self-Development",
    weeks: [8],
    focus: "Our own presence, habits, and limiting beliefs",
    overview: [
      "The last unit turns the lens around. Reading people is half the Success Triangle; the self-mastery side decides whether anyone trusts what we say.",
      "This week we rate our own authority, find the weakest area, test the beliefs holding it in place, and write a dated plan to move up one level.",
    ],
    takeaway: "Fix weaknesses before building strengths. The lowest trait has the biggest effect on influence.",
    hasCheck: false,
  },
];

export type Deliverable = { id: string; label: string; href?: string };

export type Week = {
  number: number;
  unit: Unit["number"];
  title: string;
  goals: string[];
  practice: string[];
  deliverable: string;
  checklist: Deliverable[];
};

export const weeks: Week[] = [
  {
    number: 1,
    unit: 1,
    title: "How we see people",
    goals: [
      "Explain the five stages of perception and place our own default stage",
      "Recognize the six wound types and the adult behavior each one produces",
      "Diagnose a failed interaction with the Success Triangle",
    ],
    practice: [
      "Note which stage we defaulted to in three moments of irritation this week.",
      "Take one interaction that went badly and name the leaking side of the Success Triangle.",
    ],
    deliverable: "Stage-of-perception journal (3 entries)",
    checklist: [{ id: "w1:journal", label: "Stage-of-perception journal: 3 entries written" }],
  },
  {
    number: 2,
    unit: 1,
    title: "Where behavior comes from",
    goals: [
      "Trace an adult strategy back to friends, safety, or rewards",
      "State the four laws of human behavior in order",
      "Explain why the right message fails with the wrong kind of person",
    ],
    practice: [
      "Match three people we know to the triangle side driving them, with one piece of evidence each.",
      "Write down one judgment we made and restate it as a reason.",
      "Preview: listen for one phrase that sounds like a need.",
    ],
    deliverable: "Triangle match for 3 people; Unit 1 check",
    checklist: [
      { id: "w2:triangle", label: "Triangle match for 3 people" },
      { id: "w2:check", label: "Unit 1 check taken", href: "/unit/foundations#check" },
    ],
  },
  {
    number: 3,
    unit: 2,
    title: "The primary needs",
    goals: [
      "Name the six social needs and which are primary",
      "Hear significance, acceptance, and approval in everyday language",
      "Answer each need in matching language",
    ],
    practice: [
      "Controlled: watch interviews, podcasts, or TV and log what we hear, with the phrase that tipped us off.",
      "Live: try one matching compliment in a real conversation and note the reaction.",
    ],
    deliverable: "Needs log (10 entries)",
    checklist: [{ id: "w3:log", label: "Needs log: 10 entries this week", href: "/practice/log" }],
  },
  {
    number: 4,
    unit: 2,
    title: "The secondary needs and the circles",
    goals: [
      "Hear intelligence, pity, and strength in everyday language",
      "Explain why one person shows different needs in different circles",
      "Identify a need, test it, and respond without overthinking the circle",
    ],
    practice: [
      "Controlled: log 10 need identifications, each with the exact phrase.",
      "Live: try one matching compliment and note the reaction.",
    ],
    deliverable: "Needs log (10 entries); Unit 2 check",
    checklist: [
      { id: "w4:log", label: "Needs log: 10 entries this week", href: "/practice/log" },
      { id: "w4:check", label: "Unit 2 check taken", href: "/unit/human-needs#check" },
    ],
  },
  {
    number: 5,
    unit: 3,
    title: "How people decide",
    goals: [
      "Name the decision pillar behind a justification",
      "Tell apart the commonly confused pairs: deviance and novelty, social and conformity",
      "Frame one proposal to fit the listener's pillar",
    ],
    practice: [
      "Take one real request we need to make this week. Write it three ways for three different pillars, then use the one that fits the person.",
    ],
    deliverable: "One request written for 3 pillars; Unit 3 check",
    checklist: [
      { id: "w5:request", label: "One request written for 3 pillars" },
      { id: "w5:check", label: "Unit 3 check taken", href: "/unit/decision-pillars#check" },
    ],
  },
  {
    number: 6,
    unit: 4,
    title: "What people value",
    goals: [
      "Recognize each of the six values from how a person talks",
      "Explain why values usually grow from what was missing",
      "Connect a request to the listener's value",
    ],
    practice: [
      "Controlled and live: log 10 value identifications. Listen to the adjectives people use for those they admire.",
    ],
    deliverable: "Values log (10 entries)",
    checklist: [{ id: "w6:log", label: "Values log: 10 entries this week", href: "/practice/log" }],
  },
  {
    number: 7,
    unit: 4,
    title: "Putting it together",
    goals: [
      "Combine need, pillar, and value into one profile sentence",
      "Use the three listening cues: adjectives, justifications, repetitions",
      "Catch and correct the common profiling errors",
    ],
    practice: [
      "Build five profile sentences from real conversations. For each, note one alternative read we ruled out and why.",
    ],
    deliverable: "5 profile sentences with ruled-out reads",
    checklist: [
      { id: "w7:profiles", label: "5 profile sentences with ruled-out reads", href: "/tools/profile-builder" },
      { id: "w7:check", label: "Unit 4 check taken (optional, ungraded)", href: "/unit/values-and-integration#check" },
    ],
  },
  {
    number: 8,
    unit: 5,
    title: "Turning the lens inward",
    goals: [
      "Rate our own authority traits and habit areas honestly",
      "Test our two strongest limiting beliefs",
      "Write a dated plan to raise the lowest trait and the lowest habit area by one level",
    ],
    practice: [
      "Complete the self-assessment and the limiting-beliefs worksheet.",
      "Write a milestone plan with dated steps.",
      "Finish and submit the capstone: three field profiles.",
    ],
    deliverable: "Scored inventory + dated milestone plan; capstone due",
    checklist: [
      { id: "w8:assessment", label: "Self-assessment scored", href: "/tools/self-assessment" },
      { id: "w8:plan", label: "Dated milestone plan written", href: "/tools/self-assessment#plan" },
      { id: "w8:beliefs", label: "Limiting-beliefs worksheet done", href: "/tools/limiting-beliefs" },
      { id: "w8:capstone", label: "Capstone: three field profiles", href: "/capstone" },
    ],
  },
];

export const groundRules = [
  {
    title: "Read the moment, not the life story.",
    body: "Profile what a person is showing in this context. The same person can show different needs at work, with friends, and at home.",
  },
  {
    title: "Two is fine.",
    body: "If we see two needs, pillars, or values, we speak to both. People don't fit neatly in a spreadsheet.",
  },
  {
    title: "Listen for why, not what.",
    body: "Ask why the person felt the need to say something, not just what they said.",
  },
];

export const WEEKLY_LOG_TARGET = 10;

export function unitByNumber(n: number): Unit {
  const unit = units.find((u) => u.number === n);
  if (!unit) throw new Error(`No unit ${n}`);
  return unit;
}
export function weekByNumber(n: number): Week {
  const week = weeks.find((w) => w.number === n);
  if (!week) throw new Error(`No week ${n}`);
  return week;
}
