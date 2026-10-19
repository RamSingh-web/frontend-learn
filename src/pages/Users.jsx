
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'myAdminUsers';

const initialUsers = [
  {
    id: 1,
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Priya Verma',
    email: 'priya@example.com',
    role: 'User',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Amit Kumar',
    email: 'amit@example.com',
    role: 'User',
    status: 'Inactive',
  },
];

function getSavedUsers() {
  try {
    const savedUsers = localStorage.getItem(STORAGE_KEY);

    if (savedUsers === null) {
      return initialUsers;
    }

    const parsedUsers = JSON.parse(savedUsers);

    return Array.isArray(parsedUsers) ? parsedUsers : initialUsers;
  } catch {
    return initialUsers;
  }
}

export default function Users() {
  const [users, setUsers] = useState(getSavedUsers);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('User');
  const [status, setStatus] = useState('Active');

  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Save users whenever the list changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch {
      setError(
        'Could not save users. Check your browser storage settings.'
      );
    }
  }, [users]);

  function resetForm() {
    setName('');
    setEmail('');
    setRole('User');
    setStatus('Active');
    setEditingId(null);
    setError('');
    setShowForm(false);
  }

  function handleSubmit(e) {
    e.preventDefault();

    const trimmedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      setError('Please enter a valid name.');
      return;
    }

    if (!normalizedEmail) {
      setError('Please enter an email address.');
      return;
    }

    const emailExists = users.some(
      (user) =>
        user.email.toLowerCase() === normalizedEmail &&
        user.id !== editingId
    );

    if (emailExists) {
      setError('This email already exists.');
      return;
    }

    if (editingId !== null) {
      // Update existing user.
      setUsers((currentUsers) =>
        currentUsers.map((user) =>
          user.id === editingId
            ? {
                ...user,
                name: trimmedName,
                email: normalizedEmail,
                role,
                status,
              }
            : user
        )
      );
    } else {
      // Add a new user.
      const newUser = {
        id: Date.now(),
        name: trimmedName,
        email: normalizedEmail,
        role,
        status,
      };

      setUsers((currentUsers) => [...currentUsers, newUser]);
    }

    resetForm();
  }

  function handleEdit(user) {
    setEditingId(user.id);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
    setStatus(user.status);
    setError('');
    setShowForm(true);
  }

  function handleDelete(user) {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${user.name}?`
    );

    if (!confirmed) {
      return;
    }

    setUsers((currentUsers) =>
      currentUsers.filter((item) => item.id !== user.id)
    );

    if (editingId === user.id) {
      resetForm();
    }
  }

  const filteredUsers = users.filter((user) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query);

    const matchesRole =
      roleFilter === 'All' || user.role === roleFilter;

    const matchesStatus =
      statusFilter === 'All' || user.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="users-page">
      <h1 className="dashboard-title">Users</h1>

      <p className="welcome-msg">
        Manage and view all registered users.
      </p>

      <section className="table-card">
        <div className="table-header">
          <h2>All Users ({filteredUsers.length})</h2>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => {
              if (showForm) {
                resetForm();
              } else {
                setError('');
                setEditingId(null);
                setName('');
                setEmail('');
                setRole('User');
                setStatus('Active');
                setShowForm(true);
              }
            }}
          >
            {showForm ? 'Cancel' : 'Add User'}
          </button>
        </div>

        {/* Add/Edit form */}
        {showForm && (
          <form className="add-user-form" onSubmit={handleSubmit}>
            <h3 className="user-form-title">
              {editingId !== null ? 'Edit User' : 'Add New User'}
            </h3>

            <div className="form-group">
              <label htmlFor="new-user-name">Full Name</label>
              <input
                id="new-user-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="new-user-email">Email Address</label>
              <input
                id="new-user-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="new-user-role">Role</label>
              <select
                id="new-user-role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="User">Normal User</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="new-user-status">Status</label>
              <select
                id="new-user-status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {error && (
              <p className="form-error" role="alert">
                {error}
              </p>
            )}

            <div className="user-form-actions">
              <button type="submit" className="save-button">
                {editingId !== null ? 'Update User' : 'Save User'}
              </button>

              <button
                type="button"
                className="cancel-form-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Search and filters */}
        <div className="users-toolbar">
          <div className="users-search">
            <label htmlFor="users-search-input">Search users</label>
            <input
              id="users-search-input"
              type="search"
              placeholder="Search name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="users-filter">
            <label htmlFor="users-role-filter">Role</label>
            <select
              id="users-role-filter"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="All">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="User">Normal User</option>
            </select>
          </div>

          <div className="users-filter">
            <label htmlFor="users-status-filter">Status</label>
            <select
              id="users-status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <button
            type="button"
            className="clear-filters-button"
            onClick={() => {
              setSearch('');
              setRoleFilter('All');
              setStatusFilter('All');
            }}
          >
            Clear Filters
          </button>
        </div>

        {/* Users table */}
        <div className="table-container">
          <table className="data-table users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="user-name">{user.name}</td>

                    <td>{user.email}</td>

                    <td>
                      <span className="role-badge">
                        {user.role === 'User' ? 'Normal User' : user.role}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${
                          user.status === 'Active'
                            ? 'completed'
                            : 'cancelled'
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td>
                      <div className="user-row-actions">
                        <button
                          type="button"
                          className="edit-user-button"
                          onClick={() => handleEdit(user)}
                          aria-label={`Edit ${user.name}`}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete-user-button"
                          onClick={() => handleDelete(user)}
                          aria-label={`Delete ${user.name}`}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="users-empty-state">
                    No users found. Try changing your search or filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
