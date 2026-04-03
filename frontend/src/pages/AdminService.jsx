import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const initialServices = [
  {
    id: 1,
    name: 'Office Relocation Service',
    description:
      'Supports businesses in moving office furniture, equipment, and documents from one location to another with minimal disruption.',
    price: 'AUD 900',
  },
  {
    id: 2,
    name: 'Home Relocation Service',
    description:
      'Provides full moving support for customers relocating from one home or apartment to another, including loading, transport, and unloading of household items.',
    price: 'AUD 500',
  },
  {
    id: 3,
    name: 'Furniture Moving Service',
    description:
      'Designed for customers who need to move large or heavy individual items such as sofas, beds, dining tables, wardrobes, or appliances.',
    price: 'AUD 180',
  },
];

const AdminService = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [services] = useState(initialServices);

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
    <div className="min-h-screen bg-[#CFE6FF] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-sm uppercase tracking-wider text-[#546b86]">Admin</p>
            <h1 className="text-4xl font-semibold text-[#0d2440]">Service Management</h1>
          </div>
          <button
            type="button"
            className="flex items-center gap-2 bg-white text-[#0d2440] font-semibold px-5 py-3 rounded-full shadow"
            disabled
          >
            <span className="text-xl">＋</span>
            Add Service
          </button>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-[#142C3E] text-white">
              <tr>
                <th className="px-6 py-4">Service Name</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4 w-32">Price</th>
                <th className="px-6 py-4 w-24 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service, index) => (
                <tr
                  key={service.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-[#F6FBFF]'}
                >
                  <td className="px-6 py-4 text-[#0d2440] font-semibold">{service.name}</td>
                  <td className="px-6 py-4 text-[#546b86]">{service.description}</td>
                  <td className="px-6 py-4 text-[#0d2440] font-semibold">{service.price}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-3 text-[#0d2440]">
                      <button
                        className="p-2 rounded-full bg-[#E2E8F0] text-sm"
                        title="Delete service"
                        disabled
                      >
                        🗑️
                      </button>
                      <button
                        className="p-2 rounded-full bg-[#E2E8F0] text-sm"
                        title="Edit service"
                        disabled
                      >
                        ✏️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminService;
