import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./login_page/Login";
import Landing from "./landing_page/landing.js";
import HomePage from "./home_page/Home.js";
import Profile from "./profile_page/Profile.js"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<HomePage/>}/>
        <Route path ="/profile" element={<Profile/>}/>
      </Routes>
    </Router>
  );
};
export default App;
