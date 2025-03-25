import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Topics from "./pages/Topics";
import Brands from "./pages/Brands";
import Blogs from "./pages/Blogs";

function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ marginTop: "60px", padding: "20px" }}> {/* Adjust margin */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/topics" element={<Topics />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/brands" element={<Brands />} /> {/* Brands List Page */}
          <Route path="/brands/:brandId" element={<Topics />} /> {/* Topics for a Brand */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

