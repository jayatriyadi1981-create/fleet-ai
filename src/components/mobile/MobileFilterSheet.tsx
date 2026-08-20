import React from 'react';
import { MobileBottomSheet } from './MobileBottomSheet';
import { Button } from '../ui/Button';
import { RotateCcw, Check, X } from 'lucide-react';

export interface FilterChip {
  id: string;
  label: string;
  value: string;
}

export interface MobileFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  activeChips?: FilterChip[];
  onRemoveChip?: (chipId: string) => void;
  onReset: () => void;
  onApply: () => void;
  children: React.ReactNode;
}

export const MobileFilterSheet: React.FC<MobileFilterSheetProps> = ({
  isOpen,
  onClose,
  title = 'Filter & Parameter',
  activeChips = [],
  onRemoveChip,
  onReset,
  onApply,
  children,
}) => {
  return (
    <MobileBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      height="75vh"
      footer={
        <div className="flex w-full items-center justify-between gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={onReset}
            leftIcon={<RotateCcw className="h-4 w-4 text-slate-400" />}
            className="flex-1 min-h-[44px]"
          >
            Reset Filter
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={() => {
              onApply();
              onClose();
            }}
            leftIcon={<Check className="h-4 w-4 text-slate-950" />}
            className="flex-1 min-h-[44px]"
          >
            Terapkan
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Active Filter Chips */}
        {activeChips.length > 0 && (
          <div className="space-y-1.5 pb-2 border-b border-slate-800">
            <span className="text-[11px] font-semibold text-slate-400">Filter Aktif:</span>
            <div className="flex flex-wrap gap-1.5">
              {activeChips.map((chip) => (
                <span
                  key={chip.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-medium"
                >
                  <span>{chip.label}: <strong>{chip.value}</strong></span>
                  {onRemoveChip && (
                    <button
                      type="button"
                      onClick={() => onRemoveChip(chip.id)}
                      className="text-cyan-400 hover:text-white p-0.5 rounded"
                      aria-label={`Hapus filter ${chip.label}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Filter Controls Body */}
        <div className="space-y-4">{children}</div>
      </div>
    </MobileBottomSheet>
  );
};
