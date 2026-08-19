/**
 * Fleet Intelligence Smart AI - Driver Management Main View Orchestrator
 * Master Navigation Tabs: All Drivers, Vehicle Assignments, Shifts, SIM & Licenses, Performance, History
 */

import React, { useState } from 'react';
import {
  Users,
  Truck,
  Clock,
  ShieldCheck,
  Award,
  Calendar,
  Plus,
} from 'lucide-react';
import { DriverExtended } from '../../types/driver';
import { DriverListView } from './DriverListView';
import { DriverProfileDetail } from './DriverProfileDetail';
import { DriverFormModal } from './DriverFormModal';
import { DriverAssignmentsView } from './DriverAssignmentsView';
import { DriverShiftsView } from './DriverShiftsView';
import { DriverLicensesView } from './DriverLicensesView';
import { DriverPerformanceView } from './DriverPerformanceView';
import { DriverHistoryView } from './DriverHistoryView';

export const DriversMainView: React.FC = () => {
  const [activeSubView, setActiveSubView] = useState<
    'list' | 'assignments' | 'shifts' | 'licenses' | 'performance' | 'history'
  >('list');

  const [selectedDriverId, setSelectedDriverId] = useState<string | null>(null);

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [driverToEdit, setDriverToEdit] = useState<DriverExtended | null>(null);

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignTargetDriver, setAssignTargetDriver] = useState<DriverExtended | null>(null);

  const handleSelectDriver = (driverId: string) => {
    setSelectedDriverId(driverId);
  };

  const handleOpenAssignModal = (driver: DriverExtended) => {
    setAssignTargetDriver(driver);
    setIsAssignModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* If a specific driver profile detail is selected */}
      {selectedDriverId ? (
        <DriverProfileDetail
          driverId={selectedDriverId}
          onBack={() => setSelectedDriverId(null)}
          onOpenAssignModal={(driver) => handleOpenAssignModal(driver)}
        />
      ) : (
        <>
          {/* Sub-Navigation Header Bar */}
          <div className="bg-white dark:bg-slate-900 rounded-xl p-2 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1 overflow-x-auto text-xs font-medium">
              {[
                { id: 'list', label: 'Semua Pengemudi (Master)', icon: Users },
                { id: 'assignments', label: 'Alokasi Kendaraan', icon: Truck },
                { id: 'shifts', label: 'Jadwal Shift', icon: Clock },
                { id: 'licenses', label: 'SIM & Lisensi', icon: ShieldCheck },
                { id: 'performance', label: 'Performa Safety Score', icon: Award },
                { id: 'history', label: 'Histori Activity Log', icon: Calendar },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSubView === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSubView(tab.id as any)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-indigo-600 text-white font-bold shadow-xs'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => {
                setDriverToEdit(null);
                setIsFormModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>+ Pendaftaran Driver</span>
            </button>
          </div>

          {/* Sub-View Content */}
          {activeSubView === 'list' && (
            <DriverListView
              onSelectDriver={handleSelectDriver}
              onOpenCreateModal={() => {
                setDriverToEdit(null);
                setIsFormModalOpen(true);
              }}
              onOpenAssignModal={handleOpenAssignModal}
            />
          )}

          {activeSubView === 'assignments' && (
            <DriverAssignmentsView onSelectDriver={handleSelectDriver} />
          )}

          {activeSubView === 'shifts' && (
            <DriverShiftsView onSelectDriver={handleSelectDriver} />
          )}

          {activeSubView === 'licenses' && (
            <DriverLicensesView onSelectDriver={handleSelectDriver} />
          )}

          {activeSubView === 'performance' && (
            <DriverPerformanceView onSelectDriver={handleSelectDriver} />
          )}

          {activeSubView === 'history' && (
            <DriverHistoryView onSelectDriver={handleSelectDriver} />
          )}
        </>
      )}

      {/* Driver Creation/Edit Modal */}
      <DriverFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        driverToEdit={driverToEdit}
        onSuccess={(driver) => {
          setSelectedDriverId(driver.driverId);
        }}
      />
    </div>
  );
};
