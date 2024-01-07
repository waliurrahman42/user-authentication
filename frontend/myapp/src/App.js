// App.js
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Index from "./components/Auth/Index";
import PrivateRoute from "./services/PrivateRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route with PrivateRoute as a protected route */}
        <Route exact path="/" element={<PrivateRoute />}>
          <Route exact path="/index" element={<Index />} />
        </Route>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
};

export default App;
