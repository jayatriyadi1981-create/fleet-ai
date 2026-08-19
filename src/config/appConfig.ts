/**
 * Global Application Configuration & Feature Flags
 */

import { getEnv } from './env';

export const appConfig = {
  appName: 'Fleet Intelligence Smart AI',
  version: '0.1.0',
  environment: getEnv().appEnv,
  language: 'id-ID',
  currency: 'IDR',
  timezone: 'Asia/Jakarta',
  company: {
    defaultName: 'PT Logistik Nusantara Fleet',
    defaultTaxId: '01.234.567.8-012.000',
    supportEmail: 'ops@fleet-intelligence.ai',
  },
  features: {
    ENABLE_MOCK_GPS: getEnv().enableMockGps,
    ENABLE_AI: getEnv().enableAi,
    ENABLE_REALTIME: getEnv().enableRealtime,
    ENABLE_FUEL: true,
    ENABLE_MAINTENANCE: true,
    ENABLE_DELIVERY: true,
    ENABLE_DRIVER_SCORECARD: true,
  },
};
