import React, { useState, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import RoutingMachine from './Routing'; // Import the RoutingMachine component
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

// Function to generate random latitude and longitude within Chile
const getRandomLocationInChile = () => {
  const latMin = -56.0;
  const latMax = -17.5;
  const lngMin = -75.0;
  const lngMax = -66.0;

  const latitude = Math.random() * (latMax - latMin) + latMin;
  const longitude = Math.random() * (lngMax - lngMin) + lngMin;

  return L.latLng(latitude, longitude);
};

const Map = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [polygonPoints, setPolygonPoints] = useState([]);
  const [waypoints, setWaypoints] = useState([]);
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);

  // Simulate fetching locations or define your own
  useEffect(() => {
    // Example static locations
    const staticLocations = [
      { id: 1, attributes: { name: 'Location A', latitude: -33.4489, longitude: -70.6693, description: 'Description A' } },
      { id: 2, attributes: { name: 'Location B', latitude: -33.4691, longitude: -70.6414, description: 'Description B' } },
    ];
    setLocations(staticLocations);
    setFilteredLocations(staticLocations);
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      // Remove existing routing control if it exists
      if (routingControlRef.current) {
        mapRef.current.removeControl(routingControlRef.current);
      }

      // Create new routing control
      const newRoutingControl = L.Routing.control({
        waypoints: waypoints,
        lineOptions: {
          styles: [{ color: "#6FA1EC", weight: 4 }]
        },
        show: false,
        addWaypoints: false,
        routeWhileDragging: true,
        draggableWaypoints: true,
        fitSelectedRoutes: true,
        showAlternatives: false
      });

      // Add new routing control to the map
      newRoutingControl.addTo(mapRef.current);
      routingControlRef.current = newRoutingControl; // Update ref
    }
  }, [waypoints]);

  const handleGenerateRoute = () => {
    const randomLocation1 = getRandomLocationInChile();
    const randomLocation2 = getRandomLocationInChile();
    setWaypoints([randomLocation1, randomLocation2]);
  };

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
    mapRef.current.flyTo(
      [location.attributes.latitude, location.attributes.longitude],
      14 // Zoom level
    );
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      setFilteredLocations(locations);
      setSelectedLocation(null);
    } else {
      const filtered = locations.filter((location) =>
        location.attributes.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredLocations(filtered);
      if (filtered.length > 0) {
        setSelectedLocation(filtered[0]);
        mapRef.current.flyTo(
          [filtered[0].attributes.latitude, filtered[0].attributes.longitude],
          14 // Zoom level
        );
      } else {
        setSelectedLocation(null);
      }
    }
  };

  const handleDragMarker = (event, location) => {
    const newLatLng = event.target.getLatLng();
    const updatedLocations = locations.map((loc) =>
      loc.id === location.id
        ? { ...loc, attributes: { ...loc.attributes, latitude: newLatLng.lat, longitude: newLatLng.lng } }
        : loc
    );
    setLocations(updatedLocations);
    setFilteredLocations(updatedLocations);
  };

  const _onCreate = (e) => {
    const { layerType, layer } = e;
    if (layerType === 'polygon') {
      setPolygonPoints(layer.getLatLngs()[0]);
    }
  };

  const _onEdited = (e) => {
    const {
      layers: { _layers },
    } = e;
    Object.values(_layers).map(({ editing }) => {
      setPolygonPoints(editing.latlngs[0]);
    });
  };

  const _onDeleted = (e) => {
    const {
      layers: { _layers },
    } = e;
    Object.values(_layers).map(() => {
      setPolygonPoints([]);
    });
  };

  return (
    <div>
      <button
        onClick={handleGenerateRoute}
        style={{ backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 16px', margin: '8px' }}
      >
        Generate Random Route
      </button>
      
      <input
        type="text"
        placeholder="Search locations"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ color: 'black', border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}
      />
      <button onClick={handleSearch} style={{ backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 16px', marginLeft: '8px' }}>
        Search
      </button>

      <MapContainer
        center={[-30.0, -70.0]} // Center of Chile
        zoom={5}
        style={{ height: '120vh' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
        />
        
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={_onCreate}
            onEdited={_onEdited}
            onDeleted={_onDeleted}
            draw={{
              rectangle: false,
              polyline: false,
              circle: false,
              circlemarker: false,
              marker: false,
            }}
          />
        </FeatureGroup>

        {/* Add routing control here */}
        
        {Array.isArray(filteredLocations) &&
          filteredLocations.map((location) => (
            <Marker
              key={location.id}
              position={[
                location.attributes.latitude,
                location.attributes.longitude,
              ]}
              icon={L.icon({
                iconUrl: '/custom-marker.png',
                iconSize: [30, 30],
                iconAnchor: [15, 30],
              })}
              eventHandlers={{
                click: () => handleMarkerClick(location),
                dragend: (event) => handleDragMarker(event, location),
              }}
              draggable
            >
              <Popup>
                <div style={{ width: '300px', height: 'Auto', paddingTop: '10px' }}>
                  <h3>{location.attributes.name}</h3>
                  {selectedLocation?.id === location.id && (
                    <div>
                      <p>{location.attributes.description}</p>
                      {location.photoUrl && (
                        <img
                          src={location.photoUrl}
                          alt={location.attributes.name}
                          style={{ maxWidth: '100%', height: 'auto' }}
                        />
                      )}
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        {polygonPoints.length > 0 && (
          <Polygon positions={polygonPoints} color="blue" fillOpacity={0.5} />
        )}
      </MapContainer>
    </div>
  );
};

export default Map;
