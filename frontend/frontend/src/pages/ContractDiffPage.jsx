


import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE from "../config/api";

const CustomSelect = ({ label, value, options, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (ref.current && !ref.current.contains(event.target)) setIsOpen(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOpt = options.find(o => o.value === value);

    return (
        <div ref={ref} style={{ position: 'relative', width: '100%', fontFamily: "'DM Sans', sans-serif" }}>
            <label style={{ fontSize: '0.85rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>{label}</label>
            <div
                onClick={() => setIsOpen(!isOpen)}
                style={{ height: '54px', padding: '0 16px', background: isOpen ? 'rgba(200,168,80,0.08)' : 'rgba(0,0,0,0.3)', border: `1px solid ${isOpen ? '#C8A850' : 'rgba(255,255,255,0.1)'}`, borderRadius: '12px', color: selectedOpt ? '#F1F5F9' : '#64748B', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s', boxShadow: isOpen ? '0 0 0 3px rgba(200,168,80,0.15)' : 'none' }}
            >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: selectedOpt ? 600 : 400 }}>
                    {selectedOpt ? selectedOpt.label : placeholder}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: '#C8A850' }}>
                    <polyline points="6 9 12 15 18 9" />
                </svg>
            </div>

            {isOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, right: 0, background: '#1A1F2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', maxHeight: '280px', overflowY: 'auto', zIndex: 50, boxShadow: '0 20px 40px rgba(0,0,0,0.5)', animation: 'dropdownIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}>
                    {options.length === 0 ? (
                        <div style={{ padding: '16px', color: '#94A3B8', textAlign: 'center', fontSize: '0.85rem' }}>No contracts found.</div>
                    ) : (
                        options.map(opt => (
                            <div
                                key={opt.value}
                                onClick={() => { onChange(opt.value); setIsOpen(false); }}
                                style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '10px', transition: 'background 0.15s' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'rgba(108,99,255,0.15)', color: '#a5b4fc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /></svg>
                                </div>
                                <div style={{ minWidth: 0 }}>
                                    <div style={{ color: '#F1F5F9', fontSize: '0.85rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{opt.raw.fileName}</div>
                                    <div style={{ color: '#64748B', fontSize: '0.7rem', marginTop: '2px' }}>{new Date(opt.raw.uploadedAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

const ContractDiffPage = () => {
    const [history, setHistory] = useState([]);
    const [originalId, setOriginalId] = useState("");
    const [revisedId, setRevisedId] = useState("");
    const [diffData, setDiffData] = useState(null);
    const [loading, setLoading] = useState(false);

    
    const [uploadingTarget, setUploadingTarget] = useState(null);
    const fileInputRefOriginal = useRef(null);
    const fileInputRefRevised = useRef(null);

    const fetchHistory = () => {
        const token = sessionStorage.getItem("token");
        fetch(`${API_BASE}/api/history`, { headers: token ? { Authorization: `Bearer ${token}` } : {} })
            .then(res => res.json())
            .then(data => { if (data.success) setHistory(data.data || data.history || []); });
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    
    useEffect(() => {
        const saved = sessionStorage.getItem("savedDiff");
        if (saved) {
            const parsed = JSON.parse(saved);
            setOriginalId(parsed.orig);
            setRevisedId(parsed.rev);
            setDiffData(parsed.diff);
        }
    }, []);

    
    const handleDirectUpload = async (e, target) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploadingTarget(target);
        const toastId = toast.loading(`Analyzing ${file.name}...`);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const token = sessionStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/upload`, {
                method: "POST",
                headers: token ? { Authorization: `Bearer ${token}` } : {},
                body: formData
            });

            const data = await res.json();
            if (data.success) {
                toast.update(toastId, { render: "Extraction complete!", type: "success", isLoading: false, autoClose: 2000 });
                fetchHistory(); 
                if (target === 'original') setOriginalId(data.savedId);
                if (target === 'revised') setRevisedId(data.savedId);
            } else {
                toast.update(toastId, { render: data.message || "Upload failed", type: "error", isLoading: false, autoClose: 3000 });
            }
        } catch (err) {
            toast.update(toastId, { render: "Server error during upload", type: "error", isLoading: false, autoClose: 3000 });
        } finally {
            setUploadingTarget(null);
            e.target.value = null; 
        }
    };

    const handleCompare = async () => {
        if (!originalId || !revisedId) return toast.warning("Please select both contracts to compare.");
        if (originalId === revisedId) return toast.warning("Please select two different contracts.");

        setLoading(true);
        try {
            const token = sessionStorage.getItem("token");
            const res = await fetch(`${API_BASE}/api/diff`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ originalId, revisedId })
            });
            const data = await res.json();
            if (data.success) {
                setDiffData(data.diff);

               
                sessionStorage.setItem("savedDiff", JSON.stringify({
                    orig: originalId,
                    rev: revisedId,
                    diff: data.diff
                }));

                toast.success("Comparison complete!");
            } else toast.error(data.message || "Comparison failed.");
        } catch (err) {
            toast.error("Failed to connect to server.");
        } finally {
            setLoading(false);
        }
    };

    const formatOptions = history.map(h => ({ value: h._id, label: h.fileName, raw: h }));

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=DM+Sans:wght@400;500;600;700&display=swap');
        .diff-root { font-family: 'Sora', sans-serif; min-height: 100vh; background: #050816; color: #F1F5F9; padding: 2.5rem 1.25rem 6rem; position: relative; overflow-x: hidden; }
        .diff-grid-bg { position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);background-size:48px 48px; }
        .diff-orb { position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0;animation:df-drift 14s ease-in-out infinite alternate; }
        .diff-orb-1 { width:520px;height:520px;background:radial-gradient(circle,#4f46e5,#1e1b4b);top:-160px;left:-160px;opacity:0.25; }
        .diff-orb-2 { width:440px;height:440px;background:radial-gradient(circle,#c8a850,#66521a);bottom:-150px;right:-130px;opacity:0.15;animation-delay:-7s; }
        @keyframes df-drift { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(28px,22px) scale(1.06)} }
        @keyframes dropdownIn { from{opacity:0;transform:translateY(-10px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }

        .diff-wrap { max-width: 960px; margin: 0 auto; position: relative; z-index: 1; }
        .diff-card { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 20px; padding: 2rem; margin-bottom: 1.5rem; backdrop-filter: blur(20px); box-shadow: 0 24px 60px rgba(0,0,0,0.4); }
        .diff-btn { background: linear-gradient(135deg, #C8A850, #a07830); color: #0F172A; border: none; padding: 14px 28px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; width: 100%; font-size: 1rem; box-shadow: 0 8px 24px rgba(200,168,80,0.3); display: flex; align-items: center; justify-content: center; gap: 8px; }
        .diff-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 32px rgba(200,168,80,0.45); }
        .diff-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        
        .upload-inline-btn { height: 54px; padding: 0 16px; background: rgba(108,99,255,0.1); border: 1px solid rgba(108,99,255,0.3); border-radius: 12px; color: #a5b4fc; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-weight: 600; font-family: 'Sora', sans-serif; font-size: 0.85rem; transition: all 0.2s; flex-shrink: 0; }
        .upload-inline-btn:hover:not(:disabled) { background: rgba(108,99,255,0.25); color: #fff; }
        .upload-inline-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .diff-table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
        .diff-th { text-align: left; padding: 14px; border-bottom: 1px solid rgba(255,255,255,0.1); color: #94A3B8; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 0.05em; }
        .diff-td { padding: 16px 14px; border-bottom: 1px solid rgba(255,255,255,0.05); font-family: 'DM Sans', sans-serif; }
        .diff-chip { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 999px; font-size: 0.75rem; font-weight: 700; margin: 4px; }
      `}</style>

            <div className="diff-root page-enter">
                <div className="diff-grid-bg" />
                <div className="diff-orb diff-orb-1" />
                <div className="diff-orb diff-orb-2" />

                <div className="diff-wrap">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                        <div>
                            <span style={{ background: 'rgba(200,168,80,0.15)', color: '#C8A850', padding: '4px 14px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 700, border: '1px solid rgba(200,168,80,0.3)' }}>NEGOTIATION PROOF</span>
                            <h1 style={{ margin: '8px 0 6px', fontSize: '2.2rem', fontWeight: 800 }}>Verify Savings</h1>
                            <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.9rem', maxWidth: '500px', lineHeight: 1.6 }}>
                                Compare your <strong>initial offer</strong> against your <strong>re-negotiated contract</strong> to prove exactly how much money you saved and which junk fees were successfully removed.
                            </p>
                        </div>
                        <Link to="/" style={{ color: '#94A3B8', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', padding: '10px 20px', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7" /></svg>
                            Dashboard
                        </Link>
                    </div>

                    <div className="diff-card">
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>

                            
                            <div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                                    <div style={{ flex: 1 }}>
                                        <CustomSelect
                                            label="1. Original Contract (Before)"
                                            placeholder="Select the first offer..."
                                            value={originalId}
                                            options={formatOptions}
                                            onChange={(val) => {
                                                setOriginalId(val);
                                                setDiffData(null);
                                                sessionStorage.removeItem("savedDiff");
                                            }}
                                        />
                                    </div>
                                    <input type="file" ref={fileInputRefOriginal} style={{ display: 'none' }} accept=".pdf" onChange={(e) => handleDirectUpload(e, 'original')} />
                                    <button className="upload-inline-btn" onClick={() => fileInputRefOriginal.current.click()} disabled={uploadingTarget === 'original'}>
                                        {uploadingTarget === 'original' ? (
                                            <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" /></svg>
                                        ) : (
                                            <>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                                Upload
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                            
                            <div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                                    <div style={{ flex: 1 }}>
                                        <CustomSelect
                                            label="2. Revised Contract (After)"
                                            placeholder="Select the final signed deal..."
                                            value={revisedId}
                                            options={formatOptions}
                                            onChange={(val) => {
                                                setRevisedId(val);
                                                setDiffData(null);
                                                sessionStorage.removeItem("savedDiff");
                                            }}
                                        />
                                    </div>
                                    <input type="file" ref={fileInputRefRevised} style={{ display: 'none' }} accept=".pdf" onChange={(e) => handleDirectUpload(e, 'revised')} />
                                    <button className="upload-inline-btn" onClick={() => fileInputRefRevised.current.click()} disabled={uploadingTarget === 'revised'}>
                                        {uploadingTarget === 'revised' ? (
                                            <svg style={{ animation: 'spin 1s linear infinite' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" /></svg>
                                        ) : (
                                            <>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                                                Upload
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>

                        </div>
                        <button className="diff-btn" onClick={handleCompare} disabled={loading || uploadingTarget}>
                            {loading ? (
                                <>
                                    <svg style={{ animation: 'spin 1s linear infinite' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" /></svg>
                                    Calculating Differences...
                                </>
                            ) : (
                                <>
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>
                                    Reveal Savings & Changes
                                </>
                            )}
                        </button>
                    </div>

                    {diffData && (
                        <div style={{ animation: 'page-enter 0.6s cubic-bezier(0.22, 1, 0.36, 1)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <div className="diff-card" style={{ textAlign: 'center', marginBottom: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: '0 0 1rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em' }}>AutoLease Score Shift</p>

                                    {(() => {
                                        const oldScore = Number(diffData.priceChange.originalScore) || 0;
                                        const newScore = Number(diffData.priceChange.revisedScore) || 0;
                                        const isBetterOrSame = newScore >= oldScore;
                                        const isZero = oldScore === 0 && newScore === 0;

                                        return (
                                            <>
                                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px' }}>
                                                    <span style={{ fontSize: '2.5rem', fontWeight: 700, color: '#64748B' }}>{oldScore}</span>
                                                    <span style={{ fontSize: '1.5rem', color: isZero ? '#C8A850' : (isBetterOrSame ? '#10B981' : '#EF4444') }}>➔</span>
                                                    <span style={{
                                                        fontSize: '3.5rem',
                                                        fontWeight: 800,
                                                        color: isZero ? '#C8A850' : (isBetterOrSame ? '#10B981' : '#EF4444'),
                                                        textShadow: `0 0 40px ${isZero ? 'rgba(200,168,80,0.3)' : (isBetterOrSame ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)')}`
                                                    }}>
                                                        {newScore}
                                                    </span>
                                                </div>
                                                <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#94A3B8' }}>
                                                    {isZero ? "Pending market data for score generation." : (isBetterOrSame ? "Great job! You improved the deal quality." : "Warning: The revised deal is scored lower.")}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>

                                <div className="diff-card" style={{ marginBottom: 0 }}>
                                    <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: '0 0 1rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em' }}>Hidden Fees Audit</p>
                                    <div>
                                        {diffData.feesRemoved.length === 0 && diffData.feesAdded.length === 0 && <p style={{ color: '#F1F5F9', fontSize: '0.95rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', textAlign: 'center' }}>No hidden fees were added or removed.</p>}
                                        {diffData.feesRemoved.map(f => <span key={f} className="diff-chip" style={{ background: 'rgba(16,185,129,0.1)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /></svg> Removed: {f}</span>)}
                                        {diffData.feesAdded.map(f => <span key={f} className="diff-chip" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg> Sneaked In: {f}</span>)}
                                    </div>
                                </div>
                            </div>

                            <div className="diff-card">
                                <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: '0 0 1rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em' }}>Line-by-Line Changes</p>
                                <div style={{ overflowX: 'auto', background: 'rgba(0,0,0,0.2)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <table className="diff-table">
                                        <thead>
                                            <tr>
                                                <th className="diff-th">Contract Term</th>
                                                <th className="diff-th">Initial Offer</th>
                                                <th className="diff-th">Revised Contract</th>
                                                <th className="diff-th">Impact</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {diffData.fieldDiffs.map((row, i) => (
                                                <tr key={i} style={{ background: row.direction === 'improved' ? 'rgba(16,185,129,0.06)' : row.direction === 'worsened' ? 'rgba(239,68,68,0.06)' : 'transparent', borderBottom: i === diffData.fieldDiffs.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.03)' }}>
                                                    <td className="diff-td" style={{ color: '#F1F5F9', fontWeight: 700, textTransform: 'capitalize' }}>{row.field}</td>
                                                    <td className="diff-td" style={{ color: '#64748B', textDecoration: row.direction !== 'unchanged' ? 'line-through' : 'none' }}>{row.before}</td>
                                                    <td className="diff-td" style={{ color: '#F1F5F9', fontWeight: row.direction !== 'unchanged' ? 700 : 400 }}>{row.after}</td>
                                                    <td className="diff-td">
                                                        {row.direction === 'improved' && <span style={{ color: '#10B981', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg> Improved</span>}
                                                        {row.direction === 'worsened' && <span style={{ color: '#EF4444', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg> Worsened</span>}
                                                        {row.direction === 'changed' && <span style={{ color: '#C8A850', fontWeight: 800 }}>Changed</span>}
                                                        {row.direction === 'unchanged' && <span style={{ color: '#64748B' }}>No Change</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ContractDiffPage;