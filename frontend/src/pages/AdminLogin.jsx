import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const AdminLogin = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  // submit the login form and authenticate the admin user
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/admin/login', form);
      login({ ...response.data, isAdmin: true });
      setError('');
      navigate('/admin/bookings');
    } catch (err) {
      const message = err.response?.data?.message || 'Invalid admin username or password';
      setError(message);
    }
  };

  return (
    <div
  className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat p-4"
  style={{ backgroundImage: 'url("/background.png")' }}
>
  <div className="w-full max-w-2xl bg-blue-100 p-8 rounded-xl shadow-xl">
    <h2 className="text-4xl font-bold text-center mb-6">Admin Login</h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        placeholder="Username"
        value={form.username}
        onChange={(e) => setForm({ ...form, username: e.target.value })}
        className="w-full p-3 rounded-lg border border-gray-300"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        className="w-full p-3 rounded-lg border border-gray-300"
        required
      />

      {error && <div className="text-red-600 text-sm">{error}</div>}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
      >
        Login
      </button>

      <p className="text-center text-gray-700 text-sm mt-4">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="text-blue-600 hover:underline bg-none border-none cursor-pointer p-0"
        >
          User Login
        </button>
      </p>
    </form>
  </div>
</div>
  );
};

export default AdminLogin;