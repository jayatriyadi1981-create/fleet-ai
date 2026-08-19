# Fleet Intelligence Smart AI

**Fleet Intelligence Smart AI** adalah platform Fleet Management & Telematics cerdas berbasis React + TypeScript + Express yang dirancang untuk industri logistik dan transportasi Indonesia.

## Key Features

- **Executive Operations Control Dashboard**: Real-time KPI monitoring, active alerts, fuel stats, driver safety scores, and predictive maintenance.
- **Interactive Telematics Map**: Real-time vehicle location tracking, geofence zones, velocity indicators, and telemetry overlays.
- **AI Telematics Decision Support**: Powered by Gemini AI via Express server backend to provide instant route optimization, fuel anomaly detection, and maintenance scheduling.
- **Driver Behavior Scorecard**: Speeding incidents, harsh braking, SIM expiration reminders, and safety rankings.
- **Fuel Telemetry & Anomaly Detection**: Biosolar B35 consumption tracking and theft/spill alerts.
- **Predictive Maintenance & Work Orders**: Automated servicing schedules, workshop tracking, and KIR Dishub inspection expiry logs.
- **Multi-Tenant SaaS & RBAC Architecture**: Branch management, role permissions, and tenant isolation.

## Technical Architecture

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Motion.
- **Backend API**: Express Server with bundled esbuild compilation.
- **State Management**: React Context (`FleetContext`), type-safe hooks.
- **Services**: Abstracted API Client, Mock GPS Simulator, AI Decision Support service.

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build production bundle
npm run build

# Start production server
npm run start
```
