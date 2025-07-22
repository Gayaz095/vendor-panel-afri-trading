import React from "react";
import { useNavigate } from "react-router-dom";
import "./componentsStyles/NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className="notfound-container">
      {/* Icon */}
      <div className="notfound-icon">
        <svg width="64" height="64" fill="none" viewBox="0 0 24 24">
          <circle
            cx="12"
            cy="12"
            r="10"
            stroke="#F59E42"
            strokeWidth="2"
            fill="#FFF4E5"
          />
          <path
            d="M12 8v4"
            stroke="#F59E42"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="12" cy="16" r="1" fill="#F59E42" />
        </svg>
      </div>

      {/* Main Text */}
      <h1 className="notfound-title">404</h1>
      <h2 className="notfound-subtitle">Oops! Page not found</h2>
      <p className="notfound-text">
        The page you’re looking for doesn’t exist.
      </p>

      {/* Button */}
      <button className="notfound-btn" onClick={handleGoBack}>
        <span className="notfound-btn-arrow">&#8592;</span> Go Back
      </button>
    </div>
  );
};

export default NotFound;
