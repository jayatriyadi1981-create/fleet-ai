/**
 * Fleet Intelligence Smart AI - Trip Timeline Component
 * PROMPT 14 — Chronological Event Stream with Interactive Map/Playback Jump
 */

import React from 'react';
import { TripRoute, DetailedTrip, TripEvent } from '../../modules/trips/types';
import { Play, MapPin, Clock, AlertTriangle, ShieldAlert, Zap, PauseCircle } from 'lucide-react';

interface TripTimelineProps {
  trip: DetailedTrip;
  route: TripRoute;
  onSelectEvent: (event: TripEvent) => void;
  onJumpToPercent: (percent: number) => void;
}

export const TripTimeline: React.FC<TripTimelineProps> = ({
  trip,
  route,
  onSelectEvent,
  onJumpToPercent,
}) => {
  // Combine Start, Events, Stops, Idles, and End into chronological timeline
  const timelineItems: Array<{
    id: string;
    timestamp: string;
    type: 'START' | 'END' | 'STOP' | 'IDLE' | 'EVENT';
    title: string;
    subtitle: string;
    badgeColor: string;
    icon: React.ReactNode;
    percent: number;
    rawEvent?: TripEvent;
  }> = [];

  // 1. Trip Start
  timelineItems.push({
    id: 'tl-start',
    timestamp: trip.startTime,
    type: 'START',
    title: 'Perjalanan Dimulai (Titik A)',
    subtitle: trip.startAddress,
    badgeColor: 'bg-emerald-500 text-white',
    icon: <MapPin className="w-3.5 h-3.5" />,
    percent: 0,
  });

  // 2. Events
  route.events.forEach((ev, idx) => {
    const isSpeeding = ev.type === 'speeding';
    timelineItems.push({
      id: `tl-ev-${ev.id}`,
      timestamp: ev.timestamp,
      type: 'EVENT',
      title: ev.message,
      subtitle: `${ev.speed} km/h - ${ev.details || ''}`,
      badgeColor: isSpeeding ? 'bg-rose-600 text-white' : 'bg-purple-600 text-white',
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      percent: Math.min(95, (idx + 1) * 30),
      rawEvent: ev,
    });
  });

  // 3. Stops
  route.stops.forEach((stop, idx) => {
    timelineItems.push({
      id: `tl-stop-${stop.id}`,
      timestamp: stop.stopStart,
      type: 'STOP',
      title: `Pemberhentian S${idx + 1}`,
      subtitle: `Durasi: ${Math.round(stop.durationSeconds / 60)} menit`,
      badgeColor: 'bg-amber-500 text-white',
      icon: <PauseCircle className="w-3.5 h-3.5" />,
      percent: 50,
    });
  });

  // 4. Trip End (if completed)
  if (trip.endTime) {
    timelineItems.push({
      id: 'tl-end',
      timestamp: trip.endTime,
      type: 'END',
      title: 'Perjalanan Selesai (Titik B)',
      subtitle: trip.endAddress,
      badgeColor: 'bg-rose-600 text-white',
      icon: <MapPin className="w-3.5 h-3.5" />,
      percent: 100,
    });
  }

  // Sort chronologically
  timelineItems.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-2xs">
      <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3">
        Timeline Kejadian Perjalanan
      </h3>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
        {timelineItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (item.rawEvent) onSelectEvent(item.rawEvent);
              onJumpToPercent(item.percent);
            }}
            className="relative cursor-pointer group"
          >
            {/* Dot */}
            <div
              className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ${item.badgeColor} shadow-2xs group-hover:scale-110 transition-transform`}
            >
              {item.icon}
            </div>

            {/* Content */}
            <div className="bg-gray-50 group-hover:bg-blue-50/60 p-2.5 rounded-lg border border-gray-200 group-hover:border-blue-200 transition-colors">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-900">
                <span>{item.title}</span>
                <span className="text-[11px] font-mono text-gray-500 font-normal">
                  {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
