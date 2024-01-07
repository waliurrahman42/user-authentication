import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Logout from "./Logout";
import { getProfileDetails } from "../../services/commands/user";
import Address from "./address";
import useError from "../common/useError";
import ErrorModal from "../common/ErrorModal";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [showAddress, setShowAddress] = useState(false);
  const { error, showError, hideError, showErrorModal } = useError();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProfileDetails();
        setProfileData(data.userData);
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
    if (!profileData) {
      fetchData();
    }
  }, [profileData]);

  const handleAddressSection = () => {
    setShowAddress(!showAddress);
  };

  return (
    <Container className="mt-3">
      <ErrorModal
        show={showErrorModal}
        onClose={hideError}
        errorMessage={error}
      />
      <Row>
        <Col>
          <Card className="h-80">
            <Card.Body>
              <Row>
                <Col xl={12} lg={12} md={12} sm={12} xs={12}>
                  <h6 className="mb-2 text-primary">Admin Details</h6>
                </Col>

                <Col xl={6} lg={6} md={6} sm={6} xs={12}>
                  {profileData ? (
                    <div>
                      <p>Username: {profileData.username}</p>
                      <p>Email: {profileData.email}</p>
                    </div>
                  ) : (
                    <p>Loading profile...</p>
                  )}
                </Col>
              </Row>
            </Card.Body>
            <Row>
              <Col className="m-3 d-flex justify-content-end align-items-start">
                <div className="mx-3">
                  <Button
                    variant="primary"
                    onClick={() => handleAddressSection()}
                  >
                    Address
                  </Button>
                </div>
                <div className="justify-content-end">
                  <Logout />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4">{showAddress && <Address />}</Row>
    </Container>
  );
};

export default Profile;
