/**
 * Fleet Intelligence Smart AI - Page Skeleton Loader
 * Renders placeholder structure during module load state
 */

import React from 'react';

export const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="space-y-3 pb-4 border-b border-slate-800">
        <div className="h-4 w-40 rounded bg-slate-800/80" />
        <div className="h-8 w-72 rounded-lg bg-slate-800" />
        <div className="h-4 w-96 rounded bg-slate-800/60" />
      </div>

      {/* KPI Cards Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-28 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="h-3 w-24 rounded bg-slate-800" />
              <div className="h-6 w-6 rounded-lg bg-slate-800" />
            </div>
            <div className="h-7 w-20 rounded bg-slate-800" />
            <div className="h-2 w-32 rounded bg-slate-800/60" />
          </div>
        ))}
      </div>

      {/* Main Content Skeleton Panel */}
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-6 h-80 space-y-4">
        <div className="h-5 w-48 rounded bg-slate-800" />
        <div className="space-y-3 pt-4">
          <div className="h-10 w-full rounded-xl bg-slate-800/50" />
          <div className="h-10 w-full rounded-xl bg-slate-800/50" />
          <div className="h-10 w-full rounded-xl bg-slate-800/50" />
          <div className="h-10 w-full rounded-xl bg-slate-800/50" />
        </div>
      </div>
    </div>
  );
};
