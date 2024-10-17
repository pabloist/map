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
import Autocomplete from "react-google-autocomplete";
import axios from 'axios';
import { Grid, TextField} from '@mui/material';
import Paper from '@mui/material/Paper';
import { Slider } from '@mui/material';
import { styled } from '@mui/material/styles';
import Select from 'react-select';
import 'lrm-google';
import 'leaflet-geometryutil'; // Import GeometryUtil
import { FaStar } from 'react-icons/fa';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useTheme, useMediaQuery } from '@mui/material';





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
  const [coordenadasPartida, setCoordenadasPartida] = useState(null);
  const [coordenadasFinal, setCoordenadasFinal] = useState(null);
  const [partida, setPartida] = useState(null);
  const [final, setFinal] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [interpolatedPoints, setInterpolatedPoints] = useState([])
  const [polygons, setPolygons] = useState([]);
  const [distanciaEval, setDistanciaEval] = useState([5000]);
  const [anchoEval, setAnchoEval] = useState([2000]);
  const [locationsWithSegments, setLocationsWithSegments] = useState({});
  const [furthestSegments, setFurthestSegments] = useState([]);
  const [comments, setComments] = useState({});
  const [autonomia, setAutonomia] = useState(2);
  const [ratings, setRatings] = useState({});
  const [commentHistory, setCommentHistory] = useState({});
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [autonomy, setAutonomy] = useState(null);
  const [soc, setSoc] = useState(null);
  const [vehiculos, setvehiculos] = useState([]);
  const [selectedVehiculo, setSelectedVehiculo] = useState();
  const [chargerNames, setChargerNames] = useState([]);
  const cargadores = [
    { value: 'T1', label: 'T1' },
    { value: 'T2', label: 'T2' },
    { value: 'T2SC', label: 'T2SC' },
    { value: 'CHADEMO', label: 'CHADEMO' },
    { value: 'CCST2', label: 'CCST2' },
    { value: 'GBTDC', label: 'GP/T DC' },
  ];
  const colorLetras = "#03045E";
  const colorBarra1 = '#48CAE4'; // Color de la barra de opciones
  const colorBarra2 = "cyan";  // Segundo color de degradado de la barra de APP
  const colorContExt = '#CAF0F8';  // Color del elemento externo
  const colorContBord = "blue";
  const colorContInt1 = '#56CFE1';
  const colorContInt2 = '#56CFE1';
  const elementInt = "#CAF0F8";
  const colorLin = "#03045E";
  const colorBtn = "#03045E";
  const colorTxtBtn = "white";
  const colorTxtInt = "gray";
  const fuente = 'Arial, sans-serif';
  const [open, setOpen] = useState(false); // Estado para controlar el popup
  const [open2, setOpen2] = useState(false); // Estado para controlar el popup
  const [COVOpen, setCOVOpen] = useState(false); // Estado para controlar el popup
  const pesoFuente = 600
  const vehiculosOptions = vehiculos.map(vehiculo => ({
    value: vehiculo, // The value to be used in the select
    label: vehiculo.marca + " | " +vehiculo.modelo, // The label displayed to the user
  }));

  const sizeTitulo = {
    xs: '0.8rem',  // For extra-small screens (phones)
    sm: '1.25rem', // For small screens (tablets)
    md: '1rem',  // For medium screens (small desktops)
    lg: '1.3rem',  // For large screens (large desktops)
    xl: '1.3rem', // For extra-large screens
  }

  const paddingBox = {
    xs: '0px 4px', // Padding for extra small screens
    sm: '0px 4px', // Padding for small screens
    md: '2px 8px', // Padding for medium screens
    lg: '2px 12px', // Padding for large screens
    xl: '2px 15px', // Padding for extra large screens
  }
  const sizeBoxTitle = { xs: '0.8rem', sm: '1.2rem', md: '1.4rem', lg: '1.6rem', xl: '1.2rem' }   // Tamaño de letra título barra
  const sizeBig = { xs: '0.7rem', sm: '1.2rem', md: '1.4rem', lg: '1rem', xl: '1rem'}  // Tamaño de letra subtitulos

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: colorBtn,
      color: colorTxtBtn,
      borderRadius: '7px',
      padding: '1px',
      fontSize: '0.6rem', // Default font size for small screens
      [theme.breakpoints.up('sm')]: {
        fontSize: '1rem', // Font size for small screens
        padding: '0.5px',
      },
      [theme.breakpoints.up('md')]: {
        fontSize: '1.2rem', // Font size for medium screens
        padding: '1px',
      },
      [theme.breakpoints.up('lg')]: {
        fontSize: '1.5rem', // Font size for large screens
        padding: '2px',
      },
      [theme.breakpoints.up('xl')]: {
        fontSize: '0.8rem', // Font size for extra large screens
        padding: '2px',
      },
    },
    [`&.${tableCellClasses.body}`]: {
      padding: '4px', // Reduce padding for body cells
      // Responsive font size for body cells
      [theme.breakpoints.down('sm')]: {
        fontSize: '10px',  // For small screens
      },
      [theme.breakpoints.up('md')]: {
        fontSize: '12px',  // For medium and larger screens
      },
      [theme.breakpoints.up('lg')]: {
        fontSize: '13px',  // For large screens
      },
      [theme.breakpoints.up('xl')]: {
        fontSize: '13px',  // For extra large screens
      },
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: elementInt,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const theme = useTheme();

  // Media queries for breakpoints
  const isXs = useMediaQuery(theme.breakpoints.down('xs'));
  const isSm = useMediaQuery(theme.breakpoints.between('xs', 'sm'));
  const isMd = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isLg = useMediaQuery(theme.breakpoints.between('md', 'lg'));
  const isXl = useMediaQuery(theme.breakpoints.up('lg'));

  // Define dynamic styles based on breakpoints
  const getResponsiveHeight = () => {
    if (isXs) return { minHeight: '5px', maxHeight: '30px', height: '30px' };
    if (isSm) return { minHeight: '5px', maxHeight: '30px', height: '30px' };
    if (isMd) return { minHeight: '5px', maxHeight: '37px', height: '37px' };
    if (isLg) return { minHeight: '5px', maxHeight: '37px', height: '37px' };
    if (isXl) return { minHeight: '5px', maxHeight: '37px', height: '37px' };
    return { minHeight: '5px', maxHeight: '37px', height: '37px' }; // Default for unknown cases
  };

  const getResponsiveFontSize = () => {
    if (isXs) return { fontSize: '10px' };
    if (isSm) return { fontSize: '10px' };
    if (isMd) return { fontSize: '12px' };
    if (isLg) return { fontSize: '15px' };
    if (isXl) return { fontSize: '15px' };
    return { fontSize: '16px' }; // Default font size
  };

  const selectStyles = {
    container: (base) => ({
      ...base,
      width: '100%',               // Full width of the parent container
      marginBottom: '5px',        // Space between select and input
    }),
    control: (base) => ({
      ...base,
      ...getResponsiveHeight(),
      backgroundColor: elementInt,  // Light yellow background
      borderRadius: '8px',         // Rounded corners
      overflowY: 'auto',           // Enable scrolling for multiple selections
      padding: '0px',              // Reduce padding to make it thinner
    }),
    valueContainer: (base) => ({   // Space for selected values
      ...base,
      padding: '0 8px',            // Slim down the value container padding
    }),
    placeholder: (base) => ({     // Placeholder text
      ...base,
      ...getResponsiveFontSize(),
      color: colorTxtInt,                      
    }),
    multiValue: (base) => ({      // Selected values
      ...base,
      ...getResponsiveFontSize(),
      backgroundColor: colorBtn,          
    }),
    multiValueLabel: (base) => ({  // Selected text color
      ...base,
      color: 'white',           
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: elementInt,  // Background color for the dropdown menu
      color: colorTxtInt,             // Text color for options
    }),
    dropdownIndicator: (base) => ({
      ...base,
      paddingTop: 0,
      height: '1px',
      paddingBottom: 0,
    }),
    clearIndicator: (base) => ({
      ...base,
      paddingTop: 0,
      paddingBottom: 0,
      height: '1px',
    }),
    
  };



  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleCOVOpen= () => {
    setCOVOpen(true);
  };

  const handleCOVClose= () => {
    setCOVOpen(false);
  };

  const handleTooltipOpen2 = () => {
    setOpen2(true);
  };

  const handleTooltipClose2 = () => {
    setOpen2(false);
  };

  // Controlador de mapeo
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
        show: true,
        addWaypoints: false,
        routeWhileDragging: true,
        draggableWaypoints: true,
        fitSelectedRoutes: true,
        showAlternatives: false,
        provideRouteAlternatives : true,
        createMarker: function(i, wp, nWps) {
          if (i === 0 || i === nWps - 1) {
              return L.marker(wp.latLng, {icon: customIcon });
          } else {
              return L.marker(wp.latLng, {icon: customIcon });
          }
      }
      });
      newRoutingControl.getRouter().show = false;
      newRoutingControl.on('routesfound', (e) => {
        const controlContainer = document.querySelector('.leaflet-routing-container');
        if (controlContainer) {
          controlContainer.style.display = 'none'; // Hides the panel
        }
        const route = e.routes[0];
        const routeCoordinates = route.coordinates;
        const totalDistance = route.summary.totalDistance; // Distancia total en metros
        const pointDistance = distanciaEval; // Distancia deseada entre puntos

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

  // Generar ruta desde el punto inicial al punto final. ARREGLAR SINCRONISMO
  const handleGenerateRoute = (event) => {
    setAutonomia(2)
    codePartida();
    codeFinal();
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

  // Obtener data de las localizaciones de Strapi
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener data de servidor de STRAPI
        const response = await fetch('http://localhost:1337/api/nodos');
        if (!response.ok) {
          throw new Error('No se pudo extraer la información de las localizaciones del Servidor');
        }
        
        // Convert response to JSON
        const data = await response.json();

        // Log the raw data
        console.log('Raw Data de localizaciones:', data);

        // Process the data to include the attributes
        const locationsData = data.data.map(location => ({
          IDEN: location.id,
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

        // Mostrar la información rescatada
        console.log('Data procesada de las localizaciones:', locationsData);

        // Actualizar los estados
        setLocations(locationsData);
        setFilteredLocations(locationsData);
      } catch (error) {
        console.error('Error al rescatar información del servidor:', error);
      }
    };

    fetchData();
  }, []);

  // Obtener data de vehículos de Strapi
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener data a través de la api del servidor
        const response = await fetch('http://localhost:1337/api/vehiculos');
        if (!response.ok) {
          throw new Error('No se pudo extraer la información de los vehículos desde Strapi');
        }
        
        // Convert response to JSON
        const data = await response.json();

        // Log the raw data
        console.log('Raw Data de vehículos de Strapi:', data);

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
        console.log('Data procesada de vehículos de Strapi:', vehiculosData);

        // Update state with the processed data
        setvehiculos(vehiculosData);
        console.log(vehiculos)
      } catch (error) {
        console.error('Error al extraer la data de vehículos desde Strapi:', error);
      }
    };

    fetchData();
  }, []);

  // Obtener data de comentarios de localizaciones de Strapi
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener toda la data de comentarios de Strapi
        const response = await axios.get('http://localhost:1337/api/nodos');
        
        const locations = response.data.data;
  
        // Generar un historial de comentarios
        const allComments = locations.reduce((acc, location) => {
          acc[location.id] = location.attributes.comentario || [];
          return acc;
        }, {});

        console.log("comentario")
        console.log(allComments)
  
        // Actualizar estado de historial de comentarios
        setCommentHistory(allComments);
      
      } catch (error) {
        console.error('Error al extraer la data de comentarios de Strapi:', error);
      }
    };
  
    // Trigger the fetch when the component mounts
    fetchData();
  }, []); // Empty dependency array to only run once when the component mounts

  // Vehículo seleccionado
  const handleSelectVehiculo = (event) => {
    const selectedValue = event.value;
    setSelectedVehiculo(selectedValue);
    setAutonomy(selectedValue.capacidad)
    const chargers = getChargers(selectedValue);
    setChargerNames(chargers);
    handleCargador(cargadores.filter(c => chargers.includes(c.value)));
  };

  const customIcon = L.icon({
    iconUrl: '/blue-marker.png',
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
      return; // Exit the function early
    
  
    } else {
      const filtered = locations.filter((location) => {

        const attributes = location;
        console.log(attributes);
        // Check if the name matches the search query
        const nameMatches = attributes.direccion.toLowerCase().includes(searchQuery.toLowerCase());

        // Return true if either condition is met
        return nameMatches;
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
      const locationsInSegment = filteredLocations.filter(location => {
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
    findFurthestSegmentsWithinRange(soc*1000, autonomy*1000);

  };

  const findFurthestSegmentsWithinRange = (initialDistance, maxDistance) => {
    let segmentsWithLocations = [];
    let totalDistance = 0;
    let currentIndex = 0;
    let currentMaxDistance = initialDistance; // Use initialDistance for the first iteration
  
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
  
        if (totalDistance <= currentMaxDistance && totalDistance > maxDistanceSoFar && hasLocations) {
          furthestSegment = i;
          maxDistanceSoFar = totalDistance;
          furthestSegmentLocations = locationsWithSegments[i];
        }
      }
  
      // Save the furthest segment and its locations
      if (furthestSegment !== null) {
        segmentsWithLocations.push({
          segment: furthestSegment,
          locations: furthestSegmentLocations,
        });
        currentIndex = furthestSegment + 1; // Start from the next segment
        totalDistance = 0; // Reset the total distance for the next iteration
        currentMaxDistance = maxDistance; // Switch to maxDistance for the next cycle
      } else {
        break; // Exit the loop if no more valid segments are found
      }
    }
  
    // Save the result to a state or variable as needed
    setFurthestSegments(segmentsWithLocations);
    console.log(furthestSegments);
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
  setSoc(event.target.value);
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

function createData(name, calories) {
  return { name, calories};
}

const getChargers = (vehicle) => {
  const chargers = [];
  if (vehicle.T1 > 0) chargers.push("T1");
  if (vehicle.T2 > 0) chargers.push("T2");
  if (vehicle.T2SC > 0) chargers.push("T2SC");
  if (vehicle.GPTDC > 0) chargers.push("GPTDC");
  if (vehicle.CHADEMO > 0) chargers.push("CHADEMO");
  if (vehicle.CCST2 > 0) chargers.push("CCST2");
  return chargers.length > 0 ? chargers : [];
};

const rows = [
  createData('Modelo', selectedVehiculo?.modelo|| ""),
  createData('Autonomía [km]', selectedVehiculo?.capacidad|| ""),
  createData('Rendimiento [km/kWh]', selectedVehiculo?.rendimiento || ""),
  createData('Cargador', chargerNames.join(' | ') || ""),
];

const StarRating = ({ locationIdx, ratings, handleRatingChange }) => {
  const [hover, setHover] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {[...Array(5)].map((star, i) => {
        const ratingValue = i + 1;

        return (
          <label key={i} style={{ cursor: 'pointer' }}>
            <input
              type="radio"
              name={`rating-${locationIdx}`}
              value={ratingValue}
              onClick={() => handleRatingChange(ratingValue, locationIdx)}
              style={{ display: 'none' }}
            />
            <FaStar
              size={24}
              color={ratingValue <= (hover || ratings[locationIdx]) ? "#ffc107" : "#a9a9a9"}
              onMouseEnter={() => setHover(ratingValue)}
              onMouseLeave={() => setHover(null)}
            />
          </label>
        );
      })}
    </div>
  );
};

const handleCommentSubmit = async (event, locationId) => {
  event.preventDefault();
  
  const newComment = {
    user: "Current User",  // Replace with logged-in user info
    comment: comments[locationId],  // The comment entered by the user
    rating: ratings[locationId],    // The rating entered by the user
    date: new Date().toISOString()    // Add a timestamp
  };

  try {
    // Fetch existing comments from Strapi for this location
    const response = await axios.get(`http://localhost:1337/api/nodos/${locationId}`);
    const existingComments = response.data.data.attributes.comentario || [];

    // Append new comment to the existing ones
    const updatedComments = [...existingComments, newComment];

    console.log("1")
    console.log(updatedComments)
    console.log("2")

    // Update comments in Strapi
    await axios.put(`http://localhost:1337/api/nodos/${locationId}`, {
      data: {
        comentario: updatedComments
      }
    });

    // Update commentHistory in your local state to reflect the new comment
    setCommentHistory(prev => ({
      ...prev,
      [locationId]: updatedComments
    }));

    // Clear comment input after submission
    setComments(prev => ({
      ...prev,
      [locationId]: ''
    }));

  } catch (error) {
    console.error('Error submitting comment:', error);
  }
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

const handleCargador = (selectedOptions) => {
  setSelectedOptions(selectedOptions);
  
  // Add any additional logic here
  console.log('Selected options:', selectedOptions);

  {
    if (selectedOptions.length === 0) {
      setFilteredLocations(locations);
      setSelectedLocation(null);
      return; // Exit the function early
    
  
    } else {
      const filtered = locations.filter((location) => {

        const attributes = location;

        // Check if any of the selected options are set to 1 (true)
        const typesMatch = selectedOptions.some(option => attributes[option.value] > 0);

        // Return true if either condition is met
        return typesMatch;
      });

      setFilteredLocations(filtered);
      if (filtered.length > 0) {
        setSelectedLocation(filtered[0]);
        mapRef.current.flyTo(
          [filtered[0].lat, filtered[0].lon],
          8 // Zoom level
        );
      } else {
        setSelectedLocation(null);
      }
    }
  };
  // Example: Do something with the selected options
};

const marks = [
  {
    value: 80,
    label: '80 km.',
  },
  {
    value: 580,
    label: '580 km.',
  },
  {
    value: 330,
    label: '330 km.',
  },
];

function valuetext(value) {
  return `${value}°C`;
}





  return (
    
    <div>

    
      
<AppBar position="static" sx={{ background: `linear-gradient(to bottom, ${colorBarra1}, ${colorBarra2})` }}>
  <Container maxWidth="xl">
    <Toolbar disableGutters>
      {/* Este icono ahora es visible en pantallas pequeñas */}
      <img
        src="logo.png"  // Provide the correct path to your image
        alt="App logo"
        style={{ display: 'flex', marginRight: '8px', width: '80px', height: '30px' }} // Adjust size and styling as necessary
      />

      {/* Título visible en pantallas pequeñas */}
      <Typography
        variant="h6"
        noWrap
        component="a"
        href="#app-bar-with-responsive-menu"
        sx={{
          display: { xs: 'none', md: 'block' },
          fontSize: sizeTitulo,
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.03rem',
          color: 'gray',
          textDecoration: 'none',
        }}
      >
        E - MAP Centro de Energía UC
      </Typography>

      {/* Botones visibles en pantallas pequeñas */}
      <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'flex' }, justifyContent: 'space-between' }}>
      <Button
        onClick={() => setIsVisible(true)}
        sx={{
          fontSize: { xs: '0.6rem', sm: '1rem', md: '1.2rem', lg: '1.2rem', xl: '1rem' }, // Font sizes based on screen size
          padding: '10px 20px',
        }}
      >
        Explorador
      </Button>

        <Button onClick={() => setIsVisible(false)}
        sx={{
            fontSize: { xs: '0.6rem', sm: '1rem', md: '1rem' }, // Font sizes based on screen size
            padding: '10px 20px',
          }}>
          Planificador de ruta
        </Button>
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


<Box
  sx={{
    position: 'absolute',
    backgroundColor: colorContExt,
    zIndex: isVisible ? 1000 : 0,
    borderRadius: '20px',
    pointerEvents: isVisible ? 'auto' : 'none',
    opacity: isVisible ? 1 : 0,
    transition: 'opacity 0.5s ease',
    border: '1px solid darkblue',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    width: { xs: '57%', sm: '80%', md: '90%', lg: '27%', xl: '25%' }, // Width for different screen sizes
    height: { xs: '62%', sm: '80%', md: '90%', lg: '27%', xl: '53%' }, // Height for different screen sizes
    top: { xs: '2%', sm: '5%', md: '0', lg: '27%', xl: '5%' }, // Top position for different screen sizes
    left: { xs: '2%', sm: '5%', md: '0', lg: '27%', xl: '5%' }, // Left position for different screen sizes
  }}
>
  {/* Título */}
  <Typography sx={{ color: colorLetras, fontWeight: pesoFuente, fontFamily: fuente,  fontSize: sizeBoxTitle}} align="center" style={{ marginTop: '5%' }}>
    Filtros de Búsqueda
  </Typography>
  
  {/* Línea horizontal */}
  <hr style={{ width: '90%', margin: '10px 0', border: `1px solid ${colorLin}`}}/>

  {/* Contenedor interno */}
  <div
    style={{
      background: `linear-gradient(to bottom, ${colorContInt1}, ${colorContInt2})`, // Correct usage of backticks
      width: '90%',
      height: '90%',
      borderRadius: '20px',
    }}
  >

    {/* Grid Superior */}
    <Grid
      container
      direction="column"
      justifyContent="center"
      sx={{
        height: '100%',
        width: '100%',
        padding: {
          xs: '2px', // Padding for extra small screens
          sm: '2px', // Padding for small screens
          md: '2px', // Padding for medium screens
          lg: '2px', // Padding for large screens
          xl: '6px', // Padding for extra large screens
        },
      }}
    >

      {/* Primer elemento: Autonomía */}
      <Grid item xs style={{ textAlign: 'center' }}>
        <Typography sx={{ color: colorLetras, fontWeight: pesoFuente, fontFamily: fuente, fontSize: sizeBig}} variant="h7" align="center">
          Indique Autonomía del vehículo
        </Typography>

        <Slider
          value={autonomia}
          min={80}
          max={580}
          aria-label="Custom marks"
          onChange={handleChange}
          valueLabelDisplay="auto" // Only show the label when active (hover or during drag)
          getAriaValueText={valuetext}
          marks={marks}
          sx={{
            color: colorBtn,
            height: 8,
            width: '85%',  // Add margin to both left and right
            '& .MuiSlider-thumb': {
              height: 24,
              width: 24,
              backgroundColor: '#fff',
              border: '2px solid currentColor',
            },
            '& .MuiSlider-valueLabel': {
              backgroundColor: colorBtn,
            },
          }}
        />
      </Grid>

      {/* Segundo elemento: Tipo de cargador */}
      <Grid item xs style={{ textAlign: 'center' }} 
      sx={{padding:paddingBox}}>
        <Typography sx={{ color: colorLetras, fontWeight: pesoFuente, fontFamily: fuente, fontSize: sizeBig }} variant="h7" align="center" style={{ marginBottom: '10px' }}>
          Indique tipo de cargador
        </Typography>

        {/* Select de tipo de cargador */}
        <Select
          style={{
            appearance: 'none', // Remove default arrow for most browsers
            WebkitAppearance: 'none', // Remove default arrow for Safari
            MozAppearance: 'none', // Remove default arrow for Firefox
          }}
          closeMenuOnSelect={false}
          isMulti
          options={cargadores}
          value={selectedOptions}
          onChange={handleCargador} // Update the selected options state
          styles={selectStyles}
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

<Grid item xs style={{ textAlign: 'center' }}
sx={{padding:paddingBox}}>
  <Typography sx={{ color: colorLetras, fontWeight: pesoFuente, fontFamily: fuente, fontSize: sizeBig }} variant="h7" align="center" style={{ marginBottom: '10px' }}>
    Seleccione vehículo
  </Typography>
  <Select
        labelId="vehiculo-select-label"
        id="vehiculo-select"
        value={selectedVehiculo}
        label="Vehiculo Modelo"
        onChange={handleSelectVehiculo}
        options = {vehiculosOptions}
        placeholder = "Seleccionar desde base de datos..."
        styles={selectStyles}
      >
      </Select>
  </Grid>

      <Grid item xs sx={{padding:paddingBox}}>
      <TableContainer component={Paper}>
      <Table sx={{ border: '1px solid white', borderRadius: '15px',}} aria-label="customized table">
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
</Box>

      <Box
  sx={{
    position: 'absolute',
    backgroundColor: colorContExt,
    zIndex: !isVisible ? 1000 : 0, // Higher zIndex when visible
    pointerEvents: !isVisible ? 'auto' : 'none', // Enable interactions only when visible
    width: { xs: '80%', sm: '80%', md: '90%', lg: '27%', xl: '30%' }, // Width for different screen sizes
    height: { xs: '80%', sm: '80%', md: '90%', lg: '27%', xl: '45%' }, // Height for different screen sizes
    top: { xs: '2%', sm: '5%', md: '0', lg: '27%', xl: '5%' }, // Top position for different screen sizes
    left: { xs: '2%', sm: '5%', md: '0', lg: '27%', xl: '5%' }, // Left position for different screen sizes
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
  <Typography sx={{ color: colorLetras, fontWeight: pesoFuente, fontFamily: fuente,  fontSize: sizeBoxTitle }} align="center" style={{ marginTop: '10px' }}>
    Planificador de ruta
  </Typography>
  
  {/* Horizontal line */}
  <hr style={{ width: '90%', margin: '10px 0', border: `1px solid ${colorLin}`}} />
  <div
    style={{
      background: `linear-gradient(to bottom, ${colorContInt1}, ${colorContInt2})`,
      width: '95%',
      height: '95%',
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
    <Typography sx={{ color: colorLetras, fontWeight: pesoFuente, fontFamily: fuente, fontSize: sizeBoxTitle }} variant="h7" align="center">
      Indique punto de partida
    </Typography>
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '0px',
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
          <Grid item xs style={{ width: '80%', padding: '0px 0px', textAlign: 'center' }}>
            <Typography sx={{ color: colorLetras, fontWeight: pesoFuente, fontFamily: fuente, fontSize: sizeBoxTitle }} variant="h7" align="center">Indique punto de llegada </Typography>
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
          
          <Grid container 
  style={{ 
    width: '80%', 
    padding: '0px', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center' // Change to 'center' to center align the items in the Grid
  }}
>
    <Typography sx={{ color: colorLetras, fontWeight: pesoFuente, fontFamily: fuente, fontSize: sizeBoxTitle }} variant="h7" align="center">Indique tipo de cargador o vehículo </Typography>
    <Tooltip
        title={
          <span style={{ whiteSpace: 'pre-line' }}>
            Al seleccionar uno o varios tipos de cargador, filtra los puntos de carga que posean al menos 1 cargador de acuerdo a los seleccionados.{"\n"}{"\n"}
            Al seleccionar un vehículo de la base de datos se ingresa de forma directa los tipos de cargadores adecuados para dicho vehículo, al igual que la autonomía de fábrica.
          </span>
        }
        open={COVOpen}
        onClose={handleCOVClose}
        onOpen={handleCOVOpen}
        leaveDelay={200}
        arrow // Muestra una flecha en el tooltip
      >
        <IconButton
          size="small"
          style={{ marginLeft: '0px' }} // Ajusta el margen del ícono
          onClick={handleCOVOpen}
        >
          <HelpOutlineIcon style={{ color: '#00796B' }} />
        </IconButton>
      </Tooltip>
    <Grid item xs={6} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>

      <Select
    closeMenuOnSelect={false}
    isMulti
    options={cargadores}
    value={selectedOptions}
    onChange={handleCargador} // Update the selected options state
    placeholder = "Cargador"
    styles={selectStyles}
  >
    </Select>
      
      
      </Grid>

      <Grid item xs={6} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>

      <Select
        labelId="vehiculo-select-label"
        id="vehiculo-select"
        value={selectedVehiculo}
        label="Vehiculo Modelo"
        onChange={handleSelectVehiculo}
        options = {vehiculosOptions}
        placeholder = "Vehículo"
        styles={selectStyles}
      >
      </Select>
        
      </Grid>
    </Grid>


          <Grid container style={{ width: '80%', padding: '0px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      {/* First Row: SOC and Autonomy */}
      <Grid style={{ display: 'flex', alignItems: 'center' }}>
      <Typography sx={{ color: colorLetras, fontWeight: pesoFuente - 100, fontFamily: fuente }} variant="h7" style={{ marginRight: '0px' }}>
        SOC
      </Typography>
      <Tooltip
        title="SOC corresponde al estado de carga de la batería en kilómetros. Ingrese un valor numérico."
        open={open}
        onClose={handleTooltipClose}
        onOpen={handleTooltipOpen}
        leaveDelay={200}
        arrow // Muestra una flecha en el tooltip
      >
        <IconButton
          size="small"
          style={{ marginLeft: '0px' }} // Ajusta el margen del ícono
          onClick={handleTooltipOpen}
        >
          <HelpOutlineIcon style={{ color: '#00796B' }} />
        </IconButton>
      </Tooltip>
      <TextField
        variant="outlined"
        type="number"
        inputProps={{ min: 0 }}
        size="small"
        onChange={handleSOCChange}
        InputProps={{
          style: {
            backgroundColor: elementInt, 
            color: colorTxtInt,
            height: '30px',
            width: '70px',
            border: '1px solid #00796B',
            borderRadius: '4px',
          },
          inputProps: { min: 0 }, // Hide arrows in WebKit browsers (Chrome, Safari)
        }}
        sx={{
          '& input[type=number]': {
            MozAppearance: 'textfield', // Firefox
          },
          '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
            WebkitAppearance: 'none', // Chrome, Safari
            margin: 0,
          },
        }}
      />
      
    </Grid>

      <Grid style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ color: colorLetras, fontWeight: pesoFuente -100, fontFamily: fuente }} variant="h7" style={{ marginRight: '0px' }}>
          Autonomía
        </Typography>
        <Tooltip
        title="Corresponde a la autonomía del vehículo en kilómetros bajo un estado de carga del 70% considerando no llegar a la desacarga completa."
        open={open2}
        onClose={handleTooltipClose2}
        onOpen={handleTooltipOpen2}
        leaveDelay={200}
        arrow // Muestra una flecha en el tooltip
      >
        <IconButton
          size="small"
          style={{ marginLeft: '0px' }} // Ajusta el margen del ícono
          onClick={handleTooltipOpen2}
        >
          <HelpOutlineIcon style={{ color: '#00796B' }} />
        </IconButton>
      </Tooltip>
        <TextField
            variant="outlined"
            type="number"
            value = {autonomy !== null && autonomy !== '' ? autonomy : ''}
            inputProps={{ min: 0, style: { MozAppearance: 'textfield' } }} // Hide arrows in Firefox
            size="small"
            onChange={handleAutonomyChange}
            InputProps={{
              style: {
                backgroundColor: elementInt, 
                color: colorTxtInt,
                height: '30px',
                width: '70px',
                border: '1px solid #00796B',
                borderRadius: '4px',
              },
              inputProps: { min: 0 }, // Hide arrows in WebKit browsers (Chrome, Safari)
            }}
            sx={{
              '& input[type=number]': {
                MozAppearance: 'textfield', // Firefox
              },
              '& input[type=number]::-webkit-outer-spin-button, & input[type=number]::-webkit-inner-spin-button': {
                WebkitAppearance: 'none', // Chrome, Safari
                margin: 0,
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
                padding: '4px 8px',
                margin: '4px',
                fontSize: '14px',
                cursor: partida && final ? 'pointer' : 'not-allowed',  // Cambia el cursor
                opacity: partida && final ? 1 : 0.5,  // Opacidad cuando está deshabilitado
              }}
              disabled={!partida || !final}  // Deshabilitar si partida o final son null
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
              cursor: partida && final ? 'pointer' : 'not-allowed',  // Cambia el cursor
              opacity: partida && final ? 1 : 0.5,  // Opacidad cuando está deshabilitado
            }}
            disabled={!partida || !final}  // Deshabilitar si partida o final son null
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
              cursor: soc && autonomy ? 'pointer' : 'not-allowed',  // Cambia el cursor
              opacity: soc && autonomy ? 1 : 0.5,  // Opacidad cuando está deshabilitado
            }}
            disabled={!soc || !autonomy} 
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
      </Box>

    <MapContainer
        center={[-38.8, -73]}
        zoom={4}
        style={{ height: '100vh', width: '100vw' }}
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
        <div>
          <h3>{location.nombre}</h3>
          <p>{location.direccion}</p>
          <div style={{ width: '300px', height: 'auto', paddingBottom: '10px' }}>
          {Object.entries({
            T1: location.T1,
            T2: location.T2,
            T2SC: location.T2SC,
            CCST2: location.CCST2,
            CHADEMO: location.CHADEMO,
            GBTDC: location.GBTDC
          })
          .filter(([key, value]) => value > 0)
          .map(([key, value]) => (
            <p key={key} style={{ margin: '2px 0' }}>{`${key}: ${value}`}</p>
          ))}
        </div>
          <form onSubmit={(event) => handleCommentSubmit(event, location.IDEN)}>
            <div>
              <label>
                Localización ID: {location.IDEN}
                <StarRating
                  locationIdx={location.IDEN}
                  ratings={ratings}
                  handleRatingChange={(rating, idx) => handleRatingChange({ target: { value: rating } }, idx)}
                />
              </label>
            </div>
            <div>
              <textarea
                value={comments[location.IDEN] || ""}
                onChange={(event) => handleCommentChange(event, location.IDEN)}
                placeholder="Deje un comentario..."
                rows="3"
                cols="30"
                style={{
                  width: '100%', // Set width to 80%
                  border: '2px solid #ccc', // Add a light gray border
                  borderRadius: '4px', // Optional: add rounded corners
                  padding: '5px', // Optional: add some padding inside the textarea
                  resize: 'none' // Optional: prevent resizing of the textarea
                }}
              />
            </div>
            <button type="submit">Enviar comentario</button>
          </form>
          <div>
            <h4>Comentarios anteriores:</h4>
            <ul>
              {(commentHistory[location.IDEN] || []).map((entry, i) => (
                <li key={i}>
                  <strong>Valoración: {entry.rating || "N/A"}</strong>
                  <p>{entry.comment || "Sin comentarios"}</p>
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
