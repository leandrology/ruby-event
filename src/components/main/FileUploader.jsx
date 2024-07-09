import React, { useState, useRef } from "react";
import { assets } from "../../assets/assets";
import "./main.css";

const FileUploader = ({ onFileSelect }) => {
  const fileInputRef = useRef(null);
  const [selectedFileName, setSelectedFileName] = useState("");

  const handleHairclipClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFileName(file.name);
      if (onFileSelect) {
        onFileSelect(file);
      }
    }
  };

  return (
    <div className="file-uploader">
      <img
        src={assets.paper_clip}
        alt="Upload a file"
        style={{ width: "20px" }}
        onClick={handleHairclipClick}
      />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".txt,.pdf,.doc,.docx"
        style={{ display: "none" }}
      />
      {selectedFileName && (
        <div className="selected-file">Selected file: {selectedFileName}</div>
      )}
    </div>
  );
};

export default FileUploader;
