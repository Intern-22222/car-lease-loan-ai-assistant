// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";
// const DashboardPage = () => {
//   const navigate = useNavigate();
//   // 1. STATE: Default to "Guest" until we load real data
//   const [user, setUser] = useState({ name: "Guest" });

//   // 2. EFFECT: Load User from Local Storage on mount
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     const token = localStorage.getItem("token");

//     // Security Check: If no token or user, redirect to Login
//     if (!token || !storedUser) {
//       navigate("/login");
//     } else {
//       // Parse the JSON string back into an object
//       setUser(JSON.parse(storedUser));
//     }
//   }, [navigate]);

//   // 3. LOGOUT: Clear storage and redirect
//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     toast.info("Logged out successfully");
//     navigate("/login");
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 font-sans">
//       {/* NAVBAR */}
//       <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
//         <div className="flex items-center gap-2">
//           <span className="text-2xl">🚗</span>
//           <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
//             AutoLease AI
//           </h1>
//         </div>
//         <div className="flex items-center gap-4">
//           <span className="text-gray-600 font-medium hidden sm:block">
//             Welcome, {user.name}
//           </span>
//           <button
//             onClick={handleLogout}
//             className="text-sm text-red-600 font-bold hover:bg-red-50 px-3 py-1 rounded transition"
//           >
//             Logout
//           </button>
//         </div>
//       </nav>

//       {/* HERO SECTION */}
//       <div className="bg-indigo-700 text-white py-12 px-6 text-center">
//         <h2 className="text-3xl font-bold mb-2">
//           Your Personal Car Buying Assistant
//         </h2>
//         <p className="text-indigo-100 max-w-2xl mx-auto">
//           Upload contracts, uncover hidden fees, and negotiate like a pro.
//         </p>
//       </div>

//       {/* ACTION GRID */}
//       <div className="max-w-6xl mx-auto px-6 -mt-8">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           {/* CARD 1: UPLOAD (Analyze) */}
//           <Link
//             to="/upload"
//             className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 group border border-gray-100"
//           >
//             <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition">
//               📄
//             </div>
//             <h3 className="text-xl font-bold text-gray-800 mb-2">
//               Analyze Contract
//             </h3>
//             <p className="text-gray-500 text-sm leading-relaxed">
//               Upload a PDF lease or loan agreement. extract terms, and find
//               hidden junk fees.
//             </p>
//             <div className="mt-4 text-blue-600 font-bold text-sm flex items-center gap-1">
//               Start Analysis <span>→</span>
//             </div>
//           </Link>

//           {/* CARD 2: COMPARE */}
//           <Link
//             to="/compare"
//             className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 group border border-gray-100"
//           >
//             <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition">
//               ⚖️
//             </div>
//             <h3 className="text-xl font-bold text-gray-800 mb-2">
//               Compare Offers
//             </h3>
//             <p className="text-gray-500 text-sm leading-relaxed">
//               Side-by-side comparison of multiple dealer quotes to find the best
//               total cost.
//             </p>
//             <div className="mt-4 text-purple-600 font-bold text-sm flex items-center gap-1">
//               Go to Comparison <span>→</span>
//             </div>
//           </Link>

//           {/* CARD 3: NEGOTIATE (Email) */}
//           <Link
//             to="/email"
//             className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 group border border-gray-100"
//           >
//             <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition">
//               ✉️
//             </div>
//             <h3 className="text-xl font-bold text-gray-800 mb-2">Negotiator</h3>
//             <p className="text-gray-500 text-sm leading-relaxed">
//               Generate professional counter-offer emails using AI to lower the
//               price.
//             </p>
//             <div className="mt-4 text-green-600 font-bold text-sm flex items-center gap-1">
//               Draft Email <span>→</span>
//             </div>
//           </Link>
//         </div>

//         {/* SECONDARY ROW */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pb-12">
//           {/* HISTORY */}
//           <Link
//             to="/history"
//             className="bg-white p-6 rounded-xl shadow border border-gray-200 flex items-center justify-between hover:bg-gray-50 transition"
//           >
//             <div className="flex items-center gap-4">
//               <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xl">
//                 📜
//               </div>
//               <div>
//                 <h4 className="font-bold text-gray-800">View History</h4>
//                 <p className="text-xs text-gray-500">
//                   Access your past uploads
//                 </p>
//               </div>
//             </div>
//             <span className="text-gray-400">➔</span>
//           </Link>

//           {/* CONTACT / SUPPORT */}
//           <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex items-center gap-4">
//             <div className="w-10 h-10 bg-indigo-200 text-indigo-700 rounded-full flex items-center justify-center text-xl">
//               🤖
//             </div>
//             <div>
//               <h4 className="font-bold text-indigo-900">Need Advice?</h4>
//               <p className="text-xs text-indigo-700">
//                 Click the chat bubble to ask the AI Coach!
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DashboardPage;




import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "Guest" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Get Data safely
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (!token) {
      // If not logged in, go to Login
      navigate("/login");
    } else {
      try {
        // Safe Parse
        const parsedUser = storedUser
          ? JSON.parse(storedUser)
          : { name: "User" };
        setUser(parsedUser);
      } catch (error) {
        console.error("User Data Corrupt:", error);
        localStorage.clear();
        navigate("/login");
      }
    }
    setLoading(false); // Done loading
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out successfully");
    navigate("/login");
  };

  // 2. Loading State
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-xl font-bold text-indigo-600 animate-pulse">
          Loading Dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* NAVBAR */}
      <nav className="bg-white shadow-sm border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚗</span>
          <h1 className="text-xl font-extrabold text-gray-900 tracking-tight">
            AutoLease AI
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-600 font-medium hidden sm:block">
            Welcome,{" "}
            <span className="text-indigo-600 font-bold">{user.name}</span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm border border-red-200 text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="bg-indigo-700 text-white py-12 px-6 text-center shadow-md">
        <h2 className="text-4xl font-extrabold mb-4">
          Your Personal Car Buying Assistant
        </h2>
        <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
          Upload contracts, uncover hidden fees, and negotiate like a pro.
        </p>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 -mt-10 pb-12">
        {/* 3 MAIN CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/upload"
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition hover:-translate-y-2 border border-gray-100 group"
          >
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">
              📄
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Analyze Contract
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Extract terms and find junk fees.
            </p>
            <span className="text-blue-600 font-bold text-sm flex items-center gap-2">
              Start Analysis →
            </span>
          </Link>

          <Link
            to="/compare"
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition hover:-translate-y-2 border border-gray-100 group"
          >
            <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">
              ⚖️
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">
              Compare Offers
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              Compare multiple quotes side-by-side.
            </p>
            <span className="text-purple-600 font-bold text-sm flex items-center gap-2">
              Go to Comparison →
            </span>
          </Link>

          <Link
            to="/email"
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition hover:-translate-y-2 border border-gray-100 group"
          >
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">
              ✉️
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Negotiator</h3>
            <p className="text-gray-500 text-sm mb-6">
              Generate AI counter-offer emails.
            </p>
            <span className="text-green-600 font-bold text-sm flex items-center gap-2">
              Draft Email →
            </span>
          </Link>
        </div>

        {/* SECONDARY ROW (History + Advice) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* HISTORY BUTTON */}
          <Link
            to="/history"
            className="bg-white p-6 rounded-xl shadow border border-gray-200 flex items-center justify-between hover:bg-gray-50 transition cursor-pointer"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-2xl">
                📜
              </div>
              <div>
                <h4 className="font-bold text-gray-900 text-lg">
                  View History
                </h4>
                <p className="text-sm text-gray-500">
                  Access your past uploads
                </p>
              </div>
            </div>
            <span className="text-gray-400 font-bold text-xl">➔</span>
          </Link>

          {/* 👇 RESTORED: ADVICE / CHATBOT SECTION */}
          <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-200 text-indigo-700 rounded-full flex items-center justify-center text-2xl">
              🤖
            </div>
            <div>
              <h4 className="font-bold text-indigo-900 text-lg">
                Need Advice?
              </h4>
              <p className="text-sm text-indigo-700">
                Click the chat bubble ↘️ to ask the AI Coach!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
