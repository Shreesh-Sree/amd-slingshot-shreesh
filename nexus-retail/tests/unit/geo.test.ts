import { GeoService } from '@/lib/services/geo';

describe('GeoService Zero Trust Math Engine', () => {
  const sfCoords = { lat: 37.7749, lng: -122.4194 };
  const oaklandCoords = { lat: 37.8044, lng: -122.2712 }; // ~10 miles
  const veryCloseCoords = { lat: 37.7800, lng: -122.4200 }; // < 1 mile

  it('accurately calculates Haversine distance', () => {
    const miles = GeoService.getDistanceInMiles(sfCoords, oaklandCoords);
    expect(miles).toBeGreaterThan(8);
    expect(miles).toBeLessThan(12);
  });

  it('enforces rigorous 5.0-mile sustainability maximums properly', () => {
    // True because it's practically the same node
    expect(GeoService.isWithinSustainableRadius(sfCoords, veryCloseCoords, 5.0)).toBe(true);
    // False because Oakland is ~10 miles from SF
    expect(GeoService.isWithinSustainableRadius(sfCoords, oaklandCoords, 5.0)).toBe(false);
  });
});
