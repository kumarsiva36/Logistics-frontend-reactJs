import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CreateDeliveryForm from './components/CreateDeliveryForm';
import UpdateDeliveryForm from './components/UpdateDeliveryForm';
import MockMapView from './components/MockMapView';
import WebhookSimulator from './components/WebhookSimulator';
import 'bootstrap/dist/css/bootstrap.min.css';
import ViewPackageDetails from './components/ViewPackage';
import EditDeliveryForm from './components/EditDeliveryForm';
import CreateDriverForm from './components/UpdateDeliveryForm';

const AppContent = () => {
  const navigate = useNavigate();

  const deliveries = [
    { id: 1, destination: 'New York', status: 'Pending', driver: 'John' },
    { id: 2, destination: 'Los Angeles', status: 'In Transit', driver: 'Emma' },
  ];

  const logs = [
    { timestamp: '2025-04-10 10:00 AM', packageId: 1, status: 'Delivered' },
    { timestamp: '2025-04-11 11:15 AM', packageId: 2, status: 'In Transit' },
    { timestamp: '2025-04-11 12:15 AM', packageId: 3, status: 'Dispatched' },
  ];

  const handleViewMap = (log) => {
    navigate('/map', { state: { log } });
  };

  return (
    <div className="container-fluid">
      <div className="row flex-nowrap">
        {/* Sidebar */}
        <div className="col-auto col-md-3 col-xl-2 px-sm-2 px-0 bg-dark text-white vh-100">
          <div className="d-flex flex-column align-items-center align-items-sm-start px-3 pt-3 text-white">
            <h4 className="text-center w-100 mb-4">📦 Delivery App</h4>
            <ul className="nav nav-pills flex-column mb-auto w-100">
              <li className="nav-item w-100">
                <Link to="/" className="nav-link text-white px-3">🏠 Dashboard</Link>
              </li>
              <li className="nav-item w-100">
                <Link to="/create" className="nav-link text-white px-3">➕ Create Package</Link>
              </li>
              <li>
                <Link to="/update/1" className="nav-link text-white px-3">✏️ Create Driver Details</Link>
              </li>
              {/* <li className="nav-item w-100">
                <Link to="/map" className="nav-link text-white px-3">🗺️ Map View</Link>
              </li> */}
              <li className="nav-item w-100">
                <Link to="/webhooks" className="nav-link text-white px-3">🔁 Webhook Logs</Link>
              </li>
            </ul>
            <hr className="w-100" />
            <p className="text-center w-100 small">&copy; 2025</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="col py-4">
          <Routes>
            <Route path="/" element={<Dashboard deliveries={deliveries} />} />
            <Route path="/create" element={<CreateDeliveryForm onCreate={() => {}} />} />
            <Route path="/update/:id" element={<CreateDriverForm />} />
            <Route path="/webhooks" element={<WebhookSimulator logs={logs} onViewMap={handleViewMap} />} />
            <Route path="/map" element={<MockMapView />} />
            <Route path="/view-package" element={<ViewPackageDetails />} />
            <Route path="/edit-package" element={<EditDeliveryForm />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <Router>
    <AppContent />
  </Router>
);

export default App;
