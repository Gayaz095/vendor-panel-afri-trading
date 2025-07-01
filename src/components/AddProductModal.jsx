// AddProductModal.jsx
import React, { useState, useEffect, useRef } from "react";
import { createProduct, updateProduct } from "../utils/productsApi";
import { imageUpload } from "../utils/imageUpload";
import { useVendor } from "./VendorContext";
import { AiOutlineClose } from "react-icons/ai";
import { MdStars } from "react-icons/md";
import { FiUpload } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./componentsStyles/AddProductModal.css";

const AddProductModal = ({ onClose, productToEdit = null, onProductAdded }) => {
  const {
    vendorDetails,
    allCars,
    allCarModels,
    allCategories,
    allSubCategories,
    allChildCategories,
  } = useVendor();

  const [productData, setProductData] = useState({
    carBrandId: "",
    carBrandModelId: "",
    categoryId: "",
    subCategoryId: "",
    childCategoryId: "",
    referenceNumber: "",
    name: "",
    discription: "",
    image: null,
    thumbnailImage: null,
    heroProduct: "",
    price: "",
    stock: "",
    feautureProduct: false,
  });

  const formRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);

  useEffect(() => {
    if (productToEdit) {
      setProductData({
        ...productToEdit,
        image: null,
        thumbnailImage: null,
        feautureProduct: !!productToEdit.feautureProduct,
      });
      setImagePreview(productToEdit.image);
      setThumbnailPreview(productToEdit.thumbnailImage);
    }
  }, [productToEdit]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => {
      const updated = {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
      if (name === "carBrandId") updated.carBrandModelId = "";
      if (name === "categoryId") {
        updated.subCategoryId = "";
        updated.childCategoryId = "";
      }
      if (name === "subCategoryId") {
        updated.childCategoryId = "";
      }
      return updated;
    });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      const file = files[0];
      setProductData((prev) => ({ ...prev, [name]: file }));

      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === "image") setImagePreview(reader.result);
        if (name === "thumbnailImage") setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const scrollToInvalid = () => {
    const firstInvalid = formRef.current.querySelector(":invalid");
    if (firstInvalid)
      firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!vendorDetails?.vendorId) {
      toast.error("Vendor not authenticated.");
      return;
    }

    const requiredFields = [
      "carBrandId",
      "carBrandModelId",
      "categoryId",
      "subCategoryId",
      "childCategoryId",
      "referenceNumber",
      "name",
      "discription",
      "price",
      "stock",
    ];

    const isFormValid = requiredFields.every((field) => productData[field]);
    if (!isFormValid) {
      toast.error("Please fill all required fields.");
      scrollToInvalid();
      return;
    }

    try {
      const formData = new FormData();
      formData.append("vendorId", vendorDetails.vendorId);
      Object.entries(productData).forEach(([key, val]) => {
        if (key !== "image" && key !== "thumbnailImage") {
          formData.append(key, val);
        }
      });

      if (productData.image) {
        const imageForm = new FormData();
        imageForm.append("image", productData.image);
        const res = await imageUpload(imageForm);
        formData.append("image", res.imageUrl);
      } else if (productToEdit?.image) {
        formData.append("image", productToEdit.image);
      }

      if (productData.thumbnailImage) {
        const thumbForm = new FormData();
        thumbForm.append("image", productData.thumbnailImage);
        const res = await imageUpload(thumbForm);
        formData.append("thumbnailImage", res.imageUrl);
      } else if (productToEdit?.thumbnailImage) {
        formData.append("thumbnailImage", productToEdit.thumbnailImage);
      }

      if (productToEdit) {
        await updateProduct(productToEdit.id, formData);
        toast.success("Product updated!");
      } else {
        await createProduct(formData);
        toast.success("Product added!");
        onProductAdded();
      }

      onClose();
    } catch (err) {
      console.error("Submission error:", err);
      toast.error("Failed to submit product.");
    }
  };

  const heroProductOptions = [
    "NONE",
    "NEW ARRIVAL",
    "TRENDING",
    "BEST SELLING",
    "POPULAR",
  ];

  const filteredModels = allCarModels.filter(
    (m) => m.carId === productData.carBrandId
  );
  const filteredSubCategories = allSubCategories.filter(
    (s) => s.categoryId === productData.categoryId
  );
  const filteredChildCategories = allChildCategories.filter(
    (ch) => ch.subCategoryId === productData.subCategoryId
  );

  return (
    <div className="add-product-modal-overlay">
      <div className="add-product-modal-content">
        <span className="add-product-modal-close" onClick={onClose}>
          <AiOutlineClose />
        </span>
        <h2 className="add-product-modal-h2">
          {productToEdit ? "Update Product" : "Add New Product"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="add-product-form"
          ref={formRef}>
          <select
            name="carBrandId"
            value={productData.carBrandId}
            onChange={handleInputChange}
            required>
            <option value="">Select Car Brand *</option>
            {allCars.map((car) => (
              <option key={car._id} value={car._id}>
                {car.name}
              </option>
            ))}
          </select>

          <select
            name="carBrandModelId"
            value={productData.carBrandModelId}
            onChange={handleInputChange}
            required>
            <option value="">Select Car Model *</option>
            {filteredModels.map((model) => (
              <option key={model._id} value={model._id}>
                {model.name}
              </option>
            ))}
          </select>

          <select
            name="categoryId"
            value={productData.categoryId}
            onChange={handleInputChange}
            required>
            <option value="">Select Category *</option>
            {allCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          <select
            name="subCategoryId"
            value={productData.subCategoryId}
            onChange={handleInputChange}
            required>
            <option value="">Select Sub Category *</option>
            {filteredSubCategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>

          <select
            name="childCategoryId"
            value={productData.childCategoryId}
            onChange={handleInputChange}
            required>
            <option value="">Select Child Category *</option>
            {filteredChildCategories.length > 0 ? (
              filteredChildCategories.map((child) => (
                <option key={child._id} value={child._id}>
                  {child.name}
                </option>
              ))
            ) : (
              <option disabled>No child categories found</option>
            )}
          </select>

          <input
            type="text"
            name="referenceNumber"
            placeholder="Reference Number *"
            value={productData.referenceNumber}
            onChange={handleInputChange}
            required
          />

          <textarea
            name="name"
            placeholder="Product Name *"
            value={productData.name}
            onChange={handleInputChange}
            required
          />

          <textarea
            name="discription"
            placeholder="Product Description *"
            value={productData.discription}
            onChange={handleInputChange}
            required
          />

          <div className="add-product-image-upload">
            <h5>
              <FiUpload /> Upload Product Image *
            </h5>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="add-product-image-preview"
              />
            )}
          </div>

          <div className="add-product-image-upload">
            <h5>
              <FiUpload /> Upload Thumbnail Image *
            </h5>
            <input
              type="file"
              name="thumbnailImage"
              accept="image/*"
              onChange={handleFileChange}
            />
            {thumbnailPreview && (
              <img
                src={thumbnailPreview}
                alt="Thumbnail Preview"
                className="add-product-image-preview"
              />
            )}
          </div>

          <select
            name="heroProduct"
            value={productData.heroProduct}
            onChange={handleInputChange}
            required>
            {heroProductOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          <input
            type="number"
            name="price"
            placeholder="Price *"
            value={productData.price}
            onChange={handleInputChange}
            required
          />

          <input
            type="number"
            name="stock"
            placeholder="Stock *"
            value={productData.stock}
            onChange={handleInputChange}
            required
          />

          <label className="add-product-checkbox-label">
            <MdStars /> Feature Product:
            <input
              type="checkbox"
              name="feautureProduct"
              checked={productData.feautureProduct}
              onChange={handleInputChange}
            />
          </label>

          <button type="submit" className="add-product-modal-button">
            {productToEdit ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProductModal;
