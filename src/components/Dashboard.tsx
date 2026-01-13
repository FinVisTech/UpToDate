

const Dashboard = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Good evening, Founder.</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Here are the latest shift in your market segment.</p>
            </header>

            {/* Stats Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
                <StatCard title="Market Sentiment" value="Bullish" change="+12%" />
                <StatCard title="Competitor Activity" value="High" change="5 New Updates" accent />
                <StatCard title="Disruption Index" value="Med" change="Stable" />
            </div>

            {/* Feed Section */}
            <section>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', marginTop: '2rem' }}>Live Updates</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <UpdateCard
                        source="TechCrunch"
                        time="2h ago"
                        title="Competitor X raises Series B to expand into your segment"
                        summary="Competitor X has announced a $50M raise specifically to target the mid-market segment, directly competing with your Q3 roadmap."
                        tier="Critical"
                    />
                    <UpdateCard
                        source="Product Hunt"
                        time="4h ago"
                        title="New AI tool 'Disruptor' launches w/ similar feature set"
                        summary="A new tool surfaced today offering 80% of your core value prop for free. Early traction is viral."
                        tier="Warning"
                    />
                    <UpdateCard
                        source="Market Analysis"
                        time="12h ago"
                        title="Regulatory changes in EU sector affecting data privacy"
                        summary="New compliance laws might impact your user retention strategy in the DACH region."
                        tier="Info"
                    />
                </div>
            </section>
        </div>
    );
};

const StatCard = ({ title, value, change, accent = false }: { title: string, value: string, change: string, accent?: boolean }) => (
    <div style={{
        background: accent ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.1))' : 'var(--bg-glass)',
        border: '1px solid var(--border-subtle)',
        padding: '24px',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    }}>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{title}</span>
        <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</div>
        <div style={{ color: accent ? '#a78bfa' : '#71717a', fontSize: '0.9rem' }}>{change}</div>
    </div>
);

const UpdateCard = ({ source, time, title, summary, tier }: { source: string, time: string, title: string, summary: string, tier: 'Critical' | 'Warning' | 'Info' }) => {
    const tierColors = {
        Critical: '#ef4444',
        Warning: '#f59e0b',
        Info: '#3b82f6'
    };

    return (
        <div style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-subtle)',
            padding: '24px',
            borderRadius: '16px',
            transition: 'transform 0.2s',
            cursor: 'pointer'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <span style={{
                        background: tierColors[tier] + '20',
                        color: tierColors[tier],
                        padding: '4px 12px',
                        borderRadius: '99px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        border: `1px solid ${tierColors[tier]}40`
                    }}>{tier}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{source}</span>
                </div>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{time}</span>
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>{title}</h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.5' }}>{summary}</p>
        </div>
    );
};

export default Dashboard;
