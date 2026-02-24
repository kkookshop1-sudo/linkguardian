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
    Clock
} from 'lucide-react';

export default function NotificationsPage() {
    const [links, setLinks] = useState<any[]>([]);

    useEffect(() => {
        fetch('/api/links')
            .then(res => res.json())
            .then(data => setLinks(data || []));
    }, []);

    const notifications = [
        { id: 1, type: 'status_check', title: 'System-wide scan completed', content: 'Checked 12 links. All systems operational.', time: '10 mins ago', status: 'success' },
        { id: 2, type: 'alert', title: 'Link Failure Detected', content: 'Your Instagram profile link returned a 404 error.', time: '2 hours ago', status: 'error' },
        { id: 3, type: 'system', title: 'Plan Upgrade Successful', content: 'Welcome to LinkGuardian Pro!', time: '1 day ago', status: 'success' },
    ];

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
                </nav>

                <Link href="/" className="nav-item" style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', textDecoration: 'none', color: 'inherit' }}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </Link>
            </aside>

            <main className="main-content">
                <header style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Notifications</h2>
                    <p style={{ color: 'var(--secondary)' }}>Stay updated with your latest security alerts and system events.</p>
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
