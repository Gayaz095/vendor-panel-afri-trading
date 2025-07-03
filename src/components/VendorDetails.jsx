import React from "react";
import "./componentsStyles/VendorDetails.css";

const VendorDetails = ({ vendorDetails }) => {
  return (
    <div className="vendor-details">
      <div className="vendor-profile-card">
        <div className="vendor-documents-section">
          <h3 className="section-title">Vendor Documents</h3>
          <div className="documents-grid">
            <div className="document-item">
              <h4 className="document-title">Adhar Card</h4>
              <div className="document-image-container">
                <img
                  src={vendorDetails.vendorDetails.adharCardImage}
                  alt="Vendor Adhar Card Document"
                  className="document-image"
                />
              </div>
            </div>

            <div className="document-divider"></div>

            <div className="document-item">
              <h4 className="document-title">GST Certificate</h4>
              <div className="document-image-container">
                <img
                  src={vendorDetails.vendorDetails.gstImage}
                  alt="Vendor GST Certificate Document"
                  className="document-image"
                />
              </div>
            </div>

            <div className="document-divider"></div>

            <div className="document-item">
              <h4 className="document-title">PAN Card</h4>
              <div className="document-image-container">
                <img
                  src={vendorDetails.vendorDetails.panCardImage}
                  alt="Vendor PAN Card Document"
                  className="document-image"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="vendor-info-divider"></div>

        <div className="vendor-info-section">
          <h3 className="section-title">Vendor Information</h3>

          <div className="vendor-basic-info">
            <h2 className="vendor-name">{vendorDetails.name}</h2>
            <div className="vendor-business-info">
              <div className="info-row">
                <span className="info-label">Business Name:</span>
                <span className="info-value">
                  {vendorDetails.vendorDetails.bussinessName}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Business Address:</span>
                <span className="info-value">
                  {vendorDetails.vendorDetails.bussinessAddress}
                </span>
              </div>
            </div>
          </div>

          <hr className="section-divider" />

          <div className="vendor-contact-info">
            <h4 className="info-section-title">Contact Details</h4>
            <div className="contact-grid">
              <div className="contact-row">
                <span className="contact-label">Name:</span>
                <span className="contact-value">{vendorDetails.name}</span>
              </div>
              <div className="contact-row">
                <span className="contact-label">Email:</span>
                <span className="contact-value">{vendorDetails.email}</span>
              </div>
              <div className="contact-row">
                <span className="contact-label">Phone:</span>
                <span className="contact-value">+91-{vendorDetails.phone}</span>
              </div>
              <div className="contact-row">
                <span className="contact-label">Address:</span>
                <span className="contact-value">
                  {vendorDetails.vendorDetails.bussinessAddress}
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
