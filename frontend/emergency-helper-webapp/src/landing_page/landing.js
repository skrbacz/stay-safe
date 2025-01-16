import React from "react";
import "./landing.css";
import logo from "../assets/logo.svg";
import illustration from "../assets/landing_illustration.svg";

const DisasterLandingPage = () => {
    return (
        <div className="disaster-container">
            <header className="header">
                <img src={logo} alt="StaySafe Logo" className="logo" />
                <div className="title">StaySafe</div>
            </header>

            <main className="main-content">
                <h1 className="intro-title">Introducing <span className="highlight">StaySafe</span></h1>
                <p className="intro-text">
                    Disasters can strike anytime, but with the right preparation, you can stay safe. Use our search tool to learn about natural disasters, preparation tips, and safety measures.
                </p>
                <p className="intro-tagline">Stay informed. Stay prepared. Stay safe.</p>

                <button className="cta-button">Get Started</button>

                <img src={illustration} alt="Megaphone Illustration" className="intro-illustration" />
            </main>
        </div>
    );
};

export default DisasterLandingPage;
