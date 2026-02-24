'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ShieldCheck,
    LayoutDashboard,
    Globe,
    BarChart3,
    Bell,
    Settings as SettingsIcon,
    LogOut,
    Mail,
    User,
    CreditCard,
    Save,
    BellRing
} from 'lucide-react';

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

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

            const userData = { ...user, ...profile };
            setUser(userData);
            setEmail(user.email || '');
            setName(userData.full_name || user.user_metadata?.full_name || '');
        }
    };

    const handleLogout = async () => {
        const { createClient } = await import('@/utils/supabase/client');
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = '/';
    };

    const handleSave = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            alert('Settings saved successfully!');
        }, 1000);
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
                    <Link href="/settings" className="nav-item active" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <SettingsIcon size={20} />
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
                <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '1.875rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            Settings
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
                        <p style={{ color: 'var(--secondary)' }}>Manage your account preferences and notification settings.</p>
                    </div>
                </header>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {/* Profile Settings */}
                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <User size={24} color="var(--primary)" />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Profile Information</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '500px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Full Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--secondary)' }} />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{ width: '100%', padding: '0.75rem 0.75rem 0.75rem 2.5rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                                    />
                                </div>
                            </div>
                            <button onClick={handleSave} className="btn btn-primary" style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Save size={18} />
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>

                    {/* Billing Settings */}
                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <CreditCard size={24} color="var(--primary)" />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Billing & Subscriptions</h3>
                        </div>
                        <div style={{ padding: '1.5rem', borderRadius: '12px', background: '#f8fafc', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontWeight: 700 }}>{user?.is_pro ? 'Pro Annual Plan' : 'Free Plan'}</p>
                                <p style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>
                                    {user?.is_pro ? 'Unlimited monitored links, priority tracking.' : 'Up to 3 links, daily monitoring.'}
                                </p>
                            </div>
                            {!user?.is_pro && (
                                <Link href="/dashboard">
                                    <button className="btn btn-primary" style={{ background: 'var(--dark)', borderColor: 'var(--dark)' }}>Upgrade to Pro</button>
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Alert Settings */}
                    <div className="card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <BellRing size={24} color="var(--primary)" />
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Alert Preferences</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
                                <span>Receive email alerts when a link failure is detected</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
                                <input type="checkbox" defaultChecked style={{ width: '20px', height: '20px' }} />
                                <span>Weekly uptime summary reports</span>
                            </label>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
