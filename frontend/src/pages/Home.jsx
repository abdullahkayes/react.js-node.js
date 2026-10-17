import React from 'react';
import HeroBanner from './HeroBanner';
import Services from './Services';
import Features from './Features';
import Location from './Location';
import InsideOperation from './InsideOperation';
import Review from './Review';
import Stores from './Stores';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <HeroBanner />
      <Services />
      <Features />
      <Location />
      <InsideOperation />
      <Review />
      <Stores />
    </div>
  );
};

export default Home;
