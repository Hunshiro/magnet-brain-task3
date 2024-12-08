import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css'; // Reuse the login CSS

const Register = () => {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if ( !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    // Make sure the register function passes the username as 'name'
    const result = await register( email, password); // Ensure username (name) is included
    
    if (result.success) {
      navigate('/'); // Redirect to dashboard
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Create Your Account</h2>
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setName(e.target.value)} // Ensure the username (name) is collected here
            required
            placeholder="Enter your full name"
          />
        </div>
        
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Create a password"
            minLength="6"
          />
        </div>
        
        <div className="form-group">
          <label>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your password"
            minLength="6"
          />
        </div>
        
        <button type="submit" className="login-button">
          Register
        </button>
        
        <div className="register-link">
          Already have an account? 
          <Link to="/login"> Login here</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
