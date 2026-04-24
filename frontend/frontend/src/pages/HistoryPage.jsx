

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API_BASE from "../config/api";

const HistoryPage = () => {
  const pageSize = 5;
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [viewMode, setViewMode] = useState('cards');
  const [watchlistIds, setWatchlistIds] = useState([]);

  useEffect(() => {
    setWatchlistIds(JSON.parse(localStorage.getItem('watchlist') || '[]'));
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(
          `${API_BASE}/api/history`,
          { headers: token ? { Authorization: "Bearer " + token } : {} }
        );
        const data = await response.json();
        if (!data.success) setError("Failed to load records");
        else setResults(data.data || []);
      } catch (err) {
        setError("Server error — could not fetch records");
      } finally {
        setIsLoading(false);
      }
    };
    fetchResults();
  }, []);

  const filteredResults = results.filter((item) => {
    const text = searchQuery.toLowerCase();
    return (
      (item.fileName || "").toLowerCase().includes(text) ||
      (item.fields?.loan_amount + "").includes(text) ||
      (item.fields?.interest_rate + "").includes(text) ||
      (item.fields?.tenure_months + "").includes(text)
    );
  });

  const totalPages = Math.ceil(filteredResults.length / pageSize);
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      const token = sessionStorage.getItem("token");
      const res = await fetch(
        `${API_BASE}/api/history/${id}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: "Bearer " + token } : {}
        }
      );
      const data = await res.json();
      if (data.success) {
        setResults(results.filter((item) => item._id !== id));
        alert("Deleted successfully!");
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const confidenceStyle = (c) => {
    if (c >= 0.7)
      return {
        bg: "rgba(16,185,129,0.12)",
        border: "rgba(16,185,129,0.3)",
        color: "#34d399",
      };
    if (c >= 0.4)
      return {
        bg: "rgba(245,158,11,0.12)",
        border: "rgba(245,158,11,0.3)",
        color: "#fbbf24",
      };
    return {
      bg: "rgba(239,68,68,0.12)",
      border: "rgba(239,68,68,0.3)",
      color: "#f87171",
    };
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }

        .hi-root {
          font-family: 'Sora', sans-serif;
          min-height: 100vh;
          background: #050816;
          position: relative;
          overflow-x: hidden;
          padding: 2.5rem 1.25rem 5rem;
        }
        .hi-orb { position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0;animation:hi-drift 14s ease-in-out infinite alternate; }
        .hi-orb-1 { width:520px;height:520px;background:radial-gradient(circle,#4f46e5,#1e1b4b);top:-160px;left:-160px;opacity:0.3; }
        .hi-orb-2 { width:440px;height:440px;background:radial-gradient(circle,#0ea5e9,#0369a1);bottom:-150px;right:-130px;opacity:0.22;animation-delay:-7s; }
        .hi-orb-3 { width:270px;height:270px;background:radial-gradient(circle,#8b5cf6,#6d28d9);top:38%;left:60%;opacity:0.17;animation-delay:-11s; }
        @keyframes hi-drift { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(28px,22px) scale(1.06)} }
        .hi-grid { position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.025) 1px,transparent 1px);background-size:48px 48px; }

        .hi-wrap { position:relative;z-index:1;max-width:900px;margin:0 auto; }

        /* Header */
        .hi-header { display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:2.5rem;gap:1rem;flex-wrap:wrap; }
        .hi-badge { display:inline-flex;align-items:center;gap:6px;background:rgba(108,99,255,0.14);border:1px solid rgba(108,99,255,0.3);border-radius:999px;padding:4px 14px;font-size:10px;font-weight:600;letter-spacing:0.08em;color:#a5b4fc;text-transform:uppercase;margin-bottom:0.75rem; }
        .hi-badge-dot { width:6px;height:6px;border-radius:50%;background:#6c63ff;box-shadow:0 0 6px #6c63ff;animation:hi-pulse 2s ease-in-out infinite; }
        @keyframes hi-pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
        .hi-title { font-size:clamp(1.6rem,4vw,2.2rem);font-weight:800;color:#fff;letter-spacing:-0.04em;line-height:1.1;margin:0 0 0.3rem; }
        .hi-sub { font-family:'DM Sans',sans-serif;font-size:0.875rem;color:rgba(255,255,255,0.38); }

        .hi-back { display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:11px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.55);font-family:'Sora',sans-serif;font-size:0.8rem;font-weight:600;text-decoration:none;transition:background 0.2s,border-color 0.2s,transform 0.15s;white-space:nowrap;align-self:flex-start; }
        .hi-back:hover { background:rgba(255,255,255,0.09);border-color:rgba(255,255,255,0.2);transform:translateY(-1px); }

        /* Search */
        .hi-search-wrap { position:relative;margin-bottom:1.75rem;max-width:520px; }
        .hi-search-icon { position:absolute;left:14px;top:50%;transform:translateY(-50%);color:rgba(255,255,255,0.25);pointer-events:none;display:flex;align-items:center; }
        .hi-search {
          width:100%;padding:12px 14px 12px 42px;
          background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);
          border-radius:13px;color:#fff;
          font-family:'DM Sans',sans-serif;font-size:0.875rem;
          outline:none;transition:border-color 0.25s,background 0.25s,box-shadow 0.25s;
        }
        .hi-search::placeholder { color:rgba(255,255,255,0.22); }
        .hi-search:focus { border-color:rgba(108,99,255,0.65);background:rgba(108,99,255,0.07);box-shadow:0 0 0 3px rgba(108,99,255,0.13); }

        /* Stats row */
        .hi-stats { display:flex;align-items:center;gap:8px;margin-bottom:1.25rem; }
        .hi-count-pill { display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:999px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);font-size:12px;color:rgba(255,255,255,0.45); }
        .hi-count-pill strong { color:#a5b4fc;font-weight:700; }

        /* Result card */
        .hi-card {
          background:rgba(255,255,255,0.04);
          border:1px solid rgba(255,255,255,0.09);
          border-radius:20px;
          padding:1.5rem;
          margin-bottom:1rem;
          backdrop-filter:blur(20px);
          -webkit-backdrop-filter:blur(20px);
          box-shadow:0 16px 48px rgba(0,0,0,0.35);
          position:relative;
          animation:hi-cardIn 0.5s cubic-bezier(0.22,1,0.36,1) both;
          transition:border-color 0.2s,box-shadow 0.2s;
        }
        .hi-card:hover { border-color:rgba(255,255,255,0.15);box-shadow:0 20px 56px rgba(0,0,0,0.45); }
        .hi-card::before { content:'';position:absolute;top:0;left:8%;right:8%;height:1px;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.12),transparent); }
        @keyframes hi-cardIn { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }

        /* Card header */
        .hi-card-top { display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:1.25rem; }
        .hi-file-icon { width:40px;height:40px;border-radius:11px;background:rgba(108,99,255,0.12);border:1px solid rgba(108,99,255,0.2);display:flex;align-items:center;justify-content:center;color:#a5b4fc;flex-shrink:0; }
        .hi-file-name { font-size:1rem;font-weight:700;color:#fff;letter-spacing:-0.01em;margin-bottom:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:360px; }
        .hi-file-date { font-family:'DM Sans',sans-serif;font-size:0.78rem;color:rgba(255,255,255,0.3); }

        .hi-confidence-badge { padding:5px 12px;border-radius:8px;font-size:0.8rem;font-weight:700;white-space:nowrap;flex-shrink:0; }

        /* Fields grid */
        .hi-fields { display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-bottom:1.25rem; }
        @media(min-width:520px) { .hi-fields { grid-template-columns:repeat(4,1fr); } }
        .hi-field { padding:10px 12px;border-radius:11px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07); }
        .hi-field-label { font-size:9px;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:4px; }
        .hi-field-val { font-size:0.875rem;font-weight:700;color:#fff; }

        /* Card actions */
        .hi-actions { display:flex;gap:10px; }
        .hi-view-btn {
          flex:1;display:flex;align-items:center;justify-content:center;gap:7px;
          padding:11px;border-radius:12px;text-decoration:none;
          background:linear-gradient(135deg,#6c63ff,#4f46e5);
          color:#fff;font-family:'Sora',sans-serif;font-size:0.82rem;font-weight:600;
          border:none;cursor:pointer;
          transition:transform 0.18s,box-shadow 0.18s;
          box-shadow:0 4px 18px rgba(108,99,255,0.3);
          position:relative;overflow:hidden;
        }
        .hi-view-btn::before { content:'';position:absolute;top:0;left:-100%;width:100%;height:100%;background:linear-gradient(90deg,transparent,rgba(255,255,255,0.1),transparent);transition:left 0.45s; }
        .hi-view-btn:hover::before { left:100%; }
        .hi-view-btn:hover { transform:translateY(-2px);box-shadow:0 8px 26px rgba(108,99,255,0.45); }

        .hi-del-btn {
          display:flex;align-items:center;justify-content:center;gap:6px;
          padding:11px 16px;border-radius:12px;
          background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);
          color:#f87171;font-family:'Sora',sans-serif;font-size:0.82rem;font-weight:600;
          cursor:pointer;transition:background 0.2s,border-color 0.2s,transform 0.15s;
          white-space:nowrap;
        }
        .hi-del-btn:hover { background:rgba(239,68,68,0.16);border-color:rgba(239,68,68,0.4);transform:translateY(-1px); }

        /* State cards */
        .hi-state { display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4rem 1rem;text-align:center; }
        .hi-state-icon { width:60px;height:60px;border-radius:16px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.2);margin-bottom:1.1rem; }
        .hi-state-text { font-family:'DM Sans',sans-serif;font-size:0.9rem;color:rgba(255,255,255,0.3);line-height:1.6; }

        /* Error */
        .hi-error { padding:14px 18px;border-radius:13px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.25);color:#f87171;font-family:'DM Sans',sans-serif;font-size:0.875rem;margin-bottom:1.25rem;display:flex;align-items:center;gap:8px; }

        /* Loading dots */
        .hi-loading { display:flex;align-items:center;justify-content:center;gap:6px;padding:4rem; }
        .hi-dot { width:8px;height:8px;border-radius:50%;background:#6c63ff;animation:hi-bounce 1.2s ease-in-out infinite; }
        .hi-dot:nth-child(2) { animation-delay:0.2s; }
        .hi-dot:nth-child(3) { animation-delay:0.4s; }
        @keyframes hi-bounce { 0%,80%,100%{transform:scale(0.7);opacity:0.4} 40%{transform:scale(1);opacity:1} }

        /* Pagination */
        .hi-pager { display:flex;align-items:center;justify-content:space-between;margin-top:1.5rem;padding:1rem 1.25rem;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:16px;backdrop-filter:blur(16px); }
        .hi-page-btn { display:flex;align-items:center;gap:6px;padding:9px 16px;border-radius:10px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);color:rgba(255,255,255,0.55);font-family:'Sora',sans-serif;font-size:0.8rem;font-weight:600;cursor:pointer;transition:background 0.2s,border-color 0.2s,transform 0.15s; }
        .hi-page-btn:hover:not(:disabled) { background:rgba(255,255,255,0.09);border-color:rgba(255,255,255,0.18);transform:translateY(-1px); }
        .hi-page-btn:disabled { opacity:0.35;cursor:not-allowed; }
        .hi-page-info { font-family:'DM Sans',sans-serif;font-size:0.82rem;color:rgba(255,255,255,0.35); }
        .hi-page-info strong { color:#a5b4fc;font-weight:700; }
      `}</style>

      <div className="hi-root page-enter">
        <div className="hi-orb hi-orb-1" />
        <div className="hi-orb hi-orb-2" />
        <div className="hi-orb hi-orb-3" />
        <div className="hi-grid" />

        <div className="hi-wrap">
          {/* Header */}
          <div className="hi-header">
            <div>
              <div>
                <span className="hi-badge">
                  <span className="hi-badge-dot" />
                  Records
                </span>
              </div>
              <h2 className="hi-title">OCR History</h2>
              <p className="hi-sub">
                Browse and manage your past contract analyses
              </p>
            </div>
            <Link to="/" className="hi-back">
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
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
              Back to Upload
            </Link>
          </div>

          {/* Leaderboard */}
          {results.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '0.8rem', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, marginBottom: '1rem' }}>🏆 Top Deals Leaderboard</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {[...results]
                  .filter(r => r.pricingAnalysis?.score)
                  .sort((a, b) => b.pricingAnalysis.score - a.pricingAnalysis.score)
                  .slice(0, 3)
                  .map((deal, i) => (
                    <div key={deal._id} className="trophy-card" style={{ borderTop: `2px solid ${i === 0 ? '#C8A850' : i === 1 ? '#94A3B8' : '#B45309'}`, background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '1rem' }}>
                      <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{['🥇', '🥈', '🥉'][i]}</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{deal.fields?.vehicle_make} {deal.fields?.vehicle_model}</div>
                      <div style={{ fontSize: '0.8rem', color: '#a5b4fc', marginTop: '0.25rem' }}>Score: {deal.pricingAnalysis.score}/100</div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* View Toggle */}
          {results.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
              <button onClick={() => setViewMode(v => v === 'cards' ? 'timeline' : 'cards')} style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: `1px solid ${viewMode === 'timeline' ? 'rgba(200,168,80,0.35)' : 'rgba(255,255,255,0.1)'}`, color: viewMode === 'timeline' ? '#C8A850' : 'rgba(255,255,255,0.55)', fontFamily: "'Sora', sans-serif", fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                {viewMode === 'cards' ? '📅 Switch to Timeline' : '📋 Switch to Cards'}
              </button>
            </div>
          )}

          {/* Search */}
          <div className="hi-search-wrap">
            <span className="hi-search-icon">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
            <input
              type="text"
              className="hi-search"
              placeholder="Search by file name, loan amount, interest rate…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="hi-loading">
              <div className="hi-dot" />
              <div className="hi-dot" />
              <div className="hi-dot" />
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="hi-error">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* Empty — no records */}
          {!isLoading && !error && results.length === 0 && (
            <div className="hi-state">
              <div className="hi-state-icon">
                <svg
                  width="26"
                  height="26"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <p className="hi-state-text">
                No OCR records found yet.
                <br />
                Upload a contract to get started.
              </p>
            </div>
          )}

          {/* Empty — no search results */}
          {!isLoading &&
            !error &&
            results.length > 0 &&
            filteredResults.length === 0 && (
              <div className="hi-state">
                <div className="hi-state-icon">
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <p className="hi-state-text">
                  No results match your search.
                  <br />
                  Try a different keyword.
                </p>
              </div>
            )}

          {/* Results */}
          {results.length > 0 && filteredResults.length > 0 && (
            <>
              {/* WATCHLIST */}
              {results.filter(r => watchlistIds.includes(r._id)).length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '0.85rem' }}>👁️ Watching ({results.filter(r => watchlistIds.includes(r._id)).length})</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {results.filter(r => watchlistIds.includes(r._id)).map(deal => (
                      <Link key={deal._id} to={`/results/${deal._id}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: 'rgba(200,168,80,0.06)', border: '1px solid rgba(200,168,80,0.2)', borderRadius: '12px' }}>
                        <span style={{ color: '#F1F5F9', fontSize: '0.875rem', fontWeight: 600 }}>{deal.vehicleDetails ? `${deal.vehicleDetails.make} ${deal.vehicleDetails.model}` : deal.fileName}</span>
                        <span style={{ color: '#C8A850', fontSize: '0.78rem', fontWeight: 700 }}>Score: {deal.pricingAnalysis?.score || '—'} →</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* STATS */}
              <div className="hi-stats">
                <span className="hi-count-pill">
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                  Total: <strong>{results.length}</strong>
                </span>
                {searchQuery && (
                  <span className="hi-count-pill">
                    Showing <strong>{filteredResults.length}</strong> matches
                  </span>
                )}
              </div>

              {/* TIMELINE VIEW OR CARD VIEW */}
              {viewMode === 'timeline' ? (
                <div style={{ position: 'relative', paddingLeft: '24px', marginTop: '1rem', marginBottom: '2rem' }}>
                  <div style={{ position: 'absolute', left: '6px', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(180deg, #C8A850, rgba(200,168,80,0.1))' }} />
                  {[...filteredResults].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)).map((item, idx) => {
                    const score = item.pricingAnalysis?.score;
                    const sc = !score ? '#6b7280' : score >= 70 ? '#10B981' : score >= 40 ? '#F59E0B' : '#EF4444';
                    return (
                      <div key={item._id} style={{ position: 'relative', marginBottom: '1.5rem', animation: `hi-cardIn 0.4s ${idx * 0.05}s both` }}>
                        <div style={{ position: 'absolute', left: '-23px', top: '16px', width: '10px', height: '10px', borderRadius: '50%', background: sc, border: '2px solid #050816', boxShadow: `0 0 8px ${sc}60` }} />
                        <Link to={`/results/${item._id}`} style={{ textDecoration: 'none', display: 'block', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '1rem', transition: 'border-color 0.2s' }} onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(200,168,80,0.3)'; }} onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                            <div>
                              <div style={{ color: '#F1F5F9', fontWeight: 700, fontSize: '0.9rem', marginBottom: '2px' }}>{item.fileName || 'Untitled'}</div>
                              <div style={{ color: '#94A3B8', fontSize: '0.75rem' }}>{new Date(item.uploadedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              {score && <span style={{ color: sc, fontWeight: 800, fontSize: '1.1rem' }}>{score}<span style={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 400 }}>/100</span></span>}
                            </div>
                          </div>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              ) : (
                paginatedResults.map((item, idx) => {
                  const cs = confidenceStyle(item.confidence || 0);
                  return (
                    <div
                      key={item._id}
                      className="hi-card"
                      style={{ animationDelay: `${idx * 0.06}s` }}
                    >
                      {/* Top */}
                      <div className="hi-card-top">
                        <div
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: "12px",
                            flex: 1,
                            minWidth: 0,
                          }}
                        >
                          <div className="hi-file-icon">
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.8"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                              <polyline points="14 2 14 8 20 8" />
                            </svg>
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <div className="hi-file-name">
                              {item.fileName || "Untitled File"}
                            </div>
                            <div className="hi-file-date">
                              {new Date(item.uploadedAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div
                          className="hi-confidence-badge"
                          style={{
                            background: cs.bg,
                            border: `1px solid ${cs.border}`,
                            color: cs.color,
                          }}
                        >
                          {(item.confidence * 100).toFixed(1)}%
                        </div>
                      </div>

                      {/* Fields */}
                      <div className="hi-fields">
                        {[
                          {
                            label: "Loan Amount",
                            val: item.fields?.loan_amount
                              ? "₹" + item.fields.loan_amount
                              : "N/A",
                          },
                          {
                            label: "Interest Rate",
                            val: item.fields?.interest_rate
                              ? item.fields.interest_rate + "%"
                              : "N/A",
                          },
                          {
                            label: "Tenure",
                            val: item.fields?.tenure_months
                              ? item.fields.tenure_months + " mo"
                              : "N/A",
                          },
                          {
                            label: "EMI",
                            val: item.fields?.emi ? "₹" + item.fields.emi : "N/A",
                          },
                        ].map((f) => (
                          <div key={f.label} className="hi-field">
                            <div className="hi-field-label">{f.label}</div>
                            <div className="hi-field-val">{f.val}</div>
                          </div>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="hi-actions">
                        <Link to={`/results/${item._id}`} className="hi-view-btn">
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
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          View Details
                        </Link>
                        <button
                          className="hi-del-btn"
                          onClick={() => handleDelete(item._id)}
                        >
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
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" />
                            <path d="M14 11v6" />
                            <path d="M9 6V4h6v2" />
                          </svg>
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })
              )}

              {/* Pagination */}
              {totalPages > 1 && viewMode === 'cards' && (
                <div className="hi-pager">
                  <button
                    className="hi-page-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
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
                      <path d="M19 12H5M12 5l-7 7 7 7" />
                    </svg>
                    Previous
                  </button>
                  <span className="hi-page-info">
                    Page <strong>{currentPage}</strong> of{" "}
                    <strong>{totalPages}</strong>
                  </span>
                  <button
                    className="hi-page-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Next
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
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default HistoryPage;