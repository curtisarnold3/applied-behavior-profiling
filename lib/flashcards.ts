/** How many cards later an "again" card comes back. Short, so it repeats within the session. */
export const AGAIN_GAP = 3;

/**
 * Session queue for flashcards. "Know" retires the card; "again" re-inserts it
 * a few cards later so it's seen again before the session ends.
 */
export function answerCard(queue: number[], result: "know" | "again"): number[] {
  const [current, ...rest] = queue;
  if (current === undefined) return queue;
  if (result === "know") return rest;
  const at = Math.min(AGAIN_GAP, rest.length);
  return [...rest.slice(0, at), current, ...rest.slice(at)];
}
