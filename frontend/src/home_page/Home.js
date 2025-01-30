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
  if (object === undefined) {
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
    Przymrozki: "Frosts",
    "Gęsta mgła": "Thick fog",
    "Opady marznące": "Freezing rain",
  };


  const [loading, setLoading] = useState(true); // Loading state
  const [menuOpen, setMenuOpen] = useState(false);
  const [districts, setDistricts] = useState([])
  const navigate = useNavigate();
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const handleLogout = async () => {
    try {
      const csrfToken = Cookies.get("csrftoken");

      const response = await axios.post(
        "http://localhost:8000/api/logout/",
        {},
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );

      console.log("Logout successful:", response);

      Cookies.remove("sessionid");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const fetchDistricts = async () => {
    try {
      const csrfToken = Cookies.get("csrftoken");
      const response = await axios.get("http://localhost:8000/api/user/districts", {
        withCredentials: true,
        headers: { "X-CSRFToken": csrfToken || "" },
      });
      const data = response.data || [];
      setDistricts(data);
      return data;
    } catch (error) {
      console.error("Error fetching districts:", error);
      setDistricts([]);
      return [];
    }
  };

  const handleGetIMGWDisasters = async (districtsData) => {
    try {
      const response = await axios.get("https://danepubliczne.imgw.pl/api/data/warningsmeteo");
      const fetchedDisasters = response.data.map(({ teryt, nazwa_zdarzenia }) => ({
        id: teryt,
        disaster: nazwa_zdarzenia,
      }));

      const updatedDistricts = districtsData.map((district) => {
        const disaster = fetchedDisasters.find((d) => d.id.includes(district.id));
        const translated = translateValues(disaster, ["disaster"], valueTranslationMap);
        return {
          ...district,
          disaster: translated?.disaster || "No Disasters",
        };
      });

      setDistricts(updatedDistricts);
    } catch (error) {
      if (error.response?.status === 404) {
        // Handle 404 by setting all districts to "No Disasters"
        const safeDistricts = districtsData.map((d) => ({ ...d, disaster: "No Disasters" }));
        setDistricts(safeDistricts);
      } else {
        console.error("Error fetching disasters:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const districtsData = await fetchDistricts();
      await handleGetIMGWDisasters(districtsData);
    };
    fetchData();
  }, []);

  const handleDisasterClick = (disasterName) => {
    // Navigate to the disaster page with the disaster name
    navigate("/disaster", { state: { selectedDisaster: disasterName } });
  };

  return (
    <div className="app-container">
      <div className="home-container">
        <header className="header">
          <img src={logoWithName} alt="Logo with Name" className="info-logo" />
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
                  Click{" "}
                  <span
                    onClick={() => handleDisasterClick(district.disaster_name)}
                  >
                    here
                  </span>{" "}
                  to see how to make sure you stay safe.
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
                handleLogout();
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
