/**
 * Fleet Intelligence Smart AI - Feature Entitlement & Subscription Gate Hook (Prompt 41)
 */

import { useSubscription } from '../context/SubscriptionContext';
import { PlanFeatureKey } from '../types/subscription';

export interface FeatureGateResult {
  allowed: boolean;
  isTrial: boolean;
  currentPlanName: string;
  featureKey: PlanFeatureKey;
  recommendedPlan: string;
}

export function useFeatureGate(feature: PlanFeatureKey): FeatureGateResult {
  const { canUseFeature, currentPlan, isTrial } = useSubscription();

  const allowed = canUseFeature(feature);
  const currentPlanName = currentPlan?.name || 'Starter';

  let recommendedPlan = 'Professional';
  if (feature === 'api' || feature === 'customBranding') {
    recommendedPlan = 'Enterprise';
  }

  return {
    allowed,
    isTrial,
    currentPlanName,
    featureKey: feature,
    recommendedPlan,
  };
}
