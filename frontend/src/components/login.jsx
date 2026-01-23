// import React from 'react'
// import { useNavigate } from 'react-router-dom'

// function login() {
//     const navigate = useNavigate();

//     const handlelogin =() =>{
//         navigate('/dashboard');
//     }

//   return (
//     <div>
//         <h2>Login Page</h2>
//         <form>
//             <input type="email" placeholder="Email" /><br/>
//             <input type="password" placeholder="Password" /><br/>
//             <button type="submit" onClick={handlelogin}>Login</button>
//         </form>
//     </div>

//   )
// }

// export default login

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://127.0.0.1:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Login failed");
      }

      // Store user_id for future requests (uploads, edits, etc.)
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("user_email", data.email);

      if (data.is_new_user) {
        alert("New user created. Welcome!");
      } else {
        alert("Welcome back!");
      }

      // Redirect after login
      window.location.href = "/dashboard";

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
      <div style={{ width: '300px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '10px' }}>
            <label>Email:</label><br />
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '5px' }}
              required 
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <label>Password:</label><br />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '5px' }}
              required 
            />
          </div>
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;