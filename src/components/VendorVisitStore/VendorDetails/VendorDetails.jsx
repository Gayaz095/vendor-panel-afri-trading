import React, { useState } from "react";
import "./VendorDetails.css";

const VendorDetails = ({ vendorDetails }) => {
  const [modalImage, setModalImage] = useState(null);

  const openModal = (src, alt) => {
    setModalImage({ src, alt });
  };

  const closeModal = () => {
    setModalImage(null);
  };

  return (
    <div className="vendor-details-root">
      <div className="vendor-details-profile-card">
        {/* Left side: Documents  Aadhar, GST, PAN images*/}
        <div className="vendor-details-documents-section">
          <h3 className="vendor-details-section-title">Vendor Documents</h3>
          <div className="vendor-details-documents-grid">
            {/* Aadhar */}
            <div className="vendor-details-document-item">
              <h4 className="vendor-details-document-title">Adhar Card</h4>
              <div className="vendor-details-document-image-container">
                <img
                  src={vendorDetails.vendorDetails.adharCardImage}
                  alt="Vendor Adhar Card Document"
                  className="vendor-details-document-image"
                  onClick={() =>
                    openModal(
                      vendorDetails.vendorDetails.adharCardImage,
                      "Vendor Adhar Card Document"
                    )
                  }
                />
              </div>
            </div>

            {/* GST */}
            <div className="vendor-details-document-item">
              <h4 className="vendor-details-document-title">GST Certificate</h4>
              <div className="vendor-details-document-image-container">
                <img
                  src={vendorDetails.vendorDetails.gstImage}
                  alt="Vendor GST Certificate Document"
                  className="vendor-details-document-image"
                  onClick={() =>
                    openModal(
                      vendorDetails.vendorDetails.gstImage,
                      "Vendor GST Certificate Document"
                    )
                  }
                />
              </div>
            </div>

            {/* PAN */}
            <div className="vendor-details-document-item">
              <h4 className="vendor-details-document-title">PAN Card</h4>
              <div className="vendor-details-document-image-container">
                <img
                  src={vendorDetails.vendorDetails.panCardImage}
                  alt="Vendor PAN Card Document"
                  className="vendor-details-document-image"
                  onClick={() =>
                    openModal(
                      vendorDetails.vendorDetails.panCardImage,
                      "Vendor PAN Card Document"
                    )
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right side: Bond Image */}
        <div className="vendor-details-bond-section">
          <div className="vendor-details-document-bond-image-container">
            <img
              src={vendorDetails.vendorDetails.bondImage}
              alt="Vendor Bond Image Document"
              className="vendor-details-document-bond-image"
              onClick={() =>
                openModal(
                  vendorDetails.vendorDetails.bondImage,
                  "Vendor Bond Image Document"
                )
              }
            />
          </div>
        </div>

        {/* Horizontal Line */}
        <div className="vendor-details-info-divider-line"></div>

        {/* Vendor Info */}
        <div className="vendor-details-info-section">
          <h3 className="vendor-details-section-title-vendor-info">
            Vendor Information
          </h3>
          <div className="vendor-details-info-basic-contact">
            {/* Basic Info */}
            <div className="vendor-details-basic-info">
              <h2 className="vendor-details-name">
                {vendorDetails.vendorDetails.name}
              </h2>
              <div className="vendor-details-business-info">
                <div className="vendor-details-info-row">
                  <span className="vendor-details-info-label">
                    Business Name:
                  </span>
                  <span className="vendor-details-info-value">
                    {vendorDetails.vendorDetails.bussinessName}
                  </span>
                </div>
                <div className="vendor-details-info-row">
                  <span className="vendor-details-info-label">
                    Business Address:
                  </span>
                  <span className="vendor-details-info-value">
                    {vendorDetails.vendorDetails.bussinessAddress}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="vendor-details-contact-info">
              <h4 className="vendor-details-info-section-title">
                Contact Details
              </h4>
              <div className="vendor-details-contact-grid">
                <div className="vendor-details-contact-row">
                  <span className="vendor-details-contact-label">Name:</span>
                  <span className="vendor-details-contact-value">
                    {vendorDetails.name}
                  </span>
                </div>
                <div className="vendor-details-contact-row">
                  <span className="vendor-details-contact-label">Email:</span>
                  <span className="vendor-details-contact-value">
                    {vendorDetails.email}
                  </span>
                </div>
                <div className="vendor-details-contact-row">
                  <span className="vendor-details-contact-label">Phone:</span>
                  <span className="vendor-details-contact-value">
                    +91-{vendorDetails.phone}
                  </span>
                </div>
                <div className="vendor-details-contact-row">
                  <span className="vendor-details-contact-label">Address:</span>
                  <span className="vendor-details-contact-value">
                    {vendorDetails.vendorDetails.bussinessAddress}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {modalImage && (
        <div
          className="vendor-details-image-modal-overlay"
          onClick={closeModal}>
          <div
            className="vendor-details-image-modal"
            onClick={(e) => e.stopPropagation()}>
            <button
              className="vendor-details-modal-close-btn"
              onClick={closeModal}>
              &times;
            </button>

            <div className="vendor-details-modal-image-scroll-container">
              <img
                src={modalImage.src}
                alt={modalImage.alt}
                className="vendor-details-modal-image"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDetails;