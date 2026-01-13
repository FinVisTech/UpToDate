import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
    currentView: string;
    onNavigate: (view: string) => void;
}

const Layout = ({ children, currentView, onNavigate }: LayoutProps) => {
    return (
        <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: 'var(--bg-primary)' }}>
            {/* Sidebar */}
            <aside style={{
                width: '260px',
                padding: '24px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRight: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem'
            }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(to right, #8b5cf6, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    UpToDate
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <NavButton active={currentView === 'dashboard'} onClick={() => onNavigate('dashboard')}>Dashboard</NavButton>
                    <NavButton active={currentView === 'tracing'} onClick={() => onNavigate('tracing')}>Tracing Env</NavButton>
                    <NavButton active={currentView === 'settings'} onClick={() => onNavigate('settings')}>Settings</NavButton>
                </nav>
            </aside>

            {/* Main Content */}
            <main style={{ flex: 1, padding: '40px', overflowY: 'auto' }}>
                {children}
            </main>
        </div>
    );
};

const NavButton = ({ children, active = false, onClick }: { children: React.ReactNode; active?: boolean; onClick?: () => void }) => (
    <button onClick={onClick} style={{
        background: active ? 'var(--accent-glow)' : 'transparent',
        border: 'none',
        color: active ? '#fff' : 'var(--text-secondary)',
        padding: '12px 16px',
        borderRadius: '12px',
        textAlign: 'left',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontWeight: active ? '600' : '400'
    }}>
        {children}
    </button>
);

export default Layout;
