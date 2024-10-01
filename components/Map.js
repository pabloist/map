import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, FeatureGroup, Circle, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
//import "./styles.css";
import "leaflet/dist/leaflet.css";
import RoutingMachine from './Routing'; // Import the RoutingMachine component
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import Bloodhound from 'typeahead.js/dist/typeahead.bundle.min';
import $ from 'jquery';
import Autocomplete from "react-google-autocomplete";
import axios from 'axios';
import { Grid, TextField} from '@mui/material';
import Paper from '@mui/material/Paper';
import { Slider } from '@mui/material';
import { styled } from '@mui/material/styles';
import Select, { StylesConfig } from 'react-select';
import 'lrm-google';
import 'leaflet-geometryutil'; // Import GeometryUtil
import * as pip from 'leaflet-pip'; // Import leaflet-pip



const Map = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [polygonPoints, setPolygonPoints] = useState([]);
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);
  const [waypoints, setWaypoints] = useState([]);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const pages = ['Products', 'Pricing', 'Blog'];
  const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
  const [address, setAddress] = useState(null);
  const [coordenadasPartida, setCoordenadasPartida] = useState(null);
  const [coordenadasFinal, setCoordenadasFinal] = useState(null);
  const [partida, setPartida] = useState(null);
  const [final, setFinal] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [interpolatedPoints, setInterpolatedPoints] = useState([])
  const [polygons, setPolygons] = useState([]);
  const [distanciaEval, setDistanciaEval] = useState([5000]);
  const [anchoEval, setAnchoEval] = useState([2000]);
  const [locationsWithSegments, setLocationsWithSegments] = useState({});
  const [furthestSegment, setFurthestSegment] = useState({});
  const [furthestSegments, setFurthestSegments] = useState([]);
  const [comments, setComments] = useState({});
  const [autonomia, setAutonomia] = useState(0.8);
  const [ratings, setRatings] = useState({});
  const [commentHistory, setCommentHistory] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [optimos, setOptimos] = useState([]);
  const [autonomy, setAutonomy] = useState(null);
  const [soc, setSoc] = useState(null);
  const [vehiculos, setvehiculos] = useState([]);
  const [selectedVehiculo, setSelectedVehiculo] = useState();
  const cargadores = [
    { value: 'T1', label: 'T1' },
    { value: 'T2', label: 'T2' },
    { value: 'T2SC', label: 'T2SC' },
    { value: 'CHADEMO', label: 'CHADEMO' },
    { value: 'CCST2', label: 'CCST2' },
    { value: 'GBTDC', label: 'GP/T DC' },
  ];
  const colorLetras = useState("black");
  const colorBarra1 = '#5390D9';
  const colorBarra2 = useState("green");
  const colorContExt = '#72EFDD';
  const colorContBord = "blue";
  const colorContInt1 = '#5390D9';
  const colorContInt2 = '#5390D9';
  const elementInt = "white";
  const colorLin = "blue";
  const colorBtn = "cyan";
  const colorTxtBtn = "white";
  const colorTxtInt = "black";

  const vehiculosOptions = vehiculos.map(vehiculo => ({
    value: vehiculo, // The value to be used in the select
    label: vehiculo.marca + " | " +vehiculo.modelo, // The label displayed to the user
  }));


  

  // Step 2: Toggle visibility function
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    if (mapRef.current) {
      if (routingControlRef.current) {
        mapRef.current.removeControl(routingControlRef.current);
      }

      // Crear nuevo control de ruta con Google Routing
      console.log("waypoint", waypoints)
      const newRoutingControl = L.Routing.control({
        router: new L.Routing.Google({
          travelMode: 'DRIVING', // Definir el modo de viaje (DRIVING, WALKING, etc.)
        }),
        
        waypoints: waypoints,
        lineOptions: {
          styles: [{ color: "#6FA1EC", weight: 4 }],
        },
        show: false,
        addWaypoints: false,
        routeWhileDragging: true,
        draggableWaypoints: true,
        fitSelectedRoutes: true,
        showAlternatives: false,
      });

      newRoutingControl.on('routesfound', (e) => {
        const route = e.routes[0];
        const routeCoordinates = route.coordinates;
        const totalDistance = route.summary.totalDistance; // Distancia total en metros
        const pointDistance = distanciaEval; // Distancia deseada entre puntos (1 km)

        // Función para interpolar puntos
        const interpolatePoints = (coordinates, pointDistance) => {
          let accumulatedDistance = 0;
          let interpolatedPoints = [coordinates[0]]; // Inicia con el primer punto

          for (let i = 1; i < coordinates.length; i++) {
            const startPoint = coordinates[i - 1];
            const endPoint = coordinates[i];
            const distanceBetweenPoints = mapRef.current.distance(startPoint, endPoint); // Distancia entre dos puntos consecutivos

            accumulatedDistance += distanceBetweenPoints;

            // Si la distancia acumulada es mayor o igual a la distancia deseada (1 km en este caso)
            if (accumulatedDistance >= pointDistance) {
              const ratio = (pointDistance - (accumulatedDistance - distanceBetweenPoints)) / distanceBetweenPoints;
              const interpolatedLat = startPoint.lat + ratio * (endPoint.lat - startPoint.lat);
              const interpolatedLng = startPoint.lng + ratio * (endPoint.lng - startPoint.lng);
              interpolatedPoints.push(L.latLng(interpolatedLat, interpolatedLng));
              accumulatedDistance = 0; // Reiniciar la distancia acumulada
            }
          }

          return interpolatedPoints;
        };

        const points = interpolatePoints(routeCoordinates, pointDistance);
        setInterpolatedPoints(points); // Almacenar los puntos interpolados en el estado
      });

      // Añadir el nuevo control de rutas al mapa
      newRoutingControl.addTo(mapRef.current);
      routingControlRef.current = newRoutingControl; // Actualizar la referencia
    }
  }, [waypoints]);

  const handleGenerateRoute = (event) => {
    // ARREGLAR SINCRONISMO
    codePartida();
    codeFinal();
    console.log(coordenadasPartida);
    console.log(coordenadasFinal);
    setWaypoints([coordenadasPartida, coordenadasFinal]);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the Strapi API
        const response = await fetch('http://localhost:1337/api/nodos'); // Update endpoint if needed
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        // Convert response to JSON
        const data = await response.json();

        // Log the raw data
        console.log('Raw data from Strapi:', data);

        // Process the data to include the attributes
        const locationsData = data.data.map(location => ({
          lat: location.attributes.latitud,
          lon: location.attributes.longitud,
          nombre: location.attributes.nombre,
          comuna: location.attributes.comuna,
          propietario: location.attributes.propietario,
          T1: location.attributes.T1,
          T2: location.attributes.T2,
          T2SC: location.attributes.T2SC,
          CCST2: location.attributes.CCST2,
          CHADEMO: location.attributes.CHADEMO,
          GBTDC: location.attributes.GBTDC,
          direccion: location.attributes.direccion,
        }));

        // Log the processed locations data
        console.log('Processed locations data:', locationsData);

        // Update state with the processed data
        setLocations(locationsData);
        setFilteredLocations(locationsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSelectVehiculo = (event) => {
    const selectedValue = event.value;
    console.log(selectedValue)
    setSelectedVehiculo(selectedValue);
    console.log('Selected vehiculo:', selectedValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data from the Strapi API
        const response = await fetch('http://localhost:1337/api/vehiculos'); // Update endpoint if needed
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        
        // Convert response to JSON
        const data = await response.json();

        // Log the raw data
        console.log('Raw data from Strapi:', data);

        // Process the data to include the attributes
        const vehiculosData = data.data.map(vehiculo => ({
          marca: vehiculo.attributes.marca,
          modelo: vehiculo.attributes.modelo,
          capacidad: vehiculo.attributes.capacidad,
          rendimiento: vehiculo.attributes.rendimiento,
          T1: vehiculo.attributes.T1,
          T2: vehiculo.attributes.T2,
          T2SC: vehiculo.attributes.T2SC,
          CCST2: vehiculo.attributes.CCST2,
          CHADEMO: vehiculo.attributes.CHADEMO,
          GPTDC: vehiculo.attributes.GPTDC,
          tipo: vehiculo.attributes.tipo,
        }));

        // Log the processed locations data
        console.log('Processed locations data:', vehiculosData);

        // Update state with the processed data
        setvehiculos(vehiculosData);
        console.log(vehiculos)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const customIcon = L.icon({
    iconUrl: '/custom-marker.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
  });

  const handleMarkerClick = (location) => {
    setSelectedLocation(location);
    console.log(location);
    mapRef.current.flyTo(
      [location.lat, location.lon],
      14 // Zoom level
    );
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '' && selectedOptions.length === 0) {
      setFilteredLocations(locations);
      setSelectedLocation(null);
      return; // Exit the function early
    
  
    } else {
      const filtered = locations.filter((location) => {

        const attributes = location;
        console.log(attributes);
        // Check if the name matches the search query
        const nameMatches = attributes.direccion.toLowerCase().includes(searchQuery.toLowerCase());

        // Check if any of the selected options are set to 1 (true)
        const typesMatch = selectedOptions.some(option => attributes[option.value] > 0);

        // Return true if either condition is met
        return nameMatches && typesMatch;
      });

      setFilteredLocations(filtered);
      if (filtered.length > 0) {
        setSelectedLocation(filtered[0]);
        mapRef.current.flyTo(
          [filtered[0].lat, filtered[0].lon],
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

  const codePartida = async () => {
    if (!partida || !partida.formatted_address) {
      console.error('No place selected or address is not available');
      return;
    }
  
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address:partida.formatted_address,
          key: 'AIzaSyBbS1g7ohjBsnluB9jBVJ1WnEvsxNMjMJY' // Replace with your API key
        }
      });
  
      if (response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        setCoordenadasPartida(location); // Ensure setCoordinates is defined in your component
        console.log('Coordinates:', coordenadasPartida);
      } else {
        console.log('No results found');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  const codeFinal = async () => {
    if (!final || !final.formatted_address) {
      console.error('No place selected or address is not available');
      return;
    }
  
    try {
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
          address:final.formatted_address,
          key: 'AIzaSyBbS1g7ohjBsnluB9jBVJ1WnEvsxNMjMJY' // Replace with your API key
        }
      });
  
      if (response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        setCoordenadasFinal(location); // Ensure setCoordinates is defined in your component
        console.log('Coordinates:', location);
      } else {
        console.log('No results found');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  const handlePartida = (place) => {
    // Save the selected place data
    setPartida(place);
  };
  const handleFinal = (place) => {
    // Save the selected place data
    setFinal(place);
  };

  const buttonStyle = {
    display: 'flex',
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center',
    width: '50px', // Adjust size as needed
    height: '50px', // Adjust size as needed
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#fff', // White background or any color
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    cursor: 'pointer',
    overflow: 'hidden',
    position: 'relative',
  };
  
  const iconStyle = {
    width: '50px', // Adjust icon size
    height: '50px', // Adjust icon size
  };
  
  const buttonTextStyle = {
    display: 'none', // Hide text for round button
  };

  const MapButton = ({ imageSrc, altText, buttonText }) => {
    const handleClick = () => {
      let mapsUrl = '';
  
      if (waypoints.length === 2) {
        // If only 2 waypoints, go directly from start to end
        const [start, end] = waypoints;
        mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}&travelmode=driving`;
      } else if (waypoints.length > 2) {
        // If there are mid-waypoints, include them
        const [start, ...midAndEnd] = waypoints;
        const end = midAndEnd.pop(); // Take the last point as the destination
  
        const waypointsParam = midAndEnd
          .map(waypoint => `${waypoint.lat},${waypoint.lng}`)
          .join('|');
  
        mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${start.lat},${start.lng}&destination=${end.lat},${end.lng}&waypoints=${waypointsParam}&travelmode=driving`;
      }
  
      // Open Google Maps URL if it's generated
      if (mapsUrl) {
        window.open(mapsUrl, '_blank');
      }
    };
  
    return (
      <button style={buttonStyle} onClick={handleClick}>
        <img src={imageSrc} alt={altText} style={iconStyle} />
        {buttonText && <span style={buttonTextStyle}>{buttonText}</span>}
      </button>
    );
  };

  const WazeButton = ({ imageSrc, altText, buttonText }) => {
    const handleClick = () => {
      let wazeUrl = '';
  
      if (waypoints.length === 2) {
        // Direct route from start to end
        const [start, end] = waypoints;
        wazeUrl = `https://www.waze.com/es/live-map/directions?navigate=yes&to=ll.${end.lat},${end.lng}&from=ll.${start.lat},${start.lng}`;
      } else if (waypoints.length > 2) {
        // Route with waypoints
        const [start, ...midAndEnd] = waypoints;
        const end = midAndEnd.pop(); // Extract the last element as the destination
  
        const viaParams = midAndEnd
          .map(waypoint => `&via=ll.${waypoint.lat},${waypoint.lng}`)
          .join('|');
  
        wazeUrl = `https://www.waze.com/es/live-map/directions?navigate=yes&to=ll.${end.lat},${end.lng}&from=ll.${start.lat},${start.lng}${viaParams}`;
      }
  
      window.open(wazeUrl, '_blank');
    };
  
    return (
      <button style={buttonStyle} onClick={handleClick}>
        <img src={imageSrc} alt={altText} style={iconStyle} />
        {buttonText && <span style={buttonTextStyle}>{buttonText}</span>}
      </button>
    );
  };

  const PrettoSlider = styled(Slider)({
  });

  const containerStyle = {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
  };

  const calculateBoundingBox = (point1, point2) => {
    const halfWidth = anchoEval/2; // Convert to meters
    const bearing = L.GeometryUtil.bearing(point1, point2);
    const perpendicularBearing1 = bearing + 90; // Get perpendicular bearings
    const perpendicularBearing2 = bearing - 90;
  
    // Calculate the two corners of the rectangle on each side of the line
    const corner1 = L.GeometryUtil.destination(point1, perpendicularBearing1, halfWidth);
    const corner2 = L.GeometryUtil.destination(point1, perpendicularBearing2, halfWidth);
    const corner3 = L.GeometryUtil.destination(point2, perpendicularBearing1, halfWidth);
    const corner4 = L.GeometryUtil.destination(point2, perpendicularBearing2, halfWidth);
  
    return [corner1, corner2, corner4, corner3];
  };

  const isPointInsideRectangle = (point, rectangle) => {
    const [lat1, lon1] = [Math.min(rectangle[0].lat, rectangle[2].lat), Math.min(rectangle[0].lng, rectangle[2].lng)];
    const [lat2, lon2] = [Math.max(rectangle[0].lat, rectangle[2].lat), Math.max(rectangle[0].lng, rectangle[2].lng)];

    return point.lat >= lat1 && point.lat <= lat2 && point.lng >= lon1 && point.lng <= lon2;
  };

  const filterLocationsBetweenConsecutivePoints = () => {
    const widthInKm = 5000; // Set the width of the bounding box to 5 km
    let filtered = [];
    let polygonsArray = [];
    let locationsWithSegmentsMap = {};

    for (let i = 0; i < interpolatedPoints.length - 1; i++) {
      const point1 = interpolatedPoints[i];
      const point2 = interpolatedPoints[i + 1];

      const rectangle = calculateBoundingBox(point1, point2, widthInKm);

      // Create a Leaflet polygon from the rectangle points
      const polygon = L.polygon(rectangle);

      polygonsArray.push(polygon);

      // Create a layer group with the polygon
      const layerGroup = L.layerGroup([polygon]);

      // Filter locations that are inside the bounding box using leaflet-pip
      const locationsInSegment = locations.filter(location => {
        const latLng = L.latLng(location.lat, location.lon);
        const isInside = isPointInsideRectangle(latLng, rectangle);
        if (isInside) {
          if (!locationsWithSegmentsMap[i]) {
            locationsWithSegmentsMap[i] = [];
          }
          locationsWithSegmentsMap[i].push(location); // Store the location for this segment
        }
        return isInside;
      });

      filtered = [...filtered, ...locationsInSegment];
    }

    setFilteredLocations(filtered); // Store filtered locations
    setPolygons(polygonsArray); 
    setLocationsWithSegments(locationsWithSegmentsMap);
    findFurthestSegmentWithinRange(autonomy*1000);
    console.log(furthestSegment);
    findFurthestSegmentsWithinRange(autonomy*1000);

  };

  const findFurthestSegmentWithinRange = (maxDistance) => {
    let furthestSegment = null;
    let totalDistance = 0;
    let maxDistanceSoFar = 0;
  
    for (let i = 0; i < interpolatedPoints.length - 1; i++) {
      const startPoint = interpolatedPoints[i];
      const endPoint = interpolatedPoints[i + 1];
  
      if (!endPoint) continue;
  
      const segmentLength = mapRef.current.distance(startPoint, endPoint);
      totalDistance += segmentLength;
  
      // Check if the segment contains any locations
      const hasLocations = locationsWithSegments[i] && locationsWithSegments[i].length > 0;
  
      if (totalDistance <= maxDistance && totalDistance > maxDistanceSoFar && hasLocations) {
        furthestSegment = i;
        maxDistanceSoFar = totalDistance;
      }
    }
  
    setFurthestSegment(furthestSegment);
  }

  const findFurthestSegmentsWithinRange = (maxDistance) => {
    let segmentsWithLocations = [];
    let totalDistance = 0;
    let currentIndex = 0;
  
    // Continue searching until we reach the end
    while (currentIndex < interpolatedPoints.length - 1) {
      let furthestSegment = null;
      let maxDistanceSoFar = 0;
      let furthestSegmentLocations = [];
  
      for (let i = currentIndex; i < interpolatedPoints.length - 1; i++) {
        const startPoint = interpolatedPoints[i];
        const endPoint = interpolatedPoints[i + 1];
  
        if (!endPoint) continue;
  
        const segmentLength = mapRef.current.distance(startPoint, endPoint);
        totalDistance += segmentLength;
  
        // Check if the segment contains any locations
        const hasLocations = locationsWithSegments[i] && locationsWithSegments[i].length > 0;
  
        if (totalDistance <= maxDistance && totalDistance > maxDistanceSoFar && hasLocations) {
          furthestSegment = i;
          maxDistanceSoFar = totalDistance;
          furthestSegmentLocations = locationsWithSegments[i];
        }
      }
  
      // Save the furthest segment and its locations
      if (furthestSegment !== null) {
        segmentsWithLocations.push({
          segment: furthestSegment,
          locations: furthestSegmentLocations
        });
        currentIndex = furthestSegment + 1; // Start from the next segment
        totalDistance = 0; // Reset the total distance for the next iteration
      } else {
        break; // Exit the loop if no more valid segments are found
      }
    }
  
    // Save the result to a state or variable as needed
    setFurthestSegments(segmentsWithLocations);
    console.log(furthestSegments)
  };

  const renderFilteredLocations = () => {
    const locationsToRender = furthestSegments.flatMap(segment => segment.locations);

  return locationsToRender.map((location, index) => (
    <Circle
      key={index}
      center={[location.lat, location.lon]}
      radius={100} // Adjust radius as needed
      color="red"
      fillColor="red"
      fillOpacity={0.5}
    >
      <Popup>{location.nombre}</Popup>
    </Circle>
  ));
};

const handleCommentSubmit = (event, locationId) => {
  event.preventDefault();

  // Add the new comment and rating to the history
  setCommentHistory(prevHistory => {
    const newHistory = {
      ...prevHistory,
      [locationId]: [
        ...(prevHistory[locationId] || []),
        { comment: comments[locationId], rating: ratings[locationId] }
      ].slice(-10) // Keep only the last 10 comments
    };
    return newHistory;
  });

  // Optionally clear the inputs after submission
  setComments(prevComments => ({
    ...prevComments,
    [locationId]: ''
  }));
  setRatings(prevRatings => ({
    ...prevRatings,
    [locationId]: ''
  }));
};

const handleCommentChange = (event, locationId) => {
  setComments(prevComments => ({
    ...prevComments,
    [locationId]: event.target.value
  }));
};

const handleRatingChange = (event, locationId) => {
  setRatings(prevRatings => ({
    ...prevRatings,
    [locationId]: event.target.value
  }));
};

const CreatePane = () => {
  const map = useMap();

  useEffect(() => {
    if (!map.getPane('circlesPane')) {
      const pane = map.createPane('circlesPane');
      pane.style.zIndex = 500;
      pane.style.mixBlendMode = 'multiply'; // Prevent opacity stacking
      pane.style.filter = 'brightness(1)'; // Increase brightness
      pane.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'; 
    }
  }, [map]);

  return null; // This hook doesn't render anything
};

const handleChange = (event, newValue) => {
  setAutonomia(newValue); // Ensure state is updated
};

const handleAutonomyChange = (event) => {
  setAutonomy(event.target.value);
};

const handleSOCChange = (event) => {
  setAutonomy(event.target.value);
};

const getRandomLocations = (furthestsSegments) => {
  const puntosOptimo =  furthestSegments.map(segment => {
    const locations = segment.locations;
    if (locations.length > 0) {
      const randomIndex = Math.floor(Math.random() * locations.length);
      console.log(locations[randomIndex])
      return locations[randomIndex]; // Return a random location from the segment
    }
    return null; // In case a segment has no locations
  }).filter(location => location !== null); // Filter out any null values

  const newWaypoints = [
    waypoints[0], // Keep the first extreme
    ...puntosOptimo.map(location => ({ lat: location.lat, lng: location.lon })), // Add random locations
    waypoints[1], // Keep the second extreme
  ];

  console.log('Updated waypoints:', newWaypoints);
  setWaypoints(newWaypoints);

  
  

};



const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: '4px', // Reduce padding for header cells
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    padding: '4px', // Reduce padding for body cells
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(name, calories) {
  return { name, calories};
}

const rows = [
  createData('Modelo', selectedVehiculo?.modelo|| ""),
  createData('Autonomía [km]', selectedVehiculo?.capacidad|| ""),
  createData('Rendimiento [km/kWh]', selectedVehiculo?.rendimiento || ""),
  createData('Cargador', selectedVehiculo?.autonomia|| ""),
];


  return (
    
    <div>

    
      
    <AppBar  position="static" sx={{ backgroundColor: colorBarra1 }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            E - MAP Centro de Energía UC
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <button onClick={toggleVisibility}>
              Explorador
            </button>
          </Box>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <button onClick={toggleVisibility}>
              Planificador de ruta
            </button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
      
      <div 
      className="container"
      style={{
        position: 'relative',
      }}
      >


<div
  style={{
    position: 'absolute',
    backgroundColor: colorContExt,
    width: 420,
    height: 500,
    top: '10%',
    left: '10%',
    zIndex: isVisible ? 1000 : 0, // Lower zIndex when hidden
    borderRadius: '20px',
    pointerEvents: isVisible ? 'auto' : 'none', // Disable interactions when hidden
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.5s ease',
    border: '1px solid darkblue',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column' // Ensure the content stacks vertically
  }}
>
  {/* Title */}
  <Typography sx={{ color: colorLetras }} variant="h7" align="center" style={{ marginTop: '10px' }}>
    Filtros de Búsqueda
  </Typography>
  
  {/* Horizontal line */}
  <hr style={{ width: '90%', margin: '10px 0', border: `1px solid ${colorLin}`}}/>
  <div
    style={{
      background: `linear-gradient(to bottom, ${colorContInt1}, ${colorContInt2})`, // Correct usage of backticks
      width: 380,
      height: 460,
      borderRadius: '20px',
    }}
  >
    <Grid
      container
      direction="column"
      justifyContent="center"
      style={{ height: '100%', width: '100%', padding: '4px' }} // Padding for the entire Grid
    >
      <Grid item xs style={{ padding: '5px 0px', textAlign: 'center' }}> {/* Center the text */}
        <Typography sx={{ color: colorLetras }} variant="h7" align="center" style={{ marginBottom: '10px' }}>
          Indique Autonomía del vehículo
        </Typography>
        <Slider
          value={autonomia}
          min={80}
          max={580}
          onChange={handleChange}
          valueLabelDisplay="auto" // Only show the label when active (hover or during drag)
          sx={{
            color: '#52af77',
            height: 8,
            width: '85%',  // Add margin to both left and right
            '& .MuiSlider-thumb': {
              height: 24,
              width: 24,
              backgroundColor: '#fff',
              border: '2px solid currentColor',
            },
            '& .MuiSlider-valueLabel': {
              backgroundColor: '#52af77',
            },
          }}
        />
      </Grid>

      <Grid item xs style={{ padding: '5px 20px', textAlign: 'center' }}>
  <Typography sx={{ color: colorLetras }} variant="h7" align="center" style={{ marginBottom: '10px' }}>
    Indique tipo de cargador
  </Typography>

  {/* Select box on top */}
  <Select
    closeMenuOnSelect={false}
    isMulti
    options={cargadores}
    value={selectedOptions}
    onChange={setSelectedOptions} // Update the selected options state
    styles={{
      container: (base) => ({
        ...base,
        width: '100%',               // Full width of the parent container
        marginBottom: '5px',        // Space between select and input
      }),
      control: (base) => ({
        ...base,
        backgroundColor: elementInt,  // Light yellow background
        borderRadius: '5px',         // Rounded corners
        minHeight: '40px',           // Reduce the minimum height to make it thinner
        maxHeight: '40px',           // Keep the max height smaller for consistency
        overflowY: 'auto',           // Enable scrolling for multiple selections
        padding: '2px',              // Reduce padding to make it thinner
      }),
      valueContainer: (base) => ({
        ...base,
        padding: '0 8px',            // Slim down the value container padding
      }),
      input: (base) => ({
        ...base,
        margin: '0px',               // Remove margin around the input text
        padding: '0px',              // Remove padding to slim the input
      }),
      placeholder: (base) => ({
        ...base,
        color: colorTxtInt,            // Placeholder color
        fontSize: '14px',            // Smaller font size for placeholder text
      }),
      multiValue: (base) => ({
        ...base,
        backgroundColor: colorBtn,  // Background color for selected items
        fontSize: '12px',            // Smaller font size for selected items
        padding: '2px 4px',          // Slim down padding for selected items
      }),
      multiValueLabel: (base) => ({
        ...base,
        color: '#00796B',            // Text color for selected items
        whiteSpace: 'nowrap',        // Prevent text from wrapping
      }),
      multiValueRemove: (base) => ({
        ...base,
        fontSize: '12px',            // Smaller font size for remove icon
        padding: '0 4px',            // Smaller padding for the remove button
      }),
      menu: (base) => ({
        ...base,
        backgroundColor: elementInt,  // Background color for the dropdown menu
        color: colorTxtInt,             // Text color for options
      }),
    }}
  />

  {/* Container for Search Input and Button side by side */}
  <Grid container spacing={1} justifyContent="center" alignItems="center">
    <Grid item xs={8}>
      {/* Search input with margins and different background */}
      <input
        type="text"
        placeholder="Indique palabra clave"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update search query
        style={{
          width: '100%',                // Take full width of the grid item
          padding: '5px',              // Padding for better UX
          backgroundColor: elementInt,   // Light blue background color
          border: '1px solid #00796B',  // Add a border for clarity
          borderRadius: '5px',
        }}
      />
    </Grid>

    <Grid item xs={4}>
      {/* Button with different background color */}
      <button
        onClick={handleSearch}
        style={{
          width: '100%',               // Take full width of the grid item
          padding: '6px',
          backgroundColor: colorBtn,  // Darker green background
          color: colorTxtBtn,          // White text for contrast
          border: 'none',              // Remove default border
          borderRadius: '5px',         // Rounded corners
          cursor: 'pointer',           // Pointer cursor for interaction
        }}
      >
        Search
      </button>
    </Grid>
  </Grid>
</Grid>

<Grid item xs style={{ padding: '5px 20px', textAlign: 'center' }}>
  <Typography sx={{ color: colorLetras }} variant="h7" align="center" style={{ marginBottom: '10px' }}>
    Seleccione vehículo
  </Typography>
  <Select
        labelId="vehiculo-select-label"
        id="vehiculo-select"
        value={selectedVehiculo}
        label="Vehiculo Modelo"
        onChange={handleSelectVehiculo}
        options = {vehiculosOptions}
        styles={{
          container: (base) => ({
            ...base,
            width: '100%',               // Full width of the parent container
            marginBottom: '5px',        // Space between select and input
          }),
          control: (base) => ({
            ...base,
            backgroundColor: elementInt,  // Light yellow background
            borderRadius: '5px',         // Rounded corners
            minHeight: '40px',           // Reduce the minimum height to make it thinner
            maxHeight: '40px',           // Keep the max height smaller for consistency
            overflowY: 'auto',           // Enable scrolling for multiple selections
            padding: '2px',              // Reduce padding to make it thinner
          }),
          valueContainer: (base) => ({
            ...base,
            padding: '0 8px',            // Slim down the value container padding
          }),
          input: (base) => ({
            ...base,
            margin: '0px',               // Remove margin around the input text
            padding: '0px',              // Remove padding to slim the input
          }),
          placeholder: (base) => ({
            ...base,
            color: colorTxtInt,            // Placeholder color
            fontSize: '14px',            // Smaller font size for placeholder text
          }),
          multiValue: (base) => ({
            ...base,
            backgroundColor: colorBtn,  // Background color for selected items
            fontSize: '12px',            // Smaller font size for selected items
            padding: '2px 4px',          // Slim down padding for selected items
          }),
          multiValueLabel: (base) => ({
            ...base,
            color: '#00796B',            // Text color for selected items
            whiteSpace: 'nowrap',        // Prevent text from wrapping
          }),
          multiValueRemove: (base) => ({
            ...base,
            fontSize: '12px',            // Smaller font size for remove icon
            padding: '0 4px',            // Smaller padding for the remove button
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: elementInt,  // Background color for the dropdown menu
            color: colorTxtInt,             // Text color for options
          }),
        }}
      >
      </Select>
  </Grid>

      <Grid item xs style={{ padding: '5px 20px' }}>
      <TableContainer component={Paper}>
      <Table sx={{ minWidth: 100}} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell><StyledTableCell>{'Tipo de Vehículo'}</StyledTableCell></StyledTableCell>
            <StyledTableCell align="right">{selectedVehiculo?.tipo || ''}</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.name}>
              <StyledTableCell component="th" scope="row">
                {row.name}
              </StyledTableCell>
              <StyledTableCell align="right">{row.calories}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
      </Grid>
    </Grid>
  </div>
  <hr style={{ width: '60%', margin: '10px 0', border: `1px solid ${colorLin}`}} />
</div>

      <div
  style={{
    position: 'absolute',
    backgroundColor: '#80FFDB',
    width: 460,
    height: 380,
    top: '10%',
    left: '10%',
    zIndex: !isVisible ? 1000 : 0, // Higher zIndex when visible
    pointerEvents: !isVisible ? 'auto' : 'none', // Enable interactions only when visible
    borderRadius: '20px',
    opacity: !isVisible ? 1 : 0,
    transition: 'opacity 0.5s ease',
    border: '1px solid darkblue',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column' // Ensure the content stacks vertically
  }}
>
  {/* Title */}
  <Typography sx={{ color: colorLetras }} variant="h7" align="center" style={{ marginTop: '10px' }}>
    Planificador de ruta
  </Typography>
  
  {/* Horizontal line */}
  <hr style={{ width: '90%', margin: '10px 0', border: `1px solid ${colorLin}`}} />
  <div
    style={{
      background: 'linear-gradient(to bottom, cyan, white)',
      width: 430,
      height: 300,
      borderRadius: '20px',
    }}
  >
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ height: '100%', width: '100%', padding: '5px' }} 
        >
        <Grid item xs style={{ width: '80%', padding: '5px 0px', textAlign: 'center' }}>
    <Typography sx={{ color: colorLetras }} variant="h7" align="center">
      Indique punto de partida
    </Typography>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '10px',
        width: '100%', // Ensure full width
      }}
    >
      <Autocomplete
        style={{zIndex:9999, 
          width: '100%', // Full width
          height: '32px', // Fixed height
          fontSize: '16px', // Font size
          padding: '0 10px', // Padding
          border: '1px solid #00796B',  // Add a border for clarity
          borderRadius: '5px', // Rounded corners
          backgroundColor: elementInt, // Background color
          color: colorTxtInt, // Text color
          boxSizing: 'border-box', // Include padding in width}}
        }}
        apiKey={"AIzaSyBbS1g7ohjBsnluB9jBVJ1WnEvsxNMjMJY"}
        onPlaceSelected={handlePartida}
        placeholder= 'Indica el punto de partida'
        options={{
          types: ['address'],
          componentRestrictions: { country: 'cl' },
        }}
        styles={{
          container: {
            flex: 0,
          },
          textInput: {
            color: 'cyan',
            fontSize: 16,
          },
          predefinedPlacesDescription: {
            color: '#3caf50',
          },
        }}
      />
    </div>
  </Grid>
          <Grid item xs style={{ width: '80%', padding: '5px 0px', textAlign: 'center' }}>
            <Typography sx={{ color: colorLetras }} variant="h7" align="center">Indique punto de llegada </Typography>
            <div>
            <Autocomplete
              sx={{ color: colorLetras }}
              style={{zIndex:9999, 
                width: '100%', // Full width
                //height: '40px', // Fixed height
                height: '32px', // Fixed height
                fontSize: '16px', // Font size
                padding: '0 10px', // Padding
                border: '1px solid #00796B',  // Add a border for clarity
                borderRadius: '4px', // Rounded corners
                backgroundColor: elementInt,
                color: colorTxtInt, // Text color
                boxSizing: 'border-box', // Include padding in width}}
              }}
              apiKey={"AIzaSyBbS1g7ohjBsnluB9jBVJ1WnEvsxNMjMJY"}
              onPlaceSelected={handleFinal}
              placeholder= 'Indica el punto de llegada'
              options={{
                types: ['address'], // Specify types if needed
                componentRestrictions: { country: 'cl' } // Restrict to Chile
              }}
            />
          </div>
          </Grid>
          <Grid container style={{ width: '80%', padding: '0px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      {/* First Row: SOC and Autonomy */}
      <Grid style={{display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ color: colorLetras }} variant="h7" style={{ marginRight: '10px' }}>
          SOC
        </Typography>
        <TextField
          variant="outlined"
          placeholder="Enter SOC"
          type="number" // Restrict input to numbers
          inputProps={{ min: 0 }} // Set minimum value to 0
          size="small" // Make the text field smaller
          onChange={handleSOCChange}
          // style={{ maxWidth: '100px', height: '30px' }} // Adjust height and limit the maximum width
          InputProps={{
            style: {
              backgroundColor: elementInt, // Set background color to cyan
              color: colorTxtInt,
              height: '30px', // Set the height of the input
              width: '100px',
              padding: '10px 10px', // Adjust padding inside the input
              border: '1px solid #00796B',  // Add a border for clarity
              borderRadius: '4px', // Rounded corners
            },
          }}
        />
      </Grid>

      <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ color: colorLetras }} variant="h7" style={{ marginRight: '10px' }}>
          Autonomía
        </Typography>
        <TextField
          variant="outlined"
          placeholder="Enter Autonomy"
          type="number" // Restrict input to numbers
          inputProps={{ min: 0 }} // Set minimum value to 0
          size="small" // Make the text field smaller
          onChange={handleAutonomyChange}
          // style={{ maxWidth: '100px', height: '30px' }} // Adjust height and limit the maximum width
          InputProps={{
            style: {
              backgroundColor: elementInt, // Set background color to cyan
              color: colorTxtInt,
              height: '30px', // Set the height of the input
              width: '100px',
              padding: '0 10px', // Adjust padding inside the input
              border: '1px solid #00796B',  // Add a border for clarity
              borderRadius: '4px', // Rounded corners
            },
          }}
        />
      </Grid>
    </Grid>
    <Grid container style={{ width: '80%', padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <button
            onClick={handleGenerateRoute}
            style={{
              backgroundColor: colorBtn,
              color: colorTxtBtn,
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px', // Reduced padding for smaller buttons
              margin: '4px', // Reduced margin for smaller spacing
              fontSize: '14px', // Optional: Adjust font size for smaller appearance
            }}
          >
            Mostrar ruta
          </button>

          <button
            onClick={filterLocationsBetweenConsecutivePoints}
            style={{
              backgroundColor: colorBtn,
              color: colorTxtBtn,
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px', // Reduced padding for smaller buttons
              margin: '4px', // Reduced margin for smaller spacing
              fontSize: '14px', // Optional: Adjust font size for smaller appearance
            }}
          >
            Puntos en ruta
          </button>

          <button
            onClick={getRandomLocations}
            style={{
              backgroundColor: colorBtn,
              color: colorTxtBtn,
              border: 'none',
              borderRadius: '4px',
              padding: '4px 8px', // Reduced padding for smaller buttons
              margin: '4px', // Reduced margin for smaller spacing
              fontSize: '14px', // Optional: Adjust font size for smaller appearance
            }}
          >
            Optimizar
          </button>
          </Grid>
          <Grid style={{width: '30%'}}>
          <div>
      <div style={containerStyle}>
        <MapButton
          imageSrc="https://upload.wikimedia.org/wikipedia/commons/b/bd/Google_Maps_Logo_2020.svg"
          altText="Google Maps"
          buttonText="Google Maps"
        />
        <WazeButton
          imageSrc="https://www.grupoautocontrol.com/wp-content/uploads/2022/06/Waze-Logo-1.png"
          altText="Waze"
          buttonText="Waze"
        />
      </div>
    </div>
          </Grid>
        </Grid>
      </div>
      <hr style={{ width: '60%', margin: '10px 0', border: `1px solid ${colorLin}`}} />
      </div>

    <MapContainer
        center={[-38.8, -73]}
        zoom={4}
        style={{ height: '90vh', width: '100vw' }}
        ref={mapRef}
      >
        <CreatePane />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.jawg.io/jawg-dark/{z}/{x}/{y}{r}.png?access-token=o1PNTKJSQoSiFtkp86yCHdSgS8Uy3cCrV3fM8evMVj7suODcZqRFbn3zFqo5Qwvh"
          
        />
      {renderFilteredLocations()}

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
        <FeatureGroup>
        {Array.isArray(filteredLocations) &&
          filteredLocations.map((location) => (
            <Circle
              key={location.id}
              center={[location.lat, location.lon]}
              radius={autonomia*1000} // Adjust the radius as needed
              color="#5390D9"
              fillColor="#5390D9" // Bright cyan fill
              fillOpacity={1}
              pane="circlesPane" // Use a custom pane to prevent overlapping opacity
              weight={1}
              eventHandlers={{
                click: () => handleMarkerClick(location),
              }}
            >
              
              <Popup>
        <div style={{ width: '300px', height: 'auto', paddingTop: '10px' }}>
          <h3>{location.nombre}</h3>
          <p>{location.direccion}</p>
          {location.photoUrl && (
            <img
              src={location.photoUrl}
              alt={location.nombre}
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          )}
          <form onSubmit={(event) => handleCommentSubmit(event, location.idx)}>
            <div>
              <label>
                Rating:
                <select
                  value={ratings[location.idx] || ""}
                  onChange={(event) => handleRatingChange(event, location.idx)}
                >
                  <option value="">Select rating</option>
                  {[1, 2, 3, 4, 5].map(star => (
                    <option key={star} value={star}>{star}</option>
                  ))}
                </select>
              </label>
            </div>
            <div>
              <textarea
                value={comments[location.idx] || ""}
                onChange={(event) => handleCommentChange(event, location.idx)}
                placeholder="Leave a comment..."
                rows="3"
                cols="30"
              />
            </div>
            <button type="submit">Submit Comment</button>
          </form>
          <div>
            <h4>Previous Comments:</h4>
            <ul>
              {(commentHistory[location.idx] || []).map((entry, i) => (
                <li key={i}>
                  <strong>Rating: {entry.rating || "N/A"}</strong>
                  <p>{entry.comment || "No comment"}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Popup>
            </Circle>
          ))}
      </FeatureGroup>
        {polygonPoints.length > 0 && (
          <Polygon positions={polygonPoints} color="blue" fillOpacity={0.5} />
        )}
      </MapContainer>
  </div>
      
    </div>
  );
};

export default Map;