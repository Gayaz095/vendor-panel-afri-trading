import React, { useRef } from "react";
import "./componentsStyles/OrdersStatusModal.css";

export default function OrdersStatusModal({ order, onClose }) {
  const locale = navigator.language || "en-US";
  const printRef = useRef();

  function shortOrderId(id) {
    return id ? "..." + id.slice(-10) : "";
  }

  const handlePrint = () => {
    window.print();
  };
  

  if (!order) return null;

  return (
    <div className="OrdersStatusModal__overlay" onClick={onClose}>
      <div
        className="OrdersStatusModal__content"
        onClick={(e) => e.stopPropagation()}
        ref={printRef}>
        <h2 className="OrdersStatusModal__header">
          Order Details - {shortOrderId(order.id)}
        </h2>

        <div className="OrdersStatusModal__section">
          <p>
            <strong>Name:</strong> {order.name}
          </p>
          <p>
            <strong>Email:</strong> {order.email}
          </p>
          <p>
            <strong>Phone:</strong> {order.phone}
          </p>
          <p>
            <strong>Address:</strong> {order.address}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(order.createdAt).toLocaleString(locale, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
          <p>
            <strong>Updated At:</strong>{" "}
            {new Date(order.updatedAt).toLocaleString(locale, {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </p>
        </div>

        <h3>Products</h3>
        <table className="OrdersStatusModal__productsTable">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((product, idx) => (
              <tr key={idx}>
                <td>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="OrdersStatusModal__productImage"
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="OrdersStatusModal__footer">
          <button className="OrdersStatusModal__btnClose" onClick={onClose}>
            Close
          </button>
          <button className="OrdersStatusModal__btnPrint" onClick={handlePrint}>
            Print
          </button>
        </div>
      </div>
    </div>
  );
}
