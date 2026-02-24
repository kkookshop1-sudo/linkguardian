import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  Globe,
  ShieldCheck,
  LayoutDashboard,
  Settings,
  Bell,
  Plus,
  ExternalLink,
  Clock,
  LogOut
} from 'lucide-react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

export default function Dashboard() {
  const [links, setLinks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const paypalOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "test",
    currency: "USD",
    intent: "capture",
  };

  const healthyLinks = links.filter(l => l.status === 'Online').length;
  const brokenLinks = links.filter(l => l.status !== 'Online').length;

  return (
    <PayPalScriptProvider options={paypalOptions}>
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem' }}>
            <ShieldCheck size={32} color="var(--primary)" />
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800 }}>LinkGuardian</h1>
          </div>

          <nav style={{ flex: 1 }}>
            <Link href="/dashboard" className="nav-item active" style={{ textDecoration: 'none', color: 'inherit' }}>
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
          </nav>

          {/* Upgrade Card */}
          <div style={{
            padding: '1.25rem',
            background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
            borderRadius: '16px',
            marginBottom: '1.5rem',
            border: '1px solid #bfdbfe'
          }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1e40af' }}>🚀 Upgrade to Pro</p>
            <p style={{ fontSize: '0.75rem', color: '#1e3a8a', marginTop: '0.5rem', marginBottom: '1rem' }}>
              Full global monitoring & Real-time alerts.
            </p>
            <div style={{ height: '35px', overflow: 'hidden' }}>
              <PayPalButtons
                style={{ layout: "horizontal", height: 35, color: 'blue', label: 'checkout' }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                      {
                        amount: {
                          currency_code: "USD",
                          value: "9.99",
                        },
                      },
                    ],
                  });
                }}
                onApprove={async (data, actions) => {
                  alert("충성! 결제가 완료되었습니다. 대표님 서비스 업그레이드 진행하겠습니다!");
                }}
              />
            </div>
          </div>

          <div className="nav-item" style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <LogOut size={20} />
            <span>Logout</span>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.875rem', fontWeight: 700 }}>Welcome back, Creator</h2>
              <p style={{ color: 'var(--secondary)' }}>
                {links.length > 0
                  ? `All systems are active. ${healthyLinks} healthy, ${brokenLinks} need attention.`
                  : "Welcome! Let's start by adding your first monitored link."}
              </p>
            </div>
            <Link href="/links">
              <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Plus size={20} />
                Add New Link
              </button>
            </Link>
          </header>

          {/* Stats Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div className="card">
              <p style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>Total Links</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem' }}>{links.length}</h3>
            </div>
            <div className="card">
              <p style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>Uptime (24h)</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--success)' }}>
                {links.length > 0 ? (healthyLinks / links.length * 100).toFixed(1) + '%' : '100%'}
              </h3>
            </div>
            <div className="card">
              <p style={{ color: 'var(--secondary)', fontSize: '0.875rem' }}>Alerts Sent</p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginTop: '0.5rem', color: 'var(--danger)' }}>{brokenLinks}</h3>
            </div>
          </div>

          {/* Links List */}
          <div className="card">
            <h4 style={{ marginBottom: '1.5rem', fontWeight: 700 }}>Active Monitoring</h4>
            <div style={{ width: '100%' }}>
              {loading ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--secondary)' }}>다람쥐들이 데이터를 불러오는 중입니다... 🐿️</p>
              ) : links.length === 0 ? (
                <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--secondary)' }}>아직 등록된 링크가 없습니다. [Add New Link]로 시작하세요!</p>
              ) : (
                links.map((link) => (
                  <div key={link.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1rem 0',
                    borderBottom: '1px solid var(--border)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        background: 'var(--accent)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Globe size={20} color="var(--primary)" />
                      </div>
                      <div>
                        <p style={{ fontWeight: 600 }}>{link.platform}</p>
                        <p style={{ fontSize: '0.875rem', color: 'var(--secondary)' }}>{link.url}</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--secondary)', fontSize: '0.875rem' }}>
                        <Clock size={16} />
                        {new Date(link.last_checked).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <span className={`badge ${link.status === 'Online' ? 'badge-online' : 'badge-error'}`}>
                        {link.status}
                      </span>
                      <Link href={link.url} target="_blank">
                        <ExternalLink size={18} color="var(--secondary)" style={{ cursor: 'pointer' }} />
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>
    </PayPalScriptProvider>
  );
}

