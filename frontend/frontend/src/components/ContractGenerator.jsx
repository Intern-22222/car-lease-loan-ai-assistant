import React, { useState } from "react";
import jsPDF from "jspdf";
import { toast } from "react-toastify";

const ContractGenerator = () => {
  const [mode, setMode] = useState("initial"); // 'initial', 'manual'

  // Default Data (Used for Auto-Generate & Initial Form State)
  const defaultData = {
    lender: "AutoFinance Pro Ltd.",
    borrower: "Rahul Sharma",
    date: new Date().toLocaleDateString("en-GB"),
    make: "TOYOTA",
    model: "CAMRY HYBRID",
    year: "2024",
    vin: "4T1B11HK8EU123456",
    loanAmount: "15,00,000",
    interestRate: "10.5",
    term: "60",
    emi: "32,250",
    downPayment: "2,00,000",
    residualValue: "6,50,000",
    mileage: "12,000 km per year",
    terminationFee: "50,000",
    buyoutPrice: "6,60,000",
    maintenance: "Borrower responsible for oil changes & service.",
    warranty: "3-Year / 36,000 km Manufacturer Warranty",
    lateFee: "5% of unpaid EMI after 5 days",
  };

  const [formData, setFormData] = useState(defaultData);

  // --- PDF GENERATION LOGIC ---
  const generatePDF = (dataToUse) => {
    const doc = new jsPDF();
    const data = dataToUse || formData;

    // 1. HEADER
    doc.setFontSize(18);
    doc.text("VEHICLE LEASE & LOAN AGREEMENT", 105, 20, null, null, "center");

    doc.setFontSize(12);
    doc.text(`LENDER: ${data.lender}`, 20, 40);
    doc.text(`BORROWER: ${data.borrower}`, 20, 50);
    doc.text(`DATE: ${data.date}`, 150, 40);

    // 2. VEHICLE DETAILS
    doc.setFontSize(14);
    doc.text("1. VEHICLE DETAILS", 20, 70);
    doc.setFontSize(10);
    doc.text(
      `Make: ${data.make} | Model: ${data.model} | Year: ${data.year}`,
      20,
      80,
    );
    doc.text(`VIN: ${data.vin}`, 20, 86);

    // 3. FINANCIAL TERMS
    doc.setFontSize(14);
    doc.text("2. FINANCIAL TERMS", 20, 100);
    doc.setFontSize(10);
    doc.text(`Total Loan Amount: Rs ${data.loanAmount}`, 20, 110);
    doc.text(`Interest Rate (APR): ${data.interestRate}%`, 20, 116);
    doc.text(`Lease Term: ${data.term} Months`, 20, 122);
    doc.text(`Monthly Payment (EMI): Rs ${data.emi}`, 20, 128);

    // 4. ADDITIONAL TERMS
    doc.setFontSize(14);
    doc.text("3. ADDITIONAL TERMS & CONDITIONS", 20, 145);
    doc.setFontSize(10);

    doc.text(
      `- Down Payment: Rs ${data.downPayment} received on signing.`,
      20,
      155,
    );
    doc.text(
      `- Residual Value: Estimated value at lease end is Rs ${data.residualValue}.`,
      20,
      162,
    );
    doc.text(
      `- Mileage Allowance: ${data.mileage}. Excess charged per km.`,
      20,
      169,
    );
    doc.text(
      `- Early Termination: Penalty of Rs ${data.terminationFee} applies.`,
      20,
      176,
    );
    doc.text(
      `- Purchase Option: Buyout Price is Rs ${data.buyoutPrice}.`,
      20,
      183,
    );
    doc.text(`- Maintenance: ${data.maintenance}`, 20, 190);
    doc.text(`- Warranty: ${data.warranty}`, 20, 197);
    doc.text(`- Late Fees: ${data.lateFee}`, 20, 204);

    // Save File
    doc.save(`Contract_${data.borrower.replace(/\s/g, "_")}.pdf`);
    toast.success("PDF Downloaded Successfully!");
  };

  // Handle Input Changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-8 overflow-hidden transition-all duration-300">
      {/* HEADER SECTION */}
      <div className="p-6 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">
            📝 Contract Generator Tool
          </h3>
          <p className="text-sm text-gray-500">
            Create a test PDF automatically or manually.
          </p>
        </div>
        {mode === "manual" && (
          <button
            onClick={() => setMode("initial")}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Cancel
          </button>
        )}
      </div>

      {/* BODY SECTION */}
      <div className="p-6">
        {/* MODE 1: INITIAL BUTTONS */}
        {mode === "initial" && (
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => generatePDF(defaultData)}
              className="flex-1 bg-gray-800 text-white px-4 py-3 rounded-lg font-bold hover:bg-gray-900 transition flex items-center justify-center gap-2"
            >
              ⚡ Automatic Generate (Test Data)
            </button>
            <button
              onClick={() => setMode("manual")}
              className="flex-1 bg-white border-2 border-indigo-600 text-indigo-600 px-4 py-3 rounded-lg font-bold hover:bg-indigo-50 transition flex items-center justify-center gap-2"
            >
              ✍️ Manual Write
            </button>
          </div>
        )}

        {/* MODE 2: MANUAL FORM */}
        {mode === "manual" && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Basic Info */}
              <input
                name="lender"
                value={formData.lender}
                onChange={handleChange}
                placeholder="Lender Name"
                className="border p-2 rounded"
              />
              <input
                name="borrower"
                value={formData.borrower}
                onChange={handleChange}
                placeholder="Borrower Name"
                className="border p-2 rounded"
              />
              <input
                name="make"
                value={formData.make}
                onChange={handleChange}
                placeholder="Car Make"
                className="border p-2 rounded"
              />
              <input
                name="model"
                value={formData.model}
                onChange={handleChange}
                placeholder="Car Model"
                className="border p-2 rounded"
              />

              {/* Financials */}
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-400">Rs</span>
                <input
                  name="loanAmount"
                  value={formData.loanAmount}
                  onChange={handleChange}
                  placeholder="Loan Amount"
                  className="border p-2 pl-8 rounded w-full"
                />
              </div>
              <div className="relative">
                <input
                  name="interestRate"
                  value={formData.interestRate}
                  onChange={handleChange}
                  placeholder="Interest Rate"
                  className="border p-2 pr-8 rounded w-full"
                />
                <span className="absolute right-3 top-2 text-gray-400">%</span>
              </div>

              {/* Other Terms */}
              <input
                name="warranty"
                value={formData.warranty}
                onChange={handleChange}
                placeholder="Warranty Terms"
                className="border p-2 rounded md:col-span-2"
              />
              <input
                name="maintenance"
                value={formData.maintenance}
                onChange={handleChange}
                placeholder="Maintenance Terms"
                className="border p-2 rounded md:col-span-2"
              />
            </div>

            <button
              onClick={() => generatePDF(formData)}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition shadow-md flex items-center justify-center gap-2"
            >
              💾 Save & Download PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContractGenerator;
