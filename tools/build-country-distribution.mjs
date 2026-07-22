// One-off dev script: builds country-distribution.mjs source data + a coverage report.
// Reuses the same country->source->percentage data computed earlier for
// "00 World Naming Distribution.md", now mapping each source label to a
// real PROFILES culture key (post the Phase 1/2 name-forge upgrade).

const DATA = {
 "Africa": {
  "North Africa": [
   ["Algeria","31m",[["Arabic",85],["Berber",10],["French",5]]],
   ["Egypt","68m",[["Arabic",90],["British",6],["French",3],["Italian",1]]],
   ["Libya","5m",[["Arabic",90],["Berber",5],["Italian",3],["British",2]]],
   ["Morocco","30m",[["Arabic",85],["Berber",10],["French",5]]],
   ["Tunisia","9m",[["Arabic",90],["Berber",5],["French",5]]],
  ],
  "East Africa": [
   ["Burundi","6m",[["Native",50],["French",35],["Swahili",5],["Arabic",5]]],
   ["Central African Republic","3m",[["Native",45],["French",44],["Swahili",5],["Arabic",10]]],
   ["Chad","8m",[["Arabic",45],["French",25],["Native",30]]],
   ["Eritrea","4m",[["Arabic",45],["Native",55]]],
   ["Ethiopia","64m",[["Arabic",45],["Native",50],["British",5]]],
   ["Kenya","30m",[["Swahili",40],["British",10],["Kikuyu",15],["Kisii",5],["Luo",10],["Native",17],["Arabic",5]]],
   ["Madagascar","15m",[["French",50],["Malay",25],["Indonesian",20],["Arabic",5]]],
   ["Mozambique","19m",[["Portuguese",40],["Native",55],["Arabic",15]]],
   ["Rwanda","7m",[["Native",79],["Twa",1],["French",10],["British",5],["Swahili",5]]],
   ["Somalia","7m",[["Arabic",45],["Somali",51],["Italian",2],["British",2]]],
   ["Sudan","35m",[["Arabic",45],["Native",52],["British",3]]],
   ["Tanzania","35m",[["Arabic",30],["Swahili",20],["Native",40],["British",10]]],
   ["Uganda","23m",[["Baganda",15],["Karamojong",10],["Native",45],["British",24],["Swahili",11],["Arabic",5]]],
  ],
  "South Africa": [
   ["Botswana","1m",[["British",40],["Tswana",60]]],
   ["Lesotho","2m",[["British",30],["Sesotho",70]]],
   ["Malawi","10m",[["British",30],["Native",55],["Arabic",15]]],
   ["Namibia","1m",[["German",20],["Dutch",20],["Native",55],["British",5]]],
   ["South Africa","43m",[["Dutch",20],["British",10],["Native",65],["Indian",4],["Arabic",2]]],
   ["Swaziland","1m",[["British",30],["Native",70]]],
   ["Zambia","9m",[["British",30],["Native",51],["Indian",10],["Arabic",10]]],
   ["Zimbabwe","11m",[["British",20],["Shona",55],["Native",25]]],
  ],
  "West Africa": [
   ["Angola","10m",[["Portuguese",30],["Native",70]]],
   ["Benin","6m",[["French",30],["Yoruba",10],["Native",50],["Arabic",10]]],
   ["Burkina Faso","11m",[["French",30],["Native",40],["Arabic",30]]],
   ["Cameroon","15m",[["Native",70],["British",10],["French",10],["Arabic",10]]],
   ["Congo, Democratic Republic","21m",[["Native",70],["French",20],["Swahili",5],["Arabic",5]]],
   ["Congo, Republic","2m",[["Native",75],["French",22],["Arabic",3]]],
   ["Gabon","1m",[["French",30],["Native",70]]],
   ["Gambia","1m",[["British",20],["Native",50],["Arabic",30]]],
   ["Ghana","19m",[["British",20],["Ewe",10],["Native",54],["Arabic",16]]],
   ["Guinea-Bissau","1m",[["Portuguese",15],["Native",60],["Arabic",25]]],
   ["Ivory Coast","15m",[["Arabic",40],["French",25],["Native",35]]],
   ["Liberia","3m",[["British",15],["Native",75],["Arabic",10]]],
   ["Mali","10m",[["French",15],["Native",55],["Arabic",30]]],
   ["Mauritania","2m",[["French",5],["Native",60],["Arabic",35]]],
   ["Niger","10m",[["French",20],["Native",50],["Arabic",30]]],
   ["Nigeria","123m",[["British",15],["Yoruba",15],["Ibo",15],["Native",25],["Arabic",30]]],
   ["Senegal","9m",[["French",20],["Native",55],["Arabic",30]]],
   ["Sierra Leone","5m",[["British",30],["Native",50],["Arabic",20]]],
   ["Togo","5m",[["French",20],["Ewe",8],["Native",67],["Arabic",5]]],
  ],
 },
 "America": {
  "North America": [
   ["Canada","31m",[["British",65],["French",25],["German",4],["Italian",2],["Amerindian",2],["Russian",1],["Chinese",1],["Dutch",1]]],
   ["Mexico","100m",[["Spanish",95],["Native",5]]],
   ["United States","275m",[["British",76],["Spanish",6],["Italian",4],["Irish",2],["German",2],["French",2],["Jewish",2],["Chinese",1],["Arabic",1],["Norwegian",1],["Dutch",1],["Indian",1],["Amerindian",1]]],
  ],
  "Central America": [
   ["Costa Rica","3m",[["Spanish",96],["British",2],["Native",1],["Chinese",1]]],
   ["Cuba","11m",[["Spanish",99],["Chinese",1]]],
   ["Dominican Republic","8m",[["Spanish",100]]],
   ["El Salvador","6m",[["Spanish",99],["Native",1]]],
   ["Guatemala","12m",[["Spanish",60],["Native",40]]],
   ["Haiti","6m",[["French",100]]],
   ["Honduras","6m",[["Spanish",94],["Native",6]]],
   ["Jamaica","2m",[["British",97],["Indian",3]]],
   ["Nicaragua","4m",[["Spanish",95],["Native",5]]],
   ["Panama","2m",[["Spanish",80],["British",15],["Native",5]]],
   ["Puerto Rico","3m",[["Spanish",85],["British",15]]],
   ["Trinidad & Tobago","1m",[["British",55],["Indian",40],["Arabic",4],["French",1],["Spanish",1],["Chinese",1]]],
  ],
  "South America": [
   ["Argentina","36m",[["Spanish",75],["Italian",9],["German",5],["British",3],["French",3],["Native",3],["Jewish",2]]],
   ["Bolivia","8m",[["Spanish",45],["Quechua",30],["Aymara",25]]],
   ["Brazil","172m",[["Portuguese",80],["Spanish",9],["British",2],["French",2],["German",2],["Italian",2],["Polish",2],["Native",1]]],
   ["Chile","15m",[["Spanish",96],["German",1],["Native",3]]],
   ["Colombia","39m",[["Spanish",97],["Native",3]]],
   ["Ecuador","12m",[["Spanish",80],["Quechua",17],["Native",3]]],
   ["Paraguay","5m",[["Spanish",90],["Guarani",10]]],
   ["Peru","27m",[["Spanish",55],["Quechua",30],["Aymara",12],["Japanese",2],["Chinese",1]]],
   ["Uruguay","3m",[["Spanish",90],["Portuguese",10]]],
   ["Venezuela","23m",[["Spanish",97],["Native",3]]],
  ],
 },
 "Asia": {
  "North Asia": [
   ["China","1261m",[["Chinese",95],["Tibetan",2],["Korean",1],["Mongol",1],["Arabic",1]]],
   ["Japan","126m",[["Japanese",99],["Korean",1]]],
   ["Hong Kong","7m",[["Chinese",85],["British",15]]],
   ["Korea, North","21m",[["Korean",99],["Chinese",1]]],
   ["Korea, South","47m",[["Korean",99],["British",1]]],
   ["Mongolia","2m",[["Mongol",90],["Russian",5],["Tibetan",4],["Arabic",1]]],
   ["Taiwan","22m",[["Chinese",99],["British",1]]],
  ],
  "South Asia": [
   ["Afghanistan","25m",[["Arabic",95],["Native",5]]],
   ["Bangladesh","129m",[["British",5],["Indian",30],["Arabic",65]]],
   ["Bhutan","2m",[["Indian",45],["Tibetan",55]]],
   ["Burma","41m",[["Burmese",80],["Native",15],["Chinese",3],["Arabic",2]]],
   ["Cambodia","12m",[["Khmer",95],["French",3],["British",1],["Chinese",1]]],
   ["India","1014m",[["British",10],["Indian",75],["Sikh",2],["Mongol",2],["Arabic",10]]],
   ["Indonesia","224m",[["Malay",45],["Arabic",42],["Indian",8],["Dutch",3],["British",2]]],
   ["Laos","5m",[["Lao",85],["French",12],["British",2],["Chinese",1]]],
   ["Malaysia","21m",[["Malay",45],["Arabic",26],["Chinese",17],["Indian",7],["British",5]]],
   ["Mauritius","1m",[["British",20],["French",20],["Indian",50],["Arabic",10]]],
   ["Nepal","24m",[["Indian",75],["Tibetan",20],["Native",4],["Arabic",1]]],
   ["Pakistan","141m",[["British",5],["Indian",20],["Native",10],["Arabic",65]]],
   ["Philippines","81m",[["Pilipino",70],["British",25],["Arabic",4],["Chinese",1]]],
   ["Singapore","4m",[["Chinese",65],["British",15],["Malay",9],["Indian",6],["Arabic",5]]],
   ["Sri Lanka","19m",[["British",5],["Sinhala",75],["Tamil",15],["Arabic",5]]],
   ["Thailand","61m",[["Thai",80],["Chinese",15],["British",2],["Arabic",3]]],
   ["Vietnam","78m",[["Vietnamese",90],["Chinese",3],["Khmer",4],["French",2],["British",1]]],
  ],
 },
 "Britain": {
  "Britain": [
   ["Ireland","3m",[["Irish",85],["English",15]]],
   ["United Kingdom","59m",[["English",82],["Scottish",9],["Irish",4],["Welsh",2],["Indian",2],["Arabic",1]]],
  ],
 },
 "Europe": {
  "West Europe": [
   ["Albania","3m",[["Albanian",85],["Arabic",7],["Greek",5],["Serbo-Croat",2],["Gypsy",2]]],
   ["Austria","8m",[["German",97],["Hungarian",2],["Gypsy",1]]],
   ["Belgium","10m",[["Dutch",58],["French",32],["German",10]]],
   ["Bosnia-Herzegovina","3m",[["Serbo-Croat",100]]],
   ["Croatia","4m",[["Serbo-Croat",99],["Hungarian",1]]],
   ["Czech Republic","10m",[["Czech",95],["Slovak",5]]],
   ["Denmark","5m",[["Danish",99],["Turkish",1]]],
   ["France","59m",[["French",99],["Arabic",1]]],
   ["Germany","82m",[["German",95],["Turkish",2],["Italian",1],["Serbo-Croat",1],["Arabic",1]]],
   ["Greece","10m",[["Greek",99],["Arabic",1]]],
   ["Hungary","10m",[["Hungarian",91],["Gypsy",4],["German",3],["Serbo-Croat",2]]],
   ["Italy","57m",[["Italian",99],["German",1]]],
   ["Macedonia","2m",[["Bulgarian",67],["Albanian",23],["Arabic",2],["Turkish",4],["Serbo-Croat",2],["Gypsy",2]]],
   ["Netherlands","15m",[["Dutch",97],["Turkish",2],["Arabic",1]]],
   ["Norway","4m",[["Norwegian",100]]],
   ["Poland","38m",[["Polish",98],["German",1],["Russian",1]]],
   ["Portugal","10m",[["Portuguese",100]]],
   ["Serbia & Montenegro","10m",[["Serbo-Croat",95],["Albanian",4],["Arabic",1]]],
   ["Slovakia","5m",[["Slovak",88],["Hungarian",10],["Czech",1],["Gypsy",1]]],
   ["Slovenia","1m",[["Slovenian",93],["Serbo-Croat",6],["Hungarian",1]]],
   ["Spain","39m",[["Spanish",98],["Basque",2]]],
   ["Sweden","8m",[["Swedish",97],["Finnish",3]]],
   ["Switzerland","7m",[["German",70],["French",19],["Italian",10],["Spanish",1]]],
  ],
  "East Europe": [
   ["Armenia","3m",[["Armenian",95],["Arabic",3],["Russian",2]]],
   ["Azerbaijan","7m",[["Arabic",92],["Russian",6],["Armenian",2]]],
   ["Belarus","10m",[["Byelorussian",79],["Russian",17],["Polish",4]]],
   ["Bulgaria","7m",[["Bulgarian",90],["Turkish",7],["Gypsy",3]]],
   ["Estonia","1m",[["Estonian",66],["Russian",33],["Finnish",1]]],
   ["Finland","5m",[["Finnish",94],["Swedish",6]]],
   ["Georgia","5m",[["Russian",83],["Armenian",7],["Arabic",10]]],
   ["Kazakhstan","16m",[["Kazakh",40],["Russian",30],["Arabic",24],["German",3],["Uzbek",3]]],
   ["Kyrgyzstan","4m",[["Kirghiz",50],["Russian",18],["Uzbek",12],["Arabic",19],["German",1]]],
   ["Latvia","2m",[["Latvian",58],["Russian",40],["Polish",2]]],
   ["Lithuania","3m",[["Lithuanian",83],["Russian",10],["Polish",7]]],
   ["Moldovia","4m",[["Romanian",75],["Russian",22],["Bulgarian",2],["Jewish",1]]],
   ["Romania","22m",[["Romanian",88],["Hungarian",8],["Gypsy",3],["German",1]]],
   ["Russia","146m",[["Russian",95],["Mongol",4],["Arabic",1]]],
   ["Tajikistan","6m",[["Tajik",65],["Uzbek",25],["Arabic",7],["Russian",3]]],
   ["Turkmenistan","4m",[["Turkmen",77],["Arabic",6],["Uzbek",9],["Russian",6],["Kazakh",2]]],
   ["Ukraine","49m",[["Russian",95],["Romanian",2],["Polish",1],["Hungarian",1],["Jewish",1]]],
   ["Uzbekistan","24m",[["Uzbek",80],["Russian",5],["Tajik",5],["Kazakh",3],["Arabic",7]]],
  ],
 },
 "Middle East": {
  "Middle East": [
   ["Gaza Strip","1m",[["Arabic",99],["Jewish",1]]],
   ["Iran","65m",[["Arabic",99],["Turkish",1]]],
   ["Iraq","22m",[["Arabic",99],["Turkish",1]]],
   ["Israel","5m",[["Jewish",82],["Arabic",14],["Russian",2],["Romanian",1],["German",1]]],
   ["Jordan","4m",[["Arabic",99],["Armenian",1]]],
   ["Kuwait","2m",[["Arabic",91],["Indian",9]]],
   ["Lebanon","3m",[["Arabic",70],["French",26],["Armenian",4]]],
   ["Oman","2m",[["Arabic",85],["Indian",15]]],
   ["Saudi Arabia","22m",[["Arabic",100]]],
   ["Syria","16m",[["Arabic",96],["Armenian",4]]],
   ["Turkey","65m",[["Turkish",80],["Arabic",20]]],
   ["United Arab Emirates","2m",[["Arabic",87],["British",2],["Chinese",1],["Indian",10]]],
   ["West Bank","2m",[["Arabic",83],["Jewish",17]]],
   ["Yemen","17m",[["Arabic",98],["Somali",1],["Indian",1]]],
  ],
 },
 "Oceania": {
  "Oceania": [
   ["Australia","19m",[["British",92],["Irish",1],["Chinese",2],["Indian",1],["Greek",1],["Serbo-Croat",1],["Italian",1],["Arabic",1]]],
   ["New Zealand","3m",[["British",84],["Maori",6],["Irish",1],["Chinese",3],["Dutch",1],["Indian",2],["Polynesian",3]]],
   ["Papua New Guinea","4m",[["British",15],["Chinese",2],["Indian",2],["Spanish",1],["Papuan",80]]],
  ],
 },
};

// Source label -> real PROFILES culture key (only genuine matches; unmapped
// labels are dropped and their weight renormalized among what IS available).
const SOURCE_MAP = {
  Arabic: "Arabic", British: "English", English: "English", French: "French",
  Italian: "Italian", German: "German", Dutch: "Dutch", Portuguese: "Portuguese",
  Spanish: "Spanish", Russian: "Russian", Polish: "Polish", Chinese: "Chinese",
  Japanese: "Japanese", Korean: "Korean", Mongol: "Mongolian", Tibetan: "Tibetan",
  Indian: "Hindu", Sikh: "Hindu", Irish: "Irish", Scottish: "Scottish", Welsh: "Welsh",
  Jewish: "Jewish", Armenian: "Armenian", Finnish: "Finnish", Hungarian: "Hungarian",
  Gypsy: "Romani", Norwegian: "Norwegian", Amerindian: "Amerindian",
  Berber: "Berber", Papuan: "Papuan",
  // Region-specific resolution for the source doc's generic "Native" label.
  __NATIVE_AFRICA__: "African", __NATIVE_AMERICAS__: "Amerindian",
  // "Greek" in this table always means contemporary Greece/diaspora.
  Greek: "Modern Greek",
  // Loose regional-family proxies for cultures without their own corpus yet
  // (same spirit as the pre-existing ARABIC_PERSIAN pattern doing double duty
  // for both Arabic and Hebrew/Persian) - close enough family/geography, not
  // a claim of linguistic equivalence.
  "Serbo-Croat": "Slavic", Czech: "Slavic", Slovak: "Slavic", Slovenian: "Slavic",
  Bulgarian: "Slavic", Byelorussian: "Slavic", Romanian: "Italian",
  Danish: "Norwegian", Swedish: "Norwegian"
};
const NATIVE_REGION = {
  Africa: "__NATIVE_AFRICA__",
  America: "__NATIVE_AMERICAS__"
};

const out = {};
const unmapped = new Set();
for (const [region, subs] of Object.entries(DATA)) {
  for (const countries of Object.values(subs)) {
    for (const [country, pop, sources] of countries) {
      const resolved = [];
      for (const [label, pct] of sources) {
        let key = label === "Native" ? SOURCE_MAP[NATIVE_REGION[region]] : SOURCE_MAP[label];
        if (key) resolved.push([key, pct]);
        else unmapped.add(label);
      }
      out[country] = { region, pop, sources: resolved };
    }
  }
}

const zeroCoverage = Object.entries(out).filter(([, v]) => v.sources.length === 0).map(([k]) => k);
console.log("Unmapped source labels:", [...unmapped].sort().join(", "));
console.log("Countries with ZERO resolved sources:", zeroCoverage.join(", ") || "(none)");
console.log("Total countries:", Object.keys(out).length);

// Region label used for taxonomy grouping (merge Britain into Europe, matching
// how the historical genre already groups the British Isles alongside Europe).
const REGION_LABEL = {
  Africa: "Africa", America: "the Americas", Asia: "Asia",
  Britain: "Europe", Europe: "Europe", "Middle East": "the Middle East", Oceania: "Oceania"
};

const lines = [];
lines.push("/**");
lines.push(" * AUTO-GENERATED by tools/build-country-distribution.mjs - do not hand-edit.");
lines.push(" * Distilled from NameLists/People/00 World Naming Distribution.md (itself");
lines.push(" * distilled from Naming Rules.md's Appendix B). Each country lists its");
lines.push(" * real-world naming-culture mix as [PROFILES culture key, weight] pairs;");
lines.push(" * source-doc culture labels with no matching corpus/pattern in this module");
lines.push(" * yet are dropped here (see the source doc for the full, unfiltered picture).");
lines.push(" * Regenerate with: node tools/build-country-distribution.mjs");
lines.push(" */");
lines.push("");
lines.push("export const COUNTRY_DISTRIBUTION = {");
for (const [country, { region, pop, sources }] of Object.entries(out)) {
  const srcStr = sources.map(([k, w]) => `[${JSON.stringify(k)}, ${w}]`).join(", ");
  lines.push(`  ${JSON.stringify(country)}: { region: ${JSON.stringify(REGION_LABEL[region])}, pop: ${JSON.stringify(pop)}, sources: [${srcStr}] },`);
}
lines.push("};");
lines.push("");

import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.resolve(__dirname, "..", "scripts", "data", "generated");
mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(path.join(OUT_DIR, "country-distribution.mjs"), lines.join("\n"));
console.log("Wrote scripts/data/generated/country-distribution.mjs");
