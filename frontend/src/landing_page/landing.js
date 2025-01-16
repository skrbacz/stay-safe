import React from "react";
import { Link } from "react-router-dom"; 
import "./landing.css";
import illustration from "../assets/landing_illustration.svg";

const DisasterLandingPage = () => {
    return (
        <div className="disaster-container">
            <main className="main-content">
                <h1 className="intro-title">Introducing </h1>
                <span className="highlight">StaySafe</span>
                <p className="intro-text">
                    Disasters can strike anytime, but with the right preparation, you can stay safe. Use our search tool to learn about natural disasters, preparation tips, and safety measures.
                </p>
                <p className="intro-tagline">Stay informed. Stay prepared. Stay safe.</p>
                <Link to="/login">
                    <button className="cta-button">Get Started</button>
                </Link>

                <img src={illustration} alt="Megaphone Illustration" className="intro-illustration" />
            </main>
        </div>
    );
};

export default DisasterLandingPage;
