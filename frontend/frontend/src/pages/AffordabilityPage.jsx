import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const computeEMI = (principal, annualRate, months) => {
    if (!principal || !annualRate || !months) return 0;
    const r = annualRate / 100 / 12;
    if (r === 0) return Math.round(principal / months);
    return Math.round((principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1));
};

const analyseAffordability = ({ monthlyIncome, existingEMIs, loanAmount, interestRate, tenureMonths, downPayment }) => {
    const principal = loanAmount - (downPayment || 0);
    const newEMI = computeEMI(principal, interestRate, tenureMonths);
    const totalEMI = existingEMIs + newEMI;
    const dtiRatio = (totalEMI / monthlyIncome) * 100;
    const maxAllowedEMI = monthlyIncome * 0.40;
    const safeNewEMI = maxAllowedEMI - existingEMIs;
    const surplus = monthlyIncome - totalEMI;
    const totalInterest = (newEMI * tenureMonths) - principal;
    const totalCost = newEMI * tenureMonths + (downPayment || 0);

    let verdict, color, icon, message;
    if (dtiRatio <= 35) {
        verdict = 'Comfortably Affordable';
        color = '#10B981';
        icon = '✅';
        message = `Your total EMI burden is ${dtiRatio.toFixed(1)}% of your income — well within the safe 40% limit. You have good financial headroom.`;
    } else if (dtiRatio <= 40) {
        verdict = 'Affordable (Tight)';
        color = '#F59E0B';
        icon = '⚠️';
        message = `Your EMI burden is ${dtiRatio.toFixed(1)}% of income — just within the safe limit but leaving little room for emergencies.`;
    } else if (dtiRatio <= 50) {
        verdict = 'Financial Strain Risk';
        color = '#EF4444';
        icon = '🚨';
        message = `At ${dtiRatio.toFixed(1)}% of income, this loan pushes you above safe limits. Consider a larger down payment or longer tenure to reduce EMI.`;
    } else {
        verdict = 'Not Recommended';
        color = '#EF4444';
        icon = '❌';
        message = `${dtiRatio.toFixed(1)}% debt-to-income ratio is dangerously high. Most banks will reject this loan. You need a higher income, larger down payment, or smaller loan.`;
    }

    return {
        newEMI, totalEMI, dtiRatio, maxAllowedEMI, safeNewEMI,
        surplus, totalInterest, totalCost, principal,
        verdict, color, icon, message
    };
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────────
const AffordabilityPage = () => {
    const navigate = useNavigate();
    const resultRef = useRef(null);

    const [form, setForm] = useState({
        monthlyIncome: '',
        existingEMIs: '',
        loanAmount: '',
        downPayment: '',
        interestRate: '',
        tenureMonths: '',
    });
    const [result, setResult] = useState(null);
    const [errors, setErrors] = useState({});
    const [displayDTI, setDisplayDTI] = useState(0);

    const set = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

    const validate = () => {
        const errs = {};
        ['monthlyIncome', 'loanAmount', 'interestRate', 'tenureMonths'].forEach(k => {
            if (!form[k] || isNaN(Number(form[k])) || Number(form[k]) <= 0)
                errs[k] = 'Required — enter a valid number';
        });
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleCalculate = () => {
        if (!validate()) return;
        const r = analyseAffordability({
            monthlyIncome: Number(form.monthlyIncome),
            existingEMIs: Number(form.existingEMIs || 0),
            loanAmount: Number(form.loanAmount),
            downPayment: Number(form.downPayment || 0),
            interestRate: Number(form.interestRate),
            tenureMonths: Number(form.tenureMonths),
        });
        setResult(r);
        setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
    };

   
    useEffect(() => {
        if (!result) return;
        const target = result.dtiRatio;
        const duration = 1000;
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplayDTI(parseFloat((eased * target).toFixed(1)));
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [result]);

    const inputStyle = (key) => ({
        width: '100%', padding: '11px 14px',
        background: 'rgba(255,255,255,0.04)',
        border: `1px solid ${errors[key] ? '#EF4444' : 'rgba(255,255,255,0.08)'}`,
        borderRadius: '10px', color: '#F1F5F9',
        fontFamily: "'DM Sans', sans-serif", fontSize: '0.9rem',
        outline: 'none', boxSizing: 'border-box',
        transition: 'border-color 0.2s',
    });

    const labelStyle = {
        display: 'block', color: '#94A3B8', fontSize: '0.78rem',
        fontWeight: 600, marginBottom: '6px',
        textTransform: 'uppercase', letterSpacing: '0.07em',
    };

    return (
        <>
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700;800&family=DM+Sans:wght@400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        .aff-root { font-family:'Sora',sans-serif; min-height:100vh; background:linear-gradient(135deg,#0F172A 0%,#1A1F2E 50%,#0D1117 100%); color:#F1F5F9; padding:2.5rem 1.25rem 5rem; }
        .aff-grid { position:fixed;inset:0;z-index:0;pointer-events:none;background-image:linear-gradient(rgba(255,255,255,0.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.02) 1px,transparent 1px);background-size:48px 48px; }
        .aff-wrap { position:relative;z-index:1;max-width:820px;margin:0 auto; }
        .aff-card { background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);border-radius:20px;padding:1.75rem;backdrop-filter:blur(20px);-webkit-backdrop-filter:blur(20px); }
        .aff-input:focus { border-color:rgba(200,168,80,0.5)!important; }
        .aff-grid-2 { display:grid;grid-template-columns:1fr 1fr;gap:1rem; }
        @media(max-width:600px) { .aff-grid-2 { grid-template-columns:1fr; } }
        @keyframes aff-in { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .aff-result { animation:aff-in 0.5s ease both; }
      `}</style>

            <div className="aff-root page-enter">
                <div className="aff-grid" />
                <div className="aff-wrap">

                    
                    <div style={{ marginBottom: '2rem' }}>
                        <Link to="/dashboard" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.09)', marginBottom: '1.5rem' }}>
                            ← Dashboard
                        </Link>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(200,168,80,0.12)', border: '1px solid rgba(200,168,80,0.3)', borderRadius: '999px', padding: '4px 14px', fontSize: '10px', fontWeight: 600, letterSpacing: '0.08em', color: '#FDE68A', textTransform: 'uppercase', marginBottom: '0.75rem', marginLeft: '1rem' }}>
                            ● Financial Tool
                        </div>
                        <h1 style={{ fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, color: '#fff', letterSpacing: '-0.04em', margin: '0 0 0.5rem' }}>
                            Loan Affordability Checker
                        </h1>
                        <p style={{ color: '#94A3B8', fontFamily: "'DM Sans',sans-serif", fontSize: '1rem', margin: 0, lineHeight: 1.6 }}>
                            Find out if you can safely afford a car loan — before you sign anything.
                            Uses the <strong style={{ color: '#C8A850' }}>40% debt-to-income rule</strong> used by all major Indian banks.
                        </p>
                    </div>

                    
                    <div className="aff-card" style={{ marginBottom: '1.5rem' }}>
                        <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: '1.25rem' }}>Your Financial Details</p>

                        <div className="aff-grid-2" style={{ marginBottom: '1rem' }}>
                            <div>
                                <label style={labelStyle}>Monthly Take-Home Income (₹)</label>
                                <input className="aff-input" style={inputStyle('monthlyIncome')} type="number" placeholder="e.g. 80000" value={form.monthlyIncome} onChange={set('monthlyIncome')} />
                                {errors.monthlyIncome && <p style={{ color: '#EF4444', fontSize: '0.72rem', margin: '4px 0 0' }}>{errors.monthlyIncome}</p>}
                            </div>
                            <div>
                                <label style={labelStyle}>Existing Monthly EMIs (₹) — enter 0 if none</label>
                                <input className="aff-input" style={inputStyle('existingEMIs')} type="number" placeholder="e.g. 12000" value={form.existingEMIs} onChange={set('existingEMIs')} />
                            </div>
                        </div>

                        <p style={{ fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', margin: '1.25rem 0 1rem' }}>This Loan's Details</p>

                        <div className="aff-grid-2" style={{ marginBottom: '1rem' }}>
                            <div>
                                <label style={labelStyle}>Loan Amount (₹)</label>
                                <input className="aff-input" style={inputStyle('loanAmount')} type="number" placeholder="e.g. 1500000" value={form.loanAmount} onChange={set('loanAmount')} />
                                {errors.loanAmount && <p style={{ color: '#EF4444', fontSize: '0.72rem', margin: '4px 0 0' }}>{errors.loanAmount}</p>}
                            </div>
                            <div>
                                <label style={labelStyle}>Down Payment (₹) — optional</label>
                                <input className="aff-input" style={inputStyle('downPayment')} type="number" placeholder="e.g. 300000" value={form.downPayment} onChange={set('downPayment')} />
                            </div>
                            <div>
                                <label style={labelStyle}>Interest Rate (% per annum)</label>
                                <input className="aff-input" style={inputStyle('interestRate')} type="number" step="0.1" placeholder="e.g. 10.5" value={form.interestRate} onChange={set('interestRate')} />
                                {errors.interestRate && <p style={{ color: '#EF4444', fontSize: '0.72rem', margin: '4px 0 0' }}>{errors.interestRate}</p>}
                            </div>
                            <div>
                                <label style={labelStyle}>Tenure (months)</label>
                                <input className="aff-input" style={inputStyle('tenureMonths')} type="number" placeholder="e.g. 60" value={form.tenureMonths} onChange={set('tenureMonths')} />
                                {errors.tenureMonths && <p style={{ color: '#EF4444', fontSize: '0.72rem', margin: '4px 0 0' }}>{errors.tenureMonths}</p>}
                            </div>
                        </div>

                        <button onClick={handleCalculate} style={{ width: '100%', padding: '13px', background: 'linear-gradient(135deg,#C8A850,#a07830)', color: '#0F172A', fontFamily: "'Sora',sans-serif", fontWeight: 800, fontSize: '1rem', border: 'none', borderRadius: '12px', cursor: 'pointer', letterSpacing: '0.02em', transition: 'transform 0.15s,box-shadow 0.15s', boxShadow: '0 4px 20px rgba(200,168,80,0.3)' }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(200,168,80,0.45)'; }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(200,168,80,0.3)'; }}
                        >
                            Check Affordability →
                        </button>
                    </div>

                    
                    {result && (
                        <div ref={resultRef} className="aff-result">

                           
                            <div style={{ background: `${result.color}10`, border: `1px solid ${result.color}35`, borderRadius: '20px', padding: '1.75rem', marginBottom: '1.25rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                                    <span style={{ fontSize: '2rem' }}>{result.icon}</span>
                                    <div>
                                        <div style={{ color: result.color, fontWeight: 800, fontSize: '1.4rem', lineHeight: 1 }}>{result.verdict}</div>
                                        <div style={{ color: '#94A3B8', fontFamily: "'DM Sans',sans-serif", fontSize: '0.82rem', marginTop: '3px' }}>Debt-to-Income Ratio</div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                                        <div style={{ color: result.color, fontSize: '2.5rem', fontWeight: 800, lineHeight: 1 }}>{displayDTI}%</div>
                                        <div style={{ color: '#94A3B8', fontSize: '0.72rem' }}>of monthly income</div>
                                    </div>
                                </div>
                                
                                <div style={{ height: '10px', background: 'rgba(255,255,255,0.07)', borderRadius: '5px', overflow: 'hidden', marginBottom: '10px' }}>
                                    <div style={{ height: '100%', width: `${Math.min(result.dtiRatio, 100)}%`, background: `linear-gradient(90deg,#10B981,${result.color})`, borderRadius: '5px', transition: 'width 1s ease' }} />
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginBottom: '12px' }}>
                                    <span>0%</span><span style={{ color: '#10B981' }}>Safe ≤40%</span><span>100%</span>
                                </div>
                                <p style={{ color: '#F1F5F9', fontFamily: "'DM Sans',sans-serif", fontSize: '0.9rem', lineHeight: 1.65, margin: 0 }}>{result.message}</p>
                            </div>

                           
                            <div className="aff-grid-2" style={{ marginBottom: '1.25rem' }}>
                                {[
                                    { label: 'New Monthly EMI', val: `₹${result.newEMI.toLocaleString('en-IN')}`, color: '#C8A850' },
                                    { label: 'Total Monthly EMIs', val: `₹${result.totalEMI.toLocaleString('en-IN')}`, color: result.dtiRatio > 40 ? '#EF4444' : '#10B981' },
                                    { label: 'Max Safe EMI Budget', val: `₹${Math.round(result.maxAllowedEMI).toLocaleString('en-IN')}`, color: '#3B82F6' },
                                    { label: 'Monthly Surplus', val: `₹${result.surplus.toLocaleString('en-IN')}`, color: result.surplus < 0 ? '#EF4444' : '#10B981' },
                                    { label: 'Total Interest Paid', val: `₹${result.totalInterest.toLocaleString('en-IN')}`, color: '#EF4444' },
                                    { label: 'Total Loan Cost', val: `₹${result.totalCost.toLocaleString('en-IN')}`, color: '#F1F5F9' },
                                ].map(item => (
                                    <div key={item.label} className="aff-card" style={{ padding: '1rem' }}>
                                        <div style={{ color: '#94A3B8', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '6px' }}>{item.label}</div>
                                        <div style={{ color: item.color, fontSize: '1.3rem', fontWeight: 800 }}>{item.val}</div>
                                    </div>
                                ))}
                            </div>

                            
                            <div className="aff-card" style={{ marginBottom: '1.25rem' }}>
                                <p style={{ color: '#C8A850', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.07em', margin: '0 0 1rem' }}>💡 Smart Recommendations</p>
                                {result.dtiRatio > 40 && (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        {[
                                            `Increase your down payment by ₹${Math.round((result.totalEMI - result.maxAllowedEMI) * Number(form.tenureMonths) * 0.6).toLocaleString('en-IN')} to bring your EMI within safe limits.`,
                                            `Extend your tenure from ${form.tenureMonths} to ${Math.round(Number(form.tenureMonths) * 1.3)} months to reduce the monthly payment.`,
                                            `Look for a loan with an interest rate below ${(Number(form.interestRate) - 1.5).toFixed(1)}% — even 1% less saves significantly.`,
                                        ].map((tip, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '10px', padding: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                                                <span style={{ color: '#C8A850', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                                                <span style={{ color: '#94A3B8', fontFamily: "'DM Sans',sans-serif", fontSize: '0.85rem', lineHeight: 1.55 }}>{tip}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {result.dtiRatio <= 40 && (
                                    <p style={{ color: '#94A3B8', fontFamily: "'DM Sans',sans-serif", fontSize: '0.875rem', lineHeight: 1.65, margin: 0 }}>
                                        Your finances look good for this loan! Now make sure the contract terms are fair.
                                        <Link to="/upload" style={{ color: '#C8A850', marginLeft: '6px', fontWeight: 700 }}>Upload your contract for analysis →</Link>
                                    </p>
                                )}
                            </div>

                            <div style={{ textAlign: 'center' }}>
                                <button onClick={() => { setResult(null); setForm({ monthlyIncome: '', existingEMIs: '', loanAmount: '', downPayment: '', interestRate: '', tenureMonths: '' }); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#94A3B8', padding: '10px 24px', borderRadius: '10px', cursor: 'pointer', fontFamily: "'Sora',sans-serif", fontSize: '0.82rem', fontWeight: 600 }}>
                                    ← Calculate Again
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AffordabilityPage;