import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const ADMIN_TABS = [
  { key: 'pending', label: 'Pending Booking' },
  { key: 'confirmed', label: 'Scheduled Booking' },
  { key: 'completed', label: 'Completed Booking' },
  { key: 'cancelled', label: 'Cancelled Booking' },
];

const statusMatches = (booking, tab) => booking.status === tab;

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString();
};

const formatTime = (value) => value || '—';

const formatStaffList = (assignedStaff) => {
  if (!assignedStaff || (Array.isArray(assignedStaff) && assignedStaff.length === 0)) {
    return 'Unassigned';
  }
  const staffArray = Array.isArray(assignedStaff) ? assignedStaff : [assignedStaff];
  const formatted = staffArray
    .filter(Boolean)
    .map((staff) => {
      if (typeof staff === 'string') {
        return staff;
      }
      const name = staff?.name || 'Unnamed';
      return staff?.role ? `${name} (${staff.role})` : name;
    })
    .join(', ');
  return formatted || 'Unassigned';
};

const AdminBooking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllBookings = async () => {
      if (!user?.isAdmin) return;
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/bookings/admin/all');
        setBookings(response.data);
      } catch (error) {
        alert('Failed to load bookings for admin.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, [user]);

  const filteredBookings = useMemo(() => {
    if (!user?.isAdmin) {
      return [];
    }
    return bookings.filter((booking) => statusMatches(booking, activeTab));
  }, [bookings, activeTab, user]);

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

  const handleCardAction = (type, booking) => {
    if (type === 'edit') {
      navigate('/admin/bookings/manage', { state: { booking } });
    }
  };

  return (
    <div className="min-h-screen bg-[#D7EFFF] p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-semibold text-[#0d2440] mb-8">Booking Management</h1>

        <div className="flex flex-wrap gap-4 mb-8">
          {ADMIN_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`px-6 py-2 rounded-full font-semibold transition drop-shadow-lg ${
                activeTab === tab.key ? 'bg-[#142C3E] text-white' : 'bg-[#93A9C0] text-[#0d2440]'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-[#0d2440]">Loading bookings...</p>
        ) : filteredBookings.length === 0 ? (
          <p className="text-center text-[#0d2440]">No bookings in this category.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {filteredBookings.map((booking) => (
              <div key={booking._id} className="bg-white rounded-3xl shadow-lg border border-[#c8e1fb] p-6 space-y-2">
                <p className="text-sm text-[#546b86] font-semibold">
                  Booking ID:{' '}
                  <span className="text-[#0d2440]">
                    {booking._id.slice(-5).toUpperCase()}
                  </span>
                </p>
                <p className="text-[#0d2440]">
                  <span className="font-semibold">Pick up Address:</span> {booking.pickupAddress}
                </p>
                <p className="text-[#0d2440]">
                  <span className="font-semibold">Destination Address:</span> {booking.destinationAddress}
                </p>
                <p className="text-[#0d2440]">
                  <span className="font-semibold">Service Type:</span> {booking.serviceType}
                </p>
                <p className="text-[#0d2440]">
                  <span className="font-semibold">Property Type:</span> {booking.propertyType}
                </p>
                <p className="text-[#0d2440]">
                  <span className="font-semibold">Date:</span> {formatDate(booking.date)}
                </p>
                <p className="text-[#0d2440]">
                  <span className="font-semibold">Time:</span> {formatTime(booking.time)}
                </p>
                <p className="text-[#0d2440]">
                  <span className="font-semibold">Status:</span> {booking.status}
                </p>
                <p className="text-[#0d2440]">
                  <span className="font-semibold">Remarks:</span> {booking.remarks || '—'}
                </p>
                <p className="text-[#0d2440]">
                  <span className="font-semibold">Assigned Staff:</span> {formatStaffList(booking.assignedStaff)}
                </p>
                <p className="text-[#0d2440]">
                  <span className="font-semibold">Client:</span> {booking.user?.name || 'Unknown'}
                </p>
                <p className="text-[#0d2440]">
                  <span className="font-semibold">Contact:</span> {booking.user?.email || '—'}
                </p>
                <div className="flex gap-4 pt-4">
                
                  <button
                    onClick={() => handleCardAction('edit', booking)}
                    disabled={['completed', 'cancelled'].includes(booking.status)}
                    className={[
                      'flex-1 rounded-full py-2 font-semibold transition',
                      ['completed', 'cancelled'].includes(booking.status)
                        ? 'bg-gray-400 text-white cursor-not-allowed opacity-70'
                        : 'bg-[#142C3E] text-white hover:bg-[#0f1b2c]'
                    ].join(' ')}
                  >
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminBooking;