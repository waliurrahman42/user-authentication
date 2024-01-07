import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Alert } from "react-bootstrap";
import { forgot_passwordCommand } from "../../services/commands/forgotPassword";

const ForgotPassword_Modal = ({ showModal, onClose }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [sendOtpResponse, setSendOtpResponse] = useState(null);
  const [otpVerified, setOtpVerified] = useState(false);
  const [error, setError] = useState(null);

  // Reset state variables when the modal is closed
  const resetState = () => {
    setEmail("");
    setOtp("");
    setPassword("");
    setSendOtpResponse(null);
    setOtpVerified(false);
    setError(null);
  };

  useEffect(() => {
    // Reset state when showModal changes
    if (!showModal) {
      resetState();
    }
  }, [showModal]);

  // Function to handle OTP validation
  const handleSendOtp = async () => {
    // Validate email
    if (email.trim() === "") {
      setError("Please enter a valid email");
      return;
    }

    try {
      const success = await forgot_passwordCommand("/auth/forgot_password", {
        email: email,
      });
      setSendOtpResponse(success);
      setError(null);
    } catch (error) {
      setError(
        error.response.data.error ||
          error.response.data.message ||
          error.response.data.msg
      );
    }
  };

  // Validate OTP
  const handleValidateOtp = async () => {
    // Validate OTP
    if (otp.trim() === "" || otp.length !== 6) {
      setError("Please enter a valid verification code");
      return;
    }

    try {
      const success = await forgot_passwordCommand("/auth/verifyOtp", {
        otp: otp,
      });
      setOtpVerified(success.success);
      setSendOtpResponse(null);
      setError(null);
    } catch (error) {
      setError(
        error.response.data.error ||
          error.response.data.message ||
          error.response.data.msg
      );
    }
  };

  // Function to handle password update
  const handleUpdatePassword = async () => {
    if (password.trim() === "") {
      setError("Please enter a valid password");
      return;
    }

    try {
      const success = await forgot_passwordCommand("/user/updatePassword", {
        newPassword: password,
        email: email,
      });

      if (success.success === true) {
        onClose();
      } else {
        setError("Password update failed");
      }
    } catch (error) {
      setError(
        error.response.data.error ||
          error.response.data.message ||
          error.response.data.msg
      );
    }
  };

  return (
    <Modal
      show={showModal}
      onHide={() => {
        onClose();
        resetState();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Reset Password</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error ? (
          <Alert
            variant="danger"
            onClose={() => {
              setError(null);
            }}
            dismissible
          >
            <p>{error}</p>
          </Alert>
        ) : null}
        <Form>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={sendOtpResponse?.success}
            />
          </Form.Group>

          {sendOtpResponse?.success && (
            <Form.Group controlId="formBasicOTP" className="d-flex">
              <div>
                <Form.Label>Enter Verification Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
              </div>
              <div className="m-4 justify-content-end">
                <Button
                  variant="primary"
                  onClick={handleValidateOtp}
                  disabled={!otp}
                >
                  Validate Code
                </Button>
              </div>
            </Form.Group>
          )}
          {otpVerified && (
            <Form.Group controlId="Password">
              <div>
                <Form.Label>Enter New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </Form.Group>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            onClose();
            resetState();
          }}
        >
          Close
        </Button>
        {otpVerified ? (
          <Button variant="success" onClick={handleUpdatePassword}>
            Update Password
          </Button>
        ) : (
          <Button variant="primary" onClick={handleSendOtp}>
            {sendOtpResponse?.success
              ? "Resend Verification Code"
              : "Send Verification Code"}
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default ForgotPassword_Modal;
