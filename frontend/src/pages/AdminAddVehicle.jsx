import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const vehicleTypes = ['Ute', 'Truck', 'Van'];

const AdminAddVehicle = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    vehicleType: 'Ute',
    capacityKg: '',
    regoNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    if (location.state?.vehicle) {
      const vehicle = location.state.vehicle;
      setForm({
        vehicleType: vehicle.vehicleType || 'Ute',
        capacityKg: vehicle.capacityKg || '',
        regoNumber: vehicle.regoNumber || '',
      });
      setEditingId(vehicle._id);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-[#D7EFFF] flex items-center justify-center p-6 text-center">
        <div className="bg-white/90 rounded-2xl shadow-xl p-10 max-w-lg">
          <h1 className="text-2xl font-semibold text-[#0d2440] mb-4">Admin Only</h1>
          <p className="text-[#546b86] mb-6">
            This page is restricted to admin accounts. Please log in with admin credentials.
          </p>
          <button
            onClick={() => navigate('/admin')}
            className="px-6 py-3 rounded-full bg-[#142C3E] text-white font-semibold hover:bg-[#0f1b2c]"
          >
            Go to Admin Login
          </button>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.regoNumber.length !== 7) {
      alert('Rego number must be exactly 7 characters.');
      return;
    }

    setLoading(true);

    try {
      if (editingId) {
        await axiosInstance.put(`/api/vehicles/${editingId}`, form);
        alert('Vehicle updated successfully.');
      } else {
        await axiosInstance.post('/api/vehicles', form);
        alert('Vehicle added successfully.');
      }

      setForm({
        vehicleType: 'Ute',
        capacityKg: '',
        regoNumber: '',
      });

      setEditingId(null);
      navigate('/admin/vehicle');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to save vehicle. Please try again.';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  const isEditing = Boolean(editingId);

  return (
    <div className="min-h-screen bg-[#D7EFFF] flex items-center justify-center p-6">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white/90 border border-[#c8e1fb] px-8 py-12 shadow-2xl">
        <img
          src="/ServiceBg.jpg"
          alt="illustration"
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-0 w-full h-full object-cover opacity-10"
        />

        <div className="relative">
          <h1 className="text-4xl font-semibold text-center text-[#0d2440] mb-10">
            {isEditing ? 'Manage Vehicle' : 'Add Vehicle'}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <select
              name="vehicleType"
              value={form.vehicleType}
              onChange={handleChange}
              className="w-full rounded-2xl bg-[#C1D8F0] drop-shadow-lg py-3 px-6 text-[#0d2440] focus:outline-none focus:ring-2 focus:ring-[#6aa7ff]"
              required
            >
              {vehicleTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <input
              type="number"
              name="capacityKg"
              placeholder="Capacity in kg"
              value={form.capacityKg}
              onChange={handleChange}
              className="w-full rounded-2xl bg-[#C1D8F0] drop-shadow-lg py-3 px-6 text-[#0d2440] focus:outline-none focus:ring-2 focus:ring-[#6aa7ff]"
              required
            />

            <input
              type="text"
              name="regoNumber"
              placeholder="Rego Number"
              value={form.regoNumber}
              onChange={handleChange}
              maxLength="7"
              className="w-full rounded-2xl bg-[#C1D8F0] drop-shadow-lg py-3 px-6 text-[#0d2440] focus:outline-none focus:ring-2 focus:ring-[#6aa7ff]"
              required
            />

            <div className="flex justify-center">
              <button
                type="submit"
                className="w-48 rounded-full bg-[#C1D8F0] text-[#0d2440] font-semibold py-3 hover:bg-[#93A9C0] transition drop-shadow-lg"
                disabled={loading}
              >
                {loading ? 'Saving...' : isEditing ? 'Update Vehicle' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddVehicle;