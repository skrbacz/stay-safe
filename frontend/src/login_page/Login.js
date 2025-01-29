import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "./Login.css";
import logo_with_name from "../assets/logo_with_name.svg";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
}

const Login = () => {
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const csrfToken = getCookie("csrftoken");

      const response = await axios.post(
        "http://localhost:8000/api/login/",
        {
          email: values.email,
          password: values.password,
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken || "",
          },
        }
      );

      if (response.status === 200) {
        alert("Login successful!");
        navigate("/home");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ email: "Incorrect email or password" });
      } else {
        alert("An error occurred during login.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="main-login-container">
      <div className="login-container">
        <div className="login-header">
          <img src={logo_with_name} alt="StaySafe Logo" className="login-logo" />
        </div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="hello@example.com"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-field">
                  <Field
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Password"
                  />
                  <span
                    className="toggle-password"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <RemoveRedEyeIcon /> : <VisibilityOutlinedIcon />}
                  </span>
                </div>
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message"
                />
              </div>

              <button
                type="submit"
                className="login-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Log in"}
              </button>
              <p className="register-link">
                Don't have an account? <a href="/register">Register</a>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
