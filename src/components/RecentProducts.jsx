import React, { useEffect, useState } from "react";
import { getVendorProducts } from "../utils/productsApi";
import "./componentsStyles/RecentProducts.css";
import { useVendor } from "./VendorContext";

const RecentProducts = () => {
  const { vendorDetails } = useVendor();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecentProducts = async () => {
      setLoading(true);
      try {
        const res = await getVendorProducts(vendorDetails?.vendorId);
        if (Array.isArray(res)) {
          const sorted = res.sort(
            (a, b) =>
              new Date(b.updatedAt || b.createdAt) -
              new Date(a.updatedAt || a.createdAt)
          );
          setProducts(sorted.slice(0, 5));
        } else {
          throw new Error("Fetched data is not an array");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentProducts();
  }, [vendorDetails]);

  const formatPrice = (price) => `₹${parseFloat(price).toFixed(2)}`;

  if (loading)
    return (
      <div className="recent-no-products-message">
        Loading recent products...
      </div>
    );
  if (error)
    return <div className="recent-no-products-message">Error: {error}</div>;

  return (
    <div className="recent-products-table">
      <h3 className="recent-table-h3">Recent Products:</h3>
      <div className="recent-table-responsive">
        <table className="recent-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Reference No.</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price (Rs.)</th>
              <th>Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" className="recent-no-products-message">
                  No recent products available.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id}>
                  <td data-label="Image">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="recent-product-image"
                    />
                  </td>
                  <td data-label="Reference No.">{product.referenceNumber}</td>
                  <td data-label="Name" title={product.name}>
                    {product.name}
                  </td>
                  <td
                    data-label="Description"
                    title={product.description || product.discription}>
                    {product.description || product.discription}
                  </td>
                  <td data-label="Price">{formatPrice(product.price)}</td>
                  <td data-label="Stock">{product.stock}</td>
                  <td
                    data-label="Status"
                    className={
                      product.reflectStatus
                        ? "recent-status-active"
                        : "recent-status-inactive"
                    }>
                    {product.reflectStatus ? "Active" : "Inactive"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentProducts;
