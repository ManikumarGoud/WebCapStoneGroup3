import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { FirebaseAppProvider } from "reactfire";
import { initializeApp } from "firebase/app";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/common.css";

const root = createRoot(document.getElementById("root"));
// const firebaseConfig = {
//   apiKey: "AIzaSyBmnvQEDqeQGKnk0PqkyWXNCrr905FR-os",
//   authDomain: "react-firebase-f9ed9.firebaseapp.com",
//   projectId: "react-firebase-f9ed9",
//   storageBucket: "react-firebase-f9ed9.appspot.com",
//   messagingSenderId: "788405322236",
//   appId: "1:788405322236:web:e593f5a5b7732544367279",
// };
const firebaseConfig = {
  apiKey: "AIzaSyC62qNTJSaYWyThfEibZAANF_D-1l3gD_M",
  authDomain: "reactfire-f8683.firebaseapp.com",
  projectId: "reactfire-f8683",
  storageBucket: "reactfire-f8683.appspot.com",
  messagingSenderId: "1040551168430",
  appId: "1:1040551168430:web:b8e2e50b6436e1adab203f"
};
initializeApp(firebaseConfig);
root.render(
  <React.StrictMode>
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <App />
    </FirebaseAppProvider>
  </React.StrictMode>
);
