import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVendor } from "../VendorContext/VendorContext";
import {
  FiPackage,
  FiShoppingCart,
  FiPieChart,
  FiClock,
  FiRepeat,
  FiCheckCircle,
  FiCreditCard,
} from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import "./Dashboard.css";

import ordersData from "./static-data/orders.json";
import productsData from "./static-data/products.json";

import Charts from "./Charts/Charts";
// import VendorProductsTable from "./VendorProductTable";
import RecentProducts from "./RecentProducts/RecentProducts";
import RecentOrdersStatus from "./RecentOrdersStatus/RecentOrdersStatus";

// Map icon names to icon components for dynamic lookup
const iconComponents = {
  FiShoppingCart,
  FiPackage,
  FaRupeeSign,
  FiClock,
  FiCheckCircle,
  FiRepeat,
  FiCreditCard,
  FiPieChart,
};

/**
 * Dashboard Component
 * Displays vendor stats, charts, and recent activity for logged in vendor.
 **/
const Dashboard = () => {
  const { vendorDetails } = useVendor(); // Get vendor details from context
  const navigate = useNavigate(); // React Router hook for navigation
  const [animateValues, setAnimateValues] = useState(false);
  const [loading, setLoading] = useState(false); // change to true
  // if simulating in real time
  const [error, setError] = useState(null);

  //Redirect to login if not authenticated.
  useEffect(() => {
    if (!vendorDetails) {
      navigate("/login");
    }
    // Trigger animation after component mounts
    setTimeout(() => setAnimateValues(true), 100);
  }, [vendorDetails, navigate]);

  // const handleViewProduct = () => {
  //   navigate("/products/all");
  // };

  // const handleViewOrder = () => {
  //   navigate("/orders");
  // };

  const stats = [
    {
      title: "Total Orders",
      value: ordersData.length,
      icon: "FiShoppingCart",
      color: "#4CAF50",
    },
    {
      title: "Total Products",
      value: productsData.length,
      icon: "FiPackage",
      color: "#2196F3",
    },
    {
      title: "Total Earnings",
      value: "₹5000",
      icon: "FaRupeeSign",
      color: "#FF9800",
    },
    { title: "Pending Orders", value: "2", icon: "FiClock", color: "#F44336" },
    { title: "Order Processing", value: 8, icon: "FiRepeat", color: "#6366f1" },
    {
      title: "Order Completed",
      value: 65,
      icon: "FiCheckCircle",
      color: "#22c55e",
    },
  ];

  // If user is not authenticated, render nothing while effect processes redirect
  if (!vendorDetails) return null;

  // Show loading message if loading state is set
  if (loading) return <div className="loading">Loading dashboard data...</div>;

  // Show error message if error occurred
  if (error) return <div className="error-message">Error: {error}</div>;

  return (
    <div className="dashboard">
      <h2 className="dashboard-heading">Dashboard Overview</h2>

      <div className="dashboard-cards">
        {stats.map((stat, index) => {
          // Look up icon dynamically by string name
          const Icon = iconComponents[stat.icon];
          return (
            <div
              key={index}
              className="dashboard-card"
              style={{ borderLeftColor: stat.color }}>
              <div
                className="dashboard-icon"
                style={{ backgroundColor: stat.color }}>
                {Icon && <Icon />} {/* Render icon if exists */}
              </div>
              <div className="dashboard-info">
                <h3>{stat.title}</h3>
                <div className="value-container">
                  <p className={`stat-value ${animateValues ? "animate" : ""}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Charts stats={stats} />
      <RecentProducts />
      <RecentOrdersStatus />
    </div>
  );
};

export default Dashboard;
