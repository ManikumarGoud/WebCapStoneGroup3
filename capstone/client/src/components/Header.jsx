import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../store/slice/AuthSlice";
import axiosInstance from "../utils/axiosConfig";
import { useFirebaseApp, useSigninCheck } from "reactfire";
import "firebase/compat/auth";
import { getAuth } from "firebase/auth";

const Header = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const firebaseApp = useFirebaseApp();

  const navbarStyle = {
    backgroundColor: "#5bcee7e0",
    color: "#FFFFFF",
  };

  const handleLogout = () => {
    axiosInstance
      .get("/logout")
      .then((resp) => {
        if (typeof resp.data === "boolean") {
          dispatch(logout());
          const auth = getAuth(firebaseApp);
          auth.signOut();
          navigate("/login");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Navbar style={navbarStyle} expand="lg" className="px-3">
      <Navbar.Brand as={Link} to="/">
        Shopping Cart
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="w-100 ml-auto justify-content-end">
          {isLoggedIn ? (
            <>
              <Nav.Link
                as={Link}
                to="/products"
                active={location.pathname === "/products"}
              >
                My Products
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/profile"
                active={location.pathname === "/profile"}
              >
                Profile
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/chat"
                active={location.pathname === "/chat"}
              >
                Chat
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/cart"
                active={location.pathname === "/cart"}
              >
                Cart
              </Nav.Link>
              <Nav.Link as={Link} to="/login" onClick={handleLogout}>
                Logout
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link
                as={Link}
                to="/register"
                active={location.pathname === "/register"}
              >
                Register
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/login"
                active={location.pathname === "/login"}
              >
                Login
              </Nav.Link>
            </>
          )}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Header;
