/**
 * Fleet Intelligence Smart AI - Natural Language Query Parser
 * PROMPT 53 — Section 1 & 2
 * Integrates Intent Detection, Entity Extraction, and Time Range Resolving.
 */

import { NLAnalyticsIntent, NLExtractedEntities, NLTimeRange, NLAnalyticsConversationContext } from '../../../types/nlAnalytics';
import { EntityExtractionService } from './EntityExtractionService';
import { IntentDetectionService } from './IntentDetectionService';
import { TimeRangeResolver } from './TimeRangeResolver';

export interface ParsedNLQuery {
  rawText: string;
  intent: NLAnalyticsIntent;
  entities: NLExtractedEntities;
  timeRange: NLTimeRange;
  isAmbiguous: boolean;
  ambiguityType?: 'metric_definition' | 'branch_scope' | 'vehicle_scope';
}

export class NLQueryParser {
  public static parse(
    question: string,
    context?: Partial<NLAnalyticsConversationContext>,
    timezone: 'Asia/Jakarta' | 'Asia/Makassar' | 'Asia/Jayapura' = 'Asia/Jakarta'
  ): ParsedNLQuery {
    const rawText = question.trim();

    // 1. Extract Entities (with context continuity)
    const entities = EntityExtractionService.extract(rawText, context?.previousEntities);

    // 2. Resolve Time Range
    const timeRange = TimeRangeResolver.resolve(rawText, timezone);

    // 3. Detect Intent
    const intent = IntentDetectionService.detect(rawText, entities, context?.previousIntent);

    // 4. Ambiguity Detection (Prompt 53 - Section 20 & 21)
    // Example: "Cabang mana paling efisien?" -> efficiency can be Cost/km, Fuel/km, or Utilization
    const lower = rawText.toLowerCase();
    let isAmbiguous = false;
    let ambiguityType: ParsedNLQuery['ambiguityType'];

    if (
      (lower.includes('paling efisien') || lower.includes('efisiensi cabang') || lower.includes('cabang terbaik')) &&
      !lower.includes('cost') &&
      !lower.includes('bbm') &&
      !lower.includes('utilisasi')
    ) {
      isAmbiguous = true;
      ambiguityType = 'metric_definition';
    }

    return {
      rawText,
      intent,
      entities,
      timeRange,
      isAmbiguous,
      ambiguityType,
    };
  }
}
