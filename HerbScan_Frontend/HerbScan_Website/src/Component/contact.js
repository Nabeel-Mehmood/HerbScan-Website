import React, { useState } from 'react';
import axios from 'axios';
import Header from '../Component/header'; // Import the Header component
import Footer from '../Component/footer'; // Import the Footer component
import './contact.css';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [feedback, setFeedback] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Map email field to sender before submission
    const payload = {
      name: formData.name,
      sender: formData.email,  // Renaming 'email' to 'sender'
      message: formData.message
    };

    try {
      const response = await axios.post('/api/emails', payload);
      if (response.status === 201) {
        setFeedback('Your message has been submitted!');
        setFormData({ name: '', email: '', message: '' });
      }
    } catch (error) {
      console.error('Error submitting message:', error);
      setFeedback('There was an error submitting your message.');
    }
  };

  return (
    <div className="contact-container">
      <Header showSearchBar={false} />
      <main className="contact-main">
        <section className="contact-form-section">
          <h2>Contact Us</h2>
          {feedback && <p className="feedback">{feedback}</p>}
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="submit-btn">Submit</button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default Contact;
