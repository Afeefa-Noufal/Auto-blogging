import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    navigate("/login");               // Redirect to login
  };

  return (
    <nav className="navbar">
      <h2 className="logo">AutoBlog</h2>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/brands" className="nav-link">Brands</Link>
        <Link to="/blogs" className="nav-link">Blogs</Link>
        <Link to="/add-connection" className="nav-link">Add Connection</Link>
        <Link to="/schedule-status" className="nav-link">Schedule Status</Link>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;


