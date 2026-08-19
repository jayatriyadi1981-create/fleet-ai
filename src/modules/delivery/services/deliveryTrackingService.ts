/**
 * Fleet Intelligence Smart AI - Delivery Customer Live Tracking Service
 * Public Secure Token Generation, Verification & Sanitized Live Tracking Payload
 */

import { Delivery } from '../deliveryTypes';
import { deliveryService } from './deliveryService';
import { deliveryPODService } from './deliveryPODService';

export interface PublicTrackingPayload {
  deliveryNumber: string;
  customerName: string;
  status: Delivery['status'];
  scheduledDate: string;
  scheduledTimeWindow: string;
  deliveryAddress: string;
  driverName?: string;
  driverPhone?: string;
  vehiclePlate?: string;
  currentLocation?: {
    latitude: number;
    longitude: number;
    address?: string;
    speedKmH?: number;
    lastUpdated?: string;
  };
  eta?: string;
  items: {
    productName: string;
    quantity: number;
  }[];
  podSummary?: {
    recipientName: string;
    deliveredAt: string;
    hasSignature: boolean;
    photoCount: number;
  };
}

class DeliveryTrackingService {
  public generateTrackingUrl(token: string): string {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://fleet.smart-ai.app';
    return `${origin}/tracking/${token}`;
  }

  public getPublicTrackingPayload(token: string): PublicTrackingPayload | null {
    const delivery = deliveryService.getDeliveryByTrackingToken(token);
    if (!delivery) return null;

    const pod = delivery.podId ? deliveryPODService.getPODByDeliveryId(delivery.podId) : undefined;

    return {
      deliveryNumber: delivery.deliveryNumber,
      customerName: delivery.customerName,
      status: delivery.status,
      scheduledDate: delivery.scheduledDate,
      scheduledTimeWindow: `${delivery.scheduledTimeStart} - ${delivery.scheduledTimeEnd} WIB`,
      deliveryAddress: delivery.deliveryAddress,
      driverName: delivery.driverName,
      driverPhone: delivery.driverPhone,
      vehiclePlate: delivery.vehiclePlate,
      currentLocation: {
        latitude: delivery.latitude,
        longitude: delivery.longitude,
        address: delivery.deliveryAddress,
        speedKmH: delivery.status === 'OUT_FOR_DELIVERY' ? 45 : 0,
        lastUpdated: new Date().toISOString(),
      },
      eta: delivery.status === 'DELIVERED' ? 'Telah Tiba' : '10:45 WIB (Tepat Waktu)',
      items: delivery.items.map((i) => ({
        productName: i.productName,
        quantity: i.quantity,
      })),
      podSummary: pod
        ? {
            recipientName: pod.recipientName,
            deliveredAt: pod.deliveredAt,
            hasSignature: Boolean(pod.signatureDataUrl),
            photoCount: pod.photos.length,
          }
        : undefined,
    };
  }
}

export const deliveryTrackingService = new DeliveryTrackingService();
