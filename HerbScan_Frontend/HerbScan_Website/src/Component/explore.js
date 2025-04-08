import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from '../Component/header';
import Footer from '../Component/footer';
import './explore.css';
import parallex_background from '../Assets/background1.jpg';

function Explore() {
  const [searchFilters, setSearchFilters] = useState({
    family: '',
    name: '',
    existence: '',
    properties: ''
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showScrollArrow, setShowScrollArrow] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    family: [],
    name: [],
    existence: [],
    properties: []
  });

  // Refs for scrolling
  const searchSectionRef = useRef(null);
  const resultsSectionRef = useRef(null);

  // Handle scroll arrow visibility
  useEffect(() => {
    const handleScroll = () => {
      if (searchSectionRef.current) {
        const searchSectionTop = searchSectionRef.current.getBoundingClientRect().top;
        // Show arrow only if search section is not in view
        setShowScrollArrow(searchSectionTop > window.innerHeight);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search with optional column filtering.
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    // Mapping from dropdown option value to model field name.
    const columnMapping = {
      "family-name": "familyName",
      "sub-family-name": "subFamilyName",
      "tribe-name": "tribeName",
      "botanical-name": "botanicalName",
      "common-name": "commonName",
      "regional-name": "regionalName",
      "agricultural-existence": "agriculturalExistence",
      "seasonal-existence": "seasonExistence",
      "medicinal-properties": "medicinalProperties",
      "allergic-properties": "allergicProperties"
    };

    let filterColumn = "";
    if (searchFilters.family) {
      filterColumn = columnMapping[searchFilters.family];
    } else if (searchFilters.name) {
      filterColumn = columnMapping[searchFilters.name];
    } else if (searchFilters.existence) {
      filterColumn = columnMapping[searchFilters.existence];
    } else if (searchFilters.properties) {
      filterColumn = columnMapping[searchFilters.properties];
    }
    
    try {
      let url = `http://localhost:5000/api/plants/search?query=${encodeURIComponent(searchQuery)}`;
      if (filterColumn) {
        url += `&column=${encodeURIComponent(filterColumn)}`;
      }
      const response = await axios.get(url);
      setSearchResults(response.data);
      
      // Scroll to results after search
      setTimeout(() => {
        if (resultsSectionRef.current) {
          resultsSectionRef.current.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
      }, 100);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    }
  };

  // Handle Enter key in search input.
  const handleKeyDownSearch = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Scroll to search section.
  const scrollToSearch = () => {
    if (searchSectionRef.current) {
      searchSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleSearchFilterChange = (filterType, value) => {
    setSearchFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  // Handle filter selection for PDF download.
  const handleFilterChange = (category, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  // Download PDF: send the selected plant and filter options.
  const handleDownloadPDF = async () => {
    try {
      const payload = {
        filters: selectedFilters
      };
      const response = await axios.post(
        `http://localhost:5000/api/plants/${selectedPlant._id}/download`, 
        payload,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${selectedPlant.commonName}-details.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error('PDF Download failed:', error);
    }
    setShowDownloadModal(false);
  };

  return (
    <div className="explore-container">
      <Header showSearchBar={false} />

      <section className="parallax-section" style={{ backgroundImage: `url(${parallex_background})` }}>
        <div className="parallax-content">
          <p className="parallax-title">Explore the World of Plants with HerbScan</p>
          <p className="parallax-subtitle">Discover insights and information to learn more about plants and trees.</p>
        </div>
      </section>

      <main className="explore-main">
        {showScrollArrow && (
          <div className="scroll-down-arrow" onClick={scrollToSearch}>
            <i className="fas fa-chevron-down"></i>
          </div>
        )}

        {/* New Scroll To Bottom Button */}
        <button className="scroll-to-search-btn" onClick={scrollToSearch}>
          <i className="fas fa-angle-double-down"></i> Go to Search
        </button>

        <section className="explore-search-filter">
          <h2>Search Filter</h2>
          <div className="filter-dropdowns">
            <div className="filter-group">
              <label htmlFor="family-dropdown">Family Name:</label>
              <select
                id="family-dropdown"
                className="filter-select"
                value={searchFilters.family}
                disabled={Object.values(searchFilters).some(
                  (filter) => filter !== "" && filter !== searchFilters.family
                )}
                onChange={(e) => handleSearchFilterChange("family", e.target.value)}
              >
                <option value="">Select</option>
                <option value="family-name">Family Name</option>
                <option value="sub-family-name">Sub-Family Name</option>
                <option value="tribe-name">Tribe Name</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="name-dropdown">Name:</label>
              <select
                id="name-dropdown"
                className="filter-select"
                value={searchFilters.name}
                disabled={Object.values(searchFilters).some(
                  (filter) => filter !== "" && filter !== searchFilters.name
                )}
                onChange={(e) => handleSearchFilterChange("name", e.target.value)}
              >
                <option value="">Select</option>
                <option value="botanical-name">Botanical Name</option>
                <option value="common-name">Common Name</option>
                <option value="regional-name">Regional Name</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="existence-dropdown">Existence:</label>
              <select
                id="existence-dropdown"
                className="filter-select"
                value={searchFilters.existence}
                disabled={Object.values(searchFilters).some(
                  (filter) => filter !== "" && filter !== searchFilters.existence
                )}
                onChange={(e) => handleSearchFilterChange("existence", e.target.value)}
              >
                <option value="">Select</option>
                <option value="agricultural-existence">Agricultural Existence</option>
                <option value="seasonal-existence">Seasonal Existence</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="properties-dropdown">Properties:</label>
              <select
                id="properties-dropdown"
                className="filter-select"
                value={searchFilters.properties}
                disabled={Object.values(searchFilters).some(
                  (filter) => filter !== "" && filter !== searchFilters.properties
                )}
                onChange={(e) => handleSearchFilterChange("properties", e.target.value)}
              >
                <option value="">Select</option>
                <option value="medicinal-properties">Medicinal Properties</option>
                <option value="allergic-properties">Allergic Properties</option>
              </select>
            </div>
          </div>
        </section>

        <section className="explore-search-section" ref={searchSectionRef}>
          <h2>Search for Plants</h2>
          <div className="search-bar-wrapper">
            <div className="search-bar-container">
              <input
                type="text"
                className="search-bar"
                placeholder="Search for plants (e.g., Phulai, Kachnar)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDownSearch}
              />
              <i
                className="search-icon fas fa-search"
                onClick={handleSearch}
                role="button"
                tabIndex="0"
              ></i>
            </div>
            <div className="search-actions">
              <button className="search-btn" onClick={handleSearch}>Search</button>
            </div>
          </div>
        </section>

        {searchResults.length > 0 && (
          <section className="explore-search-results" ref={resultsSectionRef}>
            <h2 className="search-results-title">Search Results</h2>
            <div className="results-container">
              {searchResults.map((plant) => (
                <div
                  className="plant-card"
                  key={plant._id}
                  onClick={() => setSelectedPlant(plant)}
                >
                  <div className="plant-image-container">
                    {plant.image ? (
                      <img 
                        src={plant.image} 
                        alt={plant.commonName} 
                        className="plant-image"
                      />
                    ) : (
                      <div className="plant-image-placeholder"></div>
                    )}
                  </div>
                  <div className="plant-info">
                    <h3>{plant.commonName}</h3>
                    <p>{plant.familyName}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="explore-content">
          <div className="explore-card">
            <h2>Plant Categories</h2>
            <p>
              Browse through various tree categories to learn about their uses, benefits, and more.
            </p>
          </div>
          <div className="explore-card">
            <h2>Identify Plants</h2>
            <p>
              Upload images of plants to identify them and gain deeper insights.
            </p>
          </div>
          <div className="explore-card">
            <h2>Learn About Plants</h2>
            <p>
              Download comprehensive PDFs containing all the information you need with just one click.
            </p>
          </div>
        </section>
      </main>

      {selectedPlant && (
        <div
          className="plant-detail-overlay"
          onClick={() => setSelectedPlant(null)}
        >
          <div
            className="plant-detail-panel"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overlay-header-controls">
              <button 
                className="download-pdf-btn"
                onClick={() => setShowDownloadModal(true)}
              >
                <i className="fas fa-file-pdf"></i> Download PDF
              </button>
              <button
                className="close-btn"
                onClick={() => setSelectedPlant(null)}
              >
                ✕
              </button>
            </div>
            <div className="plant-detail-header">
              <div className="plant-detail-image-container">
                {selectedPlant.image ? (
                  <img
                    src={selectedPlant.image}
                    alt={selectedPlant.commonName}
                    className="plant-detail-image"
                  />
                ) : (
                  <div className="plant-detail-image-placeholder">
                    <i className="fas fa-leaf"></i>
                  </div>
                )}
              </div>
              <div className="plant-detail-info">
                <h2>{selectedPlant.commonName}</h2>
                <div className="plant-meta">
                  <span className="meta-item">
                    <i className="fas fa-seedling"></i> {selectedPlant.familyName}
                  </span>
                  <span className="meta-item">
                    <i className="fas fa-tag"></i> {selectedPlant.botanicalName}
                  </span>
                </div>
              </div>
            </div>
            <div className="plant-detail-body">
              <div className="detail-section">
                <h3><i className="fas fa-layer-group"></i> Classification</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Family:</span>
                    <span className="detail-value">{selectedPlant.familyName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Sub-Family:</span>
                    <span className="detail-value">{selectedPlant.subFamilyName}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Tribe:</span>
                    <span className="detail-value">{selectedPlant.tribeName}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3><i className="fas fa-info-circle"></i> Properties</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Medicinal:</span>
                    <span className="detail-value">{selectedPlant.medicinalProperties}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Allergic:</span>
                    <span className="detail-value">{selectedPlant.allergicProperties}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3><i className="fas fa-calendar-alt"></i> Existence</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span className="detail-label">Agricultural:</span>
                    <span className="detail-value">{selectedPlant.agriculturalExistence}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Seasonal:</span>
                    <span className="detail-value">{selectedPlant.seasonExistence}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showDownloadModal && (
        <div className="download-modal-overlay" onClick={() => setShowDownloadModal(false)}>
          <div className="download-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Select Filters for PDF</h2>
            <div className="filter-categories">
              <div className="filter-category">
                <h3>Family Name</h3>
                {['Family Name', 'Sub-Family Name', 'Tribe Name'].map(option => (
                  <label key={option}>
                    <input
                      type="checkbox"
                      checked={selectedFilters.family.includes(option)}
                      onChange={() => handleFilterChange('family', option)}
                    />
                    {option}
                  </label>
                ))}
              </div>

              <div className="filter-category">
                <h3>Name</h3>
                {['Botanical Name', 'Common Name', 'Regional Name'].map(option => (
                  <label key={option}>
                    <input
                      type="checkbox"
                      checked={selectedFilters.name.includes(option)}
                      onChange={() => handleFilterChange('name', option)}
                    />
                    {option}
                  </label>
                ))}
              </div>

              <div className="filter-category">
                <h3>Existence</h3>
                {['Agricultural Existence', 'Seasonal Existence'].map(option => (
                  <label key={option}>
                    <input
                      type="checkbox"
                      checked={selectedFilters.existence.includes(option)}
                      onChange={() => handleFilterChange('existence', option)}
                    />
                    {option}
                  </label>
                ))}
              </div>

              <div className="filter-category">
                <h3>Properties</h3>
                {['Medicinal Properties', 'Allergic Properties'].map(option => (
                  <label key={option}>
                    <input
                      type="checkbox"
                      checked={selectedFilters.properties.includes(option)}
                      onChange={() => handleFilterChange('properties', option)}
                    />
                    {option}
                  </label>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={handleDownloadPDF}>Download</button>
              <button onClick={() => setShowDownloadModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Explore;
