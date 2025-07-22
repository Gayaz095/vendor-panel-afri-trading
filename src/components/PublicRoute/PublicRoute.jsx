import { Navigate, Outlet } from "react-router-dom";
import { useVendor } from "./VendorContext";

const PublicRoute = () => {
  const { vendorDetails, loading } = useVendor();

  if (loading) return null;

  return !vendorDetails ? <Outlet /> : <Navigate to="/dashboard" replace />;
};

export default PublicRoute;
