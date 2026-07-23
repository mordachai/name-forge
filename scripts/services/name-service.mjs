import { getProfile, getCompoundProfile } from "../data/profiles.mjs";
import { isClean } from "../data/filter.mjs";

const MAX_ATTEMPTS_PER_NAME = 15;

/**
 * Generates `n` names for the given donjon-style type value, entirely
 * offline (namegen-engine patterns, Markov chains over real corpora, or
 * word-bank composers - see profiles.mjs). Retries on blocklisted output
 * and, where practical, avoids exact duplicates within one batch.
 *
 * @param {string} type
 * @param {number} n
 * @param {{compound?: boolean}} [options]  `compound: true` generates
 *   first-plus-surname names where `type` supports it (see
 *   getCompoundProfile); falls back to the normal profile otherwise.
 * @returns {string[]}
 */
export function generateNames(type, n, { compound = false } = {}) {
  const generate = (compound && getCompoundProfile(type)) || getProfile(type);
  const results = [];
  const seen = new Set();

  for (let i = 0; i < n; i++) {
    let name = "";
    for (let attempt = 0; attempt < MAX_ATTEMPTS_PER_NAME; attempt++) {
      const candidate = generate();
      if (!isClean(candidate)) continue;
      if (seen.has(candidate) && attempt < MAX_ATTEMPTS_PER_NAME - 1) continue;
      name = candidate;
      break;
    }
    if (name) {
      results.push(name);
      seen.add(name);
    }
  }
  return results;
}
