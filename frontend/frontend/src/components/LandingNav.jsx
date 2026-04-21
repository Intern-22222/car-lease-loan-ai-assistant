import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const LandingNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? '#C8A850' : 'rgba(255,255,255,0.55)';

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Mission', path: '/mission' },
        { name: 'Contact', path: '/contact' }
    ];

    return (
        <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10, 14, 30, 0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontFamily: "'DM Sans', sans-serif" }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', height: '64px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
                    <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #C8A850, #a07830)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', boxShadow: '0 4px 12px rgba(200,168,80,0.2)' }}>
                        🚗
                    </div>
                    <span style={{ fontFamily: "'Sora', sans-serif", fontWeight: 700, color: '#fff', fontSize: '1.1rem', letterSpacing: '0.5px' }}>AutoLease AI</span>
                </Link>

                {/* Desktop Links */}
                <div style={{ display: 'none', gap: '2rem', '@media (min-width: 768px)': { display: 'flex' } }} className="desktop-nav">
                    {navLinks.map(link => (
                        <Link key={link.name} to={link.path} style={{ textDecoration: 'none', color: isActive(link.path), fontWeight: 500, fontSize: '0.95rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.target.style.color = '#fff'} onMouseLeave={(e) => e.target.style.color = isActive(link.path)}>
                            {link.name}
                        </Link>
                    ))}
                </div>

                {/* CTAs */}
                <div style={{ display: 'none', gap: '1rem', alignItems: 'center', '@media (min-width: 768px)': { display: 'flex' } }} className="desktop-nav">
                    <Link to="/login" style={{ textDecoration: 'none', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 600, transition: 'all 0.2s' }} onMouseEnter={(e) => { e.target.style.background = 'rgba(255,255,255,0.05)'; e.target.style.color = '#fff'; }} onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.color = 'rgba(255,255,255,0.7)'; }}>
                        Sign In
                    </Link>
                    <Link to="/signup" style={{ textDecoration: 'none', background: 'linear-gradient(135deg, #C8A850, #a07830)', color: '#0F172A', padding: '8px 18px', borderRadius: '8px', fontSize: '0.9rem', fontWeight: 700, boxShadow: '0 4px 14px rgba(200,168,80,0.3)', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}>
                        Get Started &rarr;
                    </Link>
                </div>

                {/* Mobile Hamburger */}
                <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'block' }} className="mobile-toggle">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d={isOpen ? "M18 6L6 18M6 6l12 12" : "M3 12h18M3 6h18M3 18h18"} strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
            </div>

            {/* Mobile Dropdown */}
            {isOpen && (
                <div style={{ position: 'absolute', top: '64px', left: 0, right: 0, background: 'rgba(10,14,30,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {navLinks.map(link => (
                        <Link key={link.name} to={link.path} onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: isActive(link.path), fontSize: '1rem', fontWeight: 500, padding: '0.5rem 0' }}>{link.name}</Link>
                    ))}
                    <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }}></div>
                    <Link to="/login" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', color: '#fff', textAlign: 'center', padding: '10px', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}>Sign In</Link>
                    <Link to="/signup" onClick={() => setIsOpen(false)} style={{ textDecoration: 'none', background: '#C8A850', color: '#0F172A', textAlign: 'center', padding: '10px', borderRadius: '8px', fontWeight: 700 }}>Get Started</Link>
                </div>
            )}

            <style>{`
                @media (min-width: 768px) { .mobile-toggle { display: none !important; } .desktop-nav { display: flex !important; } }
                @media (max-width: 767px) { .desktop-nav { display: none !important; } }
            `}</style>
        </nav>
    );
};

export default LandingNav;

