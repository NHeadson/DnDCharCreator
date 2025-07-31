import { defineStore } from "pinia";
import { ref } from "vue";
import { dndAPI } from "@/services/dndAPI.js";

export const useCharacterStore = defineStore("character", {
  state: () => ({
    character: {
      name: "",
      userName: "",
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
      weaponProficiencies: [],
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
      try {
        const apiBackgrounds = await dndAPI.getBackgrounds();
        if (apiBackgrounds && apiBackgrounds.length > 0) {
          this.backgroundData = apiBackgrounds;
        }
      } catch (error) {
        this.backgroundError = error.message || error;
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
  },
});
