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
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);
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
    xs: '0.6rem',  // For extra-small screens (phones)
    sm: '0.6rem', // For small screens (tablets)
    md: '1rem',  // For medium screens (small desktops)
    lg: '1.3rem',  // For large screens (large desktops)
    xl: '1.3rem', // For extra-large screens
  }

  const sizeBtn = {
    xs: '8px',  // Font size for extra small screens
    sm: '8px',  // Font size for small screens
    md: '10px',  // Font size for medium screens
    lg: '12px',  // Font size for large screens
    xl: '12px',  // Font size for extra large screens
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
      padding: '0px',
      fontSize: '0.5rem', // Default font size for small screens
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
      padding: '2px', // Reduce padding for body cells
      // Responsive font size for body cells
      [theme.breakpoints.down('sm')]: {
        fontSize: '8px',  // For small screens
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
    if (isSm) return { minHeight: '5px', maxHeight: '25px', height: '30px' };
    if (isMd) return { minHeight: '5px', maxHeight: '37px', height: '37px' };
    if (isLg) return { minHeight: '5px', maxHeight: '37px', height: '37px' };
    if (isXl) return { minHeight: '5px', maxHeight: '37px', height: '37px' };
    return { minHeight: '5px', maxHeight: '37px', height: '37px' }; // Default for unknown cases
  };

  const getResponsiveButton = () => {
    if (isXs) return { height: '30px', width: '30px'};
    if (isSm) return { height: '30px', width: '30px'};
    if (isMd) return { height: '30px', width: '30px'};
    if (isLg) return { height: '40px', width: '40px'};
    if (isXl) return { height: '40px', width: '40px'};
    return { height: '40px', width: '40px'}; // Default for unknown cases
  };

  const getResponsiveIcon = () => {
    if (isXs) return { height: '30px', width: '30px'};
    if (isSm) return { height: '30px', width: '30px'};
    if (isMd) return { height: '30px', width: '30px'};
    if (isLg) return { height: '40px', width: '40px'};
    if (isXl) return { height: '40px', width: '40px'};
    return { height: '40px', width: '40px'}; // Default for unknown cases
  };

  const getResponsiveAutocoplete = () => {
    if (isXs) return { height: '20px'};
    if (isSm) return { height: '20px'};
    if (isMd) return { height: '30px'};
    if (isLg) return { height: '30px'};
    if (isXl) return { height: '30px'};
    return { height: '40px'}; // Default for unknown cases
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
    singleValue: (base) => ({
      ...base,
      ...getResponsiveFontSize(),
      color: colorTxtInt,               // Ensure the selected item text color is visible
      backgroundColor: 'transparent', // Background of selected value (keep it transparent or change)
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
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? colorContInt1 : base.backgroundColor, // Change the background of the selected item
      color: state.isSelected ? 'black' : colorTxtInt,                    // Change the text color of the selected item
      ':hover': {
        backgroundColor: state.isSelected ? colorContInt1 : 'lightgray',    // Hover effect for selected and unselected items
      },
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

  // Obtener data de las localizaciones de Strapi
  useEffect(() => {
    const fetchData = async () => {
      try {
        //Obtener data de servidor de STRAPI
        //const response = await fetch('http://localhost:1337/api/nodos');
        const response = {"data":[{"id":93,"attributes":{"latitud":-33.43,"longitud":-70.78,"nombre":"Estación de Servicio Enel X Station","propietario":"Enel X Chile SpA","comuna":"Pudahuel","T1":0,"T2":0,"T2SC":3,"CCST2":9,"CHADEMO":9,"GBTDC":1,"createdAt":"2024-09-14T22:48:37.974Z","updatedAt":"2024-09-14T22:48:37.974Z","publishedAt":"2024-09-14T22:48:37.971Z","direccion":"Salar de Atacama, Enea, Pudahuel, Provincia de Santiago, Región Metropolitana de Santiago, 9020078, Chile","comentario":null}},{"id":94,"attributes":{"latitud":-33.4,"longitud":-70.57,"nombre":"Enel X Way-Parque Araucano.","propietario":"Enel Mobility Chile SPA","comuna":"Las Condes","T1":0,"T2":0,"T2SC":1,"CCST2":4,"CHADEMO":4,"GBTDC":1,"createdAt":"2024-09-14T22:48:41.513Z","updatedAt":"2024-09-14T22:48:41.513Z","publishedAt":"2024-09-14T22:48:41.513Z","direccion":"785, Avenida Manquehue, Nueva Las Condes, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7561156, Chile","comentario":null}},{"id":95,"attributes":{"latitud":-33.46,"longitud":-70.77,"nombre":"Enel X Way - Bodega San Francisco","propietario":"Enel Mobility Chile SPA","comuna":"Pudahuel","T1":0,"T2":0,"T2SC":1,"CCST2":2,"CHADEMO":1,"GBTDC":1,"createdAt":"2024-09-14T22:48:44.942Z","updatedAt":"2024-09-14T22:48:44.942Z","publishedAt":"2024-09-14T22:48:44.941Z","direccion":"Centro Logístico Vespucio - Bodegas San Francisco, La Martina, Pudahuel, Provincia de Santiago, Región Metropolitana de Santiago, 9020078, Chile","comentario":null}},{"id":96,"attributes":{"latitud":-22.43,"longitud":-68.92,"nombre":"CARGADOR SHELL CALAMA, AVENIDA BALMACEDA 4539","propietario":"Empresa Nacional de Energia En","comuna":"Calama","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":1,"createdAt":"2024-09-14T22:48:48.544Z","updatedAt":"2024-09-14T22:48:48.544Z","publishedAt":"2024-09-14T22:48:48.542Z","direccion":"John Bradford, Calama, Provincia de El Loa, Región de Antofagasta, Chile","comentario":null}},{"id":97,"attributes":{"latitud":-20.49,"longitud":-69.33,"nombre":"Enel X Way - Ilustre Municipalidad de Pica","propietario":"Ilustre municipalidad de Pica","comuna":"Pica","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":1,"createdAt":"2024-09-14T22:48:52.082Z","updatedAt":"2024-09-14T22:48:52.082Z","publishedAt":"2024-09-14T22:48:52.080Z","direccion":"Escuela Especial Jacaranda, Maipú, Pica, Provincia del Tamarugal, Región de Tarapacá, Chile","comentario":null}},{"id":98,"attributes":{"latitud":-33.4,"longitud":-70.56,"nombre":"Centro Parque Araucano","propietario":"Inversiones Vida Parque SA","comuna":"Las Condes","T1":1,"T2":8,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:48:55.623Z","updatedAt":"2024-09-14T22:48:55.623Z","publishedAt":"2024-09-14T22:48:55.622Z","direccion":"440, Gerónimo de Alderete, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7560846, Chile","comentario":null}},{"id":99,"attributes":{"latitud":-33.52,"longitud":-70.72,"nombre":"PUNTO DE CARGA DOBLE EVBOX MPOE","propietario":"Mall Plaza Oeste","comuna":"Cerrillos","T1":4,"T2":0,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:48:59.021Z","updatedAt":"2024-09-14T22:48:59.021Z","publishedAt":"2024-09-14T22:48:59.020Z","direccion":"Camino a Lonquén, Cerrillos, Provincia de Santiago, Región Metropolitana de Santiago, 9222145, Chile","comentario":null}},{"id":100,"attributes":{"latitud":-53.17,"longitud":-70.91,"nombre":"Dreams Punta Arenas","propietario":"Casino de Juegos Punta Arenas","comuna":"Punta Arenas","T1":2,"T2":0,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:49:02.664Z","updatedAt":"2024-09-14T22:49:02.664Z","publishedAt":"2024-09-14T22:49:02.660Z","direccion":"Helipuerto DAP, Avenida Costanera del Estrecho, Barrio Sur, Punta Arenas, Provincia de Magallanes, Región de Magallanes y de la Antártica Chilena, 6201065, Chile","comentario":null}},{"id":101,"attributes":{"latitud":-51.12,"longitud":-73.12,"nombre":"Hotel Lago Grey","propietario":"Turismo Lago Grey SA","comuna":"Torres del Paine","T1":2,"T2":0,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:49:06.154Z","updatedAt":"2024-09-14T22:49:06.154Z","publishedAt":"2024-09-14T22:49:06.153Z","direccion":"CGE, Ruta Y-150, Hotel Lago Grey, Torres del Paine, Provincia de Última Esperanza, Región de Magallanes y de la Antártica Chilena, Chile","comentario":null}},{"id":102,"attributes":{"latitud":-40.71,"longitud":-72.33,"nombre":"Hotel Puyehue","propietario":"Hotel termas de Puyehue","comuna":"Puyehue","T1":2,"T2":0,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:49:09.666Z","updatedAt":"2024-09-14T22:49:09.666Z","publishedAt":"2024-09-14T22:49:09.664Z","direccion":"Hotel Termas de Puyehue, Camino Puyehue - Antillanca, Hotel Puyehue, Puyehue, Provincia de Osorno, Región de Los Lagos, Chile","comentario":null}},{"id":103,"attributes":{"latitud":-33.44,"longitud":-70.65,"nombre":"Cargadores Vehiculares Hotel San Francisco","propietario":"ENEL X SPA","comuna":"Santiago","T1":1,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:49:13.185Z","updatedAt":"2024-09-14T22:49:13.185Z","publishedAt":"2024-09-14T22:49:13.182Z","direccion":"930, Huérfanos, Centro Histórico, Santiago, Provincia de Santiago, Región Metropolitana de Santiago, 8320202, Chile","comentario":null}},{"id":104,"attributes":{"latitud":-33.44,"longitud":-70.65,"nombre":"SABA Plaza de Armas 1","propietario":"Enel X Chile SpA","comuna":"Santiago","T1":1,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:49:16.737Z","updatedAt":"2024-09-14T22:49:16.737Z","publishedAt":"2024-09-14T22:49:16.734Z","direccion":"930, Huérfanos, Centro Histórico, Santiago, Provincia de Santiago, Región Metropolitana de Santiago, 8320202, Chile","comentario":null}},{"id":105,"attributes":{"latitud":-33.42,"longitud":-70.59,"nombre":"Grupo Patio Foster","propietario":"Patio Foster SPA","comuna":"Las Condes","T1":1,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:49:20.097Z","updatedAt":"2024-09-14T22:49:20.097Z","publishedAt":"2024-09-14T22:49:20.096Z","direccion":"3750, Avenida Presidente Errázuriz, Barrio San Pascual, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7550344, Chile","comentario":null}},{"id":106,"attributes":{"latitud":-33.41,"longitud":-70.6,"nombre":"Estacionamientos EME","propietario":"Estacionamientos Generales Ltd","comuna":"Las Condes","T1":2,"T2":2,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:49:23.460Z","updatedAt":"2024-09-14T22:49:23.460Z","publishedAt":"2024-09-14T22:49:23.459Z","direccion":"Las Peñas, El Golf, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7550089, Chile","comentario":null}},{"id":107,"attributes":{"latitud":-33.41,"longitud":-70.6,"nombre":"Cargador Vehicular Hotel Intercontinental","propietario":"ENEL X SPA","comuna":"Las Condes","T1":1,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:49:26.975Z","updatedAt":"2024-09-14T22:49:26.975Z","publishedAt":"2024-09-14T22:49:26.973Z","direccion":"Las Peñas, El Golf, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7550089, Chile","comentario":null}},{"id":108,"attributes":{"latitud":-33.41,"longitud":-70.58,"nombre":"Patio Los Militares","propietario":"inmobiliaria los militares apo","comuna":"Las Condes","T1":1,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:49:30.424Z","updatedAt":"2024-09-14T22:49:30.424Z","publishedAt":"2024-09-14T22:49:30.419Z","direccion":"Escuela Militar del General Bernardo O'Higgins, La Gioconda, El Golf, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7550076, Chile","comentario":null}},{"id":109,"attributes":{"latitud":-32.88,"longitud":-71.25,"nombre":"Oficina Chilquinta Quillota","propietario":"CHILQUINTA   ENERGIA S.A.","comuna":"Quillota","T1":2,"T2":0,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:49:33.832Z","updatedAt":"2024-09-14T22:49:33.832Z","publishedAt":"2024-09-14T22:49:33.831Z","direccion":"La Concepción, Los Paltos, Boco, Quillota, Provincia de Quillota, Región de Valparaíso, 2260000, Chile","comentario":null}},{"id":110,"attributes":{"latitud":-30.03,"longitud":-70.71,"nombre":"Plaza Vicuña Mackena","propietario":"CGE","comuna":"Coquimbo","T1":1,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:49:37.406Z","updatedAt":"2024-09-14T22:49:37.406Z","publishedAt":"2024-09-14T22:49:37.404Z","direccion":"Idelfonso Rivera, Población Gabriela Mistral, Vicuña, Provincia de Elqui, Región de Coquimbo, 1760000, Chile","comentario":null}},{"id":111,"attributes":{"latitud":-36.82,"longitud":-73.05,"nombre":"Mall del Centro","propietario":"Mall del centro de concepción","comuna":"Concepción","T1":1,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:49:40.864Z","updatedAt":"2024-09-14T22:49:40.864Z","publishedAt":"2024-09-14T22:49:40.858Z","direccion":"Juan Martínez de Rozas, Cerro Amarillo, Concepción, Provincia de Concepción, Región del Biobío, 4030442, Chile","comentario":null}},{"id":112,"attributes":{"latitud":-33.42,"longitud":-70.65,"nombre":"Mall Barrio Independencia","propietario":"MBI  SPA","comuna":"Independencia","T1":1,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:49:48.077Z","updatedAt":"2024-09-14T22:49:48.077Z","publishedAt":"2024-09-14T22:49:48.072Z","direccion":"Universidad de Chile (Campus Norte), Monserrat, Población San Cristóbal, Recoleta, Provincia de Santiago, Región Metropolitana de Santiago, 8380552, Chile","comentario":null}},{"id":113,"attributes":{"latitud":-33.42,"longitud":-70.62,"nombre":"Automóvil Club Chile","propietario":"Automovil Club de Chile","comuna":"Providencia","T1":1,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:49:51.495Z","updatedAt":"2024-09-14T22:49:51.495Z","publishedAt":"2024-09-14T22:49:51.491Z","direccion":"Los Colonos, Pedro de Valdivia Norte, Providencia, Provincia de Santiago, Región Metropolitana de Santiago, 7500000, Chile","comentario":null}},{"id":114,"attributes":{"latitud":-33.42,"longitud":-70.61,"nombre":"Costanera Center","propietario":"ENEL X SPA","comuna":"Providencia","T1":1,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:49:54.897Z","updatedAt":"2024-09-14T22:49:54.897Z","publishedAt":"2024-09-14T22:49:54.895Z","direccion":"154, Santa Magdalena, Sanhattan, Providencia, Provincia de Santiago, Región Metropolitana de Santiago, 7500000, Chile","comentario":null}},{"id":115,"attributes":{"latitud":-33.37,"longitud":-70.51,"nombre":"Mall Sport","propietario":"Inmob. Administ. y Com. Mall S","comuna":"Las Condes","T1":1,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:49:58.270Z","updatedAt":"2024-09-14T22:49:58.270Z","publishedAt":"2024-09-14T22:49:58.269Z","direccion":"13200, Avenida Las Condes, La Ermita, Lo Barnechea, Provincia de Santiago, Región Metropolitana de Santiago, 7710414, Chile","comentario":null}},{"id":116,"attributes":{"latitud":-33.37,"longitud":-70.66,"nombre":"Movicenter Huechuraba","propietario":"Inver. e Inmobiliaria El Rosal","comuna":"Huechuraba","T1":1,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:50:01.639Z","updatedAt":"2024-09-14T22:50:01.639Z","publishedAt":"2024-09-14T22:50:01.636Z","direccion":"Camino El Guanaco, Condominio Punta Ciruelos, Huechuraba, Provincia de Santiago, Región Metropolitana de Santiago, 8580000, Chile","comentario":null}},{"id":117,"attributes":{"latitud":-33.01,"longitud":-71.55,"nombre":"Mall Marina","propietario":"Inmobiliaria Mall Viña del Mar","comuna":"Vina del Mar","T1":1,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:50:05.018Z","updatedAt":"2024-09-14T22:50:05.018Z","publishedAt":"2024-09-14T22:50:05.016Z","direccion":"13 Norte, Viña del Mar, Provincia de Valparaíso, Región de Valparaíso, 2520707, Chile","comentario":null}},{"id":118,"attributes":{"latitud":-33.01,"longitud":-71.55,"nombre":"Boulevard Marina","propietario":"Inmobiliaria Mall Viña del Mar","comuna":"Vina del Mar","T1":1,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:50:08.425Z","updatedAt":"2024-09-14T22:50:08.425Z","publishedAt":"2024-09-14T22:50:08.411Z","direccion":"13 Norte, Viña del Mar, Provincia de Valparaíso, Región de Valparaíso, 2520707, Chile","comentario":null}},{"id":119,"attributes":{"latitud":-31.57,"longitud":-71.54,"nombre":"SAVE ESTACION DE SERVICIO ENEX HUENTELAUQUEN","propietario":"Empresa Nacional de Energia En","comuna":"Canela","T1":1,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:50:11.836Z","updatedAt":"2024-09-14T22:50:11.836Z","publishedAt":"2024-09-14T22:50:11.830Z","direccion":"Huentelauquén Norte, Canela, Provincia de Choapa, Región de Coquimbo, Chile","comentario":null}},{"id":120,"attributes":{"latitud":-33.4,"longitud":-70.57,"nombre":"Save Edificio Corporativo ITAU Pdte. Riesco #5537","propietario":"Com Edif Nue Las Condes Siete","comuna":"Las Condes","T1":0,"T2":1,"T2SC":3,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:50:15.226Z","updatedAt":"2024-09-14T22:50:15.226Z","publishedAt":"2024-09-14T22:50:15.224Z","direccion":"785, Avenida Manquehue, Nueva Las Condes, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7561156, Chile","comentario":null}},{"id":121,"attributes":{"latitud":-33.52,"longitud":-70.75,"nombre":"Enel X - Pompello Camino Melipilla","propietario":"Enel X Chile SpA","comuna":"Maipú","T1":0,"T2":1,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:50:18.581Z","updatedAt":"2024-09-14T22:50:18.581Z","publishedAt":"2024-09-14T22:50:18.579Z","direccion":"Santa María, Villa 4 Álamos, Maipú, Provincia de Santiago, Región Metropolitana de Santiago, 9252307, Chile","comentario":null}},{"id":122,"attributes":{"latitud":-36.82,"longitud":-73.05,"nombre":"IRVE PAICAVI 1122 CONCEPCION","propietario":"EMPRESA NACIONAL DE ENERGIA","comuna":"Concepción","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:50:22.057Z","updatedAt":"2024-09-14T22:50:22.057Z","publishedAt":"2024-09-14T22:50:22.056Z","direccion":"Juan Martínez de Rozas, Cerro Amarillo, Concepción, Provincia de Concepción, Región del Biobío, 4030442, Chile","comentario":null}},{"id":123,"attributes":{"latitud":-33.52,"longitud":-70.75,"nombre":"IRVE POMPEYO CARRASCO PUBLICO","propietario":"POMPEYO CARRASCO SPA","comuna":"Maipú","T1":0,"T2":2,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:50:26.090Z","updatedAt":"2024-09-14T22:50:26.090Z","publishedAt":"2024-09-14T22:50:26.089Z","direccion":"Santa María, Villa 4 Álamos, Maipú, Provincia de Santiago, Región Metropolitana de Santiago, 9252307, Chile","comentario":null}},{"id":124,"attributes":{"latitud":-33.45,"longitud":-70.63,"nombre":"IRVE Tottus Vicuña Mackena","propietario":"Hipermercados Tottus  SA","comuna":"Santiago","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:50:30.043Z","updatedAt":"2024-09-14T22:50:30.043Z","publishedAt":"2024-09-14T22:50:30.042Z","direccion":"Juan Godoy, Barrio Italia, Ñuñoa, Provincia de Santiago, Región Metropolitana de Santiago, 7770613, Chile","comentario":null}},{"id":125,"attributes":{"latitud":-33.35,"longitud":-70.67,"nombre":"Enel X Way - Petrobras Pedro Fontova","propietario":"Rentas e inversiones Baker SpA","comuna":"Huechuraba","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:50:34.099Z","updatedAt":"2024-09-14T22:50:34.099Z","publishedAt":"2024-09-14T22:50:34.097Z","direccion":"Condominio Las Araucarias, Haras de Huechuraba, Huechuraba, Provincia de Santiago, Región Metropolitana de Santiago, 8600651, Chile","comentario":null}},{"id":126,"attributes":{"latitud":-27.37,"longitud":-70.34,"nombre":"CARGADORES ELECTRICOS MALL PLAZA COPIAPO","propietario":"NUEVOS DESARROLLOS S.A.","comuna":"Copiapó","T1":0,"T2":2,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:50:37.724Z","updatedAt":"2024-09-14T22:50:37.724Z","publishedAt":"2024-09-14T22:50:37.718Z","direccion":"Mall Plaza Copiapó, Maipú, Rosario, El Palomar, Copiapó, Provincia de Copiapó, Región de Atacama, 1530000, Chile","comentario":null}},{"id":127,"attributes":{"latitud":-18.47,"longitud":-70.31,"nombre":"ELECTROLINERA MALL PLAZA ARICA","propietario":"NUEVOS DESARROLLOS S.A.","comuna":"Arica","T1":0,"T2":2,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:50:41.282Z","updatedAt":"2024-09-14T22:50:41.282Z","publishedAt":"2024-09-14T22:50:41.279Z","direccion":"Avenida Chile, Conjunto Habitacional Pukara, Chinchorro, Arica, Provincia de Arica, Región de Arica y Parinacota, 1000224, Chile","comentario":null}},{"id":128,"attributes":{"latitud":-42.47,"longitud":-73.77,"nombre":"COPEC VOLTEX CASTRO EDS 20507 - RUTA 5 SUR KM 1170","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"Castro","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:50:45.418Z","updatedAt":"2024-09-14T22:50:45.418Z","publishedAt":"2024-09-14T22:50:45.417Z","direccion":"Piloto Samuel Ulloa, Quinta Ramos, Castro, Provincia de Chiloé, Región de Los Lagos, 5700196, Chile","comentario":null}},{"id":129,"attributes":{"latitud":-41.46,"longitud":-72.95,"nombre":"ELECTROLINERA COPEC PUERTO MONTT PANAMERICANA 200","propietario":"COPEC S.A.","comuna":"Puerto Montt","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:50:49.642Z","updatedAt":"2024-09-14T22:50:49.642Z","publishedAt":"2024-09-14T22:50:49.641Z","direccion":"Lider, Avenida Parque Industrial, Población Rotonda, Padre José Fernández Pérez, Puerto Montt, Provincia de Llanquihue, Región de Los Lagos, 5507138, Chile","comentario":null}},{"id":130,"attributes":{"latitud":-40.58,"longitud":-73.11,"nombre":"ELECTROLINERA COPEC OSORNO RENE SORIANO 2335","propietario":"COPEC S.A.","comuna":"Osorno","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:50:53.484Z","updatedAt":"2024-09-14T22:50:53.484Z","publishedAt":"2024-09-14T22:50:53.482Z","direccion":"Teniente R. Jimenez, Población Pailihue, Osorno, Provincia de Osorno, Región de Los Lagos, 5310847, Chile","comentario":null}},{"id":131,"attributes":{"latitud":-39.28,"longitud":-72.22,"nombre":"Punto de carga Duoc UC","propietario":"Fundacion Duoc Uc","comuna":"Villarrica","T1":0,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:50:56.908Z","updatedAt":"2024-09-14T22:50:56.908Z","publishedAt":"2024-09-14T22:50:56.907Z","direccion":"Humedal Urbano Mallolafquen, Villarrica, Provincia de Cautín, Región de la Araucanía, 4930611, Chile","comentario":null}},{"id":132,"attributes":{"latitud":-38.74,"longitud":-72.6,"nombre":"Copec Temuco","propietario":"COMPANIA DE PETROLEOS COPEC","comuna":"Temuco","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:51:00.356Z","updatedAt":"2024-09-14T22:51:00.356Z","publishedAt":"2024-09-14T22:51:00.354Z","direccion":"133, Andrés Bello, Villa Clotario Blest, Temuco, Provincia de Cautín, Región de la Araucanía, 4791266, Chile","comentario":null}},{"id":133,"attributes":{"latitud":-38.55,"longitud":-72.46,"nombre":"ESTACION DE SERVICIOS COPEC LAUTARO","propietario":"COMPANIA DE PETROLEOS COPEC","comuna":"Lautaro","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:51:03.737Z","updatedAt":"2024-09-14T22:51:03.737Z","publishedAt":"2024-09-14T22:51:03.731Z","direccion":"Louisiana-Pacific (LP), Ruta 5 Sur, San Luis, Lautaro, Provincia de Cautín, Región de la Araucanía, 4860000, Chile","comentario":null}},{"id":134,"attributes":{"latitud":-38.28,"longitud":-72.37,"nombre":"CARGADOR VEHICULOS ELECTRICOS","propietario":"Empresa Nacional de Energia En","comuna":"Victoria","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:51:07.125Z","updatedAt":"2024-09-14T22:51:07.125Z","publishedAt":"2024-09-14T22:51:07.120Z","direccion":"Ruta 5 Sur, María Yolanda, Victoria, Provincia de Malleco, Región de la Araucanía, Chile","comentario":null}},{"id":135,"attributes":{"latitud":-38.28,"longitud":-72.37,"nombre":"Copec Ruta 5 Sur km 614,5.  Victoria","propietario":"COMPANIA DE PETROLEOS COPEC","comuna":"Victoria","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:51:10.590Z","updatedAt":"2024-09-14T22:51:10.590Z","publishedAt":"2024-09-14T22:51:10.589Z","direccion":"Ruta 5 Sur, María Yolanda, Victoria, Provincia de Malleco, Región de la Araucanía, Chile","comentario":null}},{"id":136,"attributes":{"latitud":-37.55,"longitud":-72.31,"nombre":"COPEC Los Angeles Ruta 5 km 518,5 - lado poniente","propietario":"COMPANIA DE PETROLEOS COPEC","comuna":"Los Ángeles","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:51:13.937Z","updatedAt":"2024-09-14T22:51:13.937Z","publishedAt":"2024-09-14T22:51:13.933Z","direccion":"Ruta 5 Sur, Los Ángeles, Provincia de Bío-Bío, Región del Biobío, Chile","comentario":null}},{"id":137,"attributes":{"latitud":-37.28,"longitud":-72.35,"nombre":"COPEC Ruta 5 Sur km 484. Los Alamos","propietario":"COMPANIA DE PETROLEOS COPEC","comuna":"Los Alamos","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:51:17.351Z","updatedAt":"2024-09-14T22:51:17.351Z","publishedAt":"2024-09-14T22:51:17.343Z","direccion":"Los Ángeles, Provincia de Bío-Bío, Región del Biobío, Chile","comentario":null}},{"id":138,"attributes":{"latitud":-36.83,"longitud":-73.06,"nombre":"COPEC Concepción Prat","propietario":"COMPANIAS DE PETROLEOS DE CHIL","comuna":"Concepción","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:51:20.775Z","updatedAt":"2024-09-14T22:51:20.775Z","publishedAt":"2024-09-14T22:51:20.768Z","direccion":"Avenida Padre Hurtado, Barrio Cívico, Concepción, Provincia de Concepción, Región del Biobío, 4070713, Chile","comentario":null}},{"id":139,"attributes":{"latitud":-36.63,"longitud":-72.19,"nombre":"COPEC Chillán","propietario":"COMPANIAS DE PETROLEOS DE CHIL","comuna":"Chillan Viejo","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:51:25.074Z","updatedAt":"2024-09-14T22:51:25.074Z","publishedAt":"2024-09-14T22:51:25.072Z","direccion":"Ruta 5 Sur, Santa Elisa, Chillán Viejo, Provincia de Diguillín, Región de Ñuble, Chile","comentario":null}},{"id":140,"attributes":{"latitud":-36.63,"longitud":-72.19,"nombre":"Cargador Eléctrico Copec Planta Chillán","propietario":"COPEC S.A.","comuna":"Chillan Viejo","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:51:30.030Z","updatedAt":"2024-09-14T22:51:30.030Z","publishedAt":"2024-09-14T22:51:30.028Z","direccion":"Ruta 5 Sur, Santa Elisa, Chillán Viejo, Provincia de Diguillín, Región de Ñuble, Chile","comentario":null}},{"id":141,"attributes":{"latitud":-36.63,"longitud":-72.18,"nombre":"CARGADOR VEHICULOS ELECTRICOS","propietario":"Empresa Nacional de Energia En","comuna":"Chillan Viejo","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:51:33.544Z","updatedAt":"2024-09-14T22:51:33.544Z","publishedAt":"2024-09-14T22:51:33.540Z","direccion":"Caletera 5 Sur, Santa Elisa, Chillán Viejo, Provincia de Diguillín, Región de Ñuble, 3820000, Chile","comentario":null}},{"id":142,"attributes":{"latitud":-36.61,"longitud":-72.1,"nombre":"Chillán Centro","propietario":"Enel X Chile SpA","comuna":"Chillan","T1":0,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:51:37.194Z","updatedAt":"2024-09-14T22:51:37.194Z","publishedAt":"2024-09-14T22:51:37.191Z","direccion":"Mall Arauco Chillán, Isabel Riquelme, Centro de Chillán, Chillán, Provincia de Diguillín, Región de Ñuble, 3800720, Chile","comentario":null}},{"id":143,"attributes":{"latitud":-36.5,"longitud":-72.03,"nombre":"Cargador Eléctrico Shell Chillán","propietario":"Empresa Nacional de Energía EN","comuna":"San Carlos","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:51:40.903Z","updatedAt":"2024-09-14T22:51:40.903Z","publishedAt":"2024-09-14T22:51:40.902Z","direccion":"Camino Santa Isabel, Menelhue, San Carlos, Provincia de Punilla, Región de Ñuble, Chile","comentario":null}},{"id":144,"attributes":{"latitud":-36.47,"longitud":-72.01,"nombre":"COPEC San Carlos","propietario":"COMPANIAS DE PETROLEOS DE CHIL","comuna":"San Carlos","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:51:45.989Z","updatedAt":"2024-09-14T22:51:45.989Z","publishedAt":"2024-09-14T22:51:45.985Z","direccion":"La Piedra, San Carlos, Provincia de Punilla, Región de Ñuble, Chile","comentario":null}},{"id":145,"attributes":{"latitud":-36.18,"longitud":-71.82,"nombre":"EDS Shell Parral","propietario":"ENEX S.A.","comuna":"Parral","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:51:49.812Z","updatedAt":"2024-09-14T22:51:49.812Z","publishedAt":"2024-09-14T22:51:49.806Z","direccion":"Ruta 5 Sur, Doña Pilar, Ruta 5, Parral, Provincia de Linares, Región del Maule, 3630000, Chile","comentario":null}},{"id":146,"attributes":{"latitud":-36.13,"longitud":-71.81,"nombre":"COPEC Parral","propietario":"COMPANIA DE PETROLEOS DE CHILE","comuna":"Parral","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:51:53.219Z","updatedAt":"2024-09-14T22:51:53.219Z","publishedAt":"2024-09-14T22:51:53.218Z","direccion":"Nieves Spoerer, Villa San Pedro, Parral, Provincia de Linares, Región del Maule, 3630000, Chile","comentario":null}},{"id":147,"attributes":{"latitud":-35.62,"longitud":-71.7,"nombre":"COPEC San Javier","propietario":"COMPANIAS DE PETROLEOS DE CHIL","comuna":"San Javier","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:51:56.711Z","updatedAt":"2024-09-14T22:51:56.711Z","publishedAt":"2024-09-14T22:51:56.710Z","direccion":"Ruta 5 Sur, Pangal, San Javier, Provincia de Linares, Región del Maule, Chile","comentario":null}},{"id":148,"attributes":{"latitud":-35.53,"longitud":-71.69,"nombre":"COPEC Maule","propietario":"COMPANIAS DE PETROLEOS DE CHIL","comuna":"Maule","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:52:00.197Z","updatedAt":"2024-09-14T22:52:00.197Z","publishedAt":"2024-09-14T22:52:00.193Z","direccion":"Caletera Ruta 5 Sur, Villa Don Sebastián, Maule Sur, Pueblecillo, Maule, Provincia de Talca, Región del Maule, Chile","comentario":null}},{"id":149,"attributes":{"latitud":-35.43,"longitud":-71.64,"nombre":"Curifor Inmobiliaria S.A.","propietario":"Curifor Inmobiliaria S.A.","comuna":"Talca","T1":0,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:52:03.651Z","updatedAt":"2024-09-14T22:52:03.651Z","publishedAt":"2024-09-14T22:52:03.650Z","direccion":"Avenida Andrés Vaccaro, Población Santa Clara, San Miguel, Talca, Provincia de Talca, Región del Maule, 3461761, Chile","comentario":null}},{"id":150,"attributes":{"latitud":-35.43,"longitud":-71.64,"nombre":"COPEC CALLE 2 NORTE 2310 TALCA EDS 20431","propietario":"Compañía de Petroleos de Chile","comuna":"Talca","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:52:07.133Z","updatedAt":"2024-09-14T22:52:07.133Z","publishedAt":"2024-09-14T22:52:07.132Z","direccion":"Avenida Andrés Vaccaro, Población Santa Clara, San Miguel, Talca, Provincia de Talca, Región del Maule, 3461761, Chile","comentario":null}},{"id":151,"attributes":{"latitud":-35.33,"longitud":-71.55,"nombre":"Instalacion electrica Electrolinera","propietario":"ENEX SA","comuna":"San Rafael","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:52:10.693Z","updatedAt":"2024-09-14T22:52:10.693Z","publishedAt":"2024-09-14T22:52:10.692Z","direccion":"Panguilemito, San Rafael, Provincia de Talca, Región del Maule, Chile","comentario":null}},{"id":152,"attributes":{"latitud":-35.32,"longitud":-71.54,"nombre":"COPEC San Rafael","propietario":"COMPANIAS DE PETROLEOS DE CHIL","comuna":"San Rafael","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:52:14.339Z","updatedAt":"2024-09-14T22:52:14.339Z","publishedAt":"2024-09-14T22:52:14.332Z","direccion":"Ruta 5 Sur, San Rafael, Provincia de Talca, Región del Maule, Chile","comentario":null}},{"id":153,"attributes":{"latitud":-35.14,"longitud":-71.36,"nombre":"Enel X - Zona de descanso Itahue.","propietario":"Enel X Chile SpA","comuna":"Molina","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:52:17.695Z","updatedAt":"2024-09-14T22:52:17.695Z","publishedAt":"2024-09-14T22:52:17.688Z","direccion":"Itahue, Molina, Provincia de Curicó, Región del Maule, Chile","comentario":null}},{"id":154,"attributes":{"latitud":-34.88,"longitud":-71.14,"nombre":"ELECTROLINERA SHELL TENO","propietario":"EMPRESA NACIONAL DE ENERGIA","comuna":"Teno","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:52:21.109Z","updatedAt":"2024-09-14T22:52:21.109Z","publishedAt":"2024-09-14T22:52:21.106Z","direccion":"San Cristóbal, Domingo Mansilla, Teno, Provincia de Curicó, Región del Maule, Chile","comentario":null}},{"id":155,"attributes":{"latitud":-34.77,"longitud":-71.04,"nombre":"Enel X - Zona de descanso La Platina","propietario":"Enel X Chile SpA","comuna":"Chimbarongo","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:52:24.500Z","updatedAt":"2024-09-14T22:52:24.500Z","publishedAt":"2024-09-14T22:52:24.498Z","direccion":"Ruta I-725, Porvenir La Platina, Chimbarongo, Provincia de Colchagua, Región del Libertador General Bernardo O'Higgins, 3090000, Chile","comentario":null}},{"id":156,"attributes":{"latitud":-34.73,"longitud":-71.04,"nombre":"COPEC Chimbarongo","propietario":"COMPANIAS DE PETROLEOS DE CHIL","comuna":"Chimbarongo","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:52:28.080Z","updatedAt":"2024-09-14T22:52:28.080Z","publishedAt":"2024-09-14T22:52:28.074Z","direccion":"Ruta 5 Sur, Santa Adela, Chimbarongo, Provincia de Colchagua, Región del Libertador General Bernardo O'Higgins, 3090000, Chile","comentario":null}},{"id":157,"attributes":{"latitud":-34.51,"longitud":-70.92,"nombre":"COPEC San Fernando","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"San Fernando","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:52:31.613Z","updatedAt":"2024-09-14T22:52:31.613Z","publishedAt":"2024-09-14T22:52:31.612Z","direccion":"Ruta 5 Sur, San Fernando, Provincia de Colchagua, Región del Libertador General Bernardo O'Higgins, Chile","comentario":null}},{"id":158,"attributes":{"latitud":-34.27,"longitud":-70.81,"nombre":"Enel X - Zona de descanso Santa Lucila.","propietario":"Enel X Chile SpA","comuna":"Requínoa","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:52:35.199Z","updatedAt":"2024-09-14T22:52:35.199Z","publishedAt":"2024-09-14T22:52:35.196Z","direccion":"Comercio, Alto Requinoa, Las Mercedes, Requínoa, Provincia de Cachapoal, Región del Libertador General Bernardo O'Higgins, 2920000, Chile","comentario":null}},{"id":159,"attributes":{"latitud":-34.17,"longitud":-70.73,"nombre":"ELECTROLINERA REPUBLICA DE CHILE 180 , RANCAGUA","propietario":"Empresa Nacional de Energia En","comuna":"Rancagua","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:52:38.793Z","updatedAt":"2024-09-14T22:52:38.793Z","publishedAt":"2024-09-14T22:52:38.790Z","direccion":"Colegio Bernardo O'Higgins, 455, Teniente Coronel José Bernardo Cuevas, Población Bernardo O'Higgins, Manzanal, Rancagua, Provincia de Cachapoal, Región del Libertador General Bernardo O'Higgins, 2852046, Chile","comentario":null}},{"id":160,"attributes":{"latitud":-34.02,"longitud":-70.7,"nombre":"COPEC Mostazal Oriente","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"Mostazal","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:52:42.317Z","updatedAt":"2024-09-14T22:52:42.317Z","publishedAt":"2024-09-14T22:52:42.311Z","direccion":"Caletera Ruta 5 Sur, La Rosa, Mostazal, Provincia de Cachapoal, Región del Libertador General Bernardo O'Higgins, 2120000, Chile","comentario":null}},{"id":161,"attributes":{"latitud":-34.01,"longitud":-70.7,"nombre":"COPEC Mostazal Poniente","propietario":"COMPANIAS DE PETROLEOS DE CHIL","comuna":"Mostazal","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:52:45.727Z","updatedAt":"2024-09-14T22:52:45.727Z","publishedAt":"2024-09-14T22:52:45.724Z","direccion":"Caletera Ruta 5 Sur, Mostazal, Provincia de Cachapoal, Región del Libertador General Bernardo O'Higgins, 2890204, Chile","comentario":null}},{"id":162,"attributes":{"latitud":-33.97,"longitud":-70.71,"nombre":"ELECTROLINERA SHELL SAN FRANCISCO DE MOSTAZAL","propietario":"EMPRESA NACIONAL DE ENERGIA","comuna":"Mostazal","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:52:49.131Z","updatedAt":"2024-09-14T22:52:49.131Z","publishedAt":"2024-09-14T22:52:49.130Z","direccion":"Pablo Neruda, San Ignacio, San Francisco de Mostazal, Mostazal, Provincia de Cachapoal, Región del Libertador General Bernardo O'Higgins, 2890204, Chile","comentario":null}},{"id":163,"attributes":{"latitud":-33.91,"longitud":-70.73,"nombre":"Cargador Intervial Angostura","propietario":"RUTA DEL MAIPO SOC. CONCESIONA","comuna":"Paine","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:52:52.699Z","updatedAt":"2024-09-14T22:52:52.699Z","publishedAt":"2024-09-14T22:52:52.694Z","direccion":"Ruta 5 Sur, Condominio Taormina, Paine, Provincia de Maipo, Región Metropolitana de Santiago, Chile","comentario":null}},{"id":164,"attributes":{"latitud":-33.69,"longitud":-70.73,"nombre":"Inst. Elec. Cargador de Vehiculos Eléctricos E/S M","propietario":"ENEX S.A.","comuna":"San Bernardo","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:52:56.200Z","updatedAt":"2024-09-14T22:52:56.200Z","publishedAt":"2024-09-14T22:52:56.198Z","direccion":"Ribera Norte Rio Maipo, El Romeral Oriente, San Bernardo, Provincia de Maipo, Región Metropolitana de Santiago, Chile","comentario":null}},{"id":165,"attributes":{"latitud":-33.68,"longitud":-70.73,"nombre":"ELECTROLINERA SHELL RIO MAIPO PONIENTE","propietario":"ENEX S.A.","comuna":"San Bernardo","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:52:59.796Z","updatedAt":"2024-09-14T22:52:59.796Z","publishedAt":"2024-09-14T22:52:59.794Z","direccion":"El Naranjal Sur, San Bernardo, Lo Herrera, Provincia de Maipo, Región Metropolitana de Santiago, 8080782, Chile","comentario":null}},{"id":166,"attributes":{"latitud":-33.65,"longitud":-71.62,"nombre":"COPEC Santo Domingo","propietario":"COMPANIA DE PETROLEOS DE CHILE","comuna":"Santo Domingo","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:53:03.318Z","updatedAt":"2024-09-14T22:53:03.318Z","publishedAt":"2024-09-14T22:53:03.315Z","direccion":"El Litre, Condominio Barrio Golf, Rocas de Santo Domingo, Santo Domingo, Provincia de San Antonio, Región de Valparaíso, 2720000, Chile","comentario":null}},{"id":167,"attributes":{"latitud":-33.63,"longitud":-70.87,"nombre":"COPEC Ruta 78- Lado Sur","propietario":"COMPAÑIA DE PETROLEOS COPEC","comuna":"Talagante","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:53:06.740Z","updatedAt":"2024-09-14T22:53:06.740Z","publishedAt":"2024-09-14T22:53:06.734Z","direccion":"Avenida Balmaceda, Las Palmeras, Peñaflor, Provincia de Talagante, Región Metropolitana de Santiago, 9750000, Chile","comentario":null}},{"id":168,"attributes":{"latitud":-33.63,"longitud":-70.87,"nombre":"COPEC Ruta 78- Lado Norte","propietario":"COMPA¿IA DE PETROLEOS COPEC","comuna":"Talagante","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:53:10.316Z","updatedAt":"2024-09-14T22:53:10.316Z","publishedAt":"2024-09-14T22:53:10.312Z","direccion":"Avenida Balmaceda, Las Palmeras, Peñaflor, Provincia de Talagante, Región Metropolitana de Santiago, 9750000, Chile","comentario":null}},{"id":169,"attributes":{"latitud":-33.58,"longitud":-70.71,"nombre":"Shell Autopista Central","propietario":"Empresa Nacional de Energia En","comuna":"San Bernardo","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:53:13.895Z","updatedAt":"2024-09-14T22:53:13.895Z","publishedAt":"2024-09-14T22:53:13.893Z","direccion":"346, Pasaje Los Vilos, San Bernardo, Provincia de Maipo, Región Metropolitana de Santiago, 8012117, Chile","comentario":null}},{"id":170,"attributes":{"latitud":-33.56,"longitud":-70.56,"nombre":"COPEC CAMILO HENRIQUEZ - PUENTE ALTO","propietario":"COMPANIA DE PETROLEOS COPEC","comuna":"Puente Alto","T1":0,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:53:17.536Z","updatedAt":"2024-09-14T22:53:17.536Z","publishedAt":"2024-09-14T22:53:17.533Z","direccion":"2275, Avenida Diego Portales, La Florida, Provincia de Santiago, Región Metropolitana de Santiago, 8220093, Chile","comentario":null}},{"id":171,"attributes":{"latitud":-33.54,"longitud":-70.71,"nombre":"IRVE GENERAL VELASQUEZ 9301 SAN BERNARDO","propietario":"COPEC SA","comuna":"San Bernardo","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:53:20.930Z","updatedAt":"2024-09-14T22:53:20.930Z","publishedAt":"2024-09-14T22:53:20.927Z","direccion":"Roberto Simpson Claro, Parque Industrial Puerta Sur, San Bernardo, Provincia de Maipo, Región Metropolitana de Santiago, 9140110, Chile","comentario":null}},{"id":172,"attributes":{"latitud":-33.52,"longitud":-70.66,"nombre":"SAVE KIA POMPEYO CARRASCO GRAN AVENIDA","propietario":"POMPEYO CARRASCO SPA","comuna":"La Cisterna","T1":0,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:53:24.305Z","updatedAt":"2024-09-14T22:53:24.305Z","publishedAt":"2024-09-14T22:53:24.302Z","direccion":"Kia Motors, Gran Avenida José Miguel Carrera, Población Rosembick, La Cisterna, Provincia de Santiago, Región Metropolitana de Santiago, 7980008, Chile","comentario":null}},{"id":173,"attributes":{"latitud":-33.47,"longitud":-70.62,"nombre":"COPEC SAN EUGENIO - ÑUÑOA","propietario":"COMPANIA DE PETROLEOS COPEC","comuna":"Nunoa","T1":0,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:53:27.691Z","updatedAt":"2024-09-14T22:53:27.691Z","publishedAt":"2024-09-14T22:53:27.690Z","direccion":"2039, Calle Cuatro, Villa Exequiel González Cortés, Ñuñoa, Provincia de Santiago, Región Metropolitana de Santiago, 8360848, Chile","comentario":null}},{"id":174,"attributes":{"latitud":-33.44,"longitud":-70.64,"nombre":"Edificio Enel","propietario":"Enel X Chile SpA","comuna":"Santiago","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:53:31.089Z","updatedAt":"2024-09-14T22:53:31.089Z","publishedAt":"2024-09-14T22:53:31.085Z","direccion":"Avenida Libertador Bernardo O'Higgins, Barrio Lastarria, Santiago, Provincia de Santiago, Región Metropolitana de Santiago, 6500808, Chile","comentario":null}},{"id":175,"attributes":{"latitud":-33.44,"longitud":-70.84,"nombre":"Enel X - Shell Laguna Caren","propietario":"INVERSIONES ENEX S.A.","comuna":"Pudahuel","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:53:34.518Z","updatedAt":"2024-09-14T22:53:34.518Z","publishedAt":"2024-09-14T22:53:34.513Z","direccion":"Parque de Innovación Universidad de Chile, Laguna Carén, Carén, Pudahuel, Provincia de Santiago, Región Metropolitana de Santiago, Chile","comentario":null}},{"id":176,"attributes":{"latitud":-33.43,"longitud":-70.81,"nombre":"Copec Costanera Norte, Pudahuel","propietario":"Compañía de Petróleos de Chile Copec S.A.","comuna":"Pudahuel","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:53:38.049Z","updatedAt":"2024-09-14T22:53:38.049Z","publishedAt":"2024-09-14T22:53:38.047Z","direccion":"Pudahuel, Provincia de Santiago, Región Metropolitana de Santiago, Chile","comentario":null}},{"id":177,"attributes":{"latitud":-33.43,"longitud":-70.58,"nombre":"SAVE INDUMOTORA BILBAO 5459","propietario":"INMOBILIARIA INDUMOTORA SPA","comuna":"La Reina","T1":0,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:53:41.582Z","updatedAt":"2024-09-14T22:53:41.582Z","publishedAt":"2024-09-14T22:53:41.576Z","direccion":"Vet Surg, 1851, Juan de Austria, Vaticano, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7580386, Chile","comentario":null}},{"id":178,"attributes":{"latitud":-33.41,"longitud":-70.68,"nombre":"IRVE SHELL DOMINGO SANTA MARIA 1395  INDEPENDENCIA","propietario":"Empresa Nacional de Energia En","comuna":"Independencia","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:53:45.072Z","updatedAt":"2024-09-14T22:53:45.072Z","publishedAt":"2024-09-14T22:53:45.072Z","direccion":"Avenida Presidente Eduardo Frei Montalva, Villa CCU, Renca, Provincia de Santiago, Región Metropolitana de Santiago, 8390450, Chile","comentario":null}},{"id":179,"attributes":{"latitud":-33.41,"longitud":-70.54,"nombre":"Cargador Electrico Shell Los Dominicos","propietario":"ENEX S.A.","comuna":"Las Condes","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:53:48.769Z","updatedAt":"2024-09-14T22:53:48.769Z","publishedAt":"2024-09-14T22:53:48.766Z","direccion":"459, Raúl Rivera Blin, Villa Apolo, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7570936, Chile","comentario":null}},{"id":180,"attributes":{"latitud":-33.41,"longitud":-70.51,"nombre":"COPEC SAN RAMON - LAS CONDES","propietario":"COMPANIA DE PETROLEOS COPEC","comuna":"Las Condes","T1":0,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:53:52.253Z","updatedAt":"2024-09-14T22:53:52.253Z","publishedAt":"2024-09-14T22:53:52.251Z","direccion":"Otoñal Oriente, Condominio Los Bellotos, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7610685, Chile","comentario":null}},{"id":181,"attributes":{"latitud":-33.4,"longitud":-70.59,"nombre":"Petrobras Vitacura con Vespucio","propietario":"PETROBRAS CHILE LTDA","comuna":"Vitacura","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:53:55.810Z","updatedAt":"2024-09-14T22:53:55.810Z","publishedAt":"2024-09-14T22:53:55.808Z","direccion":"1670, Los Laureles, Lo Castillo, Vitacura, Provincia de Santiago, Región Metropolitana de Santiago, 7630530, Chile","comentario":null}},{"id":182,"attributes":{"latitud":-33.37,"longitud":-70.52,"nombre":"COPEC  CANTA GALLO - LAS CONDES","propietario":"COMPANIA DE PETROLEOS COPEC","comuna":"Las Condes","T1":0,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:53:59.425Z","updatedAt":"2024-09-14T22:53:59.425Z","publishedAt":"2024-09-14T22:53:59.423Z","direccion":"Autopista Costanera Norte, Vitacura, Provincia de Santiago, Región Metropolitana de Santiago, 7710171, Chile","comentario":null}},{"id":183,"attributes":{"latitud":-33.36,"longitud":-70.51,"nombre":"SAVE INDUMOTORA ONE LA DEHESA","propietario":"INMOBILIARIA INDUMOTORA SPA","comuna":"Lo Barnechea","T1":0,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:54:03.033Z","updatedAt":"2024-09-14T22:54:03.033Z","publishedAt":"2024-09-14T22:54:03.030Z","direccion":"María Roman Guerrero, Villa La Ponderosa, Lo Barnechea, Provincia de Santiago, Región Metropolitana de Santiago, 7690286, Chile","comentario":null}},{"id":184,"attributes":{"latitud":-33.36,"longitud":-70.67,"nombre":"COPEC PEDRO FONTOVA - HUECHURABA","propietario":"COMPANIA DE PETROLEOS COPEC","comuna":"Huechuraba","T1":0,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:54:06.666Z","updatedAt":"2024-09-14T22:54:06.666Z","publishedAt":"2024-09-14T22:54:06.663Z","direccion":"Copec, 6789, Avenida Pedro Fontova, Villa Esperanza, Huechuraba, Provincia de Santiago, Región Metropolitana de Santiago, 8600578, Chile","comentario":null}},{"id":185,"attributes":{"latitud":-33.34,"longitud":-70.55,"nombre":"ELECTROLINERA SHELL LOS TRAPENSES","propietario":"ENEX S.A.","comuna":"Lo Barnechea","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:54:10.197Z","updatedAt":"2024-09-14T22:54:10.197Z","publishedAt":"2024-09-14T22:54:10.192Z","direccion":"Camino Buenavista, Los Trapenses, Lo Barnechea, Provincia de Santiago, Región Metropolitana de Santiago, 7700651, Chile","comentario":null}},{"id":186,"attributes":{"latitud":-33.31,"longitud":-70.66,"nombre":"COPEC CHAMISERO - COLINA","propietario":"COMPANIA DE PETROLEOS COPEC","comuna":"Colina","T1":0,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:54:13.735Z","updatedAt":"2024-09-14T22:54:13.735Z","publishedAt":"2024-09-14T22:54:13.732Z","direccion":"Avenida Chamisero, El Portezuelo de Chamisero, Condominio Valle Hermoso, Chamisero, Colina, Provincia de Chacabuco, Región Metropolitana de Santiago, 8600651, Chile","comentario":null}},{"id":187,"attributes":{"latitud":-33.24,"longitud":-70.76,"nombre":"Inst. Cargador Globalvía Peaje Lampa Poniente","propietario":"Autopista Globlavia","comuna":"Lampa","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:54:17.268Z","updatedAt":"2024-09-14T22:54:17.268Z","publishedAt":"2024-09-14T22:54:17.264Z","direccion":"Lampa, Liray Norte, Provincia de Chacabuco, Región Metropolitana de Santiago, 9380000, Chile","comentario":null}},{"id":188,"attributes":{"latitud":-33.22,"longitud":-70.77,"nombre":"COPEC Colina","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"Colina","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:54:20.782Z","updatedAt":"2024-09-14T22:54:20.782Z","publishedAt":"2024-09-14T22:54:20.781Z","direccion":"Lampa, Santa Sara del Norte, Provincia de Chacabuco, Región Metropolitana de Santiago, 9380000, Chile","comentario":null}},{"id":189,"attributes":{"latitud":-33.13,"longitud":-71.56,"nombre":"COPEC Placilla","propietario":"COMPANIAS DE PETROLEOS DE CHIL","comuna":"Valparaíso","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:54:24.285Z","updatedAt":"2024-09-14T22:54:24.285Z","publishedAt":"2024-09-14T22:54:24.283Z","direccion":"Cerro El Altar, Parque Industrial Curauma, Curauma, Placilla de Peñuelas, Valparaíso, Provincia de Valparaíso, Región de Valparaíso, Chile","comentario":null}},{"id":190,"attributes":{"latitud":-33.12,"longitud":-71.56,"nombre":"Shell Placilla","propietario":"EMPRESA NACIONAL DE ENERGIA ENEX S.A","comuna":"Valparaíso","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:54:27.944Z","updatedAt":"2024-09-14T22:54:27.944Z","publishedAt":"2024-09-14T22:54:27.941Z","direccion":"Soprole, IICC Placilla Norte, Curauma, Placilla de Peñuelas, Valparaíso, Provincia de Valparaíso, Región de Valparaíso, Chile","comentario":null}},{"id":191,"attributes":{"latitud":-33.02,"longitud":-71.55,"nombre":"Copec Av Libertad 501","propietario":"Compañía de Petróleos de Chile Copec S.A.","comuna":"Vina del Mar","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:54:31.452Z","updatedAt":"2024-09-14T22:54:31.452Z","publishedAt":"2024-09-14T22:54:31.443Z","direccion":"Museo de Arqueología e Historia Francisco Fonck, 784, 4 Norte, Población Vergara, Viña del Mar, Provincia de Valparaíso, Región de Valparaíso, 2520314, Chile","comentario":null}},{"id":192,"attributes":{"latitud":-32.95,"longitud":-71.54,"nombre":"SAVE ESTACION DE SERVICIO ENEX CONCON","propietario":"EMP. NACIONAL DE ENERGIA ENEX","comuna":"Concón","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:54:35.135Z","updatedAt":"2024-09-14T22:54:35.135Z","publishedAt":"2024-09-14T22:54:35.133Z","direccion":"Mirador de Montemar, Concón, Provincia de Valparaíso, Región de Valparaíso, 2510513, Chile","comentario":null}},{"id":193,"attributes":{"latitud":-32.84,"longitud":-71,"nombre":"COPEC Llay Llay","propietario":"COMPANIA DE PETROLEOS DE CHILE","comuna":"Llaillay","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:54:38.668Z","updatedAt":"2024-09-14T22:54:38.668Z","publishedAt":"2024-09-14T22:54:38.665Z","direccion":"Recinto Estación, Llay-Llay, Provincia de San Felipe de Aconcagua, Región de Valparaíso, 2210000, Chile","comentario":null}},{"id":194,"attributes":{"latitud":-32.83,"longitud":-71.13,"nombre":"COPEC Hijuelas","propietario":"COMPANIA DE PETROLEOS DE CHILE","comuna":"Hijuelas","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:54:42.173Z","updatedAt":"2024-09-14T22:54:42.173Z","publishedAt":"2024-09-14T22:54:42.166Z","direccion":"Caletera Ruta 5, Barracita, Hijuelas, Provincia de Quillota, Región de Valparaíso, Chile","comentario":null}},{"id":195,"attributes":{"latitud":-32.67,"longitud":-71.43,"nombre":"COPEC Marbella","propietario":"COMPANIAS DE PETROLEOS DE CHIL","comuna":"Puchuncaví","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:54:45.631Z","updatedAt":"2024-09-14T22:54:45.631Z","publishedAt":"2024-09-14T22:54:45.626Z","direccion":"Marbella, Maitencillo, Puchuncaví, Provincia de Valparaíso, Región de Valparaíso, 2500000, Chile","comentario":null}},{"id":196,"attributes":{"latitud":-32.52,"longitud":-71.26,"nombre":"Enel X-Globalvia Zapallar","propietario":"Soc. Concesionaria Autopista","comuna":"Zapallar","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:54:49.146Z","updatedAt":"2024-09-14T22:54:49.146Z","publishedAt":"2024-09-14T22:54:49.144Z","direccion":"La Ligua, Provincia de Petorca, Región de Valparaíso, Chile","comentario":null}},{"id":197,"attributes":{"latitud":-32.08,"longitud":-71.52,"nombre":"COPEC Ruta 5 Norte km 205. Palo Colorado Oriente","propietario":"COMPANIA DE PETROLEOS COPEC","comuna":"Los Vilos","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:54:52.672Z","updatedAt":"2024-09-14T22:54:52.672Z","publishedAt":"2024-09-14T22:54:52.671Z","direccion":"Ruta 5 Norte, Los Vilos, Provincia de Choapa, Región de Coquimbo, Chile","comentario":null}},{"id":198,"attributes":{"latitud":-32.08,"longitud":-71.52,"nombre":"Copec ruta 5 Norte km 205. Palo Colorado Poniente","propietario":"COMPANIA DE PETROLEOS COPEC","comuna":"Los Vilos","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:54:56.267Z","updatedAt":"2024-09-14T22:54:56.267Z","publishedAt":"2024-09-14T22:54:56.266Z","direccion":"Ruta 5 Norte, Los Vilos, Provincia de Choapa, Región de Coquimbo, Chile","comentario":null}},{"id":199,"attributes":{"latitud":-31.89,"longitud":-71.49,"nombre":"COPEC Los Vilos, km 225","propietario":"COMPANIA DE PETROLEOS COPEC","comuna":"Los Vilos","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:54:59.784Z","updatedAt":"2024-09-14T22:54:59.784Z","publishedAt":"2024-09-14T22:54:59.783Z","direccion":"Ruta 5 Norte, Pantanal, Los Vilos, Provincia de Choapa, Región de Coquimbo, Chile","comentario":null}},{"id":200,"attributes":{"latitud":-30.72,"longitud":-71.49,"nombre":"COPEC Ruta 5 Norte  km 370 -Socos, Ovalle","propietario":"COMPANIA DE PETROLEOS COPEC","comuna":"Ovalle","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:55:03.478Z","updatedAt":"2024-09-14T22:55:03.478Z","publishedAt":"2024-09-14T22:55:03.472Z","direccion":"Socos, Ovalle, Provincia de Limarí, Región de Coquimbo, Chile","comentario":null}},{"id":201,"attributes":{"latitud":-30.01,"longitud":-71.38,"nombre":"ESTACION DE SERVICIOS COPEC COQUIMBO SALIDA SUR","propietario":"COMPANIA DE PETROLEOS COPEC","comuna":"Coquimbo","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:55:06.939Z","updatedAt":"2024-09-14T22:55:06.939Z","publishedAt":"2024-09-14T22:55:06.937Z","direccion":"Ensenada del Panul, Coquimbo, Provincia de Elqui, Región de Coquimbo, Chile","comentario":null}},{"id":202,"attributes":{"latitud":-29.94,"longitud":-71.28,"nombre":"COPEC Parcela 20 Las Vegas de La Serena","propietario":"COMPANIA DE PETROLEOS COPEC","comuna":"La Serena","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:55:10.377Z","updatedAt":"2024-09-14T22:55:10.377Z","publishedAt":"2024-09-14T22:55:10.373Z","direccion":"Camino Parcelas Vegas Sur, La Serena, Provincia de Elqui, Región de Coquimbo, 1711017, Chile","comentario":null}},{"id":203,"attributes":{"latitud":-27.36,"longitud":-70.34,"nombre":"Oficina CGE, Copiapo","propietario":"CGE .S.A.","comuna":"Copiapó","T1":0,"T2":1,"T2SC":0,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:55:13.875Z","updatedAt":"2024-09-14T22:55:13.875Z","publishedAt":"2024-09-14T22:55:13.872Z","direccion":"Lautaro, Borgoño, Copiapó, Provincia de Copiapó, Región de Atacama, 1530000, Chile","comentario":null}},{"id":204,"attributes":{"latitud":-23.57,"longitud":-70.4,"nombre":"COPEC Costanera Antofagasta","propietario":"COMPANIA DE PETROLEOS COPEC","comuna":"Antofagasta","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:55:17.396Z","updatedAt":"2024-09-14T22:55:17.396Z","publishedAt":"2024-09-14T22:55:17.395Z","direccion":"Avenida Edmundo Pérez Zujovic, Condominio Bordemar, Antofagasta, Provincia de Antofagasta, Región de Antofagasta, 1200000, Chile","comentario":null}},{"id":205,"attributes":{"latitud":-22.91,"longitud":-68.19,"nombre":"SAVE VOLTEX 10024 EDS COPEC","propietario":"Cía. de Petroleos de Chile S.A","comuna":"San Pedro de Atacama","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:55:21.422Z","updatedAt":"2024-09-14T22:55:21.422Z","publishedAt":"2024-09-14T22:55:21.421Z","direccion":"Azufrera Purico, Vilama, San Pedro de Atacama, Provincia de El Loa, Región de Antofagasta, 7473883, Chile","comentario":null}},{"id":206,"attributes":{"latitud":-22.45,"longitud":-68.93,"nombre":"SAVE VOLTEX 10101 EDS COPEC","propietario":"COPEC S.A.","comuna":"Calama","T1":0,"T2":1,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:55:26.636Z","updatedAt":"2024-09-14T22:55:26.636Z","publishedAt":"2024-09-14T22:55:26.632Z","direccion":"Costa Rica, Calama, Provincia de El Loa, Región de Antofagasta, 1395584, Chile","comentario":null}},{"id":207,"attributes":{"latitud":-33.4,"longitud":-70.58,"nombre":"Enel X Way - Mall Parque Arauco","propietario":"ENEL X WAY CHILE SPA","comuna":"Las Condes","T1":0,"T2":0,"T2SC":170,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:55:30.575Z","updatedAt":"2024-09-14T22:55:30.575Z","publishedAt":"2024-09-14T22:55:30.574Z","direccion":"1110, Pedro Canisio, Jardín del Este, Vitacura, Provincia de Santiago, Región Metropolitana de Santiago, 7630280, Chile","comentario":null}},{"id":208,"attributes":{"latitud":-33.46,"longitud":-70.71,"nombre":"Enel X Way - Espacio Urbano Las Rejas","propietario":"Enel Mobility Chile SPA","comuna":"Estación Central","T1":0,"T2":0,"T2SC":103,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:55:34.861Z","updatedAt":"2024-09-14T22:55:34.861Z","publishedAt":"2024-09-14T22:55:34.858Z","direccion":"111, Las Catalpas Poniente, Villa O'Higgins, Estación Central, Provincia de Santiago, Región Metropolitana de Santiago, 9190847, Chile","comentario":null}},{"id":209,"attributes":{"latitud":-33.33,"longitud":-70.7,"nombre":"Enel X Way-Arauco Buenaventura.","propietario":"Enel Mobility Chile SPA","comuna":"Quilicura","T1":0,"T2":0,"T2SC":6,"CCST2":3,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:55:38.992Z","updatedAt":"2024-09-14T22:55:38.992Z","publishedAt":"2024-09-14T22:55:38.990Z","direccion":"Caupolicán, Parque Industrial Arrigoni, Quilicura, Provincia de Santiago, Región Metropolitana de Santiago, 8710022, Chile","comentario":null}},{"id":210,"attributes":{"latitud":-33.4,"longitud":-70.79,"nombre":"Cargadores Estacionamientos Aeropuerto Pudahuel","propietario":"Soc. Con. Nuevo Pudahuel S.A.","comuna":"Pudahuel","T1":0,"T2":0,"T2SC":6,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:55:42.426Z","updatedAt":"2024-09-14T22:55:42.426Z","publishedAt":"2024-09-14T22:55:42.425Z","direccion":"Armando Cortínez Oriente, Pudahuel, Provincia de Santiago, Región Metropolitana de Santiago, 9020000, Chile","comentario":null}},{"id":211,"attributes":{"latitud":-36.79,"longitud":-73.07,"nombre":"Electrolineras Mall Trebol","propietario":"Plaza del Trebol Sa.","comuna":"Concepción","T1":0,"T2":0,"T2SC":4,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:55:46.535Z","updatedAt":"2024-09-14T22:55:46.535Z","publishedAt":"2024-09-14T22:55:46.528Z","direccion":"Avenida Santa María, Talcahuano, Provincia de Concepción, Región del Biobío, 4061735, Chile","comentario":null}},{"id":212,"attributes":{"latitud":-33.48,"longitud":-70.63,"nombre":"PLAZA VALDIVIESO","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"San Joaquín","T1":0,"T2":0,"T2SC":4,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:55:49.995Z","updatedAt":"2024-09-14T22:55:49.995Z","publishedAt":"2024-09-14T22:55:49.990Z","direccion":"2901, Haendel, Población Chile, San Joaquín, Provincia de Santiago, Región Metropolitana de Santiago, 8361020, Chile","comentario":null}},{"id":213,"attributes":{"latitud":-33.42,"longitud":-70.6,"nombre":"Enel X Way - MUT","propietario":"Enel Mobility Chile SPA","comuna":"Las Condes","T1":0,"T2":0,"T2SC":2,"CCST2":2,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:55:53.562Z","updatedAt":"2024-09-14T22:55:53.562Z","publishedAt":"2024-09-14T22:55:53.560Z","direccion":"239, Avenida Tobalaba, Sanhattan, Providencia, Provincia de Santiago, Región Metropolitana de Santiago, 7500000, Chile","comentario":null}},{"id":214,"attributes":{"latitud":-33.39,"longitud":-70.55,"nombre":"Cargadores Ditec Padre Hurtado","propietario":"Comer. Ditec Automoviles SA","comuna":"Vitacura","T1":0,"T2":0,"T2SC":4,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:55:57.347Z","updatedAt":"2024-09-14T22:55:57.347Z","publishedAt":"2024-09-14T22:55:57.347Z","direccion":"Avenida Presidente Kennedy, El Dorado, Vitacura, Provincia de Santiago, Región Metropolitana de Santiago, 7560875, Chile","comentario":null}},{"id":215,"attributes":{"latitud":-33.37,"longitud":-70.68,"nombre":"PUNTO DE RECARGA DOBLE EV-BOX","propietario":"NUEVOS DESARROLLOS SA","comuna":"Huechuraba","T1":0,"T2":0,"T2SC":4,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:56:00.899Z","updatedAt":"2024-09-14T22:56:00.899Z","publishedAt":"2024-09-14T22:56:00.898Z","direccion":"5901, Ernesto Ried, Población Juanita Aguirre, Conchalí, Provincia de Santiago, Región Metropolitana de Santiago, 8590483, Chile","comentario":null}},{"id":216,"attributes":{"latitud":-32.97,"longitud":-71.53,"nombre":"Enel X Way - Hotel Bosque de Reñaca","propietario":"Enel Mobility Chile SPA","comuna":"Vina del Mar","T1":0,"T2":0,"T2SC":4,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:56:04.423Z","updatedAt":"2024-09-14T22:56:04.423Z","publishedAt":"2024-09-14T22:56:04.422Z","direccion":"Condominio Casa Reñaca, Reñaca, Viña del Mar, Provincia de Valparaíso, Región de Valparaíso, 2540146, Chile","comentario":null}},{"id":217,"attributes":{"latitud":-33.46,"longitud":-70.57,"nombre":"ENEL X WAY -CARGADORES ELECTRICOS EDICIO HELSINSKI","propietario":"Inmobiliaria FG Oriente SpA","comuna":"La Reina","T1":0,"T2":0,"T2SC":3,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:56:07.949Z","updatedAt":"2024-09-14T22:56:07.949Z","publishedAt":"2024-09-14T22:56:07.946Z","direccion":"Instituto Nacional de Rehabilitación Pedro Aguirre Cerda, 5969, Avenida José Arrieta, Barrio Blest Gana, La Reina, Provincia de Santiago, Región Metropolitana de Santiago, 7870154, Chile","comentario":null}},{"id":218,"attributes":{"latitud":-33.45,"longitud":-70.65,"nombre":"Saba Paseo Bulnes","propietario":"Concesionaria estacionamientos","comuna":"Santiago","T1":0,"T2":0,"T2SC":3,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:56:11.482Z","updatedAt":"2024-09-14T22:56:11.482Z","publishedAt":"2024-09-14T22:56:11.481Z","direccion":"1067, Cóndor, Barrio San Diego, Santiago, Provincia de Santiago, Región Metropolitana de Santiago, 8330444, Chile","comentario":null}},{"id":219,"attributes":{"latitud":-33.44,"longitud":-70.65,"nombre":"Saba Santa Rosa","propietario":"Saba estacionamientos de chile","comuna":"Santiago","T1":0,"T2":0,"T2SC":3,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:56:16.111Z","updatedAt":"2024-09-14T22:56:16.111Z","publishedAt":"2024-09-14T22:56:16.103Z","direccion":"930, Huérfanos, Centro Histórico, Santiago, Provincia de Santiago, Región Metropolitana de Santiago, 8320202, Chile","comentario":null}},{"id":220,"attributes":{"latitud":-33.43,"longitud":-70.65,"nombre":"Enel X Way - Saba parque forestal","propietario":"Saba estacionamientos de chile","comuna":"Santiago","T1":0,"T2":0,"T2SC":3,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:56:19.632Z","updatedAt":"2024-09-14T22:56:19.632Z","publishedAt":"2024-09-14T22:56:19.630Z","direccion":"La Vega Central, Lastra, Patronato, Recoleta, Provincia de Santiago, Región Metropolitana de Santiago, 8320012, Chile","comentario":null}},{"id":221,"attributes":{"latitud":-33.43,"longitud":-70.61,"nombre":"Parking Saba Marchant Pereira","propietario":"Saba estacionamientos de chile","comuna":"Providencia","T1":0,"T2":0,"T2SC":3,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:56:23.169Z","updatedAt":"2024-09-14T22:56:23.169Z","publishedAt":"2024-09-14T22:56:23.168Z","direccion":"Los Pinos, 755, Avenida Pedro de Valdivia, Barrio Lyon, Providencia, Provincia de Santiago, Región Metropolitana de Santiago, 7500000, Chile","comentario":null}},{"id":222,"attributes":{"latitud":-33.42,"longitud":-70.61,"nombre":"Parking Saba Pedro de Valdivia","propietario":"Saba estacionamientos de chile","comuna":"Providencia","T1":0,"T2":0,"T2SC":3,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:56:26.686Z","updatedAt":"2024-09-14T22:56:26.686Z","publishedAt":"2024-09-14T22:56:26.680Z","direccion":"154, Santa Magdalena, Sanhattan, Providencia, Provincia de Santiago, Región Metropolitana de Santiago, 7500000, Chile","comentario":null}},{"id":223,"attributes":{"latitud":-33.42,"longitud":-70.61,"nombre":"Parking Saba Ricardo Lyon","propietario":"Saba estacionamientos de chile","comuna":"Providencia","T1":0,"T2":0,"T2SC":3,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:56:30.224Z","updatedAt":"2024-09-14T22:56:30.224Z","publishedAt":"2024-09-14T22:56:30.217Z","direccion":"154, Santa Magdalena, Sanhattan, Providencia, Provincia de Santiago, Región Metropolitana de Santiago, 7500000, Chile","comentario":null}},{"id":224,"attributes":{"latitud":-33.42,"longitud":-70.61,"nombre":"Parking Saba Guardia Vieja","propietario":"Saba etacionamientos de chile","comuna":"Providencia","T1":0,"T2":0,"T2SC":3,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:56:33.774Z","updatedAt":"2024-09-14T22:56:33.774Z","publishedAt":"2024-09-14T22:56:33.773Z","direccion":"154, Santa Magdalena, Sanhattan, Providencia, Provincia de Santiago, Región Metropolitana de Santiago, 7500000, Chile","comentario":null}},{"id":225,"attributes":{"latitud":-33.42,"longitud":-70.55,"nombre":"Enel X Way - Petrobras Rotonda Atenas","propietario":"Rentas e inversiones Baker SpA","comuna":"Las Condes","T1":0,"T2":0,"T2SC":1,"CCST2":2,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:56:37.276Z","updatedAt":"2024-09-14T22:56:37.276Z","publishedAt":"2024-09-14T22:56:37.272Z","direccion":"1137, Guadarrama, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7570685, Chile","comentario":null}},{"id":226,"attributes":{"latitud":-33.41,"longitud":-70.57,"nombre":"SAVE Edificio Matta 530","propietario":"Copec Voltex","comuna":"Las Condes","T1":0,"T2":0,"T2SC":3,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:56:40.898Z","updatedAt":"2024-09-14T22:56:40.898Z","publishedAt":"2024-09-14T22:56:40.897Z","direccion":"Plaza Apoquindo, Mar de los Sargazos, Barrio El Faro, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7560943, Chile","comentario":null}},{"id":227,"attributes":{"latitud":-33.4,"longitud":-70.58,"nombre":"Open Kennedy","propietario":"Sociedad de Rentas Falabella","comuna":"Las Condes","T1":0,"T2":0,"T2SC":3,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:56:44.418Z","updatedAt":"2024-09-14T22:56:44.418Z","publishedAt":"2024-09-14T22:56:44.414Z","direccion":"1110, Pedro Canisio, Jardín del Este, Vitacura, Provincia de Santiago, Región Metropolitana de Santiago, 7630280, Chile","comentario":null}},{"id":228,"attributes":{"latitud":-33.4,"longitud":-70.6,"nombre":"SAVE Casa Costanera","propietario":"ADMINISTRADORA CASA C SPA","comuna":"Vitacura","T1":0,"T2":0,"T2SC":3,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:56:47.986Z","updatedAt":"2024-09-14T22:56:47.986Z","publishedAt":"2024-09-14T22:56:47.982Z","direccion":"Atacama Large Millimeter/submillimeter Array, Alonso de Córdova, Lo Castillo, Vitacura, Provincia de Santiago, Región Metropolitana de Santiago, 7630391, Chile","comentario":null}},{"id":229,"attributes":{"latitud":-33.36,"longitud":-70.49,"nombre":"SAVE Club de Golf Valle Escondido","propietario":"Club de Golf Valle Escondido","comuna":"Lo Barnechea","T1":0,"T2":0,"T2SC":3,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:56:51.813Z","updatedAt":"2024-09-14T22:56:51.813Z","publishedAt":"2024-09-14T22:56:51.811Z","direccion":"Avenida Paseo Pie Andino, Cerro Dieciocho, Lo Barnechea, Provincia de Santiago, Región Metropolitana de Santiago, 7710053, Chile","comentario":null}},{"id":230,"attributes":{"latitud":-42.46,"longitud":-73.77,"nombre":"Enel X - Sodimac Castro","propietario":"SODIMAC S.A","comuna":"Castro","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:56:55.453Z","updatedAt":"2024-09-14T22:56:55.453Z","publishedAt":"2024-09-14T22:56:55.453Z","direccion":"Ruta 5 Sur, Alonso de Ercilla, Ten Ten Bajo, Tentén, Castro, Provincia de Chiloé, Región de Los Lagos, 5700196, Chile","comentario":null}},{"id":231,"attributes":{"latitud":-41.47,"longitud":-72.94,"nombre":"CARGA VEHICULAR GRUPO SAESA PTO MONTT","propietario":"SOCIEDAD AUSTRAL DE ELEC. SA","comuna":"Puerto Montt","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:56:59.207Z","updatedAt":"2024-09-14T22:56:59.207Z","publishedAt":"2024-09-14T22:56:59.204Z","direccion":"Escuela España, 400, Rengifo, Villa Michaely, Puerto Montt, Provincia de Llanquihue, Región de Los Lagos, 5507138, Chile","comentario":null}},{"id":232,"attributes":{"latitud":-41.46,"longitud":-72.95,"nombre":"Enel X - Sodimac Puerto Montt","propietario":"SODIMAC S.A","comuna":"Puerto Montt","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:57:02.666Z","updatedAt":"2024-09-14T22:57:02.666Z","publishedAt":"2024-09-14T22:57:02.666Z","direccion":"Lider, Avenida Parque Industrial, Población Rotonda, Padre José Fernández Pérez, Puerto Montt, Provincia de Llanquihue, Región de Los Lagos, 5507138, Chile","comentario":null}},{"id":233,"attributes":{"latitud":-41.44,"longitud":-72.91,"nombre":"OUTLET PASEO ALERCE","propietario":"INMOBILIARIA POWER CENTER LTDA","comuna":"Puerto Montt","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:57:06.121Z","updatedAt":"2024-09-14T22:57:06.121Z","publishedAt":"2024-09-14T22:57:06.120Z","direccion":"Outlet Paseo Alerce, 2001, Avenida Ferrocarril, La Vara, Puerto Montt, Provincia de Llanquihue, Región de Los Lagos, 5480001, Chile","comentario":null}},{"id":234,"attributes":{"latitud":-41.21,"longitud":-72.72,"nombre":"Enel X - Hotel AWA","propietario":"Hotelera Piedra Linda Ltda","comuna":"Puerto Varas","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:57:09.745Z","updatedAt":"2024-09-14T22:57:09.745Z","publishedAt":"2024-09-14T22:57:09.741Z","direccion":"Parcelación Los Riscos, Puerto Varas, Provincia de Llanquihue, Región de Los Lagos, Chile","comentario":null}},{"id":235,"attributes":{"latitud":-38.75,"longitud":-72.62,"nombre":"Enel X - UFRO Temuco","propietario":"Universidad de la Frontera","comuna":"Temuco","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:57:13.611Z","updatedAt":"2024-09-14T22:57:13.611Z","publishedAt":"2024-09-14T22:57:13.610Z","direccion":"Hogar Mapuche Pelontuwe Temuco, 01020, Avenida Las Encinas, Villa Andalucía, Temuco, Provincia de Cautín, Región de la Araucanía, 4811161, Chile","comentario":null}},{"id":236,"attributes":{"latitud":-38.74,"longitud":-72.61,"nombre":"Enel X - Sodimac Temuco","propietario":"SODIMAC S.A","comuna":"Temuco","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:57:17.234Z","updatedAt":"2024-09-14T22:57:17.234Z","publishedAt":"2024-09-14T22:57:17.232Z","direccion":"932, San Guillermo, Barrio Dreves, Temuco, Provincia de Cautín, Región de la Araucanía, 4811161, Chile","comentario":null}},{"id":237,"attributes":{"latitud":-36.81,"longitud":-73.05,"nombre":"Enel X - Autoplanet Concepcion","propietario":"Soc comercializadora de repues","comuna":"Concepción","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:57:20.744Z","updatedAt":"2024-09-14T22:57:20.744Z","publishedAt":"2024-09-14T22:57:20.742Z","direccion":"AutoPlanet, Avenida Paicaví, Tres Pascualas, Concepción, Provincia de Concepción, Región del Biobío, 4081375, Chile","comentario":null}},{"id":238,"attributes":{"latitud":-35.42,"longitud":-71.66,"nombre":"Enel X Way - EcoHotel","propietario":"Enel Mobility Chile SPA","comuna":"Talca","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:57:24.218Z","updatedAt":"2024-09-14T22:57:24.218Z","publishedAt":"2024-09-14T22:57:24.216Z","direccion":"1693, Calle 6 Norte, Barrio San Agustín, Talca, Provincia de Talca, Región del Maule, 3461632, Chile","comentario":null}},{"id":239,"attributes":{"latitud":-34.43,"longitud":-72.04,"nombre":"Enel X Way - Hotel Alaia","propietario":"Operadora Hotel Alaia SpA","comuna":"Pichilemu","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:57:27.673Z","updatedAt":"2024-09-14T22:57:27.673Z","publishedAt":"2024-09-14T22:57:27.672Z","direccion":"Cabañas Ecológicas Desde Oriente, Acceso a Punta de Lobos, Punta de Lobos, Pichilemu, Provincia de Cardenal Caro, Región del Libertador General Bernardo O'Higgins, 3220000, Chile","comentario":null}},{"id":240,"attributes":{"latitud":-34.41,"longitud":-72.03,"nombre":"Enel X Privados - CARGADORES GIMNASIO WM PICHILEMU","propietario":"WM INVERSIONES SPA","comuna":"Pichilemu","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:57:31.681Z","updatedAt":"2024-09-14T22:57:31.681Z","publishedAt":"2024-09-14T22:57:31.680Z","direccion":"Villa Los Mineros, Pichilemu, Provincia de Cardenal Caro, Región del Libertador General Bernardo O'Higgins, 3220000, Chile","comentario":null}},{"id":241,"attributes":{"latitud":-34.19,"longitud":-70.7,"nombre":"Enel X - StripCenter Nogales","propietario":"Enel X Chile SpA","comuna":"Machalí","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:57:35.746Z","updatedAt":"2024-09-14T22:57:35.746Z","publishedAt":"2024-09-14T22:57:35.745Z","direccion":"Miguel de Cruchaga, Los Huertos de Machalí, Machalí, Provincia de Cachapoal, Región del Libertador General Bernardo O'Higgins, 2910796, Chile","comentario":null}},{"id":242,"attributes":{"latitud":-34.17,"longitud":-70.72,"nombre":"Enel X Way - Petrobras Rancagua La Compañia","propietario":"Rentas e inversiones Baker SpA","comuna":"Rancagua","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:57:39.719Z","updatedAt":"2024-09-14T22:57:39.719Z","publishedAt":"2024-09-14T22:57:39.716Z","direccion":"Avenida La Compañía, Villa Alborada, Manzanal, Rancagua, Provincia de Cachapoal, Región del Libertador General Bernardo O'Higgins, 2020800, Chile","comentario":null}},{"id":243,"attributes":{"latitud":-33.96,"longitud":-70.71,"nombre":"Enel X Way - ISA Intervial Los Lagartos","propietario":"ENEL X WAY CHILE SPA","comuna":"Mostazal","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:57:43.226Z","updatedAt":"2024-09-14T22:57:43.226Z","publishedAt":"2024-09-14T22:57:43.218Z","direccion":"Ruta 5 Sur, El Conquistador, San Ignacio, San Francisco de Mostazal, Mostazal, Provincia de Cachapoal, Región del Libertador General Bernardo O'Higgins, 2890204, Chile","comentario":null}},{"id":244,"attributes":{"latitud":-33.63,"longitud":-70.71,"nombre":"PUNTO DE CARGA DOBLE EV-BOX MALL PLAZA SUR","propietario":"NUEVOS DESARROLLOS S.A.","comuna":"San Bernardo","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:57:46.758Z","updatedAt":"2024-09-14T22:57:46.758Z","publishedAt":"2024-09-14T22:57:46.751Z","direccion":"Estacionamiento Mall Plaza Sur, Las Terrazas, La Estancia de Nos, San Bernardo, Provincia de Maipo, Región Metropolitana de Santiago, 8080782, Chile","comentario":null}},{"id":245,"attributes":{"latitud":-33.61,"longitud":-70.58,"nombre":"Enel XWay ELECTROLINERA PETROBRAS CONCHA Y TORO","propietario":"Rentas e inversiones Baker SpA","comuna":"Puente Alto","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:57:50.682Z","updatedAt":"2024-09-14T22:57:50.682Z","publishedAt":"2024-09-14T22:57:50.677Z","direccion":"Liceo Industrial Municipalizado A N°116, 254, Tocornal, Población El Esfuerzo, Puente Alto, Provincia de Cordillera, Región Metropolitana de Santiago, 8165076, Chile","comentario":null}},{"id":246,"attributes":{"latitud":-33.57,"longitud":-70.56,"nombre":"SAVE MALL PLAZA TOBALABA","propietario":"PLAZA TOBALABA SA","comuna":"Puente Alto","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:57:54.367Z","updatedAt":"2024-09-14T22:57:54.367Z","publishedAt":"2024-09-14T22:57:54.366Z","direccion":"Abbadia, Las Nieves, Puente Alto, Provincia de Cordillera, Región Metropolitana de Santiago, 8220093, Chile","comentario":null}},{"id":247,"attributes":{"latitud":-33.55,"longitud":-70.8,"nombre":"Enel X Way - Petrobras Ciudad Satelite","propietario":"Rentas e inversiones Baker SpA","comuna":"Maipú","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:57:57.890Z","updatedAt":"2024-09-14T22:57:57.890Z","publishedAt":"2024-09-14T22:57:57.888Z","direccion":"René Olivares Becerra, Villa Hernán Díaz Arrieta, Maipú, Provincia de Santiago, Región Metropolitana de Santiago, 9280931, Chile","comentario":null}},{"id":248,"attributes":{"latitud":-33.55,"longitud":-70.79,"nombre":"Enel X- Autoplanet Maipu","propietario":"Comercializadora de repuestos","comuna":"Maipú","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:58:01.549Z","updatedAt":"2024-09-14T22:58:01.549Z","publishedAt":"2024-09-14T22:58:01.548Z","direccion":"Camino a Melipilla, Condominio Madreselva, Maipú, Provincia de Santiago, Región Metropolitana de Santiago, 9280931, Chile","comentario":null}},{"id":249,"attributes":{"latitud":-33.55,"longitud":-70.59,"nombre":"SAVE SHELL AV. VICUÑA MACKENNA","propietario":"Emp. Nac. de Enrg. Enex S.A.","comuna":"La Florida","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:58:05.150Z","updatedAt":"2024-09-14T22:58:05.150Z","publishedAt":"2024-09-14T22:58:05.143Z","direccion":"10165, El Amanecer, La Florida, Provincia de Santiago, Región Metropolitana de Santiago, 8250736, Chile","comentario":null}},{"id":250,"attributes":{"latitud":-33.54,"longitud":-70.57,"nombre":"Enel X Way - Rojas Magallanes","propietario":"Rentas e inversiones Baker SpA","comuna":"La Florida","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:58:08.660Z","updatedAt":"2024-09-14T22:58:08.660Z","publishedAt":"2024-09-14T22:58:08.657Z","direccion":"9506, Nuestra Señora de Genoveva, La Florida, Provincia de Santiago, Región Metropolitana de Santiago, 8240000, Chile","comentario":null}},{"id":251,"attributes":{"latitud":-33.53,"longitud":-70.6,"nombre":"Mc Donalds Vicuña Mackenna","propietario":"Arcos Dorados Restaurantes de","comuna":"La Florida","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:58:12.283Z","updatedAt":"2024-09-14T22:58:12.283Z","publishedAt":"2024-09-14T22:58:12.281Z","direccion":"8167, Grumete Caballero, Villa O'Higgins, La Florida, Provincia de Santiago, Región Metropolitana de Santiago, 8231472, Chile","comentario":null}},{"id":252,"attributes":{"latitud":-33.5,"longitud":-70.56,"nombre":"Enel X - Sodimac Quilín","propietario":"Enel X Chile SpA","comuna":"Penalolén","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:58:15.812Z","updatedAt":"2024-09-14T22:58:15.812Z","publishedAt":"2024-09-14T22:58:15.809Z","direccion":"Avenida Tobalaba, Villa Los Naranjos, Peñalolén, Provincia de Santiago, Región Metropolitana de Santiago, 7931136, Chile","comentario":null}},{"id":253,"attributes":{"latitud":-33.5,"longitud":-70.61,"nombre":"VOLTEX PUC","propietario":"COPEC VOLTEX SPA","comuna":"Macul","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:58:19.696Z","updatedAt":"2024-09-14T22:58:19.696Z","publishedAt":"2024-09-14T22:58:19.694Z","direccion":"Pontificia Universidad Católica de Chile (Campus San Joaquín), 4860, Avenida Vicuña Mackenna, Villa Santa Elena, Macul, Provincia de Santiago, Región Metropolitana de Santiago, 7821093, Chile","comentario":null}},{"id":254,"attributes":{"latitud":-33.5,"longitud":-70.76,"nombre":"Enel X Way - Petrobras Pajaritos","propietario":"Rentas e inversiones Baker SpA","comuna":"Maipú","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:58:23.359Z","updatedAt":"2024-09-14T22:58:23.359Z","publishedAt":"2024-09-14T22:58:23.352Z","direccion":"Colegio Alberto Pérez, 147, Centenario, Barrio Maipú Centro, Maipú, Provincia de Santiago, Región Metropolitana de Santiago, 9250678, Chile","comentario":null}},{"id":255,"attributes":{"latitud":-33.48,"longitud":-70.64,"nombre":"Enel X Way - EDS Petrobras Pintor Cicarelli","propietario":"Rentas e Inversiones Beker SPA","comuna":"San Joaquín","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:58:26.892Z","updatedAt":"2024-09-14T22:58:26.892Z","publishedAt":"2024-09-14T22:58:26.889Z","direccion":"Esquilo, Villa Pintor Cicarelli, San Joaquín, Provincia de Santiago, Región Metropolitana de Santiago, 8900084, Chile","comentario":null}},{"id":256,"attributes":{"latitud":-33.47,"longitud":-70.55,"nombre":"SAVE SHELL AV. TOBALABA","propietario":"Emp. Nac. de Enrg. Enex S.A.","comuna":"Penalolén","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:58:30.528Z","updatedAt":"2024-09-14T22:58:30.528Z","publishedAt":"2024-09-14T22:58:30.521Z","direccion":"7651, Avenida Las Parcelas, Villa Real Audiencia, Peñalolén, Provincia de Santiago, Región Metropolitana de Santiago, 7940068, Chile","comentario":null}},{"id":257,"attributes":{"latitud":-33.46,"longitud":-70.72,"nombre":"Enel X Way - Petrobras Pajaritos 1","propietario":"Rentas e inversiones Baker SpA","comuna":"Estación Central","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:58:34.203Z","updatedAt":"2024-09-14T22:58:34.203Z","publishedAt":"2024-09-14T22:58:34.201Z","direccion":"Calle 1, Estación Central, Provincia de Santiago, Región Metropolitana de Santiago, 9190847, Chile","comentario":null}},{"id":258,"attributes":{"latitud":-33.46,"longitud":-70.57,"nombre":"Enel X Way - Petrobras José Arrieta","propietario":"Sociedad Comercial y de Transp","comuna":"Penalolén","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:58:37.736Z","updatedAt":"2024-09-14T22:58:37.736Z","publishedAt":"2024-09-14T22:58:37.735Z","direccion":"Instituto Nacional de Rehabilitación Pedro Aguirre Cerda, 5969, Avenida José Arrieta, Barrio Blest Gana, La Reina, Provincia de Santiago, Región Metropolitana de Santiago, 7870154, Chile","comentario":null}},{"id":259,"attributes":{"latitud":-33.46,"longitud":-70.6,"nombre":"Enel X - Autoplanet Macul","propietario":"S. Comercializadora De Repuest","comuna":"Nunoa","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:58:41.554Z","updatedAt":"2024-09-14T22:58:41.554Z","publishedAt":"2024-09-14T22:58:41.552Z","direccion":"611, Exequiel Fernández, Barrio Doctor Luis Bisquert, Ñuñoa, Provincia de Santiago, Región Metropolitana de Santiago, 7750000, Chile","comentario":null}},{"id":260,"attributes":{"latitud":-33.45,"longitud":-70.68,"nombre":"ESTACIÓN DE CARGA PARA VEHÍCULOS PLAZA ALAMEDA","propietario":"Nuevos Desarrollos S.A","comuna":"Estación Central","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:58:45.200Z","updatedAt":"2024-09-14T22:58:45.200Z","publishedAt":"2024-09-14T22:58:45.199Z","direccion":"Pdte. Allende, 3363, Avenida Víctor Jara, Barrio Pila del Ganso, Estación Central, Provincia de Santiago, Región Metropolitana de Santiago, 8370261, Chile","comentario":null}},{"id":261,"attributes":{"latitud":-33.44,"longitud":-70.64,"nombre":"Electrolinera ENEX Portugal 175 Santiago File 647","propietario":"Empresa Nacional de Energia En","comuna":"Santiago","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:58:49.010Z","updatedAt":"2024-09-14T22:58:49.010Z","publishedAt":"2024-09-14T22:58:49.002Z","direccion":"Avenida Libertador Bernardo O'Higgins, Barrio Lastarria, Santiago, Provincia de Santiago, Región Metropolitana de Santiago, 6500808, Chile","comentario":null}},{"id":262,"attributes":{"latitud":-33.44,"longitud":-70.72,"nombre":"Enel X Way - Petrobras Lo Prado","propietario":"Rentas e inversiones Baker SpA","comuna":"Lo Prado","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:58:52.911Z","updatedAt":"2024-09-14T22:58:52.911Z","publishedAt":"2024-09-14T22:58:52.909Z","direccion":"COSAM Lo Prado, 1052, San Germán, Villa Erradicación San Luis, Lo Prado, Provincia de Santiago, Región Metropolitana de Santiago, 8500445, Chile","comentario":null}},{"id":263,"attributes":{"latitud":-33.44,"longitud":-70.53,"nombre":"IRVE Petrobras Príncipe de Gales","propietario":"INVERSIONES LA REINA UNO LIMIT","comuna":"La Reina","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:58:56.476Z","updatedAt":"2024-09-14T22:58:56.476Z","publishedAt":"2024-09-14T22:58:56.474Z","direccion":"Pasaje Carlos Silva Vildósola, La Reina, Provincia de Santiago, Región Metropolitana de Santiago, 7860379, Chile","comentario":null}},{"id":264,"attributes":{"latitud":-33.43,"longitud":-70.79,"nombre":"Enel X Way - Petrobras Enea","propietario":"Rentas e inversiones Baker SpA","comuna":"Pudahuel","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:59:00.050Z","updatedAt":"2024-09-14T22:59:00.050Z","publishedAt":"2024-09-14T22:59:00.048Z","direccion":"Avenida Los Maitenes Norte, Pudahuel, Provincia de Santiago, Región Metropolitana de Santiago, 9020000, Chile","comentario":null}},{"id":265,"attributes":{"latitud":-33.43,"longitud":-70.62,"nombre":"edificio Deja Vu","propietario":"inmobiliaria miguel claro s.a","comuna":"Providencia","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:59:03.458Z","updatedAt":"2024-09-14T22:59:03.458Z","publishedAt":"2024-09-14T22:59:03.455Z","direccion":"113, Avenida Manuel Montt, Barrio Tajamar, Providencia, Provincia de Santiago, Región Metropolitana de Santiago, 7500000, Chile","comentario":null}},{"id":266,"attributes":{"latitud":-33.43,"longitud":-70.65,"nombre":"Mc Donalds Independencia","propietario":"Arcos Dorados Restaurantes de","comuna":"Independencia","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:59:06.963Z","updatedAt":"2024-09-14T22:59:06.963Z","publishedAt":"2024-09-14T22:59:06.962Z","direccion":"La Vega Central, Nueva Rengifo, Recoleta, Provincia de Santiago, Región Metropolitana de Santiago, 8320012, Chile","comentario":null}},{"id":267,"attributes":{"latitud":-33.42,"longitud":-70.61,"nombre":"Proy. Instalación Cargadores Eléct. Hotel Eurotel","propietario":"ENEL X","comuna":"Providencia","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:59:10.811Z","updatedAt":"2024-09-14T22:59:10.811Z","publishedAt":"2024-09-14T22:59:10.810Z","direccion":"154, Santa Magdalena, Sanhattan, Providencia, Provincia de Santiago, Región Metropolitana de Santiago, 7500000, Chile","comentario":null}},{"id":268,"attributes":{"latitud":-33.42,"longitud":-70.56,"nombre":"Enel X - Petrobras Isabel la Católica","propietario":"Rentas e inversiones Baker SpA","comuna":"Las Condes","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:59:14.286Z","updatedAt":"2024-09-14T22:59:14.286Z","publishedAt":"2024-09-14T22:59:14.284Z","direccion":"6621, Pasaje Martín Alonso Pinzón, Los Descubridores, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7570534, Chile","comentario":null}},{"id":269,"attributes":{"latitud":-33.42,"longitud":-70.61,"nombre":"Proyecto CE Hotel Torremayor 322","propietario":"ENEL X","comuna":"Providencia","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:59:17.813Z","updatedAt":"2024-09-14T22:59:17.813Z","publishedAt":"2024-09-14T22:59:17.812Z","direccion":"154, Santa Magdalena, Sanhattan, Providencia, Provincia de Santiago, Región Metropolitana de Santiago, 7500000, Chile","comentario":null}},{"id":270,"attributes":{"latitud":-33.42,"longitud":-70.58,"nombre":"Electrolinera Colon","propietario":"ENEX S.A.","comuna":"Las Condes","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:59:21.375Z","updatedAt":"2024-09-14T22:59:21.375Z","publishedAt":"2024-09-14T22:59:21.372Z","direccion":"4499, Cuenca, Barrio San Pascual, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7580386, Chile","comentario":null}},{"id":271,"attributes":{"latitud":-33.42,"longitud":-70.61,"nombre":"Proyecto Cargadores VE Hotel Torre Mayor 25","propietario":"ENEL X","comuna":"Providencia","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:59:24.935Z","updatedAt":"2024-09-14T22:59:24.935Z","publishedAt":"2024-09-14T22:59:24.928Z","direccion":"154, Santa Magdalena, Sanhattan, Providencia, Provincia de Santiago, Región Metropolitana de Santiago, 7500000, Chile","comentario":null}},{"id":272,"attributes":{"latitud":-33.42,"longitud":-70.62,"nombre":"Proyecto Inst. Cargadores Elect. Hotel Sheraton","propietario":"ENEL X","comuna":"Providencia","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:59:28.738Z","updatedAt":"2024-09-14T22:59:28.738Z","publishedAt":"2024-09-14T22:59:28.735Z","direccion":"Los Colonos, Pedro de Valdivia Norte, Providencia, Provincia de Santiago, Región Metropolitana de Santiago, 7500000, Chile","comentario":null}},{"id":273,"attributes":{"latitud":-33.42,"longitud":-70.58,"nombre":"IRVE EDIFICIO SWITCH","propietario":"RENTAS NUEVA EL GOLF SPA","comuna":"Las Condes","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:59:32.599Z","updatedAt":"2024-09-14T22:59:32.599Z","publishedAt":"2024-09-14T22:59:32.597Z","direccion":"4499, Cuenca, Barrio San Pascual, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7580386, Chile","comentario":null}},{"id":274,"attributes":{"latitud":-33.42,"longitud":-70.6,"nombre":"Enel X - Hotel NH Plaza Santiago","propietario":"Enel X Chile SpA","comuna":"Las Condes","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:59:36.042Z","updatedAt":"2024-09-14T22:59:36.042Z","publishedAt":"2024-09-14T22:59:36.040Z","direccion":"239, Avenida Tobalaba, Sanhattan, Providencia, Provincia de Santiago, Región Metropolitana de Santiago, 7500000, Chile","comentario":null}},{"id":275,"attributes":{"latitud":-33.42,"longitud":-70.6,"nombre":"Proyecto Cargadores VE Hotel Ritz Carlton","propietario":"ENEL X","comuna":"Las Condes","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:59:39.738Z","updatedAt":"2024-09-14T22:59:39.738Z","publishedAt":"2024-09-14T22:59:39.737Z","direccion":"239, Avenida Tobalaba, Sanhattan, Providencia, Provincia de Santiago, Región Metropolitana de Santiago, 7500000, Chile","comentario":null}},{"id":276,"attributes":{"latitud":-33.41,"longitud":-70.72,"nombre":"Enel X Way - Petrobras Carrascal","propietario":"Kutz Y Rodriguez Ltda.","comuna":"Cerro Navia","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:59:43.772Z","updatedAt":"2024-09-14T22:59:43.772Z","publishedAt":"2024-09-14T22:59:43.771Z","direccion":"Autopista Costanera Norte, Población José Manuel Infante, Renca, Provincia de Santiago, Región Metropolitana de Santiago, 9100277, Chile","comentario":null}},{"id":277,"attributes":{"latitud":-33.41,"longitud":-70.64,"nombre":"Enel X Way - Petrobras Recoleta","propietario":"Rentas e inversiones Baker SpA","comuna":"Recoleta","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T22:59:47.694Z","updatedAt":"2024-09-14T22:59:47.694Z","publishedAt":"2024-09-14T22:59:47.690Z","direccion":"Los Pamperos, Barrio San Martín, Recoleta, Provincia de Santiago, Región Metropolitana de Santiago, 7690000, Chile","comentario":null}},{"id":278,"attributes":{"latitud":-33.41,"longitud":-70.58,"nombre":"IRVE EDIF. LOS MILITARES - CBRE","propietario":"COPEC VOLTEX SPA","comuna":"Las Condes","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:59:51.454Z","updatedAt":"2024-09-14T22:59:51.454Z","publishedAt":"2024-09-14T22:59:51.448Z","direccion":"Escuela Militar del General Bernardo O'Higgins, La Gioconda, El Golf, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7550076, Chile","comentario":null}},{"id":279,"attributes":{"latitud":-33.41,"longitud":-70.57,"nombre":"Proyecto Cargadores VE Hotel Regal Pacific","propietario":"ENEL X","comuna":"Las Condes","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:59:54.895Z","updatedAt":"2024-09-14T22:59:54.895Z","publishedAt":"2024-09-14T22:59:54.892Z","direccion":"Plaza Apoquindo, Mar de los Sargazos, Barrio El Faro, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7560943, Chile","comentario":null}},{"id":280,"attributes":{"latitud":-33.41,"longitud":-70.57,"nombre":"Proyecto CE Hotel Icon","propietario":"ENEL X","comuna":"Las Condes","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T22:59:58.513Z","updatedAt":"2024-09-14T22:59:58.513Z","publishedAt":"2024-09-14T22:59:58.512Z","direccion":"Plaza Apoquindo, Mar de los Sargazos, Barrio El Faro, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7560943, Chile","comentario":null}},{"id":281,"attributes":{"latitud":-33.41,"longitud":-70.58,"nombre":"Enel X Way - Accord Novotel, Las Condes.","propietario":"Enel Mobility Chile SPA","comuna":"Las Condes","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:00:02.026Z","updatedAt":"2024-09-14T23:00:02.026Z","publishedAt":"2024-09-14T23:00:02.025Z","direccion":"Escuela Militar del General Bernardo O'Higgins, La Gioconda, El Golf, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7550076, Chile","comentario":null}},{"id":282,"attributes":{"latitud":-33.41,"longitud":-70.7,"nombre":"Enel X Way - Petrobras Domingo Santa Maria","propietario":"Rentas e inversiones Baker SpA","comuna":"Renca","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:00:05.681Z","updatedAt":"2024-09-14T23:00:05.681Z","publishedAt":"2024-09-14T23:00:05.678Z","direccion":"Autopista Costanera Norte, Población Pedro Aguirre Cerda, Renca, Provincia de Santiago, Región Metropolitana de Santiago, 8520512, Chile","comentario":null}},{"id":283,"attributes":{"latitud":-33.4,"longitud":-70.57,"nombre":"Enel x - Plus Parken","propietario":"Enel X Chile SpA","comuna":"Las Condes","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:00:09.222Z","updatedAt":"2024-09-14T23:00:09.222Z","publishedAt":"2024-09-14T23:00:09.221Z","direccion":"785, Avenida Manquehue, Nueva Las Condes, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7561156, Chile","comentario":null}},{"id":284,"attributes":{"latitud":-33.4,"longitud":-70.68,"nombre":"Enel X Way - Petrobras 14 de La Fama","propietario":"Rentas e inversiones Baker SpA","comuna":"Independencia","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:00:12.880Z","updatedAt":"2024-09-14T23:00:12.880Z","publishedAt":"2024-09-14T23:00:12.879Z","direccion":"2771, Monterrey, Villa Doña Javiera, Conchalí, Provincia de Santiago, Región Metropolitana de Santiago, 8380741, Chile","comentario":null}},{"id":285,"attributes":{"latitud":-33.4,"longitud":-70.6,"nombre":"Municipalidad de Vitacura","propietario":"Enel X Chile SpA","comuna":"Vitacura","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:00:16.443Z","updatedAt":"2024-09-14T23:00:16.443Z","publishedAt":"2024-09-14T23:00:16.441Z","direccion":"Atacama Large Millimeter/submillimeter Array, Alonso de Córdova, Lo Castillo, Vitacura, Provincia de Santiago, Región Metropolitana de Santiago, 7630391, Chile","comentario":null}},{"id":286,"attributes":{"latitud":-33.39,"longitud":-70.62,"nombre":"Enel X Way - Cargadores Mas Center Cd. Empresarial","propietario":"inversiones Paluma Una LTDA","comuna":"Huechuraba","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:00:20.105Z","updatedAt":"2024-09-14T23:00:20.105Z","publishedAt":"2024-09-14T23:00:20.104Z","direccion":"Farmacias Ahumada, Avenida del Parque, Ciudad Empresarial, Huechuraba, Provincia de Santiago, Región Metropolitana de Santiago, 8581150, Chile","comentario":null}},{"id":287,"attributes":{"latitud":-33.39,"longitud":-70.54,"nombre":"Enel X - Petrobras Abadía","propietario":"Inversiones Los Coihues II ltd","comuna":"Las Condes","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:00:23.783Z","updatedAt":"2024-09-14T23:00:23.783Z","publishedAt":"2024-09-14T23:00:23.782Z","direccion":"Punta Damas, Estoril, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7630000, Chile","comentario":null}},{"id":288,"attributes":{"latitud":-33.38,"longitud":-70.53,"nombre":"Autoplanet Las Condes","propietario":"Sociedad comercializadora de r","comuna":"Las Condes","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:00:27.302Z","updatedAt":"2024-09-14T23:00:27.302Z","publishedAt":"2024-09-14T23:00:27.300Z","direccion":"Sodimac, 11049, Avenida Las Condes, Estoril, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7630000, Chile","comentario":null}},{"id":289,"attributes":{"latitud":-33.38,"longitud":-70.53,"nombre":"Enel X - Sodimac Las Condes","propietario":"SODIMAC S.A.","comuna":"Las Condes","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:00:30.809Z","updatedAt":"2024-09-14T23:00:30.809Z","publishedAt":"2024-09-14T23:00:30.808Z","direccion":"Sodimac, 11049, Avenida Las Condes, Estoril, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7630000, Chile","comentario":null}},{"id":290,"attributes":{"latitud":-33.38,"longitud":-70.57,"nombre":"Enel X  - Petrobras Luis Pasteur","propietario":"Rentas e inversiones Baker SpA","comuna":"Vitacura","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:00:34.256Z","updatedAt":"2024-09-14T23:00:34.256Z","publishedAt":"2024-09-14T23:00:34.248Z","direccion":"Colegio El Carmen Teresiano I, 6700, Avenida Luis Pasteur, Santa María de Manquehue, Vitacura, Provincia de Santiago, Región Metropolitana de Santiago, 7640165, Chile","comentario":null}},{"id":291,"attributes":{"latitud":-33.38,"longitud":-70.57,"nombre":"Cargadores Electricos Mas Center Santa Maria","propietario":"INVERSIONES PALUMA UNO LTDA.","comuna":"Vitacura","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:00:37.689Z","updatedAt":"2024-09-14T23:00:37.689Z","publishedAt":"2024-09-14T23:00:37.687Z","direccion":"Colegio El Carmen Teresiano I, 6700, Avenida Luis Pasteur, Santa María de Manquehue, Vitacura, Provincia de Santiago, Región Metropolitana de Santiago, 7640165, Chile","comentario":null}},{"id":292,"attributes":{"latitud":-33.37,"longitud":-70.68,"nombre":"Enel X Way - Petrobras Conchali","propietario":"Rentas e inversiones Baker SpA","comuna":"Conchalí","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:00:41.238Z","updatedAt":"2024-09-14T23:00:41.238Z","publishedAt":"2024-09-14T23:00:41.236Z","direccion":"5901, Ernesto Ried, Población Juanita Aguirre, Conchalí, Provincia de Santiago, Región Metropolitana de Santiago, 8590483, Chile","comentario":null}},{"id":293,"attributes":{"latitud":-33.37,"longitud":-70.73,"nombre":"Enel X Way - Petrobras Quilicura","propietario":"Rentas e inversiones Baker SpA","comuna":"Quilicura","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:00:44.890Z","updatedAt":"2024-09-14T23:00:44.890Z","publishedAt":"2024-09-14T23:00:44.889Z","direccion":"572, Guardiamarina Riquelme, Quilicura, Provincia de Santiago, Región Metropolitana de Santiago, 8700000, Chile","comentario":null}},{"id":294,"attributes":{"latitud":-33.36,"longitud":-70.52,"nombre":"Proyecto Cargadores VE Hotel Pettra","propietario":"ENEL X","comuna":"Lo Barnechea","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:00:48.299Z","updatedAt":"2024-09-14T23:00:48.299Z","publishedAt":"2024-09-14T23:00:48.296Z","direccion":"944, El Peral, Lo Barnechea, Provincia de Santiago, Región Metropolitana de Santiago, 7690286, Chile","comentario":null}},{"id":295,"attributes":{"latitud":-33.29,"longitud":-70.68,"nombre":"IRVE Petrobras Chicureo","propietario":"INVERSIONES VILLA LAS HORTENCI","comuna":"Colina","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:00:51.825Z","updatedAt":"2024-09-14T23:00:51.825Z","publishedAt":"2024-09-14T23:00:51.821Z","direccion":"El Alba Dos, Chicureo, Los Ingleses, Colina, Provincia de Chacabuco, Región Metropolitana de Santiago, 9340000, Chile","comentario":null}},{"id":296,"attributes":{"latitud":-33.13,"longitud":-71.56,"nombre":"Edificio Chilquinta Curauma","propietario":"CHILQUINTA ENERGIA S.A","comuna":"Valparaíso","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:00:55.314Z","updatedAt":"2024-09-14T23:00:55.314Z","publishedAt":"2024-09-14T23:00:55.311Z","direccion":"Cerro El Altar, Parque Industrial Curauma, Curauma, Placilla de Peñuelas, Valparaíso, Provincia de Valparaíso, Región de Valparaíso, Chile","comentario":null}},{"id":297,"attributes":{"latitud":-33.06,"longitud":-71.43,"nombre":"Enel X Way - Petrobras Marga Marga","propietario":"ELSA DEL CARMEN LEIVA REYES","comuna":"Quilpue","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:00:58.730Z","updatedAt":"2024-09-14T23:00:58.730Z","publishedAt":"2024-09-14T23:00:58.729Z","direccion":"Elena, Villa Los Canelos, Quilpué, Provincia de Marga Marga, Región de Valparaíso, 2430000, Chile","comentario":null}},{"id":298,"attributes":{"latitud":-33.04,"longitud":-71.6,"nombre":"Edificio Chilquinta Barón","propietario":"CHILQUINTA   ENERGIA S.A.","comuna":"Valparaíso","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:01:02.120Z","updatedAt":"2024-09-14T23:01:02.120Z","publishedAt":"2024-09-14T23:01:02.117Z","direccion":"Castro, Cerro Barón, Almendral, Valparaíso, Provincia de Valparaíso, Región de Valparaíso, 2390382, Chile","comentario":null}},{"id":299,"attributes":{"latitud":-33.04,"longitud":-71.63,"nombre":"INSTALACIÓN SCVE ESTACIONAMIENTOS PLAZA SOTOMAYOR","propietario":"Est. Sub. Valparaíso SA","comuna":"Valparaíso","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:01:05.580Z","updatedAt":"2024-09-14T23:01:05.580Z","publishedAt":"2024-09-14T23:01:05.573Z","direccion":"El Peral, 182, Subida El Peral, Barrio Puerto, Playa Ancha, Valparaíso, Provincia de Valparaíso, Región de Valparaíso, 2370541, Chile","comentario":null}},{"id":300,"attributes":{"latitud":-33.01,"longitud":-71.55,"nombre":"Enel X - Rosselot Viña del Mar","propietario":"Enel X Chile SpA","comuna":"Vina del Mar","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:01:09.059Z","updatedAt":"2024-09-14T23:01:09.059Z","publishedAt":"2024-09-14T23:01:09.059Z","direccion":"13 Norte, Viña del Mar, Provincia de Valparaíso, Región de Valparaíso, 2520707, Chile","comentario":null}},{"id":301,"attributes":{"latitud":-32.84,"longitud":-70.61,"nombre":"Enel X - Autoplanet Los Andes","propietario":"Soc comercializadora de repues","comuna":"Los Andes","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:01:12.579Z","updatedAt":"2024-09-14T23:01:12.579Z","publishedAt":"2024-09-14T23:01:12.570Z","direccion":"Profesora Eliana Espinoza, Villa Sor Teresa, Los Andes, Provincia de Los Andes, Región de Valparaíso, 2100000, Chile","comentario":null}},{"id":302,"attributes":{"latitud":-31.9,"longitud":-71.49,"nombre":"Enel X Way - Petrobras Los Vilos","propietario":"SERVICIOS HERRMANN LIMITADA","comuna":"Los Vilos","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:01:17.697Z","updatedAt":"2024-09-14T23:01:17.697Z","publishedAt":"2024-09-14T23:01:17.692Z","direccion":"Ex Terminal de Buses, Camino a Los Vilos, Los Vilos, Provincia de Choapa, Región de Coquimbo, Chile","comentario":null}},{"id":303,"attributes":{"latitud":-29.91,"longitud":-71.26,"nombre":"SAVE Mall Plaza La Serena","propietario":"Mall Plaza La Serena S.A.","comuna":"La Serena","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:01:21.350Z","updatedAt":"2024-09-14T23:01:21.350Z","publishedAt":"2024-09-14T23:01:21.347Z","direccion":"Vía de Evacuación Peatonal Amunátegui, Barrio Andrés Bello, La Serena, Provincia de Elqui, Región de Coquimbo, 1710368, Chile","comentario":null}},{"id":304,"attributes":{"latitud":-29.91,"longitud":-71.26,"nombre":"Enel X Way - Petrobras La Serena","propietario":"Rentas e inversiones Baker SpA","comuna":"La Serena","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:01:24.879Z","updatedAt":"2024-09-14T23:01:24.879Z","publishedAt":"2024-09-14T23:01:24.875Z","direccion":"Vía de Evacuación Peatonal Amunátegui, Barrio Andrés Bello, La Serena, Provincia de Elqui, Región de Coquimbo, 1710368, Chile","comentario":null}},{"id":305,"attributes":{"latitud":-28.57,"longitud":-70.79,"nombre":"Enel X Way - Petrobras Vallenar","propietario":"Industria Recuperadora de Neum","comuna":"Vallenar","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:01:28.419Z","updatedAt":"2024-09-14T23:01:28.419Z","publishedAt":"2024-09-14T23:01:28.418Z","direccion":"Callejón Maestranza, Llanos de Soto, Vallenar, Provincia de Huasco, Región de Atacama, 1610000, Chile","comentario":null}},{"id":306,"attributes":{"latitud":-23.68,"longitud":-70.41,"nombre":"Enel X Way - Hotel NH Antofagasta","propietario":"Enel Mobility Chile SPA","comuna":"Antofagasta","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:01:31.944Z","updatedAt":"2024-09-14T23:01:31.944Z","publishedAt":"2024-09-14T23:01:31.940Z","direccion":"Universidad de Católica del Norte, 0610, Avenida Angamos, Antofagasta, Provincia de Antofagasta, Región de Antofagasta, 1270460, Chile","comentario":null}},{"id":307,"attributes":{"latitud":-23.65,"longitud":-70.4,"nombre":"PUNTO DE RECARGA DOBLE EV-BOX_1 MPAN","propietario":"PLAZA ANTOFAGASTA","comuna":"Antofagasta","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:01:35.452Z","updatedAt":"2024-09-14T23:01:35.452Z","publishedAt":"2024-09-14T23:01:35.449Z","direccion":"Liceo Marta Narea Diaz, 451, Orella, Antofagasta, Provincia de Antofagasta, Región de Antofagasta, 1271572, Chile","comentario":null}},{"id":308,"attributes":{"latitud":-23.57,"longitud":-70.39,"nombre":"Enel X - Sodimac Antofagasta","propietario":"Plaza La Serena S.A.","comuna":"Antofagasta","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:01:38.999Z","updatedAt":"2024-09-14T23:01:38.999Z","publishedAt":"2024-09-14T23:01:38.994Z","direccion":"Centro de Internación Provisoria - Centro de Reinserción Semi Cerrado Antofagasta, 10250, Mario Silva Iriarte, Parque Juan López III, Antofagasta, Provincia de Antofagasta, Región de Antofagasta, 1262335, Chile","comentario":null}},{"id":309,"attributes":{"latitud":-22.45,"longitud":-68.92,"nombre":"SAVE MALL PLAZA CALAMA","propietario":"INMOBILIARIA MALL PLAZA CALAMA","comuna":"Calama","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:01:42.514Z","updatedAt":"2024-09-14T23:01:42.514Z","publishedAt":"2024-09-14T23:01:42.507Z","direccion":"3 Poniente, Calama, Provincia de El Loa, Región de Antofagasta, 1395584, Chile","comentario":null}},{"id":310,"attributes":{"latitud":-20.23,"longitud":-70.14,"nombre":"Enel X Way  - Sodimac Iquique","propietario":"SODIMAC S.A.","comuna":"Iquique","T1":0,"T2":0,"T2SC":2,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:01:46.152Z","updatedAt":"2024-09-14T23:01:46.152Z","publishedAt":"2024-09-14T23:01:46.150Z","direccion":"Cabo Gerardo Rebolledo, Iquique, Provincia de Iquique, Región de Tarapacá, 1100000, Chile","comentario":null}},{"id":311,"attributes":{"latitud":-53.13,"longitud":-70.87,"nombre":"SAVE VOLTEX  20622 PUNTA ARENAS","propietario":"COPEC S.A.","comuna":"Punta Arenas","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:01:49.680Z","updatedAt":"2024-09-14T23:01:49.680Z","publishedAt":"2024-09-14T23:01:49.675Z","direccion":"Avenida Bahía Catalina, Población Bahía Catalina (Fach), Punta Arenas, Provincia de Magallanes, Región de Magallanes y de la Antártica Chilena, 6210738, Chile","comentario":null}},{"id":312,"attributes":{"latitud":-48.46,"longitud":-72.56,"nombre":"Enel X Way - Villa O`Higgins","propietario":"Enel Mobility Chile SPA","comuna":"Ohigginis","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:01:53.250Z","updatedAt":"2024-09-14T23:01:53.250Z","publishedAt":"2024-09-14T23:01:53.243Z","direccion":"Hernán Merino, Villa O'Higgins, O’Higgins, Provincia de Capitán Prat, Región Aysén del General Carlos Ibáñez del Campo, 6110000, Chile","comentario":null}},{"id":313,"attributes":{"latitud":-47.25,"longitud":-72.6,"nombre":"Enel X Way - Cochrane","propietario":"Enel Mobility Chile SPA","comuna":"Cochrane","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:01:57.153Z","updatedAt":"2024-09-14T23:01:57.153Z","publishedAt":"2024-09-14T23:01:57.152Z","direccion":"Cochrane, Provincia de Capitán Prat, Región Aysén del General Carlos Ibáñez del Campo, 3030000, Chile","comentario":null}},{"id":314,"attributes":{"latitud":-47.25,"longitud":-72.57,"nombre":"Enel X Way - Terminal de buses Cochrane","propietario":"Enel Mobility Chile SPA","comuna":"Cochrane","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:02:01.313Z","updatedAt":"2024-09-14T23:02:01.313Z","publishedAt":"2024-09-14T23:02:01.310Z","direccion":"Minimarket Yoyita, Tehuelches, Cochrane, Provincia de Capitán Prat, Región Aysén del General Carlos Ibáñez del Campo, 3030000, Chile","comentario":null}},{"id":315,"attributes":{"latitud":-47.05,"longitud":-72.81,"nombre":"Enel X Way - Puerto Bertrand","propietario":"Enel Mobility Chile SPA","comuna":"Chile Chico","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:02:05.244Z","updatedAt":"2024-09-14T23:02:05.244Z","publishedAt":"2024-09-14T23:02:05.242Z","direccion":"Carretera Austral, El Manzano, Chile Chico, Provincia de General Carrera, Región Aysén del General Carlos Ibáñez del Campo, Chile","comentario":null}},{"id":316,"attributes":{"latitud":-46.84,"longitud":-72.69,"nombre":"Enel X Way - Puerto Guadal","propietario":"Enel Mobility Chile SPA","comuna":"Chile Chico","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:02:08.757Z","updatedAt":"2024-09-14T23:02:08.757Z","publishedAt":"2024-09-14T23:02:08.752Z","direccion":"Terra Luna Lodge, Camino a Mallín Grande, Puerto Guadal, Chile Chico, Provincia de General Carrera, Región Aysén del General Carlos Ibáñez del Campo, Chile","comentario":null}},{"id":317,"attributes":{"latitud":-46.62,"longitud":-72.67,"nombre":"Enel X Way - Puerto Rio Tranquilo","propietario":"Enel Mobility Chile SPA","comuna":"Río Ibánez","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:02:12.248Z","updatedAt":"2024-09-14T23:02:12.248Z","publishedAt":"2024-09-14T23:02:12.244Z","direccion":"Carretera Austral, Puerto Río Tranquilo, Río Ibáñez, Provincia de General Carrera, Región Aysén del General Carlos Ibáñez del Campo, 6060000, Chile","comentario":null}},{"id":318,"attributes":{"latitud":-46.54,"longitud":-71.71,"nombre":"Enel X Way - Cabañas El Engaño, Chile Chico","propietario":"Enel Mobility Chile SPA","comuna":"Chile Chico","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:02:15.717Z","updatedAt":"2024-09-14T23:02:15.717Z","publishedAt":"2024-09-14T23:02:15.710Z","direccion":"Chile Chico, Provincia de General Carrera, Región Aysén del General Carlos Ibáñez del Campo, 6050000, Chile","comentario":null}},{"id":319,"attributes":{"latitud":-46.12,"longitud":-72.16,"nombre":"Enel X Way - Villa Cerro Castillo","propietario":"Enel Mobility Chile SPA","comuna":"Río Ibánez","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:02:19.297Z","updatedAt":"2024-09-14T23:02:19.297Z","publishedAt":"2024-09-14T23:02:19.294Z","direccion":"La Estancia, Avenida Bernardo O'Higgins, Villa Cerro Castillo, Río Ibáñez, Provincia de General Carrera, Región Aysén del General Carlos Ibáñez del Campo, Chile","comentario":null}},{"id":320,"attributes":{"latitud":-45.58,"longitud":-72.07,"nombre":"SAVE VOLTEX 20830 COYHAIQUE","propietario":"COPEC S.A.","comuna":"Coyhaique","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:02:22.978Z","updatedAt":"2024-09-14T23:02:22.978Z","publishedAt":"2024-09-14T23:02:22.978Z","direccion":"929, Puesto Viejo, Población Bernardo O'Higgins, Coyhaique, Provincia de Coyhaique, Región Aysén del General Carlos Ibáñez del Campo, 5952014, Chile","comentario":null}},{"id":321,"attributes":{"latitud":-45.57,"longitud":-72.07,"nombre":"Edelaysen Coyhaique","propietario":"Edelaysen","comuna":"Coihaique","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:02:26.477Z","updatedAt":"2024-09-14T23:02:26.477Z","publishedAt":"2024-09-14T23:02:26.473Z","direccion":"398, General Parra, Coyhaique, Provincia de Coyhaique, Región Aysén del General Carlos Ibáñez del Campo, 5952006, Chile","comentario":null}},{"id":322,"attributes":{"latitud":-45.57,"longitud":-72.07,"nombre":"Enel X Way - Entre Cumbres","propietario":"Enel Mobility Chile SPA","comuna":"Coyhaique","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:02:30.025Z","updatedAt":"2024-09-14T23:02:30.025Z","publishedAt":"2024-09-14T23:02:30.020Z","direccion":"398, General Parra, Coyhaique, Provincia de Coyhaique, Región Aysén del General Carlos Ibáñez del Campo, 5952006, Chile","comentario":null}},{"id":323,"attributes":{"latitud":-45.47,"longitud":-72.82,"nombre":"Enel X Way - Hotel Loberias del Sur","propietario":"Enel Mobility Chile SPA","comuna":"Aysén","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:02:33.685Z","updatedAt":"2024-09-14T23:02:33.685Z","publishedAt":"2024-09-14T23:02:33.682Z","direccion":"Avenida José Miguel Carrera, Puerto Chacabuco, Aysén, Provincia de Aysén, Región Aysén del General Carlos Ibáñez del Campo, Chile","comentario":null}},{"id":324,"attributes":{"latitud":-45.41,"longitud":-72.7,"nombre":"Proyecto Aysen cargadores SAESA","propietario":"Sociedad Austral de Electricid","comuna":"Aysén","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:02:37.102Z","updatedAt":"2024-09-14T23:02:37.102Z","publishedAt":"2024-09-14T23:02:37.100Z","direccion":"362, Lord Cochrane, La Balsa, Puerto Aysén, Aysén, Provincia de Aysén, Región Aysén del General Carlos Ibáñez del Campo, 6000186, Chile","comentario":null}},{"id":325,"attributes":{"latitud":-45.18,"longitud":-72.16,"nombre":"Enel X Way - Villa Mañihuales","propietario":"Enel Mobility Chile SPA","comuna":"Aysén","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:02:40.534Z","updatedAt":"2024-09-14T23:02:40.534Z","publishedAt":"2024-09-14T23:02:40.532Z","direccion":"Eusebio Ibar (Carretera Austral), Villa Mañihuales, Aysén, Provincia de Aysén, Región Aysén del General Carlos Ibáñez del Campo, Chile","comentario":null}},{"id":326,"attributes":{"latitud":-44.73,"longitud":-72.68,"nombre":"Enel X Way - Puerto Cisnes","propietario":"Enel Mobility Chile SPA","comuna":"Cisnes","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:02:44.133Z","updatedAt":"2024-09-14T23:02:44.133Z","publishedAt":"2024-09-14T23:02:44.131Z","direccion":"Camping Claus, Los Ciruelillos, Puerto Cisnes, Cisnes, Provincia de Aysén, Región Aysén del General Carlos Ibáñez del Campo, 6010000, Chile","comentario":null}},{"id":327,"attributes":{"latitud":-44.33,"longitud":-72.56,"nombre":"Enel X Way - Puyuhuapi","propietario":"Enel Mobility Chile SPA","comuna":"Cisnes","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:02:47.598Z","updatedAt":"2024-09-14T23:02:47.598Z","publishedAt":"2024-09-14T23:02:47.597Z","direccion":"Carretera Austral, Puyuhuapi, Cisnes, Provincia de Aysén, Región Aysén del General Carlos Ibáñez del Campo, Chile","comentario":null}},{"id":328,"attributes":{"latitud":-43.97,"longitud":-72.4,"nombre":"Enel X Way - Hotel Alto Melimoyu","propietario":"Enel Mobility Chile SPA","comuna":"Cisnes","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:02:51.002Z","updatedAt":"2024-09-14T23:02:51.002Z","publishedAt":"2024-09-14T23:02:50.999Z","direccion":"Carretera Austral, La Junta, Cisnes, Provincia de Aysén, Región Aysén del General Carlos Ibáñez del Campo, Chile","comentario":null}},{"id":329,"attributes":{"latitud":-43.22,"longitud":-72.43,"nombre":"Enel X Way - Hotel Yelcho en la Patagonia","propietario":"Enel Mobility Chile SPA","comuna":"Chaitén","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:02:54.412Z","updatedAt":"2024-09-14T23:02:54.412Z","publishedAt":"2024-09-14T23:02:54.407Z","direccion":"Yelcho en la Patagonia, Carretera Austral, Chaitén, Provincia de Palena, Región de Los Lagos, Chile","comentario":null}},{"id":330,"attributes":{"latitud":-42.48,"longitud":-73.77,"nombre":"CASTRO BNUP SAESA","propietario":"Sociedad Austral de Electricid","comuna":"Castro","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:02:57.858Z","updatedAt":"2024-09-14T23:02:57.858Z","publishedAt":"2024-09-14T23:02:57.857Z","direccion":"Liceo Politécnico de Castro, 540, Freire, Manuel Rodríguez, Castro, Provincia de Chiloé, Región de Los Lagos, 5700552, Chile","comentario":null}},{"id":331,"attributes":{"latitud":-41.97,"longitud":-72.47,"nombre":"Enel X Way - Hotel Oelckers","propietario":"Enel Mobility Chile SPA","comuna":"Hualaihué","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:03:01.389Z","updatedAt":"2024-09-14T23:03:01.389Z","publishedAt":"2024-09-14T23:03:01.387Z","direccion":"Ignacio Carrera Pinto, El Esfuerzo, Hornopirén, Hualaihué, Provincia de Palena, Región de Los Lagos, 5860000, Chile","comentario":null}},{"id":332,"attributes":{"latitud":-41.87,"longitud":-73.83,"nombre":"Proyecto Ancud cargadores SAESA","propietario":"Sociedad Austral de Electricid","comuna":"Ancud","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:03:04.802Z","updatedAt":"2024-09-14T23:03:04.802Z","publishedAt":"2024-09-14T23:03:04.798Z","direccion":"Centro Médico Huaihuén, 750, Salvador Allende, Ramón Freire, Ancud, Provincia de Chiloé, Región de Los Lagos, 5710000, Chile","comentario":null}},{"id":333,"attributes":{"latitud":-41.35,"longitud":-72.98,"nombre":"SAVE VOLTEX 20089 PUERTO VARAS","propietario":"COPEC S.A.","comuna":"Puerto Varas","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:03:08.412Z","updatedAt":"2024-09-14T23:03:08.412Z","publishedAt":"2024-09-14T23:03:08.405Z","direccion":"Ruta 5 Sur, Parcelación Industrial La Laja, Puerto Varas, Provincia de Llanquihue, Región de Los Lagos, 5550988, Chile","comentario":null}},{"id":334,"attributes":{"latitud":-41.32,"longitud":-72.98,"nombre":"SAESA Puerto Varas 1","propietario":"Sociedad Austral de Electricid","comuna":"Puerto Varas","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:03:12.050Z","updatedAt":"2024-09-14T23:03:12.050Z","publishedAt":"2024-09-14T23:03:12.049Z","direccion":"45, Mirador, Población Los Cóndores, Puerto Varas, Provincia de Llanquihue, Región de Los Lagos, 5550596, Chile","comentario":null}},{"id":335,"attributes":{"latitud":-41.31,"longitud":-72.99,"nombre":"SAVE VOLTEX Portal Los Arrayanes","propietario":"COPEX VOLTEX SPA","comuna":"Puerto Varas","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:03:15.453Z","updatedAt":"2024-09-14T23:03:15.453Z","publishedAt":"2024-09-14T23:03:15.452Z","direccion":"0328, Pasaje Crepúsculo, Lomas del Lago, Puerto Varas, Provincia de Llanquihue, Región de Los Lagos, 5550176, Chile","comentario":null}},{"id":336,"attributes":{"latitud":-40.68,"longitud":-72.6,"nombre":"PUYEHUE BNUP SAESA","propietario":"Sociedad Austral de Electricid","comuna":"Puyehue","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:03:19.035Z","updatedAt":"2024-09-14T23:03:19.035Z","publishedAt":"2024-09-14T23:03:19.033Z","direccion":"Humedal Urbano Costanera de Puyehue, Ruta Interlagos, Entre Lagos, Puyehue, Provincia de Osorno, Región de Los Lagos, 5360000, Chile","comentario":null}},{"id":337,"attributes":{"latitud":-40.59,"longitud":-73.1,"nombre":"Enel X Way - Sodimac Osorno","propietario":"S0CIEDAD RENTAS FALABELLA S.A","comuna":"Osorno","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:03:22.581Z","updatedAt":"2024-09-14T23:03:22.581Z","publishedAt":"2024-09-14T23:03:22.579Z","direccion":"Skretting, Caletera Ruta 5 Sur, Osorno, Provincia de Osorno, Región de Los Lagos, 5290000, Chile","comentario":null}},{"id":338,"attributes":{"latitud":-40.57,"longitud":-73.14,"nombre":"Saesa Osorno","propietario":"Sociedad Austral de Electricidad S.A","comuna":"Osorno","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:03:26.181Z","updatedAt":"2024-09-14T23:03:26.181Z","publishedAt":"2024-09-14T23:03:26.178Z","direccion":"Club Deportivo Llanquihue (UST), Fuchslocher, Rahue Bajo, Osorno, Provincia de Osorno, Región de Los Lagos, 5312321, Chile","comentario":null}},{"id":339,"attributes":{"latitud":-40.48,"longitud":-73.04,"nombre":"SAVE VOLTEX 20605 SAN PABLO","propietario":"COPEC S.A.","comuna":"San Pablo","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:03:29.596Z","updatedAt":"2024-09-14T23:03:29.596Z","publishedAt":"2024-09-14T23:03:29.595Z","direccion":"Ruta 5 Sur, Fundo Santa Margarita, San Pablo, Provincia de Osorno, Región de Los Lagos, Chile","comentario":null}},{"id":340,"attributes":{"latitud":-40.07,"longitud":-72.87,"nombre":"Proyecto Paillaco cargadores SAESA","propietario":"Sociedad Austral de Electricid","comuna":"Paillaco","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:03:33.136Z","updatedAt":"2024-09-14T23:03:33.136Z","publishedAt":"2024-09-14T23:03:33.130Z","direccion":"Vicuña Mackenna, Paillaco, Provincia de Valdivia, Región de Los Ríos, 5230000, Chile","comentario":null}},{"id":341,"attributes":{"latitud":-39.83,"longitud":-73.22,"nombre":"SAVE VOLTEX 20442 EDS COPEC","propietario":"COPEC S.A.","comuna":"Valdivia","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:03:36.719Z","updatedAt":"2024-09-14T23:03:36.719Z","publishedAt":"2024-09-14T23:03:36.717Z","direccion":"2325, Avenida Ramón Picarte, Villa 50, Valdivia, Provincia de Valdivia, Región de Los Ríos, 5090397, Chile","comentario":null}},{"id":342,"attributes":{"latitud":-39.82,"longitud":-73.25,"nombre":"Saesa Valdivia","propietario":"Sociedad Austral de Electricidad S.A","comuna":"Valdivia","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:03:40.105Z","updatedAt":"2024-09-14T23:03:40.105Z","publishedAt":"2024-09-14T23:03:40.103Z","direccion":"General Lagos, Villa Rucahue, Isla Teja, Valdivia, Provincia de Valdivia, Región de Los Ríos, 5110655, Chile","comentario":null}},{"id":343,"attributes":{"latitud":-39.81,"longitud":-73.25,"nombre":"IRVE LOS ROBLES 030 VALDIVIA","propietario":"SOCIEDAD COMERCIAL LOS RIOS","comuna":"Valdivia","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:03:43.936Z","updatedAt":"2024-09-14T23:03:43.936Z","publishedAt":"2024-09-14T23:03:43.934Z","direccion":"Universidad Austral de Chile, Avenida Rector Eduardo Morales Miranda, Isla Teja, Valdivia, Provincia de Valdivia, Región de Los Ríos, 5110209, Chile","comentario":null}},{"id":344,"attributes":{"latitud":-39.64,"longitud":-72.33,"nombre":"Proyecto Panguipulli cargadores SAESA","propietario":"Sociedad Austral de Electricid","comuna":"Panguipulli","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:03:47.461Z","updatedAt":"2024-09-14T23:03:47.461Z","publishedAt":"2024-09-14T23:03:47.460Z","direccion":"Alcalde Arno Kusmann, Cumbres de Panguipulli, Panguipulli, Provincia de Valdivia, Región de Los Ríos, Chile","comentario":null}},{"id":345,"attributes":{"latitud":-39.54,"longitud":-72.88,"nombre":"SAVE VOLTEX 20071 MARIQUINA","propietario":"COPEC S.A.","comuna":"Mariquina","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:03:51.298Z","updatedAt":"2024-09-14T23:03:51.298Z","publishedAt":"2024-09-14T23:03:51.294Z","direccion":"Ruta T-230, Fundo Dollín, Ciruelos, Mariquina, Provincia de Valdivia, Región de Los Ríos, Chile","comentario":null}},{"id":346,"attributes":{"latitud":-39.37,"longitud":-72.63,"nombre":"Proyecto Loncoche cargadores SAESA","propietario":"Sociedad Austral de Electricid","comuna":"Loncoche","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:03:54.992Z","updatedAt":"2024-09-14T23:03:54.992Z","publishedAt":"2024-09-14T23:03:54.991Z","direccion":"Pedro Montt, Villa Esperanza, Loncoche, Provincia de Cautín, Región de la Araucanía, 4970348, Chile","comentario":null}},{"id":347,"attributes":{"latitud":-39.35,"longitud":-72.58,"nombre":"SAVE VOLTEX 20607 LONCOCHE","propietario":"COPEC S.A.","comuna":"Loncoche","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:03:58.637Z","updatedAt":"2024-09-14T23:03:58.637Z","publishedAt":"2024-09-14T23:03:58.635Z","direccion":"Ruta 5 Sur, Suto, Loncoche, Provincia de Cautín, Región de la Araucanía, Chile","comentario":null}},{"id":348,"attributes":{"latitud":-39.29,"longitud":-72.22,"nombre":"Colo Colo  N° 410","propietario":"Enel X Chile SpA","comuna":"Villarrica","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:04:02.373Z","updatedAt":"2024-09-14T23:04:02.373Z","publishedAt":"2024-09-14T23:04:02.369Z","direccion":"1611, Ernesto Wagner, Diego Portales, Villarrica, Provincia de Cautín, Región de la Araucanía, 4930611, Chile","comentario":null}},{"id":349,"attributes":{"latitud":-39.28,"longitud":-71.97,"nombre":"Municipalidad de Pucón","propietario":"Enel X Chile SpA","comuna":"Pucón","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:04:05.900Z","updatedAt":"2024-09-14T23:04:05.900Z","publishedAt":"2024-09-14T23:04:05.899Z","direccion":"23, Zacarías García, Las Vertientes, Pucón, Provincia de Cautín, Región de la Araucanía, 4920000, Chile","comentario":null}},{"id":350,"attributes":{"latitud":-38.94,"longitud":-72.62,"nombre":"SAVE VOLTEX 20606 FREIRE","propietario":"COPEC S.A.","comuna":"Freire","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:04:09.377Z","updatedAt":"2024-09-14T23:04:09.377Z","publishedAt":"2024-09-14T23:04:09.376Z","direccion":"Ruta 5 Sur, Freire, Provincia de Cautín, Región de la Araucanía, Chile","comentario":null}},{"id":351,"attributes":{"latitud":-38.74,"longitud":-72.6,"nombre":"IRVE TEMUCO, AVENIDA CAUPOLICAN 015, EESS SHELL","propietario":"Empresa Nacional de Energia En","comuna":"Temuco","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:04:12.914Z","updatedAt":"2024-09-14T23:04:12.914Z","publishedAt":"2024-09-14T23:04:12.911Z","direccion":"133, Andrés Bello, Villa Clotario Blest, Temuco, Provincia de Cautín, Región de la Araucanía, 4791266, Chile","comentario":null}},{"id":352,"attributes":{"latitud":-38.74,"longitud":-72.63,"nombre":"IRVE SHELL FILE 276 AV PABLO NERUDA 2030 TEMUCO","propietario":"Empresa Nacional de Energia En","comuna":"Temuco","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:04:16.498Z","updatedAt":"2024-09-14T23:04:16.498Z","publishedAt":"2024-09-14T23:04:16.496Z","direccion":"Avenida Javiera Carrera, Villa Rochdale, Temuco, Provincia de Cautín, Región de la Araucanía, 4802670, Chile","comentario":null}},{"id":353,"attributes":{"latitud":-36.84,"longitud":-73.1,"nombre":"SAVE VOLTEX 20407 SAN PEDRO DE LA PAZ","propietario":"COPEC S.A.","comuna":"San Pedro de la Paz","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:04:20.157Z","updatedAt":"2024-09-14T23:04:20.157Z","publishedAt":"2024-09-14T23:04:20.153Z","direccion":"Calle Nueva, Villa Versalles, San Pedro de la Paz, Provincia de Concepción, Región del Biobío, 4070713, Chile","comentario":null}},{"id":354,"attributes":{"latitud":-36.84,"longitud":-73.1,"nombre":"Municipalidad de San Pedro de la Paz","propietario":"Enel X Chile SpA","comuna":"San Pedro de la Paz","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:04:23.850Z","updatedAt":"2024-09-14T23:04:23.850Z","publishedAt":"2024-09-14T23:04:23.846Z","direccion":"Calle Nueva, Villa Versalles, San Pedro de la Paz, Provincia de Concepción, Región del Biobío, 4070713, Chile","comentario":null}},{"id":355,"attributes":{"latitud":-36.83,"longitud":-73.06,"nombre":"Concepción","propietario":"ENEL DISTRIBUCION CHILE SA","comuna":"Concepción","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:04:27.476Z","updatedAt":"2024-09-14T23:04:27.476Z","publishedAt":"2024-09-14T23:04:27.470Z","direccion":"Avenida Padre Hurtado, Barrio Cívico, Concepción, Provincia de Concepción, Región del Biobío, 4070713, Chile","comentario":null}},{"id":356,"attributes":{"latitud":-36.8,"longitud":-73.06,"nombre":"Enel X Way - UCSC","propietario":"U. Catolica Stma Concepcion","comuna":"Concepción","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:04:30.957Z","updatedAt":"2024-09-14T23:04:30.957Z","publishedAt":"2024-09-14T23:04:30.955Z","direccion":"Colegio Padre Luis Amigó, Autopista Concepción Talcahuano, Valle Escondido de Paicaví, Concepción, Provincia de Concepción, Región del Biobío, 4061735, Chile","comentario":null}},{"id":357,"attributes":{"latitud":-36.79,"longitud":-73.07,"nombre":"Enel X Way - Sodimac Concepcion","propietario":"MALL PLAZA EL TREBOL S.A","comuna":"Talcahuano","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:04:34.424Z","updatedAt":"2024-09-14T23:04:34.424Z","publishedAt":"2024-09-14T23:04:34.421Z","direccion":"Avenida Santa María, Talcahuano, Provincia de Concepción, Región del Biobío, 4061735, Chile","comentario":null}},{"id":358,"attributes":{"latitud":-36.78,"longitud":-73.06,"nombre":"Aeropuerto Concepcion","propietario":"Sociedad Concesionaria Aeropue","comuna":"Talcahuano","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:04:37.899Z","updatedAt":"2024-10-06T02:53:31.067Z","publishedAt":"2024-09-14T23:04:37.897Z","direccion":"Avenida Jorge Alessandri, Talcahuano, Provincia de Concepción, Región del Biobío, 4091007, Chile","comentario":[{"user":"Current User","comment":"yo creo que la estación está muy bien","rating":5,"date":"2024-10-06T02:52:43.509Z"},{"user":"Current User","comment":"hola","rating":2,"date":"2024-10-06T02:53:30.728Z"}]}},{"id":359,"attributes":{"latitud":-36.59,"longitud":-72.08,"nombre":"IRVE SHELL, VICENTE MENDEZ 1182, CHILLAN ÑUBLE","propietario":"SOCIEDAD SOCOVEL SPA","comuna":"Chillan","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:04:41.390Z","updatedAt":"2024-09-14T23:04:41.390Z","publishedAt":"2024-09-14T23:04:41.388Z","direccion":"Condominio Don Eduardo III, Chillán, Provincia de Diguillín, Región de Ñuble, 3800381, Chile","comentario":null}},{"id":360,"attributes":{"latitud":-35.44,"longitud":-71.62,"nombre":"Hotel Patagonico","propietario":"Pinochet y Pinochet SPA","comuna":"Talca","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:04:44.882Z","updatedAt":"2024-09-14T23:04:44.882Z","publishedAt":"2024-09-14T23:04:44.881Z","direccion":"Cancha Futbol, Avenida San Miguel, Condominio Altos de San Miguel, San Miguel, Talca, Provincia de Talca, Región del Maule, 3461761, Chile","comentario":null}},{"id":361,"attributes":{"latitud":-34.99,"longitud":-71.25,"nombre":"Mall Curicó","propietario":"Inmobiliaria viña del mar SA","comuna":"Curicó","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:04:48.355Z","updatedAt":"2024-09-14T23:04:48.355Z","publishedAt":"2024-09-14T23:04:48.349Z","direccion":"Clarines, Los Aromos, Curicó, Provincia de Curicó, Región del Maule, 3342121, Chile","comentario":null}},{"id":362,"attributes":{"latitud":-34.87,"longitud":-71.14,"nombre":"IRVE ROMERAL , LONGITUDINAL 184B","propietario":"EMPRESA NACIONAL DE ENERGIA","comuna":"Romeral","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:04:51.915Z","updatedAt":"2024-09-14T23:04:51.915Z","publishedAt":"2024-09-14T23:04:51.911Z","direccion":"Ruta 5 Sur, San Cristóbal, Teno, Provincia de Curicó, Región del Maule, Chile","comentario":null}},{"id":363,"attributes":{"latitud":-34.03,"longitud":-71.1,"nombre":"Cargador Eléctrico Alhue","propietario":"CORPORACION DE DESARROLLO TERR","comuna":"Alhué","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:04:55.473Z","updatedAt":"2024-09-14T23:04:55.473Z","publishedAt":"2024-09-14T23:04:55.469Z","direccion":"Bernardo O'Higgins, Villa Alhué, Alhué, Provincia de Melipilla, Región Metropolitana de Santiago, Chile","comentario":null}},{"id":364,"attributes":{"latitud":-33.9,"longitud":-71.45,"nombre":"San Pedro","propietario":"CORPORACIÓN DE DESARROLLO TERR","comuna":"San Pedro","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:04:58.979Z","updatedAt":"2024-09-14T23:04:58.979Z","publishedAt":"2024-09-14T23:04:58.976Z","direccion":"Las Arenas, San Pedro, Provincia de Melipilla, Región Metropolitana de Santiago, Chile","comentario":null}},{"id":365,"attributes":{"latitud":-33.81,"longitud":-70.74,"nombre":"Paine","propietario":"CORPORACIÓN DE DESARROLLO TERR","comuna":"Paine","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:05:02.563Z","updatedAt":"2024-09-14T23:05:02.563Z","publishedAt":"2024-09-14T23:05:02.562Z","direccion":"133 B, San Rafael, Población Gabriela Mistral, Paine Oriente, Paine, Provincia de Maipo, Región Metropolitana de Santiago, Chile","comentario":null}},{"id":366,"attributes":{"latitud":-33.76,"longitud":-70.9,"nombre":"Cargador Urbano Santelices","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"Isla de Maipo","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:05:06.098Z","updatedAt":"2024-09-14T23:05:06.098Z","publishedAt":"2024-09-14T23:05:06.093Z","direccion":"Gálvez, La Villita, Las Mercedes, Isla de Maipo, Provincia de Talagante, Región Metropolitana de Santiago, 9790152, Chile","comentario":null}},{"id":367,"attributes":{"latitud":-33.69,"longitud":-71.22,"nombre":"MUNICIPALIDAD DE MELIPILLA","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"Melipilla","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:05:09.883Z","updatedAt":"2024-09-14T23:05:09.883Z","publishedAt":"2024-09-14T23:05:09.880Z","direccion":"Alborada, Villa Las Américas, Melipilla, Provincia de Melipilla, Región Metropolitana de Santiago, 9580887, Chile","comentario":null}},{"id":368,"attributes":{"latitud":-33.69,"longitud":-71.22,"nombre":"PLAZA DE ARMAS MELIPILLA","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"Melipilla","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:05:13.377Z","updatedAt":"2024-09-14T23:05:13.377Z","publishedAt":"2024-09-14T23:05:13.375Z","direccion":"Alborada, Villa Las Américas, Melipilla, Provincia de Melipilla, Región Metropolitana de Santiago, 9580887, Chile","comentario":null}},{"id":369,"attributes":{"latitud":-33.68,"longitud":-70.98,"nombre":"PLAZA INDEPENDENCIA EL MONTE","propietario":"COMPAÑIA DE PETROLEOS DE CHIL","comuna":"El Monte","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:05:16.906Z","updatedAt":"2024-09-14T23:05:16.906Z","publishedAt":"2024-09-14T23:05:16.905Z","direccion":"Ignacio Carrera Pinto, Población Manuel Rodríguez, El Monte, Provincia de Talagante, Región Metropolitana de Santiago, Chile","comentario":null}},{"id":370,"attributes":{"latitud":-33.64,"longitud":-70.35,"nombre":"Cargador Eléctrico San Jose de Maipo","propietario":"CORPORACION DE DESARROLLO TERR","comuna":"San José de Maipo","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:05:20.404Z","updatedAt":"2024-09-14T23:05:20.404Z","publishedAt":"2024-09-14T23:05:20.402Z","direccion":"Callejon La Canchilla, San José de Maipo, Provincia de Cordillera, Región Metropolitana de Santiago, Chile","comentario":null}},{"id":371,"attributes":{"latitud":-33.64,"longitud":-70.57,"nombre":"CARGADOR URBANO PIRQUE","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"Pirque","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:05:23.946Z","updatedAt":"2024-09-14T23:05:23.946Z","publishedAt":"2024-09-14T23:05:23.945Z","direccion":"Camino Brisas del Raco, Condominio Santa Hilda, Pirque, Provincia de Cordillera, Región Metropolitana de Santiago, 9480018, Chile","comentario":null}},{"id":372,"attributes":{"latitud":-33.63,"longitud":-70.76,"nombre":"Cargador Av. Calera de tango","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"Calera de Tango","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:05:27.462Z","updatedAt":"2024-09-14T23:05:27.462Z","publishedAt":"2024-09-14T23:05:27.459Z","direccion":"Paradero 6, Avenida Calera de Tango, Bajos de San Agustín, Calera de Tango, Provincia de Maipo, Región Metropolitana de Santiago, Chile","comentario":null}},{"id":373,"attributes":{"latitud":-33.61,"longitud":-70.9,"nombre":"Cargador Eléctrico Voltex Plaza de Armas Peñaflor","propietario":"CORPORACION DE DESARROLLO TERR","comuna":"Penaflor","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:05:31.021Z","updatedAt":"2024-09-14T23:05:31.021Z","publishedAt":"2024-09-14T23:05:31.019Z","direccion":"Basterrica, El Ombu, Peñaflor, Provincia de Talagante, Región Metropolitana de Santiago, 9750000, Chile","comentario":null}},{"id":374,"attributes":{"latitud":-33.6,"longitud":-71.61,"nombre":"Oficina Chilquinta San Antonio","propietario":"CHILQUINTA ENERGIA S.A","comuna":"San Antonio","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:05:34.703Z","updatedAt":"2024-09-14T23:05:34.703Z","publishedAt":"2024-09-14T23:05:34.702Z","direccion":"Aconcagua, Villa Las Dunas, Barrancas, San Antonio, Provincia de San Antonio, Región de Valparaíso, 2720000, Chile","comentario":null}},{"id":375,"attributes":{"latitud":-33.6,"longitud":-70.58,"nombre":"CARGADOR URBANO MUNICIPALIDAD DE PUENTE ALTO","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"Puente Alto","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:05:38.249Z","updatedAt":"2024-09-14T23:05:38.249Z","publishedAt":"2024-09-14T23:05:38.242Z","direccion":"Los Ingleses Oriente, Barrio Ingles, Puente Alto, Provincia de Cordillera, Región Metropolitana de Santiago, 8151746, Chile","comentario":null}},{"id":376,"attributes":{"latitud":-33.6,"longitud":-70.71,"nombre":"TE MOBILITY SpA - Mall Paseo San Bernardo","propietario":"Mall Paseo San Bernardo SpA","comuna":"San Bernardo","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:05:41.758Z","updatedAt":"2024-09-14T23:05:41.758Z","publishedAt":"2024-09-14T23:05:41.755Z","direccion":"699, Juan Francisco Gonzales, Barrio Esmeralda, San Bernardo, Provincia de Maipo, Región Metropolitana de Santiago, Chile","comentario":null}},{"id":377,"attributes":{"latitud":-33.57,"longitud":-70.58,"nombre":"VOLTEX LOS TOROS","propietario":"CIA DE PETROLEOS DE CHILE S.A.","comuna":"Puente Alto","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:05:45.327Z","updatedAt":"2024-09-14T23:05:45.327Z","publishedAt":"2024-09-14T23:05:45.326Z","direccion":"312, Jacarandá, El Algarrobo, Puente Alto, Provincia de Cordillera, Región Metropolitana de Santiago, 8301703, Chile","comentario":null}},{"id":378,"attributes":{"latitud":-33.56,"longitud":-70.66,"nombre":"Cargador Electrico Javiera","propietario":"CORPORACION DE DESARROLLO TERR","comuna":"El Bosque","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:05:48.809Z","updatedAt":"2024-09-14T23:05:48.809Z","publishedAt":"2024-09-14T23:05:48.808Z","direccion":"Los Flamencos, Población Guatemala, El Bosque, Provincia de Santiago, Región Metropolitana de Santiago, 8010000, Chile","comentario":null}},{"id":379,"attributes":{"latitud":-33.55,"longitud":-70.68,"nombre":"Cargador Eléctrico General Korner","propietario":"CORPORACION DE DESARROLLO TERR","comuna":"El Bosque","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:05:52.469Z","updatedAt":"2024-09-14T23:05:52.469Z","publishedAt":"2024-09-14T23:05:52.467Z","direccion":"620, General Korner, Población O'Higgins, El Bosque, Provincia de Santiago, Región Metropolitana de Santiago, 8012117, Chile","comentario":null}},{"id":380,"attributes":{"latitud":-33.54,"longitud":-70.65,"nombre":"Cargador Urbano Plaza Las Lilas","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"San Ramón","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:05:56.083Z","updatedAt":"2024-09-14T23:05:56.083Z","publishedAt":"2024-09-14T23:05:56.079Z","direccion":"Copec, 1316, Avenida Américo Vespucio, Población Libertad, San Ramón, Provincia de Santiago, Región Metropolitana de Santiago, 8870068, Chile","comentario":null}},{"id":381,"attributes":{"latitud":-33.54,"longitud":-70.66,"nombre":"IRVE GOYCOLEA 100","propietario":"COPEC VOLTEX SPA","comuna":"La Cisterna","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:05:59.867Z","updatedAt":"2024-09-14T23:05:59.867Z","publishedAt":"2024-09-14T23:05:59.865Z","direccion":"Pasaje Del Inca, La Cisterna, Provincia de Santiago, Región Metropolitana de Santiago, 8000146, Chile","comentario":null}},{"id":382,"attributes":{"latitud":-33.53,"longitud":-70.65,"nombre":"Cargador BNUP Fernández Albano San Ramón","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"San Ramón","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:06:03.349Z","updatedAt":"2024-09-14T23:06:03.349Z","publishedAt":"2024-09-14T23:06:03.348Z","direccion":"1123, Argentina, La Cisterna, Provincia de Santiago, Región Metropolitana de Santiago, 7980008, Chile","comentario":null}},{"id":383,"attributes":{"latitud":-33.52,"longitud":-70.59,"nombre":"WALKER MARTINEZ","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"La Florida","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:06:08.158Z","updatedAt":"2024-09-14T23:06:08.158Z","publishedAt":"2024-09-14T23:06:08.151Z","direccion":"Senday, La Florida, Provincia de Santiago, Región Metropolitana de Santiago, 8240494, Chile","comentario":null}},{"id":384,"attributes":{"latitud":-33.52,"longitud":-70.58,"nombre":"AV. LA FLORIDA ESQ. WALKER MARTINEZ","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"La Florida","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:06:13.005Z","updatedAt":"2024-09-14T23:06:13.005Z","publishedAt":"2024-09-14T23:06:12.997Z","direccion":"1817, Avenida La Florida, La Florida, Provincia de Santiago, Región Metropolitana de Santiago, 8240494, Chile","comentario":null}},{"id":385,"attributes":{"latitud":-33.52,"longitud":-70.59,"nombre":"SERAFIN ZAMORA / FROILAN ROA","propietario":"COMPAÑIA DE PETROLEOS DE CHIL","comuna":"La Florida","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:06:20.838Z","updatedAt":"2024-09-14T23:06:20.838Z","publishedAt":"2024-09-14T23:06:20.830Z","direccion":"Senday, La Florida, Provincia de Santiago, Región Metropolitana de Santiago, 8240494, Chile","comentario":null}},{"id":386,"attributes":{"latitud":-33.52,"longitud":-71.12,"nombre":"Maria Pinto","propietario":"CORPORACIÓN DE DESARROLLO TERR","comuna":"María Pinto","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:06:24.334Z","updatedAt":"2024-10-06T02:51:57.375Z","publishedAt":"2024-09-14T23:06:24.333Z","direccion":"Las Chilcas, María Pinto, Provincia de Melipilla, Región Metropolitana de Santiago, Chile","comentario":null}},{"id":387,"attributes":{"latitud":-33.51,"longitud":-70.75,"nombre":"Primera Transversal","propietario":"CORPORACIÓN DE DESARROLLO TERR","comuna":"Maipú","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:06:27.990Z","updatedAt":"2024-09-14T23:06:27.990Z","publishedAt":"2024-09-14T23:06:27.987Z","direccion":"Universidad de Las Américas, 0620, Avenida 5 de Abril, Las Terrazas, Maipú, Provincia de Santiago, Región Metropolitana de Santiago, 9251602, Chile","comentario":null}},{"id":388,"attributes":{"latitud":-33.5,"longitud":-70.64,"nombre":"ESTACIONAMIENTOS ELECTRICOS BeSmart","propietario":"Inmobiliaria Be Smart San Migu","comuna":"San Miguel","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:06:31.656Z","updatedAt":"2024-09-14T23:06:31.656Z","publishedAt":"2024-09-14T23:06:31.655Z","direccion":"4653, Avenida Santa Rosa, Barrio Llico, San Miguel, Provincia de Santiago, Región Metropolitana de Santiago, 8940000, Chile","comentario":null}},{"id":389,"attributes":{"latitud":-33.5,"longitud":-70.76,"nombre":"Enel X Mc Donald Pajaritos","propietario":"Arcos Dorados Restaurantes Chi","comuna":"Maipú","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:06:35.174Z","updatedAt":"2024-09-14T23:06:35.174Z","publishedAt":"2024-09-14T23:06:35.172Z","direccion":"Colegio Alberto Pérez, 147, Centenario, Barrio Maipú Centro, Maipú, Provincia de Santiago, Región Metropolitana de Santiago, 9250678, Chile","comentario":null}},{"id":390,"attributes":{"latitud":-33.5,"longitud":-70.62,"nombre":"DUOC-UC. San Joaquín","propietario":"Fundación Instituto Profeciona","comuna":"San Joaquín","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:06:39.007Z","updatedAt":"2024-09-14T23:06:39.007Z","publishedAt":"2024-09-14T23:06:39.006Z","direccion":"Manuel Pérez, Villa Los Cerezos, San Joaquín, Provincia de Santiago, Región Metropolitana de Santiago, 8940000, Chile","comentario":null}},{"id":391,"attributes":{"latitud":-33.49,"longitud":-70.71,"nombre":"Plaza Felix Margoz-Cerrillo","propietario":"COMPANIA DE PETROLEOS DE CHILE","comuna":"Cerrillos","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:06:42.482Z","updatedAt":"2024-09-14T23:06:42.482Z","publishedAt":"2024-09-14T23:06:42.481Z","direccion":"Gabriela Mistral, Villa Aeropuerto Cerrillos, Cerrillos, Provincia de Santiago, Región Metropolitana de Santiago, 9222145, Chile","comentario":null}},{"id":392,"attributes":{"latitud":-33.49,"longitud":-70.76,"nombre":"Av. Los Pajaritos","propietario":"CORPORACION DE DESARROLLO TERR","comuna":"Maipú","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:06:45.937Z","updatedAt":"2024-09-14T23:06:45.937Z","publishedAt":"2024-09-14T23:06:45.934Z","direccion":"El Violín, La Sinfonía, Maipú, Provincia de Santiago, Región Metropolitana de Santiago, 9250678, Chile","comentario":null}},{"id":393,"attributes":{"latitud":-33.49,"longitud":-70.52,"nombre":"Universidad Adolfo Ibañez","propietario":"Universidad Adolfo Ibanez","comuna":"Penalolén","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:06:49.588Z","updatedAt":"2024-09-14T23:06:49.588Z","publishedAt":"2024-09-14T23:06:49.587Z","direccion":"Diagonal Las Torres, Villa Medialuna, Peñalolén, Provincia de Santiago, Región Metropolitana de Santiago, 7941685, Chile","comentario":null}},{"id":394,"attributes":{"latitud":-33.49,"longitud":-70.59,"nombre":"Cargador Eléctrico Plaza Juan Renz","propietario":"CORPORACION DE DESARROLLO TERR","comuna":"Macul","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:06:53.223Z","updatedAt":"2024-09-14T23:06:53.223Z","publishedAt":"2024-09-14T23:06:53.221Z","direccion":"Luis Valenzuela Aris, Villa Macul Oriente, Macul, Provincia de Santiago, Región Metropolitana de Santiago, 7810677, Chile","comentario":null}},{"id":395,"attributes":{"latitud":-33.49,"longitud":-70.65,"nombre":"SAVE - EL LLANO SUBERCASEAUX N°3751 SAN MIGUEL","propietario":"Corporacion Desarrollo RM","comuna":"San Miguel","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:06:56.971Z","updatedAt":"2024-09-14T23:06:56.971Z","publishedAt":"2024-09-14T23:06:56.964Z","direccion":"1013, Álvarez de Toledo, San Miguel, Provincia de Santiago, Región Metropolitana de Santiago, 8910183, Chile","comentario":null}},{"id":396,"attributes":{"latitud":-33.49,"longitud":-70.65,"nombre":"SAVE - EL LLANO SUBERCASEAUX N° 3547, SAN MIGUEL","propietario":"Corporacion Desarrollo RM","comuna":"San Miguel","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:07:00.594Z","updatedAt":"2024-09-14T23:07:00.594Z","publishedAt":"2024-09-14T23:07:00.592Z","direccion":"1013, Álvarez de Toledo, San Miguel, Provincia de Santiago, Región Metropolitana de Santiago, 8910183, Chile","comentario":null}},{"id":397,"attributes":{"latitud":-33.49,"longitud":-70.7,"nombre":"IRVE KIA DELARZE - PEDRO AGUIRRE CERDA","propietario":"COMERCIAL AUTOMOTRIZ SIGLO XXI","comuna":"Cerrillos","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:07:04.272Z","updatedAt":"2024-09-14T23:07:04.272Z","publishedAt":"2024-09-14T23:07:04.271Z","direccion":"Ciclovía Pedro Aguirre Cerda, Ciudad Parque Bicentenario, Cerrillos, Provincia de Santiago, Región Metropolitana de Santiago, 9210007, Chile","comentario":null}},{"id":398,"attributes":{"latitud":-33.49,"longitud":-70.65,"nombre":"SAVE - EL LLANO SUBERCASEAUX N°3397, SAN MIGUEL","propietario":"Corporacion Desarrollo RM","comuna":"San Miguel","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:07:08.157Z","updatedAt":"2024-09-14T23:07:08.157Z","publishedAt":"2024-09-14T23:07:08.155Z","direccion":"1013, Álvarez de Toledo, San Miguel, Provincia de Santiago, Región Metropolitana de Santiago, 8910183, Chile","comentario":null}},{"id":399,"attributes":{"latitud":-33.49,"longitud":-70.6,"nombre":"Av. Quilin","propietario":"CORPORACIÓN DE DESARROLLO TERR","comuna":"Macul","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:07:11.835Z","updatedAt":"2024-09-14T23:07:11.835Z","publishedAt":"2024-09-14T23:07:11.830Z","direccion":"3124, Avenida Escuela Agrícola, Macul, Provincia de Santiago, Región Metropolitana de Santiago, 7830198, Chile","comentario":null}},{"id":400,"attributes":{"latitud":-33.48,"longitud":-70.6,"nombre":"Los Platanos","propietario":"CORPORACIÓN DE DESARROLLO TERR","comuna":"Macul","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:07:15.494Z","updatedAt":"2024-09-14T23:07:15.494Z","publishedAt":"2024-09-14T23:07:15.491Z","direccion":"Los Olmos, Macul, Provincia de Santiago, Región Metropolitana de Santiago, 7810000, Chile","comentario":null}},{"id":401,"attributes":{"latitud":-33.46,"longitud":-70.54,"nombre":"Enel X - Sodimac La Reina","propietario":"Enel X Chile SpA","comuna":"La Reina","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:07:19.135Z","updatedAt":"2024-09-14T23:07:19.135Z","publishedAt":"2024-09-14T23:07:19.134Z","direccion":"Club de Campo Carabineros de Chile, 9105, Talinay, Villa La Reina, La Reina, Provincia de Santiago, Región Metropolitana de Santiago, 7940068, Chile","comentario":null}},{"id":402,"attributes":{"latitud":-33.46,"longitud":-70.57,"nombre":"ELECTROLINIERA COPEC AVDA.ORIENTAL 5710","propietario":"COPEC S.A","comuna":"Penalolén","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:07:22.669Z","updatedAt":"2024-09-14T23:07:22.669Z","publishedAt":"2024-09-14T23:07:22.667Z","direccion":"Instituto Nacional de Rehabilitación Pedro Aguirre Cerda, 5969, Avenida José Arrieta, Barrio Blest Gana, La Reina, Provincia de Santiago, Región Metropolitana de Santiago, 7870154, Chile","comentario":null}},{"id":403,"attributes":{"latitud":-33.46,"longitud":-70.72,"nombre":"CARDADOR URBANO GENERAL BONILLA","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"Lo Prado","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:07:26.116Z","updatedAt":"2024-09-14T23:07:26.116Z","publishedAt":"2024-09-14T23:07:26.113Z","direccion":"Calle 1, Estación Central, Provincia de Santiago, Región Metropolitana de Santiago, 9190847, Chile","comentario":null}},{"id":404,"attributes":{"latitud":-33.46,"longitud":-70.7,"nombre":"Cargador Eléctrico Voltex Instituto Teleton","propietario":"CORPORACION DE DESARROLLO REGI","comuna":"Estación Central","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:07:29.599Z","updatedAt":"2024-09-14T23:07:29.599Z","publishedAt":"2024-09-14T23:07:29.598Z","direccion":"478, José Abelardo Núñez, Estación Central, Provincia de Santiago, Región Metropolitana de Santiago, 9210007, Chile","comentario":null}},{"id":405,"attributes":{"latitud":-33.46,"longitud":-70.77,"nombre":"BSF","propietario":"Inversiones Quildos Ltda","comuna":"Pudahuel","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:07:33.242Z","updatedAt":"2024-09-14T23:07:33.242Z","publishedAt":"2024-09-14T23:07:33.241Z","direccion":"Centro Logístico Vespucio - Bodegas San Francisco, Avenida Américo Vespucio, Villa Cristobal Colón, Pudahuel, Provincia de Santiago, Región Metropolitana de Santiago, 9020078, Chile","comentario":null}},{"id":406,"attributes":{"latitud":-33.46,"longitud":-70.59,"nombre":"BROWN SUR","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"Nunoa","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:07:36.753Z","updatedAt":"2024-09-14T23:07:36.753Z","publishedAt":"2024-09-14T23:07:36.751Z","direccion":"Pasaje Santa Julia, Barrio Parque Juan XXIII, Ñuñoa, Provincia de Santiago, Región Metropolitana de Santiago, 7750000, Chile","comentario":null}},{"id":407,"attributes":{"latitud":-33.46,"longitud":-70.6,"nombre":"DUBLÉ ALMEYDA","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"Nunoa","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:07:40.507Z","updatedAt":"2024-09-14T23:07:40.507Z","publishedAt":"2024-09-14T23:07:40.507Z","direccion":"611, Exequiel Fernández, Barrio Doctor Luis Bisquert, Ñuñoa, Provincia de Santiago, Región Metropolitana de Santiago, 7750000, Chile","comentario":null}},{"id":408,"attributes":{"latitud":-33.45,"longitud":-70.6,"nombre":"TE MOBILITY SpA - Punta Blanca","propietario":"INMOBILIARIA IRARRAZAVAL DOS S","comuna":"Nunoa","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:07:44.037Z","updatedAt":"2024-09-14T23:07:44.037Z","publishedAt":"2024-09-14T23:07:44.036Z","direccion":"2885, Simón Bolívar, Barrio Villaseca, Ñuñoa, Provincia de Santiago, Región Metropolitana de Santiago, 7750000, Chile","comentario":null}},{"id":409,"attributes":{"latitud":-33.45,"longitud":-70.8,"nombre":"Bodegas SF","propietario":"Bodegas San Francisco Ltda.","comuna":"Pudahuel","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:07:47.811Z","updatedAt":"2024-09-14T23:07:47.811Z","publishedAt":"2024-09-14T23:07:47.804Z","direccion":"Camino La Farfana, Pudahuel, Provincia de Santiago, Región Metropolitana de Santiago, Chile","comentario":null}},{"id":410,"attributes":{"latitud":-33.45,"longitud":-70.79,"nombre":"Bodegas San Francisco","propietario":"Bodegas san Francisco ltda","comuna":"Pudahuel","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:07:51.320Z","updatedAt":"2024-09-14T23:07:51.320Z","publishedAt":"2024-09-14T23:07:51.317Z","direccion":"Calle Central, Pudahuel, Provincia de Santiago, Región Metropolitana de Santiago, 9020078, Chile","comentario":null}},{"id":411,"attributes":{"latitud":-33.45,"longitud":-70.63,"nombre":"SAN EUGENIO","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"Nunoa","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:07:54.891Z","updatedAt":"2024-09-14T23:07:54.891Z","publishedAt":"2024-09-14T23:07:54.890Z","direccion":"Juan Godoy, Barrio Italia, Ñuñoa, Provincia de Santiago, Región Metropolitana de Santiago, 7770613, Chile","comentario":null}},{"id":412,"attributes":{"latitud":-33.45,"longitud":-70.68,"nombre":"Cargador Eléctrico Voltex Biblioteca Usach","propietario":"CORPORACION DE DESARROLLO TERR","comuna":"Estación Central","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:07:58.541Z","updatedAt":"2024-09-14T23:07:58.541Z","publishedAt":"2024-09-14T23:07:58.535Z","direccion":"Pdte. Allende, 3363, Avenida Víctor Jara, Barrio Pila del Ganso, Estación Central, Provincia de Santiago, Región Metropolitana de Santiago, 8370261, Chile","comentario":null}},{"id":413,"attributes":{"latitud":-33.45,"longitud":-70.74,"nombre":"Cargador Urbano Los Ediles","propietario":"Compania de Petroleos de Chil","comuna":"Pudahuel","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:08:02.226Z","updatedAt":"2024-09-14T23:08:02.226Z","publishedAt":"2024-09-14T23:08:02.224Z","direccion":"8313, Corona Sueca, Población Santiago Amengual, Pudahuel, Provincia de Santiago, Región Metropolitana de Santiago, 9020078, Chile","comentario":null}},{"id":414,"attributes":{"latitud":-33.45,"longitud":-70.74,"nombre":"Cargador Urbano San Pablo","propietario":"COMPANIA DE PETROLEOS DE CHILE","comuna":"Pudahuel","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:08:05.885Z","updatedAt":"2024-09-14T23:08:05.885Z","publishedAt":"2024-09-14T23:08:05.876Z","direccion":"8313, Corona Sueca, Población Santiago Amengual, Pudahuel, Provincia de Santiago, Región Metropolitana de Santiago, 9020078, Chile","comentario":null}},{"id":415,"attributes":{"latitud":-33.44,"longitud":-70.66,"nombre":"Moneda","propietario":"CHILECTRA S.A.","comuna":"Santiago","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:08:09.356Z","updatedAt":"2024-09-14T23:08:09.356Z","publishedAt":"2024-09-14T23:08:09.355Z","direccion":"Autopista Central, Barrio Santa Ana, Santiago, Provincia de Santiago, Región Metropolitana de Santiago, 8340491, Chile","comentario":null}},{"id":416,"attributes":{"latitud":-33.44,"longitud":-70.56,"nombre":"Estacionamiento Unimarc -La Reina","propietario":"COMPANIA DE PETROLEOS DE CHILE","comuna":"La Reina","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:08:13.128Z","updatedAt":"2024-09-14T23:08:13.128Z","publishedAt":"2024-09-14T23:08:13.126Z","direccion":"6924, Pasaje Reina Victoria, Barrio Príncipe de Gales, La Reina, Provincia de Santiago, Región Metropolitana de Santiago, 7850633, Chile","comentario":null}},{"id":417,"attributes":{"latitud":-33.44,"longitud":-70.56,"nombre":"Enel X - Starbucks La Reina","propietario":"STARBUCKS COFFEE CHILE S.A","comuna":"La Reina","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:08:16.615Z","updatedAt":"2024-09-14T23:08:16.615Z","publishedAt":"2024-09-14T23:08:16.614Z","direccion":"6924, Pasaje Reina Victoria, Barrio Príncipe de Gales, La Reina, Provincia de Santiago, Región Metropolitana de Santiago, 7850633, Chile","comentario":null}},{"id":418,"attributes":{"latitud":-33.44,"longitud":-70.65,"nombre":"Mac Iver","propietario":"CHILECTRA S.A.","comuna":"Santiago","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:08:20.166Z","updatedAt":"2024-09-14T23:08:20.166Z","publishedAt":"2024-09-14T23:08:20.162Z","direccion":"930, Huérfanos, Centro Histórico, Santiago, Provincia de Santiago, Región Metropolitana de Santiago, 8320202, Chile","comentario":null}},{"id":419,"attributes":{"latitud":-33.44,"longitud":-70.64,"nombre":"SERV P135C AKIPARK - MERCED 317 SANTIAGO","propietario":"MVT SPA AKIPARK ESTACIONAMIENT","comuna":"Santiago","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:08:23.857Z","updatedAt":"2024-09-14T23:08:23.857Z","publishedAt":"2024-09-14T23:08:23.855Z","direccion":"Avenida Libertador Bernardo O'Higgins, Barrio Lastarria, Santiago, Provincia de Santiago, Región Metropolitana de Santiago, 6500808, Chile","comentario":null}},{"id":420,"attributes":{"latitud":-33.44,"longitud":-70.84,"nombre":"VOLTEX CTEC CAREN","propietario":"CTEC","comuna":"Pudahuel","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:08:27.449Z","updatedAt":"2024-09-14T23:08:27.449Z","publishedAt":"2024-09-14T23:08:27.446Z","direccion":"Parque de Innovación Universidad de Chile, Laguna Carén, Carén, Pudahuel, Provincia de Santiago, Región Metropolitana de Santiago, Chile","comentario":null}},{"id":421,"attributes":{"latitud":-33.43,"longitud":-70.73,"nombre":"DEL CONSISTORIAL","propietario":"COMPAÑIA DE PETROLEOS DE CHIL","comuna":"Cerro Navia","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:08:31.025Z","updatedAt":"2024-09-14T23:08:31.025Z","publishedAt":"2024-09-14T23:08:31.020Z","direccion":"1380, Caupolicán, Cerro Navia, Provincia de Santiago, Región Metropolitana de Santiago, 9010290, Chile","comentario":null}},{"id":422,"attributes":{"latitud":-33.43,"longitud":-70.64,"nombre":"CARGADOR URBANO PATRONATO","propietario":"COMPAÑIA DE PETROLEOS DE CHIL","comuna":"Recoleta","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:08:34.686Z","updatedAt":"2024-09-14T23:08:34.686Z","publishedAt":"2024-09-14T23:08:34.682Z","direccion":"Liceo Leonardo Murialdo, 159, Santa Filomena, Patronato, Recoleta, Provincia de Santiago, Región Metropolitana de Santiago, 8420568, Chile","comentario":null}},{"id":423,"attributes":{"latitud":-33.43,"longitud":-70.58,"nombre":"Entrada Jumbo","propietario":"Municipalidad de las Condes","comuna":"Las Condes","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:08:38.235Z","updatedAt":"2024-09-14T23:08:38.235Z","publishedAt":"2024-09-14T23:08:38.228Z","direccion":"Vet Surg, 1851, Juan de Austria, Vaticano, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7580386, Chile","comentario":null}},{"id":424,"attributes":{"latitud":-33.43,"longitud":-70.74,"nombre":"Cargador Urbano Cerro Navia Estados Unidos","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"Cerro Navia","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:08:41.759Z","updatedAt":"2024-09-14T23:08:41.759Z","publishedAt":"2024-09-14T23:08:41.753Z","direccion":"7422, Avenida José Joaquín Pérez, Población Roosevelt, Cerro Navia, Provincia de Santiago, Región Metropolitana de Santiago, 9010290, Chile","comentario":null}},{"id":425,"attributes":{"latitud":-33.43,"longitud":-70.7,"nombre":"Cargador Eléctrico Radal","propietario":"CORPORACION DE DESARROLLO TERR","comuna":"Quinta Normal","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:08:45.536Z","updatedAt":"2024-09-14T23:08:45.536Z","publishedAt":"2024-09-14T23:08:45.531Z","direccion":"Cónsul Poinsett, Quinta Normal, Provincia de Santiago, Región Metropolitana de Santiago, 8520512, Chile","comentario":null}},{"id":426,"attributes":{"latitud":-33.43,"longitud":-70.55,"nombre":"Alejandro Fleming Frente N° 7501","propietario":"Municipalidad de las Condes","comuna":"Las Condes","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:08:50.146Z","updatedAt":"2024-09-14T23:08:50.146Z","publishedAt":"2024-09-14T23:08:50.141Z","direccion":"Feria Bilbao, Avenida Francisco Bilbao, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7570957, Chile","comentario":null}},{"id":427,"attributes":{"latitud":-33.42,"longitud":-70.69,"nombre":"Cargador Eléctrico Aviador","propietario":"CORPORACION DE DESARROLLO TERR","comuna":"Quinta Normal","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:08:53.713Z","updatedAt":"2024-09-14T23:08:53.713Z","publishedAt":"2024-09-14T23:08:53.710Z","direccion":"Estadio Esparta, 2355, Augusto Matte, Quinta Normal, Provincia de Santiago, Región Metropolitana de Santiago, 8520512, Chile","comentario":null}},{"id":428,"attributes":{"latitud":-33.42,"longitud":-70.6,"nombre":"Estadio Francés","propietario":"Municipalidad de las Condes","comuna":"Las Condes","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:08:57.226Z","updatedAt":"2024-09-14T23:08:57.226Z","publishedAt":"2024-09-14T23:08:57.224Z","direccion":"239, Avenida Tobalaba, Sanhattan, Providencia, Provincia de Santiago, Región Metropolitana de Santiago, 7500000, Chile","comentario":null}},{"id":429,"attributes":{"latitud":-33.42,"longitud":-70.59,"nombre":"Presidente Errazuriz frente  al Nº 3753","propietario":"Municipalidad de las Condes","comuna":"Las Condes","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:09:00.909Z","updatedAt":"2024-09-14T23:09:00.909Z","publishedAt":"2024-09-14T23:09:00.906Z","direccion":"3750, Avenida Presidente Errázuriz, Barrio San Pascual, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7550344, Chile","comentario":null}},{"id":430,"attributes":{"latitud":-33.42,"longitud":-70.58,"nombre":"Presidente Riesco Esquina Asturias","propietario":"ENEL X Chile S.P.A.","comuna":"Las Condes","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:09:04.459Z","updatedAt":"2024-09-14T23:09:04.459Z","publishedAt":"2024-09-14T23:09:04.457Z","direccion":"4499, Cuenca, Barrio San Pascual, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7580386, Chile","comentario":null}},{"id":431,"attributes":{"latitud":-33.42,"longitud":-70.67,"nombre":"Cargador Urbano Enrique Soros","propietario":"COMPANIA DE PETROLEOS DE CHILE","comuna":"Independencia","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:09:08.312Z","updatedAt":"2024-09-14T23:09:08.312Z","publishedAt":"2024-09-14T23:09:08.309Z","direccion":"Unimarc, 351, Salomón Sack, Centro Cívico Juan Antonio Ríos, Independencia, Provincia de Santiago, Región Metropolitana de Santiago, 8390450, Chile","comentario":null}},{"id":432,"attributes":{"latitud":-33.42,"longitud":-70.65,"nombre":"Cargador Urbano Profesor Zañartu","propietario":"COMPANIA DE PETROLEOS DE CHILE","comuna":"Independencia","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:09:12.006Z","updatedAt":"2024-09-14T23:09:12.006Z","publishedAt":"2024-09-14T23:09:11.999Z","direccion":"Universidad de Chile (Campus Norte), Monserrat, Población San Cristóbal, Recoleta, Provincia de Santiago, Región Metropolitana de Santiago, 8380552, Chile","comentario":null}},{"id":433,"attributes":{"latitud":-33.42,"longitud":-70.61,"nombre":"TE MOBILITY SpA - EC Parking","propietario":"COM. ED. WORD TRADE CENCER","comuna":"Las Condes","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:09:15.658Z","updatedAt":"2024-09-14T23:09:15.658Z","publishedAt":"2024-09-14T23:09:15.651Z","direccion":"154, Santa Magdalena, Sanhattan, Providencia, Provincia de Santiago, Región Metropolitana de Santiago, 7500000, Chile","comentario":null}},{"id":434,"attributes":{"latitud":-33.42,"longitud":-70.54,"nombre":"Mall Plaza Los Domínicos","propietario":"PLAZA CORDILLERA S.A.","comuna":"Las Condes","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:09:19.188Z","updatedAt":"2024-09-14T23:09:19.188Z","publishedAt":"2024-09-14T23:09:19.186Z","direccion":"1260, Visviri, Colón Oriente, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7570936, Chile","comentario":null}},{"id":435,"attributes":{"latitud":-33.42,"longitud":-70.62,"nombre":"Parque Metropolitano- Entrada Pedro de Valdivia","propietario":"Parque metropolitano de Santia","comuna":"Providencia","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:09:22.843Z","updatedAt":"2024-09-14T23:09:22.843Z","publishedAt":"2024-09-14T23:09:22.839Z","direccion":"Los Colonos, Pedro de Valdivia Norte, Providencia, Provincia de Santiago, Región Metropolitana de Santiago, 7500000, Chile","comentario":null}},{"id":436,"attributes":{"latitud":-33.41,"longitud":-70.64,"nombre":"Cargador Eléctrico Voltex Cementerio Catolico","propietario":"CORPORACION DE DESARROLLO TERR","comuna":"Recoleta","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:09:26.451Z","updatedAt":"2024-09-14T23:09:26.451Z","publishedAt":"2024-09-14T23:09:26.442Z","direccion":"Los Pamperos, Barrio San Martín, Recoleta, Provincia de Santiago, Región Metropolitana de Santiago, 7690000, Chile","comentario":null}},{"id":437,"attributes":{"latitud":-33.41,"longitud":-70.62,"nombre":"Parque Metropolitano_Jardín Mapulemo","propietario":"Parque metropolitano de Santia","comuna":"Recoleta","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:09:30.042Z","updatedAt":"2024-09-14T23:09:30.042Z","publishedAt":"2024-09-14T23:09:30.037Z","direccion":"Grupo de Adiestramiento Canino, Población Padre Undurraga, Recoleta, Provincia de Santiago, Región Metropolitana de Santiago, 7530116, Chile","comentario":null}},{"id":438,"attributes":{"latitud":-33.41,"longitud":-70.75,"nombre":"Cargador Urbano Cerro Navia Rolando Petersen","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"Cerro Navia","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:09:33.546Z","updatedAt":"2024-09-14T23:09:33.546Z","publishedAt":"2024-09-14T23:09:33.545Z","direccion":"Avenida Presidente Salvador Allende Gossens, Villa Pedro de Oña, Renca, Provincia de Santiago, Región Metropolitana de Santiago, 9090184, Chile","comentario":null}},{"id":439,"attributes":{"latitud":-33.41,"longitud":-70.58,"nombre":"La Castellana Esquina Apoquindo","propietario":"ENEL X Chile S.P.A.","comuna":"Las Condes","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:09:37.065Z","updatedAt":"2024-09-14T23:09:37.065Z","publishedAt":"2024-09-14T23:09:37.058Z","direccion":"Campo de Fútbol, Villa Alcázar, Barrio San Pascual, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7560936, Chile","comentario":null}},{"id":440,"attributes":{"latitud":-33.41,"longitud":-70.58,"nombre":"Omnium","propietario":"ENEL DISTRIBUCION CHILE S.A.","comuna":"Las Condes","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:09:40.531Z","updatedAt":"2024-09-14T23:09:40.531Z","publishedAt":"2024-09-14T23:09:40.529Z","direccion":"Campo de Fútbol, Villa Alcázar, Barrio San Pascual, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7560936, Chile","comentario":null}},{"id":441,"attributes":{"latitud":-33.41,"longitud":-70.57,"nombre":"Mar de los Sargazos con Rosario Sur","propietario":"ENEL X Chile S.P.A.","comuna":"Las Condes","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:09:44.114Z","updatedAt":"2024-09-14T23:09:44.114Z","publishedAt":"2024-09-14T23:09:44.112Z","direccion":"Plaza Apoquindo, Mar de los Sargazos, Barrio El Faro, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7560943, Chile","comentario":null}},{"id":442,"attributes":{"latitud":-33.4,"longitud":-70.51,"nombre":"Universidad de Los Andes","propietario":"Universidad de Los andes","comuna":"Las Condes","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:09:55.502Z","updatedAt":"2024-09-14T23:09:55.502Z","publishedAt":"2024-09-14T23:09:55.499Z","direccion":"Clínica UC San Carlos de Apoquindo, 12351, Camino El Alba, Condominio Los Algarrobos, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7610685, Chile","comentario":null}},{"id":443,"attributes":{"latitud":-33.4,"longitud":-70.58,"nombre":"Hotel Mandarin Oriental ex Hyatt","propietario":"Hotel Corporation Of Chile","comuna":"Las Condes","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:09:59.026Z","updatedAt":"2024-09-14T23:09:59.026Z","publishedAt":"2024-09-14T23:09:59.019Z","direccion":"1110, Pedro Canisio, Jardín del Este, Vitacura, Provincia de Santiago, Región Metropolitana de Santiago, 7630280, Chile","comentario":null}},{"id":444,"attributes":{"latitud":-33.4,"longitud":-70.7,"nombre":"José Manuel Balmaceda","propietario":"COMPAÑIA DE PETROLEOS DE CHIL","comuna":"Renca","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:10:02.699Z","updatedAt":"2024-09-14T23:10:02.699Z","publishedAt":"2024-09-14T23:10:02.697Z","direccion":"Los Clarines, Población Huamachuco I, Renca, Provincia de Santiago, Región Metropolitana de Santiago, 8520512, Chile","comentario":null}},{"id":445,"attributes":{"latitud":-33.4,"longitud":-70.57,"nombre":"EB Box public Line","propietario":"ILUSTRE MUNICIPALIDAD DE LAS CONDES","comuna":"Las Condes","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:10:06.365Z","updatedAt":"2024-09-14T23:10:06.365Z","publishedAt":"2024-09-14T23:10:06.358Z","direccion":"785, Avenida Manquehue, Nueva Las Condes, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7561156, Chile","comentario":null}},{"id":446,"attributes":{"latitud":-33.4,"longitud":-70.58,"nombre":"Mc Donalds Kennedy","propietario":"Arcos Dorados Restaurantes de","comuna":"Las Condes","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:10:09.892Z","updatedAt":"2024-09-14T23:10:09.892Z","publishedAt":"2024-09-14T23:10:09.884Z","direccion":"1110, Pedro Canisio, Jardín del Este, Vitacura, Provincia de Santiago, Región Metropolitana de Santiago, 7630280, Chile","comentario":null}},{"id":447,"attributes":{"latitud":-33.4,"longitud":-71.13,"nombre":"Williams Rebolledo","propietario":"CORPORACIÓN DE DESARROLLO TERR","comuna":"Curacaví","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:10:13.359Z","updatedAt":"2024-09-14T23:10:13.359Z","publishedAt":"2024-09-14T23:10:13.354Z","direccion":"Avenida German Riesco, Curacaví, Provincia de Melipilla, Región Metropolitana de Santiago, Chile","comentario":null}},{"id":448,"attributes":{"latitud":-33.4,"longitud":-70.58,"nombre":"Parque Arauco, Presidente Kennedy Nº 5413","propietario":"Parque Arauco SA","comuna":"Las Condes","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:10:17.098Z","updatedAt":"2024-09-14T23:10:17.098Z","publishedAt":"2024-09-14T23:10:17.096Z","direccion":"1110, Pedro Canisio, Jardín del Este, Vitacura, Provincia de Santiago, Región Metropolitana de Santiago, 7630280, Chile","comentario":null}},{"id":449,"attributes":{"latitud":-33.4,"longitud":-70.5,"nombre":"Cargador Vehicular Hotel Noi Vitacura","propietario":"ENELX CHILE SPA","comuna":"Vitacura","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:10:20.600Z","updatedAt":"2024-09-14T23:10:20.600Z","publishedAt":"2024-09-14T23:10:20.596Z","direccion":"Complejo Deportivo San Carlos de Apoquindo, 13000, Camino Las Flores, Barrio Génova, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7610685, Chile","comentario":null}},{"id":450,"attributes":{"latitud":-33.4,"longitud":-70.57,"nombre":"Presidente Riesco con Manquehue Norte","propietario":"ENEL X Chile S.P.A.","comuna":"Las Condes","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:10:24.105Z","updatedAt":"2024-09-14T23:10:24.105Z","publishedAt":"2024-09-14T23:10:24.102Z","direccion":"785, Avenida Manquehue, Nueva Las Condes, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7561156, Chile","comentario":null}},{"id":451,"attributes":{"latitud":-33.4,"longitud":-70.57,"nombre":"Hotel Marriott","propietario":"Cominidad Complejo Boulebard K","comuna":"Las Condes","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:10:27.652Z","updatedAt":"2024-09-14T23:10:27.652Z","publishedAt":"2024-09-14T23:10:27.645Z","direccion":"785, Avenida Manquehue, Nueva Las Condes, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7561156, Chile","comentario":null}},{"id":452,"attributes":{"latitud":-33.4,"longitud":-70.6,"nombre":"C E. Voltex G. JOHN O´BRIEN esq. BICENTENARIO","propietario":"CORPORACION DE DESARROLLO REGI","comuna":"Vitacura","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:10:31.345Z","updatedAt":"2024-09-14T23:10:31.345Z","publishedAt":"2024-09-14T23:10:31.344Z","direccion":"Atacama Large Millimeter/submillimeter Array, Alonso de Córdova, Lo Castillo, Vitacura, Provincia de Santiago, Región Metropolitana de Santiago, 7630391, Chile","comentario":null}},{"id":453,"attributes":{"latitud":-33.4,"longitud":-70.75,"nombre":"CARGADOR URBANO BRASIL 7845","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"Renca","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:10:34.981Z","updatedAt":"2024-09-14T23:10:34.981Z","publishedAt":"2024-09-14T23:10:34.978Z","direccion":"Presidente Aníbal Pinto, Villa Miraflores, Renca, Provincia de Santiago, Región Metropolitana de Santiago, 9090184, Chile","comentario":null}},{"id":454,"attributes":{"latitud":-33.39,"longitud":-70.58,"nombre":"SAVE VOLTEX 60050 EDS COPEC","propietario":"COPEC S.A.","comuna":"Vitacura","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:10:38.722Z","updatedAt":"2024-09-14T23:10:38.722Z","publishedAt":"2024-09-14T23:10:38.719Z","direccion":"5705, Jacques Cazotte, Jardín del Este, Vitacura, Provincia de Santiago, Región Metropolitana de Santiago, 7640639, Chile","comentario":null}},{"id":455,"attributes":{"latitud":-33.39,"longitud":-70.5,"nombre":"Inversión Vida Parque SA","propietario":"Municipalidad de las Condes","comuna":"Las Condes","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:10:42.211Z","updatedAt":"2024-09-14T23:10:42.211Z","publishedAt":"2024-09-14T23:10:42.209Z","direccion":"1800, Camino San Francisco de Asís, Barrio Génova, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7610685, Chile","comentario":null}},{"id":456,"attributes":{"latitud":-33.39,"longitud":-70.57,"nombre":"Clínica Alemana Vitacura 2","propietario":"CLINICA ALEMANA SANTIAGO S.A","comuna":"Vitacura","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:10:45.727Z","updatedAt":"2024-09-14T23:10:45.727Z","publishedAt":"2024-09-14T23:10:45.724Z","direccion":"6385, Avenida Vitacura, Vitacura, Provincia de Santiago, Región Metropolitana de Santiago, 7640639, Chile","comentario":null}},{"id":457,"attributes":{"latitud":-33.39,"longitud":-70.62,"nombre":"Smarcity, Ciudad Empresarial","propietario":"Enel distribución Chile SA","comuna":"Huechuraba","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:10:49.524Z","updatedAt":"2024-09-14T23:10:49.524Z","publishedAt":"2024-09-14T23:10:49.521Z","direccion":"Farmacias Ahumada, Avenida del Parque, Ciudad Empresarial, Huechuraba, Provincia de Santiago, Región Metropolitana de Santiago, 8581150, Chile","comentario":null}},{"id":458,"attributes":{"latitud":-33.38,"longitud":-70.57,"nombre":"C E. Voltex Luis Pasteur esq. Eduardo Acevedo","propietario":"CORPORACION DE DESARROLLO TERR","comuna":"Vitacura","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:10:53.259Z","updatedAt":"2024-09-14T23:10:53.259Z","publishedAt":"2024-09-14T23:10:53.258Z","direccion":"Colegio El Carmen Teresiano I, 6700, Avenida Luis Pasteur, Santa María de Manquehue, Vitacura, Provincia de Santiago, Región Metropolitana de Santiago, 7640165, Chile","comentario":null}},{"id":459,"attributes":{"latitud":-33.38,"longitud":-70.59,"nombre":"Tanica Poniente","propietario":"CBRE Chile S.A.","comuna":"Vitacura","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:10:56.882Z","updatedAt":"2024-09-14T23:10:56.882Z","publishedAt":"2024-09-14T23:10:56.875Z","direccion":"Club de Polo y Equitación San Cristóbal, Avenida Santa María Lateral, Vitacura, Provincia de Santiago, Región Metropolitana de Santiago, 7640639, Chile","comentario":null}},{"id":460,"attributes":{"latitud":-33.38,"longitud":-70.58,"nombre":"Tanica  Oriente","propietario":"Inmobiliaria Business Park Ltd","comuna":"Vitacura","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:11:00.430Z","updatedAt":"2024-09-14T23:11:00.430Z","publishedAt":"2024-09-14T23:11:00.424Z","direccion":"Aeródromo Municipal de Vitacura, Costanera Sur San Josemaría Escrivá de Balaguer, Vitacura, Provincia de Santiago, Región Metropolitana de Santiago, 7640639, Chile","comentario":null}},{"id":461,"attributes":{"latitud":-33.37,"longitud":-70.63,"nombre":"CENTRO EDUCACIONAL HUECHURABA","propietario":"COMPAÑIA DE PETROLEOS DE CHIL","comuna":"Huechuraba","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:11:04.133Z","updatedAt":"2024-09-14T23:11:04.133Z","publishedAt":"2024-09-14T23:11:04.129Z","direccion":"Jorge Inostroza, Villa Conchalí, Huechuraba, Provincia de Santiago, Región Metropolitana de Santiago, 9362427, Chile","comentario":null}},{"id":462,"attributes":{"latitud":-33.37,"longitud":-70.66,"nombre":"SAVE MOVICENTER","propietario":"INV. E INMOB. EL ROSAL S.A.","comuna":"Huechuraba","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:11:07.768Z","updatedAt":"2024-09-14T23:11:07.768Z","publishedAt":"2024-09-14T23:11:07.767Z","direccion":"Camino El Guanaco, Condominio Punta Ciruelos, Huechuraba, Provincia de Santiago, Región Metropolitana de Santiago, 8580000, Chile","comentario":null}},{"id":463,"attributes":{"latitud":-33.37,"longitud":-70.72,"nombre":"Cargador Eléctrico Plaza Recsa","propietario":"CORPORACION DE DESARROLLO TERR","comuna":"Quilicura","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:11:11.314Z","updatedAt":"2024-09-14T23:11:11.314Z","publishedAt":"2024-09-14T23:11:11.311Z","direccion":"Colegio San Alberto Hurtado, 1120, Ramón Rosales, Villa Esmeralda, Quilicura, Provincia de Santiago, Región Metropolitana de Santiago, 8700000, Chile","comentario":null}},{"id":464,"attributes":{"latitud":-33.37,"longitud":-70.52,"nombre":"Autoplanet Lo Barnechea","propietario":"Sociedad comercializadora","comuna":"Lo Barnechea","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:11:14.743Z","updatedAt":"2024-09-14T23:11:14.743Z","publishedAt":"2024-09-14T23:11:14.742Z","direccion":"Autopista Costanera Norte, Vitacura, Provincia de Santiago, Región Metropolitana de Santiago, 7710171, Chile","comentario":null}},{"id":465,"attributes":{"latitud":-33.36,"longitud":-70.51,"nombre":"Autoplanet Lo Barnechea 2do","propietario":"Sociedad comercializadora","comuna":"Lo Barnechea","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:11:18.413Z","updatedAt":"2024-09-14T23:11:18.413Z","publishedAt":"2024-09-14T23:11:18.411Z","direccion":"María Roman Guerrero, Villa La Ponderosa, Lo Barnechea, Provincia de Santiago, Región Metropolitana de Santiago, 7690286, Chile","comentario":null}},{"id":466,"attributes":{"latitud":-33.36,"longitud":-70.68,"nombre":"Duoc UC Huechuraba","propietario":"Fundacion IP DuocUc","comuna":"Huechuraba","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:11:22.077Z","updatedAt":"2024-09-14T23:11:22.077Z","publishedAt":"2024-09-14T23:11:22.074Z","direccion":"6699, El Sauce Sur, Casas del Alba, Huechuraba, Provincia de Santiago, Región Metropolitana de Santiago, 8600578, Chile","comentario":null}},{"id":467,"attributes":{"latitud":-33.36,"longitud":-70.54,"nombre":"Mall Los trapenses","propietario":"Chilena Consolidada Seguros de","comuna":"Lo Barnechea","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:11:25.740Z","updatedAt":"2024-09-14T23:11:25.740Z","publishedAt":"2024-09-14T23:11:25.738Z","direccion":"Avenida Felipe Cubillos Sigall, Condominio San Rafael 6, Lo Barnechea, Provincia de Santiago, Región Metropolitana de Santiago, 7630000, Chile","comentario":null}},{"id":468,"attributes":{"latitud":-33.36,"longitud":-70.71,"nombre":"Cargador Eléctrico Avenida Costanera Ferrea","propietario":"CORPORACION DE DESARROLLO TERR","comuna":"Quilicura","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:11:29.415Z","updatedAt":"2024-09-14T23:11:29.415Z","publishedAt":"2024-09-14T23:11:29.413Z","direccion":"Pasaje San Agustín, Barrio Sur, Quilicura, Provincia de Santiago, Región Metropolitana de Santiago, 8710022, Chile","comentario":null}},{"id":469,"attributes":{"latitud":-33.35,"longitud":-70.54,"nombre":"VOLTEX LOS TRAPENSES","propietario":"CIA DE PETROLEOS DE CHILE S.A.","comuna":"Lo Barnechea","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:11:33.083Z","updatedAt":"2024-09-14T23:11:33.083Z","publishedAt":"2024-09-14T23:11:33.082Z","direccion":"2641, El Arreo, Condominio Canto del Agua, Lo Barnechea, Provincia de Santiago, Región Metropolitana de Santiago, 7700651, Chile","comentario":null}},{"id":470,"attributes":{"latitud":-33.35,"longitud":-70.68,"nombre":"CLUB HOUSE","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"Huechuraba","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:11:36.736Z","updatedAt":"2024-09-14T23:11:36.736Z","publishedAt":"2024-09-14T23:11:36.733Z","direccion":"Condominio El Algarrobo, Jardines del Carmen 1, Huechuraba, Provincia de Santiago, Región Metropolitana de Santiago, 8600651, Chile","comentario":null}},{"id":471,"attributes":{"latitud":-33.34,"longitud":-70.54,"nombre":"Proyecto Cargadores VE Stripcenter Los Trapenses","propietario":"ENEL X","comuna":"Lo Barnechea","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:11:40.626Z","updatedAt":"2024-09-14T23:11:40.626Z","publishedAt":"2024-09-14T23:11:40.623Z","direccion":"Sendero del Parque, El Remanso de la Villa, Lo Barnechea, Provincia de Santiago, Región Metropolitana de Santiago, 7700651, Chile","comentario":null}},{"id":472,"attributes":{"latitud":-33.33,"longitud":-70.71,"nombre":"Cargador Eléctrico Calle San Ignacio","propietario":"CORPORACION DE DESARROLLO TERR","comuna":"Quilicura","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:11:44.132Z","updatedAt":"2024-09-14T23:11:44.132Z","publishedAt":"2024-09-14T23:11:44.129Z","direccion":"Chicago Pneumatic, El Totoral, Parque Industrial Buenaventura, Quilicura, Provincia de Santiago, Región Metropolitana de Santiago, 8710022, Chile","comentario":null}},{"id":473,"attributes":{"latitud":-33.29,"longitud":-70.87,"nombre":"Lampa","propietario":"CORPORACIÓN DE DESARROLLO TERR","comuna":"Lampa","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:11:47.567Z","updatedAt":"2024-09-14T23:11:47.567Z","publishedAt":"2024-09-14T23:11:47.566Z","direccion":"75, Pasaje Loma El Cordero, Villa Luis Durand, Lampa, Provincia de Chacabuco, Región Metropolitana de Santiago, Chile","comentario":null}},{"id":474,"attributes":{"latitud":-33.28,"longitud":-70.68,"nombre":"Enel X Way - Sodimac Chicureo","propietario":"SODIMAC S.A.","comuna":"Colina","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:11:51.188Z","updatedAt":"2024-09-14T23:11:51.188Z","publishedAt":"2024-09-14T23:11:51.186Z","direccion":"Los Ingleses, Chicureo II, Los Queltehues, Los Ingleses, Colina, Provincia de Chacabuco, Región Metropolitana de Santiago, 9340000, Chile","comentario":null}},{"id":475,"attributes":{"latitud":-33.26,"longitud":-70.65,"nombre":"SAVE - CONDOMINIO ÑIPA","propietario":"SINERGIA INMOBILIARIA S.A.","comuna":"Colina","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:11:54.846Z","updatedAt":"2024-09-14T23:11:54.846Z","publishedAt":"2024-09-14T23:11:54.844Z","direccion":"Avenida José Rabat, Cóndores, Chicureo, Colina, Provincia de Chacabuco, Región Metropolitana de Santiago, Chile","comentario":null}},{"id":476,"attributes":{"latitud":-33.2,"longitud":-70.68,"nombre":"CORPORACION MUNICIPAL DE DEPORTES DE COLINA","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"Colina","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:11:58.541Z","updatedAt":"2024-09-14T23:11:58.541Z","publishedAt":"2024-09-14T23:11:58.540Z","direccion":"Jardin Infantil Niñito Jesus de Praga, 671, Canela, Villa Los Agapantos, San Miguel, Colina, Provincia de Chacabuco, Región Metropolitana de Santiago, Chile","comentario":null}},{"id":477,"attributes":{"latitud":-33.09,"longitud":-71.4,"nombre":"CCTA Chilquinta Quilpué","propietario":"CHILQUINTA ENERGIA S.A","comuna":"ex-Quilpue","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:12:02.102Z","updatedAt":"2024-09-14T23:12:02.102Z","publishedAt":"2024-09-14T23:12:02.101Z","direccion":"Quilpué, Provincia de Marga Marga, Región de Valparaíso, 2430000, Chile","comentario":null}},{"id":478,"attributes":{"latitud":-33.09,"longitud":-70.93,"nombre":"Cargador Urbano Ignacio Carrera Pinto","propietario":"COMPANIA DE PETROLEOS DE CHILE","comuna":"Tiltil","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:12:05.552Z","updatedAt":"2024-09-14T23:12:05.552Z","publishedAt":"2024-09-14T23:12:05.549Z","direccion":"El Sauce, El Sauce Oriente, Tiltil, Provincia de Chacabuco, Región Metropolitana de Santiago, Chile","comentario":null}},{"id":479,"attributes":{"latitud":-33.08,"longitud":-70.93,"nombre":"Cargador Urbano Arturo Prat 234","propietario":"COMPANIA DE PETROLEOS DE CHILE","comuna":"Tiltil","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:12:09.340Z","updatedAt":"2024-09-14T23:12:09.340Z","publishedAt":"2024-09-14T23:12:09.339Z","direccion":"Colegio Basico Integrado Padre Pío, 426, O'Higgins, Villa La Dormida, Tiltil, Provincia de Chacabuco, Región Metropolitana de Santiago, Chile","comentario":null}},{"id":480,"attributes":{"latitud":-33.05,"longitud":-71.44,"nombre":"Oficina Chilquinta Quilpué","propietario":"CHILQUINTA ENERGIA S.A","comuna":"ex-Quilpue","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:12:12.931Z","updatedAt":"2024-09-14T23:12:12.931Z","publishedAt":"2024-09-14T23:12:12.928Z","direccion":"Colegio Saint Lawrence, 951, Covadonga, Los Eucaliptus, Quilpué, Provincia de Marga Marga, Región de Valparaíso, 2430590, Chile","comentario":null}},{"id":481,"attributes":{"latitud":-33.04,"longitud":-71.52,"nombre":"SAVE VOLTEX 40609 VIÑA DEL MAR","propietario":"COPEC S.A.","comuna":"Vina del Mar","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:12:16.424Z","updatedAt":"2024-09-14T23:12:16.424Z","publishedAt":"2024-09-14T23:12:16.422Z","direccion":"Autopista Troncal Sur, El Salto, Viña del Mar, Provincia de Valparaíso, Región de Valparaíso, 2562126, Chile","comentario":null}},{"id":482,"attributes":{"latitud":-33.04,"longitud":-71.52,"nombre":"Cargador Electrico Jumbo-Easy Vina del Mar","propietario":"CencoSud Shopping Centers S.A.","comuna":"Vina del Mar","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:12:19.972Z","updatedAt":"2024-10-08T15:49:07.247Z","publishedAt":"2024-09-14T23:12:19.969Z","direccion":"Autopista Troncal Sur, El Salto, Viña del Mar, Provincia de Valparaíso, Región de Valparaíso, 2562126, Chile","comentario":[{"user":"Current User","comment":"El cable del cargador está malo","rating":2,"date":"2024-10-08T15:49:06.836Z"}]}},{"id":483,"attributes":{"latitud":-33.02,"longitud":-71.53,"nombre":"UAI Viña Del Mar","propietario":"Universidad Adolfo Ibañez","comuna":"Vina del Mar","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:12:23.639Z","updatedAt":"2024-09-14T23:12:23.639Z","publishedAt":"2024-09-14T23:12:23.637Z","direccion":"Pasarela D-A, Villa Carlos Condell, Miraflores, Viña del Mar, Provincia de Valparaíso, Región de Valparaíso, 2520534, Chile","comentario":null}},{"id":484,"attributes":{"latitud":-33.01,"longitud":-71.55,"nombre":"BMW-VIÑA DEL MAR","propietario":"WILLIAMSON BALFOUR MOTORS","comuna":"Vina del Mar","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:12:27.158Z","updatedAt":"2024-09-14T23:12:27.158Z","publishedAt":"2024-09-14T23:12:27.154Z","direccion":"13 Norte, Viña del Mar, Provincia de Valparaíso, Región de Valparaíso, 2520707, Chile","comentario":null}},{"id":485,"attributes":{"latitud":-33.01,"longitud":-71.55,"nombre":"SAVE KIA ROSSELOT","propietario":"INVERSIONES OREGONIA S.A","comuna":"Vina del Mar","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:12:30.584Z","updatedAt":"2024-09-14T23:12:30.584Z","publishedAt":"2024-09-14T23:12:30.584Z","direccion":"13 Norte, Viña del Mar, Provincia de Valparaíso, Región de Valparaíso, 2520707, Chile","comentario":null}},{"id":486,"attributes":{"latitud":-32.95,"longitud":-71.54,"nombre":"COPEC VOLTEX EDS 40046 - AV EDMUNDO ELUCHANS 3100","propietario":"COMPAÑIA DE PETROLEOS DE CHILE","comuna":"Vina del Mar","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:12:34.039Z","updatedAt":"2024-09-14T23:12:34.039Z","publishedAt":"2024-09-14T23:12:34.035Z","direccion":"Mirador de Montemar, Concón, Provincia de Valparaíso, Región de Valparaíso, 2510513, Chile","comentario":null}},{"id":487,"attributes":{"latitud":-32.93,"longitud":-71.55,"nombre":"SAVE Edif. Entrelomas AV. Costa de Montemar #264","propietario":"Inmob. Edif. Entrelomas S.A.","comuna":"Concón","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:12:37.721Z","updatedAt":"2024-09-14T23:12:37.721Z","publishedAt":"2024-09-14T23:12:37.717Z","direccion":"Los Tamarindos, Costa Brava, Concón, Provincia de Valparaíso, Región de Valparaíso, 2511462, Chile","comentario":null}},{"id":488,"attributes":{"latitud":-32.93,"longitud":-70.68,"nombre":"Casino Enjoy Los Andes","propietario":"Casino Rinconada SA","comuna":"Los Andes","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:12:41.193Z","updatedAt":"2024-09-14T23:12:41.193Z","publishedAt":"2024-09-14T23:12:41.191Z","direccion":"Casino Enjoy, Rinconada, Provincia de Los Andes, Región de Valparaíso, Chile","comentario":null}},{"id":489,"attributes":{"latitud":-32.83,"longitud":-70.6,"nombre":"Oficina Chilquinta Los Andes","propietario":"CHILQUINTA ENERGIA S.A","comuna":"Los Andes","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:12:44.691Z","updatedAt":"2024-09-14T23:12:44.691Z","publishedAt":"2024-09-14T23:12:44.688Z","direccion":"Yerbas Buenas, Villa Marisol, Los Andes, Provincia de Los Andes, Región de Valparaíso, 2100000, Chile","comentario":null}},{"id":490,"attributes":{"latitud":-32.55,"longitud":-71.46,"nombre":"Cargador Elèctrico Copec Zapallar","propietario":"COPEC S.A.","comuna":"Zapallar","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:12:48.294Z","updatedAt":"2024-09-14T23:12:48.294Z","publishedAt":"2024-09-14T23:12:48.287Z","direccion":"Estacionamiento Playa Zapallar, Avenida La Playa, Zapallar, Provincia de Petorca, Región de Valparaíso, Chile","comentario":null}},{"id":491,"attributes":{"latitud":-29.97,"longitud":-71.32,"nombre":"Enel X Way - Sodimac Coquimbo","propietario":"SOCIEDAD DE RENTAS FALABELLA S","comuna":"La Serena","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:12:51.998Z","updatedAt":"2024-09-14T23:12:51.998Z","publishedAt":"2024-09-14T23:12:51.996Z","direccion":"Grecia, Las Encinas, San Juan, Coquimbo, Provincia de Elqui, Región de Coquimbo, 1790437, Chile","comentario":null}},{"id":492,"attributes":{"latitud":-29.93,"longitud":-71.26,"nombre":"Enel X Way - Sodimac La Serena","propietario":"METLIFE CHILE SEGUROS DE VIDA","comuna":"La Serena","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:12:55.529Z","updatedAt":"2024-09-14T23:12:55.529Z","publishedAt":"2024-09-14T23:12:55.524Z","direccion":"Moquehua, Población Víctor Domingo Silva, La Pampa, La Serena, Provincia de Elqui, Región de Coquimbo, 1710368, Chile","comentario":null}},{"id":493,"attributes":{"latitud":-27.41,"longitud":-70.29,"nombre":"CARGADOR EESS SHELL COPIAPO COPAYAPU 5329 IRVE","propietario":"Empresa Nacional de Energia En","comuna":"Copiapó","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:12:58.977Z","updatedAt":"2024-09-14T23:12:58.977Z","publishedAt":"2024-09-14T23:12:58.975Z","direccion":"Avenida Copayapu, Villa Iglesia Punta Negra, Paipote, Copiapó, Provincia de Copiapó, Región de Atacama, 1535590, Chile","comentario":null}},{"id":494,"attributes":{"latitud":-27.4,"longitud":-70.29,"nombre":"Enel X Way - Sodimac Copiapo","propietario":"LV Patio Renta Inmobiliaria VI","comuna":"Copiapó","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:13:02.854Z","updatedAt":"2024-09-14T23:13:02.854Z","publishedAt":"2024-09-14T23:13:02.853Z","direccion":"Guillermo Toro, Punta Negra, San Fernando, Copiapó, Provincia de Copiapó, Región de Atacama, 1535590, Chile","comentario":null}},{"id":495,"attributes":{"latitud":-27.02,"longitud":-69.9,"nombre":"Luz Del Norte","propietario":"Parque Solar Fotovoltaico Luz","comuna":"Copiapó","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:13:06.501Z","updatedAt":"2024-09-14T23:13:06.501Z","publishedAt":"2024-09-14T23:13:06.500Z","direccion":"Ruta C-17, Inca de Oro, Copiapó, Provincia de Copiapó, Región de Atacama, Chile","comentario":null}},{"id":496,"attributes":{"latitud":-23.49,"longitud":-70.19,"nombre":"SAVE VOLTEX  EDS COPEC SIERRA GORDA","propietario":"COPEC S.A.","comuna":"Sierra Gorda","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:13:10.049Z","updatedAt":"2024-09-14T23:13:10.049Z","publishedAt":"2024-09-14T23:13:10.044Z","direccion":"Ruta 5 Norte, Antofagasta, Provincia de Antofagasta, Región de Antofagasta, Chile","comentario":null}},{"id":497,"attributes":{"latitud":-22.46,"longitud":-68.91,"nombre":"SAVE - HOTEL AGUAS DEL DESIERTO","propietario":"Inversiones Topater SA","comuna":"Calama","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:13:13.543Z","updatedAt":"2024-09-14T23:13:13.543Z","publishedAt":"2024-09-14T23:13:13.541Z","direccion":"Calama, Provincia de El Loa, Región de Antofagasta, 1395584, Chile","comentario":null}},{"id":498,"attributes":{"latitud":-20.23,"longitud":-70.14,"nombre":"Enel X - Mc Donald Iquique","propietario":"Arcos Dorados Restaurantes Chi","comuna":"Iquique","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:13:18.780Z","updatedAt":"2024-09-14T23:13:18.780Z","publishedAt":"2024-09-14T23:13:18.773Z","direccion":"Cabo Gerardo Rebolledo, Iquique, Provincia de Iquique, Región de Tarapacá, 1100000, Chile","comentario":null}},{"id":499,"attributes":{"latitud":-20.22,"longitud":-70.13,"nombre":"ELECTROLINERA SHELL, OHIGGINS 2280, IQUIQUE, TARAP","propietario":"Empresa Nacional de Energia En","comuna":"Iquique","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:13:22.502Z","updatedAt":"2024-09-14T23:13:22.502Z","publishedAt":"2024-09-14T23:13:22.500Z","direccion":"Camino de la Cruz de Iquique, Condominio 4 Reinas II, Iquique, Provincia de Iquique, Región de Tarapacá, 1100026, Chile","comentario":null}},{"id":500,"attributes":{"latitud":-20.21,"longitud":-70.14,"nombre":"Mall ZOFRI","propietario":"CGE S.A.","comuna":"Iquique","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:13:26.018Z","updatedAt":"2024-09-14T23:13:26.018Z","publishedAt":"2024-09-14T23:13:26.018Z","direccion":"Moisés González, Población Jorge Inostroza, Iquique, Provincia de Iquique, Región de Tarapacá, 1100026, Chile","comentario":null}},{"id":501,"attributes":{"latitud":-18.49,"longitud":-70.29,"nombre":"IRVE SHELL,  ARICA,  MANUEL CASTILLO IBACETA 2920","propietario":"Empresa Nacional de Energia En","comuna":"Arica","T1":0,"T2":0,"T2SC":1,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:13:29.488Z","updatedAt":"2024-09-14T23:13:29.488Z","publishedAt":"2024-09-14T23:13:29.484Z","direccion":"18 Septiembre, Arica, Provincia de Arica, Región de Arica y Parinacota, 1001110, Chile","comentario":null}},{"id":502,"attributes":{"latitud":-18.46,"longitud":-70.3,"nombre":"Electrolinera Arica","propietario":"CGE S.A.","comuna":"Arica","T1":0,"T2":0,"T2SC":1,"CCST2":0,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:13:33.067Z","updatedAt":"2024-09-14T23:13:33.067Z","publishedAt":"2024-09-14T23:13:33.064Z","direccion":"Avenida España, Condominio San Marcos, Chinchorro, Arica, Provincia de Arica, Región de Arica y Parinacota, 1020759, Chile","comentario":null}},{"id":503,"attributes":{"latitud":-33.39,"longitud":-70.57,"nombre":"Enel x - Tottus Gerónimo de Alderete (Vitacura)","propietario":"HIPERMERCADOS TOTTUS SA","comuna":"Vitacura","T1":0,"T2":0,"T2SC":0,"CCST2":2,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:13:36.618Z","updatedAt":"2024-09-14T23:13:36.618Z","publishedAt":"2024-09-14T23:13:36.617Z","direccion":"6385, Avenida Vitacura, Vitacura, Provincia de Santiago, Región Metropolitana de Santiago, 7640639, Chile","comentario":null}},{"id":504,"attributes":{"latitud":-33.38,"longitud":-70.55,"nombre":"Enel X Way - Tottus Padre Hurtado","propietario":"HIPERMERCADOS TOTTUS SA","comuna":"Vitacura","T1":0,"T2":0,"T2SC":0,"CCST2":2,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:13:40.130Z","updatedAt":"2024-09-14T23:13:40.130Z","publishedAt":"2024-09-14T23:13:40.126Z","direccion":"Colegio De Los Sagrados Corazones, 2215, Leo, Vitacura, Provincia de Santiago, Región Metropolitana de Santiago, 7650191, Chile","comentario":null}},{"id":505,"attributes":{"latitud":-33.45,"longitud":-70.65,"nombre":"Enel x way - Tottus Nataniel Cox (Santiago)","propietario":"HIPERMERCADOS TOTTUS SA","comuna":"Santiago","T1":0,"T2":0,"T2SC":0,"CCST2":2,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:13:43.618Z","updatedAt":"2024-09-14T23:13:43.618Z","publishedAt":"2024-09-14T23:13:43.614Z","direccion":"1067, Cóndor, Barrio San Diego, Santiago, Provincia de Santiago, Región Metropolitana de Santiago, 8330444, Chile","comentario":null}},{"id":506,"attributes":{"latitud":-33.44,"longitud":-70.66,"nombre":"IRVE Tottus Catedral","propietario":"Hipermercados Tottus S.A","comuna":"Santiago","T1":0,"T2":0,"T2SC":0,"CCST2":2,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:13:47.351Z","updatedAt":"2024-09-14T23:13:47.351Z","publishedAt":"2024-09-14T23:13:47.346Z","direccion":"Autopista Central, Barrio Santa Ana, Santiago, Provincia de Santiago, Región Metropolitana de Santiago, 8340491, Chile","comentario":null}},{"id":507,"attributes":{"latitud":-36.8,"longitud":-73.07,"nombre":"SAVE HIPER LIDER BIOBIO-COLBUN","propietario":"WALMART CHILE S.A.","comuna":"Talcahuano","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:13:50.851Z","updatedAt":"2024-09-14T23:13:50.851Z","publishedAt":"2024-09-14T23:13:50.848Z","direccion":"Clínica Andes Salud Concepción, 2047, Avenida Jorge Alessandri, Hualpén, Provincia de Concepción, Región del Biobío, 4061735, Chile","comentario":null}},{"id":508,"attributes":{"latitud":-33.68,"longitud":-71.21,"nombre":"IRVE Espacio Urbano Melipilla","propietario":"SOCIEDAD ADMINISTRADORA DE CEN","comuna":"Melipilla","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:13:54.340Z","updatedAt":"2024-09-14T23:13:54.340Z","publishedAt":"2024-09-14T23:13:54.338Z","direccion":"Papa John's, Vicuña Mackenna, Los Chacabucanos, Melipilla, Provincia de Melipilla, Región Metropolitana de Santiago, 9580887, Chile","comentario":null}},{"id":509,"attributes":{"latitud":-33.6,"longitud":-70.58,"nombre":"Enel X  Way Privado- ESPACIO URBANO PTE ALTO","propietario":"SOC. ADM. CENTROS COMERCIALES","comuna":"Puente Alto","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:13:58.013Z","updatedAt":"2024-09-14T23:13:58.013Z","publishedAt":"2024-09-14T23:13:58.012Z","direccion":"Los Ingleses Oriente, Barrio Ingles, Puente Alto, Provincia de Cordillera, Región Metropolitana de Santiago, 8151746, Chile","comentario":null}},{"id":510,"attributes":{"latitud":-33.54,"longitud":-70.67,"nombre":"IRVE Tottus La Cisterna","propietario":"Hipermercados Tottus  SA","comuna":"La Cisterna","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:14:01.568Z","updatedAt":"2024-09-14T23:14:01.568Z","publishedAt":"2024-09-14T23:14:01.563Z","direccion":"Inés Rivas, Tucumán, La Cisterna, Provincia de Santiago, Región Metropolitana de Santiago, 8000146, Chile","comentario":null}},{"id":511,"attributes":{"latitud":-33.53,"longitud":-70.55,"nombre":"Express Lider Rojas Magallanes","propietario":"WALMART CHILE S.A","comuna":"La Florida","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:14:05.373Z","updatedAt":"2024-09-14T23:14:05.373Z","publishedAt":"2024-09-14T23:14:05.366Z","direccion":"Avenida Central, La Florida, Provincia de Santiago, Región Metropolitana de Santiago, 8290879, Chile","comentario":null}},{"id":512,"attributes":{"latitud":-33.51,"longitud":-70.66,"nombre":"Enel X Way - CARGADOR ESPACIO URBANO SAN MIGUEL","propietario":"SOCIEDAD ADMINISTRADORA","comuna":"San Miguel","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:14:09.081Z","updatedAt":"2024-09-14T23:14:09.081Z","publishedAt":"2024-09-14T23:14:09.077Z","direccion":"6123, Primera Transversal, Barrio Atacama, San Miguel, Provincia de Santiago, Región Metropolitana de Santiago, 8920099, Chile","comentario":null}},{"id":513,"attributes":{"latitud":-33.51,"longitud":-70.76,"nombre":"IRVE Espacio Urbano Maipú","propietario":"SOCIEDAD ADMINISTRADORA DE CEN","comuna":"Maipú","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:14:12.587Z","updatedAt":"2024-09-14T23:14:12.587Z","publishedAt":"2024-09-14T23:14:12.585Z","direccion":"Manuel Rodríguez, Barrio Maipú Centro, Maipú, Provincia de Santiago, Región Metropolitana de Santiago, 9251602, Chile","comentario":null}},{"id":514,"attributes":{"latitud":-33.46,"longitud":-70.71,"nombre":"IRVE Espacio Urbano Las Rejas","propietario":"SOCIEDAD ADMINISTRADORA DE CEN","comuna":"Estación Central","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:14:16.011Z","updatedAt":"2024-09-14T23:14:16.011Z","publishedAt":"2024-09-14T23:14:16.007Z","direccion":"111, Las Catalpas Poniente, Villa O'Higgins, Estación Central, Provincia de Santiago, Región Metropolitana de Santiago, 9190847, Chile","comentario":null}},{"id":515,"attributes":{"latitud":-33.45,"longitud":-70.6,"nombre":"SAVE LIDER IRARRAZAVAL","propietario":"WALMART CHILE SA","comuna":"Nunoa","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:14:19.528Z","updatedAt":"2024-09-14T23:14:19.528Z","publishedAt":"2024-09-14T23:14:19.525Z","direccion":"2885, Simón Bolívar, Barrio Villaseca, Ñuñoa, Provincia de Santiago, Región Metropolitana de Santiago, 7750000, Chile","comentario":null}},{"id":516,"attributes":{"latitud":-33.45,"longitud":-70.63,"nombre":"SAVE EXPRESS SANTA ISABEL","propietario":"WALMART CHILE SA","comuna":"Providencia","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:14:22.995Z","updatedAt":"2024-09-14T23:14:22.995Z","publishedAt":"2024-09-14T23:14:22.994Z","direccion":"Juan Godoy, Barrio Italia, Ñuñoa, Provincia de Santiago, Región Metropolitana de Santiago, 7770613, Chile","comentario":null}},{"id":517,"attributes":{"latitud":-33.44,"longitud":-70.54,"nombre":"SAVE SUPERM.LIDER PRINCIPE DE GALES WALMART-COLBUN","propietario":"WALMART CHILE S.A.","comuna":"La Reina","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:14:26.569Z","updatedAt":"2024-09-14T23:14:26.569Z","publishedAt":"2024-09-14T23:14:26.566Z","direccion":"Pasaje Príncipe de Gales, La Reina, Provincia de Santiago, Región Metropolitana de Santiago, 7860379, Chile","comentario":null}},{"id":518,"attributes":{"latitud":-33.42,"longitud":-70.54,"nombre":"IRVE Strip Center Padre Hurtado","propietario":"SOCIEDAD ADMINISTRADORA DE CEN","comuna":"Las Condes","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:14:30.180Z","updatedAt":"2024-09-14T23:14:30.180Z","publishedAt":"2024-09-14T23:14:30.177Z","direccion":"1260, Visviri, Colón Oriente, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7570936, Chile","comentario":null}},{"id":519,"attributes":{"latitud":-33.42,"longitud":-70.66,"nombre":"Enel X Way - Tottus Vivaceta","propietario":"HIPERMERCADOS TOTTUS SA","comuna":"Independencia","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:14:33.699Z","updatedAt":"2024-09-14T23:14:33.699Z","publishedAt":"2024-09-14T23:14:33.698Z","direccion":"972, Leonor Cepeda, Barrio Carrión, Independencia, Provincia de Santiago, Región Metropolitana de Santiago, 8380552, Chile","comentario":null}},{"id":520,"attributes":{"latitud":-33.39,"longitud":-70.57,"nombre":"SAVE SUPERM.LIDER BUENAVENTURA WALMART-COLBUN","propietario":"WALMART CHILE S.A.","comuna":"Vitacura","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:14:37.262Z","updatedAt":"2024-09-14T23:14:37.262Z","publishedAt":"2024-09-14T23:14:37.260Z","direccion":"6385, Avenida Vitacura, Vitacura, Provincia de Santiago, Región Metropolitana de Santiago, 7640639, Chile","comentario":null}},{"id":521,"attributes":{"latitud":-33.38,"longitud":-70.53,"nombre":"COPEC Costanera Norte E0","propietario":"COMPANIAS DE PETROLEOS DE CHIL","comuna":"Vitacura","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:14:42.459Z","updatedAt":"2024-09-14T23:14:42.459Z","publishedAt":"2024-09-14T23:14:42.453Z","direccion":"Sodimac, 11049, Avenida Las Condes, Estoril, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7630000, Chile","comentario":null}},{"id":522,"attributes":{"latitud":-33.37,"longitud":-70.51,"nombre":"SAVE SUPERM.LIDER PUENTE NUEVO WALMART-COLBUN","propietario":"WALMART CHILE S.A.","comuna":"Lo Barnechea","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:14:46.280Z","updatedAt":"2024-09-14T23:14:46.280Z","publishedAt":"2024-09-14T23:14:46.277Z","direccion":"13200, Avenida Las Condes, La Ermita, Lo Barnechea, Provincia de Santiago, Región Metropolitana de Santiago, 7710414, Chile","comentario":null}},{"id":523,"attributes":{"latitud":-33.35,"longitud":-70.52,"nombre":"Enel X Way - Espacio Urbano La Dehesa","propietario":"Sociedad admin C de comercios","comuna":"Lo Barnechea","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:14:50.719Z","updatedAt":"2024-09-14T23:14:50.719Z","publishedAt":"2024-09-14T23:14:50.714Z","direccion":"2340, Avenida La Dehesa, La Dehesa, Lo Barnechea, Provincia de Santiago, Región Metropolitana de Santiago, 7690286, Chile","comentario":null}},{"id":524,"attributes":{"latitud":-33.32,"longitud":-70.54,"nombre":"SAVE supermercado Lider Pie Andino","propietario":"WALMART CHILE S.A.","comuna":"Lo Barnechea","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:14:54.337Z","updatedAt":"2024-09-14T23:14:54.337Z","publishedAt":"2024-09-14T23:14:54.335Z","direccion":"Paseo del Águila, Condominio Las Veranadas, Lo Barnechea, Provincia de Santiago, Región Metropolitana de Santiago, 7700651, Chile","comentario":null}},{"id":525,"attributes":{"latitud":-33.28,"longitud":-70.63,"nombre":"Enel X Way - Espacio Urbano La Laguna","propietario":"Sociedad admin C de comercios","comuna":"Colina","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:14:57.868Z","updatedAt":"2024-09-14T23:14:57.868Z","publishedAt":"2024-09-14T23:14:57.865Z","direccion":"Avenida Chicureo, Piedra Roja, Chicureo, Colina, Provincia de Chacabuco, Región Metropolitana de Santiago, Chile","comentario":null}},{"id":526,"attributes":{"latitud":-33.01,"longitud":-71.54,"nombre":"Enel X Way - Espacio Urbano Viña del Mar","propietario":"Sociedad admin C de comercios","comuna":"Vina del Mar","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:15:01.395Z","updatedAt":"2024-09-14T23:15:01.395Z","publishedAt":"2024-09-14T23:15:01.394Z","direccion":"Quillota, Santa Inés, Viña del Mar, Provincia de Valparaíso, Región de Valparaíso, 2520977, Chile","comentario":null}},{"id":527,"attributes":{"latitud":-32.84,"longitud":-70.61,"nombre":"Enel X - Espacio Urbano Los Andes","propietario":"Sociedad admin C de comercios","comuna":"Los Andes","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:15:04.837Z","updatedAt":"2024-09-14T23:15:04.837Z","publishedAt":"2024-09-14T23:15:04.836Z","direccion":"Profesora Eliana Espinoza, Villa Sor Teresa, Los Andes, Provincia de Los Andes, Región de Valparaíso, 2100000, Chile","comentario":null}},{"id":528,"attributes":{"latitud":-32.8,"longitud":-71.16,"nombre":"ENEX SHELL HIJUELAS","propietario":"ENEX S.A","comuna":"Hijuelas","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:15:08.410Z","updatedAt":"2024-09-14T23:15:08.410Z","publishedAt":"2024-09-14T23:15:08.403Z","direccion":"Caletera Ruta 5, Calle Chépica, Hijuelas, Provincia de Quillota, Región de Valparaíso, 2290000, Chile","comentario":null}},{"id":529,"attributes":{"latitud":-29.94,"longitud":-71.24,"nombre":"SAVE HIPER LIDER LA SERENA-COLBUN","propietario":"WALMART CHILE S.A.","comuna":"La Serena","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:15:12.276Z","updatedAt":"2024-09-14T23:15:12.276Z","publishedAt":"2024-09-14T23:15:12.274Z","direccion":"Guillermo Ulriksen, Valle del Cerro Grande, El Milagro, La Serena, Provincia de Elqui, Región de Coquimbo, 1721664, Chile","comentario":null}},{"id":530,"attributes":{"latitud":-23.64,"longitud":-70.4,"nombre":"Enel X WAY - Espacio Urbano Antofagasta","propietario":"Sociedad admin C de comercios","comuna":"Antofagasta","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":1,"GBTDC":0,"createdAt":"2024-09-14T23:15:15.807Z","updatedAt":"2024-09-14T23:15:15.807Z","publishedAt":"2024-09-14T23:15:15.802Z","direccion":"Hotel Marina de Antofagasta, Antofagasta, Provincia de Antofagasta, Región de Antofagasta, 1271572, Chile","comentario":null}},{"id":531,"attributes":{"latitud":-53.13,"longitud":-70.91,"nombre":"Enel X Way - Espacio Urbano Punta Arenas","propietario":"Sociedad admin C de comercios","comuna":"Punta Arenas","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:15:19.210Z","updatedAt":"2024-09-14T23:15:19.210Z","publishedAt":"2024-09-14T23:15:19.207Z","direccion":"Mall Espacio Urbano Pionero, 1110, Avenida Presidente Eduardo Frei Montalva, Cataratas del Niágara, Punta Arenas, Provincia de Magallanes, Región de Magallanes y de la Antártica Chilena, 6210314, Chile","comentario":null}},{"id":532,"attributes":{"latitud":-41.45,"longitud":-72.92,"nombre":"Enel X Way - Espacio Urbano Puerto Montt","propietario":"Enel Mobility Chile SPA","comuna":"Puerto Montt","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:15:22.821Z","updatedAt":"2024-09-14T23:15:22.821Z","publishedAt":"2024-09-14T23:15:22.819Z","direccion":"Colegio Pumahue, Volcán Puntiagudo, Lancuyén, Puerto Montt, Provincia de Llanquihue, Región de Los Lagos, 5507138, Chile","comentario":null}},{"id":533,"attributes":{"latitud":-35.84,"longitud":-71.61,"nombre":"Enel X Way - Espacio Urbano Linares","propietario":"Sociedad admin C de comercios","comuna":"Linares","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:15:26.327Z","updatedAt":"2024-09-14T23:15:26.327Z","publishedAt":"2024-09-14T23:15:26.326Z","direccion":"Egeo, Frontera del Inca, Linares, Provincia de Linares, Región del Maule, 4300000, Chile","comentario":null}},{"id":534,"attributes":{"latitud":-34.18,"longitud":-70.7,"nombre":"IRVE Espacio Urbano Machalí","propietario":"SOCIEDAD ADMINISTRADORA DE CEN","comuna":"Machalí","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:15:29.795Z","updatedAt":"2024-09-14T23:15:29.795Z","publishedAt":"2024-09-14T23:15:29.794Z","direccion":"Pasaje Raymond Monvoisin, Villa María Lucía, Camino a Machalí, Machalí, Provincia de Cachapoal, Región del Libertador General Bernardo O'Higgins, 2910796, Chile","comentario":null}},{"id":535,"attributes":{"latitud":-33.42,"longitud":-70.54,"nombre":"Segundo Cargador Espacio Urbano Padre Hurtado","propietario":"SOCIEDAD ADMINISTRADORA DE CE","comuna":"Las Condes","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:15:33.240Z","updatedAt":"2024-09-14T23:15:33.240Z","publishedAt":"2024-09-14T23:15:33.236Z","direccion":"1260, Visviri, Colón Oriente, Las Condes, Provincia de Santiago, Región Metropolitana de Santiago, 7570936, Chile","comentario":null}},{"id":536,"attributes":{"latitud":-33.33,"longitud":-70.7,"nombre":"supercargador Tesla","propietario":"TODO ARAUCO","comuna":"Quilicura","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:15:36.625Z","updatedAt":"2024-09-14T23:15:36.625Z","publishedAt":"2024-09-14T23:15:36.625Z","direccion":"Caupolicán, Parque Industrial Arrigoni, Quilicura, Provincia de Santiago, Región Metropolitana de Santiago, 8710022, Chile","comentario":null}},{"id":537,"attributes":{"latitud":-33.24,"longitud":-70.35,"nombre":"Cargador estacionamiento Lo Castillo","propietario":"CONCESION ESTACIONAMIENTOS MUN","comuna":"Vitacura","T1":0,"T2":0,"T2SC":0,"CCST2":1,"CHADEMO":0,"GBTDC":0,"createdAt":"2024-09-14T23:15:40.108Z","updatedAt":"2024-09-14T23:15:40.108Z","publishedAt":"2024-09-14T23:15:40.105Z","direccion":"Lo Barnechea, Provincia de Santiago, Región Metropolitana de Santiago, Chile","comentario":null}}],"meta":{"pagination":{"page":1,"pageSize":1000,"pageCount":1,"total":445}}}
        console.log(response)
        
        //if (!response.ok) {throw new Error('No se pudo extraer la información de las localizaciones del Servidor');}
        
        // Convert response to JSON
        //const data = await response.json();
        const data = response;

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
        // const response = await fetch('http://localhost:1337/api/vehiculos');
        const response = {"data":[{"id":1,"attributes":{"marca":"Audi","modelo":"e-tron","capacidad":83.6,"autonomia":369,"createdAt":"2024-09-30T02:51:04.569Z","updatedAt":"2024-09-30T04:01:08.857Z","publishedAt":"2024-09-30T02:51:09.202Z","rendimiento":4.4,"T1":null,"T2":1,"T2SC":null,"GPTDC":null,"CHADEMO":null,"CCST2":1,"tipo":"Eléctrico Puro"}},{"id":2,"attributes":{"marca":"Audi","modelo":"RS e-tron GT","capacidad":83.7,"autonomia":435,"createdAt":"2024-10-11T15:20:56.085Z","updatedAt":"2024-10-11T15:21:36.527Z","publishedAt":"2024-10-11T15:20:59.587Z","rendimiento":5.2,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":3,"attributes":{"marca":"Baic","modelo":"EU5 EV SDN AT","capacidad":49.6,"autonomia":228,"createdAt":"2024-10-11T15:22:28.564Z","updatedAt":"2024-10-11T15:22:30.337Z","publishedAt":"2024-10-11T15:22:30.335Z","rendimiento":4.6,"T1":0,"T2":0,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":4,"attributes":{"marca":"BMW","modelo":"330e Iperformance 2,0 Lts. Sedán 4P. T/A Híbrido","capacidad":49,"autonomia":64,"createdAt":"2024-10-11T15:23:04.861Z","updatedAt":"2024-10-11T15:23:05.507Z","publishedAt":"2024-10-11T15:23:05.505Z","rendimiento":8.4,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":5,"attributes":{"marca":"BMW","modelo":"330e Sedán","capacidad":12,"autonomia":78,"createdAt":"2024-10-11T15:23:43.131Z","updatedAt":"2024-10-11T15:24:39.537Z","publishedAt":"2024-10-11T15:24:39.535Z","rendimiento":6.5,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":6,"attributes":{"marca":"BMW","modelo":"330e Sedán 2","capacidad":12,"autonomia":71,"createdAt":"2024-10-11T15:24:33.579Z","updatedAt":"2024-10-11T15:24:34.978Z","publishedAt":"2024-10-11T15:24:34.976Z","rendimiento":5.9,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":7,"attributes":{"marca":"BMW","modelo":"530e iPerformance 2,0 Lts. Sedán 4P. T/A Híbrido","capacidad":12,"autonomia":85,"createdAt":"2024-10-11T15:25:12.920Z","updatedAt":"2024-10-11T15:25:13.450Z","publishedAt":"2024-10-11T15:25:13.448Z","rendimiento":7.1,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":null,"tipo":"Híbrido con Recarga Exterior"}},{"id":8,"attributes":{"marca":"BMW","modelo":"530e Sedán","capacidad":12,"autonomia":68,"createdAt":"2024-10-11T15:25:30.970Z","updatedAt":"2024-10-11T15:25:55.716Z","publishedAt":"2024-10-11T15:25:55.715Z","rendimiento":5.7,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":9,"attributes":{"marca":"BMW","modelo":"740e iPerformance 2,0 Lts. Sedán 4P. T/A Híbrid","capacidad":11.7,"autonomia":93,"createdAt":"2024-10-11T15:26:28.174Z","updatedAt":"2024-10-11T15:26:28.961Z","publishedAt":"2024-10-11T15:26:28.958Z","rendimiento":7.9,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":10,"attributes":{"marca":"BMW","modelo":"740le iPerformance 2,0 Lts. Sedán 4P. T/A Híbrido 2","capacidad":11.7,"autonomia":93,"createdAt":"2024-10-11T15:27:19.571Z","updatedAt":"2024-10-11T15:27:20.068Z","publishedAt":"2024-10-11T15:27:20.065Z","rendimiento":7.9,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":11,"attributes":{"marca":"BMW","modelo":"745e Sedán","capacidad":12,"autonomia":68,"createdAt":"2024-10-11T15:29:24.327Z","updatedAt":"2024-10-11T15:29:25.384Z","publishedAt":"2024-10-11T15:29:25.378Z","rendimiento":5.7,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":12,"attributes":{"marca":"BMW","modelo":"745Le Sedán","capacidad":12,"autonomia":68,"createdAt":"2024-10-11T15:30:00.487Z","updatedAt":"2024-10-11T15:30:01.025Z","publishedAt":"2024-10-11T15:30:01.022Z","rendimiento":5.7,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":13,"attributes":{"marca":"BMW","modelo":"i3 120Ah","capacidad":42.3,"autonomia":309,"createdAt":"2024-10-11T15:30:33.111Z","updatedAt":"2024-10-11T15:30:33.586Z","publishedAt":"2024-10-11T15:30:33.585Z","rendimiento":7.3,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":14,"attributes":{"marca":"BMW","modelo":"i3 94Ah Hatchback 5P. T/A Motor Eléctrico","capacidad":32.9,"autonomia":250,"createdAt":"2024-10-11T15:31:00.745Z","updatedAt":"2024-10-11T15:31:01.343Z","publishedAt":"2024-10-11T15:31:01.342Z","rendimiento":7.6,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":15,"attributes":{"marca":"BMW","modelo":"I3s 120Ah","capacidad":42.3,"autonomia":309,"createdAt":"2024-10-11T15:31:26.567Z","updatedAt":"2024-10-11T15:31:27.435Z","publishedAt":"2024-10-11T15:31:27.433Z","rendimiento":7.3,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":16,"attributes":{"marca":"BMW","modelo":"i4 eDrive40 Gran Coupé","capacidad":84,"autonomia":529,"createdAt":"2024-10-11T15:31:57.216Z","updatedAt":"2024-10-11T15:31:57.787Z","publishedAt":"2024-10-11T15:31:57.786Z","rendimiento":6.3,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":17,"attributes":{"marca":"BMW","modelo":"I8 1,5 Lts. Coupé 3P. T/A 4x4 Híbrido","capacidad":11.6,"autonomia":193,"createdAt":"2024-10-11T15:32:29.887Z","updatedAt":"2024-10-11T15:32:30.409Z","publishedAt":"2024-10-11T15:32:30.407Z","rendimiento":16.6,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":18,"attributes":{"marca":"BMW","modelo":"I8 1,5 Lts. Roadster 3P. T/A 4x4 Híbrido 2","capacidad":11.6,"autonomia":193,"createdAt":"2024-10-11T15:33:11.139Z","updatedAt":"2024-10-11T15:33:11.680Z","publishedAt":"2024-10-11T15:33:11.677Z","rendimiento":16.6,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":19,"attributes":{"marca":"BMW","modelo":"i8 PHEV 1,5 Lts. DOHC Coupé 2P. T/A Motor Otto","capacidad":7.1,"autonomia":60,"createdAt":"2024-10-11T15:33:47.688Z","updatedAt":"2024-10-11T15:33:48.368Z","publishedAt":"2024-10-11T15:33:48.365Z","rendimiento":8.4,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":20,"attributes":{"marca":"BMW","modelo":"iX xDrive30","capacidad":66.5,"autonomia":412,"createdAt":"2024-10-11T15:34:17.748Z","updatedAt":"2024-10-11T15:34:18.332Z","publishedAt":"2024-10-11T15:34:18.331Z","rendimiento":6.2,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":21,"attributes":{"marca":"BMW","modelo":"iX3 M Station Wagon","capacidad":80,"autonomia":392,"createdAt":"2024-10-11T15:34:44.842Z","updatedAt":"2024-10-11T15:34:45.394Z","publishedAt":"2024-10-11T15:34:45.386Z","rendimiento":4.9,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":22,"attributes":{"marca":"BMW","modelo":"X1 xDrive25e","capacidad":16.3,"autonomia":90,"createdAt":"2024-10-11T15:35:15.446Z","updatedAt":"2024-10-11T15:35:16.001Z","publishedAt":"2024-10-11T15:35:15.999Z","rendimiento":5.5,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":23,"attributes":{"marca":"BMW","modelo":"X3 xDrive30e","capacidad":12,"autonomia":66,"createdAt":"2024-10-11T15:35:45.841Z","updatedAt":"2024-10-11T15:35:46.473Z","publishedAt":"2024-10-11T15:35:46.471Z","rendimiento":5.5,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":24,"attributes":{"marca":"BMW","modelo":"X5 xDrive40e iPerformance 2,0 Lts. Station Wagon","capacidad":9.2,"autonomia":60,"createdAt":"2024-10-11T15:36:13.662Z","updatedAt":"2024-10-11T15:36:14.132Z","publishedAt":"2024-10-11T15:36:14.130Z","rendimiento":6.5,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":25,"attributes":{"marca":"BMW","modelo":"X5 xDrive45e","capacidad":24.1,"autonomia":94,"createdAt":"2024-10-11T15:36:43.428Z","updatedAt":"2024-10-11T15:36:43.993Z","publishedAt":"2024-10-11T15:36:43.988Z","rendimiento":3.9,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":26,"attributes":{"marca":"BMW","modelo":"X5 xDrive50e M Sport LCI","capacidad":68.3,"autonomia":259,"createdAt":"2024-10-11T15:37:14.299Z","updatedAt":"2024-10-11T15:37:14.870Z","publishedAt":"2024-10-11T15:37:14.867Z","rendimiento":3.8,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":27,"attributes":{"marca":"BMW","modelo":"X5 xDrive50e xLine LCI","capacidad":68.3,"autonomia":259,"createdAt":"2024-10-11T15:37:40.010Z","updatedAt":"2024-10-11T15:37:40.570Z","publishedAt":"2024-10-11T15:37:40.565Z","rendimiento":3.8,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":28,"attributes":{"marca":"BMW","modelo":"Station Wagon","capacidad":29.5,"autonomia":97,"createdAt":"2024-10-11T15:38:26.807Z","updatedAt":"2024-10-11T15:38:27.481Z","publishedAt":"2024-10-11T15:38:27.477Z","rendimiento":3.3,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":29,"attributes":{"marca":"BYD","modelo":"BYD D1","capacidad":53.6,"autonomia":375,"createdAt":"2024-10-11T15:39:00.887Z","updatedAt":"2024-10-11T15:39:01.497Z","publishedAt":"2024-10-11T15:39:01.490Z","rendimiento":7,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":30,"attributes":{"marca":"BYD","modelo":"BYD M3","capacidad":50.3,"autonomia":231,"createdAt":"2024-10-11T15:39:29.789Z","updatedAt":"2024-10-11T15:39:30.412Z","publishedAt":"2024-10-11T15:39:30.411Z","rendimiento":4.6,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":31,"attributes":{"marca":"BYD","modelo":"BYD T3","capacidad":50.3,"autonomia":231,"createdAt":"2024-10-11T15:39:59.332Z","updatedAt":"2024-10-11T15:40:00.626Z","publishedAt":"2024-10-11T15:40:00.624Z","rendimiento":4.6,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":32,"attributes":{"marca":"BYD","modelo":"BYD Tang EV","capacidad":82.8,"autonomia":464,"createdAt":"2024-10-11T15:40:33.576Z","updatedAt":"2024-10-11T15:40:34.786Z","publishedAt":"2024-10-11T15:40:34.781Z","rendimiento":5.6,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":33,"attributes":{"marca":"BYD","modelo":"BYD Tang EV STE","capacidad":82.8,"autonomia":464,"createdAt":"2024-10-11T15:41:04.916Z","updatedAt":"2024-10-11T15:41:05.502Z","publishedAt":"2024-10-11T15:41:05.498Z","rendimiento":5.6,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":34,"attributes":{"marca":"BYD","modelo":"Dolphin","capacidad":44.9,"autonomia":301,"createdAt":"2024-10-11T15:41:34.149Z","updatedAt":"2024-10-11T15:41:34.885Z","publishedAt":"2024-10-11T15:41:34.879Z","rendimiento":6.7,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":35,"attributes":{"marca":"BYD","modelo":"e5 Sedán 4P. T/A Motor Eléctrico","capacidad":60.6,"autonomia":327,"createdAt":"2024-10-11T15:56:57.204Z","updatedAt":"2024-10-11T15:56:57.874Z","publishedAt":"2024-10-11T15:56:57.869Z","rendimiento":5.4,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":36,"attributes":{"marca":"BYD","modelo":"Han EV GS","capacidad":85.4,"autonomia":425,"createdAt":"2024-10-11T15:57:29.164Z","updatedAt":"2024-10-11T15:57:29.671Z","publishedAt":"2024-10-11T15:57:29.667Z","rendimiento":5,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":37,"attributes":{"marca":"BYD","modelo":"Qin Plus DM-i","capacidad":8.3,"autonomia":74,"createdAt":"2024-10-11T15:58:04.295Z","updatedAt":"2024-10-11T15:58:04.837Z","publishedAt":"2024-10-11T15:58:04.835Z","rendimiento":8.9,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":38,"attributes":{"marca":"BYD","modelo":"Song Plus DMI","capacidad":8.3,"autonomia":71,"createdAt":"2024-10-11T15:58:44.021Z","updatedAt":"2024-10-11T15:58:44.743Z","publishedAt":"2024-10-11T15:58:44.741Z","rendimiento":8.5,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":39,"attributes":{"marca":"BYD","modelo":"TANG EV","capacidad":86.4,"autonomia":363,"createdAt":"2024-10-11T15:59:15.102Z","updatedAt":"2024-10-11T15:59:15.680Z","publishedAt":"2024-10-11T15:59:15.678Z","rendimiento":4.2,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":40,"attributes":{"marca":"BYD","modelo":"Yuan Plus","capacidad":49.9,"autonomia":290,"createdAt":"2024-10-11T15:59:51.431Z","updatedAt":"2024-10-11T15:59:51.965Z","publishedAt":"2024-10-11T15:59:51.963Z","rendimiento":5.8,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":41,"attributes":{"marca":"BYD","modelo":"Yuan Plus GS","capacidad":150,"autonomia":870,"createdAt":"2024-10-11T16:00:32.574Z","updatedAt":"2024-10-11T16:00:33.055Z","publishedAt":"2024-10-11T16:00:33.051Z","rendimiento":5.8,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":42,"attributes":{"marca":"Chery","modelo":"Tiggo 8 Pro PHEV","capacidad":19.3,"autonomia":89,"createdAt":"2024-10-11T16:01:02.290Z","updatedAt":"2024-10-11T16:01:02.979Z","publishedAt":"2024-10-11T16:01:02.975Z","rendimiento":4.6,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":43,"attributes":{"marca":"Chevrolet","modelo":"Bolt EUV","capacidad":66,"autonomia":389,"createdAt":"2024-10-11T16:01:28.400Z","updatedAt":"2024-10-11T16:01:28.874Z","publishedAt":"2024-10-11T16:01:28.871Z","rendimiento":5.9,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":44,"attributes":{"marca":"Chevrolet","modelo":"Bolt EV 2","capacidad":60,"autonomia":359,"createdAt":"2024-10-11T16:02:15.678Z","updatedAt":"2024-10-11T16:02:16.229Z","publishedAt":"2024-10-11T16:02:16.226Z","rendimiento":6,"T1":1,"T2":0,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":45,"attributes":{"marca":"Citroen","modelo":"Berlingo Furgón 2P. T/A Motor Eléctrico","capacidad":22.5,"autonomia":131,"createdAt":"2024-10-11T16:02:49.481Z","updatedAt":"2024-10-11T16:02:49.962Z","publishedAt":"2024-10-11T16:02:49.959Z","rendimiento":5.8,"T1":0,"T2":0,"T2SC":0,"GPTDC":0,"CHADEMO":1,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":46,"attributes":{"marca":"Citroen","modelo":"E-Berlingo Electrico","capacidad":50,"autonomia":290,"createdAt":"2024-10-11T16:03:29.603Z","updatedAt":"2024-10-11T16:03:30.121Z","publishedAt":"2024-10-11T16:03:30.118Z","rendimiento":5.8,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":47,"attributes":{"marca":"DFLM","modelo":"S50EV","capacidad":59.6,"autonomia":290,"createdAt":"2024-10-11T16:04:00.640Z","updatedAt":"2024-10-11T16:04:01.184Z","publishedAt":"2024-10-11T16:04:01.179Z","rendimiento":5.1,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":48,"attributes":{"marca":"DFLM","modelo":"S50EVE","capacidad":59.6,"autonomia":290,"createdAt":"2024-10-11T16:04:30.746Z","updatedAt":"2024-10-11T16:04:31.224Z","publishedAt":"2024-10-11T16:04:31.222Z","rendimiento":5.1,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":49,"attributes":{"marca":"DFM","modelo":"Aeolus E70","capacidad":52.9,"autonomia":312,"createdAt":"2024-10-11T16:05:01.201Z","updatedAt":"2024-10-11T16:05:01.717Z","publishedAt":"2024-10-11T16:05:01.712Z","rendimiento":5.9,"T1":0,"T2":0,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":50,"attributes":{"marca":"DFSK","modelo":"EC35 Cargo Van","capacidad":38.7,"autonomia":159,"createdAt":"2024-10-11T16:05:28.466Z","updatedAt":"2024-10-11T16:05:28.973Z","publishedAt":"2024-10-11T16:05:28.970Z","rendimiento":4.1,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":51,"attributes":{"marca":"DFSK","modelo":"EC35 Cargo Van 2R","capacidad":38.7,"autonomia":159,"createdAt":"2024-10-11T16:05:54.488Z","updatedAt":"2024-10-11T16:06:01.396Z","publishedAt":"2024-10-11T16:06:01.394Z","rendimiento":4.1,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":52,"attributes":{"marca":"DFSK","modelo":"Seres E3","capacidad":53,"autonomia":233,"createdAt":"2024-10-18T17:49:39.238Z","updatedAt":"2024-10-18T17:50:24.815Z","publishedAt":"2024-10-18T17:50:24.813Z","rendimiento":4.4,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":53,"attributes":{"marca":"Dongfeng","modelo":"e-City MT3.5","capacidad":66.8,"autonomia":307,"createdAt":"2024-10-18T17:50:10.984Z","updatedAt":"2024-10-18T17:50:27.557Z","publishedAt":"2024-10-18T17:50:27.555Z","rendimiento":4.6,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":54,"attributes":{"marca":"Dongfeng","modelo":"e-City MT3.5 Furgon","capacidad":66.8,"autonomia":307,"createdAt":"2024-10-18T17:50:54.886Z","updatedAt":"2024-10-18T17:50:56.401Z","publishedAt":"2024-10-18T17:50:56.397Z","rendimiento":4.6,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":55,"attributes":{"marca":"Dongfeng","modelo":"e-Lite CV3","capacidad":41.9,"autonomia":226,"createdAt":"2024-10-18T17:51:21.934Z","updatedAt":"2024-10-18T17:51:23.846Z","publishedAt":"2024-10-18T17:51:23.843Z","rendimiento":5.4,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":56,"attributes":{"marca":"DS","modelo":"DS3 Crossback Electrico","capacidad":50,"autonomia":285,"createdAt":"2024-10-18T17:51:51.490Z","updatedAt":"2024-10-18T17:51:52.009Z","publishedAt":"2024-10-18T17:51:52.006Z","rendimiento":5.7,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":57,"attributes":{"marca":"DS","modelo":"DS7 Crossback 1.6 THP 4x4 Automático","capacidad":13.2,"autonomia":63,"createdAt":"2024-10-18T17:52:32.591Z","updatedAt":"2024-10-18T17:52:33.143Z","publishedAt":"2024-10-18T17:52:33.140Z","rendimiento":4.8,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":58,"attributes":{"marca":"Farizon","modelo":"E6 Furgón","capacidad":50.2,"autonomia":206,"createdAt":"2024-10-18T17:53:04.232Z","updatedAt":"2024-10-18T17:53:04.786Z","publishedAt":"2024-10-18T17:53:04.782Z","rendimiento":4.1,"T1":0,"T2":0,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":59,"attributes":{"marca":"Ferrari","modelo":"296 GTB","capacidad":7.5,"autonomia":54,"createdAt":"2024-10-18T17:53:41.380Z","updatedAt":"2024-10-18T17:53:49.450Z","publishedAt":"2024-10-18T17:53:49.443Z","rendimiento":7.2,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":60,"attributes":{"marca":"Ferrari","modelo":"296 GTS","capacidad":7.5,"autonomia":54,"createdAt":"2024-10-18T17:54:15.980Z","updatedAt":"2024-10-18T17:54:16.666Z","publishedAt":"2024-10-18T17:54:16.664Z","rendimiento":7.2,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":61,"attributes":{"marca":"Ferrari","modelo":"SF90 Spider","capacidad":7.9,"autonomia":85,"createdAt":"2024-10-18T17:54:45.967Z","updatedAt":"2024-10-18T17:54:46.626Z","publishedAt":"2024-10-18T17:54:46.622Z","rendimiento":10.8,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":62,"attributes":{"marca":"Ferrari","modelo":"SF90 Stradale Coupe","capacidad":7.9,"autonomia":85,"createdAt":"2024-10-18T17:55:10.254Z","updatedAt":"2024-10-18T17:55:10.821Z","publishedAt":"2024-10-18T17:55:10.791Z","rendimiento":10.8,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":63,"attributes":{"marca":"Fest","modelo":"E Box-M","capacidad":41.9,"autonomia":226,"createdAt":"2024-10-18T17:55:36.409Z","updatedAt":"2024-10-18T17:55:37.054Z","publishedAt":"2024-10-18T17:55:37.052Z","rendimiento":5.4,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":64,"attributes":{"marca":"Ford","modelo":"E-Transit","capacidad":75.7,"autonomia":303,"createdAt":"2024-10-18T17:56:06.569Z","updatedAt":"2024-10-18T17:56:07.200Z","publishedAt":"2024-10-18T17:56:07.199Z","rendimiento":4,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":65,"attributes":{"marca":"Geely","modelo":"Emgrand EV500","capacidad":50,"autonomia":255,"createdAt":"2024-10-18T17:56:45.886Z","updatedAt":"2024-10-18T17:56:46.301Z","publishedAt":"2024-10-18T17:56:46.299Z","rendimiento":5.1,"T1":0,"T2":0,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":66,"attributes":{"marca":"Geely","modelo":"Geometry C","capacidad":72.4,"autonomia":290,"createdAt":"2024-10-18T17:57:16.288Z","updatedAt":"2024-10-18T17:57:16.811Z","publishedAt":"2024-10-18T17:57:16.809Z","rendimiento":4,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":67,"attributes":{"marca":"Geely","modelo":"Geometry C GK","capacidad":54.9,"autonomia":230,"createdAt":"2024-10-18T17:57:50.125Z","updatedAt":"2024-10-18T17:57:51.978Z","publishedAt":"2024-10-18T17:57:51.974Z","rendimiento":4.2,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":68,"attributes":{"marca":"Hyundai","modelo":"Ioniq AE Automóvil 4P. T/A","capacidad":28,"autonomia":246,"createdAt":"2024-10-18T17:58:20.528Z","updatedAt":"2024-10-18T17:58:21.072Z","publishedAt":"2024-10-18T17:58:21.070Z","rendimiento":8.8,"T1":0,"T2":0,"T2SC":0,"GPTDC":0,"CHADEMO":1,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":69,"attributes":{"marca":"Hyundai","modelo":"Ioniq AE PE","capacidad":38.8,"autonomia":206,"createdAt":"2024-10-18T17:58:49.143Z","updatedAt":"2024-10-18T17:58:49.667Z","publishedAt":"2024-10-18T17:58:49.666Z","rendimiento":5.3,"T1":0,"T2":0,"T2SC":0,"GPTDC":0,"CHADEMO":1,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":70,"attributes":{"marca":"Hyundai","modelo":"Ioniq5 NE EV AT 2WD (Batería Estándar)","capacidad":58,"autonomia":290,"createdAt":"2024-10-18T17:59:23.274Z","updatedAt":"2024-10-18T17:59:24.241Z","publishedAt":"2024-10-18T17:59:24.239Z","rendimiento":5,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":71,"attributes":{"marca":"Hyundai","modelo":"Ioniq5 NE EV AT 2WD (Batería Extendida)","capacidad":72.6,"autonomia":363,"createdAt":"2024-10-18T17:59:49.938Z","updatedAt":"2024-10-18T17:59:50.589Z","publishedAt":"2024-10-18T17:59:50.585Z","rendimiento":5,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":72,"attributes":{"marca":"Hyundai","modelo":"Ioniq5 NE EV AT 4WD","capacidad":72.6,"autonomia":363,"createdAt":"2024-10-18T18:00:14.223Z","updatedAt":"2024-10-18T18:00:14.776Z","publishedAt":"2024-10-18T18:00:14.773Z","rendimiento":5,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":73,"attributes":{"marca":"Hyundai","modelo":"Kona OS EV SUV AT Motor Electrico","capacidad":64,"autonomia":339,"createdAt":"2024-10-18T18:00:51.127Z","updatedAt":"2024-10-18T18:00:51.611Z","publishedAt":"2024-10-18T18:00:51.608Z","rendimiento":5.3,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":74,"attributes":{"marca":"Hyundai","modelo":"Kona OS EV SUV T/A Motor Electrico","capacidad":39.2,"autonomia":239,"createdAt":"2024-10-18T18:01:26.363Z","updatedAt":"2024-10-18T18:01:26.993Z","publishedAt":"2024-10-18T18:01:26.991Z","rendimiento":6.1,"T1":1,"T2":0,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":75,"attributes":{"marca":"Jac","modelo":"e-JS1 AT","capacidad":90,"autonomia":612,"createdAt":"2024-10-18T18:01:54.040Z","updatedAt":"2024-10-18T18:01:54.585Z","publishedAt":"2024-10-18T18:01:54.582Z","rendimiento":6.8,"T1":0,"T2":0,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":76,"attributes":{"marca":"Jac","modelo":"e-S2 TA","capacidad":40,"autonomia":212,"createdAt":"2024-10-18T18:02:22.059Z","updatedAt":"2024-10-18T18:02:22.602Z","publishedAt":"2024-10-18T18:02:22.597Z","rendimiento":5.3,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":77,"attributes":{"marca":"Jac","modelo":"Refine M3 EV AT","capacidad":50.2,"autonomia":216,"createdAt":"2024-10-18T18:02:53.753Z","updatedAt":"2024-10-18T18:02:54.284Z","publishedAt":"2024-10-18T18:02:54.278Z","rendimiento":4.3,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":78,"attributes":{"marca":"Jaguar","modelo":"I-PACE EV400 HSE","capacidad":90,"autonomia":387,"createdAt":"2024-10-18T18:03:22.558Z","updatedAt":"2024-10-18T18:03:23.114Z","publishedAt":"2024-10-18T18:03:23.111Z","rendimiento":4.3,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":79,"attributes":{"marca":"Jaguar","modelo":"I-Pace EV400 R-Dynamic HSE PHEV","capacidad":90,"autonomia":387,"createdAt":"2024-10-18T18:03:47.687Z","updatedAt":"2024-10-18T18:03:48.519Z","publishedAt":"2024-10-18T18:03:48.516Z","rendimiento":4.3,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":80,"attributes":{"marca":"Jaguar","modelo":"I-Pace EV400 R-Dynamic S PHEV","capacidad":90,"autonomia":387,"createdAt":"2024-10-18T18:04:17.375Z","updatedAt":"2024-10-18T18:04:17.860Z","publishedAt":"2024-10-18T18:04:17.857Z","rendimiento":4.3,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":81,"attributes":{"marca":"Jaguar","modelo":"I-Pace EV400 R-Dynamic SE PHEV","capacidad":90,"autonomia":387,"createdAt":"2024-10-18T18:04:45.914Z","updatedAt":"2024-10-18T18:04:46.391Z","publishedAt":"2024-10-18T18:04:46.389Z","rendimiento":4.3,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":82,"attributes":{"marca":"JMC","modelo":"Touring EV","capacidad":60.2,"autonomia":211,"createdAt":"2024-10-18T18:05:11.401Z","updatedAt":"2024-10-18T18:05:16.801Z","publishedAt":"2024-10-18T18:05:16.798Z","rendimiento":3.5,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":83,"attributes":{"marca":"JMC","modelo":"Vigus EV","capacidad":60.2,"autonomia":211,"createdAt":"2024-10-18T18:05:39.023Z","updatedAt":"2024-10-18T18:05:39.585Z","publishedAt":"2024-10-18T18:05:39.580Z","rendimiento":3.5,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":84,"attributes":{"marca":"Kia","modelo":"EV6 EV GT-LINE 77.4KWH AWD","capacidad":77.4,"autonomia":457,"createdAt":"2024-10-18T18:06:01.524Z","updatedAt":"2024-10-18T18:06:02.011Z","publishedAt":"2024-10-18T18:06:02.003Z","rendimiento":5.9,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":85,"attributes":{"marca":"Kia","modelo":"Niro EV 64.8KWH 2WD","capacidad":64.8,"autonomia":311,"createdAt":"2024-10-18T18:06:27.640Z","updatedAt":"2024-10-18T18:06:28.141Z","publishedAt":"2024-10-18T18:06:28.134Z","rendimiento":4.8,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":86,"attributes":{"marca":"Kia","modelo":"Soul Electrico (SK3 EV)","capacidad":64,"autonomia":346,"createdAt":"2024-10-18T18:07:00.347Z","updatedAt":"2024-10-18T18:07:00.857Z","publishedAt":"2024-10-18T18:07:00.850Z","rendimiento":5.4,"T1":1,"T2":0,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":87,"attributes":{"marca":"Land Rover","modelo":"Range Rover Evoque 1.5i Autobiography PHEV","capacidad":14.9,"autonomia":82,"createdAt":"2024-10-18T18:07:31.810Z","updatedAt":"2024-10-18T18:07:32.374Z","publishedAt":"2024-10-18T18:07:32.373Z","rendimiento":5.5,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":88,"attributes":{"marca":"Land Rover","modelo":"Range Rover Evoque 1.5i Bronze Colletion PHEV","capacidad":14.9,"autonomia":82,"createdAt":"2024-10-18T18:08:07.381Z","updatedAt":"2024-10-18T18:08:08.549Z","publishedAt":"2024-10-18T18:08:08.543Z","rendimiento":5.5,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":89,"attributes":{"marca":"Land Rover","modelo":"Range Rover Evoque 1.5i Edition PHEV","capacidad":14.9,"autonomia":82,"createdAt":"2024-10-18T18:08:47.636Z","updatedAt":"2024-10-18T18:08:48.343Z","publishedAt":"2024-10-18T18:08:48.339Z","rendimiento":5.5,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":90,"attributes":{"marca":"Land Rover","modelo":"Range Rover Evoque 1.5i HSE PHEV","capacidad":14.9,"autonomia":82,"createdAt":"2024-10-18T18:09:08.426Z","updatedAt":"2024-10-18T18:09:10.373Z","publishedAt":"2024-10-18T18:09:10.371Z","rendimiento":5.5,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":91,"attributes":{"marca":"Land Rover","modelo":"Range Rover Evoque 1.5i PHEV","capacidad":14.9,"autonomia":82,"createdAt":"2024-10-18T18:09:31.073Z","updatedAt":"2024-10-18T18:09:31.614Z","publishedAt":"2024-10-18T18:09:31.612Z","rendimiento":5.5,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":92,"attributes":{"marca":"Land Rover","modelo":"Range Rover Evoque 1.5i R-DYNAMIC HSE PHEV","capacidad":14.9,"autonomia":82,"createdAt":"2024-10-18T18:09:58.679Z","updatedAt":"2024-10-18T18:09:59.203Z","publishedAt":"2024-10-18T18:09:59.197Z","rendimiento":5.5,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":93,"attributes":{"marca":"Land Rover","modelo":"Range Rover Evoque 1.5i R-DYNAMIC S PHEV","capacidad":14.9,"autonomia":82,"createdAt":"2024-10-18T18:10:22.939Z","updatedAt":"2024-10-18T18:10:23.516Z","publishedAt":"2024-10-18T18:10:23.514Z","rendimiento":5.5,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":94,"attributes":{"marca":"Land Rover","modelo":"Range Rover Evoque 1.5i R-DYNAMIC SE PHEV","capacidad":14.9,"autonomia":82,"createdAt":"2024-10-18T18:10:44.667Z","updatedAt":"2024-10-18T18:13:14.345Z","publishedAt":"2024-10-18T18:10:45.259Z","rendimiento":5.5,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":95,"attributes":{"marca":"Land Rover","modelo":"Range Rover Evoque 1.5i S PHEV","capacidad":14.9,"autonomia":82,"createdAt":"2024-10-18T18:11:15.712Z","updatedAt":"2024-10-18T18:11:16.160Z","publishedAt":"2024-10-18T18:11:16.157Z","rendimiento":5.5,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":96,"attributes":{"marca":"Land Rover","modelo":"Range Rover Evoque 1.5i SE PHEV","capacidad":14.9,"autonomia":82,"createdAt":"2024-10-18T18:11:37.051Z","updatedAt":"2024-10-18T18:11:37.578Z","publishedAt":"2024-10-18T18:11:37.575Z","rendimiento":5.5,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":97,"attributes":{"marca":"Land Rover","modelo":"Range Rover Sport 3.0i PHEV Autobiography","capacidad":38.2,"autonomia":145,"createdAt":"2024-10-18T18:12:04.174Z","updatedAt":"2024-10-18T18:12:04.710Z","publishedAt":"2024-10-18T18:12:04.709Z","rendimiento":3.8,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":98,"attributes":{"marca":"Land Rover","modelo":"Range Rover Sport 3.0i PHEV Dynamic HSE","capacidad":38.2,"autonomia":145,"createdAt":"2024-10-18T18:12:28.895Z","updatedAt":"2024-10-18T18:12:32.937Z","publishedAt":"2024-10-18T18:12:32.933Z","rendimiento":3.8,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":99,"attributes":{"marca":"Land Rover","modelo":"Range Rover Sport 3.0i PHEV Dynamic S","capacidad":38.2,"autonomia":145,"createdAt":"2024-10-18T18:12:55.907Z","updatedAt":"2024-10-18T18:12:56.410Z","publishedAt":"2024-10-18T18:12:56.407Z","rendimiento":3.8,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":100,"attributes":{"marca":"Land Rover","modelo":"Range Rover Sport 3.0i PHEV Dynamic SE","capacidad":38.2,"autonomia":145,"createdAt":"2024-10-18T18:13:43.654Z","updatedAt":"2024-10-18T18:13:44.142Z","publishedAt":"2024-10-18T18:13:44.137Z","rendimiento":3.8,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":101,"attributes":{"marca":"Land Rover","modelo":"Range Rover Sport 3.0i PHEV First Edition","capacidad":38.2,"autonomia":145,"createdAt":"2024-10-18T18:14:06.061Z","updatedAt":"2024-10-18T18:14:06.564Z","publishedAt":"2024-10-18T18:14:06.562Z","rendimiento":3.8,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":102,"attributes":{"marca":"Land Rover","modelo":"Range Rover Velar 2.0i Dynamic HSE PHEV","capacidad":15.4,"autonomia":62,"createdAt":"2024-10-18T18:14:28.803Z","updatedAt":"2024-10-18T18:14:29.359Z","publishedAt":"2024-10-18T18:14:29.354Z","rendimiento":4,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":103,"attributes":{"marca":"Land Rover","modelo":"Range Rover Velar 2.0i Dynamic S PHEV","capacidad":15.4,"autonomia":62,"createdAt":"2024-10-18T18:14:57.674Z","updatedAt":"2024-10-18T18:14:58.256Z","publishedAt":"2024-10-18T18:14:58.252Z","rendimiento":4,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":104,"attributes":{"marca":"Land Rover","modelo":"Range Rover Velar 2.0i Dynamic SE PHEV","capacidad":15.4,"autonomia":62,"createdAt":"2024-10-18T18:15:26.823Z","updatedAt":"2024-10-18T18:15:27.412Z","publishedAt":"2024-10-18T18:15:27.406Z","rendimiento":4,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":105,"attributes":{"marca":"Land Rover","modelo":"Range Rover Velar 2.0i HSE PHEV","capacidad":15.4,"autonomia":62,"createdAt":"2024-10-18T18:15:46.718Z","updatedAt":"2024-10-18T18:15:47.306Z","publishedAt":"2024-10-18T18:15:47.305Z","rendimiento":4,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":106,"attributes":{"marca":"Land Rover","modelo":"Range Rover Velar 2.0i PHEV","capacidad":15.4,"autonomia":62,"createdAt":"2024-10-18T18:16:20.593Z","updatedAt":"2024-10-18T18:16:21.045Z","publishedAt":"2024-10-18T18:16:21.043Z","rendimiento":4,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":107,"attributes":{"marca":"Land Rover","modelo":"Range Rover Velar 2.0i S PHEV","capacidad":15.4,"autonomia":62,"createdAt":"2024-10-18T18:16:41.724Z","updatedAt":"2024-10-18T18:16:42.673Z","publishedAt":"2024-10-18T18:16:42.670Z","rendimiento":4,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":108,"attributes":{"marca":"Land Rover","modelo":"Range Rover Velar 2.0i SE PHEV","capacidad":15.4,"autonomia":62,"createdAt":"2024-10-18T18:17:01.774Z","updatedAt":"2024-10-18T18:17:02.317Z","publishedAt":"2024-10-18T18:17:02.316Z","rendimiento":4,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":109,"attributes":{"marca":"Leap Motor","modelo":"T03 Luxury EV","capacidad":38.5,"autonomia":235,"createdAt":"2024-10-18T18:17:32.335Z","updatedAt":"2024-10-18T18:17:32.779Z","publishedAt":"2024-10-18T18:17:32.775Z","rendimiento":6.1,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":110,"attributes":{"marca":"Mercedez Benz","modelo":"C 350e 2,0 Lts. Sedán 4P. T/A Híbrido","capacidad":6.4,"autonomia":58,"createdAt":"2024-10-18T18:18:07.351Z","updatedAt":"2024-10-18T18:18:08.552Z","publishedAt":"2024-10-18T18:18:08.549Z","rendimiento":9.1,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":111,"attributes":{"marca":"Mercedez Benz","modelo":"C300e","capacidad":13.5,"autonomia":95,"createdAt":"2024-10-18T18:18:30.622Z","updatedAt":"2024-10-18T18:18:31.134Z","publishedAt":"2024-10-18T18:18:31.126Z","rendimiento":7,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":112,"attributes":{"marca":"Mercedez Benz","modelo":"E 350e 2,0 Lts. Sedán 4P. T/A Híbrido","capacidad":6.4,"autonomia":45,"createdAt":"2024-10-18T18:18:53.198Z","updatedAt":"2024-10-18T18:18:53.634Z","publishedAt":"2024-10-18T18:18:53.630Z","rendimiento":7,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":113,"attributes":{"marca":"Mercedez Benz","modelo":"EQA 350 4M","capacidad":100,"autonomia":590,"createdAt":"2024-10-18T18:19:15.153Z","updatedAt":"2024-10-18T18:19:15.654Z","publishedAt":"2024-10-18T18:19:15.650Z","rendimiento":5.9,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":114,"attributes":{"marca":"Mercedez Benz","modelo":"EQS 450Plus","capacidad":107.8,"autonomia":593,"createdAt":"2024-10-18T18:19:43.374Z","updatedAt":"2024-10-18T18:19:43.897Z","publishedAt":"2024-10-18T18:19:43.894Z","rendimiento":5.5,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":115,"attributes":{"marca":"Mercedez Benz","modelo":"GLC 300e 4Matic","capacidad":13.5,"autonomia":80,"createdAt":"2024-10-18T18:20:09.519Z","updatedAt":"2024-10-18T18:20:09.995Z","publishedAt":"2024-10-18T18:20:09.993Z","rendimiento":5.9,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":116,"attributes":{"marca":"Mer","modelo":"GLC 350e 4Matic 2,0 Lts. Station Wagon 5P.","capacidad":6.4,"autonomia":45,"createdAt":"2024-10-18T18:20:56.678Z","updatedAt":"2024-10-18T18:20:57.814Z","publishedAt":"2024-10-18T18:20:57.811Z","rendimiento":7,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":117,"attributes":{"marca":"Mercedez Benz","modelo":"GLC 350e Coupé 4Matic 2,0 Lts. Station Wagon 4P","capacidad":6.4,"autonomia":48,"createdAt":"2024-10-18T18:21:18.951Z","updatedAt":"2024-10-18T18:21:19.435Z","publishedAt":"2024-10-18T18:21:19.433Z","rendimiento":7.5,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":118,"attributes":{"marca":"Mercedez Benz","modelo":"GLE 500e 4 Matic 3,0 Lts. Station Wagon 5P. ","capacidad":6.4,"autonomia":35,"createdAt":"2024-10-18T18:21:45.937Z","updatedAt":"2024-10-18T18:21:46.467Z","publishedAt":"2024-10-18T18:21:46.462Z","rendimiento":5.5,"T1":0,"T2":1,"T2SC":0,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Híbrido con Recarga Exterior"}},{"id":119,"attributes":{"marca":"Maxus","modelo":"e Deliver 3","capacidad":50.2,"autonomia":216,"createdAt":"2024-10-18T18:22:28.835Z","updatedAt":"2024-10-18T18:22:29.198Z","publishedAt":"2024-10-18T18:22:29.194Z","rendimiento":4.3,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":120,"attributes":{"marca":"Maxus","modelo":"e Deliver 3 L","capacidad":50.2,"autonomia":216,"createdAt":"2024-10-18T18:22:51.468Z","updatedAt":"2024-10-18T18:22:52.251Z","publishedAt":"2024-10-18T18:22:52.249Z","rendimiento":4.3,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":121,"attributes":{"marca":"Maxus","modelo":"e Deliver 3 L Plus","capacidad":50.2,"autonomia":216,"createdAt":"2024-10-18T18:23:23.018Z","updatedAt":"2024-10-18T18:23:23.504Z","publishedAt":"2024-10-18T18:23:23.500Z","rendimiento":4.3,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":122,"attributes":{"marca":"Ma","modelo":"e Deliver 3 Plus","capacidad":50.2,"autonomia":216,"createdAt":"2024-10-18T18:23:43.757Z","updatedAt":"2024-10-18T18:23:44.287Z","publishedAt":"2024-10-18T18:23:44.282Z","rendimiento":4.3,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":123,"attributes":{"marca":"Ma","modelo":"e Deliver 9 L2H2","capacidad":88,"autonomia":246,"createdAt":"2024-10-18T18:24:07.967Z","updatedAt":"2024-10-18T18:24:08.385Z","publishedAt":"2024-10-18T18:24:08.379Z","rendimiento":2.8,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":124,"attributes":{"marca":"Maxus","modelo":"e Deliver 9 L3H2","capacidad":88,"autonomia":246,"createdAt":"2024-10-18T18:24:29.792Z","updatedAt":"2024-10-18T18:24:30.322Z","publishedAt":"2024-10-18T18:24:30.319Z","rendimiento":2.8,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":125,"attributes":{"marca":"Maxus","modelo":"e-Deliver 3 CS","capacidad":50.2,"autonomia":216,"createdAt":"2024-10-18T18:24:53.705Z","updatedAt":"2024-10-18T18:24:54.144Z","publishedAt":"2024-10-18T18:24:54.143Z","rendimiento":4.3,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":126,"attributes":{"marca":"Maxus","modelo":"E-Deliver 9 L3 Camioneta","capacidad":65.2,"autonomia":131,"createdAt":"2024-10-18T18:25:14.397Z","updatedAt":"2024-10-18T18:25:14.926Z","publishedAt":"2024-10-18T18:25:14.920Z","rendimiento":2,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":127,"attributes":{"marca":"Maxus","modelo":"E-Deliver 9 L4 Camioneta","capacidad":65.2,"autonomia":131,"createdAt":"2024-10-18T18:25:40.884Z","updatedAt":"2024-10-18T18:25:41.370Z","publishedAt":"2024-10-18T18:25:41.368Z","rendimiento":2,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":128,"attributes":{"marca":"Maxus","modelo":"EG50 AT EV","capacidad":52.5,"autonomia":215,"createdAt":"2024-10-18T18:26:03.976Z","updatedAt":"2024-10-18T18:26:04.516Z","publishedAt":"2024-10-18T18:26:04.514Z","rendimiento":4.1,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}},{"id":129,"attributes":{"marca":"Maxus","modelo":"EG50 AT EV 5 Pasajeros","capacidad":52.5,"autonomia":215,"createdAt":"2024-10-18T18:26:31.049Z","updatedAt":"2024-10-18T18:26:31.466Z","publishedAt":"2024-10-18T18:26:31.462Z","rendimiento":4.1,"T1":0,"T2":1,"T2SC":1,"GPTDC":0,"CHADEMO":0,"CCST2":0,"tipo":"Eléctrico Puro"}}],"meta":{"pagination":{"page":1,"pageSize":1000,"pageCount":1,"total":129}}}
        // if (!response.ok) {throw new Error('No se pudo extraer la información de los vehículos desde Strapi');}
        
        // Convert response to JSON
        //const data = await response.json();
        const data = response;

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
    ...getResponsiveButton(),
    display: 'flex',
    flexDirection: "column",
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '50%',
    border: 'none',
    backgroundColor: '#fff', // White background or any color
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    cursor: 'pointer',
    overflow: 'hidden',
    position: 'relative',
  };
  
  const iconStyle = {
    ...getResponsiveIcon(),
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

    
      
<AppBar position="static"
sx={{
  background: `linear-gradient(to bottom, ${colorBarra1}, ${colorBarra2})`,
  height: {
    xs: '45px',  // Height for extra small screens
    sm: '40px',  // Height for small screens
    md: '50px',  // Height for medium screens
    lg: '50px',  // Height for large screens
    xl: '60px',  // Height for extra large screens
  },
}}
>
  <Container maxWidth="xl">
    <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
          fontWeight: 700,
          letterSpacing: '.05rem',
          color: 'transparent', // Make the text transparent to show the gradient
          background: 'linear-gradient(90deg, #0077B6, #0072ff)', // Gradient background
          WebkitBackgroundClip: 'text', // Clip the background to the text
          backgroundClip: 'text',
          textDecoration: 'none',
          textAlign: 'center', // Center the text
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.2)', // Subtle shadow for depth
        }}
      >
        Electro Explorer Map || Centro de Energía UC
      </Typography>
      </Box>

      {/* Botones visibles en pantallas pequeñas */}
      <Box
      sx={{
        display: 'flex', // Use flexbox for layout
        justifyContent: 'flex-end', // Align buttons to the right
        gap: '10px', // Space between buttons
        padding: '0px', // Space around the container
      }}
    >
      <Button
        onClick={() => setIsVisible(true)}
        sx={{
          fontSize: { xs: '0.8rem', sm: '1rem', md: '1.2rem', lg: '1.2rem', xl: '1rem' },
          padding: { xs: '6px 16px', sm: '10px 20px' },
          backgroundColor: '#0077B6',
          borderRadius: '4px',
          color: '#fff',
          boxShadow: '0px 4px 8px rgba(0, 114, 255, 0.3)',
          transition: 'all 0.3s ease',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#005bb5',
            boxShadow: '0px 6px 12px rgba(0, 114, 255, 0.5)',
          },
          '&:active': {
            transform: 'scale(0.95)',
            boxShadow: '0px 3px 6px rgba(0, 114, 255, 0.4)',
          },
        }}
      >
        Explorador
      </Button>

      <Button
        onClick={() => setIsVisible(false)}
        sx={{
          fontSize: { xs: '0.8rem', sm: '1rem', md: '1.2rem', lg: '1.2rem', xl: '1rem' },
          padding: { xs: '6px 16px', sm: '10px 20px' },
          backgroundColor: '#0077B6',
          borderRadius: '4px',
          color: '#fff',
          boxShadow: '0px 4px 8px rgba(0, 114, 255, 0.3)',
          transition: 'all 0.3s ease',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#005bb5',
            boxShadow: '0px 6px 12px rgba(0, 114, 255, 0.5)',
          },
          '&:active': {
            transform: 'scale(0.95)',
            boxShadow: '0px 3px 6px rgba(0, 114, 255, 0.4)',
          },
        }}
      >
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
    width: { xs: '85%', sm: '80%', md: '90%', lg: '27%', xl: '25%' }, // Width for different screen sizes
    height: { xs: '53%', sm: '80%', md: '90%', lg: '27%', xl: '53%' }, // Height for different screen sizes
    bottom: { xs: '10%', sm: '5%', md: '0', lg: '27%', xl: '40%' }, // Top position for different screen sizes
    left: { xs: '7.5%', sm: '5%', md: '0', lg: '27%', xl: '5%' }, // Left position for different screen sizes
  }}
>
  {/* Título */}
  <Typography sx={{ color: colorLetras, fontWeight: pesoFuente, fontFamily: fuente,  fontSize: sizeBoxTitle}} align="center" style={{ marginTop: '1%' }}>
    Filtros de Búsqueda
  </Typography>
  
  {/* Línea horizontal */}
  <hr style={{ width: '90%', margin: '5px 0', border: `1px solid ${colorLin}`}}/>

  {/* Contenedor interno */}
  <div
    style={{
      background: `linear-gradient(to bottom, ${colorContInt1}, ${colorContInt2})`, // Correct usage of backticks
      width: '95%',
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
            height: 6,
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
          padding: '2px',              // Padding for better UX
          backgroundColor: elementInt,   // Light blue background color
          border: '1px solid #00796B',  // Add a border for clarity
          borderRadius: '5px',
        }}
      />
    </Grid>

    <Grid item xs={4}>
      {/* Button with different background color */}
      <Button
        onClick={handleSearch}
        sx = {{sizeBtn}}
        style={{
          width: '100%',               // Take full width of the grid item
          padding: '2px',
          backgroundColor: colorBtn,  // Darker green background
          color: colorTxtBtn,          // White text for contrast
          border: 'none',              // Remove default border
          borderRadius: '5px',         // Rounded corners
          cursor: 'pointer',           // Pointer cursor for interaction
        }}
      >
        Buscar
      </Button>
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
  <hr style={{ width: '60%', margin: '5px 0', border: `1px solid ${colorLin}`}} />
</Box>

      <Box
  sx={{
    position: 'absolute',
    backgroundColor: colorContExt,
    zIndex: !isVisible ? 1000 : 0, // Higher zIndex when visible
    pointerEvents: !isVisible ? 'auto' : 'none', // Enable interactions only when visible
    width: { xs: '90%', sm: '80%', md: '90%', lg: '27%', xl: '30%' }, // Width for different screen sizes
    height: { xs: '40%', sm: '80%', md: '90%', lg: '27%', xl: '40%' }, // Height for different screen sizes
    bottom: { xs: '10%', sm: '5%', md: '0', lg: '27%', xl: '52%' }, // Top position for different screen sizes
    left: { xs: '5%', sm: '5%', md: '0', lg: '27%', xl: '5%' }, // Left position for different screen sizes
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
  <Typography sx={{ color: colorLetras, fontWeight: pesoFuente, fontFamily: fuente,  fontSize: sizeBoxTitle }} align="center" style={{ marginTop: '1%' }}>
    Planificador de ruta
  </Typography>
  
  {/* Horizontal line */}
  <hr style={{ width: '90%', margin: '5px 0', border: `1px solid ${colorLin}`}} />

  {/* Contenedor */}
  <div
    style={{
      background: `linear-gradient(to bottom, ${colorContInt1}, ${colorContInt2})`,
      width: '95%',
      height: '90%',
      borderRadius: '20px',
    }}
  >
    {/* Grid Contenedor */}
      <Grid
        container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{
          height: '100%',
          width: '100%',
          padding: {
            xs: '2px', // Padding for extra small screens
            sm: '2px', // Padding for small screens
            md: '2px', // Padding for medium screens
            lg: '2px', // Padding for large screens
            xl: '2px', // Padding for extra large screens
          },}}
      >
        <Grid item xs style={{ width: '100%', textAlign: 'center' }} sx={{padding:paddingBox}}>
          <Typography sx={{ color: colorLetras, fontWeight: pesoFuente, fontFamily: fuente, fontSize: sizeBig }} variant="h7" align="center">
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
              style={{
                ...getResponsiveAutocoplete(),
                zIndex:9999, 
                width: '100%', // Full width
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
            />
          </div>
        </Grid>

        <Grid item xs style={{ width: '100%', textAlign: 'center' }} sx={{padding:paddingBox}}>
          <Typography sx={{ color: colorLetras, fontWeight: pesoFuente, fontFamily: fuente, fontSize: sizeBig }} variant="h7" align="center">Indique punto de llegada </Typography>
          <div>
            <Autocomplete
              sx={{ color: colorLetras }}
              style={{
                ...getResponsiveAutocoplete(),
                zIndex:9999, 
                width: '100%', // Full width
                //height: '40px', // Fixed height
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
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}
          sx = {{padding: paddingBox}}
        >
          <Typography sx={{ color: colorLetras, fontWeight: pesoFuente, fontFamily: fuente, fontSize: sizeBig }} variant="h7" align="center">
            Indique tipo de cargador o vehículo 
          </Typography>
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


        <Grid container style={{ width: '98%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}} sx={{padding:paddingBox}}>
      {/* First Row: SOC and Autonomy */}
      <Grid style={{ display: 'flex', alignItems: 'center' }}>
      <Typography sx={{ color: colorLetras, fontWeight: pesoFuente - 100, fontFamily: fuente, fontSize: sizeBig }} variant="h7" style={{ marginRight: '0px' }}>
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
            ...getResponsiveAutocoplete(),
            backgroundColor: elementInt, 
            color: colorTxtInt,
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
        <Typography sx={{ color: colorLetras, fontWeight: pesoFuente -100, fontFamily: fuente, fontSize: sizeBig }} variant="h7" style={{ marginRight: '0px' }}>
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
                ...getResponsiveAutocoplete(),
                backgroundColor: elementInt, 
                color: colorTxtInt,
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

    



    <Grid container style={{ width: '90%', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}} sx = {{padding: paddingBox}}>
          <Button
              onClick={handleGenerateRoute}
              sx={{
                fontSize: sizeBtn,
              }}
              style={{
                backgroundColor: colorBtn,
                color: colorTxtBtn,
                border: 'none',
                borderRadius: '4px',
                padding: '4px 4px',
                margin: '4px',
                cursor: partida && final ? 'pointer' : 'not-allowed',  // Cambia el cursor
                opacity: partida && final ? 1 : 0.5,  // Opacidad cuando está deshabilitado
              }}
              disabled={!partida || !final}  // Deshabilitar si partida o final son null
            >
              Mostrar ruta
            </Button>

          <Button
            onClick={filterLocationsBetweenConsecutivePoints}
            sx={{
              fontSize: sizeBtn,
            }}
            style={{
              backgroundColor: colorBtn,
              color: colorTxtBtn,
              border: 'none',
              borderRadius: '4px',
              padding: '4px 4px', // Reduced padding for smaller buttons
              margin: '4px', // Reduced margin for smaller spacing
              cursor: partida && final ? 'pointer' : 'not-allowed',  // Cambia el cursor
              opacity: partida && final ? 1 : 0.5,  // Opacidad cuando está deshabilitado
            }}
            disabled={!partida || !final}  // Deshabilitar si partida o final son null
          >
            Puntos en ruta
          </Button>

          <Button
            onClick={getRandomLocations}
            sx={{
              fontSize: sizeBtn,
            }}
            style={{
              backgroundColor: colorBtn,
              color: colorTxtBtn,
              border: 'none',
              borderRadius: '4px',
              padding: '4px 4px', // Reduced padding for smaller buttons
              margin: '4px', // Reduced margin for smaller spacing
              cursor: soc && autonomy ? 'pointer' : 'not-allowed',  // Cambia el cursor
              opacity: soc && autonomy ? 1 : 0.5,  // Opacidad cuando está deshabilitado
            }}
            disabled={!soc || !autonomy} 
          >
            Optimizar
          </Button>
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
      <hr style={{ width: '60%', margin: '5px 0', border: `1px solid ${colorLin}`}} />
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
