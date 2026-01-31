import React from 'react';
import loadImage from '../../assets/load.png';
import './Loading.css'; // Importing CSS for animations

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <img src={loadImage} alt="Loading..." className="loading-image animate-bounce" />
      <p className="mt-4 text-lg animate-fadeIn">Loading KAIROS 2026...</p>
    </div>
  );
};

export default Loading;
