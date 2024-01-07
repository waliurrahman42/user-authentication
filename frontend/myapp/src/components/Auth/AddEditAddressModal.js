import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const AddEditAddressModal = ({ show, handleClose, onSave, editData }) => {
  // State variables to manage form fields
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");

  useEffect(() => {
    // Set the initial values for the fields when in edit mode
    if (editData) {
      setStreet(editData.street || "");
      setCity(editData.city || "");
      setState(editData.state || "");
      setZipCode(editData.zip_code || "");
    } else {
      // Clear the fields when adding a new address
      setStreet("");
      setCity("");
      setState("");
      setZipCode("");
    }
  }, [editData]);

  // Function to handle saving the address
  const handleSave = () => {
    // Call the onSave callback with the current field values
    onSave({
      street,
      city,
      state,
      zipCode,
      addressId: editData?.addressId,
    });
    handleClose(); // Close the modal after saving
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{editData ? "Edit Address" : "Add Address"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formStreet">
            <Form.Label>Street</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter street"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formCity">
            <Form.Label>City</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formState">
            <Form.Label>State</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter state"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formZipCode">
            <Form.Label>ZIP Code</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter ZIP code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        {/* Buttons to close the modal and save the address */}
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Address
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditAddressModal;
