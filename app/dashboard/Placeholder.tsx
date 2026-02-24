'use client';

import Link from 'next/link';
import { ShieldCheck, ArrowLeft, Construction } from 'lucide-react';

export default function UnderConstruction({ title }: { title: string }) {
    return (
        <div className="dashboard-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: '#f8fafc' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Construction size={80} color="var(--primary)" />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>{title}</h1>
            <p style={{ color: 'var(--secondary)', maxWidth: '500px', marginBottom: '2rem' }}>
                대표님! 이 구역은 다람쥐들이 아직 열심히 공사 중입니다.
                곧 멋진 기능으로 채워 넣겠습니다! 🐿️🚧
            </p>
            <Link href="/dashboard">
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ArrowLeft size={20} />
                    Back to Dashboard
                </button>
            </Link>
        </div>
    );
}
