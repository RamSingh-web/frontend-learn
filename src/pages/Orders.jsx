
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'myAdminOrders';

const initialOrders = [
  {
    id: '#ORD-1001',
    customer: 'Sarah Jenkins',
    email: 'sarah@example.com',
    product: 'Wireless Mouse',
    amount: 1200,
    date: '2026-10-01',
    status: 'Completed',
    payment: 'Paid',
  },
  {
    id: '#ORD-1002',
    customer: 'Rahul Sharma',
    email: 'rahul@example.com',
    product: 'Mechanical Keyboard',
    amount: 4500,
    date: '2026-10-02',
    status: 'Pending',
    payment: 'Pending',
  },
  {
    id: '#ORD-1003',
    customer: 'Ananya Gupta',
    email: 'ananya@example.com',
    product: 'USB-C Hub',
    amount: 2100,
    date: '2026-10-03',
    status: 'Completed',
    payment: 'Paid',
  },
  {
    id: '#ORD-1004',
    customer: 'Michael Chen',
    email: 'michael@example.com',
    product: 'Gaming Monitor',
    amount: 24999,
    date: '2026-10-04',
    status: 'Cancelled',
    payment: 'Refunded',
  },
  {
    id: '#ORD-1005',
    customer: 'Priya Verma',
    email: 'priya@example.com',
    product: 'Laptop Stand',
    amount: 1500,
    date: '2026-10-05',
    status: 'Pending',
    payment: 'Pending',
  },
];

function getSavedOrders() {
  try {
    const savedOrders = localStorage.getItem(STORAGE_KEY);

    if (savedOrders === null) {
      return initialOrders;
    }

    const parsedOrders = JSON.parse(savedOrders);

    return Array.isArray(parsedOrders)
      ? parsedOrders
      : initialOrders;
  } catch {
    return initialOrders;
  }
}

export default function Orders() {
  const [orders, setOrders] = useState(getSavedOrders);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [storageError, setStorageError] = useState('');

  // Persist orders whenever the order list changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(orders));
      setStorageError('');
    } catch {
      setStorageError(
        'Unable to save changes in browser storage.'
      );
    }
  }, [orders]);

  // Summary statistics.
  const totalOrders = orders.length;

  const completedOrders = orders.filter(
    (order) => order.status === 'Completed'
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.status === 'Pending'
  ).length;

  // Revenue from completed orders only.
  const totalRevenue = orders
    .filter((order) => order.status === 'Completed')
    .reduce((total, order) => total + Number(order.amount), 0);

  function formatAmount(amount) {
    return Number(amount).toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  function getStatusClass(status) {
    switch (status) {
      case 'Completed':
        return 'completed';
      case 'Pending':
        return 'pending';
      case 'Cancelled':
        return 'cancelled';
      default:
        return '';
    }
  }

  // Search by order ID, customer, or product.
  const filteredOrders = orders.filter((order) => {
    const query = search.trim().toLowerCase();

    const matchesSearch =
      order.id.toLowerCase().includes(query) ||
      order.customer.toLowerCase().includes(query) ||
      order.product.toLowerCase().includes(query) ||
      order.email.toLowerCase().includes(query);

    const matchesStatus =
      statusFilter === 'All' ||
      order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Update order status.
  function handleStatusChange(orderId, newStatus) {
    setOrders((currentOrders) =>
      currentOrders.map((order) => {
        if (order.id !== orderId) {
          return order;
        }

        let payment = order.payment;

        if (newStatus === 'Completed') {
          payment = 'Paid';
        } else if (newStatus === 'Cancelled') {
          payment =
            order.payment === 'Paid' ||
            order.payment === 'Refunded'
              ? 'Refunded'
              : 'Cancelled';
        } else {
          payment = 'Pending';
        }

        return {
          ...order,
          status: newStatus,
          payment,
        };
      })
    );

    // Keep the open modal synchronized with the latest order.
    setSelectedOrder((currentOrder) => {
      if (!currentOrder || currentOrder.id !== orderId) {
        return currentOrder;
      }

      let payment = currentOrder.payment;

      if (newStatus === 'Completed') {
        payment = 'Paid';
      } else if (newStatus === 'Cancelled') {
        payment =
          currentOrder.payment === 'Paid' ||
          currentOrder.payment === 'Refunded'
            ? 'Refunded'
            : 'Cancelled';
      } else {
        payment = 'Pending';
      }

      return {
        ...currentOrder,
        status: newStatus,
        payment,
      };
    });
  }

  // Delete order with confirmation.
  function handleDeleteOrder(orderId) {
    const confirmed = window.confirm(
      `Are you sure you want to delete order ${orderId}?`
    );

    if (!confirmed) {
      return;
    }

    setOrders((currentOrders) =>
      currentOrders.filter((order) => order.id !== orderId)
    );

    setSelectedOrder((currentOrder) =>
      currentOrder?.id === orderId ? null : currentOrder
    );
  }

  return (
    <div className="orders-page">
      {/* Page heading */}
      <div className="orders-heading">
        <div>
          <h1 className="dashboard-title">Orders</h1>
          <p className="welcome-msg">
            Manage and track all customer orders.
          </p>
        </div>

        <span className="orders-count">
          {totalOrders} Total Orders
        </span>
      </div>

      {storageError && (
        <p className="orders-storage-error" role="alert">
          {storageError}
        </p>
      )}

      {/* Summary cards */}
      <section className="orders-summary">
        <div className="order-summary-card">
          <span>Total Orders</span>
          <h2>{totalOrders}</h2>
        </div>

        <div className="order-summary-card">
          <span>Completed</span>
          <h2>{completedOrders}</h2>
        </div>

        <div className="order-summary-card">
          <span>Pending</span>
          <h2>{pendingOrders}</h2>
        </div>

        <div className="order-summary-card">
          <span>Completed Order Revenue</span>
          <h2>{formatAmount(totalRevenue)}</h2>
        </div>
      </section>

      {/* Orders table */}
      <section className="table-card orders-table-card">
        <div className="orders-toolbar">
          <h3>All Orders</h3>

          <div className="orders-filters">
            <input
              type="search"
              placeholder="Search order, customer, product..."
              aria-label="Search orders"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />

            <select
              aria-label="Filter by order status"
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>

            <button
              type="button"
              className="order-view-btn"
              onClick={() => {
                setSearch('');
                setStatusFilter('All');
              }}
            >
              Clear
            </button>
          </div>
        </div>

        <div className="table-container">
          <table className="order-table orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-medium">{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.product}</td>
                    <td>{formatAmount(order.amount)}</td>
                    <td className="text-muted">{order.date}</td>

                    <td>
                      <span
                        className={`status-badge ${getStatusClass(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td>
                      <div className="order-actions">
                        <button
                          type="button"
                          className="order-view-btn"
                          onClick={() => setSelectedOrder(order)}
                        >
                          View
                        </button>

                        <button
                          type="button"
                          className="order-delete-btn"
                          onClick={() => handleDeleteOrder(order.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="orders-empty">
                    No orders found. Try another search or status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Order details modal */}
      {selectedOrder && (
        <div
          className="order-modal-overlay"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="order-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="order-modal-header">
              <h2 id="order-modal-title">Order Details</h2>

              <button
                type="button"
                className="order-modal-close"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close order details"
              >
                &times;
              </button>
            </div>

            <div className="order-details">
              <p>
                <strong>Order ID:</strong> {selectedOrder.id}
              </p>

              <p>
                <strong>Customer:</strong> {selectedOrder.customer}
              </p>

              <p>
                <strong>Email:</strong> {selectedOrder.email}
              </p>

              <p>
                <strong>Product:</strong> {selectedOrder.product}
              </p>

              <p>
                <strong>Amount:</strong>{' '}
                {formatAmount(selectedOrder.amount)}
              </p>

              <p>
                <strong>Order Date:</strong> {selectedOrder.date}
              </p>

              <p>
                <strong>Payment:</strong> {selectedOrder.payment}
              </p>

              <p>
                <strong>Current Status:</strong>{' '}
                <span
                  className={`status-badge ${getStatusClass(
                    selectedOrder.status
                  )}`}
                >
                  {selectedOrder.status}
                </span>
              </p>

              <div className="order-status-field">
                <label htmlFor="order-status">
                  Update Order Status
                </label>

                <select
                  id="order-status"
                  value={selectedOrder.status}
                  onChange={(event) =>
                    handleStatusChange(
                      selectedOrder.id,
                      event.target.value
                    )
                  }
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              className="product-primary-btn order-modal-done"
              onClick={() => setSelectedOrder(null)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
