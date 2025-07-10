import React, { useEffect, useState } from "react";
import "./componentsStyles/OrdersStatus.css";
import { FiCheck, FiX, FiEye } from "react-icons/fi";
import {
  getVendorProductsOrders,
  updateVendorProductsOrdersStatus,
} from "../utils/getVendorProductsOrders";
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
        try {
          setLoadingOrders(true);
          const response = await getVendorProductsOrders(vendorId);
          const ordersData = response.data
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .map((order) => ({
              id: order._id,
              name: order.email?.split("@")[0] || "Unknown",
              email: order.email,
              phone: order.phone,
              address: order.addressId || "N/A",
              status: order.productsList[0]?.vendorStatus || "Pending",
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
    return id ? "..." + id.slice(-10) : "";
  }

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateVendorProductsOrdersStatus(orderId, vendorId, newStatus);
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Failed to update order:", err.message);
    }
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
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    setEditPage(null);
  };

  const locale = navigator.language || "en-US";

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
      <h1 className="orders-status-title">Customer Orders</h1>

      <div className="orders-status-controls">
        <input
          type="text"
          placeholder="Search by ID, name, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="orders-status-search"
        />
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

      {loadingOrders ? (
        <p className="orders-status-loading">Loading orders...</p>
      ) : (
        <>
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
                      onClick={() => handleStatusUpdate(order.id, "Shipped")}
                      title="Mark as Shipped"
                      disabled={order.status === "Cancelled"}>
                      <FiCheck /> Shipped
                    </button>
                    <button
                      className="orders-status-btn orders-status-btn-reject"
                      onClick={() => handleStatusUpdate(order.id, "Cancelled")}
                      title="Cancel Order"
                      disabled={order.status === "Cancelled"}>
                      <FiX /> Cancel
                    </button>
                  </td>
                  <td>
                    <button
                      className="orders-status-btn orders-status-btn-view"
                      onClick={() => setSelectedOrder(order)}
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
        </>
      )}

      {selectedOrder && (
        <div
          className="orders-status-modal-overlay"
          onClick={() => setSelectedOrder(null)}>
          <div
            className="orders-status-modal-content"
            onClick={(e) => e.stopPropagation()}>
            <h2>Order Details - {shortOrderId(selectedOrder.id)}</h2>
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
              <strong>Created At:</strong>{" "}
              {new Date(selectedOrder.createdAt).toLocaleString(locale, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
            <p>
              <strong>Updated At:</strong>{" "}
              {new Date(selectedOrder.updatedAt).toLocaleString(locale, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
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
              onClick={() => setSelectedOrder(null)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
