import { reactive, ref, computed, watch } from "vue";

// Data imports - these would ideally come from a data service or API
const speciesData = [
  {
    id: "dragonborn",
    name: "Dragonborn",
    size: "Medium",
    speed: 30,
    darkvision: 60,
    damageResistance: "Acid, Cold, Fire, Lightning, or Poison (chosen)",
    lineages: [],
    bonusLanguage: null,
  },
  {
    id: "dwarf",
    name: "Dwarf",
    size: "Medium",
    speed: 30,
    darkvision: 120,
    damageResistance: "Poison",
    lineages: [],
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
    id: "human",
    name: "Human",
    size: "Medium",
    speed: 30,
    darkvision: null,
    damageResistance: null,
    lineages: [],
    bonusLanguage: null,
  },
];

const classData = [
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
    toolProficiencies: ["Thieves' Tools"],
    expertiseSkills: ["Sleight of Hand", "Stealth"],
  },
];

const backgroundData = [
  {
    id: "acolyte",
    name: "Acolyte",
    feat: "Magic Initiate (Cleric)",
    skillProfs: ["Insight", "Religion"],
    toolProf: "Calligrapher's Supplies",
    equipmentChoice: "A or B",
    abilityScores: ["Intelligence", "Wisdom", "Charisma"],
  },
  {
    id: "criminal",
    name: "Criminal",
    feat: "Alert",
    skillProfs: ["Sleight of Hand", "Stealth"],
    toolProf: "Thieves' Tools",
    equipmentChoice: "A or B",
    abilityScores: ["Dexterity", "Constitution", "Intelligence"],
  },
  {
    id: "sage",
    name: "Sage",
    feat: "Magic Initiate (Wizard)",
    skillProfs: ["Arcana", "History"],
    toolProf: "Calligrapher's Supplies",
    equipmentChoice: "A or B",
    abilityScores: ["Constitution", "Intelligence", "Wisdom"],
  },
  {
    id: "soldier",
    name: "Soldier",
    feat: "Savage Attacker",
    skillProfs: ["Athletics", "Intimidation"],
    toolProf: "Gaming Set (choice)",
    equipmentChoice: "A or B",
    abilityScores: ["Strength", "Dexterity", "Constitution"],
  },
];

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
  // Character state
  const character = reactive({
    name: "",
    species: null,
    speciesDetails: null,
    speciesLineage: null,
    class: null,
    classDetails: null,
    background: null,
    backgroundDetails: null,
    level: 1,
    xp: 0,
    alignment: null,
    backstory: "",
    additionalLanguages: [],
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
    speciesData.map((s) => ({ name: s.name, id: s.id }))
  );
  const classOptions = computed(() =>
    classData.map((c) => ({ name: c.name, id: c.id }))
  );
  const backgroundOptions = computed(() =>
    backgroundData.map((b) => ({ name: b.name, id: b.id }))
  );

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
    const selectedSpecies = speciesData.find((s) => s.id === character.species);
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
    } else {
      character.speciesDetails = null;
      character.size = "";
      character.speed = 0;
      character.hasHeroicInspiration = false;
      character.speciesLineage = null;
    }
  };

  const updateClassTraits = () => {
    const selectedClass = classData.find((c) => c.id === character.class);
    if (selectedClass) {
      character.classDetails = selectedClass;
      character.armorTraining = { ...selectedClass.armorTraining };
      character.equipment = [...(selectedClass.startingEquipment || [])];
      character.toolProficiencies = [
        ...(selectedClass.toolProficiencies || []),
      ];

      // Initialize skill proficiencies
      character.skillProficiencies = {};
      for (const skill of skillList) {
        character.skillProficiencies[skill.name] = {
          proficient: selectedClass.skills.includes(skill.name),
          expertise: false,
          bonus: 0,
        };
      }

      // Initialize saving throw proficiencies
      character.savingThrowProficiencies = {};
      for (const ability of abilityNames) {
        character.savingThrowProficiencies[ability] = {
          proficient: selectedClass.savingThrows.includes(ability),
          bonus: 0,
        };
      }

      // Handle spellcasting classes
      if (
        ["sorcerer", "wizard", "warlock", "bard", "cleric", "druid"].includes(
          character.class
        )
      ) {
        character.spellcastingAbilityName = selectedClass.primaryAbility;
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
    const selectedBackground = backgroundData.find(
      (b) => b.id === character.background
    );
    if (selectedBackground) {
      character.backgroundDetails = selectedBackground;
      if (!selectedBackground.toolProf.includes("(choice)")) {
        if (
          !character.toolProficiencies.includes(selectedBackground.toolProf)
        ) {
          character.toolProficiencies.push(selectedBackground.toolProf);
        }
      }
    } else {
      character.backgroundDetails = null;
    }
  };

  // Initialize character data
  const initializeCharacter = () => {
    updateAbilityModifierForAll();
    updateXPAndProficiency();
    updatePassivePerception();
    updateInitiativeBonus();

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
    initializeCharacter,

    // Static data
    standardLanguages,
    alignmentOptions,
    skillList,
    abilityNames,
  };
}
