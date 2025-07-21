import React, { useState, useRef } from "react";
import "./componentsStyles/Payments.css";

// Mock data for demonstration
const mockPayments = [
  {
    id: 1,
    totalAmount: "₹2000",
    paymentId: "PAY123456",
    transactionId: "TXN456789",
    orderId: "ORD987654",
    date: "2024-06-21",
    paymentStatus: "Success",
    received: true,
    actionMarked: null, // NEW
  },
  {
    id: 2,
    totalAmount: "₹1500",
    paymentId: "PAY789012",
    transactionId: "TXN123456",
    orderId: "ORD123456",
    date: "2024-06-20",
    paymentStatus: "Failed",
    received: false,
    actionMarked: null, // NEW
  },
  // Add more mock data as needed, each with `actionMarked: null`
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

  // Apply search/filter to payments state
  const visiblePayments = payments.filter((p) => {
    const s = search.toLowerCase();
    const searchMatch =
      p.paymentId.toLowerCase().includes(s) ||
      p.transactionId.toLowerCase().includes(s) ||
      p.orderId.toLowerCase().includes(s);
    const filterMatch = filter === "All" ? true : p.paymentStatus === filter;
    return searchMatch && filterMatch;
  });

  // Handler for "Received" or "Not Received"
  const handleAction = (id, received) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, actionMarked: received } : p))
    );
    // (Optional) show alert or toast
    // alert(
    //   `Payment ID ${id} marked as "${received ? "Received" : "Not Received"}"`
    // );
  };

  const handleView = (payment) => {
    setModalPayment(payment);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalPayment(null);
  };

  // Print handler: print only modal
  const handlePrint = () => {
    if (!modalOpen || !modalContentRef.current) return;
    // Add a class to body so CSS (@media print) shows only modal
    document.body.classList.add("printing-modal");
    window.print();
    setTimeout(() => {
      document.body.classList.remove("printing-modal");
    }, 600);
  };

  return (
    <div className="payments-container">
      <h2 className="payments-title">Payments</h2>

      {/* Top Controls */}
      <div className="payments-controls">
        <input
          className="payments-search"
          type="text"
          placeholder="Search by Payment ID, Transaction ID, or Order ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="payments-filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Success">Success</option>
          <option value="Failed">Failed</option>
        </select>
      </div>

      {/* Table */}
      <div className="payments-table-responsive">
        <table className="payments-table">
          <thead>
            <tr>
              <th>TotalAmount</th>
              <th>PaymentId</th>
              <th>TranscationId</th>
              <th>OrderId</th>
              <th>Date</th>
              <th>PaymentStatus</th>
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
                  <td data-label="PaymentStatus">
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
                  </td>
                  <td data-label="Action">
                    {p.actionMarked === null ? (
                      <div className="payments-actions">
                        <button
                          className="payments-action-btn received"
                          onClick={() => handleAction(p.id, true)}>
                          Received
                        </button>
                        <button
                          className="payments-action-btn not-received"
                          onClick={() => handleAction(p.id, false)}>
                          Not Received
                        </button>
                      </div>
                    ) : (
                      <span
                        className={
                          p.actionMarked
                            ? "payments-badge success"
                            : "payments-badge failed"
                        }
                        style={{ padding: "0.5em 1em" }}>
                        {p.actionMarked ? "Received" : "Not Received"}
                      </span>
                    )}
                  </td>
                  <td data-label="View">
                    <button
                      className="payments-view-btn"
                      onClick={() => handleView(p)}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ---- Modal ---- */}
      {/* {modalOpen && modalPayment && (
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
      )} */}
    </div>
  );
}
