import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AdminAddService = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [loading, setLoading] = useState(false);

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

    /*Set price cannot be negative or non-numeric.*/
    const numericPrice = Number(form.price);
    if (Number.isNaN(numericPrice) || numericPrice < 0) {
      alert('Price must be zero or a positive value.');
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post('/api/services', {
        name: form.name,
        description: form.description,
        price: Number(form.price) || 0,
      });
      alert('Service added successfully.');
      setForm({ name: '', description: '', price: '' });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to add service. Please try again.';
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#D7EFFF] flex items-center justify-center p-6">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white/90 border border-[#c8e1fb] px-8 py-12 shadow-2xl">
        <div className="relative">
          <h1 className="text-4xl font-semibold text-center text-[#0d2440] mb-10">Add Service</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              placeholder="Service Name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-2xl bg-[#C1D8F0] drop-shadow-lg py-3 px-6 text-[#0d2440] focus:outline-none focus:ring-2 focus:ring-[#93A9C0]"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              rows={5}
              className="w-full rounded-2xl bg-[#C1D8F0] drop-shadow-lg py-3 px-6 text-[#0d2440] focus:outline-none focus:ring-2 focus:ring-[#93A9C0]"
              required
            />
            <input
              type="number"
              name="price"
              step={0.01}
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="w-full rounded-2xl bg-[#C1D8F0] drop-shadow-lg py-3 px-6 text-[#0d2440] focus:outline-none focus:ring-2 focus:ring-[#93A9C0]"
              required
            />
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-48 rounded-full bg-[#C1D8F0] text-[#0d2440] font-semibold py-3 hover:bg-[#93A9C0] transition drop-shadow-lg"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddService;