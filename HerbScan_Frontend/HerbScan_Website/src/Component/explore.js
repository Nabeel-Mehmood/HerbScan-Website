import React, { useState } from 'react';
import axios from 'axios';
import Header from '../Component/header'; // Import the Header component
import Footer from '../Component/footer'; // Import the Footer component
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

  // New state for plant search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedPlant, setSelectedPlant] = useState(null);

  // Handle changes for the dedicated search input
  const handleSearchQueryChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Call the search API when user hits Enter or clicks the search icon/button
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      // Adjust the URL as necessary. Here we assume an endpoint exists at /api/plants/search.
      const response = await axios.get(`http://localhost:5000/api/plants/search?query=${encodeURIComponent(searchQuery)}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    }
  };

  // Listen for Enter key on the search input
  const handleKeyDownSearch = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
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
      {/* Header Component with the search bar hidden */}
      <Header showSearchBar={false} />

      {/* Parallax Section */}
      <section className="parallax-section" style={{ backgroundImage: `url(${parallex_background})` }}>
        <div className="parallax-content">
          <p className="parallax-title">Explore the World of HerbScan</p>
          <p className="parallax-subtitle">Discover insights and information to learn more about plants and trees.</p>
        </div>
      </section>

      {/* Main Explore Page Content */}
      <main className="explore-main">
        {/* Search Filter Section */}
        <section className="explore-search-filter">
          <h2>Search Filter</h2>
          <div className="filter-dropdowns">
            {/* Dropdown: Family Name */}
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

            {/* Dropdown: Name */}
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

            {/* Dropdown: Existence */}
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

            {/* Dropdown: Properties */}
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

        {/* Advanced Search Bar Section */}
        <section className="explore-search-section">
          <h2>Search for Plants</h2>
          <div className="search-bar-wrapper">
            <div className="search-bar-container">
              <input
                type="text"
                className="search-bar"
                placeholder="Search for plants (e.g., Phulai, Kachnar)..."
                value={searchQuery}
                onChange={handleSearchQueryChange}
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

        {/* New Section: Search Results */}
        {searchResults.length > 0 && (
          <section className="explore-search-results">
            <h2>Search Results</h2>
            <div className="results-container">
              {searchResults.map((plant) => (
                <div
                  className="plant-card"
                  key={plant._id}
                  onClick={() => setSelectedPlant(plant)}
                >
                  <div className="plant-image-placeholder">
                    {/* Empty placeholder for image */}
                  </div>
                  <div className="plant-info">
                    <h3>{plant.familyName}</h3>
                    <p>{plant.commonName}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Advanced Filter Section */}
        {showAdvanced && (
          <section className="explore-result-filter">
            <h2>Result Filter</h2>
            <div className="filter-dropdowns">
              {/* Dropdown: Family Name */}
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

              {/* Dropdown: Name */}
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

              {/* Dropdown: Existence */}
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

              {/* Dropdown: Properties */}
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

        {/* Existing Content Cards Section (unchanged) */}
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

      {/* Detail Overlay Panel for Selected Plant */}
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
            >X</button>
            <h2>{selectedPlant.commonName}</h2>
            <p><strong>Family Name:</strong> {selectedPlant.familyName}</p>
            <p><strong>Sub-Family Name:</strong> {selectedPlant.subFamilyName}</p>
            <p><strong>Tribe Name:</strong> {selectedPlant.tribeName}</p>
            <p><strong>Botanical Name:</strong> {selectedPlant.botanicalName}</p>
            <p><strong>Regional Name:</strong> {selectedPlant.regionalName}</p>
            <p><strong>Agricultural Existence:</strong> {selectedPlant.agriculturalExistence}</p>
            <p><strong>Season Existence:</strong> {selectedPlant.seasonExistence}</p>
            <p><strong>Medicinal Properties:</strong> {selectedPlant.medicinalProperties}</p>
            <p><strong>Allergic Properties:</strong> {selectedPlant.allergicProperties}</p>
          </div>
        </div>
      )}
      {/* Footer Component */}
      <Footer />
    </div>
  );
}

export default Explore;
