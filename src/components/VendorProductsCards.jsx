import React, { useState } from "react";
import { FaStar, FaShoppingCart } from "react-icons/fa";
import "./componentsStyles/VendorProductsCards.css";

const CARDS_PER_PAGE = 6;
const PAGE_WINDOW = 5;

const VendorProductsCards = ({ products, vendorId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editPage, setEditPage] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const totalPages = Math.ceil(products.length / CARDS_PER_PAGE);

  // Get products for the current page
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const endIndex = startIndex + CARDS_PER_PAGE;
  const currentProducts = products.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setEditPage(null);
    }
  };

  let startPage = Math.max(1, currentPage - Math.floor(PAGE_WINDOW / 2));
  let endPage = startPage + PAGE_WINDOW - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - PAGE_WINDOW + 1);
  }
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  // Double click to edit page number
  const handleDoubleClick = (page) => {
    setEditPage(page);
    setInputValue(page);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value.replace(/[^0-9]/g, ""));
  };

  const handleInputBlur = () => {
    const page = Number(inputValue);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
    setEditPage(null);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleInputBlur();
    } else if (e.key === "Escape") {
      setEditPage(null);
    }
  };
  // Function to format price
  const formatPrice = (price) => {
    return `₹${Number(price).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };
  return (
    <div>
      <div className="product-card-container">
        {currentProducts.map((item, index) => (
          <div className="product-card" key={index}>
            <div className="product-image">
              <img src={item.image} alt={item.name} />
              <a
                href={item.onlineLink || "#"}
                className="go-online-btn"
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={-1}>
                Go Online
              </a>
            </div>
            <div className="product-details">
              <h3 className="product-name">Name: {item.name}</h3>
              <p className="product-description">
                <span>Description: </span>
                {item.discription}
              </p>
              <p style={{ fontWeight: "150", fontSize: "1rem" }}>
                Reference Number: {item.referenceNumber}
              </p>
              <div className="price-section">
                <div>
                  <p className="price">Price: {formatPrice(item.price)}</p>
                </div>
                <div>
                  <p className="stock">Stock: {item.stock}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Pagination Controls */}
      <div className="pagination">
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
              className="pagination-input"
              autoFocus
              style={{ width: "40px" }}
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
    </div>
  );
};

export default VendorProductsCards;
