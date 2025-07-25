import React, { useState, useRef } from "react";
import { FiEye } from "react-icons/fi";
import ConfirmModal from "../ResuseComponents/ConfirmModal/ConfirmModal";
import { toast } from "react-toastify";
import "./Payments.css";

// Mock data for demonstration
const mockPayments = [
  {
    id: 1,
    totalAmount: "₹2000",
    paymentId: "140f4efaaeab1",
    transactionId: "87e1590e2140f4efa",
    orderId: "687e1590e2140f4efaaeab1e",
    date: "21 Jul 2025, 03:55 pm",
    paymentStatus: "Success",
    received: true,
    actionMarked: null,
  },
  {
    id: 2,
    totalAmount: "₹1500",
    paymentId: "e14eae2140f4ef",
    transactionId: "e14eae2140f4ef",
    orderId: "687e14eae2140f4efaaea8a1",
    date: "21 June 2025, 02:00 pm",
    paymentStatus: "Failed",
    received: false,
    actionMarked: null,
  },
  {
    id: 3,
    totalAmount: "₹1800",
    paymentId: "789012897504758",
    transactionId: "e2140f4efaaea3df",
    orderId: "687e12f8e2140f4efaaea3df",
    date: "08 Jul 2025, 05:18 pm",
    paymentStatus: "Failed",
    received: false,
    actionMarked: null,
  },
  {
    id: 4,
    totalAmount: "₹2000",
    paymentId: "3ce2140f4efaaea",
    transactionId: "ce2140f4efaaea2",
    orderId: "687e123ce2140f4efaaea2f8",
    date: "08 Jul 2025, 11: 46 am",
    paymentStatus: "Success",
    received: false,
    actionMarked: null,
  },
  // mock data as needed, each with `actionMarked: null`
];

// Helper for label format
const paymentFieldLabels = {
  totalAmount: "Total Amount",
  paymentId: "Payment ID",
  transactionId: "Transaction ID",
  orderId: "Order ID",
  date: "Date",
  paymentStatus: "Payment Status",
  received: "Received",
};

export default function Payments() {
  const [payments, setPayments] = useState(mockPayments);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalPayment, setModalPayment] = useState(null);
  const modalContentRef = useRef(null); // For printing modal only
  const [confirmModalData, setConfirmModalData] = useState(null);
  const [updatingPaymentId, setUpdatingPaymentId] = useState(null);

  // Apply search/filter to payments state
  const visiblePayments = payments.filter((p) => {
    const s = search.toLowerCase();
    const searchMatch =
      p.paymentId.toLowerCase().includes(s) ||
      p.transactionId.toLowerCase().includes(s) ||
      p.orderId.toLowerCase().includes(s);
    let filterMatch;
    if (filter === "All") {
      filterMatch = true; // Don't filter by status and include everything
    } else {
      filterMatch = p.paymentStatus === filter; // Only include if status matches filter value
    }

    return searchMatch && filterMatch;
  });

  // Handler for "Received" or "Not Received"
  const handleActionConfirmed = (id, received) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, actionMarked: received } : p))
    );
    setUpdatingPaymentId(null);
    setConfirmModalData(null);

    if (received) {
      toast.success('Marked as "Received"', {
        style: {
          background: "#22c55e",
          color: "#fff",
          fontWeight: "bold",
        },
      });
    } else {
      toast.error('Marked as "Not Received"', {
        style: {
          background: "#AA4A44",
          color: "#fff",
          fontWeight: "bold",
        },
      });
    }
  };

  const confirmAction = (id, received) => {
    setConfirmModalData({ id, received });
  };

  const handleView = (payment) => {
    setModalPayment(payment);
    setModalOpen(true);
  };

  const handlePrint = () => {
    if (modalContentRef.current) {
      const printWindow = window.open("", "_blank", "width=800,height=600");
      if (printWindow) {
        // Clone modal content without the print/close buttons
        const modalClone = modalContentRef.current.cloneNode(true);
        // Remove the buttons (Print and Close) from the clone
        const buttons = modalClone.querySelectorAll(
          ".payments-modal-print, .payments-modal-close"
        );
        buttons.forEach((btn) => btn.remove());

        printWindow.document.write(`
          <html>
            <head>
              <title>Payment Details</title>
              <style>
                body {
                  font-family: "Inter", Arial, sans-serif;
                  margin: 0;
                  padding: 20px;
                  color: #333;
                  background: #fff;
                }
                h3 {
                  text-align: center;
                  margin: 0 0 20px 0;
                  font-size: 1.5rem;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 10px;
                }
                td {
                  padding: 10px;
                  border: 1px solid #ddd;
                  font-size: 1rem;
                  vertical-align: top;
                }
                .payments-badge {
                  display: inline-block;
                  padding: 4px 10px;
                  border-radius: 12px;
                  font-weight: 600;
                  color: #fff;
                }
                .payments-badge.success {
                  background-color: #22c55e;
                }
                .payments-badge.failed {
                  background-color: #ef4444;
                }
              </style>
            </head>
            <body>
              ${modalClone.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
      }
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalPayment(null);
  };

  return (
    <div className="payments-container">
      <h2 className="payments-title">Payments Management</h2>

      {/* Payments search and filters */}
      <div className="payments-controls">
        <input
          className="payments-search"
          type="text"
          placeholder="Search by PaymentId, Transactio...."
          title="Search by PaymentId, TransactionId, OrderId"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setSearch("");
            }
          }}
        />

        <select
          className="payments-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setFilter("All"); // Reset filter to 'All'
              e.target.blur(); // Optional: remove focus
            }
          }}>
          <option value="All">All</option>
          <option value="Success">Success</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {/* Payments Table */}
      <div className="payments-table-responsive">
        <table className="payments-table">
          <thead>
            <tr>
              <th>Total Amount</th>
              <th>PaymentId</th>
              <th>TranscationId</th>
              <th>OrderId</th>
              <th>Date</th>
              {/* <th>Payment Status</th> */}
              <th>Action</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {visiblePayments.length === 0 ? (
              <tr>
                <td colSpan="8" className="payments-empty">
                  No payments found.
                </td>
              </tr>
            ) : (
              visiblePayments.map((p) => (
                <tr key={p.id}>
                  <td data-label="TotalAmount">{p.totalAmount}</td>
                  <td data-label="PaymentId">{p.paymentId}</td>
                  <td data-label="TransactionId">{p.transactionId}</td>
                  <td data-label="OrderId">{p.orderId}</td>
                  <td data-label="Date">{p.date}</td>
                  {/* <td data-label="PaymentStatus">
                    <span
                      className={
                        `payments-badge ` +
                        (p.paymentStatus === "Success"
                          ? "success"
                          : p.paymentStatus === "Failed"
                          ? "failed"
                          : "")
                      }>
                      {p.paymentStatus}
                    </span>
                  </td> */}
                  <td data-label="Action">
                    {p.actionMarked === null ? (
                      <div className="payments-actions">
                        <button
                          className="payments-action-btn received"
                          onClick={() => confirmAction(p.id, true)}>
                          Received
                        </button>
                        <button
                          className="payments-action-btn not-received"
                          onClick={() => confirmAction(p.id, false)}>
                          Not Received
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`payments-status-label ${
                          p.actionMarked
                            ? "payments-badge success"
                            : "payments-badge failed"
                        }`}
                        style={{ padding: "0.5em 1em" }}>
                        {p.actionMarked ? "Received" : "Not Received"}
                      </span>
                    )}
                  </td>
                  <td data-label="View">
                    <button
                      className="payments-view-btn"
                      onClick={() => handleView(p)}>
                      <FiEye />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {modalOpen && modalPayment && (
        <div className="payments-modal-overlay" onClick={closeModal}>
          <div
            className="payments-modal-content"
            ref={modalContentRef}
            onClick={(e) => e.stopPropagation()}>
            <div className="payments-modal-header">
              <h3>Payment Details</h3>
              <div>
                <button
                  className="payments-modal-print"
                  onClick={handlePrint}
                  title="Print">
                  Print
                </button>
                <button
                  className="payments-modal-close"
                  onClick={closeModal}
                  title="Close">
                  &times;
                </button>
              </div>
            </div>
            <div className="payments-modal-body">
              <table className="payments-modal-table">
                <tbody>
                  {Object.entries(paymentFieldLabels).map(([key, label]) => (
                    <tr key={key}>
                      <td className="payments-modal-label">{label}</td>
                      <td className="payments-modal-value">
                        {key === "paymentStatus" ? (
                          <span
                            className={
                              "payments-badge " +
                              (modalPayment.paymentStatus === "Success"
                                ? "success"
                                : modalPayment.paymentStatus === "Failed"
                                ? "failed"
                                : "")
                            }>
                            {modalPayment.paymentStatus}
                          </span>
                        ) : key === "received" ? (
                          modalPayment.received ? (
                            "Yes"
                          ) : (
                            "No"
                          )
                        ) : (
                          modalPayment[key]
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {confirmModalData && (
        <ConfirmModal
          title={`Confirm ${
            confirmModalData.received ? "Received" : "Not Received"
          }`}
          message={`Are you sure you want to mark this payment as "${
            confirmModalData.received ? "Received" : "Not Received"
          }"?`}
          onConfirm={() =>
            handleActionConfirmed(
              confirmModalData.id,
              confirmModalData.received
            )
          }
          onCancel={() => setConfirmModalData(null)}
          loading={updatingPaymentId === confirmModalData.id}
          statusType={confirmModalData.received ? "Received" : "Not Received"}
        />
      )}
    </div>
  );
}
