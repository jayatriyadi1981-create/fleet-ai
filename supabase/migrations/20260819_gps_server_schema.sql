-- ============================================================================
-- FLEET INTELLIGENCE SMART AI - ENTERPRISE GPS SERVER & TELEMATICS DATABASE
-- TARGET PLATFORM: SUPABASE (POSTGRESQL 15+ WITH POSTGIS EXTENSION)
-- ============================================================================

-- 1. Enable Required PostgreSQL & Spatio-Temporal Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 2. GPS TRACKER HARDWARE DEVICES MASTER (IMEI & Protocol Registry)
-- ============================================================================
CREATE TABLE IF NOT EXISTS gps_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id VARCHAR(50) NOT NULL DEFAULT 'tenant-1',
    imei VARCHAR(30) UNIQUE NOT NULL,
    device_model VARCHAR(50) NOT NULL DEFAULT 'Teltonika FMB920',
    protocol VARCHAR(30) NOT NULL DEFAULT 'TELTONIKA', -- 'TELTONIKA', 'JT808', 'CONCOX_GT06N', 'GENERIC_JSON', 'MQTT'
    sim_card_number VARCHAR(30),
    cellular_provider VARCHAR(50) DEFAULT 'Telkomsel IoT M2M',
    firmware_version VARCHAR(30) DEFAULT 'v1.4.2',
    auth_token VARCHAR(100),
    ip_address VARCHAR(45),
    is_active BOOLEAN DEFAULT true,
    last_heartbeat_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_gps_devices_imei ON gps_devices(imei);
CREATE INDEX IF NOT EXISTS idx_gps_devices_tenant ON gps_devices(tenant_id);

-- ============================================================================
-- 3. VEHICLES FLEET MASTER
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id VARCHAR(50) NOT NULL DEFAULT 'tenant-1',
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_code VARCHAR(30),
    brand VARCHAR(50) NOT NULL, -- e.g. Hino, Isuzu, Mitsubishi Fuso, Scania
    model VARCHAR(50) NOT NULL, -- e.g. Ranger 500 FL 260, Giga FVR
    vehicle_type VARCHAR(30) NOT NULL DEFAULT 'truck_box',
    fuel_type VARCHAR(30) NOT NULL DEFAULT 'biodiesel_b35',
    fuel_capacity_liters NUMERIC(6, 2) DEFAULT 200.0,
    gps_device_imei VARCHAR(30) REFERENCES gps_devices(imei) ON DELETE SET NULL,
    current_driver_id VARCHAR(50),
    operational_status VARCHAR(20) DEFAULT 'stopped', -- 'moving', 'idle', 'stopped', 'offline', 'emergency'
    
    -- Cached Latest Live Telemetry for Fast Dashboard Loading
    last_location GEOMETRY(Point, 4326),
    last_latitude NUMERIC(10, 7),
    last_longitude NUMERIC(10, 7),
    last_speed_kmh NUMERIC(5, 2) DEFAULT 0.0,
    last_heading NUMERIC(5, 2) DEFAULT 0.0,
    last_fuel_level_percent NUMERIC(5, 2) DEFAULT 100.0,
    last_battery_voltage NUMERIC(4, 2) DEFAULT 24.0,
    last_ignition BOOLEAN DEFAULT false,
    last_address TEXT,
    last_telemetry_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vehicles_plate ON vehicles(plate_number);
CREATE INDEX IF NOT EXISTS idx_vehicles_imei ON vehicles(gps_device_imei);
CREATE INDEX IF NOT EXISTS idx_vehicles_location ON vehicles USING GIST(last_location);

-- ============================================================================
-- 4. RAW & PARSED GPS TELEMETRY TIME-SERIES (High-Throughput Logs)
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicle_telemetry (
    id BIGSERIAL PRIMARY KEY,
    tenant_id VARCHAR(50) NOT NULL DEFAULT 'tenant-1',
    imei VARCHAR(30) NOT NULL,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    
    -- PostGIS Native Coordinate Point (Longitude, Latitude in WGS 84 SRID 4326)
    location GEOMETRY(Point, 4326) NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    altitude_meters NUMERIC(6, 1) DEFAULT 0.0,
    
    -- Dynamics & Sensors
    speed_kmh NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    heading NUMERIC(5, 2) NOT NULL DEFAULT 0.0,
    satellites_count SMALLINT DEFAULT 12,
    gps_accuracy_hdop NUMERIC(3, 1) DEFAULT 1.0,
    
    -- Electrical & Engine Status
    ignition BOOLEAN DEFAULT false,
    engine_rpm INT DEFAULT 0,
    engine_temp_celsius NUMERIC(4, 1) DEFAULT 85.0,
    fuel_level_percent NUMERIC(5, 2) DEFAULT 100.0,
    fuel_liters NUMERIC(6, 2) DEFAULT 200.0,
    battery_voltage NUMERIC(4, 2) DEFAULT 24.2,
    odometer_km NUMERIC(10, 2) DEFAULT 0.0,
    engine_hours NUMERIC(8, 2) DEFAULT 0.0,
    
    -- Protocol & Raw Diagnostic Payload
    protocol VARCHAR(30) DEFAULT 'HTTP_REST',
    raw_hex_payload TEXT,
    device_status_flags INT DEFAULT 0,
    reverse_geocoded_address TEXT,
    
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Fast Spatial & Time-Series B-Tree / GIST Indexes
CREATE INDEX IF NOT EXISTS idx_telemetry_location ON vehicle_telemetry USING GIST(location);
CREATE INDEX IF NOT EXISTS idx_telemetry_imei_time ON vehicle_telemetry(imei, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_telemetry_veh_time ON vehicle_telemetry(vehicle_id, recorded_at DESC);

-- ============================================================================
-- 5. GEOFENCES (Spatial Polygonal & Circular Logistics Zones)
-- ============================================================================
CREATE TABLE IF NOT EXISTS geofences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id VARCHAR(50) NOT NULL DEFAULT 'tenant-1',
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50),
    zone_category VARCHAR(30) DEFAULT 'depot', -- 'depot', 'customer_site', 'restricted_area', 'port', 'warehouse'
    geometry_type VARCHAR(20) DEFAULT 'POLYGON', -- 'POLYGON', 'CIRCLE'
    
    -- PostGIS Spatial Polygon
    polygon_geom GEOMETRY(Polygon, 4326),
    circle_center GEOMETRY(Point, 4326),
    circle_radius_meters NUMERIC(8, 2),
    
    speed_limit_kmh NUMERIC(5, 2) DEFAULT 40.0,
    alert_on_enter BOOLEAN DEFAULT true,
    alert_on_exit BOOLEAN DEFAULT true,
    alert_on_speeding BOOLEAN DEFAULT true,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_geofences_polygon ON geofences USING GIST(polygon_geom);
CREATE INDEX IF NOT EXISTS idx_geofences_circle ON geofences USING GIST(circle_center);

-- ============================================================================
-- 6. GPS & SECURITY ALERTS LOG (Automated Incident Engine)
-- ============================================================================
CREATE TABLE IF NOT EXISTS gps_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id VARCHAR(50) NOT NULL DEFAULT 'tenant-1',
    imei VARCHAR(30) NOT NULL,
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    alert_type VARCHAR(50) NOT NULL, -- 'OVERSPEED', 'GEOFENCE_EXIT', 'GEOFENCE_ENTER', 'SOS_PANIC', 'POWER_CUT', 'FUEL_DROP', 'HARSH_BRAKE', 'FATIGUE'
    severity VARCHAR(20) DEFAULT 'HIGH', -- 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
    title VARCHAR(150) NOT NULL,
    description TEXT,
    location GEOMETRY(Point, 4326),
    latitude NUMERIC(10, 7),
    longitude NUMERIC(10, 7),
    speed_kmh NUMERIC(5, 2),
    is_resolved BOOLEAN DEFAULT false,
    resolved_by VARCHAR(50),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_alerts_imei ON gps_alerts(imei, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON gps_alerts(is_resolved);

-- ============================================================================
-- 7. TRIPS & TRAVEL SEGMENTS WITH FULL ROUTE LINESTRINGS
-- ============================================================================
CREATE TABLE IF NOT EXISTS vehicle_trips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id VARCHAR(50) NOT NULL DEFAULT 'tenant-1',
    vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
    driver_id VARCHAR(50),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    start_location GEOMETRY(Point, 4326),
    end_location GEOMETRY(Point, 4326),
    start_address TEXT,
    end_address TEXT,
    
    total_distance_km NUMERIC(8, 2) DEFAULT 0.0,
    max_speed_kmh NUMERIC(5, 2) DEFAULT 0.0,
    avg_speed_kmh NUMERIC(5, 2) DEFAULT 0.0,
    fuel_consumed_liters NUMERIC(6, 2) DEFAULT 0.0,
    idle_duration_minutes INT DEFAULT 0,
    harsh_events_count INT DEFAULT 0,
    
    -- Complete Trip Route Path rendered with PostGIS LineString
    route_geom GEOMETRY(LineString, 4326),
    trip_status VARCHAR(20) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'cancelled'
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_trips_route ON vehicle_trips USING GIST(route_geom);
CREATE INDEX IF NOT EXISTS idx_trips_vehicle_time ON vehicle_trips(vehicle_id, start_time DESC);

-- ============================================================================
-- 8. AUTOMATIC DATABASE TRIGGERS & SPATIAL FUNCTIONS
-- ============================================================================

-- Function 8.1: Sync latest position to vehicles table on every telemetry insert
CREATE OR REPLACE FUNCTION fn_sync_vehicle_latest_telemetry()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE vehicles
    SET
        last_location = NEW.location,
        last_latitude = NEW.latitude,
        last_longitude = NEW.longitude,
        last_speed_kmh = NEW.speed_kmh,
        last_heading = NEW.heading,
        last_fuel_level_percent = NEW.fuel_level_percent,
        last_battery_voltage = NEW.battery_voltage,
        last_ignition = NEW.ignition,
        last_address = COALESCE(NEW.reverse_geocoded_address, last_address),
        last_telemetry_at = NEW.recorded_at,
        operational_status = CASE 
            WHEN NEW.speed_kmh > 3.0 THEN 'moving'
            WHEN NEW.ignition = true THEN 'idle'
            ELSE 'stopped'
        END,
        updated_at = now()
    WHERE id = NEW.vehicle_id OR gps_device_imei = NEW.imei;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_vehicle_telemetry ON vehicle_telemetry;
CREATE TRIGGER trg_sync_vehicle_telemetry
AFTER INSERT ON vehicle_telemetry
FOR EACH ROW
EXECUTE FUNCTION fn_sync_vehicle_latest_telemetry();

-- Function 8.2: Spatial Proximity Query (Find vehicles within X meters)
CREATE OR REPLACE FUNCTION fn_get_nearby_vehicles(
    query_lat NUMERIC,
    query_lng NUMERIC,
    radius_meters NUMERIC DEFAULT 5000
)
RETURNS TABLE (
    vehicle_id UUID,
    plate_number VARCHAR,
    brand VARCHAR,
    model VARCHAR,
    distance_meters NUMERIC,
    latitude NUMERIC,
    longitude NUMERIC,
    speed_kmh NUMERIC,
    status VARCHAR
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.id AS vehicle_id,
        v.plate_number,
        v.brand,
        v.model,
        ROUND(ST_DistanceSphere(v.last_location, ST_SetSRID(ST_MakePoint(query_lng, query_lat), 4326))::numeric, 2) AS distance_meters,
        v.last_latitude AS latitude,
        v.last_longitude AS longitude,
        v.last_speed_kmh AS speed_kmh,
        v.operational_status AS status
    FROM vehicles v
    WHERE v.last_location IS NOT NULL
      AND ST_DWithin(v.last_location::geography, ST_SetSRID(ST_MakePoint(query_lng, query_lat), 4326)::geography, radius_meters)
    ORDER BY distance_meters ASC;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 9. ENABLE SUPABASE REALTIME REPLICATION (Instant Live Tracking WebSockets)
-- ============================================================================
DO $$
BEGIN
    -- Enable replication for live tables
    ALTER PUBLICATION supabase_realtime ADD TABLE vehicle_telemetry;
    ALTER PUBLICATION supabase_realtime ADD TABLE vehicles;
    ALTER PUBLICATION supabase_realtime ADD TABLE gps_alerts;
EXCEPTION WHEN OTHERS THEN
    -- Table already in publication or publication not initialized
    NULL;
END;
$$;
