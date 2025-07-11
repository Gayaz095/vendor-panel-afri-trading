import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useVendor } from "./VendorContext";
import {
  FiPackage,
  FiShoppingCart,
  FiDollarSign,
  FiPieChart,
  FiClock,
  FiRepeat,
  FiCheckCircle,
  FiCreditCard,
  FiEye,
} from "react-icons/fi";
import "./componentsStyles/Dashboard.css";

import ordersData from "./static-data/orders.json";
import productsData from "./static-data/products.json";

import Charts from "./Charts";
import VendorProductsTable from "./VendorProductTable";
import RecentProducts from "./RecentProducts";
import RecentOrdersStatus from "./RecentOrdersStatus";


const iconComponents = {
  FiShoppingCart,
  FiPackage,
  FiDollarSign,
  FiClock,
  FiCheckCircle,
  FiRepeat,
  FiCreditCard,
  FiPieChart,
};

const Dashboard = () => {
  const { vendorDetails } = useVendor();
  const navigate = useNavigate();
  const [animateValues, setAnimateValues] = useState(false);

  useEffect(() => {
    if (!vendorDetails) {
      navigate("/login");
    }
    // Trigger animation after component mounts
    setTimeout(() => setAnimateValues(true), 100);
  }, [vendorDetails, navigate]);

  const handleViewProduct = () => {
    navigate("/products/all");
  };

  const handleViewOrder = () => {
    navigate("/orders");
  };

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
      value: "$5000",
      icon: "FiDollarSign",
      color: "#FF9800",
    },
    {
      title: "Total Items Sold",
      value: 520,
      icon: "FiPieChart",
      color: "#0ea5e9",
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

  return (
    <div className="dashboard">
      <h2 className="dashboard-heading">Dashboard Overview</h2>

      <div className="dashboard-cards">
        {stats.map((stat, index) => {
          const Icon = iconComponents[stat.icon];
          return (
            <div
              key={index}
              className="dashboard-card"
              style={{ borderLeftColor: stat.color }}>
              <div
                className="dashboard-icon"
                style={{ backgroundColor: stat.color }}>
                {Icon && <Icon />}
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
