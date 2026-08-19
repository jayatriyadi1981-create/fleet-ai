import React from 'react';
import { Filter, RotateCcw, Calendar, Building2, Truck } from 'lucide-react';
import { SearchInput } from './SearchInput';
import { Select } from './Select';
import { Button } from './Button';

export interface FilterBarProps {
  searchQuery?: string;
  onSearchChange?: (val: string) => void;
  branch?: string;
  onBranchChange?: (branch: string) => void;
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
  status?: string;
  onStatusChange?: (status: string) => void;
  onReset?: () => void;
  branchOptions?: { value: string; label: string }[];
  statusOptions?: { value: string; label: string }[];
  customFilters?: React.ReactNode;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  branch,
  onBranchChange,
  dateRange,
  onDateRangeChange,
  status,
  onStatusChange,
  onReset,
  branchOptions = [
    { value: 'ALL', label: 'Semua Cabang (All Branches)' },
    { value: 'JKT-HO', label: 'Jakarta HO (Head Office)' },
    { value: 'SBY-BRANCH', label: 'Surabaya Branch' },
    { value: 'BDG-BRANCH', label: 'Bandung Branch' },
    { value: 'MED-BRANCH', label: 'Medan Branch' },
  ],
  statusOptions = [
    { value: 'ALL', label: 'Semua Status' },
    { value: 'moving', label: 'Bergerak (Moving)' },
    { value: 'idle', label: 'Mesin Idling' },
    { value: 'parking', label: 'Parkir' },
    { value: 'offline', label: 'Offline' },
  ],
  customFilters,
  className = '',
}) => {
  const dateRangeOptions = [
    { value: 'TODAY', label: 'Hari Ini (Asia/Jakarta)' },
    { value: 'YESTERDAY', label: 'Kemarin' },
    { value: 'LAST_7_DAYS', label: '7 Hari Terakhir' },
    { value: 'LAST_30_DAYS', label: '30 Hari Terakhir' },
    { value: 'THIS_MONTH', label: 'Bulan Ini' },
  ];

  return (
    <div
      className={`flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-900/80 p-3 backdrop-blur-md ${className}`}
    >
      <div className="flex-1 flex flex-col sm:flex-row items-center gap-3">
        {onSearchChange !== undefined && (
          <div className="w-full sm:w-72">
            <SearchInput value={searchQuery} onChange={onSearchChange} />
          </div>
        )}

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
          {onBranchChange && (
            <div className="w-full sm:w-44">
              <Select
                value={branch}
                onChange={(e) => onBranchChange(e.target.value)}
                options={branchOptions}
                fullWidth
              />
            </div>
          )}

          {onDateRangeChange && (
            <div className="w-full sm:w-44">
              <Select
                value={dateRange}
                onChange={(e) => onDateRangeChange(e.target.value)}
                options={dateRangeOptions}
                fullWidth
              />
            </div>
          )}

          {onStatusChange && (
            <div className="w-full sm:w-40">
              <Select
                value={status}
                onChange={(e) => onStatusChange(e.target.value)}
                options={statusOptions}
                fullWidth
              />
            </div>
          )}

          {customFilters}
        </div>
      </div>

      {onReset && (
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          leftIcon={<RotateCcw className="h-3.5 w-3.5 text-slate-400" />}
          className="shrink-0"
        >
          Reset Filter
        </Button>
      )}
    </div>
  );
};
