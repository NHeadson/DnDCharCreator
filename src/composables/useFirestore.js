import { db } from "@/main.js";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

export function useFirestore() {
  // Save a character to Firestore
  const saveCharacter = async (characterData) => {
    try {
      const docRef = await addDoc(collection(db, "characters"), {
        ...characterData,
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
      const characterRef = doc(db, "characters", characterId);
      await updateDoc(characterRef, {
        ...updates,
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
