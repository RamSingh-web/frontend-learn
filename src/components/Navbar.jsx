
export default function Navbar() {
  return (
    <header className="navbar">
      <div className="logo">My Admin</div>
      <div className="user-profile">
        <span>Admin</span>
        <button>Logout</button>
      </div>
    </header>
  );
}