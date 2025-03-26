import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Topics from "./pages/Topics";
import Brands from "./pages/Brands";
import Blogs from "./pages/Blogs";
import AddConnection from "./pages/AddConnection"; // Import the new page

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ marginTop: "60px", padding: "20px" }}> {/* Adjust margin */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/brands/:brandId" element={<Topics />} />
          <Route path="/add-connection" element={<AddConnection />} /> {/* New Route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;


