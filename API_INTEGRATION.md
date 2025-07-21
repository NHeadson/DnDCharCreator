# D&D API Integration

This project now supports loading D&D race data from the 5e-bits D&D API instead of using static data.

## Setup

1. **Copy Environment File** (Optional - API works without configuration)

   ```bash
   cp .env.example .env
   ```

2. **Configure API Settings** (Optional)

   Edit the `.env` file if you want to use a different API:

   ```env
   VUE_APP_DND_API_BASE_URL=https://www.dnd5eapi.co/api/2014
   ```

## Supported APIs

### 5e-bits D&D API (Free - Default)

- **URL**: `https://www.dnd5eapi.co/api/2014`
- **No API key required**
- **Endpoints**: `/races`, `/races/{index}`
- **Documentation**: https://5e-bits.github.io/docs/

### Custom API

Replace the values in your `.env` file with your API details.

## How It Works

1. **API Service** (`src/services/dndAPI.js`): Handles API requests and data transformation
2. **Character Data Composable** (`src/composables/useCharacterData.js`): Loads API data on initialization
3. **Fallback Data**: If API fails, uses static fallback data
4. **Loading States**: Shows loading indicators while fetching data

## API Response Format

The API service expects race data in this format:
```json
{
  "results": [
    {
      "index": "elf",
      "name": "Elf",
      "size": "Medium",
      "speed": 30,
      "darkvision": 60,
      "subraces": [
        {
          "index": "high-elf",
          "name": "High Elf"
        }
      ]
    }
  ]
}
```

## Testing

1. **Test API Connection**:
   Open `api-test.html` in your browser to test API connectivity

2. **Check Console**:
   The app logs API requests and responses to the browser console

## Customization

To use a different API:

1. Update the `transformRacesData()` method in `src/services/dndAPI.js`
2. Modify the API endpoints in the `getRaces()` method
3. Update authentication headers if needed

## Error Handling

- **API Unavailable**: Falls back to static data
- **Invalid Response**: Shows warning and uses fallback
- **Network Error**: Graceful degradation with error messages
