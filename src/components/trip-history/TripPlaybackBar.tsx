/**
 * Fleet Intelligence Smart AI - Route Playback Control Bar
 * PROMPT 14 — Playback Controls, Scrubbing Timeline & Speed Multipliers
 */

import React from 'react';
import { Play, Pause, Square, RotateCcw, FastForward, Rewind, Gauge, Fuel, Zap, Clock } from 'lucide-react';
import { PlaybackFrameState } from '../../modules/trips/services/tripPlaybackEngine';

interface TripPlaybackBarProps {
  state: PlaybackFrameState;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  onSeekPercent: (percent: number) => void;
  onSetSpeed: (speed: number) => void;
  onStepForward: () => void;
  onStepBackward: () => void;
}

export const TripPlaybackBar: React.FC<TripPlaybackBarProps> = ({
  state,
  onPlay,
  onPause,
  onStop,
  onSeekPercent,
  onSetSpeed,
  onStepForward,
  onStepBackward,
}) => {
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const pt = state.currentPoint;

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3">
      {/* Top Scrubber & Progress Slider */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-gray-600 font-medium">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {pt ? new Date(pt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--'}
            </span>
          </div>
          <div className="font-mono text-gray-500">
            {formatTime(state.elapsedSeconds)} / {formatTime(state.totalDurationSeconds)} ({state.progressPercent}%)
          </div>
        </div>

        {/* Timeline Slider */}
        <input
          type="range"
          min="0"
          max="100"
          step="0.1"
          value={state.progressPercent}
          onChange={(e) => onSeekPercent(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600 focus:outline-hidden"
        />
      </div>

      {/* Main Control Panel */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          {state.status === 'PLAYING' ? (
            <button
              onClick={onPause}
              className="p-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors shadow-2xs"
              title="Pause Playback"
            >
              <Pause className="w-4 h-4 fill-white" />
            </button>
          ) : (
            <button
              onClick={onPlay}
              className="p-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-2xs"
              title="Start Playback"
            >
              <Play className="w-4 h-4 fill-white ml-0.5" />
            </button>
          )}

          <button
            onClick={onStop}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            title="Stop & Reset"
          >
            <Square className="w-4 h-4 fill-gray-600" />
          </button>

          <button
            onClick={onStepBackward}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            title="Step Backward"
          >
            <Rewind className="w-4 h-4" />
          </button>

          <button
            onClick={onStepForward}
            className="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            title="Step Forward"
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>

        {/* Telemetry Live Values */}
        {pt && (
          <div className="flex items-center gap-4 text-xs font-medium text-gray-700 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
            <div className="flex items-center gap-1">
              <Gauge className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-semibold text-gray-900">{pt.speed} km/h</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className={`w-3.5 h-3.5 ${pt.ignition ? 'text-emerald-500' : 'text-gray-400'}`} />
              <span>{pt.ignition ? 'Kontak ON' : 'Kontak OFF'}</span>
            </div>
            {pt.fuelLevel !== undefined && (
              <div className="flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-amber-500" />
                <span>BBM: {pt.fuelLevel}%</span>
              </div>
            )}
          </div>
        )}

        {/* Speed Multipliers */}
        <div className="flex items-center bg-gray-100 p-0.5 rounded-lg border border-gray-200">
          {[0.5, 1, 2, 4, 8, 16].map((speed) => (
            <button
              key={speed}
              onClick={() => onSetSpeed(speed)}
              className={`px-2 py-0.5 text-xs rounded font-medium transition-all ${
                state.speedMultiplier === speed
                  ? 'bg-blue-600 text-white font-bold shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {speed}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
