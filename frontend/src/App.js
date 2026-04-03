import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import UserLoginRegister from './pages/UserLoginRegister';
import AdminLogin from './pages/AdminLogin';
import Profile from './pages/Profile';
import CreateBooking from './pages/UserCreateBooking';
import UserManageBooking from './pages/UserManageBooking';
import AdminBooking from './pages/AdminBooking';
import AdminServices from './pages/AdminServices';
import AdminAddService from './pages/AdminAddService';
import AdminStaff from './pages/AdminStaff';
import AdminAddStaff from './pages/AdminAddStaff';
import AdminManageBooking from './pages/AdminManageBooking';

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
        <Route path="/bookings/create" element={<CreateBooking />} />
        <Route path="/bookings/manage" element={<UserManageBooking />} />
        <Route path="/admin/bookings" element={<AdminBooking />} />
        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/admin/services/add" element={<AdminAddService />} />
        <Route path="/admin/staff" element={<AdminStaff />} />
        <Route path="/admin/staff/add" element={<AdminAddStaff />} />
        <Route path="/admin/bookings/manage" element={<AdminManageBooking />} />
      </Routes>
    </Router>
  );
}

export default App;
