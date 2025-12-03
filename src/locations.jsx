import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icon path issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Dummy forest sensor locations
const sensorLocations = [
  {
    id: 1,
    name: "Sensor A - Forest Zone 1",
    temperature: 46,
    humidity: 21,
    lat: 18.5204,
    lng: 73.8567,
  },
  {
    id: 2,
    name: "Sensor B - Forest Zone 2",
    temperature: 32,
    humidity: 50,
    lat: 18.45,
    lng: 73.90,
  },
];

function Locations() {
  return (
    <div>
      <h2 className="subtitle">📍 Sensor Locations Map</h2>

      <MapContainer
        center={[18.5204, 73.8567]}
        zoom={10}
        style={{ height: "400px", width: "100%", borderRadius: "12px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {sensorLocations.map((loc) => (
          <Marker key={loc.id} position={[loc.lat, loc.lng]}>
            <Popup>
              <strong>{loc.name}</strong> <br />
              🌡 Temperature: {loc.temperature}°C <br />
              💧 Humidity: {loc.humidity}% <br />
              {loc.temperature > 45 && loc.humidity < 30 ? (
                <p style={{ color: "red", fontWeight: "bold" }}>🔥 Fire Risk!</p>
              ) : (
                <p style={{ color: "green", fontWeight: "bold" }}>✔ Safe</p>
              )}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default Locations;
