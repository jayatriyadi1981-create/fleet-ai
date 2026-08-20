/**
 * Fleet Intelligence Smart AI - GPS Hardware & Ingestion Configuration
 * PROMPT 59: Telematics Protocols, TCP/MQTT Ingestion, Buffer Window & Stream Health
 */

export interface GpsIngestionConfig {
  tcpServer: {
    enabled: boolean;
    host: string;
    port: number;
    maxConnections: number;
  };
  mqttBroker: {
    enabled: boolean;
    url: string;
    topicPrefix: string;
    qos: 0 | 1 | 2;
  };
  supportedProtocols: ('TELTONIKA' | 'CONCOX' | 'JT808' | 'QUECLINK' | 'MEITRACK' | 'JSON')[];
  buffer: {
    batchSize: number;
    flushIntervalMs: number;
    maxQueueLength: number;
  };
  filters: {
    minSatellites: number;
    maxSpeedKmH: number;
    minMovementMeters: number;
    maxTimeGapSeconds: number;
  };
}

export const gpsConfig: GpsIngestionConfig = {
  tcpServer: {
    enabled: true,
    host: '0.0.0.0',
    port: 5027,
    maxConnections: 10000,
  },
  mqttBroker: {
    enabled: true,
    url: 'mqtts://broker.fleetintelligence.id:8883',
    topicPrefix: 'fleet/telemetry/',
    qos: 1,
  },
  supportedProtocols: ['TELTONIKA', 'CONCOX', 'JT808', 'QUECLINK', 'MEITRACK', 'JSON'],
  buffer: {
    batchSize: 500,
    flushIntervalMs: 1000,
    maxQueueLength: 50000,
  },
  filters: {
    minSatellites: 4,
    maxSpeedKmH: 220,
    minMovementMeters: 5,
    maxTimeGapSeconds: 300,
  },
};
