import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import API_BASE from '../config/api';

const AnalyticsPage = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const barRef = useRef(null);
    const donutRef = useRef(null);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        fetch(`${API_BASE}/api/analytics`, { headers: { Authorization: `Bearer ${token}` } })
            .then(r => r.json())
            .then(res => { if (res.success) setData(res.analytics); })
            .finally(() => setLoading(false));
    }, []);

    // Native Canvas Drawing (Zero Dependencies!)
    useEffect(() => {
        if (!data || !barRef.current || !donutRef.current) return;

        // Draw Bar Chart (Monthly)
        const ctxBar = barRef.current.getContext('2d');
        ctxBar.clearRect(0, 0, 400, 200);
        const maxCount = Math.max(...data.monthly.map(d => d.count), 1);
        const barW = 40;
        const gap = (400 - (6 * barW)) / 7;

        data.monthly.forEach((m, i) => {
            const h = (m.count / maxCount) * 150;
            const x = gap + i * (barW + gap);
            const y = 170 - h;

            ctxBar.fillStyle = '#C8A850';
            ctxBar.beginPath();
            ctxBar.roundRect(x, y, barW, h, [6, 6, 0, 0]);
            ctxBar.fill();

            ctxBar.fillStyle = '#94A3B8';
            ctxBar.font = '12px sans-serif';
            ctxBar.textAlign = 'center';
            ctxBar.fillText(m.label, x + barW / 2, 190);
            if (m.count > 0) {
                ctxBar.fillStyle = '#fff';
                ctxBar.fillText(m.count, x + barW / 2, y - 8);
            }
        });

        // Draw Donut Chart (Scores)
        const ctxDonut = donutRef.current.getContext('2d');
        ctxDonut.clearRect(0, 0, 200, 200);
        const totalScores = data.scoreDist.poor + data.scoreDist.fair + data.scoreDist.good || 1;
        let startAngle = -Math.PI / 2;

        const drawSlice = (count, color) => {
            if (count === 0) return;
            const sliceAngle = (count / totalScores) * 2 * Math.PI;
            ctxDonut.beginPath();
            ctxDonut.arc(100, 100, 80, startAngle, startAngle + sliceAngle);
            ctxDonut.lineWidth = 30;
            ctxDonut.strokeStyle = color;
            ctxDonut.stroke();
            startAngle += sliceAngle;
        };

        drawSlice(data.scoreDist.good, '#10B981'); // Green
        drawSlice(data.scoreDist.fair, '#F59E0B'); // Yellow
        drawSlice(data.scoreDist.poor, '#EF4444'); // Red
    }, [data]);

    if (loading) return <div style={{ minHeight: '100vh', background: '#050816', color: '#C8A850', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading Analytics...</div>;

    return (
        <div className="page-enter" style={{ minHeight: '100vh', background: '#050816', color: '#F1F5F9', padding: '2.5rem 1.5rem', fontFamily: "'Sora', sans-serif" }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <span style={{ background: 'rgba(59,130,246,0.15)', color: '#60a5fa', padding: '4px 14px', borderRadius: '99px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Insights</span>
                        <h1 style={{ margin: '8px 0 0', fontSize: '2rem', fontWeight: 800 }}>Deal Analytics</h1>
                    </div>
                    <Link to="/" style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', color: '#94A3B8', textDecoration: 'none', fontSize: '0.85rem' }}>← Dashboard</Link>
                </div>

                {/* Top Stat Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem', borderRadius: '18px' }}>
                        <p style={{ color: '#94A3B8', margin: '0 0 8px', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Total Contracts</p>
                        <p style={{ margin: 0, fontSize: '2.2rem', fontWeight: 800, color: '#fff' }}>{data.total}</p>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem', borderRadius: '18px' }}>
                        <p style={{ color: '#94A3B8', margin: '0 0 8px', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Avg Contract Price</p>
                        <p style={{ margin: 0, fontSize: '2.2rem', fontWeight: 800, color: '#C8A850' }}>₹{data.avgPrice.toLocaleString()}</p>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                    {/* Uploads Bar Chart */}
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem', borderRadius: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3 style={{ margin: '0 0 1rem', width: '100%', fontSize: '1rem', color: '#F1F5F9' }}>Uploads Over Time</h3>
                        <canvas ref={barRef} width={400} height={200} style={{ width: '100%', maxWidth: '400px' }} />
                    </div>

                    {/* Score Donut */}
                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem', borderRadius: '18px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h3 style={{ margin: '0 0 1rem', width: '100%', fontSize: '1rem', color: '#F1F5F9' }}>Score Distribution</h3>
                        <canvas ref={donutRef} width={200} height={200} />
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', fontSize: '0.8rem' }}>
                            <span style={{ color: '#10B981' }}>● Good: {data.scoreDist.good}</span>
                            <span style={{ color: '#F59E0B' }}>● Fair: {data.scoreDist.fair}</span>
                            <span style={{ color: '#EF4444' }}>● Poor: {data.scoreDist.poor}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default AnalyticsPage;
