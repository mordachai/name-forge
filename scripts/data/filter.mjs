/**
 * A generated name is built from fully random phoneme/consonant combinations,
 * so by pure chance it can occasionally coincide with a real slur or other
 * offensive word (e.g. a 3-letter planet name pattern). This is a small
 * safety net: block-list check with case-insensitive whole-word matching,
 * used by name-service.mjs to retry generation rather than surface a match.
 */

const BLOCKLIST = [
  "nigger", "nigga", "chink", "spic", "kike", "wetback", "gook", "coon",
  "beaner", "paki", "raghead", "tranny", "retard", "faggot", "fag", "dyke",
  "cunt", "whore", "slut", "rape", "nazi", "hitler", "jap"
];

const BLOCKLIST_RE = new RegExp(`\\b(${BLOCKLIST.join("|")})\\b`, "i");

/** @param {string} name */
export function isClean(name) {
  return !BLOCKLIST_RE.test(name);
}
