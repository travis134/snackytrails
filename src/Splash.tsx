import React from 'react';
import logo from './images/logo.png';
import './Splash.css';

const Splash = () => {
  return (
    <div className="container">
      <img src={logo} alt="Snacky Trails" />
      <p>Coming Soon!</p>
    </div>
  );
}

export default Splash;
