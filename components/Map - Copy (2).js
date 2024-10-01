import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, FeatureGroup, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import L from 'leaflet';
//import "./styles.css";
import "leaflet/dist/leaflet.css";
import Routing from "./Routing";
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



const Map = () => {
  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [polygonPoints, setPolygonPoints] = useState([]);
  const mapRef = useRef(null);

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const pages = ['Products', 'Pricing', 'Blog'];
  const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
  const [address, setAddress] = useState('Sydney, NSW');
  const [coordinates, setCoordinates] = useState(null);

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
        const response = await fetch('/api/locations');
        const data = await response.json();
        const locationsWithPhotoUrl = data.data.map((location) => ({
          ...location,
          photoUrl: `http://localhost:1337${location.attributes.photo?.data[0]?.attributes?.url}`,
        }));
        setLocations(locationsWithPhotoUrl);
        setFilteredLocations(locationsWithPhotoUrl);
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

  const handleAddressChange = (event) => {
    setAddress(event.target.value);
  };

  const codeAddress = async () => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json`, {
        params: {
          address,
          key: 'AIzaSyBbS1g7ohjBsnluB9jBVJ1WnEvsxNMjMJY' // Replace with your API key
        }
      });
      if (response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        setCoordinates(location);
        console.log('Coordinates:', location);
      } else {
        console.log('No results found');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  return (
    
    <div>
      <Autocomplete
      apiKey={"AIzaSyBbS1g7ohjBsnluB9jBVJ1WnEvsxNMjMJY"}
      onPlaceSelected={(place) => {
        console.log(place);
      }}
      options={{
        types: ['address'], // You can specify types here if needed
        componentRestrictions: { country: 'cl' } // Restrict to Chile
      }}
    />;

<div>
      <input
        id="address"
        type="text"
        value={address}
        onChange={handleAddressChange}
      />
      <button onClick={codeAddress}>Encode</button>
      {coordinates && (
        <div>
          <p>Latitude: {coordinates.lat}</p>
          <p>Longitude: {coordinates.lng}</p>
        </div>
      )}
    </div>
      
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

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
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
            {pages.map((page) => (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
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
      <input
        type="text"
        placeholder="Search locations"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ color: 'black', border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}
      />
      <button onClick={handleSearch} style={{ backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px', padding: '8px 16px', marginLeft: '8px' }}>Search</button>
      <div 
  className="container"
  style={{
    position: 'relative',
    width: '100%',
    height: '100%'
  }}
  >
    <div
      style={{
        position: 'absolute',
        backgroundColor: "white",
        width: 100,
        height: 100,
        top: "10%",
        left: "10%",
        zIndex: 10000
      }}  
    >
    <div id="remote">
      <input class="typeahead" type="text" placeholder="Type Here"/>
    </div>
    </div>
    <MapContainer
        center={[0, 0]}
        zoom={2}
        style={{ height: '120vh' }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
          
        />
        <Routing />

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
        {Array.isArray(filteredLocations) &&
          filteredLocations.map((location) => (
            <Marker
              key={location.id}
              position={[
                location.attributes.latitude,
                location.attributes.longitude,
              ]}
              icon={customIcon}
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
      
    </div>
  );
};

export default Map;
