import { Link } from "react-router-dom";
import "./Navbar.css"; // Import external CSS for better styling

const Navbar = () => {
  return (
    <nav className="navbar">
      <h2 className="logo">AutoBlog</h2>
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/brands" className="nav-link">Brands</Link>
        <Link to="/blogs" className="nav-link">Blogs</Link>
        <Link to="/add-connection" className="nav-link">Add Connection</Link>
      </div>
    </nav>
  );
};

export default Navbar;


