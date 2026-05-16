import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AdminVehicle = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      if (!user?.isAdmin) return;

      setLoading(true);

      try {
        const response = await axiosInstance.get('/api/vehicles');
        setVehicles(response.data);
      } catch (error) {
        alert('Failed to load vehicles.');
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [user]);

  const handleDelete = async (vehicleId) => {
    if (!window.confirm('Delete this vehicle?')) return;

    try {
      await axiosInstance.delete(`/api/vehicles/${vehicleId}`);
      setVehicles((prev) =>
        prev.filter((vehicle) => vehicle._id !== vehicleId)
      );
    } catch (error) {
      alert('Failed to delete vehicle.');
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen bg-[#D7EFFF] flex items-center justify-center p-6 text-center">
        <div className="bg-white/90 rounded-2xl shadow-xl p-10 max-w-lg">
          <h1 className="text-2xl font-semibold text-[#0d2440] mb-4">
            Admin Only
          </h1>
          <p className="text-[#546b86] mb-6">
            This page is restricted to admin accounts.
          </p>
          <button
            onClick={() => navigate('/admin')}
            className="px-6 py-3 rounded-full bg-[#142C3E] text-white"
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
          <h1 className="text-4xl font-semibold text-[#0d2440]">
            Vehicle Management
          </h1>

          <button
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-white text-[#0d2440] font-semibold shadow-md hover:bg-[#f0f4ff]"
            onClick={() => navigate('/admin/vehicle/add')}
          >
            <span className="text-xl">＋</span> Add Vehicle
          </button>
        </div>

        {loading ? (
          <p className="text-center text-[#0d2440]">
            Loading vehicles...
          </p>
        ) : vehicles.length === 0 ? (
          <p className="text-center text-[#0d2440]">
            No vehicles found.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-3xl bg-white shadow-lg">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#142C3E] text-white">
                  <th className="px-4 py-3 rounded-tl-3xl">
                    Vehicle Type
                  </th>
                  <th className="px-4 py-3">
                    Capacity (kg)
                  </th>
                  <th className="px-4 py-3">
                    Rego Number
                  </th>
                  <th className="px-4 py-3 rounded-tr-3xl">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle._id} className="bg-white">
                    <td className="px-4 py-4 border-t border-[#c8e1fb] font-semibold text-[#0d2440]">
                      {vehicle.vehicleType}
                    </td>

                    <td className="px-4 py-4 border-t border-[#c8e1fb]">
                      {vehicle.capacityKg}
                    </td>

                    <td className="px-4 py-4 border-t border-[#c8e1fb]">
                      {vehicle.regoNumber}
                    </td>

                    <td className="px-4 py-4 border-t border-[#c8e1fb]">
                      <div className="flex gap-3">

                        <button
                          className="hover:opacity-80"
                          onClick={() => handleDelete(vehicle._id)}
                        >
                          <img
                            src="/Delete.png"
                            alt="Delete vehicle"
                            className="h-6 w-6"
                          />
                        </button>

                        <button
                          className="hover:opacity-80"
                          onClick={() =>
                            navigate('/admin/vehicle/add', {
                              state: { vehicle }
                            })
                          }
                        >
                          <img
                            src="/Update.png"
                            alt="Edit vehicle"
                            className="h-6 w-6"
                          />
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

export default AdminVehicle;