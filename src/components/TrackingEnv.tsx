import React, { useState } from 'react';

const TrackingEnv = () => {
    const [competitors, setCompetitors] = useState([
        { name: 'Competitor X', url: 'competitorx.com', status: 'Active' },
        { name: 'Disruptor AI', url: 'disruptor.ai', status: 'Monitoring' },
    ]);

    const [isAdding, setIsAdding] = useState(false);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Tracing Environment</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Manage the products and entities you are tracking.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    style={{
                        background: 'var(--accent-primary)',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}>
                    + Add Product
                </button>
            </header>

            {isAdding && (
                <div style={{ padding: '24px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--accent-glow)' }}>
                    <h3 style={{ marginTop: 0 }}>Add New Competitor</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input type="text" placeholder="Product Name" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                        <input type="text" placeholder="Website URL" style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)', color: 'white' }} />
                        <button style={{ padding: '0 24px', background: 'var(--accent-secondary)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>Track</button>
                    </div>
                </div>
            )}

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {competitors.map((comp, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '24px',
                        background: 'var(--bg-glass)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '16px'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '48px', height: '48px', background: '#27272a', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {comp.name[0]}
                            </div>
                            <div>
                                <h3 style={{ margin: 0 }}>{comp.name}</h3>
                                <a href={`https://${comp.url}`} style={{ color: 'var(--accent-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}>{comp.url}</a>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <span style={{ color: '#4ade80', background: 'rgba(74, 222, 128, 0.1)', padding: '6px 12px', borderRadius: '99px', fontSize: '0.8rem' }}>{comp.status}</span>
                            <button style={{ background: 'transparent', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Settings</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TrackingEnv;
