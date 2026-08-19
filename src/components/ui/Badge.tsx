import React from 'react';
import { Sparkles, Radio, CheckCircle2, AlertTriangle, ShieldAlert, Wrench, ParkingSquare } from 'lucide-react';
import { VehicleStatus } from '../../types';

export type BadgeVariant =
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'
  | 'primary'
  | 'ai';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  pulse?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  pulse = false,
  className = '',
  icon,
}) => {
  const sizeStyles = {
    sm: 'px-1.5 py-0.5 text-[10px] gap-1 rounded',
    md: 'px-2.5 py-1 text-xs gap-1.5 rounded-md font-semibold',
    lg: 'px-3 py-1.5 text-xs gap-2 rounded-lg font-bold',
  };

  const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/25',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/25',
    danger: 'bg-rose-500/10 text-rose-400 border border-rose-500/25',
    info: 'bg-sky-500/10 text-sky-400 border border-sky-500/25',
    neutral: 'bg-slate-800/80 text-slate-300 border border-slate-700/80',
    primary: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/25',
    ai: 'bg-purple-500/10 text-purple-300 border border-purple-500/30 shadow-sm shadow-purple-950',
  };

  const dotColors: Record<BadgeVariant, string> = {
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-rose-400',
    info: 'bg-sky-400',
    neutral: 'bg-slate-400',
    primary: 'bg-cyan-400',
    ai: 'bg-purple-400',
  };

  return (
    <span
      className={`inline-flex items-center tracking-wide ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span className="relative flex h-2 w-2 shrink-0">
          {pulse && (
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${dotColors[variant]}`}
            />
          )}
          <span className={`relative inline-flex h-2 w-2 rounded-full ${dotColors[variant]}`} />
        </span>
      )}
      {variant === 'ai' && !icon && <Sparkles className="h-3 w-3 text-purple-400 shrink-0" />}
      {icon}
      <span>{children}</span>
    </span>
  );
};

export interface VehicleStatusBadgeProps {
  status: VehicleStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VehicleStatusBadge: React.FC<VehicleStatusBadgeProps> = ({
  status,
  size = 'md',
  className = '',
}) => {
  switch (status) {
    case 'moving':
      return (
        <Badge variant="success" size={size} dot pulse className={className} icon={<Radio className="h-3 w-3 shrink-0" />}>
          Bergerak (Moving)
        </Badge>
      );
    case 'idle':
      return (
        <Badge variant="warning" size={size} dot className={className}>
          Mesin Idling
        </Badge>
      );
    case 'parking':
      return (
        <Badge variant="info" size={size} className={className} icon={<ParkingSquare className="h-3 w-3 shrink-0" />}>
          Parkir (Parking)
        </Badge>
      );
    case 'offline':
      return (
        <Badge variant="neutral" size={size} className={className}>
          Sinyal Terputus
        </Badge>
      );
    case 'emergency':
      return (
        <Badge variant="danger" size={size} dot pulse className={className} icon={<ShieldAlert className="h-3 w-3 shrink-0" />}>
          Darurat (SOS)
        </Badge>
      );
    case 'maintenance':
      return (
        <Badge variant="warning" size={size} className={className} icon={<Wrench className="h-3 w-3 shrink-0" />}>
          Dalam Servis
        </Badge>
      );
    default:
      return (
        <Badge variant="neutral" size={size} className={className}>
          {status}
        </Badge>
      );
  }
};
