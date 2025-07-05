import React from "react";
import { FiLoader } from "react-icons/fi";

const OrderStatus = () => {
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "90vh",
    backgroundColor: "#f9fafb",
    color: "#1e293b",
    fontFamily: "'Urbanist', sans-serif",
    textAlign: "center",
  };

  const titleStyle = {
    fontSize: "2.4rem",
    fontWeight: 600,
    marginBottom: "1rem",
    color: "#2563eb",
  };

  const subtitleStyle = {
    fontSize: "1.2rem",
    fontWeight: 400,
    color: "#475569",
    marginBottom: "2rem",
  };

  const loaderStyle = {
    fontSize: "3rem",
    color: "#2563eb",
    animation: "spin 7s linear infinite",
  };

  const spinnerKeyframes = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  return (
    <div style={containerStyle}>
      <style>{spinnerKeyframes}</style>
      <FiLoader style={loaderStyle} />
      <h1 style={titleStyle}>Your Orders Are Processing</h1>
      <p style={subtitleStyle}>
        Hang tight! We’re getting everything ready for you.
      </p>
    </div>
  );
};

export default OrderStatus;
