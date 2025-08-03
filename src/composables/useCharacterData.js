import { computed, onMounted, reactive, ref, watch } from "vue";
import { dndAPI } from "@/services/dndAPI.js";

// Loading placeholders - show immediately while API loads
const loadingPlaceholders = {
  species: [
    { id: "loading-1", name: "Loading species...", isPlaceholder: true },
    { id: "loading-2", name: "Fetching races...", isPlaceholder: true },
    { id: "loading-3", name: "Getting data...", isPlaceholder: true },
  ],
  classes: [
    { id: "loading-1", name: "Loading classes...", isPlaceholder: true },
    { id: "loading-2", name: "Fetching class data...", isPlaceholder: true },
    { id: "loading-3", name: "Getting abilities...", isPlaceholder: true },
  ],
  backgrounds: [
    { id: "loading-1", name: "Loading backgrounds...", isPlaceholder: true },
    {
      id: "loading-2",
      name: "Fetching background data...",
      isPlaceholder: true,
    },
    { id: "loading-3", name: "Getting features...", isPlaceholder: true },
  ],
};

// Fallback species data in case API fails
const fallbackSpeciesData = [
  {
    id: "dragonborn",
    name: "Dragonborn",
    size: "Medium",
    speed: 30,
    darkvision: null,
    damageResistance: "Acid, Cold, Fire, Lightning, or Poison (chosen)",
    lineages: [],
    bonusLanguage: "Draconic",
  },
  {
    id: "dwarf",
    name: "Dwarf",
    size: "Medium",
    speed: 30,
    darkvision: 120,
    damageResistance: "Poison",
    lineages: [
      { id: "hill_dwarf", name: "Hill Dwarf" },
      { id: "mountain_dwarf", name: "Mountain Dwarf" },
      { id: "duergar", name: "Duergar (Gray Dwarf)" },
    ],
    bonusLanguage: null,
  },
  {
    id: "elf",
    name: "Elf",
    size: "Medium",
    speed: 30,
    darkvision: 60,
    damageResistance: null,
    lineages: [
      { id: "drow", name: "Drow" },
      { id: "high_elf", name: "High Elf" },
      { id: "wood_elf", name: "Wood Elf" },
    ],
    bonusLanguage: null,
  },
  {
    id: "gnome",
    name: "Gnome",
    size: "Small",
    speed: 25,
    darkvision: 60,
    damageResistance: null,
    lineages: [
      { id: "forest_gnome", name: "Forest Gnome" },
      { id: "rock_gnome", name: "Rock Gnome" },
    ],
    bonusLanguage: "Gnomish",
  },
  {
    id: "half-orc",
    name: "Half-Orc",
    size: "Medium",
    speed: 30,
    darkvision: 60,
    damageResistance: null,
    lineages: [],
    bonusLanguage: "Orc",
  },
  {
    id: "halfling",
    name: "Halfling",
    size: "Small",
    speed: 25,
    darkvision: null,
    damageResistance: null,
    lineages: [
      { id: "lightfoot", name: "Lightfoot Halfling" },
      { id: "stout", name: "Stout Halfling" },
    ],
    bonusLanguage: "Halfling",
  },
  {
    id: "tiefling",
    name: "Tiefling",
    size: "Medium",
    speed: 30,
    darkvision: 60,
    damageResistance: "Fire",
    lineages: [],
    bonusLanguage: "Infernal",
  },
  {
    id: "human",
    name: "Human",
    size: "Medium",
    speed: 30,
    darkvision: null,
    damageResistance: null,
    lineages: [{ id: "variant_human", name: "Variant Human" }],
    bonusLanguage: null,
  },
  {
    id: "half-elf",
    name: "Half-Elf",
    size: "Medium",
    speed: 30,
    darkvision: 60,
    damageResistance: null,
    lineages: [],
    bonusLanguage: "choice", // Half-elves get to choose extra languages
  },
];

// Fallback class data in case API fails
const fallbackClassData = [
  {
    id: "barbarian",
    name: "Barbarian",
    primaryAbility: "Strength",
    hpDie: "D12",
    savingThrows: ["Strength", "Constitution"],
    skillChoices: 2,
    skills: [
      "Animal Handling",
      "Athletics",
      "Intimidation",
      "Nature",
      "Perception",
      "Survival",
    ],
    armorTraining: { light: true, medium: true, heavy: false, shields: true },
    startingEquipment: [
      { name: "Greataxe", cost: 30, weight: 7 },
      { name: "Handaxes", cost: 5, weight: 2, quantity: 4 },
    ],
    startingMoney: { rolls: "2d4", multiplier: 10, average: 50 }, // 2d4 × 10 gp
    weaponMasteryChoices: 2,
    expertiseSkills: [],
  },
  {
    id: "bard",
    name: "Bard",
    primaryAbility: "Charisma",
    hpDie: "D8",
    savingThrows: ["Dexterity", "Charisma"],
    skillChoices: 3,
    skills: [
      "Acrobatics",
      "Animal Handling",
      "Athletics",
      "Deception",
      "History",
      "Insight",
      "Intimidation",
      "Investigation",
      "Medicine",
      "Nature",
      "Perception",
      "Performance",
      "Persuasion",
      "Religion",
      "Sleight of Hand",
      "Stealth",
      "Survival",
    ],
    armorTraining: { light: true, medium: false, heavy: false, shields: false },
    startingEquipment: [],
    startingMoney: { rolls: "3d4", multiplier: 10, average: 75 }, // 3d4 × 10 gp
    toolProficiencies: [{ type: "Musical Instrument", choices: 3 }],
    expertiseSkills: ["Performance", "Persuasion"],
  },
  {
    id: "fighter",
    name: "Fighter",
    primaryAbility: "Strength or Dexterity",
    hpDie: "D10",
    savingThrows: ["Strength", "Constitution"],
    skillChoices: 2,
    skills: [
      "Acrobatics",
      "Animal Handling",
      "Athletics",
      "History",
      "Insight",
      "Intimidation",
      "Persuasion",
      "Perception",
      "Survival",
    ],
    armorTraining: { light: true, medium: true, heavy: true, shields: true },
    startingEquipment: [],
    startingMoney: { rolls: "5d4", multiplier: 10, average: 125 }, // 5d4 × 10 gp
    weaponMasteryChoices: 3,
    expertiseSkills: [],
  },
  {
    id: "rogue",
    name: "Rogue",
    primaryAbility: "Dexterity",
    hpDie: "D8",
    savingThrows: ["Dexterity", "Intelligence"],
    skillChoices: 4,
    skills: [
      "Acrobatics",
      "Athletics",
      "Deception",
      "Insight",
      "Intimidation",
      "Investigation",
      "Perception",
      "Persuasion",
      "Sleight of Hand",
      "Stealth",
    ],
    armorTraining: { light: true, medium: false, heavy: false, shields: false },
    startingEquipment: [],
    startingMoney: { rolls: "4d4", multiplier: 10, average: 100 }, // 4d4 × 10 gp
    toolProficiencies: ["Thieves' Tools"],
    expertiseSkills: ["Sleight of Hand", "Stealth"],
  },
];

// Dynamic species data loaded from API - start with loading placeholders
const speciesData = ref([...loadingPlaceholders.species]);
const isLoadingSpecies = ref(true);
const speciesError = ref(null);

// Dynamic class data loaded from API - start with loading placeholders
const classData = ref([...loadingPlaceholders.classes]);
const isLoadingClasses = ref(true);
const classError = ref(null);

// Load data from API
const loadData = async () => {
  try {
    // Load species data
    isLoadingSpecies.value = true;
    const races = await dndAPI.getRaces();
    if (races && races.length > 0) {
      speciesData.value = races;
    }
    isLoadingSpecies.value = false;
  } catch (error) {
    console.error("Error loading species data:", error);
    speciesError.value = error;
    isLoadingSpecies.value = false;
  }

  try {
    // Load class data
    isLoadingClasses.value = true;
    const classes = await dndAPI.getClasses();
    if (classes && classes.length > 0) {
      classData.value = classes;
    }
    isLoadingClasses.value = false;
  } catch (error) {
    console.error("Error loading class data:", error);
    classError.value = error;
    isLoadingClasses.value = false;
  }
};

// Load initial data
// (Remove this duplicate export function useCharacterData block)

// Dynamic background data loaded from API - start with fallback data
const fallbackBackgroundData = [
  {
    id: "acolyte",
    name: "Acolyte",
    description:
      "You have spent your life in the service of a temple to a specific god or pantheon of gods.",
    skillProficiencies: ["Insight", "Religion"],
    toolProficiencies: ["Calligrapher's Supplies"],
    languages: [],
    languageOptions: { choose: 2, from: ["Common", "Celestial", "Abyssal"] },
    startingEquipment: [
      { name: "Holy Symbol", quantity: 1 },
      { name: "Prayer Book", quantity: 1 },
      { name: "Incense", quantity: 5 },
    ],
    startingMoney: { gp: 15 }, // Additional gold
    feature: {
      name: "Shelter of the Faithful",
      description:
        "You can perform religious ceremonies and gain shelter at temples.",
    },
    // Legacy fields for compatibility
    feat: "Magic Initiate (Cleric)",
    skillProfs: ["Insight", "Religion"],
    toolProf: "Calligrapher's Supplies",
    equipmentChoice: "A or B",
    abilityScores: ["Intelligence", "Wisdom", "Charisma"],
  },
  {
    id: "criminal",
    name: "Criminal",
    description:
      "You are an experienced criminal with a history of breaking the law.",
    skillProficiencies: ["Deception", "Stealth"],
    toolProficiencies: ["Thieves' Tools"],
    languages: [],
    languageOptions: null,
    startingEquipment: [
      { name: "Crowbar", quantity: 1 },
      { name: "Dark Common Clothes", quantity: 1 },
      { name: "Belt Pouch", quantity: 1 },
    ],
    startingMoney: { gp: 15 }, // Additional gold
    feature: {
      name: "Criminal Contact",
      description: "You have a reliable contact in the criminal underworld.",
    },
    // Legacy fields for compatibility
    feat: "Alert",
    skillProfs: ["Sleight of Hand", "Stealth"],
    toolProf: "Thieves' Tools",
    equipmentChoice: "A or B",
    abilityScores: ["Dexterity", "Constitution", "Intelligence"],
  },
  {
    id: "sage",
    name: "Sage",
    description: "You spent years learning the lore of the multiverse.",
    skillProficiencies: ["Arcana", "History"],
    toolProficiencies: ["Calligrapher's Supplies"],
    languages: [],
    languageOptions: { choose: 2, from: ["Any"] },
    startingEquipment: [
      { name: "Ink and Quill", quantity: 1 },
      { name: "Small Knife", quantity: 1 },
      { name: "Common Clothes", quantity: 1 },
    ],
    startingMoney: { gp: 10 }, // Additional gold
    feature: {
      name: "Researcher",
      description: "You know where to find information and who to ask.",
    },
    // Legacy fields for compatibility
    feat: "Magic Initiate (Wizard)",
    skillProfs: ["Arcana", "History"],
    toolProf: "Calligrapher's Supplies",
    equipmentChoice: "A or B",
    abilityScores: ["Constitution", "Intelligence", "Wisdom"],
  },
  {
    id: "soldier",
    name: "Soldier",
    description: "You had a military career and are experienced in battle.",
    skillProficiencies: ["Athletics", "Intimidation"],
    toolProficiencies: ["Gaming Set"],
    languages: [],
    languageOptions: null,
    startingEquipment: [
      { name: "Uniform", quantity: 1 },
      { name: "Belt Pouch", quantity: 1 },
      { name: "Deck of Cards", quantity: 1 },
    ],
    feature: {
      name: "Military Rank",
      description: "You have a military rank and soldiers loyal to you.",
    },
    // Legacy fields for compatibility
    feat: "Savage Attacker",
    skillProfs: ["Athletics", "Intimidation"],
    toolProf: "Gaming Set (choice)",
    equipmentChoice: "A or B",
    abilityScores: ["Strength", "Dexterity", "Constitution"],
  },
  {
    id: "hermit",
    name: "Hermit",
    description: "You lived in seclusion for a formative part of your life.",
    skillProficiencies: ["Medicine", "Religion"],
    toolProficiencies: ["Herbalism Kit"],
    languages: [],
    languageOptions: { choose: 1, from: ["Any"] },
    startingEquipment: [
      { name: "Herbalism Kit", quantity: 1 },
      { name: "Scroll Case", quantity: 1 },
      { name: "Winter Blanket", quantity: 1 },
    ],
    feature: {
      name: "Discovery",
      description:
        "You discovered a unique and powerful secret about the cosmos.",
    },
    feat: "Healer",
    skillProfs: ["Medicine", "Religion"],
    toolProf: "Herbalism Kit",
    equipmentChoice: "A or B",
    abilityScores: ["Intelligence", "Wisdom", "Charisma"],
  },
  {
    id: "entertainer",
    name: "Entertainer",
    description:
      "You thrive in front of an audience and know how to entrance them.",
    skillProficiencies: ["Acrobatics", "Performance"],
    toolProficiencies: ["Disguise Kit", "Musical Instrument"],
    languages: [],
    languageOptions: null,
    startingEquipment: [
      { name: "Musical Instrument", quantity: 1 },
      { name: "Costume", quantity: 1 },
      { name: "Belt Pouch", quantity: 1 },
    ],
    feature: {
      name: "By Popular Demand",
      description: "You can perform in exchange for lodging and food.",
    },
    feat: "Musician",
    skillProfs: ["Acrobatics", "Performance"],
    toolProf: "Musical Instrument (choice)",
    equipmentChoice: "A or B",
    abilityScores: ["Dexterity", "Constitution", "Charisma"],
  },
  {
    id: "folk-hero",
    name: "Folk Hero",
    description:
      "You come from a humble social rank, but you are destined for so much more.",
    skillProficiencies: ["Animal Handling", "Survival"],
    toolProficiencies: ["Artisan's Tools", "Vehicles (Land)"],
    languages: [],
    languageOptions: null,
    startingEquipment: [
      { name: "Artisan's Tools", quantity: 1 },
      { name: "Shovel", quantity: 1 },
      { name: "Common Clothes", quantity: 1 },
    ],
    feature: {
      name: "Rustic Hospitality",
      description:
        "Common folk will provide you with simple accommodations and food.",
    },
    feat: "Tough",
    skillProfs: ["Animal Handling", "Survival"],
    toolProf: "Artisan's Tools (choice)",
    equipmentChoice: "A or B",
    abilityScores: ["Strength", "Constitution", "Wisdom"],
  },
  {
    id: "noble",
    name: "Noble",
    description: "You understand wealth, power, and privilege from birth.",
    skillProficiencies: ["History", "Persuasion"],
    toolProficiencies: ["Gaming Set"],
    languages: [],
    languageOptions: { choose: 1, from: ["Any"] },
    startingEquipment: [
      { name: "Fine Clothes", quantity: 1 },
      { name: "Signet Ring", quantity: 1 },
      { name: "Scroll of Pedigree", quantity: 1 },
    ],
    feature: {
      name: "Position of Privilege",
      description:
        "You are welcome in high society and can secure audiences with nobles.",
    },
    feat: "Skilled",
    skillProfs: ["History", "Persuasion"],
    toolProf: "Gaming Set (choice)",
    equipmentChoice: "A or B",
    abilityScores: ["Intelligence", "Wisdom", "Charisma"],
  },
  {
    id: "outlander",
    name: "Outlander",
    description: "You grew up in the wilds, far from civilization.",
    skillProficiencies: ["Athletics", "Survival"],
    toolProficiencies: ["Herbalism Kit", "Musical Instrument"],
    languages: [],
    languageOptions: { choose: 1, from: ["Any"] },
    startingEquipment: [
      { name: "Staff", quantity: 1 },
      { name: "Hunting Trap", quantity: 1 },
      { name: "Traveler's Clothes", quantity: 1 },
    ],
    feature: {
      name: "Wanderer",
      description:
        "You have an excellent memory for geography and can find food and shelter.",
    },
    feat: "Magic Initiate (Druid)",
    skillProfs: ["Athletics", "Survival"],
    toolProf: "Herbalism Kit",
    equipmentChoice: "A or B",
    abilityScores: ["Strength", "Dexterity", "Wisdom"],
  },
];

const backgroundData = ref([...loadingPlaceholders.backgrounds]);
const isLoadingBackgrounds = ref(true);
const backgroundError = ref(null);

const loadSpeciesData = async () => {
  isLoadingSpecies.value = true;
  speciesError.value = null;

  try {
    const apiSpecies = await dndAPI.getRaces();

    if (apiSpecies && apiSpecies.length > 0) {
      // Merge API data with our enhanced fallback data
      const mergedSpecies = apiSpecies.map((apiRace) => {
        // Find corresponding fallback race for enhanced data
        const fallbackRace = fallbackSpeciesData.find(
          (fb) =>
            fb.id === apiRace.id ||
            fb.name.toLowerCase() === apiRace.name.toLowerCase()
        );

        // If we have enhanced fallback data, merge it with API data
        if (fallbackRace) {
          console.log(`Merging data for ${apiRace.name}:`, {
            apiId: apiRace.id,
            fallbackId: fallbackRace.id,
            apiLineages: apiRace.lineages,
            fallbackLineages: fallbackRace.lineages,
          });

          const merged = {
            ...apiRace,
            lineages: fallbackRace.lineages, // Use our enhanced lineage data
            bonusLanguage: fallbackRace.bonusLanguage,
            // Keep API data for other fields, but fall back to our data if API is missing something
            darkvision: apiRace.darkvision || fallbackRace.darkvision,
            damageResistance:
              apiRace.damageResistance || fallbackRace.damageResistance,
          };

          console.log(`Final merged dwarf data:`, merged);
          return merged;
        }

        console.log(`No fallback data found for: ${apiRace.name}`);
        return apiRace;
      });

      speciesData.value = mergedSpecies;
      console.log("Final species data loaded:", speciesData.value);
    }
    // If API fails, we keep the fallback data that's already loaded
  } catch (error) {
    console.error("Failed to load species data:", error);
    speciesError.value = error.message;
    // Keep fallback data on error
  } finally {
    isLoadingSpecies.value = false;
  }
};

// Function to load class data from API
const loadClassData = async () => {
  isLoadingClasses.value = true;
  classError.value = null;

  try {
    const apiClasses = await dndAPI.getClasses();

    if (apiClasses && apiClasses.length > 0) {
      // Replace fallback data with API data
      classData.value = apiClasses;
    }
    // If API fails, we keep the fallback data that's already loaded
  } catch (error) {
    console.error("Failed to load class data:", error);
    classError.value = error.message;
    // Keep fallback data on error
  } finally {
    isLoadingClasses.value = false;
  }
};

// Dynamic equipment data loaded from API
const equipmentData = ref([]);
const isLoadingEquipment = ref(false);
const equipmentError = ref(null);

// Function to load backgrounds data from API
const loadBackgroundData = async () => {
  isLoadingBackgrounds.value = true;
  backgroundError.value = null;

  try {
    const apiBackgrounds = await dndAPI.getBackgrounds();
    console.log("API Backgrounds loaded:", apiBackgrounds);

    if (apiBackgrounds && apiBackgrounds.length > 0) {
      // Use API data if we got a reasonable amount of backgrounds
      if (apiBackgrounds.length >= 4) {
        backgroundData.value = apiBackgrounds;
      } else {
        // If API only returned a few backgrounds, merge with fallback data
        console.log("API returned limited backgrounds, using fallback data");
        backgroundData.value = [...fallbackBackgroundData];
      }
    } else {
      // If API returned no data, use fallback
      console.log("API returned no backgrounds, using fallback data");
      backgroundData.value = [...fallbackBackgroundData];
    }
  } catch (error) {
    console.error("Failed to load background data:", error);
    backgroundError.value = error.message;
    // Ensure we always have fallback data available
    backgroundData.value = [...fallbackBackgroundData];
  } finally {
    isLoadingBackgrounds.value = false;
  }
};

// Function to load equipment data from API
const loadEquipmentData = async () => {
  isLoadingEquipment.value = true;
  equipmentError.value = null;

  try {
    const apiEquipment = await dndAPI.getEquipment();

    if (apiEquipment && apiEquipment.length > 0) {
      // Store API equipment data
      equipmentData.value = apiEquipment;
    }
    // Equipment is optional, so no fallback needed
  } catch (error) {
    console.error("Failed to load equipment data:", error);
    equipmentError.value = error.message;
  } finally {
    isLoadingEquipment.value = false;
  }
};

const standardLanguages = [
  "Common Sign Language",
  "Draconic",
  "Dwarvish",
  "Elvish",
  "Giant",
  "Gnomish",
  "Goblin",
  "Halfling",
  "Orc",
];

const alignmentOptions = [
  "Lawful Good",
  "Neutral Good",
  "Chaotic Good",
  "Lawful Neutral",
  "Neutral",
  "Chaotic Neutral",
  "Lawful Evil",
  "Neutral Evil",
  "Chaotic Evil",
];

const skillList = [
  {
    name: "Acrobatics",
    ability: "Dexterity",
    exampleUse:
      "Stay on your feet in a tricky situation, or perform an acrobatic stunt.",
  },
  {
    name: "Animal Handling",
    ability: "Wisdom",
    exampleUse:
      "Calm or train an animal, or get an animal to behave in a certain way.",
  },
  {
    name: "Arcana",
    ability: "Intelligence",
    exampleUse:
      "Recall lore about spells, magic items, and the planes of existence.",
  },
  {
    name: "Athletics",
    ability: "Strength",
    exampleUse:
      "Jump farther than normal, stay afloat in rough water, or break something.",
  },
  {
    name: "Deception",
    ability: "Charisma",
    exampleUse: "Tell a convincing lie, or wear a disguise convincingly.",
  },
  {
    name: "History",
    ability: "Intelligence",
    exampleUse:
      "Recall lore about historical events, people, nations, and cultures.",
  },
  {
    name: "Insight",
    ability: "Wisdom",
    exampleUse: "Discern a person's mood and intentions.",
  },
  {
    name: "Intimidation",
    ability: "Charisma",
    exampleUse: "Awe or threaten someone into doing what you want.",
  },
  {
    name: "Investigation",
    ability: "Intelligence",
    exampleUse:
      "Find obscure information in books, or deduce how something works.",
  },
  {
    name: "Medicine",
    ability: "Wisdom",
    exampleUse:
      "Diagnose an illness, or determine what killed the recently slain.",
  },
  {
    name: "Nature",
    ability: "Intelligence",
    exampleUse: "Recall lore about terrain, plants, animals, and weather.",
  },
  {
    name: "Perception",
    ability: "Wisdom",
    exampleUse:
      "Using a combination of senses, notice something that's easy to miss.",
  },
  {
    name: "Performance",
    ability: "Charisma",
    exampleUse: "Act, tell a story, perform music, or dance.",
  },
  {
    name: "Persuasion",
    ability: "Charisma",
    exampleUse: "Honestly and graciously convince someone of something.",
  },
  {
    name: "Religion",
    ability: "Intelligence",
    exampleUse: "Recall lore about gods, religious rituals, and holy symbols.",
  },
  {
    name: "Sleight of Hand",
    ability: "Dexterity",
    exampleUse:
      "Pick a pocket, conceal a handheld object, or perform legerdemain.",
  },
  {
    name: "Stealth",
    ability: "Dexterity",
    exampleUse: "Escape notice by moving quietly and hiding behind things.",
  },
  {
    name: "Survival",
    ability: "Wisdom",
    exampleUse:
      "Follow tracks, forage, find a trail, or avoid natural hazards.",
  },
];

const abilityNames = [
  "strength",
  "dexterity",
  "constitution",
  "intelligence",
  "wisdom",
  "charisma",
];

const xpThresholds = {
  1: 0,
  2: 300,
  3: 900,
  4: 2700,
  5: 6500,
  6: 14_000,
  7: 23_000,
  8: 34_000,
  9: 48_000,
  10: 64_000,
  11: 85_000,
  12: 100_000,
  13: 120_000,
  14: 140_000,
  15: 165_000,
  16: 195_000,
  17: 225_000,
  18: 265_000,
  19: 305_000,
  20: 355_000,
};

const proficiencyBonusLevels = {
  1: 2,
  2: 2,
  3: 2,
  4: 2,
  5: 3,
  6: 3,
  7: 3,
  8: 3,
  9: 4,
  10: 4,
  11: 4,
  12: 4,
  13: 5,
  14: 5,
  15: 5,
  16: 5,
  17: 6,
  18: 6,
  19: 6,
  20: 6,
};

export function useCharacterData() {
  // Load initial data
  onMounted(async () => {
    try {
      await Promise.all([
        loadSpeciesData(),
        loadClassData(),
        loadBackgroundData(),
        loadEquipmentData(),
      ]);
    } catch (error) {
      console.error("Error loading initial data:", error);
    }
  });

  // Character state
  const character = reactive({
    name: "",
    playerName: "",
    species: null,
    speciesDetails: null,
    speciesLineage: null, // Wood Elf, High Elf, etc.
    class: null,
    classDetails: null,
    subclass: null, // Archetype/Subclass selection
    subclassDetails: null,
    background: null,
    backgroundDetails: null,
    level: 1,
    xp: 0,
    alignment: null,
    backstory: "",
    personality: {
      traits: [],
      ideals: [],
      bonds: [],
      flaws: [],
    },
    additionalLanguages: [],
    selectedTools: [],
    selectedClassSkills: [],
    feats: [], // Character feats
    abilityScores: {
      strength: { score: 10, modifier: 0 },
      dexterity: { score: 10, modifier: 0 },
      constitution: { score: 10, modifier: 0 },
      intelligence: { score: 10, modifier: 0 },
      wisdom: { score: 10, modifier: 0 },
      charisma: { score: 10, modifier: 0 },
    },
    proficiencyBonus: 2,
    hasHeroicInspiration: false,
    initiative: 0,
    size: "",
    speed: 0,
    passivePerception: 10,
    skillProficiencies: {},
    savingThrowProficiencies: {},
    toolProficiencies: [],
    armorTraining: {
      light: false,
      medium: false,
      heavy: false,
      shields: false,
    },
    weaponProficiencies: [], // Weapon proficiencies from class/background
    equipment: [],
    coins: { cp: 0, sp: 0, ep: 0, gp: 0, pp: 0 },
    attunedItems: ["", "", ""],
    weapons: [],
    damagingCantrips: [],
    spellcastingAbilityName: "",
    spellSaveDC: 8,
    spellAttackBonus: 0,
    cantrips: [],
    preparedSpells: [],
    expendedSpellSlots: {},
    notes: "",
  });

  // UI state
  const currentStep = ref(1);
  const abilityGenerationMethod = ref("standard");
  const rolledStats = ref([]);
  const rolling = ref(false);
  const timesRerolled = ref(0);

  // Computed properties
  const speciesOptions = computed(() =>
    speciesData.value.map((s) => ({ name: s.name, id: s.id }))
  );
  const classOptions = computed(() =>
    classData.value.map((c) => ({ name: c.name, id: c.id }))
  );
  const backgroundOptions = computed(() => {
    console.log(
      "Computing backgroundOptions, backgroundData.value:",
      backgroundData.value
    );
    const options = backgroundData.value.map((b) => ({
      name: b.name,
      id: b.id,
    }));
    console.log("Background options:", options);
    return options;
  });

  const totalGP = computed(() => {
    return (
      character.coins.gp +
      character.coins.sp / 10 +
      character.coins.ep / 2 +
      character.coins.cp / 100 +
      character.coins.pp * 10
    );
  });

  const carryingCapacity = computed(() => {
    const baseCapacity = character.abilityScores.strength.score * 15;
    return baseCapacity;
  });

  const totalWeight = computed(() => {
    return character.equipment.reduce((sum, item) => sum + item.weight, 0);
  });

  // Utility functions
  const calculateAbilityModifier = (score) => {
    return Math.floor((score - 10) / 2);
  };

  const updateAbilityModifier = (statName) => {
    character.abilityScores[statName].modifier = calculateAbilityModifier(
      character.abilityScores[statName].score
    );
    updatePassivePerception();
    updateInitiativeBonus();
    updateSpellcastingDetails();
  };

  const updateAbilityModifierForAll = () => {
    for (const statName of abilityNames) {
      character.abilityScores[statName].modifier = calculateAbilityModifier(
        character.abilityScores[statName].score
      );
    }
  };

  const updateXPAndProficiency = () => {
    character.xp = xpThresholds[character.level] || 0;
    character.proficiencyBonus = proficiencyBonusLevels[character.level] || 0;
    updateAbilityModifierForAll();
    updateSpellcastingDetails();
  };

  const updatePassivePerception = () => {
    let perceptionBonus = character.abilityScores.wisdom.modifier;
    if (character.skillProficiencies.Perception?.proficient) {
      perceptionBonus += character.proficiencyBonus;
      if (character.skillProficiencies.Perception.expertise) {
        perceptionBonus += character.proficiencyBonus;
      }
    }
    character.passivePerception = 10 + perceptionBonus;
  };

  const updateInitiativeBonus = () => {
    let initiativeMod = character.abilityScores.dexterity.modifier;
    if (character.backgroundDetails?.feat === "Alert") {
      initiativeMod += character.proficiencyBonus;
    }
    character.initiative = initiativeMod;
  };

  const updateSpellcastingDetails = () => {
    const spellAbility = character.spellcastingAbilityName
      ? character.spellcastingAbilityName.toLowerCase()
      : "";
    const abilityMod = character.abilityScores[spellAbility]?.modifier || 0;
    character.spellSaveDC = 8 + abilityMod + character.proficiencyBonus;
    character.spellAttackBonus = abilityMod + character.proficiencyBonus;
  };

  const updateSpeciesTraits = () => {
    const selectedSpecies = speciesData.value.find(
      (s) => s.id === character.species
    );
    if (selectedSpecies) {
      character.speciesDetails = selectedSpecies;
      character.size = selectedSpecies.size;
      character.speed = selectedSpecies.speed;

      if (selectedSpecies.id === "human") {
        character.hasHeroicInspiration = true;
      }
      character.speciesLineage =
        selectedSpecies.lineages.length > 0
          ? selectedSpecies.lineages[0].id
          : null;

      // If we have basic data, fetch detailed info in the background
      if (selectedSpecies.isBasicData) {
        // Non-blocking async call to fetch details
        dndAPI
          .getRaceDetails(selectedSpecies.id)
          .then((detailedRace) => {
            if (detailedRace) {
              // Preserve our enhanced lineages data
              const enhancedLineages = selectedSpecies.lineages;
              const enhancedBonusLanguage = selectedSpecies.bonusLanguage;

              // Merge detailed API data with our enhanced data
              const finalRaceData = {
                ...detailedRace,
                lineages: enhancedLineages, // Keep our enhanced lineages
                bonusLanguage: enhancedBonusLanguage, // Keep our enhanced bonus language
              };

              const index = speciesData.value.findIndex(
                (s) => s.id === selectedSpecies.id
              );
              if (index !== -1) {
                speciesData.value[index] = finalRaceData;
                // Update character if this race is still selected
                if (character.species === selectedSpecies.id) {
                  character.speciesDetails = finalRaceData;
                  character.size = finalRaceData.size;
                  character.speed = finalRaceData.speed;
                }
              }
            }
          })
          .catch((error) => {
            console.error("Failed to fetch detailed race info:", error);
          });
      }
    } else {
      character.speciesDetails = null;
      character.size = "";
      character.speed = 0;
      character.hasHeroicInspiration = false;
      character.speciesLineage = null;
    }
  };

  const updateClassTraits = () => {
    const selectedClass = classData.value.find((c) => c.id === character.class);
    console.log("Updating class traits for:", selectedClass?.name);

    if (selectedClass) {
      // Set basic class details immediately
      character.classDetails = selectedClass;

      // Set armor training from fallback data immediately
      character.armorTraining = { ...selectedClass.armorTraining };

      // If we have an index, fetch detailed data asynchronously
      if (selectedClass.index) {
        console.log(
          "Fetching detailed class data for index:",
          selectedClass.index
        );
        dndAPI
          .getClassDetails(selectedClass.index)
          .then((detailedClass) => {
            console.log("Fetched detailed class data:", detailedClass);
            if (detailedClass) {
              // Preserve armor training from fallback data if API data doesn't have it
              const armorTraining = detailedClass.armorTraining ||
                selectedClass.armorTraining || {
                  light: false,
                  medium: false,
                  heavy: false,
                  shields: false,
                };

              // Merge the detailed data with the existing basic data
              character.classDetails = {
                ...character.classDetails,
                ...detailedClass,
                armorTraining, // Ensure armor training is preserved
              };

              // Update character armor training
              character.armorTraining = { ...armorTraining };

              console.log(
                "Updated character.classDetails:",
                character.classDetails
              );
              console.log("Updated armor training:", character.armorTraining);
            }
          })
          .catch((error) => {
            console.error("Failed to fetch detailed class data:", error);
            // Keep the basic class data on error
          });
      } else {
        console.log("No index found for class, using basic data only");
      }
      character.equipment = [...(selectedClass.startingEquipment || [])];
      character.toolProficiencies = [
        ...(selectedClass.toolProficiencies || []),
      ];

      // Calculate starting money when class changes
      calculateStartingMoney();

      // Initialize skill proficiencies - don't auto-assign class skills
      character.skillProficiencies = {};
      for (const skill of skillList) {
        character.skillProficiencies[skill.name] = {
          proficient: false, // Changed: Don't auto-assign class skills
          expertise: false,
          bonus: 0,
        };
      }

      // Initialize selected class skills if not already set
      if (character.selectedClassSkills) {
        // Reset selected skills when class changes
        character.selectedClassSkills = [];
      } else {
        character.selectedClassSkills = [];
      }

      // Initialize saving throw proficiencies
      character.savingThrowProficiencies = {};
      for (const ability of abilityNames) {
        character.savingThrowProficiencies[ability] = {
          proficient: selectedClass.savingThrows?.includes(ability) || false,
          bonus: 0,
        };
      }

      // Handle spellcasting classes - check if class has spellcasting info
      if (selectedClass.spellcasting?.isSpellcaster) {
        character.spellcastingAbilityName =
          selectedClass.spellcasting.spellcastingAbility || "";
        character.damagingCantrips = [
          { name: "Fire Bolt", damage: "1d10", damageType: "Fire" },
        ];
      } else if (
        ["sorcerer", "wizard", "warlock", "bard", "cleric", "druid"].includes(
          character.class
        )
      ) {
        // Fallback for basic class data
        character.spellcastingAbilityName = selectedClass.primaryAbility || "";
        character.damagingCantrips = [
          { name: "Fire Bolt", damage: "1d10", damageType: "Fire" },
        ];
      } else {
        character.spellcastingAbilityName = "";
        character.damagingCantrips = [];
        character.cantrips = [];
        character.preparedSpells = [];
      }
    } else {
      character.classDetails = null;
      character.armorTraining = {
        light: false,
        medium: false,
        heavy: false,
        shields: false,
      };
      character.equipment = [];
      character.skillProficiencies = {};
      character.savingThrowProficiencies = {};
    }
    updateSpellcastingDetails();
  };

  const updateBackgroundTraits = () => {
    console.log("Updating background traits for:", character.background);
    console.log(
      "Available backgrounds:",
      backgroundData.value.map((b) => b.name)
    );

    const selectedBackground = backgroundData.value.find(
      (b) => b.id === character.background
    );

    console.log("Selected background:", selectedBackground);

    if (selectedBackground) {
      character.backgroundDetails = selectedBackground;
      console.log(
        "Updated character.backgroundDetails:",
        character.backgroundDetails
      );

      // Handle new API format (skillProficiencies) and legacy format (skillProfs)
      const skillProfs =
        selectedBackground.skillProficiencies ||
        selectedBackground.skillProfs ||
        [];

      // Update skill proficiencies from background
      for (const skillName of skillProfs) {
        if (character.skillProficiencies[skillName]) {
          character.skillProficiencies[skillName].proficient = true;
        }
      }

      // Re-apply class skill selections
      updateClassSkillProficiencies(); // Handle tool proficiencies
      const toolProfs =
        selectedBackground.toolProficiencies ||
        [selectedBackground.toolProf].filter(Boolean);
      for (const toolProf of toolProfs) {
        if (
          toolProf &&
          !toolProf.includes("(choice)") &&
          !character.toolProficiencies.includes(toolProf)
        ) {
          character.toolProficiencies.push(toolProf);
        }
      }

      // Add starting equipment from background
      if (selectedBackground.startingEquipment) {
        for (const item of selectedBackground.startingEquipment) {
          // Check if item already exists in equipment
          const existingItem = character.equipment.find(
            (eq) => eq.name === item.name
          );
          if (existingItem) {
            existingItem.quantity =
              (existingItem.quantity || 1) + (item.quantity || 1);
          } else {
            character.equipment.push({
              name: item.name,
              quantity: item.quantity || 1,
              weight: 0, // We'll get this from equipment API later
              cost: 0,
            });
          }
        }
      }

      // Calculate starting money when background changes
      calculateStartingMoney();
    } else {
      character.backgroundDetails = null;
    }
  };

  const updateClassSkillProficiencies = () => {
    if (!character.selectedClassSkills || !character.skillProficiencies) {
      return;
    }

    // Reset class skill proficiencies first (keep background skills)
    for (const skill of skillList) {
      if (character.classDetails?.skills?.includes(skill.name)) {
        // This is a class skill, check if it's selected
        character.skillProficiencies[skill.name].proficient =
          character.selectedClassSkills.includes(skill.name);
      }
    }
  };

  // Initialize character data
  const initializeCharacter = () => {
    updateAbilityModifierForAll();
    updateXPAndProficiency();
    updatePassivePerception();
    updateInitiativeBonus();

    // Ensure all required fields are properly initialized
    if (
      character.spellcastingAbilityName === undefined ||
      character.spellcastingAbilityName === null
    ) {
      character.spellcastingAbilityName = "";
    }

    // Initialize all skills
    for (const skill of skillList) {
      character.skillProficiencies[skill.name] = {
        proficient: false,
        expertise: false,
        bonus: 0,
      };
    }

    // Initialize all saving throws
    for (const ability of abilityNames) {
      character.savingThrowProficiencies[ability] = {
        proficient: false,
        bonus: 0,
      };
    }
  };

  // Starting money calculation
  // Starting money calculation
  const calculateStartingMoney = () => {
    const selectedClass = classData.value.find((c) => c.id === character.class);
    const selectedBackground = backgroundData.value.find(
      (b) => b.id === character.background
    );

    let totalGold = 0;

    // Add class starting money
    if (selectedClass?.startingMoney && selectedClass.startingMoney.rolls) {
      // Roll dice for starting money (use average for simplicity)
      totalGold += selectedClass.startingMoney.average || 0;
    }

    // Add background starting money
    if (selectedBackground?.startingMoney?.gp) {
      totalGold += selectedBackground.startingMoney.gp;
    }

    // Set the character's starting gold
    character.coins.gp = totalGold;
    character.coins.cp = 0;
    character.coins.sp = 0;
    character.coins.ep = 0;
    character.coins.pp = 0;

    console.log(`Starting money calculated: ${totalGold} GP`);
  };

  // Watchers
  watch(
    () => character.level,
    () => {
      updateXPAndProficiency();
    }
  );

  watch(
    () => character.species,
    () => {
      updateSpeciesTraits();
    }
  );

  watch(
    () => character.class,
    () => {
      updateClassTraits();
    }
  );

  watch(
    () => character.background,
    () => {
      updateBackgroundTraits();
    }
  );

  return {
    // State
    character,
    currentStep,
    abilityGenerationMethod,
    rolledStats,
    rolling,
    timesRerolled,

    // API State
    speciesData,
    isLoadingSpecies,
    speciesError,
    loadSpeciesData,
    classData,
    isLoadingClasses,
    classError,
    loadClassData,
    backgroundData,
    isLoadingBackgrounds,
    backgroundError,
    loadBackgroundData,
    equipmentData,
    isLoadingEquipment,
    equipmentError,
    loadEquipmentData,

    // Computed
    speciesOptions,
    classOptions,
    backgroundOptions,
    totalGP,
    carryingCapacity,
    totalWeight,

    // Methods
    updateAbilityModifier,
    updateAbilityModifierForAll,
    updateSpeciesTraits,
    updateClassTraits,
    updateBackgroundTraits,
    updateClassSkillProficiencies,
    initializeCharacter,
    calculateStartingMoney,

    // Static data
    standardLanguages,
    alignmentOptions,
    skillList,
    abilityNames,
  };
}
