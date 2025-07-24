import React from "react";
import "./EditProfileModal.css";
import EditProfile from "../../../EditProfile/EditProfile";

const EditProfileModal = ({ onClose }) => {
  return (
    <div className="edit-profile-modal-overlay">
      <div
        className="edit-profile-modal-container"
        onClick={(e) => e.stopPropagation()}>
        <button className="edit-profile-modal-close-btn" onClick={onClose}>
          &times;
        </button>
        <EditProfile onClose={onClose} />
      </div>
    </div>
  );
};

export default EditProfileModal;
