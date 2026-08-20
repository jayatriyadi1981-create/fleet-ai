import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronRight, MoreVertical, Search, ArrowUpDown } from 'lucide-react';
import { Button } from '../ui/Button';
import { TableSkeleton } from '../ui/Skeleton';
import { EmptyState, ErrorState } from '../ui/EmptyState';
import { MobileBottomSheet } from './MobileBottomSheet';

export type TableResponsiveStrategy = 'cards' | 'expandable' | 'scroll';

export interface ResponsiveColumn<T> {
  key: string;
  header: React.ReactNode;
  accessor?: (item: T) => any;
  render?: (item: T, index: number) => React.ReactNode;
  sortable?: boolean;
  priority?: 'high' | 'medium' | 'low'; // High is always visible, low is hidden in mobile collapsed view
  align?: 'left' | 'center' | 'right';
  className?: string;
}

export interface TableRowAction<T> {
  label: string;
  icon?: React.ReactNode;
  onClick: (item: T) => void;
  variant?: 'default' | 'danger' | 'primary';
}

export interface ResponsiveDataTableProps<T> {
  data: T[];
  columns: ResponsiveColumn<T>[];
  keyExtractor: (item: T) => string | number;
  strategy?: TableResponsiveStrategy;
  title?: string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
  onRetry?: () => void;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (item: T) => void;
  actions?: TableRowAction<T>[];
  renderCardCustom?: (item: T, index: number) => React.ReactNode;
  className?: string;
}

export function ResponsiveDataTable<T>({
  data,
  columns,
  keyExtractor,
  strategy = 'cards',
  title,
  isLoading = false,
  isError = false,
  errorMessage,
  onRetry,
  emptyTitle = 'Tidak Ada Data',
  emptyDescription = 'Belum ada catatan data untuk ditampilkan.',
  onRowClick,
  actions,
  renderCardCustom,
  className = '',
}: ResponsiveDataTableProps<T>) {
  const [expandedKeys, setExpandedKeys] = useState<Record<string | number, boolean>>({});
  const [selectedActionItem, setSelectedActionItem] = useState<T | null>(null);

  const toggleExpand = (key: string | number, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedKeys((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (isLoading) {
    return (
      <div className={`p-4 sm:p-6 rounded-2xl border border-slate-800 bg-slate-900/80 ${className}`}>
        <TableSkeleton rows={4} cols={columns.length} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={`p-4 sm:p-6 rounded-2xl border border-slate-800 bg-slate-900/80 ${className}`}>
        <ErrorState message={errorMessage} onRetry={onRetry} />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={`p-4 sm:p-6 rounded-2xl border border-slate-800 bg-slate-900/80 ${className}`}>
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    );
  }

  const highPriorityCols = columns.filter((c) => c.priority !== 'low');
  const lowPriorityCols = columns.filter((c) => c.priority === 'low');

  return (
    <div className={`w-full overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/80 shadow-xl backdrop-blur-md ${className}`}>
      {/* Optional Table Header Title */}
      {title && (
        <div className="border-b border-slate-800 px-4 py-3 sm:px-6">
          <h3 className="text-sm font-bold text-white tracking-tight">{title}</h3>
        </div>
      )}

      {/* MOBILE VIEW (Screen < md) */}
      <div className="block md:hidden">
        {strategy === 'cards' && (
          <div className="p-3 space-y-3">
            {data.map((item, idx) => {
              const key = keyExtractor(item);
              if (renderCardCustom) {
                return (
                  <div key={key} onClick={() => onRowClick && onRowClick(item)}>
                    {renderCardCustom(item, idx)}
                  </div>
                );
              }

              const primaryCol = columns[0];
              const secondaryCols = columns.slice(1);

              return (
                <div
                  key={key}
                  onClick={() => onRowClick && onRowClick(item)}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-3 hover:border-cyan-500/40 transition-all cursor-pointer relative"
                >
                  {/* Card Primary Header */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-800/80 pb-2.5">
                    <div className="min-w-0 font-bold text-sm text-white">
                      {primaryCol.render
                        ? primaryCol.render(item, idx)
                        : primaryCol.accessor
                        ? primaryCol.accessor(item)
                        : (item as any)[primaryCol.key]}
                    </div>
                    {actions && actions.length > 0 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedActionItem(item);
                        }}
                        aria-label="Menu Aksi"
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 text-slate-400 hover:text-white"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Key Metrics Grid */}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {secondaryCols.map((col) => (
                      <div key={col.key} className="space-y-0.5 min-w-0">
                        <span className="text-[10px] uppercase font-semibold text-slate-500 block truncate">
                          {col.header}
                        </span>
                        <div className="font-semibold text-slate-200 truncate">
                          {col.render
                            ? col.render(item, idx)
                            : col.accessor
                            ? col.accessor(item)
                            : (item as any)[col.key]}
                        </div>
                      </div>
                    ))}
                  </div>

                  {onRowClick && (
                    <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-cyan-400 font-semibold">
                      <span>Detail Lengkap</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {strategy === 'expandable' && (
          <div className="divide-y divide-slate-800">
            {data.map((item, idx) => {
              const key = keyExtractor(item);
              const isExpanded = !!expandedKeys[key];

              return (
                <div key={key} className="p-3.5 space-y-2 bg-slate-950/40">
                  <div
                    onClick={() => onRowClick && onRowClick(item)}
                    className="flex items-center justify-between gap-3 cursor-pointer"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs text-white truncate">
                        {columns[0].render
                          ? columns[0].render(item, idx)
                          : columns[0].accessor
                          ? columns[0].accessor(item)
                          : (item as any)[columns[0].key]}
                      </div>
                      {columns[1] && (
                        <div className="text-[11px] text-slate-400 truncate mt-0.5">
                          {columns[1].render
                            ? columns[1].render(item, idx)
                            : columns[1].accessor
                            ? columns[1].accessor(item)
                            : (item as any)[columns[1].key]}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {actions && actions.length > 0 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedActionItem(item);
                          }}
                          aria-label="Aksi"
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={(e) => toggleExpand(key, e)}
                        aria-label={isExpanded ? 'Tutup detail' : 'Buka detail'}
                        className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                      >
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Collapsible details */}
                  {isExpanded && (
                    <div className="pt-2 mt-2 border-t border-slate-800 space-y-2 text-xs bg-slate-900/60 p-3 rounded-xl">
                      {columns.slice(2).map((col) => (
                        <div key={col.key} className="flex items-center justify-between">
                          <span className="text-slate-400 font-medium">{col.header}:</span>
                          <span className="font-semibold text-slate-200 text-right">
                            {col.render
                              ? col.render(item, idx)
                              : col.accessor
                              ? col.accessor(item)
                              : (item as any)[col.key]}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {strategy === 'scroll' && (
          <div className="overflow-x-auto relative scrollbar-thin">
            <div className="px-3 py-1.5 bg-slate-950 text-[10px] text-cyan-400/80 font-mono flex items-center justify-between border-b border-slate-800">
              <span>← Geser horizontal untuk melihat kolom lengkap →</span>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/90 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  {columns.map((col, cIdx) => (
                    <th
                      key={col.key}
                      className={`px-4 py-3 whitespace-nowrap ${
                        cIdx === 0 ? 'sticky left-0 bg-slate-950 z-10' : ''
                      }`}
                    >
                      {col.header}
                    </th>
                  ))}
                  {actions && actions.length > 0 && <th className="px-4 py-3 text-right">Aksi</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data.map((item, idx) => (
                  <tr
                    key={keyExtractor(item)}
                    onClick={() => onRowClick && onRowClick(item)}
                    className="hover:bg-slate-800/40 transition-colors"
                  >
                    {columns.map((col, cIdx) => (
                      <td
                        key={col.key}
                        className={`px-4 py-3 whitespace-nowrap ${
                          cIdx === 0 ? 'sticky left-0 bg-slate-900/95 font-semibold text-white z-10' : 'text-slate-300'
                        }`}
                      >
                        {col.render
                          ? col.render(item, idx)
                          : col.accessor
                          ? col.accessor(item)
                          : (item as any)[col.key]}
                      </td>
                    ))}
                    {actions && actions.length > 0 && (
                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedActionItem(item);
                          }}
                          className="p-1 rounded-lg text-slate-400 hover:text-white"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DESKTOP VIEW (Screen >= md) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
            <tr>
              {columns.map((col) => (
                <th key={col.key} className="px-5 py-3.5">
                  {col.header}
                </th>
              ))}
              {actions && actions.length > 0 && <th className="px-5 py-3.5 text-right">Aksi</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/80">
            {data.map((item, idx) => (
              <tr
                key={keyExtractor(item)}
                onClick={() => onRowClick && onRowClick(item)}
                className={`transition-colors ${
                  onRowClick ? 'cursor-pointer hover:bg-slate-800/50' : ''
                }`}
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-5 py-3.5 text-slate-300 font-medium">
                    {col.render
                      ? col.render(item, idx)
                      : col.accessor
                      ? col.accessor(item)
                      : (item as any)[col.key]}
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {actions.map((act, aIdx) => (
                        <button
                          key={aIdx}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            act.onClick(item);
                          }}
                          className="px-2 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition flex items-center gap-1"
                        >
                          {act.icon}
                          <span>{act.label}</span>
                        </button>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Action Bottom Sheet */}
      {selectedActionItem && actions && (
        <MobileBottomSheet
          isOpen={true}
          onClose={() => setSelectedActionItem(null)}
          title="Pilih Tindakan Operasional"
        >
          <div className="space-y-2">
            {actions.map((act, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  act.onClick(selectedActionItem);
                  setSelectedActionItem(null);
                }}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-sm font-semibold transition-all min-h-[48px] ${
                  act.variant === 'danger'
                    ? 'border-rose-500/30 bg-rose-950/20 text-rose-300 hover:bg-rose-900/30'
                    : act.variant === 'primary'
                    ? 'border-cyan-500/30 bg-cyan-950/20 text-cyan-300 hover:bg-cyan-900/30'
                    : 'border-slate-800 bg-slate-950 text-slate-200 hover:bg-slate-800'
                }`}
              >
                {act.icon}
                <span>{act.label}</span>
              </button>
            ))}
          </div>
        </MobileBottomSheet>
      )}
    </div>
  );
}
