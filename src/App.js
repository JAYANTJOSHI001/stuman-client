import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import Navbar from "./components/Navbar";
import AppRoutes from "./router/AppRoutes";
import "./styles/global.css";


function App() {
  return (
    <Router>
      <Navbar />
      <div className="px-4 py-2 bg-gray-100 dark:bg-gray-900 min-h-screen">
        <AppRoutes />
      </div>
    </Router>
  );
}

export default App;