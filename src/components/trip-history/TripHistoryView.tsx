/**
 * Fleet Intelligence Smart AI - Trip History Main View Orchestrator
 * PROMPT 14 — Full Trip History, Interactive Playback & Route Inspection View
 */

import React, { useState, useEffect } from 'react';
import { useFleet } from '../../context/FleetContext';
import { TripFilterState, DetailedTrip, TripRoute, TripEvent } from '../../modules/trips/types';
import { tripHistoryService } from '../../modules/trips/services/tripHistoryService';
import { tripPlaybackEngine, PlaybackFrameState } from '../../modules/trips/services/tripPlaybackEngine';
import { TripHistoryHeader } from './TripHistoryHeader';
import { TripHistoryList } from './TripHistoryList';
import { TripDetailMap } from './TripDetailMap';
import { TripPlaybackBar } from './TripPlaybackBar';
import { TripSummaryCard } from './TripSummaryCard';
import { TripTimeline } from './TripTimeline';
import { TripAiModal } from './TripAiModal';
import { ArrowLeft, Route, Play, List, MapPin } from 'lucide-react';

export const TripHistoryView: React.FC = () => {
  const { vehicles, drivers, branches } = useFleet();

  // Filter State
  const [filter, setFilter] = useState<TripFilterState>({
    searchQuery: '',
    datePreset: 'TODAY',
    startDate: '',
    endDate: '',
    vehicleId: 'ALL',
    driverId: 'ALL',
    branchId: 'ALL',
    groupName: '',
    status: 'ALL',
  });

  const [trips, setTrips] = useState<DetailedTrip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<DetailedTrip | null>(null);
  const [route, setRoute] = useState<TripRoute | null>(null);
  const [viewMode, setViewMode] = useState<'LIST' | 'DETAIL'>('LIST');

  // Playback state
  const [playbackFrame, setPlaybackFrame] = useState<PlaybackFrameState>(tripPlaybackEngine.getState());
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  // AI Drawer Modal State
  const [isAiModalOpen, setIsAiModalOpen] = useState<boolean>(false);

  // Load Trips on Filter Change
  useEffect(() => {
    const data = tripHistoryService.getTrips(filter);
    setTrips(data);
    if (!selectedTrip && data.length > 0) {
      setSelectedTrip(data[0]);
    }
  }, [filter]);

  // Load Route when selected trip changes
  useEffect(() => {
    if (selectedTrip) {
      const r = tripHistoryService.getTripRoute(selectedTrip.id);
      setRoute(r);
      tripPlaybackEngine.loadRoute(r.points, r.events);
    }
  }, [selectedTrip?.id]);

  // Subscribe to Playback Engine
  useEffect(() => {
    const unsubscribe = tripPlaybackEngine.subscribe((state) => {
      setPlaybackFrame(state);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const handleFilterChange = (newFilter: Partial<TripFilterState>) => {
    setFilter((prev) => ({ ...prev, ...newFilter }));
  };

  const handleExport = (format: 'CSV' | 'EXCEL' | 'PDF') => {
    tripHistoryService.exportTrips(trips, format);
  };

  const handleSelectTrip = (t: DetailedTrip) => {
    setSelectedTrip(t);
  };

  const handlePlayTrip = (t: DetailedTrip) => {
    setSelectedTrip(t);
    setViewMode('DETAIL');
    setTimeout(() => {
      tripPlaybackEngine.play();
    }, 200);
  };

  const handleOpenAiSummary = (t: DetailedTrip) => {
    setSelectedTrip(t);
    setIsAiModalOpen(true);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-y-auto">
      {/* Top Header & Filters */}
      <TripHistoryHeader
        filter={filter}
        onFilterChange={handleFilterChange}
        onExport={handleExport}
        vehicles={vehicles}
        drivers={drivers}
        branches={branches}
        totalTripsCount={trips.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto space-y-6">
        {/* View Toggle Bar (List vs Detail Map) */}
        <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-gray-200 shadow-2xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode('LIST')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'LIST'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <List className="w-4 h-4" />
              <span>Daftar Perjalanan</span>
            </button>
            <button
              onClick={() => setViewMode('DETAIL')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'DETAIL'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Route className="w-4 h-4" />
              <span>Peta & Route Playback</span>
            </button>
          </div>

          {selectedTrip && (
            <div className="text-xs text-gray-500 font-medium hidden sm:block">
              Terpilih: <span className="font-bold text-gray-900">{selectedTrip.tripNumber}</span> ({selectedTrip.vehiclePlate})
            </div>
          )}
        </div>

        {/* View Content */}
        {viewMode === 'LIST' ? (
          <TripHistoryList
            trips={trips}
            selectedTripId={selectedTrip?.id || null}
            onSelectTrip={handleSelectTrip}
            onPlayTrip={handlePlayTrip}
            onOpenAiSummary={handleOpenAiSummary}
          />
        ) : selectedTrip && route ? (
          <div className="space-y-6">
            {/* Summary Metrics Card */}
            <TripSummaryCard
              trip={selectedTrip}
              onOpenAiSummary={() => setIsAiModalOpen(true)}
            />

            {/* Map & Playback Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Map & Playback Bar Column */}
              <div className="lg:col-span-2 space-y-4">
                <TripDetailMap
                  trip={selectedTrip}
                  route={route}
                  playbackState={playbackFrame}
                  selectedEventId={selectedEventId}
                  onSelectEvent={(ev) => setSelectedEventId(ev.id)}
                />

                <TripPlaybackBar
                  state={playbackFrame}
                  onPlay={() => tripPlaybackEngine.play()}
                  onPause={() => tripPlaybackEngine.pause()}
                  onStop={() => tripPlaybackEngine.stop()}
                  onSeekPercent={(pct) => tripPlaybackEngine.seekToPercent(pct)}
                  onSetSpeed={(spd) => tripPlaybackEngine.setSpeedMultiplier(spd)}
                  onStepForward={() => tripPlaybackEngine.stepForward()}
                  onStepBackward={() => tripPlaybackEngine.stepBackward()}
                />
              </div>

              {/* Timeline Column */}
              <div className="lg:col-span-1">
                <TripTimeline
                  trip={selectedTrip}
                  route={route}
                  onSelectEvent={(ev) => setSelectedEventId(ev.id)}
                  onJumpToPercent={(pct) => tripPlaybackEngine.seekToPercent(pct)}
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl text-center border border-gray-200">
            <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Silakan pilih perjalanan dari daftar terlebih dahulu.</p>
          </div>
        )}
      </div>

      {/* AI Drawer Modal */}
      <TripAiModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        trip={selectedTrip}
        route={route}
      />
    </div>
  );
};
