import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = user?.isAdmin;

  const handleLogout = () => {
    logout();
    navigate(isAdmin ? '/admin' : '/login');
  };

  return (
    <nav className="bg-[#142C3E] text-white p-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl font-bold">Moving Service Scheduler System</span>
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          isAdmin ? (
            <>
              <Link to="/admin/bookings" className="font-medium hover:underline">
                Booking
              </Link>
              <button className="font-medium text-white/80 cursor-not-allowed" title="Coming soon">
                Service
              </button>
              <button className="font-medium text-white/80 cursor-not-allowed" title="Coming soon">
                Staff
              </button>
              <button className="font-medium text-white/80 cursor-not-allowed" title="Coming soon">
                Vehicle
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
              <span className="font-semibold">Hi, {user.username || 'admin'}</span>
            </>
          ) : (
            <>
              <Link to="/profile" className="mr-2 font-medium">
                Profile
              </Link>
              <Link to="/bookings/create" className="mr-2 font-medium">
                Get Quote
              </Link>
              <Link to="/bookings/view/user" className="mr-2 font-medium">
                View Bookings
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded hover:bg-red-700"
              >
                Logout
              </button>
            </>
          )
        ) : null}
      </div>
    </nav>
  );
};

export default Navbar;