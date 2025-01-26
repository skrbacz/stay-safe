import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import "./Home.css";
import logoWithName from "../assets/logo_with_name.svg";
import illustration from "../assets/illustration.svg";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import logo from "../assets/logo.svg";

function translateValues(object, fieldsToTranslate, translationMap) {
  if (object === undefined){
    return object;
  }
  let translatedObject = object; // Copy the object to avoid mutation

  for (const field of fieldsToTranslate) {
    if (object[field] && translationMap[object[field]]) {
      translatedObject[field] = translationMap[object[field]];
    } 
  }

  return translatedObject;
}

const Home = () => {

  const valueTranslationMap = {
    "Silny wiatr": "Strong wind",
    "Opady śniegu": "Snowfall",
    "Przymrozki": "Frosts",
    "Gęsta mgła": "Thick fog",
    "Opady marznące": "Freezing rain"
  };

  const [menuOpen, setMenuOpen] = useState(false);
  // const [districts, setDistricts] = useState(null);
  // mock data for districts:
  const [districts, setDistricts] = useState([
    { id: '0220', name: "trzebnicki", disaster: "" },
    { id: '0223', name: "wrocławski", disaster: "" },
    { id: '1821', name: "leski", disaster: "" },
    { id: '1861', name: "Krosno", disaster: "" },
  ]);
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

  const handleGetIMGWDisasters = async () => {
    try {
      const response = await axios.get(
        "https://danepubliczne.imgw.pl/api/data/warningsmeteo"
      );

      const fetchedDistricts = [];

      console.log("Disasters fetched successfully:", response.data);
      response.data.forEach((element) => {
        const districtid = element.teryt;
        const districtDisaster = element.nazwa_zdarzenia;

        fetchedDistricts.push({
          id: districtid,
          disaster: districtDisaster,
        });
      });

      console.log("api districts:", fetchedDistricts);
      const finalDistricts = []

      districts.forEach((element) => {
        const selectedDistrict = fetchedDistricts.find(
          (disaster) => disaster.id.includes(element.id)
        );
        const translatedDistrict = translateValues(selectedDistrict,["disaster"],valueTranslationMap);
        console.log('current district:', selectedDistrict)
        finalDistricts.push({
          id: element.id,
          name: element.name,
          disaster: translatedDistrict ? translatedDistrict.disaster : "No Disasters",
        });
      })
      console.log('final districts:', finalDistricts)
      setDistricts(finalDistricts)
    } catch (error) {
      console.error("Error fetching disasters:", error);
    }
  };

  useEffect(() => {
    handleGetIMGWDisasters();
  });

  const handleDisasterClick = (disasterName) => {
    // Navigate to the disaster page with the disaster name
    navigate("/disaster", { state: { selectedDisaster: disasterName } });
  };

  return (
    <div className="app-container">
      <div className="home-container">
        <header className="header">
          <img src={logoWithName} alt="Logo with Name" className="logo" />
          <MenuOutlinedIcon className="menu-icon" onClick={toggleMenu} />
        </header>

        <div className="info-container">
          <h2>
            What’s new? <br /> Stay informed.
          </h2>

          {districts && districts.length > 0 ? (
            districts.map((district, index) => (
              <div
                key={index}
                className="info-item"
                onClick={() => handleDisasterClick(district.disaster)}
              >
                <h3>
                  {district.name}: {district.disaster}
                </h3>
                <p>
                  Click <span>here</span> to see how to make sure you stay safe.
                </p>
              </div>
            ))
          ) : (
            <div className="info-item">
              <p>
                Click <span>here</span> to add a district you want to follow.
              </p>
            </div>
          )}
        </div>

        <img src={illustration} alt="Footer Icon" className="footer-icon" />

        {menuOpen && <div className="menu-overlay" onClick={toggleMenu} />}
        <div className={`slide-menu ${menuOpen ? "open" : ""}`}>
          <div className="top-rectangle">
            <img src={logo} alt="Logo" className="menu-logo" />
          </div>
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
                navigate("/");
                // handleLogout();
              }}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
