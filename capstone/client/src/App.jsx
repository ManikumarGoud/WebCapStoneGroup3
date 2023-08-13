import React from "react";
import { getFirestore } from "firebase/firestore";
import {
  FirestoreProvider,
  useFirebaseApp,
  AuthProvider,
  DatabaseProvider,
} from "reactfire";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
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
import Footer from "./components/Footer";
import PersonalProfile from "./components/Profile";
import ProductDetails from "./components/ProductDetails";
import Chat from "./components/ChatDetails/Chat";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";

const App = () => {
  const app = useFirebaseApp();
  const firestoreInstance = getFirestore(app);
  const database = getDatabase(app);
  const auth = getAuth(app);

  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <AuthProvider sdk={auth}>
        <DatabaseProvider sdk={database}>
          <Provider store={store}>
            <Router>
              <ToastContainer />
              <Header />
              <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/profile" element={<PersonalProfile />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/" element={<Home />} />
                <Route exact path="/chat" element={<Chat />} />
                <Route exact path="/cart" element={<Cart />} />
                <Route exact path="/checkout" element={<Checkout />} />
                <Route path="*" element={<RedirectToLogin />} />
              </Routes>
              <Footer />
            </Router>
          </Provider>
        </DatabaseProvider>
      </AuthProvider>
    </FirestoreProvider>
  );
};

export default App;
