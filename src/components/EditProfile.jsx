import React, { useState } from "react";
import "./componentsStyles/EditProfile.css";

const initialState = {
  name: "",
  email: "",
  phone: "",
  businessName: "",
  businessAddress: "",
};

const EditProfile = ({ initialValues = initialState, onSave }) => {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;
    // Only allow numbers for phone field
    if (name === "phone") {
      newValue = newValue.replace(/\D/g, "");
    }
    setForm({ ...form, [name]: newValue });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email))
      newErrors.email = "Invalid email";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^[0-9]{10}$/.test(form.phone))
      newErrors.phone = "Enter 10 digit phone number";
    if (!form.businessName.trim())
      newErrors.businessName = "Business Name is required";
    if (!form.businessAddress.trim())
      newErrors.businessAddress = "Business Address is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      return;
    }
    if (onSave) onSave(form);
    alert("Profile updated!");
  };

  return (
    <div className="edit-profile-root">
      <form
        className="edit-profile-form"
        onSubmit={handleSubmit}
        autoComplete="off">
        <h2 className="edit-profile-title">Edit Profile</h2>
        <div className="edit-profile-fields-grid">
          <div className="edit-profile-field">
            <label className="edit-profile-label" htmlFor="name">
              Name
            </label>
            <input
              className="edit-profile-input"
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              maxLength={70}
            />
            {errors.name && (
              <span className="edit-profile-error">{errors.name}</span>
            )}
          </div>

          <div className="edit-profile-field">
            <label className="edit-profile-label" htmlFor="email">
              Email
            </label>
            <input
              className="edit-profile-input"
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              maxLength={60}
            />
            {errors.email && (
              <span className="edit-profile-error">{errors.email}</span>
            )}
          </div>

          <div className="edit-profile-field">
            <label className="edit-profile-label" htmlFor="phone">
              Phone
            </label>
            <input
              className="edit-profile-input"
              type="text"
              id="phone"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
              maxLength={10}
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
            />
            {errors.phone && (
              <span className="edit-profile-error">{errors.phone}</span>
            )}
          </div>

          <div className="edit-profile-field">
            <label className="edit-profile-label" htmlFor="businessName">
              Business Name
            </label>
            <input
              className="edit-profile-input"
              type="text"
              id="businessName"
              name="businessName"
              value={form.businessName}
              onChange={handleChange}
              placeholder="Enter Business Name"
              maxLength={70}
            />
            {errors.businessName && (
              <span className="edit-profile-error">{errors.businessName}</span>
            )}
          </div>

          <div className="edit-profile-field business-address">
            <label className="edit-profile-label" htmlFor="businessAddress">
              Business Address
            </label>
            <textarea
              className="edit-profile-input edit-profile-textarea"
              id="businessAddress"
              name="businessAddress"
              value={form.businessAddress}
              onChange={handleChange}
              placeholder="Enter Business Address"
              rows={4}
              maxLength={120}
            />
            {errors.businessAddress && (
              <span className="edit-profile-error">
                {errors.businessAddress}
              </span>
            )}
          </div>
        </div>
        <button className="edit-profile-save-btn" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
