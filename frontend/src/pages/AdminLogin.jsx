import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ADMIN_CREDENTIALS = {
  username: process.env.REACT_APP_ADMIN_USERNAME || 'admin',
  password: process.env.REACT_APP_ADMIN_PASSWORD || 'admin123',
};

const AdminLogin = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.username === ADMIN_CREDENTIALS.username && form.password === ADMIN_CREDENTIALS.password) {
      login({ username: form.username, role: 'admin', isAdmin: true });
      setError('');
      navigate('/tasks');
    } else {
      setError('Invalid admin username or password');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center p-4"
      style={{ backgroundImage: 'url("/background.png")' }}
    >
      <div className="w-full max-w-md bg-blue-100 p-8 rounded-xl shadow-xl">
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

          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700">
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
