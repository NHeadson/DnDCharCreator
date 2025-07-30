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
            // Reduce delay between requests
            const now = Date.now();
            const timeSinceLastRequest = now - this.lastRequestTime;
            if (timeSinceLastRequest < this.minRequestInterval) {
              await new Promise((resolve) =>
                setTimeout(
                  resolve,
                  this.minRequestInterval - timeSinceLastRequest
                )
              );
            }

            const result = await this.makeActualRequest(endpoint, options);
            this.lastRequestTime = Date.now();
            resolve(result);
          } catch (error) {
            reject(error);
          }
        }
      );

      await Promise.all(batchPromises);

      // Reduced delay between batches
      if (this.requestQueue.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, 15)); // Reduced to 15ms for better performance
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
        race.index?.toLowerCase &&
        darkVisionRaces.includes(race.index?.toLowerCase())
      ) {
        return 60; // Standard darkvision range
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
      if (race.subraces && Array.isArray(race.subraces)) {
        return race.subraces
          .filter((sub) => sub && (sub.index || sub.name)) // Filter out invalid subraces
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

      // If no subraces found, check fallback data
      if (race.index?.toLowerCase && fallbackSubraces[race.index]) {
        return fallbackSubraces[race.index];
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
    const cacheKey = "all-races";
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      console.log("Using cached races data");
      return cached;
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
      return races;
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

  // Get all D&D classes with full details
  async getClasses() {
    const cacheKey = "all-classes";
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      console.log("Using cached classes data");
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

      // Get detailed information for each class in parallel
      const classPromises = response.results.map((dndClass) =>
        this.apiRequest(`/classes/${dndClass.index}`)
      );

      const classDetails = await Promise.all(classPromises);

      const classes = classDetails
        .map((dndClass) => {
          try {
            return {
              id: dndClass.index,
              index: dndClass.index,
              name: dndClass.name,
              hitDie: dndClass.hit_die || 8,
              proficiencies: (dndClass.proficiencies || []).map((prof) => {
                const type = prof.index?.split("-")?.[0] || "skill";
                return {
                  name: prof.name || prof.index?.replace(/-/g, " ") || "",
                  type,
                };
              }),
              savingThrows: (dndClass.saving_throws || []).map(
                (save) => save.name || save.index?.toUpperCase() || ""
              ),
              startingEquipment: this.extractStartingEquipment(dndClass),
              spellcasting: dndClass.spellcasting
                ? {
                    ability:
                      dndClass.spellcasting.spellcasting_ability?.name ||
                      dndClass.spellcasting.spellcasting_ability?.index?.toUpperCase() ||
                      "",
                    level: dndClass.spellcasting.level || 1,
                    info: Array.isArray(dndClass.spellcasting.info)
                      ? dndClass.spellcasting.info.map((i) => ({
                          name: i.name,
                          desc: Array.isArray(i.desc)
                            ? i.desc.join("\n")
                            : i.desc || "",
                        }))
                      : [],
                  }
                : null,
              features: (dndClass.features || [])
                .filter((f) => f.level === 1)
                .map((feature) => ({
                  name: feature.name || "",
                  description: Array.isArray(feature.desc)
                    ? feature.desc.join("\n")
                    : feature.desc || "",
                  level: feature.level || 1,
                })),
              subclassType: dndClass.subclass_flavor || "Archetype",
            };
          } catch (error) {
            console.error(
              `Error processing class ${dndClass?.name || "unknown"}:`,
              error
            );
            return null;
          }
        })
        .filter((cls) => cls !== null);

      this.setCachedData(cacheKey, classes);
      return classes;
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
      return this.transformClassData(details);
    } catch (error) {
      console.error(`Failed to fetch class ${classId}:`, error);
      return null;
    }
  }

  // Transform single class data
  transformClassData(classData) {
    console.log("Transforming class data:", classData);
    const classId =
      classData.index || classData.name?.toLowerCase().replace(/\s+/g, "_");

    const transformed = {
      id: classId,
      index: classData.index, // Preserve index for future API calls
      name: classData.name,
      description: classData.desc?.join(" ") || `The ${classData.name} class.`,
      hitDie: `D${classData.hit_die}`,
      hpDie: `D${classData.hit_die}`, // Alternative property name
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

    if (skillChoice && skillChoice.from && skillChoice.from.options) {
      return skillChoice.from.options
        .filter((opt) => opt.item?.name?.startsWith("Skill:"))
        .map((opt) => opt.item.name.replace("Skill: ", ""));
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
    const cacheKey = "all-backgrounds";
    const cached = this.getCachedData(cacheKey);
    if (cached) {
      console.log("Using cached backgrounds data");
      return cached;
    }

    try {
      const data = await this.apiRequest("/backgrounds");

      if (data && data.results) {
        console.log(
          `Loading background details for ${data.results.length} backgrounds...`
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
              `Failed to fetch details for background ${bg.index}:`,
              error
            );
            // Return basic data if details fetch fails
            backgrounds.push({
              id: bg.index,
              name: bg.name,
              isBasicData: true,
            });
          }
        }

        console.log(`Successfully loaded ${backgrounds.length} backgrounds`);
        this.setCachedData(cacheKey, backgrounds);
        return backgrounds;
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
        feature: {
          name: "Discovery",
          description:
            "You discovered a unique and powerful secret about the cosmos.",
        },
        isBasicData: true,
      },
      {
        id: "soldier",
        name: "Soldier",
        description: "You have a military rank from your career as a soldier.",
        skillProficiencies: ["Athletics", "Intimidation"],
        toolProficiencies: ["Vehicles (Land)", "Gaming Set"],
        languages: [],
        languageOptions: null,
        startingEquipment: [
          { name: "Insignia of Rank", quantity: 1 },
          { name: "Common Clothes", quantity: 1 },
          { name: "Belt Pouch", quantity: 1 },
        ],
        feature: {
          name: "Military Rank",
          description:
            "You have a military rank that commands respect from soldiers.",
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
        feature: {
          name: "By Popular Demand",
          description: "You can perform in exchange for lodging and food.",
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
        feature: {
          name: "Guild Membership",
          description: "You have access to guild resources and lodging.",
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
          { name: "Ink", quantity: 1 },
          { name: "Quill", quantity: 1 },
          { name: "Small Knife", quantity: 1 },
          { name: "Letter from Dead Colleague", quantity: 1 },
        ],
        feature: {
          name: "Researcher",
          description:
            "You know how to obtain information and where to find it.",
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
        feature: {
          name: "Wanderer",
          description:
            "You have an excellent memory for geography and can find food and shelter.",
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
    console.log("Using fallback race data");
    return [
      {
        id: "dragonborn",
        index: "dragonborn",
        name: "Dragonborn",
        size: "Medium",
        speed: 30,
        darkvision: null,
        damageResistance: "Acid, Cold, Fire, Lightning, or Poison (chosen)",
        lineages: [],
        bonusLanguage: "Draconic",
        traits: [
          {
            name: "Breath Weapon",
            description:
              "You can use your action to exhale destructive energy.",
          },
          {
            name: "Damage Resistance",
            description:
              "You have resistance to the damage type associated with your draconic ancestry.",
          },
        ],
        abilityBonus: [
          { ability: "STRENGTH", bonus: 2 },
          { ability: "CHARISMA", bonus: 1 },
        ],
      },
      {
        id: "dwarf",
        index: "dwarf",
        name: "Dwarf",
        size: "Medium",
        speed: 25,
        darkvision: 60,
        damageResistance: "Poison",
        lineages: [
          { id: "hill-dwarf", name: "Hill Dwarf" },
          { id: "mountain-dwarf", name: "Mountain Dwarf" },
        ],
        bonusLanguage: "Dwarvish",
        traits: [
          {
            name: "Dwarven Resilience",
            description: "You have advantage on saving throws against poison.",
          },
        ],
        abilityBonus: [{ ability: "CONSTITUTION", bonus: 2 }],
      },
      {
        id: "elf",
        index: "elf",
        name: "Elf",
        size: "Medium",
        speed: 30,
        darkvision: 60,
        damageResistance: null,
        lineages: [
          { id: "high-elf", name: "High Elf" },
          { id: "wood-elf", name: "Wood Elf" },
          { id: "dark-elf", name: "Dark Elf (Drow)" },
        ],
        bonusLanguage: "Elvish",
        traits: [
          {
            name: "Keen Senses",
            description: "You have proficiency in the Perception skill.",
          },
          {
            name: "Fey Ancestry",
            description:
              "You have advantage on saving throws against being charmed.",
          },
        ],
        abilityBonus: [{ ability: "DEXTERITY", bonus: 2 }],
      },
      {
        id: "human",
        index: "human",
        name: "Human",
        size: "Medium",
        speed: 30,
        darkvision: null,
        damageResistance: null,
        lineages: [{ id: "variant-human", name: "Variant Human" }],
        bonusLanguage: "Any",
        traits: [
          {
            name: "Extra Language",
            description:
              "You can speak, read, and write one extra language of your choice.",
          },
        ],
        abilityBonus: [
          { ability: "STRENGTH", bonus: 1 },
          { ability: "DEXTERITY", bonus: 1 },
          { ability: "CONSTITUTION", bonus: 1 },
          { ability: "INTELLIGENCE", bonus: 1 },
          { ability: "WISDOM", bonus: 1 },
          { ability: "CHARISMA", bonus: 1 },
        ],
      },
      {
        id: "halfling",
        index: "halfling",
        name: "Halfling",
        size: "Small",
        speed: 25,
        darkvision: null,
        damageResistance: null,
        lineages: [
          { id: "lightfoot", name: "Lightfoot" },
          { id: "stout", name: "Stout" },
        ],
        bonusLanguage: "Halfling",
        traits: [
          {
            name: "Lucky",
            description:
              "When you roll a 1 on an attack roll, ability check, or saving throw, you can reroll the die.",
          },
          {
            name: "Brave",
            description:
              "You have advantage on saving throws against being frightened.",
          },
        ],
        abilityBonus: [{ ability: "DEXTERITY", bonus: 2 }],
      },
    ];
  }
}

// Create API instance
export const dndAPI = new DnDAPI();

// Keep the old export for backward compatibility
export const dndRacesAPI = dndAPI;
