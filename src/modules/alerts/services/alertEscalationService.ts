/**
 * Fleet Intelligence Smart AI - Alert Escalation Service
 * Level 1/2/3 Escalation logic, unacknowledged timeout triggers, and history
 */

import { EscalationPolicy, Alert } from '../types';

class AlertEscalationService {
  private policies: EscalationPolicy[] = [
    {
      id: 'esc-pol-01',
      tenantId: 'tenant-tln-01',
      name: 'Standard Operations & Safety Escalation',
      description: 'Eskalasi bertahap untuk peringatan Kritis yang tidak di-acknowledge tepat waktu.',
      levels: [
        {
          level: 1,
          recipientRoleOrUser: 'Dispatcher On-Duty',
          timeoutMinutes: 0,
          channels: ['IN_APP', 'PUSH'],
        },
        {
          level: 2,
          recipientRoleOrUser: 'Fleet Manager',
          timeoutMinutes: 5,
          channels: ['IN_APP', 'PUSH', 'WHATSAPP'],
        },
        {
          level: 3,
          recipientRoleOrUser: 'Operations VP & Safety Chief',
          timeoutMinutes: 10,
          channels: ['IN_APP', 'PUSH', 'WHATSAPP', 'SMS'],
        },
      ],
    },
  ];

  public getPolicies(): EscalationPolicy[] {
    return this.policies;
  }

  public getPolicyById(id: string): EscalationPolicy | undefined {
    return this.policies.find((p) => p.id === id);
  }

  /**
   * Evaluates if an unacknowledged active alert should escalate to the next level
   */
  public evaluateAlertEscalation(alert: Alert): { shouldEscalate: boolean; nextLevel?: number; targetRecipient?: string } {
    if (alert.status !== 'ACTIVE' || alert.severity !== 'CRITICAL') {
      return { shouldEscalate: false };
    }

    const policyId = alert.metadata?.escalationPolicyId || 'esc-pol-01';
    const policy = this.getPolicyById(policyId);
    if (!policy) return { shouldEscalate: false };

    const currentLevel = alert.escalationLevel || 1;
    const nextLevelObj = policy.levels.find((l) => l.level === currentLevel + 1);
    if (!nextLevelObj) return { shouldEscalate: false }; // Already at max level

    const triggeredTime = new Date(alert.triggeredAt).getTime();
    const elapsedMinutes = (Date.now() - triggeredTime) / 60000;

    if (elapsedMinutes >= nextLevelObj.timeoutMinutes) {
      return {
        shouldEscalate: true,
        nextLevel: nextLevelObj.level,
        targetRecipient: nextLevelObj.recipientRoleOrUser,
      };
    }

    return { shouldEscalate: false };
  }
}

export const alertEscalationService = new AlertEscalationService();
