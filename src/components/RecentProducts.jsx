import React, { useEffect, useState } from "react";
import { getVendorProducts } from "../utils/productsApi";
import { useVendor } from "./VendorContext";
import "./componentsStyles/RecentProducts.css";

const PRODUCTS_PER_PAGE = 5;
const PAGE_WINDOW = 3;

const RecentProducts = () => {
  const { vendorDetails } = useVendor();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editPage, setEditPage] = useState(null);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const fetchRecentProducts = async () => {
      setLoading(true);
      try {
        const res = await getVendorProducts(vendorDetails?.vendorId);
        if (Array.isArray(res)) {
          const sorted = res.sort(
            (a, b) =>
              new Date(b.updatedAt || b.createdAt) -
              new Date(a.updatedAt || a.createdAt)
          );
          setProducts(sorted);
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

  const totalPages = Math.max(
    1,
    Math.ceil(products.length / PRODUCTS_PER_PAGE)
  );
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const currentItems = products.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    const clampedPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clampedPage);
    setEditPage(null);
  };

  let startPage = Math.max(1, currentPage - Math.floor(PAGE_WINDOW / 2));
  let endPage = startPage + PAGE_WINDOW - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - PAGE_WINDOW + 1);
  }
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  const handleDoubleClick = (page) => {
    setEditPage(page);
    setInputValue(page);
  };

  const handleInputChange = (e) =>
    setInputValue(e.target.value.replace(/[^0-9]/g, ""));

  const handleInputBlur = () => {
    const page = Number(inputValue);
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    setEditPage(null);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") handleInputBlur();
    else if (e.key === "Escape") setEditPage(null);
  };

  // formatPrice uses user locale and dynamic currency (default INR)
  const formatPrice = (price, currency = "INR") => {
    const userLocale = navigator.language || "en-IN";
    return new Intl.NumberFormat(userLocale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  if (loading)
    return (
      <div className="recent-no-products-message">
        Loading recent products...
      </div>
    );
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
                <td className="recent-no-products-message">
                  To view recent products,
                  <strong>start adding products!</strong>
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
          {pageNumbers.map((num) =>
            editPage === num ? (
              <input
                key={num}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                className="recent-pagination-input"
                autoFocus
              />
            ) : (
              <button
                key={num}
                className={currentPage === num ? "active" : ""}
                onClick={() => handlePageChange(num)}
                onDoubleClick={() => handleDoubleClick(num)}>
                {num}
              </button>
            )
          )}
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
