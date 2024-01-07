import React, { useState } from "react";
import Navbar from "../common/Navbar";
import Footer from "../common/Footer";
import Profile from "./profile";
import Dashboard from "./dashboard";
import { Container, Row, Col } from "react-bootstrap";

const Index = () => {
  // State to manage the active component (profile or dashboard)
  const [activeComponent, setActiveComponent] = useState("dashboard");

  // Function to handle component change based on button click in the Navbar
  const handleComponentChange = (component) => {
    setActiveComponent(component);
  };

  return (
    <div>
      {/* Navbar component with a callback function to handle button clicks */}
      <Navbar onButtonClick={handleComponentChange} />

      <Container className="mt-4">
        <Row>
          <Col md={12}>
            {activeComponent === "profile" && <Profile />}
            {activeComponent === "dashboard" && <Dashboard />}
          </Col>
        </Row>
      </Container>

      <Footer />
    </div>
  );
};

export default Index;
