import React, { useState } from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  isSuccess?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      errorMessage,
      isSuccess = false,
      leftIcon,
      rightIcon,
      type = 'text',
      fullWidth = true,
      disabled,
      className = '',
      id,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const generatedId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

    const isPassword = type === 'password';
    const computedType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const widthStyle = fullWidth ? 'w-full' : '';

    const borderStyles = errorMessage
      ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20'
      : isSuccess
      ? 'border-emerald-500/80 focus:border-emerald-500 focus:ring-emerald-500/20'
      : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20';

    return (
      <div className={`${widthStyle} space-y-1.5`}>
        {label && (
          <label htmlFor={generatedId} className="block text-xs font-semibold text-slate-300">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}

          <input
            ref={ref}
            id={generatedId}
            type={computedType}
            disabled={disabled}
            className={`w-full rounded-xl bg-slate-900/90 py-2.5 text-xs text-white placeholder-slate-500 border transition-all outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              leftIcon ? 'pl-10' : 'pl-4'
            } ${rightIcon || isPassword || errorMessage || isSuccess ? 'pr-10' : 'pr-4'} ${borderStyles} ${className}`}
            {...props}
          />

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          )}

          {!isPassword && errorMessage && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-rose-400">
              <AlertCircle className="h-4 w-4" />
            </div>
          )}

          {!isPassword && !errorMessage && isSuccess && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          )}

          {!isPassword && !errorMessage && !isSuccess && rightIcon && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 flex items-center">
              {rightIcon}
            </div>
          )}
        </div>

        {errorMessage ? (
          <p className="text-[11px] font-medium text-rose-400 flex items-center gap-1">
            <span>{errorMessage}</span>
          </p>
        ) : helperText ? (
          <p className="text-[11px] text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
