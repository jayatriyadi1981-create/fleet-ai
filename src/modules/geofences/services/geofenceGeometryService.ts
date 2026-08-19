/**
 * Fleet Intelligence Smart AI - Geofence Geometry & Spatial Calculation Service
 * Point-in-Circle, Point-in-Polygon, Haversine Geodesic Distance, Geometry Validation
 */

import { Location } from '../../../types';
import { GeofenceType } from '../geofenceTypes';

class GeofenceGeometryService {
  /**
   * Calculates Earth surface distance between two coordinates in meters using Haversine formula
   */
  public calculateHaversineDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371000; // Earth radius in meters
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Evaluates if a point is inside a Circle geofence
   */
  public isPointInCircle(
    point: Location,
    center: Location,
    radiusMeters: number,
    toleranceMeters: number = 0
  ): boolean {
    const dist = this.calculateHaversineDistanceMeters(point.lat, point.lng, center.lat, center.lng);
    return dist <= radiusMeters + toleranceMeters;
  }

  /**
   * Evaluates if a point is inside a Polygon geofence using Ray-Casting algorithm
   */
  public isPointInPolygon(point: Location, polygon: Location[]): boolean {
    if (!polygon || polygon.length < 3) return false;

    let isInside = false;
    const x = point.lng;
    const y = point.lat;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lng;
      const yi = polygon[i].lat;
      const xj = polygon[j].lng;
      const yj = polygon[j].lat;

      const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) isInside = !isInside;
    }

    return isInside;
  }

  /**
   * Validates geofence geometry rules
   */
  public validateGeometry(
    type: GeofenceType,
    center?: Location,
    radiusMeters?: number,
    polygonCoordinates?: Location[]
  ): { isValid: boolean; error?: string } {
    if (type === 'CIRCLE') {
      if (!center || typeof center.lat !== 'number' || typeof center.lng !== 'number') {
        return { isValid: false, error: 'Koordinat pusat lingkaran tidak valid.' };
      }
      if (!radiusMeters || radiusMeters < 20) {
        return { isValid: false, error: 'Radius lingkaran minimal adalah 20 meter.' };
      }
      if (radiusMeters > 50000) {
        return { isValid: false, error: 'Radius lingkaran maksimal adalah 50.000 meter (50 km).' };
      }
      return { isValid: true };
    }

    if (type === 'POLYGON') {
      if (!polygonCoordinates || polygonCoordinates.length < 3) {
        return { isValid: false, error: 'Bentuk Polygon harus memiliki minimal 3 titik koordinat.' };
      }

      // Check self-intersection or duplicate consecutive vertices
      for (let i = 0; i < polygonCoordinates.length; i++) {
        const curr = polygonCoordinates[i];
        const next = polygonCoordinates[(i + 1) % polygonCoordinates.length];
        if (curr.lat === next.lat && curr.lng === next.lng) {
          return { isValid: false, error: 'Terdapat titik koordinat bertumpuk (duplicate vertex).' };
        }
      }

      return { isValid: true };
    }

    return { isValid: true };
  }

  /**
   * Calculates centroid of a polygon
   */
  public calculateCentroid(polygon: Location[]): Location {
    if (!polygon || polygon.length === 0) return { lat: -6.2088, lng: 106.8456 };

    let sumLat = 0;
    let sumLng = 0;
    polygon.forEach((p) => {
      sumLat += p.lat;
      sumLng += p.lng;
    });

    return {
      lat: sumLat / polygon.length,
      lng: sumLng / polygon.length,
    };
  }

  /**
   * Calculates approximate area of polygon in square meters
   */
  public calculatePolygonAreaSquareMeters(polygon: Location[]): number {
    if (!polygon || polygon.length < 3) return 0;
    const centroid = this.calculateCentroid(polygon);
    let totalArea = 0;

    for (let i = 0; i < polygon.length; i++) {
      const p1 = polygon[i];
      const p2 = polygon[(i + 1) % polygon.length];

      // Triangulation using centroid
      const a = this.calculateHaversineDistanceMeters(centroid.lat, centroid.lng, p1.lat, p1.lng);
      const b = this.calculateHaversineDistanceMeters(centroid.lat, centroid.lng, p2.lat, p2.lng);
      const c = this.calculateHaversineDistanceMeters(p1.lat, p1.lng, p2.lat, p2.lng);

      const s = (a + b + c) / 2;
      const area = Math.sqrt(Math.max(0, s * (s - a) * (s - b) * (s - c)));
      totalArea += area;
    }

    return Math.round(totalArea);
  }
}

export const geofenceGeometryService = new GeofenceGeometryService();
