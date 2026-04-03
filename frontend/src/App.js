import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import UserLoginRegister from './pages/UserLoginRegister';
import AdminLogin from './pages/AdminLogin';
import Profile from './pages/Profile';
import Tasks from './pages/Tasks';
import UserCreateBooking from './pages/UserCreateBooking';
import UserManageBooking from './pages/UserManageBooking';
import AdminBooking from './pages/AdminBooking';
import AdminAddService from './pages/AdminAddService';
import AdminServices from './pages/AdminServices';
import AdminStaff from './pages/AdminStaff';
import AdminAddStaff from './pages/AdminAddStaff';

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
        <Route path="/admin/bookings" element={<AdminBooking />} />
        <Route path="/admin/services/add" element={<AdminAddService />} />
        <Route path="/admin/services" element={<AdminServices />} />
        <Route path="/admin/staff" element={<AdminStaff />} />
        <Route path="/admin/staff/add" element={<AdminAddStaff />} />
      </Routes>
    </Router>
  );
}

export default App;