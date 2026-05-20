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