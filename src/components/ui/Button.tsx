import React from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'destructive'
  | 'success'
  | 'link'
  | 'ai';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Base styles
    const baseStyles =
      'inline-flex items-center justify-center font-semibold transition-all duration-150 ease-in-out select-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]';

    // Size variants
    const sizeStyles: Record<ButtonSize, string> = {
      xs: 'px-2.5 py-1 text-[11px] rounded-md gap-1.5',
      sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5',
      md: 'px-4 py-2 text-xs rounded-xl gap-2',
      lg: 'px-5 py-2.5 text-sm rounded-xl gap-2.5',
      xl: 'px-6 py-3.5 text-base rounded-2xl gap-3',
    };

    // Variant styles
    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-cyan-500 text-slate-950 hover:bg-cyan-400 focus:ring-cyan-400 shadow-lg shadow-cyan-500/20 font-bold',
      secondary:
        'bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700 focus:ring-slate-500',
      outline:
        'bg-transparent text-slate-200 border border-slate-700 hover:bg-slate-800/80 hover:text-white focus:ring-cyan-500',
      ghost:
        'bg-transparent text-slate-300 hover:bg-slate-800/60 hover:text-white focus:ring-slate-500',
      destructive:
        'bg-rose-600 text-white hover:bg-rose-500 focus:ring-rose-500 shadow-lg shadow-rose-600/20 font-bold',
      success:
        'bg-emerald-500 text-slate-950 hover:bg-emerald-400 focus:ring-emerald-400 shadow-lg shadow-emerald-500/20 font-bold',
      link:
        'bg-transparent text-cyan-400 hover:text-cyan-300 underline underline-offset-4 p-0 shadow-none focus:ring-transparent',
      ai:
        'bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white font-bold hover:brightness-110 shadow-lg shadow-purple-500/25 focus:ring-purple-400 border border-purple-400/30',
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        ) : (
          <>
            {variant === 'ai' && !leftIcon && <Sparkles className="h-3.5 w-3.5 text-cyan-200" />}
            {leftIcon}
            <span>{children}</span>
            {rightIcon}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
