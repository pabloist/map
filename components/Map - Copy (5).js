import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, FeatureGroup, Circle, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
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
import { Grid } from '@mui/material';
import Slider, { SliderThumb } from '@mui/material/Slider';
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
  const [furthestSegments, setFurthestSegments] = useState([])
  const cargadores = [
    { value: 'T1', label: 'T1' },
    { value: 'T2', label: 'T2' },
    { value: 'T2SC', label: 'T2SC' },
    { value: 'ChaDEMO', label: 'ChaDEMO' },
    { value: 'CCST2', label: 'CCST2' },
    { value: 'GP/T DC', label: 'GP/T DC' },
  ];
  const colorLetras = useState("black");
  

  // Step 2: Toggle visibility function
  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  useEffect(() => {
    if (mapRef.current) {
      // Eliminar el control de ruta existente si ya está añadido
      if (routingControlRef.current) {
        mapRef.current.removeControl(routingControlRef.current);
      }

      // Crear nuevo control de ruta con Google Routing
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

  const handleGenerateRoute = () => {
    codePartida();
    codeFinal();
    const randomLocation1 = coordenadasPartida;
    const randomLocation2 = coordenadasFinal;
    console.log(coordenadasPartida);
    console.log(coordenadasFinal);
    setWaypoints([randomLocation1, randomLocation2]);
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
        console.log('Coordinates:', location);
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
    width: '80px', // Adjust size as needed
    height: '80px', // Adjust size as needed
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
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${coordenadasPartida.lat},${coordenadasPartida.lng}&destination=${coordenadasFinal.lat},${coordenadasFinal.lng}&travelmode=driving`;
      window.open(mapsUrl, '_blank');
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
      const wazeUrl = `https://www.waze.com/es/live-map/directions?navigate=yes&to=ll.${coordenadasFinal.lat},${coordenadasFinal.lng}&from=ll.${coordenadasPartida.lat},${coordenadasPartida.lng}`;
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
    color: '#52af77',
    height: 8,
    '& .MuiSlider-track': {
      border: 'none',
    },
    '& .MuiSlider-thumb': {
      height: 24,
      width: 24,
      backgroundColor: '#fff',
      border: '2px solid currentColor',
      '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
        boxShadow: 'inherit',
      },
      '&::before': {
        display: 'none',
      },
    },
    '& .MuiSlider-valueLabel': {
      lineHeight: 1.2,
      fontSize: 12,
      background: 'unset',
      padding: 0,
      width: 32,
      height: 32,
      borderRadius: '50% 50% 50% 0',
      backgroundColor: '#52af77',
      transformOrigin: 'bottom left',
      transform: 'translate(50%, -100%) rotate(-45deg) scale(0)',
      '&::before': { display: 'none' },
      '&.MuiSlider-valueLabelOpen': {
        transform: 'translate(50%, -100%) rotate(-45deg) scale(1)',
      },
      '& > *': {
        transform: 'rotate(45deg)',
      },
    },
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
    findFurthestSegmentWithinRange(80000);
    console.log(furthestSegment);
    findFurthestSegmentsWithinRange(80000);

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

  return (
    
    <div>
      <button onClick={filterLocationsBetweenConsecutivePoints}>Filter Locations</button>

    
      
    <AppBar position="static">
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
            LOGO
          </Typography>

          <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            LOGO
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
          backgroundColor: 'white',
          width: 500,
          height: 500,
          top: '10%',
          left: '10%',
          zIndex: 10000,
          display: isVisible ? 'block' : 'none',
          opacity: isVisible ? 1 : 0,
          transition: 'opacity 2s ease',
        }}
      >
      <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ height: '100%', width: '100%' }}
        >
          <Grid item xs>
            <Typography sx={{ color: colorLetras }} variant="h6" align="center">Indique Autonomía del vehículo</Typography>
            <PrettoSlider
              valueLabelDisplay="auto"
              aria-label="pretto slider"
              defaultValue={20}
            />
          </Grid>
          <Grid item xs>
            <Typography sx={{ color: colorLetras }} variant="h6" align="center">Indique tipo de cargador </Typography>
            <Select
            closeMenuOnSelect={false}
            isMulti
            options={cargadores}
            />
          </Grid>
          <Grid item xs>
            <Typography variant="h6" align="center">Third Division</Typography>
          </Grid>
          <Grid item xs>
            <Typography variant="h6" align="center">Fourth Division</Typography>
          </Grid>
        </Grid>
      </div>
      <div
        style={{
          position: 'absolute',
          backgroundColor: 'white',
          width: 400,
          height: 400,
          top: '10%', // Adjusted to avoid overlap
          left: '10%',
          zIndex: 1000,
          display: !isVisible ? 'block' : 'none',
          opacity: !isVisible ? 1 : 0,
          transition: 'opacity 2s ease',
        }}
      >
        <Grid
          container
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ height: '100%', width: '100%' }}
        >
          <Grid item xs>
            <Typography sx={{ color: colorLetras }} variant="h6" align="center">Indique punto de partida</Typography>
            <div>
            <Autocomplete
              sx={{ color: colorLetras }}
              style={{zIndex:9999}}
              apiKey={"AIzaSyBbS1g7ohjBsnluB9jBVJ1WnEvsxNMjMJY"}
              onPlaceSelected={handlePartida}
              options={{
                types: ['address'], // Specify types if needed
                componentRestrictions: { country: 'cl' } // Restrict to Chile
              }}
            />
          </div>


          </Grid>
          <Grid item xs>
            <Typography sx={{ color: colorLetras }} variant="h6" align="center">Indique punto de llegada </Typography>
            <div>
            <Autocomplete
              sx={{ color: colorLetras }}
              style={{zIndex:9999}}
              apiKey={"AIzaSyBbS1g7ohjBsnluB9jBVJ1WnEvsxNMjMJY"}
              onPlaceSelected={handleFinal}
              options={{
                types: ['address'], // Specify types if needed
                componentRestrictions: { country: 'cl' } // Restrict to Chile
              }}
            />
          </div>
          </Grid>
          <Grid item xs>
          <button
            onClick={handleGenerateRoute}
            style={{ backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 16px', margin: '8px' }}
          >
            Generar ruta
          </button>
          </Grid>
          <Grid item xs>
          <div>
      <h1>Directions Buttons</h1>
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

    <MapContainer
        center={[-38.8, -73]}
        zoom={4}
        style={{ height: '90vh', width: '100vw' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          
        />
        {polygons.map((polygon, index) => (<Polygon key={index} positions={polygon.getLatLngs()} color="blue" weight={2} />))}
        {interpolatedPoints.map((point, index) => (
        <Marker key={index} position={[point.lat, point.lng]}>
          <Popup>Point {index + 1}</Popup>
        </Marker>
      ))}
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
              radius={200} // Adjust the radius as needed
              color="blue"
              fillColor="#30f"
              fillOpacity={0.5}
              eventHandlers={{
                click: () => handleMarkerClick(location),
              }}
            >
              <Popup>
                <div style={{ width: '300px', height: 'auto', paddingTop: '10px' }}>
                  <h3>{location.name}</h3>
                  {selectedLocation?.id === location.id && (
                    <div>
                      <p>{location.direccion}</p>
                      {location.photoUrl && (
                        <img
                          src={location.photoUrl}
                          alt={location.name}
                          style={{ maxWidth: '100%', height: 'auto' }}
                        />
                      )}
                    </div>
                  )}
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
