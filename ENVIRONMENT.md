# Environment Variables Configuration

Centralized environment variables required for Fleet Intelligence Smart AI.

## Required Variables (`.env.example`)

```env
# Server API Port (Default: 3000)
PORT=3000

# Gemini AI Secret Key (Server-side ONLY)
GEMINI_API_KEY=

# Public Frontend Variables
VITE_API_BASE_URL=/api
VITE_APP_NAME=Fleet Intelligence Smart AI
VITE_APP_ENV=development
VITE_MAP_PROVIDER=leaflet
VITE_ENABLE_MOCK_GPS=true
VITE_ENABLE_AI=true
VITE_ENABLE_REALTIME=true
```

> **Security Note**: Never expose `GEMINI_API_KEY` to the client-side browser bundle. All AI requests pass through server-side proxy `/api/ai/*` routes.
