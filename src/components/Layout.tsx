import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, ChevronDown } from 'lucide-react';

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
                    War Room
                </div>

                <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <NavButton active={currentView === 'dashboard'} onClick={() => onNavigate('dashboard')}>Dashboard</NavButton>
                    <NavButton active={currentView === 'tracing'} onClick={() => onNavigate('tracing')}>Tracing Env</NavButton>
                    <NavButton active={currentView === 'settings'} onClick={() => onNavigate('settings')}>Settings</NavButton>
                </nav>
            </aside>

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                {/* Header with Profile */}
                <header style={{
                    height: '64px',
                    padding: '0 40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: 'rgba(255, 255, 255, 0.01)'
                }}>
                    <UserProfile />
                </header>

                {/* Scrollable Page Content */}
                <main style={{ flex: 1, padding: '24px 40px', overflowY: 'auto' }}>
                    {children}
                </main>
            </div>
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

const UserProfile = () => {
    const { user, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Get user initials or default to 'U'
    const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'U';

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '24px',
                    padding: '6px 12px 6px 6px',
                    cursor: 'pointer',
                    color: 'white',
                    transition: 'all 0.2s ease'
                }}
            >
                {/* Avatar */}
                <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                    color: 'white'
                }}>
                    {initials}
                </div>

                {/* Email (truncated if long) */}
                <span style={{ fontSize: '0.9rem', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.email}
                </span>

                <ChevronDown size={14} style={{ color: 'var(--text-secondary)' }} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '110%',
                    right: 0,
                    width: '200px',
                    background: '#18181b',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
                    padding: '4px',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column'
                }}>
                    <div style={{
                        padding: '12px',
                        borderBottom: '1px solid var(--border-subtle)',
                        marginBottom: '4px',
                        color: 'var(--text-secondary)',
                        fontSize: '0.8rem'
                    }}>
                        Signed in as <br />
                        <span style={{ color: 'white', fontWeight: '500' }}>{user?.email}</span>
                    </div>

                    <button
                        onClick={() => signOut()}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            width: '100%',
                            padding: '10px 12px',
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444', // Red for danger/sign out
                            cursor: 'pointer',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            textAlign: 'left'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                        <LogOut size={16} />
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
};

export default Layout;
