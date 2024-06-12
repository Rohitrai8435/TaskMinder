import React, { useState, useEffect } from "react";
import { Button, Modal, Stack } from "react-bootstrap";
import axios from "axios";
import toast from "react-hot-toast";

const ViewUserModal = ({ showViewModal, handleViewModalClose, id }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (id && showViewModal) {
      // Fetch user details when the modal is shown
      const fetchUser = async () => {
        try {
          const res = await axios.get(
            `http://localhost:4000/api/v1/user/singleuser/${id}`
          );
          setUser(res.data.user);
        } catch (error) {
          toast.error("Failed to fetch user details");
        }
      };

      fetchUser();
    }
  }, [id, showViewModal]);

  return (
    <Modal show={showViewModal} onHide={handleViewModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>View User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {user ? (
          <Stack gap={3}>
            <div>
              <strong>Name:</strong> {user.name}
            </div>
            <div>
              <strong>Email:</strong> {user.email}
            </div>

            <div>
              <strong>Created At:</strong>{" "}
              {new Date(user.createdAt).toLocaleString()}
            </div>
          </Stack>
        ) : (
          <div>Loading...</div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleViewModalClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ViewUserModal;
