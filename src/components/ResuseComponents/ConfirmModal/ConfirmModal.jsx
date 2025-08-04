import React from "react";
import "./ConfirmModal.css";
import { FiSlash } from "react-icons/fi";

const ConfirmModal = ({
  title = "Are you sure?",
  message = "Please confirm your action.",
  onConfirm,
  onCancel,
  loading = false,
  statusType = "", // "Cancelled", "Shipped", "Received"
}) => {
  const lowerStatus = statusType.toLowerCase();
  const isDanger =
    lowerStatus === "cancelled" || lowerStatus === "not received";

  const confirmLabel = loading ? (
    <span className="confirm-modal-spinner-with-text">
      <span className="confirm-modal-spinner" />
      Processing...
    </span>
  ) : (
    `Yes, ${statusType}`
  );

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal-container">
        <h2 className="confirm-modal-title">{title}</h2>
        <p className="confirm-modal-message">{message}</p>
        {/* <div className="confirm-modal-actions">
          <button
            className={`confirm-modal-btn cancel ${
              loading ? "disabled-btn" : ""
            }`}
            onClick={onCancel}
            disabled={loading}
            title={loading ? "Disabled during processing" : "Cancel action"}>
            No
          </button>

          <button
            className={`confirm-modal-btn ${isDanger ? "danger" : "success"} ${
              loading ? "disabled-btn" : ""
            }`}
            onClick={onConfirm}
            disabled={loading}
            title={loading ? "Disabled during processing" : ""}>
            {confirmLabel}
          </button>
        </div> */}

        <div className="confirm-modal-actions">
          {isDanger ? (
            // Confirm button comes first (for Not Received, Cancelled etc.)
            <>
              <button
                className={`confirm-modal-btn ${
                  isDanger ? "danger" : "success"
                } ${loading ? "disabled-btn" : ""}`}
                onClick={onConfirm}
                disabled={loading}
                title={loading ? "Disabled during processing" : ""}>
                {confirmLabel}
              </button>

              <button
                className={`confirm-modal-btn cancel ${
                  loading ? "disabled-btn" : ""
                }`}
                onClick={onCancel}
                disabled={loading}
                title={
                  loading ? "Disabled during processing" : "Cancel action"
                }>
                No
              </button>
            </>
          ) : (
            // Cancel button comes first (for Received and others)
            <>
              <button
                className={`confirm-modal-btn cancel ${
                  loading ? "disabled-btn" : ""
                }`}
                onClick={onCancel}
                disabled={loading}
                title={
                  loading ? "Disabled during processing" : "Cancel action"
                }>
                No
              </button>

              <button
                className={`confirm-modal-btn ${
                  isDanger ? "danger" : "success"
                } ${loading ? "disabled-btn" : ""}`}
                onClick={onConfirm}
                disabled={loading}
                title={loading ? "Disabled during processing" : ""}>
                {confirmLabel}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
