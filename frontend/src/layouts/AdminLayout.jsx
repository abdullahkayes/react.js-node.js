import React from 'react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard' },
    { name: 'Shipments', path: '/admin/shipments' },
    { name: 'Rate Cards', path: '/admin/rate-cards' },
    { name: 'Users', path: '/admin/users' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-gray-900 text-white p-4">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg transition ${
                  isActive ? 'bg-primary text-white' : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="w-full mt-6 px-3 py-2 text-gray-300 hover:bg-gray-800 rounded-lg text-left"
        >
          Logout
        </button>
        {user && (
          <div className="mt-4 px-3 py-2 text-sm text-gray-400">
            Logged in as: {user.email}
          </div>
        )}
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
