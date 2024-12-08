import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create AuthContext
const AuthContext = createContext();

// AuthProvider Component to wrap the application and manage authentication state
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // On component mount, check the user's authentication status
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      console.log("Token from localStorage:", token);

      // If token exists, try to verify it and retrieve the user data
      if (token) {
        try {
          const response = await axios.get('http://localhost:4000/api/auth/me', {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log("User data from server:", response.data);
          setUser(response.data.user); // Set the user data in state
          setIsAuthenticated(true); // Mark as authenticated
        } catch (error) {
          console.error('Error fetching user data:', error);
          localStorage.removeItem('token'); // Token is invalid, remove it
          setIsAuthenticated(false); // Set authentication status to false
        }
      } else {
        console.log("No token found in localStorage");
        setIsAuthenticated(false); // No token, not authenticated
      }

      setLoading(false); // Stop the loading state
    };

    checkAuthStatus(); // Call the checkAuthStatus function
  }, []); // This effect runs once when the component mounts

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:4000/api/auth/login', { email, password });
      const { token, user } = response.data;

      console.log("Login successful, received token:", token);
      localStorage.setItem('token', token); // Store the token in localStorage
      setUser(user); // Set the user data in state
      setIsAuthenticated(true); // Mark as authenticated

      return { success: true };
    } catch (error) {
      console.error("Login failed:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  // Register function
  const register = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:4000/api/auth/register', { email, password });
      const { token, user } = response.data;

      console.log("Registration successful, received token:", token);
      localStorage.setItem('token', token); // Store the token in localStorage
      setUser(user); // Set the user data in state
      setIsAuthenticated(true); // Mark as authenticated

      return { success: true };
    } catch (error) {
      console.error("Registration failed:", error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  // Logout function
  const logout = () => {
    console.log("Logging out...");
    localStorage.removeItem('token'); // Remove token from localStorage
    setUser(null); // Clear the user data from state
    setIsAuthenticated(false); // Mark as not authenticated
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}>
      {!loading && children} {/* Wait until the loading state is false to render the children */}
    </AuthContext.Provider>
  );
};

// Custom hook to access the authentication context in any component
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
