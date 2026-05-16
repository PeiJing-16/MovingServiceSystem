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

const STATUS_STYLES = {
  pending: 'bg-amber-100 text-amber-800 border border-amber-200',
  confirmed: 'bg-sky-100 text-sky-800 border border-sky-200',
  completed: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  cancelled: 'bg-rose-100 text-rose-800 border border-rose-200',
};

const statusMatches = (booking, tab) => booking.status === tab;

// Helper functions to format booking details for display
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

const formatInventoryItems = (booking) => {
  const listedItems =
    booking.inventoryItems?.map((item) =>
      typeof item === 'string' ? item : item.itemName
    ) || [];

  const customItems = booking.customItems || [];

  const allItems = [...listedItems, ...customItems];

  return allItems.length > 0 ? allItems.join(', ') : 'No items selected';
};

const AdminBooking = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

    const normalizedSearch = searchTerm.trim().toLowerCase();

    return bookings
      .filter((booking) => statusMatches(booking, activeTab))
      .filter((booking) => {
        if (!normalizedSearch) return true;

        const bookingId = booking._id?.slice(-5).toLowerCase() || '';
        const clientName = booking.user?.name?.toLowerCase() || '';
        const clientEmail = booking.user?.email?.toLowerCase() || '';
        const serviceType = booking.serviceType?.toLowerCase() || '';

        return [bookingId, clientName, clientEmail, serviceType].some((value) =>
          value.includes(normalizedSearch)
        );
      });
  }, [bookings, activeTab, searchTerm, user]);

  const bookingCounts = useMemo(
    () =>
      ADMIN_TABS.reduce((counts, tab) => {
        counts[tab.key] = bookings.filter((booking) => statusMatches(booking, tab.key)).length;
        return counts;
      }, {}),
    [bookings]
  );

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

  // Handle actions from the booking cards, currently only edit which navigates to the booking management page with the booking data in state
  const handleCardAction = (type, booking) => {
    if (type === 'edit') {
      navigate('/admin/bookings/manage', { state: { booking } });
    }
  };

  return (
    <div className="min-h-screen bg-[#D7EFFF] px-4 py-6 md:px-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <section className="rounded-[2rem] border border-[#c8e1fb] bg-white/90 p-6 shadow-lg md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#546b86]">
                Admin Workspace
              </p>
              <h1 className="text-3xl font-semibold text-[#0d2440] md:text-4xl">
                Booking Management
              </h1>
              <p className="text-sm leading-6 text-[#546b86] md:text-base">
                Review live bookings by status and open a booking to assign staff, allocate a
                vehicle, or update its progress.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {ADMIN_TABS.map((tab) => (
                <div
                  key={tab.key}
                  className="rounded-2xl bg-[#eef6ff] px-4 py-3 text-center shadow-sm"
                >
                  <p className="text-2xl font-semibold text-[#0d2440]">
                    {bookingCounts[tab.key] || 0}
                  </p>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#546b86]">
                    {tab.label.replace(' Booking', '')}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          {ADMIN_TABS.map((tab) => (
            <button
              key={tab.key}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition shadow-sm ${
                activeTab === tab.key
                  ? 'bg-[#142C3E] text-white'
                  : 'bg-white text-[#0d2440] hover:bg-[#eef6ff]'
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label} ({bookingCounts[tab.key] || 0})
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 rounded-[2rem] border border-[#c8e1fb] bg-white/80 p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#0d2440]">Current View</p>
            <p className="text-sm text-[#546b86]">
              {bookingCounts[activeTab] || 0} booking{bookingCounts[activeTab] === 1 ? '' : 's'} in{' '}
              {ADMIN_TABS.find((tab) => tab.key === activeTab)?.label.toLowerCase()}.
            </p>
          </div>

          <label className="w-full md:max-w-sm">
            <span className="sr-only">Search bookings</span>
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by booking ID, client, email, or service"
              className="w-full rounded-full border border-[#c8e1fb] bg-white px-4 py-3 text-sm text-[#0d2440] outline-none transition focus:border-[#142C3E] focus:ring-2 focus:ring-[#d7efff]"
            />
          </label>
        </div>

        {loading ? (
          <div className="rounded-[2rem] border border-dashed border-[#aac8e8] bg-white/70 px-6 py-12 text-center text-[#0d2440]">
            Loading bookings...
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="rounded-[2rem] border border-dashed border-[#aac8e8] bg-white/70 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-[#0d2440]">
              {searchTerm.trim() ? 'No bookings match this search.' : 'No bookings in this category.'}
            </p>
            <p className="mt-2 text-sm text-[#546b86]">
              {searchTerm.trim()
                ? 'Try a different booking ID, client name, email, or service type.'
                : 'Switch tabs to review bookings in another status.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-2">
            {filteredBookings.map((booking) => (
              <div
                key={booking._id}
                className="overflow-hidden rounded-[2rem] border border-[#c8e1fb] bg-white shadow-lg"
              >
                <div className="border-b border-[#e3eef9] bg-[#f8fbff] px-6 py-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#546b86]">
                        Booking {booking._id.slice(-5).toUpperCase()}
                      </p>
                      <h2 className="text-xl font-semibold text-[#0d2440]">
                        {booking.user?.name || 'Unknown Client'}
                      </h2>
                      <p className="text-sm text-[#546b86]">{booking.user?.email || '—'}</p>
                    </div>

                    <span
                      className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
                        STATUS_STYLES[booking.status] || 'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-5 p-6">
                  {(!booking.assignedStaff?.length || !booking.assignedVehicle) && (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                      <p className="font-semibold">Needs attention</p>
                      <p className="mt-1">
                        {!booking.assignedStaff?.length && !booking.assignedVehicle
                          ? 'Staff and vehicle are still unassigned.'
                          : !booking.assignedStaff?.length
                            ? 'Staff assignment is still pending.'
                            : 'Vehicle assignment is still pending.'}
                      </p>
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl bg-[#eef6ff] p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#546b86]">
                        Route
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[#0d2440]">Pick up</p>
                      <p className="text-sm text-[#0d2440]">{booking.pickupAddress}</p>
                      <p className="mt-3 text-sm font-semibold text-[#0d2440]">Destination</p>
                      <p className="text-sm text-[#0d2440]">{booking.destinationAddress}</p>
                    </div>

                    <div className="rounded-2xl bg-[#eef6ff] p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#546b86]">
                        Schedule
                      </p>
                      <div className="mt-2 grid grid-cols-2 gap-3 text-sm text-[#0d2440]">
                        <div>
                          <p className="font-semibold">Date</p>
                          <p>{formatDate(booking.date)}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Time</p>
                          <p>{formatTime(booking.time)}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Service</p>
                          <p>{booking.serviceType}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Property</p>
                          <p>{booking.propertyType}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-2xl border border-[#e3eef9] p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#546b86]">
                        Resources
                      </p>
                      <div className="mt-2 space-y-3 text-sm text-[#0d2440]">
                        <div>
                          <p className="font-semibold">Assigned Staff</p>
                          <p>{formatStaffList(booking.assignedStaff)}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Assigned Vehicle</p>
                          <p>
                            {booking.assignedVehicle
                              ? `${booking.assignedVehicle.vehicleType} - ${booking.assignedVehicle.regoNumber}`
                              : 'Unassigned'}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-[#e3eef9] p-4">
                      <p className="text-xs font-semibold uppercase tracking-wide text-[#546b86]">
                        Booking Details
                      </p>
                      <div className="mt-2 space-y-3 text-sm text-[#0d2440]">
                        <div>
                          <p className="font-semibold">Inventory Items</p>
                          <p>{formatInventoryItems(booking)}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Remarks</p>
                          <p>{booking.remarks || '—'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 pt-1">
                  <button
                    onClick={() => handleCardAction('edit', booking)}
                    disabled={['completed', 'cancelled'].includes(booking.status)}
                    className={[
                      'flex-1 rounded-full py-3 font-semibold transition',
                      ['completed', 'cancelled'].includes(booking.status)
                        ? 'bg-gray-400 text-white cursor-not-allowed opacity-70'
                        : 'bg-[#142C3E] text-white hover:bg-[#0f1b2c]',
                    ].join(' ')}
                  >
                    Manage Booking
                  </button>
                </div>
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
