import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import LoginPage from "./components/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import NotFound from "./components/NotFound";
import VendorVisitStore from "./components/VendorVisitStore";
import OrdersStatus from "./components/OrdersStatus";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VendorProvider } from "./components/VendorContext";
import DeliveryStatus from "./components/DeliveryStatus";
import AddProduct from "./components/AddProduct";
import EditProfile from "./components/EditProfile";

export default function App() {
  return (
    <div className="app">
      <VendorProvider>
        <Router>
          <ScrollToTop />
          <ToastContainer/>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>

            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path="visit-store" element={<VendorVisitStore />} />
                <Route path="orders-status" element={<OrdersStatus />} />
                <Route path="delivery-status" element={<DeliveryStatus />} />
                <Route path="edit-profile" element={<EditProfile />} />
                {/* NotFound route at /path-not-found */}
                <Route path="/path-not-found" element={<NotFound />} />
              </Route>
            </Route>

            {/* Fallback route */}
            {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}

            {/* Catch-all: redirect to /path-not-found for any unknown route */}
            <Route
              path="*"
              element={<Navigate to="/path-not-found" replace />}
            />
          </Routes>
        </Router>
      </VendorProvider>
    </div>
  );
}
