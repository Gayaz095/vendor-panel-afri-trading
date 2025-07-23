import React, { useState } from "react";
import "./VendorDetails.css";

const VendorDetails = ({ vendorDetails }) => {
  const [modalImage, setModalImage] = useState(null);

  const openModal = (src, alt) => setModalImage({ src, alt });
  const closeModal = () => setModalImage(null);

  return (
    <div className="vendor-details-root">
      <div className="vendor-details-profile-card">
        {/* Documents and Bond side by side */}
        <div className="vendor-details-documents-bond-wrapper">
          {/* Documents */}
          <div className="vendor-details-documents-section">
            <h3 className="vendor-details-section-title">Vendor Documents</h3>
            <div className="vendor-details-documents-grid">
              {[
                {
                  title: "Adhar Card",
                  image: vendorDetails.vendorDetails.adharCardImage,
                  alt: "Vendor Adhar Card Document",
                },
                {
                  title: "GST Certificate",
                  image: vendorDetails.vendorDetails.gstImage,
                  alt: "Vendor GST Certificate Document",
                },
                {
                  title: "PAN Card",
                  image: vendorDetails.vendorDetails.panCardImage,
                  alt: "Vendor PAN Card Document",
                },
              ].map((doc, index) => (
                <div key={index} className="vendor-details-document-item">
                  <h4 className="vendor-details-document-title">{doc.title}</h4>
                  <div className="vendor-details-document-image-container">
                    <img
                      src={doc.image}
                      alt={doc.alt}
                      className="vendor-details-document-image"
                      onClick={() => openModal(doc.image, doc.alt)}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bond */}
          <div className="vendor-details-bond-section">
            <h4 className="vendor-details-document-bond-title">Bond Image</h4>
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
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="vendor-details-info-divider"></div>

        {/* Vendor Info */}
        <div className="vendor-details-info-section">
          <h3 className="vendor-details-section-title">Vendor Information</h3>
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

      {/* Modal */}
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
            <img
              src={modalImage.src}
              alt={modalImage.alt}
              className="vendor-details-modal-image"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDetails;
