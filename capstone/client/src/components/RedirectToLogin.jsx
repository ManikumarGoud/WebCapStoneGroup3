import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectToLogin = () => {
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/auth").then((resp) => {
      if (resp.data) {
        navigate("/");
      } else {
        navigate("/login");
      }
    });
  }, [navigate]);

  return null;
};

export default RedirectToLogin;
