import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./login_page/Login";
import Landing from "./landing_page/landing.js";
import HomePage from "./home_page/Home.js";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomePage/>}/>
      </Routes>
    </Router>
  );
};
export default App;
