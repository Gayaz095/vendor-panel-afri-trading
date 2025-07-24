import React, { useState } from "react";
import "./VendorProductsCards.css";

const CARDS_PER_PAGE = 8;
const PAGE_WINDOW = 5;

const VendorProductsCards = ({ products }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / CARDS_PER_PAGE);
  const startIndex = (currentPage - 1) * CARDS_PER_PAGE;
  const currentProducts = products.slice(
    startIndex,
    startIndex + CARDS_PER_PAGE
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const startPage = Math.max(1, currentPage - Math.floor(PAGE_WINDOW / 2));
  const endPage = Math.min(totalPages, startPage + PAGE_WINDOW - 1);

  const formatPrice = (price, currency = "INR") => {
    const userLocale = navigator.language || "en-IN";
    return new Intl.NumberFormat(userLocale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  return (
    <div>
      <div className="product-card-container">
        {currentProducts.map((item, index) => (
          <div className="product-card" key={index}>
            <div className="product-image">
              <img src={item.image} alt={item.name} />
              <a
                href="https://auto-spare-parts-user-panel.vercel.app/"
                className="go-online-btn"
                target="_blank"
                rel="noopener noreferrer">
                Go Online
              </a>
            </div>
            <div className="vendor-product-details">
              <h3 className="product-name" title={item.name}>
                Name: {item.name}
              </h3>
              <p className="product-description" title={item.discription}>
                <span>Description:</span> {item.discription}
              </p>
              <p className="product-reference">
                <span> Reference Number: </span> {item.referenceNumber}
              </p>
              <div className="price-section">
                <p className="price">
                  Price: {formatPrice(item.price, item.currency || "INR")}
                </p>
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
        ).map((num) => (
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
    </div>
  );
};

export default VendorProductsCards;
