import AuthForm from '../components/AuthForm';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import './css/auth.css';

function Signup() {
  const navigate = useNavigate();

  const handleSignup = async (formData) => {
    try {
      // direct API call here
      await axiosInstance.post('/api/auth/signup', formData);
      alert('Signup successful!');
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-container">
      <h2>Signup</h2>
      <AuthForm onSubmit={handleSignup} buttonText="Signup" />
      <span className="small-text">Already have an account?</span><Link to="/login" className="link-button">Login</Link>
    </div>
  );
}

export default Signup;

