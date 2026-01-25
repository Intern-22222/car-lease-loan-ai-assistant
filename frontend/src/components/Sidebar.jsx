import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg p-6 hidden md:block">
      <h2>
        <button
              onClick={() => navigate("/dashboard")}
              className="text-2xl font-bold mb-10 text-center"
            >
              ⚙️ Dashboard
            </button>
      </h2>

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
  );
};

export default Sidebar;
