import React from "react";

import Hero from '../components/Hero/Hero';
import BookingBar from '../components/BookingBar/BookingBar';
import Features from '../components/Features/Features';
import VehicleCatalog from '../components/CatalogPage/CatalogPage';
import Testimonials from '../components/Testimonials/Testimonials';
import HowToRent from "../components/HowToRent/HowToRent";

function Home() {
  return (
    <>
      <Hero />
      <BookingBar />
      <HowToRent />
      <Features />
      <VehicleCatalog />
      <Testimonials />
    </>
  );
}

export default Home;