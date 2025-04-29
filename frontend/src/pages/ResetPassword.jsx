import './css/auth.css';
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`/api/auth/reset-password/${token}`, { password });  // ✅ Direct API call
      alert('Password reset successfully!');
    } catch (err) {
      console.error('Reset Password Error:', err);
      alert(err.response?.data?.message || 'Reset failed');
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-heading">Reset Password</h2>
      <form className="auth-form" onSubmit={handleReset}>
        <input
          type="password"
          className="auth-input"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="auth-button">Reset Password</button>
        <Link to="/login" className="link-button">Back to login</Link>
      </form>
    </div>
  );
}

export default ResetPassword;

