import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
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

const EditDeliveryForm = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const { packageId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    packageId: '',
    source: '',
    destination: '',
    status: 'Pending',
    customerName: '',
    customerContact: '',
  });

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const response = await axios.post('http://192.168.1.106:5000/api/edit-package', {
          pId: id,
        });

        const data = response.data.result?.[0];
        if (data) {
          setFormData({
            packageId: data.packageId,
            source: data.source,
            destination: data.destination,
            status: data.status,
            customerName: data.customer?.[0]?.name || '',
            customerContact: data.customer?.[0]?.contact || '',
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchPackage();
  }, []);

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
        pId: id,
        packageId: formData.packageId,
        source: formData.source,
        sourceLocation: { type : 'Point',coordinates:[ sourceCoords.lng,sourceCoords.lat]},
        destination: formData.destination,
        destinationLocation: {type : 'Point', coordinates: [ destCoords.lng,destCoords.lat] },
        status: formData.status,
        customer: {
          name: formData.customerName,
          contact: formData.customerContact,
        },
      };

      const response = await axios.post(ServerUrl+'/update-package', payload, {
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
        navigate('/view-package');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update package');
    }
  };

  const handleViewClick = () => {
    navigate('/view-package');
  };

  return (
    <div className="container mt-5">
      <div className="card shadow border-0">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">✏️ Edit Delivery Package</h4>
          <button className="btn btn-outline-light bg-white text-black btn-sm" onClick={handleViewClick}>
            Back to List
          </button>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Package Details */}
            <div className="border rounded p-3 mb-4 bg-light-subtle">
              <h5 className="text-primary mb-3"> Package Details</h5>
              <div className="row g-4">
                <div className="col-md-4">
                  <label className="form-label">Package ID</label>
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
                  <label className="form-label">Source City</label>
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
                  <label className="form-label">Destination City</label>
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
            </div>

            {/* Customer Details */}
            <div className="border rounded p-3 mb-4 bg-light-subtle">
              <h5 className="text-primary mb-3"> Customer Details</h5>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label">Customer Name</label>
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
                  <label className="form-label">Customer Contact</label>
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
            </div>

            {/* Status Section */}
            <div className="border rounded p-3 mb-4 bg-light-subtle">
              <h5 className="text-primary mb-3"> Delivery Status</h5>
              <div className="col-md-4">
                <label className="form-label">Status</label>
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

            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-success px-5 py-2">
                ✅ Update Package
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDeliveryForm;
