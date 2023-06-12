import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import RedirectToLogin from "./components/RedirectToLogin";
import { Provider } from "react-redux";
import store from "./store/store";

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="*" element={<RedirectToLogin />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
