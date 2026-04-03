import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import UserLoginRegister from './pages/UserLoginRegister';
import AdminLogin from './pages/AdminLogin';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import UserCreateBooking from './pages/UserCreateBooking';
import UserManageBooking from './pages/UserManageBooking';
import AdminBookings from './pages/AdminBooking';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<UserLoginRegister />} />
        <Route path="/register" element={<UserLoginRegister />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/bookings/create" element={<UserCreateBooking />} />
        <Route path="/bookings/view/user" element={<UserManageBooking />} />
        <Route path="/admin/bookings" element={<AdminBookings />} />
      </Routes>
    </Router>
  );
}

export default App;