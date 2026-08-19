/**
 * Fleet Intelligence Smart AI - Geocoding Service with Caching
 * PROMPT 14 — Reverse Geocoding for Trip Start/End, Stops, and Events
 */

class GeocodingService {
  private cache = new Map<string, string>();

  // Known Indonesian Landmarks & Corridors Bounding Boxes for Offline High-Performance Fallbacks
  private knownLocations: Array<{
    name: string;
    minLat: number;
    maxLat: number;
    minLng: number;
    maxLng: number;
  }> = [
    {
      name: 'Tanjung Priok Port Gate 3, Jakarta Utara',
      minLat: -6.125, maxLat: -6.100, minLng: 106.870, maxLng: 106.895
    },
    {
      name: 'Rest Area Tol Jakarta-Cikampek KM 19, Bekasi',
      minLat: -6.240, maxLat: -6.225, minLng: 106.940, maxLng: 106.960
    },
    {
      name: 'Tol Jakarta-Cikampek KM 34, Cikarang Barat',
      minLat: -6.295, maxLat: -6.270, minLng: 107.140, maxLng: 107.180
    },
    {
      name: 'Cikarang Dry Port & Logistics Center, Bekasi',
      minLat: -6.290, maxLat: -6.275, minLng: 107.165, maxLng: 107.185
    },
    {
      name: 'Kawasan Industri Jababeka 2, Cikarang',
      minLat: -6.310, maxLat: -6.275, minLng: 107.150, maxLng: 107.195
    },
    {
      name: 'Gerbang Tol Karawang Barat, Karawang',
      minLat: -6.360, maxLat: -6.335, minLng: 107.260, maxLng: 107.300
    },
    {
      name: 'Rest Area Trans-Jawa KM 207A, Palimanan Cirebon',
      minLat: -6.740, maxLat: -6.710, minLng: 108.450, maxLng: 108.500
    },
    {
      name: 'Pelabuhan Tanjung Perak, Surabaya',
      minLat: -7.215, maxLat: -7.185, minLng: 112.720, maxLng: 112.745
    },
    {
      name: 'Gudang Logistik Margomulyo, Surabaya',
      minLat: -7.240, maxLat: -7.220, minLng: 112.670, maxLng: 112.700
    },
    {
      name: 'Kawasan Industri MM2100, Cibitung',
      minLat: -6.315, maxLat: -6.290, minLng: 107.090, maxLng: 107.125
    },
  ];

  private getKey(lat: number, lng: number): string {
    return `${lat.toFixed(4)},${lng.toFixed(4)}`;
  }

  public async reverseGeocode(lat: number, lng: number): Promise<string> {
    const key = this.getKey(lat, lng);

    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    // Check offline landmark bounding boxes
    for (const loc of this.knownLocations) {
      if (lat >= loc.minLat && lat <= loc.maxLat && lng >= loc.minLng && lng <= loc.maxLng) {
        this.cache.set(key, loc.name);
        return loc.name;
      }
    }

    // Fallback format
    const formatted = `Koordinat ${lat.toFixed(4)}, ${lng.toFixed(4)} (Jawa Barat/DKI Jakarta)`;
    this.cache.set(key, formatted);
    return formatted;
  }

  public getCachedAddress(lat: number, lng: number, fallback: string = ''): string {
    const key = this.getKey(lat, lng);
    return this.cache.get(key) || fallback || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

export const geocodingService = new GeocodingService();
