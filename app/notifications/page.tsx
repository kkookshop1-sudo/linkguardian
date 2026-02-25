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
    CheckCircle2,
    XCircle,
    Clock,
    Mail
} from 'lucide-react';

export default function NotificationsPage() {
    const [links, setLinks] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        fetchLinks();
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

    const fetchLinks = async () => {
        try {
            const res = await fetch('/api/links');
            const data = await res.json();
            setLinks(data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = async () => {
        const { createClient } = await import('@/utils/supabase/client');
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    const generatedNotifications = links.map((link, idx) => ({
        id: link.id || idx,
        type: 'status_check',
        title: link.status === 'Online' ? `Monitoring Active: ${link.platform}` : `Link Alert: ${link.platform}`,
        content: link.status === 'Online'
            ? `Your ${link.platform} link is healthy and accessible.`
            : `We detected a potential issue with your ${link.platform} link (${link.status}).`,
        time: idx === 0 ? 'Just now' : `${idx * 2} hours ago`,
        status: link.status === 'Online' ? 'success' : 'error'
    }));

    const notifications = generatedNotifications.length > 0
        ? generatedNotifications
        : [{ id: 0, type: 'system', title: 'System Ready', content: 'LinkGuardian is watching your back. add links to start!', time: 'Now', status: 'success' }];

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
                    <Link href="/notifications" className="nav-item active" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Bell size={20} />
                        <span>Notifications</span>
                    </Link>
                    <Link href="/settings" className="nav-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Settings size={20} />
                        <span>Settings</span>
                    </Link>
                    <Link href="/support" className="nav-item" style={{ textDecoration: 'none', color: 'inherit' }}>
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
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '1.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            Notifications
                            {user?.is_pro && (
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.625rem',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    borderRadius: '99px',
                                    fontWeight: 800,
                                    letterSpacing: '0.05em'
                                }}>PRO</span>
                            )}
                        </h2>
                        <p style={{ color: 'var(--secondary)' }}>Stay updated with your latest security alerts and system events.</p>
                    </div>
                </header>

                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h4 style={{ fontWeight: 700 }}>Recent Activity</h4>
                        <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem' }}>Mark all as read</button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {notifications.map((n) => (
                            <div key={n.id} style={{
                                display: 'flex',
                                gap: '1rem',
                                padding: '1.25rem',
                                borderRadius: '12px',
                                background: n.status === 'error' ? '#fff1f2' : '#f8fafc',
                                border: n.status === 'error' ? '1px solid #fecdd3' : '1px solid var(--border)'
                            }}>
                                <div style={{ marginTop: '0.25rem' }}>
                                    {n.status === 'error' ? <XCircle color="var(--danger)" /> : <CheckCircle2 color="var(--success)" />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                        <p style={{ fontWeight: 700, color: n.status === 'error' ? '#9f1239' : 'inherit' }}>{n.title}</p>
                                        <span style={{ fontSize: '0.75rem', color: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                            <Clock size={12} />
                                            {n.time}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>{n.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
