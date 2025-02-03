import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Disaster.css";
import logo_name from "../assets/logo_with_name.svg";
import logo from "../assets/logo.svg";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import Cookies from "js-cookie";
import axios from "axios";
import Switch from "@mui/material/Switch"; // Import MUI Switch component

const Disaster = () => {
  const location = useLocation();
  const initialDisaster = location.state?.selectedDisaster || "Select Disaster";
  const disasterId = location.state?.disasterId || null;

  const [disasterOptions, setDisasterOptions] = useState([]);
  const [selectedDisaster, setSelectedDisaster] = useState(initialDisaster);
  const [menuOpen, setMenuOpen] = useState(false);
  const [disastersDetails, setDisastersDetails] = useState([]);
  const [selectedDisasterDetails, setSelectedDisasterDetails] = useState("");
  const [toDoList, setToDoList] = useState([]);
  const [note, setNote] = useState(""); // For the note field
  const [saveToHistory, setSaveToHistory] = useState(false); // For Switch toggle state
  const [selectedDisasterId, setSelectedDisasterId] = useState(null);
  const navigate = useNavigate();

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

  // Fetch disasters on component load or when the initial disaster or disasterId changes
  useEffect(() => {
    handleGetDisasters();
  }, [initialDisaster, disasterId]);

  const handleGetDisasters = async () => {
    try {
      let url = "http://localhost:8000/api/natural_disaster/"; // Default endpoint to fetch all disasters
      if (disasterId) {
        url = `http://localhost:8000/api/natural_disaster/${disasterId}/`;
      }
  
      const response = await axios.get(url, { withCredentials: true });
  
      const fetchedDisasterNames = ["Select Disaster"];
      const fetchedDisasters = [
        {
          id: null,
          name: "Select Disaster",
          description: "Select a disaster to view the details here.",
          tasks: "Select a disaster to view the actions here.",
        },
      ];
  
      if (response.data) {
        if (Array.isArray(response.data)) {
          response.data.forEach((disaster) => {
            const disasterId = disaster.id;
            const disasterName = disaster.name;
            const disasterDescription = disaster.description;
            const disasterTasks = disaster.todo_list;
  
            fetchedDisasterNames.push(disasterName);
            fetchedDisasters.push({
              id: disasterId,
              name: disasterName,
              description: disasterDescription,
              tasks: disasterTasks,
            });
          });
        } else {
          const disaster = response.data;
          fetchedDisasterNames.push(disaster.name);
          fetchedDisasters.push({
            id: disaster.id,
            name: disaster.name,
            description: disaster.description,
            tasks: disaster.todo_list,
          });
        }
      }
  
      const selectedDetail = fetchedDisasters.find((event) => event.name === selectedDisaster);
      setSelectedDisasterDetails(selectedDetail ? selectedDetail.description : "Select a disaster to view the details here.");
      const toDoLabels = selectedDetail ? selectedDetail.tasks.split(";") : ["Select a disaster to view the actions here."];
      setToDoList(
        Array.from({ length: toDoLabels.length }, (_, index) => ({
          id: index,
          text: toDoLabels[index],
          completed: false,
        }))
      );
  
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
  
    // Now get the disaster ID for the selected disaster
    const selectedDisasterId = selectedDetail.id;
    setSelectedDisasterId(selectedDisasterId);
    console.log("Selected Disaster ID:", selectedDisasterId); // Verify this is the correct ID
  };
  

  const toggleComplete = (id) => {
    const updatedToDos = toDoList.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setToDoList(updatedToDos);
  };

  // Handle the switch toggle
  const handleSaveToHistoryToggle = () => {
    setSaveToHistory(!saveToHistory);
  };

  // Handle the note input change
  const handleNoteChange = (event) => {
    setNote(event.target.value);
  };

  const handleSaveHistory = async () => {
    const csrfToken = Cookies.get("csrftoken");
  
    // Format the to-do list with X or O
    const formattedTodoList = toDoList
      .map((todo) => {
        return `${todo.completed ? "O" : "X"} ${todo.text}`;
      })
      .join("; ");
  
    const payload = {
      disaster_id: selectedDisasterId,  // Ensure this ID is correctly set
      todo_list: formattedTodoList,
      note: note,
    };
  
    try {
      const response = await axios.post(
        "http://localhost:8000/api/disaster_history/create", 
        payload,
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken,
          },
        }
      );
      console.log("Disaster history saved:", response.data);
    } catch (error) {
      console.error("Error saving disaster history:", error);
    }
  };
  
  
  return (
    <div className="disaster-container">
      <header className="header">
        <img src={logo_name} alt={logo_name} className="disaster-logo" />
        <MenuOutlinedIcon className="menu-icon" onClick={() => setMenuOpen(!menuOpen)} />
      </header>
      <main className="main-content">
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
  
        {/* Show the disaster ID for debugging */}
        <div className="disaster-id">
          <strong>Disaster ID: </strong>{selectedDisasterId}
        </div>
  
        {/* Switch for Save to history */}
        <div className="save-to-history-container">
          <label>Save to history</label>
          <Switch
            checked={saveToHistory}
            onChange={handleSaveToHistoryToggle}
            inputProps={{ 'aria-label': 'Save to history switch' }}
          />
        </div>
  
        {/* If the switch is on, show note and save button */}
        {saveToHistory && (
          <div>
            <textarea
              placeholder="Add a note"
              value={note}
              onChange={handleNoteChange}
              className="note-input"
            ></textarea>
            <button onClick={handleSaveHistory} className="save-btn">
              Save
            </button>
          </div>
        )}
  
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
      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} />}
      <div className={`slide-menu ${menuOpen ? "open" : ""}`}>
        <div className="top-rectangle">
          <img src={logo} alt="Logo" className="menu-logo" />
        </div>
        <button className="close-btn" onClick={() => setMenuOpen(false)}>
          ✕
        </button>
        <div className="menu-content">
          <div className="menu-item" onClick={() => navigate("/home")}>
            Home →
          </div>
          <div className="menu-item" onClick={() => navigate("/profile")}>
            Profile →
          </div>
          <button className="logout-btn" onClick={() => handleLogout()}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};  

export default Disaster;
