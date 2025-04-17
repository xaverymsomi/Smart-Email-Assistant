import React from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EmailForm from "./components/EmailForm";

import EmailHistory from "./components/EmailHistory";

function App() {
  return (
    <div className="App">
      <h1>💼 Smart Email Assistant</h1>
      <EmailForm />
      <EmailHistory />
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}


export default App;
