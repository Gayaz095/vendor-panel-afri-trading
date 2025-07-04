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

const VendorViewProduct = ({
  product,
  onClose,
  carBrands,
  carModels,
  mainCategories,
  subCategories,
  childCategories,
}) => {
  const carBrand = carBrands.find((b) => b._id === product.carBrandId);
  const carModel = carModels.find((m) => m._id === product.carBrandModelId);
  const mainCategory = mainCategories.find(
    (cat) => cat._id === product.categoryId
  );
  const subCategory = subCategories.find(
    (sub) => sub._id === product.subCategoryId
  );
  const childCategory = childCategories.find(
    (child) => child._id === product.childCategoryId
  );

  if (
    !mainCategories.length ||
    !subCategories.length ||
    !childCategories.length ||
    !carBrands.length ||
    !carModels.length
  ) {
    return <div className="view-modal-content">Loading categories...</div>;
  }
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
            <div className="product-brands-models-section">
              <div>
                <strong>Car Brand:</strong>
                <span>{carBrand ? carBrand.name : "N/A"}</span>
              </div>
              <div>
                <strong>Car Model:</strong>
                <span>{carModel ? carModel.name : "N/A"}</span>
              </div>
            </div>
            <div className="product-categories-section">
              <h4>Main Category:</h4>
              <span> {mainCategory ? mainCategory.name : "N/A"}</span>
              <h4>Sub Category:</h4>
              <span>{subCategory ? subCategory.name : "N/A"}</span>
              <h4>Child Category: </h4>
              <span>{childCategory ? childCategory.name : "N/A"}</span>
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
            <span className="view-value"> ₹ {product.price.toFixed(2)}</span>
          </div>
          <div className="view-stock-info">
            <span className="view-label">Stock: </span>
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


{/* <div className="product-brands-models-section">
  <h4>Car Brands:</h4>
  <span></span>
  <h4>Car Models:</h4>
  <span></span>
</div>; */}