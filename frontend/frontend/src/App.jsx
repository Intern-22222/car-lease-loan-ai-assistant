import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HistoryPage from "./pages/HistoryPage";
import ResultDetailsPage from "./pages/ResultDetailsPage";
import { ToastContainer } from "react-toastify";
import ComparisonPage from "./components/ComparisonPage";
import "react-toastify/dist/ReactToastify.css";
import EmailGeneratorPage from "./pages/EmailGenerator";
import ChatbotWidget from "./components/ChatbotWidget";

import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUp";
function App() {
  return (
    <>
      <BrowserRouter>
        <ChatbotWidget />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadPage />}></Route>
          <Route path="/history" element={<HistoryPage />}></Route>
          <Route path="/history/:id" element={<ResultDetailsPage />}></Route>
          {/* 👇 THIS IS THE MISSING LINE 👇 */}
          <Route path="/results/:id" element={<ResultDetailsPage />} />
          <Route path="/compare" element={<ComparisonPage />} />
          <Route path="/email" element={<EmailGeneratorPage />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </>
  );
}

export default App;
