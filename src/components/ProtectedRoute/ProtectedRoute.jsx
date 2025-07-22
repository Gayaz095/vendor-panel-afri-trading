import { Navigate, Outlet } from "react-router-dom";
import { useVendor } from "../VendorContext/VendorContext";

const ProtectedRoute = () => {
  const { vendorDetails, loading } = useVendor();

  if (loading) return null;

  return vendorDetails ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
