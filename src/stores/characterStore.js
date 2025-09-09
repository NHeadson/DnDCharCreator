import { defineStore } from "pinia";
import { ref } from "vue";
import { dndAPI } from "@/services/dndAPI.js";

export const useCharacterStore = defineStore("character", {
  state: () => ({
    character: {
      name: "",
      playerName: "",
      species: null,
      speciesDetails: null,
      speciesLineage: null,
      class: null,
      classDetails: null,
      subclass: null,
      subclassDetails: null,
      background: null,
      backgroundDetails: null,
      level: 1,
      xp: 0,
      alignment: null,
      backstory: "",
      personality: { traits: [], ideals: [], bonds: [], flaws: [] },
      additionalLanguages: [],
      selectedTools: [],
      selectedClassSkills: [],
      feats: [],
      abilityScores: {
        strength: { score: 10, modifier: 0, bonuses: {} },
        dexterity: { score: 10, modifier: 0, bonuses: {} },
        constitution: { score: 10, modifier: 0, bonuses: {} },
        intelligence: { score: 10, modifier: 0, bonuses: {} },
        wisdom: { score: 10, modifier: 0, bonuses: {} },
        charisma: { score: 10, modifier: 0, bonuses: {} },
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
      weaponProficiencies: [],
      equipment: [],
      equipmentChoices: [], // Array storing selected option index for each equipment choice
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
      // Calculated/derived traits
      derivedTraits: {
        species: [],
        lineage: [],
        class: [],
        background: [],
        combined: [],
      },
    },
    currentStep: 1,
    abilityGenerationMethod: "standard",
    rolledStats: [],
    rolling: false,
    timesRerolled: 0,
    // API data
    speciesData: [],
    isLoadingSpecies: false,
    speciesError: null,
    classData: [],
    isLoadingClasses: false,
    classError: null,
    backgroundData: [],
    isLoadingBackgrounds: false,
    backgroundError: null,
    equipmentData: [],
    isLoadingEquipment: false,
    equipmentError: null,
    loading: false,
    error: null,
    // Spell selection data
    availableCantrips: [],
    availableSpells: [],
    isLoadingSpells: false,
    spellError: null,
  }),
  actions: {
    // Fetch cantrips and 1st-level spells for the selected class
    async fetchSpellsForClass(classIndex) {
      this.isLoadingSpells = true;
      this.spellError = null;
      try {
        // Fetch cantrips (level 0)
        const cantrips = await dndAPI.getSpellsForClassApi(classIndex, 0);
        this.availableCantrips = cantrips;
        // Fetch 1st-level spells
        const spells = await dndAPI.getSpellsForClassApi(classIndex, 1);
        this.availableSpells = spells;
      } catch (error) {
        this.spellError = error.message || error;
        this.availableCantrips = [];
        this.availableSpells = [];
      } finally {
        this.isLoadingSpells = false;
      }
    },
    async loadSpeciesData() {
      this.isLoadingSpecies = true;
      this.speciesError = null;
      try {
        const apiSpecies = await dndAPI.getRaces();
        if (apiSpecies && apiSpecies.length > 0) {
          this.speciesData = apiSpecies;
        }
      } catch (error) {
        this.speciesError = error.message || error;
      } finally {
        this.isLoadingSpecies = false;
      }
    },
    async loadClassData() {
      this.isLoadingClasses = true;
      this.classError = null;
      try {
        const apiClasses = await dndAPI.getClasses();
        if (apiClasses && apiClasses.length > 0) {
          this.classData = apiClasses;
        }
      } catch (error) {
        this.classError = error.message || error;
      } finally {
        this.isLoadingClasses = false;
      }
    },
    async loadBackgroundData() {
      this.isLoadingBackgrounds = true;
      this.backgroundError = null;
      // Fallback backgrounds (copy from useCharacterData.js)
      const fallbackBackgroundData = [
        {
          id: "acolyte",
          name: "Acolyte",
          description:
            "You have spent your life in the service of a temple to a specific god or pantheon of gods.",
          skillProficiencies: ["Insight", "Religion"],
          toolProficiencies: ["Calligrapher's Supplies"],
          languages: [],
          languageOptions: {
            choose: 2,
            from: ["Any"],
          },
          startingEquipment: [
            { name: "Holy Symbol", quantity: 1 },
            { name: "Prayer Book", quantity: 1 },
            { name: "Incense", quantity: 5 },
          ],
          startingMoney: { gp: 15 },
          feature: {
            name: "Shelter of the Faithful",
            description:
              "You can perform religious ceremonies and gain shelter at temples.",
          },
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
          startingMoney: { gp: 15 },
          feature: {
            name: "Criminal Contact",
            description:
              "You have a reliable contact in the criminal underworld.",
          },
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
          startingMoney: { gp: 10 },
          feature: {
            name: "Researcher",
            description: "You know where to find information and who to ask.",
          },
          feat: "Magic Initiate (Wizard)",
          skillProfs: ["Arcana", "History"],
          toolProf: "Calligrapher's Supplies",
          equipmentChoice: "A or B",
          abilityScores: ["Constitution", "Intelligence", "Wisdom"],
        },
        {
          id: "soldier",
          name: "Soldier",
          description:
            "You had a military career and are experienced in battle.",
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
          feat: "Savage Attacker",
          skillProfs: ["Athletics", "Intimidation"],
          toolProf: "Gaming Set (choice)",
          equipmentChoice: "A or B",
          abilityScores: ["Strength", "Dexterity", "Constitution"],
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
          instrumentOptions: {
            choose: 1,
            from: [
              "Bagpipes",
              "Drum",
              "Dulcimer",
              "Flute",
              "Lute",
              "Lyre",
              "Horn",
              "Pan Flute",
              "Shawm",
              "Viol",
            ],
          },
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
          toolProficiencies: ["Vehicles (Land)"],
          toolOptions: {
            choose: 1,
            from: [
              "Smith's Tools",
              "Carpenter's Tools",
              "Mason's Tools",
              "Weaver's Tools",
              "Leatherworker's Tools",
              "Potter's Tools",
              "Woodcarver's Tools",
            ],
          },
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
          description:
            "You understand wealth, power, and privilege from birth.",
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
          instrumentOptions: {
            choose: 1,
            from: [
              "Bagpipes",
              "Drum",
              "Dulcimer",
              "Flute",
              "Lute",
              "Lyre",
              "Horn",
              "Pan Flute",
              "Shawm",
              "Viol",
            ],
          },
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
      try {
        const apiBackgrounds = await dndAPI.getBackgrounds();
        if (apiBackgrounds && apiBackgrounds.length > 0) {
          if (apiBackgrounds.length >= 4) {
            this.backgroundData = apiBackgrounds;
          } else {
            this.backgroundData = [...fallbackBackgroundData];
          }
        } else {
          this.backgroundData = [...fallbackBackgroundData];
        }
      } catch (error) {
        this.backgroundError = error.message || error;
        this.backgroundData = [...fallbackBackgroundData];
      } finally {
        this.isLoadingBackgrounds = false;
      }
    },
    async loadEquipmentData() {
      this.isLoadingEquipment = true;
      this.equipmentError = null;
      try {
        const apiEquipment = await dndAPI.getEquipment();
        if (apiEquipment && apiEquipment.length > 0) {
          this.equipmentData = apiEquipment;
        }
      } catch (error) {
        this.equipmentError = error.message || error;
      } finally {
        this.isLoadingEquipment = false;
      }
    },
    setCharacter(data) {
      this.character = { ...this.character, ...data };
    },
    setLoading(val) {
      this.loading = val;
    },
    setError(err) {
      this.error = err;
    },
    setCurrentStep(step) {
      this.currentStep = step;
    },
    setAbilityGenerationMethod(method) {
      this.abilityGenerationMethod = method;
    },
    setRolledStats(stats) {
      this.rolledStats = stats;
    },
    setRolling(val) {
      this.rolling = val;
    },
    setTimesRerolled(val) {
      this.timesRerolled = val;
    },
    reset() {
      // Reset character to initial state
      this.$reset();
    },
    async loadAllData() {
      await Promise.all([
        this.loadSpeciesData(),
        this.loadClassData(),
        this.loadBackgroundData(),
        this.loadEquipmentData(),
      ]);
    },

    // Update species traits when species changes
    updateSpeciesTraits() {
      this.updateSpeciesTraitsWithStacking();
    },

    // Update class traits when class changes
    updateClassTraits() {
      console.log("DEBUG - updateClassTraits called");
      console.log("DEBUG - character.class:", this.character.class);
      console.log(
        "DEBUG - character.classDetails available:",
        !!this.character.classDetails
      );

      // Use classDetails (detailed data) instead of classData (basic list)
      if (this.character.classDetails) {
        const selectedClass = this.character.classDetails;
        console.log("DEBUG - found classDetails:", selectedClass.name);
        console.log(
          "DEBUG - classDetails.armorTraining:",
          selectedClass.armorTraining
        );
        console.log(
          "DEBUG - classDetails.weaponProficiencies:",
          selectedClass.weaponProficiencies
        );

        // Update armor training
        if (selectedClass.armorTraining) {
          this.character.armorTraining = { ...selectedClass.armorTraining };
        }

        // Update weapon proficiencies
        if (selectedClass.weaponProficiencies) {
          this.character.weaponProficiencies = [
            ...selectedClass.weaponProficiencies,
          ];
        }

        // Update starting equipment if available
        if (selectedClass.startingEquipment) {
          this.character.equipment = [
            ...this.character.equipment,
            ...selectedClass.startingEquipment.map((item) => ({
              ...item,
              source: "class",
              equipped: false,
            })),
          ];
        }

        // Add class traits to stacking system
        if (selectedClass.features) {
          this.addTraitsToSource("class", selectedClass.features);
        }

        console.log("DEBUG - After assignment:");
        console.log(
          "DEBUG - character.armorTraining:",
          this.character.armorTraining
        );
        console.log(
          "DEBUG - character.weaponProficiencies:",
          this.character.weaponProficiencies
        );

        // Initialize skill proficiencies
        this.character.skillProficiencies = {};
        this.character.selectedClassSkills = [];

        // Initialize saving throw proficiencies
        this.character.savingThrowProficiencies = {};
        const abilityNames = [
          "strength",
          "dexterity",
          "constitution",
          "intelligence",
          "wisdom",
          "charisma",
        ];
        for (const ability of abilityNames) {
          this.character.savingThrowProficiencies[ability] = {
            proficient: selectedClass.savingThrows?.includes(ability) || false,
            bonus: 0,
          };
        }
      } else {
        this.character.armorTraining = {
          light: false,
          medium: false,
          heavy: false,
          shields: false,
        };
        this.character.weaponProficiencies = [];
        this.character.derivedTraits.class = [];
        this.combineTraits();
      }
    },

    // Update background traits when background changes
    updateBackgroundTraits() {
      // First, remove any existing background feats
      this.character.feats = this.character.feats.filter(
        (feat) => feat.source !== "Background"
      );

      const selectedBackground = this.backgroundData.find(
        (b) => b.id === this.character.background
      );
      if (selectedBackground) {
        this.character.backgroundDetails = selectedBackground;

        // Update skill proficiencies from background
        const skillProfs =
          selectedBackground.skillProficiencies ||
          selectedBackground.skillProfs ||
          [];
        for (const skillName of skillProfs) {
          if (this.character.skillProficiencies[skillName]) {
            this.character.skillProficiencies[skillName].proficient = true;
          }
        }

        // Handle tool proficiencies
        const toolProfs =
          selectedBackground.toolProficiencies ||
          [selectedBackground.toolProf].filter(Boolean);
        for (const toolProf of toolProfs) {
          if (
            toolProf &&
            !toolProf.includes("(choice)") &&
            !this.character.toolProficiencies.includes(toolProf)
          ) {
            this.character.toolProficiencies.push(toolProf);
          }
        }

        // Handle background feat
        if (selectedBackground.feat) {
          this.character.feats.push({
            name: selectedBackground.feat,
            source: "Background",
            description: `Feat granted by ${selectedBackground.name} background`,
          });
        }

        // Add background traits/features to stacking system
        const backgroundTraits = [];
        if (selectedBackground.feature) {
          backgroundTraits.push({
            name: selectedBackground.feature.name,
            description: selectedBackground.feature.description,
            source: "background",
          });
        }
        this.addTraitsToSource("background", backgroundTraits);

        // Update starting equipment from background
        if (selectedBackground.startingEquipment) {
          this.character.equipment = [
            ...this.character.equipment,
            ...selectedBackground.startingEquipment.map((item) => ({
              ...item,
              source: "background",
              equipped: false,
            })),
          ];
        }
      } else {
        this.character.backgroundDetails = null;
        this.character.derivedTraits.background = [];
        this.combineTraits();
      }
    },

    // Calculate starting gold based on class
    calculateStartingGold() {
      const classGoldTable = {
        barbarian: { dice: 2, sides: 4, multiplier: 10 },
        bard: { dice: 5, sides: 4, multiplier: 10 },
        cleric: { dice: 5, sides: 4, multiplier: 10 },
        druid: { dice: 2, sides: 4, multiplier: 10 },
        fighter: { dice: 5, sides: 4, multiplier: 10 },
        monk: { dice: 5, sides: 4, multiplier: 1 },
        paladin: { dice: 5, sides: 4, multiplier: 10 },
        ranger: { dice: 5, sides: 4, multiplier: 10 },
        rogue: { dice: 4, sides: 4, multiplier: 10 },
        sorcerer: { dice: 3, sides: 4, multiplier: 10 },
        warlock: { dice: 4, sides: 4, multiplier: 10 },
        wizard: { dice: 4, sides: 4, multiplier: 10 },
      };

      const classId = this.character.class?.toLowerCase();
      const goldConfig = classGoldTable[classId] || {
        dice: 4,
        sides: 4,
        multiplier: 10,
      };

      // For now, use average roll (simplified)
      const averageRoll = Math.floor((goldConfig.sides + 1) / 2);
      const goldAmount = goldConfig.dice * averageRoll * goldConfig.multiplier;

      this.character.coins.gp = goldAmount;
      return goldAmount;
    },

    // Spend gold for equipment
    spendGold(amount) {
      if (this.character.coins.gp >= amount) {
        this.character.coins.gp -= amount;
        return true;
      }
      return false;
    },

    // Add equipment to inventory
    addEquipment(item) {
      this.character.equipment.push({
        ...item,
        source: "purchased",
        equipped: false,
      });
    },

    // Remove equipment from inventory
    removeEquipment(itemName) {
      const index = this.character.equipment.findIndex(
        (item) => item.name === itemName
      );
      if (index > -1) {
        this.character.equipment.splice(index, 1);
      }
    },

    // Equipment choice management
    setEquipmentChoices(choices) {
      this.character.equipmentChoices = [...choices];
    },

    getEquipmentChoices() {
      return this.character.equipmentChoices || [];
    },

    updateEquipmentChoice(choiceIndex, optionIndex) {
      if (!this.character.equipmentChoices) {
        this.character.equipmentChoices = [];
      }
      this.character.equipmentChoices[choiceIndex] = optionIndex;
    },

    // Get total gold value
    getTotalGoldValue() {
      return (
        this.character.coins.gp +
        this.character.coins.sp / 10 +
        this.character.coins.ep / 2 +
        this.character.coins.pp * 10
      );
    },

    // Ability Score Bonus Management
    applyAbilityScoreBonuses(source, bonuses) {
      if (!Array.isArray(bonuses)) return;

      bonuses.forEach((bonus) => {
        const abilityName = bonus.ability?.toLowerCase();
        if (abilityName && this.character.abilityScores[abilityName]) {
          this.character.abilityScores[abilityName].bonuses[source] =
            bonus.bonus || 1;
        }
      });
    },

    removeAbilityScoreBonuses(source) {
      Object.keys(this.character.abilityScores).forEach((ability) => {
        if (this.character.abilityScores[ability].bonuses[source]) {
          delete this.character.abilityScores[ability].bonuses[source];
        }
      });
    },

    calculateFinalAbilityScores() {
      Object.keys(this.character.abilityScores).forEach((ability) => {
        const abilityData = this.character.abilityScores[ability];
        const bonusTotal = Object.values(abilityData.bonuses).reduce(
          (sum, bonus) => sum + bonus,
          0
        );
        const finalScore = Math.max(
          1,
          Math.min(30, abilityData.score + bonusTotal)
        );

        // Update modifier based on final score
        abilityData.modifier = Math.floor((finalScore - 10) / 2);

        // Store final score for easy access (optional)
        abilityData.finalScore = finalScore;
      });
    },

    // Lineage Change Handler
    updateLineageTraits(newLineageId) {
      // Remove old lineage bonuses
      this.removeAbilityScoreBonuses("lineage");

      // Apply new lineage bonuses
      if (newLineageId && this.character.speciesDetails?.lineages) {
        const selectedLineage = this.character.speciesDetails.lineages.find(
          (l) => l.id === newLineageId
        );
        if (selectedLineage && selectedLineage.abilityBonus) {
          this.applyAbilityScoreBonuses(
            "lineage",
            selectedLineage.abilityBonus
          );
        }
      }

      // Update character lineage
      this.character.speciesLineage = newLineageId;

      // Update combined traits
      this.combineTraits();

      // Recalculate final scores
      this.calculateFinalAbilityScores();
    },

    // Trait Stacking System
    addTraitsToSource(source, traits) {
      if (!Array.isArray(traits)) return;
      this.character.derivedTraits[source] = traits.map((trait) => ({
        name: trait.name,
        description: trait.description || trait.desc || "",
        source: source,
        index: trait.index || null,
      }));
      this.combineTraits();
    },

    combineTraits() {
      const allTraits = [];

      // Combine traits from all sources
      Object.keys(this.character.derivedTraits).forEach((source) => {
        if (
          source !== "combined" &&
          Array.isArray(this.character.derivedTraits[source])
        ) {
          allTraits.push(...this.character.derivedTraits[source]);
        }
      });

      // Remove duplicates and handle conflicts
      const uniqueTraits = [];
      const traitNames = new Set();

      allTraits.forEach((trait) => {
        if (!traitNames.has(trait.name)) {
          uniqueTraits.push(trait);
          traitNames.add(trait.name);
        } else {
          // Handle trait conflicts - prefer more specific sources
          const existingIndex = uniqueTraits.findIndex(
            (t) => t.name === trait.name
          );
          if (existingIndex !== -1) {
            const existing = uniqueTraits[existingIndex];
            // Priority: lineage > species > class > background
            const sourcePriority = {
              lineage: 4,
              species: 3,
              class: 2,
              background: 1,
            };
            if (
              (sourcePriority[trait.source] || 0) >
              (sourcePriority[existing.source] || 0)
            ) {
              uniqueTraits[existingIndex] = trait;
            }
          }
        }
      });

      this.character.derivedTraits.combined = uniqueTraits;
    },

    // Enhanced Species Traits Update
    updateSpeciesTraitsWithStacking() {
      const selectedSpecies = this.speciesData.find(
        (s) => s.id === this.character.species
      );
      if (selectedSpecies) {
        this.character.speciesDetails = selectedSpecies;
        this.character.size = selectedSpecies.size;
        this.character.speed = selectedSpecies.speed;

        if (selectedSpecies.id === "human") {
          this.character.hasHeroicInspiration = true;
        }

        this.character.speciesLineage =
          selectedSpecies.lineages.length > 0
            ? selectedSpecies.lineages[0].id
            : null;

        // Apply species ability score bonuses
        this.applyAbilityScoreBonuses(
          "species",
          selectedSpecies.abilityBonus || []
        );

        // Add species traits
        this.addTraitsToSource("species", selectedSpecies.traits || []);

        // Apply lineage bonuses and traits if applicable
        if (this.character.speciesLineage && selectedSpecies.lineages) {
          const selectedLineage = selectedSpecies.lineages.find(
            (l) => l.id === this.character.speciesLineage
          );
          if (selectedLineage) {
            if (selectedLineage.abilityBonus) {
              this.applyAbilityScoreBonuses(
                "lineage",
                selectedLineage.abilityBonus
              );
            }
            if (selectedLineage.traits) {
              this.addTraitsToSource("lineage", selectedLineage.traits);
            }
          }
        }
      } else {
        this.character.speciesDetails = null;
        this.character.size = "";
        this.character.speed = 0;
        this.character.hasHeroicInspiration = false;
        this.character.speciesLineage = null;

        // Remove species and lineage bonuses/traits
        this.removeAbilityScoreBonuses("species");
        this.removeAbilityScoreBonuses("lineage");
        this.character.derivedTraits.species = [];
        this.character.derivedTraits.lineage = [];
        this.combineTraits();
      }

      // Recalculate final ability scores
      this.calculateFinalAbilityScores();
    },

    // Validation System
    validateCharacterBonuses() {
      const issues = [];

      // Validate ability score bonuses are applied
      if (
        this.character.species &&
        this.character.speciesDetails?.abilityBonus
      ) {
        this.character.speciesDetails.abilityBonus.forEach((bonus) => {
          const abilityName = bonus.ability?.toLowerCase();
          if (abilityName && this.character.abilityScores[abilityName]) {
            const appliedBonus =
              this.character.abilityScores[abilityName].bonuses.species;
            if (appliedBonus !== bonus.bonus) {
              issues.push(
                `Species ability bonus for ${
                  bonus.ability
                } not properly applied. Expected: ${bonus.bonus}, Found: ${
                  appliedBonus || 0
                }`
              );
            }
          }
        });
      }

      // Validate lineage bonuses
      if (
        this.character.speciesLineage &&
        this.character.speciesDetails?.lineages
      ) {
        const selectedLineage = this.character.speciesDetails.lineages.find(
          (l) => l.id === this.character.speciesLineage
        );
        if (selectedLineage?.abilityBonus) {
          selectedLineage.abilityBonus.forEach((bonus) => {
            const abilityName = bonus.ability?.toLowerCase();
            if (abilityName && this.character.abilityScores[abilityName]) {
              const appliedBonus =
                this.character.abilityScores[abilityName].bonuses.lineage;
              if (appliedBonus !== bonus.bonus) {
                issues.push(
                  `Lineage ability bonus for ${
                    bonus.ability
                  } not properly applied. Expected: ${bonus.bonus}, Found: ${
                    appliedBonus || 0
                  }`
                );
              }
            }
          });
        }
      }

      // Validate final scores are calculated
      Object.keys(this.character.abilityScores).forEach((ability) => {
        const abilityData = this.character.abilityScores[ability];
        const expectedFinal =
          abilityData.score +
          Object.values(abilityData.bonuses).reduce(
            (sum, bonus) => sum + bonus,
            0
          );
        const clampedFinal = Math.max(1, Math.min(30, expectedFinal));

        if (abilityData.finalScore !== clampedFinal) {
          issues.push(
            `Final score for ${ability} not calculated correctly. Expected: ${clampedFinal}, Found: ${
              abilityData.finalScore || "undefined"
            }`
          );
        }

        const expectedModifier = Math.floor((clampedFinal - 10) / 2);
        if (abilityData.modifier !== expectedModifier) {
          issues.push(
            `Modifier for ${ability} not calculated correctly. Expected: ${expectedModifier}, Found: ${abilityData.modifier}`
          );
        }
      });

      // Validate traits are combined
      if (
        this.character.derivedTraits.combined.length === 0 &&
        (this.character.derivedTraits.species.length > 0 ||
          this.character.derivedTraits.lineage.length > 0 ||
          this.character.derivedTraits.class.length > 0 ||
          this.character.derivedTraits.background.length > 0)
      ) {
        issues.push("Traits are not being combined properly");
      }

      return {
        isValid: issues.length === 0,
        issues: issues,
      };
    },

    validateAndRecalculate() {
      this.calculateFinalAbilityScores();
      this.combineTraits();
      return this.validateCharacterBonuses();
    },

    // Debug helper to inspect current bonuses
    debugBonuses() {
      console.log("=== Character Bonuses Debug ===");
      console.log("Species:", this.character.species);
      console.log("Lineage:", this.character.speciesLineage);
      console.log("Ability Scores with Bonuses:");
      Object.keys(this.character.abilityScores).forEach((ability) => {
        const data = this.character.abilityScores[ability];
        console.log(`  ${ability}:`, {
          base: data.score,
          bonuses: data.bonuses,
          final: data.finalScore,
          modifier: data.modifier,
        });
      });
      console.log("Derived Traits:", this.character.derivedTraits);
      const validation = this.validateCharacterBonuses();
      console.log("Validation:", validation);
      return validation;
    },

    // Initialize character from loaded data
    initializeFromLoadedData() {
      // Ensure bonuses object exists on all ability scores
      Object.keys(this.character.abilityScores).forEach((ability) => {
        if (!this.character.abilityScores[ability].bonuses) {
          this.character.abilityScores[ability].bonuses = {};
        }
      });

      // Ensure derivedTraits structure exists
      if (!this.character.derivedTraits) {
        this.character.derivedTraits = {
          species: [],
          lineage: [],
          class: [],
          background: [],
          combined: [],
        };
      }

      // Force recalculation
      this.validateAndRecalculate();
    },
  },
});
