import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ServerUrl } from "../Constant";

const ViewPackageDetails = ({ packageId, onBack }) => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.get(
          `${ServerUrl}/view-package`,
          { params: { packageId } },
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        setLogs(response.data.result);
        setFilteredLogs(response.data.result); // Initially show all logs
      } catch (err) {
        console.error(err);
        setError('Error fetching package data.');
      }
    };

    fetchPackage();
  }, [packageId]);

  const handleStatusFilterChange = (e) => {
    const selectedStatus = e.target.value;
    setStatusFilter(selectedStatus);

    if (selectedStatus) {
      setFilteredLogs(logs.filter(log => log.status === selectedStatus));
    } else {
      setFilteredLogs(logs); // Show all logs if no filter is selected
    }
  };

  const handleViewClick = (id) => {
    navigate('/edit-package', { state: { id } });
  };

  const handleAssignDriverClick = (id) => {
    navigate('/assign-driver', { state: { id } });
  };

  const handleUpdateStatusClick = (id, status, pid) => {
    navigate('/update-status', { state: { id, status, pid } });
  };

  const handleBack = () => {
    navigate('/create');
  };

  const handleViewMap = (source, disti, sourceLat, distlat) => {
    navigate('/map', { state: { source, disti, sourceLat, distlat } });
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">✏️ View Package Details List</h4>
          <button className="btn btn-outline-light bg-white text-black btn-sm" onClick={handleBack}>
            ➕Create Package
          </button>
        </div>
        <div className="card-body">
          {logs.length <= 0 ? (
            <div className="alert alert-warning">No logs available </div>
          ) : (
            <div className="table-responsive">
              <div style={{ marginBottom: '10px' }} className="col-md-4">
                Status
                <select
                  name="status"
                  className="form-select"
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                >
                  <option value="">Select</option>
                  <option value="Pending">Pending</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-primary">
                  <tr>
                    <th>Package ID</th>
                    <th>Customer Name</th>
                    <th>Customer Contact</th>
                    <th>Driver Name</th>
                    <th>Source</th>
                    <th>Destination</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLogs.map((log, i) => (
                    <tr key={i}>
                      <td>#{log.packageId}</td>
                      <td>{log.customer?.[0]?.name || 'N/A'}</td>
                      <td>{log.customer?.[0]?.contact || 'N/A'}</td>
                      <td>{log.driver?.[0]?.name || 'N/A'}</td>
                      <td>{log.source}</td>
                      <td>{log.destination}</td>
                      <td>
                        <button
                          type="button"
                          className={'btn ml-auto text-white ' + (log.status === 'Pending' ? 'btn-danger' : (log.status === 'Out for Delivery' ? 'btn-primary' : 'btn-success'))}
                        >
                          {log.status}
                        </button>
                      </td>
                      <td>
                        <div className="d-flex flex-wrap gap-2">
                          <button
                            className="btn btn-warning text-white"
                            onClick={() => handleViewMap(log.source, log.destination, log.sourceLocation, log.destinationLocation)}
                          >
                            Map
                          </button>

                          {log.status !== 'Delivered' && (
                            <>
                              <button
                                type="button"
                                className="btn btn-warning text-white"
                                onClick={() => handleViewClick(log.pId)}
                              >
                                Edit
                              </button>

                              {log.driver?.[0]?.name == null && (
                                <button
                                  type="button"
                                  className="btn btn-warning text-white"
                                  onClick={() => handleAssignDriverClick(log.pId)}
                                >
                                  Assign Driver
                                </button>
                              )}

                              <button
                                type="button"
                                className="btn btn-warning text-white"
                                onClick={() => handleUpdateStatusClick(log.pId, log.status, log.packageId)}
                              >
                                Update Status
                              </button>
                            </>
                          )}
                        </div>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewPackageDetails;
