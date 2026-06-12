// AI Image Generation Service for D&D Character Portraits
// Uses OpenAI's DALL-E API to generate fantasy character portraits

export class AIImageService {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY
    this.baseURL = 'https://api.openai.com/v1'
    this.model = 'dall-e-3' // Using DALL-E 3 for better quality
    this.size = '1024x1024' // Square images for portraits
  }

  // Generate a character portrait based on race and gender
  async generateCharacterPortrait(race, gender, additionalPrompt = '') {
    if (!this.apiKey) {
      throw new Error('OpenAI API key not configured. Please set VITE_OPENAI_API_KEY in your environment variables.')
    }

    try {
      const prompt = this.buildCharacterPrompt(race, gender, additionalPrompt)

      const response = await fetch(`${this.baseURL}/images/generations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          prompt,
          n: 1,
          size: this.size,
          quality: 'standard', // 'hd' for higher quality but more expensive
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(`OpenAI API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`)
      }

      const data = await response.json()

      if (!data.data || !data.data[0] || !data.data[0].url) {
        throw new Error('Invalid response from OpenAI API')
      }

      // Download the image and upload to Firebase Storage for permanent storage
      const permanentUrl = await this.storeImagePermanently(data.data[0].url, race, gender)

      return {
        url: permanentUrl,
        race,
        gender,
        prompt,
        generatedAt: new Date().toISOString(),
      }
    } catch (error) {
      console.error('Error generating character portrait:', error)
      throw error
    }
  }

  // Download image from OpenAI and store permanently in Firebase Storage
  async storeImagePermanently(openAiUrl, race, gender) {
    try {
      // Download the image from OpenAI
      const imageResponse = await fetch(openAiUrl)
      if (!imageResponse.ok) {
        throw new Error('Failed to download image from OpenAI')
      }

      const imageBlob = await imageResponse.blob()

      // Convert blob to File object for Firebase Storage
      const fileName = `ai-portrait-${race}-${gender}-${Date.now()}.webp`
      const imageFile = new File([imageBlob], fileName, { type: 'image/webp' })

      // Upload to Firebase Storage
      const { useFirebaseStorage } = await import('@/composables/useFirebaseStorage')
      const { uploadPortrait } = useFirebaseStorage()

      // Use a generic character ID for AI-generated portraits
      const result = await uploadPortrait(imageFile, 'ai-generated')

      if (!result.success) {
        throw new Error(`Failed to upload to Firebase Storage: ${result.error}`)
      }

      return result.url
    } catch (error) {
      console.error('Error storing image permanently:', error)
      // Fallback to OpenAI URL if Firebase upload fails
      console.warn('Falling back to temporary OpenAI URL')
      return openAiUrl
    }
  }

  // Build a detailed prompt for character generation
  buildCharacterPrompt(race, gender, additionalPrompt = '') {
    const raceDescriptions = {
      dragonborn: 'dragonborn with scaled skin, horns, and reptilian features',
      dwarf: 'dwarf with braided beard, sturdy build, and traditional dwarven clothing',
      elf: 'elf with pointed ears, graceful features, and elegant elven attire',
      gnome: 'gnome with colorful hair, curious expression, and inventive clothing',
      'half-elf': 'half-elf with subtle elven features, human-like build, and mixed heritage clothing',
      halfling: 'halfling with curly hair, cheerful expression, and practical adventuring gear',
      'half-orc': 'half-orc with tusks, muscular build, and tribal markings',
      human: 'human with diverse features, confident pose, and versatile clothing',
      tiefling: 'tiefling with horns, tail, and infernal heritage features',
    }

    const genderDescriptors = {
      male: 'male, masculine features, strong presence',
      female: 'female, feminine features, graceful presence',
    }

    const baseRace = raceDescriptions[race.toLowerCase()] || raceDescriptions['human']
    const genderDesc = genderDescriptors[gender.toLowerCase()] || ''

    const basePrompt = `A detailed fantasy portrait of a D&D ${baseRace}, ${genderDesc}. Professional digital art, detailed face, fantasy character art style, high quality, sharp focus, well-lit, suitable for RPG character portrait.`

    // Add any additional prompt details
    if (additionalPrompt.trim()) {
      return `${basePrompt} ${additionalPrompt}`
    }

    return basePrompt
  }

  // Generate multiple portraits for a race/gender combination (for variety)
  async generatePortraitSet(race, gender, count = 4) {
    const portraits = []

    for (let i = 0; i < count; i++) {
      try {
        // Add slight variation to prompts for different results
        const variations = ['confident expression', 'determined look', 'mysterious gaze', 'heroic pose']

        const variation = variations[i % variations.length]
        const portrait = await this.generateCharacterPortrait(race, gender, variation)
        portraits.push(portrait)

        // Small delay between requests to avoid rate limits
        if (i < count - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      } catch (error) {
        console.error(`Failed to generate portrait ${i + 1} for ${race} ${gender}:`, error)
        // Continue with other portraits even if one fails
      }
    }

    return portraits
  }

  // Validate API key
  async validateApiKey() {
    if (!this.apiKey) {
      return { valid: false, error: 'No API key configured' }
    }

    try {
      // Make a minimal request to test the key
      const response = await fetch(`${this.baseURL}/models`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })

      return {
        valid: response.ok,
        error: response.ok ? null : `API key validation failed: ${response.status}`,
      }
    } catch (error) {
      return {
        valid: false,
        error: `API key validation error: ${error.message}`,
      }
    }
  }

  // Get estimated cost for image generation
  getEstimatedCost(count = 1) {
    // DALL-E 3 pricing: $0.040 per image for standard quality
    const costPerImage = 0.04
    return count * costPerImage
  }
}

// Export a singleton instance
export const aiImageService = new AIImageService()
