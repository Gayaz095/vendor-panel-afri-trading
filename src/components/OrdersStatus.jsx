import React, { useEffect, useState } from "react";
import "./componentsStyles/OrdersStatus.css";
import { FiCheck, FiX, FiEye } from "react-icons/fi";
import {
  getVendorProductsOrders,
  updateVendorProductsOrdersStatus,
} from "../utils/getVendorProductsOrders";
import { useVendor } from "./VendorContext";
import { toast } from "react-toastify";

const PRODUCTS_PER_PAGE = 3;
const PAGE_WINDOW = 3;

export default function OrdersStatus() {
  const {
    vendorDetails,
    loading: vendorLoading,
    allCars,
    allCarModels,
    allCategories,
    allSubCategories,
    allChildCategories,
  } = useVendor();
  const vendorId = vendorDetails?.vendorId || vendorDetails?._id;

  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [updatingOrderId, setUpdatingOrderId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [editPage, setEditPage] = useState(null);
  const [inputValue, setInputValue] = useState("");

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
              // name: order.email?.split("@")[0] || "Unknown",
              email: order.email,
              phone: order.phone,
              address: order.addressId || "N/A",
              status: order.productsList?.[0]?.vendorStatus || "Pending",
              createdAt: order.createdAt,
              updatedAt: order.updatedAt,
              products: order.productsList.map((product) => ({
                name: product.productName,
                quantity: product.quantity,
                price: product.productPrice,
                image: product.image,
                status: product.vendorStatus,
                carBrandId: product.carBrandId,
                carModelId: product.carModelId,
                categoryId: product.categoryId,
                subCategoryId: product.subCategoryId,
                childCategoryId: product.childCategoryId,
                barcodeImage: product.barcodeImage,
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

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingOrderId(orderId);
      await updateVendorProductsOrdersStatus(orderId, vendorId, newStatus);
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      if (newStatus === "Cancelled") {
        toast.error("Order has been Cancelled!", {
          style: {
            background: "#AA4A44 ",
            color: "#fff",
            fontWeight: "bold",
          },
        });
      } else {
        toast.success(`Order marked as ${newStatus}!`, {
          style: {
            // background: "#388e3c",
            // color: "#fff",
            fontWeight: "bold",
          },
        });
      }
    } catch (error) {
      console.error("Failed to update order:", error.message);
      toast.error("Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
    }
  };

  // const handleShipped = (orderId) => {
  //   setOrders((prev) =>
  //     prev.map((order) =>
  //       order.id === orderId ? { ...order, status: "Shipped" } : order
  //     )
  //   );
  // };

  // const handleCancelled = (orderId) => {
  //   setOrders((prev) =>
  //     prev.map((order) =>
  //       order.id === orderId ? { ...order, status: "Cancelled" } : order
  //     )
  //   );
  // };

  const handleView = (order) => setSelectedOrder(order);
  const closeModal = () => setSelectedOrder(null);

  const handlePrint = (orderId) => {
    const printContents = document.querySelector(
      `.orders-status-modal-content`
    ).innerHTML;

    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      // order.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  if (vendorLoading || !vendorDetails || !vendorId) {
    return <p className="orders-status-loading">Loading order's data...</p>;
  }

  return (
    <div className="orders-status-container">
      <h1 className="orders-status-title">Customers Orders</h1>

      {/* Controls */}
      <div className="orders-status-controls print-hide">
        <input
          type="text"
          placeholder="Search by ID, email..."
          title="Search Id, name, email ..."
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
          <option value="Shipped">Shipped</option>
          <option value="Cancelled">Cancelled</option>
          <option value="Delivered">Delivered</option>
        </select>
      </div>

      {loadingOrders ? (
        <p className="orders-status-loading">Loading orders...</p>
      ) : (
        <>
          <div className="orders-status-table-responsive" tabIndex="0">
            <table className="orders-status-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Order ID</th>
                  {/* <th>Name</th> */}
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th className="print-hide">Actions</th>
                  <th className="print-hide">View</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((order, idx) => (
                  <tr key={order.id}>
                    <td>{startIndex + idx + 1}</td>
                    <td className="orders-status-orderId">
                      {shortOrderId(order.id)}
                    </td>
                    {/* <td className="orders-status-name">{order.name}</td> */}
                    <td className="orders-status-email">{order.email}</td>
                    <td className="orders-status-phone">{order.phone}</td>
                    <td>
                      <span
                        className={`orders-status-badge ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="print-hide">
                      {/* {order.status === "Cancelled" ? (
                      <span className="orders-status-final">Cancelled</span>
                    ) : ( */}
                      <div className="orders-status-btn-actions">
                        <button
                          className="orders-status-btn orders-status-btn-accept"
                          onClick={() =>
                            handleUpdateStatus(order.id, "Shipped")
                          }
                          disabled={updatingOrderId === order.id}>
                          <FiCheck /> Shipped
                        </button>
                        <button
                          className="orders-status-btn orders-status-btn-reject"
                          onClick={() =>
                            handleUpdateStatus(order.id, "Cancelled")
                          }
                          disabled={updatingOrderId === order.id}>
                          <FiX /> Cancel
                        </button>
                        {/* <button
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
                        </button> */}
                      </div>
                      {/* )} */}
                    </td>
                    <td className="print-hide">
                      <button
                        className="orders-status-btn orders-status-btn-view"
                        onClick={() => handleView(order)}>
                        <FiEye /> View
                      </button>
                    </td>
                  </tr>
                ))}
                {currentItems.length === 0 && (
                  <tr>
                    <td className="orders-status-no-results">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="orders-status-pagination print-hide">
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
            <div className="orders-status-modal-header">
              <h2>Order Details - {selectedOrder.id}</h2>
              <div className="orders-status-modal-actions print-hide">
                <button
                  className="orders-status-btn orders-status-btn-print"
                  onClick={() => handlePrint(selectedOrder.id)}>
                  Print
                </button>
                <button
                  className="orders-status-btn orders-status-btn-close"
                  onClick={closeModal}>
                  Close
                </button>
              </div>
            </div>

            {vendorLoading || !allCars.length ? (
              <p className="orders-status-loading">
                Loading product details...
              </p>
            ) : (
              <>
                <div className="orders-status-modal-summary">
                  {/* <p>
                    <strong>Name:</strong> {selectedOrder.name}
                  </p> */}
                  <p>
                    <strong>Email:</strong> {selectedOrder.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedOrder.phone}
                  </p>
                  {/* <p>
                    <strong>Address:</strong> {selectedOrder.address}
                  </p> */}
                  <p>
                    <strong>Total Quantity:</strong>
                    {selectedOrder.products.reduce(
                      (total, product) => total + (product.quantity || 0),
                      0
                    )}
                  </p>
                  <p>
                    <strong>Total Amount:</strong> ₹
                    {selectedOrder.products.reduce(
                      (total, product) => total + (product.price || 0),
                      0
                    )}
                  </p>
                  <p>
                    <strong>Created:</strong>
                    {formatDate(selectedOrder.createdAt)}
                  </p>
                  {/* <p>
                    <strong>Updated:</strong>
                    {formatDate(selectedOrder.updatedAt)}
                  </p> */}
                </div>

                <table className="orders-status-modal-products-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Car Brand</th>
                      <th>Car Model</th>
                      <th>Main Category</th>
                      <th>Subcategory</th>
                      <th>Child Category</th>
                      <th className="barcode-column">Product Bar Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.products.map((product, idx) => {
                      const carBrand =
                        allCars.find((b) => b._id === product.carBrandId)
                          ?.name || "N/A";
                      const carModel =
                        allCarModels.find((m) => m._id === product.carModelId)
                          ?.name || "N/A";
                      const mainCategory =
                        allCategories.find((c) => c._id === product.categoryId)
                          ?.name || "N/A";
                      const subCategory =
                        allSubCategories.find(
                          (s) => s._id === product.subCategoryId
                        )?.name || "N/A";
                      const childCategory =
                        allChildCategories.find(
                          (ch) => ch._id === product.childCategoryId
                        )?.name || "N/A";

                      return (
                        <tr key={idx}>
                          <td>
                            <img src={product.image} alt={product.name} />
                          </td>
                          <td>{product.name}</td>
                          <td>{product.quantity}</td>
                          <td>₹{product.price}</td>
                          <td>{carBrand}</td>
                          <td>{carModel}</td>
                          <td>{mainCategory}</td>
                          <td>{subCategory}</td>
                          <td>{childCategory}</td>
                          <td className="barcode-column">
                            {product.barcodeImage ? (
                              <img
                                src={product.barcodeImage}
                                alt="Barcode"
                                className="barcode-image"
                                style={{ width: "550px" } }
                              />
                            ) : (
                              "N/A"
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <br />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
