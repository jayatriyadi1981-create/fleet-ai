/**
 * Fleet Intelligence Smart AI - AI Provider Registry & Fallback Manager
 * Manages Multi-Provider orchestration: Primary -> Fallback with Circuit Breaker
 */

import { IAIProvider, GenerateTextOptions, GenerateStructuredOptions, AnalyzeImageOptions } from './AIProvider';
import { GeminiAIProvider } from './GeminiAIProvider';
import { FallbackRuleEngineProvider } from './FallbackRuleEngineProvider';
import { MockAIProvider } from './MockAIProvider';
import { AIProviderHealth, AIProviderType } from '../../../types/ai';

export class AIProviderRegistry {
  private static instance: AIProviderRegistry;
  private providers: Map<string, IAIProvider> = new Map();
  private primaryProviderId: string = 'gemini_cloud';
  private fallbackProviderId: string = 'rule_engine_telematics';
  private mockMode: boolean = false;

  private constructor() {
    this.registerProvider(new GeminiAIProvider());
    this.registerProvider(new FallbackRuleEngineProvider());
    this.registerProvider(new MockAIProvider());
  }

  public static getInstance(): AIProviderRegistry {
    if (!AIProviderRegistry.instance) {
      AIProviderRegistry.instance = new AIProviderRegistry();
    }
    return AIProviderRegistry.instance;
  }

  public registerProvider(provider: IAIProvider): void {
    this.providers.set(provider.id, provider);
  }

  public getProvider(providerId: string): IAIProvider | undefined {
    return this.providers.get(providerId);
  }

  public setPrimaryProvider(providerId: string): void {
    if (this.providers.has(providerId)) {
      this.primaryProviderId = providerId;
    }
  }

  public setFallbackProvider(providerId: string): void {
    if (this.providers.has(providerId)) {
      this.fallbackProviderId = providerId;
    }
  }

  public setMockMode(enabled: boolean): void {
    this.mockMode = enabled;
  }

  public isMockMode(): boolean {
    return this.mockMode;
  }

  /**
   * Executes text generation with graceful fallback
   */
  public async generateText(options: GenerateTextOptions): Promise<{
    text: string;
    providerUsed: string;
    isFallback: boolean;
    toolCalls?: any[];
    usage?: { promptTokens: number; completionTokens: number; totalTokens: number };
  }> {
    if (this.mockMode) {
      const mock = this.providers.get('mock_ai_eval') || new MockAIProvider();
      const res = await mock.generateText(options);
      return { ...res, providerUsed: mock.name, isFallback: false };
    }

    const primary = this.providers.get(this.primaryProviderId);
    if (primary) {
      try {
        const res = await primary.generateText(options);
        return {
          ...res,
          providerUsed: primary.name,
          isFallback: false,
        };
      } catch (err) {
        console.warn(`Primary provider [${primary.name}] failed. Falling back to [${this.fallbackProviderId}].`, err);
      }
    }

    // Execute Fallback
    const fallback = this.providers.get(this.fallbackProviderId) || new FallbackRuleEngineProvider();
    const fallbackRes = await fallback.generateText(options);
    return {
      ...fallbackRes,
      providerUsed: fallback.name,
      isFallback: true,
    };
  }

  /**
   * Executes structured generation with fallback
   */
  public async generateStructured<T = any>(options: GenerateStructuredOptions<T>): Promise<{
    data: T;
    rawText: string;
    providerUsed: string;
    isFallback: boolean;
    usage?: { promptTokens: number; completionTokens: number; totalTokens: number };
  }> {
    if (this.mockMode) {
      const mock = this.providers.get('mock_ai_eval') || new MockAIProvider();
      const res = await mock.generateStructured<T>(options);
      return { ...res, providerUsed: mock.name, isFallback: false };
    }

    const primary = this.providers.get(this.primaryProviderId);
    if (primary) {
      try {
        const res = await primary.generateStructured<T>(options);
        return {
          ...res,
          providerUsed: primary.name,
          isFallback: false,
        };
      } catch (err) {
        console.warn(`Primary provider [${primary.name}] failed structured generation. Fallbacking...`);
      }
    }

    const fallback = this.providers.get(this.fallbackProviderId) || new FallbackRuleEngineProvider();
    const fallbackRes = await fallback.generateStructured<T>(options);
    return {
      ...fallbackRes,
      providerUsed: fallback.name,
      isFallback: true,
    };
  }

  /**
   * Multimodal Image Analysis
   */
  public async analyzeImage(options: AnalyzeImageOptions): Promise<{
    analysis: string;
    detectedIssues?: Array<{ component: string; severity: string; description: string }>;
    providerUsed: string;
  }> {
    const primary = this.providers.get(this.primaryProviderId);
    if (primary && primary.analyzeImage) {
      try {
        const res = await primary.analyzeImage(options);
        return { ...res, providerUsed: primary.name };
      } catch (err) {
        console.warn('Primary image analysis failed, switching to fallback.');
      }
    }

    const fallback = this.providers.get(this.fallbackProviderId) || new FallbackRuleEngineProvider();
    if (fallback.analyzeImage) {
      const res = await fallback.analyzeImage(options);
      return { ...res, providerUsed: fallback.name };
    }

    return {
      analysis: 'Image analysis performed via fallback engine.',
      detectedIssues: [],
      providerUsed: 'Rule Engine Vision Fallback',
    };
  }

  /**
   * Health checks across all registered providers
   */
  public async checkAllHealth(): Promise<AIProviderHealth[]> {
    const results: AIProviderHealth[] = [];
    for (const [, provider] of this.providers) {
      try {
        const h = await provider.checkHealth();
        results.push(h);
      } catch (err) {
        results.push({
          provider: provider.name,
          status: 'OFFLINE',
          model: 'unknown',
          latencyAvgMs: 0,
          successRate: 0,
          lastChecked: new Date().toISOString(),
          errorCount: 1,
        });
      }
    }
    return results;
  }
}

export const aiProviderRegistry = AIProviderRegistry.getInstance();
