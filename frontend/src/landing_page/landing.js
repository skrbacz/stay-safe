import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./landing.css";
import illustration from "../assets/landing_illustration.svg";

const DisasterLandingPage = () => {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/check_login/",
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setIsAuth(true);
        }
      } catch (error) {
        setIsAuth(false); // Not authenticated
      }
    };
    checkAuth();
  }, []);

  const handleGetStarted = () => {
    if (isAuth) {
      navigate("/home"); // Redirect to home if logged in
    } else {
      navigate("/login"); // Otherwise, go to login page
    }
  };

  return (
    <div className="disaster-container">
      <main className="main-content">
        <h1 className="intro-title">Introducing </h1>
        <span className="highlight">StaySafe</span>
        <p className="intro-text">
          Disasters can strike anytime, but with the right preparation, you can
          stay safe. Use our search tool to learn about natural disasters,
          preparation tips, and safety measures.
        </p>
        <p className="intro-tagline">
          Stay informed. Stay prepared. Stay safe.
        </p>

        {/* Use a button with an onClick handler instead of Link */}
        <button className="cta-button" onClick={handleGetStarted}>
          Get Started
        </button>

        <img
          src={illustration}
          alt="Megaphone Illustration"
          className="intro-illustration"
        />
      </main>
    </div>
  );
};

export default DisasterLandingPage;
