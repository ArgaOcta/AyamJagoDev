import React from "react";

// Hapus import Navbar dan Footer karena sudah ada di MainLayout
import Hero from '../components/Hero/Hero';
import BookingBar from '../components/BookingBar/BookingBar';
import Features from '../components/Features/Features';
import VehicleCatalog from '../components/VehicleCatalog/VehicleCatalog';
import Testimonials from '../components/Testimonials/Testimonials';

function Home() {
  return (
    <>
      <Hero />
      <BookingBar />
      <Features />
      <VehicleCatalog />
      <Testimonials />
    </>
  );
}

export default Home;