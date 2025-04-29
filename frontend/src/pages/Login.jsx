import './css/auth.css';
import AuthForm from '../components/AuthForm';
import axiosInstance from '../utils/axiosInstance';  
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const navigate = useNavigate();

  const handleLogin = async (formData) => {
    try {
      const { data } = await axiosInstance.post('/api/auth/login', formData);
      localStorage.setItem('token', data.token);
      alert('Login successful!');
      navigate('/dashboard');  
    } catch (err) {
      console.error('Login error:', err);
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <AuthForm onSubmit={handleLogin} buttonText="Login" />
      <Link to="/forgot-password" className="link-button">Forgot Password?</Link><br></br>
      <span className='small-text'>Don't have an account?</span><Link to="/signup" className="link-button">Signup</Link>
    </div>
  );
}

export default Login;


