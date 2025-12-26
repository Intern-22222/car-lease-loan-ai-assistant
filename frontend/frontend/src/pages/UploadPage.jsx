import React, { useState } from "react";
const UploadPage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [ocrText, setOcrText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [extractedFields, setExtractedFields] = useState({
    loanAmount: "",
    interestRate: "",
    tenure: "",
    emi: "",
  });

  const extractFieldsFromText = (text) => {
    let fields = {
      loanAmount: "",
      interestRate: "",
      tenure: "",
      emi: "",
    };
    const amountMatch = text.match(/Loan Amount\s*INR\s*([\d,]+)/i);
    if (amountMatch) {
      fields.loanAmount = "₹" + amountMatch[1];
    }
    const rateMatch =
      text.match(/(?:interest|nterest|terest)\s*rate\s*([\d.]+)%/i) ||
      text.match(/([\d.]+)%\s*per\s*annum/i);
    if (rateMatch) {
      fields.interestRate = rateMatch[1] + "%";
    }
    const tenureMatch = text.match(/tenure\s*([\d]+)\s*months/i);
    if (tenureMatch) {
      fields.tenure = tenureMatch[1] + " months";
    }
    const emiMatch =
      text.match(/EMI\S*\s*INR\s*([\d.,]+)/i) ||
      text.match(/INR\s*([\d.,]+)\s*each/i) ||
      text.match(/EMI\S*[^0-9]*([\d.,]+)/i);
    if (emiMatch) {
      const cleanValue = emiMatch[1].replace(/[,\.]/g, "");
      fields.emi = "₹" + cleanValue;
    }
    setExtractedFields(fields);
  };
  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);

    setTimeout(() => {
      setMessage("");
      setMessageType("");
    }, 3000);
  };

  const HandleUpdate = () => {
    if (!selectedFile) {
      showMessage("Please select a PDF first", "error");
      return;
    }
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    fetch("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (!data.success) {
          showMessage("OCR failed on server", "error");
          return;
        }
        setOcrText(data.rawText);
        showMessage("OCR extracted successfully!", "success");
        extractFieldsFromText(data.rawText);
        setIsUploading(false);
      })
      .catch((error) => {
        console.error("Upload error:", error);
        showMessage("Upload failed. Please try again.", "error");
        setIsUploading(false);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      {message && (
        <div
          className={`fixed top-6 right-6 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium
          ${messageType === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          {message}
        </div>
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          PDF OCR Extractor
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Upload your document to extract text instantly
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200 sm:rounded-xl sm:px-10 border border-gray-100">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Document
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-indigo-500 hover:bg-gray-50 transition-colors duration-200 relative group cursor-pointer">
                <div className="space-y-1 text-center">
                  {/* Icon */}
                  <div className="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-500 transition-colors">
                    <svg
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-transparent rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                    >
                      <span>Upload a PDF</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        accept="application/pdf"
                        className="sr-only"
                        onChange={(event) =>
                          setSelectedFile(event.target.files[0])
                        }
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF up to 10MB</p>
                </div>
              </div>
            </div>

            {selectedFile && (
              <div className="flex items-center p-3 bg-indigo-50 text-indigo-700 rounded-lg text-sm animate-fade-in">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  ></path>
                </svg>
                <span className="truncate font-medium">
                  {selectedFile.name}
                </span>
              </div>
            )}

            <button
              onClick={HandleUpdate}
              disabled={isUploading}
              className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ${
                isUploading ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isUploading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "Extract Text"
              )}
            </button>
          </div>

          <div className="mt-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Key Loan Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white shadow rounded-lg p-4 border">
                <p className="text-sm text-gray-500">Loan Amount</p>
                <p className="text-xl font-bold">
                  {extractedFields.loanAmount || "—"}
                </p>
              </div>
              <div className="bg-white shadow rounded-lg p-4 border">
                <p className="text-sm text-gray-500">Interest Rate</p>
                <p className="text-xl font-bold">
                  {extractedFields.interestRate || "—"}
                </p>
              </div>
              <div className="bg-white shadow rounded-lg p-4 border">
                <p className="text-sm text-gray-500">Tenure</p>
                <p className="text-xl font-bold">
                  {extractedFields.tenure || "—"}
                </p>
              </div>

              <div className="bg-white shadow rounded-lg p-4 border">
                <p className="text-sm text-gray-500">Monthly EMI</p>
                <p className="text-xl font-bold">
                  {extractedFields.emi || "—"}
                </p>
              </div>
            </div>
          </div>

          {ocrText && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-900">
                  OCR Result
                </h3>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full font-medium">
                  Success
                </span>
              </div>
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-linear-to-r from-indigo-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-gray-900 rounded-lg p-4 max-h-96 overflow-auto custom-scrollbar">
                  <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono leading-relaxed">
                    {ocrText}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
