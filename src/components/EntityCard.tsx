
interface EntityCardProps {
    type: string;
    name: string;
    description: string;
    link?: string;
    stakeholders?: string;
    onEdit?: () => void;
}

const EntityCard = ({ type, name, description, link, stakeholders, onEdit }: EntityCardProps) => {
    return (
        <div style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--accent-glow)',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '20px',
            transition: 'transform 0.2s',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden'
        }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            {/* Accent Line */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                bottom: 0,
                width: '4px',
                background: 'var(--accent-primary)'
            }} />

            <div style={{ marginLeft: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                        <span style={{
                            fontSize: '0.75rem',
                            textTransform: 'uppercase',
                            letterSpacing: '1px',
                            color: 'var(--accent-primary)',
                            fontWeight: '600',
                            marginBottom: '4px',
                            display: 'block'
                        }}>
                            {type}
                        </span>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: 'white' }}>{name}</h3>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {link && (
                            <a href={link} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} onClick={(e) => e.stopPropagation()}>
                                ↗
                            </a>
                        )}
                        <div
                            style={{
                                color: 'var(--text-secondary)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                // Future menu logic
                            }}
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="12" r="2" />
                                <circle cx="19" cy="12" r="2" />
                                <circle cx="5" cy="12" r="2" />
                            </svg>
                        </div>
                    </div>
                </div>

                <p style={{
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                    marginBottom: '16px',
                    fontSize: '1rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                }}>
                    {description}
                </p>

                {stakeholders && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: '#d4d4d8' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Team:</span> {stakeholders}
                    </div>
                )}
            </div>

            {/* Edit Icon */}
            <div
                role="button"
                style={{
                    position: 'absolute',
                    bottom: '24px',
                    right: '24px',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    color: 'var(--text-secondary)',
                    transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.color = 'var(--text-secondary)';
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (onEdit) onEdit();
                }}
            >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
            </div>
        </div>
    );
};

export default EntityCard;
