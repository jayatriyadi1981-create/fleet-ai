/**
 * Fleet Intelligence Smart AI - OpenAPI 3.0.3 Specification Definition
 * PROMPT 44: Complete Schema, Parameters, Endpoints, Scopes & Examples for External API
 */

export const FLEET_OPENAPI_SPEC = {
  openapi: '3.0.3',
  info: {
    title: 'Fleet Intelligence Smart AI - External Gateway API',
    version: '1.0.0',
    description: `Enterprise REST API platform for seamless bidirectional integration between Fleet Intelligence Smart AI and external enterprise systems (SAP ERP, Oracle NetSuite, Odoo, WMS, TMS, HRIS, IoT Gateways, BI Data Warehouses, and Mobile Apps).
    
### Core Capabilities:
* **Multi-Tenant Isolation**: Enforced via API Key and Tenant Context Resolver.
* **Unified Data Model**: Vendor-agnostic telematics format derived from PROMPT 43.
* **Granular Scopes**: Principle of least privilege with explicit read/write & PII boundaries.
* **Predictive AI Engine**: Probabilistic telematics insights with tool-restricted execution.
* **Real-time Webhooks**: HMAC SHA-256 signed event streams with automatic retry backoff.`,
    contact: {
      name: 'Developer Platform Team',
      email: 'api-support@fleetintelligence.ai',
      url: 'https://fleetintelligence.ai/developer',
    },
    license: {
      name: 'Commercial Enterprise SaaS',
      url: 'https://fleetintelligence.ai/terms',
    },
  },
  servers: [
    {
      url: '/api/v1',
      description: 'Production & Sandbox Gateway v1',
    },
  ],
  components: {
    securitySchemes: {
      ApiKeyAuth: {
        type: 'apiKey',
        in: 'header',
        name: 'X-API-Key',
        description: 'Primary API Key authentication (e.g. `flt_live_...` or `flt_test_...`)',
      },
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'API-Key or OAuth 2.0 Token',
        description: 'Bearer authentication header',
      },
    },
    schemas: {
      StandardMeta: {
        type: 'object',
        properties: {
          requestId: { type: 'string', example: 'req_k92b1a8c' },
          timestamp: { type: 'string', format: 'date-time', example: '2026-08-18T10:30:00.000Z' },
          version: { type: 'string', example: '1.0.0' },
          environment: { type: 'string', enum: ['SANDBOX', 'PRODUCTION'], example: 'PRODUCTION' },
        },
      },
      StandardPaginationMeta: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 50 },
          total: { type: 'integer', example: 120 },
          totalPages: { type: 'integer', example: 3 },
          requestId: { type: 'string', example: 'req_k92b1a8c' },
          timestamp: { type: 'string', format: 'date-time' },
          version: { type: 'string', example: '1.0.0' },
          environment: { type: 'string', example: 'PRODUCTION' },
        },
      },
      StandardError: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'VEHICLE_NOT_FOUND' },
              message: { type: 'string', example: 'Vehicle not found in active tenant fleet' },
              details: { type: 'object' },
            },
          },
          meta: { $ref: '#/components/schemas/StandardMeta' },
        },
      },
      Vehicle: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'veh_01' },
          name: { type: 'string', example: 'Hino Ranger 500 Box' },
          plateNumber: { type: 'string', example: 'B 9211 TJP' },
          vehicleType: { type: 'string', example: 'truck_box' },
          brand: { type: 'string', example: 'Hino' },
          model: { type: 'string', example: 'FG 235 JJ' },
          year: { type: 'integer', example: 2023 },
          status: { type: 'string', enum: ['moving', 'idle', 'parking', 'offline', 'maintenance'], example: 'moving' },
          companyId: { type: 'string', example: 'tnt_logistics_utama' },
          branchId: { type: 'string', example: 'br_cikarang' },
          driverId: { type: 'string', example: 'drv_01' },
          deviceId: { type: 'string', example: 'dev_01' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      VehicleLocation: {
        type: 'object',
        properties: {
          vehicleId: { type: 'string', example: 'veh_01' },
          plateNumber: { type: 'string', example: 'B 9211 TJP' },
          latitude: { type: 'number', example: -6.2941 },
          longitude: { type: 'number', example: 106.8821 },
          speed: { type: 'number', example: 64.5 },
          heading: { type: 'number', example: 112 },
          ignition: { type: 'boolean', example: true },
          timestamp: { type: 'string', format: 'date-time' },
          accuracy: { type: 'number', example: 98.5 },
          address: { type: 'string', example: 'Tol Jakarta-Cikampek KM 28.5, Cikarang' },
        },
      },
      VehicleTelemetry: {
        type: 'object',
        properties: {
          vehicleId: { type: 'string', example: 'veh_01' },
          speed: { type: 'number', example: 64.5 },
          fuelLevelPercent: { type: 'number', example: 78.4 },
          fuelLevelLiters: { type: 'number', example: 156.8 },
          temperatureCelsius: { type: 'number', example: 86.2 },
          batteryVoltage: { type: 'number', example: 24.2 },
          odometerKm: { type: 'number', example: 109450 },
          engineHours: { type: 'number', example: 3420.5 },
          ignition: { type: 'boolean', example: true },
          engineRpm: { type: 'number', example: 1650 },
        },
      },
      Driver: {
        type: 'object',
        properties: {
          id: { type: 'string', example: 'drv_01' },
          name: { type: 'string', example: 'Sutrisno Hartono' },
          employeeId: { type: 'string', example: 'DRV-9082' },
          phone: { type: 'string', example: '+62 812-****-8819 (Masked without drivers:pii scope)' },
          status: { type: 'string', enum: ['active', 'on_duty', 'off_duty', 'suspended'], example: 'on_duty' },
          license: { type: 'string', example: 'SIM B2 Umum' },
          vehicleAssignment: { type: 'string', example: 'veh_01' },
          safetyScore: { type: 'number', example: 94 },
        },
      },
    },
  },
  security: [
    { ApiKeyAuth: [] },
    { BearerAuth: [] },
  ],
  paths: {
    '/health': {
      get: {
        summary: 'Public Health Check',
        description: 'Returns gateway availability status without exposing internal infrastructure details.',
        responses: {
          '200': {
            description: 'Gateway is healthy',
            content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', example: 'healthy' } } } } },
          },
        },
      },
    },
    '/vehicles': {
      get: {
        summary: 'List Vehicles',
        description: 'Retrieve filtered, sorted, and paginated list of fleet vehicles.',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['moving', 'idle', 'parking', 'offline', 'maintenance'] } },
          { name: 'branch', in: 'query', schema: { type: 'string' } },
          { name: 'sort', in: 'query', schema: { type: 'string', enum: ['createdAt', 'updatedAt', 'name', 'status', 'plateNumber'] } },
          { name: 'order', in: 'query', schema: { type: 'string', enum: ['asc', 'desc'], default: 'asc' } },
        ],
        responses: {
          '200': {
            description: 'Vehicle list with pagination metadata',
          },
        },
      },
      post: {
        summary: 'Create Vehicle',
        description: 'Register a new vehicle into the fleet master catalog. Requires `vehicles:write` scope and supports `Idempotency-Key`.',
        parameters: [
          { name: 'Idempotency-Key', in: 'header', required: false, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['plateNumber', 'name', 'vehicleType'],
                properties: {
                  name: { type: 'string', example: 'Isuzu Giga Wingbox' },
                  plateNumber: { type: 'string', example: 'B 9876 XYZ' },
                  vehicleType: { type: 'string', example: 'truck_box' },
                  brand: { type: 'string', example: 'Isuzu' },
                  model: { type: 'string', example: 'FVZ 34 P' },
                  year: { type: 'integer', example: 2024 },
                  branchId: { type: 'string', example: 'br_cikarang' },
                },
              },
            },
          },
        },
        responses: {
          '201': { description: 'Vehicle created successfully' },
          '400': { description: 'Validation error or duplicate plate number' },
        },
      },
    },
    '/vehicles/{id}/location': {
      get: {
        summary: 'Get Vehicle Real-time Location',
        description: 'Fetches high-precision GPS position derived from Unified Telematics Layer. Requires `gps:read` scope.',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Live coordinates and motion status' },
          '404': { description: 'Vehicle not found' },
        },
      },
    },
    '/vehicles/{id}/telemetry': {
      get: {
        summary: 'Get Vehicle Telemetry',
        description: 'Returns instantaneous CAN-bus & sensor metrics (fuel liters, temp, battery, odometer). Requires `gps:read` scope.',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Comprehensive telemetry snapshot' },
        },
      },
    },
    '/drivers': {
      get: {
        summary: 'List Drivers',
        description: 'Retrieves driver records. Sensitive PII fields (phone, KTP, SIM) are masked unless the `drivers:pii` scope is granted.',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
        ],
        responses: {
          '200': { description: 'Driver list' },
        },
      },
    },
    '/gps/devices/{id}/commands': {
      post: {
        summary: 'Send Remote GPS Command',
        description: 'Dispatches high-risk remote instructions (LOCK_ENGINE, SET_INTERVAL, RESTART). Requires `gps:write` scope and confirmation payload.',
        parameters: [
          { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'Idempotency-Key', in: 'header', required: false, schema: { type: 'string' } },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['commandType'],
                properties: {
                  commandType: { type: 'string', enum: ['REQUEST_LOCATION', 'REQUEST_STATUS', 'SET_INTERVAL', 'LOCK_ENGINE', 'UNLOCK_ENGINE'] },
                  params: { type: 'object' },
                  confirmedHighRisk: { type: 'boolean', description: 'Mandatory true for engine cutoff commands' },
                },
              },
            },
          },
        },
        responses: {
          '200': { description: 'Command queued and dispatched to device adapter' },
        },
      },
    },
    '/trips': {
      get: {
        summary: 'List Trips',
        description: 'Query dispatch trips with origin, destination, distance, duration, and ETA.',
        parameters: [
          { name: 'vehicleId', in: 'query', schema: { type: 'string' } },
          { name: 'driverId', in: 'query', schema: { type: 'string' } },
          { name: 'status', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Trips list' } },
      },
    },
    '/geofences': {
      get: {
        summary: 'List Geofences',
        description: 'Retrieve polygon and circle geofences with boundary coordinates.',
        responses: { '200': { description: 'Geofence boundaries' } },
      },
    },
    '/alerts': {
      get: {
        summary: 'List Alerts & Incidents',
        description: 'Query telematics alerts (Overspeed, SOS, Geofence, Fuel Anomaly, Idle Excess).',
        parameters: [
          { name: 'severity', in: 'query', schema: { type: 'string', enum: ['critical', 'warning', 'info'] } },
          { name: 'type', in: 'query', schema: { type: 'string' } },
        ],
        responses: { '200': { description: 'Alert incidents' } },
      },
    },
    '/reports': {
      post: {
        summary: 'Create Async Report Job',
        description: 'Enqueues background calculation for large telematics datasets. Returns a `jobId` to poll for completion.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['reportType', 'format'],
                properties: {
                  reportType: { type: 'string', enum: ['gps', 'vehicle', 'driver', 'trip', 'fuel', 'maintenance', 'safety', 'cost', 'fleet'] },
                  format: { type: 'string', enum: ['PDF', 'CSV', 'XLSX'] },
                  dateFrom: { type: 'string', format: 'date' },
                  dateTo: { type: 'string', format: 'date' },
                },
              },
            },
          },
        },
        responses: {
          '202': { description: 'Report job accepted' },
        },
      },
    },
    '/ai/fleet/analyze': {
      post: {
        summary: 'AI Fleet Health & Anomaly Analysis',
        description: 'Executes server-side Gemini 2.5 Flash / Smart Rule AI on fleet telemetry to detect idling waste and operational anomalies.',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  dateFrom: { type: 'string' },
                  dateTo: { type: 'string' },
                  vehicleIds: { type: 'array', items: { type: 'string' } },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'Probabilistic AI analysis and actionable recommendations' } },
      },
    },
    '/ai/fuel/analyze': {
      post: {
        summary: 'AI Fuel Efficiency & Drain Detection',
        description: 'Analyzes fuel sensor curves with probabilistic phrasing for suspected fuel drain vs steep gradients.',
        responses: { '200': { description: 'Fuel efficiency scoring and suspected anomalies' } },
      },
    },
    '/ai/assistant': {
      post: {
        summary: 'AI Fleet Assistant Natural Query',
        description: 'Interactive natural language interface with bounded context and tool-based permission filters.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['message'],
                properties: {
                  message: { type: 'string', example: 'Berapa kendaraan yang sedang bergerak dan ada alert kritis?' },
                },
              },
            },
          },
        },
        responses: { '200': { description: 'AI conversational response with telemetry data grounding' } },
      },
    },
    '/webhooks': {
      get: {
        summary: 'List Registered Webhook Endpoints',
        description: 'Retrieve subscribed webhooks and health status. Requires `webhooks:read` scope.',
        responses: { '200': { description: 'Subscribed webhooks' } },
      },
      post: {
        summary: 'Register Webhook Endpoint',
        description: 'Creates a webhook subscription with automatic secret key generation. Requires `webhooks:write` scope.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'url', 'events'],
                properties: {
                  name: { type: 'string', example: 'TMS Integration Dispatcher' },
                  url: { type: 'string', example: 'https://tms.example.com/webhooks/fleet' },
                  events: {
                    type: 'array',
                    items: {
                      type: 'string',
                      enum: [
                        'vehicle.created',
                        'vehicle.updated',
                        'driver.created',
                        'driver.updated',
                        'gps.location',
                        'gps.device.online',
                        'gps.device.offline',
                        'trip.created',
                        'trip.started',
                        'trip.completed',
                        'geofence.enter',
                        'geofence.exit',
                        'alert.created',
                        'alert.resolved',
                        'maintenance.due',
                        'fuel.anomaly',
                      ],
                    },
                  },
                },
              },
            },
          },
        },
        responses: { '201': { description: 'Webhook registered' } },
      },
    },
  },
};
