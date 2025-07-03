import React, { useState } from "react";
import * as XLSX from "xlsx";
import { createProduct } from "../utils/productsApi";
import { imageUpload } from "../utils/imageUpload";
import { useVendor } from "./VendorContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./componentsStyles/BulkProducts.css";

const BulkProducts = () => {
  const { vendorDetails } = useVendor();
  const [products, setProducts] = useState([]);
  const [fileName, setFileName] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws);
      setProducts(data);
    };
    reader.readAsBinaryString(file);
  };

  const handleImageFolderSelect = (e) => {
    const filesArray = Array.from(e.target.files);
    setSelectedFiles(filesArray);
  };

  const findFileByName = (filePath) => {
    if (!filePath) return null;
    const baseName = filePath.split("\\").pop().split("/").pop();
    return selectedFiles.find((file) => file.name === baseName) || null;
  };

  const handleBulkUpload = async () => {
    if (!vendorDetails?.vendorId) {
      toast.error("Vendor not authenticated.");
      return;
    }

    if (!products.length) {
      toast.error("No product data found in uploaded file.");
      return;
    }

    setLoading(true);
    let successCount = 0;
    const now = new Date().toISOString();

    for (const [index, product] of products.entries()) {
      try {
        const formData = new FormData();
        formData.append("vendorId", vendorDetails.vendorId);

        // Upload image to Cloudinary if found
        if (product.image) {
          const imageFile = findFileByName(product.image);
          if (imageFile) {
            const imageForm = new FormData();
            imageForm.append("image", imageFile);
            const res = await imageUpload(imageForm);
            if (res.imageUrl) {
              formData.append("image", res.imageUrl);
            } else {
              console.warn(
                `Cloudinary upload failed for image: ${product.image}`
              );
            }
          } else {
            console.warn(`Image file not found: ${product.image}`);
          }
        }

        // Upload thumbnailImage to Cloudinary if found
        if (product.thumbnailImage) {
          const thumbFile = findFileByName(product.thumbnailImage);
          if (thumbFile) {
            const thumbForm = new FormData();
            thumbForm.append("image", thumbFile);
            const res = await imageUpload(thumbForm);
            if (res.imageUrl) {
              formData.append("thumbnailImage", res.imageUrl);
            } else {
              console.warn(
                `Cloudinary upload failed for thumbnail: ${product.thumbnailImage}`
              );
            }
          } else {
            console.warn(
              `Thumbnail image file not found: ${product.thumbnailImage}`
            );
          }
        }

        // Append other fields
        const fields = [
          "carBrandId",
          "carBrandModelId",
          "categoryId",
          "subCategoryId",
          "childCategoryId",
          "referenceNumber",
          "name",
          "discription",
          "heroProduct",
          "price",
          "stock",
          "feautureProduct",
        ];

        fields.forEach((field) => {
          const value = product[field];
          if (value !== undefined && value !== "") {
            formData.append(field, value);
          }
        });

        formData.append("createdAt", now);
        formData.append("updatedAt", now);

        await createProduct(formData);
        successCount++;
      } catch (err) {
        console.error(`Row ${index + 1} failed:`, err);
      }
    }

    setLoading(false);
    toast.success(`${successCount}/${products.length} products uploaded.`);
    setProducts([]);
    setFileName(null);
    setSelectedFiles([]);
  };

  return (
    <div className="bulk-upload-container">
      <h2>Bulk Upload Products</h2>

      <label>
        Select Excel File:
        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={handleFileUpload}
        />
      </label>

      <label>
        Select Image Folder:
        <input
          type="file"
          accept="image/*"
          multiple
          webkitdirectory="true"
          directory=""
          onChange={handleImageFolderSelect}
        />
      </label>

      {fileName && <p>Uploaded File: {fileName}</p>}
      <p>Images Selected: {selectedFiles.length}</p>

      <button onClick={handleBulkUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload Products"}
      </button>
    </div>
  );
};

export default BulkProducts;
// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { createProduct } from "../utils/productsApi";
// import { useVendor } from "./VendorContext";
// import { toast } from "react-toastify";
// import { imageUpload } from "../utils/imageUpload";
// import "react-toastify/dist/ReactToastify.css";
// import "./componentsStyles/BulkProducts.css";

// const BulkProducts = () => {
//   const { vendorDetails } = useVendor();
//   const [products, setProducts] = useState([]);
//   const [fileName, setFileName] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [selectedFiles, setSelectedFiles] = useState([]);

//   const handleFileUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setFileName(file.name);
//     const reader = new FileReader();
//     reader.onload = (evt) => {
//       const bstr = evt.target.result;
//       const wb = XLSX.read(bstr, { type: "binary" });
//       const wsname = wb.SheetNames[0];
//       const ws = wb.Sheets[wsname];
//       const data = XLSX.utils.sheet_to_json(ws);
//       setProducts(data);
//     };
//     reader.readAsBinaryString(file);
//   };

//   const handleImageFolderSelect = (e) => {
//     const filesArray = Array.from(e.target.files);
//     setSelectedFiles(filesArray);
//   };

//   const findFileByName = (filePath) => {
//     if (!filePath) return null;
//     const baseName = filePath.split("\\").pop().split("/").pop();
//     return selectedFiles.find((file) => file.name === baseName) || null;
//   };

//   const handleBulkUpload = async () => {
//     if (!vendorDetails?.vendorId) {
//       toast.error("Vendor not authenticated.");
//       return;
//     }

//     if (!products.length) {
//       toast.error("No product data found in uploaded file.");
//       return;
//     }

//     setLoading(true);
//     let successCount = 0;
//     const now = new Date().toISOString();

//     for (const [index, product] of products.entries()) {
//       try {
//         const formData = new FormData();
//         formData.append("vendorId", vendorDetails.vendorId);

//         // Upload image if provided in Excel and found in selectedFiles
//         if (product.image) {
//           const imageFile = findFileByName(product.image);
//           if (imageFile) {
//             const imageForm = new FormData();
//             imageForm.append("image", imageFile);
//             const res = await imageUpload(imageForm);
//             formData.append("image", res.imageUrl);
//           } else {
//             console.warn(
//               `Image file not found for row ${index + 1}: ${product.image}`
//             );
//           }
//         }

//         if (product.thumbnailImage) {
//           const thumbFile = findFileByName(product.thumbnailImage);
//           if (thumbFile) {
//             const thumbForm = new FormData();
//             thumbForm.append("image", thumbFile);
//             const res = await imageUpload(thumbForm);
//             formData.append("thumbnailImage", res.imageUrl);
//           } else {
//             console.warn(
//               `Thumbnail image not found for row ${index + 1}: ${
//                 product.thumbnailImage
//               }`
//             );
//           }
//         }

//         // Append other fields
//         const fields = [
//           "carBrandId",
//           "carBrandModelId",
//           "categoryId",
//           "subCategoryId",
//           "childCategoryId",
//           "referenceNumber",
//           "name",
//           "discription",
//           "heroProduct",
//           "price",
//           "stock",
//           "feautureProduct",
//         ];

//         fields.forEach((field) => {
//           const value = product[field];
//           if (value !== undefined && value !== "") {
//             formData.append(field, value);
//           }
//         });

//         formData.append("createdAt", now);
//         formData.append("updatedAt", now);

//         await createProduct(formData);
//         successCount++;
//       } catch (err) {
//         console.error(`Row ${index + 1} failed:`, err);
//       }
//     }

//     setLoading(false);
//     toast.success(`${successCount}/${products.length} products uploaded.`);
//     setProducts([]);
//     setFileName(null);
//     setSelectedFiles([]);
//   };

//   return (
//     <div className="bulk-upload-container">
//       <h2>Bulk Upload Products</h2>

//       <label>
//         Select Excel File:
//         <input
//           type="file"
//           accept=".xlsx, .xls, .csv"
//           onChange={handleFileUpload}
//         />
//       </label>

//       <label>
//         Select Image Folder:
//         <input
//           type="file"
//           accept="image/*"
//           multiple
//           webkitdirectory="true"
//           directory=""
//           onChange={handleImageFolderSelect}
//         />
//       </label>

//       {fileName && <p>Uploaded File: {fileName}</p>}
//       <p>Images Selected: {selectedFiles.length}</p>

//       <button onClick={handleBulkUpload} disabled={loading}>
//         {loading ? "Uploading..." : "Upload Products"}
//       </button>
//     </div>
//   );
// };

// export default BulkProducts;


