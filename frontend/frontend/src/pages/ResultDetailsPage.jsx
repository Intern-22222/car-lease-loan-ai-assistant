import React, { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import jsPDF from "jspdf";
import axios from "axios";
import API_BASE from "../config/api";

const PriceBar = ({ contractPrice, marketPrice }) => {
  const cp = Number(contractPrice) || 0;
  const mp = Number(marketPrice) || 0;
  if (!cp || !mp) return null;
  const max = Math.max(cp, mp) * 1.1;
  const cpPct = (cp / max) * 100;
  const mpPct = (mp / max) * 100;
  const diff = (((cp - mp) / mp) * 100).toFixed(1);
  const isOver = cp > mp;
  const [w, setW] = useState({ cp: 0, mp: 0 });
  useEffect(() => { setTimeout(() => setW({ cp: cpPct, mp: mpPct }), 200); }, [cpPct, mpPct]);
  return (
    <div style={{ marginTop: '1.2rem' }}>
      <p style={{ color: '#94A3B8', fontSize: '0.8rem', marginBottom: '10px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Price vs Market</p>
      {[{ label: 'Market Avg', pct: w.mp, color: '#10B981', val: mp }, { label: 'Your Deal', pct: w.cp, color: isOver ? '#EF4444' : '#10B981', val: cp }].map(row => (
        <div key={row.label} style={{ marginBottom: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
            <span style={{ color: '#94A3B8' }}>{row.label}</span>
            <span style={{ color: row.color, fontWeight: 600 }}>₹{row.val.toLocaleString('en-IN')}</span>
          </div>
          <div style={{ height: '8px', background: 'rgba(255,255,255,0.07)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${row.pct}%`, background: row.color, borderRadius: '4px', transition: 'width 0.9s cubic-bezier(0.4,0,0.2,1)' }} />
          </div>
        </div>
      ))}
      <p style={{ fontSize: '0.78rem', marginTop: '6px', color: isOver ? '#EF4444' : '#10B981', fontWeight: 600 }}>
        {isOver ? `⚠️ Overpriced by ${diff}%` : `✅ Below market by ${Math.abs(diff)}%`}
      </p>
    </div>
  );
};

const SeverityMeter = ({ fees }) => {
  const counts = { critical: 0, warning: 0, ok: 0 };
  (fees || []).forEach(f => counts[f.severity || 'ok']++);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 300); }, []);
  return (
    <div style={{ marginTop: '1.2rem', marginBottom: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
      <p style={{ color: '#94A3B8', fontSize: '0.75rem', marginBottom: '8px', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Fee Risk Breakdown</p>
      <div className={`severity-bar-wrap ${loaded ? 'loaded' : ''}`}>
        <div className="severity-seg-critical" style={{ flex: counts.critical || 0.01 }} />
        <div className="severity-seg-warning" style={{ flex: counts.warning || 0.01 }} />
        <div className="severity-seg-ok" style={{ flex: counts.ok || 0.01 }} />
      </div>
      <div style={{ display: 'flex', gap: '1rem', marginTop: '8px', fontSize: '0.75rem', fontWeight: 600 }}>
        <span style={{ color: '#EF4444' }}>🔴 High Risk: {counts.critical}</span>
        <span style={{ color: '#F59E0B' }}>🟡 Warning: {counts.warning}</span>
        <span style={{ color: '#10B981' }}>🟢 Normal: {counts.ok}</span>
      </div>
    </div>
  );
};

const ResultDetailsPage = () => {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [displayScore, setDisplayScore] = useState(0);
  const [activeTab, setActiveTab] = useState('analysis');

  const [scriptModal, setScriptModal] = useState(false);
  const [negotiationScript, setNegotiationScript] = useState('');
  const [scriptLoading, setScriptLoading] = useState(false);

  const [note, setNote] = useState('');
  const [savedNote, setSavedNote] = useState('');
  const [noteEditing, setNoteEditing] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [summary, setSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);

  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef(null);
  const [scoreFactors, setScoreFactors] = useState([]);
  const [factorsLoading, setFactorsLoading] = useState(false);
  const [factorsVisible, setFactorsVisible] = useState(false);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get(
          `${API_BASE}/api/results/${id}`,
          { headers: token ? { Authorization: "Bearer " + token } : {} }
        );
        if (response.data.success) setRecord(response.data.data);
        else setError("Record not found");
      } catch (err) {
        console.error(err);
        setError("Server error while fetching record");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecord();
  }, [id]);

  useEffect(() => {
    if (!record?._id) return;
    const stored = localStorage.getItem(`note_${record._id}`);
    if (stored) setSavedNote(stored);
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    setBookmarked(watchlist.includes(record._id));
  }, [record]);

  useEffect(() => {
    const score = record?.pricingAnalysis?.score;
    if (!score) return;
    const duration = 1200;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayScore(Math.round(eased * score));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [record]);

  const readAloud = () => {
    if (!window.speechSynthesis) return alert('Your browser does not support text-to-speech.');
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const vehicle = record.vehicleDetails ? `${record.vehicleDetails.make || ''} ${record.vehicleDetails.model || ''}` : 'this vehicle';
    const text = `Contract Analysis for ${vehicle}. Deal Score: ${record.pricingAnalysis?.score || 0} out of 100. Verdict: ${record.pricingAnalysis?.verdict || 'unknown'}. AI Recommendation: ${record.pricingAnalysis?.recommendation || 'No recommendation available.'}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang === 'en-IN') || voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (preferred) utterance.voice = preferred;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };
  useEffect(() => { return () => { window.speechSynthesis?.cancel(); }; }, []);

  const toggleBookmark = () => {
    const watchlist = JSON.parse(localStorage.getItem('watchlist') || '[]');
    const updated = bookmarked ? watchlist.filter(wid => wid !== record._id) : [...watchlist, record._id];
    localStorage.setItem('watchlist', JSON.stringify(updated));
    setBookmarked(!bookmarked);
  };

  const saveNote = () => {
    localStorage.setItem(`note_${record._id}`, note);
    setSavedNote(note);
    setNoteEditing(false);
  };

  const generateSummary = async () => {
    setSummaryLoading(true);
    setSummaryVisible(true);
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ rawText: record.rawText, fields: record.fields, vehicleDetails: record.vehicleDetails }),
      });
      const data = await res.json();
      setSummary(data.summary || 'Summary unavailable.');
    } catch (e) {
      setSummary('Error generating summary. Please try again.');
    } finally {
      setSummaryLoading(false);
    }
  };

  const explainScore = async () => {
    setFactorsLoading(true);
    setFactorsVisible(true);
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ pricingAnalysis: record.pricingAnalysis, hiddenFees: record.hiddenFees, vehicleDetails: record.vehicleDetails, fields: record.fields }),
      });
      const data = await res.json();
      setScoreFactors(data.factors || []);
    } catch (e) {
      setScoreFactors([{ name: 'Error', impact: 'NEGATIVE', points: 0, reason: 'Failed to load explanation.' }]);
    } finally {
      setFactorsLoading(false);
    }
  };

  const generateScript = async () => {
    setScriptLoading(true);
    setScriptModal(true);
    try {
      const token = sessionStorage.getItem('token');
      const res = await fetch(`${API_BASE}/api/negotiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          pricingAnalysis: record.pricingAnalysis,
          hiddenFees: record.hiddenFees,
          vehicleDetails: record.vehicleDetails,
        }),
      });
      const data = await res.json();
      setNegotiationScript(data.script || 'No script returned.');
    } catch (e) {
      setNegotiationScript('Error generating script. Please try again.');
    } finally {
      setScriptLoading(false);
    }
  };

  // 🔥 NEW BRANDED PDF GENERATOR
  const generateAnalysisPDF = () => {
    if (!record) return;
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

    const C = {
      black: [10, 14, 30],
      navy: [26, 31, 46],
      surface: [17, 24, 39],
      gold: [200, 168, 80],
      goldL: [240, 192, 96],
      blue: [59, 130, 246],
      green: [16, 185, 129],
      amber: [245, 158, 11],
      red: [239, 68, 68],
      white: [241, 245, 249],
      muted: [148, 163, 184],
      border: [30, 38, 56],
    };

    const W = 210;
    const H = 297;
    let y = 0;

    const fillPage = () => {
      doc.setFillColor(...C.black);
      doc.rect(0, 0, W, H, 'F');
    };

    const card = (x, cx, cy, cw, ch, color, radius = 3) => {
      doc.setFillColor(...color);
      doc.roundedRect(cx, cy, cw, ch, radius, radius, 'F');
    };

    const txt = (text, x, ty, size, color, style = 'normal', align = 'left') => {
      doc.setFontSize(size);
      doc.setTextColor(...color);
      doc.setFont('helvetica', style);
      doc.text(String(text), x, ty, { align });
    };

    const divider = (dy, color = C.border) => {
      doc.setDrawColor(...color);
      doc.setLineWidth(0.3);
      doc.line(14, dy, W - 14, dy);
    };

    const footer = (pageNum) => {
      doc.setFillColor(...C.navy);
      doc.rect(0, H - 12, W, 12, 'F');
      txt('Generated by AutoLease AI', 14, H - 5, 7, C.muted);
      txt(new Date().toLocaleString('en-IN'), W / 2, H - 5, 7, C.muted, 'normal', 'center');
      txt(`Page ${pageNum}`, W - 14, H - 5, 7, C.muted, 'normal', 'right');
    };

    fillPage();

    // Gold header strip
    doc.setFillColor(...C.gold);
    doc.rect(0, 0, W, 28, 'F');

    // Header text
    txt('AutoLease AI', 14, 11, 18, C.black, 'bold');
    txt('Contract Analysis Report', 14, 19, 9, C.navy);
    txt(new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }), W - 14, 11, 9, C.navy, 'normal', 'right');
    txt(`Report ID: ${record._id?.toString().slice(-8).toUpperCase() || 'N/A'}`, W - 14, 19, 7, C.navy, 'normal', 'right');

    y = 36;

    // Vehicle Card
    card(null, 14, y, W - 28, 28, C.navy);
    doc.setFillColor(...C.gold);
    doc.roundedRect(14, y, 2, 28, 1, 1, 'F');

    const vehicle = record.vehicleDetails
      ? `${record.vehicleDetails.year || ''} ${record.vehicleDetails.make || ''} ${record.vehicleDetails.model || ''}`.trim()
      : 'Vehicle details not available';

    txt('VEHICLE IDENTITY', 20, y + 7, 7, C.muted, 'bold');
    txt(vehicle || 'Unknown Vehicle', 20, y + 16, 14, C.white, 'bold');
    txt(`Trim: ${record.vehicleDetails?.trim || 'N/A'}  •  Body: ${record.vehicleDetails?.bodyClass || 'N/A'}`, 20, y + 23, 8, C.muted);
    card(null, W - 70, y + 5, 56, 14, C.surface);
    txt('VIN', W - 67, y + 11, 7, C.muted);
    txt(record.vin || 'Not Detected', W - 67, y + 18, 7, C.gold, 'bold');

    y += 36;

    // Deal Score
    const score = record.pricingAnalysis?.score || 0;
    const verdict = record.pricingAnalysis?.verdict || 'N/A';
    const scoreColor = score >= 70 ? C.green : score >= 40 ? C.amber : C.red;

    const cx = 35, cy2 = y + 22;
    doc.setFillColor(...C.border);
    doc.circle(cx, cy2, 16, 'F');
    doc.setFillColor(...scoreColor);
    doc.circle(cx, cy2, 14, 'F');
    doc.setFillColor(...C.black);
    doc.circle(cx, cy2, 9, 'F');
    txt(`${score}`, cx, cy2 + 2.5, 13, scoreColor, 'bold', 'center');

    txt('DEAL SCORE', 57, y + 12, 7, C.muted, 'bold');
    txt(`${score} / 100`, 57, y + 21, 16, scoreColor, 'bold');
    doc.setFillColor(...scoreColor.map(v => Math.min(v + 160, 255)));
    doc.roundedRect(57, y + 25, 36, 9, 2, 2, 'F');
    txt(verdict.toUpperCase(), 75, y + 31, 7, scoreColor, 'bold', 'center');

    txt('Score Breakdown', W / 2 + 5, y + 10, 7, C.muted);
    doc.setFillColor(...C.border);
    doc.roundedRect(W / 2 + 5, y + 14, 75, 5, 2, 2, 'F');
    doc.setFillColor(...scoreColor);
    doc.roundedRect(W / 2 + 5, y + 14, 75 * (score / 100), 5, 2, 2, 'F');
    txt(`${score}%`, W / 2 + 83, y + 18, 7, scoreColor, 'bold');

    y += 52;
    divider(y);
    y += 6;

    // Pricing
    txt('PRICING ANALYSIS', 14, y, 8, C.gold, 'bold');
    y += 8;

    const cp = record.pricingAnalysis?.contractPrice || 0;
    const mp = record.pricingAnalysis?.marketFairPrice || 0;
    const diff = cp - mp;
    const isOver = diff > 0;

    [[' Contract Price', cp, isOver ? C.red : C.green], ['Market Fair Price', mp, C.blue]].forEach(([label, val, color], i) => {
      const bx = 14 + i * 95;
      card(null, bx, y, 88, 22, C.navy);
      txt(label.trim(), bx + 5, y + 7, 7, C.muted);
      txt(`Rs.${(val || 0).toLocaleString('en-IN')}`, bx + 5, y + 17, 12, color, 'bold');
    });

    card(null, 14, y + 26, 88, 10, isOver ? [60, 20, 20] : [10, 40, 30]);
    txt(
      isOver
        ? `Overpriced by Rs.${Math.abs(diff).toLocaleString('en-IN')} (${(((cp - mp) / mp) * 100).toFixed(1)}% above market)`
        : `Below market by Rs.${Math.abs(diff).toLocaleString('en-IN')}`,
      18, y + 32, 8, isOver ? C.red : C.green, 'bold'
    );

    y += 42;
    divider(y);
    y += 6;

    // AI Rec
    txt('AI RECOMMENDATION', 14, y, 8, C.gold, 'bold');
    y += 7;
    card(null, 14, y, W - 28, 30, C.navy);
    doc.setFillColor(...C.blue);
    doc.roundedRect(14, y, 2, 30, 1, 1, 'F');
    const recLines = doc.splitTextToSize(record.pricingAnalysis?.recommendation || 'Compare with other lenders.', W - 42);
    txt('"', 22, y + 10, 16, C.blue, 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...C.white);
    doc.setFont('helvetica', 'normal');
    doc.text(recLines.slice(0, 3), 28, y + 9);

    y += 38;
    divider(y);
    y += 6;

    // Loan Terms
    txt('LOAN TERMS', 14, y, 8, C.gold, 'bold');
    y += 7;

    const termRows = [
      ['Loan Amount', record.fields?.loan_amount ? `Rs.${Number(record.fields.loan_amount).toLocaleString('en-IN')}` : 'N/A'],
      ['Interest Rate', record.fields?.interest_rate ? `${record.fields.interest_rate}%` : 'N/A'],
      ['Tenure', record.fields?.tenure_months ? `${record.fields.tenure_months} months` : 'N/A'],
      ['Monthly Payment', record.fields?.monthly_payment ? `Rs.${Number(record.fields.monthly_payment).toLocaleString('en-IN')}` : 'N/A'],
      ['Down Payment', record.fields?.down_payment ? `Rs.${Number(record.fields.down_payment).toLocaleString('en-IN')}` : 'N/A'],
    ];

    doc.setFillColor(...C.gold);
    doc.rect(14, y, W - 28, 8, 'F');
    txt('TERM', 18, y + 5.5, 7, C.black, 'bold');
    txt('VALUE', W / 2 + 10, y + 5.5, 7, C.black, 'bold');
    y += 8;

    termRows.forEach(([label, val], i) => {
      doc.setFillColor(...(i % 2 === 0 ? C.navy : C.surface));
      doc.rect(14, y, W - 28, 8, 'F');
      txt(label, 18, y + 5.5, 8, C.muted);
      txt(val, W / 2 + 10, y + 5.5, 8, C.white, 'bold');
      y += 8;
    });

    y += 6;

    if (y > 220) {
      footer(1);
      doc.addPage();
      fillPage();
      y = 20;
    }

    divider(y);
    y += 6;

    // Fees
    txt('HIDDEN FEES & PENALTIES', 14, y, 8, C.gold, 'bold');
    y += 7;

    const fees = record.hiddenFees?.fees || [];
    if (fees.length === 0) {
      card(null, 14, y, W - 28, 12, C.navy);
      txt('No hidden fees detected in this contract.', 18, y + 8, 8, C.green);
      y += 18;
    } else {
      doc.setFillColor(...C.red.map(v => Math.max(v - 100, 0)));
      doc.rect(14, y, W - 28, 8, 'F');
      txt('FEE NAME', 18, y + 5.5, 7, C.white, 'bold');
      txt('TYPE', 120, y + 5.5, 7, C.white, 'bold');
      txt('AMOUNT', W - 20, y + 5.5, 7, C.white, 'bold', 'right');
      y += 8;

      fees.slice(0, 8).forEach((fee, i) => {
        doc.setFillColor(...(i % 2 === 0 ? C.navy : C.surface));
        doc.rect(14, y, W - 28, 8, 'F');
        txt(fee.name || 'Unknown Fee', 18, y + 5.5, 7.5, C.white);
        const typeColor = fee.type === 'Junk' ? C.red : C.amber;
        txt(fee.type || 'Standard', 120, y + 5.5, 7, typeColor, 'bold');
        txt(fee.amount ? `Rs.${Number(fee.amount).toLocaleString('en-IN')}` : 'Variable', W - 18, y + 5.5, 7, fee.type === 'Junk' ? C.red : C.muted, 'normal', 'right');
        y += 8;
      });
      if (fees.length > 8) {
        txt(`... and ${fees.length - 8} more fees`, 18, y + 5, 7, C.muted);
        y += 8;
      }
      y += 4;
    }

    if (y > 230) {
      footer(1);
      doc.addPage();
      fillPage();
      y = 20;
    } else {
      divider(y);
      y += 6;
    }

    // Tips
    txt('NEGOTIATION TIPS', 14, y, 8, C.gold, 'bold');
    y += 7;

    const tips = [
      `Ask the dealer to remove all "Junk" fees — they are negotiable by definition.`,
      `Reference the market fair price of Rs.${mp.toLocaleString('en-IN')} as your baseline.`,
      `Request an itemised breakdown of every fee before signing.`,
      `Get the final "out-the-door" price in writing before discussing financing.`,
    ];

    tips.forEach((tip, i) => {
      card(null, 14, y, W - 28, 11, C.navy);
      doc.setFillColor(...C.gold);
      doc.circle(19, y + 5.5, 2.5, 'F');
      txt(`${i + 1}`, 19, y + 7, 6, C.black, 'bold', 'center');
      const tipLines = doc.splitTextToSize(tip, W - 46);
      doc.setFontSize(7.5);
      doc.setTextColor(...C.white);
      doc.setFont('helvetica', 'normal');
      doc.text(tipLines[0], 24, y + 7);
      y += 13;
    });

    footer(doc.getNumberOfPages());

    const vehicleName = record.vehicleDetails ? `${record.vehicleDetails.make}_${record.vehicleDetails.model}`.replace(/\s+/g, '_') : 'Contract';
    doc.save(`AutoLease_Report_${vehicleName}_${new Date().toLocaleDateString('en-IN').replace(/\//g, '-')}.pdf`);
  };

  const highlightKeywords = (text) => {
    if (!text) return '';
    const safe = text.replace(/<script[\s\S]*?<\/script>/gi, '');
    const dangerWords = ['prepayment penalty', 'balloon payment', 'termination fee', 'excess mileage charge'];
    const warnWords = ['gap insurance', 'origination fee', 'documentation fee', 'admin fee', 'doc fee'];
    let result = safe;
    dangerWords.forEach(w => { result = result.replace(new RegExp(w, 'gi'), `<mark class="kw-danger">${w}</mark>`); });
    warnWords.forEach(w => { result = result.replace(new RegExp(w, 'gi'), `<mark class="kw-warning">${w}</mark>`); });
    return result;
  };

  const getScoreColor = (score) => {
    if (score === undefined || score === null) return "#6b7280";
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  if (isLoading) return <div style={{ minHeight: "100vh", background: "#050816", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: "#C8A850" }}>Loading Results...</div></div>;
  if (error) return <div style={{ minHeight: "100vh", background: "#050816", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ color: "#ef4444" }}>{error}</div></div>;
  if (!record) return null;

  const price = record.pricingAnalysis || {};
  if (price.contractPrice && price.marketFairPrice) price.difference = price.contractPrice - price.marketFairPrice;
  const vehicle = record.vehicleDetails || {};
  const fields = record.fields || {};
  const hiddenFees = record.hiddenFees || {};
  const sc = getScoreColor(price.score);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .rd-root { font-family: 'Sora', sans-serif; min-height: 100vh; background: #050816; position: relative; overflow-x: hidden; padding: 2.5rem 1.25rem 6rem; }
        .rd-orb { position:fixed;border-radius:50%;filter:blur(90px);pointer-events:none;z-index:0;animation:rd-drift 14s ease-in-out infinite alternate; }
        .rd-orb-1 { width:520px;height:520px;background:radial-gradient(circle,#4f46e5,#1e1b4b);top:-150px;left:-160px;opacity:0.3; }
        .rd-orb-2 { width:440px;height:440px;background:radial-gradient(circle,#0ea5e9,#0369a1);bottom:-140px;right:-120px;opacity:0.22;animation-delay:-7s; }
        .rd-orb-3 { width:270px;height:270px;background:radial-gradient(circle,#8b5cf6,#6d28d9);top:35%;left:60%;opacity:0.17;animation-delay:-11s; }
        @keyframes rd-drift { 0%{transform:translate(0,0) scale(1)} 100%{transform:translate(28px,22px) scale(1.06)} }
        .rd-wrap { position:relative;z-index:1;max-width:960px;margin:0 auto; }
        .rd-nav { display:flex;justify-content:space-between;align-items:center;margin-bottom:2.5rem;flex-wrap:wrap;gap:12px; }
        .rd-nav-left { display:flex;align-items:center;gap:10px; }
        .rd-nav-right { display:flex;align-items:center;gap:10px; flex-wrap: wrap; }
        .rd-pill-btn { display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:11px;background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.55);font-size:0.8rem;font-weight:600;text-decoration:none;transition:background 0.2s,transform 0.15s; }
        .rd-pdf-btn { display:inline-flex;align-items:center;gap:7px;padding:9px 18px;border-radius:11px;background:linear-gradient(135deg,#6c63ff,#4f46e5);border:none;color:#fff;font-size:0.8rem;font-weight:600;cursor:pointer; }
        .rd-page-header { margin-bottom:1.5rem; }
        .rd-page-title { font-size:clamp(1.6rem,4vw,2.1rem);font-weight:800;color:#fff;margin:0 0 0.4rem; }
        .rd-card { background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:22px;padding:1.75rem;backdrop-filter:blur(22px);box-shadow:0 20px 56px rgba(0,0,0,0.4);position:relative;animation:rd-cardIn 0.55s cubic-bezier(0.22,1,0.36,1) both; }
        @keyframes rd-cardIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .rd-section-label { font-size:9px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:1rem;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;gap:6px; }
        .rd-two-col { display:grid;grid-template-columns:1fr;gap:1.25rem; }
        @media(min-width:680px) { .rd-two-col { grid-template-columns:1fr 1fr; } }
        .rd-three-col { display:grid;grid-template-columns:1fr;gap:1.25rem; }
        @media(min-width:700px) { .rd-three-col { grid-template-columns:2fr 1fr; } }
        .rd-vehicle-big { font-size:clamp(1.4rem,3.5vw,1.9rem);font-weight:800;color:#fff;margin-bottom:4px; }
        .rd-vin-code { font-family:monospace;font-size:0.8rem;color:#C8A850;background:rgba(200,168,80,0.1);padding:5px 12px;border-radius:8px; }
        .rd-score-wrap { display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem; }
        .rd-score-circle { position:relative;width:100px;height:100px;border-radius:50%;display:flex;align-items:center;justify-content:center; }
        .rd-score-num { font-size:2.2rem;font-weight:800;line-height:1; }
        .rd-verdict-pill { padding:5px 14px;border-radius:999px;font-size:0.75rem;font-weight:700;text-transform:uppercase; }
        .rd-rec-card { background:rgba(200,168,80,0.08);border:1px solid rgba(200,168,80,0.2);border-radius:18px;padding:1.5rem; }
        .rd-rec-icon { width:40px;height:40px;border-radius:11px;background:rgba(200,168,80,0.15);display:flex;align-items:center;justify-content:center;color:#C8A850;margin-bottom:1rem; }
        .rd-detail-row { display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid rgba(255,255,255,0.05); }
        .rd-detail-label { font-family:'DM Sans',sans-serif;font-size:0.82rem;color:rgba(255,255,255,0.38); }
        .rd-detail-val { font-size:0.88rem;font-weight:700;color:#fff; }
        .rd-fee-row { display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:1px solid rgba(255,255,255,0.05); }
        .rd-fee-name { font-family:'DM Sans',sans-serif;font-size:0.82rem;color:rgba(255,255,255,0.45); }
        .rd-fee-amt { font-size:0.82rem;font-weight:700;color:#f87171; }
      `}</style>

      <div className="rd-root page-enter">
        <div className="rd-orb rd-orb-1" />
        <div className="rd-orb rd-orb-2" />
        <div className="rd-orb rd-orb-3" />

        <div className="rd-wrap">
          <div className="rd-nav">
            <div className="rd-nav-left">
              <Link to="/upload" className="rd-pill-btn">Upload</Link>
              <Link to="/history" className="rd-pill-btn">History</Link>
            </div>
            <div className="rd-nav-right">
              {/* Phase 3 Buttons */}
              <button onClick={readAloud} className="rd-pill-btn" style={{ color: isSpeaking ? '#C8A850' : 'rgba(255,255,255,0.55)', borderColor: isSpeaking ? 'rgba(200,168,80,0.5)' : 'rgba(255,255,255,0.1)', background: isSpeaking ? 'rgba(200,168,80,0.15)' : 'rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                {isSpeaking ? <><span style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '14px' }}>{[1, 2, 3, 4].map(i => <span key={i} style={{ width: '3px', borderRadius: '2px', background: '#C8A850', height: `${[8, 14, 10, 12][i - 1]}px`, animation: `wave-bar 0.8s ease-in-out infinite`, animationDelay: `${i * 0.12}s` }} />)}</span> Stop</> : <>🔊 Read Aloud</>}
              </button>

              <button onClick={toggleBookmark} className="rd-pill-btn" style={{ color: bookmarked ? '#C8A850' : 'rgba(255,255,255,0.55)', borderColor: bookmarked ? 'rgba(200,168,80,0.35)' : 'rgba(255,255,255,0.1)', cursor: 'pointer' }}>
                {bookmarked ? '★ Watching' : '☆ Watch Deal'}
              </button>

              <button onClick={generateSummary} className="rd-pill-btn" style={{ color: '#60a5fa', borderColor: 'rgba(59,130,246,0.3)', cursor: 'pointer' }}>
                🤖 Plain English
              </button>

              <button onClick={explainScore} className="rd-pill-btn" style={{ color: '#F1F5F9', borderColor: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}>
                🎯 Why This Score?
              </button>

              <button onClick={generateScript} style={{ background: 'linear-gradient(135deg,#C8A850,#a07830)', color: '#0F172A', fontWeight: 700, border: 'none', borderRadius: '11px', padding: '9px 18px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🗣️ Negotiate
              </button>
              <button onClick={generateAnalysisPDF} className="rd-pdf-btn">Download Report</button>
            </div>
          </div>

          <div className="rd-page-header">
            <h2 className="rd-page-title">Contract Analysis</h2>
          </div>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '1.5rem' }}>
            {['analysis', 'rawtext'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', background: activeTab === tab ? '#3B82F6' : 'rgba(255,255,255,0.06)', color: activeTab === tab ? '#fff' : '#94A3B8' }}>
                {tab === 'analysis' ? '📊 Analysis' : '🔍 Raw Text'}
              </button>
            ))}
          </div>

          {activeTab === 'analysis' && (
            <>
              <div className="rd-three-col" style={{ marginBottom: "1.25rem" }}>
                <div className="rd-card" style={{ animationDelay: "0.05s" }}>
                  <div className="rd-section-label">Vehicle Identity</div>
                  {vehicle.make || vehicle.model ? (
                    <div>
                      <div className="rd-vehicle-big">{vehicle.year || ''} {vehicle.make || ''} {vehicle.model || ''}</div>
                      <div style={{ marginTop: '10px' }}><span className="rd-vin-code">{record.vin || "N/A"}</span></div>
                    </div>
                  ) : (
                    <p style={{ color: "rgba(255,255,255,0.3)", fontStyle: "italic" }}>Details not extracted.</p>
                  )}
                </div>

                <div className="rd-card" style={{ animationDelay: "0.1s" }}>
                  <div className="rd-section-label">Fairness Score</div>
                  <div className="rd-score-wrap">
                    <div className="rd-score-circle" style={{ border: `3px solid ${sc}`, boxShadow: `0 0 24px ${sc}30` }}>
                      <span className="rd-score-num" style={{ color: sc }}>{displayScore}</span>
                    </div>
                    <span className="rd-verdict-pill" style={{ background: `${sc}18`, border: `1px solid ${sc}40`, color: sc }}>{price.verdict || "Pending"}</span>
                  </div>
                </div>
              </div>

              {factorsVisible && (
                <div style={{ marginBottom: '1.25rem', animation: 'rd-cardIn 0.4s ease both' }}>
                  <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)', borderRadius: '18px', padding: '1.5rem' }}>
                    <p style={{ color: '#F1F5F9', fontWeight: 700, fontSize: '0.85rem', margin: '0 0 1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      🎯 Score Breakdown
                      <button onClick={() => setFactorsVisible(false)} style={{ marginLeft: 'auto', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
                    </p>
                    {factorsLoading ? (
                      <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>Analyzing your deal factors…</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {scoreFactors.map((f, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px', borderRadius: '10px', background: f.impact === 'POSITIVE' ? 'rgba(16,185,129,0.07)' : 'rgba(239,68,68,0.07)', border: `1px solid ${f.impact === 'POSITIVE' ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
                            <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{f.impact === 'POSITIVE' ? '✅' : '❌'}</span>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                <span style={{ color: '#F1F5F9', fontWeight: 700, fontSize: '0.85rem' }}>{f.name}</span>
                                <span style={{ padding: '2px 10px', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, background: f.impact === 'POSITIVE' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)', color: f.impact === 'POSITIVE' ? '#10B981' : '#EF4444' }}>
                                  {f.impact === 'POSITIVE' ? '+' : '-'}{f.points} pts
                                </span>
                              </div>
                              <div style={{ color: '#94A3B8', fontSize: '0.8rem', lineHeight: 1.5 }}>{f.reason}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {price.recommendation && (
                <div className="rd-rec-card" style={{ marginBottom: "1.25rem", animation: "rd-cardIn 0.55s 0.15s both" }}>
                  <div className="rd-rec-icon">💡</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#C8A850', marginBottom: '6px', textTransform: 'uppercase' }}>AI Advisor Recommendation</div>
                  <div style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.7)' }}>"{price.recommendation}"</div>
                </div>
              )}

              {summaryVisible && (
                <div style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '18px', padding: '1.5rem', marginBottom: '1.25rem', animation: 'rd-cardIn 0.4s ease both' }}>
                  <p style={{ color: '#60a5fa', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 10px' }}>🤖 Plain English Summary</p>
                  {summaryLoading ? <p style={{ color: '#94A3B8' }}>Simplifying your contract…</p> : <pre style={{ color: '#F1F5F9', fontFamily: "'DM Sans', sans-serif", fontSize: '0.875rem', lineHeight: 1.8, whiteSpace: 'pre-wrap', margin: 0 }}>{summary}</pre>}
                  <button onClick={() => setSummaryVisible(false)} style={{ marginTop: '10px', background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', fontSize: '0.78rem' }}>Dismiss</button>
                </div>
              )}

              {price.marketFairPrice && (
                <div className="rd-card" style={{ marginBottom: "1.25rem", animationDelay: "0.18s" }}>
                  <div className="rd-section-label">Price Fairness Analysis</div>
                  <PriceBar contractPrice={price.contractPrice} marketPrice={price.marketFairPrice} />
                </div>
              )}

              <div className="rd-two-col" style={{ marginBottom: "1.25rem" }}>
                <div className="rd-card" style={{ animationDelay: "0.22s" }}>
                  <div className="rd-section-label">Loan Terms</div>
                  {[
                    { label: "Loan Amount", val: fields.loan_amount },
                    { label: "Interest Rate", val: fields.interest_rate },
                    { label: "Tenure", val: fields.tenure_months },
                    { label: "Monthly Payment", val: fields.monthly_payment || fields.emi },
                  ].map((r) => (
                    <div key={r.label} className="rd-detail-row">
                      <span className="rd-detail-label">{r.label}</span>
                      <span className="rd-detail-val">{r.val && r.val !== "Not Specified" ? r.val : "—"}</span>
                    </div>
                  ))}
                </div>

                <div className="rd-card" style={{ animationDelay: "0.27s" }}>
                  <div className="rd-section-label">Hidden Fees & Penalties</div>
                  <SeverityMeter fees={hiddenFees?.fees} />
                  {hiddenFees?.fees?.length > 0 ? hiddenFees.fees.map((fee, idx) => (
                    <div key={idx} className="rd-fee-row">
                      <span className="rd-fee-name" style={{ color: fee.severity === 'critical' ? '#EF4444' : fee.severity === 'warning' ? '#F59E0B' : '#94A3B8' }}>{fee.name}</span>
                      <span className="rd-fee-amt">{fee.amount || "Variable"}</span>
                    </div>
                  )) : <p style={{ color: '#10B981', fontSize: '0.85rem' }}>No hidden fees detected!</p>}
                </div>
              </div>

              <div className="rd-card" style={{ marginBottom: '1.25rem', animationDelay: '0.32s' }}>
                <div className="rd-section-label">📋 My Notes</div>
                {!noteEditing && savedNote ? (
                  <div>
                    <p style={{ color: '#F1F5F9', fontSize: '0.875rem', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: '0 0 10px' }}>{savedNote}</p>
                    <button onClick={() => { setNote(savedNote); setNoteEditing(true); }} style={{ background: 'rgba(200,168,80,0.1)', border: '1px solid rgba(200,168,80,0.25)', color: '#C8A850', borderRadius: '8px', padding: '6px 14px', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}>✏️ Edit Note</button>
                  </div>
                ) : noteEditing || !savedNote ? (
                  <div>
                    <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Add your personal notes about this contract... (e.g. 'Dealer agreed to waive admin fee')" style={{ width: '100%', minHeight: '100px', background: '#111827', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px', color: '#F1F5F9', fontSize: '0.875rem', fontFamily: 'inherit', lineHeight: 1.6, resize: 'vertical', outline: 'none', boxSizing: 'border-box' }} onFocus={e => { e.target.style.borderColor = 'rgba(200,168,80,0.4)'; }} onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; }} />
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button onClick={saveNote} style={{ background: 'linear-gradient(135deg,#C8A850,#a07830)', color: '#0F172A', border: 'none', borderRadius: '8px', padding: '7px 16px', cursor: 'pointer', fontWeight: 700, fontSize: '0.8rem' }}>Save Note</button>
                      {noteEditing && <button onClick={() => setNoteEditing(false)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', borderRadius: '8px', padding: '7px 14px', cursor: 'pointer', fontSize: '0.8rem' }}>Cancel</button>}
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          )}

          {activeTab === 'rawtext' && (
            <div style={{ background: '#111827', borderRadius: '10px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.07)', lineHeight: 1.8, fontSize: '0.85rem', color: '#94A3B8', animation: "rd-cardIn 0.3s both" }}>
              <p style={{ color: '#C8A850', fontWeight: 600, marginTop: 0 }}>Raw OCR Text</p>
              <div dangerouslySetInnerHTML={{ __html: highlightKeywords(record?.rawText || record?.extractedText || 'No raw text available.') }} />
            </div>
          )}
        </div>

        {scriptModal && (
          <div className="modal-overlay" onClick={() => setScriptModal(false)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <h3 style={{ color: '#C8A850', marginTop: 0 }}>🗣️ Your Negotiation Script</h3>
              {scriptLoading ? (
                <p style={{ color: '#94A3B8' }}>Generating your script...</p>
              ) : (
                <>
                  <pre style={{ color: '#F1F5F9', whiteSpace: 'pre-wrap', lineHeight: 1.7, fontSize: '0.9rem', fontFamily: 'inherit' }}>
                    {negotiationScript}
                  </pre>
                  <button onClick={() => navigator.clipboard.writeText(negotiationScript)} style={{ marginTop: '1rem', background: '#3B82F6', color: '#fff', border: 'none', borderRadius: '8px', padding: '8px 18px', cursor: 'pointer', fontWeight: 600 }}>📋 Copy Script</button>
                </>
              )}
              <button onClick={() => setScriptModal(false)} style={{ marginTop: '0.5rem', marginLeft: '0.5rem', background: 'transparent', color: '#94A3B8', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '8px 18px', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ResultDetailsPage;
