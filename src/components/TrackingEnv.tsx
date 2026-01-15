import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { generateSystemPrompt, saveGeneratedPrompt } from '../lib/llmService';

const TrackingEnv = () => {
    // Existing competitors state (kept as per request to just 'add' features but maybe integrate later)
    const [competitors, setCompetitors] = useState([
        { name: 'Competitor X', url: 'competitorx.com', status: 'Active' },
        { name: 'Disruptor AI', url: 'disruptor.ai', status: 'Monitoring' },
    ]);

    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [newUrl, setNewUrl] = useState('');

    // --- New Feature State ---
    const [availableItems, setAvailableItems] = useState<any[]>([]);
    const [selectedItemId, setSelectedItemId] = useState<string>('');
    const [isTracingActive, setIsTracingActive] = useState(false);
    const [lastPrompt, setLastPrompt] = useState<string>('');
    const [isGenerating, setIsGenerating] = useState(false);

    // Initial Fetch
    useEffect(() => {
        fetchAvailableItems();
        fetchActiveTrace();
    }, []);

    const fetchAvailableItems = async () => {
        const { data, error } = await supabase.from('items').select('*');
        if (error) {
            console.error("Error fetching items for trace:", error);
            if (error.code === '42P01') {
                // Table missing
            }
        } else if (data) {
            setAvailableItems(data);
        }
    };

    const fetchActiveTrace = async () => {
        // Fetch active config
        const { data: config } = await supabase
            .from('tracing_config')
            .select('*')
            .eq('is_active', true)
            .single();

        if (config) {
            setSelectedItemId(config.item_id);
            setIsTracingActive(true);

            // Fetch latest prompt for this item
            const { data: promptData } = await supabase
                .from('generated_prompts')
                .select('prompt_content')
                .eq('config_id', config.id)
                .order('created_at', { ascending: false })
                .limit(1)
                .single();

            if (promptData) {
                setLastPrompt(promptData.prompt_content);
            }
        }
    };

    // Handle User "Finalize" Action
    const handleFinalizeTrace = async () => {
        if (!selectedItemId) return;
        setIsGenerating(true);

        try {
            // 1. Save Config
            // First disable any other active configs (assuming 1 active trace per user for now)
            await supabase.from('tracing_config').update({ is_active: false }).neq('id', '00000000-0000-0000-0000-000000000000'); // hacky way to update all? No, filtered update.

            // Better: update all to false
            // await supabase.rpc('deactivate_all_tracing'); // If we had an RPC
            // For now, client side disable old ones is risky but ok for demo.
            // Actually, let's just insert a new active one and we assume logic uses the latest active one.

            const { data: configData, error: configError } = await supabase
                .from('tracing_config')
                .insert({ item_id: selectedItemId, is_active: true })
                .select()
                .single();

            if (configError) throw configError;

            // 2. Generate Prompt
            const item = availableItems.find(i => i.id === selectedItemId);
            if (!item) throw new Error("Item not found");

            const prompt = await generateSystemPrompt(item, item.type);

            // 3. Save Prompt
            await saveGeneratedPrompt(item.id, configData.id, prompt, item);

            setLastPrompt(prompt);
            setIsTracingActive(true);
        } catch (error) {
            console.error("Error finalizing trace:", error);
            alert("Failed to configure trace. Check console.");
        } finally {
            setIsGenerating(false);
        }
    };

    // Re-trigger logic: Watch for changes in the selected item if active
    // This is tricky client-side without polling or realtime subscriptions.
    // For this MVP, we will rely on the fact that if they come back to this page, it refreshes.
    // Or we can set up a Realtime subscription.
    useEffect(() => {
        if (!isTracingActive || !selectedItemId) return;

        const channel = supabase
            .channel('item-updates')
            .on(
                'postgres_changes',
                { event: 'UPDATE', schema: 'public', table: 'items', filter: `id=eq.${selectedItemId}` },
                async (payload) => {
                    console.log('Detected change in traced item, regenerating prompt...', payload);
                    // Regenerate
                    // We need the full new record. Payload.new might have it.
                    const newItem = payload.new;
                    // We also need to know the config ID.
                    // For simplicity, let's just re-run the "Generation" part.
                    // In a real app we'd query the config ID.

                    // Fetch config id
                    const { data: config } = await supabase
                        .from('tracing_config')
                        .select('id')
                        .eq('item_id', selectedItemId)
                        .eq('is_active', true)
                        .single();

                    if (config && newItem) {
                        const prompt = await generateSystemPrompt(newItem, newItem.type);
                        await saveGeneratedPrompt(newItem.id, config.id, prompt, newItem);
                        setLastPrompt(prompt); // Update UI if open
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [isTracingActive, selectedItemId]);


    // Existing Handlers
    const handleAdd = () => {
        if (newName && newUrl) {
            setCompetitors([...competitors, { name: newName, url: newUrl, status: 'Monitoring' }]);
            setNewName('');
            setNewUrl('');
            setIsAdding(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Tracing Environment</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Manage the products and entities you are tracking.</p>
                </div>
            </header>

            {/* --- DAILY TRACE CONFIGURATION (NEW) --- */}
            <div style={{
                background: 'linear-gradient(145deg, rgba(24, 24, 27, 0.8), rgba(39, 39, 42, 0.5))',
                border: '1px solid var(--accent-primary)',
                borderRadius: '16px',
                padding: '24px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h2 style={{ marginTop: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '1.5rem' }}>🎯</span> Daily Trace Target
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
                        Select one of your existing trees to generate a daily system prompt for the High-Level LLM.
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1, minWidth: '300px' }}>
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Select Target</label>
                            <select
                                value={selectedItemId}
                                onChange={(e) => setSelectedItemId(e.target.value)}
                                style={{
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border-subtle)',
                                    background: 'rgba(0,0,0,0.3)',
                                    color: 'white',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="">-- Select a Tree --</option>
                                {availableItems.map(item => (
                                    <option key={item.id} value={item.id}>
                                        {item.type}: {item.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleFinalizeTrace}
                            disabled={!selectedItemId || isGenerating}
                            style={{
                                padding: '12px 24px',
                                background: isTracingActive ? '#10b981' : 'var(--accent-primary)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: !selectedItemId || isGenerating ? 'not-allowed' : 'pointer',
                                opacity: !selectedItemId || isGenerating ? 0.7 : 1,
                                minWidth: '150px'
                            }}
                        >
                            {isGenerating ? 'Generating...' : isTracingActive ? 'Update Trace' : 'Finalize & Trace'}
                        </button>
                    </div>

                    {lastPrompt && (
                        <div style={{ marginTop: '24px', background: 'rgba(0,0,0,0.3)', padding: '16px', borderRadius: '8px', border: '1px dashed var(--border-subtle)' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: '#a78bfa' }}>🤖 Generated System Prompt (Latest)</h4>
                            <pre style={{
                                whiteSpace: 'pre-wrap',
                                fontFamily: 'monospace',
                                color: 'var(--text-secondary)',
                                fontSize: '0.85rem',
                                margin: 0,
                                maxHeight: '200px',
                                overflowY: 'auto'
                            }}>
                                {lastPrompt}
                            </pre>
                        </div>
                    )}
                </div>
            </div>


            {/* Existing Competitors List (Legacy / Visual) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.5rem', margin: 0 }}>External Competitors</h3>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    style={{
                        background: 'transparent',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-secondary)',
                        padding: '8px 16px',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}>
                    {isAdding ? 'Cancel' : '+ Add Competitor'}
                </button>
            </div>

            {isAdding && (
                <div style={{ padding: '24px', background: 'var(--bg-glass)', borderRadius: '12px', border: '1px solid var(--accent-glow)' }}>
                    <h3 style={{ marginTop: 0 }}>Add New Competitor</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <input
                            type="text"
                            placeholder="Product Name"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                        />
                        <input
                            type="text"
                            placeholder="Website URL"
                            value={newUrl}
                            onChange={(e) => setNewUrl(e.target.value)}
                            style={{ flex: 1, padding: '12px', borderRadius: '8px', border: '1px solid var(--border-subtle)', background: 'rgba(0,0,0,0.2)', color: 'white' }}
                        />
                        <button
                            onClick={handleAdd}
                            style={{ padding: '0 24px', background: 'var(--accent-secondary)', border: 'none', borderRadius: '8px', color: 'white', cursor: 'pointer' }}>
                            Track
                        </button>
                    </div>
                </div>
            )}

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
