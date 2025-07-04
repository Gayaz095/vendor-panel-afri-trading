import React, { useState, useEffect } from "react";
import { useVendor } from "./VendorContext";
import { updateVendorProfile } from "../utils/updateVendorProfile";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase } from "react-icons/fi";
import "./componentsStyles/EditProfile.css";

const EditProfile = () => {
  const { vendorDetails, setVendorDetails } = useVendor();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bussinessName: "",
    bussinessAddress: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (vendorDetails?.vendorDetails) {
      const details = vendorDetails.vendorDetails;
      setFormData({
        name: details.name || "",
        email: details.email || "",
        phone: details.phone || "",
        bussinessName: details.bussinessName || "",
        bussinessAddress: details.bussinessAddress || "",
      });
    }
  }, [vendorDetails]);

  const validateField = (name, value) => {
    let error = "";

    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        error = "Please enter a valid email address";
      }
    }

    if (name === "phone") {
      const phoneRegex = /^[0-9]{10}$/; // Only 10 digits
      if (!phoneRegex.test(value)) {
        error = "Phone number must be 10 digits";
      }
    }

    setFormErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field on change
    validateField(name, value);
  };

  const isFormValid = () => {
    let valid = true;
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
      if (formErrors[key]) {
        valid = false;
      }
    });
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error("Please correct the highlighted errors.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        vendorId: vendorDetails?.vendorDetails?._id,
        ...formData,
      };

      const response = await updateVendorProfile(payload);

      // ✅ Update root-level and vendorDetails fields
      setVendorDetails((prev) => ({
        ...prev,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        vendorDetails: {
          ...prev.vendorDetails,
          ...formData,
        },
      }));

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile">
      <div className="edit-profile__card">
        <h2 className="edit-profile__title">Edit Profile</h2>
        <form onSubmit={handleSubmit} className="edit-profile__form">
          {/* Name */}
          <div className="edit-profile__form-group">
            <label className="edit-profile__label">
              <FiUser className="edit-profile__icon" /> Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`edit-profile__input ${
                formErrors.name ? "edit-profile__input--error" : ""
              }`}
              placeholder="Enter your name"
              required
            />
            {formErrors.name && (
              <span className="edit-profile__error">{formErrors.name}</span>
            )}
          </div>

          {/* Email */}
          <div className="edit-profile__form-group">
            <label className="edit-profile__label">
              <FiMail className="edit-profile__icon" /> Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`edit-profile__input ${
                formErrors.email ? "edit-profile__input--error" : ""
              }`}
              placeholder="Enter your email"
              required
            />
            {formErrors.email && (
              <span className="edit-profile__error">{formErrors.email}</span>
            )}
          </div>

          {/* Phone */}
          <div className="edit-profile__form-group">
            <label className="edit-profile__label">
              <FiPhone className="edit-profile__icon" /> Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`edit-profile__input ${
                formErrors.phone ? "edit-profile__input--error" : ""
              }`}
              placeholder="Enter your phone number"
              required
            />
            {formErrors.phone && (
              <span className="edit-profile__error">{formErrors.phone}</span>
            )}
          </div>

          {/* Business Name */}
          <div className="edit-profile__form-group">
            <label className="edit-profile__label">
              <FiBriefcase className="edit-profile__icon" /> Business Name
            </label>
            <input
              type="text"
              name="bussinessName"
              value={formData.bussinessName}
              onChange={handleChange}
              className="edit-profile__input"
              placeholder="Enter business name"
            />
          </div>

          {/* Business Address */}
          <div className="edit-profile__form-group">
            <label className="edit-profile__label">
              <FiMapPin className="edit-profile__icon" /> Business Address
            </label>
            <textarea
              type="text"
              name="bussinessAddress"
              value={formData.bussinessAddress}
              onChange={handleChange}
              className="edit-profile__input"
              placeholder="Enter business address"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`edit-profile__button ${
              loading ? "edit-profile__button--disabled" : ""
            }`}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
