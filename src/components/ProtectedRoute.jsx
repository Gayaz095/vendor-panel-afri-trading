import { Navigate, Outlet } from "react-router-dom";
import { useVendor } from "./VendorContext";

const ProtectedRoute = () => {
  const { vendorDetails, loading } = useVendor();

  if (loading) {
    return <div>Verifying your access…</div>;
  }

  return vendorDetails ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
