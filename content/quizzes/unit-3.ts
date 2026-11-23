import type { QuizItem } from "./types";

const P = ["Deviance", "Novelty", "Social", "Conformity", "Investment", "Necessity"];

export const unit3: QuizItem[] = [
  {
    id: "u3-01", unit: 3, framework: "pillars",
    prompt: "“They told me nobody opens a shop on that street. So that's exactly where I opened it.” Which pillar?",
    options: P, answer: 0,
    why: "The choice is justified by going against what was expected, and there's pride in it. That's deviance: deciding by breaking the pattern.",
  },
  {
    id: "u3-02", unit: 3, framework: "pillars",
    prompt: "“I picked it because I'd never tried anything like it. I get bored doing the same thing twice.” Which pillar?",
    options: P, answer: 1,
    why: "The justification is newness and escape from repetition. Other people don't figure in it at all. That's novelty.",
  },
  {
    id: "u3-03", unit: 3, framework: "pillars",
    prompt: "“Before we book anything, I want to check that Priya and the kids are comfortable with the dates.” Which pillar?",
    options: P, answer: 2,
    why: "The decision is weighed by its effect on specific, named people in a small circle. That's the social pillar.",
  },
  {
    id: "u3-04", unit: 3, framework: "pillars",
    prompt: "“Technically we're supposed to get three quotes first. That's the proper process.” Which pillar?",
    options: P, answer: 3,
    why: "Rules, process, and what's proper are doing the justifying. That's conformity.",
  },
  {
    id: "u3-05", unit: 3, framework: "pillars",
    prompt: "“I've put four years into this degree. I can't walk away now.” Which pillar?",
    options: P, answer: 4,
    why: "The reason to continue is what's already been spent. Past-tense effort is the signature of the investment pillar.",
  },
  {
    id: "u3-06", unit: 3, framework: "pillars",
    prompt: "“Skip the background. What's the bottom line, and when does it have to happen?” Which pillar?",
    options: P, answer: 5,
    why: "Urgency and what's actually required are the test. That's necessity.",
  },
  {
    id: "u3-07", unit: 3, framework: "pillars", confused: true,
    prompt: "Two people both refuse the bestselling phone. Alex: “Everybody has that one.” Blake: “I had that last year. What's new?” Who is using deviance?",
    options: ["Alex", "Blake", "Both", "Neither"], answer: 0,
    why: "Alex compares to the crowd: it's what everyone has. That's deviance. Blake compares to the past: it's not new to me. That's novelty.",
  },
  {
    id: "u3-08", unit: 3, framework: "pillars", confused: true,
    prompt: "We mention that a restaurant has become the most popular place in town. How do a novelty decider and a deviance decider tend to react?",
    options: [
      "Novelty leans in; deviance leans out",
      "Novelty leans out; deviance leans in",
      "Both lean in",
      "Both lean out",
    ], answer: 0,
    why: "Novelty wants what's new, and a trending place is new. Deviance wants different from the crowd, so popularity is a reason to go elsewhere.",
  },
  {
    id: "u3-09", unit: 3, framework: "pillars", confused: true,
    prompt: "“I don't want to upset Karen and Luis.” versus “That's just not how it's done.” Which is the social pillar?",
    options: ["The first: it names specific people", "The second: it refers to everyone", "Both are social", "Both are conformity"], answer: 0,
    why: "Listen for names versus norms. Social protects a small circle of particular people. Conformity follows the larger culture and its rules.",
  },
  {
    id: "u3-10", unit: 3, framework: "pillars", confused: true,
    prompt: "A manager breaks a company rule to protect someone on her team. Which pillar is more likely driving her?",
    options: ["Social", "Conformity", "Necessity", "Investment"], answer: 0,
    why: "A conformity decider would follow the rule. Bending it for a particular person shows the small circle outranks the wider norm, which is the social pillar.",
  },
  {
    id: "u3-11", unit: 3, framework: "pillars",
    prompt: "Which pillar tends to freeze when handed too many options?",
    options: P, answer: 5,
    why: "Necessity decides by what's required. Five options means none has been shown to be necessary, so none gets picked. Offer one clear recommendation.",
  },
  {
    id: "u3-12", unit: 3, framework: "pillars",
    prompt: "Which phrase should we avoid with an investment decider?",
    options: [
      "“You've already done the hard part.”",
      "“Let's scrap it and start over.”",
      "“This protects what you've built.”",
      "“You're someone who finishes.”",
    ], answer: 1,
    why: "“Start over” wipes the ledger and treats past effort as wasted. Investment deciders say yes when the new step pays off what they've already put in.",
  },
  {
    id: "u3-13", unit: 3, framework: "pillars",
    prompt: "Which rewrite of “please adopt the new process” best fits an investment decider?",
    options: [
      "“Nobody else has tried this yet.”",
      "“It's the industry standard.”",
      "“It builds on the system you spent two years setting up, and finally gets you the payoff.”",
      "“We need it done by Friday.”",
    ], answer: 2,
    why: "It honors what's been put in and frames the change as the return on that effort. The others are pitched at novelty, conformity, and necessity.",
  },
  {
    id: "u3-14", unit: 3, framework: "pillars",
    prompt: "Which rewrite of “please review my report” best fits a necessity decider?",
    options: [
      "“It'd mean a lot to the whole team.”",
      "“It goes to the client Friday. I need section two checked by Thursday or it ships unreviewed.”",
      "“It's a really unusual format you might enjoy.”",
      "“It's what reviewers normally do at this stage.”",
    ], answer: 1,
    why: "A deadline, one specific ask, and the consequence of waiting. No fluff. That's the frame necessity responds to.",
  },
  {
    id: "u3-15", unit: 3, framework: "pillars",
    prompt: "Where do decision pillars show up most clearly in conversation?",
    options: ["In adjectives about people they admire", "In justifications for their choices", "In what they keep repeating", "In their clothing"], answer: 1,
    why: "When someone explains or defends a choice, especially a recurring one, we're hearing the filter they decide with. Adjectives point to values; repetitions point to needs.",
  },
  {
    id: "u3-16", unit: 3, framework: "pillars",
    prompt: "We read someone's need correctly and speak to it well, but frame our proposal through the wrong pillar. What usually happens?",
    options: [
      "They agree, because the need was met",
      "Resistance, confusion, or a polite no",
      "Nothing; pillars only matter for big decisions",
      "They change pillars to match ours",
    ], answer: 1,
    why: "Needs are the fuel; pillars are the GPS. A person can feel understood and still turn down an idea that doesn't fit how they decide.",
  },
  {
    id: "u3-17", unit: 3, framework: "pillars",
    prompt: "Very high conformity often comes paired with a strong streak of private deviance. What do we do with that knowledge?",
    options: [
      "Mention it to build rapport",
      "Test for it with pointed questions",
      "Know it, and never raise it",
      "Assume it's false",
    ], answer: 2,
    why: "It's useful for our own understanding, since pressure looks for a release. Pointing at someone's private side breaks trust at once and is the kind of judgment that ends our ability to help.",
  },
  {
    id: "u3-18", unit: 3, framework: "pillars", confused: true,
    prompt: "Both of these people refuse to replace an old laptop. Gina: “I've had it through three jobs.” Hal: “It still turns on.” Which pillar is Hal using?",
    options: ["Investment", "Necessity", "Conformity", "Deviance"], answer: 1,
    why: "Hal has no attachment; nothing has made a change required. That's necessity. Gina is protecting what she's put in, which is investment.",
  },
];
