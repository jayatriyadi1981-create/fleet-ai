/**
 * Fleet Intelligence Smart AI - Notification Deep Link Service
 * Dynamic URL & Navigation Resolution for Notifications
 */

import { Notification } from '../types';

export class NotificationDeepLinkService {
  /**
   * Resolves appropriate internal route or URL action for a given notification
   */
  resolveDeepLink(notification: Partial<Notification>): string {
    const { type, category, entityType, entityId, vehicleId, alertId, deliveryId, tripId, routeId } = notification;

    if (alertId || type === 'ALERT' || category === 'ALERT') {
      if (notification.severity === 'CRITICAL' || notification.priority === 'CRITICAL') {
        return vehicleId ? `/app/live-tracking?vehicleId=${vehicleId}&alertId=${alertId || ''}` : '/app/alerts?tab=ACTIVE_ALERTS';
      }
      return `/app/alerts?alertId=${alertId || ''}`;
    }

    if (type === 'DELIVERY' || deliveryId || entityType === 'delivery') {
      return `/app/deliveries?deliveryId=${deliveryId || entityId || ''}`;
    }

    if (type === 'TRIP' || tripId || entityType === 'trip') {
      return `/app/planned_trips?tripId=${tripId || entityId || ''}`;
    }

    if (type === 'ROUTE' || routeId || entityType === 'route') {
      return `/app/routes?routeId=${routeId || entityId || ''}`;
    }

    if (type === 'GEOFENCE' || category === 'GEOFENCE') {
      return `/app/geofence`;
    }

    if (type === 'MAINTENANCE' || entityType === 'maintenance') {
      return `/app/maintenance?vehicleId=${vehicleId || ''}`;
    }

    if (type === 'FUEL' || category === 'FUEL') {
      return `/app/fuel?vehicleId=${vehicleId || ''}`;
    }

    if (type === 'DEVICE' || entityType === 'device') {
      return `/app/gps_devices`;
    }

    if (type === 'SECURITY' || type === 'USER' || category === 'SYSTEM') {
      return `/app/settings`;
    }

    if (type === 'AI_INSIGHT') {
      return `/app/ai_intelligence`;
    }

    if (type === 'REPORT') {
      return `/app/reports`;
    }

    // Default fallback
    return '/app/notifications';
  }

  /**
   * Maps deep link URL to FleetContext ActiveView
   */
  mapUrlToActiveView(url: string): string {
    if (url.includes('/app/live-tracking')) return 'live_tracking';
    if (url.includes('/app/alerts')) return 'alerts';
    if (url.includes('/app/deliveries')) return 'deliveries';
    if (url.includes('/app/planned_trips')) return 'planned_trips';
    if (url.includes('/app/routes')) return 'routes';
    if (url.includes('/app/geofence')) return 'geofence';
    if (url.includes('/app/maintenance')) return 'maintenance';
    if (url.includes('/app/fuel')) return 'fuel';
    if (url.includes('/app/gps_devices')) return 'gps_devices';
    if (url.includes('/app/settings')) return 'settings';
    if (url.includes('/app/ai_intelligence')) return 'ai_intelligence';
    if (url.includes('/app/reports')) return 'reports';
    return 'notifications';
  }
}

export const notificationDeepLinkService = new NotificationDeepLinkService();
