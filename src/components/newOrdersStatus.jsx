import React, { useEffect, useState } from "react";
import "./componentsStyles/OrdersStatus.css";
import { FiCheck, FiX, FiEye, FiSearch } from "react-icons/fi";
import { getVendorProductsOrders } from "../utils/getVendorProductsOrders";
import { useVendor } from "./VendorContext";

const PRODUCTS_PER_PAGE = 5;
const PAGE_WINDOW = 3;

export default function OrdersStatus() {
  const { vendorDetails, loading: vendorLoading } = useVendor();
  const vendorId = vendorDetails?.vendorId || vendorDetails?._id;

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [editPage, setEditPage] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (vendorId) {
      const fetchOrders = async () => {
        // console.log("Fetching orders for Vendor ID:", vendorId);
        try {
          setLoadingOrders(true);
          const response = await getVendorProductsOrders(vendorId);
          // raw API response data
          console.log("API response data in OrdersStatus:", response);
          const rawOrders = response.data;

          //Group orders by _id to avoid duplicates
          const groupedOrdersMap = new Map();

          rawOrders.forEach((order) => {
            if (!groupedOrdersMap.has(order._id)) {
              groupedOrdersMap.set(order._id, {
                id: order._id,
                name: order.email?.split("@")[0] || "Unknown",
                email: order.email,
                phone: order.phone,
                address: order.addressId || "N/A",
                status: order.orderStatus,
                products: [], // start with empty array
              });
            }

            // Add products to the existing grouped order
            const existingOrder = groupedOrdersMap.get(order._id);
            const productList = Array.isArray(order.productsList)
              ? order.productsList
              : [order.productsList];

            productList.forEach((product) => {
              if (
                !existingOrder.products.some(
                  (p) => p.name === product.productName
                )
              ) {
                existingOrder.products.push({
                  name: product.productName,
                  quantity: product.quantity,
                  price: product.productPrice,
                  image: product.image,
                });
              }
            });
          });

          const groupedOrders = Array.from(groupedOrdersMap.values());

          // console.log("Grouped Orders:", groupedOrders);
          setOrders(groupedOrders);
        } catch (error) {
          console.error("Error fetching vendor orders:", error.message);
        } finally {
          setLoadingOrders(false);
        }
      };

      fetchOrders();
    }
  }, [vendorId]);

  const handleShipped = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "Shipped" } : order
      )
    );
  };

  const handleCancelled = (orderId) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "Cancelled" } : order
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

  // Loading vendor details
  if (vendorLoading) {
    return (
      <div className="orders-status-container">
        <p className="orders-status-loading">Loading vendor details...</p>
      </div>
    );
  }

  // Vendor not logged in
  if (!vendorDetails || !vendorId) {
    return (
      <div className="orders-status-container">
        <h2>Please login as a vendor to view orders.</h2>
      </div>
    );
  }

  return (
    <div className="orders-status-container">
      <h1 className="orders-status-title">Customer Orders</h1>

      {/* Search & Filter */}
      <div className="orders-status-controls">
        <div className="orders-status-search">
          <input
            type="text"
            placeholder="Search by ID, name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="orders-status-filter">
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      {/* Loading Orders */}
      {loadingOrders ? (
        <p className="orders-status-loading">Loading orders...</p>
      ) : (
        <>
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
                      onClick={() => handleShipped(order.id)}
                      title="Mark as Shipped">
                      <FiCheck /> Shipped
                    </button>
                    <button
                      className="orders-status-btn orders-status-btn-reject"
                      onClick={() => handleCancelled(order.id)}
                      title="Cancel Order">
                      <FiX /> Cancel
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
        </>
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
                  <img
                    src={product.image}
                    alt={product.name}
                    className="orders-status-product-image"
                  />
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
