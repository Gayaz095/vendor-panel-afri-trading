// import React, { useState } from "react";
// import * as XLSX from "xlsx";
// import { createProduct } from "../utils/productsApi";
// import { imageUpload } from "../utils/imageUpload";
// import { useVendor } from "./VendorContext";
// import { toast } from "react-toastify";
// import "./componentsStyles/BulkProducts.css";

// const BulkProducts = ({ onProductAdded }) => {
//   const {
//     vendorDetails,
//     allCars,
//     allCarModels,
//     allCategories,
//     allSubCategories,
//     allChildCategories,
//   } = useVendor();

//   const [showModal, setShowModal] = useState(true);
//   const [excelProducts, setExcelProducts] = useState([]);
//   const [imageFiles, setImageFiles] = useState([]);
//   const [uploading, setUploading] = useState(false);

//   const handleExcelUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     const reader = new FileReader();
//     reader.onload = (evt) => {
//       const bstr = evt.target.result;
//       const workbook = XLSX.read(bstr, { type: "binary" });
//       const worksheet = workbook.Sheets[workbook.SheetNames[0]];
//       const data = XLSX.utils.sheet_to_json(worksheet);
//       setExcelProducts(data);
//     };
//     reader.readAsBinaryString(file);
//   };

//   const handleImagesUpload = (e) => {
//     setImageFiles(Array.from(e.target.files));
//   };

//   const findImageFile = (fileName) => {
//     return imageFiles.find(
//       (file) => file.name.trim().toLowerCase() === fileName.trim().toLowerCase()
//     );
//   };

//   const uploadLocalFile = async (file) => {
//     const formData = new FormData();
//     formData.append("image", file);
//     const res = await imageUpload(formData);
//     return res.imageUrl;
//   };

//   const handleBulkUpload = async () => {
//     if (!vendorDetails?.vendorId) {
//       toast.error("Vendor not authenticated.");
//       return;
//     }

//     if (!excelProducts.length || !imageFiles.length) {
//       toast.error("Please upload both Excel and image files.");
//       return;
//     }

//     setUploading(true);
//     const failed = [];

//     for (let index = 0; index < excelProducts.length; index++) {
//       const row = excelProducts[index];

//       try {
//         const imageFile = findImageFile(row.image);
//         const thumbFile = findImageFile(row.thumbnailImage);

//         const imageUrl = imageFile ? await uploadLocalFile(imageFile) : "";
//         const thumbUrl = thumbFile ? await uploadLocalFile(thumbFile) : "";

//         const payload = {
//           vendorId: vendorDetails.vendorId,
//           carBrandId: row.carBrandId || resolveId(allCars, row.carBrand),
//           carBrandModelId:
//             row.carBrandModelId ||
//             resolveId(
//               allCarModels,
//               row.carModel,
//               "carId",
//               "carBrandId",
//               allCars,
//               row.carBrand || row.carBrandId
//             ),
//           categoryId: row.categoryId || resolveId(allCategories, row.category),
//           subCategoryId:
//             row.subCategoryId ||
//             resolveId(
//               allSubCategories,
//               row.subCategory,
//               "categoryId",
//               "categoryId",
//               allCategories,
//               row.category || row.categoryId
//             ),
//           childCategoryId:
//             row.childCategoryId ||
//             resolveId(
//               allChildCategories,
//               row.childCategory,
//               "subCategoryId",
//               "subCategoryId",
//               allSubCategories,
//               row.subCategory || row.subCategoryId
//             ),
//           referenceNumber: row.referenceNumber,
//           name: row.name,
//           discription: row.discription,
//           image: imageUrl,
//           thumbnailImage: thumbUrl,
//           heroProduct: row.heroProduct || "NONE",
//           price: row.price,
//           stock: row.stock,
//           feautureProduct:
//             row.feautureProduct === "true" ||
//             row.feautureProduct === true ||
//             row.feautureProduct === "yes",
//         };

//         const requiredFields = [
//           "vendorId",
//           "carBrandId",
//           "carBrandModelId",
//           "categoryId",
//           "subCategoryId",
//           "childCategoryId",
//           "referenceNumber",
//           "name",
//           "discription",
//           "price",
//           "stock",
//           "image",
//           "thumbnailImage",
//         ];

//         const isValid = requiredFields.every((field) => {
//           const value = payload[field];
//           return (
//             value !== undefined && value !== null && String(value).trim() !== ""
//           );
//         });

//         if (!isValid) {
//           console.warn("Validation failed row:", payload);
//           failed.push({ row, reason: "Missing required fields" });
//           continue;
//         }

//         await createProduct(toFormData(payload));
//       } catch (err) {
//         console.error("Upload failed for row:", row, err);
//         failed.push({ row, reason: err.message });
//       }
//     }

//     setUploading(false);

//     if (failed.length === 0) {
//       toast.success("All products uploaded successfully.");
//       onProductAdded && onProductAdded();
//       setShowModal(false);
//     } else {
//       toast.error(`${failed.length} products failed. Check console.`);
//       console.log("Failed uploads:", failed);
//     }
//   };

//   const resolveId = (
//     collection,
//     label,
//     parentKey = "",
//     foreignKey = "",
//     parentCollection = [],
//     parentLabel = ""
//   ) => {
//     if (!label) return "";
//     if (parentKey && foreignKey && parentCollection.length > 0 && parentLabel) {
//       const parent = parentCollection.find(
//         (p) => p.name === parentLabel || p._id === parentLabel
//       );
//       if (parent) {
//         return (
//           collection.find(
//             (item) => item.name === label && item[parentKey] === parent._id
//           )?._id || ""
//         );
//       }
//     }
//     return (
//       collection.find((item) => item.name === label || item._id === label)
//         ?._id || ""
//     );
//   };

//   const toFormData = (obj) => {
//     const fd = new FormData();
//     Object.entries(obj).forEach(([key, val]) => fd.append(key, val));
//     return fd;
//   };

//   if (!showModal) return null;

//   return (
//     <div className="bulk-upload-modal-overlay">
//       <div className="bulk-upload-modal-content">
//         <h2>Bulk Upload Products</h2>

//         <label>Upload Excel File (.xlsx/.csv):</label>
//         <input
//           type="file"
//           accept=".xlsx, .xls, .csv"
//           onChange={handleExcelUpload}
//         />

//         <label>Upload Product Images (select all):</label>
//         <input
//           type="file"
//           multiple
//           accept="image/*"
//           onChange={handleImagesUpload}
//         />

//         <button
//           className="bulk-upload-btn"
//           onClick={handleBulkUpload}
//           disabled={uploading || !excelProducts.length || !imageFiles.length}>
//           {uploading ? "Uploading..." : "Upload Products"}
//         </button>

//         <button
//           className="bulk-upload-close"
//           onClick={() => setShowModal(false)}>
//           Close
//         </button>

//         {excelProducts.length > 0 && (
//           <div className="bulk-preview">
//             <h4>Preview ({excelProducts.length})</h4>
//             <table>
//               <thead>
//                 <tr>
//                   {Object.keys(excelProducts[0]).map((col) => (
//                     <th key={col}>{col}</th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {excelProducts.map((row, i) => (
//                   <tr key={i}>
//                     {Object.values(row).map((val, idx) => (
//                       <td key={idx}>{val}</td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default BulkProducts;



import React, { useState } from "react";
import * as XLSX from "xlsx";
import { createProduct } from "../utils/productsApi";
import { imageUpload } from "../utils/imageUpload";
import { useVendor } from "./VendorContext";
import { toast } from "react-toastify";
import "./componentsStyles/BulkProducts.css";

const BulkProducts = ({ onProductAdded }) => {
  const {
    vendorDetails,
    allCars,
    allCarModels,
    allCategories,
    allSubCategories,
    allChildCategories,
  } = useVendor();

  const [showModal, setShowModal] = useState(true);
  const [excelProducts, setExcelProducts] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleExcelUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setExcelProducts(data);
    };
    reader.readAsBinaryString(file);
  };

  const handleImagesUpload = (e) => {
    setImageFiles(Array.from(e.target.files));
  };

  const findImageFile = (fileName) => {
    return imageFiles.find(
      (file) => file.name.trim().toLowerCase() === fileName.trim().toLowerCase()
    );
  };

  const uploadLocalFile = async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    const res = await imageUpload(formData);
    return res.imageUrl;
  };

  // Improved resolveId: case-insensitive, logs missing
  const resolveId = (
    collection,
    label,
    parentKey = "",
    foreignKey = "",
    parentCollection = [],
    parentLabel = ""
  ) => {
    if (!label) return "";
    let parentId = "";
    if (parentKey && foreignKey && parentCollection.length > 0 && parentLabel) {
      const parent = parentCollection.find(
        (p) =>
          (p.name &&
            p.name.trim().toLowerCase() === parentLabel.trim().toLowerCase()) ||
          (p._id && p._id === parentLabel)
      );
      parentId = parent?._id || "";
    }
    const item = collection.find(
      (item) =>
        item.name &&
        item.name.trim().toLowerCase() === label.trim().toLowerCase() &&
        (!parentKey || !parentId || item[parentKey] === parentId)
    );
    if (!item) {
      console.warn(
        `resolveId: Could not find "${label}" in collection`,
        collection
      );
      return "";
    }
    return item._id;
  };

  const toFormData = (obj) => {
    const fd = new FormData();
    Object.entries(obj).forEach(([key, val]) => fd.append(key, val));
    return fd;
  };

  const handleBulkUpload = async () => {
    if (!vendorDetails?.vendorId) {
      toast.error("Vendor not authenticated.");
      return;
    }

    if (!excelProducts.length || !imageFiles.length) {
      toast.error("Please upload both Excel and image files.");
      return;
    }

    setUploading(true);
    const failed = [];

    for (let index = 0; index < excelProducts.length; index++) {
      const row = excelProducts[index];

      try {
        const imageFile = findImageFile(row.image);
        const thumbFile = findImageFile(row.thumbnailImage);

        const imageUrl = imageFile ? await uploadLocalFile(imageFile) : "";
        const thumbUrl = thumbFile ? await uploadLocalFile(thumbFile) : "";

        // Resolve category IDs robustly
        const categoryId =
          row.categoryId || resolveId(allCategories, row.category);
        const subCategoryId =
          row.subCategoryId ||
          resolveId(
            allSubCategories,
            row.subCategory,
            "categoryId",
            "categoryId",
            allCategories,
            row.category || row.categoryId
          );
        const childCategoryId =
          row.childCategoryId ||
          resolveId(
            allChildCategories,
            row.childCategory,
            "subCategoryId",
            "subCategoryId",
            allSubCategories,
            row.subCategory || row.subCategoryId
          );

        // Log warnings if any category is missing
        if (!categoryId)
          console.warn(
            `Row ${index + 1}: Main category missing or not matched:`,
            row.category
          );
        if (!subCategoryId)
          console.warn(
            `Row ${index + 1}: Sub category missing or not matched:`,
            row.subCategory
          );
        if (!childCategoryId)
          console.warn(
            `Row ${index + 1}: Child category missing or not matched:`,
            row.childCategory
          );

        const payload = {
          vendorId: vendorDetails.vendorId,
          carBrandId: row.carBrandId || resolveId(allCars, row.carBrand),
          carBrandModelId:
            row.carBrandModelId ||
            resolveId(
              allCarModels,
              row.carModel,
              "carId",
              "carBrandId",
              allCars,
              row.carBrand || row.carBrandId
            ),
          categoryId,
          subCategoryId,
          childCategoryId,
          referenceNumber: row.referenceNumber,
          name: row.name,
          discription: row.discription,
          image: imageUrl,
          thumbnailImage: thumbUrl,
          heroProduct: row.heroProduct || "NONE",
          price: row.price,
          stock: row.stock,
          feautureProduct:
            row.feautureProduct === "true" ||
            row.feautureProduct === true ||
            row.feautureProduct === "yes",
        };

        const requiredFields = [
          "vendorId",
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
          "image",
          "thumbnailImage",
        ];

        const isValid = requiredFields.every((field) => {
          const value = payload[field];
          return (
            value !== undefined && value !== null && String(value).trim() !== ""
          );
        });

        if (!isValid) {
          console.warn("Validation failed row:", payload);
          failed.push({ row, reason: "Missing required fields" });
          continue;
        }

        await createProduct(toFormData(payload));
      } catch (err) {
        console.error("Upload failed for row:", row, err);
        failed.push({ row, reason: err.message });
      }
    }

    setUploading(false);

    if (failed.length === 0) {
      toast.success("All products uploaded successfully.");
      onProductAdded && onProductAdded();
      setShowModal(false);
    } else {
      toast.error(`${failed.length} products failed.`);
      console.log("Failed uploads:", failed);
    }
  };

  // Helper for preview: highlight missing category fields
  const highlightCell = (col, val, row) => {
    if (
      (col === "category" && !resolveId(allCategories, row.category)) ||
      (col === "subCategory" &&
        !resolveId(
          allSubCategories,
          row.subCategory,
          "categoryId",
          "categoryId",
          allCategories,
          row.category || row.categoryId
        )) ||
      (col === "childCategory" &&
        !resolveId(
          allChildCategories,
          row.childCategory,
          "subCategoryId",
          "subCategoryId",
          allSubCategories,
          row.subCategory || row.subCategoryId
        ))
    ) {
      return { color: "red", fontWeight: "bold" };
    }
    return {};
  };

  if (!showModal) return null;

  return (
    <div className="bulk-upload-modal-overlay">
      <div className="bulk-upload-modal-content">
        <h2>Bulk Upload Products</h2>

        <label>Upload Excel File (.xlsx/.csv):</label>
        <input
          type="file"
          accept=".xlsx, .xls, .csv"
          onChange={handleExcelUpload}
        />

        <label>Upload Product Images (select all):</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImagesUpload}
        />

        <button
          className="bulk-upload-btn"
          onClick={handleBulkUpload}
          disabled={uploading || !excelProducts.length || !imageFiles.length}>
          {uploading ? "Uploading..." : "Upload Products"}
        </button>

        <button
          className="bulk-upload-close"
          onClick={() => setShowModal(false)}>
          Close
        </button>

        {excelProducts.length > 0 && (
          <div className="bulk-preview">
            <h4>Preview ({excelProducts.length})</h4>
            <table>
              <thead>
                <tr>
                  {Object.keys(excelProducts[0]).map((col) => (
                    <th key={col}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelProducts.map((row, i) => (
                  <tr key={i}>
                    {Object.entries(row).map(([col, val], idx) => (
                      <td key={idx} style={highlightCell(col, val, row)}>
                        {val}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            <p style={{ color: "red", fontWeight: "bold" }}>
              * Red fields indicate missing or unmatched categories!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BulkProducts;
