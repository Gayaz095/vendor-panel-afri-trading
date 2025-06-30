//DeleteConfirmationModal.js
import React from "react";
import "./componentsStyles/DeleteConfirmationModal.css";

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this product?</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm-delete">
            Yes, Delete
          </button>
          <button onClick={onClose} className="cancel-delete">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
