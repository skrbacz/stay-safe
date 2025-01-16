import React from "react";
import "./Home.css";
import logoWithName from "../assets/logo_with_name.svg";
import illustration from "../assets/illustration.svg";

const Home = () => {
    return (
        <div className="home-container">
            <header className="header">
                <img src={logoWithName} alt="Logo with Name" className="logo" />
                <div className="menu-icon">☰</div>
            </header>
            <div className="info-container">
                <h2>What’s new? <br /> Stay informed.</h2>
                <p>
                    Click <span>here</span> to add a county you want to follow.
                </p>
            </div>

            <div
                className="footer-icon"
                style={{ backgroundImage: `url(${illustration})` }}
            />
        </div>
    );
};

export default Home;