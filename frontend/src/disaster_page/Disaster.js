import React, { useState, useEffect } from "react";
import "./Disaster.css";
import logo_name from "../assets/logo_with_name.svg";
import axios from "axios";

const Disaster = () => {
  const [disasterOptions, setDisasterOptions] = useState(["Select Disaster"]);
  const [selectedDisaster, setSelectedDisaster] = useState("Select Disaster");
  const [disastersDetails, setDisastersDetails] = useState({
    name: "Select Disaster",
    description: "Select a disaster to view the details here.",
    tasks: "Select a disaster to view the actions here.",
  });
  const [selectedDisasterDetails, setSelectedDisasterDetails] = useState(
    "Select a disaster to view the details here."
  );
  const toDoLabels = ["Select a disaster to view the actions here."];
  const [toDoList, setToDoList] = useState(
    Array.from({ length: toDoLabels.length }, (_, index) => ({
      id: index,
      text: toDoLabels[index],
      completed: false,
    }))
  );

  useEffect(() => {
    handleGetDisasters();
  }, []);

  const handleGetDisasters = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/natural_disaster/"
      );

      console.log("Disasters fetched successfully:", response.data);

      const fetchedDisasterNames = ["Select Disaster"];
      const fetchedDisasters = [
        {
          name: "Select Disaster",
          description: "Select a disaster to view the details here.",
          tasks: "Select a disaster to view the actions here.",
        },
      ];
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
      console.log("fetched disaster names: ", fetchedDisasterNames);
      console.log("fetched disasters: ", fetchedDisasters);
      setDisasterOptions(fetchedDisasterNames);
      setDisastersDetails(fetchedDisasters);
    } catch (error) {
      console.error("Error fetching disasters:", error);
    }
  };

  const handleChange = (disaster) => {
    const select = disaster.target.value;
    setSelectedDisaster(select);
    const selectedDetail = disastersDetails.find(
      (event) => event.name === selectedDisaster
    );
    setSelectedDisasterDetails(
      selectedDetail ? selectedDetail.description : null
    );
    const toDos = selectedDetail ? selectedDetail.tasks.split(";") : null;
    
    console.log("tasks: ", toDos, typeof(toDos));
    console.log(toDos)
    setToDoList(
      Array.from({ length: toDos.length }, (_, index) => ({
        id: index,
        text: toDos[index],
        completed: false,
      }))
    );
    console.log("selected disaster after: ", selectedDisaster);
  };

  const initialToDos = Array.from(
    { length: toDoLabels.length },
    (_, index) => ({
      id: index,
      text: toDoLabels[index],
      completed: false,
    })
  );

  const toggleComplete = (id) => {
    const updatedToDos = toDoList.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setToDoList(updatedToDos);
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
            onClick={handleChange}
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
    </div>
  );
};

export default Disaster;
