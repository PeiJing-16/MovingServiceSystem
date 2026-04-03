import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';

const TABS = [
  { key: 'pending', label: 'Pending Booking' },
  { key: 'scheduled', label: 'Scheduled Booking' },
  { key: 'history', label: 'History Booking' },
];

const statusMatchesTab = (booking, tab) => {
  if (tab === 'pending') return booking.status === 'pending';
  if (tab === 'scheduled') return booking.status === 'confirmed';
  return booking.status === 'completed' || booking.status === 'cancelled';
};

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleDateString();
};

const UserManageBooking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/bookings', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setBookings(response.data);
      } catch (error) {
        alert('Failed to fetch bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const filteredBookings = useMemo(
    () => bookings.filter((booking) => statusMatchesTab(booking, activeTab)),
    [bookings, activeTab]
  );

  const handleDelete = async (bookingId) => {
    if (!window.confirm('Confirm to cancel this booking?')) return;
    try {
      await axiosInstance.delete(`/api/bookings/${bookingId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setBookings((prev) => prev.filter((booking) => booking._id !== bookingId));
    } catch (error) {
      alert('Failed to cancel booking.');
    }
  };

  const handleEdit = (booking) => {
    navigate('/bookings/create', { state: { booking } });
  };

  if (!user) {
    return <div className="text-center mt-20">Please log in to view your bookings.</div>;
  }

  return (
    <div className="min-h-screen flex items-start justify-center py-10 px-6">
      <div className="w-full max-w-6xl">
        <div className="flex flex-wrap gap-4 mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              className={`px-6 py-2 rounded-full font-semibold transition drop-shadow-lg ${
                activeTab === tab.key
                  ? 'bg-[#93A9C0] text-black'
                  : 'bg-[#142C3E] text-white'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-black">Loading bookings...</p>
        ) : filteredBookings.length === 0 ? (
          <p className="text-center text-black">There is no booking for this category.</p>
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-white shadow-lg">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-[#142C3E] text-white">
                  <th className="px-4 py-3 rounded-tl-2xl">Service Type</th>
                  <th className="px-4 py-3">Property Type</th>
                  <th className="px-4 py-3">Pick Up Address</th>
                  <th className="px-4 py-3">Destination Address</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Time</th>
                  <th className="px-4 py-3">Remark</th>
                  <th className="px-4 py-3">Status</th>
                  {activeTab === 'pending' && <th className="px-4 py-3 rounded-tr-2xl ">Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => (
                  <tr
                    key={booking._id}
                    className="bg-white"
                  >
                    <td className="px-4 py-3 border border-[#93A9C0] font-semibold text-black">
                      {booking.serviceType}
                    </td>
                    <td className="px-4 py-3 border border-[#93A9C0]">{booking.propertyType}</td>
                    <td className="px-4 py-3 border border-[#93A9C0]">{booking.pickupAddress}</td>
                    <td className="px-4 py-3 border border-[#93A9C0]">{booking.destinationAddress}</td>
                    <td className="px-4 py-3 border border-[#93A9C0]">{formatDate(booking.date)}</td>
                    <td className="px-4 py-3 border border-[#93A9C0]">{booking.time || '—'}</td>
                    <td className="px-4 py-3 border border-[#93A9C0] text-sm">{booking.remarks || '—'}</td>
                    <td className="px-4 py-3 border border-[#93A9C0] capitalize">{booking.status}</td>
                    {activeTab === 'pending' && (
                      <td className="px-4 py-3 border border-[#93A9C0]">
                        <div className="flex gap-4">
                          <button
                            className="hover:text-[#2563eb]"
                            onClick={() => handleEdit(booking)}
                            aria-label="Edit booking"
                          >
                            Edit
                          </button>
                          
                          <button
                            className="hover:text-[#dc2626]"
                            onClick={() => handleDelete(booking._id)}
                            aria-label="Delete booking"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    )}
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

export default UserManageBooking;