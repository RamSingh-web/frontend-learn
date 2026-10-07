const mockOrders = [
  { id: '#ORD-1001', customer: 'Sarah Jenkins', product: 'Wireless Mouse', amount: '₹1,200', status: 'Completed', date: '2026-10-01' },
  { id: '#ORD-1002', customer: 'Rahul Sharma', product: 'Mechanical Keyboard', amount: '₹4,500', status: 'Pending', date: '2026-10-02' },
  { id: '#ORD-1003', customer: 'Ananya Gupta', product: 'USB-C Hub', amount: '₹2,100', status: 'Completed', date: '2026-10-03' },
  { id: '#ORD-1004', customer: 'Michael Chen', product: 'Gaming Monitor', amount: '₹24,999', status: 'Cancelled', date: '2026-10-04' },
];

export default function OrderTable() {
  return (
    <div className="table-card">
      <div className="table-header">
        <h3>Recent Orders</h3>
        <button className="btn-secondary">View All</button>
      </div>
      <div className="table-container">
        <table className="order-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map((order) => (
              <tr key={order.id}>
                <td className="font-medium">{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.product}</td>
                <td>{order.amount}</td>
                <td>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td className="text-muted">{order.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}