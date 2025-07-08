import React, { useState } from "react";
import "./componentsStyles/OrdersStatus.css";
import { FiCheck, FiX, FiEye } from "react-icons/fi";

const mockOrders = [
  {
    id: "ORD001",
    name: "Customer01",
    email: "customer01.doe@example.com",
    phone: "1234567890",
    address: "123 Main St, Africa",
    status: "Pending",
    products: [
      { name: "Brake Pad", quantity: 2, price: 500 },
      { name: "Engine Oil", quantity: 1, price: 1200 },
    ],
  },
  {
    id: "ORD002",
    name: "Customer02",
    email: "customer02@example.com",
    phone: "9876543210",
    address: "456 Park Ave, UAE",
    status: "Processing",
    products: [
      { name: "Air Filter", quantity: 3, price: 300 },
      { name: "Headlight Bulb", quantity: 1, price: 800 },
    ],
  },
];

export default function OrdersStatus() {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleAccept = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "Processing" } : order
      )
    );
  };

  const handleReject = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "Rejected" } : order
      )
    );
  };

  const handleView = (order) => {
    setSelectedOrder(order);
  };

  const closeModal = () => {
    setSelectedOrder(null);
  };

  return (
    <div className="order-status-container">
      <h1>Customer Orders</h1>
      <table className="order-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
            <th>View</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.name}</td>
              <td>{order.email}</td>
              <td>{order.phone}</td>
              <td>
                <span className={`status-badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </td>
              <td>
                <button
                  className="btn accept"
                  onClick={() => handleAccept(order.id)}
                  title="Accept Order">
                  <FiCheck /> Accept
                </button>
                <button
                  className="btn reject"
                  onClick={() => handleReject(order.id)}
                  title="Reject Order">
                  <FiX /> Reject
                </button>
              </td>
              <td>
                <button
                  className="btn view"
                  onClick={() => handleView(order)}
                  title="View Order Details">
                  <FiEye /> View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedOrder && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Order Details - {selectedOrder.id}</h2>
            <p>
              <strong>Name:</strong> {selectedOrder.name}
            </p>
            <p>
              <strong>Email:</strong> {selectedOrder.email}
            </p>
            <p>
              <strong>Phone:</strong> {selectedOrder.phone}
            </p>
            <p>
              <strong>Address:</strong> {selectedOrder.address}
            </p>
            <h3>Products:</h3>
            <ul>
              {selectedOrder.products.map((product, idx) => (
                <li key={idx}>
                  {product.name} - Qty: {product.quantity}, Price: ₹
                  {product.price}
                </li>
              ))}
            </ul>
            <button className="btn close" onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
