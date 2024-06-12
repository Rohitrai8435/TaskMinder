import axios from "axios";
import React, { useState } from "react";
import { Modal, Button, Table, Stack, Pagination } from "react-bootstrap";
import toast from "react-hot-toast";
import CreateTaskModal from "./CreateTaskModal";
import UpdateTaskModal from "./UpdateTaskModal";
import ViewTaskModal from "./ViewTaskModal";
import DeleteTaskModal from "./DeleteTaskModal"; // Import DeleteTaskModal
import { FaEye } from "react-icons/fa";
import { MdEdit, MdDelete } from "react-icons/md";
import { Navigate } from "react-router-dom";

const Home = ({ isAuthenticated, tasks, setTasks, taskTitle }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete modal
  const [viewTaskId, setViewTaskId] = useState(null);
  const [updatedTaskId, setUpdateTaskId] = useState(null);
  const [deleteTaskId, setDeleteTaskId] = useState(null); // State for task to be deleted
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(5);

  const handleCreateModalClose = () => setShowCreateModal(false);
  const handleUpdateModalClose = () => setShowUpdateModal(false);
  const handleViewModalClose = () => setShowViewModal(false);
  const handleDeleteModalClose = () => setShowDeleteModal(false); // Close delete modal

  const handleCreateModalShow = () => setShowCreateModal(true);

  const handleUpdateModalShow = (id) => {
    setUpdateTaskId(id);
    setShowUpdateModal(true);
  };

  const handleViewModalShow = (id) => {
    setViewTaskId(id);
    setShowViewModal(true);
  };

  const handleDeleteModalShow = (id) => {
    setDeleteTaskId(id);
    setShowDeleteModal(true);
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "2-digit", day: "2-digit" };
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", options).replace(/\//g, "-");
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "high":
        return { color: "red" };
      case "medium":
        return { color: "blue" };
      case "low":
        return { color: "yellow" };
      default:
        return {};
    }
  };

  const indexOfLastTask = currentPage * tasksPerPage;
  const indexOfFirstTask = indexOfLastTask - tasksPerPage;
  const currentTasks = tasks.slice(indexOfFirstTask, indexOfLastTask);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="container my-4">
      <div className="row mb-3">
        <div className="col">
          <h1>{taskTitle}</h1>
        </div>
        <div className="col text-end">
          <Button variant="primary" onClick={handleCreateModalShow}>
            Create Task
          </Button>
        </div>
      </div>
      <div className="row">
        {tasks && tasks.length > 0 ? (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Due Date</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentTasks.map((task) => (
                  <tr key={task._id}>
                    <td>
                      {task && task.title.length <= 40
                        ? task.title
                        : task.title.slice(0, 40) + "..."}
                    </td>

                    <td>{formatDate(task.dueDate)}</td>
                    <td>
                      {task && task.status.length <= 300
                        ? task.status
                        : task.status.slice(0, 300) + "..."}
                    </td>
                    <td style={getPriorityStyle(task.priority)}>
                      {task.priority}
                    </td>
                    <td>
                      <Stack
                        direction="horizontal"
                        gap={2}
                        className="justify-content-center"
                      >
                        <MdEdit
                          onClick={() => handleUpdateModalShow(task._id)}
                          className="fs-4"
                          role="button"
                        />
                        <MdDelete
                          onClick={() => handleDeleteModalShow(task._id)}
                          className="fs-4"
                          role="button"
                        />
                        <FaEye
                          onClick={() => handleViewModalShow(task._id)}
                          className="fs-4"
                          role="button"
                        />
                      </Stack>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Pagination>
              {Array.from({
                length: Math.ceil(tasks.length / tasksPerPage),
              }).map((_, index) => (
                <Pagination.Item
                  key={index + 1}
                  active={index + 1 === currentPage}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </>
        ) : (
          <h1>YOU DON'T HAVE ANY {taskTitle}</h1>
        )}
      </div>

      <CreateTaskModal
        handleCreateModalClose={handleCreateModalClose}
        showCreateModal={showCreateModal}
        setTasks={setTasks}
      />

      <UpdateTaskModal
        handleUpdateModalClose={handleUpdateModalClose}
        showUpdateModal={showUpdateModal}
        id={updatedTaskId}
        setTasks={setTasks}
      />

      <ViewTaskModal
        handleViewModalClose={handleViewModalClose}
        showViewModal={showViewModal}
        id={viewTaskId}
      />

      <DeleteTaskModal
        handleDeleteModalClose={handleDeleteModalClose}
        showDeleteModal={showDeleteModal}
        taskId={deleteTaskId}
        setTasks={setTasks}
      />
    </div>
  );
};

export default Home;
