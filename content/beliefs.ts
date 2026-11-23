/** Original wording for the limiting-beliefs worksheet. */
export const beliefDomains = ["Money", "Relationships", "Health", "Work", "Self"] as const;

export const beliefStarters = [
  "When I watch someone ask for a raise without flinching, I assume they...",
  "When someone in the room outranks me, I...",
  "People who are good with money are usually...",
  "If I said what I actually wanted, the people close to me would...",
  "The reason I haven't done the thing I keep talking about is...",
  "Someone like me can't really...",
];

export const testQuestions = [
  { id: "exception", label: "Do I know an exception?", hint: "One real counter-example is enough to show it isn't a law." },
  { id: "helping", label: "Is this belief helping or limiting my life?", hint: "Not “is it true?” but “what is it doing for me?”" },
  { id: "inCharge", label: "Does it put me in charge?", hint: "Or does it hand the wheel to other people, luck, or the past?" },
  { id: "coach", label: "What would a good coach tell me?", hint: "Someone experienced, kind, and unimpressed by excuses." },
] as const;
