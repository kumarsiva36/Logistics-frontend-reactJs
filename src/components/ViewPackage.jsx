import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ViewPackageDetails = ({ packageId, onBack }) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
console.log("logs",logs)
//   useEffect(() => {
    useEffect(() => {
        const fetchPackage = async () => {
          try {
            const response = await axios.get(
              'http://192.168.1.106:5000/api/view-package',
              { packageId },
              {
                headers: { 'Content-Type': 'application/json' },
              }
            );
      
           
              setLogs(response.data.result);
         
          }
           catch (err) {
            console.error(err);
            // setError('Error fetching package data.');
          } 
        };
      
        fetchPackage();
      }, [packageId]);
      const navigate = useNavigate();
      const handleViewClick = (id) => {
        navigate('/edit-package', { state: { id } });
      };
    // if (packageId) {
    //   fetchPackage();
    // }
//   }, [packageId]);

//   if (loading) return <div className="container mt-4">Loading package details...</div>;
//   if (error) return <div className="container mt-4 text-danger">{error}</div>;

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">View Package Deatils List</h5>
        </div>
        <div className="card-body">
          {logs.length <= 0 ? (
            <div className="alert alert-warning">No logs available </div>
          ) : (            
            <div className="table-responsive">
              <div className="col-md-4">
                Status 
                <select
                  name="status"
                  className="form-select"
                  //onChange={handleChange}
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
                  
                  {logs.map((log, i) => (
                   
                    <tr key={i}>
                      { console.log("log",log)}
                      <td>#{log.packageId}</td>
                      <td>{log.customer?.[0]?.name || 'N/A'}</td>
                      <td>{log.customer?.[0]?.contact || 'N/A'}</td>
                      <td>{log.driver?.[0]?.name || 'N/A'}</td>
                      <td>{log.source}</td>
                      <td>{log.destination}</td>                      
                      <td><button type='button' className={'btn btn ml-auto text-white ' + (log.status=='Pending' ? 'btn-danger' : (log.status=='Out for Delivery' ? 'btn-primary':'btn-success'))}>{log.status}</button></td>
                      <td><button type="button" className="btn btn-warning ml-auto text-white" 
                        onClick={() => handleViewClick(log.pId)}>
                            Edit
                          </button>
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
