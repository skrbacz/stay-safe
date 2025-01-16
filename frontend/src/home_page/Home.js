import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import "./Home.css";
import logoWithName from "../assets/logo_with_name.svg";
import illustration from "../assets/illustration.svg";
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import logo from "../assets/logo.svg"

const Home = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    // const handleLogout = async () => {
    //     try {
    //         const csrfToken = Cookies.get("csrftoken");
    //         const response = await axios.post(
    //             "http://localhost:8000/api/logout/",
    //             {},
    //             {
    //                 withCredentials: true,
    //                 headers: {
    //                     "X-CSRFToken": csrfToken,
    //                 },
    //             }
    //         );

    //         console.log("Logout successful:", response);
    //         Cookies.remove("sessionid");
    //         navigate("/login");
    //     } catch (error) {
    //         console.error("Logout error:", error);
    //     }
    // };

    return (
        <div className="home-container">
            <header className="header">
                <img src={logoWithName} alt="Logo with Name" className="logo" />
                <MenuOutlinedIcon
                    className="menu-icon"
                    onClick={toggleMenu}
                />
            </header>

           
            <div className="info-container">
                <h2>What’s new? <br /> Stay informed.</h2>
                <p>
                    Click <span>here</span> to add a district you want to follow.
                </p>
            </div>

            
            <img src={illustration} alt="Footer Icon" className="footer-icon" />

        
            {menuOpen && <div className="menu-overlay" onClick={toggleMenu} />}
            <div className={`slide-menu ${menuOpen ? "open" : ""}`}>
                <div className="top-rectangle"><img src={logo} alt="Logo" className="menu-logo" /></div>
                <button className="close-btn" onClick={toggleMenu}>
                    ✕
                </button>
                <div className="menu-content">
                    
                    <div
                        className="menu-item"
                        onClick={() => {
                            toggleMenu();
                            navigate("/disaster");
                        }}
                    >
                        Search Disaster →
                    </div>
                    <div
                        className="menu-item"
                        onClick={() => {
                            toggleMenu();
                            navigate("/profile");
                        }}
                    >
                        Profile →
                    </div>
                    <button
                        className="logout-btn"
                        onClick={() => {
                            toggleMenu();
                            navigate("/")
                            // handleLogout();
                        }}
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;