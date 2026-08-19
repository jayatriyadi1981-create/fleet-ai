import React from 'react';

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

export interface TabsProps {
  tabs: TabItem[];
  activeTab: string;
  onChange: (tabId: string) => void;
  variant?: 'underline' | 'pill' | 'segmented';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'segmented',
  size = 'md',
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1 gap-1.5',
    md: 'text-xs px-3 py-1.5 gap-2 font-semibold',
    lg: 'text-sm px-4 py-2 gap-2 font-bold',
  };

  if (variant === 'segmented') {
    return (
      <div className={`inline-flex rounded-xl bg-slate-900/90 p-1 border border-slate-800 ${className}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center justify-center rounded-lg transition-all ${
                sizeStyles[size]
              } ${
                isActive
                  ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[10px] font-bold text-cyan-300">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  if (variant === 'pill') {
    return (
      <div className={`flex flex-wrap items-center gap-2 ${className}`}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={`flex items-center rounded-full transition-all ${sizeStyles[size]} ${
                isActive
                  ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/20'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className="rounded-full bg-slate-950/40 px-1.5 py-0.5 text-[10px] font-bold">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // Underline variant
  return (
    <div className={`flex items-center gap-6 border-b border-slate-800 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex items-center pb-3 transition-all relative ${sizeStyles[size]} ${
              isActive
                ? 'text-cyan-400 font-bold border-b-2 border-cyan-400 -mb-[1px]'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] font-bold text-slate-300">
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};
