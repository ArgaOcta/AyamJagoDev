import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import './App.css';

import Navbar from './components/Navbar/Navbar'; 
import Footer from './components/Footer/Footer'; 
import Hero from './components/Hero/Hero';
import BookingBar from './components/BookingBar/BookingBar';

import Home from './pages/Home';
import Features from './components/Features/Features';
import VehicleCatalog from './components/VehicleCatalog/VehicleCatalog';
import Testimonials from './components/Testimonials/Testimonials';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar /> 

      <Hero />

      <BookingBar />

      <Features />

      <VehicleCatalog />

      <Testimonials />

      <Footer /> 
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />, 
    children: [
      { 
        path: "/", 
        element: <Home />
      },
    ]
  }
]);

// 3. Render Aplikasi
function App() {
  return <RouterProvider router={router} />;
}

export default App;
﻿import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom'

import './App.css'

// Components
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'

// Pages
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ProfilePage from './pages/ProfilePage'
import CatalogPage from './pages/CatalogPage'
import BookingPage from './pages/BookingPage'
import HistoryPage from './pages/HistoryPage'
import AdminDashboard from './pages/AdminDashboard'

import { getDecodedToken, isAuthenticated } from './utils/api'

// Layout Home
const MainLayout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

const ProfileLayout = () => {
  return (
    <div className='flex flex-col min-h-screen'>
      <Navbar />
      <ProfilePage />
      <Footer />
    </div>
  )
}

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  if (!isAuthenticated()) {
    return <Navigate to='/login' replace />
  }

  const decoded = getDecodedToken()
  if (allowedRoles.length && decoded && !allowedRoles.includes(decoded.role)) {
    return <Navigate to='/' replace />
  }

  return children
}

const NotFound = () => (
  <div className='min-h-screen flex items-center justify-center'>
    <div className='text-center'>
      <h1 className='text-3xl font-bold'>404</h1>
      <p className='mt-3'>Halaman tidak ditemukan.</p>
      <a href='/' className='text-blue-600 underline'>Kembali ke beranda</a>
    </div>
  </div>
)

// Router
const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'catalog',
        element: <CatalogPage />,
      },
      {
        path: 'book/:vehicleId',
        element: (
          <ProtectedRoute>
            <BookingPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'history',
        element: (
          <ProtectedRoute>
            <HistoryPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'admin',
        element: (
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: '/profile',
    element: (
      <ProtectedRoute>
        <ProfileLayout />
      </ProtectedRoute>
    ),
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
