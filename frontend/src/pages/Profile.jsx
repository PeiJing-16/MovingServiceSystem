import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Profile = () => {
  const { user, logout } = useAuth(); // Access user token from context
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    // Fetch profile data from the backend
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFormData({
          name: response.data.name,
          email: response.data.email,
          address: response.data.address || '',
          phone: response.data.phone || '',
        });
      } catch (error) {
        alert('Failed to fetch profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert('Profile updated successfully!');
    } catch (error) {
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? All your data will be permanently removed.');
    if (!confirmed) return;

    setDeleting(true);
    try {
      await axiosInstance.delete('/api/auth/profile', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert('Your account has been deleted.');
      logout();
      navigate('/register');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete account. Please try again.';
      alert(message);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="text-center mt-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#D7EFFF] flex items-center justify-center p-6">
      <div className="relative w-full max-w-2xl rounded-xl bg-white/90 border border-[#c8e1fb] px-6 py-10 sm:px-10 overflow-hidden">
        <img
          src="/ProfileBg.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute left-1/2 top-1/2 w-auto -translate-x-1/2 -translate-y-1/2 opacity-30"
        />
        <div className="relative">
          <h1 className="text-3xl font-semibold text-center text-[#0d2440] mb-8 tracking-wide">
            User Profile
          </h1>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#C1D8F0] drop-shadow-lg border-2 border-[#C1D8F0] focus:outline-none focus:border-[#93A9C0]"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#C1D8F0] drop-shadow-lg border-2 border-[#C1D8F0] focus:outline-none focus:border-[#93A9C0]"
            />
            <input
              type="text"
              placeholder="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#C1D8F0] drop-shadow-lg border-2 border-[#C1D8F0] focus:outline-none focus:border-[#93A9C0]"
              />
            <input
              type="text"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full p-3 rounded-xl bg-[#C1D8F0] drop-shadow-lg border-2 border-[#C1D8F0] focus:outline-none focus:border-[#93A9C0]"
              />
            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="w-48 rounded-full bg-[#C1D8F0] text-black font-semibold py-3 hover:bg-[#93A9C0] transition drop-shadow-lg"
              >
              {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </div>
          </form>
          <div className="flex justify-center mt-6">
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="w-48 rounded-full bg-[#864C69] text-white font-semibold py-3 hover:bg-[#926d8d] transition drop-shadow-lg disabled:opacity-60"
              disabled={deleting}
            >
              {deleting ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
