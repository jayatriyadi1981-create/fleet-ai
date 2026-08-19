# System Architecture Document — Fleet Intelligence Smart AI

## Overview

Platform Fleet Intelligence Smart AI menerapkan arsitektur terpisah (Separation of Concerns) antara UI Layer, Application State, Service Layer, dan Realtime GPS Gateway.

```text
UI (Views & Pages)
  ↓
Hooks & Context (FleetContext)
  ↓
Services Layer (ApiClient, GpsService, AiService)
  ↓
Backend Express API Server (/api/*)
  ↓
AI Engine (Gemini AI SDK) & Realtime Telematics Stream
```

## Directory Structure

```text
src/
├── app/                  # Application root & Router wrappers
├── components/           # UI Component hierarchy
│   ├── common/           # Error Boundary, Error Pages, Badges
│   ├── dashboard/        # Executive Dashboard components
│   ├── layout/           # App Shell, Sidebar, Navbar, Drawers, Layouts
│   ├── maps/             # Telematics Map canvas
│   ├── pages/            # LandingPage & LoginPage
│   └── views/            # Module Views (Vehicles, Drivers, Trips, Fuel, Maintenance, Safety, AI, Documents, Users, Integrations)
├── config/               # App configuration & Feature flags
├── constants/            # System constants & Mock seed data
├── context/              # Global React Context stores
├── services/             # API Client, GPS Simulator, AI Services
├── types/                # Strict TypeScript domain interfaces
└── utils/                # Logger, RBAC helpers
```

## State Architecture

- **UI State**: Modal toggles, selected vehicle, active view, search filters, AI drawer state.
- **Session State**: Authenticated user profile, current tenant, branch selection, permissions.
- **Server/Telematics State**: Realtime vehicle coordinates, fuel levels, driver scorecards, active alerts, work orders.
