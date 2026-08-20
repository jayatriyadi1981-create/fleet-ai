import React from 'react';
import { Button } from '../ui/Button';

export interface MobileActionBarProps {
  primaryLabel: string;
  onPrimaryClick: () => void;
  primaryLoading?: boolean;
  primaryDisabled?: boolean;
  secondaryLabel?: string;
  onSecondaryClick?: () => void;
  secondaryDisabled?: boolean;
  leftElement?: React.ReactNode;
  className?: string;
}

export const MobileActionBar: React.FC<MobileActionBarProps> = ({
  primaryLabel,
  onPrimaryClick,
  primaryLoading = false,
  primaryDisabled = false,
  secondaryLabel,
  onSecondaryClick,
  secondaryDisabled = false,
  leftElement,
  className = '',
}) => {
  return (
    <div
      role="toolbar"
      aria-label="Aksi Tindakan Mobile"
      className={`fixed bottom-0 left-0 right-0 z-40 border-t border-slate-800/90 bg-slate-950/95 px-4 py-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur-lg flex items-center justify-between gap-3 shadow-2xl md:hidden ${className}`}
    >
      {leftElement && <div className="min-w-0 flex-1">{leftElement}</div>}

      <div className="flex items-center gap-2.5 ml-auto w-full sm:w-auto justify-end">
        {secondaryLabel && onSecondaryClick && (
          <Button
            type="button"
            variant="outline"
            size="md"
            disabled={secondaryDisabled || primaryLoading}
            onClick={onSecondaryClick}
            className="flex-1 sm:flex-none min-h-[44px]"
          >
            {secondaryLabel}
          </Button>
        )}

        <Button
          type="button"
          variant="primary"
          size="md"
          isLoading={primaryLoading}
          disabled={primaryDisabled}
          onClick={onPrimaryClick}
          className="flex-1 sm:flex-none min-h-[44px]"
        >
          {primaryLabel}
        </Button>
      </div>
    </div>
  );
};
