/**
 * Fleet Intelligence Smart AI - AI Services & Model Orchestration Configuration
 * PROMPT 59: Gemini Models, Token Quotas, Context Windows, Cost Bounds & Degraded Mode
 */

export interface AiConfig {
  primaryModel: string;
  reasoningModel: string;
  fastModel: string;
  temperature: number;
  maxOutputTokens: number;
  contextWindowTokens: number;
  gracefulDegradation: {
    allowCoreTrackingWithoutAi: boolean;
    fallbackOfflineHeuristics: boolean;
  };
  rateLimitPerTenant: {
    requestsPerMinute: number;
    tokensPerDay: number;
  };
  costTracking: {
    usdPerMillionPromptTokens: number;
    usdPerMillionCandidateTokens: number;
  };
}

export const aiConfig: AiConfig = {
  primaryModel: 'gemini-2.5-flash',
  reasoningModel: 'gemini-2.5-pro',
  fastModel: 'gemini-2.5-flash',
  temperature: 0.2,
  maxOutputTokens: 8192,
  contextWindowTokens: 1000000,
  gracefulDegradation: {
    allowCoreTrackingWithoutAi: true,
    fallbackOfflineHeuristics: true,
  },
  rateLimitPerTenant: {
    requestsPerMinute: 30,
    tokensPerDay: 500000,
  },
  costTracking: {
    usdPerMillionPromptTokens: 0.15,
    usdPerMillionCandidateTokens: 0.60,
  },
};
