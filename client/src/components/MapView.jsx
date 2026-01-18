import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './MapView.css';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

function MapBounds({ camps, coordinates }) {
  const map = useMap();

  useEffect(() => {
    if (camps.length === 0) {
      map.setView([30.2672, -97.7431], 11);
      return;
    }

    if (coordinates.length > 0) {
      const bounds = L.latLngBounds(coordinates);
      map.fitBounds(bounds, { padding: [20, 20] });
    }
  }, [camps, coordinates, map]);

  return null;
}

function MapView({ camps, getCoordinates }) {
  const [coordinates, setCoordinates] = useState([]);

  useEffect(() => {
    const loadCoordinates = async () => {
      const coords = await Promise.all(
        camps.map((camp) => getCoordinates(camp))
      );
      setCoordinates(coords);
    };

    if (camps.length > 0) {
      loadCoordinates();
    } else {
      setCoordinates([]);
    }
  }, [camps, getCoordinates]);

  const createPopup = (camp) => {
    return (
      <div className="map-popup">
        <h3>{camp.name}</h3>
        {camp.district && (
          <div className="popup-info">
            <strong>District:</strong> {camp.district}
          </div>
        )}
        {camp.type && (
          <div className="popup-info">
            <strong>Type:</strong> {camp.type}
          </div>
        )}
        {camp.ages && (
          <div className="popup-info">
            <strong>Ages:</strong> {camp.ages}
          </div>
        )}
        {camp.dates && (
          <div className="popup-info">
            <strong>Dates:</strong> {camp.dates}
          </div>
        )}
        {camp.cost && (
          <div className="popup-info">
            <strong>Cost:</strong> {camp.cost}
          </div>
        )}
        {camp.location && (
          <div className="popup-info">
            <strong>Location:</strong> {camp.location}
          </div>
        )}
        {camp.website && (
          <a
            href={camp.website.startsWith('http') ? camp.website : `https://${camp.website}`}
            target="_blank"
            rel="noopener noreferrer"
            className="popup-link"
          >
            Visit Website →
          </a>
        )}
      </div>
    );
  };

  return (
    <div className="map-container">
      <MapContainer
        center={[30.2672, -97.7431]}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />
        <MapBounds camps={camps} coordinates={coordinates} />
        {camps.map((camp, index) => {
          if (coordinates[index]) {
            const [lat, lng] = coordinates[index];
            return (
              <Marker key={index} position={[lat, lng]}>
                <Popup>{createPopup(camp)}</Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
}

export default MapView;
