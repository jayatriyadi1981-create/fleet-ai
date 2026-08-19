import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';
import { Pagination } from './Pagination';
import { TableSkeleton } from './Skeleton';
import { EmptyState, ErrorState } from './EmptyState';

export interface Column<T> {
  key: string;
  header: React.ReactNode;
  accessor?: (item: T) => any;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  width?: string;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  pageSize?: number;
  enableSelection?: boolean;
  selectedKeys?: (string | number)[];
  onSelectionChange?: (keys: (string | number)[]) => void;
  onRowClick?: (item: T) => void;
  renderMobileCard?: (item: T) => React.ReactNode;
  className?: string;
}

export function DataTable<T>({
  data,
  columns,
  keyExtractor,
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
  emptyTitle = 'Tidak Ada Data',
  emptyDescription = 'Belum ada data untuk ditampilkan dalam tabel ini.',
  pageSize = 10,
  enableSelection = false,
  selectedKeys = [],
  onSelectionChange,
  onRowClick,
  renderMobileCard,
  className = '',
}: DataTableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentPageSize, setCurrentPageSize] = useState(pageSize);
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Handle sort
  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else setSortKey(null);
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortKey) return data;
    const col = columns.find((c) => c.key === sortKey);
    if (!col) return data;

    return [...data].sort((a, b) => {
      const valA = col.accessor ? col.accessor(a) : (a as any)[sortKey];
      const valB = col.accessor ? col.accessor(b) : (b as any)[sortKey];

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, sortKey, sortDirection, columns]);

  // Handle pagination
  const totalPages = Math.ceil(sortedData.length / currentPageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * currentPageSize;
    return sortedData.slice(start, start + currentPageSize);
  }, [sortedData, currentPage, currentPageSize]);

  // Handle multi-selection
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelectionChange) return;
    if (e.target.checked) {
      const allKeys = paginatedData.map(keyExtractor);
      onSelectionChange([...new Set([...selectedKeys, ...allKeys])]);
    } else {
      const currentKeys = paginatedData.map(keyExtractor);
      onSelectionChange(selectedKeys.filter((k) => !currentKeys.includes(k)));
    }
  };

  const handleSelectRow = (key: string | number) => {
    if (!onSelectionChange) return;
    if (selectedKeys.includes(key)) {
      onSelectionChange(selectedKeys.filter((k) => k !== key));
    } else {
      onSelectionChange([...selectedKeys, key]);
    }
  };

  const isAllPaginatedSelected =
    paginatedData.length > 0 &&
    paginatedData.every((item) => selectedKeys.includes(keyExtractor(item)));

  if (isLoading) {
    return (
      <div className={`p-6 rounded-2xl border border-slate-800 bg-slate-900/80 ${className}`}>
        <TableSkeleton rows={pageSize} cols={columns.length} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`p-6 rounded-2xl border border-slate-800 bg-slate-900/80 ${className}`}>
        <ErrorState message={errorMessage} onRetry={onRetry} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`p-6 rounded-2xl border border-slate-800 bg-slate-900/80 ${className}`}>
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  return (
    <div
      className={`rounded-2xl border border-slate-800 bg-slate-900/80 overflow-hidden shadow-xl backdrop-blur-md ${className}`}
    >
      {/* Mobile Cards Stack View */}
      <div className="block md:hidden p-3 space-y-3 border-b border-slate-800/80">
        {paginatedData.map((item, idx) => {
          const key = keyExtractor(item);
          if (renderMobileCard) {
            return (
              <div key={key} onClick={() => onRowClick && onRowClick(item)}>
                {renderMobileCard(item)}
              </div>
            );
          }

          // Fallback Default Card renderer for mobile
          return (
            <div
              key={key}
              onClick={() => onRowClick && onRowClick(item)}
              className="rounded-xl border border-slate-800 bg-slate-950 p-3.5 space-y-2.5 hover:border-cyan-500/40 transition-all cursor-pointer"
            >
              {columns.slice(0, 4).map((col, cIdx) => (
                <div key={col.key} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-400">{col.header}:</span>
                  <span className="font-semibold text-slate-200 text-right">
                    {col.render
                      ? col.render(item, idx)
                      : col.accessor
                      ? col.accessor(item)
                      : (item as any)[col.key]}
                  </span>
                </div>
              ))}
              {onRowClick && (
                <div className="pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-cyan-400 font-semibold">
                  <span>Lihat Detail</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
            <tr>
              {enableSelection && (
                <th className="w-12 px-4 py-3.5 text-center">
                  <input
                    type="checkbox"
                    checked={isAllPaginatedSelected}
                    onChange={handleSelectAll}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                  />
                </th>
              )}

              {columns.map((col) => {
                const isSorted = sortKey === col.key;
                const alignClass =
                  col.align === 'center'
                    ? 'text-center'
                    : col.align === 'right'
                    ? 'text-right'
                    : 'text-left';

                return (
                  <th
                    key={col.key}
                    style={{ width: col.width }}
                    className={`px-4 py-3.5 ${alignClass} ${col.className || ''}`}
                  >
                    {col.sortable ? (
                      <button
                        onClick={() => handleSort(col.key)}
                        className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
                      >
                        <span>{col.header}</span>
                        {isSorted ? (
                          sortDirection === 'asc' ? (
                            <ArrowUp className="h-3.5 w-3.5 text-cyan-400" />
                          ) : (
                            <ArrowDown className="h-3.5 w-3.5 text-cyan-400" />
                          )
                        ) : (
                          <ArrowUpDown className="h-3.5 w-3.5 opacity-40 hover:opacity-100" />
                        )}
                      </button>
                    ) : (
                      <span>{col.header}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/60 text-slate-200">
            {paginatedData.map((item, idx) => {
              const key = keyExtractor(item);
              const isSelected = selectedKeys.includes(key);

              return (
                <tr
                  key={key}
                  onClick={() => onRowClick && onRowClick(item)}
                  className={`group transition-colors ${
                    isSelected ? 'bg-cyan-500/10' : 'hover:bg-slate-800/40'
                  } ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {enableSelection && (
                    <td
                      className="px-4 py-3.5 text-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleSelectRow(key)}
                        className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
                      />
                    </td>
                  )}

                  {columns.map((col) => {
                    const alignClass =
                      col.align === 'center'
                        ? 'text-center'
                        : col.align === 'right'
                        ? 'text-right'
                        : 'text-left';

                    return (
                      <td key={col.key} className={`px-4 py-3.5 ${alignClass} ${col.className || ''}`}>
                        {col.render
                          ? col.render(item, idx)
                          : col.accessor
                          ? col.accessor(item)
                          : (item as any)[col.key]}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Footer */}
      <div className="p-4 bg-slate-950/40 border-t border-slate-800">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={currentPageSize}
          onPageSizeChange={(sz) => {
            setCurrentPageSize(sz);
            setCurrentPage(1);
          }}
          totalRecords={sortedData.length}
        />
      </div>
    </div>
  );
}
