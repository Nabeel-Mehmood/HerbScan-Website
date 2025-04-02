// login.js
import React, { useState } from 'react';
import './login.css';
import Logo from '../Assets/logo.png';
import SignupBg from '../Assets/Signup_bg.jpg';
import SignupRightBg from '../Assets/Signup_rigjt_bg.jpg';

function Login() {
  // Default to login mode.
  const [isSignUp, setIsSignUp] = useState(false);
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  
  // Use API URL from the environment; fallback to localhost.
  const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/auth';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  // Simple validation: for regular users, require a Gmail address.
  const validateEmail = (email) => email.endsWith('@gmail.com');

  const handleSubmit = async () => {
    try {
      if (!credentials.email || !credentials.password) {
        setError('Please enter both email and password.');
        return;
      }
      
      // If admin, use the dedicated admin endpoint.
      if (credentials.email.toLowerCase() === 'admin@gmail.com') {
        const endpoint = `${apiUrl}/admin/login`;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || 'Something went wrong.');
        }
        window.location.href = '/admin';
        return;
      }
      
      // Regular user flows.
      if (isSignUp) {
        if (!credentials.name) {
          setError('Please enter your name.');
          return;
        }
        if (!validateEmail(credentials.email)) {
          setError('Please use a valid Gmail address.');
          return;
        }
      }
      const endpoint = isSignUp ? `${apiUrl}/signup` : `${apiUrl}/login`;
      const body = isSignUp 
          ? { name: credentials.name, email: credentials.email, password: credentials.password }
          : { email: credentials.email, password: credentials.password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }
      window.location.href = data.user.role === 'admin' ? '/admin' : '/';
    } catch (error) {
      setError(error.message);
      console.error('Authentication error:', error);
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setError('');
  };

  return (
    <div className="login-container" style={{ backgroundImage: `url(${SignupBg})` }}>
      {/* Left Section */}
      <div className="login-left">
        <div className="floating-image-wrapper">
          <img src={SignupRightBg} alt="Background" className="background-image" />
          <div className="text-overlay" onClick={() => window.location.href = '/'}>
            Scan with HerbScan
          </div>
        </div>
      </div>
      {/* Right Section */}
      <div className="login-right">
        <div className="signup-form">
          <img src={Logo} alt="Logo" className="logo" />
          <h2>{isSignUp ? 'CREATE YOUR ACCOUNT' : 'LOGIN TO YOUR ACCOUNT'}</h2>
          {isSignUp && (
            <div className="input-group fade-in">
              <label>Name</label>
              <input type="text" name="name" placeholder="Enter your name" onChange={handleInputChange} />
            </div>
          )}
          <div className="input-group fade-in">
            <label>Email</label>
            <input type="email" name="email" placeholder="Enter your email" onChange={handleInputChange} />
          </div>
          <div className="input-group fade-in">
            <label>Password</label>
            <input type="password" name="password" placeholder="Enter your password" onChange={handleInputChange} />
          </div>
          {error && <p className="error">{error}</p>}
          <button className="signup-button fade-in" onClick={handleSubmit}>
            {isSignUp ? 'Sign Up' : 'Login'}
          </button>
          <p className="login-prompt">
            {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
            <button className="link-button" onClick={toggleSignUp}>
              {isSignUp ? 'Login' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
