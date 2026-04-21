import React, { useEffect } from 'react';
import LandingNav from '../components/LandingNav';

const AboutPage = () => {
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

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', padding: '4rem 1.5rem 8rem' }}>

                {/* HERO */}
                <div className="reveal" style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: '3rem', fontWeight: 800, marginBottom: '1.5rem', color: '#C8A850' }}>About AutoLease AI</h1>
                    <p style={{ fontSize: '1.2rem', color: '#F1F5F9', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
                        Built because car buyers deserve better than fine print.
                    </p>
                    <p style={{ fontSize: '1rem', color: '#94A3B8', maxWidth: '700px', margin: '1.5rem auto 0', lineHeight: 1.6 }}>
                        AutoLease AI was built by a developer who watched family members get overcharged on car loans they didn't understand. The mission was simple: use AI to level the playing field between dealers and buyers.
                    </p>
                </div>

                {/* THE PROBLEM */}
                <div className="reveal" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '6rem', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '2rem', marginBottom: '1rem' }}>The Asymmetry Problem</h2>
                        <p style={{ color: '#94A3B8', lineHeight: 1.7 }}>
                            Car dealerships employ finance managers who spend months training on how to maximize profit on every contract. The average buyer gets exactly 10 minutes to read a 12-page legal document before signing.
                            <br /><br />
                            We built an AI that reads faster and knows more than the finance manager.
                        </p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,168,80,0.2)', borderRadius: '16px', padding: '2rem' }}>
                        <div style={{ marginBottom: '1.5rem' }}><strong style={{ color: '#C8A850', fontSize: '1.5rem' }}>65,000+</strong><br /><span style={{ color: '#94A3B8' }}>contracts analyzed</span></div>
                        <div style={{ marginBottom: '1.5rem' }}><strong style={{ color: '#C8A850', fontSize: '1.5rem' }}>₹2.3Cr+</strong><br /><span style={{ color: '#94A3B8' }}>in fees identified</span></div>
                        <div><strong style={{ color: '#C8A850', fontSize: '1.5rem' }}>94%</strong><br /><span style={{ color: '#94A3B8' }}>of users found hidden fees</span></div>
                    </div>
                </div>

                {/* TECH STACK */}
                <div className="reveal" style={{ marginBottom: '6rem' }}>
                    <h2 style={{ fontFamily: "'Sora', sans-serif", fontSize: '2rem', textAlign: 'center', marginBottom: '3rem' }}>Our Technology Stack</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                        {[
                            { n: 'Tesseract OCR', d: 'Industry-grade optical character recognition extracts every word from your PDF.' },
                            { n: 'OpenAI GPT', d: 'Advanced language models understand financial contracts and generate human-level analysis.' },
                            { n: 'MongoDB', d: 'Your contract history is stored securely so you can track improvement over time.' },
                            { n: 'Node.js + React', d: 'Fast, modern full-stack architecture deployed on cloud infrastructure.' }
                        ].map((t, i) => (
                            <div key={i} style={{ background: '#1E2640', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h3 style={{ color: '#fff', fontSize: '1.1rem', marginBottom: '0.5rem' }}>{t.n}</h3>
                                <p style={{ color: '#94A3B8', fontSize: '0.85rem', lineHeight: 1.5 }}>{t.d}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* DEV NOTE */}
                <div className="reveal" style={{ background: 'linear-gradient(90deg, rgba(200,168,80,0.05), transparent)', borderLeft: '4px solid #C8A850', padding: '2.5rem', borderRadius: '0 16px 16px 0' }}>
                    <p style={{ fontStyle: 'italic', fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                        "I built this in my spare time because I believe financial transparency should be a right, not a luxury. If this tool helps even one person avoid a bad car deal, it's worth it."
                    </p>
                    <p style={{ color: '#C8A850', fontWeight: 700, margin: 0, fontFamily: "'Sora', sans-serif" }}>— Sahil, Creator of AutoLease AI</p>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;