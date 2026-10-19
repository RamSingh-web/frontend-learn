import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <h3>Menu</h3>

      <ul>
        <li>
          <NavLink to="/dashboard">
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/users">
            Users
          </NavLink>
        </li>

        <li>
          <NavLink to="/products">
            Products
          </NavLink>
        </li>

        <li>
          <NavLink to="/orders">
            Orders
          </NavLink>
        </li>

        <li>
          <NavLink to="/settings">
            Settings
          </NavLink>
        </li>
      </ul>
    </aside>
  );
}