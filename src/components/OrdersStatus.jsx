// import React, { useState, useEffect } from "react";
// import { FiEye } from "react-icons/fi";
// import ordersData from "./static-data/orders.json";
// import { useNavigate } from "react-router-dom";
// import "./componentsStyles/OrdersStatus.css";

// const ORDERS_PER_PAGE = 5;
// const PAGE_WINDOW = 3;

// export default function OrdersStatus() {
//   const navigate = useNavigate();
//   const [currentPage, setCurrentPage] = useState(1);
//   const [paginatedOrders, setPaginatedOrders] = useState([]);
//   const [editPage, setEditPage] = useState(null);
//   const [inputValue, setInputValue] = useState("");

//   const totalPages = Math.ceil(ordersData.length / ORDERS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ORDERS_PER_PAGE;
//   const endIndex = startIndex + ORDERS_PER_PAGE;

//   useEffect(() => {
//     setPaginatedOrders(ordersData.slice(startIndex, endIndex));
//   }, [currentPage]);

//   const handleViewOrder = () => {
//     navigate("/orders");
//   };

//   const handlePageChange = (page) => {
//     const clampedPage = Math.max(1, Math.min(page, totalPages));
//     setCurrentPage(clampedPage);
//     setEditPage(null);
//   };

//   let startPage = Math.max(1, currentPage - Math.floor(PAGE_WINDOW / 2));
//   let endPage = startPage + PAGE_WINDOW - 1;
//   if (endPage > totalPages) {
//     endPage = totalPages;
//     startPage = Math.max(1, endPage - PAGE_WINDOW + 1);
//   }
//   const pageNumbers = [];
//   for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

//   const handleDoubleClick = (page) => {
//     setEditPage(page);
//     setInputValue(page);
//   };

//   const handleInputChange = (e) => {
//     setInputValue(e.target.value.replace(/[^0-9]/g, ""));
//   };

//   const handleInputBlur = () => {
//     const page = Number(inputValue);
//     if (page >= 1 && page <= totalPages) setCurrentPage(page);
//     setEditPage(null);
//   };

//   const handleInputKeyDown = (e) => {
//     if (e.key === "Enter") handleInputBlur();
//     else if (e.key === "Escape") setEditPage(null);
//   };

//   return (
//     <div className="orders-status-container">
//       <div className="orders-status-section">
//         <h3 className="orders-status-section-title">Recent Orders</h3>
//         <div className="orders-status-table-container">
//           <table className="orders-status-table">
//             <thead>
//               <tr>
//                 <th>Order Number</th>
//                 <th>Order Date</th>
//                 <th>Customer</th>
//                 <th>Amount</th>
//                 <th>Status</th>
//                 <th>Details</th>
//               </tr>
//             </thead>
//             <tbody>
//               {paginatedOrders.map((order) => (
//                 <tr key={order.id}>
//                   <td>{order.orderno}</td>
//                   <td>{order.orderdate}</td>
//                   <td>{order.customer}</td>
//                   <td>{order.amount}</td>
//                   <td>
//                     <span
//                       className={`orders-status-status-badge ${order.status.toLowerCase()}`}>
//                       {order.status}
//                     </span>
//                   </td>
//                   <td>
//                     <button
//                       className="orders-status-view-button"
//                       onClick={handleViewOrder}>
//                       <FiEye /> View
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination Controls */}
//         {totalPages > 1 && (
//           <div className="pagination">
//             <button
//               onClick={() => handlePageChange(1)}
//               disabled={currentPage === 1}>
//               &laquo;
//             </button>
//             <button
//               onClick={() => handlePageChange(currentPage - 1)}
//               disabled={currentPage === 1}>
//               &lsaquo;
//             </button>

//             {startPage > 1 && <span>...</span>}
//             {pageNumbers.map((num) =>
//               editPage === num ? (
//                 <input
//                   key={num}
//                   type="text"
//                   value={inputValue}
//                   onChange={handleInputChange}
//                   onBlur={handleInputBlur}
//                   onKeyDown={handleInputKeyDown}
//                   className="pagination-input"
//                   autoFocus
//                   style={{ width: "40px" }}
//                 />
//               ) : (
//                 <button
//                   key={num}
//                   className={currentPage === num ? "active" : ""}
//                   onClick={() => handlePageChange(num)}
//                   onDoubleClick={() => handleDoubleClick(num)}>
//                   {num}
//                 </button>
//               )
//             )}
//             {endPage < totalPages && <span>...</span>}

//             <button
//               onClick={() => handlePageChange(currentPage + 1)}
//               disabled={currentPage === totalPages}>
//               &rsaquo;
//             </button>
//             <button
//               onClick={() => handlePageChange(totalPages)}
//               disabled={currentPage === totalPages}>
//               &raquo;
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


import React from "react";
import { FiLoader } from "react-icons/fi";

const OrderStatus = () => {
  const containerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    height: "90vh",
    backgroundColor: "#f9fafb",
    color: "#1e293b",
    fontFamily: "'Urbanist', sans-serif",
    textAlign: "center",
  };

  const titleStyle = {
    fontSize: "2.4rem",
    fontWeight: 600,
    marginBottom: "1rem",
    color: "#2563eb",
  };

  const subtitleStyle = {
    fontSize: "1.2rem",
    fontWeight: 400,
    color: "#475569",
    marginBottom: "2rem",
  };

  const loaderStyle = {
    fontSize: "3rem",
    color: "#2563eb",
    animation: "spin 7s linear infinite",
  };

  const spinnerKeyframes = `
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `;

  return (
    <div style={containerStyle}>
      <style>{spinnerKeyframes}</style>
      <FiLoader style={loaderStyle} />
      <h1 style={titleStyle}>Your Orders Are Processing</h1>
      <p style={subtitleStyle}>
        Hang tight! We’re getting everything ready for you.
      </p>
    </div>
  );
};

export default OrderStatus;
