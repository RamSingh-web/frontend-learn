export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Menu</h3>
      <ul>
        <li><a href="#dashboard" className="active">Dashboard</a></li>
        <li><a href="#users">Users</a></li>
        <li><a href="#products">Products</a></li>
        <li><a href="#orders">Orders</a></li>
        <li><a href="#settings">Settings</a></li>
      </ul>
    </aside>
  );
}