/**
 * Fleet Intelligence Smart AI - Delivery Management Header & Filters
 */

import React from 'react';
import { DeliveryFilterState, DeliveryPriority, DeliveryStatus } from '../deliveryTypes';
import {
  Search,
  Filter,
  Plus,
  Users,
  ShoppingCart,
  Download,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface DeliveryHeaderProps {
  filter: DeliveryFilterState;
  onFilterChange: (newFilter: DeliveryFilterState) => void;
  onOpenCreateOrder: () => void;
  onOpenCreateDelivery: () => void;
  onOpenCustomers: () => void;
  onOpenOrders: () => void;
  onExportReport: () => void;
  activeTab: 'deliveries' | 'orders' | 'customers' | 'pod' | 'tracking' | 'ai';
  onTabChange: (tab: 'deliveries' | 'orders' | 'customers' | 'pod' | 'tracking' | 'ai') => void;
}

export const DeliveryHeader: React.FC<DeliveryHeaderProps> = ({
  filter,
  onFilterChange,
  onOpenCreateOrder,
  onOpenCreateDelivery,
  onOpenCustomers,
  onOpenOrders,
  onExportReport,
  activeTab,
  onTabChange,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-6 shadow-xl">
      {/* Top Title & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Modul Manajemen Pengiriman (Delivery & POD)
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-full">
              Enterprise Fleet v2.6
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Pengelolaan Pesanan, Penjadwalan Delivery, Penugasan Armada, Bukti Digital (POD), Tracking Pelanggan & Analitik Prediktif AI.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onOpenCreateOrder}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition-all"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-indigo-400" />
            + Buat Order Baru
          </button>

          <button
            onClick={onOpenCreateDelivery}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            + Jadwalkan Delivery
          </button>

          <button
            onClick={onOpenCustomers}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition-all"
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            Pelanggan
          </button>

          <button
            onClick={onExportReport}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl transition-all"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            Ekspor
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 mt-4 pt-1 overflow-x-auto no-scrollbar border-b border-slate-800 pb-3">
        <button
          onClick={() => onTabChange('deliveries')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'deliveries'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50'
          }`}
        >
          Daftar Pengiriman (Deliveries)
        </button>

        <button
          onClick={onOpenOrders}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'orders'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50'
          }`}
        >
          Master Pesanan (Orders)
        </button>

        <button
          onClick={onOpenCustomers}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'customers'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50'
          }`}
        >
          Data Pelanggan (Customers)
        </button>

        <button
          onClick={() => onTabChange('pod')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'pod'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50'
          }`}
        >
          Bukti Penyerahan (POD Gallery)
        </button>

        <button
          onClick={() => onTabChange('tracking')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'tracking'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50'
          }`}
        >
          Live Tracking Pelanggan
        </button>

        <button
          onClick={() => onTabChange('ai')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'ai'
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-600/30'
              : 'bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          AI Smart Analytics
        </button>
      </div>

      {/* Filter Bar */}
      {activeTab === 'deliveries' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-4">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari No Delivery, Order, Driver, Plat..."
              value={filter.searchQuery}
              onChange={(e) => onFilterChange({ ...filter, searchQuery: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 outline-none transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filter.status}
              onChange={(e) => onFilterChange({ ...filter, status: e.target.value as DeliveryStatus | 'ALL' })}
              className="w-full bg-transparent text-xs text-slate-200 outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">Semua Status Delivery</option>
              <option value="PENDING" className="bg-slate-900">Pending</option>
              <option value="ASSIGNED" className="bg-slate-900">Assigned</option>
              <option value="OUT_FOR_DELIVERY" className="bg-slate-900">Out For Delivery</option>
              <option value="ARRIVED" className="bg-slate-900">Arrived</option>
              <option value="DELIVERED" className="bg-slate-900">Delivered</option>
              <option value="FAILED" className="bg-slate-900">Failed / Gagal</option>
              <option value="RESCHEDULED" className="bg-slate-900">Rescheduled</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
            <select
              value={filter.priority}
              onChange={(e) => onFilterChange({ ...filter, priority: e.target.value as DeliveryPriority | 'ALL' })}
              className="w-full bg-transparent text-xs text-slate-200 outline-none cursor-pointer"
            >
              <option value="ALL" className="bg-slate-900">Semua Prioritas</option>
              <option value="LOW" className="bg-slate-900">Low</option>
              <option value="NORMAL" className="bg-slate-900">Normal</option>
              <option value="HIGH" className="bg-slate-900">High</option>
              <option value="URGENT" className="bg-slate-900">Urgent</option>
              <option value="CRITICAL" className="bg-slate-900">Critical</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="date"
              value={filter.date === 'ALL' ? '' : filter.date}
              onChange={(e) => onFilterChange({ ...filter, date: e.target.value || 'ALL' })}
              className="w-full bg-transparent text-xs text-slate-200 outline-none cursor-pointer"
            />
          </div>

          {/* Reset Filters */}
          <button
            onClick={() =>
              onFilterChange({
                searchQuery: '',
                status: 'ALL',
                priority: 'ALL',
                date: 'ALL',
                customerId: 'ALL',
                driverId: 'ALL',
                vehicleId: 'ALL',
              })
            }
            className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800/50 hover:bg-slate-800 rounded-xl transition-all text-center"
          >
            Reset Filter
          </button>
        </div>
      )}
    </div>
  );
};
