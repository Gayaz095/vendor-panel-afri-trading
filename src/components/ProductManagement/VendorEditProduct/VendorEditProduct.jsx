import React, { useState, useEffect } from "react";
import { imageUpload } from "../../../utils/imageUpload";
import { updateProduct, getVendorProducts } from "../../../utils/productsApi";
import { getAllCars } from "../../../utils/getAllCars";
import { getAllCarModels } from "../../../utils/getAllCarModels";
import { mainGetCategories } from "../../../utils/mainGetCategories";
import { getSubCategories } from "../../../utils/getSubCategories";
import { getAllChildCategories } from "../../../utils/getAllChildCategories";
import { useVendor } from "../../VendorContext/VendorContext";
import {
  FaTag,
  FaHashtag,
  FaCar,
  FaThList,
  FaBoxes,
  FaDollarSign,
  FaWarehouse,
  FaStar,
  FaImage,
  FaAlignLeft,
  FaEdit,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "./VendorEditProduct.css";

const VendorEditProduct = ({ product, onClose, onSave }) => {
  const { vendorDetails } = useVendor();

  const [formData, setFormData] = useState({
    name: "",
    discription: "",
    price: "",
    stock: "",
    referenceNumber: "",
    carBrandId: "",
    carBrandModelId: "",
    categoryId: "",
    subCategoryId: "",
    childCategoryId: "",
    feautureProduct: false,
    heroProduct: "",
  });

  const [carBrands, setCarBrands] = useState([]);
  const [carModels, setCarModels] = useState([]);
  const [mainCategories, setMainCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [childCategories, setChildCategories] = useState([]);
  const [mainImageFile, setMainImageFile] = useState(null);
  const [thumbnailImageFile, setThumbnailImageFile] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [thumbnailImagePreview, setThumbnailImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // For reference number duplicate check
  const [allReferenceNumbers, setAllReferenceNumbers] = useState([]);
  const [referenceError, setReferenceError] = useState("");

  const heroOptions = ["NEW ARRIVAL", "TRENDING", "BEST SELLING", "POPULAR"];

  // Fetch dropdowns and reference numbers
  useEffect(() => {
    loadDropdowns();
    if (product) {
      setFormData({
        name: product.name || "",
        discription: product.discription || "",
        price: product.price || "",
        stock: product.stock || "",
        referenceNumber: product.referenceNumber || "",
        carBrandId: product.carBrandId || "",
        carBrandModelId: product.carBrandModelId || "",
        categoryId: product.categoryId || "",
        subCategoryId: product.subCategoryId || "",
        childCategoryId: product.childCategoryId || "",
        feautureProduct: product.feautureProduct || false,
        heroProduct: product.heroProduct || "",
      });
      setMainImagePreview(product.image || null);
      setThumbnailImagePreview(product.thumbnailImage || null);
    }
  }, [product]);

  useEffect(() => {
    // Fetch all reference numbers for this vendor (excluding this product)
    const fetchReferenceNumbers = async () => {
      if (!vendorDetails?.vendorId) return;
      const products = await getVendorProducts(vendorDetails.vendorId);
      const numbers = (products || [])
        .filter((p) => p._id !== product?._id)
        .map((p) => (p.referenceNumber || "").trim());
      setAllReferenceNumbers(numbers);
    };
    fetchReferenceNumbers();
  }, [vendorDetails, product]);

  const loadDropdowns = async () => {
    const carRes = await getAllCars();
    setCarBrands(carRes?.data || []);
    const modelRes = await getAllCarModels();
    setCarModels(
      Array.isArray(modelRes) ? modelRes : modelRes?.carModels || []
    );
    const mainCats = await mainGetCategories();
    setMainCategories(
      Array.isArray(mainCats) ? mainCats : mainCats?.categories || []
    );
    const subCats = await getSubCategories();
    setSubCategories(
      Array.isArray(subCats) ? subCats : subCats?.subCategories || []
    );
    const childCats = await getAllChildCategories();
    setChildCategories(
      Array.isArray(childCats) ? childCats : childCats?.childCategories || []
    );
  };

  const filteredModels = carModels.filter(
    (m) => m.carId === formData.carBrandId
  );
  const filteredSubCats = subCategories.filter(
    (s) => s.categoryId === formData.categoryId
  );
  const filteredChildCats = childCategories.filter(
    (c) => c.subCategoryId === formData.subCategoryId
  );

  // Block typing duplicate reference number
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    if (name === "referenceNumber") {
      if (allReferenceNumbers.includes(value.trim())) {
        setReferenceError("Reference number already exists!");
        return; // Block updating the formData
      } else {
        setReferenceError("");
      }
    }

    setFormData((prev) => ({ ...prev, [name]: val }));

    if (name === "carBrandId")
      setFormData((prev) => ({ ...prev, carBrandModelId: "" }));
    if (name === "categoryId")
      setFormData((prev) => ({
        ...prev,
        subCategoryId: "",
        childCategoryId: "",
      }));
    if (name === "subCategoryId")
      setFormData((prev) => ({ ...prev, childCategoryId: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewURL = URL.createObjectURL(file);
    if (e.target.name === "image") {
      setMainImageFile(file);
      setMainImagePreview(previewURL);
    } else if (e.target.name === "thumbnailImage") {
      setThumbnailImageFile(file);
      setThumbnailImagePreview(previewURL);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!vendorDetails?.vendorId) throw new Error("Vendor ID not found");

      // Double-check for duplicate reference number before submitting
      if (allReferenceNumbers.includes(formData.referenceNumber.trim())) {
        setReferenceError("Reference number already exists!");
        setLoading(false);
        return;
      }

      const updatedProduct = {
        id: product._id,
        vendorId: vendorDetails.vendorId,
        ...formData,
        image: product.image,
        thumbnailImage: product.thumbnailImage,
      };

      if (mainImageFile) {
        const res = await imageUpload({ image: mainImageFile });
        updatedProduct.image = res.imageUrl || res.secure_url;
      }

      if (thumbnailImageFile) {
        const res = await imageUpload({ image: thumbnailImageFile });
        updatedProduct.thumbnailImage = res.imageUrl || res.secure_url;
      }

      const response = await updateProduct(
        vendorDetails.vendorId,
        updatedProduct
      );

      if (response?.message?.includes("Product updated")) {
        onSave();
        setFormData({
          name: "",
          discription: "",
          price: "",
          stock: "",
          referenceNumber: "",
          carBrandId: "",
          carBrandModelId: "",
          categoryId: "",
          subCategoryId: "",
          childCategoryId: "",
          feautureProduct: false,
          heroProduct: "",
        });
        setMainImageFile(null);
        setThumbnailImageFile(null);
        setMainImagePreview(null);
        setThumbnailImagePreview(null);
      } else {
        toast.error(response?.message || "Product update failed");
      }
    } catch (err) {
      toast.error(err.message || "Error updating product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="vendor-edit-product__modal-overlay">
      <div className="vendor-edit-product__modal">
        <h2 className="vendor-edit-product__modal_h2">
          <FaEdit />
          Edit Product Details
        </h2>
        <form onSubmit={handleSubmit}>
          {/* SECTION: Reference Number */}
          <div className="vendor-edit-product__form-group">
            <label>
              <FaHashtag style={{ marginRight: "6px" }} />
              Reference Number:
            </label>
            <div className="vendor-edit-product__input-tooltip-container">
              <input
                name="referenceNumber"
                value={formData.referenceNumber}
                onChange={handleInputChange}
                required
                className={
                  referenceError ? "vendor-edit-product__input-error" : ""
                }
              />
              {referenceError && (
                <div className="vendor-edit-product__tooltip">
                  {referenceError}
                  <span className="vendor-edit-product__tooltip-arrow" />
                </div>
              )}
            </div>
          </div>

          {/* SECTION: Name */}
          <div className="vendor-edit-product__form-group">
            <label>
              <FaTag style={{ marginRight: "6px" }} />
              Name:
            </label>
            <textarea
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* SECTION: Car Brand / Model */}
          <div className="vendor-edit-product__form-row">
            <div className="vendor-edit-product__form-group">
              <label>
                <FaCar style={{ marginRight: "6px" }} />
                Car Brand:
              </label>
              <select
                name="carBrandId"
                value={formData.carBrandId}
                onChange={handleInputChange}
                required>
                <option value="">Select Car Brand</option>
                {carBrands.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="vendor-edit-product__form-group">
              <label>
                <FaCar style={{ marginRight: "6px" }} />
                Car Model:
              </label>
              <select
                name="carBrandModelId"
                value={formData.carBrandModelId}
                onChange={handleInputChange}
                required>
                <option value="">Select Car Model</option>
                {filteredModels.map((model) => (
                  <option key={model._id} value={model._id}>
                    {model.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SECTION: Categories */}
          <div className="vendor-edit-product__form-row">
            <div className="vendor-edit-product__form-group">
              <label>
                <FaThList style={{ marginRight: "6px" }} />
                Main Category:
              </label>
              <select
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                required>
                <option value="">Select Main Category</option>
                {mainCategories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="vendor-edit-product__form-group">
              <label>
                <FaBoxes style={{ marginRight: "6px" }} />
                Sub Category:
              </label>
              <select
                name="subCategoryId"
                value={formData.subCategoryId}
                onChange={handleInputChange}
                required>
                <option value="">Select Sub Category</option>
                {filteredSubCats.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SECTION: Child Category */}
          <div className="vendor-edit-product__form-group">
            <label>
              <FaBoxes style={{ marginRight: "6px" }} />
              Child Category:
            </label>
            <select
              name="childCategoryId"
              value={formData.childCategoryId}
              onChange={handleInputChange}
              required>
              <option value="">Select Child Category</option>
              {filteredChildCats.map((child) => (
                <option key={child._id} value={child._id}>
                  {child.name}
                </option>
              ))}
            </select>
          </div>

          {/* SECTION: Price + Stock */}
          <div className="vendor-edit-product__form-row">
            <div className="vendor-edit-product__form-group">
              <label>
                {/* <FaDollarSign style={{ marginRight: "6px" }} /> */}
                <span style={{ fontSize: "22px" }}>&#8377;</span>
                Price:
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="vendor-edit-product__form-group">
              <label>
                <FaWarehouse style={{ marginRight: "6px" }} />
                Stock:
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Checkbox */}
          <div className="vendor-edit-product__form-group__checkbox-container">
            <label>
              <FaStar style={{ marginRight: "6px" }} />
              Featured Product:
            </label>
            <div className="vendor-edit-product__checkbox-container">
              <input
                type="checkbox"
                name="feautureProduct"
                checked={formData.feautureProduct}
                onChange={handleInputChange}
              />
            </div>
          </div>

          {/* Hero Product */}
          <div className="vendor-edit-product__form-group">
            <label>Hero Product:</label>
            <select
              name="heroProduct"
              value={formData.heroProduct}
              onChange={handleInputChange}>
              <option value="">None</option>
              {heroOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Images */}
          <div className="vendor-edit-product__image-container">
            <div className="vendor-edit-product__image-upload">
              <label>
                <FaImage style={{ marginRight: "6px" }} />
                Main Image:
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
              />
              {mainImagePreview && (
                <img
                  src={mainImagePreview}
                  alt="Main Preview"
                  className="vendor-edit-product__preview-image"
                />
              )}
            </div>
            <div className="vendor-edit-product__image-upload">
              <label>
                <FaImage style={{ marginRight: "6px" }} />
                Thumbnail Image:
              </label>
              <input
                type="file"
                name="thumbnailImage"
                accept="image/*"
                onChange={handleFileChange}
              />
              {thumbnailImagePreview && (
                <img
                  src={thumbnailImagePreview}
                  alt="Thumb Preview"
                  className="vendor-edit-product__preview-image"
                />
              )}
            </div>
          </div>

          {/* Description */}
          <div className="vendor-edit-product__form-group">
            <label>
              <FaAlignLeft style={{ marginRight: "6px" }} />
              Description:
            </label>
            <textarea
              name="discription"
              value={formData.discription}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Actions */}
          <div className="vendor-edit-product__actions">
            <button
              type="submit"
              disabled={loading || !!referenceError}
              className="vendor-edit-product__cancel-button">
              {loading ? "Updating..." : "Update"}
            </button>
            <button
              type="button"
              className="vendor-edit-product__cancel-button"
              onClick={onClose}
              disabled={loading}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorEditProduct;
