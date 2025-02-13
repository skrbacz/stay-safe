import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./login_page/Login";
import Landing from "./landing_page/landing.js";
import HomePage from "./home_page/Home.js";
import Disaster from "./disaster_page/Disaster.js";
import Register from "./register_page/Register.js";
import Profile from "./profile_page/Profile.js"
import ProtectedRoute from "./authorization/ProtectedRoute.js";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path= "register" element= {<Register/>}/>
        <Route path="/home" element={<ProtectedRoute><HomePage/></ProtectedRoute>}/>
        <Route path= "/disaster" element={<ProtectedRoute><Disaster/></ProtectedRoute>}/>
        <Route path ="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
      </Routes>
    </Router>
  );
};
export default App;
