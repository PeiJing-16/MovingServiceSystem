import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-[#142C3E] text-white p-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-2xl font-bold">Moving Service Scheduler System</span>
      </Link>
      <div>
        {user ? (
          <>
            <Link to="/tasks" className="mr-4">
              CRUD
            </Link>
            <Link to="/profile" className="mr-4">
              Profile
            </Link>
            <Link to="/bookings/create" className="mr-4">
              Get Quote
            </Link>
            <Link to="/bookings/view/user" className="mr-4">
              View Bookings
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <></>
        )}
      </div>
    </nav>
  );
};

export default Navbar;