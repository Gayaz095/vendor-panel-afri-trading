import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useVendor } from "./VendorContext";

const ProtectedRoute = () => {
  const { vendorDetails, loading } = useVendor();
  const location = useLocation();

  if (loading) return null;

  if (!vendorDetails) {
    if (location.pathname !== "/login") {
      return (
        <Navigate
          to="/login"
          replace
          state={{ from: location }}
        />
      );
    } else {
      return null; // Already on login page
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
