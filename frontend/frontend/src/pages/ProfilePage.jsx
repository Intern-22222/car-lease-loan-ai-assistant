import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import API_BASE from '../config/api';

const ProfilePage = () => {
    const [stats, setStats] = useState(null);
    const [counters, setCounters] = useState({ total: 0, avgScore: 0 });
    const [phone, setPhone] = useState(localStorage.getItem('userPhone') || '');
    const [passwords, setPasswords] = useState({ old: '', new: '' });
    const [isChangingPass, setIsChangingPass] = useState(false);

    const user = JSON.parse(sessionStorage.getItem('user') || '{}');

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        fetch(`${API_BASE}/api/user/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => {
                if (data.success) setStats(data.stats);
            })
            .catch(err => console.error('Stats fetch error:', err));
    }, []);

    useEffect(() => {
        if (!stats) return;
        const duration = 1000;
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const e = 1 - Math.pow(1 - p, 3);
            setCounters({
                total: Math.round(e * stats.total),
                avgScore: Math.round(e * stats.avgScore),
            });
            if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
    }, [stats]);

    const handlePhoneSave = () => {
        localStorage.setItem('userPhone', phone);
        toast.success('Phone number saved locally!');
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!passwords.old || !passwords.new) return toast.warning('Fill all password fields');
        setIsChangingPass(true);
        try {
            const res = await fetch(`${API_BASE}/api/auth/change-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, oldPassword: passwords.old, newPassword: passwords.new })
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Password updated securely!');
                setPasswords({ old: '', new: '' });
            } else {
                toast.error(data.message || 'Failed to update password');
            }
        } catch (err) {
            toast.error('Network error while updating password');
        } finally {
            setIsChangingPass(false);
        }
    };

    const initial = (user.name || user.email || 'U')[0].toUpperCase();

    return (
        <div className="page-enter" style={{ minHeight: '100vh', background: 'var(--brand-surface, #0F172A)', color: 'var(--brand-text-primary, #F1F5F9)', padding: '2.5rem 1.5rem', fontFamily: "'Sora', sans-serif" }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#94A3B8', textDecoration: 'none', fontSize: '0.85rem', fontWeight: 600, padding: '8px 16px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>← Back to Dashboard</Link>

            <div style={{ maxWidth: '800px', margin: '2.5rem auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* Left Column: Stats & Identity */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ textAlign: 'center', padding: '2rem', background: 'var(--brand-surface-2, #1E2640)', borderRadius: '16px', border: '1px solid var(--brand-border, rgba(255,255,255,0.07))' }}>
                        <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg,#C8A850,#a07830)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, color: '#0F172A', margin: '0 auto 1.25rem', boxShadow: '0 8px 24px rgba(200,168,80,0.3)' }}>
                            {initial}
                        </div>
                        <h2 style={{ margin: '0 0 4px', fontSize: '1.5rem', fontWeight: 800 }}>{user.name || 'User'}</h2>
                        <p style={{ color: '#94A3B8', margin: 0, fontSize: '0.9rem' }}>{user.email || ''}</p>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div className="stat-card" style={{ padding: '1.5rem' }}>
                            <p style={{ color: '#94A3B8', fontSize: '0.78rem', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Contracts</p>
                            <p style={{ color: '#C8A850', fontSize: '2.2rem', fontWeight: 800, margin: 0 }}>{counters.total}</p>
                        </div>
                        <div className="stat-card" style={{ padding: '1.5rem' }}>
                            <p style={{ color: '#94A3B8', fontSize: '0.78rem', margin: '0 0 8px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Avg Score</p>
                            <p style={{ color: '#3B82F6', fontSize: '2.2rem', fontWeight: 800, margin: 0 }}>{counters.avgScore}<span style={{ fontSize: '1rem', color: '#94A3B8' }}>/100</span></p>
                        </div>
                    </div>

                    <div className="stat-card" style={{ padding: '1.5rem' }}>
                        <p style={{ color: '#94A3B8', fontSize: '0.78rem', margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Most Common Junk Fee</p>
                        <p style={{ color: '#EF4444', fontWeight: 700, margin: 0, fontSize: '1.1rem' }}>{stats?.topFee || '—'}</p>
                    </div>
                </div>

                {/* Right Column: Settings */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                    {/* Phone Settings */}
                    <div style={{ background: 'var(--brand-surface-2, #1E2640)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--brand-border, rgba(255,255,255,0.07))' }}>
                        <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: '#C8A850' }}>📱 Contact Info</h3>
                        <p style={{ fontSize: '0.8rem', color: '#94A3B8', marginBottom: '1rem' }}>Saved locally on your device for quick form filling.</p>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <input
                                type="tel"
                                placeholder="+91 98765 43210"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                style={{ flex: 1, padding: '12px 16px', background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
                            />
                            <button onClick={handlePhoneSave} style={{ padding: '0 20px', background: 'rgba(200,168,80,0.15)', color: '#C8A850', border: '1px solid rgba(200,168,80,0.3)', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}>
                                Save
                            </button>
                        </div>
                    </div>

                    {/* Password Settings */}
                    <form onSubmit={handlePasswordChange} style={{ background: 'var(--brand-surface-2, #1E2640)', borderRadius: '16px', padding: '1.5rem', border: '1px solid var(--brand-border, rgba(255,255,255,0.07))' }}>
                        <h3 style={{ margin: '0 0 1.25rem', fontSize: '1.1rem', color: '#C8A850' }}>🔒 Security</h3>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '6px', fontWeight: 600 }}>Current Password</label>
                            <input
                                type="password"
                                value={passwords.old}
                                onChange={e => setPasswords({ ...passwords, old: e.target.value })}
                                style={{ width: '100%', padding: '12px 16px', background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
                            />
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#94A3B8', marginBottom: '6px', fontWeight: 600 }}>New Password</label>
                            <input
                                type="password"
                                value={passwords.new}
                                onChange={e => setPasswords({ ...passwords, new: e.target.value })}
                                style={{ width: '100%', padding: '12px 16px', background: '#111827', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#fff', outline: 'none', fontFamily: "'DM Sans', sans-serif" }}
                            />
                        </div>
                        <button type="submit" disabled={isChangingPass} style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg,#3B82F6,#2563EB)', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', opacity: isChangingPass ? 0.7 : 1 }}>
                            {isChangingPass ? 'Updating...' : 'Update Password'}
                        </button>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default ProfilePage;