import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import axios from "axios";
import Cookies from "js-cookie";
import "./Register.css";
import logo from "../assets/logo.svg";

const Register = () => {
  const initialValues = {
    username: "",
    email: "",
    password: "",
    password2: "", // Change 'confirmPassword' to 'password2' to match the backend
  };

  const navigate = useNavigate();

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters")
      .required("Username is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    password2: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const csrfToken = Cookies.get("csrftoken");

      const response = await axios.post(
        "http://localhost:8000/api/register/", // Ensure this is the correct endpoint for registration
        {
          username: values.username,
          email: values.email,
          password: values.password,
          password2: values.password2, // Pass the confirmation password as 'password2'
        },
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrfToken || "", // CSRF protection
          },
        }
      );

      if (response.status === 201) {
        alert("Registration successful! Please log in.");
        navigate("/login"); // Redirect to login page after successful registration
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors({ email: error.response.data.detail || "An error occurred during registration." });
      } else {
        alert("An error occurred during registration.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="main-register-container">
      <div className="registration-container">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="registration-form">
              <div className="register-header">
                <img src={logo} alt={logo} className="register-logo" />
                <h1 className="register-title">StaySafe</h1>
              </div>

              <div className="register-form-group">
                <label htmlFor="username">Username</label>
                <Field
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Username"
                />
                <ErrorMessage
                  name="username"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="register-form-group">
                <label htmlFor="email">Email address</label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="user@example.com"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="register-form-group">
                <label htmlFor="password">Password</label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error-message"
                />
              </div>

              <div className="register-form-group">
                <label htmlFor="password2">Confirm password</label>
                <Field
                  type="password"
                  id="password2"
                  name="password2" // This is now 'password2' to match the API request
                  placeholder="Confirm password"
                />
                <ErrorMessage
                  name="password2"
                  component="div"
                  className="error-message"
                />
              </div>

              <button
                type="submit"
                className="register-button"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Registering..." : "Register"}
              </button>
              <p className="login-link">
                Already have an account? <a href="/login">Log in</a>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Register;
