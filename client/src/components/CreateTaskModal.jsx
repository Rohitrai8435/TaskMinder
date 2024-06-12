import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Modal, Stack } from "react-bootstrap";
import toast from "react-hot-toast";

const CreateTaskModal = ({
  showCreateModal,
  handleCreateModalClose,
  setTasks,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [user, setUser] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (showCreateModal) {
      // Fetch the list of users when the modal is shown
      axios
        .get("http://localhost:4000/api/v1/user/alluser", {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          setUsers(res.data.users);
        })
        .catch((error) => {
          toast.error("Failed to fetch users");
        });
    }
  }, [showCreateModal]);

  const handleCreateTask = async () => {
    await axios
      .post(
        "http://localhost:4000/api/v1/task/post",
        { title, description, priority, user, dueDate },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        setTasks((prevTasks) => [...prevTasks, res.data.task]);
        setTitle("");
        setDescription("");
        setPriority("");
        setUser("");
        setDueDate("");
        handleCreateModalClose();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <>
      <Modal show={showCreateModal} onHide={handleCreateModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack gap={3}>
            <label>Title</label>
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Stack>
          <br />
          <Stack gap={3}>
            <label>Description</label>
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Stack>
          <br />
          <Stack gap={3}>
            <label>Due Date</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </Stack>
          <br />
          <Stack gap={3}>
            <label>Assign To</label>
            <select value={user} onChange={(e) => setUser(e.target.value)}>
              <option value="">Select User</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>
          </Stack>
          <br />
          <Stack gap={3}>
            <label>Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="">Select Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </Stack>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCreateModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateTask}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateTaskModal;
