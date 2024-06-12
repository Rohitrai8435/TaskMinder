import React, { useState } from "react";
import { Button, Modal, Stack } from "react-bootstrap";
import axios from "axios";
import toast from "react-hot-toast";

const CreateUserModal = ({
  showCreateModal,
  handleCreateModalClose,
  setUsers,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleCreateUser = async () => {
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/user/register",
        {
          name,
          email,
          password,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success("User created successfully");
      setUsers((prevUsers) => [...prevUsers, res.data.user]);
      setName("");
      setEmail("");
      setPassword("");
      handleCreateModalClose();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <Modal show={showCreateModal} onHide={handleCreateModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Stack gap={3}>
            <label>Name</label>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Stack>
          <br />
          <Stack gap={3}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Stack>
          <br />
          <Stack gap={3}>
            <label>Password</label>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Stack>
          <br />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCreateModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCreateUser}>
            Create
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateUserModal;
