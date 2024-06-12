import React from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import toast from "react-hot-toast";

const DeleteUserModal = ({
  showDeleteModal,
  handleDeleteModalClose,
  userId,
  setUsers,
}) => {
  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/v1/user/delete/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      toast.success("User deleted successfully");
      handleDeleteModalClose();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  return (
    <>
      <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Delete User</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleDeleteModalClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteUserModal;
