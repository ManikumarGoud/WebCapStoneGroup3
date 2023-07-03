import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Login from "./components/Login";
import Products from "./components/Products";
import Register from "./components/Register";
import RedirectToLogin from "./components/RedirectToLogin";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "./store/store";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <ToastContainer />
        <Header />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="*" element={<RedirectToLogin />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
