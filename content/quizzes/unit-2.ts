import type { QuizItem } from "./types";

const NEEDS = ["Significance", "Acceptance", "Approval", "Intelligence", "Pity", "Strength"];

export const unit2: QuizItem[] = [
  {
    id: "u2-01", unit: 2, framework: "needs",
    prompt: "A new colleague mentions, twice in ten minutes, that she was the youngest manager her last company ever promoted. Which need is showing?",
    options: NEEDS, answer: 0,
    why: "“The youngest ever” is a claim to being exceptional. She isn't asking to be liked or included; she wants us to register that she stands out. That's significance.",
  },
  {
    id: "u2-02", unit: 2, framework: "needs",
    prompt: "“Honestly, I stopped going. Everyone there already knew each other and I just never felt part of it.” Which need?",
    options: NEEDS, answer: 1,
    why: "The pain here is about the group: being on the outside of it. Nobody judged him and nobody failed to praise him. He wanted to belong, which is acceptance.",
  },
  {
    id: "u2-03", unit: 2, framework: "needs",
    prompt: "A coworker hands over a finished report and says, “I hope that's okay. I can redo any of it. I was just trying to help.” Which need?",
    options: NEEDS, answer: 2,
    why: "She's asking for a verdict: was I good? The hedging and the offer to redo it are bids for permission. Approval wants to be judged good and kind.",
  },
  {
    id: "u2-04", unit: 2, framework: "needs",
    prompt: "“Well, technically that's not how inflation works. I read a study on this last month.” Which need?",
    options: NEEDS, answer: 3,
    why: "“Technically,” the correction, and the cited study are all signals of wanting to be seen as smart. The topic barely matters. The need is intelligence.",
  },
  {
    id: "u2-05", unit: 2, framework: "needs",
    prompt: "“It's fine. I'm used to doing it all alone. Nobody checks on me anyway.” Which need?",
    options: NEEDS, answer: 4,
    why: "The message underneath is “see how hard this is for me, and believe it.” She isn't asking for a fix. Wanting hardship recognized is pity.",
  },
  {
    id: "u2-06", unit: 2, framework: "needs",
    prompt: "“I handle my own business. I've been through worse than this.” Which need?",
    options: NEEDS, answer: 5,
    why: "Independence, toughness, and a hint of “don't offer me help.” He wants respect, not sympathy. That's strength.",
  },
  {
    id: "u2-07", unit: 2, framework: "needs", confused: true,
    prompt: "Two friends both say yes to every invitation. Dana says, “I just hate being the odd one out.” Riley says, “I'd feel awful if they thought I was rude.” Who is showing approval?",
    options: ["Dana", "Riley", "Both equally", "Neither"], answer: 1,
    why: "Riley fears being judged as bad, which is approval. Dana fears being outside the group, which is acceptance. Acceptance says “I want to belong.” Approval says “I need permission.”",
  },
  {
    id: "u2-08", unit: 2, framework: "needs", confused: true,
    prompt: "“I'm probably rambling. Does that even make sense?” Acceptance or approval, and why?",
    options: [
      "Acceptance: she wants to be part of the group",
      "Approval: she's checking whether she's being judged well",
      "Intelligence: she wants to sound clear",
      "Pity: she wants sympathy for struggling",
    ], answer: 1,
    why: "She's monitoring how she's coming across and asking us to rate it. There's no group in the sentence at all. Checking for a good verdict is approval.",
  },
  {
    id: "u2-09", unit: 2, framework: "needs", confused: true,
    prompt: "We honestly can't tell whether someone is showing acceptance or approval. What does the course say to do?",
    options: [
      "Wait until we're sure before saying anything",
      "Ask them directly which one it is",
      "Treat it as both and speak to both",
      "Default to significance, since it's the most common",
    ], answer: 2,
    why: "Two is fine. The two needs are cousins, and language that says “you belong here, and you did that well” feeds both. Waiting for certainty just means missing the moment.",
  },
  {
    id: "u2-10", unit: 2, framework: "needs",
    prompt: "What is the hidden fear behind the strength need?",
    options: ["Being average", "Being left out", "Being seen as weak or dependent", "Being seen as uninformed"], answer: 2,
    why: "Control is the strength person's armor. Everything about the tough exterior protects against looking weak or needing someone.",
  },
  {
    id: "u2-11", unit: 2, framework: "needs",
    prompt: "Why do we ask permission before complimenting someone showing the strength need?",
    options: [
      "They dislike compliments and will always refuse",
      "It hands them control of the moment, which is what they respect",
      "It gives us time to think of a better compliment",
      "They need extra reassurance before hearing praise",
    ], answer: 1,
    why: "An unrequested compliment can feel soft, or like being handled. Asking first (“mind if I say something?”) shows respect and leaves them in control, so the words can land.",
  },
  {
    id: "u2-12", unit: 2, framework: "needs",
    prompt: "A friend showing the pity need turns down every solution we offer. What's the most likely reason?",
    options: [
      "Our solutions aren't good enough",
      "The problem itself is the strategy for getting care",
      "They secretly want to feel significant",
      "They're testing how smart we are",
    ], answer: 1,
    why: "If the hardship is what brings care and attention, solving it removes the supply. So we lead with empathy and belief, not fixes, and we don't get pulled into the black hole.",
  },
  {
    id: "u2-13", unit: 2, framework: "needs",
    prompt: "Which reply fits someone showing the intelligence need?",
    options: [
      "“Everyone on the team loves having you around.”",
      "“That must be so hard. I don't know how you manage.”",
      "“You were the first person I thought of, because this one's complicated.”",
      "“You're so kind to offer.”",
    ], answer: 2,
    why: "It anchors on their insight: this is hard, so I came to you. The other three are aimed at acceptance, pity, and approval.",
  },
  {
    id: "u2-14", unit: 2, framework: "needs",
    prompt: "Which three needs does the Human Needs Map call primary?",
    options: [
      "Significance, acceptance, approval",
      "Intelligence, pity, strength",
      "Significance, intelligence, strength",
      "Acceptance, approval, pity",
    ], answer: 0,
    why: "Significance, acceptance, and approval are the primary three. Intelligence, pity, and strength are the secondary three.",
  },
  {
    id: "u2-15", unit: 2, framework: "needs",
    prompt: "A man is warm and eager to please at work but blunt and self-contained with his old friends. What's the best reading?",
    options: [
      "One of the two is fake",
      "We misread him at work",
      "He shows different needs in different circles, and both are real",
      "He has no primary need",
    ], answer: 2,
    why: "Coworkers sit in the proximity circle and old friends in the legacy circle. The same person can show a different need in each. We read the moment, not the life story.",
  },
  {
    id: "u2-16", unit: 2, framework: "needs",
    prompt: "In the field, how much time should we spend working out which circle we're in for someone?",
    options: [
      "As long as it takes; the circle decides everything",
      "None. Identify the need, test it, use it, move on",
      "Only if they're showing a secondary need",
      "Ask them how close they feel to us first",
    ], answer: 1,
    why: "The circles explain why needs shift. They aren't a step in the process. In a live conversation we only need the need that's showing right now.",
  },
  {
    id: "u2-17", unit: 2, framework: "needs",
    prompt: "A stranger wears a jacket covered in her company's logo and patches from the team's charity runs. On its own, how strong is that as evidence of the acceptance need?",
    options: [
      "Strong: clothing is the most reliable signal",
      "Weak: it's a general hint that needs words to back it up",
      "None: appearance never means anything",
      "Strong, but only for secondary needs",
    ], answer: 1,
    why: "Visual cues are general and less reliable than verbal ones. The jacket suggests a question worth holding (“what does she want me to think about her?”), and then we listen for the words.",
  },
  {
    id: "u2-18", unit: 2, framework: "needs", confused: true,
    prompt: "“I can't stand mediocrity. I've got really high standards.” A learner guesses intelligence. What's the better read?",
    options: ["Significance", "Approval", "Strength", "Acceptance"], answer: 0,
    why: "Nothing here is about being smart or correct. It's about being above average: the fear of being ordinary. That's significance. Intelligence would sound like “most people don't understand how this works.”",
  },
];
