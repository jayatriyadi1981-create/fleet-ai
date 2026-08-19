import React from 'react';
import { ChevronDown, AlertCircle } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectOptionGroup {
  label: string;
  options: SelectOption[];
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options?: SelectOption[];
  groups?: SelectOptionGroup[];
  helperText?: string;
  errorMessage?: string;
  fullWidth?: boolean;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      options = [],
      groups = [],
      helperText,
      errorMessage,
      fullWidth = true,
      disabled,
      className = '',
      id,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = id || `select-${Math.random().toString(36).substring(2, 9)}`;
    const widthStyle = fullWidth ? 'w-full' : '';

    const borderStyles = errorMessage
      ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20'
      : 'border-slate-800 focus:border-cyan-500 focus:ring-cyan-500/20';

    return (
      <div className={`${widthStyle} space-y-1.5`}>
        {label && (
          <label htmlFor={generatedId} className="block text-xs font-semibold text-slate-300">
            {label}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={generatedId}
            disabled={disabled}
            className={`w-full appearance-none rounded-xl bg-slate-900/90 pl-4 pr-10 py-2.5 text-xs text-white border transition-all outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed ${borderStyles} ${className}`}
            {...props}
          >
            {children ? (
              children
            ) : groups.length > 0 ? (
              groups.map((group, gIdx) => (
                <optgroup key={gIdx} label={group.label} className="bg-slate-900 text-slate-300">
                  {group.options.map((opt) => (
                    <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-slate-900 text-white">
                      {opt.label}
                    </option>
                  ))}
                </optgroup>
              ))
            ) : (
              options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled} className="bg-slate-900 text-white">
                  {opt.label}
                </option>
              ))
            )}
          </select>

          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none flex items-center">
            {errorMessage ? <AlertCircle className="h-4 w-4 text-rose-400" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>

        {errorMessage ? (
          <p className="text-[11px] font-medium text-rose-400">{errorMessage}</p>
        ) : helperText ? (
          <p className="text-[11px] text-slate-400">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Select.displayName = 'Select';
