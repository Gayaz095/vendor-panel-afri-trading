import React from "react";
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
import ordersData from "./static-data/orders.json";
import { useNavigate } from "react-router-dom";
import "./componentsStyles/OrdersStatus.css";

export default function OrdersStatus() {
  const navigate = useNavigate();

  const handleViewOrder = () => {
    navigate("/orders");
  };
  return (
    <div className="orders-status-container">
      {/* <h2 className="orders-status-heading">Orders Status</h2> */}
      <div className="orders-status-section">
        <h3 className="orders-status-section-title">Recent Orders</h3>
        <div className="orders-status-table-container">
          <table className="orders-status-table">
            <thead>
              <tr>
                <th>Order Number</th>
                <th>Order Date</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {ordersData.map((order) => (
                <tr key={order.id}>
                  <td>{order.orderno}</td>
                  <td>{order.orderdate}</td>
                  <td>{order.customer}</td>
                  <td>{order.amount}</td>
                  <td>
                    <span
                      className={`orders-status-status-badge ${order.status.toLowerCase()}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="orders-status-view-button"
                      onClick={handleViewOrder}>
                      <FiEye /> View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
