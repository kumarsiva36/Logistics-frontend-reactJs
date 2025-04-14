import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import {  ServerUrl } from "../Constant";

const EditDriverForm = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const navigate = useNavigate();

  const [driverName, setDriverName] = useState('');
  const [driverContact, setDriverContact] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await axios.post(ServerUrl+'/edit-driver', { driverId: id });
        const data = response.data.result?.[0];
        if (data) {
          setDriverName(data.name);
          setDriverContact(data.contact);
          setLocationInput(data.location);
        }
      } catch (error) {
        console.error('Error fetching driver:', error);
      }
    };

    fetchDriver();
  }, [id]);

  const handleBack = () => {
    navigate('/view-package');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const geoRes = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput)}`
      );

      if (!geoRes.data || geoRes.data.length === 0) {
        throw new Error('Could not find coordinates for the location');
      }

      const { lat, lon } = geoRes.data[0];

      const payload = {
        driverId: id,
        name: driverName,
        contact: driverContact,
        location: locationInput,
        locationcoord: {"type": "Point",
          coordinates: [parseFloat(lon), parseFloat(lat)], // lng, lat
        },
      };

      const response = await axios.post(ServerUrl+'/update-driver', payload);

      if (response.data.status === 'success') {
        Swal.fire({
          title: response.data.message,
          icon: 'success',
          timer: 5000,
          timerProgressBar: true,
          allowOutsideClick: false,
        });
        navigate('/view-driver');
      }
    } catch (error) {
      console.error('Failed to update driver:', error);
      alert('❌ Failed to update driver');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow border-0">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">✏️ Edit Driver Details</h4>
          <button className="btn btn-outline-light bg-white text-black btn-sm" onClick={handleBack}>
            Back to List
          </button>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="border rounded p-3 mb-4 bg-light-subtle">
              <h5 className="text-primary mb-3">Driver Information</h5>
              <div className="row g-4">
                <div className="col-md-4">
                  <label className="form-label">Driver Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={driverName}
                    onChange={(e) => setDriverName(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Driver Contact</label>
                  <input
                    type="tel"
                    className="form-control"
                    value={driverContact}
                    onChange={(e) => setDriverContact(e.target.value)}
                    required
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Location</label>
                  <input
                    type="text"
                    className="form-control"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-success px-5 py-2" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : '✅ Update Driver'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditDriverForm;
