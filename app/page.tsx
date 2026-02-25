import Link from 'next/link';
import {
    ShieldCheck,
    Zap,
    ShieldAlert,
    Globe,
    CheckCircle2,
    ArrowRight,
    BellRing
} from 'lucide-react';
import { createClient } from '@/utils/supabase/server';

export default async function LandingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    return (
        <div style={{ minHeight: '100vh', background: 'white' }}>
            {/* Navigation */}
            <nav className="landing-nav">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={32} color="var(--primary)" />
                    <span style={{ fontSize: '1.5rem', fontWeight: 800 }}>LinkGuardian</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Link href="#features" style={{ fontWeight: 500, color: 'var(--secondary)' }}>Features</Link>
                    <Link href="#pricing" style={{ fontWeight: 500, color: 'var(--secondary)' }}>Pricing</Link>
                    <Link href="/support" style={{ fontWeight: 500, color: 'var(--secondary)' }}>Support</Link>
                    {user ? (
                        <Link href="/dashboard">
                            <button className="btn btn-primary">Dashboard</button>
                        </Link>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link href="/login" style={{ fontWeight: 600, color: 'var(--primary)', marginTop: '0.75rem' }}>Log in</Link>
                            <Link href="/signup">
                                <button className="btn btn-primary">Sign up</button>
                            </Link>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <header className="landing-hero">
                <div className="floating-icon" style={{ marginBottom: '2rem' }}>
                    <ShieldAlert size={64} color="var(--primary)" />
                </div>
                <h1 style={{ fontSize: '4.5rem', lineHeight: 1.1, marginBottom: '1.5rem', maxWidth: '900px' }}>
                    Your Links are Your <span className="gradient-text">Business Armor.</span>
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--secondary)', maxWidth: '650px', marginBottom: '3rem', lineHeight: 1.6 }}>
                    LinkGuardian monitors your social media bio links 24/7. Don't lose followers or sales to a 404 error ever again.
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href={user ? "/dashboard" : "/signup"}>
                        <button className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.125rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            {user ? "Go to Dashboard" : "Start Protecting Now"} <ArrowRight size={20} />
                        </button>
                    </Link>
                </div>
            </header>

            {/* Features Grid */}
            <section id="features" className="feature-grid">
                <div className="feature-card">
                    <div style={{ background: '#eff6ff', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', marginBottom: '1.5rem', margin: '0 auto 1.5rem' }}>
                        <Zap size={30} color="var(--primary)" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Instant Monitoring</h3>
                    <p style={{ color: 'var(--secondary)', lineHeight: 1.6 }}>
                        Our global bots check your links every hour from multiple locations to ensure perfect uptime.
                    </p>
                </div>

                <div className="feature-card">
                    <div style={{ background: '#fef2f2', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', marginBottom: '1.5rem', margin: '0 auto 1.5rem' }}>
                        <BellRing size={30} color="var(--danger)" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Real-time Notifications</h3>
                    <p style={{ color: 'var(--secondary)', lineHeight: 1.6 }}>
                        Get notified via Email the second your link breaks. Take action before your fans notice.
                    </p>
                </div>

                <div className="feature-card">
                    <div style={{ background: '#ecfdf5', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifySelf: 'center', justifyContent: 'center', marginBottom: '1.5rem', margin: '0 auto 1.5rem' }}>
                        <Globe size={30} color="var(--success)" />
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Global Ready</h3>
                    <p style={{ color: 'var(--secondary)', lineHeight: 1.6 }}>
                        Built for global influencers. Pay with PayPal from anywhere in the world and protect your global presence.
                    </p>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="pricing-section">
                <h2 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '1rem' }}>Simple, Honest Pricing.</h2>
                <p style={{ color: 'var(--secondary)', marginBottom: '4rem' }}>No hidden fees. Just total link protection.</p>

                <div style={{ maxWidth: '450px', margin: '0 auto' }} className="card">
                    <div style={{ padding: '2rem' }}>
                        <h4 style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Pro Plan</h4>
                        <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '0.25rem' }}>
                            <span style={{ fontSize: '3rem', fontWeight: 800 }}>$9.99</span>
                            <span style={{ color: 'var(--secondary)' }}>/month</span>
                        </div>
                        <ul style={{ listStyle: 'none', textAlign: 'left', marginBottom: '2.5rem' }}>
                            {[
                                'Monitor up to 50 links',
                                'Hourly status checks',
                                'Real-time email alerts',
                                'Detailed uptime analytics',
                                'Priority support'
                            ].map((item, idx) => (
                                <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--secondary)' }}>
                                    <CheckCircle2 size={20} color="var(--success)" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                        <Link href="/signup">
                            <button className="btn btn-primary" style={{ width: '100%', padding: '1rem' }}>Get Started with Pro</button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{ padding: '4rem 10%', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
                    <ShieldCheck size={24} color="var(--primary)" />
                    <span style={{ fontSize: '1.25rem', fontWeight: 800 }}>LinkGuardian</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '2rem' }}>
                    <Link href="/support" style={{ color: 'var(--secondary)' }}>Contact Support</Link>
                </div>
                <p style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>
                    © 2025 LinkGuardian. Built for the next generation of global creators.
                </p>
            </footer>
        </div>
    );
}
