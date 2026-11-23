/** The capstone spec, from the syllabus. Shown on /capstone and /syllabus. */
export const capstone = {
  title: "Capstone: three field profiles",
  intro: "Profile three people: one from a recorded interview and two from live conversations.",
  requirements: [
    "The person's likely need, decision pillar, and value, each backed by the exact phrase that showed it.",
    "Their profile sentence (If I... then people will... so I can finally...).",
    "One alternative read you considered and why you ruled it out.",
    "For the live profiles: what you said in response, how they reacted, and what you'd change next time.",
  ],
  pass: "A profile passes when the evidence phrases actually support the read and the response matches the need you identified.",
  slots: ["Recorded interview", "Live conversation 1", "Live conversation 2"],
} as const;

export const grading = [
  { component: "Weekly practice logs", weight: 40 },
  { component: "Unit checks (Units 1–3)", weight: 20 },
  { component: "Capstone", weight: 30 },
  { component: "Self-development plan", weight: 10 },
] as const;

export const courseOutcomes = [
  "Explain the five stages of perception (broken, different, facts, reasons, reflections) and place your own default stage.",
  "Identify the six childhood wound types and the adult behaviors each one produces.",
  "Diagnose a failed interaction with the Success Triangle: self-mastery, communication, or observation.",
  "Identify a person's primary social need from their everyday language, test it, and respond in matching language.",
  "Name the decision pillar someone uses to justify a choice and frame a proposal to fit it.",
  "Recognize a person's core value and connect a request to it.",
  "Combine needs, decisions, and values into a single working profile, and correct common profiling errors.",
  "Score your own authority traits and habits, and build a dated plan to raise your lowest score.",
] as const;
