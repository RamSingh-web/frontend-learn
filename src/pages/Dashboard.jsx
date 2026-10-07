import StateCard from '../components/StatCard';
import OrderTable from '../components/OrdersTable';

export default function Dashboard() {
  return (
    <div>
      <h1 className="dashboard-title">Dashboard</h1>
      <p className="welcome-msg">Welcome back, Admin.</p>

      {/* Stats Cards Section */}
      <div className="stats-grid">
        <StateCard title="Users" value="120" trend={{ isPositive: true, value: '+12%' }} />
        <StateCard title="Orders" value="450" trend={{ isPositive: true, value: '+8%' }} />
        <StateCard title="Revenue" value="₹50,000" trend={{ isPositive: false, value: '-2%' }} />
      </div>

      {/* Order Table Section */}
      <OrderTable />
    </div>
  );
}