import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const statusOptions = ['Unassigned', 'Assigned', 'Unavailable'];

const AdminAddStaff = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', role: '', phone: '', status: 'Unassigned', assignedBookings: [] });
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [bookingOptions, setBookingOptions] = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  // if the staff is passed through navigation state, load the staff data into the form for editing
  useEffect(() => {
    if (location.state?.staff) {
      const staff = location.state.staff;
      setForm({
        name: staff.name,
        role: staff.role,
        phone: staff.phone,
        status: staff.status || 'Unassigned',
        assignedBookings: staff.assignedBookings || [],
      });
      setEditingId(staff._id);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  // fetch all bookings for the dropdown options
  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.isAdmin) return;
      setBookingsLoading(true);
      try {
        const response = await axiosInstance.get('/api/bookings/admin/all');
        setBookingOptions(response.data);
      } catch (error) {
        console.error('Failed to fetch bookings for staff assignment');
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

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

  const handleAssignedBookingsChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, assignedBookings: value ? [value] : [] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axiosInstance.put(`/api/staff/${editingId}`, form);
        alert('Staff updated successfully.');
      } else {
        await axiosInstance.post('/api/staff', form);
        alert('Staff added successfully.');
      }
      setForm({ name: '', role: '', phone: '', status: 'Unassigned', assignedBookings: [] });
      setEditingId(null);
      navigate('/admin/staff');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to save staff member. Please try again.';
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
            {isEditing ? 'Manage Staff' : 'Add Staff'}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              name="name"
              placeholder="Staff Name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-2xl bg-[#C1D8F0] drop-shadow-lg py-3 px-6 text-[#0d2440] focus:outline-none focus:ring-2 focus:ring-[#6aa7ff]"
              required
            />
            <input
              type="text"
              name="role"
              placeholder="Role"
              value={form.role}
              onChange={handleChange}
              className="w-full rounded-2xl bg-[#C1D8F0] drop-shadow-lg py-3 px-6 text-[#0d2440] focus:outline-none focus:ring-2 focus:ring-[#6aa7ff]"
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              className="w-full rounded-2xl bg-[#C1D8F0] drop-shadow-lg py-3 px-6 text-[#0d2440] focus:outline-none focus:ring-2 focus:ring-[#6aa7ff]"
              required
            />
            {isEditing && (
              <>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-2xl bg-[#C1D8F0] drop-shadow-lg py-3 px-6 text-[#0d2440] focus:outline-none focus:ring-2 focus:ring-[#6aa7ff]"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <select
                  name="assignedBookings"
                  value={form.assignedBookings[0] || ''}
                  onChange={handleAssignedBookingsChange}
                  className="w-full rounded-2xl bg-[#C1D8F0] drop-shadow-lg py-3 px-6 text-[#0d2440] focus:outline-none focus:ring-2 focus:ring-[#6aa7ff]"
                >
                  <option value="" disabled>
                    Assigned Booking
                  </option>
                  {bookingsLoading && <option>Loading bookings...</option>}
                  {!bookingsLoading && bookingOptions.length === 0 && <option value="no-booking">No bookings available</option>}
                  {!bookingsLoading &&
                    bookingOptions.map((booking) => (
                      <option key={booking._id} value={booking._id}>
                        Booking ID: {booking._id.slice(-5).toUpperCase()}
                      </option>
                    ))}
                </select>
              </>
            )}
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-48 rounded-full bg-[#C1D8F0] text-[#0d2440] font-semibold py-3 hover:bg-[#93A9C0] transition drop-shadow-lg"
                disabled={loading}
              >
                {loading ? 'Saving...' : isEditing ? 'Update Staff' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminAddStaff;