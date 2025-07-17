import React, { useEffect, useState } from "react";
import { getVendorProductsOrders } from "../utils/getVendorProductsOrders";
import { useVendor } from "./VendorContext";
import "./componentsStyles/RecentOrdersStatus.css";

const ORDERS_PER_PAGE = 7;
const PAGE_WINDOW = 3;

const RecentOrdersStatus = () => {
  const { vendorDetails } = useVendor();
  const vendorId = vendorDetails?.vendorId || vendorDetails?._id;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      setLoading(true);
      try {
        const response = await getVendorProductsOrders(vendorId);
        if (Array.isArray(response.data)) {
          const sorted = response.data.sort(
            (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
          );
          const ordersData = sorted.map((order) => ({
            id: order._id,
            name: order.email?.split("@")[0] || "Unknown",
            email: order.email,
            phone: order.phone,
            status: order.productsList?.[0]?.vendorStatus || "Pending",
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
          }));
          setOrders(ordersData);
        } else {
          throw new Error("Fetched data is not an array");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (vendorId) fetchRecentOrders();
  }, [vendorId]);

  const totalPages = Math.max(1, Math.ceil(orders.length / ORDERS_PER_PAGE));
  const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
  const endIndex = startIndex + ORDERS_PER_PAGE;
  const currentItems = orders.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    const clampedPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clampedPage);
  };

  let startPage = Math.max(1, currentPage - Math.floor(PAGE_WINDOW / 2));
  let endPage = startPage + PAGE_WINDOW - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - PAGE_WINDOW + 1);
  }
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  const shortOrderId = (id) => (id ? "..." + id.slice(-10) : "");

  const formatDate = (dateStr) => {
    const locale = navigator.language || "en-US";
    return new Date(dateStr).toLocaleString(locale, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading)
    return (
      <div className="recent-orders-no-message">Loading recent orders...</div>
    );
  if (error)
    return <div className="recent-orders-no-message">Error: {error}</div>;

  return (
    <div className="recent-orders-table">
      <h3 className="recent-orders-title">Recent Orders:</h3>
      <div className="recent-orders-table-responsive">
        <table className="recent-orders-table-content">
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Order ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Updated At</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td className="recent-orders-no-message">
                  No recent orders found.
                </td>
              </tr>
            ) : (
              currentItems.map((order, idx) => (
                <tr key={order.id}>
                  <td>{startIndex + idx + 1}</td>
                  <td>{shortOrderId(order.id)}</td>
                  <td>{order.name}</td>
                  <td>{order.email}</td>
                  <td>{order.phone}</td>
                  <td
                    className={`recent-orders-status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                  <td>{formatDate(order.updatedAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="recent-orders-pagination">
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
          {pageNumbers.map((num) => (
            <button
              key={num}
              className={currentPage === num ? "active" : ""}
              onClick={() => handlePageChange(num)}>
              {num}
            </button>
          ))}
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
    </div>
  );
};

export default RecentOrdersStatus;
