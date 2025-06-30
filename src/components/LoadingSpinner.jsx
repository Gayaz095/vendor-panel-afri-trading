//LoadingSpinner.jsx
import React from "react";
import "./componentsStyles/LoadingSpinner.css";

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <div className="spinner"></div>
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
