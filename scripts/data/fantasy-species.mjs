/**
 * Fantasy-race name data transcribed from NameLists/Fantastic/04 Fantastic
 * Species.md (the "roll d%/d20/d12 and combine" prefix/suffix tables) into
 * namegen-engine pattern strings, plus a few bespoke generators for tables
 * that don't reduce to simple prefix+suffix alternation (Primitive's
 * variable element count, the Servants of Darkness Soft/Dull/Sharp
 * combinatorics, and the flat Nymphs & Sirens / Animal-like Creatures lists).
 */
import { compile } from "./namegen-engine.mjs";

function capitalize(str) {
  return str.replace(/^./, c => c.toUpperCase());
}
function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}
function alt(array) {
  return `(${array.join("|")})`;
}
function pattern(str) {
  return () => capitalize(String(compile(str)));
}

/* -------------------------------------------- */
/* Vile & Crude: Medium (Orcs)                    */
/* -------------------------------------------- */

const ORC_ELEMENT = [
  "ag", "aug", "bad", "bag", "bakh", "bash", "baz", "blag", "brag", "brog",
  "bruz", "dag", "dakk", "darg", "dob", "dog", "drab", "dug", "dur", "gash",
  "ghaz", "glakh", "glaz", "glob", "glol", "gluf", "glur", "gnarl", "gnash", "gnub",
  "gob", "gokh", "gol", "golk", "gor", "grakh", "grash", "grath", "graz", "grot",
  "grub", "grud", "gud", "gut", "hag", "hakk", "hrat", "hrog", "hrug", "khag",
  "khar", "krag", "krud", "lakh", "lash", "lob", "lub", "lud", "luf", "luk",
  "molk", "muk", "muz", "nar", "ogg", "olg", "rag", "rash", "rogg", "rorg",
  "rot", "rud", "ruft", "rug", "rut", "shad", "shag", "shak", "shaz", "shog",
  "skar", "skulg", "slur", "snar", "snorl", "snub", "snurr", "sod", "stulg", "thak",
  "trog", "ug", "umsh", "ung", "uth", "yakh", "yash", "yob", "zahk", "zog"
];
const ORCISH_FEMALE_SUFFIX = ["ah", "ay", "gah", "ghy", "y", "ya"];
export const ORCISH_MALE = alt(ORC_ELEMENT) + alt(ORC_ELEMENT);
export const ORCISH_FEMALE = alt(ORC_ELEMENT) + alt(ORC_ELEMENT) + alt(ORCISH_FEMALE_SUFFIX);

/* -------------------------------------------- */
/* Doughty & Homely: Dwarves / Halflings          */
/* -------------------------------------------- */

const DWARF_PREFIX = [
  "bal", "bord", "born", "brim", "brod", "brokk", "brom", "bru", "bur", "burl",
  "da", "dal", "dolg", "dor", "dorm", "dral", "drim", "drom", "dur", "durm",
  "durn", "from", "fror", "fuld", "fund", "gim", "glo", "gond", "gord", "gorm",
  "grad", "grim", "grod", "grom", "guld", "gund", "gur", "hord", "horn", "hra",
  "na", "nor", "nord", "orm", "skand", "skond", "storn", "strom", "stur", "sturl",
  "sund", "thor", "thorn", "thra", "thro", "throl", "thror", "thru", "thrur", "thund"
];
const DWARF_MALE_SUFFIX = ["bor", "din", "in", "ir", "li", "lin", "nir", "or", "ri", "rin", "rok", "ror", "rur", "vi", "vir", "vor"];
const DWARF_FEM_SUFFIX = ["bis", "da", "dis", "ga", "hild", "is", "lif", "lind", "lis", "na", "nis", "ris", "rith", "run", "vis"];
export const DWARVISH_MALE = alt(DWARF_PREFIX) + alt(DWARF_MALE_SUFFIX);
export const DWARVISH_FEMALE = alt(DWARF_PREFIX) + alt(DWARF_FEM_SUFFIX);

const HALFLING_PREFIX = [
  "ad", "adel", "adr", "ail", "alb", "alm", "amb", "band", "bard", "ben", "biff", "bild",
  "blanc", "boff", "bomb", "bram", "bung", "droc", "drog", "durl", "emm", "erd", "ern", "ever",
  "falc", "ferd", "frob", "fulb", "gam", "hald", "ham", "hasc", "hod", "hug", "iv", "mark",
  "mil", "mung", "od", "oth", "sab", "sam", "seg", "serl", "tob", "wan", "wig", "wyd"
];
const HALFLING_MALE_SUFFIX = ["ald", "ard", "ert", "fast", "o", "old", "win", "wise"];
const HALFLING_FEM_SUFFIX = ["a", "ia", "ice", "ily", "ina", "wina", "wisa"];
export const HALFLING_MALE = alt(HALFLING_PREFIX) + alt(HALFLING_MALE_SUFFIX);
export const HALFLING_FEMALE = alt(HALFLING_PREFIX) + alt(HALFLING_FEM_SUFFIX);

/* -------------------------------------------- */
/* Fair & Noble: Elves (+ folded-in Small & Spry) */
/* -------------------------------------------- */

const ELF_PREFIX = [
  "an", "ar", "cal", "car", "cel", "cir", "clar", "el", "elb", "er", "erl", "est", "far", "fin", "gal", "gan", "gar", "gel", "gil", "ilm",
  "im", "in", "ir", "ist", "lar", "lir", "lor", "mar", "mel", "mer", "mir", "nim", "nin", "nir", "ral", "ran", "rel", "ril", "rin", "rim",
  "aeg", "ael", "aer", "aes", "aeth", "bel", "ber", "cael", "caer", "cris", "ear", "elth", "eol", "faer", "fean", "find", "ith", "laeg", "lend", "lind",
  "lith", "maeg", "mind", "mith", "nith", "rael", "rind", "saer", "sar", "seld", "ser", "sil", "silm", "sind", "thael", "thaer", "thal", "thel", "ther", "thir",
  // Small & Spry (Table 5-7, first instance) folded in as extra elvish variety
  "bris", "cryl", "elsi", "ember", "esk", "feris", "frimi", "gan", "glink", "hal", "hel", "hist",
  "iphil", "ispel", "istle", "jat", "jost", "jus", "lirra", "mali", "mink", "mirra", "mistle", "ninka",
  "opal", "oris", "orif", "peri", "sarm", "sprin", "stith", "tansi", "tirra", "trump", "whis", "zando"
];
const ELF_MID = ["ad", "al", "am", "an", "ar", "as", "eb", "ed", "el", "em", "en", "er", "es", "ev", "il", "in", "ir", "ol", "thal", "thon"];
const ELF_MALE_SUFFIX = [
  "ad", "dan", "del", "dil", "dir", "fal", "ion", "lad", "las", "lin", "nar", "or", "orn", "ras", "rior", "rod", "rond", "ros", "thir",
  "bik", "brix", "frell", "fret", "kin", "mist", "mit", "rix", "tross", "twik", "win", "zisk"
];
const ELF_FEM_SUFFIX = [
  "edel", "el", "eth", "ian", "iel", "ien", "loth", "mir", "rial", "rian", "riel", "rien", "ril", "roël", "sil", "wë", "wen",
  "dee", "kiss", "la", "liss", "mee", "niss", "nyx", "ree", "riss", "sa", "tiss", "ynx"
];
export const ELVISH_MALE = alt(ELF_PREFIX) + `(|${alt(ELF_MID)})` + alt(ELF_MALE_SUFFIX);
export const ELVISH_FEMALE = alt(ELF_PREFIX) + `(|${alt(ELF_MID)})` + alt(ELF_FEM_SUFFIX);

/* -------------------------------------------- */
/* Evil but Elegant: Drow / Dark Elves            */
/* -------------------------------------------- */

const DROW_PREFIX = [
  "bal", "ber", "char", "de", "div", "dri", "dul", "eil", "ek", "im", "ins", "ist", "jeg", "jer", "jys", "lil", "mar", "mer", "mez", "mor",
  "myr", "ne", "nel", "nil", "no", "nyl", "rel", "rha", "ru", "sab", "sin", "sul", "sus", "tel", "tul", "ver", "vil", "vir", "vril", "yas",
  "bur", "chor", "col", "dol", "dor", "drom", "dur", "en", "er", "gon", "gul", "jend", "kil", "lul", "mab", "maz", "mol", "nor", "noth", "ol",
  "olg", "on", "org", "oth", "pan", "pel", "por", "sek", "sol", "sun", "ten", "thal", "tor", "torm", "vek", "vol", "vor", "yel", "yol"
];
const DROW_MID = ["dyl", "el", "en", "er", "id", "il", "is", "lav", "len", "lev", "lin", "liv", "pel", "pir", "ra", "ral", "ril", "rin", "sin", "syl"];
const DROW_MALE_SUFFIX = ["ald", "eld", "id", "ild", "ird", "lim", "naz", "nid", "nil", "red", "rid", "rim", "riv", "ul", "uld", "vid", "vim", "vir", "viz"];
const DROW_FEM_SUFFIX = ["bra", "dra", "dril", "ene", "hel", "ia", "il", "ira", "istra", "ith", "iza", "lin", "na", "ra", "rin", "sil", "tra", "vra", "vril"];
export const DROW_MALE = alt(DROW_PREFIX) + `(|${alt(DROW_MID)})` + alt(DROW_MALE_SUFFIX);
export const DROW_FEMALE = alt(DROW_PREFIX) + `(|${alt(DROW_MID)})` + alt(DROW_FEM_SUFFIX);

/* -------------------------------------------- */
/* Faerykind (Table 5-7, second instance)         */
/* -------------------------------------------- */

const FAERY_PREFIX = [
  "dex", "flax", "flim", "fliss", "flix", "foss", "frisk", "friss", "gess", "glan", "glax", "glim",
  "gliss", "goss", "hex", "liss", "min", "misk", "raff", "ress", "riff", "rill", "saff", "shim",
  "tink", "tiss", "trill", "trist", "twill", "twiss", "twisp", "twix", "weft", "wesk", "winn", "wisp"
];
const FAERY_MALE_SUFFIX = ["aldo", "allo", "amo", "ando", "aroll", "aron", "asto", "endo", "eroll", "eron", "esto", "ondo"];
const FAERY_FEM_SUFFIX = ["afer", "amer", "anel", "arel", "asti", "efer", "enti", "erel", "ifer", "imer", "inel", "irel"];
export const FAERYKIND_MALE = alt(FAERY_PREFIX) + alt(FAERY_MALE_SUFFIX);
export const FAERYKIND_FEMALE = alt(FAERY_PREFIX) + alt(FAERY_FEM_SUFFIX);

/* -------------------------------------------- */
/* Servants of Light: Celestials                 */
/* -------------------------------------------- */

const CELESTIAL_PREFIX = [
  "adan", "adrast", "alant", "amad", "aman", "amar", "amars", "amart", "ansam", "arad", "aram", "aran",
  "asan", "asarn", "astar", "atar", "atlan", "avar", "avlant", "avral", "jalan", "jalkar", "jaran", "jasal",
  "jasan", "jasarm", "javral", "kalad", "kalar", "kalas", "kalast", "kasal", "katarn", "kaval", "klaron", "palad",
  "palant", "palor", "raman", "ranal", "ranar", "rasan", "ravan", "samar", "saran", "sarat", "sardan", "sardar",
  "sarnat", "solar", "talan", "talar", "talas", "talon", "taran", "taval", "valant", "valar", "valdor", "valkar",
  "valmar", "valnar", "valnor", "valon", "valor", "vanar", "varal", "varam", "varan", "varat", "vardar", "voltar"
];
const CELESTIAL_MALE_SUFFIX = ["al", "an", "ar", "as", "at", "ath", "anth", "athal", "athar", "athas"];
const CELESTIAL_FEM_SUFFIX = ["el", "en", "er", "es", "et", "eth", "enth", "eleth", "ereth", "eseth"];
export const CELESTIAL_MALE = alt(CELESTIAL_PREFIX) + alt(CELESTIAL_MALE_SUFFIX);
export const CELESTIAL_FEMALE = alt(CELESTIAL_PREFIX) + alt(CELESTIAL_FEM_SUFFIX);

/* -------------------------------------------- */
/* Dragons                                        */
/* -------------------------------------------- */

const DRACONIC_PREFIX = [
  "abra", "adastra", "adra", "anca", "andra", "arag", "archo", "atra", "bar", "bara", "beru", "bhakri", "bia", "bra", "brado", "brima", "cadra", "chro", "chryso", "glau",
  "har", "helio", "huro", "iul", "jalan", "jarzem", "jazra", "jurga", "keruxa", "kralka", "lazulo", "majuri", "malacho", "mar", "marmora", "melkar", "orgra", "ouro", "perido", "phoro",
  "phrixu", "porphyro", "pyra", "rhada", "rhe", "rhodo", "rau", "sar", "sarcu", "sarda", "scarva", "sidereo", "skhia", "sulchru", "tchalcedo", "tchazar", "trocho", "vra", "zalar", "zerul"
];
const DRACONIC_MALE_SUFFIX = [
  "bazius", "boros", "bradax", "calchax", "cordax", "lagon", "malax", "mandros", "manthys", "mordax",
  "nadral", "nalux", "neriax", "phylax", "vorax", "vorung", "xenor", "zuthrax", "zzebrax", "zzemal"
];
export const DRACONIC_MALE = alt(DRACONIC_PREFIX) + alt(DRACONIC_MALE_SUFFIX);
// Female dragon names take the male form + "-is" (a simplification of the source's
// irregular exceptions, e.g. bazius/bazia, -os/-ossa).
export const DRACONIC_FEMALE = alt(DRACONIC_PREFIX) + alt(DRACONIC_MALE_SUFFIX) + "(is)";

/* -------------------------------------------- */
/* Primitive (variable element count + hyphens)   */
/* -------------------------------------------- */

const PRIMITIVE_ELEMENT = [
  "ahg", "baod", "beegh", "bohr", "bul", "buli", "burh", "buri", "chah", "dhak",
  "digri", "dum", "eghi", "ehm", "faogh", "feehm", "ghad", "ghah", "gham", "ghan",
  "ghat", "ghaw", "ghee", "ghish", "ghug", "giree", "gonkh", "goun", "goush", "guh",
  "gunri", "hah", "hani", "haogh", "hatoo", "heghi", "heh", "hoo", "houm", "hree",
  "ig", "kham", "khan", "khaz", "khee", "khem", "khuri", "logh", "lugh", "maoh",
  "meh", "mogh", "mouh", "mugh", "naoh", "naroo", "nham", "nuh", "ob", "oli",
  "orf", "ough", "ouh", "peh", "pogh", "pugh", "puh", "quagi", "rahoo", "rhoo",
  "rifoo", "ronkh", "rouk", "saom", "saori", "shehi", "shlo", "shom", "shour", "shul",
  "snaoh", "suhi", "suth", "teb", "thom", "toudh", "tregh", "tuhli", "ub", "urush",
  "ush", "vuh", "wah", "wuh", "yaum", "yauth", "yeeh", "yih", "yuh", "zham"
];
const PRIMITIVE_FEMALE_TAG = ["doh", "rei", "mih", "fah", "soh", "lah", "tih", "daoh"];

/** Roughly follows Table 5-4's method: 1-3 hyphenated elements for males, 1-2 (plus a sung female tag) for females. */
export function primitiveName(gender = "male") {
  const count = gender === "female" ? 1 + Math.floor(Math.random() * 2) : 1 + Math.floor(Math.random() * 3);
  const parts = Array.from({ length: count }, () => pick(PRIMITIVE_ELEMENT));
  if (gender === "female") {
    const at = Math.random() < 0.5 ? "start" : "end";
    if (at === "start") parts.unshift(pick(PRIMITIVE_FEMALE_TAG));
    else parts.push(pick(PRIMITIVE_FEMALE_TAG));
  }
  return capitalize(parts.join("-"));
}

/* -------------------------------------------- */
/* Servants of Darkness: Soft/Dull/Sharp Fiendish */
/* -------------------------------------------- */

const SOFT_SPONGY = [
  "alu", "alz", "avu", "azaz", "baph", "baz", "cha", "fraz", "garl", "garu",
  "gla", "hra", "mal", "nahu", "nal", "nasu", "paz", "raz", "tha", "thalu",
  "bre", "dre", "gel", "gle", "gre", "hez", "rez", "rezu", "tze", "gzi",
  "hriz", "hzi", "idrau", "itha", "ixu", "lilu", "riz", "yil", "dromu", "gro",
  "lol", "moz", "olth", "oxu", "sco", "tho", "bu", "bul", "buz", "chru",
  "dru", "ghu", "gura", "guz", "hruz", "huz", "kul", "lurhz", "muz", "ru",
  "shu", "ssu", "szul", "thu", "ulchru", "utu", "vul", "zu", "zul", "baal",
  "ghaa", "kraa", "phaal", "raal", "saa", "bial", "oazo", "soaz", "ruaz", "gya",
  "yaa", "bael", "nee", "ziel", "yee", "aiaz", "shai", "reoz", "duoi", "drau",
  "ghau", "glau", "mau", "sau", "tzau", "iuz", "juu", "rhuu", "vuul", "zuu"
];
const DULL_HEAVY = [
  "agh", "alg", "barg", "chag", "ghad", "glab", "grag", "hrag", "kag", "kwarg",
  "mag", "nalb", "sag", "tharg", "brelg", "dergh", "dregh", "drelb", "felg", "heg",
  "kleg", "igg", "rigg", "blog", "drog", "grolb", "kolg", "krolg", "lolg", "mog",
  "morg", "nog", "obb", "ogg", "olb", "rogg", "strog", "thog", "trob", "tzolg",
  "vogt", "bub", "bulg", "druj", "durg", "frub", "fulg", "gub", "hrud", "hurg",
  "jub", "julb", "nud", "nug", "nulb", "rung", "shub", "stug", "sug", "szug",
  "trulg", "ulb", "urb", "vub", "vulb", "xub", "zub", "zug", "zugt", "aab",
  "aag", "glaag", "haag", "naag", "raag", "boaj", "moab", "uag", "leegh", "yeb",
  "yeeg", "aig", "yibb", "iog", "droog", "nyog", "aug", "baug", "daurg", "draug",
  "gaub", "laug", "maug", "naug", "raug", "saug", "thaug", "iub", "iug", "ruug"
];
const SHARP_SPIKY = [
  "ach", "akk", "ash", "azt", "bahor", "bar", "bas", "brax", "charn", "dak",
  "hrax", "lach", "lazt", "mat", "nam", "nazt", "ralk", "rhast", "sark", "slarv",
  "tash", "thak", "thalur", "thalk", "vach", "vap", "dek", "ech", "fesh", "gek",
  "hrek", "lech", "met", "ner", "ter", "blik", "gith", "igm", "inax", "irsch",
  "kir", "lis", "lisk", "lith", "nilv", "nirr", "tlizit", "bor", "chon", "goch",
  "gor", "goth", "hoth", "khor", "kos", "loch", "lok", "loth", "moch", "moth",
  "noc", "och", "oth", "rolk", "roth", "sot", "soth", "vrok", "dun", "gur",
  "hun", "luth", "muth", "nur", "rutt", "sut", "sutt", "szut", "tur", "urt",
  "utuk", "uzt", "krych", "nyth", "slyth", "gaan", "xaas", "boak", "ruaak", "yalm",
  "haerx", "iex", "draum", "gaur", "glaur", "rauk", "saur", "duum", "nuur", "ruun"
];
const FIENDISH_TIERS = { soft: SOFT_SPONGY, dull: DULL_HEAVY, sharp: SHARP_SPIKY };
const FIENDISH_COMBOS = [
  ["soft", "dull"], ["soft", "sharp"], ["dull", "soft"],
  ["dull", "sharp"], ["sharp", "soft"], ["sharp", "dull"]
];

/** Table 5-11: picks one of the six Soft/Dull/Sharp element combinations and joins them. */
export function fiendishName() {
  const [a, b] = pick(FIENDISH_COMBOS);
  return capitalize(pick(FIENDISH_TIERS[a]) + pick(FIENDISH_TIERS[b]));
}

/* -------------------------------------------- */
/* Nymphs and Sirens (flat mythic name lists)     */
/* -------------------------------------------- */

const NYMPH_SIREN_NAMES = [
  "Adrasteia", "Aegina", "Amaltheia", "Ankhiale", "Arethusa", "Asterodeia", "Bakkhe", "Bromie", "Daphne", "Doris",
  "Dryope", "Dynamene", "Ekho", "Elektra", "Erato", "Euryanassa", "Eurythemista", "Idaea", "Io", "Iynx",
  "Kallirrhoë", "Kallisto", "Kalyke", "Kalypso", "Klytia", "Kreusa", "Linos", "Makris", "Nysa",
  "Aglaope", "Aglaophonos", "Leukosia", "Ligeia", "Molpe", "Parthenopë", "Peisinoë", "Raidne", "Teles", "Thelxepeia", "Thelxiope"
];
export function nymphSirenName() {
  return pick(NYMPH_SIREN_NAMES);
}

/* -------------------------------------------- */
/* Animal-like Creatures (Beastfolk)              */
/* -------------------------------------------- */

const BEASTFOLK_POOLS = {
  mammal: [
    "bah", "beh", "boh", "bou", "buhn", "dah", "deh", "dih", "dou", "duhm", "eehm", "engah", "fou", "gah", "goh", "gohm", "guhn", "gwah", "hahn", "hou", "hwah", "huh",
    "jou", "juh", "kah", "keh", "keng", "kihm", "koh", "kong", "kreeh", "lah", "leh", "mah", "moh", "mohm", "muh", "nah", "nang", "neh", "nih", "noh", "nou", "nyoh", "ogh", "ououh", "roh",
    "sah", "sahm", "soh", "tah", "tahm", "toh", "ugh", "ungoh", "wah", "wuhn", "yah", "yoh", "zeh", "zih",
    "heek", "histh", "hisvit", "ikit", "itch", "kree", "kwee", "kweev", "kwik", "neek", "neekit", "risik", "skee", "skiv", "skree", "skreek", "skreelk", "skrit", "skriv", "skwee",
    "sneek", "sneetch", "snik", "snikit", "snitch", "tchee", "tchirik", "weesk", "wisth", "wreek",
    "cheekk", "chisk", "chreej", "eep", "kishik", "kreej", "kwirrik", "reep", "thrisk", "thriss",
    "ahou", "auw", "bow", "garoo", "growl", "gruff", "gruwl", "gurr", "haroou", "howgh", "hraugh", "hrahou", "hroou", "hruff", "hrusk", "kaiyah", "kurr", "laroou",
    "lhaoouh", "mutt", "roagh", "rriur", "ruff", "turr", "tyke", "whelp", "yahoou", "yaup", "yelp", "yiee", "yike", "yipe", "yowh", "yurr",
    "bree", "breekah", "cachinn", "chikaha", "chree", "eehya", "eengi", "eheh", "ghee", "gheu", "ghnee", "ghree", "grigri", "hee", "hyee", "ihih", "jheer", "nyaha", "snreeh", "yeenh",
    "hrish", "lirr", "liss", "lith", "lyau", "mau", "meer", "mew", "miah", "miau", "mihr", "mirhl", "mirr", "miu", "purrh", "saf", "sash", "serr", "sfee", "shah", "sharr", "shau", "shee",
    "sheer", "shim", "shurr", "siyth", "slif", "swish", "syau",
    "gharrh", "gher", "grihm", "guarrh", "hleogh", "hrargh", "hroarr", "hrugh", "hruhr", "hurrh", "mhuurr", "parrn", "rhauhl", "rrowrr", "sabor", "shaor", "shargh", "sheethah", "taigh", "thurr",
    "bree", "brhou", "bwihi", "gnayah", "hbraa", "hihn", "hnai", "hnee", "hneh", "hniwhi", "hnuy", "houyhn", "hree", "hrihih", "huhnim", "hwin", "ilhya", "maiah",
    "mhee", "mhneh", "mhwin", "nhiwin", "nyahey", "nyihih", "yhehi",
    "borcht", "borgha", "bucht", "ghreeh", "glutth", "gris", "gruh", "grunkh", "hirkh", "hirkha", "hoinh", "hoinkh", "hortha", "hrigh", "hrogh", "hrugh", "huerg",
    "hurnk", "huunh", "hween", "mucht", "oighn", "pachn", "pharho", "pohr", "shoat", "snorgh", "soueeh", "squeeh", "stoink", "tuskh"
  ],
  arthropod: [
    "blak", "blik", "bluk", "dikuk", "karch", "klakk", "klatt", "klik", "kluk", "klutt", "kack", "krak", "krik", "krub", "kruk", "krunk", "kulch", "kurch", "kwik", "kwuk",
    "schrab", "schrib", "schruk", "tchelk", "tchub", "tchuk", "tchulk", "tchunk", "tchutt", "tunch",
    "grik", "irrtt", "kilss", "kob", "krig", "krik", "krip", "ksob", "lob", "nik", "sich", "skik", "skrik", "snik", "stig", "spiv", "stich", "tchik", "tigik", "tik", "vib", "vip", "vob", "vrig",
    "wib", "wik", "wiv", "yib", "yig", "yob",
    "chirr", "chirrk", "hrikk", "kikeek", "kirrik", "kizz", "kree", "kreex", "krekk", "krich", "kutch", "kzirr", "rikik", "rritz", "rrizzch", "shikirr", "skeetz", "skirr", "skisk", "skrak",
    "skrix", "skut", "strid", "strix", "tchik", "thrih", "thrix", "tzirch", "tzuk", "tzurr"
  ],
  mollusc: [
    "chlugh", "gohlb", "ghoch", "ghoth", "globb", "gloth", "grish", "grush", "mieuch", "mnelsh", "ogh", "ough", "phlem", "phlish", "shgor", "shob", "shog",
    "shulb", "slough", "squelgh", "yaagth", "yoch", "yog",
    "ghagh", "ghuch", "glash", "glup", "glush", "guth", "lagh", "lulgh", "mauh", "mlulgh", "shluh", "shubb", "shug", "shul", "shum", "shuph", "slaugh", "sluagh",
    "slud", "sluph", "snulg", "ubb", "yug",
    "ghish", "gluh", "gluig", "glung", "milgh", "milsh", "phlid", "phlith", "shabh", "shelzh", "shig", "sith", "slaa", "slig", "slithe", "sphid", "squilg", "squirsh", "yilg", "yish", "yizh", "zilgh"
  ],
  bird: [
    "breeer", "eew", "fee-bree", "fieew", "ih-ieee", "ih-iii", "kee-arr", "kee-yer", "keeerrr", "kraaa", "krr-eek", "krrreeep", "meeyah", "peerr", "peew", "skweeurr", "stree",
    "strii", "tzah-wiii", "weeeerr", "wha-whii",
    "awoik", "honk", "hroank", "kau-kau", "kaw", "kek", "kluck", "kraark", "krarr", "kroak", "kronk", "kwaa", "oikaa", "tcheck", "tseck", "tzuk", "whaw", "yenk",
    "dee-dee", "jeef", "kil-dee", "klee-ip", "klee-it", "klee-klee", "kleet", "li-kwee", "pee", "peea-wee", "peet-see", "tee-ho", "tee-whee", "tee-you", "teee-ur", "tew",
    "tew-whee", "towhee", "tseet", "twee", "tweet", "wheep", "wreet", "zweet",
    "a-a", "a-oh", "che-wink", "chi-chi", "chip", "chirrup", "chuh", "chuhli", "dri-drop", "ikka-chi", "kidick", "piri-piro", "trill", "wheeo-chchi", "whit-whit", "wik-wik",
    "hoo", "hooho", "hoohooo", "hooroo", "hoot", "hru", "koo-ah", "koo-koo", "mwah", "pwah", "ruru", "tiroo", "too-loo", "toowit", "tuwu", "twoah", "twoo", "whill",
    "whipoor", "whoo", "whoo-ah"
  ],
  fish: [
    "bilp", "blib", "blip", "bloolgh", "blub", "blup", "boolp", "dilp", "dool", "floop", "ghool", "gloogh", "glob", "glop", "glub", "gluup", "googh", "guulgh", "ool", "plop",
    "polgh", "poolp", "quilp", "quolp", "sblop", "shib", "shup", "thilp", "thlup", "thoop",
    "arllg", "aurch", "ferllch", "frach", "fragh", "frauch", "frrechk", "grach", "grallch", "grech", "grellch", "gruch", "grullch", "kaurch", "rauch", "rechk", "shkurr",
    "shralk", "shregk", "shrrukk",
    "lool", "mool", "ooz", "silv", "slee", "sleem", "sleez", "sliv", "sliz", "sloov", "smee", "sneel", "snilv", "snool", "sool", "szee", "szoo", "veez", "vlee", "vliz", "vloo", "vool",
    "voolm", "vooz", "zeev", "zilv", "zliv", "zloo", "zool", "zoov"
  ],
  reptile: [
    "haash", "heem", "ihxaan", "inixh", "kahxtu", "kam", "kiul", "mahz", "mierz", "mursh", "reehm", "scux", "shai", "shar", "sheel", "siul", "skeen", "slaxas", "strai", "suliz",
    "sxur", "taish", "tur", "tzenx", "tzesh", "tzuhan", "tzur", "xeem", "xhan", "xurelz",
    "ahsk", "anakh", "ikhsar", "inkh", "isith", "izkur", "kar", "kisz", "krah", "krizil", "lirisk", "liszth", "rah", "rahk", "rahn", "rahst", "rahz", "rausz", "salar", "sar", "sard", "sarn",
    "skurr", "skih", "slith", "sliz", "surt", "szaur", "zahsu", "zar", "zark", "zilakh",
    "aassp", "hish", "hisstah", "issah", "issh", "kaa", "kepesh", "nepthiss", "ness", "nissp", "peshep", "shaash", "shaah", "shaass", "shissk", "ssaan", "ssaath",
    "ssaah", "ssashen", "ssep", "sseth", "ssin", "ssipth", "ssnaah", "ssnepth", "vaass", "vaathiss", "viss", "vissp", "yaash", "yiss",
    // Serpents (Ancient Egyptian underworld demons) folded in as bonus reptile flavor
    "Ab-esh-imy-duat", "Ab-she", "Ab-ta", "Akeneh", "Akhen", "Am", "Aman", "Ami-Hemf", "Anapef", "Ankhi", "Antaf", "Ap", "Apap", "Apep", "Apepi",
    "Apophis", "Ash-hrau", "Bath", "Beteshu", "Bitje", "Hau", "Hau-hra", "Heka", "Hekret", "Hemheti", "Hemth", "Henti", "Iuba", "Iubani",
    "Kara-anememti", "Kenememti", "Khak-ab", "Kharru", "Khepri", "Khermuti", "Khesef-hra", "Mehen", "Nai", "Neha-hra", "Nesht", "Pepi", "Qerneru", "Qettu", "Saatet-ta",
    "Sau", "Sebv-ent-seba", "Sekhem-hra", "Senenahemthet", "Serem-taui", "Sesi", "Sesshes", "Setchek", "Shemti", "Sheta", "Sisi", "Tcheser-tep", "Teka-hra", "Tepi", "Tethru", "Tetu", "Turrupa", "Uai", "Ufa", "Unti"
  ],
  amphibian: [
    "bhirr", "bhurr", "bi-bugh", "braarp", "breek", "brekk", "brepp", "brib", "bripp", "brooäkk", "brrarp", "bruurk", "bulph", "kek-kek", "khroap", "koärk", "koäx",
    "krekkek", "pheärp", "pribbit", "phrip-pip", "ribbit",
    "boag", "bolg", "brolg", "gaarlb", "goag", "goalb", "golg", "goln", "graal", "roalb", "roalg", "rolg", "rolv", "slaag", "slaan", "slaar", "slaav", "sloag", "slorg", "slorv",
    "soag", "vaarg", "vlaar", "vlaaz", "voag", "volg", "vraag", "vraal", "vrog", "vrol"
  ]
};

/** Picks 1-2 elements (hyphenated if 2) from the named beastfolk sound pool. */
export function beastfolkName(kind) {
  const pool = BEASTFOLK_POOLS[kind];
  const parts = Math.random() < 0.4 ? [pick(pool), pick(pool)] : [pick(pool)];
  return capitalize(parts.join("-"));
}
export const BEASTFOLK_KINDS = Object.keys(BEASTFOLK_POOLS);

export { pattern };
