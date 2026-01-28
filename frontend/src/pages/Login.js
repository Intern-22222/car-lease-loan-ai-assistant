import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Talk to Python Backend
      const response = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        alert(data.message); 
        onLogin({ email: data.user, name: data.name }); // Pass user info up
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Connection Error: Is the Backend running?');
    }
    setIsLoading(false);
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ color: '#4B0082' }}>🚗 Car Lease AI</h2>
        <p style={{color: '#666', marginBottom: '20px'}}>Secure KYC Login</p>
        
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleLogin} style={styles.form}>
          <input 
            type="email" 
            placeholder="Enter Email (e.g., user@example.com)" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />
          <button type="submit" style={styles.button} disabled={isLoading}>
            {isLoading ? "Verifying..." : "Login"}
          </button>
        </form>
        <p style={{fontSize: '12px', marginTop: '15px', color: '#888'}}>
          (New emails are automatically registered)
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: { height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f0f2f5' },
  card: { width: '350px', padding: '40px', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', textAlign: 'center' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px' },
  input: { padding: '12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '16px' },
  button: { padding: '12px', backgroundColor: '#4B0082', color: 'white', border: 'none', borderRadius: '6px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' },
  error: { backgroundColor: '#ffdede', color: 'red', padding: '10px', borderRadius: '5px', fontSize: '14px', marginBottom: '10px' }
};

export default Login;