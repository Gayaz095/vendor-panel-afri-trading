import React, { useState } from "react";
import AddProductModal from "./AddProductModal";
import "./componentsStyles/Products.css";
import VendorProductsTable from "./VendorProductTable";
import { useVendor } from "./VendorContext";
import { FaPlus } from "react-icons/fa";

const AddProduct = () => {
  const { vendorDetails } = useVendor();
  const [modalOpen, setModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const vendorId = vendorDetails?.vendorId;

  const handleProductAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (!vendorDetails) {
    return (
      <div className="loading-spinner">
        Please log in to view your products.
      </div>
    );
  }

  return (
    <div className="products-container">
      <div className="vendor-header">
        <h2 className="your-products">Manage Your Inventory</h2>
      </div>
      <div className="button-wrapper">
        <button
          className="add-product-button"
          onClick={() => setModalOpen(true)}>
          <FaPlus className="add-icon" />
          <span className="text">Add Product</span>
        </button>
      </div>

      <VendorProductsTable
        vendorId={vendorId}
        refreshTrigger={refreshTrigger}
      />

      {modalOpen && (
        <AddProductModal
          onClose={() => setModalOpen(false)}
          onProductAdded={handleProductAdded}
        />
      )}
    </div>
  );
};

export default AddProduct;
