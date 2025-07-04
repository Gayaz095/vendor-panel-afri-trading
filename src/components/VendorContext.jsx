import React, { createContext, useContext, useState, useEffect } from "react";
import { getAllCars } from "../utils/getAllCars";
import { getAllCarModels } from "../utils/getAllCarModels";
import { mainGetCategories } from "../utils/mainGetCategories";
import { getSubCategories } from "../utils/getSubCategories";
import { getAllChildCategories } from "../utils/getAllChildCategories";

const VendorContext = createContext();

export const VendorProvider = ({ children }) => {
  const [vendorDetails, setVendorDetails] = useState(null);
  const [loginTime, setLoginTime] = useState(null);
  const [allCars, setAllCars] = useState([]);
  const [allCarModels, setAllCarModels] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [allChildCategories, setAllChildCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Restore vendor session from localStorage
  useEffect(() => {
    const storedVendor = localStorage.getItem("vendorDetails");
    const storedTime = localStorage.getItem("vendorLoginTime"); //remove this, if want every time logging in

    if (storedVendor && storedTime) {
      //remove only storedTime, if want every time logging in
      try {
        setVendorDetails(JSON.parse(storedVendor));
        setLoginTime(parseInt(storedTime, 10));
      } catch (err) {
        console.error("Failed to parse stored vendor details:", err);
        localStorage.removeItem("vendorDetails");
        localStorage.removeItem("vendorLoginTime");
      }
    }

    setLoading(false);
  }, []);

  // Sync vendor details to storage
  useEffect(() => {
    if (vendorDetails) {
      const now = Date.now();
      setLoginTime(now);

      const vendorString = JSON.stringify(vendorDetails);
      sessionStorage.setItem("vendorDetails", vendorString);
      localStorage.setItem("vendorDetails", vendorString); //remove this, if want every time logging in
      localStorage.setItem("vendorLoginTime", now.toString()); //remove this, if want every time logging in
    }
  }, [vendorDetails]);

  // Fetch dropdown data on login
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

    if (vendorDetails) {
      fetchData();
    }
  }, [vendorDetails]);

  // Logout function
  const logoutVendor = () => {
    setVendorDetails(null);
    setLoginTime(null);
    setAllCars([]);
    setAllCarModels([]);
    setAllCategories([]);
    setAllSubCategories([]);
    setAllChildCategories([]);
    sessionStorage.removeItem("vendorDetails");
    localStorage.removeItem("vendorDetails");
    localStorage.removeItem("vendorLoginTime");
  };

  return (
    <VendorContext.Provider
      value={{
        vendorDetails,
        setVendorDetails,
        loginTime,
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
