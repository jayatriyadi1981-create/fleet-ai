import React from 'react';

export interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return <div className={`animate-pulse rounded-lg bg-slate-800/80 ${className}`} />;
};

export const SkeletonCard: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3.5 ${className}`}>
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-7 w-7 rounded-lg" />
      </div>
      <Skeleton className="h-8 w-28" />
      <div className="space-y-2 pt-2 border-t border-slate-800/60">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-4/5" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number; cols?: number }> = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full space-y-3">
      <div className="flex gap-4 pb-2 border-b border-slate-800">
        {Array.from({ length: cols }).map((_, idx) => (
          <Skeleton key={idx} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="flex gap-4 py-3 border-b border-slate-800/50">
          {Array.from({ length: cols }).map((_, cIdx) => (
            <Skeleton key={cIdx} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
};

export const KPISkeleton: React.FC = () => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-3">
      <div className="flex justify-between items-center">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-8 w-8 rounded-xl" />
      </div>
      <Skeleton className="h-8 w-32" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
};

export const SkeletonChart: React.FC<{ height?: string; className?: string }> = ({
  height = 'h-64',
  className = '',
}) => {
  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-900/80 p-5 space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <Skeleton className="h-4 w-40" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-16 rounded-md" />
        </div>
      </div>
      <div className={`w-full ${height} rounded-xl bg-slate-950/60 border border-slate-800/60 flex items-end justify-around p-4 gap-2`}>
        <Skeleton className="h-1/3 w-8 rounded-t" />
        <Skeleton className="h-2/3 w-8 rounded-t" />
        <Skeleton className="h-1/2 w-8 rounded-t" />
        <Skeleton className="h-4/5 w-8 rounded-t" />
        <Skeleton className="h-3/5 w-8 rounded-t" />
        <Skeleton className="h-full w-8 rounded-t" />
      </div>
    </div>
  );
};

export const SkeletonMap: React.FC<{ className?: string }> = ({ className = 'h-[500px]' }) => {
  return (
    <div className={`w-full ${className} rounded-2xl border border-slate-800 bg-slate-950 relative overflow-hidden flex items-center justify-center`}>
      <div className="absolute inset-0 bg-grid-pattern opacity-40 animate-pulse" />
      <div className="relative z-10 flex flex-col items-center gap-3 bg-slate-900/90 border border-slate-800 px-6 py-4 rounded-2xl shadow-xl backdrop-blur-md">
        <div className="h-8 w-8 rounded-full border-2 border-cyan-500/30 border-t-cyan-400 animate-spin" />
        <span className="text-xs font-semibold text-slate-300">Memuat Peta Telemetri & Armada...</span>
      </div>
    </div>
  );
};

export const SkeletonList: React.FC<{ count?: number }> = ({ count = 4 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-3.5 w-32" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          </div>
          <Skeleton className="h-6 w-16 rounded-md" />
        </div>
      ))}
    </div>
  );
};

export const SkeletonHeader: React.FC = () => {
  return (
    <div className="space-y-3 pb-4 border-b border-slate-800 mb-6">
      <Skeleton className="h-4 w-48" />
      <div className="flex justify-between items-center">
        <div className="space-y-1.5">
          <Skeleton className="h-7 w-64" />
          <Skeleton className="h-3.5 w-96" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-24 rounded-xl" />
          <Skeleton className="h-9 w-32 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

