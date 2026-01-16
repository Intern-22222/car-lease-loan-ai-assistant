import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Use absolute-style paths relative to src
import './styles/theme.css'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)