import React, { useEffect, useState } from "react";
import "./OrdersStatus.css";
import { FiCheck, FiX, FiEye } from "react-icons/fi";
import {
  getVendorProductsOrders,
  updateVendorProductsOrdersStatus,
} from "../../utils/getVendorProductsOrders";
import { useVendor } from "../VendorContext/VendorContext";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal/ConfirmModal";

const PRODUCTS_PER_PAGE = 6;
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
  const [confirmModalData, setConfirmModalData] = useState(null); // for modal state

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
            background: "#AA4A44",
            color: "#fff",
            fontWeight: "bold",
          },
        });
      } else {
        toast.success(`Order marked as ${newStatus}!`, {
          style: {
            fontWeight: "bold",
          },
        });
      }
    } catch (error) {
      console.error("Failed to update order:", error.message);
      toast.error("Failed to update order status.");
    } finally {
      setUpdatingOrderId(null);
      setConfirmModalData(null);
    }
  };

  const confirmStatusChange = (orderId, newStatus) => {
    setConfirmModalData({ orderId, newStatus });
  };

  const handleView = (order) => setSelectedOrder(order);

  const handlePrint = () => {
    const modalContent = document.querySelector(".orders-status-modal-content");

    if (!modalContent) {
      console.error("Modal content not found for printing.");
      return;
    }

    // Temporarily disable scroll and height limits for print
    modalContent.style.maxHeight = "none";
    modalContent.style.overflow = "visible";

    const printContent = modalContent.outerHTML;

    const printWindow = window.open("", "_blank", "width=1000,height=800");
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Order Details</title>
            <style>
              ${[...document.styleSheets]
                .map((styleSheet) => {
                  try {
                    return [...styleSheet.cssRules]
                      .map((rule) => rule.cssText)
                      .join("\n");
                  } catch {
                    return "";
                  }
                })
                .join("\n")}
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      printWindow.document.close();

      printWindow.onload = function () {
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      };
    }

    // Restore modal scroll after print
    modalContent.style.maxHeight = "";
    modalContent.style.overflow = "";
  };

  const closeModal = () => setSelectedOrder(null);

  const handlePrintBarcode = (product) => {
    const content = `
      <html>
        <head>
          <title>Print Barcode</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 2rem;
              text-align: center;
            }
            .barcode-image {
              max-width: 100%;
              height: auto;
            }
            h2 {
              margin-bottom: 1rem;
            }
          </style>
        </head>
        <body>
          <h2>${product.name}</h2><h2>Price:${product.price}</h2>
          <img src="${product.barcodeImage}" alt="Barcode" class="barcode-image" />
        </body>
      </html>
    `;

    const printWindow = window.open("", "", "width=600,height=400");
    printWindow.document.open();
    printWindow.document.write(content);
    printWindow.document.close();

    printWindow.onload = function () {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    };
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  if (vendorLoading || !vendorDetails || !vendorId) {
    return <p className="orders-status-loading">Loading orders data...</p>;
  }

  return (
    <div className="orders-status-container">
      <h1 className="orders-status-title">Customers Orders</h1>

      {/* Controls */}
      <div className="orders-status-controls print-hide">
        <input
          type="text"
          placeholder="Search by Order ID, Email"
          title="Search OrderId, Email"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="orders-status-search"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setSearchTerm("");
              // optionally, e.target.blur(); // to remove focus
            }
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="orders-status-filter"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setStatusFilter("All"); // Reset filter to 'All'
              e.target.blur(); // remove focus
            }
          }}>
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
          {/* <div className="orders-status-table-responsive" tabIndex="0">
            <table className="orders-status-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Order ID</th>
                  <th>Email</th>
                  <th>Phone</th>
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
                    <td className="orders-status-email">{order.email}</td>
                    <td className="orders-status-phone">{order.phone}</td>

                    <td className="print-hide">
                      <div className="orders-status-btn-actions">
                        <button
                          className="orders-status-btn orders-status-btn-accept"
                          onClick={() =>
                            confirmStatusChange(order.id, "Shipped")
                          }
                          disabled={updatingOrderId === order.id}>
                          <FiCheck /> Shipped
                        </button>

                        <button
                          className="orders-status-btn orders-status-btn-reject"
                          onClick={() =>
                            confirmStatusChange(order.id, "Cancelled")
                          }
                          disabled={updatingOrderId === order.id}>
                          <FiX /> Cancel
                        </button>
                      </div>
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
                    <td className="orders-status-no-results" colSpan="7">
                      No orders found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div> */}

          <div className="orders-status-table-responsive" tabIndex="0">
            <table className="orders-status-table">
              <thead>
                <tr>
                  <th>S.No.</th>
                  <th>Order ID</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th className="print-hide">Action</th>
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
                    <td className="orders-status-email">{order.email}</td>
                    <td className="orders-status-phone">{order.phone}</td>

                    <td className="print-hide">
                      {order.status === "Shipped" ||
                      order.status === "Cancelled" ? (
                        <span
                          className={`orders-status-label ${
                            order.status === "Shipped"
                              ? "orders-status-shipped"
                              : "orders-status-cancelled"
                          }`}>
                          {order.status}
                        </span>
                      ) : (
                        <div className="orders-status-btn-actions">
                          <button
                            className="orders-status-btn orders-status-btn-accept"
                            onClick={() =>
                              confirmStatusChange(order.id, "Shipped")
                            }
                            disabled={updatingOrderId === order.id}>
                            <FiCheck /> Shipped
                          </button>

                          <button
                            className="orders-status-btn orders-status-btn-reject"
                            onClick={() =>
                              confirmStatusChange(order.id, "Cancelled")
                            }
                            disabled={updatingOrderId === order.id}>
                            <FiX /> Cancel
                          </button>
                        </div>
                      )}
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
                    <td className="orders-status-no-results" colSpan="6">
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
                aria-label="First Page"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}>
                &laquo;
              </button>
              <button
                aria-label="Previous Page"
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
                aria-label="Next Page"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}>
                &rsaquo;
              </button>
              <button
                aria-label="Last Page"
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
            {/* Modal Header */}
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
                  <p>
                    <strong>Email:</strong> {selectedOrder.email}
                  </p>
                  <p>
                    <strong>Phone:</strong> {selectedOrder.phone}
                  </p>
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
                            <h5> {product.status} </h5>
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
                              <div>
                                <img
                                  src={product.barcodeImage}
                                  alt="Barcode"
                                  className="barcode-image"
                                  style={{ width: "550px" }}
                                />
                                <button
                                  onClick={() => handlePrintBarcode(product)}
                                  className="orders-status-btn orders-status-btn-print modal-print-hide"
                                  style={{ marginTop: "0.5rem" }}>
                                  Print Barcode
                                </button>
                              </div>
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

      {/* Confirm Modal */}
      {confirmModalData && (
        <ConfirmModal
          title={`Confirm ${confirmModalData.newStatus}`}
          message={`Are you sure you want to mark this order as ${confirmModalData.newStatus}?`}
          onConfirm={() =>
            handleUpdateStatus(
              confirmModalData.orderId,
              confirmModalData.newStatus
            )
          }
          onCancel={() => setConfirmModalData(null)}
          loading={updatingOrderId === confirmModalData.orderId}
          statusType={confirmModalData.newStatus}
        />
      )}
    </div>
  );
}
