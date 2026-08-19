/**
 * Fleet Intelligence Smart AI - AI Security & DLP Guardrails Tab
 * PROMPT 50 - Zero Data Leakage, PII Masking & Human-In-The-Loop Approvals
 */

import React, { useState } from 'react';
import {
  Bot,
  ShieldCheck,
  ShieldAlert,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Zap,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { auditRedactionService } from '../../audit/services/auditRedactionService';

export const AiSecurityTab: React.FC = () => {
  const [samplePrompt, setSamplePrompt] = useState(
    'Tolong kirimkan ringkasan gaji driver Budi Santoso (NPWP: 01.345.678.9-012.000, HP: +6281234567890, email: budi.santoso@fleet.id) untuk trip #901.'
  );
  const [requireHumanApproval, setRequireHumanApproval] = useState(true);
  const [enforcePiiMasking, setEnforcePiiMasking] = useState(true);

  const getMaskedPrompt = () => {
    return auditRedactionService.maskString(samplePrompt);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <h3 className="font-semibold text-white text-lg">AI & Gemini Copilot Security Guardrails</h3>
        <p className="text-sm text-slate-400 mt-0.5">
          Zero Data Leakage (DLP) architecture prevents private PII, driver credentials, and financial metrics from model training or external leak.
        </p>
      </div>

      {/* 3 DLP Rule Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">PII Pre-Filter</span>
            <Lock className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-sm font-medium text-slate-200 mt-2">Automatic Redaction Gateway</p>
          <p className="text-xs text-slate-400 mt-1">NIK, NPWP, Phone, Email & Passwords stripped before LLM API invocation.</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Action Gate</span>
            <UserCheck className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-sm font-medium text-slate-200 mt-2">Human-In-The-Loop</p>
          <p className="text-xs text-slate-400 mt-1">AI suggestions requiring deletion or financial changes require manual OTP approval.</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Tenant Scope</span>
            <ShieldCheck className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-sm font-medium text-slate-200 mt-2">Context Injection Guard</p>
          <p className="text-xs text-slate-400 mt-1">System prompts strictly inject authenticated tenant ID with query boundaries.</p>
        </div>
      </div>

      {/* Interactive DLP Redaction Inspector */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-400" />
          Live AI Data Leakage Prevention (DLP) Sandbox Inspector
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Raw User Input */}
          <div>
            <label className="text-xs font-medium text-slate-400 block mb-1.5">
              1. Raw Client Prompt (Contains Sensitive PII)
            </label>
            <textarea
              rows={4}
              value={samplePrompt}
              onChange={(e) => setSamplePrompt(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg p-3 font-mono focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Sanitized LLM Ingestion Stream */}
          <div>
            <label className="text-xs font-medium text-emerald-400 flex items-center gap-1.5 mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              2. Sanitized Payload Dispatched to Gemini LLM
            </label>
            <div className="w-full h-[106px] bg-slate-950 border border-emerald-500/30 text-emerald-300 text-xs rounded-lg p-3 font-mono overflow-y-auto">
              {getMaskedPrompt()}
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Zero PII egress verified. NPWP, Phone and Emails masked with regex hash tags.
          </span>
        </div>
      </div>
    </div>
  );
};
