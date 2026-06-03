import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import './App.css';

import { Navbar } from './components/Navbar/Navbar'; 
import Footer from './components/Footer/Footer';

import Home from './pages/Home';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import ProfilePage from './pages/ProfilePage';
import CatalogPage from './pages/CatalogPage';
import BookingPage from './pages/BookingPage';
import HistoryPage from './pages/HistoryPage';
import AdminDashboard from './pages/Admin/Dashboard/Dashboard';

import { getDecodedToken, isAuthenticated } from './utils/api';

// --- LAYOUTS ---
const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar /> 
      
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <Footer /> 
    </div>
  );
};

const ProfileLayout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <ProfilePage />
      <Footer />
    </div>
  );
};

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

// --- ROUTER CONFIGURATION ---
const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, 
    errorElement: <NotFound />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/catalog", element: <CatalogPage /> },
      { path: "/history", element: <HistoryPage /> },
      { path: "/admin", element: <AdminDashboard /> },
      { path: "/book/:vehicleId", element: <BookingPage /> },
    ]
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <ProfileLayout />
      </ProtectedRoute>
    )
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminDashboard />
      </ProtectedRoute>
    )
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

// --- ROOT APP ---
function App() {
  return <RouterProvider router={router} />;
}

export default App;