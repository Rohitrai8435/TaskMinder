import axios from "axios";
import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Stack, Pagination } from "react-bootstrap";
import toast from "react-hot-toast";
import CreateUserModal from "./CreateUserModel"; // Create a CreateUserModal component similar to CreateTaskModal
import ViewUserModal from "./ViewUserModal"; // Create a ViewUserModal component similar to ViewTaskModal
import DeleteUserModal from "./DeleteUserModal"; // Create a DeleteUserModal component similar to DeleteTaskModal
import { FaEye } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Navigate } from "react-router-dom";

const UserManagement = ({ isAuthenticated }) => {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [showViewModal, setShowViewModal] = useState(false);
  ``;
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [viewUserId, setViewUserId] = useState(null);
  const [users, setUsers] = useState([]);

  const [deleteUserId, setDeleteUserId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  useEffect(() => {
    // Fetch users when component mounts
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/user/alluser");
      setUsers(res.data.users);
      toast.success(res.data.message);
    } catch (error) {
      toast.error("Failed to fetch users");
    }
  };

  const handleCreateModalClose = () => setShowCreateModal(false);

  const handleViewModalClose = () => setShowViewModal(false);
  const handleDeleteModalClose = () => setShowDeleteModal(false);

  const handleCreateModalShow = () => setShowCreateModal(true);

  const handleViewModalShow = (id) => {
    setViewUserId(id);
    setShowViewModal(true);
  };

  const handleDeleteModalShow = (id) => {
    setDeleteUserId(id);
    setShowDeleteModal(true);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="container my-4">
      <div className="row mb-3">
        <div className="col">
          <h1>User Management</h1>
        </div>
        <div className="col text-end">
          <Button variant="primary" onClick={handleCreateModalShow}>
            Create User
          </Button>
        </div>
      </div>
      <div className="row">
        {users && users.length > 0 ? (
          <>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>

                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* Map through users */}
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>

                    <td>
                      <Stack
                        direction="horizontal"
                        gap={2}
                        className="justify-content-center"
                      >
                        <MdDelete
                          onClick={() => handleDeleteModalShow(user._id)}
                          className="fs-4"
                          role="button"
                        />
                        <FaEye
                          onClick={() => handleViewModalShow(user._id)}
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
                length: Math.ceil(users.length / usersPerPage),
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
          <h1>No users available</h1>
        )}
      </div>

      {/* Render modals */}
      <CreateUserModal
        handleCreateModalClose={handleCreateModalClose}
        showCreateModal={showCreateModal}
        setUsers={setUsers}
      />

      <ViewUserModal
        handleViewModalClose={handleViewModalClose}
        showViewModal={showViewModal}
        id={viewUserId}
      />

      <DeleteUserModal
        handleDeleteModalClose={handleDeleteModalClose}
        showDeleteModal={showDeleteModal}
        userId={deleteUserId}
        setUsers={setUsers}
      />
    </div>
  );
};

export default UserManagement;
