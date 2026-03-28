/**
 * Normalize a string for fuzzy speech matching.
 * Strips apostrophes, lowercases, and expands common contractions
 * so that typed "gonna" matches spoken "going to", etc.
 */
export function normalizeSpeech(text: string): string {
  return text
    .toLowerCase()
    // remove apostrophes so "i'm" → "im", "don't" → "dont"
    .replace(/'/g, "")
    .replace(/'/g, "")
    // expand contractions / informal speech → formal (spoken form)
    .replace(/\bgonna\b/g, "going to")
    .replace(/\bwanna\b/g, "want to")
    .replace(/\bgotta\b/g, "got to")
    .replace(/\bkinda\b/g, "kind of")
    .replace(/\bsorta\b/g, "sort of")
    .replace(/\bdunno\b/g, "dont know")
    .replace(/\byeah\b/g, "yes")
    .replace(/\bnah\b/g, "no")
    // collapse extra whitespace
    .replace(/\s+/g, " ")
    .trim();
}
