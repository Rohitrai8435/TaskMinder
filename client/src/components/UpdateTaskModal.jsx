import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Modal, Stack } from "react-bootstrap";
import toast from "react-hot-toast";

const UpdateTaskModal = ({
  showUpdateModal,
  handleUpdateModalClose,
  id,
  setTasks,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("");
  const [user, setUser] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/v1/user/alluser",
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        setUsers(res.data.users);
      } catch (error) {
        toast.error("Failed to fetch users");
      }
    };

    const fetchTask = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/v1/task/single/${id}`,
          {
            withCredentials: true,
          }
        );
        const task = res.data.task;
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
        setPriority(task.priority);
        setDueDate(task.dueDate);
        setUser(task.user);
      } catch (error) {
        toast.error("Failed to fetch task");
      }
    };

    if (id) {
      fetchUsers();
      fetchTask();
    }
  }, [id]);

  const handleUpdateTask = async () => {
    try {
      const res = await axios.put(
        `http://localhost:4000/api/v1/task/update/${id}`,
        {
          title,
          description,
          priority,
          user,
          dueDate,
          status,
        },
        {
          withCredentials: true,
        }
      );
      toast.success(res.data.message);

      setTasks((prevTasks) => {
        return prevTasks.map((task) => {
          if (task._id === id) {
            return {
              ...task,
              title,
              description,
              user,
              dueDate,
              status,
              priority, // Ensure priority is updated
            };
          }
          return task;
        });
      });

      handleUpdateModalClose();
    } catch (error) {
      toast.error("Failed to update task");
    }
  };

  return (
    <Modal show={showUpdateModal} onHide={handleUpdateModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>Update Task</Modal.Title>
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
            value={
              dueDate ? new Date(dueDate).toISOString().substring(0, 10) : ""
            }
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
        <br />
        <Stack gap={3}>
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleUpdateModalClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleUpdateTask}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default UpdateTaskModal;
