import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ServerUrl } from '../Constant';

const AssignDriver = () => {
  const location = useLocation();
  const { id } = location.state || {};

  const [formData, setFormData] = useState({
  
  });

  const [drivers, setDrivers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.post(ServerUrl + '/get-package-drivers', {
          pId: id,
        });

        const data = response.data;       
        setFormData(data.packageId)
        if (data.drivers) {
          setDrivers(data.drivers);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPackage();
  }, [id]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    
      const selectedDriver = JSON.parse(document.getElementById("driverdet").value);
      const payload = {
        pId:id,
        driver:selectedDriver       
        
      };

      const response = await axios.post(ServerUrl + '/assign-driver', payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.status === 'success') {
        Swal.fire({
          title: response.data.message,
          icon: 'success',
          timer: 5000,
          timerProgressBar: true,
          allowOutsideClick: false,
        });
      } else {
        Swal.fire({
          title: response.data.message,
          icon: 'warning',
          timer: 5000,
          timerProgressBar: true,
          allowOutsideClick: false,
        });
      }

      navigate('/view-package');
    } catch (err) {
      console.error('Error:', err);
      alert('Error: Could not process the delivery ❌');
    }
  };

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">Assign Driver</h4>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Package Details */}
            <h5 className="mb-3 mt-2 text-primary border-bottom pb-2">Assign Driver</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Package ID</label>
                <input
                  type="text"
                  name="packageId"
                  className="form-control"
                  value={formData}
                  readOnly
                />
              </div>            
            </div> 

            {/* Driver Dropdown */}
            <div className="row g-3 mt-4">
              <div className="col-md-4">
                <label className="form-label">Assign Driver</label>
                <select
                  name="driverId"
                  className="form-select"
                  value={formData.driverId}
                  id="driverdet"
                  required
                >
                  <option value="">-- Select Driver --</option>
                  {drivers.map((driver) => (
                <option
                key={driver.driverId}
                value={JSON.stringify({
                  id: driver.driverId,
                  name: driver.name,
                  contact: driver.contact,
                })}
              >
                {driver.name} ({driver.contact})
              </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className="text-end mt-5">
              <button type="submit" className="btn btn-success px-4">
                ✅ Assign Driver
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AssignDriver;
