import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";




const isAuthenticated = async () => {
  try {
    console.log("All Cookies:", document.cookie);

    const response = await axios.get("http://localhost:8000/api/check_login/", {
      withCredentials: true, 
    });

    console.log("Auth check response:", response.status);
    return response.status === 200;
  } catch (error) {
    console.error("Error checking authentication:", error.response?.data || error.message);
    return false;
  }
};



const ProtectedRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      console.log("Checking authentication...");
      const loggedIn = await isAuthenticated();
      console.log("Auth Status:", loggedIn);

      setAuth(loggedIn);
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!auth) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
