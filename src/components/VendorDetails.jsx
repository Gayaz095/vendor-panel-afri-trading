import React from "react";
import "./componentsStyles/VendorDetails.css";
import vendorImage from "../assets/logo.png";

const VendorDetails = ({ vendorDetails }) => {
  return (
    <div className="vendor-details-container">
      <div className="vendor-profile-card">
        <div className="vendor-avatar-section">
          <div className="vendor-avatar-wrapper">
            <img src={vendorImage} alt="Vendor" className="vendor-avatar-img" />
          </div>
        </div>
        <div className="vertical-divider"></div>
        <div className="vendor-info-section">
          <div className="section-title bordered-title">Vendor Information</div>
          <div className="vendor-main-info">
            <h2 className="vendor-name">{vendorDetails.name}</h2>
            {/* <div className="vendor-location">{vendorDetails.location}</div> */}
          </div>
          <hr className="horizontal-divider" />
          <div className="vendor-contact-section">
            <div className="section-title bordered-title">Contact Details</div>
            <div className="contact-grid">
              <div className="contact-item">
                <span className="contact-label">Name:</span>
                <span className="contact-value">{vendorDetails.name}</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Email:</span>
                <span className="contact-value">{vendorDetails.email}</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Phone:</span>
                <span className="contact-value">+91-{vendorDetails.phone}</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Address:</span>
                <span className="contact-value">
                  Jamar Lane, Near POBox, Building: Jumaira Park Building,
                  Emirates, UAE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendorDetails;




