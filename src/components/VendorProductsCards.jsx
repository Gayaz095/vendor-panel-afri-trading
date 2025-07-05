import React, { useState } from "react";
import "./componentsStyles/VendorProductsCards.css";

const CARDS_PER_PAGE = 6;
const PAGE_WINDOW = 5;

const VendorProductsCards = ({ products }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [editPage, setEditPage] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const totalPages = Math.ceil(products.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const currentProducts = products.slice(
    startIndex,
    startIndex + CARDS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setEditPage(null);
    }
  };

  const startPage = Math.max(1, currentPage - Math.floor(PAGE_WINDOW / 2));
  const endPage = Math.min(totalPages, startPage + PAGE_WINDOW - 1);

  const handleDoubleClick = (page) => {
    setEditPage(page);
    setInputValue(page);
  };

  const handleInputChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setInputValue(value);
  };

  const handleInputBlur = () => {
    const page = Number(inputValue);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
    setEditPage(null);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") handleInputBlur();
    else if (e.key === "Escape") setEditPage(null);
  };

  const formatPrice = (price) =>
    `₹${Number(price).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

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
                rel="noopener noreferrer">
                Go Online
              </a>
            </div>
            <div className="product-details">
              <h3
                className="product-name"
                title={item.name}
              >
                Name: {item.name}
              </h3>
              <p
                className="product-description"
                title={item.discription} // Hover full description
              >
                <span>Description:</span> {item.discription}
              </p>
              <p className="product-reference">
                Reference Number: {item.referenceNumber}
              </p>
              <div className="price-section">
                <p className="price">Price: {formatPrice(item.price)}</p>
                <p className="stock">Stock: {item.stock}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
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
        {Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i
        ).map((num) =>
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
