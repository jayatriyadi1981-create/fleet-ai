/**
 * Fleet Intelligence Smart AI - Security & Authentication Utilities
 */

import { PasswordStrength } from '../types/auth';

export function calculatePasswordStrength(password: string): PasswordStrength {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  let score = 0;
  if (hasMinLength) score += 1;
  if (hasUppercase && hasLowercase) score += 1;
  if (hasNumber) score += 1;
  if (hasSpecialChar) score += 1;

  let label: 'Weak' | 'Fair' | 'Good' | 'Strong' = 'Weak';
  if (score === 2) label = 'Fair';
  if (score === 3) label = 'Good';
  if (score >= 4) label = 'Strong';

  return {
    score,
    label,
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber,
    hasSpecialChar,
  };
}

export function formatTimeCooldown(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function generateMockRecoveryCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 8; i++) {
    const part1 = Math.random().toString(36).substring(2, 6).toUpperCase();
    const part2 = Math.random().toString(36).substring(2, 6).toUpperCase();
    codes.push(`${part1}-${part2}`);
  }
  return codes;
}
