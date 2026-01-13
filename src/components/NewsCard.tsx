interface NewsCardProps {
    image?: string;
    source: string;
    time: string;
    headline: string;
    insight: string;
}

const NewsCard = ({ image, source, time, headline, insight }: NewsCardProps) => {
    return (
        <div style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            overflow: 'hidden',
            marginBottom: '24px',
            transition: 'transform 0.2s, background 0.2s',
            cursor: 'pointer'
        }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'var(--bg-glass)';
            }}
        >
            {image && (
                <div style={{
                    height: '240px',
                    width: '100%',
                    background: `url(${image}) center/cover no-repeat`,
                    borderBottom: '1px solid var(--border-subtle)'
                }} />
            )}

            <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {/* Placeholder Logic for Source Icon */}
                    <div style={{ width: '20px', height: '20px', borderRadius: '4px', background: '#3f3f46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                        {source[0]}
                    </div>
                    <span>{source}</span>
                    <span>•</span>
                    <span>{time}</span>
                </div>

                <h2 style={{
                    fontSize: '1.4rem',
                    fontWeight: '700',
                    margin: '0 0 12px 0',
                    lineHeight: '1.4',
                    color: '#fff'
                }}>
                    {headline}
                </h2>

                <p style={{
                    fontSize: '1.1rem',
                    lineHeight: '1.6',
                    color: '#d4d4d8',
                    margin: 0,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {insight}
                </p>

                <div style={{
                    marginTop: '20px',
                    display: 'flex',
                    gap: '16px',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    paddingTop: '16px'
                }}>
                    <ActionButton icon="⊕" label="Save" />
                    <ActionButton icon="↗" label="Share" />
                </div>
            </div>
        </div>
    );
};

const ActionButton = ({ icon, label }: { icon: string, label: string }) => (
    <button style={{
        background: 'transparent',
        border: 'none',
        color: 'var(--text-secondary)',
        fontSize: '0.9rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 12px',
        borderRadius: '8px',
        transition: 'background 0.2s'
    }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
        <span>{icon}</span> {label}
    </button>
);

export default NewsCard;
