import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import './App.css';

import { Navbar } from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

import { PublicLayout } from './Layouts/PublicLayout';
import AdminLayout from './Layouts/AdminLayout';

import Home from './pages/Home';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import ProfilePage from './pages/ProfilePage';
import CatalogPage from './pages/CatalogPage';
import BookingPage from './pages/BookingPage';
import HistoryPage from './pages/HistoryPage';

import AdminDashboard from './pages/Admin/Dashboard/Dashboard';
import Bookings from './pages/Admin/Bookings/Bookings';
import CreateBooking from './pages/Admin/Bookings/CreateBooking';
import Vehicles from './pages/Admin/Vehicles/Vehicles';
import Users from './pages/Admin/Users/Users';
import Payments from './pages/Admin/Payments/Payments';
import Settings from './pages/Admin/Settings/Settings';

import { getDecodedToken, isAuthenticated } from './utils/api';

// --- LAYOUTS ---
// using layout components from src/Layouts

// --- PROTECTIONS & HANDLERS ---
const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  if (!isAuthenticated()) {
    return <Navigate to='/login' replace />;
  }

  const decoded = getDecodedToken();
  if (allowedRoles.length && decoded && !allowedRoles.includes(decoded.role)) {
    return <Navigate to='/' replace />;
  }

  return children;
};

const NotFound = () => (
  <div className='min-h-screen flex items-center justify-center'>
    <div className='text-center'>
      <h1 className='text-3xl font-bold'>404</h1>
      <p className='mt-3'>Halaman tidak ditemukan.</p>
      <a href='/' className='text-blue-600 underline'>Kembali ke beranda</a>
    </div>
  </div>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />, 
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      { path: "catalog", element: <CatalogPage /> },
      { path: "book/:vehicleId", element: <BookingPage /> },
      {
        path: "history",
        element: (
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        )
      },
      { 
        path: "profile", 
        element: (
          <ProtectedRoute>
            <ProfilePage /> 
          </ProtectedRoute>
        ) 
      }
    ]
  },
  
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'vehicles', element: <Vehicles /> },
      { path: 'bookings', element: <Bookings /> },
      { path: 'payments', element: <Payments /> },
      { path: 'users', element: <Users /> },
      { path: 'settings', element: <Settings /> },
    ]
  },

  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/login",
    element: <Login />
  }
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
