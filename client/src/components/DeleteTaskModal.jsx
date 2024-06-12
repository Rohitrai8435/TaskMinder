import React from "react";
import { Button, Modal } from "react-bootstrap";
import toast from "react-hot-toast";
import axios from "axios";

const DeleteTaskModal = ({
  showDeleteModal,
  handleDeleteModalClose,
  taskId,
  setTasks,
}) => {
  const handleDeleteTask = async () => {
    try {
      const res = await axios.delete(
        `http://localhost:4000/api/v1/task/delete/${taskId}`,
        {
          withCredentials: true,
        }
      );
      toast.success(res.data.message);
      setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
      handleDeleteModalClose();
    } catch (error) {
      toast.error("Failed to delete task");
    }
  };

  return (
    <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this task?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleDeleteModalClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDeleteTask}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteTaskModal;
