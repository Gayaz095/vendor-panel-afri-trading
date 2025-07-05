import React from "react";
import { FiTruck } from "react-icons/fi";

const DeliveryStatus = () => {
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

  const iconStyle = {
    fontSize: "4rem",
    // color: "#22c55e",
    color: "#2563eb",
    marginBottom: "1rem",
    animation: "bounce 1.8s infinite ease-in-out",
  };

  const titleStyle = {
    fontSize: "2.2rem",
    fontWeight: 600,
    marginBottom: "0.8rem",
    color: "#2563eb",
  };

  const subtitleStyle = {
    fontSize: "1.1rem",
    fontWeight: 400,
    color: "#475569",
  };

  const bounceKeyframes = `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
  `;

  return (
    <div style={containerStyle}>
      <style>{bounceKeyframes}</style>
      <FiTruck style={iconStyle} />
      <h1 style={titleStyle}>Your Delivery Is On The Way!</h1>
      <p style={subtitleStyle}>Sit back and relax. It’ll reach you shortly.</p>
    </div>
  );
};

export default DeliveryStatus;
