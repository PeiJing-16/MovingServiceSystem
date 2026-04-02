import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

const UserLoginRegister = () => {
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/login', loginData);
      login(response.data);
      navigate('/tasks');
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      alert(`Login failed: ${errorMessage}`);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    try {
      await axiosInstance.post('/api/auth/register', {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
      });
      alert('Registration successful. Please log in.');
      setLoginData({ email: registerData.email, password: '' });
      setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      alert(`Registration failed: ${errorMessage}`);
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: 'url("/background.png")' }}
    >

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-[calc(100vh-100px)] p-4">
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden max-w-4xl w-full flex">
          {/* Login Form */}
          <div className="w-1/2 bg-blue-100 p-8 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Login</h2>
            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                required
                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                required
                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-blue-500"
              />
              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition">
                Login
              </button>
              <p className="text-center text-gray-700 text-sm mt-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin')}
                  className="text-blue-600 hover:underline bg-none border-none cursor-pointer p-0"
                >
                  Admin Login
                </button>
              </p>
            </form>
          </div>

          {/* Register Form */}
          <div className="w-1/2 bg-white p-8 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Register</h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                value={registerData.name}
                onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                required
                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-green-500"
              />
              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                required
                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-green-500"
              />
              <input
                type="text"
                placeholder="Address"
                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-green-500"
              />
              <input
                type="text"
                placeholder="Phone"
                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-green-500"
              />
              <input
                type="password"
                placeholder="Password"
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                required
                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-green-500"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
                required
                className="w-full p-3 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-green-500"
              />
              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition">
                Register
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLoginRegister;
