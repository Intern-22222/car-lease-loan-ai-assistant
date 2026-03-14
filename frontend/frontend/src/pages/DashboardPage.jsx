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




// import React, { useState, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const DashboardPage = () => {
//   const navigate = useNavigate();
//   const [user, setUser] = useState({ name: "Guest" });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // 1. Get Data safely
//     // const storedUser = localStorage.getItem("user");
//     // const token = localStorage.getItem("token");

//     const storedUser = sessionStorage.getItem("user"); // 👈 Change
//     const token = sessionStorage.getItem("token"); // 👈 Change

//     if (!token) {
//       // If not logged in, go to Login
//       navigate("/login");
//     } else {
//       try {
//         // Safe Parse
//         const parsedUser = storedUser
//           ? JSON.parse(storedUser)
//           : { name: "User" };
//         setUser(parsedUser);
//       } catch (error) {
//         console.error("User Data Corrupt:", error);
//         localStorage.clear();
//         navigate("/login");
//       }
//     }
//     setLoading(false); // Done loading
//   }, [navigate]);

//   const handleLogout = () => {
//     // localStorage.clear();
//     // toast.info("Logged out successfully");
//     // navigate("/login");
//     sessionStorage.clear(); // 👈 Change
//     toast.info("Logged out successfully");
//     navigate("/login");
//   };

//   // 2. Loading State
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="text-xl font-bold text-indigo-600 animate-pulse">
//           Loading Dashboard...
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen dynamic-bg font-sans">
//       {/* NAVBAR */}
//       <nav className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-lg shadow-sm border-b border-gray-200/50 dark:border-gray-800/50 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
//         <div className="flex items-center gap-2">
//           <span className="text-2xl">🚗</span>
//           <h1 className="text-xl font-extrabold text-gray-900 dark:text-white tracking-tight">
//             AutoLease AI
//           </h1>
//         </div>

//         <div className="flex items-center gap-4">
//           <span className="text-gray-600 dark:text-gray-300 font-medium hidden sm:block">
//             Welcome,{" "}
//             <span className="text-indigo-600 dark:text-indigo-400 font-bold">{user.name}</span>
//           </span>
//           <button
//             onClick={handleLogout}
//             className="text-sm border border-red-200 text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition"
//           >
//             Logout
//           </button>
//         </div>
//       </nav>

//       {/* HERO SECTION */}
//       <div className="bg-indigo-700/90 dark:bg-indigo-900/80 backdrop-blur-md text-white py-12 px-6 text-center shadow-md">
//         <h2 className="text-4xl font-extrabold mb-4 drop-shadow-md">
//           Your Personal Car Buying Assistant
//         </h2>
//         <p className="text-indigo-100 text-lg max-w-2xl mx-auto drop-shadow-sm">
//           Upload contracts, uncover hidden fees, and negotiate like a pro.
//         </p>
//       </div>

//       {/* MAIN CONTENT */}
//       <div className="max-w-6xl mx-auto px-6 -mt-10 pb-12">
//         {/* 3 MAIN CARDS */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <Link
//             to="/upload"
//             className="glass-card p-8 group border-none"
//           >
//             <div className="w-16 h-16 bg-blue-100/80 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">
//               📄
//             </div>
//             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
//               Analyze Contract
//             </h3>
//             <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
//               Extract terms and find junk fees.
//             </p>
//             <span className="text-blue-600 font-bold text-sm flex items-center gap-2">
//               Start Analysis →
//             </span>
//           </Link>

//           <Link
//             to="/compare"
//             className="glass-card p-8 group border-none"
//           >
//             <div className="w-16 h-16 bg-purple-100/80 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">
//               ⚖️
//             </div>
//             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
//               Compare Offers
//             </h3>
//             <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
//               Compare multiple quotes side-by-side.
//             </p>
//             <span className="text-purple-600 font-bold text-sm flex items-center gap-2">
//               Go to Comparison →
//             </span>
//           </Link>

//           <Link
//             to="/email"
//             className="glass-card p-8 group border-none"
//           >
//             <div className="w-16 h-16 bg-green-100/80 dark:bg-green-900/50 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition">
//               ✉️
//             </div>
//             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Negotiator</h3>
//             <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
//               Generate AI counter-offer emails.
//             </p>
//             <span className="text-green-600 font-bold text-sm flex items-center gap-2">
//               Draft Email →
//             </span>
//           </Link>
//         </div>

//         {/* SECONDARY ROW (History + Advice) */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
//           {/* HISTORY BUTTON */}
//           <Link
//             to="/history"
//             className="glass-card p-6 flex items-center justify-between group border-none cursor-pointer"
//           >
//             <div className="flex items-center gap-4">
//               <div className="w-12 h-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-2xl">
//                 📜
//               </div>
//               <div>
//                 <h4 className="font-bold text-gray-900 dark:text-white text-lg">
//                   View History
//                 </h4>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   Access your past uploads
//                 </p>
//               </div>
//             </div>
//             <span className="text-gray-400 font-bold text-xl">➔</span>
//           </Link>

//           <div className="glass-card p-6 flex items-center gap-4 border-none">
//             <div className="w-12 h-12 bg-indigo-200 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-400 rounded-full flex items-center justify-center text-2xl">
//               🤖
//             </div>
//             <div>
//               <h4 className="font-bold text-indigo-900 dark:text-indigo-300 text-lg">
//                 Need Advice?
//               </h4>
//               <p className="text-sm text-indigo-700 dark:text-indigo-400">
//                 Click the chat bubble ↘️ to ask the AI Coach!
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
    const storedUser = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      try {
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
    setLoading(false);
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.clear();
    toast.info("Logged out successfully");
    navigate("/login");
  };

  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#050816" }}
      >
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');
          .loading-pulse { animation: loadpulse 1.4s ease-in-out infinite; }
          @keyframes loadpulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        `}</style>
        <div
          className="loading-pulse"
          style={{
            fontFamily: "'Sora',sans-serif",
            fontSize: "1.1rem",
            fontWeight: 600,
            color: "#a5b4fc",
            letterSpacing: "0.05em",
          }}
        >
          Loading Dashboard…
        </div>
      </div>
    );
  }

  const mainCards = [
    {
      to: "/upload",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      ),
      iconBg: "rgba(59,130,246,0.15)",
      iconColor: "#60a5fa",
      glowColor: "rgba(59,130,246,0.18)",
      borderColor: "rgba(59,130,246,0.2)",
      label: "Analyze Contract",
      desc: "Extract terms and uncover hidden junk fees instantly.",
      cta: "Start Analysis",
      ctaColor: "#60a5fa",
    },
    {
      to: "/compare",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      iconBg: "rgba(139,92,246,0.15)",
      iconColor: "#a78bfa",
      glowColor: "rgba(139,92,246,0.18)",
      borderColor: "rgba(139,92,246,0.2)",
      label: "Compare Offers",
      desc: "Lay multiple quotes side-by-side for a clear winner.",
      cta: "Go to Comparison",
      ctaColor: "#a78bfa",
    },
    {
      to: "/email",
      icon: (
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      ),
      iconBg: "rgba(16,185,129,0.15)",
      iconColor: "#34d399",
      glowColor: "rgba(16,185,129,0.18)",
      borderColor: "rgba(16,185,129,0.2)",
      label: "Negotiator",
      desc: "Generate AI-powered counter-offer emails in seconds.",
      cta: "Draft Email",
      ctaColor: "#34d399",
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .db-root {
          font-family: 'Sora', sans-serif;
          min-height: 100vh;
          background: #050816;
          position: relative;
          overflow-x: hidden;
        }

        /* Orbs */
        .db-orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
          z-index: 0;
          animation: orbdrift 14s ease-in-out infinite alternate;
        }
        .db-orb-1 { width:600px;height:600px; background:radial-gradient(circle,#4f46e5,#1e1b4b); top:-200px;left:-200px; opacity:0.35; animation-delay:0s; }
        .db-orb-2 { width:500px;height:500px; background:radial-gradient(circle,#0ea5e9,#0369a1); bottom:-180px;right:-150px; opacity:0.28; animation-delay:-6s; }
        .db-orb-3 { width:300px;height:300px; background:radial-gradient(circle,#8b5cf6,#6d28d9); top:40%;left:55%; opacity:0.2; animation-delay:-10s; }
        @keyframes orbdrift {
          0%   { transform: translate(0,0) scale(1); }
          100% { transform: translate(30px,25px) scale(1.06); }
        }

        .db-grid {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
          background-size: 48px 48px;
        }

        /* Navbar */
        .db-nav {
          position: sticky; top: 0; z-index: 50;
          background: rgba(5,8,22,0.75);
          border-bottom: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          padding: 0 2rem;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .db-nav-logo {
          display: flex; align-items: center; gap: 10px;
        }
        .db-nav-logo-icon {
          width: 36px; height: 36px;
          background: linear-gradient(135deg, #6c63ff, #4f46e5);
          border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px;
          box-shadow: 0 4px 16px rgba(108,99,255,0.35);
        }
        .db-nav-title {
          font-size: 1.1rem; font-weight: 700;
          color: #fff; letter-spacing: -0.02em;
        }
        .db-nav-right { display: flex; align-items: center; gap: 14px; }
        .db-welcome {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.875rem;
          color: rgba(255,255,255,0.45);
        }
        .db-welcome span { color: #a5b4fc; font-weight: 600; }

        .db-avatar {
          width: 34px; height: 34px; border-radius: 50%;
          background: linear-gradient(135deg, #6c63ff, #4f46e5);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem; font-weight: 700; color: #fff;
          border: 2px solid rgba(108,99,255,0.4);
          flex-shrink: 0;
        }

        .db-logout-btn {
          display: flex; align-items: center; gap: 6px;
          background: rgba(239,68,68,0.1);
          border: 1px solid rgba(239,68,68,0.25);
          color: #f87171;
          font-family: 'Sora', sans-serif;
          font-size: 0.8rem; font-weight: 600;
          padding: 7px 14px; border-radius: 10px;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s, transform 0.15s;
        }
        .db-logout-btn:hover {
          background: rgba(239,68,68,0.18);
          border-color: rgba(239,68,68,0.45);
          transform: translateY(-1px);
        }

        /* Hero */
        .db-hero {
          position: relative; z-index: 1;
          text-align: center;
          padding: 4rem 1.5rem 6rem;
        }
        .db-hero-badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(108,99,255,0.14);
          border: 1px solid rgba(108,99,255,0.3);
          border-radius: 999px;
          padding: 5px 16px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.08em;
          color: #a5b4fc; text-transform: uppercase;
          margin-bottom: 1.5rem;
        }
        .db-hero-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #6c63ff; box-shadow: 0 0 6px #6c63ff;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }

        .db-hero-title {
          font-size: clamp(2rem, 5vw, 3.2rem);
          font-weight: 800; color: #fff;
          letter-spacing: -0.04em; line-height: 1.1;
          margin-bottom: 1rem;
        }
        .db-hero-title span {
          background: linear-gradient(135deg, #818cf8, #6c63ff, #a78bfa);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .db-hero-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 1rem; color: rgba(255,255,255,0.45);
          max-width: 480px; margin: 0 auto;
          line-height: 1.65;
        }

        /* Content */
        .db-content {
          position: relative; z-index: 1;
          max-width: 1100px; margin: 0 auto;
          padding: 0 1.5rem 4rem;
          margin-top: -3rem;
        }

        /* Section label */
        .db-section-label {
          font-size: 0.7rem; font-weight: 600;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          margin-bottom: 1rem;
          padding-left: 2px;
        }

        /* Main cards grid */
        .db-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.25rem;
          margin-bottom: 1.5rem;
        }

        .db-main-card {
          position: relative;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 22px;
          padding: 2rem;
          text-decoration: none;
          display: flex; flex-direction: column;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s, background 0.22s;
          overflow: hidden;
          animation: cardFadeIn 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        .db-main-card:nth-child(1) { animation-delay: 0.05s; }
        .db-main-card:nth-child(2) { animation-delay: 0.12s; }
        .db-main-card:nth-child(3) { animation-delay: 0.19s; }
        @keyframes cardFadeIn {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .db-main-card::before {
          content:''; position:absolute;
          top:0; left:10%; right:10%; height:1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
        }
        .db-main-card:hover {
          transform: translateY(-5px);
          background: rgba(255,255,255,0.065);
        }

        .db-card-icon-wrap {
          width: 54px; height: 54px; border-radius: 16px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.4rem;
          transition: transform 0.2s;
        }
        .db-main-card:hover .db-card-icon-wrap { transform: scale(1.1); }

        .db-card-title {
          font-size: 1.1rem; font-weight: 700;
          color: #fff; letter-spacing: -0.02em;
          margin-bottom: 0.5rem;
        }
        .db-card-desc {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.855rem; color: rgba(255,255,255,0.42);
          line-height: 1.6; flex: 1; margin-bottom: 1.5rem;
        }
        .db-card-cta {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 0.8rem; font-weight: 700;
          letter-spacing: 0.02em;
          transition: gap 0.2s;
        }
        .db-main-card:hover .db-card-cta { gap: 10px; }

        /* Bottom row */
        .db-bottom-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1.25rem;
        }

        .db-bottom-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 18px;
          padding: 1.4rem 1.6rem;
          display: flex; align-items: center; gap: 1rem;
          text-decoration: none;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          transition: transform 0.2s, background 0.2s;
          animation: cardFadeIn 0.6s cubic-bezier(0.22,1,0.36,1) both;
        }
        .db-bottom-card:nth-child(1) { animation-delay: 0.26s; }
        .db-bottom-card:nth-child(2) { animation-delay: 0.32s; }
        .db-bottom-card:hover { transform: translateY(-3px); background: rgba(255,255,255,0.06); }

        .db-bottom-icon {
          width: 46px; height: 46px; border-radius: 13px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .db-bottom-card-title {
          font-size: 0.95rem; font-weight: 700; color: #fff;
          letter-spacing: -0.01em; margin-bottom: 2px;
        }
        .db-bottom-card-sub {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.8rem; color: rgba(255,255,255,0.38);
        }
        .db-bottom-arrow {
          margin-left: auto; color: rgba(255,255,255,0.2);
          transition: color 0.2s, transform 0.2s;
          flex-shrink: 0;
        }
        .db-bottom-card:hover .db-bottom-arrow { color: rgba(255,255,255,0.5); transform: translateX(3px); }
      `}</style>

      <div className="db-root">
        <div className="db-orb db-orb-1" />
        <div className="db-orb db-orb-2" />
        <div className="db-orb db-orb-3" />
        <div className="db-grid" />

        {/* NAVBAR */}
        <nav className="db-nav">
          <div className="db-nav-logo">
            <div className="db-nav-logo-icon">🚗</div>
            <span className="db-nav-title">AutoLease AI</span>
          </div>
          <div className="db-nav-right">
            <span
              className="db-welcome"
              style={{ display: "none" }}
              id="db-welcome-sm"
            >
              Welcome, <span>{user.name}</span>
            </span>
            <span className="db-welcome hidden sm:block">
              Welcome, <span>{user.name}</span>
            </span>
            <div className="db-avatar">
              {user.name?.[0]?.toUpperCase() || "U"}
            </div>
            <button onClick={handleLogout} className="db-logout-btn">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Logout
            </button>
          </div>
        </nav>

        {/* HERO */}
        <div className="db-hero">
          <div>
            <span className="db-hero-badge">
              <span className="db-hero-dot" />
              AI-Powered Assistant
            </span>
          </div>
          <h2 className="db-hero-title">
            Your Personal
            <br />
            <span>Car Buying Assistant</span>
          </h2>
          <p className="db-hero-sub">
            Upload contracts, uncover hidden fees, and negotiate like a pro.
          </p>
        </div>

        {/* MAIN CONTENT */}
        <div className="db-content">
          <p className="db-section-label">Quick Actions</p>

          {/* 3 MAIN CARDS */}
          <div className="db-cards-grid">
            {mainCards.map((card) => (
              <Link
                key={card.to}
                to={card.to}
                className="db-main-card"
                style={{
                  "--card-glow": card.glowColor,
                  "--card-border": card.borderColor,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = card.borderColor;
                  e.currentTarget.style.boxShadow = `0 12px 40px ${card.glowColor}, 0 0 0 1px ${card.borderColor}`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  className="db-card-icon-wrap"
                  style={{ background: card.iconBg, color: card.iconColor }}
                >
                  {card.icon}
                </div>
                <div className="db-card-title">{card.label}</div>
                <div className="db-card-desc">{card.desc}</div>
                <span className="db-card-cta" style={{ color: card.ctaColor }}>
                  {card.cta}
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            ))}
          </div>

          <p className="db-section-label" style={{ marginTop: "2rem" }}>
            More Tools
          </p>

          {/* SECONDARY ROW */}
          <div className="db-bottom-grid">
            <Link
              to="/history"
              className="db-bottom-card"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
              }}
            >
              <div
                className="db-bottom-icon"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <div className="db-bottom-card-title">View History</div>
                <div className="db-bottom-card-sub">
                  Access your past uploads
                </div>
              </div>
              <svg
                className="db-bottom-arrow"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>

            <div className="db-bottom-card" style={{ cursor: "default" }}>
              <div
                className="db-bottom-icon"
                style={{
                  background: "rgba(108,99,255,0.15)",
                  color: "#a5b4fc",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2a10 10 0 1 0 10 10" />
                  <path d="M12 8v4l3 3" />
                  <circle
                    cx="18"
                    cy="6"
                    r="3"
                    fill="currentColor"
                    stroke="none"
                    opacity="0.6"
                  />
                  <path
                    d="M16.5 6h3M18 4.5v3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <div>
                <div
                  className="db-bottom-card-title"
                  style={{ color: "#c4b5fd" }}
                >
                  Need Advice?
                </div>
                <div className="db-bottom-card-sub">
                  Click the chat bubble ↘ to ask the AI Coach!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
