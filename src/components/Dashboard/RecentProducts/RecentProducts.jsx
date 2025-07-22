import React, { useEffect, useState } from "react";
import { getVendorProducts } from "../utils/productsApi";
import { useVendor } from "./VendorContext";
import "./componentsStyles/RecentProducts.css";

const PRODUCTS_PER_PAGE = 5;// How many products to show per page
const PAGE_WINDOW = 3; // How many pagination buttons to show at once

const RecentProducts = () => {
  const { vendorDetails } = useVendor(); // Get vendor info from context
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for data fetch
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1); // Current page in pagination

  // Fetch recent products for this vendor when component mounts
  useEffect(() => {
    const fetchRecentProducts = async () => {
      setLoading(true);
      try {
        // Fetch products list using the vendor ID
        const res = await getVendorProducts(vendorDetails?.vendorId);
        if (Array.isArray(res)) {
          const sorted = res.sort(
            (a, b) =>
              new Date(b.updatedAt || b.createdAt) -
              new Date(a.updatedAt || a.createdAt)
          );
          setProducts(sorted); // Set sorted products list
        } else {
          throw new Error("Fetched data is not an array");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentProducts();
  }, [vendorDetails]);

  // Pagination calculations
  const totalPages = Math.max(
    1,
    Math.ceil(products.length / PRODUCTS_PER_PAGE)
  );
  // Calculating which products to show for this page
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentItems = products.slice(startIndex, endIndex);

  // Handler that changes current page and clamps to valid range
  const handlePageChange = (page) => {
    const clampedPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clampedPage);
  };

  // Compute the range of visible page numbers based on current page
  // and window size
  let startPage = Math.max(1, currentPage - Math.floor(PAGE_WINDOW / 2));
  let endPage = startPage + PAGE_WINDOW - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - PAGE_WINDOW + 1);
  }
  // Build an array of page numbers to display
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  // formatPrice uses user locale and dynamic currency and default is INR
  const formatPrice = (price, currency = "INR") => {
    const userLocale = navigator.language || "en-IN";
    return new Intl.NumberFormat(userLocale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  // Render loading indicator if still fetching
  if (loading)
    return (
      <div className="recent-no-products-message">
        Loading recent products...
      </div>
    );

  // Render error message if error occurred during fetch
  if (error)
    return <div className="recent-no-products-message">Error: {error}</div>;

  return (
    <div className="recent-products-table">
      <h3 className="recent-table-h3">Recent Products:</h3>
      <div className="recent-table-responsive">
        <table className="recent-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Reference No.</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td className="recent-no-products-message" colSpan="7">
                  To view recent products,
                  <strong> start adding products!</strong>
                </td>
              </tr>
            ) : (
              currentItems.map((product) => (
                <tr key={product._id}>
                  <td data-label="Image">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="recent-product-image"
                    />
                  </td>
                  <td data-label="Reference No.">{product.referenceNumber}</td>
                  <td data-label="Name" title={product.name}>
                    {product.name}
                  </td>
                  <td
                    data-label="Description"
                    title={product.description || product.discription}>
                    {product.description || product.discription}
                  </td>
                  <td data-label="Price">
                    {formatPrice(product.price, product.currency || "INR")}
                  </td>
                  <td data-label="Stock">{product.stock}</td>
                  <td
                    data-label="Status"
                    className={
                      product.reflectStatus
                        ? "recent-status-active"
                        : "recent-status-inactive"
                    }>
                    {product.reflectStatus ? "Active" : "Inactive"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="recent-pagination">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}>
            &laquo;
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}>
            &lsaquo;
          </button>

          {startPage > 1 && <span>...</span>}
          {pageNumbers.map((num) => (
            <button
              key={num}
              className={currentPage === num ? "active" : ""}
              onClick={() => handlePageChange(num)}>
              {num}
            </button>
          ))}
          {endPage < totalPages && <span>...</span>}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}>
            &rsaquo;
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}>
            &raquo;
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentProducts;
