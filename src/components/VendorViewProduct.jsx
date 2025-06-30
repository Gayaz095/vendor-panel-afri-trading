import React from "react";
import "./componentsStyles/VendorViewProduct.css";

// Helper function to format date
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    weekday: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };
  return date.toLocaleDateString("en-US", options);
};

const VendorViewProduct = ({ product, onClose }) => {
  return (
    <div className="view-modal-overlay">
      <div className="view-modal-content">
        <h3 className="view-modal-title">Product Details</h3>
        <div className="view-modal-inner-title">
          <h2>Reference No: {product.referenceNumber}</h2>
          <p>Created At: {formatDate(product.createdAt)}</p>
          <p>Updated At: {formatDate(product.updatedAt)}</p>
        </div>
        <div className="view-product-main">
          <div className="view-product-image-container">
            <img
              src={product.image}
              alt={product.name}
              className="view-product-image"
            />
          </div>
          <div className="view-product-header">
            <h3 className="view-product-name">{product.name}</h3>
            <div
              className={`view-product-status ${
                product.reflectStatus ? "active" : "inactive"
              }`}>
              {product.reflectStatus ? "Active" : "Inactive"}
            </div>
          </div>
        </div>
        <div className="view-product-description">
          <p>
            <strong>Description:</strong> {product.discription}
          </p>
        </div>
        <div className="view-product-footer">
          <div className="view-price-info">
            <span className="view-label">Price:</span>
            <span className="view-value">{product.price.toFixed(2)}</span>
          </div>
          <div className="view-stock-info">
            <span className="view-label">Stock:</span>
            <span className="view-value">{product.stock}</span>
          </div>
        </div>
        <div className="view-modal-actions">
          <button
            type="view-button"
            onClick={onClose}
            className="view-close-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VendorViewProduct;
