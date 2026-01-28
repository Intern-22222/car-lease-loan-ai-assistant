// import { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
// import "./App.css";
// import DashboardPage from "./pages/DashboardPage";
// import UploadPage from "./pages/UploadPage";
// import { BrowserRouter, Route, Routes } from "react-router-dom";
// import HistoryPage from "./pages/HistoryPage";
// import ResultDetailsPage from "./pages/ResultDetailsPage";
// import { ToastContainer } from "react-toastify";
// import ComparisonPage from "./components/ComparisonPage";
// import "react-toastify/dist/ReactToastify.css";
// import EmailGeneratorPage from "./pages/EmailGenerator";
// import ChatbotWidget from "./components/ChatbotWidget";

// import LoginPage from "./pages/LoginPage";
// import SignupPage from "./pages/SignUp";
// function App() {
//   return (
//     <>
//       <BrowserRouter>
//         <ChatbotWidget />
//         <Routes>
//           <Route path="/login" element={<LoginPage />} />
//           <Route path="/signup" element={<SignupPage />} />
//           <Route path="/" element={<DashboardPage />} />
//           <Route path="/upload" element={<UploadPage />}></Route>
//           <Route path="/history" element={<HistoryPage />}></Route>
//           <Route path="/history/:id" element={<ResultDetailsPage />}></Route>

//           <Route path="/results/:id" element={<ResultDetailsPage />} />
//           <Route path="/compare" element={<ComparisonPage />} />
//           <Route path="/email" element={<EmailGeneratorPage />} />
//         </Routes>
//         <ToastContainer position="top-right" autoClose={3000} />
//       </BrowserRouter>
//     </>
//   );
// }

// export default App;





import { useState } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom"; // 👈 Ensure Navigate is imported
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

// Components
import ChatbotWidget from "./components/ChatbotWidget";

// 🔒 THE GATEKEEPER COMPONENT
const ProtectedRoute = ({ children }) => {
  // const token = localStorage.getItem("token");
  const token = sessionStorage.getItem("token");

  // Debugging: Check console to see if token exists
  console.log("Token check:", token);

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <>
      <BrowserRouter>
        <ChatbotWidget />
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* PROTECTED ROUTES - Dashboard MUST be wrapped */}
          <Route
            path="/"
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
            path="/email"
            element={
              <ProtectedRoute>
                <EmailGeneratorPage />
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </>
  );
}

export default App;
