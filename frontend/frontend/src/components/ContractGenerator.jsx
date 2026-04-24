



import React, { useState } from "react";
import jsPDF from "jspdf";
import { toast } from "react-toastify";

const ContractGenerator = () => {
  const [mode, setMode] = useState("initial");

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
  const [focused, setFocused] = useState({});

  const generatePDF = (dataToUse) => {
    const doc = new jsPDF();
    const data = dataToUse || formData;
    doc.setFontSize(18);
    doc.text("VEHICLE LEASE & LOAN AGREEMENT", 105, 20, null, null, "center");
    doc.setFontSize(12);
    doc.text(`LENDER: ${data.lender}`, 20, 40);
    doc.text(`BORROWER: ${data.borrower}`, 20, 50);
    doc.text(`DATE: ${data.date}`, 150, 40);
    doc.setFontSize(14);
    doc.text("1. VEHICLE DETAILS", 20, 70);
    doc.setFontSize(10);
    doc.text(
      `Make: ${data.make} | Model: ${data.model} | Year: ${data.year}`,
      20,
      80,
    );
    doc.text(`VIN: ${data.vin}`, 20, 86);
    doc.setFontSize(14);
    doc.text("2. FINANCIAL TERMS", 20, 100);
    doc.setFontSize(10);
    doc.text(`Total Loan Amount: Rs ${data.loanAmount}`, 20, 110);
    doc.text(`Interest Rate (APR): ${data.interestRate}%`, 20, 116);
    doc.text(`Lease Term: ${data.term} Months`, 20, 122);
    doc.text(`Monthly Payment (EMI): Rs ${data.emi}`, 20, 128);
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
    doc.save(`Contract_${data.borrower.replace(/\s/g, "_")}.pdf`);
    toast.success("PDF Downloaded Successfully!");
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const fo = (k) => ({
    onFocus: () => setFocused((f) => ({ ...f, [k]: true })),
    onBlur: () => setFocused((f) => ({ ...f, [k]: false })),
  });

  const fields = [
    {
      name: "lender",
      placeholder: "Lender Name",
      icon: (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="9" width="18" height="11" rx="2" />
          <path d="M3 9l9-6 9 6" />
        </svg>
      ),
    },
    {
      name: "borrower",
      placeholder: "Borrower Name",
      icon: (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      name: "make",
      placeholder: "Car Make",
      icon: (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="1" y="3" width="15" height="13" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
          <circle cx="5.5" cy="18.5" r="2.5" />
          <circle cx="18.5" cy="18.5" r="2.5" />
        </svg>
      ),
    },
    {
      name: "model",
      placeholder: "Car Model",
      icon: (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
    },
    {
      name: "loanAmount",
      placeholder: "Loan Amount",
      prefix: "₹",
      icon: (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      name: "interestRate",
      placeholder: "Interest Rate",
      suffix: "%",
      icon: (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="5" x2="5" y2="19" />
          <circle cx="6.5" cy="6.5" r="2.5" />
          <circle cx="17.5" cy="17.5" r="2.5" />
        </svg>
      ),
    },
    {
      name: "warranty",
      placeholder: "Warranty Terms",
      span: true,
      icon: (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      name: "maintenance",
      placeholder: "Maintenance Terms",
      span: true,
      icon: (
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700&family=DM+Sans:wght@300;400;500&display=swap');

        .cg-wrap {
          margin-top: 2rem;
          border-radius: 20px;
          overflow: hidden;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          box-shadow: 0 16px 48px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.03) inset;
          position: relative;
          font-family: 'Sora', sans-serif;
          animation: cg-in 0.5s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes cg-in { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        .cg-wrap::before { content:'';position:absolute;top:0;left:8%;right:8%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent); }

        /* Header */
        .cg-header {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          background: rgba(108,99,255,0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }
        .cg-header-left { display:flex;align-items:center;gap:10px; }
        .cg-header-icon { width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#6c63ff,#4f46e5);display:flex;align-items:center;justify-content:center;color:#fff;flex-shrink:0;box-shadow:0 4px 12px rgba(108,99,255,0.3); }
        .cg-header-title { font-size:0.9rem;font-weight:700;color:#fff;letter-spacing:-0.01em; }
        .cg-header-sub { font-family:'DM Sans',sans-serif;font-size:0.75rem;color:rgba(255,255,255,0.38); }
        .cg-cancel { background:none;border:none;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:0.78rem;color:rgba(255,255,255,0.35);text-decoration:underline;transition:color 0.2s; }
        .cg-cancel:hover { color:rgba(255,255,255,0.6); }

        /* Body */
        .cg-body { padding: 1.5rem; }

        /* Mode buttons */
        .cg-mode-grid { display:grid;grid-template-columns:1fr 1fr;gap:10px; }
        .cg-mode-btn {
          padding:14px 12px;border-radius:14px;border:none;cursor:pointer;
          display:flex;flex-direction:column;align-items:center;justify-content:center;gap:7px;
          font-family:'Sora',sans-serif;font-size:0.82rem;font-weight:600;
          transition:transform 0.18s,box-shadow 0.18s,border-color 0.2s;
          position:relative;overflow:hidden;
        }
        .cg-mode-btn::before { content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent);transition:left 0.5s; }
        .cg-mode-btn:hover::before { left:100%; }

        .cg-mode-auto {
          background:linear-gradient(135deg,#6c63ff,#4f46e5);
          color:#fff;
          box-shadow:0 4px 20px rgba(108,99,255,0.35);
        }
        .cg-mode-auto:hover { transform:translateY(-2px);box-shadow:0 8px 28px rgba(108,99,255,0.5); }

        .cg-mode-manual {
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(108,99,255,0.3);
          color:#a5b4fc;
        }
        .cg-mode-manual:hover { transform:translateY(-2px);background:rgba(108,99,255,0.08);border-color:rgba(108,99,255,0.5); }

        .cg-mode-icon { width:32px;height:32px;border-radius:9px;display:flex;align-items:center;justify-content:center; }
        .cg-mode-auto .cg-mode-icon { background:rgba(255,255,255,0.15); }
        .cg-mode-manual .cg-mode-icon { background:rgba(108,99,255,0.15);border:1px solid rgba(108,99,255,0.25); }
        .cg-mode-label { font-size:0.82rem; }
        .cg-mode-hint { font-family:'DM Sans',sans-serif;font-size:0.7rem;opacity:0.65; }

        /* Form */
        .cg-form-grid { display:grid;grid-template-columns:1fr;gap:10px;margin-bottom:1.25rem; }
        @media(min-width:520px) { .cg-form-grid { grid-template-columns:1fr 1fr; } }
        .cg-span { grid-column:1/-1; }

        .cg-field-group {}
        .cg-label { display:block;font-size:9px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;margin-bottom:5px;transition:color 0.2s; }
        .cg-label.active { color:#a5b4fc; }
        .cg-label:not(.active) { color:rgba(255,255,255,0.3); }

        .cg-input-wrap { position:relative; }
        .cg-icon { position:absolute;left:12px;top:50%;transform:translateY(-50%);pointer-events:none;display:flex;align-items:center;color:rgba(255,255,255,0.22);transition:color 0.2s; }
        .cg-icon.active { color:#6c63ff; }
        .cg-prefix { position:absolute;left:34px;top:50%;transform:translateY(-50%);font-family:'DM Sans',sans-serif;font-size:0.8rem;color:rgba(255,255,255,0.3);pointer-events:none; }
        .cg-suffix { position:absolute;right:12px;top:50%;transform:translateY(-50%);font-family:'DM Sans',sans-serif;font-size:0.8rem;color:rgba(255,255,255,0.3);pointer-events:none; }

        .cg-input {
          width:100%;padding:10px 12px 10px 34px;
          background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);
          border-radius:11px;color:#fff;
          font-family:'DM Sans',sans-serif;font-size:0.82rem;
          outline:none;transition:border-color 0.25s,background 0.25s,box-shadow 0.25s;
          -webkit-text-fill-color:#fff;
        }
        .cg-input::placeholder { color:rgba(255,255,255,0.2); }
        .cg-input:focus { border-color:rgba(108,99,255,0.65);background:rgba(108,99,255,0.07);box-shadow:0 0 0 3px rgba(108,99,255,0.12); }
        .cg-input:-webkit-autofill { -webkit-box-shadow:0 0 0 1000px rgba(20,16,50,0.98) inset;-webkit-text-fill-color:#fff !important; }
        .cg-input.has-prefix { padding-left:48px; }
        .cg-input.has-suffix { padding-right:30px; }

        /* Save button */
        .cg-save-btn {
          width:100%;padding:13px;border-radius:13px;border:none;cursor:pointer;
          font-family:'Sora',sans-serif;font-size:0.9rem;font-weight:600;color:#fff;
          background:linear-gradient(135deg,#10b981,#059669);
          display:flex;align-items:center;justify-content:center;gap:8px;
          position:relative;overflow:hidden;
          transition:transform 0.18s,box-shadow 0.18s;
          box-shadow:0 4px 20px rgba(16,185,129,0.3);
        }
        .cg-save-btn::before { content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);transition:left 0.5s; }
        .cg-save-btn:hover::before { left:100%; }
        .cg-save-btn:hover { transform:translateY(-2px);box-shadow:0 8px 28px rgba(16,185,129,0.45); }

        /* Divider */
        .cg-divider { height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.07),transparent);margin:1.25rem 0; }
      `}</style>

      <div className="cg-wrap">
        {/* Header */}
        <div className="cg-header">
          <div className="cg-header-left">
            <div className="cg-header-icon">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>
            <div>
              <div className="cg-header-title">Contract Generator Tool</div>
              <div className="cg-header-sub">
                Create a test PDF automatically or manually
              </div>
            </div>
          </div>
          {mode === "manual" && (
            <button className="cg-cancel" onClick={() => setMode("initial")}>
              Cancel
            </button>
          )}
        </div>

        {/* Body */}
        <div className="cg-body">
          {/* Initial mode */}
          {mode === "initial" && (
            <div className="cg-mode-grid">
              <button
                className="cg-mode-btn cg-mode-auto"
                onClick={() => generatePDF(defaultData)}
              >
                <div className="cg-mode-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </div>
                <span className="cg-mode-label">Auto Generate</span>
                <span className="cg-mode-hint">Use test data</span>
              </button>
              <button
                className="cg-mode-btn cg-mode-manual"
                onClick={() => setMode("manual")}
              >
                <div className="cg-mode-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </div>
                <span className="cg-mode-label">Manual Write</span>
                <span className="cg-mode-hint">Custom details</span>
              </button>
            </div>
          )}

          {/* Manual mode */}
          {mode === "manual" && (
            <>
              <div className="cg-form-grid">
                {fields.map((f) => (
                  <div
                    key={f.name}
                    className={`cg-field-group${f.span ? " cg-span" : ""}`}
                  >
                    <label
                      className={`cg-label${focused[f.name] ? " active" : ""}`}
                    >
                      {f.placeholder}
                    </label>
                    <div className="cg-input-wrap">
                      <span
                        className={`cg-icon${focused[f.name] ? " active" : ""}`}
                      >
                        {f.icon}
                      </span>
                      {f.prefix && (
                        <span className="cg-prefix">{f.prefix}</span>
                      )}
                      <input
                        name={f.name}
                        value={formData[f.name]}
                        onChange={handleChange}
                        placeholder={f.placeholder}
                        className={`cg-input${f.prefix ? " has-prefix" : ""}${f.suffix ? " has-suffix" : ""}`}
                        {...fo(f.name)}
                      />
                      {f.suffix && (
                        <span className="cg-suffix">{f.suffix}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="cg-divider" />

              <button
                className="cg-save-btn"
                onClick={() => generatePDF(formData)}
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Save & Download PDF
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ContractGenerator;
