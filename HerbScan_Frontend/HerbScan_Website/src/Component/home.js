import React, { useState } from 'react';
import './home.css';
import './header.css';
import Header from '../Component/header'; 
import Footer from '../Component/footer'; 

function Home() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageName, setImageName] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validFormats = ['image/jpeg', 'image/png'];
      if (!validFormats.includes(file.type)) {
        alert("Unsupported file format. Please upload a JPG or PNG image.");
        return;
      }
      setUploadedImage(URL.createObjectURL(file));
      setImageName(file.name);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const validFormats = ['image/jpeg', 'image/png'];
      if (!validFormats.includes(file.type)) {
        alert("Unsupported file format. Please upload a JPG or PNG image.");
        return;
      }
      setUploadedImage(URL.createObjectURL(file));
      setImageName(file.name);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRemove = () => {
    setUploadedImage(null);
    setImageName("");
  };

  return (
    <div className="home-container">
      <Header showSearchBar={true} />

      <div className="upload-section">
        <div
          className="file-upload"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{ border: uploadedImage ? 'none' : '2px dashed #ccc' }}
        >
          {!uploadedImage && (
            <>
              <label htmlFor="file-upload-input" className="upload-label">
                <i className="fas fa-cloud-upload-alt upload-icon"></i>
                Drag & Drop your file here or <span>Browse</span>
              </label>
              <input
                type="file"
                id="file-upload-input"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <p className="upload-note">Supported formats: JPG, PNG</p>
            </>
          )}

          {uploadedImage && (
            <div className="uploaded-image-container">
              <img
                src={uploadedImage}
                alt={`Uploaded preview of ${imageName}`}
                className="uploaded-image"
              />
              <div className="buttons-container">
                <button
                  className="identify-btn"
                  onClick={() => alert(`Identifying: ${imageName}`)}
                >
                  Identify
                </button>
                <button className="remove-btn" onClick={handleRemove}>
                  Remove
                </button>
              </div>
              <p className="image-name">Image Name: {imageName}</p>
            </div>
          )}
        </div>
      </div>

      <div className="info-section content-section">
        <div className="website-info">
          <h2>About HerbScan</h2>
          <p>
            HerbScan helps you identify different trees by uploading images. Use our powerful tool to learn more about the flora around you.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Home;
