import React, { useState } from 'react';
import Header from '../Component/header';
import Footer from '../Component/footer';
import './history.css';
import dummyImage from '../Assets/dummy.png';

function History() {
  const [activeTab, setActiveTab] = useState('uploadHistory');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="history-container">
      <Header showSearchBar={false} />
      <div className="history-content">
        <h1>History</h1>
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${activeTab === 'uploadHistory' ? 'active' : ''}`}
            onClick={() => handleTabClick('uploadHistory')}
          >
            Upload History
          </button>
          <button
            className={`tab-button ${activeTab === 'searchHistory' ? 'active' : ''}`}
            onClick={() => handleTabClick('searchHistory')}
          >
            Search History
          </button>
        </div>
        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'uploadHistory' && (
            <div className="upload-history">
              <div className="history-item">
                <img src={dummyImage} alt="Dummy 1" />
                <div className="history-details">
                  <h2>Dummy 1</h2>
                  <p>This is a Dummy image 1</p>
                </div>
              </div>
              <div className="history-item">
                <img src={dummyImage} alt="Dummy 2" />
                <div className="history-details">
                  <h2>Dummy 2</h2>
                  <p>This is a Dummy image 2</p>
                </div>
              </div>
              <div className="history-item">
                <img src={dummyImage} alt="Dummy 3" />
                <div className="history-details">
                  <h2>Dummy 3</h2>
                  <p>This is a Dummy image 3</p>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'searchHistory' && (
            <div className="search-history">
              <div className="history-item">
                <h4>Searched by:</h4>
                <h5>Option 1, Option 2, ...</h5>
                <h4>Result Displayed:</h4>
                <h5>Text 1, Text 2, ...</h5>
              </div>
              <div className="history-item">
                <h4>Searched by:</h4>
                <h5>Option 1, Option 2, ...</h5>
                <h4>Result Displayed:</h4>
                <h5>Text 1, Text 2, ...</h5>
              </div>
              <div className="history-item">
                <h4>Searched by:</h4>
                <h5>Option 1, Option 2, ...</h5>
                <h4>Result Displayed:</h4>
                <h5>Text 1, Text 2, ...</h5>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default History;
