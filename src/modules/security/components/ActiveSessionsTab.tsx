/**
 * Fleet Intelligence Smart AI - Active Sessions & Device Security Tab
 * PROMPT 50 - Real-Time Session Monitoring, Rotation & Revocation
 */

import React, { useState } from 'react';
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  RotateCw,
  LogOut,
  ShieldCheck,
  MapPin,
  Clock,
  Key,
  AlertTriangle,
  UserCheck,
  Laptop,
} from 'lucide-react';
import { sessionService } from '../services/sessionService';
import { ActiveUserSession } from '../types/securityTypes';

export const ActiveSessionsTab: React.FC = () => {
  const [sessions, setSessions] = useState<ActiveUserSession[]>(() =>
    sessionService.getActiveSessions()
  );
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  const handleRotateCurrentSession = () => {
    const current = sessions.find((s) => s.isCurrent);
    if (current) {
      sessionService.rotateSession(current.sessionId, 'Manual user security rotation');
      setSessions(sessionService.getActiveSessions());
      setFeedbackMessage('Session ID successfully rotated. Previous session token revoked.');
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  const handleRevokeSession = (sessionId: string) => {
    sessionService.revokeSession(sessionId, 'Bambang Pratama (Admin)');
    setSessions(sessionService.getActiveSessions());
    setFeedbackMessage(`Session [${sessionId}] revoked immediately.`);
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleRevokeAllOther = () => {
    const current = sessions.find((s) => s.isCurrent);
    if (current) {
      const count = sessionService.revokeAllOtherSessions(current.userId, current.sessionId);
      setSessions(sessionService.getActiveSessions());
      setFeedbackMessage(`Successfully terminated ${count} remote device sessions.`);
      setTimeout(() => setFeedbackMessage(null), 4000);
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'MOBILE':
        return <Smartphone className="w-5 h-5 text-emerald-400" />;
      case 'TABLET':
        return <Tablet className="w-5 h-5 text-purple-400" />;
      case 'DESKTOP':
      default:
        return <Laptop className="w-5 h-5 text-blue-400" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <div>
          <h3 className="font-semibold text-white text-lg">Active Device & User Sessions</h3>
          <p className="text-sm text-slate-400 mt-0.5">
            Monitor verified client sessions across your enterprise organization with instant killswitch.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleRotateCurrentSession}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition"
          >
            <RotateCw className="w-4 h-4 text-blue-400" />
            Rotate My Session
          </button>
          <button
            onClick={handleRevokeAllOther}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3.5 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/30 rounded-lg text-sm font-medium transition"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            Revoke All Other Sessions
          </button>
        </div>
      </div>

      {feedbackMessage && (
        <div className="p-3.5 bg-blue-950/40 border border-blue-500/40 text-blue-300 rounded-lg text-sm flex items-center gap-2 animate-fadeIn">
          <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((sess) => (
          <div
            key={sess.sessionId}
            className={`p-5 rounded-xl border transition ${
              sess.isCurrent
                ? 'bg-slate-900 border-blue-500/40 shadow-lg shadow-blue-950/20'
                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700">
                  {getDeviceIcon(sess.deviceType)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{sess.browser}</span>
                    {sess.isCurrent && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium">
                        Current Device
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">{sess.os}</span>
                </div>
              </div>

              {!sess.isCurrent && (
                <button
                  onClick={() => handleRevokeSession(sess.sessionId)}
                  className="px-2.5 py-1 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded border border-red-500/20 transition"
                >
                  Revoke
                </button>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">User / Role</span>
                <span className="text-slate-300 font-medium">{sess.userName}</span>
                <span className="text-slate-400 block text-[11px] font-mono">[{sess.role}]</span>
              </div>
              <div>
                <span className="text-slate-500 block">IP Address & Location</span>
                <span className="text-slate-300 font-mono">{sess.ipAddress}</span>
                <span className="text-slate-400 block text-[11px] flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {sess.locationCity}, {sess.locationCountry}
                </span>
              </div>
              <div>
                <span className="text-slate-500 block">Session ID</span>
                <span className="text-slate-400 font-mono text-[11px]">{sess.sessionId}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Last Active</span>
                <span className="text-slate-300 flex items-center gap-1 mt-0.5">
                  <Clock className="w-3 h-3 text-slate-500" />
                  {new Date(sess.lastActivityAt).toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
