import React, { useState } from "react";
import { createProduct } from "../utils/productsApi";
import { useVendor } from "./VendorContext";
import * as Papa from "papaparse";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { FiUpload } from "react-icons/fi";
import "./componentsStyles/BulkProducts.css";

const BulkProducts = () => {
  const { vendorDetails } = useVendor();
  const [fileName, setFileName] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const content = e.target.result;

      if (file.name.endsWith(".csv")) {
        const parsed = Papa.parse(content, { header: true });
        setProducts(parsed.data);
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        const workbook = XLSX.read(content, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        setProducts(data);
      } else {
        toast.error("Unsupported file type. Upload CSV or Excel.");
      }
    };

    if (file.name.endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
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
    for (const [index, product] of products.entries()) {
      try {
        const formData = new FormData();
        formData.append("vendorId", vendorDetails.vendorId);

        // Append all fields
        Object.entries(product).forEach(([key, value]) => {
          formData.append(key, value);
        });

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
  };

  return (
    <div className="bulk-upload-container">
      <h2>Bulk Upload Products</h2>
      <div className="bulk-upload-box">
        <label className="upload-label">
          <FiUpload /> Upload CSV / Excel
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileUpload}
          />
        </label>
        {fileName && <p>File selected: {fileName}</p>}
        <button
          className="upload-button"
          onClick={handleBulkUpload}
          disabled={loading}>
          {loading ? "Uploading..." : "Upload Products"}
        </button>
      </div>
    </div>
  );
};

export default BulkProducts;
