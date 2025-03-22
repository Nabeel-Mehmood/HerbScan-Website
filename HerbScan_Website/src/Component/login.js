// ./Component/login.js
import React, { useState, useEffect } from 'react'; 
import './login.css'; 
import Logo from '../Assets/logo.png'; 
import SignupBg from '../Assets/Signup_bg.jpg'; 
import SignupRightBg from '../Assets/Signup_rigjt_bg.jpg';

function Login() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [credentials, setCredentials] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prevCredentials => ({
      ...prevCredentials,
      [name]: value
    }));
  };

  const validateEmail = (email) => {
    return email.endsWith('@gmail.com');
  };

  const handleSubmit = () => {
    // --- ADMIN LOGIN CHECK ---
    if (credentials.email === "Admin_123" && credentials.password === "12345678") {
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = '/admin';
      return;
    }

    if (isSignUp) {
      if (!credentials.name || !credentials.email || !credentials.password || !validateEmail(credentials.email)) {
        setError('Please fill out all fields with valid information.');
        return;
      }
      // Save credentials for sign-up.
      localStorage.setItem('user', JSON.stringify(credentials));
      setIsSignUp(false);
      setError('');
      // Log in the new user.
      localStorage.setItem('userType', 'user');
      localStorage.setItem('isLoggedIn', 'true');
      window.location.href = '/';
    } else {
      if (!credentials.email || !credentials.password || !validateEmail(credentials.email)) {
        setError('Please fill out all fields with valid information.');
        return;
      }
      // Regular user login process.
      const storedCredentials = JSON.parse(localStorage.getItem('user'));
      if (storedCredentials && storedCredentials.email === credentials.email && storedCredentials.password === credentials.password) {
        localStorage.setItem('userType', 'user');
        localStorage.setItem('isLoggedIn', 'true');
        window.location.href = '/';
      } else {
        setError('Incorrect credentials, please try again.');
      }
    }
  };

  const toggleSignUp = () => {
    setIsSignUp(prev => !prev);
    setError('');
  };

  useEffect(() => {
    const handleScroll = () => {
      // If needed, perform actions on scroll
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
