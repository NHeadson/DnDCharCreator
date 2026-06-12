import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

export function useFirebaseStorage() {
  const storage = getStorage()
  const auth = getAuth()

  /**
   * Uploads a file to Firebase Storage under the current user's directory.
   * @param {File} file The file to upload.
   * @param {string} characterId The ID of the character to associate the portrait with.
   * @returns {Promise<{success: boolean, url?: string, error?: string}>}
   */
  const uploadPortrait = async (file, characterId) => {
    const user = auth.currentUser
    if (!user) {
      return { success: false, error: 'User not authenticated.' }
    }

    if (!file.type.startsWith('image/')) {
      return {
        success: false,
        error: 'Invalid file type. Please upload an image.',
      }
    }

    // Max file size: 5MB
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: 'File is too large. Maximum size is 5MB.',
      }
    }

    const filePath = `portraits/${user.uid}/${characterId}/${Date.now()}_${file.name}`
    const storageRef = ref(storage, filePath)

    try {
      const snapshot = await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(snapshot.ref)
      return { success: true, url: downloadURL }
    } catch (error) {
      console.error('Error uploading file:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * Deletes a portrait from Firebase Storage.
   * @param {string} fileUrl The full URL of the file to delete.
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  const deletePortrait = async (fileUrl) => {
    if (!fileUrl || !fileUrl.includes('firebasestorage.googleapis.com')) {
      // Not a firebase storage url, likely a default or external url, so we just ignore it.
      return { success: true }
    }

    try {
      const storageRef = ref(storage, fileUrl)
      await deleteObject(storageRef)
      return { success: true }
    } catch (error) {
      // If the file doesn't exist, it's not a critical error.
      if (error.code === 'storage/object-not-found') {
        console.warn('Attempted to delete a non-existent file:', fileUrl)
        return { success: true } // Report success as the file is gone.
      }
      console.error('Error deleting file:', error)
      return { success: false, error: error.message }
    }
  }

  return {
    uploadPortrait,
    deletePortrait,
  }
}
