import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const propertyTypes = ['Apartment', 'Townhouse', 'Detached House', 'Office', 'Other'];

const initialState = {
  serviceType: '',
  propertyType: propertyTypes[0],
  pickupAddress: '',
  destinationAddress: '',
  date: '',
  time: '',
  remarks: '',
};

const UserCreateBooking = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [serviceOptions, setServiceOptions] = useState([]);
  const [serviceLoading, setServiceLoading] = useState(true);

  useEffect(() => {
    if (location.state?.booking) {
      const booking = location.state.booking;
      setFormData({
        serviceType: booking.serviceType,
        propertyType: booking.propertyType,
        pickupAddress: booking.pickupAddress,
        destinationAddress: booking.destinationAddress,
        date: booking.date ? booking.date.slice(0, 10) : '',
        time: booking.time || '',
        remarks: booking.remarks || '',
      });
      setEditingId(booking._id);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchServices = async () => {
      setServiceLoading(true);
      try {
        const response = await axiosInstance.get('/api/services');
        setServiceOptions(response.data);
        if (!editingId && response.data.length > 0) {
          setFormData((prev) => ({
            ...prev,
            serviceType: prev.serviceType || response.data[0].name,
          }));
        }
      } catch (error) {
        alert('Failed to load services. Please try again later.');
      } finally {
        setServiceLoading(false);
      }
    };

    fetchServices();
  }, [editingId]);

  if (!user) {
    return <div className="text-center mt-20">Please log in to create a booking.</div>;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingId) {
        await axiosInstance.put(`/api/bookings/${editingId}`, formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        alert('Booking updated successfully.');
      } else {
        await axiosInstance.post('/api/bookings', formData, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        alert('Booking submitted! We will email a confirmation shortly.');
      }
      const defaultService = serviceOptions[0]?.name || '';
      setFormData({ ...initialState, serviceType: defaultService });
      setEditingId(null);
    } catch (error) {
      alert('Failed to save booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#D7EFFF] flex items-center justify-center p-6">
      <div className="relative w-full max-w-4xl rounded-3xl bg-white/90 border border-[#c8e1fb] px-6 py-12 sm:px-14 overflow-hidden shadow-2xl">
        <img
          src="/BookingBg.jpg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute left-1/2 top-1/2 w-[140%] max-w-none -translate-x-1/2 -translate-y-1/2 opacity-30"
        />
        <div className="relative">
          <h1 className="text-4xl font-semibold text-center text-[#0d2440] mb-10 tracking-wide">
            Get Your Removal Quotes
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <select
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                className="w-full rounded-xl bg-[#C1D8F0] drop-shadow-lg py-3 px-6 text-[#0d2440] focus:outline-none focus:ring-2 focus:ring-[#6aa7ff]"
                disabled={serviceLoading || serviceOptions.length === 0}
                required
              >
                {serviceLoading && <option>Loading services...</option>}
                {!serviceLoading && serviceOptions.length === 0 && <option value="">No services available</option>}
                {!serviceLoading &&
                  serviceOptions.map((service) => (
                    <option key={service._id} value={service.name}>
                      {service.name}
                    </option>
                  ))}
              </select>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleChange}
                className="w-full rounded-xl bg-[#C1D8F0] drop-shadow-lg py-3 px-6 text-[#0d2440] focus:outline-none focus:ring-2 focus:ring-[#6aa7ff]"
              >
                {propertyTypes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <input
                type="text"
                name="pickupAddress"
                placeholder="Pick Up Address"
                value={formData.pickupAddress}
                onChange={handleChange}
                className="w-full rounded-xl bg-[#C1D8F0] drop-shadow-lg py-3 px-6 text-black md:col-span-2"
                required
              />
              <input
                type="text"
                name="destinationAddress"
                placeholder="Destination Address"
                value={formData.destinationAddress}
                onChange={handleChange}
                className="w-full rounded-xl bg-[#C1D8F0] drop-shadow-lg py-3 px-6 text-black md:col-span-2"
                required
              />
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full rounded-xl bg-[#C1D8F0] drop-shadow-lg py-3 px-6 text-black"
                required
              />
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full rounded-xl bg-[#C1D8F0] drop-shadow-lg py-3 px-6 text-black"
                required
              />
              <textarea
                name="remarks"
                placeholder="Remark (Optional)"
                value={formData.remarks}
                onChange={handleChange}
                className="w-full rounded-xl bg-[#C1D8F0] drop-shadow-lg py-3 px-6 text-black md:col-span-2"
                rows={3}
              />
            </div>
            <p className="text-center text-[#864C69] text-sm">
              *We will send a confirmation email to your registered email address.
            </p>
            <div className="flex justify-center">
              <button
                type="submit"
                className="w-48 rounded-full bg-[#C1D8F0] text-black font-semibold py-3 hover:bg-[#93A9C0] transition drop-shadow-lg"
                disabled={loading}
              >
                {loading ? 'Saving...' : editingId ? 'Update Booking' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserCreateBooking;