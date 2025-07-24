import React, { useState } from "react";
import "./VendorDetails.css";
import EditProfileModal from "./EditProfileModal/EditProfileModal";

const VendorDetails = ({ vendorDetails }) => {
  const [modalImage, setModalImage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const openModal = (src, alt) => {
    setModalImage({ src, alt });
  };

  const closeModal = () => {
    setModalImage(null);
  };

  // List of document fields with labels
  const documentFields = [
    { key: "adharCardImage", label: "Adhar Card" },
    { key: "gstImage", label: "GST Certificate" },
    { key: "panCardImage", label: "PAN Card" },
    { key: "bondImage", label: "Bond Image" },
  ];

  return (
    <div className="vendor-details-root">
      <div className="vendor-details-profile-card">
        <div className="vendor-details-documents-section">
          <h3 className="vendor-details-section-title">Documents</h3>
          <div className="vendor-details-documents-grid">
            {documentFields.map(({ key, label }) => {
              const imageSrc = vendorDetails.vendorDetails[key];
              return (
                <div className="vendor-details-document-item" key={key}>
                  <h4 className="vendor-details-document-title">{label}</h4>
                  <div className="vendor-details-document-image-container">
                    <img
                      src={imageSrc}
                      alt={`Vendor ${label} Document`}
                      className="vendor-details-document-image"
                      onClick={() =>
                        openModal(imageSrc, `Vendor ${label} Document`)
                      }
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="vendor-details-info-divider"></div>

        <div className="vendor-details-info-section">
          <h3 className="vendor-details-section-title">Contact Information</h3>
          <div className="vendor-details-info-basic-contact">
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

            <hr className="vendor-details-section-divider" />

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
              <div className="vendor-details-edit-btn-container">
                <button
                  className="vendor-details-edit-btn"
                  onClick={() => setShowEditModal(true)}>
                  Edit Profile
                </button>
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

      {/* Edit Profile Modal */}
      {showEditModal && (
        <EditProfileModal onClose={() => setShowEditModal(false)} />
      )}
    </div>
  );
};

export default VendorDetails;
