'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ShieldCheck,
    ArrowLeft,
    Plus,
    Trash2,
    Globe,
    ExternalLink,
    Loader2,
    AlertCircle,
    LayoutDashboard,
    BarChart3,
    Bell,
    Settings,
    LogOut
} from 'lucide-react';

export default function LinksPage() {
    const [links, setLinks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [url, setUrl] = useState('');
    const [platform, setPlatform] = useState('Instagram');

    useEffect(() => {
        fetchLinks();
    }, []);

    const fetchLinks = async () => {
        try {
            const res = await fetch('/api/links');
            const data = await res.json();
            setLinks(data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddLink = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setSubmitting(true);
        try {
            const res = await fetch('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ platform, url })
            });
            if (res.ok) {
                const newLink = await res.json();
                setLinks([newLink, ...links]);
                setUrl('');
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`/api/links?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setLinks(links.filter(l => l.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="dashboard-container" style={{ background: '#f8fafc' }}>
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
                    <Link href="/links" className="nav-item active" style={{ textDecoration: 'none', color: 'inherit' }}>
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
                </nav>

                <Link href="/" className="nav-item" style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1.5rem', textDecoration: 'none', color: 'inherit' }}>
                    <LogOut size={20} />
                    <span>Logout</span>
                </Link>
            </aside>

            <main className="main-content">
                <header style={{ marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Monitored Links</h2>
                    <p style={{ color: 'var(--secondary)' }}>Manage and track your social media links in real-time.</p>
                </header>

                {/* Add New Link Form */}
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Add New Link</h3>
                    <form onSubmit={handleAddLink} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Platform</label>
                            <select
                                value={platform}
                                onChange={(e) => setPlatform(e.target.value)}
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                            >
                                <option>Instagram</option>
                                <option>TikTok</option>
                                <option>Twitter</option>
                                <option>YouTube</option>
                                <option>Linktree</option>
                                <option>Personal Website</option>
                                <option>Other</option>
                            </select>
                        </div>
                        <div style={{ flex: 2 }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.5rem' }}>Target URL</label>
                            <input
                                type="url"
                                placeholder="https://example.com/your-profile"
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                required
                                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border)' }}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={submitting}
                            style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                            {submitting ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                            Add Link
                        </button>
                    </form>
                </div>

                {/* Links List */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Active Monitoring List</h3>
                        <span style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>{links.length} links tracked</span>
                    </div>

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '3rem' }}>
                            <Loader2 className="animate-spin" size={40} color="var(--primary)" style={{ margin: '0 auto 1rem' }} />
                            <p style={{ color: 'var(--secondary)' }}>Accessing monitoring servers... 🛡️</p>
                        </div>
                    ) : links.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '3rem', border: '2px dashed var(--border)', borderRadius: '12px' }}>
                            <AlertCircle size={40} color="var(--secondary)" style={{ margin: '0 auto 1rem' }} />
                            <p style={{ color: 'var(--secondary)', fontSize: '1.125rem' }}>No links found. Use the form above to add your first bio link!</p>
                        </div>
                    ) : (
                        <div style={{ width: '100%' }}>
                            {links.map((link) => (
                                <div key={link.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '1.25rem 0',
                                    borderBottom: '1px solid var(--border)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            background: 'var(--accent)',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <Globe size={24} color="var(--primary)" />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 700, fontSize: '1rem' }}>{link.platform}</p>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--secondary)', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{link.url}</p>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <span className={`badge ${link.status === 'Online' ? 'badge-online' : 'badge-error'}`} style={{ display: 'inline-block', marginBottom: '0.25rem' }}>
                                                {link.status}
                                            </span>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--secondary)' }}>
                                                Last check: {new Date(link.last_checked).toLocaleTimeString()}
                                            </p>
                                        </div>
                                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                                            <Link href={link.url} target="_blank" className="btn-icon">
                                                <ExternalLink size={20} color="var(--secondary)" />
                                            </Link>
                                            <button onClick={() => handleDelete(link.id)} className="btn-icon" style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                                <Trash2 size={20} color="var(--danger)" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <style jsx>{`
        .btn-icon {
          padding: 8px;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .btn-icon:hover {
          background: #f1f5f9;
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
}
