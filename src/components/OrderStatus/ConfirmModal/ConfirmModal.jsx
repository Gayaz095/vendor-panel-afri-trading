import React from "react";
import "./ConfirmModal.css";
import { FiSlash } from "react-icons/fi"; // for disabled icon

const ConfirmModal = ({
  title,
  message,
  onConfirm,
  onCancel,
  loading,
  statusType,
}) => {
  const isCancelling = statusType === "Cancelled";
  const confirmLabel = loading ? (
    <span className="confirm-modal-spinner-with-text">
      <span className="confirm-modal-spinner" />
      Processing...
    </span>
  ) : isCancelling ? (
    "Cancel?"
  ) : (
    "Yes, Shipped"
  );

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal-container">
        <h2 className="confirm-modal-title">{title}</h2>
        <p className="confirm-modal-message">{message}</p>
        <div className="confirm-modal-actions">
          <button
            className={`confirm-modal-btn cancel ${
              loading ? "disabled-btn" : ""
            }`}
            onClick={onCancel}
            disabled={loading}
            title={loading ? "Disabled during processing" : "Cancel action"}>
            {loading}
            No
          </button>

          <button
            className={`confirm-modal-btn ${
              isCancelling ? "danger" : "success"
            } ${loading ? "disabled-btn" : ""}`}
            onClick={onConfirm}
            disabled={loading}
            title={loading ? "Disabled during processing" : ""}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
