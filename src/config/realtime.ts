/**
 * Fleet Intelligence Smart AI - Realtime & WebSocket Configuration
 * PROMPT 59: Stream Topology, Reconnect Exponential Backoff & Connection Throttling
 */

export interface RealtimeConfig {
  enabled: boolean;
  transport: 'websocket' | 'supabase_realtime' | 'sse';
  heartbeatIntervalMs: number;
  reconnectPolicy: {
    initialDelayMs: number;
    maxDelayMs: number;
    backoffMultiplier: number;
    maxRetries: number;
  };
  throttle: {
    vehicleMapUpdateThrottleMs: number;
    alertBroadcastThrottleMs: number;
  };
}

export const realtimeConfig: RealtimeConfig = {
  enabled: true,
  transport: 'supabase_realtime',
  heartbeatIntervalMs: 25000,
  reconnectPolicy: {
    initialDelayMs: 1000,
    maxDelayMs: 30000,
    backoffMultiplier: 1.5,
    maxRetries: 10,
  },
  throttle: {
    vehicleMapUpdateThrottleMs: 1000,
    alertBroadcastThrottleMs: 500,
  },
};
