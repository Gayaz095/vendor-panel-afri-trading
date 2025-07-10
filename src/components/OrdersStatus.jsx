import React, { useEffect, useState } from "react";
import "./componentsStyles/OrdersStatus.css";
import { FiCheck, FiX, FiEye, FiSearch } from "react-icons/fi";
import {
  getVendorProductsOrders,
  updateVendorProductsOrdersStatus
} from "../utils/getVendorProductsOrders";
import { useVendor } from "./VendorContext";
import { toast } from "react-toastify";

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
        try {
          setLoadingOrders(true);
          const response = await getVendorProductsOrders(vendorId);

          // Sort orders by createdAt (newest first)
          const sortedData = response.data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );

          const ordersData = sortedData.map((order) => ({
            id: order._id,
            name: order.email?.split("@")[0] || "Unknown",
            email: order.email,
            phone: order.phone,
            address: order.addressId || "N/A",
            status: order.productsList[0].vendorStatus,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
            products: order.productsList.map((product) => ({
              name: product.productName,
              quantity: product.quantity,
              price: product.productPrice,
              image: product.image,
            })),
          }));
          
          setOrders(ordersData);
        } catch (error) {
          console.error("Error fetching vendor orders:", error.message);
        } finally {
          setLoadingOrders(false);
        }
      };

      fetchOrders();
    }
  }, [vendorId]);

  function shortOrderId(id) {
    if (!id) return "";
    return "..." + id.slice(-10);
  }

  function formatDateTime(isoString) {
    const date = new Date(isoString);
    if (isNaN(date)) return "Invalid Date";

    const userLocale = navigator.language || "en-US";

    const options = {
      year: "numeric",
      month: "short", // e.g., Jul
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // 12-hour format
      timeZoneName: "short", // Shows timezone like IST
    };

    return date.toLocaleString(userLocale, options);
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      toast.info(`Updating order ${newStatus}...`);
      await updateVendorProductsOrdersStatus(orderId, vendorId, newStatus);
      toast.success(`Order marked as ${newStatus}`);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Error updating order status:", error.message);
      toast.error(`Failed to update order: ${error.message}`);
    }
  };

  const handleShipped = (orderId) => handleUpdateStatus(orderId, "Shipped");
  const handleCancelled = (orderId) => handleUpdateStatus(orderId, "Cancelled");

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

  if (vendorLoading) {
    return (
      <div className="orders-status-container">
        <p className="orders-status-loading">Loading vendor details...</p>
      </div>
    );
  }

  if (!vendorDetails || !vendorId) {
    return (
      <div className="orders-status-container">
        <h2>Please login as a vendor to view orders.</h2>
      </div>
    );
  }

  return (
    <div className="orders-status-container">
      <h1 className="orders-status-title">Customers Orders</h1>

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
                  <td>{shortOrderId(order.id)}</td>
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
                      disabled={order.status === "Shipped"}>
                      <FiCheck /> Shipped
                    </button>
                    <button
                      className="orders-status-btn orders-status-btn-reject"
                      onClick={() => handleCancelled(order.id)}
                      disabled={order.status === "Cancelled"}>
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
            <p>
              <strong>Created At:</strong>
              {formatDateTime(selectedOrder.createdAt)}
            </p>
            <p>
              <strong>Updated At:</strong>
              {formatDateTime(selectedOrder.updatedAt)}
            </p>
            <h3>Products:</h3>
            <table className="orders-status-modal-products-table">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Quantity</th>
                  <th>Price (₹)</th>
                  <th>Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.products.map((product, idx) => (
                  <tr key={idx}>
                    <td>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="orders-status-product-image"
                      />
                    </td>
                    <td>{product.name}</td>
                    <td>{product.quantity}</td>
                    <td>₹{product.price}</td>
                    <td>₹{product.price * product.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>

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
