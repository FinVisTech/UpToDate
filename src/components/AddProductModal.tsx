
import React, { useState, useEffect } from 'react';

interface AddProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
    type: string;
    initialData?: any;
}

const AddProductModal = ({ isOpen, onClose, onSave, type, initialData }: AddProductModalProps) => {
    const [name, setName] = useState('');
    const [link, setLink] = useState('');
    const [description, setDescription] = useState('');
    const [stakeholders, setStakeholders] = useState('');
    const [positioning, setPositioning] = useState('');
    const [valueProp, setValueProp] = useState('');
    const [vision, setVision] = useState('');
    const [goals, setGoals] = useState('');

    useEffect(() => {
        if (isOpen && initialData) {
            setName(initialData.name || '');
            setLink(initialData.link || '');
            setDescription(initialData.description || '');
            setStakeholders(initialData.stakeholders || '');
            if (initialData.details) {
                setPositioning(initialData.details.positioning || '');
                setValueProp(initialData.details.valueProp || '');
                setVision(initialData.details.vision || '');
                setGoals(initialData.details.goals || '');
            }
        } else if (isOpen && !initialData) {
            resetForm();
        }
    }, [isOpen, initialData]);

    const handleSave = () => {
        const newData = {
            type,
            name,
            link,
            description,
            stakeholders,
            details: {
                positioning,
                valueProp,
                vision,
                goals
            }
        };
        onSave(newData);
        resetForm();
    };

    const resetForm = () => {
        setName('');
        setLink('');
        setDescription('');
        setStakeholders('');
        setPositioning('');
        setValueProp('');
        setVision('');
        setGoals('');
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: '#18181b', // Slightly lighter than pure black for contrast
                border: '1px solid var(--border-subtle)',
                borderRadius: '16px',
                width: '600px',
                maxWidth: '90vw',
                maxHeight: '90vh',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }} onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div style={{
                    padding: '24px',
                    borderBottom: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>
                        {initialData ? `Edit ${type}` : `Add New ${type}`}
                    </h2>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
                </div>

                {/* Scrollable Content */}
                <div className="modal-content-scroll" style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* General Section */}
                    <Section title="General Information">
                        <InputGroup label={`${type} Name`} placeholder={`e.g. Project Apollo`} value={name} onChange={setName} />
                        <InputGroup label="Link" placeholder="https://..." value={link} onChange={setLink} />
                        <TextAreaGroup label="Description" placeholder="What does this product do?" value={description} onChange={setDescription} />
                    </Section>

                    {/* Stakeholders Section */}
                    <Section title="Key Stakeholders">
                        <InputGroup label="Stakeholders" placeholder="e.g. Jane Doe (PM), John Smith (Eng)" value={stakeholders} onChange={setStakeholders} />
                    </Section>

                    {/* Market Landscape Section */}
                    <Section title="Product Market Landscape">
                        <TextAreaGroup
                            label="Current Positioning"
                            placeholder="Where does this product sit in the market today?"
                            value={positioning} onChange={setPositioning}
                        />
                        <TextAreaGroup
                            label="Value vs Competitors"
                            placeholder="What makes this unique compared to current alternatives?"
                            value={valueProp} onChange={setValueProp}
                        />

                        <div style={{ marginTop: '12px', padding: '16px', background: 'rgba(139, 92, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                            <h4 style={{ color: '#a78bfa', margin: '0 0 12px 0', fontSize: '1rem' }}>Long Term Vision</h4>
                            <TextAreaGroup
                                label="Vision Statement"
                                placeholder="Where will this product be in 2-5 years?"
                                value={vision} onChange={setVision}
                            />
                            <TextAreaGroup
                                label="Measurable Goals (APIs)"
                                placeholder="Key metrics and API integrations to track success..."
                                value={goals} onChange={setGoals}
                            />
                        </div>
                    </Section>

                </div>

                {/* Footer */}
                <div style={{
                    padding: '24px',
                    borderTop: '1px solid var(--border-subtle)',
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px'
                }}>
                    <button onClick={onClose} style={{
                        padding: '10px 20px',
                        background: 'transparent',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '8px',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer'
                    }}>Cancel</button>
                    <button onClick={handleSave} style={{
                        padding: '10px 20px',
                        background: 'var(--accent-primary)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}>
                        {initialData ? 'Save Changes' : `Create ${type}`}
                    </button>
                </div>

            </div>
        </div>
    );
};

// Helper Components
const Section = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#fff', borderLeft: '3px solid var(--accent-primary)', paddingLeft: '12px' }}>{title}</h3>
        {children}
    </div>
);

const InputGroup = ({ label, placeholder, value, onChange }: { label: string, placeholder: string, value: string, onChange: (val: string) => void }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{label}</label>
        <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                padding: '12px',
                borderRadius: '8px',
                color: 'white',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
        />
    </div>
);

const TextAreaGroup = ({ label, placeholder, value, onChange }: { label: string, placeholder: string, value: string, onChange: (val: string) => void }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{label}</label>
        <textarea
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
            style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                padding: '12px',
                borderRadius: '8px',
                color: 'white',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box',
                fontFamily: 'inherit',
                resize: 'vertical'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
        />
    </div>
);

export default AddProductModal;
