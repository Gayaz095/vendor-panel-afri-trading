//LogoutPage.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LogoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If accessed directly, redirect back to the previous page
    navigate(location.state?.from || "/dashboard", {
      replace: true,
    });
  }, [navigate, location]);

  // No visible rendering
  return null;
};

export default LogoutPage;
