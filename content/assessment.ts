/**
 * The Week 8 reflection tool. It uses the five trait names and five habit
 * areas of the source model; every level description and prompt below is
 * original to this course.
 *
 * NOTE: `SOURCE_CREDIT` is the single place on the site (outside the Credits
 * page) where the inventory is named. Don't repeat the title elsewhere.
 */
export const SOURCE_CREDIT = {
  before: "This reflection tool is built on the five traits and five habit areas of ",
  title: "The Hughes Authority Behavior Inventory",
  after:
    ". The level descriptions and prompts on this page were written for this course and are not the inventory's own items.",
};

export const LEVEL_NAMES = ["Struggling", "Developing", "Steady", "Strong", "Contagious"] as const;

export type Scale = { id: string; name: string; prompt: string; levels: [string, string, string, string, string] };

export const traits: Scale[] = [
  {
    id: "confidence", name: "Confidence",
    prompt: "Think about the last month of conversations, compliments, and criticism.",
    levels: [
      "I stay quiet in most rooms and assume other people know better.",
      "I'm fine with familiar people. New rooms and direct praise still make me shrink.",
      "I speak up most of the time, though criticism can sting for days.",
      "I'm comfortable with most people. I hear criticism, weigh it, and move on.",
      "I say what I think plainly and stay curious when I'm challenged. My steadiness makes it easier for others to speak.",
    ],
  },
  {
    id: "discipline", name: "Discipline",
    prompt: "Look at what you planned over the last month against what actually happened.",
    levels: [
      "I run on bursts of motivation, and most of what I start is left half done.",
      "I start well and fade. Routines last days, not months.",
      "The important things get done, usually close to the deadline.",
      "I plan the week and mostly keep to it, even when I'd rather not.",
      "What I decide in the morning is done by evening, whatever my mood. People near me start keeping their own word more.",
    ],
  },
  {
    id: "leadership", name: "Leadership",
    prompt: "Recall the last thing that went wrong on a team you were part of, and the last thing that went right.",
    levels: [
      "I look after my own position first, and people rarely come to me for direction.",
      "I mean well, but under pressure I still protect myself first.",
      "I own my mistakes and share credit when I remember to.",
      "I give credit away by habit and tell people the truth kindly.",
      "People do their best work around me and get the recognition for it. I say hard things with care, and others begin to lead that way too.",
    ],
  },
  {
    id: "gratitude", name: "Gratitude",
    prompt: "Notice where your attention went first in the last few situations you walked into.",
    levels: [
      "I mostly notice what's missing, and I can't remember when I last thanked someone.",
      "I feel thankful sometimes but rarely say it out loud.",
      "I say thanks when it's obvious. The small things go unnoticed.",
      "I notice small things and tell people, most days.",
      "I thank people by name for particular things, most days, and the habit spreads to whoever I'm with.",
    ],
  },
  {
    id: "enjoyment", name: "Enjoyment",
    prompt: "Think about your baseline mood on an ordinary weekday.",
    levels: [
      "Most days feel like something to get through, and I rarely feel at ease.",
      "I can relax, but only when everything is going right.",
      "I'm generally content. Setbacks knock me off course for a while.",
      "I'm calm most days, and other people's moods don't easily become mine.",
      "I'm at ease in most situations, tense ones included, and people tend to settle when I arrive.",
    ],
  },
];

export const habits: Scale[] = [
  {
    id: "environment", name: "Environment",
    prompt: "Look at the spaces you live and work in right now.",
    levels: [
      "Cluttered and neglected. I avoid having people over.",
      "Tidy in bursts, then it slides again.",
      "Presentable. The hidden corners are another story.",
      "Clean and organized most of the time.",
      "Ordered and cared for as routine. My space supports the life I want.",
    ],
  },
  {
    id: "time", name: "Time",
    prompt: "Think about the last month of appointments and promises.",
    levels: [
      "I'm often late, and I lose track of what I've promised.",
      "On time for the big things. Small promises slip.",
      "Usually on time, but my days run me more than I run them.",
      "I plan my days and keep nearly all my commitments.",
      "My calendar matches my priorities, and people can rely on my word without checking.",
    ],
  },
  {
    id: "appearance", name: "Appearance",
    prompt: "Consider how you look after and present yourself day to day.",
    levels: [
      "I put in little care, and it shows.",
      "I make an effort for occasions only.",
      "Acceptable most days, without much thought.",
      "Deliberate and well kept nearly every day.",
      "Consistently looked after, in a way that fits who I am and where I'm headed.",
    ],
  },
  {
    id: "social", name: "Social",
    prompt: "Think about the company you keep and how you show up in it.",
    levels: [
      "Isolated, or surrounded by people who pull me down.",
      "A few good people, but I rarely reach out.",
      "A decent circle. I'm more a guest than a contributor.",
      "I invest in good relationships and keep in touch on purpose.",
      "A strong circle that I actively build, where people leave better than they came.",
    ],
  },
  {
    id: "financial", name: "Financial",
    prompt: "Look at how money has moved over the last three months.",
    levels: [
      "I avoid looking. Money is a regular source of alarm.",
      "I know roughly where I stand, with no plan.",
      "Bills are paid. Saving happens when there's something left.",
      "I follow a budget and save on a schedule.",
      "Money is planned, tracked, and working toward clear goals.",
    ],
  },
];

export type Rated = { scale: Scale; level: number };

/** The lowest-rated scale(s). Ties are all returned, in order. */
export function lowest(scales: Scale[], ratings: Partial<Record<string, number>>): Rated[] {
  const rated = scales.flatMap((scale) => {
    const level = ratings[scale.id];
    return typeof level === "number" ? [{ scale, level }] : [];
  });
  if (rated.length === 0) return [];
  const min = Math.min(...rated.map((r) => r.level));
  return rated.filter((r) => r.level === min);
}

/** The goal sits one level above the current rating (level 5 keeps itself). */
export function nextLevelGoal(r: Rated): { level: number; text: string } {
  const level = Math.min(5, r.level + 1);
  return { level, text: r.scale.levels[level - 1]! };
}
