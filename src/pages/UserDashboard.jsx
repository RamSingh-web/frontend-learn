
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.js';

const dummyOrders = [
  {
    id: 'ORD-1001',
    product: 'Wireless Mouse',
    date: '2026-10-01',
    amount: 1200,
    status: 'Completed',
  },
  {
    id: 'ORD-1002',
    product: 'Mechanical Keyboard',
    date: '2026-10-05',
    amount: 4500,
    status: 'Pending',
  },
  {
    id: 'ORD-1003',
    product: 'USB-C Hub',
    date: '2026-10-08',
    amount: 2100,
    status: 'Completed',
  },
];

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  // Summary cards ke liye counts calculate karo
  const totalOrders = dummyOrders.length;

  const pendingOrders = dummyOrders.filter(
    (order) => order.status === 'Pending'
  ).length;

  const completedOrders = dummyOrders.filter(
    (order) => order.status === 'Completed'
  ).length;

  const profileName =
    user?.name ||
    (user?.role === 'admin' ? 'Admin User' : 'Normal User');

  return (
    <div className="user-dashboard">

      {/* Welcome section */}
      <header className="user-dashboard-header">
        <div>
          <h1>Welcome, {profileName}!</h1>
          <p>Here is an overview of your account and orders.</p>
        </div>

        <button
          type="button"
          className="user-logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </header>

      {/* Summary cards */}
      <section className="user-summary-grid">
        <div className="user-summary-card">
          <span>Total Orders</span>
          <h2>{totalOrders}</h2>
          <p>All your orders</p>
        </div>

        <div className="user-summary-card">
          <span>Pending Orders</span>
          <h2>{pendingOrders}</h2>
          <p>Orders being processed</p>
        </div>

        <div className="user-summary-card">
          <span>Completed Orders</span>
          <h2>{completedOrders}</h2>
          <p>Successfully delivered or completed</p>
        </div>
      </section>

      {/* Recent orders */}
      <section className="user-dashboard-card">
        <div className="user-section-header">
          <div>
            <h2>Recent Orders</h2>
            <p>Check the status of your recent purchases.</p>
          </div>
        </div>

        <div className="user-table-wrapper">
          <table className="user-orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Product</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {dummyOrders.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.product}</td>
                  <td>{order.date}</td>
                  <td>
                    ₹{order.amount.toLocaleString('en-IN')}
                  </td>
                  <td>
                    <span
                      className={`user-order-status ${
                        order.status.toLowerCase()
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* My profile */}
      <section className="user-dashboard-card">
        <h2>My Profile</h2>
        <p className="user-profile-description">
          Your account information.
        </p>

        <div className="user-profile-details">
          <div>
            <span>Full Name</span>
            <strong>{profileName}</strong>
          </div>

          <div>
            <span>Email Address</span>
            <strong>{user?.email || 'Not available'}</strong>
          </div>

          <div>
            <span>Account Role</span>
            <strong>
              {user?.role === 'admin' ? 'Admin' : 'Normal User'}
            </strong>
          </div>
        </div>
      </section>

    </div>
  );
}



