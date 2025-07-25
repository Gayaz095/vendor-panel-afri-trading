import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ScrollToTop from "./components/ResuseComponents/ScrollToTop/ScrollToTop";
import Layout from "./components/Layout/Layout";
import Dashboard from "./components/Dashboard/Dashboard";
import LoginPage from "./components/LoginPage/LoginPage";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import PublicRoute from "./components/PublicRoute/PublicRoute";
import NotFound from "./components/NotFound/NotFound";
import VendorVisitStore from "./components/VendorVisitStore/VendorVisitStore";
import OrdersStatus from "./components/OrderStatus/OrdersStatus";
import DeliveryStatus from "./components/DeliveryStatus/DeliveryStatus";
import Payments from "./components/Payments/Payments";
import AddProduct from "./components/ProductManagement/AddProduct/AddProduct";
import EditProfile from "./components/EditProfile/EditProfile";

import { VendorProvider } from "./components/VendorContext/VendorContext";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <div className="app">
      <VendorProvider>
        <Router>
          <ScrollToTop />
          <ToastContainer />
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
                <Route path="payments" element={<Payments />} />
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
