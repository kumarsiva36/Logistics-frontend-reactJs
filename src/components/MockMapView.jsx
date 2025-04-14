import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate, useLocation } from 'react-router-dom';

const coimbatore = [11.0168, 76.9558];
const karur = [10.9601, 78.0766];


const MockMapView = () => {
  const location = useLocation();
const { source,disti,sourceLat,distlat } = location.state;
const positions = [ [sourceLat[1],sourceLat[0]],[distlat[1],distlat[0]]];
  return(
  <div style={{ height: '600px' }}>
    <MapContainer center={[11.2, 77.5]} zoom={7} scrollWheelZoom={true} style={{ height: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Polyline positions={positions} color="blue" />
      <Marker position={[sourceLat[1],sourceLat[0]]}>
        <Popup>{source}</Popup>
      </Marker>
      <Marker position={[distlat[1],distlat[0]] }>
        <Popup>{disti}</Popup>
      </Marker>
    </MapContainer>
  </div>)

  };

export default MockMapView;
