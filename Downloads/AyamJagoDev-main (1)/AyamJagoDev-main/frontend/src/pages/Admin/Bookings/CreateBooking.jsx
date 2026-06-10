import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../../utils/api';

export default function CreateBooking() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    user_id: '',
    vehicle_id: '',
    start_date: '',
    end_date: '',
    payment_method: 'transfer'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${API_BASE_URL}/api/bookings`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert('Booking berhasil dibuat');
      navigate('/admin/bookings');

    } catch (error) {
      console.error(error);
      alert('Gagal membuat booking');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Create Booking</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="number"
          name="user_id"
          placeholder="User ID"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="number"
          name="vehicle_id"
          placeholder="Vehicle ID"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="date"
          name="start_date"
          onChange={handleChange}
        />

        <br /><br />

        <input
          type="date"
          name="end_date"
          onChange={handleChange}
        />

        <br /><br />

        <select
          name="payment_method"
          onChange={handleChange}
        >
          <option value="transfer">Transfer</option>
          <option value="cash">Cash</option>
          <option value="qris">QRIS</option>
        </select>

        <br /><br />

        <button type="submit">
          Simpan Booking
        </button>
      </form>
    </div>
  );
}