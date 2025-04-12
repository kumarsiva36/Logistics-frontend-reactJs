import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';

const CreateDriverForm = () => {
  const { id } = useParams(); // Optional, if needed for associating delivery
  const [driverName, setDriverName] = useState('');
  const [driverContact, setDriverContact] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    if (!driverName || !driverContact || !location) {
      setMessage({ type: 'danger', text: '❗ Please fill out all fields' });
      setIsSubmitting(false);
      return;
    }

    try {
      const geoRes = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
      );

      if (!geoRes.data || geoRes.data.length === 0) {
        throw new Error('Could not find coordinates for the location');
      }

      const { lat, lon } = geoRes.data[0];
      const payload = {
        name: driverName,
        contact: driverContact,
        location,
        locationcoord: {
          coordinates: [parseFloat(lat), parseFloat(lon)],
        },
      };

      const response = await axios.post('http://192.168.1.106:5000/api/add-driver', payload);
      setMessage({ type: 'success', text: '✅ Driver added successfully!' });
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

      // Optional: clear form after success
      setDriverName('');
      setDriverContact('');
      setLocation('');
    } catch (error) {
      console.error(error);
      setMessage({ type: 'danger', text: '❌ Failed to add driver. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h5 className="mb-0">Create Driver Details</h5>
        </div>
        <div className="card-body">
          {message && (
            <div className={`alert alert-${message.type}`}>{message.text}</div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Driver Name</label>
              <input
                className="form-control"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Driver Contact</label>
              <input
                className="form-control"
                value={driverContact}
                onChange={(e) => setDriverContact(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Location</label>
              <input
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>
            <div className="d-flex justify-content-end">
              <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateDriverForm;
