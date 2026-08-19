import React from 'react';
import { User } from 'lucide-react';

export interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'idle' | 'busy';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name = 'User',
  src,
  size = 'md',
  status,
  className = '',
}) => {
  const sizeMap = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-xs font-bold',
    lg: 'h-12 w-12 text-sm font-bold',
    xl: 'h-16 w-16 text-base font-bold',
  };

  const getInitials = (n: string) => {
    const parts = n.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return (n[0] || 'U').toUpperCase();
  };

  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-slate-500',
    idle: 'bg-amber-500',
    busy: 'bg-rose-500',
  };

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`flex items-center justify-center rounded-full bg-slate-800 text-slate-200 border border-slate-700/80 overflow-hidden ${sizeMap[size]}`}
      >
        {src ? (
          <img src={src} alt={name} className="h-full w-full object-cover" />
        ) : name ? (
          <span>{getInitials(name)}</span>
        ) : (
          <User className="h-1/2 w-1/2 text-slate-400" />
        )}
      </div>

      {status && (
        <span
          className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-slate-950 ${statusColors[status]}`}
        />
      )}
    </div>
  );
};
