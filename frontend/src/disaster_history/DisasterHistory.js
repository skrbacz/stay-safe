import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Disaster.css";
import logo_name from "../assets/logo_with_name.svg";
import logo from "../assets/logo.svg";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import Cookies from "js-cookie";
import axios from "axios";

const Disaster = () => {
  const location = useLocation();
  const initialDisaster = location.state?.selectedDisaster || "Select Disaster";
  const disasterId = location.state?.disasterId || null; // New disasterId from state

  console.log("initial disaster: ", initialDisaster);
  console.log("disasterId: ", disasterId);

  const [disasterOptions, setDisasterOptions] = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState(initialDisaster);
  const [menuOpen, setMenuOpen] = useState(false);
  const [disastersDetails, setDisastersDetails] = useState([]);
  const [selectedDisasterDetails, setSelectedDisasterDetails] = useState("");
  const [toDoList, setToDoList] = useState([]);
  const navigate = useNavigate();

  // Fetch disasters on component load or when the initial disaster or disasterId changes
  useEffect(() => {
    handleGetDisasters();
  }, [initialDisaster, disasterId]);

  const handleGetDisasters = async () => {
    try {
      let url = "http://localhost:8000/api/natural_disaster/"; // Default endpoint to fetch all disasters
      // If a specific disasterId is passed, fetch details for that disaster
      if (disasterId) {
        url = `http://localhost:8000/api/natural_disaster/${disasterId}/`;
      }
  
      const response = await axios.get(url, { withCredentials: true });
      console.log("Disasters fetched successfully:", response.data);
  
      const fetchedDisasterNames = ["Select Disaster"];
      const fetchedDisasters = [
        {
          name: "Select Disaster",
          description: "Select a disaster to view the details here.",
          tasks: "Select a disaster to view the actions here.",
        },
      ];
  
      // Handling both single disaster and multiple disasters response
      if (response.data) {
        if (Array.isArray(response.data)) {
          response.data.forEach((disaster) => {
            const disasterName = disaster.name;
            const disasterDescription = disaster.description;
            const disasterTasks = disaster.todo_list;
  
            fetchedDisasterNames.push(disasterName);
            fetchedDisasters.push({
              name: disasterName,
              description: disasterDescription,
              tasks: disasterTasks,
            });
          });
        } else {
          const disaster = response.data;
          fetchedDisasterNames.push(disaster.name);
          fetchedDisasters.push({
            name: disaster.name,
            description: disaster.description,
            tasks: disaster.todo_list,
          });
        }
      }
  
      console.log("fetched disaster names: ", fetchedDisasterNames);
      console.log("fetched disasters: ", fetchedDisasters);
  
      // If a disasterId was passed, find that disaster name and set it
      let selectedDetail = null;
      if (disasterId) {
        selectedDetail = fetchedDisasters.find((event) => event.name === response.data.name);
      }
  
      // If no disasterId, use the default initial disaster name
      if (!selectedDetail) {
        selectedDetail = fetchedDisasters.find((event) => event.name === selectedDisaster);
      }
  
      if (selectedDetail) {
        setSelectedDisaster(selectedDetail.name);
        setSelectedDisasterDetails(selectedDetail.description);
        const toDoLabels = selectedDetail.tasks.split(";");
        setToDoList(
          Array.from({ length: toDoLabels.length }, (_, index) => ({
            id: index,
            text: toDoLabels[index],
            completed: false,
          }))
        );
      }
  
      setDisasterOptions(fetchedDisasterNames);
      setDisastersDetails(fetchedDisasters);
    } catch (error) {
      console.error("Error fetching disasters:", error);
    }
  };

  // Handle change when a user selects a disaster from the dropdown
  const handleChange = (disaster) => {
    const select = disaster.target.value;
    setSelectedDisaster(select);

    const selectedDetail = disastersDetails.find((event) => event.name === select);
    if (!selectedDetail) {
      console.warn("Selected disaster not found:", select);
      return;
    }

    setSelectedDisasterDetails(selectedDetail.description);
    const toDos = selectedDetail.tasks.split(";");

    setToDoList(
      Array.from({ length: toDos.length }, (_, index) => ({
        id: index,
        text: toDos[index],
        completed: false,
      }))
    );
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

  const toggleComplete = (id) => {
    const updatedToDos = toDoList.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setToDoList(updatedToDos);
  };

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <div className="disaster-container">
      <header className="header">
        <img src={logo_name} alt={logo_name} className="disaster-logo" />
        <MenuOutlinedIcon className="menu-icon" onClick={toggleMenu} />
      </header>
      <main className="main-content">
        {/* Dropdown menu for the disaster title */}
        <div className="dropdown-container">
          <select
            id="disaster-select"
            value={selectedDisaster}
            onChange={handleChange}
            className="disaster-dropdown"
          >
            {disasterOptions.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div className="description-box">{selectedDisasterDetails}</div>
        <h2 className="todo-title">To-Do List: Stay prepared</h2>
        <section className="todo-section">
          <div className="todo-list">
            {toDoList.map((todo) => (
              <label key={todo.id}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                />
                {todo.text}
              </label>
            ))}
          </div>
        </section>
      </main>
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
  );
};

export default Disaster;
