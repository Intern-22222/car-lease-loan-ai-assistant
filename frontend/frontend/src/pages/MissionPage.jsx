import React, { useEffect } from 'react';
import LandingNav from '../components/LandingNav';

const MissionPage = () => {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1A1F2E 50%, #0D1117 100%)', color: '#F1F5F9', fontFamily: "'DM Sans', sans-serif" }}>
            <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none', zIndex: 0 }}></div>
            <LandingNav />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto', padding: '4rem 1.5rem 8rem' }}>

                {/* HERO */}
                <div className="reveal" style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <span style={{ color: '#C8A850', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem' }}>Our Mission</span>
                    <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, margin: '1rem 0', lineHeight: 1.2 }}>
                        Make contract analysis accessible to every buyer, not just those with a lawyer.
                    </h1>
                </div>

                {/* STATEMENT CARD */}
                <div className="reveal reveal-delay-1" style={{ background: 'rgba(200,168,80,0.05)', border: '1px solid rgba(200,168,80,0.3)', padding: '2.5rem', borderRadius: '16px', marginBottom: '5rem', textAlign: 'center' }}>
                    <p style={{ fontSize: '1.15rem', color: '#F1F5F9', lineHeight: 1.7, margin: 0 }}>
                        We believe every car buyer — regardless of financial background or legal knowledge — deserves to understand exactly what they are signing. AutoLease AI uses artificial intelligence to democratize contract analysis, putting the power of a financial advisor in everyone's pocket.
                    </p>
                </div>

                {/* CORE VALUES */}
                <div className="reveal" style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>Our Core Values</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                        {[
                            { t: 'Transparency', d: 'Every fee should be visible. Every clause should be understood. We surface what dealers hope you\'ll miss.' },
                            { t: 'Empowerment', d: 'Knowledge is negotiating power. We give you the numbers, the script, and the confidence to push back.' },
                            { t: 'Accessibility', d: 'Legal and financial expertise shouldn\'t cost thousands of rupees. We make it free.' }
                        ].map((val, i) => (
                            <div key={i} style={{ background: '#1E2640', padding: '2rem', borderRadius: '12px', borderLeft: '4px solid #3B82F6' }}>
                                <h3 style={{ color: '#fff', fontSize: '1.3rem', marginBottom: '0.5rem', fontFamily: "'Sora', sans-serif" }}>{val.t}</h3>
                                <p style={{ color: '#94A3B8', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>{val.d}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* THE VISION ROADMAP */}
                <div className="reveal">
                    <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>The Vision Roadmap</h2>
                    <div style={{ position: 'relative', paddingLeft: '2rem' }}>
                        {/* Vertical Line */}
                        <div style={{ position: 'absolute', left: '7px', top: '10px', bottom: '10px', width: '2px', background: 'rgba(255,255,255,0.1)' }}></div>

                        {[
                            { status: '✅', color: '#10B981', title: 'Today', desc: 'AI-powered contract analysis for car lease and loans.' },
                            { status: '🔄', color: '#C8A850', title: 'Next', desc: 'Home loan and personal loan analysis integration.' },
                            { status: '🔮', color: '#64748B', title: 'Future', desc: 'Real-time dealer comparison, bank integration, live rate feeds.' }
                        ].map((item, i) => (
                            <div key={i} style={{ position: 'relative', marginBottom: i === 2 ? 0 : '3rem' }}>
                                <div style={{ position: 'absolute', left: '-2rem', top: '2px', width: '16px', height: '16px', borderRadius: '50%', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', boxShadow: `0 0 10px ${item.color}` }}></div>
                                <h3 style={{ color: item.color, fontSize: '1.2rem', marginBottom: '0.5rem', fontFamily: "'Sora', sans-serif" }}>{item.title}</h3>
                                <p style={{ color: '#94A3B8', margin: 0, fontSize: '1rem' }}>{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MissionPage;