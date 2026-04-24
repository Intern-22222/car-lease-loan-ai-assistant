


import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Pages
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import HistoryPage from "./pages/HistoryPage";
import ResultDetailsPage from "./pages/ResultDetailsPage";
import ComparisonPage from "./components/ComparisonPage";
import EmailGeneratorPage from "./pages/EmailGenerator";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUp";
import ProfilePage from "./pages/ProfilePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ContractDiffPage from "./pages/ContractDiffPage";
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import MissionPage from './pages/MissionPage';
import ContactPage from './pages/ContactPage';
import AffordabilityPage from './pages/AffordabilityPage';

import ChatbotWidget from "./components/ChatbotWidget";
import ThemeToggle from "./components/ThemeToggle";
import { ThemeProvider } from "./context/ThemeContext";

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem("token");

  console.log("Token check:", token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ChatbotWidget />
        <Routes>
          
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/mission" element={<MissionPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

         
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <HistoryPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/history/:id"
            element={
              <ProtectedRoute>
                <ResultDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/results/:id"
            element={
              <ProtectedRoute>
                <ResultDetailsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/compare"
            element={
              <ProtectedRoute>
                <ComparisonPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/diff"
            element={
              <ProtectedRoute>
                <ContractDiffPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/email"
            element={
              <ProtectedRoute>
                <EmailGeneratorPage />
              </ProtectedRoute>
            }
          />

          <Route path="/affordability" element={<ProtectedRoute><AffordabilityPage /></ProtectedRoute>} />

         
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ToastContainer position="bottom-right" autoClose={3000} theme="colored" />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;