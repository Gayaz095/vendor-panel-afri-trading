import React from "react";
import { FiTruck } from "react-icons/fi";

const DeliveryStatus = () => {
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

  const iconStyle = {
    fontSize: "4rem",
    // color: "#22c55e",
    color: "#2563eb",
    marginBottom: "1rem",
    animation: "bounce 1.8s infinite ease-in-out",
  };

  const titleStyle = {
    fontSize: "2.2rem",
    fontWeight: 600,
    marginBottom: "0.8rem",
    color: "#2563eb",
  };

  const subtitleStyle = {
    fontSize: "1.1rem",
    fontWeight: 400,
    color: "#475569",
  };

  const bounceKeyframes = `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
  `;

  return (
    <div style={containerStyle}>
      <style>{bounceKeyframes}</style>
      <FiTruck style={iconStyle} />
      <h1 style={titleStyle}>Your Delivery Is On The Way!</h1>
      <p style={subtitleStyle}>Sit back and relax. It’ll reach you shortly.</p>
    </div>
  );
};

export default DeliveryStatus;

// import React, { useState } from "react";
// import "./componentsStyles/DeliveryStatus.css";

// const DeliveryStatus = () => {
//   // Sample data
//   const [orders, setOrders] = useState([
//     {
//       id: "34568",
//       customer: "Michael Johnson",
//       total: "$245.99",
//       payment: "Credit Card",
//       rider: "Unassigned",
//       status: "Pending",
//     },
//     {
//       id: "34568",
//       customer: "Sarah Williams",
//       total: "$189.50",
//       payment: "PayPal",
//       rider: "James Smith",
//       status: "In Transit",
//     },
//     {
//       id: "38886",
//       customer: "Robert Chen",
//       total: "$320.75",
//       payment: "Cash on Delivery",
//       rider: "Maria Garcia",
//       status: "Delivered",
//     },
//     {
//       id: "02586",
//       customer: "Emily Davis",
//       total: "$150.20",
//       payment: "Credit Card",
//       rider: "Unassigned",
//       status: "Pending",
//     },
//   ]);

//   const [riders] = useState([
//     "James Smith",
//     "Maria Garcia",
//     "David Wilson",
//     "Lisa Brown",
//   ]);
//   const [showRiderDropdown, setShowRiderDropdown] = useState(null);

//   const assignRider = (orderId, riderName) => {
//     setOrders(
//       orders.map((order) =>
//         order.id === orderId
//           ? { ...order, rider: riderName, status: "Assigned" }
//           : order
//       )
//     );
//     setShowRiderDropdown(null);
//   };

//   const toggleRiderDropdown = (orderId) => {
//     setShowRiderDropdown(showRiderDropdown === orderId ? null : orderId);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Pending":
//         return "delivery-status-component__status-pending";
//       case "Assigned":
//         return "delivery-status-component__status-assigned";
//       case "In Transit":
//         return "delivery-status-component__status-transit";
//       case "Delivered":
//         return "delivery-status-component__status-delivered";
//       default:
//         return "";
//     }
//   };

//   return (
//     <div className="delivery-status-component">
//       <h2 className="delivery-status-component__title">Delivery Status</h2>
//       <div className="delivery-status-component__table-responsive">
//         <table className="delivery-status-component__table">
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>Customer Name</th>
//               <th>Total Cost</th>
//               <th>Payment Method</th>
//               <th>Rider</th>
//               {/* <th>Status</th> */}
//               {/* <th>Actions</th> */}
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order) => (
//               <tr key={order.id} className="delivery-status-component__row">
//                 <td className="delivery-status-component__cell">{order.id}</td>
//                 <td className="delivery-status-component__cell">
//                   {order.customer}
//                 </td>
//                 <td className="delivery-status-component__cell">
//                   {order.total}
//                 </td>
//                 <td className="delivery-status-component__cell">
//                   {order.payment}
//                 </td>
//                 {/* <td className="delivery-status-component__cell">
//                   {order.rider}
//                 </td> */}
//                 <td className="delivery-status-component__cell">
//                   <span
//                     className={`delivery-status-component__status-badge ${getStatusColor(
//                       order.status
//                     )}`}>
//                     {order.status}
//                   </span>
//                 </td>
//                 {/* <td className="delivery-status-component__cell">
//                   {order.rider === "Unassigned" ? (
//                     <div className="delivery-status-component__dropdown-container">
//                       <button
//                         onClick={() => toggleRiderDropdown(order.id)}
//                         className="delivery-status-component__assign-btn">
//                         Assign Rider
//                       </button>
//                       {showRiderDropdown === order.id && (
//                         <div className="delivery-status-component__dropdown">
//                           {riders.map((rider) => (
//                             <div
//                               key={rider}
//                               className="delivery-status-component__dropdown-option"
//                               onClick={() => assignRider(order.id, rider)}>
//                               {rider}
//                             </div>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   ) : (
//                     <span className="delivery-status-component__assigned-text">
//                       Assigned
//                     </span>
//                   )}
//                 </td> */}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default DeliveryStatus;
