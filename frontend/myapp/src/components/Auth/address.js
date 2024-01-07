import React, { useState, useEffect } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import AddressModal from "./AddEditAddressModal";
import { fireCommand } from "../../services/commands/user";
import useError from "../common/useError";
import ErrorModal from "../common/ErrorModal";

const Address = () => {
  // State variables for managing the modal (show/hide, edit data, response)
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [addressResponse, setAddressResponse] = useState(null);
  const { error, showError, hideError, showErrorModal } = useError();

  // State for error handling
  useEffect(() => {
    // Function to fetch user addresses when the component mounts
    const fetchData = async () => {
      try {
        let data = await fireCommand("/userAddress/userAddresses", "get");
        if (data) setAddressResponse(data);
      } catch (error) {
        console.error("Error fetching profile details:", error);
        showError(
          error.response.data.error ||
            error.response.data.message ||
            error.response.data.msg ||
            ""
        );
      }
    };

    // Fetch data only once when the component mounts
    if (!addressResponse) {
      fetchData();
    }
  }, []);

  // Function to show the modal with data for editing
  const handleShowModal = (data) => {
    setEditData(data);
    setShowModal(true);
  };

  // Function to close the modal
  const handleCloseModal = () => {
    setEditData(null);
    setShowModal(false);
  };

  // Function to delete an address
  const onDelete = async (addressId) => {
    if (addressId < 0) {
      console.error("address id not found");
      return;
    }

    try {
      const success = await fireCommand(
        `/userAddress/addresses?address_id=${addressId}`,
        "delete"
      );
      if (success) {
        let data = await fireCommand("/userAddress/userAddresses", "get");
        if (data) setAddressResponse(data);
      }
    } catch (error) {
      // Handle error
      console.error("Error deleting address:", error);
      showError(
        error.response.data.error ||
          error.response.data.message ||
          error.response.data.msg ||
          ""
      );
    }
  };

  // Function to save or update an address
  const handleSaveAddress = async (p_address) => {
    let addressData = {
      street: p_address.street,
      city: p_address.city,
      state: p_address.state,
      zip_code: p_address.zipCode,
    };
    let command = "addAddress";
    let methodType = "post";

    if (editData) {
      command = `addresses?address_id=${p_address.addressId}`;
      methodType = "put";
    }

    try {
      const success = await fireCommand(
        `/userAddress/${command}`,
        methodType,
        addressData
      );
      if (success) {
        let data = await fireCommand("/userAddress/userAddresses", "get");
        if (data) setAddressResponse(data);
      }
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div>
       {/* Error modal for displaying errors */}
      <ErrorModal
        show={showErrorModal}
        onClose={hideError}
        errorMessage={error}
      />
      <Card>
        <Card.Body>
          <Card.Title>Addresses</Card.Title>
          <Row>
            <div>
              <Col
                md={12}
                className="d-flex justify-content-end align-items-start"
              >
                <Button
                  className="m-1"
                  variant="primary"
                  onClick={() => handleShowModal(null)}
                >
                  Add Address
                </Button>{" "}
              </Col>
            </div>
          </Row>

           {/* Display addresses or a message if no addresses are available */}
          
          {addressResponse && addressResponse.length > 0 ? (
            addressResponse.map((address, index) => (
              <Row key={index} className="mb-3">
                <Card>
                  <Card.Body>
                    <Card.Text>
                      <Col md="auto">
                        <div>
                          <p>street name: {address.street} </p>
                          <p>city: {address.city} </p>
                          <p>state: {address.state} </p>
                          <p>zip code: {address.zip_code}</p>
                        </div>
                      </Col>
                      <Col md="auto">
                        <div>
                          <Button
                            className="mx-3"
                            variant="secondary"
                            onClick={() => handleShowModal(address)}
                          >
                            Edit Address
                          </Button>

                          <Button
                            variant="danger"
                            onClick={() => onDelete(address.addressId)}
                          >
                            Delete
                          </Button>
                        </div>
                      </Col>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Row>
            ))
          ) : (
            <Row>
              <Card>
                <Card.Body>
                  <Card.Text>
                    <p>No addresses available</p>
                  </Card.Text>
                </Card.Body>
              </Card>
            </Row>
          )}
        </Card.Body>
      </Card>

      {/* Modal for adding/editing addresses */}
      <AddressModal
        show={showModal}
        handleClose={handleCloseModal}
        onSave={handleSaveAddress}
        editData={editData}
      />
    </div>
  );
};

export default Address;
