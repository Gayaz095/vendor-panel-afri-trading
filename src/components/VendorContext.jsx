import React, { createContext, useContext, useState, useEffect } from "react";
import { getAllCars } from "../utils/getAllCars";
import { getAllCarModels } from "../utils/getAllCarModels";
import { mainGetCategories } from "../utils/mainGetCategories";
import { getSubCategories } from "../utils/getSubCategories";
import { getAllChildCategories } from "../utils/getAllChildCategories";

const VendorContext = createContext();

export const VendorProvider = ({ children }) => {
  const [vendorDetails, setVendorDetails] = useState(null);
  const [allCars, setAllCars] = useState([]);
  const [allCarModels, setAllCarModels] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [allChildCategories, setAllChildCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Restore vendor session
  useEffect(() => {
    const storedVendor = sessionStorage.getItem("vendorDetails");
    if (storedVendor) {
      try {
        setVendorDetails(JSON.parse(storedVendor));
      } catch (err) {
        console.error("Failed to parse stored vendor details:", err);
        sessionStorage.removeItem("vendorDetails");
      }
    }
    setLoading(false);
  }, []);

  // Sync vendor details to sessionStorage
  useEffect(() => {
    if (vendorDetails) {
      sessionStorage.setItem("vendorDetails", JSON.stringify(vendorDetails));
    }
  }, [vendorDetails]);

  // Fetch dropdown data (only once per session)
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const [cars, models, categories, subCats, childCats] =
          await Promise.all([
            getAllCars(),
            getAllCarModels(),
            mainGetCategories(),
            getSubCategories(),
            getAllChildCategories(),
          ]);

        if (isMounted) {
          setAllCars(cars?.data || []);
          setAllCarModels(models?.carModels || models || []);
          setAllCategories(categories?.categories || []);
          setAllSubCategories(subCats?.subCategories || []);
          setAllChildCategories(childCats?.childCategories || []);
        }
      } catch (err) {
        console.error("Error loading dropdown data:", err);
      }
    };

    if (vendorDetails && allCars.length === 0) {
      fetchData();
    }

    return () => {
      isMounted = false;
    };
  }, [vendorDetails]); //only fetch on first login

  const logoutVendor = () => {
    setVendorDetails(null);
    sessionStorage.removeItem("vendorDetails");
    setAllCars([]);
    setAllCarModels([]);
    setAllCategories([]);
    setAllSubCategories([]);
    setAllChildCategories([]);
  };

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
