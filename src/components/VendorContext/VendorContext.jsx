import React, { createContext, useContext, useState, useEffect } from "react";
import { getAllCars } from "../../utils/getAllCars";
import { getAllCarModels } from "../../utils/getAllCarModels";
import { mainGetCategories } from "../../utils/mainGetCategories";
import { getSubCategories } from "../../utils/getSubCategories";
import { getAllChildCategories } from "../../utils/getAllChildCategories";

const VendorContext = createContext();

export const VendorProvider = ({ children }) => {
  const [vendorDetails, setVendorDetails] = useState(null);
  const [allCars, setAllCars] = useState([]);
  const [allCarModels, setAllCarModels] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [allChildCategories, setAllChildCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Restore vendor session on app load
  useEffect(() => {
    const storedVendor = localStorage.getItem("vendorDetails");
    if (storedVendor) {
      try {
        setVendorDetails(JSON.parse(storedVendor));
      } catch (err) {
        console.error("Failed to parse stored vendor details:", err);
        localStorage.removeItem("vendorDetails");
      }
    }
    setLoading(false);
  }, []);

  // Sync vendor details to storage when updated
  useEffect(() => {
    if (vendorDetails) {
      const vendorString = JSON.stringify(vendorDetails);
      sessionStorage.setItem("vendorDetails", vendorString);
      localStorage.setItem("vendorDetails", vendorString);
    }
  }, [vendorDetails]);

  // Logout function
  const logoutVendor = () => {
    setVendorDetails(null);
    sessionStorage.removeItem("vendorDetails");
    localStorage.removeItem("vendorDetails");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cars = await getAllCars();
        const models = await getAllCarModels();
        const categories = await mainGetCategories();
        const subCats = await getSubCategories();
        const childCats = await getAllChildCategories();

        setAllCars(cars?.data || []);
        setAllCarModels(models?.carModels || models || []);
        setAllCategories(
          Array.isArray(categories) ? categories : categories?.categories || []
        );
        setAllSubCategories(
          Array.isArray(subCats) ? subCats : subCats?.subCategories || []
        );
        setAllChildCategories(
          Array.isArray(childCats)
            ? childCats
            : childCats?.childCategories || []
        );
      } catch (err) {
        console.error("Error loading dropdown data:", err);
      }
    };

    fetchData();
  }, []);

  return (
    <VendorContext.Provider
      value={{
        vendorDetails,
        setVendorDetails,
        logoutVendor,
        allCars,
        allCarModels,
        allCategories,
        allSubCategories,
        allChildCategories,
        loading,
      }}>
      {children}
    </VendorContext.Provider>
  );
};

export const useVendor = () => useContext(VendorContext);
