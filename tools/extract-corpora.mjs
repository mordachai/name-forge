/**
 * Dev-time only. Not loaded by Foundry - run manually with:
 *   node tools/extract-corpora.mjs
 * to regenerate scripts/data/generated/people-corpora.mjs and
 * scripts/data/generated/fantasy-corpus.mjs from the raw NameLists/
 * markdown reference files, the same way corpora-data.mjs was originally
 * hand-extracted from the Corpora project's JSON files.
 *
 * Only the "clean template" NameLists/People files (Male/Female Personal
 * Names + Family Names, or an explicit unisex Personal Names section) are
 * listed in PEOPLE_FILES below. Structurally irregular sources - dithematic
 * element-pair names (Anglo-Saxon, Chinese, Germanic), multi-part assembly
 * systems (Roman, Ancient Egyptian, Phoenician), tribe-subdivided lists
 * (African), and shared/reused lists (Polynesian) - are intentionally left
 * out; they need bespoke extraction logic, not this generic parser.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const PEOPLE_DIR = path.join(ROOT, "NameLists", "People");
const FANTASTIC_DIR = path.join(ROOT, "NameLists", "Fantastic");
const OUT_DIR = path.join(ROOT, "scripts", "data", "generated");

/* -------------------------------------------- */
/* Generic section extraction                    */
/* -------------------------------------------- */

/** Split a markdown file into { heading, body, index }[] at every "## " line. */
function splitSections(text) {
  const lines = text.split(/\r?\n/);
  const sections = [];
  let current = null;
  const headingCounts = new Map();
  for (const line of lines) {
    const m = /^##\s+(.+?)\s*$/.exec(line);
    if (m) {
      const heading = m[1];
      const index = headingCounts.get(heading) ?? 0;
      headingCounts.set(heading, index + 1);
      current = { heading, index, lines: [] };
      sections.push(current);
    } else if (current) {
      current.lines.push(line);
    }
  }
  return sections.map(s => ({ heading: s.heading, index: s.index, body: s.lines.join("\n") }));
}

/** A capitalized-word token, 1-3 words, letters/apostrophes/hyphens/periods/diacritics. */
const NAME_RE = /^[A-ZÀ-ɏ][\p{L}''.-]*(?:\s[A-ZÀ-ɏ][\p{L}''.-]*){0,2}$/u;

/** Pull plausible name tokens out of a section body, stripping "Label:" prefixes. */
function extractNames(body) {
  const names = new Set();
  const tokens = body.split(",");
  for (let raw of tokens) {
    let tok = raw.replace(/\s+/g, " ").trim();
    // Strip a leading "Some Label:" prefix (e.g. "Standard: Adam" -> "Adam", from the
    // first token of each labeled sub-list; harmless no-op on unlabeled tokens).
    tok = tok.replace(/^[A-Z][\p{L} '-]{0,24}:\s*/u, "").trim();
    if (!tok) continue;
    if (NAME_RE.test(tok)) names.add(tok);
  }
  return names;
}

function getSections(sections, headingNames, index = null) {
  return sections.filter(s => headingNames.includes(s.heading) && (index === null || s.index === index));
}

function poolNames(sections, headingNames, index = null) {
  const pool = new Set();
  for (const s of getSections(sections, headingNames, index)) {
    for (const n of extractNames(s.body)) pool.add(n);
  }
  return [...pool].sort();
}

/* -------------------------------------------- */
/* Per-culture file configuration                 */
/* -------------------------------------------- */
// unisex: true -> `male` heading(s) are used for both MALE and FEMALE output.
// index: for files with duplicate heading blocks (same heading text repeated),
//        pick a specific 0-based occurrence; omit to merge all occurrences.

const PEOPLE_FILES = [
  { file: "Africa/02 Berber.md", key: "Berber", male: ["Male Personal Names"], female: ["Female Personal Names"] },
  { file: "America/01 Amerindian.md", key: "Amerindian", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "America/02 Aztec.md", key: "Aztec", male: ["Male Personal Names"], female: ["Female Personal Names"] },
  { file: "America/03 Inca.md", key: "Inkan", male: ["Male Personal Names"], female: ["Female Personal Names"] },
  { file: "America/04 Mayan.md", key: "Mayan", male: ["Personal Names"], unisex: true },
  { file: "Asia/03 Indian.md", key: "Hindu", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "Asia/04 Sanskrit.md", key: "Sanskrit", male: ["Male Personal Names"], female: ["Female Personal Names"] },
  { file: "Asia/05 Japanese.md", key: "Japanese", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "Asia/07 Korean.md", key: "Korean", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "Asia/08 Mongol.md", key: "Mongolian", male: ["Male Personal Names"], female: ["Female Personal Names"] },
  { file: "Asia/09 Tibetan.md", key: "Tibetan", male: ["Personal Names"], unisex: true, surname: ["Clan Names"] },
  { file: "Britain/02 Cornish.md", key: "Cornish", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "Britain/03 English.md", key: "English", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "Britain/04 English Aristocratic Names.md", key: "English Aristocratic", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"], index: 0 },
  { file: "Britain/04 English Aristocratic Names.md", key: "English Rustic", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"], index: 1 },
  { file: "Britain/06 Scottish.md", key: "Scottish", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "Britain/08 Irish.md", key: "Irish", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "Britain/10 Gaelic.md", key: "Gaelic", male: ["Male Personal Names"], female: ["Female Personal Names"] },
  { file: "Britain/11 Welsh.md", key: "Welsh", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "Britain/13 Briton (Old Welsh).md", key: "Briton", male: ["Male Personal Names"], female: ["Female Personal Names"] },
  { file: "Europe/01 Armenian.md", key: "Armenian", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "Europe/02 Dutch.md", key: "Dutch", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "Europe/04 Finnish.md", key: "Finnish", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "Europe/06 French.md", key: "French", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "Europe/08 Celtic (Gaulish).md", key: "Gaulish", male: ["Male Personal Names"], female: ["Female Personal Names"] },
  { file: "Europe/09 German.md", key: "German", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "Europe/12 Gypsy.md", key: "Romani", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "Europe/13 Hungarian.md", key: "Hungarian", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "Europe/15 Norse.md", key: "Norse", male: ["Male Personal Names"], female: ["Female Personal Names"] },
  { file: "Europe/16 Norwegian.md", key: "Norwegian", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "Europe/18 Polish.md", key: "Polish", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "Europe/20 Portuguese.md", key: "Portuguese", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "Europe/22 Russian.md", key: "Russian", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "Europe/24 Spanish.md", key: "Spanish", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "Mediterranean/01 Arabic.md", key: "Arabic", male: ["Male Personal Names"], female: ["Female Personal Names"] },
  { file: "Mediterranean/02 Greek.md", key: "Modern Greek", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "Mediterranean/03 Ancient Greek (Hellenic).md", key: "Greek", male: ["Male Personal Names"], female: ["Female Personal Names"] },
  { file: "Mediterranean/04 Italian.md", key: "Italian", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "Mediterranean/07 Jewish.md", key: "Jewish", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "Mediterranean/08 Hebrew.md", key: "Hebrew", male: ["Male Personal Names"], female: ["Female Personal Names"] },
  { file: "Oceania/01 Aboriginal.md", key: "Aboriginal", male: ["Male Personal Names"], female: ["Female Personal Names"], surname: ["Family Names"] },
  { file: "Oceania/02 Papuan.md", key: "Papuan", male: ["Male Personal Names"], female: ["Female Personal Names"] },
];

function extractPeopleCorpora() {
  const out = {};
  for (const cfg of PEOPLE_FILES) {
    const text = readFileSync(path.join(PEOPLE_DIR, cfg.file), "utf8");
    const sections = splitSections(text);
    const idx = cfg.index ?? null;
    const male = poolNames(sections, cfg.male, idx);
    const female = cfg.unisex ? male : poolNames(sections, cfg.female, idx);
    const surname = cfg.surname ? poolNames(sections, cfg.surname, idx) : [];
    out[cfg.key] = { MALE: male, FEMALE: female, SURNAME: surname };
    const warn = [];
    if (male.length < 20) warn.push(`MALE only ${male.length}`);
    if (female.length < 20) warn.push(`FEMALE only ${female.length}`);
    if (cfg.surname && surname.length < 20) warn.push(`SURNAME only ${surname.length}`);
    if (warn.length) console.warn(`[people] ${cfg.key} (${cfg.file}): ${warn.join(", ")}`);
  }
  return out;
}

function extractGenericFantasy() {
  const text = readFileSync(path.join(FANTASTIC_DIR, "02 Generic Fantasy.md"), "utf8");
  const sections = splitSections(text);
  const headings = ["One-syllable Names", "Two-syllable Names", "Three-syllable Names", "Multi-syllable Names"];
  return poolNames(sections, headings);
}

/* -------------------------------------------- */
/* Output                                         */
/* -------------------------------------------- */

function jsArray(arr) {
  return `[\n${arr.map(n => `  ${JSON.stringify(n)}`).join(",\n")}\n]`;
}

function writePeopleCorpora(data) {
  const keys = Object.keys(data).sort();
  const lines = [];
  lines.push("/**");
  lines.push(" * AUTO-GENERATED by tools/extract-corpora.mjs - do not hand-edit.");
  lines.push(" * Source: NameLists/People (real-world name lists, distilled from a");
  lines.push(" * published names/naming-conventions sourcebook bundled with this module).");
  lines.push(" * Regenerate with: node tools/extract-corpora.mjs");
  lines.push(" */");
  lines.push("");
  lines.push("export const PEOPLE_CORPORA = {");
  for (const key of keys) {
    const { MALE, FEMALE, SURNAME } = data[key];
    lines.push(`  ${JSON.stringify(key)}: {`);
    lines.push(`    MALE: ${jsArray(MALE).replace(/\n/g, "\n    ")},`);
    lines.push(`    FEMALE: ${jsArray(FEMALE).replace(/\n/g, "\n    ")},`);
    lines.push(`    SURNAME: ${jsArray(SURNAME).replace(/\n/g, "\n    ")}`);
    lines.push(`  },`);
  }
  lines.push("};");
  lines.push("");
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(path.join(OUT_DIR, "people-corpora.mjs"), lines.join("\n"));
}

function writeFantasyCorpus(names) {
  const lines = [];
  lines.push("/**");
  lines.push(" * AUTO-GENERATED by tools/extract-corpora.mjs - do not hand-edit.");
  lines.push(' * Source: NameLists/Fantastic/02 Generic Fantasy.md (flat culture-agnostic');
  lines.push(" * fantasy vocable corpus, ~9,000 entries in the original source).");
  lines.push(" * Regenerate with: node tools/extract-corpora.mjs");
  lines.push(" */");
  lines.push("");
  lines.push(`export const GENERIC_FANTASY_NAMES = ${jsArray(names)};`);
  lines.push("");
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(path.join(OUT_DIR, "fantasy-corpus.mjs"), lines.join("\n"));
}

const people = extractPeopleCorpora();
writePeopleCorpora(people);
const fantasy = extractGenericFantasy();
writeFantasyCorpus(fantasy);

console.log(`Wrote ${Object.keys(people).length} People cultures to scripts/data/generated/people-corpora.mjs`);
console.log(`Wrote ${fantasy.length} names to scripts/data/generated/fantasy-corpus.mjs`);
