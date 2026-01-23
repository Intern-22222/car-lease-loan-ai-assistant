import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

function Dashboard() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  const [stats, setStats] = useState({
    uploads: Number(localStorage.getItem("uploads")) || 0,
    predictions: Number(localStorage.getItem("predictions")) || 0,
  });

  // Sync stats when dashboard loads
  useEffect(() => {
    setStats({
      uploads: Number(localStorage.getItem("uploads")) || 0,
      predictions: Number(localStorage.getItem("predictions")) || 0,
    });
  }, []);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg p-6 hidden md:block">
          <h2 className="text-2xl font-bold mb-10 text-center">⚙️ Dashboard</h2>

          <div className="space-y-4">
            <button
              onClick={() => navigate("/upload")}
              className="w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Upload
            </button>
            <button
              onClick={() => navigate("/price-estimator")}
              className="w-full py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              Price Predictor
            </button>
            <button
              onClick={() => navigate("/compare-contracts")}
              className="w-full py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
            >
              Compare Contracts
            </button>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          <header className="flex justify-between items-center px-8 py-4 bg-white dark:bg-gray-800 shadow">
            <h1 className="text-xl font-bold">Contract Analyzer Platform</h1>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </header>

          <main className="p-10">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 text-center">
                <h3 className="text-lg font-semibold">Contracts Uploaded</h3>
                <p className="text-4xl font-bold text-blue-600">
                  {stats.uploads}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 text-center">
                <h3 className="text-lg font-semibold">Predictions Made</h3>
                <p className="text-4xl font-bold text-green-600">
                  {stats.predictions}
                </p>
              </div>
            </div>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-blue-50 dark:bg-gray-800 rounded-3xl p-10 shadow-lg text-center cursor-pointer"
                onClick={() => navigate("/upload")}
              >
                <div className="text-6xl mb-4">📄</div>
                <h3 className="text-xl font-bold">Upload Contract</h3>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-green-50 dark:bg-gray-800 rounded-3xl p-10 shadow-lg text-center cursor-pointer"
                onClick={() => navigate("/price-estimator")}
              >
                <div className="text-6xl mb-4">📊</div>
                <h3 className="text-xl font-bold">Price Predictor</h3>
              </motion.div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
