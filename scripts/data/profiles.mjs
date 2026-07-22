/**
 * Maps every name-type value from generators.mjs to how it's actually
 * generated: a namegen-engine pattern, a Markov chain over a real name
 * corpus, or a word-bank composer for "thing" names.
 *
 * Fantasy-race and invented-culture patterns are hand-written using the
 * namegen-engine pattern syntax (see namegen-engine.mjs), several adapted
 * from the long-public example patterns at the RinkWorks Fantasy Name
 * Generator (rinkworks.com/namegen), the same reference skeeto/fantasyname
 * itself is modeled on. Real-world cultures with a bundled corpus
 * (English, Spanish, Norwegian - see corpora-data.mjs) use a Markov chain
 * instead for genuine authenticity; the rest use hand-tuned phoneme
 * patterns grouped by language family.
 */
import { compile } from "./namegen-engine.mjs";
import { trainMarkov, generateMarkovNameSafe } from "./markov.mjs";
import {
  ENGLISH_FIRST_NAMES, ENGLISH_SURNAMES,
  SPANISH_FIRST_NAMES, SPANISH_SURNAMES,
  NORWEGIAN_MALE_NAMES, NORWEGIAN_FEMALE_NAMES, NORWEGIAN_SURNAMES
} from "./corpora-data.mjs";
import * as composer from "./composer.mjs";

function capitalize(str) {
  return str.replace(/^./, c => c.toUpperCase());
}
function pattern(str) {
  return () => capitalize(String(compile(str)));
}

/* -------------------------------------------- */
/* Markov models, trained once at module load    */
/* -------------------------------------------- */

const MODELS = {
  englishFirst: trainMarkov(ENGLISH_FIRST_NAMES),
  englishSurname: trainMarkov(ENGLISH_SURNAMES),
  spanishFirst: trainMarkov(SPANISH_FIRST_NAMES),
  spanishSurname: trainMarkov(SPANISH_SURNAMES),
  norwegianMale: trainMarkov(NORWEGIAN_MALE_NAMES),
  norwegianFemale: trainMarkov(NORWEGIAN_FEMALE_NAMES),
  norwegianSurname: trainMarkov(NORWEGIAN_SURNAMES)
};

function markov(modelKey) {
  return () => generateMarkovNameSafe(MODELS[modelKey], "Alex");
}

/* -------------------------------------------- */
/* Fantasy race / creature patterns              */
/* -------------------------------------------- */

const ELVISH = "(|(<B>|s|h|ty|ph|r))(i|ae|ya|ae|eu|ia|i|eo|ai|a)(lo|la|sri|da|dai|the|sty|lae|due|li|lly|ri|na|ral|sur|rith)(|(su|nu|sti|llo|ria|))(|(n|ra|p|m|lis|cal|deu|dil|suir|phos|ru|dru|rin|raap|rgue))";
const DWARVISH = "(taith|kach|chak|kank|kjar|rak|kan|kaj|tach|rskal|kjol|jok|jor|jad|kot|kon|knir|kror|kol|tul|rhaok|rhak|krol|jan|kag|ryr)(<vc>|in|or|an|ar|och|un|mar|yk|ja|arn|ir|ros|ror)(|(mund|ard|arn|karr|chim|kos|rir|arl|kni|var|an|in|ir|a|i|as))";
const HALFLING = "!<B><v>(kin|foot|wise|weed|bottle|garden|berry|bloom)";
const ORCISH = "(aj|ch|etz|etzl|tz|kal|gahn|kab|aj|izl|ts|jaj|lan|kach|chaj|qaq|jol|ix|az|biq|nam)(|(<vc>|aw|al|yes|il|ay|en|tom||oj|im|ol|aj|an|as))(aj|am|al|aqa|ende|elja|ich|ak|ix|in|ak|al|il|ek|ij|os|al|im)";
const DROW = "(Zar|Vel|Quar|Xil|Nym|Dra|Ilv|Vhael)(a|i|ae|y)(neth|riss|zra|lith|dara|wyn|xir)";
const DRACONIC = "(Vor|Bahl|Thra|Kael|Xar|Zeph|Or|Faer)(<v>|ax|yr)(thys|grim|orion|vex|drak|mordan)";
const CELESTIAL = "(Ser|Ara|Eli|Uri|Sar|Mich|Gabri|Ophan)(<v>|el|ael)(iel|on|us|ael|eth)";
const FIENDISH = "(Az|Bel|Mal|Xe|Vas|Bael|Mor|Nax)(<v>|ra|zu)(zael|thoth|grath|mox|riel|ix)";

/* -------------------------------------------- */
/* Historical / invented-culture families        */
/* -------------------------------------------- */

const LATIN = { pattern: "(Mar|Luci|Octa|Corn|Vale|Fla|Aur|Juli)(<v>|us|ius)(an|in|or|ell)", town: ["ia", "um", "opolis"] };
const GREEK = { pattern: "<s<v|V>(tia)|s<v|V>(os)|B<v|V>c(ios)|B<v|V><c|C>v(ios|os)>", town: ["polis", "os"] };
const CELTIC = { pattern: "(Bri|Ca|Fer|Gwyn|Ma|Ro|Ta|Bran)(<v>|dd|th)(wen|an|og|ick|ha)", town: ["dun", "caer"] };
const GERMANIC_HARD = { pattern: "(Wulf|Grim|Bran|Aeth|Sig|Rag|Hilde|Os)(<v>)(gar|ric|wine|mund|helm|stan)", town: ["burg", "ton", "stead"] };
const FRENCH = { pattern: "(Je|Lu|Cha|Ma|Fra|Phi|Gui|Ber)(<v>)(mont|ard|ien|elle|eau|ette)", town: ["ville", "eaux"] };
const SLAVIC = { pattern: "(Bor|Vla|Rad|Mil|Yar|Sve|Kaz|Vse)(<v>)(slav|mir|an|ovich|ek)", town: ["grad", "ov"] };
const SEMITIC_ANCIENT = { pattern: "(Nab|Sar|Bel|Ish|Enk|Mar|Gil|Utu)(<v>)(esh|dur|apla|amun|abal)", town: ["ur", "abad"] };
const ARABIC_PERSIAN = { pattern: "(Ab|Ha|Ka|Ra|Ya|Za|Fa|Ja)(<v>)(sim|eem|dar|far|mal|shid)", town: ["abad", "stan"] };
const EGYPTIAN = { pattern: "(Ka|Ra|Nef|Ame|Tut|Se|Ho|Ay)(<v>)(mose|hotep|ankh|nakht|si)", town: ["polis", "et"] };
const CHINESE = { pattern: "(zh|x|q|sh|h)(ao|ian|uo|ou|ia)(|(l|w|c|p|b|m)(ao|ian|uo|ou|ia)(|n)|-(l|w|c|p|b|m)(ao|ian|uo|ou|ia)(|(d|j|q|l)(a|ai|iu|ao|i)))", town: ["fu", "zhou"] };
const JAPANESE = { pattern: "(aka|aki|bashi|gawa|kawa|furu|fuku|fuji|hana|hara|haru|hashi|hira|hon|hoshi|ichi|iwa|kami|ki|kita|kuchi|kuro|matsu|miya|mori|moto|mura|naka|nishi|oka|saka|saki|sawa|shima|suzu|taka|take|toku|toyo|ue|wara|wata|yama|yoshi)(|(bashi|gawa|kawa|hana|hara|hashi|hon|hoshi|chi|wa|ka|kami|kita|kuro|matsu|miya|mori|moto|mura|naka|nishi|oka|saka|saki|sawa|shima|suzu|taka|take|toku|toyo|ue|wara|wata|yama|yoshi))", town: ["do", "machi"] };
const HINDU = { pattern: "(Ra|Sha|Kri|Ar|Su|Vi|De|Pri)(<v>)(esh|ya|ish|it|ka|van)", town: ["pur", "nagar"] };
const MONGOLIAN = { pattern: "(Bat|Gan|Tem|Khu|Sukh|Od|Bold|Chu)(<v>)(bataar|jin|gerel|ren|uren)", town: ["baatar", "gol"] };
const AFRICAN = { pattern: "(Ka|Mo|Ta|Ba|Ndo|Ma|Ke|Om)(<v>)(mba|ni|le|si|ye|to)", town: ["bo", "la"] };
const MESOAMERICAN = { pattern: "(Tla|Cuau|Xo|Ita|Tona|Yao|Huit|Ata)(<v>)(huatl|coatl|zin|tepec|hualpa)", town: ["tlan", "apan"] };
const NORTH_AMERICAN = { pattern: "(Ma|Ta|Chi|Wa|Oki|Nan|Aya|Hon)(<v>)(nabi|ska|honto|wea|kwa)", town: ["wa", "tan"] };

function familyName(family) {
  return () => capitalize(String(compile(family.pattern)));
}
function familyTown(family) {
  return () => composer.townFromPattern(family.pattern, family.town);
}

/* -------------------------------------------- */
/* Sci-fi / other-genre alien patterns           */
/* -------------------------------------------- */

const ALIEN_HARSH = "(Grr|Uzg|Mog|Dush|Gnar|Krug|Vrag|Rok|Thok)(<v>)(nak|gash|ug|rok|dum|zog|mora)";
const ALIEN_SOFT = "(Bo|Chi|Ith|Mon|Qua|Sul|Nym|Vel)(<v>)(ren|ala|ith|ossa|una|iel)";
const ALIEN_EXOTIC = "(Du|Ro|Twi|Xi|Zha|Vor|Ky)(<v>)(rax|lek|dun|essa|thir)";
const RUSSIAN = "(Vla|Dmi|Iva|Ser|Bor|Nik|Ale|Mik)(<v>)(slav|tri|nov|ovich|enko)";
const NAVI = "(Ney|Tsu|Ey|Jak|Ne|Mo|Tsa)(<v>)('ite|kaya|kan|ari)";
const MYTHOS = "(N'|Yog|Ch'|Az|Xu|Hy|Shu)(<v>)(thoth|gguah|athur|oggua|urath|olom)";
const PERN_DRAGON = "<<s|ss>|<VC|vC|B|BVs|Vs>><v|V|v|<v(l|n|r)|vc>>(th)";
const PERN_HUMAN = "(F'|R'|T'|N'|Le|Ro|Bre|Man)(<v>)(lar|ora|nan|kar|ith|essa)";

/* -------------------------------------------- */
/* Type value -> generator function              */
/* -------------------------------------------- */

const GENERIC_HUMAN = markov("englishFirst");

const CULTURE_FAMILIES = {
  Babylonian: SEMITIC_ANCIENT, Celtic: CELTIC, Egyptian: EGYPTIAN, Greek: GREEK,
  Roman: LATIN, Sumerian: SEMITIC_ANCIENT,
  French: FRENCH, German: GERMANIC_HARD, Italian: LATIN, Saxon: GERMANIC_HARD, Slavic: SLAVIC,
  Arabic: ARABIC_PERSIAN, Chinese: CHINESE, Hebrew: ARABIC_PERSIAN, Hindu: HINDU,
  Japanese: JAPANESE, Mongolian: MONGOLIAN, Persian: ARABIC_PERSIAN,
  Congolese: AFRICAN, Ethiopian: AFRICAN, Malian: AFRICAN,
  Algonquin: NORTH_AMERICAN, Aztec: MESOAMERICAN, Inkan: MESOAMERICAN,
  Inuit: NORTH_AMERICAN, Navajo: NORTH_AMERICAN, Sioux: NORTH_AMERICAN
};

const PROFILES = {
  // Fantasy: Common
  "Human Male": GENERIC_HUMAN, "Human Female": GENERIC_HUMAN,
  "Human Town": () => composer.townFromSurname(markov("englishSurname")),
  "Dwarvish Male": pattern(DWARVISH), "Dwarvish Female": pattern(DWARVISH),
  "Dwarvish Town": () => composer.townFromPattern(DWARVISH, ["gard", "hall", "delve"]),
  "Elvish Male": pattern(ELVISH), "Elvish Female": pattern(ELVISH),
  "Elvish Town": () => composer.townFromPattern(ELVISH, ["ithil", "wyn", "lorien"]),
  "Halfling Male": pattern(HALFLING), "Halfling Female": pattern(HALFLING),
  "Halfling Town": () => composer.townFromPattern(HALFLING, ["bottom", "burrow", "hollow"]),
  // Fantasy: Monstrous
  "Draconic Male": pattern(DRACONIC), "Draconic Female": pattern(DRACONIC),
  "Drow Male": pattern(DROW), "Drow Female": pattern(DROW),
  "Drow Town": () => composer.townFromPattern(DROW, ["reth", "aveth"]),
  "Orcish Male": pattern(ORCISH), "Orcish Female": pattern(ORCISH),
  "Orcish Town": () => composer.townFromPattern(ORCISH, ["gash", "mok"]),
  // Fantasy: Outsider
  "Celestial": pattern(CELESTIAL), "Fiendish": pattern(FIENDISH), "Modron": () => composer.designation(3, 3),
  "Air Elemental": pattern("(Zeph|Aer|Sylph|Wisp)<v>(ion|ael|yx)"),
  "Earth Elemental": pattern("(Ter|Grond|Stone|Boul)<v>(ok|dur|mek)"),
  "Fire Elemental": pattern("(Ign|Pyr|Cinder|Ember)<v>(ax|rax|flar)"),
  "Water Elemental": pattern("(Undin|Naia|Mar|Aqua)<v>(is|wyn|lir)"),
  // Fantasy Setting
  "Party": composer.groupName, "Ship": composer.shipName, "Deity": () => composer.epithetName(CELESTIAL),
  "Festival": composer.festivalName, "Blasphemy": composer.blasphemyName, "War": composer.warName,
  "Tome": composer.tomeName, "Weapon": () => composer.epithetName(ELVISH),
  "Kingdom": composer.compoundPlaceName, "Stronghold": composer.compoundPlaceName,
  "Dungeon": composer.compoundPlaceName, "Geography": composer.compoundPlaceName,
  "Planar Location": composer.compoundPlaceName, "City": composer.compoundPlaceName,
  "Ward": composer.wardName, "Street": composer.streetName, "Inn": composer.innName,
  // Sci-Fi: Cyberpunk
  "Modern Male": GENERIC_HUMAN, "Modern Female": GENERIC_HUMAN,
  "Russian Male": pattern(RUSSIAN), "Russian Female": pattern(RUSSIAN),
  "Netrunner": composer.netrunnerHandle, "MegaCorp": composer.megaCorpName,
  "Cyberpunk Location": composer.compoundPlaceName,
  // Sci-Fi: Space
  "Terran Male": GENERIC_HUMAN, "Terran Female": GENERIC_HUMAN, "Alien": pattern(ALIEN_EXOTIC),
  "FTL Drive": composer.technobabbleName, "Spaceship": composer.shipName,
  "Space Location": composer.compoundPlaceName, "SciFi World": composer.planetName, "Star": composer.starName,
  // Sci-Fi: Serenity
  "Serenity Male": GENERIC_HUMAN, "Serenity Female": GENERIC_HUMAN,
  "Serenity Spaceship": composer.shipName, "Serenity Alliance Spaceship": composer.shipName,
  "Serenity Location": composer.compoundPlaceName, "Serenity World": composer.planetName,
  // Sci-Fi: Star Trek
  "Star Trek Male": GENERIC_HUMAN, "Star Trek Female": GENERIC_HUMAN,
  "Andorian Male": pattern(ALIEN_SOFT), "Andorian Female": pattern(ALIEN_SOFT),
  "Cardassian Male": pattern(ALIEN_HARSH), "Cardassian Female": pattern(ALIEN_HARSH),
  "Klingon Male": pattern(ALIEN_HARSH), "Klingon Female": pattern(ALIEN_HARSH),
  "Romulan Male": pattern(ALIEN_SOFT), "Romulan Female": pattern(ALIEN_SOFT),
  "Tellarite": pattern(ALIEN_HARSH),
  "Vulcan Male": pattern(ALIEN_SOFT), "Vulcan Female": pattern(ALIEN_SOFT),
  "Borg": () => composer.designation(1, 4),
  "Star Trek Location": composer.compoundPlaceName, "Star Trek Planet": composer.planetName,
  "Star Trek Technology": composer.technobabbleName,
  // Sci-Fi: Star Wars
  "Star Wars Male": GENERIC_HUMAN, "Star Wars Female": GENERIC_HUMAN,
  "Bothan": pattern(ALIEN_SOFT), "Chiss": pattern(ALIEN_SOFT), "Duros": pattern(ALIEN_EXOTIC),
  "Gamorrean": pattern(ALIEN_HARSH), "Hutt": pattern(ALIEN_HARSH), "Ithorian": pattern(ALIEN_SOFT),
  "Mon Calamari": pattern(ALIEN_SOFT), "Quarren": pattern(ALIEN_SOFT), "Rodian": pattern(ALIEN_EXOTIC),
  "Sullustan": pattern(ALIEN_SOFT), "Trandoshan": pattern(ALIEN_HARSH), "Twilek": pattern(ALIEN_EXOTIC),
  "Wookiee": pattern(ALIEN_HARSH), "Droid": () => composer.designation(2, 1),
  "Star Wars Location": composer.compoundPlaceName, "Star Wars Planet": composer.planetName,
  // Sci-Fi: Miscellany
  "Navi Male": pattern(NAVI), "Navi Female": pattern(NAVI),
  "Centauri": pattern(ALIEN_SOFT), "Minbari": pattern(ALIEN_SOFT), "Narn": pattern(ALIEN_HARSH),
  "Abh Male": pattern(ALIEN_EXOTIC), "Abh Female": pattern(ALIEN_EXOTIC),
  "Pern Male": pattern(PERN_HUMAN), "Pern Female": pattern(PERN_HUMAN), "Pern Dragon": pattern(PERN_DRAGON),
  // Cthulhu Mythos
  "Investigator Male": GENERIC_HUMAN, "Investigator Female": GENERIC_HUMAN,
  "Eldritch": pattern(MYTHOS), "Mythos Tome": composer.mythosTomeName,
  // Alien RPG
  "Alien RPG Male": GENERIC_HUMAN, "Alien RPG Female": GENERIC_HUMAN,
  "Alien RPG ICC": () => composer.designation(3, 4, "ICC-"),
  "Alien RPG Planet": composer.planetName, "Alien RPG Star": composer.starName,
  // Blade Runner
  "BR Male": GENERIC_HUMAN, "BR Female": GENERIC_HUMAN,
  "BR Bar": composer.innName, "BR Corporation": composer.megaCorpName,
  // Avatar Legends
  "Air Nomad Male": pattern("(Aa|Ai|Te|Gyat|Meng|Pas|Ten)(<v>)(so|zin|lo|ang|ho)"),
  "Air Nomad Female": pattern("(Aa|Ai|Te|Gyat|Meng|Pas|Ten)(<v>)(so|zin|lo|ang|ho)"),
  "Earth Kingdom Male": pattern("(Ba|Tho|Kuo|Long|Song|Hai|Kai)(<v>)(shi|feng|kang|hong|tao)"),
  "Earth Kingdom Female": pattern("(Ba|Tho|Kuo|Long|Song|Hai|Kai)(<v>)(shi|feng|kang|hong|tao)"),
  "Fire Nation Male": pattern("(Zu|Az|Oz|Ig|Shy|Miz|Roz)(<v>)(ko|lan|zin|ren|dan)"),
  "Fire Nation Female": pattern("(Zu|Az|Oz|Ig|Shy|Miz|Roz)(<v>)(ko|lan|zin|ren|dan)"),
  "Water Tribe Male": pattern("(Sok|Kat|Hah|Pak|Ar|Bat|Yue)(<v>)(ka|na|nuk|luk|siq)"),
  "Water Tribe Female": pattern("(Sok|Kat|Hah|Pak|Ar|Bat|Yue)(<v>)(ka|na|nuk|luk|siq)"),
  "United Republic Male": GENERIC_HUMAN, "United Republic Female": GENERIC_HUMAN,
  "Earth Kingdom Village": composer.compoundPlaceName,
  "Fire Nation Village": composer.compoundPlaceName,
  "Water Tribe Village": composer.compoundPlaceName
};

// Historical / real-world cultures (Male/Female/Town), programmatically
// filled in from CULTURE_FAMILIES so every culture in generators.mjs
// gets consistent treatment.
for (const [culture, family] of Object.entries(CULTURE_FAMILIES)) {
  PROFILES[`${culture} Male`] = familyName(family);
  PROFILES[`${culture} Female`] = familyName(family);
  PROFILES[`${culture} Town`] = familyTown(family);
}

// Real-corpus Markov overrides (higher authenticity than a hand-written pattern).
PROFILES["English Male"] = markov("englishFirst");
PROFILES["English Female"] = markov("englishFirst");
PROFILES["English Town"] = () => composer.townFromSurname(markov("englishSurname"));
PROFILES["Spanish Male"] = markov("spanishFirst");
PROFILES["Spanish Female"] = markov("spanishFirst");
PROFILES["Spanish Town"] = () => composer.townFromSurname(markov("spanishSurname"));
PROFILES["Norse Male"] = markov("norwegianMale");
PROFILES["Norse Female"] = markov("norwegianFemale");
PROFILES["Norse Town"] = () => composer.townFromSurname(markov("norwegianSurname"));

// Japanese Castle uses the same family as Japanese Male/Female/Town.
PROFILES["Japanese Castle"] = familyTown(JAPANESE);

// Cthulhu Mythos "Foreign" group reuses the same historical culture profiles.
for (const culture of ["Arabic", "Aztec", "Chinese", "Egyptian", "Sumerian"]) {
  PROFILES[`${culture} Male`] ??= familyName(CULTURE_FAMILIES[culture]);
  PROFILES[`${culture} Female`] ??= familyName(CULTURE_FAMILIES[culture]);
}

/**
 * @param {string} type  A donjon-style type value from generators.mjs.
 * @returns {() => string} A zero-argument function producing one name.
 */
export function getProfile(type) {
  return PROFILES[type] ?? GENERIC_HUMAN;
}
