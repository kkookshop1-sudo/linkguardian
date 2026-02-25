'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ShieldCheck,
    LayoutDashboard,
    Globe,
    BarChart3,
    Bell,
    Settings,
    LogOut,
    Mail,
    Send
} from 'lucide-react';

export default function SupportPage() {
    const [user, setUser] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        subject: '',
        message: ''
    });

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        const { createClient } = await import('@/utils/supabase/client');
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            const isMaster = user.email === 'kkookshop@gmail.com';
            setUser({ ...user, ...profile, is_pro: profile?.is_pro || isMaster });
        }
    };

    const handleLogout = async () => {
        const { createClient } = await import('@/utils/supabase/client');
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.subject || !formData.message) return;

        setSubmitting(true);
        // Simulate sending a support ticket
        setTimeout(() => {
            setSubmitting(false);
            setSubmitted(true);
            setFormData({ subject: '', message: '' });
            setTimeout(() => setSubmitted(false), 5000);
        }, 1500);
    };

    return (
        <div className="dashboard-container">
            <aside className="sidebar">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}>
                    <ShieldCheck size={32} color="var(--primary)" />
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>LinkGuardian</h1>
                </div>

                <nav style={{ flex: 1 }}>
                    <Link href="/dashboard" className="nav-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </Link>
                    <Link href="/links" className="nav-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Globe size={20} />
                        <span>Monitored Links</span>
                    </Link>
                    <Link href="/analytics" className="nav-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <BarChart3 size={20} />
                        <span>Analytics</span>
                    </Link>
                    <Link href="/notifications" className="nav-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Bell size={20} />
                        <span>Notifications</span>
                    </Link>
                    <Link href="/settings" className="nav-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Settings size={20} />
                        <span>Settings</span>
                    </Link>
                    <Link href="/support" className="nav-item active" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Mail size={20} />
                        <span>Help & Support</span>
                    </Link>
                </nav>

                <button
                    onClick={handleLogout}
                    className="nav-item"
                    style={{
                        marginTop: 'auto',
                        borderTop: '1px solid var(--border)',
                        paddingTop: '1.5rem',
                        background: 'transparent',
                        border: 'none',
                        width: '100%',
                        cursor: 'pointer',
                        textAlign: 'left'
                    }}
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </aside>

            <main className="main-content">
                <header style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        Help & Support
                    </h2>
                    <p style={{ color: 'var(--secondary)' }}>Need help? Send us a message and our team will get back to you.</p>
                </header>

                <div className="card" style={{ maxWidth: '600px' }}>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Subject</label>
                            <input
                                type="text"
                                className="input-field"
                                placeholder="I need help with my billing"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                required
                            />
                        </div>

                        <div className="form-group" style={{ marginTop: '1.5rem' }}>
                            <label>Message</label>
                            <textarea
                                className="input-field"
                                placeholder="Describe your issue in detail..."
                                rows={6}
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            />
                        </div>

                        <div style={{ marginTop: '2rem' }}>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={submitting}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    width: '100%',
                                    justifyContent: 'center'
                                }}
                            >
                                {submitting ? 'Sending...' : (
                                    <>
                                        <Send size={20} />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </div>

                        {submitted && (
                            <div style={{
                                marginTop: '1.5rem',
                                padding: '1rem',
                                background: '#ecfdf5',
                                color: '#047857',
                                borderRadius: '8px',
                                textAlign: 'center',
                                fontWeight: 500
                            }}>
                                Your message has been sent successfully! Our team will contact you soon via email.
                            </div>
                        )}
                    </form>
                </div>

                <div style={{ marginTop: '3rem', maxWidth: '600px' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Frequently Asked Questions</h3>
                    <div className="card" style={{ marginBottom: '1rem' }}>
                        <h4 style={{ fontWeight: 600 }}>How often are links monitored?</h4>
                        <p style={{ color: 'var(--secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>For Pro users, we check every hour. For free users, every 24 hours.</p>
                    </div>
                    <div className="card">
                        <h4 style={{ fontWeight: 600 }}>How do I change my alert email?</h4>
                        <p style={{ color: 'var(--secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>You will receive notifications at the email address associated with your account. You can update this in the Settings tab.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
