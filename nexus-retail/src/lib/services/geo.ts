/**
 * geo.ts
 * Implements the mathematical "Local First" sourcing algorithm for zero-trust, 
 * quota-free hackathon distance calculations without exposing data to external APIs.
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

export class GeoService {
  /**
   * Calculates the distance between two coordinates using the Haversine formula.
   * Highly optimized native math for calculating "Local First" 5-mile requirements.
   * 
   * @param coord1 First coordinate pair (e.g. User location)
   * @param coord2 Second coordinate pair (e.g. Vendor Store inventory)
   * @returns Distance in miles.
   */
  static getDistanceInMiles(coord1: Coordinates, coord2: Coordinates): number {
    const R = 3958.8; // Radius of the Earth in miles
    const rLat1 = coord1.lat * (Math.PI / 180);
    const rLat2 = coord2.lat * (Math.PI / 180);
    const dLat = rLat2 - rLat1;
    const dLon = (coord2.lng - coord1.lng) * (Math.PI / 180);

    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rLat1) * Math.cos(rLat2) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Validates if a store is within the sustainable radius limit to reduce carbon emissions.
   */
  static isWithinSustainableRadius(userLocation: Coordinates, storeLocation: Coordinates, maxMiles = 5.0): boolean {
    return this.getDistanceInMiles(userLocation, storeLocation) <= maxMiles;
  }
}
