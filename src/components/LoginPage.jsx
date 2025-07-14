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
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { vendorLogin } from "../utils/vendorLoginApi";
import { toast } from "react-toastify";

const LoginPage = () => {
  const { vendorDetails, setVendorDetails, isCheckingSession } = useVendor();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      newErrors.password = "Please enter a valid password";
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

        toast.success("Login successful!", {
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

  if (isCheckingSession) return null;

  return (
    <div className="loginpage-wrapper">
      <div className="loginpage-container">
        {/* Left Side */}
        <div className="loginpage-left">
          <div className="loginpage-left-content">
            <div className="loginpage-brand-section">
              <h2 className="loginpage-welcome-header animated-fadein">
                Welcome to Afri-Trading.com Vendor Portal
              </h2>
              <div className="loginpage-logo-container">
                <img
                  src={loginImage}
                  alt="Afri-Trading.com"
                  className="loginpage-brand-logo"
                />
              </div>
              <h1 className="loginpage-brand-title">
                <span className="loginpage-typewriter">Afri-Trading.com</span>
                <span className="loginpage-brand-highlight"></span>
              </h1>
            </div>

            <div className="loginpage-connect-with-us">
              <h3 className="loginpage-connect-title">Connect With Us</h3>
              <div className="loginpage-connect-items">
                <div className="loginpage-connect-item">
                  <div className="loginpage-connect-icon loginpage-whatsapp">
                    <FaWhatsapp />
                  </div>
                  <div className="loginpage-connect-details">
                    <span className="loginpage-connect-label">WhatsApp:</span>
                    <a
                      className="loginpage-connect-link"
                      href="https://wa.me/8121927536">
                      +91-8121927536
                    </a>
                  </div>
                </div>
                <div className="loginpage-connect-item">
                  <div className="loginpage-connect-icon loginpage-phone">
                    <FaPhone />
                  </div>
                  <div className="loginpage-connect-details">
                    <span className="loginpage-connect-label">Phone:</span>
                    <a
                      className="loginpage-connect-link"
                      href="tel:+91-8121927536">
                      +91-8121927536
                    </a>
                  </div>
                </div>
                <div className="loginpage-connect-item">
                  <div className="loginpage-connect-icon loginpage-email">
                    <FaEnvelope />
                  </div>
                  <div className="loginpage-connect-details">
                    <span className="loginpage-connect-label">Email Us:</span>
                    <a
                      className="loginpage-connect-link"
                      href="mailto:contact@afri-trading.com">
                      contact@afri-trading.com
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="loginpage-right">
          <div className="loginpage-right-content">
            <div className="loginpage-card">
              <h2 className="loginpage-title">Vendor Sign In</h2>
              <form onSubmit={handleLogin} className="loginpage-form">
                <div className="loginpage-input-group ">
                  <label htmlFor="username">
                    <FaUserShield /> Username (Email or Phone)
                  </label>
                  <input
                    type="text"
                    id="username"
                    autocomplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter email or phone"
                    className="loginpage-username"
                  />
                  {errors.username && (
                    <div className="loginpage-error-message">
                      {errors.username}
                    </div>
                  )}
                </div>

                <div className="loginpage-input-group loginpage-password-group">
                  <label htmlFor="password">
                    <FaLock /> Password
                  </label>
                  <div className="loginpage-password-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      autocomplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="loginpage-password"
                    />
                    <span
                      className="loginpage-toggle-password-icon"
                      onClick={() => setShowPassword((prev) => !prev)}
                      autoComplete="current-password"
                      aria-label="Toggle password visibility">
                      {showPassword ? <FaEye /> : <FaEyeSlash />}
                    </span>
                  </div>
                  {errors.password && (
                    <div className="loginpage-error-message">
                      {errors.password}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className={`loginpage-button${
                    isLoading ? " loginpage-loading" : ""
                  }`}
                  disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <span className="loginpage-loading-spinner"></span>
                      <span className="loginpage-loading-text">
                        Signing In...
                      </span>
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
