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
