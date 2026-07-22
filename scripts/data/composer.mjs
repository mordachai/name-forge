/**
 * Word-bank composers for "thing" names (kingdoms, inns, ships, weapons,
 * deities, technology, designations, ...) that read better as short
 * English phrases than as raw phonemes. Word banks below are hand-picked
 * for this module, not derived from any external dataset.
 */
import { compile } from "./namegen-engine.mjs";

const GRIM_ADJ = [
  "Iron", "Shadow", "Golden", "Silver", "Whisper", "Ember", "Frost", "Storm",
  "Blood", "Grim", "Silent", "Broken", "Wild", "Ancient", "Sable", "Crimson",
  "Moon", "Sun", "Thorn", "Raven", "Black", "White", "Grey", "Deep", "High"
];
const GEO_NOUN = [
  "hold", "watch", "haven", "reach", "gate", "spire", "ford", "moor",
  "mere", "vale", "crest", "fell", "wick", "burrow", "hollow", "cross",
  "bridge", "wood", "field", "shore", "keep", "run", "glen", "marsh"
];
const WHIMSY_ADJ = [
  "Prancing", "Drunken", "Laughing", "Sleeping", "Wandering", "Gilded",
  "Rusty", "Merry", "Salty", "Crooked", "Weary", "Jolly", "Roaring", "Lucky"
];
const ANIMAL_OR_OBJECT_NOUN = [
  "Pony", "Duck", "Stag", "Dragon", "Kettle", "Lantern", "Anchor", "Boar",
  "Griffin", "Tankard", "Owl", "Fox", "Barrel", "Wheel", "Compass", "Crown"
];
const ABSTRACT_NOUN = [
  "Dawn", "Ruin", "Embers", "Twilight", "Storms", "Ash", "Silence", "Chains",
  "Thorns", "Tides", "Bones", "Stars", "Shadows", "Flame", "Frost", "Oaths"
];
const GROUP_NOUN = [
  "Vanguard", "Blades", "Company", "Fellowship", "Order", "Brotherhood",
  "Coalition", "Legion", "Circle", "Guild", "Wardens", "Compact"
];
const CYBER_ADJ = ["Chrome", "Neon", "Static", "Glitch", "Null", "Vex", "Circuit", "Ghost"];
const CYBER_NOUN = ["Fang", "Wire", "Byte", "Nine", "Zero", "Spike", "Flux", "Vector"];
const CORP_PREFIX = ["Omni", "Cyber", "Nova", "Helix", "Vertex", "Axiom", "Zenith", "Praxis"];
const CORP_SUFFIX = ["Dyne", "Corp", "Systems", "Industries", "Genetics", "Robotics", "Logistics", "Dynamics"];
const TECH_PREFIX = ["Tachyon", "Positronic", "Subspace", "Quantum", "Plasma", "Warp", "Ionic", "Neural"];
const TECH_SUFFIX = ["Field", "Matrix", "Flux", "Modulator", "Array", "Resonance", "Core", "Drive"];
const GREEK_LETTERS = ["Alpha", "Beta", "Gamma", "Delta", "Sigma", "Omega", "Rho", "Tau"];
const STAR_SUFFIX = ["Centauri", "Draconis", "Majoris", "Minoris", "Prime", "Eridani", "Cygni"];

function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}
function capitalize(str) {
  return str.replace(/^./, c => c.toUpperCase());
}

/** One-word compound place name, e.g. "Ironhold", "Shadowmere". */
export function compoundPlaceName() {
  return pick(GRIM_ADJ) + pick(GEO_NOUN).toLowerCase();
}

/** Tavern/inn/bar style name, e.g. "The Prancing Pony". */
export function innName() {
  return `The ${pick(WHIMSY_ADJ)} ${pick(ANIMAL_OR_OBJECT_NOUN)}`;
}

/** A proper name (from a namegen-engine pattern) with an epithet, e.g. "Vethrandir, Blade of Ash". */
export function epithetName(namePattern) {
  const name = capitalize(String(compile(namePattern)));
  return `${name}, ${pick(["Blade", "Herald", "Voice", "Hand", "Song", "Ward"])} of ${pick(ABSTRACT_NOUN)}`;
}

export function groupName() {
  return `The ${pick(GRIM_ADJ)} ${pick(GROUP_NOUN)}`;
}
export function shipName() {
  return `The ${pick(GRIM_ADJ)} ${pick(ABSTRACT_NOUN)}`;
}
export function festivalName() {
  return `The Festival of ${pick(ABSTRACT_NOUN)}`;
}
export function blasphemyName() {
  return `The Rite of ${pick(["Silence", "Blood", "Ash", "Whispers", "Chains", "Ruin"])}`;
}
export function warName() {
  return `The War of ${pick(ABSTRACT_NOUN)}`;
}
export function tomeName() {
  return `The Book of ${pick(ABSTRACT_NOUN)}`;
}
export function wardName() {
  return `${compoundPlaceName()} Ward`;
}
export function streetName() {
  return `${pick(GRIM_ADJ)} ${pick(["Street", "Lane", "Row", "Way", "Alley"])}`;
}
export function netrunnerHandle() {
  return `${pick(CYBER_ADJ)}${pick(CYBER_NOUN)}`;
}
export function megaCorpName() {
  return `${pick(CORP_PREFIX)}${pick(CORP_SUFFIX)}`;
}
export function technobabbleName() {
  return `${pick(TECH_PREFIX)} ${pick(TECH_SUFFIX)}`;
}
export function planetName() {
  const base = capitalize(String(compile("<B><V><c>")));
  return `${base} ${pick(["Prime", "IV", "IX", "Minor", "Major", "II"])}`;
}
export function starName() {
  return `${pick(GREEK_LETTERS)} ${pick(STAR_SUFFIX)}`;
}
export function mythosTomeName() {
  return `The ${pick(["Necronomicon", "Codex", "Liber", "Cultus", "Grimoire"])} of ${pick(["the Black Goat", "Yog-Sothoth", "the Outer Dark", "Nameless Things", "the Deep Ones", "Forgotten Stars"])}`;
}
export function designation(letterCount, digitCount, prefix = "") {
  const letters = Array.from({ length: letterCount }, () => pick("ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""))).join("");
  const digits = Array.from({ length: digitCount }, () => Math.floor(Math.random() * 10)).join("");
  return `${prefix}${letters}-${digits}`;
}

/** Short culturally-flavored settlement name: pattern output trimmed + a suffix. */
export function townFromPattern(pattern, suffixes) {
  const base = capitalize(String(compile(pattern)).slice(0, 6));
  return base + pick(suffixes);
}

/** Settlement name derived from a real surname corpus (see markov.mjs). */
export function townFromSurname(surnameGeneratorFn) {
  return surnameGeneratorFn();
}
