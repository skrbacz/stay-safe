import React, { useState } from "react";
import "./Disaster.css";
import logo_name from "../assets/logo_with_name.svg";

const Disaster = () => {
  const [disasterDetails, setDisasterDetails] =useState("Select a disaster to view the details here.");
  const [toDoLabels, setToDoLabels] = useState(["Select a disaster to view the actions here."]);
  
  const initialToDos = Array.from({ length: toDoLabels.length }, (_, index) => ({
    id: index,
    text: toDoLabels[index],
    completed: false,
  }));

  const [toDoList, setToDoList] = useState(initialToDos);

  const toggleComplete = (id) => {
    const updatedToDos = toDoList.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setToDoList(updatedToDos);
  };

  const disasterOptions = ["Select Disaster", "Earthquake", "Flood", "Hurricane", "Tornado", "Wildfire"];

  const [selectedDisaster, setSelectedDisaster] = useState("Select Disaster");

  const handleChange = (event) => {
    setSelectedDisaster(event.target.value);
  };

  return (
    <div className="disaster-container">
      <header className="header">
        <img src={logo_name} alt={logo_name} className="disaster-logo" />
        <div className="menu-icon">☰</div>
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
        <div className="description-box">{disasterDetails}</div>
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
    </div>
  );
};

export default Disaster;