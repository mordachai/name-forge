/**
 * A small order-2 (bigram) character Markov chain, trained at runtime from
 * a list of real names. Produces new, plausible-sounding names in the same
 * style as the training list without ever repeating an existing entry
 * verbatim (in the overwhelming majority of cases - a short output that
 * exactly matches an input name is possible but rare).
 */

const ORDER = 2;
const START = "".repeat(ORDER);
const END = "";
const MAX_LENGTH = 14;

/**
 * @param {string[]} names  Training corpus (real names, properly capitalized).
 * @returns {{transitions: Map<string, string[]>}}
 */
export function trainMarkov(names) {
  const transitions = new Map();
  for (const name of names) {
    const padded = START + name + END;
    for (let i = ORDER; i < padded.length; i++) {
      const key = padded.slice(i - ORDER, i);
      const next = padded[i];
      if (!transitions.has(key)) transitions.set(key, []);
      transitions.get(key).push(next);
    }
  }
  return { transitions };
}

/**
 * @param {{transitions: Map<string, string[]>}} model
 * @returns {string} A newly generated name, or "" if the model is empty.
 */
export function generateMarkovName(model) {
  let result = "";
  let key = START;
  for (let i = 0; i < MAX_LENGTH; i++) {
    const options = model.transitions.get(key);
    if (!options || !options.length) break;
    const next = options[Math.floor(Math.random() * options.length)];
    if (next === END) break;
    result += next;
    key = (key + next).slice(-ORDER);
  }
  return result;
}

/**
 * Generates a name of at least 3 characters, retrying a bounded number of
 * times since very short outputs occasionally occur near the start/end of
 * the chain.
 * @param {{transitions: Map<string, string[]>}} model
 * @param {string} fallback  Used if the model somehow never produces a usable name.
 */
export function generateMarkovNameSafe(model, fallback) {
  for (let attempt = 0; attempt < 10; attempt++) {
    const name = generateMarkovName(model);
    if (name.length >= 3) return name;
  }
  return fallback;
}
