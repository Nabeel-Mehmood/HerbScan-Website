// ./Component/home.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './home.css';
import Header from '../Component/header';
import Footer from '../Component/footer';

function Home() {
  const navigate = useNavigate();

  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [imageName, setImageName] = useState("");

  const [homeSearchResults, setHomeSearchResults] = useState([]);
  const [showHomeSearchOverlay, setShowHomeSearchOverlay] = useState(false);

  const [classificationResult, setClassificationResult] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validFormats = ['image/jpeg', 'image/png'];
      if (!validFormats.includes(file.type)) {
        alert("Unsupported file format. Please upload a JPG or PNG image.");
        return;
      }
      setUploadedFile(file);
      setUploadedImage(URL.createObjectURL(file));
      setImageName(file.name);
      setClassificationResult(null);
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
      setUploadedFile(file);
      setUploadedImage(URL.createObjectURL(file));
      setImageName(file.name);
      setClassificationResult(null);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleRemove = () => {
    setUploadedImage(null);
    setUploadedFile(null);
    setImageName("");
    setClassificationResult(null);
  };

  const handleHomeSearch = async (query) => {
    if (!query.trim()) return;
    try {
      const response = await fetch(`http://localhost:5000/api/plants/home/search?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      setHomeSearchResults(data);
      setShowHomeSearchOverlay(true);
    } catch (error) {
      console.error("Error in home search:", error);
      setHomeSearchResults([]);
    }
  };

  const handleMoreInfo = () => {
    const query = homeSearchResults[0]?.commonName || "";
    navigate(`/explore?query=${encodeURIComponent(query)}`);
    setShowHomeSearchOverlay(false);
  };

  const handleIdentify = () => {
    if (!uploadedFile) {
      alert("Please upload an image first.");
      return;
    }
    const formData = new FormData();
    formData.append("image", uploadedFile);
    fetch("http://localhost:5000/api/plants/classify", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          alert("Classification error: " + data.error);
        } else {
          setClassificationResult(data);
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Error during classification.");
      });
  };

  return (
    <div className="home-container">
      <Header showSearchBar={true} onSearch={handleHomeSearch} />

      <section className="upload-section">
        <div
          className="file-upload"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {!uploadedImage ? (
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
          ) : (
            <div className="uploaded-image-container">
              <img
                src={uploadedImage}
                alt="Uploaded preview"
                className="uploaded-image"
              />
              <div className="buttons-container">
                <button className="identify-btn" onClick={handleIdentify}>
                  Identify
                </button>
                <button className="remove-btn" onClick={handleRemove}>
                  Remove
                </button>
              </div>
              {classificationResult && (
                <div className="classification-result">
                  <p><strong>Predicted:</strong> {classificationResult.predicted_class}</p>
                  <p>Confidence: {classificationResult.confidence.toFixed(2)}%</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="info-section content-section">
        <div className="website-info">
          <h2>About HerbScan</h2>
          <p>
            HerbScan helps you identify different trees by uploading images. Use our powerful tool to learn more about the flora around you.
          </p>
        </div>
      </section>

      <Footer />

      {showHomeSearchOverlay && (
        <div className="home-search-overlay" onClick={() => setShowHomeSearchOverlay(false)}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <h2>Search Results</h2>
            <div className="cards-container">
              {homeSearchResults.length > 0 ? (
                homeSearchResults.map((plant) => (
                  <div className="search-card" key={plant._id}>
                    <div className="card-image">
                      {plant.image ? (
                        <img src={plant.image} alt={plant.commonName} />
                      ) : (
                        <div className="image-placeholder">
                          <i className="fas fa-leaf"></i>
                        </div>
                      )}
                    </div>
                    <div className="card-info">
                      <p><strong>{plant.commonName}</strong></p>
                      <p>Family: {plant.familyName}</p>
                      <p>Tribe: {plant.tribeName}</p>
                      <p>Botanical: {plant.botanicalName}</p>
                    </div>
                    <div className="card-more-info">
                      <button onClick={handleMoreInfo}>More Info &gt;</button>
                    </div>
                  </div>
                ))
              ) : (
                <p>No results found.</p>
              )}
            </div>
            <button className="close-overlay" onClick={() => setShowHomeSearchOverlay(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
