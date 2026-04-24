

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE from "../config/api";

const ComparisonPage = () => {
  const [history, setHistory] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [aiVerdict, setAiVerdict] = useState("");
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    fetch(`${API_BASE}/api/history`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setHistory(data.data || data.history || []);
      })
      .finally(() => setHistoryLoading(false));
  }, []);

  const toggleSelection = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      if (selectedIds.length >= 3) {
        toast.warning("Select max 3 contracts.");
        return;
      }
      setSelectedIds([...selectedIds, id]);
    }
  };

  const runComparison = async () => {
    if (selectedIds.length < 2) {
      toast.info("Select at least 2 contracts.");
      return;
    }
    setLoading(true);
    setComparisonData([]);
    setAiVerdict("");
    try {
      const res = await fetch(`${API_BASE}/api/comparison/compare`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${sessionStorage.getItem("token")}`
        },
        body: JSON.stringify({ ids: selectedIds }),
      });
      const data = await res.json();
      if (data.success) {
        setComparisonData(data.data);
        setAiVerdict(data.verdict);
        toast.success("Comparison Complete!");
      } else toast.error(data.message);
    } catch (err) {
      toast.error("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const extractNum = (str) => parseFloat(String(str).replace(/[^0-9.]/g, "")) || 0;
  const colAccents = ["#6c63ff", "#10b981", "#f59e0b"];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .co-root { font-family: 'Sora', sans-serif; min-height: 100vh; background: #050816; position: relative; overflow-x: hidden; padding: 2.5rem 1.25rem 5rem; color: #F1F5F9; }
        .co-grid-bg { position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);background-size:48px 48px; }
        .co-orb { position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0;animation:co-drift 14s ease-in-out infinite alternate; }
        .co-orb-1 { width:520px;height:520px;background:radial-gradient(circle,#4f46e5,#1e1b4b);top:-160px;left:-160px;opacity:0.2; }
        .co-orb-2 { width:440px;height:440px;background:radial-gradient(circle,#10b981,#064e3b);bottom:-150px;right:-130px;opacity:0.15;animation-delay:-7s; }
        @keyframes co-drift { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(28px,22px) scale(1.06)} }

        .co-wrap { position:relative;z-index:1;max-width:1100px;margin:0 auto; }

        .co-header { display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:2.5rem;flex-wrap:wrap;gap:1rem; }
        .co-badge { display:inline-flex;align-items:center;gap:6px;background:rgba(108,99,255,0.15);border:1px solid rgba(108,99,255,0.3);border-radius:999px;padding:4px 14px;font-size:10px;font-weight:700;letter-spacing:0.08em;color:#a5b4fc;text-transform:uppercase;margin-bottom:0.75rem; }
        .co-title { font-size:clamp(1.6rem,4vw,2.2rem);font-weight:800;color:#fff;letter-spacing:-0.04em;line-height:1.1;margin:0 0 0.3rem; }
        .co-sub { font-family:'DM Sans',sans-serif;font-size:0.9rem;color:rgba(255,255,255,0.4); }

        .co-sel-panel { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:20px; padding:1.5rem; margin-bottom:2rem; backdrop-filter:blur(20px); }
        .co-scroll { display:flex;gap:12px;overflow-x:auto;padding-bottom:12px; }
        .co-scroll::-webkit-scrollbar { height:4px; }
        .co-scroll::-webkit-scrollbar-thumb { background:rgba(108,99,255,0.3);border-radius:99px; }

        .co-sel-card { flex-shrink:0;width:200px;padding:12px 14px;border-radius:12px; border:1px solid rgba(255,255,255,0.08); background:rgba(255,255,255,0.02); cursor:pointer;position:relative; transition:all 0.2s; }
        .co-sel-card:hover { border-color:rgba(108,99,255,0.4);background:rgba(108,99,255,0.06); transform:translateY(-2px); }
        .co-sel-card.selected { border-color:#6c63ff;background:rgba(108,99,255,0.1);box-shadow:0 0 0 1px #6c63ff; }
        .co-sel-name { font-size:0.8rem;font-weight:600;color:#F1F5F9;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;margin-bottom:4px; }
        .co-sel-date { font-family:'DM Sans',sans-serif;font-size:0.7rem;color:rgba(255,255,255,0.3); }

        .co-run-btn { display:inline-flex;align-items:center;justify-content:center;gap:8px; padding:12px 28px;border-radius:12px;border:none;cursor:pointer; font-family:'Sora',sans-serif;font-size:0.95rem;font-weight:700;color:#fff; background:linear-gradient(135deg,#6c63ff,#4f46e5); transition:transform 0.2s,box-shadow 0.2s; box-shadow:0 8px 24px rgba(108,99,255,0.3); width:100%; margin-top:1rem; }
        .co-run-btn:hover:not(:disabled) { transform:translateY(-2px);box-shadow:0 12px 32px rgba(108,99,255,0.45); }
        .co-run-btn:disabled { opacity:0.5;cursor:not-allowed; }

        /* The Podium / AI Verdict */
        .co-verdict-box { background:linear-gradient(145deg, rgba(200,168,80,0.1), rgba(200,168,80,0.02)); border:1px solid rgba(200,168,80,0.3); border-radius:20px; padding:2rem; margin-bottom:2.5rem; text-align:center; position:relative; overflow:hidden; animation: co-fadeUp 0.6s ease; }
        .co-verdict-icon { font-size:3rem; margin-bottom:1rem; animation: co-bounce 2s infinite; }
        .co-verdict-text { font-family:'DM Sans',sans-serif; font-size:1.05rem; line-height:1.7; color:#FDE68A; font-weight:500; max-width:800px; margin:0 auto; }

        /* Pricing Plan Cards Layout */
        .co-offers-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(300px, 1fr)); gap:1.5rem; align-items:start; }
        .co-offer-card { background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.08); border-radius:24px; padding:2rem; position:relative; transition:transform 0.3s, box-shadow 0.3s; animation: co-fadeUp 0.6s ease both; backdrop-filter:blur(20px); display:flex; flex-direction:column; }
        .co-offer-card:hover { transform:translateY(-5px); background:rgba(255,255,255,0.05); }

        .co-offer-color-bar { position:absolute; top:0; left:2rem; right:2rem; height:4px; border-radius:0 0 4px 4px; }
        .co-offer-title { font-size:1.1rem; font-weight:700; color:#F1F5F9; margin-bottom:1.5rem; text-align:center; word-break:break-all; }
        
        .co-offer-price-wrap { text-align:center; margin-bottom:2rem; padding-bottom:1.5rem; border-bottom:1px dashed rgba(255,255,255,0.1); }
        .co-offer-price-label { font-size:0.75rem; font-weight:700; text-transform:uppercase; letter-spacing:0.1em; color:#94A3B8; margin-bottom:0.5rem; }
        .co-offer-price { font-size:2.8rem; font-weight:800; color:#fff; line-height:1; display:flex; align-items:center; justify-content:center; gap:4px; }
        .co-offer-currency { font-size:1.2rem; color:#94A3B8; font-weight:600; }
        .co-offer-mo { font-size:1rem; color:#64748B; font-weight:500; align-self:flex-end; padding-bottom:6px; }

        .co-offer-rate-badge { display:inline-block; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); padding:6px 16px; border-radius:99px; font-weight:700; color:#a5b4fc; margin-top:1rem; font-size:0.9rem; }

        .co-offer-features { list-style:none; padding:0; margin:0 0 2rem 0; display:flex; flex-direction:column; gap:12px; flex:1; }
        .co-offer-feature { display:flex; align-items:flex-start; gap:10px; font-family:'DM Sans',sans-serif; font-size:0.9rem; color:#cbd5e1; }
        .co-feature-icon { color:#10B981; flex-shrink:0; margin-top:2px; }
        
        .co-fee-box { background:rgba(0,0,0,0.2); border-radius:12px; padding:1rem; margin-top:1rem; border:1px solid rgba(255,255,255,0.05); }
        .co-fee-header { display:flex; justify-content:space-between; font-size:0.8rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em; margin-bottom:10px; }
        .co-fee-item { display:flex; justify-content:space-between; font-family:'DM Sans',sans-serif; font-size:0.85rem; color:#94A3B8; margin-bottom:6px; border-bottom:1px solid rgba(255,255,255,0.03); padding-bottom:6px; }
        .co-fee-item:last-child { margin-bottom:0; border-bottom:none; padding-bottom:0; }
        .co-fee-amt { color:#F1F5F9; font-weight:600; }

        .co-btn-outline { display:block; width:100%; text-align:center; padding:12px; border-radius:12px; border:1px solid rgba(255,255,255,0.15); color:#F1F5F9; text-decoration:none; font-weight:600; font-size:0.9rem; transition:background 0.2s; }
        .co-btn-outline:hover { background:rgba(255,255,255,0.05); }

        @keyframes co-fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes co-bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
      `}</style>

      <div className="co-root page-enter">
        <div className="co-grid-bg" />
        <div className="co-orb co-orb-1" />
        <div className="co-orb co-orb-2" />

        <div className="co-wrap">
          <div className="co-header">
            <div>
              <span className="co-badge">Shopping Phase</span>
              <h1 className="co-title">Compare Offers</h1>
              <p className="co-sub">Evaluate different dealer quotes side-by-side to find the absolute best deal.</p>
            </div>
            <Link to="/" className="co-back">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l7 7-7 7" /></svg>
              Dashboard
            </Link>
          </div>

          <div className="co-sel-panel">
            <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94A3B8', marginBottom: '12px' }}>
              Select up to 3 offers to compare ({selectedIds.length}/3)
            </div>

            {historyLoading ? (
              <div style={{ color: '#6c63ff', fontSize: '0.9rem', fontWeight: 600 }}>Loading your contracts...</div>
            ) : history.length === 0 ? (
              <p style={{ color: '#64748B', fontSize: '0.9rem', margin: 0 }}>No contracts found. Please upload quotes first.</p>
            ) : (
              <div className="co-scroll">
                {history.map((rec) => {
                  const sel = selectedIds.includes(rec._id);
                  return (
                    <div key={rec._id} className={`co-sel-card ${sel ? 'selected' : ''}`} onClick={() => toggleSelection(rec._id)}>
                      {sel && (
                        <div style={{ position: 'absolute', top: 8, right: 8, background: '#6c63ff', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                        </div>
                      )}
                      <div className="co-sel-name">{rec.fileName}</div>
                      <div className="co-sel-date">{new Date(rec.uploadedAt).toLocaleDateString()}</div>
                    </div>
                  );
                })}
              </div>
            )}

            <button onClick={runComparison} disabled={loading || selectedIds.length < 2} className="co-run-btn">
              {loading ? 'Evaluating Offers...' : 'Generate Pricing Matrix'}
            </button>
          </div>

          {comparisonData.length > 0 && (
            <div>
              {/* Podium Verdict */}
              {aiVerdict && (
                <div className="co-verdict-box">
                  <div className="co-verdict-icon">🏆</div>
                  <div className="co-verdict-text" dangerouslySetInnerHTML={{ __html: aiVerdict.replace(/\*\*(.*?)\*\*/g, '<strong style="color: #fff">$1</strong>') }} />
                </div>
              )}

              {/* Pricing Cards Grid */}
              <div className="co-offers-grid">
                {comparisonData.map((contract, idx) => {
                  const accent = colAccents[idx % colAccents.length];
                  const emi = extractNum(contract.fields?.monthly_payment || contract.fields?.emi);
                  const rate = contract.fields?.interest_rate ? String(contract.fields.interest_rate).replace("%", "") : "--";
                  const loanAmt = contract.fields?.loan_amount || "—";
                  const tenure = contract.fields?.tenure_months || "—";
                  const fees = contract.hiddenFees?.fees || [];

                  return (
                    <div key={contract._id} className="co-offer-card" style={{ animationDelay: `${idx * 0.1}s` }}>
                      <div className="co-offer-color-bar" style={{ background: accent, boxShadow: `0 0 15px ${accent}` }} />

                      <div className="co-offer-title">{contract.fileName}</div>

                      <div className="co-offer-price-wrap">
                        <div className="co-offer-price-label">Monthly EMI</div>
                        <div className="co-offer-price">
                          {emi > 0 ? (
                            <>
                              <span className="co-offer-currency">₹</span>
                              {emi.toLocaleString('en-IN')}
                              <span className="co-offer-mo">/mo</span>
                            </>
                          ) : (
                            <span style={{ fontSize: '1.5rem', color: '#64748B' }}>Not specified</span>
                          )}
                        </div>
                        <div className="co-offer-rate-badge" style={{ color: accent, borderColor: `${accent}40`, background: `${accent}10` }}>
                          {rate}% Interest Rate
                        </div>
                      </div>

                      <ul className="co-offer-features">
                        <li className="co-offer-feature">
                          <svg className="co-feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                          <span><strong>Total Loan:</strong> {loanAmt}</span>
                        </li>
                        <li className="co-offer-feature">
                          <svg className="co-feature-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
                          <span><strong>Term:</strong> {tenure} months</span>
                        </li>
                      </ul>

                      <div className="co-fee-box">
                        <div className="co-fee-header">
                          <span style={{ color: '#94A3B8' }}>Hidden Fees</span>
                          <span style={{ color: fees.length > 0 ? '#EF4444' : '#10B981' }}>{fees.length} Found</span>
                        </div>
                        {fees.length > 0 ? (
                          fees.map((f, i) => (
                            <div key={i} className="co-fee-item">
                              <span>{f.name}</span>
                              <span className="co-fee-amt">{f.amount && f.amount !== "0" ? `₹${f.amount}` : "Variable"}</span>
                            </div>
                          ))
                        ) : (
                          <div style={{ color: '#10B981', fontSize: '0.85rem', fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                            ✅ Clean contract, no junk fees detected.
                          </div>
                        )}
                      </div>

                      <div style={{ marginTop: '2rem' }}>
                        <Link to={`/results/${contract._id}`} className="co-btn-outline">
                          View Deep Analysis
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ComparisonPage;