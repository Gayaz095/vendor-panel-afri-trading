import React, { useState } from "react";
import BulkProducts from "./BulkProducts";
import { FaCloudUploadAlt } from "react-icons/fa";
import "./componentsStyles/UploadBulkProducts.css";

const UploadBulkProducts = ({ onProductAdded }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="upload-bulk-center-box">
      <div className="upload-bulk-card">
        <button className="upload-bulk-btn" onClick={() => setShowModal(true)}>
          <FaCloudUploadAlt className="upload-bulk-btn__icon" />
          <span>Upload Bulk Products</span>
        </button>
        <div className="upload-bulk-desc">
          Streamline your workflow by uploading multiple products at once. Click
          the button above to get started with our bulk product upload feature.
        </div>
      </div>
      {showModal && (
        <BulkProducts
          onProductAdded={() => {
            setShowModal(false);
            onProductAdded && onProductAdded();
          }}
        />
      )}
    </div>
  );
};

export default UploadBulkProducts;
