import React, { useState } from 'react';
import { Mail, Lock, User, Sparkles, Loader2 } from 'lucide-react';
import './Login.css';

const Login = ({ onLoginSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate a network delay for the UI experience
    setTimeout(() => {
      setLoading(false);
      
      // Basic frontend validation check
      if (email && password) {
        // Trigger the success handler provided by App.jsx
        // We pass a mock token and user data to satisfy the UI requirements
        onLoginSuccess("mock-token-123", { 
          name: isSignup ? name : "Amit Verma", 
          email: email 
        });
      } else {
        setError("Please fill in all fields.");
      }
    }, 1000);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <Sparkles className="logo-icon" />
          <h1>LeaseIQ</h1>
          <p>{isSignup ? "Create your account" : "Welcome back!"}</p>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="input-group">
              <User size={18} />
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
          )}
          
          <div className="input-group">
            <Mail size={18} />
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="input-group">
            <Lock size={18} />
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="login-btn" 
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              isSignup ? "Sign Up" : "Login"
            )}
          </button>
        </form>

        <p className="toggle-auth">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <span onClick={() => {
            setIsSignup(!isSignup);
            setError('');
          }}>
            {isSignup ? " Login" : " Sign Up"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;