

import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API_BASE from "../config/api";

const CAR_BUYING_TIPS = [
  "Always get pre-approved for a loan before visiting a dealership.",
  "Never tell a dealer your monthly budget. They'll work backward to maximize profit.",
  "Documentation fees are negotiable. So is the dealer prep fee.",
  "A lower interest rate saves more money over time than a lower monthly payment.",
  "GAP insurance is almost always cheaper through your own insurer.",
  "Request the 'out-the-door price' in writing before discussing financing.",
  "The best deals happen in December — dealers clear inventory for new models.",
  "Extended warranties from dealers have 40-60% profit margins. Shop around.",
  "Ask for the 'invoice price' not the sticker price as your negotiation baseline.",
  "The AutoLease AI score is your compass. Under 50 means renegotiate."
];

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "Guest" });

  const [heroText, setHeroText] = useState("");
  const fullHero = "Your Personal Car Buying Assistant";
  const [loading, setLoading] = useState(true);
  const [dueReminders, setDueReminders] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [unread, setUnread] = useState(0);
  const [notifications, setNotifications] = useState([]);

  const [historyStats, setHistoryStats] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) return;
    fetch(`${API_BASE}/api/user/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { if (data.success) setHistoryStats(data.stats); })
      .catch(() => { });
  }, []);

  const [currentTip, setCurrentTip] = useState(CAR_BUYING_TIPS[new Date().getDate() % CAR_BUYING_TIPS.length]);

  const dealHealth = historyStats
    ? historyStats.avgScore >= 70 ? { label: 'Healthy', color: '#10B981', icon: '📈', msg: 'Your recent deals are above market average.' }
      : historyStats.avgScore >= 45 ? { label: 'Neutral', color: '#F59E0B', icon: '➡️', msg: 'Your deals are near market average — room to improve.' }
        : { label: 'Needs Attention', color: '#EF4444', icon: '📉', msg: 'Your recent deals scored below average.' }
    : null;

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const token = sessionStorage.getItem("token");

    if (!token) {
      navigate("/login");
    } else {
      try {
        setUser(storedUser ? JSON.parse(storedUser) : { name: "User" });
      } catch (error) {
        sessionStorage.clear();
        navigate("/login");
      }
    }
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    const reminders = JSON.parse(localStorage.getItem('autoReminders') || '[]');
    const today = new Date().toDateString();
    const due = reminders.filter(r => new Date(r.reminderDate).toDateString() === today);
    if (due.length > 0) setDueReminders(due);

    const notifs = [];
    if (due.length > 0) {
      notifs.push({ id: 1, text: '⏰ You have a dealer follow-up due today', time: 'Today' });
    }
    notifs.push({ id: 2, text: '💡 Upload your latest contract for a fresh AI analysis', time: 'Tip' });
    setNotifications(notifs);
    setUnread(notifs.length);
  }, []);

  useEffect(() => {
    if (loading) return;
    let i = 0;
    const iv = setInterval(() => {
      setHeroText(fullHero.slice(0, i + 1));
      i++;
      if (i >= fullHero.length) clearInterval(iv);
    }, 38);
    return () => clearInterval(iv);
  }, [loading]);

  useEffect(() => {
    if (loading) return;
    const cards = document.querySelectorAll('.db-main-card, .db-bottom-card');
    cards.forEach((card, i) => {
      setTimeout(() => card.classList.add('card-visible'), 150 + i * 120);
    });
  }, [loading]);

  const handleLogout = () => {
    sessionStorage.clear();
    toast.info("Logged out successfully");
    navigate("/login");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center" style={{ background: "#050816" }}>Loading Dashboard…</div>;

  const mainCards = [
    {
      to: "/upload",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="12" y1="18" x2="12" y2="12" /><line x1="9" y1="15" x2="15" y2="15" /></svg>,
      iconBg: "rgba(59,130,246,0.15)", iconColor: "#60a5fa", glowColor: "rgba(59,130,246,0.18)", borderColor: "rgba(59,130,246,0.2)",
      label: "Analyze Contract", desc: "Extract terms and uncover hidden junk fees instantly.", cta: "Start Analysis", ctaColor: "#60a5fa",
    },
    {
      to: "/compare",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
      iconBg: "rgba(139,92,246,0.15)", iconColor: "#a78bfa", glowColor: "rgba(139,92,246,0.18)", borderColor: "rgba(139,92,246,0.2)",
      label: "Compare Offers", desc: "Lay multiple quotes side-by-side for a clear winner.", cta: "Go to Comparison", ctaColor: "#a78bfa",
    },
    {
      to: "/email",
      icon: <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>,
      iconBg: "rgba(16,185,129,0.15)", iconColor: "#34d399", glowColor: "rgba(16,185,129,0.18)", borderColor: "rgba(16,185,129,0.2)",
      label: "Negotiator", desc: "Generate AI-powered counter-offer emails in seconds.", cta: "Draft Email", ctaColor: "#34d399",
    },
    // NEW: Affordability Checker
    {
      to: '/affordability',
      icon: (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 8v4l3 3" /><path d="M18 2v4h4" />
        </svg>
      ),
      iconBg: 'rgba(200,168,80,0.12)', iconColor: '#C8A850', glowColor: 'rgba(200,168,80,0.18)', borderColor: 'rgba(200,168,80,0.28)',
      label: 'Affordability Check', desc: 'Know if you can safely afford this loan before you sign.', cta: 'Check Now', ctaColor: '#C8A850',
    }
  ];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .db-root { font-family: 'Sora', sans-serif; min-height: 100vh; background: #050816; position: relative; overflow-x: hidden; }
        .db-orb { position: fixed; border-radius: 50%; filter: blur(90px); pointer-events: none; z-index: 0; animation: orbdrift 14s ease-in-out infinite alternate; }
        .db-orb-1 { width:600px;height:600px; background:radial-gradient(circle,#4f46e5,#1e1b4b); top:-200px;left:-200px; opacity:0.35; animation-delay:0s; }
        .db-orb-2 { width:500px;height:500px; background:radial-gradient(circle,#0ea5e9,#0369a1); bottom:-180px;right:-150px; opacity:0.28; animation-delay:-6s; }
        .db-orb-3 { width:300px;height:300px; background:radial-gradient(circle,#8b5cf6,#6d28d9); top:40%;left:55%; opacity:0.2; animation-delay:-10s; }
        @keyframes orbdrift { 0% { transform: translate(0,0) scale(1); } 100% { transform: translate(30px,25px) scale(1.06); } }
        .db-grid { position: fixed; inset: 0; z-index: 0; pointer-events: none; background-image: linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px); background-size: 48px 48px; }
        .db-nav { position: sticky; top: 0; z-index: 50; background: rgba(5,8,22,0.75); border-bottom: 1px solid rgba(255,255,255,0.08); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); padding: 0 2rem; height: 64px; display: flex; align-items: center; justify-content: space-between; }
        .db-nav-logo { display: flex; align-items: center; gap: 10px; }
        .db-nav-logo-icon { width: 36px; height: 36px; background: linear-gradient(135deg, #6c63ff, #4f46e5); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 4px 16px rgba(108,99,255,0.35); }
        .db-nav-title { font-size: 1.1rem; font-weight: 700; color: #fff; letter-spacing: -0.02em; }
        .db-nav-right { display: flex; align-items: center; gap: 14px; }
        .db-welcome { font-family: 'DM Sans', sans-serif; font-size: 0.875rem; color: rgba(255,255,255,0.45); }
        .db-welcome span { color: #a5b4fc; font-weight: 600; }
        .db-logout-btn { display: flex; align-items: center; gap: 6px; background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25); color: #f87171; font-family: 'Sora', sans-serif; font-size: 0.8rem; font-weight: 600; padding: 7px 14px; border-radius: 10px; cursor: pointer; transition: background 0.2s, border-color 0.2s, transform 0.15s; }
        .db-logout-btn:hover { background: rgba(239,68,68,0.18); border-color: rgba(239,68,68,0.45); transform: translateY(-1px); }
        .db-hero { position: relative; z-index: 1; text-align: center; padding: 4rem 1.5rem 6rem; background: linear-gradient(135deg, #0F172A 0%, #1A1F2E 50%, #0D1117 100%);}
        .db-hero-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(200,168,80,0.12); border: 1px solid rgba(200,168,80,0.3); border-radius: 999px; padding: 5px 16px; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; color: #C8A850; text-transform: uppercase; margin-bottom: 1.5rem; }
        .db-hero-dot { width: 6px; height: 6px; border-radius: 50%; background: #C8A850; box-shadow: 0 0 6px #C8A850; animation: pulse-dot 2s ease-in-out infinite; }
        @keyframes pulse-dot { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(0.7)} }
        .db-hero-title { font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 800; color: #fff; letter-spacing: -0.04em; line-height: 1.1; margin-bottom: 1rem; }
        .db-hero-sub { font-family: 'DM Sans', sans-serif; font-size: 1rem; color: rgba(255,255,255,0.45); max-width: 480px; margin: 0 auto; line-height: 1.65; }
        .db-content { position: relative; z-index: 1; max-width: 1100px; margin: 0 auto; padding: 0 1.5rem 4rem; margin-top: -3rem; }
        .db-section-label { font-size: 0.7rem; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: rgba(255,255,255,0.3); margin-bottom: 1rem; padding-left: 2px; }
        .db-cards-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem; }
        .db-main-card { position: relative; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 22px; padding: 2rem; text-decoration: none; display: flex; flex-direction: column; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); transition: transform 0.22s, box-shadow 0.22s, border-color 0.22s, background 0.22s; overflow: hidden; opacity: 0; transform: translateY(24px); }
        .db-main-card.card-visible { opacity: 1; transform: translateY(0); }
        .db-main-card::before { content:''; position:absolute; top:0; left:10%; right:10%; height:1px; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent); }
        .db-main-card:hover { transform: translateY(-5px); background: rgba(255,255,255,0.065); }
        .db-card-icon-wrap { width: 54px; height: 54px; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 1.4rem; transition: transform 0.2s; }
        .db-main-card:hover .db-card-icon-wrap { transform: scale(1.1); }
        .db-card-title { font-size: 1.1rem; font-weight: 700; color: #fff; letter-spacing: -0.02em; margin-bottom: 0.5rem; }
        .db-card-desc { font-family: 'DM Sans', sans-serif; font-size: 0.855rem; color: rgba(255,255,255,0.42); line-height: 1.6; flex: 1; margin-bottom: 1.5rem; }
        .db-card-cta { display: inline-flex; align-items: center; gap: 6px; font-size: 0.8rem; font-weight: 700; letter-spacing: 0.02em; transition: gap 0.2s; }
        .db-main-card:hover .db-card-cta { gap: 10px; }
        .db-bottom-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.25rem; }
        .db-bottom-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09); border-radius: 18px; padding: 1.4rem 1.6rem; display: flex; align-items: center; gap: 1rem; text-decoration: none; backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); transition: transform 0.2s, background 0.2s; opacity: 0; transform: translateY(24px); }
        .db-bottom-card.card-visible { opacity: 1; transform: translateY(0); }
        .db-bottom-card:hover { transform: translateY(-3px); background: rgba(255,255,255,0.06); }
        .db-bottom-icon { width: 46px; height: 46px; border-radius: 13px; flex-shrink: 0; display: flex; align-items: center; justify-content: center; }
        .db-bottom-card-title { font-size: 0.95rem; font-weight: 700; color: #fff; letter-spacing: -0.01em; margin-bottom: 2px; }
        .db-bottom-card-sub { font-family: 'DM Sans', sans-serif; font-size: 0.8rem; color: rgba(255,255,255,0.38); }
        .db-bottom-arrow { margin-left: auto; color: rgba(255,255,255,0.2); transition: color 0.2s, transform 0.2s; flex-shrink: 0; }
        .db-bottom-card:hover .db-bottom-arrow { color: rgba(255,255,255,0.5); transform: translateX(3px); }
      `}</style>

      <div className="db-root page-enter">
        <div className="db-orb db-orb-1" />
        <div className="db-orb db-orb-2" />
        <div className="db-orb db-orb-3" />
        <div className="db-grid" />

        {dueReminders.map((r, i) => (
          <div key={i} style={{ background: 'rgba(200,168,80,0.12)', borderBottom: '1px solid rgba(200,168,80,0.3)', padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 100 }}>
            <span style={{ color: '#FDE68A', fontWeight: 600, fontSize: '0.85rem' }}>⏰ Reminder: Follow up with "{r.dealerName}" today!</span>
            <button onClick={() => setDueReminders(prev => prev.filter((_, j) => j !== i))} style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
          </div>
        ))}

        <nav className="db-nav">
          <div className="db-nav-logo">
            <div className="db-nav-logo-icon">🚗</div>
            <span className="db-nav-title">AutoLease AI</span>
          </div>
          <div className="db-nav-right">
            <span className="db-welcome hidden sm:block">Welcome, <span>{user.name}</span></span>

            <div style={{ position: 'relative' }}>
              <button onClick={() => { setNotifOpen(v => !v); setUnread(0); }} style={{ width: '34px', height: '34px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', position: 'relative' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></svg>
                {unread > 0 && <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444', border: '1px solid #0F172A' }} />}
              </button>
              {notifOpen && (
                <div style={{ position: 'absolute', top: '42px', right: 0, width: '280px', background: '#1A1F2E', border: '1px solid rgba(200,168,80,0.2)', borderRadius: '14px', padding: '0.75rem', zIndex: 100, boxShadow: '0 20px 48px rgba(0,0,0,0.5)' }}>
                  <p style={{ color: '#C8A850', fontWeight: 700, fontSize: '0.78rem', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Notifications</p>
                  {notifications.map(n => (
                    <div key={n.id} style={{ padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.04)', marginBottom: '6px', fontSize: '0.8rem', color: '#F1F5F9', lineHeight: 1.5 }}>
                      {n.text}<div style={{ color: '#94A3B8', fontSize: '0.7rem', marginTop: '2px' }}>{n.time}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link to="/profile" style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'linear-gradient(135deg,#C8A850,#a07830)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0F172A', fontWeight: 700, fontSize: '0.85rem', textDecoration: 'none' }}>
              {(user.name || 'U')[0].toUpperCase()}
            </Link>
            <button onClick={handleLogout} className="db-logout-btn">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
              Logout
            </button>
          </div>
        </nav>

        <div className="db-hero">
          <div>
            <span className="db-hero-badge">
              <span className="db-hero-dot" />
              AI-Powered Assistant
            </span>
          </div>
          <h2 className="db-hero-title">
            {heroText}<span className="blink-cursor" style={{ color: "#C8A850", fontWeight: 300 }}>|</span>
          </h2>
          <p className="db-hero-sub">Upload contracts, uncover hidden fees, and negotiate like a pro.</p>
        </div>

        <div className="db-content">
          <p className="db-section-label">Quick Actions</p>

          <div className="db-cards-grid">
            {mainCards.map((card) => (
              <Link key={card.to} to={card.to} className="db-main-card" style={{ "--card-glow": card.glowColor, "--card-border": card.borderColor }} onMouseEnter={(e) => { e.currentTarget.style.borderColor = card.borderColor; e.currentTarget.style.boxShadow = `0 12px 40px ${card.glowColor}, 0 0 0 1px ${card.borderColor}`; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"; e.currentTarget.style.boxShadow = "none"; }}>
                <div className="db-card-icon-wrap" style={{ background: card.iconBg, color: card.iconColor }}>{card.icon}</div>
                <div className="db-card-title">{card.label}</div>
                <div className="db-card-desc">{card.desc}</div>
                <span className="db-card-cta" style={{ color: card.ctaColor }}>
                  {card.cta}
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </span>
              </Link>
            ))}
          </div>

          <p className="db-section-label" style={{ marginTop: "2rem" }}>More Tools</p>

          <div className="db-bottom-grid">
            <Link to="/history" className="db-bottom-card" onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"}>
              <div className="db-bottom-icon" style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.6)" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
              </div>
              <div>
                <div className="db-bottom-card-title">View History</div>
                <div className="db-bottom-card-sub">Access your past uploads</div>
              </div>
              <svg className="db-bottom-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>

            <Link to="/analytics" className="db-bottom-card" onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(59,130,246,0.3)"} onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"}>
              <div className="db-bottom-icon" style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>
              </div>
              <div>
                <div className="db-bottom-card-title">Analytics</div>
                <div className="db-bottom-card-sub">View your contract trends</div>
              </div>
              <svg className="db-bottom-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>

            <Link to="/diff" className="db-bottom-card" onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(200,168,80,0.25)'; }} onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
              <div className="db-bottom-icon" style={{ background: 'rgba(200,168,80,0.1)', color: '#C8A850' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
              </div>
              <div>
                <div className="db-bottom-card-title" style={{ color: '#FDE68A' }}>Compare Versions</div>
                <div className="db-bottom-card-sub">See what changed after negotiation</div>
              </div>
              <svg className="db-bottom-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
            </Link>

            <div className="db-bottom-card" style={{ cursor: "default" }}>
              <div className="db-bottom-icon" style={{ background: "rgba(108,99,255,0.15)", color: "#a5b4fc" }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 1 0 10 10" /><path d="M12 8v4l3 3" /><circle cx="18" cy="6" r="3" fill="currentColor" stroke="none" opacity="0.6" /><path d="M16.5 6h3M18 4.5v3" stroke="currentColor" strokeWidth="1.5" /></svg>
              </div>
              <div>
                <div className="db-bottom-card-title" style={{ color: "#c4b5fd" }}>Need Advice?</div>
                <div className="db-bottom-card-sub">Click the chat bubble ↘ to ask the AI Coach!</div>
              </div>
            </div>

          </div>

          <div style={{ marginTop: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <p className="db-section-label" style={{ margin: 0 }}>Market Pulse</p>
              <span style={{ fontSize: '0.7rem', color: '#10B981', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 6px #10B981', animation: 'pulse-dot 2s infinite' }}></span> LIVE
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '1.5rem', backdropFilter: 'blur(20px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'border-color 0.3s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: '1rem' }}>Your Portfolio Health</div>
                  {dealHealth ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${dealHealth.color}15`, border: `1px solid ${dealHealth.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                          {dealHealth.icon}
                        </div>
                        <div>
                          <div style={{ color: dealHealth.color, fontWeight: 800, fontSize: '1.2rem', marginBottom: '2px' }}>{dealHealth.label}</div>
                          <div style={{ color: '#F1F5F9', fontSize: '0.85rem', fontWeight: 600 }}>Avg Score: {historyStats?.avgScore || 0}/100</div>
                        </div>
                      </div>
                      <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.06)', marginBottom: '10px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${historyStats?.avgScore || 0}%`, background: dealHealth.color, borderRadius: '3px', transition: 'width 1s cubic-bezier(0.22, 1, 0.36, 1)' }} />
                      </div>
                      <p style={{ color: '#94A3B8', fontSize: '0.8rem', margin: 0, lineHeight: 1.6 }}>{dealHealth.msg}</p>
                    </>
                  ) : (
                    <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: 0 }}>Upload your first contract to establish your baseline health score.</p>
                  )}
                </div>
                <Link to="/analytics" style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '10px', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '10px', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(59,130,246,0.15)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(59,130,246,0.1)'}>
                  View Full Analytics
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </Link>
              </div>

              <div style={{ background: 'rgba(200,168,80,0.05)', border: '1px solid rgba(200,168,80,0.2)', borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-20px', right: '-20px', fontSize: '100px', opacity: 0.05, pointerEvents: 'none' }}>💡</div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C8A850' }}>AI Market Insight</div>
                  </div>
                  <p key={currentTip} style={{ color: '#F1F5F9', fontSize: '0.95rem', lineHeight: 1.7, margin: 0, fontFamily: "'DM Sans', sans-serif", animation: 'pageIn 0.3s ease' }}>
                    "{currentTip}"
                  </p>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '10px' }}>
                  <button onClick={() => {
                    let newTip;
                    do {
                      newTip = CAR_BUYING_TIPS[Math.floor(Math.random() * CAR_BUYING_TIPS.length)];
                    } while (newTip === currentTip);
                    setCurrentTip(newTip);
                  }} style={{ flex: 1, padding: '10px', background: 'rgba(200,168,80,0.1)', color: '#C8A850', border: '1px solid rgba(200,168,80,0.2)', borderRadius: '10px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(200,168,80,0.15)'} onMouseLeave={e => e.currentTarget.style.background = 'rgba(200,168,80,0.1)'}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10" /><polyline points="1 20 1 14 7 14" /><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" /></svg>
                    Refresh Tip
                  </button>
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