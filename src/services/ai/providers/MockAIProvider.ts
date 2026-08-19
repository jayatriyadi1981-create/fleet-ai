/**
 * Fleet Intelligence Smart AI - Mock AI Provider
 * Digunakan untuk Unit Testing, CI/CD, dan mode pengujian offline tanpa network.
 */

import { IAIProvider, GenerateTextOptions, GenerateStructuredOptions, AnalyzeImageOptions } from './AIProvider';
import { AIProviderHealth } from '../../../types/ai';

export class MockAIProvider implements IAIProvider {
  readonly id = 'mock_ai_eval';
  readonly name = 'Mock Telematics Evaluation Provider';
  readonly type = 'mock' as const;

  async generateText(options: GenerateTextOptions): Promise<{
    text: string;
    toolCalls?: any[];
    usage?: { promptTokens: number; completionTokens: number; totalTokens: number };
  }> {
    return {
      text: `[MOCK AI EVALUATION RESPONSE] Processed prompt: "${options.prompt.slice(0, 50)}...". Context verified.`,
      toolCalls: [],
      usage: {
        promptTokens: 25,
        completionTokens: 35,
        totalTokens: 60,
      },
    };
  }

  async generateStructured<T = any>(options: GenerateStructuredOptions<T>): Promise<{
    data: T;
    rawText: string;
    usage?: { promptTokens: number; completionTokens: number; totalTokens: number };
  }> {
    return {
      data: { mockSuccess: true, timestamp: new Date().toISOString() } as unknown as T,
      rawText: '{"mockSuccess": true}',
      usage: { promptTokens: 20, completionTokens: 20, totalTokens: 40 },
    };
  }

  async analyzeImage(options: AnalyzeImageOptions): Promise<{
    analysis: string;
    detectedIssues?: Array<{ component: string; severity: string; description: string }>;
  }> {
    return {
      analysis: '[MOCK IMAGE ANALYSIS] Component inspected: Valid wear profile.',
      detectedIssues: [],
    };
  }

  async checkHealth(): Promise<AIProviderHealth> {
    return {
      provider: 'Mock Evaluation Provider',
      status: 'ONLINE',
      model: 'mock-eval-1.0',
      latencyAvgMs: 5,
      successRate: 1.0,
      lastChecked: new Date().toISOString(),
      errorCount: 0,
    };
  }
}
