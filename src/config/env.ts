/**
 * Centralized Environment Configuration & Validation
 */

export interface EnvConfig {
  apiBaseUrl: string;
  appName: string;
  appEnv: 'development' | 'staging' | 'production';
  mapProvider: 'google_maps' | 'leaflet' | 'mapbox';
  enableMockGps: boolean;
  enableAi: boolean;
  enableRealtime: boolean;
}

export const getEnv = (): EnvConfig => {
  const metaEnv = (import.meta as any).env || {};
  const isDev = metaEnv.DEV || process.env.NODE_ENV !== 'production';

  return {
    apiBaseUrl: metaEnv.VITE_API_BASE_URL || '/api',
    appName: metaEnv.VITE_APP_NAME || 'Fleet Intelligence Smart AI',
    appEnv: (metaEnv.VITE_APP_ENV as any) || (isDev ? 'development' : 'production'),
    mapProvider: (metaEnv.VITE_MAP_PROVIDER as any) || 'leaflet',
    enableMockGps: metaEnv.VITE_ENABLE_MOCK_GPS !== 'false',
    enableAi: metaEnv.VITE_ENABLE_AI !== 'false',
    enableRealtime: metaEnv.VITE_ENABLE_REALTIME !== 'false',
  };
};

export const validateEnv = (): boolean => {
  const env = getEnv();
  if (!env.appName) {
    console.warn('[ENV] VITE_APP_NAME is missing, using default');
  }
  return true;
};
