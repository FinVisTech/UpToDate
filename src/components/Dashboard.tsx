import React, { useState, useEffect } from 'react';
import EntityCard from './EntityCard';
import AddProductModal from './AddProductModal';
import { supabase } from '../lib/supabase';

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('My Products');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [items, setItems] = useState<any[]>([]);
    const [editingItem, setEditingItem] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch items from Supabase
    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('items')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching items:', error);
        } else {
            setItems(data || []);
        }
        setIsLoading(false);
    };

    const handleSaveItem = async (itemData: any) => {
        // Prepare data for insertion/update

        // If we are editing, we should have an ID.
        // However, the modal passes back the full object.
        // Let's check if we have an ID in editingItem or itemData.

        const targetId = editingItem?.id || itemData.id;

        const payload = {
            type: itemData.type,
            name: itemData.name,
            link: itemData.link,
            description: itemData.description,
            stakeholders: itemData.stakeholders,
            details: itemData.details,
            tree_data: itemData.treeData,
            sub_products: itemData.subProducts
        };

        if (targetId) {
            // Update
            const { error } = await supabase
                .from('items')
                .update(payload)
                .eq('id', targetId);

            if (error) console.error('Error updating item:', error);
        } else {
            // Insert
            const { error } = await supabase
                .from('items')
                .insert([payload]);

            if (error) console.error('Error creating item:', error);
        }

        // Refresh list
        fetchItems();
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const handleEdit = (item: any) => {
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleAddNew = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const renderContent = () => {
        if (isLoading) {
            return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading...</div>;
        }

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

        const filteredItems = items.filter(item => {
            return item.type === itemLabel;
        });

        if (filteredItems.length > 0) {
            return (
                <>
                    <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={handleAddNew} style={{
                            background: 'var(--accent-primary)',
                            color: 'white',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            cursor: 'pointer'
                        }}>
                            + Add {itemLabel}
                        </button>
                    </div>
                    {filteredItems.map((item) => (
                        <EntityCard
                            key={item.id}
                            type={item.type}
                            name={item.name}
                            description={item.description}
                            link={item.link}
                            stakeholders={item.stakeholders}
                            onEdit={() => handleEdit(item)}
                        />
                    ))}
                    <AddProductModal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setEditingItem(null);
                        }}
                        onSave={handleSaveItem}
                        type={itemLabel}
                        initialData={editingItem || undefined}
                    />
                </>
            );
        }

        return (
            <>
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
                            onClick={handleAddNew}
                        >
                            + Add {itemLabel}
                        </button>
                    </div>
                </div>

                <AddProductModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingItem(null);
                    }}
                    onSave={handleSaveItem}
                    type={itemLabel}
                    initialData={editingItem || undefined}
                />
            </>
        );
    };

    return (
        <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            padding: '0 24px'
        }}>
            {/* Header - Minimalist */}
            <header style={{ marginTop: '0px', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem', marginTop: 0 }}>Battles</h1>
                <div style={{ display: 'flex', gap: '80px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px' }}>
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
