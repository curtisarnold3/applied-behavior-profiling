import { needs, pillars, values, stages, wounds } from "./frameworks";
import type { Framework } from "./quizzes/types";

export type Card = { front: string; back: string };
export type Deck = { id: string; title: string; framework: Framework; blurb: string; cards: Card[] };

const needCards: Card[] = needs.flatMap((n) => [
  { front: `Which need? ${n.hear}`, back: `${n.name}. They crave: ${n.craves.toLowerCase()}.` },
  { front: `${n.name}: what's the hidden fear?`, back: n.fear },
  { front: `${n.name}: what language lands?`, back: `${n.language}. For example: ${n.say}` },
]);

const pillarCards: Card[] = pillars.flatMap((p) => [
  { front: `Which pillar? ${p.hear}`, back: `${p.name}. They decide ${p.decides.charAt(0).toLowerCase()}${p.decides.slice(1)}.` },
  { front: `${p.name}: how do we frame a proposal?`, back: p.frame },
  { front: `${p.name}: what should we avoid?`, back: p.avoid },
]);

const valueCards: Card[] = values.flatMap((v) => [
  { front: `Which value? ${v.hear}`, back: `${v.name}. End goal: ${v.goal.toLowerCase()}.` },
  { front: `${v.name}: what do we notice?`, back: v.notice },
  { front: `${v.name}: how do we move them?`, back: v.move },
]);

const woundCards: Card[] = wounds.flatMap((w) => [
  { front: `Which wound? ${w.signs}`, back: `${w.name} wound: ${w.loss.toLowerCase()}.` },
  { front: `${w.name} wound: how does it form?`, back: w.forms },
]);

const stageCards: Card[] = stages.flatMap((s) => [
  { front: `Stage ${s.n}: we see other people as...?`, back: `${s.sees}. (${s.name})` },
  { front: `Which stage? ${s.sign}`, back: `Stage ${s.n}: ${s.name}. Others look like ${s.sees.toLowerCase()}.` },
]);

export const decks: Deck[] = [
  { id: "needs", title: "The six needs", framework: "needs", blurb: "Phrase to need, fear, and the language that lands.", cards: needCards },
  { id: "pillars", title: "The six decision pillars", framework: "pillars", blurb: "Justification to pillar, framing, and what to avoid.", cards: pillarCards },
  { id: "values", title: "The six values", framework: "values", blurb: "End goals, tells, and how to move each one.", cards: valueCards },
  { id: "wounds", title: "The six wound types", framework: "foundations", blurb: "Adult signs back to the loss behind them.", cards: woundCards },
  { id: "stages", title: "The five stages", framework: "foundations", blurb: "How we see others at each stage of perception.", cards: stageCards },
];

export const deckById = (id: string) => decks.find((d) => d.id === id);
