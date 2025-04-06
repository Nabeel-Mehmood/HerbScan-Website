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
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [showScrollArrow, setShowScrollArrow] = useState(true);

  // Refs for scrolling
  const searchSectionRef = useRef(null);
  const resultsSectionRef = useRef(null);

  // Show scroll arrow on initial load and hide after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowScrollArrow(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await axios.get(
        `http://localhost:5000/api/plants/search?query=${encodeURIComponent(searchQuery)}`
      );
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

  // Handle Enter key in search
  const handleKeyDownSearch = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Scroll to search section
  const scrollToSearch = () => {
    if (searchSectionRef.current) {
      searchSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      setShowScrollArrow(false);
    }
  };

  const handleSearchFilterChange = (filterType, value) => {
    setSearchFilters((prevFilters) => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  const disabledFilters = {
    family: searchFilters.family !== '',
    name: searchFilters.name !== '',
    existence: searchFilters.existence !== '',
    properties: searchFilters.properties !== ''
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
        {/* Scroll arrow */}
        {showScrollArrow && (
          <div className="scroll-down-arrow" onClick={scrollToSearch}>
            <i className="fas fa-chevron-down"></i>
          </div>
        )}

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
              <button className="advanced-btn" onClick={() => setShowAdvanced(!showAdvanced)}>
                Advanced
              </button>
              <button className="download-btn">Download PDF</button>
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

        {showAdvanced && (
          <section className="explore-result-filter">
            <h2>Result Filter</h2>
            <div className="filter-dropdowns">
              <div className="filter-group">
                <label htmlFor="family-dropdown-advanced">Family Name:</label>
                <select
                  id="family-dropdown-advanced"
                  className="filter-select"
                  disabled={disabledFilters.family}
                >
                  <option value="">Select</option>
                  <option value="family-name">Family Name</option>
                  <option value="sub-family-name">Sub-Family Name</option>
                  <option value="tribe-name">Tribe Name</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="name-dropdown-advanced">Name:</label>
                <select
                  id="name-dropdown-advanced"
                  className="filter-select"
                  disabled={disabledFilters.name}
                >
                  <option value="">Select</option>
                  <option value="botanical-name">Botanical Name</option>
                  <option value="common-name">Common Name</option>
                  <option value="regional-name">Regional Name</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="existence-dropdown-advanced">Existence:</label>
                <select
                  id="existence-dropdown-advanced"
                  className="filter-select"
                  disabled={disabledFilters.existence}
                >
                  <option value="">Select</option>
                  <option value="agricultural-existence">Agricultural Existence</option>
                  <option value="seasonal-existence">Seasonal Existence</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="properties-dropdown-advanced">Properties:</label>
                <select
                  id="properties-dropdown-advanced"
                  className="filter-select"
                  disabled={disabledFilters.properties}
                >
                  <option value="">Select</option>
                  <option value="medicinal-properties">Medicinal Properties</option>
                  <option value="allergic-properties">Allergic Properties</option>
                </select>
              </div>
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
            <button
              className="close-btn"
              onClick={() => setSelectedPlant(null)}
            >
              ✕
            </button>
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

      <Footer />
    </div>
  );
}

export default Explore;