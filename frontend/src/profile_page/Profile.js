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
        const response = await axios.get("/user/update/districts", {
          withCredentials: true, 
        });
        setDistricts(response.data || []);
      } catch (error) {
        console.error("Error fetching user's districts:", error);
      }
    };

    const fetchAllDistricts = async () => {
      try {
        const response = await axios.get("/district/");
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
      await axios.patch(
        `/user/update/districts/${selectedDistrict.name}`,
        { districts: { add: true } },
        { withCredentials: true }
      );
      setDistricts((prev) => [...prev, selectedDistrict]);
      setDialogOpen(false);
    } catch (error) {
      console.error("Error adding district:", error);
    }
  };

  
  const handleDeleteDistrict = async () => {
    try {
      await axios.patch(
        `/user/update/districts/${selectedDistrict.name}`,
        { districts: { remove: true } },
        { withCredentials: true }
      );
      setDistricts((prev) =>
        prev.filter((d) => d.name !== selectedDistrict.name)
      );
      setDialogOpen(false);
    } catch (error) {
      console.error("Error removing district:", error);
    }
  };

  return (
    <div className="profile-container">
      <header className="header">
        <img src={logoWithName} alt="Logo with Name" className="logo" />
        <MenuOutlinedIcon className="menu-icon" onClick={toggleMenu} />
      </header>

      <div className="info-container">
        <h2>Hello *username* !</h2>
        <a>Districts you follow: </a>
        <div className="district-container">
          {districts && districts.length > 0 ? (
            districts.map((district, index) => (
              <div key={index}>
                <h3>• {district.name}</h3>
              </div>
            ))
          ) : (
            <div className="info-item">
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
  );
};

export default Profile;
