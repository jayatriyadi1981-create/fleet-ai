import React from 'react';

export interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => {
  return <div className={`animate-pulse rounded-lg bg-slate-800/80 ${className}`} />;
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
