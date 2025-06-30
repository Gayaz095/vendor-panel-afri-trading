//LoginPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useVendor } from "./VendorContext";
import "./componentsStyles/LoginPage.css";
import loginImage from "../assets/logo.png";
import {
  FaCarAlt,
  FaUserShield,
  FaLock,
  FaWhatsapp,
  FaPhone,
  FaEnvelope,
  FaHeadset,
} from "react-icons/fa";
import { vendorLogin } from "../utils/vendorLoginApi";
import { toast } from "react-toastify";

const LoginPage = () => {
  const { vendorDetails, setVendorDetails, isCheckingSession } = useVendor();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const hasRedirected = useRef(false);

  useEffect(() => {
    if (!isCheckingSession && vendorDetails && !hasRedirected.current) {
      hasRedirected.current = true;
      navigate("/dashboard");
    }
  }, [vendorDetails, isCheckingSession, navigate]);

  const validateInputs = () => {
    let isValid = true;
    const newErrors = { username: "", password: "" };

    if (!username.trim()) {
      newErrors.username = "Username is required";
      isValid = false;
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username) &&
      !/^[\d+]{10,15}$/.test(username)
    ) {
      newErrors.username = "Please enter a valid email or phone number";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (password.length < 5) {
      newErrors.password = "Password must be at least 5 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    setIsLoading(true);

    const payLoad = {
      emailOrPhone: username,
      password: password,
    };

    try {
      const response = await vendorLogin(payLoad);

      if (response?.token) {
        setVendorDetails(response);

        toast.success("Login successful! Redirecting...", {
          position: "top-right",
          autoClose: 1500,
          hideProgressBar: true,
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        throw new Error("Invalid login response");
      }
    } catch (error) {
      toast.error("Login failed. Please check your credentials", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
      });
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Waiting for session/localStorage check to complete before rendering
  if (isCheckingSession) return null;

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        {/* Left Side */}
        <div className="login-left">
          <div className="login-left-content">
            <div className="brand-section">
              <h2 className="welcome-header">
                Welcome to Afri-Trading.com Vendor Portal
              </h2>
              <div className="logo-container">
                <img
                  src={loginImage}
                  alt="Afri-Trading.com"
                  className="brand-logo"
                />
              </div>
              <h1 className="brand-title">
                <FaCarAlt className="brand-icon" />{" "}
                <span>Afri-Trading.com</span>
                <span className="brand-highlight"></span>
              </h1>
            </div>

            <div className="connect-with-us">
              <h3 className="connect-title">Connect With Us</h3>
              <div className="connect-items">
                <div className="connect-item">
                  <div className="connect-icon whatsapp">
                    <FaWhatsapp />
                  </div>
                  <div className="connect-details">
                    <span className="connect-label">WhatsApp:</span>
                    <a className="connect-link" href="https://wa.me/0123456789">
                      0123456789
                    </a>
                  </div>
                </div>
                <div className="connect-item">
                  <div className="connect-icon phone">
                    <FaPhone />
                  </div>
                  <div className="connect-details">
                    <span className="connect-label">Phone:</span>
                    <a className="connect-link" href="tel:+910123456789">
                      +91-0123456789
                    </a>
                  </div>
                </div>
                <div className="connect-item">
                  <div className="connect-icon email">
                    <FaEnvelope />
                  </div>
                  <div className="connect-details">
                    <span className="connect-label">Email Us:</span>
                    <a
                      className="connect-link"
                      href="mailto:contact@afri-trading.com">
                      contact@afri-trading.com
                    </a>
                  </div>
                </div>
                <div className="connect-item">
                  <div className="connect-icon support">
                    <FaHeadset />
                  </div>
                  <div className="connect-details">
                    <span className="connect-label">Support Hours:</span>
                    <span className="connect-info">Mon-Fri: 9AM-6PM</span>
                    <span className="connect-info">Sat: 10AM-4PM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="login-right">
          <div className="login-right-content">
            <div className="login-card">
              <h2 className="login-title">Vendor Sign In</h2>
              <form onSubmit={handleLogin} className="login-form">
                <div className="input-group">
                  <label htmlFor="username">
                    <FaUserShield /> Username (Email or Phone)
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter email or phone"
                  />
                  {errors.username && (
                    <div className="error-message">{errors.username}</div>
                  )}
                </div>

                <div className="input-group">
                  <label htmlFor="password">
                    <FaLock /> Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="login-password"
                  />
                  {errors.password && (
                    <div className="error-message">{errors.password}</div>
                  )}
                </div>

                <button
                  type="submit"
                  className={`login-button ${isLoading ? "loading" : ""}`}
                  disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="loading-spinner"></span>
                      <span className="loading-text">Signing In...</span>
                    </>
                  ) : (
                    "Sign In to Dashboard"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
