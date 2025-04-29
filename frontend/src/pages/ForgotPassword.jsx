import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';  
import './css/auth.css';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleRequest = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('/api/auth/forgot-password', { email });
      alert(response.data.message);  // Success message
    } catch (err) {
      const error = err.response?.data?.error || err.response?.data?.message || 'An error occurred while sending the reset request.';
      setErrorMessage(error);  // Set the error message
    }
  };

  return (
    <div className="auth-container">
      <h2 className="auth-heading">Request Password Reset</h2>
      <form className="auth-form" onSubmit={handleRequest}>
        <input
          type="email"
          className="auth-input"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit" className="auth-button">Send Reset Link</button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </div>
  );
}

export default ForgotPassword;


