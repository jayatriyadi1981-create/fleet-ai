/**
 * Centralized Application Logger
 * Prevents leaks of sensitive credentials in production.
 */

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = {
  info: (message: string, ...meta: any[]) => {
    console.log(`[INFO] [${new Date().toISOString()}] ${message}`, ...meta);
  },
  warn: (message: string, ...meta: any[]) => {
    console.warn(`[WARN] [${new Date().toISOString()}] ${message}`, ...meta);
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] [${new Date().toISOString()}] ${message}`, error || '');
  },
  debug: (message: string, ...meta: any[]) => {
    if (!isProduction) {
      console.debug(`[DEBUG] [${new Date().toISOString()}] ${message}`, ...meta);
    }
  },
};
