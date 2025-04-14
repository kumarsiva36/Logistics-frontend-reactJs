import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {  ServerUrl } from "../Constant";

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
              ServerUrl+'/view-drivers',
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
        navigate('/edit-driver', { state: { id } });
      };
   
const handleBack = () => {
  navigate('/createdriver');
};
  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0"> View Driver Deatils List</h4>
          <button className="btn btn-outline-light bg-white text-black btn-sm" 
          onClick={handleBack}
          >
            ➕Create Driver
          </button>
        </div>
        <div className="card-body">
          {logs.length <= 0 ? (
            <div className="alert alert-warning">No logs available </div>
          ) : (            
            <div className="table-responsive">
             
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-primary">
                  <tr>
                    <th>Driver Name</th>
                    <th>Driver Contact</th>
                    <th>Location</th>
                    <th>Action</th>
                  
                    
                  </tr>
                </thead>
                <tbody>
                  
                  {logs.map((log, i) => (
                   
                    <tr key={i}>
                      <td>{log.name}</td>
                      <td>{log.contact}</td>                   
                      <td>{log.location}</td>                      
                      <td><button type="button" className="btn btn-warning ml-auto text-white" 
                        onClick={() => handleViewClick(log.driverId)}>
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