import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { toRaw } from "vue";
import { db } from "@/main.js";

export function useFirestore() {
  // Helper function to sanitize data for Firestore (remove undefined values and convert from Vue reactive)
  const sanitizeData = (obj) => {
    // First convert Vue reactive object to plain object
    const plainObj = toRaw(obj);

    // Then use JSON serialization to remove undefined values and ensure plain objects
    const jsonString = JSON.stringify(plainObj, (key, value) => {
      // Replace undefined with null for Firestore compatibility
      return value === undefined ? null : value;
    });

    return JSON.parse(jsonString);
  };

  // Save a character to Firestore
  const saveCharacter = async (characterData) => {
    try {
      console.log("Saving character to Firestore...", characterData);

      // Sanitize the character data to remove undefined values and Vue reactivity
      const sanitizedData = sanitizeData(characterData);

      // Extra safety check for the problematic field
      if (sanitizedData.spellcastingAbilityName === undefined) {
        sanitizedData.spellcastingAbilityName = "";
      }
      if (sanitizedData.spellcastingAbilityName === null) {
        sanitizedData.spellcastingAbilityName = "";
      }

      console.log("Sanitized character data:", sanitizedData);
      console.log(
        "spellcastingAbilityName value:",
        sanitizedData.spellcastingAbilityName,
        typeof sanitizedData.spellcastingAbilityName
      );

      const docRef = await addDoc(collection(db, "characters"), {
        ...sanitizedData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log("Character saved with ID:", docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error("Error saving character:", error);
      return { success: false, error: error.message };
    }
  };

  // Get all characters from Firestore
  const getCharacters = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "characters"));
      const characters = [];

      querySnapshot.forEach((doc) => {
        characters.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return { success: true, data: characters };
    } catch (error) {
      console.error("Error getting characters:", error);
      return { success: false, error: error.message };
    }
  };

  // Update a character in Firestore
  const updateCharacter = async (characterId, updates) => {
    try {
      // Sanitize the updates to remove undefined values
      const sanitizedUpdates = sanitizeData(updates);

      const characterRef = doc(db, "characters", characterId);
      await updateDoc(characterRef, {
        ...sanitizedUpdates,
        updatedAt: serverTimestamp(),
      });

      return { success: true };
    } catch (error) {
      console.error("Error updating character:", error);
      return { success: false, error: error.message };
    }
  };

  // Delete a character from Firestore
  const deleteCharacter = async (characterId) => {
    try {
      await deleteDoc(doc(db, "characters", characterId));
      return { success: true };
    } catch (error) {
      console.error("Error deleting character:", error);
      return { success: false, error: error.message };
    }
  };

  return {
    saveCharacter,
    getCharacters,
    updateCharacter,
    deleteCharacter,
  };
}
