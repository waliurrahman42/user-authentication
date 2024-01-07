import React, { useState } from "react";
import { Link } from "react-router-dom";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { Container, Form, Button, Alert, Card } from "react-bootstrap";
import { useForm } from "react-hook-form";
import ErrorModal from "../common/ErrorModal";
import useError from "../common/useError";
import { registerUser } from "../../services/commands/user";

const Register = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm();
   // Custom hook for handling errors
  const { error, showError, hideError, showErrorModal } = useError();

   // State for server response and success alert
  const [serverResponse, setServerResponse] = useState({});
  const [showAlert, setShowAlert] = useState(false);

  // Watch password for password confirmation
  const Lpassword = watch("password", "");

  // Validation rule for required fields
  const Lrequired = { value: true, message: "Required" };

  // Handle registration form submission
  const handleRegister = async (p_data) => {
    try {
      // Attempt to register user
      const successResponse = await registerUser(p_data);
      // Update state with server response
      setServerResponse(successResponse);
       // Reset form
      reset();
      setShowAlert(true);
    } catch (error) {
      // Show error modal in case of registration failure
      showError(error.response.data.error || error.response.data.message || error.response.data.msg);
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
        {showAlert ? (
          <>
            <Alert
              variant="success"
              onClose={() => {
                setShowAlert(false);
              }}
              dismissible
            >
              <p>{serverResponse.message}</p>
            </Alert>
          </>
        ) : null}
        <div class="col-md-6 mx-auto">
          <Card>
            <Card.Header>
              <h4>Account Registration</h4>
            </Card.Header>
            <Card.Body>
              <Form class="mx-3">
                <Form.Group controlId="formUsername">
                  <Form.Label>Username:</Form.Label>
                  <Form.Control
                    type="text"
                    {...register("username", {
                      required: Lrequired,
                      maxLength: {
                        value: 25,
                        message: "Max characters should be 25",
                      },
                    })}
                  />
                  {errors.username && (
                    <p style={{ color: "red" }}>
                      <small>{errors.username?.message}</small>
                    </p>
                  )}
                </Form.Group>
                <Form.Group controlId="formEmail">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    {...register("email", {
                      required: Lrequired,
                      maxLength: {
                        value: 80,
                        message: "Max characters should be 80",
                      },
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    })}
                  />
                  {errors.email && (
                    <p style={{ color: "red" }}>
                      <small>{errors.email?.message}</small>
                    </p>
                  )}
                </Form.Group>
                <Form.Group controlId="formPassword">
                  <Form.Label>Password:</Form.Label>
                  <Form.Control
                    type="password"
                    {...register("password", {
                      required: Lrequired,
                      minLength: {
                        value: 3,
                        message: "Min characters should be 3",
                      },
                    })}
                  />
                  {errors.password && (
                    <p style={{ color: "red" }}>
                      <small>{errors.password?.message}</small>
                    </p>
                  )}
                </Form.Group>
                <Form.Group controlId="formConfirmPassword">
                  <Form.Label>Confirm Password:</Form.Label>
                  <Form.Control
                    type="password"
                    {...register("confirmPassword", {
                      required: Lrequired,
                      validate: (value) =>
                        value === Lpassword || "Passwords do not match",
                    })}
                  />
                  {errors.confirmPassword && (
                    <p style={{ color: "red" }}>
                      <small>{errors.confirmPassword?.message}</small>
                    </p>
                  )}
                </Form.Group>

                <div className="mt-3 d-flex justify-content-end">
                  <Button
                    variant="primary"
                    type="button"
                    onClick={handleSubmit(handleRegister)}
                  >
                    Register
                  </Button>
                </div>
                <p>
                  Already have an account? <Link to="/login">Login</Link>
                </p>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </Container>
      <Footer />
    </div>
  );
};

export default Register;
