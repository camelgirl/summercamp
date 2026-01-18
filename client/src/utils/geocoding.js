const coordinateCache = {};

const knownLocations = {
  '7500 Woodrow Ave': [30.3511, -97.7206],
  '13609 N Interstate Hwy 35': [30.4281, -97.6667],
  '6401 River Place Boulevard': [30.3800, -97.8200],
  '5501 Ed Bluestein Blvd': [30.2800, -97.6800],
  '8600 Balcones Drive': [30.3800, -97.7800],
  'Harvey Penick Golf Campus': [30.2800, -97.6800],
  'Dell Jewish Community Center': [30.3000, -97.8000],
  'Zilker Park': [30.2669, -97.7729],
  'University of Texas at Austin': [30.2849, -97.7341],
  'Magellan International School': [30.3200, -97.7500],
  'Zach Theatre': [30.2700, -97.7500],
  'Paramount Theatre': [30.2700, -97.7400],
  'Austin Scottish Rite Theater': [30.2700, -97.7500],
  'Dougherty Arts Center': [30.2600, -97.7600],
  'Austin Nature & Science Center': [30.2900, -97.7800],
  'GirlStart STEM Center': [30.2800, -97.7400],
  'ACE Academy': [30.3000, -97.7600],
  'Steiner Ranch': [30.3800, -97.9000],
  'Round Rock': [30.5083, -97.6789],
  'Kyle/Buda': [30.0050, -97.8400],
  'South Austin': [30.2200, -97.7800],
  'Leander': [30.5788, -97.8531],
  'Granbury': [32.4421, -97.7942],
  'TA Brown': [30.3500, -97.7000],
  'Govalle': [30.2600, -97.7200],
  'Kocurek': [30.1800, -97.8300],
  'Uphaus': [30.2000, -97.7800],
  'Garcia YMLA': [30.3000, -97.6500],
  'Covington': [30.2000, -97.8500],
  'Clayton': [30.2800, -97.7500],
  'Galindo': [30.2500, -97.7400],
  'Hill': [30.2700, -97.7600],
};

export async function getCampCoordinates(camp) {
  const cacheKey = camp.name + (camp.location || '');
  if (coordinateCache[cacheKey]) {
    return coordinateCache[cacheKey];
  }

  const location = camp.location || '';

  // Check for known locations
  for (const [key, coords] of Object.entries(knownLocations)) {
    if (location.includes(key) || camp.name.includes(key.split(' ')[0])) {
      coordinateCache[cacheKey] = coords;
      return coords;
    }
  }

  // Try to geocode
  if (location && location.length > 10 && (location.includes('Austin') || location.includes('Round Rock'))) {
    try {
      await new Promise((resolve) => setTimeout(resolve, 100));
      const coords = await geocodeAddress(location + ', TX');
      if (coords) {
        coordinateCache[cacheKey] = coords;
        return coords;
      }
    } catch (error) {
      console.log('Geocoding failed for:', camp.name);
    }
  }

  // Default to Austin center
  const defaultCoords = [30.2672, -97.7431];
  coordinateCache[cacheKey] = defaultCoords;
  return defaultCoords;
}

async function geocodeAddress(address) {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
      {
        headers: {
          'User-Agent': 'Austin Summer Camps Website',
        },
      }
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
  } catch (error) {
    console.error('Geocoding error:', error);
  }
  return null;
}
