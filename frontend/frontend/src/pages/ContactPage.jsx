// import React, { useState, useEffect } from 'react';
// import LandingNav from '../components/LandingNav';
// import { toast } from 'react-toastify';

// const ContactPage = () => {
//     const [formData, setFormData] = useState({ name: '', email: '', subject: 'Question about my analysis', message: '' });
//     const [submitted, setSubmitted] = useState(false);

//     useEffect(() => {
//         const observer = new IntersectionObserver((entries) => {
//             entries.forEach(entry => {
//                 if (entry.isIntersecting) {
//                     entry.target.classList.add('reveal-visible');
//                     observer.unobserve(entry.target);
//                 }
//             });
//         }, { threshold: 0.15 });
//         document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
//         return () => observer.disconnect();
//     }, []);

//     const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!formData.name || !formData.email || !formData.message) {
//             toast.error("Please fill out all required fields.");
//             return;
//         }

//         // Option A implementation: Open email client
//         const subject = encodeURIComponent(`[AutoLease AI] ${formData.subject} - from ${formData.name}`);
//         const body = encodeURIComponent(`Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`);
//         window.open(`mailto:hello@autoleaseai.com?subject=${subject}&body=${body}`); // Replace with your email if you want

//         toast.success("Opening your email client...");
//         setSubmitted(true);
//     };

//     const inputStyle = {
//         background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
//         padding: '12px 14px', color: '#F1F5F9', fontFamily: "'DM Sans', sans-serif", width: '100%', outline: 'none',
//         marginBottom: '1rem', transition: 'border-color 0.2s'
//     };

//     return (
//         <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1A1F2E 50%, #0D1117 100%)', color: '#F1F5F9', fontFamily: "'DM Sans', sans-serif" }}>
//             <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none', zIndex: 0 }}></div>
//             <LandingNav />

//             <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', padding: '4rem 1.5rem 8rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>

//                 {/* LEFT: INFO */}
//                 <div className="reveal">
//                     <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', color: '#fff' }}>Get in Touch</h1>
//                     <p style={{ color: '#94A3B8', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
//                         Have a question about your contract analysis?<br />Found a bug? Want to suggest a feature?<br />I'd love to hear from you.
//                     </p>

//                     <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ color: '#C8A850' }}>📧</span> support@autoleaseai.com</div>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ color: '#C8A850' }}>🐙</span> github.com/sahil</div>
//                         <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ color: '#C8A850' }}>💼</span> linkedin.com/in/sahil</div>
//                     </div>

//                     <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', borderLeft: '2px solid #C8A850', fontSize: '0.9rem', color: '#94A3B8' }}>
//                         Response time: Usually within 24 hours.
//                     </div>
//                 </div>

//                 {/* RIGHT: FORM */}
//                 <div className="reveal reveal-delay-1" style={{ background: '#1E2640', padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
//                     {submitted ? (
//                         <div style={{ textAlign: 'center', padding: '2rem 0' }}>
//                             <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
//                             <h2 style={{ fontFamily: "'Sora', sans-serif", marginBottom: '1rem' }}>Email Client Opened!</h2>
//                             <p style={{ color: '#94A3B8', marginBottom: '2rem' }}>Check your email app to send the message. I'll get back to you within 24 hours.</p>
//                             <button onClick={() => setSubmitted(false)} style={{ background: 'transparent', border: '1px solid rgba(200,168,80,0.5)', color: '#C8A850', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Write Another</button>
//                         </div>
//                     ) : (
//                         <form onSubmit={handleSubmit}>
//                             <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>Name *</label>
//                             <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#C8A850'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />

//                             <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>Email *</label>
//                             <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#C8A850'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />

//                             <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>Topic</label>
//                             <select name="subject" value={formData.subject} onChange={handleChange} style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }} onFocus={(e) => e.target.style.borderColor = '#C8A850'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}>
//                                 <option>Question about my analysis</option>
//                                 <option>Bug report</option>
//                                 <option>Feature request</option>
//                                 <option>Business inquiry</option>
//                                 <option>Other</option>
//                             </select>

//                             <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>Message *</label>
//                             <textarea name="message" rows="5" value={formData.message} onChange={handleChange} required style={{ ...inputStyle, resize: 'vertical' }} onFocus={(e) => e.target.style.borderColor = '#C8A850'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}></textarea>

//                             <button type="submit" style={{ width: '100%', background: 'linear-gradient(135deg, #C8A850, #a07830)', color: '#0F172A', padding: '14px', borderRadius: '10px', fontSize: '1rem', fontWeight: 700, border: 'none', cursor: 'pointer', marginTop: '1rem' }}>
//                                 Send Message
//                             </button>
//                         </form>
//                     )}
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ContactPage;

import React, { useState, useEffect } from 'react';
import LandingNav from '../components/LandingNav';
import { toast } from 'react-toastify';
import API_BASE from '../config/api'; // Make sure this import is here!

const ContactPage = () => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: 'Question about my analysis', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [isSending, setIsSending] = useState(false); // Added loading state

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

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.message) {
            toast.error("Please fill out all required fields.");
            return;
        }

        setIsSending(true);
        const toastId = toast.loading("Sending your message...");

        try {
            // Send the data to your new backend route
            const res = await fetch(`${API_BASE}/api/contact`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success) {
                toast.update(toastId, { render: "Message sent successfully!", type: "success", isLoading: false, autoClose: 3000 });
                setSubmitted(true);
            } else {
                toast.update(toastId, { render: data.message || "Failed to send message.", type: "error", isLoading: false, autoClose: 4000 });
            }
        } catch (error) {
            toast.update(toastId, { render: "Server error. Could not connect.", type: "error", isLoading: false, autoClose: 4000 });
        } finally {
            setIsSending(false);
        }
    };

    const inputStyle = {
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px',
        padding: '12px 14px', color: '#F1F5F9', fontFamily: "'DM Sans', sans-serif", width: '100%', outline: 'none',
        marginBottom: '1rem', transition: 'border-color 0.2s'
    };

    const optionStyle = { background: '#1E2640', color: '#F1F5F9', padding: '10px' };

    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0F172A 0%, #1A1F2E 50%, #0D1117 100%)', color: '#F1F5F9', fontFamily: "'DM Sans', sans-serif" }}>
            <div style={{ position: 'fixed', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)', backgroundSize: '48px 48px', pointerEvents: 'none', zIndex: 0 }}></div>
            <LandingNav />

            <div style={{ position: 'relative', zIndex: 1, maxWidth: '1000px', margin: '0 auto', padding: '4rem 1.5rem 8rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem' }}>

                {/* LEFT: INFO */}
                <div className="reveal">
                    <h1 style={{ fontFamily: "'Sora', sans-serif", fontSize: '2.5rem', fontWeight: 800, marginBottom: '1.5rem', color: '#fff' }}>Get in Touch</h1>
                    <p style={{ color: '#94A3B8', fontSize: '1.1rem', lineHeight: 1.6, marginBottom: '2.5rem' }}>
                        Have a question about your contract analysis?<br />Found a bug? Want to suggest a feature?<br />I'd love to hear from you.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ color: '#C8A850' }}>📧</span> support@autoleaseai.com</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ color: '#C8A850' }}>🐙</span> github.com/sahil</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ color: '#C8A850' }}>💼</span> linkedin.com/in/sahil</div>
                    </div>

                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', borderLeft: '2px solid #C8A850', fontSize: '0.9rem', color: '#94A3B8' }}>
                        Response time: Usually within 24 hours.
                    </div>
                </div>

                {/* RIGHT: FORM */}
                <div className="reveal reveal-delay-1" style={{ background: '#1E2640', padding: '2.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                    {submitted ? (
                        <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                            <h2 style={{ fontFamily: "'Sora', sans-serif", marginBottom: '1rem' }}>Message Sent!</h2>
                            <p style={{ color: '#94A3B8', marginBottom: '2rem' }}>Thank you for reaching out. I've received your message and will get back to you soon.</p>
                            <button onClick={() => { setSubmitted(false); setFormData({ ...formData, message: '' }) }} style={{ background: 'transparent', border: '1px solid rgba(200,168,80,0.5)', color: '#C8A850', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer' }}>Write Another</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>Name *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#C8A850'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} disabled={isSending} />

                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>Email *</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required style={inputStyle} onFocus={(e) => e.target.style.borderColor = '#C8A850'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} disabled={isSending} />

                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>Topic</label>
                            <select name="subject" value={formData.subject} onChange={handleChange} style={{ ...inputStyle, cursor: 'pointer' }} onFocus={(e) => e.target.style.borderColor = '#C8A850'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} disabled={isSending}>
                                <option value="Question about my analysis" style={optionStyle}>Question about my analysis</option>
                                <option value="Bug report" style={optionStyle}>Bug report</option>
                                <option value="Feature request" style={optionStyle}>Feature request</option>
                                <option value="Business inquiry" style={optionStyle}>Business inquiry</option>
                                <option value="Other" style={optionStyle}>Other</option>
                            </select>

                            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', color: '#94A3B8', fontWeight: 600 }}>Message *</label>
                            <textarea name="message" rows="5" value={formData.message} onChange={handleChange} required style={{ ...inputStyle, resize: 'vertical' }} onFocus={(e) => e.target.style.borderColor = '#C8A850'} onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} disabled={isSending}></textarea>

                            <button type="submit" disabled={isSending} style={{ width: '100%', background: 'linear-gradient(135deg, #C8A850, #a07830)', color: '#0F172A', padding: '14px', borderRadius: '10px', fontSize: '1rem', fontWeight: 700, border: 'none', cursor: isSending ? 'not-allowed' : 'pointer', marginTop: '1rem', opacity: isSending ? 0.7 : 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                                {isSending ? (
                                    <>
                                        <svg style={{ animation: 'spin 1s linear infinite' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" /></svg>
                                        Sending...
                                    </>
                                ) : "Send Message"}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactPage;