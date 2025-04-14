import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ServerUrl } from '../Constant';

const getCoordinates = async (place) => {
  const response = await axios.get('https://nominatim.openstreetmap.org/search', {
    params: { format: 'json', q: place },
  });

  const data = response.data;
  if (data.length > 0) {
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
    };
  } else {
    throw new Error(`Could not find coordinates for: ${place}`);
  }
};

const UpdateStatus = () => {
  const location = useLocation();
  const { id, status, pid } = location.state;
console.log("pid",id,pid,status)
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    
   
      const payload = {
        pId:id,
        status:document.getElementById("statusval").value
        
        
      };

      const response = await axios.post(ServerUrl + '/status-update', payload, {
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
          <h4 className="mb-0">Update Status</h4>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Package Details */}
            <h5 className="mb-3 mt-2 text-primary border-bottom pb-2">Update Status</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Package ID</label>
                <input
                  type="text"
                  name="packageId"
                  className="form-control"
                  value={pid}
                  readOnly
                />
              </div>            
            </div>

            {/* Driver Dropdown */}
            <div className="row g-3 mt-4">
              <div className="col-md-4">
                <label className="form-label">Assign Driver</label>
                <select
                  name="status"
                  className="form-select"
                  defaultValue={status}
                  id="statusval"
                  // onChange={handleChange}
                >
                    <option value="Pending">Pending</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className="text-end mt-5">
              <button type="submit" className="btn btn-success px-4">
                ✅ Update Status
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatus;
