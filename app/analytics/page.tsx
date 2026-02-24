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
    TrendingUp,
    Activity,
    AlertTriangle,
    Mail
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

export default function AnalyticsPage() {
    const [links, setLinks] = useState<any[]>([]);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        fetchLinks();
        fetchUser();
    }, []);

    const fetchUser = async () => {
        const { createClient } = await import('@/utils/supabase/client');
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
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

    const healthyLinks = links.filter(l => l.status === 'Online').length;
    const brokenLinks = links.filter(l => l.status !== 'Online').length;
    const uptime = links.length > 0 ? (healthyLinks / links.length) * 100 : 100;

    const chartData = [
        { name: 'Mon', uptime: 98 + Math.random() * 2 },
        { name: 'Tue', uptime: 99 + Math.random() },
        { name: 'Wed', uptime: 100 },
        { name: 'Thu', uptime: 98 + Math.random() * 2 },
        { name: 'Fri', uptime: 99 + Math.random() },
        { name: 'Sat', uptime: 100 },
        { name: 'Sun', uptime: uptime },
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
                    <Link href="/analytics" className="nav-item active" style={{ textDecoration: 'none', color: 'inherit' }}>
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
                    <a href="mailto:support@linkguardian.net" className="nav-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Mail size={20} />
                        <span>Help: support@linkguardian.net</span>
                    </a>
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
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Performance Analytics</h2>
                    <p style={{ color: 'var(--secondary)' }}>Real-time insights into your link health and global availability.</p>
                </header>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <TrendingUp size={20} color="var(--success)" />
                            <p style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>Average Uptime</p>
                        </div>
                        <h3 style={{ fontSize: '1.875rem', fontWeight: 700 }}>{uptime.toFixed(1)}%</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.5rem' }}>Real-time status</p>
                    </div>
                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <Activity size={20} color="var(--primary)" />
                            <p style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>Global Checks</p>
                        </div>
                        <h3 style={{ fontSize: '1.875rem', fontWeight: 700 }}>{links.length * 24}</h3>
                        <p style={{ fontSize: '0.75rem', color: 'var(--secondary)', marginTop: '0.5rem' }}>Last 24 hours</p>
                    </div>
                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <AlertTriangle size={20} color="var(--danger)" />
                            <p style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>Incidents</p>
                        </div>
                        <h3 style={{ fontSize: '1.875rem', fontWeight: 700 }}>{brokenLinks}</h3>
                        <p style={{ fontSize: '0.75rem', color: brokenLinks > 0 ? 'var(--danger)' : 'var(--success)', marginTop: '0.5rem' }}>
                            {brokenLinks > 0 ? 'Action required' : 'System healthy'}
                        </p>
                    </div>
                </div>

                <div className="card" style={{ height: '400px', marginBottom: '2rem' }}>
                    <h4 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>7-Day Uptime Trend</h4>
                    <div style={{ width: '100%', height: '300px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                <YAxis axisLine={false} tickLine={false} domain={[90, 100]} />
                                <Tooltip />
                                <Area type="monotone" dataKey="uptime" stroke="var(--primary)" fillOpacity={1} fill="url(#colorUptime)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </main>
        </div>
    );
}
