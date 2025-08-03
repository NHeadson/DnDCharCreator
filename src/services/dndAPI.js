// --- Robust LocalStorage Caching for Species (Races) ---
// Helper for extracting spellcasting info (for use outside the class)
function extractSpellcastingInfo(apiClass) {
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
  if (spellcastingClasses.includes(apiClass.index)) {
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
    const cantrips = {
      bard: 2,
      cleric: 3,
      druid: 2,
      sorcerer: 4,
      warlock: 2,
      wizard: 3,
    };
    // You can expand this as needed for more spellcasting info
    return {
      spellcastingAbility: abilities[apiClass.index] || "",
      cantripsKnown: cantrips[apiClass.index] || 0,
    };
  }
  return null;
}
// API service for D&D data (races, classes, spells, etc.)
const API_BASE_URL =
  import.meta.env.VUE_APP_DND_API_BASE_URL ||
  "https://www.dnd5eapi.co/api/2014";

export class DnDAPI {
  constructor(apiKey = null) {
    this.apiKey = apiKey || import.meta.env.VUE_APP_DND_API_KEY;
    this.baseURL = API_BASE_URL;
    this.authType = import.meta.env.VUE_APP_DND_API_AUTH_TYPE || "bearer";
    this.requestQueue = [];
    this.isProcessingQueue = false;
    this.lastRequestTime = 0;
    this.minRequestInterval = 100; // Minimum 100ms between requests to avoid rate limiting

    // Simple cache to avoid re-fetching data
    this.cache = new Map();
    this.cacheExpiry = 5 * 60 * 1000; // 5 minutes cache
  }

  // --- Robust LocalStorage Caching for Species (Races) ---
  static SPECIES_CACHE_KEY = "dnd_species_data_v2";
  static SPECIES_CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

  static getCachedSpeciesData() {
    try {
      const cached = localStorage.getItem(DnDAPI.SPECIES_CACHE_KEY);
      if (!cached) return null;
      const parsed = JSON.parse(cached);
      if (
        parsed &&
        parsed.timestamp &&
        Date.now() - parsed.timestamp < DnDAPI.SPECIES_CACHE_TTL &&
        Array.isArray(parsed.data)
      ) {
        return parsed.data;
      }
      return null;
    } catch (e) {
      return null;
    }
  }

  static setCachedSpeciesData(data) {
    try {
      localStorage.setItem(
        DnDAPI.SPECIES_CACHE_KEY,
        JSON.stringify({ data, timestamp: Date.now() })
      );
    } catch (e) {}
  }

  // Check cache before making API requests
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
      return cached.data;
    }
    return null;
  }

  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  // Rate-limited API request method
  async apiRequest(endpoint, options = {}) {
    return new Promise((resolve, reject) => {
      this.requestQueue.push({ endpoint, options, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.isProcessingQueue || this.requestQueue.length === 0) {
      return;
    }

    this.isProcessingQueue = true;

    // Process requests in batches for better performance
    const batchSize = 3; // Process 3 requests in parallel

    while (this.requestQueue.length > 0) {
      const batch = this.requestQueue.splice(0, batchSize);
      // Process batch in parallel
      const batchPromises = batch.map(
        async ({ endpoint, options, resolve, reject }) => {
          try {
            const result = await this.makeActualRequest(endpoint, options);
            this.lastRequestTime = Date.now();
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }
      );
      await Promise.all(batchPromises);
      // Increased delay between batches to avoid 429 rate limit
      if (this.requestQueue.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, 400)); // Increased to 400ms for better rate limiting
      }
    }

    this.isProcessingQueue = false;
  }

  // Generic API request method
  async makeActualRequest(endpoint, options = {}) {
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
      const timeoutId = setTimeout(() => controller.abort(), 10_000); // 10 second timeout

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

  // Helper methods for parsing race data
  extractDarkvision(race) {
    try {
      // First check if there's a direct vision property
      if (race.vision && race.vision.darkvision) {
        return race.vision.darkvision;
      }

      // Check traits for darkvision
      const darkvisionTrait = (race.traits || []).find((t) =>
        t.name?.toLowerCase().includes("darkvision")
      );

      if (darkvisionTrait) {
        // Handle both array and string descriptions
        const descText = Array.isArray(darkvisionTrait.desc)
          ? darkvisionTrait.desc[0]
          : darkvisionTrait.desc;

        if (descText) {
          const match = descText.match(/(\d+)/);
          return match ? Number.parseInt(match[0]) : 60; // Default to 60 if no number found
        }
      }

      // Finally, check if the race name itself indicates darkvision
      const darkVisionRaces = [
        "dwarf",
        "elf",
        "drow",
        "half-elf",
        "half-orc",
        "tiefling",
        "gnome",
      ];
      if (
        typeof race.index === "string" &&
        darkVisionRaces.includes(race.index.toLowerCase())
      ) {
        return 60;
      }

      return null;
    } catch (error) {
      console.error(
        `Error extracting darkvision for ${race?.name || "unknown"}:`,
        error
      );
      return null;
    }
  }

  extractResistances(race) {
    try {
      // Check direct damage_resistances property
      if (race.damage_resistances && race.damage_resistances.length > 0) {
        return race.damage_resistances
          .map((dr) => (typeof dr === "string" ? dr : dr.name || dr.type || ""))
          .filter(Boolean)
          .join(", ");
      }

      // Check traits for resistance information
      const resistanceTrait = (race.traits || []).find(
        (t) =>
          t.name?.toLowerCase().includes("damage resistance") ||
          (t.desc &&
            (Array.isArray(t.desc)
              ? t.desc[0]?.toLowerCase().includes("resistance")
              : t.desc?.toLowerCase().includes("resistance")))
      );

      if (resistanceTrait) {
        const descText = Array.isArray(resistanceTrait.desc)
          ? resistanceTrait.desc[0]
          : resistanceTrait.desc;
        return descText || null;
      }

      // Check if race typically has resistances
      const resistanceRaces = {
        dragonborn: "Acid, Cold, Fire, Lightning, or Poison (chosen)",
        dwarf: "Poison",
        tiefling: "Fire",
      };

      if (race.index?.toLowerCase && resistanceRaces[race.index]) {
        return resistanceRaces[race.index];
      }

      return null;
    } catch (error) {
      console.error(
        `Error extracting resistances for ${race?.name || "unknown"}:`,
        error
      );
      return null;
    }
  }

  extractBonusLanguage(race) {
    try {
      // Check direct languages property
      if (race.languages && race.languages.length > 0) {
        const nonCommonLang = race.languages.find(
          (l) =>
            l.name?.toLowerCase() !== "common" ||
            l.index?.toLowerCase() !== "common"
        );
        if (nonCommonLang) {
          return nonCommonLang.name || nonCommonLang.index;
        }
      }

      // Check language traits
      const languageTrait = (race.traits || []).find(
        (t) =>
          t.name?.toLowerCase().includes("language") ||
          (t.desc &&
            (Array.isArray(t.desc)
              ? t.desc[0]?.toLowerCase().includes("language")
              : t.desc?.toLowerCase().includes("language")))
      );

      if (languageTrait) {
        const descText = Array.isArray(languageTrait.desc)
          ? languageTrait.desc[0]
          : languageTrait.desc;
        return descText || null;
      }

      // Check if race typically has bonus languages
      const bonusLanguageRaces = ["high-elf", "half-elf"];
      if (
        race.index?.toLowerCase &&
        bonusLanguageRaces.includes(race.index?.toLowerCase())
      ) {
        return "choice";
      }

      return null;
    } catch (error) {
      console.error(
        `Error extracting bonus language for ${race?.name || "unknown"}:`,
        error
      );
      return null;
    }
  }

  extractSubraces(race) {
    try {
      // Fallback subrace data for common races
      const fallbackSubraces = {
        dwarf: [
          { id: "hill-dwarf", name: "Hill Dwarf" },
          { id: "mountain-dwarf", name: "Mountain Dwarf" },
        ],
        elf: [
          { id: "high-elf", name: "High Elf" },
          { id: "wood-elf", name: "Wood Elf" },
          { id: "dark-elf", name: "Dark Elf (Drow)" },
        ],
        halfling: [
          { id: "lightfoot", name: "Lightfoot" },
          { id: "stout", name: "Stout" },
        ],
        gnome: [
          { id: "forest-gnome", name: "Forest Gnome" },
          { id: "rock-gnome", name: "Rock Gnome" },
        ],
      };

      if (race.subraces && Array.isArray(race.subraces)) {
        // If API returns only 0 or 1 subrace for a race that should have more, use fallback
        const key = race.index?.toLowerCase();
        if (fallbackSubraces[key] && race.subraces.length < 2) {
          return fallbackSubraces[key];
        }
        return race.subraces
          .filter((sub) => sub && (sub.index || sub.name))
          .map((sub) => ({
            id: sub.index || sub.name?.toLowerCase().replace(/\s+/g, "-"),
            name:
              sub.name ||
              sub.index
                ?.split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" "),
          }));
      }

      // If no subraces found, check fallback data
      const key = race.index?.toLowerCase();
      if (fallbackSubraces[key]) {
        return fallbackSubraces[key];
      }

      return [];
    } catch (error) {
      console.error(
        `Error extracting subraces for ${race?.name || "unknown"}:`,
        error
      );
      return [];
    }
  }

  // Get all D&D races
  async getRaces() {
    // Try robust localStorage cache first
    const cached = DnDAPI.getCachedSpeciesData();
    if (cached && Array.isArray(cached) && cached.length > 0) {
      console.log("Using robust localStorage species cache");
      return cached;
    }

    const cacheKey = "all-races";
    const memCached = this.getCachedData(cacheKey);
    if (memCached) {
      console.log("Using in-memory races data");
      return memCached;
    }

    try {
      console.log("Fetching races from API...");
      const response = await this.apiRequest("/races", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response || !response.results) {
        console.warn("Invalid API response format, using fallback data");
        return this.getFallbackRaces();
      }

      console.log(
        `Found ${response.results.length} races, fetching details...`
      );

      // Get detailed information for each race in parallel
      const racePromises = response.results.map((race) =>
        this.apiRequest(`/races/${race.index}`).catch((error) => {
          console.error(
            `Failed to fetch details for race ${race.index}:`,
            error
          );
          // Return a basic race object if detail fetch fails
          return {
            index: race.index,
            name: race.name,
            url: race.url,
            isBasicData: true,
          };
        })
      );

      const raceDetails = await Promise.all(racePromises);
      console.log(
        `Successfully fetched details for ${raceDetails.length} races`
      );

      const races = raceDetails
        .map((race) => {
          if (!race || !race.index) {
            console.warn("Received invalid race data:", race);
            return null;
          }

          try {
            // Start with basic required fields
            const processedRace = {
              id: race.index,
              index: race.index,
              name: race.name || race.index.replace(/-/g, " "),
              size: race.size || "Medium",
              speed: race.speed || 30,
              darkvision: this.extractDarkvision(race),
              damageResistance: this.extractResistances(race),
              lineages: this.extractSubraces(race),
              bonusLanguage: this.extractBonusLanguage(race),
              traits: [],
            };

            // Add optional fields if they exist
            if (race.traits) {
              processedRace.traits = race.traits.map((trait) => ({
                name: trait.name,
                description: Array.isArray(trait.desc)
                  ? trait.desc.join("\n")
                  : trait.desc || "",
              }));
            }

            if (race.ability_bonuses) {
              processedRace.abilityBonus = race.ability_bonuses.map(
                (bonus) => ({
                  ability:
                    bonus.ability_score?.name ||
                    bonus.ability_score?.index?.toUpperCase() ||
                    "Unknown",
                  bonus: bonus.bonus || 0,
                })
              );
            }

            console.log(`Successfully processed race: ${race.name}`);
            return processedRace;
          } catch (error) {
            console.error(
              `Error processing race ${
                race?.name || race?.index || "unknown"
              }:`,
              error
            );
            return null;
          }
        })
        .filter((race) => race !== null);

      if (races.length === 0) {
        console.warn("No races processed successfully, using fallback data");
        return this.getFallbackRaces();
      }

      console.log(`Returning ${races.length} processed races`);
      this.setCachedData(cacheKey, races);
      // Always return fully transformed race data
      const transformed = races.map((race) => this.transformRaceData(race));
      DnDAPI.setCachedSpeciesData(transformed);
      return transformed;
    } catch (error) {
      console.error("Failed to fetch races:", error);
      // Return fallback data or empty array
      // Always return fully transformed fallback data
      const fallback = this.getFallbackRaces().map((race) =>
        this.transformRaceData(race)
      );
      DnDAPI.setCachedSpeciesData(fallback);
      return fallback;
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

    // Extract damage resististances (some races might have this)
    const damageResistances = race.damage_resistances || [];

    let languages = Array.isArray(race.languages)
      ? race.languages.map((l) => (typeof l === "string" ? l : l.name || l))
      : [];
    // Fallback for Dragonborn if languages is empty
    if ((!languages || !languages.length) && race.index === "dragonborn") {
      languages = ["Common", "Draconic"];
    }
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
      lineages: this.extractSubraces(race),
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
      languages,
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

      // Extract damage resististances (some races might have this)
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

  // Get all D&D classes with full details
  async getClasses() {
    const cacheKey = "all-classes-basic";
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      console.log("Using cached basic classes data");
      return cached;
    }

    try {
      const response = await this.apiRequest("/classes", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      if (!response || !response.results) {
        throw new Error("Invalid API response format");
      }

      // Only fetch basic info for initial load
      const basicClasses = response.results.map((dndClass) => ({
        index: dndClass.index,
        name: dndClass.name,
      }));

      this.setCachedData(cacheKey, basicClasses);
      return basicClasses;
    } catch (error) {
      console.error("Failed to fetch classes:", error);
      return this.getFallbackClasses();
    }
  }

  // Generate a character name based on race
  generateCharacterName(race = "human") {
    // Import and use the name generator
    try {
      const { generateCharacterName } = require("./nameGenerator");
      return generateCharacterName(race);
    } catch (error) {
      console.error("Error generating name:", error);
      return this.generateFallbackName(race);
    }
  }

  // Fallback name generation in case the main generator fails
  generateFallbackName(race = "human") {
    const fallbackNames = {
      human: ["John Smith", "Mary Johnson", "James Wilson", "Sarah Brown"],
      elf: [
        "Aelindra Silverleaf",
        "Celeborn Starweaver",
        "Galador Moonwhisper",
      ],
      dwarf: ["Thorin Stonefist", "Dwalin Ironbeard", "Balin Rockbreaker"],
    };

    const names = fallbackNames[race.toLowerCase()] || fallbackNames.human;
    return names[Math.floor(Math.random() * names.length)];
  }

  // This method has been moved and combined with the other extractStartingEquipment implementation

  // Get specific class details (called when user selects a class)
  async getClassDetails(classId) {
    try {
      const details = await this.apiRequest(`/classes/${classId}`);
      // Only fetch spellcasting info for classes that have it
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
      let spellcasting = null;
      if (spellcastingClasses.includes(details.index)) {
        try {
          spellcasting = await this.apiRequest(
            `/classes/${classId}/spellcasting`
          );
        } catch (e) {
          spellcasting = null;
        }
      }

      // Fetch level 1 features from /classes/{classId}/levels/1
      let features = [];
      try {
        const level1 = await this.apiRequest(`/classes/${classId}/levels/1`);
        if (level1 && Array.isArray(level1.features)) {
          const featurePromises = level1.features.map(async (f) => {
            try {
              const featureDetail = await this.apiRequest(
                `/features/${f.index}`
              );
              return featureDetail;
            } catch (e) {
              return null;
            }
          });
          features = (await Promise.all(featurePromises)).filter(Boolean);
        }
      } catch (e) {
        // fallback: no features found
        features = [];
      }

      return this.transformClassData(details, spellcasting, features);
    } catch (error) {
      console.error(`Failed to fetch class ${classId}:`, error);
      return null;
    }
  }

  // Transform single class data
  transformClassData(
    classData,
    spellcastingDetails = null,
    featureDetails = null
  ) {
    console.log("Transforming class data:", classData);
    console.log(
      "[transformClassData] proficiency_choices:",
      classData.proficiency_choices
    );
    const classId =
      classData.index || classData.name?.toLowerCase().replace(/\s+/g, "_");

    // Normalize spellcasting
    let spellcasting =
      spellcastingDetails || extractSpellcastingInfo(classData);
    if (spellcastingDetails && spellcastingDetails.info) {
      spellcasting = {
        ability: spellcastingDetails.spellcasting_ability?.name || "",
        cantripsKnown: spellcastingDetails.cantrips_known,
        spellsKnown: spellcastingDetails.spells_known,
        spellSlots: spellcastingDetails.spell_slots,
        info: spellcastingDetails.info.map((i) => ({
          name: i.name,
          desc: Array.isArray(i.desc) ? i.desc.join(" ") : i.desc,
        })),
      };
    }

    // Normalize features
    let features = [];
    if (featureDetails && Array.isArray(featureDetails)) {
      features = featureDetails.map((f) => ({
        name: f.name,
        desc: Array.isArray(f.desc) ? f.desc : f.desc || "",
        feature_specific: f.feature_specific || null,
      }));
    } else if (classData.features && Array.isArray(classData.features)) {
      features = classData.features.map((f) => ({
        name: f.name,
        desc: Array.isArray(f.desc) ? f.desc : f.desc || "",
        feature_specific: f.feature_specific || null,
      }));
    }

    const transformed = {
      id: classId,
      index: classData.index, // Preserve index for future API calls
      name: classData.name,
      description: classData.desc?.join(" ") || `The ${classData.name} class.`,
      hitDie: `D${classData.hit_die}`,
      hpDie: `D${classData.hit_die}`,
      primaryAbility: this.extractPrimaryAbility(classData),
      savingThrows: classData.saving_throws?.map((st) => st.name) || [],
      skillChoices:
        classData.proficiency_choices?.find((pc) =>
          pc.desc?.toLowerCase().includes("skill")
        )?.choose || 2,
      skills: this.extractSkillOptions(classData),
      armorTraining: this.extractArmorProficiencies(classData),
      startingEquipment: this.extractStartingEquipment(classData),
      weaponProficiencies: this.extractWeaponProficiencies(classData),
      toolProficiencies: this.extractToolProficiencies(classData) || [],
      skillProficiencies: this.extractSkillProficiencies(classData) || {
        count: 0,
        from: [],
      },
      weaponMasteryChoices: 0, // 2024 rules specific
      expertiseSkills: [], // Will be class-specific
      spellcasting,
      subclasses:
        classData.subclasses?.map((sub) => ({
          id: sub.index,
          name: sub.name,
          url: sub.url,
        })) || [],
      multiclassing: classData.multi_classing || null,
      classLevels: classData.class_levels || null,
      features,
      // Additional fields for full detail display:
      prerequisites:
        classData.prerequisites ||
        classData.multi_classing?.prerequisites ||
        [],
      proficiencies: classData.proficiencies || [],
      proficiencyChoices: classData.proficiency_choices || [],
      startingEquipmentOptions: classData.starting_equipment_options || [],
      raw: classData, // Optionally include the full raw object for debugging/expansion
    };

    console.log("Transformed class data result:", transformed);
    return transformed;
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
    if (skillChoice && skillChoice.from) {
      let options = [];
      if (
        typeof skillChoice.from === "object" &&
        skillChoice.from !== null &&
        Array.isArray(skillChoice.from.options)
      ) {
        // Handles { option_set_type: 'options_array', options: [...] }
        options = skillChoice.from.options;
      } else if (Array.isArray(skillChoice.from)) {
        options = skillChoice.from;
      } else if (Array.isArray(skillChoice.from?.items)) {
        options = skillChoice.from.items;
      } else if (typeof skillChoice.from === "string") {
        options = [skillChoice.from];
      }
      console.log("[extractSkillOptions] options:", options);
      return options
        .map((opt) => {
          let name = null;
          if (opt && opt.item && typeof opt.item.name === "string") {
            name = opt.item.name;
          } else if (opt && typeof opt.name === "string") {
            name = opt.name;
          }
          if (name && name.startsWith("Skill:")) {
            // Remove everything up to and including the colon and any whitespace
            return name.replace(/^Skill:\s*/, "");
          } else if (name) {
            return name;
          }
          return null;
        })
        .filter(Boolean);
    }
    return [];
  }

  extractArmorProficiencies(classData) {
    const proficiencies = classData.proficiencies || [];

    // Debug logging
    console.log("Extracting armor proficiencies for class:", classData.name);
    console.log(
      "All proficiencies:",
      proficiencies.map((p) => p.name)
    );

    // Check for "All armor" proficiency which means light, medium, and heavy
    const hasAllArmor = proficiencies.some((p) => p.name === "All armor");

    const result = {
      light: hasAllArmor || proficiencies.some((p) => p.name === "Light Armor"),
      medium:
        hasAllArmor || proficiencies.some((p) => p.name === "Medium Armor"),
      heavy: hasAllArmor || proficiencies.some((p) => p.name === "Heavy Armor"),
      shields: proficiencies.some((p) => p.name === "Shields"),
    };

    console.log("Extracted armor training:", result);
    return result;
  }

  extractWeaponProficiencies(classData) {
    // Extract weapon proficiencies from the class data
    const proficiencies = classData.proficiencies || [];
    // Filter for weapon proficiencies (usually contain 'Weapon' in the name)
    return proficiencies
      .filter(
        (p) =>
          p.name &&
          (p.name.includes("Weapon") ||
            p.name.match(/^(Simple|Martial) Weapons?$/i) ||
            p.name.match(/\bWeapons?\b/i))
      )
      .map((p) => p.name);
  }

  extractToolProficiencies(classData) {
    // Extract tool proficiencies from the class data
    const proficiencies = classData.proficiencies || [];
    // Filter for tool proficiencies (usually contain 'Tool' in the name)
    return proficiencies
      .filter((p) => p.name && p.name.toLowerCase().includes("tool"))
      .map((p) => p.name);
  }

  extractSkillProficiencies(classData) {
    // Extract skill proficiencies from the class data
    console.log("[extractSkillProficiencies] class:", classData.name);
    console.log(
      "[extractSkillProficiencies] proficiency_choices:",
      classData.proficiency_choices
    );
    const skillChoices = (classData.proficiency_choices || []).filter((pc) => {
      // If from.options contains any option whose item.index starts with 'skill-', treat as skill proficiency
      let options = [];
      if (
        pc.from &&
        typeof pc.from === "object" &&
        Array.isArray(pc.from.options)
      ) {
        options = pc.from.options;
      } else if (Array.isArray(pc.from)) {
        options = pc.from;
      } else if (Array.isArray(pc.from?.items)) {
        options = pc.from.items;
      } else if (typeof pc.from === "string") {
        options = [pc.from];
      } else if (pc.from && typeof pc.from === "object") {
        const arrProp = Object.values(pc.from).find(Array.isArray);
        if (arrProp) options = arrProp;
      }
      return options.some(
        (opt) =>
          (opt &&
            opt.item &&
            typeof opt.item.index === "string" &&
            opt.item.index.startsWith("skill-")) ||
          (opt &&
            typeof opt.index === "string" &&
            opt.index.startsWith("skill-"))
      );
    });
    let allSkills = [];
    let totalChoose = 0;
    for (const skillChoice of skillChoices) {
      let options = [];
      if (
        skillChoice.from &&
        typeof skillChoice.from === "object" &&
        Array.isArray(skillChoice.from.options)
      ) {
        options = skillChoice.from.options;
      } else if (Array.isArray(skillChoice.from)) {
        options = skillChoice.from;
      } else if (Array.isArray(skillChoice.from?.items)) {
        options = skillChoice.from.items;
      } else if (typeof skillChoice.from === "string") {
        options = [skillChoice.from];
      } else if (skillChoice.from && typeof skillChoice.from === "object") {
        const arrProp = Object.values(skillChoice.from).find(Array.isArray);
        if (arrProp) {
          options = arrProp;
        }
      }

      if (!options.length && skillChoice.from) {
        console.warn(
          "[extractSkillProficiencies] Unhandled skillChoice.from structure (no options):",
          skillChoice.from
        );
      }

      console.log("[extractSkillProficiencies] options:", options);
      let skills = options
        .map((opt) => {
          let name = null;
          if (opt && opt.item && typeof opt.item.name === "string") {
            name = opt.item.name;
          } else if (opt && typeof opt.name === "string") {
            name = opt.name;
          }
          if (name && name.startsWith("Skill:")) {
            return name.replace(/^Skill:\s*/, "");
          } else if (name) {
            return name;
          }
          return null;
        })
        .filter(Boolean);

      if (!skills.length && Array.isArray(skillChoice.from)) {
        skills = skillChoice.from
          .map((ref) => {
            if (ref && ref.name) return ref.name;
            if (ref && ref.item && ref.item.name) return ref.item.name;
            return null;
          })
          .filter(Boolean);
      }

      if (!skills.length) {
        console.warn(
          "[extractSkillProficiencies] Unhandled skillChoice object (no skills extracted):",
          skillChoice
        );
      }
      if (skills.length) {
        allSkills.push(...skills);
        totalChoose += skillChoice.choose || 0;
        console.log(
          "[extractSkillProficiencies] found skillChoice:",
          skillChoice
        );
        console.log("[extractSkillProficiencies] skills:", skills);
      }
    }
    if (allSkills.length) {
      // Remove duplicates
      allSkills = [...new Set(allSkills)];
      return {
        count: totalChoose,
        from: allSkills,
      };
    }
    console.warn(
      "[extractSkillProficiencies] No skill proficiencies found for class:",
      classData.name
    );
    return { count: 0, from: [] };
  }

  extractStartingEquipment(classData) {
    const equipment = classData.starting_equipment || [];

    return equipment.map((item) => ({
      name: item.equipment.name,
      quantity: item.quantity,
      // Add more details as needed
    }));
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
    const cacheKey = "all-backgrounds";
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      console.log("Using cached backgrounds data");
      return cached;
    }

    try {
      const data = await this.apiRequest("/backgrounds");
      console.log("[dndAPI] Raw /backgrounds API response:", data);
      if (!data) {
        console.error("[dndAPI] /backgrounds API returned null or undefined.");
      } else if (!data.results) {
        console.error(
          "[dndAPI] /backgrounds API response missing 'results' property:",
          data
        );
      } else if (Array.isArray(data.results) && data.results.length === 0) {
        console.warn(
          "[dndAPI] /backgrounds API response 'results' is an empty array:",
          data
        );
      }

      if (data && data.results) {
        console.log(
          `[dndAPI] Loading background details for ${data.results.length} backgrounds...`,
          data.results
        );
        const backgrounds = [];

        // Load background details sequentially to avoid rate limiting
        for (const bg of data.results) {
          try {
            const details = await this.getBackgroundDetails(bg.index);
            if (details) {
              backgrounds.push(details);
            }
          } catch (error) {
            console.error(
              `[dndAPI] Failed to fetch details for background ${bg.index}:`,
              error,
              bg
            );
            // Return basic data if details fetch fails
            backgrounds.push({
              id: bg.index,
              name: bg.name,
              isBasicData: true,
            });
          }
        }

        console.log(
          `[dndAPI] Successfully loaded ${backgrounds.length} backgrounds`,
          backgrounds
        );
        this.setCachedData(cacheKey, backgrounds);
        return backgrounds;
      }

      console.error(
        "[dndAPI] Falling back to getFallbackBackgrounds due to missing/invalid API response."
      );
      return this.getFallbackBackgrounds();
    } catch (error) {
      console.error("[dndAPI] Failed to fetch backgrounds:", error);
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
          { name: "Clothes, common", quantity: 1 },
          { name: "Pouch", quantity: 1 },
        ],
        startingEquipmentOptions: [],
        feature: {
          name: "Shelter of the Faithful",
          desc: [
            "As an acolyte, you command the respect of those who share your faith, and you can perform the religious ceremonies of your deity.",
          ],
        },
        isBasicData: true,
      },
      {
        id: "criminal",
        name: "Criminal",
        description:
          "You have a history of breaking the law and surviving by your wits.",
        skillProficiencies: ["Deception", "Stealth"],
        toolProficiencies: ["Thieves' Tools"],
        languages: [],
        languageOptions: null,
        startingEquipment: [
          { name: "Crowbar", quantity: 1 },
          { name: "Clothes, common", quantity: 1 },
          { name: "Pouch", quantity: 1 },
        ],
        startingEquipmentOptions: [],
        feature: {
          name: "Criminal Contact",
          desc: [
            "You have a reliable and trustworthy contact in the criminal underworld.",
          ],
        },
        isBasicData: true,
      },
      {
        id: "folk-hero",
        name: "Folk Hero",
        description:
          "You come from humble beginnings, but you are destined for greatness.",
        skillProficiencies: ["Animal Handling", "Survival"],
        toolProficiencies: ["Smith's Tools", "Vehicles (Land)"],
        languages: [],
        languageOptions: null,
        startingEquipment: [
          { name: "Plow", quantity: 1 },
          { name: "Clothes, common", quantity: 1 },
          { name: "Pouch", quantity: 1 },
        ],
        startingEquipmentOptions: [],
        feature: {
          name: "Rustic Hospitality",
          desc: [
            "You can find a place to hide, rest, or recuperate among commoners.",
          ],
        },
        isBasicData: true,
      },
      {
        id: "noble",
        name: "Noble",
        description: "You understand wealth, power, and privilege.",
        skillProficiencies: ["History", "Persuasion"],
        toolProficiencies: ["Gaming Set"],
        languages: [],
        languageOptions: { choose: 1, from: ["Any"] },
        startingEquipment: [
          { name: "Signet Ring", quantity: 1 },
          { name: "Scroll of pedigree", quantity: 1 },
          { name: "Clothes, fine", quantity: 1 },
          { name: "Pouch", quantity: 1 },
        ],
        startingEquipmentOptions: [],
        feature: {
          name: "Position of Privilege",
          desc: ["People are inclined to think the best of you."],
        },
        isBasicData: true,
      },
      {
        id: "sage",
        name: "Sage",
        description: "You spent years learning the lore of the multiverse.",
        skillProficiencies: ["Arcana", "History"],
        toolProficiencies: [],
        languages: [],
        languageOptions: { choose: 2, from: ["Any"] },
        startingEquipment: [
          { name: "Bottle of ink", quantity: 1 },
          { name: "Quill", quantity: 1 },
          { name: "Small knife", quantity: 1 },
          { name: "Letter from a dead colleague", quantity: 1 },
          { name: "Clothes, common", quantity: 1 },
          { name: "Pouch", quantity: 1 },
        ],
        startingEquipmentOptions: [],
        feature: {
          name: "Researcher",
          desc: [
            "When you attempt to learn or recall a piece of lore, if you do not know that information, you often know where and from whom you can obtain it.",
          ],
        },
        isBasicData: true,
      },
      {
        id: "soldier",
        name: "Soldier",
        description: "You have fought in battles and survived.",
        skillProficiencies: ["Athletics", "Intimidation"],
        toolProficiencies: ["Gaming Set", "Vehicles (Land)"],
        languages: [],
        languageOptions: null,
        startingEquipment: [
          { name: "Insignia of rank", quantity: 1 },
          { name: "Trophy from a fallen enemy", quantity: 1 },
          { name: "Clothes, common", quantity: 1 },
          { name: "Pouch", quantity: 1 },
        ],
        startingEquipmentOptions: [],
        feature: {
          name: "Military Rank",
          desc: ["You have a military rank from your career as a soldier."],
        },
        isBasicData: true,
      },
      {
        id: "hermit",
        name: "Hermit",
        description:
          "You lived in seclusion for a formative part of your life.",
        skillProficiencies: ["Medicine", "Religion"],
        toolProficiencies: ["Herbalism Kit"],
        languages: [],
        languageOptions: { choose: 1, from: ["Any"] },
        startingEquipment: [
          { name: "Herbalism Kit", quantity: 1 },
          { name: "Scroll Case", quantity: 1 },
          { name: "Winter Blanket", quantity: 1 },
        ],
        startingEquipmentOptions: [],
        feature: {
          name: "Discovery",
          desc: [
            "You discovered a unique and powerful secret about the cosmos.",
          ],
        },
        isBasicData: true,
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
        startingEquipmentOptions: [],
        feature: {
          name: "By Popular Demand",
          desc: ["You can perform in exchange for lodging and food."],
        },
        isBasicData: true,
      },
      {
        id: "guild-artisan",
        name: "Guild Artisan",
        description:
          "You are a member of an artisan's guild and skilled in a particular field.",
        skillProficiencies: ["Insight", "Persuasion"],
        toolProficiencies: ["Artisan's Tools"],
        languages: [],
        languageOptions: { choose: 1, from: ["Any"] },
        startingEquipment: [
          { name: "Artisan's Tools", quantity: 1 },
          { name: "Letter of Introduction", quantity: 1 },
          { name: "Traveler's Clothes", quantity: 1 },
        ],
        startingEquipmentOptions: [],
        feature: {
          name: "Guild Membership",
          desc: ["You have access to guild resources and lodging."],
        },
        isBasicData: true,
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
        startingEquipmentOptions: [],
        feature: {
          name: "Wanderer",
          desc: [
            "You have an excellent memory for geography and can find food and shelter.",
          ],
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
        // Limit to fewer items and load sequentially to avoid rate limiting
        const equipmentIds = data.results.slice(0, 20).map((eq) => eq.index); // Reduced from 50 to 20

        console.log(
          `Loading equipment details for ${equipmentIds.length} items...`
        );
        const equipment = [];

        // Load equipment details sequentially to avoid overwhelming the API
        for (const eqId of equipmentIds) {
          try {
            const details = await this.getEquipmentDetails(eqId);
            if (details) {
              equipment.push(details);
            }
          } catch (error) {
            console.error(
              `Failed to fetch details for equipment ${eqId}:`,
              error
            );
            // Continue with other items even if one fails
          }
        }

        console.log(`Successfully loaded ${equipment.length} equipment items`);
        return equipment;
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

  // Fallback data in case API fails
  getFallbackClasses() {
    return [
      {
        id: "barbarian",
        index: "barbarian",
        name: "Barbarian",
        hitDie: "D12",
        primaryAbility: "Strength",
        isBasicData: false,
      },
      {
        id: "fighter",
        index: "fighter",
        name: "Fighter",
        hitDie: "D10",
        primaryAbility: "Strength or Dexterity",
        isBasicData: false,
      },
      {
        id: "rogue",
        index: "rogue",
        name: "Rogue",
        hitDie: "D8",
        primaryAbility: "Dexterity",
        isBasicData: false,
      },
      {
        id: "wizard",
        index: "wizard",
        name: "Wizard",
        hitDie: "D6",
        primaryAbility: "Intelligence",
        isBasicData: false,
      },
    ];
  }

  getFallbackRaces() {
    // Fallback races removed. This function now returns an empty array.
    return [];
  }
}

// Create API instance
export const dndAPI = new DnDAPI();

// Keep the old export for backward compatibility
export const dndRacesAPI = dndAPI;
