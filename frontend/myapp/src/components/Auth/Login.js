import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { useForm } from "react-hook-form";
import ErrorModal from "../common/ErrorModal";
import useError from "../common/useError";
import { login } from "../../services/commands/auth";
import ForgotPassword_Modal from "./forgotPasswordModal";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  // Custom hook for handling errors
  const { error, showError, hideError, showErrorModal } = useError();
  // State for controlling the visibility of the forgot password modal
  const [showResetPassModal, setShowResetPassModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const Lrequired = {
    value: true,
    message: "Required",
  };

  // Handle login form submission
  const handleLogin = async (p_data) => {
    try {
      const success = await login(p_data);
      // If login is successful, navigate to the index page
      if (success) navigate("/index");
      else showError("Some thing wents wrong");
    } catch (error) {
      showError(
        error.response.data.error ||
          error.response.data.message ||
          error.response.data.msg ||
          ""
      );
    }
  };

  return (
    <div>
      <Header />
      <Container className="mt-5">
        <ErrorModal
          show={showErrorModal}
          onClose={hideError}
          errorMessage={error}
        />
        <div className="col-md-6 mx-auto">
          <Card>
            <Card.Header>
              <h4>Account Login</h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit(handleLogin)}>
                <Form.Group controlId="formBasicUsername">
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    {...register("username", {
                      required: Lrequired,
                    })}
                  />
                  {errors.username && (
                    <p style={{ color: "red" }}>
                      <small>{errors.username?.message}</small>
                    </p>
                  )}
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    {...register("password", {
                      required: Lrequired,
                    })}
                  />
                  {errors.password && (
                    <p style={{ color: "red" }}>
                      <small>{errors.password?.message}</small>
                    </p>
                  )}
                </Form.Group>
                <div className="mt-3 d-flex justify-content-center">
                  <Button variant="primary" type="submit" block>
                    Login
                  </Button>
                </div>
              </Form>
              <p className="mt-3 d-flex justify-content-center">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
              <p className="mt-3 d-flex justify-content-center">
                Forgot Password?{" "}
                <a href="#" onClick={() => setShowResetPassModal(true)}>
                  Reset
                </a>
              </p>
            </Card.Body>
          </Card>
          <ForgotPassword_Modal
            showModal={showResetPassModal}
            onClose={() => setShowResetPassModal(false)}
          />
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Login;
