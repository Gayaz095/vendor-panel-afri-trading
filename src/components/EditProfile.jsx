import React, { useState } from "react";
import "./componentsStyles/EditProfile.css";

const initialState = {
  name: "",
  email: "",
  phone: "",
  address: "",
};

const EditProfile = ({ initialValues = initialState, onSave }) => {
  const [form, setForm] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(form.email))
      newErrors.email = "Invalid email";
    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^[0-9]{10}$/.test(form.phone))
      newErrors.phone = "Enter phone number";
    if (!form.address.trim()) newErrors.address = "Address is required";
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
            type="tel"
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Enter phone number"
            maxLength={20}
            pattern="[0-9]{10}"
          />
          {errors.phone && (
            <span className="edit-profile-error">{errors.phone}</span>
          )}
        </div>

        <div className="edit-profile-field">
          <label className="edit-profile-label" htmlFor="address">
            Address
          </label>
          <textarea
            className="edit-profile-input edit-profile-textarea"
            id="address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Enter your address"
            rows={6}
            maxLength={120}
          />
          {errors.address && (
            <span className="edit-profile-error">{errors.address}</span>
          )}
        </div>

        <button className="edit-profile-save-btn" type="submit">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
