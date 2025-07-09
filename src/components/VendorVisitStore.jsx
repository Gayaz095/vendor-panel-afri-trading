import React, { useState, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import VendorDetails from "./VendorDetails";
import VendorProductsCards from "./VendorProductsCards";
import { getVendorProducts } from "../utils/productsApi.js";
import { useVendor } from "./VendorContext";
import LoadingSpinner from "./LoadingSpinner.jsx";

import "./componentsStyles/VendorVisitStore.css";

// Helper to get the latest date (updatedAt or createdAt)
const getLatestDate = (product) => {
  const updated = product.updatedAt ? new Date(product.updatedAt) : null;
  const created = product.createdAt ? new Date(product.createdAt) : null;
  if (updated && created) return updated > created ? updated : created;
  return updated || created || new Date(0);
};

// Strict validation for vendorDetails
const isVendorDetailsValid = (details) => {
  return (
    details &&
    typeof details === "object" &&
    details.vendorId &&
    details.name &&
    details.email &&
    details.phone &&
    details.bussinessName &&
    details.bussinessAddress &&
    details.adharCard &&
    details.adharCardImage &&
    details.panCard &&
    details.panCardImage &&
    details.gstNumber &&
    details.gstImage &&
    details.status &&
    typeof details.isVerified === "boolean"
  );
};

const VendorVisitStore = () => {
  const { vendorDetails } = useVendor();
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");

  useEffect(() => {
    if (isVendorDetailsValid(vendorDetails)) {
      fetchProducts(vendorDetails.vendorId);
    } else {
      setLoadingProducts(false);
    }
  }, [vendorDetails]);

  useEffect(() => {
    if (products.length > 0) {
      sortProducts(sortOption);
    }
  }, [sortOption]);

  const fetchProducts = async (vendorId) => {
    setLoadingProducts(true);
    setProductsError(null);
    try {
      const data = await getVendorProducts(vendorId);
      const sortedData = [...data].sort(
        (a, b) => getLatestDate(b) - getLatestDate(a)
      );
      setProducts(sortedData);
    } catch (err) {
      setProductsError(err.message || "Failed to fetch products.");
    } finally {
      setLoadingProducts(false);
    }
  };

  const sortProducts = (option) => {
    let sorted = [...products];
    switch (option) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        sorted.sort((a, b) => getLatestDate(b) - getLatestDate(a));
        break;
      case "oldest":
        sorted.sort((a, b) => getLatestDate(a) - getLatestDate(b));
        break;
      case "updated":
        sorted.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        break;
      default:
        break;
    }
    setProducts(sorted);
  };

  if (loadingProducts) return <LoadingSpinner />;

  if (productsError) {
    return (
      <div className="error-message">
        Error fetching products: {productsError}
      </div>
    );
  }

  if (!isVendorDetailsValid(vendorDetails)) {
    return (
      <div className="empty-state">
        Vendor details are incomplete or missing. Please complete profile to
        view store.
      </div>
    );
  }

  return (
    <div className="vendor-store-container">
      <div className="vendor-header">{/* Optional header UI */}</div>
      <div className="vendor-content">
        <div className="vendor-profile-section">
          <VendorDetails vendorDetails={vendorDetails} />
        </div>
        <hr className="light-line" />

        <div className="products-section">
          <div className="products-header">
            <h2 className="products-title">
              Products Total: {products.length}
            </h2>
            <div className="products-filters">
              <div className="filter-group">
                <select
                  className="filter-select"
                  aria-label="Sort products"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}>
                  <option value="newest">
                    Sort by: Recently Added/Updated
                  </option>
                  <option value="oldest">Sort by: Oldest First</option>
                  <option value="price-low">Sort by: Price Low to High</option>
                  <option value="price-high">Sort by: Price High to Low</option>
                </select>
                <FaChevronDown className="filter-arrow" />
              </div>
            </div>
          </div>

          {products.length > 0 ? (
            <div className="vendor-products-card-container">
              <VendorProductsCards
                vendorId={vendorDetails?.vendorId}
                products={products}
              />
            </div>
          ) : (
            <div className="vendor-empty-state">
              No products added. <strong>Start adding new products!</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorVisitStore;
