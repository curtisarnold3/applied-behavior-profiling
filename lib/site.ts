export const site = {
  name: "People Don't Want to Be Fixed... They Want to Be Seen & Not Judged",
  shortName: "Seen, Not Fixed",
  course: "Applied Behavior Profiling",
  author: "Curtis A. Arnold",
  description:
    "An 8-week field course in reading people from what they say: the need they're chasing, how they justify decisions, and what they value most.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://applied-behavior-profiling.vercel.app",
  ethics:
    "These skills are for understanding and helping people, never for manipulating them.",
} as const;
