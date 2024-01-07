import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import ErrorModal from "../common/ErrorModal";
import useError from "../common/useError";
import { logout } from "../../services/commands/auth";

const Logout = () => {
  const navigate = useNavigate();
  const { error, showError, hideError, showErrorModal } = useError();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/Login");
    } catch (error) {
      showError(error.response.data.error || error.response.data.message || error.response.data.msg || '');
    }
  };

  return (
    <div>
      <ErrorModal
        show={showErrorModal}
        onClose={hideError}
        errorMessage={error}
      />
      <Button variant="danger"  onClick={() => handleLogout()}>
        Logout
      </Button>
    </div>
  );
};

export default Logout;
