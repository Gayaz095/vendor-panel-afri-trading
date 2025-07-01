import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Products from "./components/Products";
import LoginPage from "./components/LoginPage";
import LogoutPage from "./components/LogoutPage";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import VendorVisitStore from "./components/VendorVisitStore";
import OrdersStatus from "./components/OrdersStatus";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { VendorProvider } from "./components/VendorContext";
import DeliveryStatus from "./components/DeliveryStatus";
import AddProduct from "./components/AddProduct";
import BulkProducts from "./components/BulkProducts";

export default function App() {
  return (
    <div className="app">
      <VendorProvider>
        <Router>
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
                <Route path="products" element={<Products />} />
                <Route path="add-product" element={<AddProduct />} />
                <Route path="bulk-products" element={<BulkProducts />} />
                <Route path="visit-store" element={<VendorVisitStore />} />
                <Route path="orders-status" element={<OrdersStatus />} />
                <Route path="delivery-status" element={<DeliveryStatus />} />
              </Route>
            </Route>

            {/* Logout route */}
            <Route path="/logout" element={<LogoutPage />} />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </Router>
      </VendorProvider>
    </div>
  );
}
