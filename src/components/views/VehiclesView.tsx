/**
 * Fleet Intelligence Smart AI - Vehicles Master Orchestrator Component
 * PROMPT 9 - Vehicle Management System Architecture
 * Connects List, Profile Detail, Create/Edit Form, Groups, Branches & Departments
 */

import React, { useState, useEffect } from 'react';
import { useFleet } from '../../context/FleetContext';
import { VehicleListView } from '../fleet/VehicleListView';
import { VehicleProfileDetail } from '../fleet/VehicleProfileDetail';
import { VehicleForm } from '../fleet/VehicleForm';
import { VehicleGroupsView } from '../fleet/VehicleGroupsView';
import { BranchesView } from '../fleet/BranchesView';
import { DepartmentsView } from '../fleet/DepartmentsView';

type VehicleSubView = 'list' | 'detail' | 'form' | 'groups' | 'branches' | 'departments';

export const VehiclesView: React.FC = () => {
  const { activeView } = useFleet();

  const [subView, setSubView] = useState<VehicleSubView>('list');
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);

  // Sync subView with global activeView if user navigated via sidebar (e.g. vehicle_groups, branches, departments)
  useEffect(() => {
    if (activeView === 'vehicle_groups') {
      setSubView('groups');
    } else if (activeView === 'branches') {
      setSubView('branches');
    } else if (activeView === 'departments') {
      setSubView('departments');
    } else if (activeView === 'vehicles' && (subView === 'groups' || subView === 'branches' || subView === 'departments')) {
      setSubView('list');
    }
  }, [activeView]);

  const handleSelectVehicle = (id: string) => {
    setSelectedVehicleId(id);
    setSubView('detail');
  };

  const handleCreateVehicle = () => {
    setSelectedVehicleId(null);
    setSubView('form');
  };

  const handleEditVehicle = (id: string) => {
    setSelectedVehicleId(id);
    setSubView('form');
  };

  const handleBackToList = () => {
    setSelectedVehicleId(null);
    setSubView('list');
  };

  return (
    <div className="space-y-4">
      {/* Sub-View Router */}
      {subView === 'list' && (
        <VehicleListView
          onSelectVehicle={handleSelectVehicle}
          onCreateVehicle={handleCreateVehicle}
          onEditVehicle={handleEditVehicle}
        />
      )}

      {subView === 'detail' && selectedVehicleId && (
        <VehicleProfileDetail
          vehicleId={selectedVehicleId}
          onBack={handleBackToList}
          onEdit={handleEditVehicle}
        />
      )}

      {subView === 'form' && (
        <VehicleForm
          vehicleId={selectedVehicleId || undefined}
          onBack={handleBackToList}
          onSuccess={() => setSubView('list')}
        />
      )}

      {subView === 'groups' && <VehicleGroupsView />}

      {subView === 'branches' && <BranchesView />}

      {subView === 'departments' && <DepartmentsView />}
    </div>
  );
};
