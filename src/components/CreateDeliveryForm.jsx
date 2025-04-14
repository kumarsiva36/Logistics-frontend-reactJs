import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import {  ServerUrl } from "../Constant";
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


const CreateDeliveryForm = () => {
  const [formData, setFormData] = useState({
    packageId: '',
    source: '',
    destination: '',
    status: 'Pending',
    customerName: '',
    customerContact: '',
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const sourceCoords = await getCoordinates(formData.source);
      const destCoords = await getCoordinates(formData.destination);

      const payload = {
        packageId: formData.packageId,
        source: formData.source,
        sourceLocation: {
          coordinates: [ sourceCoords.lng,sourceCoords.lat],
        },
        destination: formData.destination,
        destinationLocation: {
          coordinates: [ destCoords.lng,destCoords.lat],
        },
        status: formData.status,
        customer: {
          name: formData.customerName,
          contact: formData.customerContact,
        },
      };

      const response = await axios.post(ServerUrl+'/addpackage', payload, {
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

  const handleViewClick = () => {
    navigate('/view-package');
  };

  return (
    <div className="container py-5">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">🚚 Create Delivery Package</h4>
          {/* <button className="btn btn-outline-light btn-sm" onClick={handleViewClick}>
            📦 View All Packages
          </button> */}
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Package Details */}
            <h5 className="mb-3 mt-2 text-primary border-bottom pb-2">Package Details</h5>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label"> Package ID</label>
                <input
                  type="text"
                  name="packageId"
                  className="form-control"
                  value={formData.packageId}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label"> Source City</label>
                <input
                  type="text"
                  name="source"
                  className="form-control"
                  value={formData.source}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <label className="form-label"> Destination City</label>
                <input
                  type="text"
                  name="destination"
                  className="form-control"
                  value={formData.destination}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Customer Info */}
            <h5 className="mb-3 mt-4 text-primary border-bottom pb-2">Customer Details</h5>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label"> Customer Name</label>
                <input
                  type="text"
                  name="customerName"
                  className="form-control"
                  value={formData.customerName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label"> Customer Contact</label>
                <input
                  type="text"
                  name="customerContact"
                  className="form-control"
                  value={formData.customerContact}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Status */}
            <div className="row g-3 mt-4">
              <div className="col-md-4">
                <label className="form-label"> Status</label>
                <select
                  name="status"
                  className="form-select"
                  value={formData.status}
                  onChange={handleChange}
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
                ✅ Submit Package
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDeliveryForm;
