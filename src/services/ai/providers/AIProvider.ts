/**
 * Fleet Intelligence Smart AI - AI Provider Interface & Abstraction Layer
 * Multi-provider architecture with fallback, streaming, and vision support.
 */

import { AIRequest, AIResponse, AIProviderHealth, AIStructuredChartData, AIStructuredTableData, AIStructuredKpiData } from '../../../types/ai';

export interface GenerateTextOptions {
  prompt: string;
  systemInstruction?: string;
  temperature?: number;
  maxTokens?: number;
  tools?: any[];
  context?: any;
}

export interface GenerateStructuredOptions<T = any> {
  prompt: string;
  systemInstruction?: string;
  schema?: any;
  temperature?: number;
  context?: any;
}

export interface AnalyzeImageOptions {
  imageBase64: string;
  mimeType: string;
  prompt: string;
  systemInstruction?: string;
  context?: any;
}

export interface IAIProvider {
  readonly id: string;
  readonly name: string;
  readonly type: 'gemini' | 'openai' | 'anthropic' | 'rule_engine' | 'mock';

  /**
   * Generates text response from prompt & context
   */
  generateText(options: GenerateTextOptions): Promise<{
    text: string;
    toolCalls?: any[];
    usage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
  }>;

  /**
   * Generates typed structured JSON output
   */
  generateStructured<T = any>(options: GenerateStructuredOptions<T>): Promise<{
    data: T;
    rawText: string;
    usage?: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
  }>;

  /**
   * Analyzes an image with multimodal vision capabilities
   */
  analyzeImage?(options: AnalyzeImageOptions): Promise<{
    analysis: string;
    detectedIssues?: Array<{
      component: string;
      severity: string;
      description: string;
    }>;
  }>;

  /**
   * Health check for provider availability and latency
   */
  checkHealth(): Promise<AIProviderHealth>;
}
