import React, { useEffect, useState } from "react";
import { getVendorProducts, deleteProduct } from "../utils/productsApi";
import { getAllCars } from "../utils/getAllCars";
import { getAllCarModels } from "../utils/getAllCarModels";
import { mainGetCategories } from "../utils/mainGetCategories";
import { getSubCategories } from "../utils/getSubCategories";
import { getAllChildCategories } from "../utils/getAllChildCategories";
import VendorEditProduct from "./VendorEditProduct";
import VendorViewProduct from "./VendorViewProduct";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import "./componentsStyles/VendorProductsTable.css";
import { toast } from "react-toastify";

const PRODUCTS_PER_PAGE = 5;
const PAGE_WINDOW = 3;

// Helper to get the latest date (updatedAt or createdAt)
const getLatestDate = (product) => {
  const updated = product.updatedAt ? new Date(product.updatedAt) : null;
  const created = product.createdAt ? new Date(product.createdAt) : null;
  if (updated && created) return updated > created ? updated : created;
  return updated || created || new Date(0);
};

const VendorProductsTable = ({ vendorId, refreshTrigger }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editPage, setEditPage] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [editingProduct, setEditingProduct] = useState(null);
  const [viewingProduct, setViewingProduct] = useState(null);
  const [carBrands, setCarBrands] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    name: "",
    referenceNumber: "",
    carBrandId: "",
    carModelId: "",
    categoryId: "",
    subCategoryId: "",
    childCategoryId: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "asc",
  });

  // Accordion state
  const [carAccordionOpen, setCarAccordionOpen] = useState(false);
  const [categoryAccordionOpen, setCategoryAccordionOpen] = useState(false);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  );

  const [sortOption, setSortOption] = useState("newest"); // added sortOption state

  useEffect(() => {
    fetchProducts();
  }, [vendorId, refreshTrigger]);

  useEffect(() => {
    loadDropdowns();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [products, filters]);

  // const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [filteredProducts, currentPage, totalPages]);

  useEffect(() => {
    if (products.length > 0) {
      sortProducts(sortOption);
    }
  }, [sortOption]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getVendorProducts(vendorId);
      if (Array.isArray(data)) {
        const sorted = [...data].sort(
          (a, b) => getLatestDate(b) - getLatestDate(a)
        );
        setProducts(sorted);
      } else {
        throw new Error("Fetched data is not an array");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sortProducts = (option) => {
    let sorted = [...products];
    switch (option) {
      case "price-low":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        sorted.sort((a, b) => getLatestDate(b) - getLatestDate(a));
        break;
      case "oldest":
        sorted.sort((a, b) => getLatestDate(a) - getLatestDate(b));
        break;
      default:
        break;
    }
    // Only update state if it’s actually different
    const isSame = JSON.stringify(sorted) === JSON.stringify(products);
    if (!isSame) {
      setProducts(sorted);
    }
  };

  const loadDropdowns = async () => {
    const [carRes, modelRes, mainCats, subCats, childCats] = await Promise.all([
      getAllCars(),
      getAllCarModels(),
      mainGetCategories(),
      getSubCategories(),
      getAllChildCategories(),
    ]);
    setCarBrands(carRes?.data || []);
    setCarModels(
      Array.isArray(modelRes) ? modelRes : modelRes?.carModels || []
    );
    setMainCategories(
      Array.isArray(mainCats) ? mainCats : mainCats?.categories || []
    );
    setSubCategories(
      Array.isArray(subCats) ? subCats : subCats?.subCategories || []
    );
    setChildCategories(
      Array.isArray(childCats) ? childCats : childCats?.childCategories || []
    );
  };

  const handleDelete = (productId) => {
    setConfirmDeleteId(productId);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (confirmDeleteId) {
      try {
        await deleteProduct(vendorId, confirmDeleteId);
        setProducts(
          products.filter((product) => product._id !== confirmDeleteId)
        );
        toast.success("Product deleted successfully!");
      } catch (err) {
        setError(err.message);
        toast.error("Failed to delete product: " + err.message);
      } finally {
        setShowModal(false);
        setConfirmDeleteId(null);
      }
    }
  };

  const handleEdit = (product) => setEditingProduct(product);
  const handleView = (product) => setViewingProduct(product);
  const handleSave = async () => {
    await fetchProducts();
    setEditingProduct(null);
    toast.success("Product updated successfully!");
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "carBrandId") updated.carModelId = "";
      if (name === "categoryId") {
        updated.subCategoryId = "";
        updated.childCategoryId = "";
      }
      if (name === "subCategoryId") updated.childCategoryId = "";
      return updated;
    });
  };

  const applyFilters = () => {
    let filtered = products;
    if (filters.name)
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    if (filters.referenceNumber)
      filtered = filtered.filter((p) =>
        p.referenceNumber?.includes(filters.referenceNumber)
      );
    if (filters.carBrandId)
      filtered = filtered.filter((p) => p.carBrandId === filters.carBrandId);
    if (filters.carModelId)
      filtered = filtered.filter(
        (p) => p.carBrandModelId === filters.carModelId
      );
    if (filters.categoryId)
      filtered = filtered.filter((p) => p.categoryId === filters.categoryId);
    if (filters.subCategoryId)
      filtered = filtered.filter(
        (p) => p.subCategoryId === filters.subCategoryId
      );
    if (filters.childCategoryId)
      filtered = filtered.filter(
        (p) => p.childCategoryId === filters.childCategoryId
      );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const sortData = (data) => {
    const { key, direction } = sortConfig;
    if (!key) return data;
    return [...data].sort((a, b) => {
      if (key === "price" || key === "stock") {
        const aVal = key === "price" ? a.price : a.stock;
        const bVal = key === "price" ? b.price : b.stock;
        return direction === "asc" ? aVal - bVal : bVal - aVal;
      } else if (key === "status") {
        const aStatus = a.reflectStatus ? 1 : 0;
        const bStatus = b.reflectStatus ? 1 : 0;
        return direction === "asc" ? aStatus - bStatus : bStatus - aStatus;
      }
      return 0;
    });
  };

  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIndex = startIndex + PRODUCTS_PER_PAGE;
  const sortedFiltered = sortData(filteredProducts);
  const currentItems = sortedFiltered.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    const clampedPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(clampedPage);
    setEditPage(null);
  };

  let startPage = Math.max(1, currentPage - Math.floor(PAGE_WINDOW / 2));
  let endPage = startPage + PAGE_WINDOW - 1;
  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - PAGE_WINDOW + 1);
  }
  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) pageNumbers.push(i);

  const handleDoubleClick = (page) => {
    setEditPage(page);
    setInputValue(page);
  };

  const handleInputChange = (e) =>
    setInputValue(e.target.value.replace(/[^0-9]/g, ""));

  const handleInputBlur = () => {
    const page = Number(inputValue);
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
    setEditPage(null);
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") handleInputBlur();
    else if (e.key === "Escape") setEditPage(null);
  };

  const filteredModels = carModels.filter(
    (m) => m.carId === filters.carBrandId
  );
  const filteredSubCategories = subCategories.filter(
    (s) => s.categoryId === filters.categoryId
  );
  const filteredChildCategories = childCategories.filter(
    (ch) => ch.subCategoryId === filters.subCategoryId
  );

  const resetFilters = () => {
    setFilters({
      name: "",
      referenceNumber: "",
      carBrandId: "",
      carModelId: "",
      categoryId: "",
      subCategoryId: "",
      childCategoryId: "",
    });
    setSortOption("newest"); // reset sort dropdown
  };

  // formatPrice uses user locale and dynamic currency and default is INR
  const formatPrice = (price, currency = "INR") => {
    const userLocale = navigator.language || "en-IN";
    return new Intl.NumberFormat(userLocale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  if (loading)
    return (
      <div className="vpt-loading-spinner-container">
        <div className="vpt-spinner"></div>
        <div className="vpt-loading-text">Loading...</div>
      </div>
    );
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="vpt-table">
      <div className="vpt-filters-actions">
        <div className="vpt-filter-header">
          <div className="vpt-left-input">
            <p>Search By Name:</p>
            <input
              type="text"
              name="name"
              placeholder="Search by name"
              value={filters.name}
              onChange={handleFilterChange}
              className="vpt-left-input-input"
            />
          </div>
          <div className="vpt-right-button">
            <button className="vpt-reset-button" onClick={resetFilters}>
              Reset All Filters
            </button>
          </div>
        </div>

        <div className="vpt-accordion-row">
          {/* Accordion: Car Brands & Models */}
          <div
            className={`vpt-accordion-section${
              carAccordionOpen ? " open" : ""
            }`}>
            <button
              className="vpt-accordion-toggle"
              onClick={() => setCarAccordionOpen((prev) => !prev)}
              aria-expanded={carAccordionOpen}>
              <span>Select Car Brands & Models</span>
              <span className="vpt-accordion-arrow" aria-hidden="true">
                {carAccordionOpen ? "▲" : "▼"}
              </span>
            </button>
            {carAccordionOpen && (
              <div className="vpt-accordion-content">
                <div className="vpt-filter-row">
                  <select
                    name="carBrandId"
                    value={filters.carBrandId}
                    onChange={handleFilterChange}>
                    <option value="">Search Car Brands</option>
                    {carBrands.map((brand) => (
                      <option key={brand._id} value={brand._id}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                  <select
                    name="carModelId"
                    value={filters.carModelId}
                    onChange={handleFilterChange}
                    disabled={!filters.carBrandId}>
                    <option value="">Search Car Models</option>
                    {filteredModels.map((model) => (
                      <option key={model._id} value={model._id}>
                        {model.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Accordion: Categories */}
          <div
            className={`vpt-accordion-section${
              categoryAccordionOpen ? " open" : ""
            }`}>
            <button
              className="vpt-accordion-toggle"
              onClick={() => setCategoryAccordionOpen((prev) => !prev)}
              aria-expanded={categoryAccordionOpen}>
              <span>Select Categories</span>
              <span className="vpt-accordion-arrow" aria-hidden="true">
                {categoryAccordionOpen ? "▲" : "▼"}
              </span>
            </button>
            {categoryAccordionOpen && (
              <div className="vpt-accordion-content">
                <div className="vpt-filter-row">
                  <select
                    name="categoryId"
                    value={filters.categoryId}
                    onChange={handleFilterChange}>
                    <option value="">Search Main Categories</option>
                    {mainCategories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                  <select
                    name="subCategoryId"
                    value={filters.subCategoryId}
                    onChange={handleFilterChange}
                    disabled={!filters.categoryId}>
                    <option value="">Search Sub Categories</option>
                    {filteredSubCategories.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                  <select
                    name="childCategoryId"
                    value={filters.childCategoryId}
                    onChange={handleFilterChange}
                    disabled={!filters.subCategoryId}>
                    <option value="">Search Child Categories</option>
                    {filteredChildCategories.map((child) => (
                      <option key={child._id} value={child._id}>
                        {child.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="vpt-table-horizontal-line">
          <span>OR Reference No.</span>
        </div>

        <div className="vpt-reference-no">
          <input
            type="text"
            name="referenceNumber"
            placeholder="Search by reference no."
            value={filters.referenceNumber}
            onChange={handleFilterChange}
            className="vpt-reference-no-input"
          />
        </div>
      </div>

      <div className="vpt-table-responsive">
        <div className="vpt-table-header">
          <h3 className="vpt-table-h3">Edit Products:</h3>
          <div className="vpt-sort-dropdown">
            <select
              className="vpt-sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              aria-label="Sort products">
              <option value="newest">Sort by: Recently Added/Updated</option>
              <option value="oldest">Sort by: Oldest First</option>
              <option value="price-low">Sort by: Price Low to High</option>
              <option value="price-high">Sort by: Price High to Low</option>
            </select>
          </div>
        </div>
        <table className="vpt-table-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Reference No.</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length === 0 ? (
              <tr>
                <td className="vpt-no-products-message">
                  No products available. Start adding new products!
                </td>
              </tr>
            ) : (
              currentItems.map((product) => (
                <tr key={product._id}>
                  <td data-label="Image">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="vpt-product-image"
                    />
                  </td>
                  <td
                    data-label="Reference No."
                    title={product.referenceNumber}>
                    {product.referenceNumber}
                  </td>
                  <td data-label="Name" title={product.name}>
                    {product.name}
                  </td>
                  <td
                    data-label="Description"
                    title={product.description || product.discription}>
                    {product.description || product.discription}
                  </td>
                  {/* <td data-label="Price">{formatPrice(product.price)}</td> */}
                  <td data-label="Price">
                    {formatPrice(product.price, product.currency || "INR")}
                  </td>
                  <td data-label="Stock">{product.stock}</td>
                  <td
                    data-label="Status"
                    className={
                      product.reflectStatus
                        ? "vpt-status-active"
                        : "vpt-status-inactive"
                    }>
                    {product.reflectStatus ? "Active" : "Inactive"}
                  </td>
                  <td data-label="Actions">
                    <div className="vpt-action-buttons">
                      <button
                        className="vpt-edit-btn"
                        onClick={() => handleEdit(product)}>
                        Edit
                      </button>
                      <button
                        className="vpt-delete-btn"
                        onClick={() => handleDelete(product._id)}>
                        Delete
                      </button>
                    </div>
                  </td>
                  <td data-label="View">
                    <button
                      className="vpt-view-btn"
                      onClick={() => handleView(product)}>
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="vpt-pagination">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}>
            &laquo;
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}>
            &lsaquo;
          </button>

          {startPage > 1 && <span>...</span>}
          {pageNumbers.map((num) =>
            editPage === num ? (
              <input
                key={num}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                onKeyDown={handleInputKeyDown}
                className="vpt-pagination-input"
                autoFocus
                style={{ width: "40px" }}
              />
            ) : (
              <button
                key={num}
                className={currentPage === num ? "active" : ""}
                onClick={() => handlePageChange(num)}
                onDoubleClick={() => handleDoubleClick(num)}>
                {num}
              </button>
            )
          )}
          {endPage < totalPages && <span>...</span>}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}>
            &rsaquo;
          </button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}>
            &raquo;
          </button>
        </div>
      )}

      {editingProduct && (
        <VendorEditProduct
          product={editingProduct}
          onClose={() => setEditingProduct(null)}
          onSave={handleSave}
        />
      )}
      {viewingProduct && (
        <VendorViewProduct
          product={viewingProduct}
          onClose={() => setViewingProduct(null)}
          carBrands={carBrands}
          carModels={carModels}
          mainCategories={mainCategories}
          subCategories={subCategories}
          childCategories={childCategories}
        />
      )}
      <DeleteConfirmationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default VendorProductsTable;
