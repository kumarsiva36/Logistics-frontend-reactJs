import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const coimbatore = [11.0168, 76.9558];
const karur = [10.9601, 78.0766];

const positions = [coimbatore, [11.5, 77.5], karur];

const MockMapView = () => (
  <div style={{ height: '600px' }}>
    <MapContainer center={[11.2, 77.5]} zoom={7} scrollWheelZoom={true} style={{ height: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <Polyline positions={positions} color="blue" />
      <Marker position={coimbatore}>
        <Popup>Coimbatore</Popup>
      </Marker>
      <Marker position={karur}>
        <Popup>Karur</Popup>
      </Marker>
    </MapContainer>
  </div>
);

export default MockMapView;
