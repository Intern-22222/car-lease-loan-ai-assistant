import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import LandingNav from '../components/LandingNav';

const LandingPage = () => {
    
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const scrollToHowItWorks = (e) => {
        e.preventDefault();
        document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1A1F2E 50%, #0D1117 100%)', color: '#F1F5F9', fontFamily: "'DM Sans', sans-serif" }}>
            <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none', zIndex: 0 }}></div>

            <LandingNav />

            <div style={{ position: 'relative', zIndex: 1 }}>
                {/* SECTION 1: HERO */}
                <section style={{ padding: '6rem 1.5rem', textAlign: 'center', maxWidth: '1000px', margin: '0 auto' }}>
                    <div className="reveal" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(200,168,80,0.1)', border: '1px solid rgba(200,168,80,0.3)', padding: '6px 16px', borderRadius: '99px', color: '#C8A850', fontSize: '0.85rem', fontWeight: 600, marginBottom: '2rem' }}>
                        <span style={{ fontSize: '10px' }}>●</span> Trusted by 1000+ car buyers
                    </div>

                    <h1 className="reveal reveal-delay-1" style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(2.4rem, 6vw, 4.5rem)', fontWeight: 800, lineHeight: 1.1, margin: '0 0 1.5rem' }}>
                        Your Smartest Move <br />Before Signing Any <br />
                        <span style={{ background: 'linear-gradient(135deg, #C8A850, #f0c060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Car</span> Contract.
                    </h1>

                    <p className="reveal reveal-delay-2" style={{ fontSize: '1.1rem', color: 'rgba(255,255,255,0.6)', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.6 }}>
                        Upload any car lease or loan PDF. Our AI extracts every hidden fee, scores the deal, and coaches you to negotiate like a pro — in under 60 seconds.
                    </p>

                    <div className="reveal reveal-delay-3" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '4rem' }}>
                        <Link to="/signup" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #C8A850, #a07830)', color: '#0F172A', padding: '14px 28px', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 700, boxShadow: '0 8px 24px rgba(200,168,80,0.3)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Get Started Free &rarr;
                        </Link>
                        <a href="#how-it-works" onClick={scrollToHowItWorks} style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', padding: '14px 28px', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Watch How It Works &#9654;
                        </a>
                    </div>

                    <div className="reveal reveal-delay-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '3rem' }}>
                        {[{ v: '₹2.3Cr+', l: 'Total savings identified' }, { v: '65,000+', l: 'Contracts analyzed' }, { v: '94%', l: 'Users found hidden fees' }].map((stat, i) => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(200,168,80,0.15)' }}>
                                <div style={{ fontSize: '2rem', fontFamily: "'Sora', sans-serif", fontWeight: 800, color: '#C8A850', marginBottom: '4px' }}>{stat.v}</div>
                                <div style={{ color: '#94A3B8', fontSize: '0.9rem' }}>{stat.l}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECTION 2: PROBLEM STATEMENT */}
                <section style={{ padding: '6rem 1.5rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <h2 className="reveal" style={{ fontFamily: "'Sora', sans-serif", fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: '3rem' }}>Most people sign car contracts they don't understand.</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {[
                                "Average car buyer pays ₹40,000+ in junk fees they never questioned.",
                                "67% of contracts contain at least one unnecessary add-on.",
                                "Dealers spend weeks training to negotiate. Buyers have 10 minutes."
                            ].map((text, i) => (
                                <div key={i} className={`reveal reveal-delay-${i + 1}`} style={{ background: '#111827', borderLeft: '4px solid #EF4444', padding: '1.5rem', borderRadius: '0 12px 12px 0', display: 'flex', gap: '12px' }}>
                                    <span style={{ fontSize: '1.2rem' }}>🔴</span>
                                    <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>{text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 3: HOW IT WORKS */}
                <section id="how-it-works" style={{ padding: '6rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
                    <h2 className="reveal" style={{ fontFamily: "'Sora', sans-serif", fontSize: '2.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '4rem' }}>How It Works</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', '@media (min-width: 768px)': { flexDirection: 'row', gap: '1rem' } }} className="how-it-works-grid">
                        {[
                            { num: '1', title: 'Upload', desc: 'Drop your PDF contract. Tesseract OCR extracts every term in seconds.' },
                            { num: '2', title: 'Analyze', desc: 'AI scores the deal 0–100, finds every junk fee, and compares it to market price.' },
                            { num: '3', title: 'Negotiate', desc: 'Get a word-for-word negotiation script, plain English summary, and personalized email.' }
                        ].map((step, i) => (
                            <div key={i} className={`reveal reveal-delay-${i + 1}`} style={{ flex: 1, position: 'relative', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', padding: '2rem', borderRadius: '16px', textAlign: 'center' }}>
                                <div style={{ width: '48px', height: '48px', background: 'rgba(200,168,80,0.15)', color: '#C8A850', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, margin: '0 auto 1.5rem', border: '1px solid rgba(200,168,80,0.3)' }}>{step.num}</div>
                                <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.3rem', marginBottom: '1rem' }}>{step.title}</h3>
                                <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: 1.6 }}>{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* SECTION 4: FEATURES */}
                <section style={{ padding: '6rem 1.5rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <h2 className="reveal" style={{ fontFamily: "'Sora', sans-serif", fontSize: '2.5rem', fontWeight: 700, textAlign: 'center', marginBottom: '1rem' }}>Everything You Need</h2>
                        <p className="reveal" style={{ textAlign: 'center', color: '#94A3B8', marginBottom: '4rem' }}>The ultimate toolkit for leveling the playing field.</p>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {[
                                { i: '🔍', t: 'Contract OCR', d: 'Upload any PDF. We extract loan amount, interest rate, tenure, fees — every single field.' },
                                { i: '💰', t: 'Hidden Fee Detector', d: 'AI identifies junk fees like documentation charges, gap insurance, and origination fees.' },
                                { i: '🎯', t: 'Deal Score 0–100', d: 'Instantly know if your deal is Fair, Overpriced, or a Steal with a color-coded verdict.' },
                                { i: '🗣️', t: 'Negotiation Script', d: 'Get a word-for-word script you can speak to any dealer. Generated from your actual numbers.' },
                                { i: '📊', t: 'Analytics Dashboard', d: 'Track your deal history, spot fee patterns, and see your negotiation improvement over time.' },
                                { i: '🎙️', t: 'Voice Read Aloud', d: 'Have your full contract analysis read to you. Perfect for when you\'re on the go.' }
                            ].map((feat, i) => (
                                <div key={i} className="reveal feature-card" style={{ background: '#1E2640', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', transition: 'all 0.3s' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '1rem', background: 'rgba(200,168,80,0.1)', display: 'inline-block', padding: '10px', borderRadius: '12px' }}>{feat.i}</div>
                                    <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.2rem', marginBottom: '10px' }}>{feat.t}</h3>
                                    <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: 1.6 }}>{feat.d}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 5: COMPARISON TABLE */}
                <section style={{ padding: '6rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
                    <h2 className="reveal" style={{ fontFamily: "'Sora', sans-serif", fontSize: '2.2rem', fontWeight: 700, textAlign: 'center', marginBottom: '3rem' }}>AutoLease AI vs The Old Way</h2>
                    <div className="reveal" style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead>
                                <tr style={{ borderBottom: '1px solid rgba(200,168,80,0.3)' }}>
                                    <th style={{ padding: '1.5rem', color: '#94A3B8', fontWeight: 600 }}>Feature</th>
                                    <th style={{ padding: '1.5rem', color: '#94A3B8', fontWeight: 600 }}>Traditional Method</th>
                                    <th style={{ padding: '1.5rem', color: '#C8A850', fontWeight: 800 }}>AutoLease AI</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    ['Contract review time', '2-4 hours with a lawyer', 'Under 60 seconds'],
                                    ['Cost', '₹2,000–10,000 legal fees', 'Free'],
                                    ['Hidden fee detection', 'Manual, often missed', 'AI-powered, guaranteed'],
                                    ['Negotiation help', 'None', 'Word-for-word script'],
                                    ['Deal score', 'Your gut feeling', 'Objective 0-100 score'],
                                    ['Market price check', 'Hours of research', 'Instant, automated']
                                ].map((row, i) => (
                                    <tr key={i} style={{ borderBottom: i === 5 ? 'none' : '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.2)' }}>
                                        <td style={{ padding: '1.2rem 1.5rem', fontWeight: 500 }}>{row[0]}</td>
                                        <td style={{ padding: '1.2rem 1.5rem', color: '#EF4444' }}>{row[1]}</td>
                                        <td style={{ padding: '1.2rem 1.5rem', color: '#10B981', fontWeight: 600 }}>✓ {row[2]}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* SECTION 6: TESTIMONIALS */}
                <section style={{ padding: '6rem 1.5rem', background: 'rgba(0,0,0,0.2)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                        <h2 className="reveal" style={{ fontFamily: "'Sora', sans-serif", fontSize: '2.2rem', fontWeight: 700, textAlign: 'center', marginBottom: '3rem' }}>What Car Buyers Say</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {[
                                { q: "Uploaded my Toyota contract and found ₹45,000 in fees I never even knew existed. Used the negotiation script and got them removed.", n: "Rahul S., Mumbai" },
                                { q: "The deal score showed my Honda loan was overpriced by 12%. The AI email draft helped me negotiate down ₹80,000 in 10 minutes.", n: "Priya M., Bangalore" },
                                { q: "I'm an accountant and even I missed three hidden clauses. This tool caught everything. Worth every second.", n: "Amit K., Delhi" }
                            ].map((test, i) => (
                                <div key={i} className={`reveal reveal-delay-${i + 1}`} style={{ background: 'rgba(255,255,255,0.03)', borderLeft: '4px solid #C8A850', padding: '2rem', borderRadius: '0 16px 16px 0' }}>
                                    <p style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, marginBottom: '1.5rem' }}>"{test.q}"</p>
                                    <p style={{ color: '#C8A850', fontWeight: 700, margin: 0 }}>— {test.n}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION 7: FINAL CTA */}
                <section style={{ padding: '8rem 1.5rem', textAlign: 'center' }}>
                    <h2 className="reveal" style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800, marginBottom: '1rem' }}>
                        Ready to <span style={{ background: 'linear-gradient(135deg, #C8A850, #f0c060)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Stop Overpaying?</span>
                    </h2>
                    <p className="reveal reveal-delay-1" style={{ fontSize: '1.1rem', color: '#94A3B8', marginBottom: '0.5rem' }}>Analyze your first contract free.</p>
                    <p className="reveal reveal-delay-1" style={{ fontSize: '0.9rem', color: '#C8A850', marginBottom: '3rem' }}>No credit card. No hidden fees. (Ironically.)</p>

                    <div className="reveal reveal-delay-2" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
                        <Link to="/signup" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #C8A850, #a07830)', color: '#0F172A', padding: '14px 32px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700, boxShadow: '0 8px 24px rgba(200,168,80,0.3)' }}>
                            Get Started Free &rarr;
                        </Link>
                        <Link to="/login" style={{ textDecoration: 'none', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', padding: '14px 32px', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 600 }}>
                            Sign In &rarr;
                        </Link>
                    </div>

                    <div className="reveal reveal-delay-3" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', color: '#64748B', fontSize: '0.85rem', fontWeight: 600 }}>
                        <span>🔒 Secure</span>
                        <span>⚡ 60-Second Analysis</span>
                        <span>🆓 Free to Start</span>
                    </div>
                </section>

                {/* FOOTER */}
                <footer style={{ borderTop: '1px solid rgba(255,255,255,0.05)', padding: '3rem 1.5rem', background: '#0a0d14' }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem', '@media (min-width: 768px)': { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } }} className="footer-flex">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#C8A850', fontWeight: 700, fontFamily: "'Sora', sans-serif" }}>
                            🚗 AutoLease AI
                        </div>
                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem' }}>
                            <Link to="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>Home</Link>
                            <Link to="/about" style={{ color: '#94A3B8', textDecoration: 'none' }}>About</Link>
                            <Link to="/mission" style={{ color: '#94A3B8', textDecoration: 'none' }}>Mission</Link>
                            <Link to="/contact" style={{ color: '#94A3B8', textDecoration: 'none' }}>Contact</Link>
                        </div>
                        <div style={{ color: '#64748B', fontSize: '0.8rem' }}>
                            © {new Date().getFullYear()} AutoLease AI. Made for smart car buyers.
                        </div>
                    </div>
                </footer>
            </div>

            <style>{`
                @media (min-width: 768px) { .how-it-works-grid { flexDirection: row; } .footer-flex { flexDirection: row !important; align-items: center; justify-content: space-between; } }
                .feature-card:hover { transform: translateY(-5px) !important; border-color: rgba(200,168,80,0.4) !important; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }
            `}</style>
        </div>
    );
};

export default LandingPage;