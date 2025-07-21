// API service for D&D data (races, classes, spells, etc.)
const API_BASE_URL =
  import.meta.env.VUE_APP_DND_API_BASE_URL ||
  "https://www.dnd5eapi.co/api/2014";

export class DnDAPI {
  constructor(apiKey = null) {
    this.apiKey = apiKey || import.meta.env.VUE_APP_DND_API_KEY;
    this.baseURL = API_BASE_URL;
    this.authType = import.meta.env.VUE_APP_DND_API_AUTH_TYPE || "bearer";
  }

  // Generic API request method
  async apiRequest(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;

    const defaultHeaders = {
      Accept: "application/json",
    };

    // The 5e-bits API doesn't require authentication, but we'll keep this for other APIs
    if (this.apiKey) {
      if (this.authType === "bearer") {
        defaultHeaders["Authorization"] = `Bearer ${this.apiKey}`;
      } else {
        defaultHeaders["X-API-Key"] = this.apiKey;
      }
    }

    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(url, {
        headers: defaultHeaders,
        signal: controller.signal,
        ...options,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error.name === "AbortError") {
        throw new Error("API request timed out");
      }
      console.error("API Request failed:", error);
      throw error;
    }
  }

  // Get all D&D races (optimized for fast loading)
  async getRaces() {
    try {
      const data = await this.apiRequest("/races"); // 5e-bits API endpoint

      // For initial loading, use basic race info to show options quickly
      // We can fetch detailed info later when a race is selected
      const basicRaces = data.results.map((race) => ({
        id: race.index,
        name: race.name,
        size: "Medium", // Default values for quick loading
        speed: 30,
        darkvision: null,
        damageResistance: null,
        lineages: [],
        bonusLanguage: null,
        traits: [],
        abilityScoreIncrease: [],
        isBasicData: true, // Flag to indicate this is basic data
      }));

      return basicRaces;
    } catch (error) {
      console.error("Failed to fetch races:", error);
      // Return fallback data or empty array
      return this.getFallbackRaces();
    }
  }

  // Get specific race details (called when user selects a race)
  async getRaceDetails(raceId) {
    try {
      const details = await this.apiRequest(`/races/${raceId}`);
      return this.transformRaceData(details);
    } catch (error) {
      console.error(`Failed to fetch race ${raceId}:`, error);
      return null;
    }
  }

  // Transform single race data
  transformRaceData(race) {
    const raceId = race.index || race.name?.toLowerCase().replace(/\s+/g, "_");

    // Extract darkvision from traits
    const darkvisionTrait = race.traits?.find((trait) =>
      trait.name?.toLowerCase().includes("darkvision")
    );

    // Extract damage resistances (some races might have this)
    const damageResistances = race.damage_resistances || [];

    return {
      id: raceId,
      name: race.name,
      size: race.size || "Medium",
      speed: race.speed || 30,
      darkvision: darkvisionTrait ? 60 : null, // Most D&D races with darkvision have 60ft
      damageResistance:
        damageResistances.length > 0
          ? damageResistances.map((dr) => dr.name || dr).join(", ")
          : null,
      lineages:
        race.subraces?.map((sub) => ({
          id: sub.index || sub.name?.toLowerCase().replace(/\s+/g, "_"),
          name: sub.name,
        })) || [],
      bonusLanguage:
        race.languages?.find((lang) => lang.name !== "Common")?.name || null,
      // Additional 5e-bits specific data
      traits:
        race.traits?.map((trait) => ({
          name: trait.name,
          index: trait.index,
          url: trait.url,
        })) || [],
      abilityScoreIncrease:
        race.ability_bonuses?.map((bonus) => ({
          ability: bonus.ability_score.name,
          bonus: bonus.bonus,
        })) || [],
      alignment: race.alignment || null,
      age: race.age || null,
      sizeDescription: race.size_description || null,
      languageDescription: race.language_desc || null,
      startingProficiencies: race.starting_proficiencies || [],
      languages: race.languages || [],
      isBasicData: false,
    };
  }

  // Transform API data to match your current data structure
  transformRacesData(apiData) {
    // Transform 5e-bits API format to match your existing structure
    return apiData.map((race) => {
      const raceId =
        race.index || race.name?.toLowerCase().replace(/\s+/g, "_");

      // Extract darkvision from traits
      const darkvisionTrait = race.traits?.find((trait) =>
        trait.name?.toLowerCase().includes("darkvision")
      );

      // Extract damage resistances (some races might have this)
      const damageResistances = race.damage_resistances || [];

      return {
        id: raceId,
        name: race.name,
        size: race.size || "Medium",
        speed: race.speed || 30,
        darkvision: darkvisionTrait ? 60 : null, // Most D&D races with darkvision have 60ft
        damageResistance:
          damageResistances.length > 0
            ? damageResistances.map((dr) => dr.name || dr).join(", ")
            : null,
        lineages:
          race.subraces?.map((sub) => ({
            id: sub.index || sub.name?.toLowerCase().replace(/\s+/g, "_"),
            name: sub.name,
          })) || [],
        bonusLanguage:
          race.languages?.find((lang) => lang.name !== "Common")?.name || null,
        // Additional 5e-bits specific data
        traits:
          race.traits?.map((trait) => ({
            name: trait.name,
            index: trait.index,
            url: trait.url,
          })) || [],
        abilityScoreIncrease:
          race.ability_bonuses?.map((bonus) => ({
            ability: bonus.ability_score.name,
            bonus: bonus.bonus,
          })) || [],
        alignment: race.alignment || null,
        age: race.age || null,
        sizeDescription: race.size_description || null,
        languageDescription: race.language_desc || null,
        startingProficiencies: race.starting_proficiencies || [],
        languages: race.languages || [],
      };
    });
  }

  // ========== CLASSES API ==========

  // Get all available classes
  async getClasses() {
    try {
      const data = await this.apiRequest("/classes");

      if (data && data.results) {
        // Transform basic class data
        const classes = data.results.map((cls) => ({
          id: cls.index,
          name: cls.name,
          isBasicData: true, // Mark as basic data that needs detail fetching
        }));

        return classes;
      }

      return this.getFallbackClasses();
    } catch (error) {
      console.error("Failed to fetch classes:", error);
      return this.getFallbackClasses();
    }
  }

  // Get specific class details (called when user selects a class)
  async getClassDetails(classId) {
    try {
      const details = await this.apiRequest(`/classes/${classId}`);
      return this.transformClassData(details);
    } catch (error) {
      console.error(`Failed to fetch class ${classId}:`, error);
      return null;
    }
  }

  // Transform single class data
  transformClassData(classData) {
    const classId =
      classData.index || classData.name?.toLowerCase().replace(/\s+/g, "_");

    return {
      id: classId,
      name: classData.name,
      hitDie: `D${classData.hit_die}`,
      primaryAbility: this.extractPrimaryAbility(classData),
      savingThrows: classData.saving_throws?.map((st) => st.name) || [],
      skillChoices:
        classData.proficiency_choices?.find((pc) =>
          pc.desc?.toLowerCase().includes("skill")
        )?.choose || 2,
      skills: this.extractSkillOptions(classData),
      armorTraining: this.extractArmorProficiencies(classData),
      startingEquipment: this.extractStartingEquipment(classData),
      weaponMasteryChoices: 0, // 2024 rules specific
      expertiseSkills: [], // Will be class-specific
      spellcasting: this.extractSpellcastingInfo(classData),
      subclasses:
        classData.subclasses?.map((sub) => ({
          id: sub.index,
          name: sub.name,
          url: sub.url,
        })) || [],
      multiclassing: classData.multi_classing || null,
      classLevels: classData.class_levels || null,
    };
  }

  // Helper methods for class transformation
  extractPrimaryAbility(classData) {
    // This varies by class and isn't directly in the API
    const classAbilities = {
      barbarian: "Strength",
      bard: "Charisma",
      cleric: "Wisdom",
      druid: "Wisdom",
      fighter: "Strength or Dexterity",
      monk: "Dexterity and Wisdom",
      paladin: "Strength and Charisma",
      ranger: "Dexterity and Wisdom",
      rogue: "Dexterity",
      sorcerer: "Charisma",
      warlock: "Charisma",
      wizard: "Intelligence",
    };

    return classAbilities[classData.index] || "Varies";
  }

  extractSkillOptions(classData) {
    const skillChoice = classData.proficiency_choices?.find((pc) =>
      pc.desc?.toLowerCase().includes("skill")
    );

    if (skillChoice && skillChoice.from && skillChoice.from.options) {
      return skillChoice.from.options
        .filter((opt) => opt.item?.name?.startsWith("Skill:"))
        .map((opt) => opt.item.name.replace("Skill: ", ""));
    }

    return [];
  }

  extractArmorProficiencies(classData) {
    const proficiencies = classData.proficiencies || [];

    return {
      light: proficiencies.some((p) => p.name === "Light Armor"),
      medium: proficiencies.some((p) => p.name === "Medium Armor"),
      heavy: proficiencies.some((p) => p.name === "Heavy Armor"),
      shields: proficiencies.some((p) => p.name === "Shields"),
    };
  }

  extractStartingEquipment(classData) {
    const equipment = classData.starting_equipment || [];

    return equipment.map((item) => ({
      name: item.equipment.name,
      quantity: item.quantity,
      // Add more details as needed
    }));
  }

  extractSpellcastingInfo(classData) {
    // Check if class has spellcasting
    const spellcastingClasses = [
      "bard",
      "cleric",
      "druid",
      "paladin",
      "ranger",
      "sorcerer",
      "warlock",
      "wizard",
    ];

    if (spellcastingClasses.includes(classData.index)) {
      return {
        isSpellcaster: true,
        spellcastingAbility: this.getSpellcastingAbility(classData.index),
        cantripsKnown: this.getCantripsForClass(classData.index),
        spellsKnown: this.getSpellsForClass(classData.index),
      };
    }

    return { isSpellcaster: false };
  }

  getSpellcastingAbility(classIndex) {
    const abilities = {
      bard: "Charisma",
      cleric: "Wisdom",
      druid: "Wisdom",
      paladin: "Charisma",
      ranger: "Wisdom",
      sorcerer: "Charisma",
      warlock: "Charisma",
      wizard: "Intelligence",
    };

    return abilities[classIndex] || "";
  }

  getCantripsForClass(classIndex) {
    // Starting cantrips at level 1
    const cantrips = {
      bard: 2,
      cleric: 3,
      druid: 2,
      sorcerer: 4,
      warlock: 2,
      wizard: 3,
    };

    return cantrips[classIndex] || 0;
  }

  getSpellsForClass(classIndex) {
    // Starting spell slots at level 1
    const spells = {
      bard: 4,
      cleric: 2,
      druid: 2,
      paladin: 0, // Paladins don't get spells at level 1
      ranger: 0, // Rangers don't get spells at level 1
      sorcerer: 2,
      warlock: 1,
      wizard: 6, // Wizards get spells in spellbook
    };

    return spells[classIndex] || 0;
  }

  // ========== BACKGROUNDS API ==========

  // Get all available backgrounds
  async getBackgrounds() {
    try {
      const data = await this.apiRequest("/backgrounds");

      if (data && data.results) {
        // Get detailed background data for each background
        const backgrounds = await Promise.all(
          data.results.map(async (bg) => {
            try {
              const details = await this.getBackgroundDetails(bg.index);
              return details;
            } catch (error) {
              console.error(
                `Failed to fetch details for background ${bg.index}:`,
                error
              );
              // Return basic data if details fetch fails
              return {
                id: bg.index,
                name: bg.name,
                isBasicData: true,
              };
            }
          })
        );

        return backgrounds.filter((bg) => bg !== null);
      }

      return this.getFallbackBackgrounds();
    } catch (error) {
      console.error("Failed to fetch backgrounds:", error);
      return this.getFallbackBackgrounds();
    }
  }

  // Get detailed background information
  async getBackgroundDetails(backgroundId) {
    try {
      const data = await this.apiRequest(`/backgrounds/${backgroundId}`);
      return this.transformBackgroundData(data);
    } catch (error) {
      console.error(
        `Failed to fetch background details for ${backgroundId}:`,
        error
      );
      return null;
    }
  }

  transformBackgroundData(backgroundData) {
    return {
      id: backgroundData.index,
      name: backgroundData.name,
      description: backgroundData.description || "",
      skillProficiencies:
        backgroundData.skill_proficiencies?.map((skill) => skill.name) || [],
      toolProficiencies:
        backgroundData.tool_proficiencies?.map((tool) => tool.name) || [],
      languages: backgroundData.languages?.map((lang) => lang.name) || [],
      languageOptions: backgroundData.language_options || null,
      startingEquipment:
        backgroundData.starting_equipment?.map((item) => ({
          name: item.equipment?.name || item.name,
          quantity: item.quantity || 1,
        })) || [],
      startingEquipmentOptions: backgroundData.starting_equipment_options || [],
      feature: backgroundData.feature || null,
      personalityTraits: backgroundData.personality_traits || null,
      ideals: backgroundData.ideals || null,
      bonds: backgroundData.bonds || null,
      flaws: backgroundData.flaws || null,
      isBasicData: false,
    };
  }

  getFallbackBackgrounds() {
    return [
      {
        id: "acolyte",
        name: "Acolyte",
        description:
          "You have spent your life in the service of a temple to a specific god or pantheon of gods.",
        skillProficiencies: ["Insight", "Religion"],
        toolProficiencies: [],
        languages: [],
        languageOptions: {
          choose: 2,
          from: ["Common", "Celestial", "Abyssal"],
        },
        startingEquipment: [
          { name: "Holy Symbol", quantity: 1 },
          { name: "Prayer Book", quantity: 1 },
          { name: "Incense", quantity: 5 },
        ],
        feature: {
          name: "Shelter of the Faithful",
          description:
            "You can perform religious ceremonies and gain shelter at temples.",
        },
        isBasicData: true,
      },
      {
        id: "criminal",
        name: "Criminal",
        description:
          "You are an experienced criminal with a history of breaking the law.",
        skillProficiencies: ["Deception", "Stealth"],
        toolProficiencies: ["Thieves' Tools", "Gaming Set"],
        languages: [],
        languageOptions: null,
        startingEquipment: [
          { name: "Crowbar", quantity: 1 },
          { name: "Dark Common Clothes", quantity: 1 },
          { name: "Belt Pouch", quantity: 1 },
        ],
        feature: {
          name: "Criminal Contact",
          description:
            "You have a reliable contact in the criminal underworld.",
        },
        isBasicData: true,
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
        isBasicData: true,
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
        isBasicData: true,
      },
    ];
  }

  // ========== EQUIPMENT API ==========

  // Get all available equipment
  async getEquipment() {
    try {
      const data = await this.apiRequest("/equipment");

      if (data && data.results) {
        // Get detailed equipment data for common starting items
        const equipmentIds = data.results.slice(0, 50).map((eq) => eq.index); // Limit to first 50 for performance

        const equipment = await Promise.all(
          equipmentIds.map(async (eqId) => {
            try {
              const details = await this.getEquipmentDetails(eqId);
              return details;
            } catch (error) {
              console.error(
                `Failed to fetch details for equipment ${eqId}:`,
                error
              );
              return null;
            }
          })
        );

        return equipment.filter((eq) => eq !== null);
      }

      return this.getFallbackEquipment();
    } catch (error) {
      console.error("Failed to fetch equipment:", error);
      return this.getFallbackEquipment();
    }
  }

  // Get detailed equipment information
  async getEquipmentDetails(equipmentId) {
    try {
      const data = await this.apiRequest(`/equipment/${equipmentId}`);
      return this.transformEquipmentData(data);
    } catch (error) {
      console.error(
        `Failed to fetch equipment details for ${equipmentId}:`,
        error
      );
      return null;
    }
  }

  transformEquipmentData(equipmentData) {
    return {
      id: equipmentData.index,
      name: equipmentData.name,
      category: equipmentData.equipment_category?.name || "Miscellaneous",
      cost: equipmentData.cost
        ? {
            quantity: equipmentData.cost.quantity,
            unit: equipmentData.cost.unit,
          }
        : { quantity: 0, unit: "gp" },
      weight: equipmentData.weight || 0,
      description: equipmentData.desc?.join(" ") || "",
      // Weapon specific
      damage: equipmentData.damage
        ? {
            dice: equipmentData.damage.damage_dice,
            type: equipmentData.damage.damage_type?.name,
          }
        : null,
      weaponCategory: equipmentData.weapon_category || null,
      weaponRange: equipmentData.weapon_range || null,
      properties: equipmentData.properties?.map((prop) => prop.name) || [],
      // Armor specific
      armorCategory: equipmentData.armor_category || null,
      armorClass: equipmentData.armor_class
        ? {
            base: equipmentData.armor_class.base,
            dexBonus: equipmentData.armor_class.dex_bonus,
            maxBonus: equipmentData.armor_class.max_bonus,
          }
        : null,
      strengthMinimum: equipmentData.str_minimum || null,
      stealthDisadvantage: equipmentData.stealth_disadvantage || false,
      isBasicData: false,
    };
  }

  getFallbackEquipment() {
    return [
      {
        id: "longsword",
        name: "Longsword",
        category: "Weapon",
        cost: { quantity: 15, unit: "gp" },
        weight: 3,
        description: "A versatile martial weapon.",
        damage: { dice: "1d8", type: "slashing" },
        weaponCategory: "Martial Melee",
        properties: ["Versatile"],
        isBasicData: true,
      },
      {
        id: "leather-armor",
        name: "Leather Armor",
        category: "Armor",
        cost: { quantity: 10, unit: "gp" },
        weight: 10,
        description: "Light armor made of supple leather.",
        armorCategory: "Light Armor",
        armorClass: { base: 11, dexBonus: true, maxBonus: null },
        isBasicData: true,
      },
      {
        id: "backpack",
        name: "Backpack",
        category: "Adventuring Gear",
        cost: { quantity: 2, unit: "gp" },
        weight: 5,
        description: "A sturdy backpack for carrying equipment.",
        isBasicData: true,
      },
      {
        id: "bedroll",
        name: "Bedroll",
        category: "Adventuring Gear",
        cost: { quantity: 1, unit: "gp" },
        weight: 7,
        description: "A simple sleeping roll.",
        isBasicData: true,
      },
    ];
  }

  getSpellsForClass(classIndex) {
    // Starting spells known/prepared at level 1
    const spells = {
      bard: 4,
      cleric: "Wisdom modifier + 1",
      druid: "Wisdom modifier + 1",
      paladin: 0, // Gets spells at level 2
      ranger: 0, // Gets spells at level 2
      sorcerer: 2,
      warlock: 1,
      wizard: "Intelligence modifier + 1",
    };

    return spells[classIndex] || 0;
  }

  // Fallback data in case API fails
  getFallbackClasses() {
    return [
      {
        id: "barbarian",
        name: "Barbarian",
        hitDie: "D12",
        primaryAbility: "Strength",
        isBasicData: false,
      },
      {
        id: "fighter",
        name: "Fighter",
        hitDie: "D10",
        primaryAbility: "Strength or Dexterity",
        isBasicData: false,
      },
      {
        id: "rogue",
        name: "Rogue",
        hitDie: "D8",
        primaryAbility: "Dexterity",
        isBasicData: false,
      },
      {
        id: "wizard",
        name: "Wizard",
        hitDie: "D6",
        primaryAbility: "Intelligence",
        isBasicData: false,
      },
    ];
  }
  getFallbackRaces() {
    return [
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
      {
        id: "elf",
        name: "Elf",
        size: "Medium",
        speed: 30,
        darkvision: 60,
        damageResistance: null,
        lineages: [
          { id: "high_elf", name: "High Elf" },
          { id: "wood_elf", name: "Wood Elf" },
        ],
        bonusLanguage: null,
      },
      // Add more fallback races as needed
    ];
  }
}

// Create API instance
export const dndAPI = new DnDAPI();

// Keep the old export for backward compatibility
export const dndRacesAPI = dndAPI;
