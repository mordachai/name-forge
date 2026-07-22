/**
 * The Genre -> Category -> Name Type taxonomy this module's UI is built
 * around, originally modeled on donjon.bin.sh's name generator layout.
 *
 * Every option's `value` is the exact key scripts/data/profiles.mjs uses
 * to look up how that name type is generated (see getProfile()).
 *
 * Genres with a single category (Cthulhu Mythos, Alien RPG, Blade Runner,
 * Avatar Legends) have no category selector - the app skips straight from
 * Genre to the Name Type selector for those.
 */

export const GENRES = [
  {
    id: "fantasy",
    label: "Fantasy",
    categories: [
      {
        id: "com",
        label: "Common Names",
        groups: [
          { label: "Human", options: [
            { value: "Human Male", label: "Human Male Names" },
            { value: "Human Female", label: "Human Female Names" },
            { value: "Human Town", label: "Human Town Names" }
          ]},
          { label: "Dwarvish", options: [
            { value: "Dwarvish Male", label: "Dwarvish Male Names" },
            { value: "Dwarvish Female", label: "Dwarvish Female Names" },
            { value: "Dwarvish Town", label: "Dwarvish Town Names" }
          ]},
          { label: "Elvish", options: [
            { value: "Elvish Male", label: "Elvish Male Names" },
            { value: "Elvish Female", label: "Elvish Female Names" },
            { value: "Elvish Town", label: "Elvish Town Names" }
          ]},
          { label: "Halfling", options: [
            { value: "Halfling Male", label: "Halfling Male Names" },
            { value: "Halfling Female", label: "Halfling Female Names" },
            { value: "Halfling Town", label: "Halfling Town Names" }
          ]}
        ]
      },
      {
        id: "mon",
        label: "Monstrous Names",
        groups: [
          { label: "Draconic", options: [
            { value: "Draconic Male", label: "Draconic Male Names" },
            { value: "Draconic Female", label: "Draconic Female Names" }
          ]},
          { label: "Drow", options: [
            { value: "Drow Male", label: "Drow Male Names" },
            { value: "Drow Female", label: "Drow Female Names" },
            { value: "Drow Town", label: "Drow Town Names" }
          ]},
          { label: "Orcish", options: [
            { value: "Orcish Male", label: "Orcish Male Names" },
            { value: "Orcish Female", label: "Orcish Female Names" },
            { value: "Orcish Town", label: "Orcish Town Names" }
          ]}
        ]
      },
      {
        id: "out",
        label: "Outsider Names",
        groups: [
          { label: "Outsider", options: [
            { value: "Celestial", label: "Celestial Names" },
            { value: "Fiendish", label: "Fiendish Names" },
            { value: "Modron", label: "Modron Names" }
          ]},
          { label: "Elemental", options: [
            { value: "Air Elemental", label: "Air Elemental Names" },
            { value: "Earth Elemental", label: "Earth Elemental Names" },
            { value: "Fire Elemental", label: "Fire Elemental Names" },
            { value: "Water Elemental", label: "Water Elemental Names" }
          ]}
        ]
      },
      {
        id: "set",
        label: "Fantasy Setting",
        groups: [
          { label: "Entities", options: [
            { value: "Party", label: "Adventuring Parties" },
            { value: "Ship", label: "Ship Names" },
            { value: "Deity", label: "Deities and Demigods" }
          ]},
          { label: "Events", options: [
            { value: "Festival", label: "Festivals and Holy Days" },
            { value: "Blasphemy", label: "Blasphemous Rituals" },
            { value: "War", label: "Wars and Battles" }
          ]},
          { label: "Items", options: [
            { value: "Tome", label: "Books and Tomes" },
            { value: "Weapon", label: "Weapon Names" }
          ]},
          { label: "Locations", options: [
            { value: "Kingdom", label: "Kingdom Names" },
            { value: "Stronghold", label: "Castle Names" },
            { value: "Dungeon", label: "Dungeon Names" },
            { value: "Geography", label: "Wilderness Locations" },
            { value: "Planar Location", label: "Planar Locations" }
          ]},
          { label: "Towns and Cities", options: [
            { value: "City", label: "Towns and Cities" },
            { value: "Ward", label: "Ward Names" },
            { value: "Street", label: "Street Names" },
            { value: "Inn", label: "Inns and Taverns" }
          ]}
        ]
      }
    ]
  },
  {
    id: "historical",
    label: "Historical / Real-World",
    categories: [
      {
        id: "aw",
        label: "Ancient World",
        groups: makeMFT(["Babylonian", "Celtic", "Egyptian", "Greek", "Roman", "Sumerian"])
      },
      {
        id: "me",
        label: "Medieval Europe",
        groups: makeMFT(["English", "French", "German", "Italian", "Norse", "Saxon", "Slavic", "Spanish"])
      },
      {
        id: "as",
        label: "Asia and the Far East",
        groups: [
          ...makeMFT(["Arabic", "Chinese", "Hebrew", "Hindu"]),
          { label: "Japanese", options: [
            { value: "Japanese Male", label: "Japanese Male Names" },
            { value: "Japanese Female", label: "Japanese Female Names" },
            { value: "Japanese Town", label: "Japanese Town Names" },
            { value: "Japanese Castle", label: "Japanese Castle Names" }
          ]},
          ...makeMFT(["Mongolian", "Persian"])
        ]
      },
      {
        id: "af",
        label: "Africa",
        groups: makeMFT(["Congolese", "Egyptian", "Ethiopian", "Malian"])
      },
      {
        id: "nw",
        label: "New World",
        groups: makeMFT(["Algonquin", "Aztec", "Inkan", "Inuit", "Navajo", "Sioux"])
      }
    ]
  },
  {
    id: "scifi",
    label: "Sci-Fi",
    categories: [
      {
        id: "cp",
        label: "Cyberpunk",
        groups: [
          { label: "Character", options: [
            { value: "Modern Male", label: "Modern Male Names" },
            { value: "Modern Female", label: "Modern Female Names" },
            { value: "Chinese Male", label: "Chinese Male Names" },
            { value: "Chinese Female", label: "Chinese Female Names" },
            { value: "Japanese Male", label: "Japanese Male Names" },
            { value: "Japanese Female", label: "Japanese Female Names" },
            { value: "Russian Male", label: "Russian Male Names" },
            { value: "Russian Female", label: "Russian Female Names" },
            { value: "Netrunner", label: "Netrunner Handles" }
          ]},
          { label: "Setting", options: [
            { value: "MegaCorp", label: "MegaCorp Names" },
            { value: "Cyberpunk Location", label: "Locations" }
          ]}
        ]
      },
      {
        id: "sx",
        label: "Space",
        groups: [
          { label: "Character", options: [
            { value: "Terran Male", label: "Terran Male Names" },
            { value: "Terran Female", label: "Terran Female Names" },
            { value: "Alien", label: "Alien Names" }
          ]},
          { label: "Setting", options: [
            { value: "FTL Drive", label: "FTL Drives" },
            { value: "Spaceship", label: "Spaceship Names" },
            { value: "Space Location", label: "Locations" },
            { value: "SciFi World", label: "Planet Names" },
            { value: "Star", label: "Star Names" }
          ]}
        ]
      },
      {
        id: "ff",
        label: "Serenity",
        groups: [
          { label: "Character", options: [
            { value: "Serenity Male", label: "Male Names" },
            { value: "Serenity Female", label: "Female Names" }
          ]},
          { label: "Setting", options: [
            { value: "Serenity Spaceship", label: "Spaceship Names" },
            { value: "Serenity Alliance Spaceship", label: "Alliance Spaceships" },
            { value: "Serenity Location", label: "Locations" },
            { value: "Serenity World", label: "Worlds" }
          ]}
        ]
      },
      {
        id: "st",
        label: "Star Trek",
        groups: [
          { label: "Character", options: [
            { value: "Star Trek Male", label: "Human Male Names" },
            { value: "Star Trek Female", label: "Human Female Names" },
            { value: "Andorian Male", label: "Andorian Male Names" },
            { value: "Andorian Female", label: "Andorian Female Names" },
            { value: "Cardassian Male", label: "Cardassian Male Names" },
            { value: "Cardassian Female", label: "Cardassian Female Names" },
            { value: "Klingon Male", label: "Klingon Male Names" },
            { value: "Klingon Female", label: "Klingon Female Names" },
            { value: "Romulan Male", label: "Romulan Male Names" },
            { value: "Romulan Female", label: "Romulan Female Names" },
            { value: "Tellarite", label: "Tellarite Names" },
            { value: "Vulcan Male", label: "Vulcan Male Names" },
            { value: "Vulcan Female", label: "Vulcan Female Names" },
            { value: "Borg", label: "Borg Designation" }
          ]},
          { label: "Setting", options: [
            { value: "Star Trek Location", label: "Locations" },
            { value: "Star Trek Planet", label: "Planet Names" },
            { value: "Star Trek Technology", label: "Technobabble" }
          ]}
        ]
      },
      {
        id: "sw",
        label: "Star Wars",
        groups: [
          { label: "Character", options: [
            { value: "Star Wars Male", label: "Male Names" },
            { value: "Star Wars Female", label: "Female Names" },
            { value: "Bothan", label: "Bothan Names" },
            { value: "Chiss", label: "Chiss Names" },
            { value: "Duros", label: "Duros Names" },
            { value: "Gamorrean", label: "Gamorrean Names" },
            { value: "Hutt", label: "Hutt Names" },
            { value: "Ithorian", label: "Ithorian Names" },
            { value: "Mon Calamari", label: "Mon Calamari Names" },
            { value: "Quarren", label: "Quarren Names" },
            { value: "Rodian", label: "Rodian Names" },
            { value: "Sullustan", label: "Sullustan Names" },
            { value: "Trandoshan", label: "Trandoshan Names" },
            { value: "Twilek", label: "Twi'lek Names" },
            { value: "Wookiee", label: "Wookiee Names" },
            { value: "Droid", label: "Droid Names" }
          ]},
          { label: "Setting", options: [
            { value: "Star Wars Location", label: "Locations" },
            { value: "Star Wars Planet", label: "Planet Names" }
          ]}
        ]
      },
      {
        id: "mx",
        label: "Miscellany",
        groups: [
          { label: "Avatar", options: [
            { value: "Navi Male", label: "Na'vi Male Names" },
            { value: "Navi Female", label: "Na'vi Female Names" }
          ]},
          { label: "Babylon 5", options: [
            { value: "Centauri", label: "Centauri Names" },
            { value: "Minbari", label: "Minbari Names" },
            { value: "Narn", label: "Narn Names" }
          ]},
          { label: "Crest of the Stars", options: [
            { value: "Abh Male", label: "Abh Male Names" },
            { value: "Abh Female", label: "Abh Female Names" }
          ]},
          { label: "Pern", options: [
            { value: "Pern Male", label: "Pern Male Names" },
            { value: "Pern Female", label: "Pern Female Names" },
            { value: "Pern Dragon", label: "Pern Dragon Names" }
          ]}
        ]
      }
    ]
  },
  {
    id: "weird",
    label: "Cthulhu Mythos",
    categories: [
      {
        id: "cm",
        label: "Cthulhu Mythos",
        groups: [
          { label: "Character", options: [
            { value: "Investigator Male", label: "Male Names" },
            { value: "Investigator Female", label: "Female Names" }
          ]},
          { label: "Setting", options: [
            { value: "Eldritch", label: "Unspeakable Names" },
            { value: "Mythos Tome", label: "Mythos Tomes" }
          ]},
          { label: "Foreign", options: [
            { value: "Arabic Male", label: "Arabic Male Names" },
            { value: "Arabic Female", label: "Arabic Female Names" },
            { value: "Aztec Male", label: "Aztec Male Names" },
            { value: "Aztec Female", label: "Aztec Female Names" },
            { value: "Chinese Male", label: "Chinese Male Names" },
            { value: "Chinese Female", label: "Chinese Female Names" },
            { value: "Egyptian Male", label: "Egyptian Male Names" },
            { value: "Egyptian Female", label: "Egyptian Female Names" },
            { value: "Sumerian Male", label: "Sumerian Male Names" },
            { value: "Sumerian Female", label: "Sumerian Female Names" }
          ]}
        ]
      }
    ]
  },
  {
    id: "alien",
    label: "Alien RPG",
    categories: [
      {
        id: "alien",
        label: "Alien RPG",
        groups: [
          { label: "Character", options: [
            { value: "Alien RPG Male", label: "Male Names" },
            { value: "Alien RPG Female", label: "Female Names" }
          ]},
          { label: "Setting", options: [
            { value: "Alien RPG ICC", label: "ICC Designations" },
            { value: "Alien RPG Planet", label: "Planet Names" },
            { value: "Alien RPG Star", label: "Star Names" }
          ]}
        ]
      }
    ]
  },
  {
    id: "blade_runner",
    label: "Blade Runner",
    categories: [
      {
        id: "blade_runner",
        label: "Blade Runner",
        groups: [
          { label: "Character", options: [
            { value: "BR Male", label: "Male Names" },
            { value: "BR Female", label: "Female Names" }
          ]},
          { label: "Setting", options: [
            { value: "BR Bar", label: "Bars and Clubs" },
            { value: "BR Corporation", label: "Corporation Names" }
          ]}
        ]
      }
    ]
  },
  {
    id: "avatar",
    label: "Avatar Legends",
    categories: [
      {
        id: "avatar",
        label: "Avatar Legends",
        groups: [
          { label: "Character", options: [
            { value: "Air Nomad Male", label: "Air Nomad Male Names" },
            { value: "Air Nomad Female", label: "Air Nomad Female Names" },
            { value: "Earth Kingdom Male", label: "Earth Kingdom Male Names" },
            { value: "Earth Kingdom Female", label: "Earth Kingdom Female Names" },
            { value: "Fire Nation Male", label: "Fire Nation Male Names" },
            { value: "Fire Nation Female", label: "Fire Nation Female Names" },
            { value: "Water Tribe Male", label: "Water Tribe Male Names" },
            { value: "Water Tribe Female", label: "Water Tribe Female Names" },
            { value: "United Republic Male", label: "United Republic Male Names" },
            { value: "United Republic Female", label: "United Republic Female Names" }
          ]},
          { label: "Setting", options: [
            { value: "Earth Kingdom Village", label: "Earth Kingdom Village Names" },
            { value: "Fire Nation Village", label: "Fire Nation Village Names" },
            { value: "Water Tribe Village", label: "Water Tribe Village Names" }
          ]}
        ]
      }
    ]
  }
];

/**
 * Builds the repetitive Male/Female/Town option groups shared by every
 * quasi-historical culture on donjon's site.
 * @param {string[]} cultures
 * @returns {{label: string, options: {value: string, label: string}[]}[]}
 */
function makeMFT(cultures) {
  return cultures.map(culture => ({
    label: culture,
    options: [
      { value: `${culture} Male`, label: `${culture} Male Names` },
      { value: `${culture} Female`, label: `${culture} Female Names` },
      { value: `${culture} Town`, label: `${culture} Town Names` }
    ]
  }));
}

/** Convenience lookup: genre id -> genre definition. */
export function getGenre(id) {
  return GENRES.find(g => g.id === id) ?? GENRES[0];
}

/** Convenience lookup: category id within a genre -> category definition. */
export function getCategory(genre, id) {
  return genre.categories.find(c => c.id === id) ?? genre.categories[0];
}

/** Flattens a category's groups into a single list of {value,label} options. */
export function flattenOptions(category) {
  return category.groups.flatMap(g => g.options);
}
