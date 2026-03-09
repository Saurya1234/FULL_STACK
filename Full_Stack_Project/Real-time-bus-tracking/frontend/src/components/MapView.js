import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

function MapView() {

  const [route, setRoute] = useState([]);
  const [position, setPosition] = useState([28.6139, 77.2090]);

  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  const speed = 60; // km/h

  const stops = [
    { name: "Delhi", position: [28.6139, 77.2090] },
    { name: "Chandigarh", position: [30.7333, 76.7794] }
  ];

  const busIcon = new L.DivIcon({
    html: "🚌",
    className: "",
    iconSize: [30, 30]
  });

  const stopIcon = new L.DivIcon({
    html: "📍",
    className: "",
    iconSize: [25, 25]
  });

  // Fetch road route
  useEffect(() => {

    const fetchRoute = async () => {

      const response = await fetch(
        "https://api.openrouteservice.org/v2/directions/driving-car?api_key=eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjM5NTllMjg4ZWNmNTQyMTZiZTE2NDJmMDk0NDk0YzExIiwiaCI6Im11cm11cjY0In0=&start=77.2090,28.6139&end=76.7794,30.7333"
      );

      const data = await response.json();

      const coords = data.features[0].geometry.coordinates.map(c => [
        c[1],
        c[0]
      ]);

      setRoute(coords);
      setPosition(coords[0]);

    };

    fetchRoute();

  }, []);

  // Move bus forward and reverse
  useEffect(() => {

    if (route.length === 0) return;

    const interval = setInterval(() => {

      setPosition(route[index]);

      let nextIndex = index + direction;

      if (nextIndex >= route.length) {
        setDirection(-1);
        nextIndex = route.length - 1;
      }

      if (nextIndex < 0) {
        setDirection(1);
        nextIndex = 0;
      }

      setIndex(nextIndex);

    }, 2000);

    return () => clearInterval(interval);

  }, [route, index, direction]);

  // Distance calculation (Haversine)
  const getDistance = (p1, p2) => {

    const R = 6371;

    const dLat = (p2[0] - p1[0]) * Math.PI / 180;
    const dLon = (p2[1] - p1[1]) * Math.PI / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(p1[0] * Math.PI / 180) *
      Math.cos(p2[0] * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const distanceRemaining = getDistance(position, stops[1].position);
  const eta = (distanceRemaining / speed) * 60;

  return (
    <div>

      {/* Info panel */}
      <div style={{
        background: "#fff",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "5px",
        width: "300px"
      }}>
        <h3>🚌 Bus Tracking</h3>

        <p>📏 Distance Remaining: {distanceRemaining.toFixed(2)} km</p>

        <p>⏱ ETA: {eta.toFixed(1)} minutes</p>

        <p>🚍 Speed: {speed} km/h</p>

      </div>

      <MapContainer center={[29.5, 77]} zoom={7} style={{ height: "600px", width: "100%" }}>

        {/* Map */}
        <TileLayer
          attribution="© OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Road Route */}
        <Polyline positions={route} color="blue" />

        {/* Bus */}
        <Marker position={position} icon={busIcon}>
          <Popup>🚌 Bus</Popup>
        </Marker>

        {/* Stops */}
        {stops.map((stop, i) => (
          <Marker key={i} position={stop.position} icon={stopIcon}>
            <Popup>{stop.name}</Popup>
          </Marker>
        ))}

      </MapContainer>

    </div>
  );
}

export default MapView;