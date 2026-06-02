<<<<<<< HEAD
import React from "react";

import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";

function Home() {
  return (
    <div className="w-full">
      
    </div>
=======
import React from 'react';
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
>>>>>>> 9d2cde26a09c20cffd4c85152109282c30340ecd
  );
}

export default Home;