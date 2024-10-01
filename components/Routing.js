import L from 'leaflet';
import { createControlComponent } from '@react-leaflet/core';
import 'leaflet-routing-machine';
import 'lrm-google';


const createRoutingMachineLayer = (props) => {
  const { waypoints } = props;
  
  useEffect(() => {
    console.log('Google Router Loaded: ', L.Routing.Google);
    // This should print the Google Router object. If it prints "undefined", 
    // the Google Router is not properly loaded
}, []);

  const instance = L.Routing.control({
    router: new L.Routing.Google({
      key: 'AIzaSyBbS1g7ohjBsnluB9jBVJ1WnEvsxNMjMJY',
      serviceUrl : `https://maps.googleapis.com/maps/api/directions/json?key=AIzaSyBbS1g7ohjBsnluB9jBVJ1WnEvsxNMjMJY`,
  }),
    waypoints: waypoints,
    geocoder: L.Control.Geocoder.nominatim(),
    lineOptions: {
      styles: [{ color: "#6FA1EC", weight: 4 }]
    },
    show: false,
    addWaypoints: false,
    routeWhileDragging: true,
    draggableWaypoints: true,
    fitSelectedRoutes: true,
    showAlternatives: false,
    serviceUrl: null,
  });
  

  return instance;
};

const RoutingMachine = createControlComponent(createRoutingMachineLayer);

export default RoutingMachine;