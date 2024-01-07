import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../../services/commands/auth";

const AppNavbar = ({ onButtonClick }) => {
  const navigate = useNavigate();

  // Handle logout action
  const handleLogout = async () => {
    try {
      await logout();
      // Navigate to the login page upon successful logout
      navigate("/Login");
    } catch (error) {
      // showError(
      //   error.response.data.error ||
      //     error.response.data.message ||
      //     error.response.data.msg ||
      //     ""
      // );
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="sm" className="p-0">
      <div className="container">
        <Navbar.Brand as={Link}>Users Panel</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarCollapse" />
        <Navbar.Collapse
          id="navbarCollapse"
          className="d-flex justify-content-center"
        >
          <Nav className="ml-auto">
            <NavDropdown
              title={
                <>
                  <i className="fas fa-user"></i> Welcome
                </>
              }
            >
              <NavDropdown.Item onClick={() => onButtonClick("profile")}>
                <i className="fas fa-user-circle"></i> Profile
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => onButtonClick("dashboard")}>
                <i className="fas fa-tachometer-alt"></i> Dashboard
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Item>
              <Nav.Link as={Link} onClick={handleLogout}>
                <i className="fas fa-user-times"></i> Logout
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default AppNavbar;
