import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AdminStaff = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      if (!user?.isAdmin) return;
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/staff');
        setStaff(response.data);
      } catch (error) {
        alert('Failed to load staff members.');
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, [user]);

  const handleDelete = async (staffId) => {
    if (!window.confirm('Delete this staff member?')) return;
    try {
      await axiosInstance.delete(`/api/staff/${staffId}`);
      setStaff((prev) => prev.filter((member) => member._id !== staffId));
    } catch (error) {
      alert('Failed to delete staff member.');
    }
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
          <h1 className="text-4xl lone font-semibold text-[#0d2440]">Staff Management</h1>
          <button
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-white text-[#0d2440] font-semibold shadow-md hover:bg-[#f0f4ff]"
            onClick={() => navigate('/admin/staff/add')}
          >
            <span className="text-xl">＋</span> Add Staff
          </button>
        </div>

        {loading ? (
          <p className="text-center text-[#0d2440]">Loading staff...</p>
        ) : staff.length === 0 ? (
          <p className="text-center text-[#0d2440]">No staff found.</p>
        ) : (
          <div className="overflow-x-auto rounded-3xl bg-white shadow-lg">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-[#142C3E] text-white">
                  <th className="px-4 py-3 rounded-tl-3xl">Staff Name</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Phone Number</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Assigned Booking</th>
                  <th className="px-4 py-3 rounded-tr-3xl">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => (
                  <tr key={member._id} className="bg-white">
                    <td className="px-4 py-4 border-t border-[#c8e1fb] font-semibold text-[#0d2440]">
                      {member.name}
                    </td>
                    <td className="px-4 py-4 border-t border-[#c8e1fb]">{member.role}</td>
                    <td className="px-4 py-4 border-t border-[#c8e1fb]">{member.phone}</td>
                    <td className="px-4 py-4 border-t border-[#c8e1fb]">{member.status}</td>
                    <td className="px-4 py-4 border-t border-[#c8e1fb]">
                      {member.assignedBookings && member.assignedBookings.length > 0
                        ? member.assignedBookings.join(', ')
                        : '-'}
                    </td>
                    <td className="px-4 py-4 border-t border-[#c8e1fb]">
                      <div className="flex gap-3">
                        <button
                          className="hover:opacity-80"
                          onClick={() => handleDelete(member._id)}
                          aria-label="Delete staff"
                        >
                          <img src="/Delete.png" alt="Delete staff" className="h-6 w-6" />
                        </button>
                        <button
                          className="hover:opacity-80"
                          onClick={() => navigate('/admin/staff/add', { state: { staff: member } })}
                          aria-label="Edit staff"
                        >
                          <img src="/Update.png" alt="Edit staff" className="h-6 w-6" />
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

export default AdminStaff;