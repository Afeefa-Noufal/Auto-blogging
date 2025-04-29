import { BrowserRouter as Router, Routes, Route,  Navigate } from "react-router-dom";
import React, { useState } from 'react'
import Home from "./pages/Dashboard/Home";
import Topics from "./pages/Dashboard/Topics";
import Brands from "./pages/Dashboard/Brands";
import Blogs from "./pages/Dashboard/Blogs";
import AddConnection from './pages/Dashboard/AddConnection';
import ScheduleStatus from "./pages/Dashboard/ScheduleStatus";
import Signup from './pages/Signup';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';  
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
         <div style={{ marginTop: "60px", padding: "20px" }}>
        <Routes>
          <Route path="/" element={localStorage.getItem('token') ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/dashboard" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/topics" element={<PrivateRoute><Topics /></PrivateRoute>} />
          <Route path="/blogs" element={<PrivateRoute><Blogs /></PrivateRoute>} />
          <Route path="/brands" element={<PrivateRoute><Brands /></PrivateRoute>}/>
          <Route path="/brands/:brandId" element={<PrivateRoute><Topics /></PrivateRoute>} />
          <Route path="/add-connection" element={<PrivateRoute><AddConnection /></PrivateRoute> }/>
          <Route path="/schedule-status" element={<PrivateRoute><ScheduleStatus /></PrivateRoute>} />
        </Routes>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </Router>
  );
}

export default App;


