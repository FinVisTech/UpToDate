import React, { useState } from 'react';

const Login = ({ onLogin }: { onLogin: () => void }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin();
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            width: '100vw',
            background: 'var(--bg-primary)'
        }}>
            <div style={{
                width: '400px',
                padding: '40px',
                background: 'var(--bg-glass)',
                borderRadius: '24px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0, background: 'linear-gradient(to right, #8b5cf6, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>UpToDate</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Sign in to your founder dashboard</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                            placeholder="founder@startup.com"
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                            placeholder="••••••••"
                        />
                    </div>
                    <button type="submit" style={{
                        marginTop: '1rem',
                        padding: '14px',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(to right, #8b5cf6, #3b82f6)',
                        color: 'white',
                        fontWeight: '600',
                        fontSize: '1rem',
                        cursor: 'pointer'
                    }}>
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
