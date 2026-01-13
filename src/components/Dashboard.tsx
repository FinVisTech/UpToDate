import React, { useState } from 'react';


const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('My Products');

    const renderContent = () => {
        // Since the user hasn't configured anything, we show the empty state for all tabs
        // In a real app, this would check if data exists for the tab
        let itemLabel = '';
        switch (activeTab) {
            case 'My Products':
                itemLabel = 'Product';
                break;
            case 'My Services':
                itemLabel = 'Service';
                break;
            case 'My Campaigns':
                itemLabel = 'Campaign';
                break;
            case 'My R&D':
                itemLabel = 'R&D Project';
                break;
            default:
                itemLabel = 'Item';
        }

        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '400px',
                border: '1px dashed var(--border-subtle)',
                borderRadius: '16px',
                background: 'rgba(255, 255, 255, 0.02)'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                        You haven't tracked any {activeTab.toLowerCase().replace('my ', '')} yet.
                    </p>
                    <button style={{
                        background: 'var(--accent-primary)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        + Add {itemLabel}
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div style={{
            maxWidth: '680px',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem'
        }}>
            {/* Header - Minimalist */}
            <header style={{ marginTop: '20px', marginBottom: '20px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Battles</h1>
                <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
                    <Tab active={activeTab === 'My Products'} onClick={() => setActiveTab('My Products')}>My Products</Tab>
                    <Tab active={activeTab === 'My Services'} onClick={() => setActiveTab('My Services')}>My Services</Tab>
                    <Tab active={activeTab === 'My Campaigns'} onClick={() => setActiveTab('My Campaigns')}>My Campaigns</Tab>
                    <Tab active={activeTab === 'My R&D'} onClick={() => setActiveTab('My R&D')}>My R&D</Tab>
                </div>
            </header>

            {/* Content Area */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {renderContent()}
            </div>
        </div>
    );
};

const Tab = ({ children, active = false, onClick }: { children: React.ReactNode, active?: boolean, onClick?: () => void }) => (
    <span
        onClick={onClick}
        style={{
            color: active ? '#fff' : 'var(--text-secondary)',
            fontWeight: active ? '600' : '500',
            cursor: 'pointer',
            paddingBottom: active ? '17px' : '0',
            borderBottom: active ? '2px solid var(--accent-primary)' : 'none',
            marginBottom: active ? '-17px' : '0',
            transition: 'color 0.2s'
        }}>
        {children}
    </span>
);

export default Dashboard;
