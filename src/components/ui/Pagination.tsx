import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  totalRecords?: number;
  pageSizeOptions?: number[];
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  pageSize = 20,
  onPageSizeChange,
  totalRecords,
  pageSizeOptions = [10, 20, 50, 100],
}) => {
  const handlePrev = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const startRecord = (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords || 0);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800 pt-4 text-xs text-slate-400">
      <div className="flex items-center gap-3">
        {totalRecords !== undefined && (
          <span>
            Menampilkan <strong className="text-white">{startRecord}-{endRecord}</strong> dari{' '}
            <strong className="text-white">{totalRecords}</strong> data
          </span>
        )}

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2">
            <span>Per Halaman:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-lg border border-slate-800 bg-slate-900 px-2 py-1 text-xs text-white outline-none focus:border-cyan-500"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt} className="bg-slate-900">
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="xs"
          onClick={handlePrev}
          disabled={currentPage <= 1}
          leftIcon={<ChevronLeft className="h-3.5 w-3.5" />}
        >
          Sebelumnya
        </Button>

        <span className="px-2 font-semibold text-slate-300">
          {currentPage} / {totalPages || 1}
        </span>

        <Button
          variant="outline"
          size="xs"
          onClick={handleNext}
          disabled={currentPage >= totalPages}
          rightIcon={<ChevronRight className="h-3.5 w-3.5" />}
        >
          Berikutnya
        </Button>
      </div>
    </div>
  );
};
