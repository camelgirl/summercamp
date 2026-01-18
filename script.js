let campsData = [];
let filteredCamps = [];
let map = null;
let markers = [];
let currentView = 'list'; // 'list' or 'map'
const coordinateCache = {}; // Cache for geocoded coordinates

// Load camp data
async function loadCampsData() {
    try {
        const response = await fetch('camps-data.json');
        campsData = await response.json();
        filteredCamps = campsData;
        await initializeMap();
        displayCamps();
        updateMap();
        updateResultsCount();
    } catch (error) {
        console.error('Error loading camp data:', error);
        document.getElementById('campsContainer').innerHTML = 
            '<div class="no-results"><p>Error loading camp data. Please refresh the page.</p></div>';
    }
}

// Initialize map
async function initializeMap() {
    if (map) return;
    
    // Initialize map centered on Austin, TX
    map = L.map('map').setView([30.2672, -97.7431], 11);
    
    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
    }).addTo(map);
}

// Get coordinates for a camp location
async function getCampCoordinates(camp) {
    // Check cache first
    const cacheKey = camp.name + (camp.location || '');
    if (coordinateCache[cacheKey]) {
        return coordinateCache[cacheKey];
    }
    
    // Try to extract coordinates from known addresses
    const location = camp.location || '';
    
    // Known coordinates for specific locations
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
        'Granbury': [32.4421, -97.7942]
    };
    
    // Check for known locations
    for (const [key, coords] of Object.entries(knownLocations)) {
        if (location.includes(key) || camp.name.includes(key.split(' ')[0])) {
            coordinateCache[cacheKey] = coords;
            return coords;
        }
    }
    
    // Try to geocode if we have an address (with rate limiting)
    if (location && location.length > 10 && location.includes('Austin')) {
        try {
            // Add small delay to respect rate limits
            await new Promise(resolve => setTimeout(resolve, 100));
            const coords = await geocodeAddress(location + ', Austin, TX');
            if (coords) {
                coordinateCache[cacheKey] = coords;
                return coords;
            }
        } catch (error) {
            console.log('Geocoding failed for:', camp.name);
        }
    }
    
    // Default to Austin center if no location found
    const defaultCoords = [30.2672, -97.7431];
    coordinateCache[cacheKey] = defaultCoords;
    return defaultCoords;
}

// Geocode an address using Nominatim
async function geocodeAddress(address) {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
            {
                headers: {
                    'User-Agent': 'Austin Summer Camps Website'
                }
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

// Update map with filtered camps
async function updateMap() {
    if (!map) return;
    
    // Clear existing markers
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    if (filteredCamps.length === 0) {
        // Reset to Austin center if no camps
        map.setView([30.2672, -97.7431], 11);
        return;
    }
    
    // Add markers for each camp (batch process to avoid blocking)
    const markerPromises = filteredCamps.map(async (camp) => {
        const coords = await getCampCoordinates(camp);
        const marker = L.marker(coords).addTo(map);
        
        // Create popup content
        const popupContent = createMapPopup(camp);
        marker.bindPopup(popupContent);
        
        return marker;
    });
    
    markers = await Promise.all(markerPromises);
    
    // Fit map to show all markers
    if (markers.length > 0) {
        const group = new L.featureGroup(markers);
        map.fitBounds(group.getBounds().pad(0.1));
    }
}

// Create popup content for map markers
function createMapPopup(camp) {
    const formatField = (value, label) => {
        if (!value || value.trim() === '') return '';
        return `<div class="popup-info"><strong>${label}:</strong> ${escapeHtml(value)}</div>`;
    };
    
    const formatLink = (url, text) => {
        if (!url || url.trim() === '') return '';
        const linkText = text || url;
        const href = url.startsWith('http') ? url : `https://${url}`;
        return `<a href="${href}" target="_blank" class="popup-link">Visit Website →</a>`;
    };
    
    return `
        <div class="map-popup">
            <h3>${escapeHtml(camp.name)}</h3>
            ${camp.type ? `<div class="popup-info"><strong>Type:</strong> ${escapeHtml(camp.type)}</div>` : ''}
            ${formatField(camp.ages, 'Ages')}
            ${formatField(camp.dates, 'Dates')}
            ${formatField(camp.cost, 'Cost')}
            ${formatField(camp.location, 'Location')}
            ${formatLink(camp.website)}
        </div>
    `;
}

// Toggle between list and map view
function toggleView(view) {
    currentView = view;
    const listContainer = document.getElementById('campsContainer');
    const mapContainer = document.getElementById('mapContainer');
    const listBtn = document.getElementById('listViewBtn');
    const mapBtn = document.getElementById('mapViewBtn');
    
    if (view === 'map') {
        listContainer.style.display = 'none';
        mapContainer.style.display = 'block';
        listBtn.classList.remove('active');
        mapBtn.classList.add('active');
        if (map) {
            setTimeout(() => map.invalidateSize(), 100);
        }
        updateMap();
    } else {
        listContainer.style.display = 'grid';
        mapContainer.style.display = 'none';
        listBtn.classList.add('active');
        mapBtn.classList.remove('active');
        displayCamps();
    }
}

// Display camps
function displayCamps() {
    const container = document.getElementById('campsContainer');
    const noResults = document.getElementById('noResults');
    
    if (filteredCamps.length === 0) {
        container.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    noResults.style.display = 'none';
    container.innerHTML = filteredCamps.map(camp => createCampCard(camp)).join('');
}

// Create camp card HTML
function createCampCard(camp) {
    const formatField = (value, label) => {
        if (!value || value.trim() === '') return '';
        return `<div class="camp-info"><strong>${label}:</strong> <span>${escapeHtml(value)}</span></div>`;
    };
    
    const formatLink = (url, text) => {
        if (!url || url.trim() === '') return '';
        const linkText = text || url;
        const href = url.startsWith('http') ? url : `https://${url}`;
        return `<div class="camp-info"><strong>Website:</strong> <a href="${href}" target="_blank" rel="noopener noreferrer">${escapeHtml(linkText)}</a></div>`;
    };
    
    return `
        <div class="camp-card">
            <h2>${escapeHtml(camp.name)}</h2>
            ${camp.type ? `<span class="camp-type">${escapeHtml(camp.type)}</span>` : ''}
            ${formatLink(camp.website)}
            ${formatField(camp.ages, 'Ages')}
            ${formatField(camp.dates, 'Dates')}
            ${formatField(camp.registrationDate, 'Registration')}
            ${formatField(camp.cost, 'Cost')}
            ${formatField(camp.location, 'Location')}
            ${camp.notes ? `<div class="notes">${escapeHtml(camp.notes)}</div>` : ''}
        </div>
    `;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Filter camps
function filterCamps() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const ageFilter = document.getElementById('ageFilter').value;
    const typeFilter = document.getElementById('typeFilter').value;
    
    filteredCamps = campsData.filter(camp => {
        // Search filter
        const matchesSearch = !searchTerm || 
            camp.name.toLowerCase().includes(searchTerm) ||
            (camp.type && camp.type.toLowerCase().includes(searchTerm)) ||
            (camp.location && camp.location.toLowerCase().includes(searchTerm)) ||
            (camp.notes && camp.notes.toLowerCase().includes(searchTerm));
        
        // Age filter - check if selected age falls within camp's age range
        let matchesAge = true;
        if (ageFilter) {
            const selectedAge = parseInt(ageFilter);
            if (camp.ages) {
                // Parse age ranges like "5-12 yrs", "4+", "Grades K-5", "1st-6th grade"
                const ageStr = camp.ages.toLowerCase();
                let campMinAge = null;
                let campMaxAge = null;
                
                // Try to extract age range (e.g., "5-12", "4-14")
                const rangeMatch = ageStr.match(/(\d+)\s*[-–—]\s*(\d+)/);
                if (rangeMatch) {
                    campMinAge = parseInt(rangeMatch[1]);
                    campMaxAge = parseInt(rangeMatch[2]);
                } 
                // Check for "X+" format (e.g., "5+", "4+")
                else if (ageStr.includes('+')) {
                    const plusMatch = ageStr.match(/(\d+)\s*\+/);
                    if (plusMatch) {
                        campMinAge = parseInt(plusMatch[1]);
                        campMaxAge = 18; // Assume max age of 18 for "+" ranges
                    }
                }
                // Check for grade ranges (e.g., "Grades K-5", "1st-6th grade")
                else if (ageStr.includes('grade') || ageStr.includes('k-') || ageStr.includes('1st') || ageStr.includes('2nd') || ageStr.includes('3rd')) {
                    // Approximate: K = 5 years, 1st = 6 years, 2nd = 7 years, etc.
                    if (ageStr.includes('k')) {
                        campMinAge = 5;
                    }
                    const gradeMatch = ageStr.match(/(\d+)(?:st|nd|rd|th)/);
                    if (gradeMatch) {
                        const grade = parseInt(gradeMatch[1]);
                        if (!campMinAge) campMinAge = grade + 5; // 1st grade = 6 years
                        campMaxAge = grade + 5 + 1; // Rough estimate
                    } else if (ageStr.includes('k-')) {
                        const kMatch = ageStr.match(/k\s*[-–—]\s*(\d+)/);
                        if (kMatch) {
                            campMinAge = 5;
                            campMaxAge = parseInt(kMatch[1]) + 5;
                        }
                    }
                }
                // Try to extract single number (e.g., "5", "12")
                else {
                    const singleMatch = ageStr.match(/(\d+)/);
                    if (singleMatch) {
                        const campAge = parseInt(singleMatch[1]);
                        campMinAge = campAge;
                        campMaxAge = campAge + 5; // Assume a range
                    }
                }
                
                // Check if selected age falls within the camp's age range
                if (campMinAge !== null) {
                    // For "5 and under", show camps where 5 falls within their range
                    matchesAge = selectedAge >= campMinAge && (campMaxAge === null || selectedAge <= campMaxAge);
                } else {
                    matchesAge = false;
                }
            } else {
                matchesAge = false;
            }
        }
        
        // Type filter
        const matchesType = !typeFilter || camp.type === typeFilter;
        
        return matchesSearch && matchesAge && matchesType;
    });
    
    if (currentView === 'list') {
        displayCamps();
    } else {
        updateMap();
    }
    updateResultsCount();
}

// Update results count
function updateResultsCount() {
    const count = filteredCamps.length;
    document.getElementById('resultsCount').textContent = count;
    const pluralSpan = document.getElementById('resultsPlural');
    if (pluralSpan) {
        pluralSpan.textContent = count === 1 ? '' : 's';
    }
}

// Clear filters
function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('ageFilter').value = '';
    document.getElementById('typeFilter').value = '';
    filterCamps();
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    loadCampsData();
    
    document.getElementById('searchInput').addEventListener('input', filterCamps);
    document.getElementById('ageFilter').addEventListener('change', filterCamps);
    document.getElementById('typeFilter').addEventListener('change', filterCamps);
    document.getElementById('clearFilters').addEventListener('click', clearFilters);
    
    // View toggle buttons
    document.getElementById('listViewBtn').addEventListener('click', () => toggleView('list'));
    document.getElementById('mapViewBtn').addEventListener('click', () => toggleView('map'));
});
