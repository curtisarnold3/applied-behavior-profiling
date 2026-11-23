import type { QuizItem } from "./types";

const WOUNDS = ["Social", "Authority", "Emotional", "Security", "Validation", "Trust"];
const SIDES = ["Self-mastery", "Communication", "Observation"];
const CHILD = ["Friends", "Safety", "Rewards"];

export const unit1: QuizItem[] = [
  {
    id: "u1-01", unit: 1, framework: "foundations",
    prompt: "At which stage of perception do we see other people as reasons?",
    options: ["Stage 2: Comparison and judgment", "Stage 3: Observation and detachment", "Stage 4: Empathy and understanding", "Stage 5: Unity and reflection"], answer: 2,
    why: "At stage 4, every behavior, even a harmful one, has a reason behind it: pain, conditioning, history. Stage 3 sees facts and patterns; stage 5 sees reflections of ourselves.",
  },
  {
    id: "u1-02", unit: 1, framework: "foundations",
    prompt: "A coworker's habits don't make us angry anymore, but they still grate. We notice how unlike us she is. Which stage is that?",
    options: ["Stage 1: others look broken", "Stage 2: others look different", "Stage 3: others look like facts", "Stage 4: others look like reasons"], answer: 1,
    why: "Noticing nuance while still being irritated by the difference is stage 2. Curiosity has started, but ego is still filtering it.",
  },
  {
    id: "u1-03", unit: 1, framework: "foundations", confused: true,
    prompt: "What separates stage 4 from stage 5?",
    options: [
      "Stage 4 is about them; stage 5 is about us",
      "Stage 4 is calm; stage 5 is emotional",
      "Stage 4 judges; stage 5 compares",
      "There's no real difference",
    ], answer: 0,
    why: "Stage 4 finds the reason in the other person. Stage 5 adds a mirror: what we notice in them says as much about our own inner world as about theirs.",
  },
  {
    id: "u1-04", unit: 1, framework: "foundations",
    prompt: "Someone at the next table treats a ten-minute wait for coffee as a full crisis. What does the reaction mainly tell us?",
    options: [
      "The service really is terrible",
      "Something about their inner state: often control, anxiety, or insecurity",
      "They are at stage 5",
      "Nothing; reactions are random",
    ], answer: 1,
    why: "Perception is a prediction built from our past, so an outsized reaction is information about the person, not the event. The reaction is the data.",
  },
  {
    id: "u1-05", unit: 1, framework: "foundations",
    prompt: "An adult echoes whatever opinion was voiced last, agrees before we finish the sentence, and apologizes constantly. Which wound?",
    options: WOUNDS, answer: 0,
    why: "These are the signs of the social wound: a loss of acceptance, often from being excluded, bullied, or always the new kid. Agreement is how they stay inside the group.",
  },
  {
    id: "u1-06", unit: 1, framework: "foundations",
    prompt: "A manager bristles at any feedback from above, pushes back on rules, and has to be the one in charge. Which wound?",
    options: WOUNDS, answer: 1,
    why: "That's the authority wound, a loss of control. It forms when a child is either micromanaged or left with no structure at all.",
  },
  {
    id: "u1-07", unit: 1, framework: "foundations",
    prompt: "A friend plans for the worst case every time, avoids anything new, and gets visibly stressed when a routine is disrupted. Which wound?",
    options: WOUNDS, answer: 3,
    why: "The security wound comes from lost safety and stability: an unstable home, money trouble, frequent moves. It helps to let them predict what's coming.",
  },
  {
    id: "u1-08", unit: 1, framework: "foundations",
    prompt: "A colleague brings up her awards unprompted and is flattened by one small criticism. As a child she was praised only for her grades. Which wound?",
    options: WOUNDS, answer: 4,
    why: "The validation wound is a loss of recognition. When love arrived only with performance, the adult keeps performing, and criticism feels like the love being withdrawn.",
  },
  {
    id: "u1-09", unit: 1, framework: "foundations", confused: true,
    prompt: "What's the difference between the emotional wound and the trust wound?",
    options: [
      "Emotional says “don't hurt me”; trust says “don't lie to me”",
      "Emotional says “don't lie to me”; trust says “don't hurt me”",
      "They are two names for the same wound",
      "Emotional is about money; trust is about family",
    ], answer: 0,
    why: "The emotional wound comes from abandonment or betrayal, and guards against being hurt. The trust wound comes from caregivers who lied or broke promises, and guards against deception. Trust is the hardest to unwind.",
  },
  {
    id: "u1-10", unit: 1, framework: "foundations",
    prompt: "A person carries three wounds at once. Where do we start?",
    options: [
      "With the oldest one",
      "With all three together",
      "With the one driving the behavior we most want to change",
      "With whichever is easiest to talk about",
    ], answer: 2,
    why: "We triage like an emergency room. The aim isn't to erase a wound but to turn it into a scar, and we begin where the behavior matters most.",
  },
  {
    id: "u1-11", unit: 1, framework: "foundations",
    prompt: "We had the right words for a hard conversation, but our voice shook and we rushed. Which side of the Success Triangle leaked?",
    options: SIDES, answer: 0,
    why: "Right words, delivered the wrong way, is a self-mastery leak. Tone, timing, and emotional control all live on that side.",
  },
  {
    id: "u1-12", unit: 1, framework: "foundations",
    prompt: "We walked a client through twenty slides of data. She wanted to feel understood. Which side leaked?",
    options: SIDES, answer: 1,
    why: "Data to someone who needed feeling is a communication leak: the right thing, to the wrong person, at the wrong time. (If we never noticed what she wanted, observation leaked first.)",
  },
  {
    id: "u1-13", unit: 1, framework: "foundations",
    prompt: "A buyer was ready to say yes ten minutes ago. We kept pitching and talked him out of it. Which side leaked?",
    options: SIDES, answer: 2,
    why: "Missing the moment someone is ready to decide is an observation leak. The information was in front of us and we didn't decode it.",
  },
  {
    id: "u1-14", unit: 1, framework: "foundations",
    prompt: "Someone over-explains every detail to clients, as if covering every possible question. Which side of the Childhood Development Triangle is driving it?",
    options: CHILD, answer: 1,
    why: "Safety. If everything is covered, nothing can go wrong. Over-explaining is a way of controlling the outcome so there are no surprises.",
  },
  {
    id: "u1-15", unit: 1, framework: "foundations",
    prompt: "A colleague cracks jokes whenever a meeting turns serious. Which side of the Childhood Development Triangle?",
    options: CHILD, answer: 0,
    why: "Friends. At some point the laugh is what earned a place in the group, and the strategy is still running.",
  },
  {
    id: "u1-16", unit: 1, framework: "foundations",
    prompt: "Which pairing of shortfall and adult strategy is correct?",
    options: [
      "Rewards → approval seekers, performers, status chasers",
      "Safety → people pleasers, chameleons",
      "Friends → hyper-controllers, avoiders",
      "Rewards → chronic apologizers",
    ], answer: 0,
    why: "A rewards shortfall produces people still working for praise. People pleasers and chameleons come from the friends side; controllers, avoiders, and chronic apologizers from the safety side.",
  },
  {
    id: "u1-17", unit: 1, framework: "foundations",
    prompt: "Which is the correct order of the four laws of human behavior?",
    options: [
      "Suffering and insecure → wears a mask → pretends not to → product of childhood",
      "Wears a mask → suffering → product of childhood → pretends not to",
      "Product of childhood → wears a mask → suffering → pretends not to",
      "Pretends not to → wears a mask → suffering → product of childhood",
    ], answer: 0,
    why: "Everyone is suffering and insecure; everyone wears a mask; everyone pretends not to; everyone is a product of childhood suffering and reward.",
  },
  {
    id: "u1-18", unit: 1, framework: "foundations",
    prompt: "Why does judging someone cost us our influence with them?",
    options: [
      "Judgment takes too much time",
      "They sense it, the mask tightens, and they stop showing us anything real",
      "Judgment is always factually wrong",
      "It doesn't; a firm judgment increases influence",
    ], answer: 1,
    why: "A mask exists to protect against judgment. When we judge, we confirm the threat, so the person hides more. People don't want to be fixed; they want to be seen without judgment.",
  },
  {
    id: "u1-19", unit: 1, framework: "foundations",
    prompt: "A pitch full of statistics falls flat with someone who mainly wants their hardship believed. Why?",
    options: [
      "The statistics must have been wrong",
      "The right message went to the wrong kind of person",
      "They weren't intelligent enough to follow it",
      "Pitches never work",
    ], answer: 1,
    why: "Words deliver social reward only when they match the listener's need. Numbers weren't the reward this person was after; empathy was.",
  },
  {
    id: "u1-20", unit: 1, framework: "foundations",
    prompt: "What's the common mistake people make when choosing how to compliment or persuade someone?",
    options: [
      "They speak from their own need instead of the listener's",
      "They use too few words",
      "They compliment too rarely",
      "They wait too long to start talking",
    ], answer: 0,
    why: "We tend to give what we'd like to get. Someone who wants to feel smart assumes everyone does. The formula is the reverse: read the need, match the language, deliver the reward.",
  },
];
