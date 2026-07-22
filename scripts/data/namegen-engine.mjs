/**
 * Fantasy name pattern-compiler engine.
 *
 * Ported to an ES module from skeeto/fantasyname (public domain / Unlicense),
 * itself modeled on the RinkWorks Fantasy Name Generator (rinkworks.com/namegen).
 * Original source: https://github.com/skeeto/fantasyname/blob/master/js/namegen.js
 *
 * ## Pattern syntax
 *   s - generic syllable      v - vowel             V - vowel or vowel cluster
 *   c - consonant             B - consonant cluster suited to start a word
 *   C - consonant or consonant cluster (anywhere)
 *   Text in ( ) is emitted literally, e.g. "s(dim)" -> syllable + "dim".
 *   Text in < > applies the symbol table to a sub-pattern as a single unit.
 *   | inside a group denotes a random choice: "(foo|bar)" -> "foo" or "bar".
 *   ! capitalizes the next component; ~ reverses it.
 *
 * @example
 *   compile("sV'i").toString();  // => "entheu'loaf"
 */

const SYMBOLS = {
  s: ["ach", "ack", "ad", "age", "ald", "ale", "an", "ang", "ar", "ard",
    "as", "ash", "at", "ath", "augh", "aw", "ban", "bel", "bur", "cer",
    "cha", "che", "dan", "dar", "del", "den", "dra", "dyn", "ech", "eld",
    "elm", "em", "en", "end", "eng", "enth", "er", "ess", "est", "et",
    "gar", "gha", "hat", "hin", "hon", "ia", "ight", "ild", "im", "ina",
    "ine", "ing", "ir", "is", "iss", "it", "kal", "kel", "kim", "kin",
    "ler", "lor", "lye", "mor", "mos", "nal", "ny", "nys", "old", "om",
    "on", "or", "orm", "os", "ough", "per", "pol", "qua", "que", "rad",
    "rak", "ran", "ray", "ril", "ris", "rod", "roth", "ryn", "sam",
    "say", "ser", "shy", "skel", "sul", "tai", "tan", "tas", "ther",
    "tia", "tin", "ton", "tor", "tur", "um", "und", "unt", "urn", "usk",
    "ust", "ver", "ves", "vor", "war", "wor", "yer"],
  v: ["a", "e", "i", "o", "u", "y"],
  V: ["a", "e", "i", "o", "u", "y", "ae", "ai", "au", "ay", "ea", "ee",
    "ei", "eu", "ey", "ia", "ie", "oe", "oi", "oo", "ou", "ui"],
  c: ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r",
    "s", "t", "v", "w", "x", "y", "z"],
  B: ["b", "bl", "br", "c", "ch", "chr", "cl", "cr", "d", "dr", "f", "g",
    "h", "j", "k", "l", "ll", "m", "n", "p", "ph", "qu", "r", "rh", "s",
    "sch", "sh", "sl", "sm", "sn", "st", "str", "sw", "t", "th", "thr",
    "tr", "v", "w", "wh", "y", "z", "zh"],
  C: ["b", "c", "ch", "ck", "d", "f", "g", "gh", "h", "k", "l", "ld", "ll",
    "lt", "m", "n", "nd", "nn", "nt", "p", "ph", "q", "r", "rd", "rr",
    "rt", "s", "sh", "ss", "st", "t", "th", "v", "w", "y", "z"]
};

function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function capitalize(str) {
  return str.replace(/^./, c => c.toUpperCase());
}

function reverseStr(str) {
  return str.split("").reverse().join("");
}

class RandomGen {
  constructor(generators) {
    this.sub = generators;
  }
  toString() {
    return this.sub.length ? String(this.sub[Math.floor(Math.random() * this.sub.length)]) : "";
  }
}

function makeRandom(generators) {
  if (generators.length === 0) return "";
  if (generators.length === 1) return generators[0];
  return new RandomGen(generators);
}

class SequenceGen {
  constructor(generators) {
    this.sub = generators;
  }
  toString() {
    return this.sub.map(String).join("");
  }
}

function compressLiterals(array) {
  const emit = [];
  let accum = [];
  const dump = () => {
    if (accum.length) {
      emit.push(accum.join(""));
      accum = [];
    }
  };
  for (const item of array) {
    if (typeof item === "string") accum.push(item);
    else { dump(); emit.push(item); }
  }
  dump();
  return emit;
}

function makeSequence(generators) {
  const compressed = compressLiterals(generators);
  if (compressed.length === 0) return "";
  if (compressed.length === 1) return compressed[0];
  return new SequenceGen(compressed);
}

function withTransform(f) {
  return class {
    constructor(generator) { this.generator = generator; }
    toString() { return f(String(this.generator)); }
  };
}
const Capitalizer = withTransform(capitalize);
const Reverser = withTransform(reverseStr);

class Group {
  constructor() {
    this.set = [[]];
    this.wrappers = [];
  }
  add(g) {
    while (this.wrappers.length > 0) {
      const Type = this.wrappers.pop();
      g = new Type(g);
    }
    this.set[this.set.length - 1].push(g);
    return this;
  }
  split() {
    this.set.push([]);
    return this;
  }
  wrap(type) {
    this.wrappers.push(type);
    return this;
  }
  emit() {
    return makeRandom(this.set.map(makeSequence));
  }
}

class LiteralGroup extends Group {}

class SymbolGroup extends Group {
  add(g, literal) {
    if (!literal) g = makeRandom(SYMBOLS[g] || [g]);
    return super.add(g);
  }
}

/**
 * Compiles a pattern string into a name generator object with a
 * `toString()` method that produces a new random name on each call.
 * @param {string} input
 * @returns {{toString: () => string}}
 */
export function compile(input) {
  const stack = [new SymbolGroup()];
  const top = () => stack[stack.length - 1];

  for (const c of input) {
    switch (c) {
      case "<":
        stack.push(new SymbolGroup());
        break;
      case "(":
        stack.push(new LiteralGroup());
        break;
      case ">":
      case ")": {
        if (stack.length === 1) throw new Error("Unbalanced brackets.");
        const finished = stack.pop().emit();
        top().add(finished, true);
        break;
      }
      case "|":
        top().split();
        break;
      case "!":
        if (top() instanceof SymbolGroup) top().wrap(Capitalizer);
        else top().add(c);
        break;
      case "~":
        if (top() instanceof SymbolGroup) top().wrap(Reverser);
        else top().add(c);
        break;
      default:
        top().add(c);
    }
  }
  if (stack.length !== 1) throw new Error("Missing closing bracket.");
  const result = top().emit();
  return typeof result === "string" ? { toString: () => result } : result;
}

/** Convenience: compile and immediately generate one name. */
export function generate(pattern) {
  return String(compile(pattern));
}
