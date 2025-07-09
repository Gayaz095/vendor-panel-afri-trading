import React, { useState } from "react";
import "./componentsStyles/OrdersStatus.css";
import { FiCheck, FiX, FiEye, FiSearch } from "react-icons/fi";

const PRODUCTS_PER_PAGE = 2;
const PAGE_WINDOW = 2;

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
  {
    id: "ORD003",
    name: "Customer03",
    email: "customer03.doe@example.com",
    phone: "1234567890",
    address: "123 Main St, Africa",
    status: "Pending",
    products: [
      { name: "Brake Pad", quantity: 2, price: 500 },
      { name: "Engine Oil", quantity: 1, price: 1200 },
    ],
  },
  {
    id: "ORD004",
    name: "Customer04",
    email: "customer04.doe@example.com",
    phone: "1234567890",
    address: "123 Main St, Africa",
    status: "Pending",
    products: [
      { name: "Brake Pad", quantity: 2, price: 500 },
      { name: "Engine Oil", quantity: 1, price: 1200 },
    ],
  },
];

export default function OrdersStatus() {
  const [orders, setOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [editPage, setEditPage] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const handleAccept = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "Pending" } : order
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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / PRODUCTS_PER_PAGE)
  );
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentItems = filteredOrders.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    const clampedPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clampedPage);
    setEditPage(null);
  };

  let startPage = Math.max(1, currentPage - Math.floor(PAGE_WINDOW / 2));
  let endPage = startPage + PAGE_WINDOW - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - PAGE_WINDOW + 1);
  }
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  const handleDoubleClick = (page) => {
    setEditPage(page);
    setInputValue(page);
  };

  const handleInputChange = (e) =>
    setInputValue(e.target.value.replace(/[^0-9]/g, ""));

  const handleInputBlur = () => {
    const page = Number(inputValue);
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    setEditPage(null);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") handleInputBlur();
    else if (e.key === "Escape") setEditPage(null);
  };

  return (
    <div className="orders-status-container">
      <h1 className="orders-status-title">Customer Orders</h1>

      {/* Search & Filter */}
      <div className="orders-status-controls">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="orders-status-filter">
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <table className="orders-status-table">
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
          {currentItems.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.name}</td>
              <td>{order.email}</td>
              <td>{order.phone}</td>
              <td>
                <span
                  className={`orders-status-badge ${order.status.toLowerCase()}`}>
                  {order.status}
                </span>
              </td>
              <td>
                <button
                  className="orders-status-btn orders-status-btn-accept"
                  onClick={() => handleAccept(order.id)}
                  title="Accept Order">
                  <FiCheck /> Accept
                </button>
                <button
                  className="orders-status-btn orders-status-btn-reject"
                  onClick={() => handleReject(order.id)}
                  title="Reject Order">
                  <FiX /> Reject
                </button>
              </td>
              <td>
                <button
                  className="orders-status-btn orders-status-btn-view"
                  onClick={() => handleView(order)}
                  title="View Order Details">
                  <FiEye /> View
                </button>
              </td>
            </tr>
          ))}
          {currentItems.length === 0 && (
            <tr>
              <td colSpan="7" className="orders-status-no-results">
                No orders found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="orders-status-pagination">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}>
            &laquo;
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}>
            &lsaquo;
          </button>

          {startPage > 1 && <span>...</span>}
          {pageNumbers.map((num) =>
            editPage === num ? (
              <input
                key={num}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                className="orders-status-pagination-input"
                autoFocus
              />
            ) : (
              <button
                key={num}
                className={currentPage === num ? "active" : ""}
                onClick={() => handlePageChange(num)}
                onDoubleClick={() => handleDoubleClick(num)}>
                {num}
              </button>
            )
          )}
          {endPage < totalPages && <span>...</span>}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}>
            &rsaquo;
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}>
            &raquo;
          </button>
        </div>
      )}

      {/* Modal */}
      {selectedOrder && (
        <div className="orders-status-modal-overlay" onClick={closeModal}>
          <div
            className="orders-status-modal-content"
            onClick={(e) => e.stopPropagation()}>
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
            <ol>
              {selectedOrder.products.map((product, idx) => (
                <li key={idx}>
                  {product.name} - Qty: {product.quantity}, Price: ₹
                  {product.price}
                </li>
              ))}
            </ol>
            <button
              className="orders-status-btn orders-status-btn-close"
              onClick={closeModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
