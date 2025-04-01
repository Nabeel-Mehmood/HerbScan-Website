// Footer.js
import React from 'react';
import './footer.css'; // Import the CSS specific to the footer

function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2024 HerbScan. All rights reserved.</p>
      <ul className="footer-links">
        <li><a href="/about">About Us</a></li>
        <li><a href="/privacy">Privacy Policy</a></li>
        <li><a href="/terms">Terms of Service</a></li>
        <li><a href="/help">Help Center</a></li>
      </ul>
    </footer>
  );
}

export default Footer;
