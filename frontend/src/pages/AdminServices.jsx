import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AdminServices = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      if (!user?.isAdmin) return;
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/services');
        setServices(response.data);
      } catch (error) {
        alert('Failed to load services.');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [user]);

  const handleDelete = async (serviceId) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await axiosInstance.delete(`/api/services/${serviceId}`);
      setServices((prev) => prev.filter((service) => service._id !== serviceId));
    } catch (error) {
      alert('Failed to delete service.');
    }
  };

  const handleEdit = (service) => {
    navigate('/admin/services/add', { state: { service } });
  };

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

  return (
    <div className="min-h-screen bg-[#D7EFFF] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-semibold text-[#0d2440]">Service Management</h1>
          <button
            onClick={() => navigate('/admin/services/add')}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-white text-[#0d2440] font-semibold shadow-md hover:bg-[#f0f4ff]"
          >
            <span className="text-xl">＋</span> Add Service
          </button>
        </div>

        {loading ? (
          <p className="text-center text-[#0d2440]">Loading services...</p>
        ) : services.length === 0 ? (
          <p className="text-center text-[#0d2440]">No services found. Click "Add Service" to create one.</p>
        ) : (
          <div className="overflow-x-auto rounded-3xl bg-white shadow-lg">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#142C3E] text-white">
                  <th className="px-4 py-3 rounded-tl-3xl">Service Name</th>
                  <th className="px-4 py-3">Description</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3 rounded-tr-3xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service, index) => (
                  <tr key={service._id} className="bg-white">
                    <td className="px-4 py-4 border-t border-[#c8e1fb] font-semibold text-[#0d2440]">
                      {service.name}
                    </td>
                    <td className="px-4 py-4 border-t border-[#c8e1fb] text-[#0d2440]">
                      {service.description}
                    </td>
                    <td className="px-4 py-4 border-t border-[#c8e1fb] text-[#0d2440] font-semibold">
                      {Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(service.price ?? 0)}
                    </td>
                    <td className="px-4 py-4 border-t border-[#c8e1fb]">
                      <div className="flex gap-3">
                        <button
                          className="hover:opacity-80"
                          onClick={() => handleDelete(service._id)}
                          aria-label="Delete service"
                        >
                          <img src="/Delete.png" alt="Delete service" className="h-6 w-6" />
                        </button>
                        <button
                          className="hover:opacity-80"
                          onClick={() => handleEdit(service)}
                          aria-label="Edit service"
                        >
                          <img src="/Update.png" alt="Edit service" className="h-6 w-6" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminServices;