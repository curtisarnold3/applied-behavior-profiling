import type { QuizItem } from "./types";

const V = ["Connection", "Information", "Recognition", "Experiences", "Freedom", "Growth"];

export const unit4: QuizItem[] = [
  {
    id: "u4-01", unit: 4, framework: "values",
    prompt: "“Ultimately, I just want to know what I'm getting into. I hate walking in blind.” Which value?",
    options: V, answer: 1,
    why: "For this person, knowledge equals safety. Wanting to understand before stepping in is the information value.",
  },
  {
    id: "u4-02", unit: 4, framework: "values",
    prompt: "“I don't want a perfect life. I want a full one.” Which value?",
    options: V, answer: 3,
    why: "A life that's felt, with richness and story, is the experiences value. The fear underneath is feeling numb.",
  },
  {
    id: "u4-03", unit: 4, framework: "values",
    prompt: "“I'm not being difficult. I just don't want to feel boxed in.” Which value?",
    options: V, answer: 4,
    why: "Protecting options and autonomy is the freedom value. It often grows from being heavily controlled early on.",
  },
  {
    id: "u4-04", unit: 4, framework: "values",
    prompt: "“I don't need it to be easy. I need to know I'm not stuck.” Which value?",
    options: V, answer: 5,
    why: "Becoming more, and the dread of standing still, is the growth value.",
  },
  {
    id: "u4-05", unit: 4, framework: "values",
    prompt: "“I don't need praise. I just want to know it mattered.” Which value?",
    options: V, answer: 2,
    why: "Wanting effort to register and count is recognition. Note that they explicitly don't want applause; they want to know it left a mark.",
  },
  {
    id: "u4-06", unit: 4, framework: "values",
    prompt: "A friend asks, “No, how are you really doing?” and waits for the true answer. Which value is most likely?",
    options: V, answer: 0,
    why: "Wanting real closeness, and making sure others feel cared for, is the connection value.",
  },
  {
    id: "u4-07", unit: 4, framework: "values",
    prompt: "Where do values usually come from?",
    options: [
      "From what a person had plenty of growing up",
      "From what felt missing in their formative years",
      "From their job",
      "They are random",
    ], answer: 1,
    why: "Values are usually built from deficit, not abundance. The child who felt trapped fights for freedom; the one who never got straight answers lives for information.",
  },
  {
    id: "u4-08", unit: 4, framework: "values", confused: true,
    prompt: "Marcus keeps telling us he outperforms everyone in his region. Imani quietly wants someone to notice the three late nights she put in. Who is showing the recognition value?",
    options: ["Marcus", "Imani", "Both", "Neither"], answer: 1,
    why: "Imani wants her effort seen and to have mattered: recognition, a value. Marcus wants to be seen as exceptional right now: significance, a need. Rank versus worth.",
  },
  {
    id: "u4-09", unit: 4, framework: "values", confused: true,
    prompt: "How do we tell the significance need from the recognition value?",
    options: [
      "Significance is about being seen as exceptional now; recognition is the end goal of being seen and having it matter",
      "Significance is a value; recognition is a need",
      "They are the same thing under two names",
      "Significance is about money; recognition is about fame",
    ], answer: 0,
    why: "A need is a means and a value is an end goal. Calling someone “the best” would satisfy significance. Recognition wants acknowledgment that the effort counted.",
  },
  {
    id: "u4-10", unit: 4, framework: "values", confused: true,
    prompt: "We tell a team member, “You're one of our top performers.” She thanks us and asks what's next. Which value did we miss, and what should we have spoken to?",
    options: [
      "Growth: speak to her trajectory, not her status",
      "Recognition: speak to her impact",
      "Freedom: give her more options",
      "Connection: spend more time with her",
    ], answer: 0,
    why: "A status statement is a full stop to a growth person. They want to hear what they're becoming and what stretches them next. Recognition, by contrast, looks back at impact already made.",
  },
  {
    id: "u4-11", unit: 4, framework: "values",
    prompt: "When does a person with the freedom value say yes most easily?",
    options: [
      "When they are given a firm deadline",
      "When “no” is clearly allowed",
      "When everyone else has already agreed",
      "When the plan is fully scheduled",
    ], answer: 1,
    why: "An open exit removes the feeling of being cornered. When no is safe, yes stops feeling like a trap.",
  },
  {
    id: "u4-12", unit: 4, framework: "values",
    prompt: "What's the best way to move someone with the information value?",
    options: [
      "Tell them to trust us",
      "Create urgency so they can't overthink",
      "Walk them through exactly how it works, then let them come to us",
      "Keep the details vague to avoid overwhelming them",
    ], answer: 2,
    why: "Precision gives them mental security. Pushing or withholding reads as hiding something, so we inform fully and step back.",
  },
  {
    id: "u4-13", unit: 4, framework: "integration",
    prompt: "Complete it: adjectives reveal ___, justifications reveal ___, repetitions reveal ___.",
    options: [
      "values; decision pillars; needs",
      "needs; values; decision pillars",
      "decision pillars; needs; values",
      "values; needs; decision pillars",
    ], answer: 0,
    why: "What someone admires points to their value. What they explain or defend shows how they decide. What they keep trying to get shows the need.",
  },
  {
    id: "u4-14", unit: 4, framework: "integration",
    prompt: "Which is the correct shape of the profile sentence?",
    options: [
      "If I [decision], then people will [need], so I can finally [value]",
      "If I [need], then people will [value], so I can finally [decision]",
      "If I [value], then people will [decision], so I can finally [need]",
      "If people [need], then I will [decision], so they can [value]",
    ], answer: 0,
    why: "The decision is the strategy, the need is what the strategy is meant to get from people, and the value is what it's all finally for.",
  },
  {
    id: "u4-15", unit: 4, framework: "integration",
    prompt: "“Everyone leans on me, and that's fine. I do sometimes wonder who'd check on me.” Which profile sentence fits best?",
    options: [
      "If I stay strong for everyone, then people will keep me close, so I can finally feel connected",
      "If I break the rules, then people will admire me, so I can finally feel free",
      "If I keep learning, then people will think I'm smart, so I can finally grow",
      "If I follow the process, then people will approve, so I can finally feel prepared",
    ], answer: 0,
    why: "She does it because it has to be done (necessity), being useful keeps her valued (significance), and what she's reaching for is closeness (connection).",
  },
  {
    id: "u4-16", unit: 4, framework: "integration", confused: true,
    prompt: "A man acts tough and self-sufficient, but ends most statements with “that okay with everyone?” What's the better read than strength?",
    options: ["Approval", "Significance", "Intelligence", "Pity"], answer: 0,
    why: "Strength doesn't check for a verdict. Asking whether he did all right is approval, wearing strength's jacket. The tell is in why he felt the need to ask.",
  },
  {
    id: "u4-17", unit: 4, framework: "integration", confused: true,
    prompt: "“I don't need people. I'm better off on my own.” Said by someone who was repeatedly left out. What might detachment really be here?",
    options: ["Acceptance", "Strength", "Freedom", "Intelligence"], answer: 0,
    why: "Leaving first is safer than being left out. Detachment can be the acceptance need with its fear of rejection turned outward.",
  },
  {
    id: "u4-18", unit: 4, framework: "integration",
    prompt: "Our matching language doesn't land: no softening, a slight pulling back. What should we do?",
    options: [
      "Repeat it more firmly",
      "Go back to their actual words and try the neighboring read",
      "Tell them our profile so they can confirm it",
      "Give up on profiling this person",
    ], answer: 1,
    why: "A read is a hypothesis. Misses usually land one category over, so we return to the evidence and test the closest alternative instead of pushing harder.",
  },
  {
    id: "u4-19", unit: 4, framework: "integration",
    prompt: "Positive association has three steps. Which is correct?",
    options: [
      "Name a trait they admire, name the behavior we want, link the two",
      "Praise them, criticize them, praise them again",
      "State the problem, give the data, ask for agreement",
      "Mirror their posture, match their tone, make the ask",
    ], answer: 0,
    why: "For a self-reliant strength profile, we might link openness to the elite leaders he admires, so openness becomes a mark of strength.",
  },
  {
    id: "u4-20", unit: 4, framework: "integration",
    prompt: "What separates using these tools well from manipulation?",
    options: [
      "Using fewer of them",
      "Empathy: saying what's true, for the other person's good",
      "Never telling anyone we took the course",
      "Only using them at work",
    ], answer: 1,
    why: "The technique is the same either way; the aim is what differs. If we'd be uncomfortable with the person knowing exactly what we were doing and why, that's our answer.",
  },
];
