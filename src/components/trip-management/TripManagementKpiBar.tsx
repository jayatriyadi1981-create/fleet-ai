/**
 * Fleet Intelligence Smart AI - Trip Management KPI Metrics Bar
 * PROMPT 15 — Summary KPI Counters for Operational Trip Management
 */

import React from 'react';
import { PlannedTrip } from '../../modules/trips/plannedTripTypes';
import { Navigation, Clock, CheckCircle2, AlertTriangle, XCircle, UserX, Calendar } from 'lucide-react';

interface TripManagementKpiBarProps {
  trips: PlannedTrip[];
  onSelectStatusFilter?: (status: string) => void;
}

export const TripManagementKpiBar: React.FC<TripManagementKpiBarProps> = ({
  trips,
  onSelectStatusFilter,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  const todaysTrips = trips.filter((t) => t.scheduledDate === todayStr).length;
  const activeTrips = trips.filter((t) => ['IN_TRANSIT', 'DISPATCHED', 'READY'].includes(t.status)).length;
  const plannedTrips = trips.filter((t) => ['PLANNED', 'ASSIGNED', 'DRAFT'].includes(t.status)).length;
  const completedTrips = trips.filter((t) => t.status === 'COMPLETED').length;
  const delayedTrips = trips.filter((t) => {
    if (t.status === 'DELAYED') return true;
    if (t.status === 'IN_TRANSIT' && t.currentEta && t.plannedEta) {
      return new Date(t.currentEta).getTime() - new Date(t.plannedEta).getTime() > 10 * 60 * 1000;
    }
    return false;
  }).length;
  const cancelledTrips = trips.filter((t) => t.status === 'CANCELLED' || t.status === 'FAILED').length;
  const unassignedTrips = trips.filter((t) => !t.vehicleId || !t.driverId).length;

  const kpis = [
    {
      id: 'todays',
      title: "Today's Trips",
      count: todaysTrips,
      icon: <Calendar className="w-4 h-4 text-blue-600" />,
      color: 'border-blue-200 bg-blue-50/50 text-blue-900',
      filterVal: 'ALL',
    },
    {
      id: 'active',
      title: 'Active Trips',
      count: activeTrips,
      icon: <Navigation className="w-4 h-4 text-emerald-600" />,
      color: 'border-emerald-200 bg-emerald-50/50 text-emerald-900',
      filterVal: 'IN_TRANSIT',
    },
    {
      id: 'planned',
      title: 'Planned',
      count: plannedTrips,
      icon: <Clock className="w-4 h-4 text-indigo-600" />,
      color: 'border-indigo-200 bg-indigo-50/50 text-indigo-900',
      filterVal: 'PLANNED',
    },
    {
      id: 'completed',
      title: 'Completed',
      count: completedTrips,
      icon: <CheckCircle2 className="w-4 h-4 text-teal-600" />,
      color: 'border-teal-200 bg-teal-50/50 text-teal-900',
      filterVal: 'COMPLETED',
    },
    {
      id: 'delayed',
      title: 'Delayed',
      count: delayedTrips,
      icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
      color: 'border-amber-200 bg-amber-50/50 text-amber-900',
      filterVal: 'DELAYED',
    },
    {
      id: 'cancelled',
      title: 'Cancelled',
      count: cancelledTrips,
      icon: <XCircle className="w-4 h-4 text-rose-600" />,
      color: 'border-rose-200 bg-rose-50/50 text-rose-900',
      filterVal: 'CANCELLED',
    },
    {
      id: 'unassigned',
      title: 'Unassigned',
      count: unassignedTrips,
      icon: <UserX className="w-4 h-4 text-purple-600" />,
      color: 'border-purple-200 bg-purple-50/50 text-purple-900',
      filterVal: 'DRAFT',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
      {kpis.map((kpi) => (
        <div
          key={kpi.id}
          onClick={() => onSelectStatusFilter && onSelectStatusFilter(kpi.filterVal)}
          className={`p-3 rounded-xl border ${kpi.color} shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between`}
        >
          <div className="flex items-center justify-between text-xs font-semibold text-gray-600">
            <span>{kpi.title}</span>
            {kpi.icon}
          </div>
          <div className="mt-2 text-2xl font-extrabold tracking-tight">{kpi.count}</div>
        </div>
      ))}
    </div>
  );
};
