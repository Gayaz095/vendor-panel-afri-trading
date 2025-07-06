// import { Navigate, Outlet } from "react-router-dom";
// import { useVendor } from "./VendorContext";

// const ProtectedRoute = () => {
//   const { vendorDetails, loading } = useVendor();

//   if (loading) return null;

//   return vendorDetails ? <Outlet /> : <Navigate to="/login" replace />;
// };

// export default ProtectedRoute;


import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useVendor } from "./VendorContext";

const ProtectedRoute = () => {
  const { vendorDetails, loading } = useVendor();
  const location = useLocation();

  if (loading) return null;

  if (!vendorDetails) {
    // Prevent multiple /login in history and pass intended location
    if (location.pathname !== "/login") {
      return <Navigate to="/login" replace state={{ from: location }} />;
    } else {
      return null; // already on login, don’t redirect again
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
