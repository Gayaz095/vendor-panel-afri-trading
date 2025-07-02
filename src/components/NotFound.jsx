import React from "react";
import "./componentsStyles/NotFound.css";

const NotFound = () => (
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

    {/* Illustration */}
    {/* <img
      className="notfound-image"
      src="https://undraw.co/api/illustrations/8e4d7e2d-8e4a-4b3d-8a4a-8e4d7e2d8e4a"
      alt="Page not found"
      loading="lazy"
    /> */}

    {/* Main Text */}
    <h1 className="notfound-title">404</h1>
    <h2 className="notfound-subtitle">Oops! Page not found</h2>
    <p className="notfound-text">The page you’re looking for doesn’t exist.</p>

    {/* Button */}
    <a href="/" className="notfound-btn">
      <span className="notfound-btn-arrow">&#8592;</span> Go Back
    </a>
  </div>
);

export default NotFound;
