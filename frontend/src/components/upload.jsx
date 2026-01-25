
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// /* ---------------- Copy Button Component ---------------- */
// const CopyButton = ({ text }) => {
//   const [copied, setCopied] = useState(false);

//   const handleCopy = async () => {
//     try {
//       await navigator.clipboard.writeText(text);
//       setCopied(true);
//       setTimeout(() => setCopied(false), 1500);
//     } catch (err) {
//       alert("Failed to copy");
//     }
//   };

//   return (
//     <button
//       onClick={handleCopy}
//       className="ml-2 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-sm"
//     >
//       {copied ? "✅ Copied" : "📋 Copy VIN"}
//     </button>
//   );
// };
// /* ------------------------------------------------------- */

// const Upload = () => {
//   const [file, setFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [response, setResponse] = useState(null);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//     setResponse(null);
//     setError("");
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setError("Please select a file first");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("file", file);

//     try {
//       setLoading(true);

//       const res = await fetch("http://127.0.0.1:8000/uploadfile", {
//         method: "POST",
//         body: formData,
//       });

//       if (!res.ok) {
//         throw new Error("Upload failed");
//       }

//       const data = await res.json();
//       setResponse(data);

//       const currentUploads =
//         Number(localStorage.getItem("uploads")) || 0;
//       localStorage.setItem("uploads", currentUploads + 1);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ safely extract VIN from response
//   const vin =
//     response?.vin ||
//     response?.extracted_contract?.vehicle?.vin;

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
//       <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg text-center">
//         <h2 className="text-2xl font-bold mb-4">
//           Upload Contract Document
//         </h2>

//         <input
//           type="file"
//           accept=".pdf,.png,.jpg,.jpeg"
//           onChange={handleFileChange}
//           className="border p-2 w-full rounded mb-4"
//         />

//         <button
//           onClick={handleUpload}
//           disabled={loading}
//           className="bg-blue-600 text-white px-6 py-2 rounded-lg w-full hover:bg-blue-700 transition disabled:opacity-50"
//         >
//           {loading ? "Uploading..." : "Upload"}
//         </button>

//         {error && (
//           <p className="text-red-500 mt-4">{error}</p>
//         )}

//         {response && (
//           <div className="mt-6 text-left">
//             <h3 className="font-semibold mb-2 flex items-center">
//               Extracted Data Preview / SLA Summary
//               {vin && <CopyButton text={vin} />}
//             </h3>

//             <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm">
//               {JSON.stringify(response, null, 2)}
//             </pre>

//             <button
//               onClick={() => navigate("/dashboard")}
//               className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
//             >
//               Go to Dashboard
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Upload;




import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

/* ---------------- Copy Button ---------------- */
 const CopyButton = ({ text }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      alert("Failed to copy");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="ml-2 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded text-sm"
    >
      {copied ? "✅ Copied" : "📋 Copy VIN"}
    </button>
  );
};




const Upload = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch("http://127.0.0.1:8000/uploadfile", {
        method: "POST",
        body: formData,
      });
      setResponse(await res.json());

      // const currentUploads =
      //   Number(localStorage.getItem("uploads")) || 0;
      // localStorage.setItem("uploads", currentUploads + 1);

      const wasJustReset = localStorage.getItem("just_reset");

if (wasJustReset === "true") {
  // First prediction after reset — don't increment
  localStorage.setItem("just_reset", "false");
} else {
  const uploads =
    Number(localStorage.getItem("uploads")) || 0;
  localStorage.setItem("uploads", uploads + 1);
}
    } catch {
      setError("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const vin =
    response?.vin ||
    response?.extracted_contract?.vehicle?.vin;

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">

        {/* 🔹 Sidebar */}
        <Sidebar />

        {/* 🔹 Main */}
        <div className="flex-1">
          {/* Header */}
          <header className="flex justify-between items-center px-8 py-4 bg-white dark:bg-gray-800 shadow">
            <h1 className="text-xl font-bold">
              Upload Contract
            </h1>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700"
            >
              {darkMode ? "☀️ Light" : "🌙 Dark"}
            </button>
          </header>

          {/* Content */}
          <main className="p-10">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow p-8 max-w-3xl mx-auto">

              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full p-3 border rounded mb-4 dark:bg-gray-700"
              />

              <button
                onClick={handleUpload}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                {loading ? "Uploading..." : "Upload"}
              </button>

              {error && (
                <p className="text-red-500 mt-4">{error}</p>
              )}

              {response && (
                <div className="mt-6">
                  <h3 className="font-semibold flex items-center">
                    Extracted Data
                    {vin && <CopyButton text={vin} />}
                  </h3>

                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded mt-3 text-sm overflow-x-auto">
                    {JSON.stringify(response, null, 2)}
                  </pre>

                  <button
                    onClick={() => navigate("/dashboard")}
                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
                  >
                    Go to Dashboard
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Upload;
