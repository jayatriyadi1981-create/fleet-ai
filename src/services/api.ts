/**
 * Fleet Intelligence Smart AI - Enterprise API Service Layer
 * Abstracts backend HTTP requests and local state management for Fleet Telematics
 */

import { Vehicle, Driver, Trip, AlertNotification, Geofence, MaintenanceWorkOrder, FuelRecord, AIInsight } from '../types';
import { mockVehicles, mockDrivers, mockTrips, mockAlerts, mockGeofences, mockMaintenanceOrders, mockAIInsights } from '../constants/mockData';

class FleetApiService {
  private vehicles: Vehicle[] = [...mockVehicles];
  private drivers: Driver[] = [...mockDrivers];
  private trips: Trip[] = [...mockTrips];
  private alerts: AlertNotification[] = [...mockAlerts];
  private geofences: Geofence[] = [...mockGeofences];
  private maintenanceOrders: MaintenanceWorkOrder[] = [...mockMaintenanceOrders];
  private insights: AIInsight[] = [...mockAIInsights];

  // Vehicles API
  async getVehicles(): Promise<Vehicle[]> {
    return this.vehicles;
  }

  async getVehicleById(id: string): Promise<Vehicle | undefined> {
    return this.vehicles.find((v) => v.id === id);
  }

  async addVehicle(vehicle: Vehicle): Promise<Vehicle> {
    this.vehicles.unshift(vehicle);
    return vehicle;
  }

  async updateVehicle(id: string, update: Partial<Vehicle>): Promise<Vehicle | undefined> {
    const idx = this.vehicles.findIndex((v) => v.id === id);
    if (idx !== -1) {
      this.vehicles[idx] = { ...this.vehicles[idx], ...update };
      return this.vehicles[idx];
    }
    return undefined;
  }

  // Drivers API
  async getDrivers(): Promise<Driver[]> {
    return this.drivers;
  }

  async addDriver(driver: Driver): Promise<Driver> {
    this.drivers.unshift(driver);
    return driver;
  }

  // Trips API
  async getTrips(): Promise<Trip[]> {
    return this.trips;
  }

  async createTrip(trip: Trip): Promise<Trip> {
    this.trips.unshift(trip);
    return trip;
  }

  // Alerts API
  async getAlerts(): Promise<AlertNotification[]> {
    return this.alerts;
  }

  async markAlertAsRead(id: string): Promise<void> {
    const alert = this.alerts.find((a) => a.id === id);
    if (alert) {
      alert.read = true;
    }
  }

  // Geofences API
  async getGeofences(): Promise<Geofence[]> {
    return this.geofences;
  }

  async addGeofence(geofence: Geofence): Promise<Geofence> {
    this.geofences.push(geofence);
    return geofence;
  }

  // Maintenance API
  async getMaintenanceOrders(): Promise<MaintenanceWorkOrder[]> {
    return this.maintenanceOrders;
  }

  async createWorkOrder(order: MaintenanceWorkOrder): Promise<MaintenanceWorkOrder> {
    this.maintenanceOrders.unshift(order);
    return order;
  }

  // AI Insights API
  async getAIInsights(): Promise<AIInsight[]> {
    return this.insights;
  }
}

export const apiService = new FleetApiService();
