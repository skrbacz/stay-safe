import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Autocomplete,
  TextField,
} from "@mui/material";
import "./Profile.css";
import logoWithName from "../assets/logo_with_name.svg";
import illustration from "../assets/illustration.svg";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import logo from "../assets/logo.svg";
import axios from "axios";
import Cookies from "js-cookie";

const Profile = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [allDistricts, setAllDistricts] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const csrfToken = Cookies.get("csrftoken");
        const response = await axios.get("http://localhost:8000/api/user/districts", {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken || "",
          },
        });
        setDistricts(response.data || []);
      } catch (error) {
        console.error("Error fetching user's districts:", error);
      }
    };

    const fetchAllDistricts = async () => {
      try {
        const csrfToken = Cookies.get("csrftoken");
        const response = await axios.get("http://localhost:8000/api/district/", {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken || "",
          },
        });
        setAllDistricts(response.data || []);
      } catch (error) {
        console.error("Error fetching all districts:", error);
      }
    };

    fetchDistricts();
    fetchAllDistricts();
  }, []);

  const handleDialogOpen = () => setDialogOpen(true);
  const handleDialogClose = () => setDialogOpen(false);

  const handleAddDistrict = async () => {
    try {
      const csrfToken = Cookies.get("csrftoken");
      await axios.patch(
        `http://localhost:8000/api/user/update/districts/${selectedDistrict.name}/`,
        { districts: { add: [selectedDistrict.name] } }, // Pass district name inside an array
        { withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken || "",
          },
        }
      );
      setDistricts((prev) => [...prev, selectedDistrict]); // Update state
      setDialogOpen(false);
    } catch (error) {
      console.error("Error adding district:", error);
    }
  };

  const handleDeleteDistrict = async () => {
    try {
      const csrfToken = Cookies.get("csrftoken");
      await axios.patch(
        `http://localhost:8000/api/user/update/districts/${selectedDistrict.name}/`,
        { districts: { remove: [selectedDistrict.name] } }, // Send the name inside an array
        { withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken || "",
          },
        }
      );
  
      setDistricts((prev) => prev.filter((d) => d.name !== selectedDistrict.name));
      setDialogOpen(false);
    } catch (error) {
      console.error("Error removing district:", error);
    }
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

  return (
    <div className="app-container">
      <div className="profile-container">
        <header className="header">
          <img
            src={logoWithName}
            alt="Logo with Name"
            className="profile-logo"
          />
          <MenuOutlinedIcon className="menu-icon" onClick={toggleMenu} />
        </header>

        <div className="user-info-container">
          <h2>Hello!</h2>
          <a>Districts you follow: </a>
          <div className="district-container">
            {districts && districts.length > 0 ? (
              districts.map((district, index) => (
                <div key={index}>
                  <h3>• {district.name}</h3>
                </div>
              ))
            ) : (
              <div className="user-info-item">
                <p>No followed districts yet!</p>
              </div>
            )}
          </div>
          <div className="button-container">
            <b>
              <span
                onClick={handleDialogOpen}
                style={{ cursor: "pointer", color: "black" }}
              >
                EDIT DISTRICTS YOU FOLLOW
              </span>
            </b>
          </div>
        </div>

        <img
          src={illustration}
          alt="Footer Icon"
          className="footer-icon-profile"
        />

        <Dialog open={dialogOpen} onClose={handleDialogClose}>
          <DialogTitle>Edit Districts</DialogTitle>
          <DialogContent>
            <Autocomplete
              disablePortal
              options={allDistricts}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => setSelectedDistrict(newValue)}
              sx={{ width: 300 }}
              renderInput={(params) => (
                <TextField {...params} label="Select a District" />
              )}
              value={selectedDistrict}
            />
            <div>
              <h4>
                Selected District:{" "}
                {selectedDistrict ? selectedDistrict.name : "None"}
              </h4>
            </div>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="secondary">
              Cancel
            </Button>
            <Button
              onClick={handleAddDistrict}
              color="primary"
              disabled={
                !selectedDistrict ||
                districts.some((d) => d.name === selectedDistrict.name)
              }
            >
              Add
            </Button>
            <Button
              onClick={handleDeleteDistrict}
              color="error"
              disabled={
                !selectedDistrict ||
                !districts.some((d) => d.name === selectedDistrict.name)
              }
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>

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
                navigate("/home");
              }}
            >
              Home →
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

export default Profile;
