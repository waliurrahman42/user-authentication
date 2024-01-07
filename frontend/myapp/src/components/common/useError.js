import { useState } from "react";

const useError = () => {
  
  // State for holding the error message
  const [error, setError] = useState(null);
  
  // State for controlling the visibility of the error modal
  const [showErrorModal, setShowErrorModal] = useState(false);

  // Function to display an error by setting the error state and showing 
  const showError = (errorMessage) => {
    setError(errorMessage);
    setShowErrorModal(true);
  };

  // Function to hide the error by resetting the error state and hiding the error modal
  const hideError = () => {
    setError(null);
    setShowErrorModal(false);
  };

  return {
    error,
    showError,
    hideError,
    showErrorModal,
  };
};

export default useError;
