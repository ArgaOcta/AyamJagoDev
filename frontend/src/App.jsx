import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom'

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
