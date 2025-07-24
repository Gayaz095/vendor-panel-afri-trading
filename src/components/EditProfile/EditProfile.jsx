import React, { useState, useEffect } from "react";
import { useVendor } from "../VendorContext/VendorContext";
import { updateVendorProfile } from "../../utils/updateVendorProfile";
import { toast } from "react-toastify";
import { FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase } from "react-icons/fi";
import { FaEdit } from "react-icons/fa";
import "./EditProfile.css";

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
      if (!emailRegex.test(value)) error = "Please enter a valid email address";
    }
    if (name === "phone") {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(value)) error = "Phone number must be 10 digits";
    }
    setFormErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const isFormValid = () => {
    let valid = true;
    Object.keys(formData).forEach((key) => {
      validateField(key, formData[key]);
      if (formErrors[key]) valid = false;
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
      await updateVendorProfile(payload);
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

  if (!vendorDetails?.vendorDetails) {
    return (
      <section className="edit-profile__empty" aria-live="polite">
        <p>No vendor profile found. Profile details are not available.</p>
      </section>
    );
  }

  return (
    <section className="edit-profile" aria-label="Edit Vendor Profile">
      <article className="edit-profile__card">
        <h1 className="edit-profile__title"><FaEdit />Edit Profile</h1>
        <form onSubmit={handleSubmit} className="edit-profile__form" noValidate>
          {[
            { label: "Name", icon: FiUser, type: "text", name: "name" },
            { label: "Email", icon: FiMail, type: "email", name: "email" },
            { label: "Phone", icon: FiPhone, type: "tel", name: "phone" },
            {
              label: "Business Name",
              icon: FiBriefcase,
              type: "text",
              name: "bussinessName",
            },
          ].map(({ label, icon: Icon, ...inputProps }) => (
            <div key={inputProps.name} className="edit-profile__form-group">
              <label htmlFor={inputProps.name} className="edit-profile__label">
                <Icon className="edit-profile__icon" /> {label}
              </label>
              <input
                id={inputProps.name}
                className={`edit-profile__input ${
                  formErrors[inputProps.name]
                    ? "edit-profile__input--error"
                    : ""
                }`}
                value={formData[inputProps.name]}
                onChange={handleChange}
                placeholder={`Enter ${label.toLowerCase()}`}
                required
                {...inputProps}
              />
              {formErrors[inputProps.name] && (
                <span className="edit-profile__error" role="alert">
                  {formErrors[inputProps.name]}
                </span>
              )}
            </div>
          ))}

          {/* Business Address */}
          <div className="edit-profile__form-group">
            <label htmlFor="bussinessAddress" className="edit-profile__label">
              <FiMapPin className="edit-profile__icon" /> Business Address
            </label>
            <textarea
              id="bussinessAddress"
              name="bussinessAddress"
              value={formData.bussinessAddress}
              onChange={handleChange}
              className="edit-profile__input"
              placeholder="Enter business address"
              rows={3}></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`edit-profile__button ${
              loading ? "edit-profile__button--disabled" : ""
            }`}
            aria-busy={loading}>
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </article>
    </section>
  );
};

export default EditProfile;
