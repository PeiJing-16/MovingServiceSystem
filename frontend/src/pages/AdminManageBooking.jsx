import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const decisionOptions = [
  { label: 'Keep Pending', value: '' },
  { label: 'Accept Booking', value: 'confirmed' },
  { label: 'Cancel Booking', value: 'cancelled' },
];

// to extract assigned staff id from the booking data
const extractAssignedStaffIds = (value) => {
  if (!value) return [];
  if (Array.isArray(value)) {
    return value
      .map((entry) => (typeof entry === 'string' ? entry : entry?._id))
      .filter(Boolean);
  }
  if (typeof value === 'object') {
    return value?._id ? [value._id] : [];
  }
  return value ? [value] : [];
};

const AdminManageBooking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const booking = location.state?.booking;
  const [staffOptions, setStaffOptions] = useState([]);
  const [assignedStaff, setAssignedStaff] = useState([]);
  const [statusDecision, setStatusDecision] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!booking) {
      navigate('/admin/bookings');
    } else {
      setAssignedStaff(extractAssignedStaffIds(booking.assignedStaff));
    }
  }, [booking, navigate]);

  useEffect(() => {
    const fetchStaff = async () => {
      if (!user?.isAdmin) return;
      try {
        const response = await axiosInstance.get('/api/staff');
        setStaffOptions(response.data);
      } catch (error) {
        alert('Failed to load staff options.');
      }
    };

    fetchStaff();
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

  if (!booking) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axiosInstance.put(`/api/bookings/admin/${booking._id}`, {
        assignedStaff,
        status: statusDecision || booking.status,
      });
      alert('Booking updated successfully.');
      navigate('/admin/bookings');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update booking. Please try again.';
      alert(message);
    } finally {
      setSaving(false);
    }
  };

  const bookingIdDisplay = booking._id.slice(-5).toUpperCase();


  // format assigned staff for display in the booking
  const handleStaffChange = (event) => {
    const selected = Array.from(event.target.selectedOptions)
      .map((option) => option.value)
      .filter(Boolean);
    setAssignedStaff(selected);
  };

  return (
    <div className="min-h-screen bg-[#D7EFFF] flex items-center justify-center p-6">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white/90 border border-[#c8e1fb] px-8 py-12 shadow-2xl">
        <img
          src="/BookingBg.jpg"
          alt="illustration"
          aria-hidden="true"
          className="pointer-events-none select-none absolute inset-0 w-full h-full object-cover opacity-10"
        />
        <div className="relative space-y-6">
          <h1 className="text-4xl font-semibold text-center text-[#0d2440]">
            Booking ID: {bookingIdDisplay}
          </h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input value={booking.user?.name || 'Unknown'} readOnly className="rounded-2xl bg-[#C1D8F0] py-3 px-6" />
              <input value={booking.user?.phone || '—'} readOnly className="rounded-2xl bg-[#C1D8F0] py-3 px-6" />
              <input value={booking.pickupAddress} readOnly className="rounded-2xl bg-[#C1D8F0] py-3 px-6" />
              <input value={booking.destinationAddress} readOnly className="rounded-2xl bg-[#C1D8F0] py-3 px-6" />
              <input value={booking.serviceType} readOnly className="rounded-2xl bg-[#C1D8F0] py-3 px-6" />
              <input value={booking.propertyType} readOnly className="rounded-2xl bg-[#C1D8F0] py-3 px-6" />
              <input value={new Date(booking.date).toLocaleDateString()} readOnly className="rounded-2xl bg-[#C1D8F0] py-3 px-6" />
              <input value={booking.time || '—'} readOnly className="rounded-2xl bg-[#C1D8F0] py-3 px-6" />
            </div>
            <textarea
              value={booking.remarks || '—'}
              readOnly
              className="w-full rounded-2xl bg-[#C1D8F0] py-3 px-6"
              rows={3}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <select
                  multiple
                  value={assignedStaff}
                  onChange={handleStaffChange}
                  className="rounded-2xl bg-[#C1D8F0] py-3 px-6 h-40"
                >
                  {staffOptions.map((staff) => (
                    <option key={staff._id} value={staff._id}>
                      {staff.name}
                    </option>
                  ))}
                </select>
                <p className="text-sm text-[#0d2440]">
                  Hold Ctrl/Cmd to select multiple staff members. Leave empty to keep unassigned.
                </p>
              </div>
              <select
                value={statusDecision}
                onChange={(e) => setStatusDecision(e.target.value)}
                className="rounded-2xl bg-[#C1D8F0] py-3 px-6"
              >
                {decisionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="w-48 rounded-full bg-[#C1D8F0] text-[#0d2440] font-semibold py-3 hover:bg-[#93A9C0] transition drop-shadow-lg"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminManageBooking;